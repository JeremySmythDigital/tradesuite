import { createDirectus, rest, authentication } from '@directus/sdk';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

// Create authenticated client for customer portal
export function createPortalClient(accessToken: string) {
  const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

  return client;
}

// Portal-specific types
export interface PortalJob {
  id: string;
  title: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  address?: string;
  description?: string;
  estimated_hours?: number;
  customer_notes?: string;
  technician?: string;
  technician_notes?: string;
  photos?: string[];
}

export interface PortalInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  description?: string;
  line_items?: {
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  paid_date?: string;
  payment_link?: string;
}

export interface PortalCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
}

// API functions for portal

export async function getPortalJobs(customerId: string): Promise<{ success: boolean; data?: PortalJob[]; error?: string }> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/jobs?filter[customer_id][eq]=${customerId}&sort=-scheduled_date`);
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return { success: false, error: 'Failed to fetch jobs' };
  }
}

export async function getPortalInvoices(customerId: string): Promise<{ success: boolean; data?: PortalInvoice[]; error?: string }> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/invoices?filter[customer_id][eq]=${customerId}&sort=-date_created`);
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return { success: false, error: 'Failed to fetch invoices' };
  }
}

export async function getPortalCustomer(customerId: string): Promise<{ success: boolean; data?: PortalCustomer; error?: string }> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/customers/${customerId}`);
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return { success: false, error: 'Failed to fetch customer' };
  }
}

export async function updatePortalCustomer(customerId: string, updates: Partial<PortalCustomer>): Promise<{ success: boolean; data?: PortalCustomer; error?: string }> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/customers/${customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Failed to update customer:', error);
    return { success: false, error: 'Failed to update customer' };
  }
}

// Booking API functions

export interface BookingRequest {
  service_id: string;
  trade: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  scheduled_date: string;
  scheduled_time: string;
  notes?: string;
  company_id?: string;
}

export async function createBooking(booking: BookingRequest): Promise<{ success: boolean; data?: { job_id: string; confirmation_number: string }; error?: string }> {
  try {
    // First create or find the customer
    const customerResponse = await fetch(`${DIRECTUS_URL}/items/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
        address: booking.customer_address,
        status: 'active',
      }),
    });
    
    const customerData = await customerResponse.json();
    const customerId = customerData.data.id;

    // Then create the job
    const jobResponse = await fetch(`${DIRECTUS_URL}/items/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${booking.service_id} - ${booking.trade}`,
        status: 'scheduled',
        scheduled_date: booking.scheduled_date,
        customer_id: customerId,
        address: booking.customer_address,
        description: booking.notes || '',
        notes: `Time: ${booking.scheduled_time}\nService: ${booking.service_id}`,
      }),
    });
    
    const jobData = await jobResponse.json();
    
    return { 
      success: true, 
      data: { 
        job_id: jobData.data.id,
        confirmation_number: `JOB-${Date.now().toString(36).toUpperCase()}`,
      } 
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}

// Services API for booking widget

export async function getServices(trade?: string): Promise<{ success: boolean; data?: { id: string; name: string; duration: number; price: number | null; description: string; trade: string }[]; error?: string }> {
  try {
    let url = `${DIRECTUS_URL}/items/services?sort=name`;
    if (trade) {
      url += `&filter[trade][eq]=${trade}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return { success: false, error: 'Failed to fetch services' };
  }
}

// Payment processing

export async function processPayment(paymentData: {
  amount: number;
  currency: string;
  invoiceId?: string;
  customerId?: string;
  paymentMethodId: string;
}): Promise<{ success: boolean; data?: { paymentId: string; status: string }; error?: string }> {
  try {
    // In production, this would call Stripe API
    const response = await fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    
    if (data.success) {
      // Mark invoice as paid
      if (paymentData.invoiceId) {
        await fetch(`${DIRECTUS_URL}/items/invoices/${paymentData.invoiceId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'paid', paid_date: new Date().toISOString() }),
        });
      }
      
      return { success: true, data: { paymentId: data.paymentIntentId, status: 'succeeded' } };
    }
    
    return { success: false, error: data.error || 'Payment failed' };
  } catch (error) {
    console.error('Payment error:', error);
    return { success: false, error: 'Payment failed' };
  }
}