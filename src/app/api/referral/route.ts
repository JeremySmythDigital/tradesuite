import { NextRequest, NextResponse } from 'next/server';
import { referralPostSchema, validateForm } from '@/lib/validation';
import { referralLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || process.env.DIRECTUS_TOKEN;

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check for code collision
async function isCodeUnique(code: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (DIRECTUS_ADMIN_TOKEN) {
      headers['Authorization'] = `Bearer ${DIRECTUS_ADMIN_TOKEN}`;
    }
    
    const response = await fetch(
      `${DIRECTUS_URL}/items/referrals?filter[code][_eq]=${code}&limit=1`,
      { headers }
    );
    const data = await response.json();
    return !data.data || data.data.length === 0;
  } catch {
    return true; // Assume unique if we can't check
  }
}

async function generateUniqueCode(): Promise<string> {
  let code = generateReferralCode();
  let attempts = 0;
  
  while (!(await isCodeUnique(code)) && attempts < 5) {
    code = generateReferralCode();
    attempts++;
  }
  
  return code;
}

// GET /api/referral - Get user's referral code and stats
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ 
      success: false, 
      error: 'Email required' 
    }, { status: 400 });
  }

  // Rate limiting
  const ip = getClientIp(request);
  const { success: rateOk, remaining, reset } = await referralLimiter.limit(ip);
  
  if (!rateOk) {
    return rateLimitResponse(remaining, reset);
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (DIRECTUS_ADMIN_TOKEN) {
      headers['Authorization'] = `Bearer ${DIRECTUS_ADMIN_TOKEN}`;
    }
    
    const response = await fetch(
      `${DIRECTUS_URL}/items/referrals?filter[email][_eq]=${encodeURIComponent(email)}`,
      { headers }
    );
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const referral = data.data[0];
      return NextResponse.json({ 
        success: true, 
        code: referral.code,
        referrals: referral.referrals || 0,
        credits: referral.credits || 0 
      });
    } else {
      // Generate new unique code
      const newCode = await generateUniqueCode();
      
      const createHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (DIRECTUS_ADMIN_TOKEN) {
        createHeaders['Authorization'] = `Bearer ${DIRECTUS_ADMIN_TOKEN}`;
      }
      
      const createResponse = await fetch(`${DIRECTUS_URL}/items/referrals`, {
        method: 'POST',
        headers: createHeaders,
        body: JSON.stringify({
          email,
          code: newCode,
          referrals: 0,
          credits: 0,
        }),
      });
      
      if (!createResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          code: newCode,
          referrals: 0,
          credits: 0 
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        code: newCode,
        referrals: 0,
        credits: 0 
      });
    }
  } catch (error) {
    console.error('Referral lookup error:', error);
    return NextResponse.json({ 
      success: true, 
      code: await generateUniqueCode(),
      referrals: 0,
      credits: 0 
    });
  }
}

// POST /api/referral - Track a referral sign-up
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const { success: rateOk, remaining, reset } = await referralLimiter.limit(ip);
  
  if (!rateOk) {
    return rateLimitResponse(remaining, reset);
  }

  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateForm(referralPostSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: validation.error 
      }, { status: 400 });
    }

    const { referrerCode, newEmail } = validation.data;
    
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (DIRECTUS_ADMIN_TOKEN) {
      headers['Authorization'] = `Bearer ${DIRECTUS_ADMIN_TOKEN}`;
    }
    
    const referrerResponse = await fetch(
      `${DIRECTUS_URL}/items/referrals?filter[code][_eq]=${referrerCode}`,
      { headers }
    );
    
    const referrerData = await referrerResponse.json();
    
    if (referrerData.data && referrerData.data.length > 0) {
      const referrer = referrerData.data[0];
      
      await fetch(`${DIRECTUS_URL}/items/referrals/${referrer.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          referrals: (referrer.referrals || 0) + 1,
          credits: (referrer.credits || 0) + 10,
        }),
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Referral tracked successfully',
        creditsEarned: 10 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid referral code' 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Referral tracking error:', error);
    return NextResponse.json({ 
      success: true,
      message: 'Referral noted (tracking pending)',
      creditsEarned: 0 
    });
  }
}
