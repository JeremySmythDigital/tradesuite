import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

// Helper to sync with Directus
async function syncToDirectus(collection: string, data: Record<string, unknown>) {
  try {
    const response = await fetch(`${directusUrl}/items/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error('Directus sync failed:', error);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.error('Directus sync error:', err);
    return null;
  }
}

async function updateDirectus(collection: string, id: string, data: Record<string, unknown>) {
  try {
    await fetch(`${directusUrl}/items/${collection}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('Directus update error:', err);
  }
}

// Helper to send confirmation email (integrate with SendGrid/Postmark in production)
async function sendConfirmationEmail(email: string, plan: string, amountCents: number) {
  console.log(`[EMAIL] Sending confirmation to ${email} for ${plan} plan ($${amountCents / 100})`);
  // In production: await sendgrid.send({ to: email, template: 'payment-confirmation', ... })
  return true;
}

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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout completed:', session.id);
      
      const plan = session.metadata?.plan || 'solo';
      const email = session.customer_email || session.metadata?.userId || 'unknown';
      const referrerCode = session.metadata?.referrer || null;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const amountPaid = session.amount_total || 0;
      
      // Create subscription record in Directus
      await syncToDirectus('subscriptions', {
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_session_id: session.id,
        email,
        plan,
        status: 'active',
        amount_paid: amountPaid,
        created_at: new Date().toISOString(),
      });
      
      // Track referral if present
      if (referrerCode) {
        try {
          const refResponse = await fetch(`${directusUrl}/items/referrals?filter[code][_eq]=${referrerCode}`);
          const refData = await refResponse.json();
          
          if (refData.data && refData.data.length > 0) {
            const referrer = refData.data[0];
            await updateDirectus('referrals', referrer.id, {
              referrals: (referrer.referrals || 0) + 1,
              credits: (referrer.credits || 0) + 10,
            });
            console.log(`Referral tracked: ${referrerCode} -> ${email}`);
          }
        } catch (refErr) {
          console.error('Referral tracking failed:', refErr);
        }
      }
      
      // Send confirmation email
      await sendConfirmationEmail(email, plan, amountPaid);
      
      console.log(`[PAYMENT CONFIRMED] ${plan} plan for ${email} - Customer: ${customerId} - Subscription: ${subscriptionId}`);
      break;
    }
    
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription created:', subscription.id);
      
      await syncToDirectus('subscription_events', {
        stripe_subscription_id: subscription.id,
        event_type: 'created',
        status: subscription.status,
        created_at: new Date().toISOString(),
      });
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);
      
      await syncToDirectus('subscription_events', {
        stripe_subscription_id: subscription.id,
        event_type: 'updated',
        status: subscription.status,
        created_at: new Date().toISOString(),
      });
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription deleted:', subscription.id);
      
      await syncToDirectus('subscription_events', {
        stripe_subscription_id: subscription.id,
        event_type: 'deleted',
        status: 'canceled',
        created_at: new Date().toISOString(),
      });
      break;
    }
    
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', invoice.id, 'Amount:', invoice.amount_paid);
      
      if (invoice.customer_email) {
        await sendConfirmationEmail(invoice.customer_email, 'recurring', invoice.amount_paid);
      }
      
      await syncToDirectus('invoices', {
        stripe_invoice_id: invoice.id,
        stripe_customer_id: invoice.customer as string,
        amount_paid: invoice.amount_paid,
        currency: invoice.currency,
        status: 'paid',
        paid_at: new Date().toISOString(),
      });
      break;
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed for invoice:', invoice.id);
      
      await syncToDirectus('invoice_failures', {
        stripe_invoice_id: invoice.id,
        stripe_customer_id: invoice.customer as string,
        amount_attempted: invoice.amount_due,
        attempt_count: invoice.attempt_count,
        failed_at: new Date().toISOString(),
      });
      break;
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment intent succeeded:', paymentIntent.id);
      
      await syncToDirectus('payments', {
        stripe_payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        created_at: new Date().toISOString(),
      });
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}