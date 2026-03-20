import { NextRequest, NextResponse } from 'next/server';
import { quickbooksService } from '@/lib/quickbooks-oauth';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const realmId = searchParams.get('realmId');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  // Handle OAuth denial
  if (error) {
    const errorDesc = searchParams.get('error_description') || 'Authorization denied';
    return NextResponse.redirect(
      new URL(`/settings/integrations?error=${encodeURIComponent(errorDesc)}`, request.url)
    );
  }
  
  // Validate required parameters
  if (!code || !realmId || !state) {
    return NextResponse.redirect(
      new URL('/settings/integrations?error=missing_params', request.url)
    );
  }
  
  try {
    // Exchange code for tokens
    const result = await quickbooksService.exchangeCode(code, realmId);
    
    if (!result.success || !result.tokens) {
      return NextResponse.redirect(
        new URL(`/settings/integrations?error=${encodeURIComponent(result.error || 'Token exchange failed')}`, request.url)
      );
    }
    
    // Parse state to get user ID
    let userId = 'unknown';
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
      userId = stateData.userId || 'unknown';
    } catch {
      // State might not be JSON
    }
    
    // Store tokens in Directus
    await fetch(`${directusUrl}/items/quickbooks_connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        realm_id: realmId,
        access_token: result.tokens.access_token,
        refresh_token: result.tokens.refresh_token,
        expires_at: new Date(Date.now() + result.tokens.expires_in * 1000).toISOString(),
        created_at: new Date().toISOString(),
      }),
    });
    
    // Get company info
    const companyInfo = await quickbooksService.getCompanyInfo(result.tokens.access_token, realmId);
    
    // Redirect back to settings with success
    const successUrl = new URL('/settings/integrations', request.url);
    successUrl.searchParams.set('success', 'quickbooks');
    if (companyInfo) {
      successUrl.searchParams.set('company', companyInfo.CompanyName);
    }
    
    return NextResponse.redirect(successUrl);
  } catch (err) {
    console.error('QuickBooks OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/settings/integrations?error=oauth_failed', request.url)
    );
  }
}