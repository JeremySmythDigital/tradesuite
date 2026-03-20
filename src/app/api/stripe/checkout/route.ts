import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { checkoutSchema, validateForm } from '@/lib/validation';
import { checkoutLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

// TradeSuite Price IDs (TEST MODE - created 2026-03-19)
const PRICES: Record<string, string> = {
  solo: 'price_1TCtyV9suOxAfgqhVyhtKDEH',      // $29/mo
  team: 'price_1TCtyW9suOxAfgqhOpgVccU5',       // $79/mo
  business: 'price_1TCtyW9suOxAfgqhbi83ccUc',   // $149/mo
};

function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-02-25.clover',
  });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const { success: rateOk, remaining, reset } = await checkoutLimiter.limit(ip);
  
  if (!rateOk) {
    return rateLimitResponse(remaining, reset);
  }

  const stripe = getStripe();

  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validation = validateForm(checkoutSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: validation.error 
      }, { status: 400 });
    }

    const { plan, email, userId, referrer } = validation.data;
    const priceId = PRICES[plan];

    if (!priceId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Plan price not found' 
      }, { status: 400 });
    }

    // Check for existing customer to avoid duplicates
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    let customerId: string | undefined;
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://tradesuite.vercel.app'}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://tradesuite.vercel.app'}/signup?plan=${plan}`,
      customer_email: customerId ? undefined : email,
      customer: customerId,
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

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: session.url, 
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create checkout session' 
    }, { status: 500 });
  }
}
