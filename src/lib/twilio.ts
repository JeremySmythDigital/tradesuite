import { z } from 'zod';

// Twilio SMS configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

interface SendMessageParams {
  to: string;
  body: string;
  media?: string[];
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// SMS templates for common trade business scenarios
export const SMS_TEMPLATES = {
  appointmentReminder: (data: { clientName: string; date: string; time: string; address: string }) =>
    `Hi ${data.clientName}, this is a reminder about your appointment on ${data.date} at ${data.time} at ${data.address}. Reply CONFIRM to confirm or call us to reschedule.`,
  
  appointmentConfirmed: (data: { clientName: string; date: string; time: string }) =>
    `Thanks ${data.clientName}! Your appointment is confirmed for ${data.date} at ${data.time}. We'll see you then!`,
  
  estimateReady: (data: { clientName: string; estimateNumber: string; amount: string }) =>
    `Hi ${data.clientName}, your estimate #${data.estimateNumber} for $${data.amount} is ready. View it here: ${process.env.NEXT_PUBLIC_URL}/portal/estimates`,
  
  invoiceSent: (data: { clientName: string; invoiceNumber: string; amount: string; dueDate: string }) =>
    `Hi ${data.clientName}, invoice #${data.invoiceNumber} for $${data.amount} is ready. Due: ${data.dueDate}. Pay online: ${process.env.NEXT_PUBLIC_URL}/portal/invoices`,
  
  paymentReceived: (data: { clientName: string; amount: string; invoiceNumber: string }) =>
    `Thanks ${data.clientName}! We received your payment of $${data.amount} for invoice #${data.invoiceNumber}. Receipt attached.`,
  
  jobStarted: (data: { clientName: string; jobType: string; technician: string }) =>
    `Hi ${data.clientName}, ${data.technician} has started your ${data.jobType} job. Track progress: ${process.env.NEXT_PUBLIC_URL}/portal/jobs`,
  
  jobCompleted: (data: { clientName: string; jobType: string }) =>
    `Great news ${data.clientName}! Your ${data.jobType} job is complete. Please review: ${process.env.NEXT_PUBLIC_URL}/portal/review`,
  
  technicianEnRoute: (data: { clientName: string; technician: string; eta: string }) =>
    `Hi ${data.clientName}, ${data.technician} is on the way! ETA: ${data.eta}. Track live: ${process.env.NEXT_PUBLIC_URL}/track`,
  
  followUp: (data: { clientName: string; issue: string }) =>
    `Hi ${data.clientName}, following up about your ${data.issue}. Is everything working well? Let us know if you need anything.`,
  
  reviewRequest: (data: { clientName: string; company: string }) =>
    `Hi ${data.clientName}, thanks for choosing ${data.company}! Could you leave us a quick review? It really helps: ${process.env.NEXT_PUBLIC_URL}/review`,
} as const;

// Validation schema for phone numbers
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export class TwilioService {
  private accountSid: string | undefined;
  private authToken: string | undefined;
  private phoneNumber: string | undefined;
  private baseUrl: string;
  
  constructor() {
    this.accountSid = TWILIO_ACCOUNT_SID;
    this.authToken = TWILIO_AUTH_TOKEN;
    this.phoneNumber = TWILIO_PHONE_NUMBER;
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;
  }
  
  isConfigured(): boolean {
    return !!(this.accountSid && this.authToken && this.phoneNumber);
  }
  
  async sendMessage({ to, body, media }: SendMessageParams): Promise<SMSResponse> {
    if (!this.isConfigured()) {
      console.warn('Twilio not configured - message not sent');
      return { success: false, error: 'Twilio not configured' };
    }
    
    try {
      // Validate phone number
      phoneSchema.parse(to);
      
      // Format phone number (ensure E.164 format)
      const formattedTo = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`;
      
      const params = new URLSearchParams({
        From: this.phoneNumber!,
        To: formattedTo,
        Body: body,
      });
      
      // Add media URLs if provided
      if (media && media.length > 0) {
        media.forEach((url, i) => params.append(`MediaUrl${i + 1}`, url));
      }
      
      const response = await fetch(`${this.baseUrl}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Twilio error:', data);
        return { success: false, error: data.message || 'Failed to send SMS' };
      }
      
      return { success: true, messageId: data.sid };
    } catch (error) {
      console.error('SMS send error:', error);
      return { 
        success: false, 
        error: error instanceof z.ZodError 
          ? error.issues[0].message 
          : 'Failed to send SMS' 
      };
    }
  }
  
  // Send using a template
  async sendTemplate(
    template: keyof typeof SMS_TEMPLATES,
    data: Record<string, string>,
    to: string
  ): Promise<SMSResponse> {
    const body = SMS_TEMPLATES[template](data as Parameters<typeof SMS_TEMPLATES[typeof template]>[0]);
    return this.sendMessage({ to, body });
  }
  
  // Verify a phone number (check if it's valid/mobile)
  async verifyPhoneNumber(phone: string): Promise<{ valid: boolean; type?: string }> {
    if (!this.isConfigured()) {
      return { valid: false };
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/AvailablePhoneNumbers/US/Mobile.json?Contains=${phone}`, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
        },
      });
      
      const data = await response.json();
      return { valid: !!data.available_phone_numbers?.length, type: 'mobile' };
    } catch {
      return { valid: false };
    }
  }
}

// Singleton instance
export const twilioService = new TwilioService();