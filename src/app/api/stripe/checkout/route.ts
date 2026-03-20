import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// TradeSuite Price IDs (created 2026-03-18)
const PRICES: Record<string, string> = {
  solo: 'price_1TCPJ79suOxAfgqhD8y7XaDt',      // $29/mo
  team: 'price_1TCPJ89suOxAfgqhMSKDKTmX',       // $79/mo
  business: 'price_1TCPJ89suOxAfgqhP5M4IFcp',   // $149/mo
};

function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-02-25.clover',
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();

  try {
    const body = await request.json();
    const { plan, email, userId, referrer } = body;

    if (!plan || !['solo', 'team', 'business'].includes(plan)) {
      return NextResponse.json({ success: false, error: 'Invalid plan selected' }, { status: 400 });
    }

    const priceId = PRICES[plan];
    if (!priceId) {
      return NextResponse.json({ success: false, error: 'Plan price not found' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://tradesuite.vercel.app'}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://tradesuite.vercel.app'}/signup?plan=${plan}`,
      customer_email: email,
      metadata: { 
        userId: userId || 'unknown', 
        plan, 
        source: 'tradesuite',
        ...(referrer && { referrer }),
      },
      subscription_data: { 
        metadata: { 
          userId: userId || 'unknown', 
          plan, 
          source: 'tradesuite',
          ...(referrer && { referrer }),
        } 
      },
    });

    return NextResponse.json({ success: true, checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create checkout session' }, { status: 500 });
  }
}