/**
 * GoHighLevel API Client
 * Handles all GHL API interactions for Cypress Signal
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';

interface GHLConfig {
  apiKey: string;
  locationId: string;
}

interface Contact {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

interface Opportunity {
  id?: string;
  contactId: string;
  pipelineId: string;
  pipelineStageId: string;
  name: string;
  monetaryValue?: number;
  status?: string;
}

interface EstimateLineItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Estimate {
  id?: string;
  locationId: string;
  contactId: string;
  title: string;
  lineItems: EstimateLineItem[];
  status?: string;
}

interface Invoice {
  id?: string;
  locationId: string;
  contactId: string;
  title: string;
  lineItems: EstimateLineItem[];
  total: number;
  status?: string;
}

interface CalendarEvent {
  id?: string;
  locationId: string;
  contactId?: string;
  title: string;
  start: string;
  end: string;
  assignedUserId?: string;
}

class GHLClient {
  private apiKey: string;
  private locationId: string;

  constructor(config: GHLConfig) {
    this.apiKey = config.apiKey;
    this.locationId = config.locationId;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${GHL_BASE}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`GHL API Error: ${JSON.stringify(error)}`);
    }
    
    return response;
  }

  // ============ CONTACTS ============
  
  async createContact(data: Contact): Promise<Contact> {
    const response = await this.request(`/contacts/`, {
      method: 'POST',
      body: JSON.stringify({ ...data, locationId: this.locationId }),
    });
    const result = await response.json();
    return result.contact;
  }

  async updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
    const response = await this.request(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.contact;
  }

  async getContact(id: string): Promise<Contact> {
    const response = await this.request(`/contacts/${id}`);
    const result = await response.json();
    return result.contact;
  }

  async searchContacts(query: string): Promise<Contact[]> {
    const response = await this.request(`/contacts/?locationId=${this.locationId}&query=${encodeURIComponent(query)}`);
    const result = await response.json();
    return result.contacts || [];
  }

  // ============ OPPORTUNITIES ============
  
  async createOpportunity(data: Opportunity): Promise<Opportunity> {
    const response = await this.request(`/opportunities/`, {
      method: 'POST',
      body: JSON.stringify({ ...data, locationId: this.locationId }),
    });
    const result = await response.json();
    return result.opportunity;
  }

  async updateOpportunityStatus(id: string, pipelineStageId: string): Promise<Opportunity> {
    const response = await this.request(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ pipelineStageId }),
    });
    const result = await response.json();
    return result.opportunity;
  }

  // ============ ESTIMATES ============
  
  async createEstimate(data: Estimate): Promise<Estimate> {
    const response = await this.request(`/estimates/`, {
      method: 'POST',
      body: JSON.stringify({ ...data, locationId: this.locationId }),
    });
    const result = await response.json();
    return result.estimate;
  }

  async sendEstimate(id: string): Promise<void> {
    await this.request(`/estimates/${id}/send`, {
      method: 'POST',
      body: JSON.stringify({ locationId: this.locationId }),
    });
  }

  async convertEstimateToInvoice(id: string): Promise<Invoice> {
    const response = await this.request(`/estimates/${id}/invoice`, {
      method: 'POST',
      body: JSON.stringify({ locationId: this.locationId }),
    });
    const result = await response.json();
    return result.invoice;
  }

  // ============ INVOICES ============
  
  async createInvoice(data: Invoice): Promise<Invoice> {
    const response = await this.request(`/invoices/`, {
      method: 'POST',
      body: JSON.stringify({ ...data, locationId: this.locationId }),
    });
    const result = await response.json();
    return result.invoice;
  }

  async sendInvoice(id: string): Promise<void> {
    await this.request(`/invoices/${id}/send`, {
      method: 'POST',
      body: JSON.stringify({ locationId: this.locationId }),
    });
  }

  async recordPayment(id: string, amount: number, method: string): Promise<void> {
    await this.request(`/invoices/${id}/payment`, {
      method: 'POST',
      body: JSON.stringify({ 
        locationId: this.locationId,
        amount,
        paymentMethod: method,
      }),
    });
  }

  // ============ CALENDAR ============
  
  async createEvent(data: CalendarEvent): Promise<CalendarEvent> {
    const response = await this.request(`/calendars/events/appointments/`, {
      method: 'POST',
      body: JSON.stringify({ ...data, locationId: this.locationId }),
    });
    const result = await response.json();
    return result.event;
  }

  async getEvents(locationId?: string): Promise<CalendarEvent[]> {
    const lid = locationId || this.locationId;
    const response = await this.request(`/calendars/events/?locationId=${lid}`);
    const result = await response.json();
    return result.events || [];
  }

  // ============ WEBHOOKS ============
  
  static verifyWebhook(signature: string, body: string, secret: string): boolean {
    // HMAC verification for webhook authenticity
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return signature === expectedSignature;
  }
}

// Singleton instance
let ghlClient: GHLClient | null = null;

export function getGHLClient(): GHLClient {
  if (!ghlClient) {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    
    if (!apiKey || !locationId) {
      throw new Error('GHL_API_KEY and GHL_LOCATION_ID must be set');
    }
    
    ghlClient = new GHLClient({ apiKey, locationId });
  }
  return ghlClient;
}

export { GHLClient, type Contact, type Opportunity, type Estimate, type Invoice, type CalendarEvent, type EstimateLineItem };
export default GHLClient;
