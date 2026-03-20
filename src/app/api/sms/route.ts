import { NextRequest, NextResponse } from 'next/server';

// Twilio integration for SMS notifications
// Environment variables needed:
// TWILIO_ACCOUNT_SID=your_account_sid
// TWILIO_AUTH_TOKEN=your_auth_token
// TWILIO_PHONE_NUMBER=your_twilio_number

interface SMSRequest {
  to: string;
  message: string;
  jobId?: string;
  type: 'reminder' | 'confirmation' | 'follow_up' | 'custom';
}

export async function POST(request: NextRequest) {
  try {
    const body: SMSRequest = await request.json();
    
    const { to, message, type } = body;
    
    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to.replace(/[\s\-\(\)]/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // In production, use actual Twilio SDK
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      // Development mode - return success without sending
      console.log('[DEV] SMS would be sent:', { to, message, type });
      return NextResponse.json({
        success: true,
        messageId: `dev_${Date.now()}`,
        message: 'SMS queued (development mode)',
      });
    }

    // Real Twilio call
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', TWILIO_PHONE_NUMBER);
    formData.append('Body', message);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        messageId: data.sid,
        status: data.status,
      });
    } else {
      return NextResponse.json(
        { error: data.message || 'Failed to send SMS' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('SMS error:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}

// Get SMS templates for different notification types
export async function GET() {
  const templates = [
    {
      id: 'job_reminder',
      name: 'Job Reminder (24h)',
      template: 'Hi {customer_name}, this is a reminder that {company_name} will be at {address} tomorrow between {time}. Reply YES to confirm or call {phone} to reschedule.',
    },
    {
      id: 'job_confirmation',
      name: 'Job Confirmation',
      template: 'Hi {customer_name}, your appointment with {company_name} is confirmed for {date} at {time}. Address: {address}. Questions? Call {phone}',
    },
    {
      id: 'job_complete',
      name: 'Job Complete',
      template: 'Thanks for choosing {company_name}! Your job is complete. Invoice #{invoice_number} for ${amount} has been sent to your email. Rate us: {review_link}',
    },
    {
      id: 'follow_up',
      name: 'Follow Up (7 days)',
      template: 'Hi {customer_name}, just checking in on your recent service. Everything working as expected? Need anything else? Call {phone}',
    },
    {
      id: 'estimate_ready',
      name: 'Estimate Ready',
      template: 'Hi {customer_name}, your estimate for {service} is ready! View it here: {estimate_link} or call {phone}',
    },
  ];

  return NextResponse.json({ templates });
}