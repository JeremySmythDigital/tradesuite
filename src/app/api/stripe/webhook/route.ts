import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// TradeSuite Price IDs
const PRICES: Record<string, string> = {
  solo: 'price_1TCPJ79suOxAfgqhD8y7XaDt',
  team: 'price_1TCPJ89suOxAfgqhMSKDKTmX',
  business: 'price_1TCPJ89suOxAfgqhP5M4IFcp',
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout completed:', session.id);
      
      // Extract metadata
      const plan = session.metadata?.plan || 'solo';
      const email = session.customer_email || session.metadata?.userId || 'unknown';
      const referrerCode = session.metadata?.referrer || null;
      
      // Track referral if present
      if (referrerCode) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app'}/items/referrals?filter[code][_eq]=${referrerCode}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
          .then(res => res.json())
          .then(async (data) => {
            if (data.data && data.data.length > 0) {
              const referrer = data.data[0];
              // Increment referral count
              await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app'}/items/referrals/${referrer.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  referrals: (referrer.referrals || 0) + 1,
                  credits: (referrer.credits || 0) + 10, // $10 credit per referral
                }),
              });
              console.log(`Referral tracked: ${referrerCode} -> ${email}`);
            }
          });
        } catch (refErr) {
          console.error('Referral tracking failed:', refErr);
          // Don't fail the checkout for referral errors
        }
      }
      
      // TODO: Create Directus subscription record
      // For now, log the successful payment
      console.log(`New subscription: ${plan} plan for ${email}`);
      console.log(`Customer: ${session.customer}`);
      console.log(`Subscription: ${session.subscription}`);
      
      break;
    }
    
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription created:', subscription.id);
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription deleted:', subscription.id);
      break;
    }
    
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', invoice.id, 'Amount:', invoice.amount_paid);
      break;
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed for invoice:', invoice.id);
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}