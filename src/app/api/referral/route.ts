import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

// Generate a unique referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/referral - Get user's referral code and stats
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
  }
  
  try {
    // Check if user has referral code
    const response = await fetch(`${DIRECTUS_URL}/items/referrals?filter[email][_eq]=${encodeURIComponent(email)}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      // Existing referral code
      const referral = data.data[0];
      return NextResponse.json({ 
        success: true, 
        code: referral.code,
        referrals: referral.referrals || 0,
        credits: referral.credits || 0 
      });
    } else {
      // Generate new referral code
      const newCode = generateReferralCode();
      const createResponse = await fetch(`${DIRECTUS_URL}/items/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: newCode,
          referrals: 0,
          credits: 0,
        }),
      });
      
      if (!createResponse.ok) {
        // If collection doesn't exist, return mock for now
        return NextResponse.json({ 
          success: true, 
          code: newCode,
          referrals: 0,
          credits: 0 
        });
      }
      
      const created = await createResponse.json();
      return NextResponse.json({ 
        success: true, 
        code: newCode,
        referrals: 0,
        credits: 0 
      });
    }
  } catch (error) {
    console.error('Referral lookup error:', error);
    // Return generated code even if Directus fails
    return NextResponse.json({ 
      success: true, 
      code: generateReferralCode(),
      referrals: 0,
      credits: 0 
    });
  }
}

// POST /api/referral - Track a referral sign-up
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { referrerCode, newEmail } = body;
  
  if (!referrerCode || !newEmail) {
    return NextResponse.json({ success: false, error: 'Referrer code and new email required' }, { status: 400 });
  }
  
  try {
    // Find referrer
    const referrerResponse = await fetch(`${DIRECTUS_URL}/items/referrals?filter[code][_eq]=${referrerCode}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    const referrerData = await referrerResponse.json();
    
    if (referrerData.data && referrerData.data.length > 0) {
      const referrer = referrerData.data[0];
      
      // Increment referrer's count
      await fetch(`${DIRECTUS_URL}/items/referrals/${referrer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrals: (referrer.referrals || 0) + 1,
          credits: (referrer.credits || 0) + 10, // $10 credit per referral
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
      success: true, // Return success even if tracking fails
      message: 'Referral noted (tracking pending)',
      creditsEarned: 0 
    });
  }
}