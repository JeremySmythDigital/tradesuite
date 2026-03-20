/**
 * GoHighLevel Webhook Handler
 * Receives and processes webhooks from GHL
 */

import { NextRequest, NextResponse } from 'next/server';
import { GHLClient } from '@/lib/ghl-client';

// Webhook event types from GHL
type WebhookEvent = 
  | 'contact.created'
  | 'contact.updated'
  | 'opportunity.status_changed'
  | 'estimate.created'
  | 'estimate.sent'
  | 'estimate.accepted'
  | 'invoice.created'
  | 'invoice.sent'
  | 'invoice.paid'
  | 'invoice.overdue'
  | 'appointment.created'
  | 'appointment.updated';

interface WebhookPayload {
  type: WebhookEvent;
  locationId: string;
  data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get('x-ghl-signature') || '';
    const body = await request.text();
    
    const secret = process.env.GHL_WEBHOOK_SECRET;
    if (secret && !GHLClient.verifyWebhook(signature, body, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Parse payload
    const payload: WebhookPayload = JSON.parse(body);
    const { type, locationId, data } = payload;
    
    // Route to appropriate handler
    switch (type) {
      case 'contact.created':
        await handleContactCreated(locationId, data);
        break;
        
      case 'opportunity.status_changed':
        await handleOpportunityStatusChanged(locationId, data);
        break;
        
      case 'invoice.paid':
        await handleInvoicePaid(locationId, data);
        break;
        
      case 'estimate.accepted':
        await handleEstimateAccepted(locationId, data);
        break;
        
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }
    
    return NextResponse.json({ success: true, type });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// ============ HANDLERS ============

async function handleContactCreated(locationId: string, data: Record<string, unknown>) {
  // Create client in our database
  console.log('Contact created:', { locationId, contactId: data.id });
  
  // TODO: Sync to Directus/Supabase
  // await Client.create({
  //   ghlId: data.id,
  //   firstName: data.firstName,
  //   lastName: data.lastName,
  //   email: data.email,
  //   phone: data.phone,
  //   locationId,
  // });
}

async function handleOpportunityStatusChanged(locationId: string, data: Record<string, unknown>) {
  // Update job status in our database
  console.log('Opportunity status changed:', { 
    locationId, 
    opportunityId: data.id,
    newStage: data.pipelineStageId 
  });
  
  // TODO: Update job status
  // await Job.update({ ghlId: data.id }, { 
  //   status: mapStageToStatus(data.pipelineStageId) 
  // });
}

async function handleInvoicePaid(locationId: string, data: Record<string, unknown>) {
  // Mark invoice paid, calculate profit
  console.log('Invoice paid:', { locationId, invoiceId: data.id });
  
  // TODO: Update invoice status
  // await Invoice.update({ ghlId: data.id }, { 
  //   status: 'paid',
  //   paidAt: new Date(),
  // });
}

async function handleEstimateAccepted(locationId: string, data: Record<string, unknown>) {
  // Convert estimate to invoice via GHL
  console.log('Estimate accepted:', { locationId, estimateId: data.id });
  
  // TODO: Convert to invoice
  // const ghl = getGHLClient();
  // const invoice = await ghl.convertEstimateToInvoice(data.id);
  // await ghl.sendInvoice(invoice.id);
}
