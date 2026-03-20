// Email templates for invoices, estimates, and notifications
// Integrate with SendGrid, Postmark, or similar service

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  amount: string;
  currency: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: string;
    amount: string;
  }>;
  notes?: string;
  link: string;
}

export interface EstimateData {
  estimateNumber: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  amount: string;
  currency: string;
  validUntil: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: string;
    amount: string;
  }>;
  notes?: string;
  link: string;
}

export interface PaymentConfirmationData {
  clientName: string;
  clientEmail: string;
  companyName: string;
  amount: string;
  currency: string;
  invoiceNumber: string;
  paymentDate: string;
  paymentMethod: string;
  receiptNumber: string;
}

export interface AppointmentReminderData {
  clientName: string;
  clientEmail: string;
  companyName: string;
  jobType: string;
  date: string;
  time: string;
  address: string;
  technician?: string;
  notes?: string;
}

// Base styles for email templates
const baseStyles = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .table th { background: #f3f4f6; font-weight: 600; }
    .total { font-size: 1.25em; font-weight: bold; color: #2563eb; }
    .footer { text-align: center; color: #6b7280; font-size: 0.875em; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .note { background: #fef3c7; padding: 12px; border-radius: 6px; margin: 15px 0; }
  </style>
`;

// Invoice email template
export function invoiceTemplate(data: InvoiceData): EmailTemplate {
  const itemsList = data.items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.rate}</td>
      <td>${item.amount}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="header">
        <h1>Invoice #${data.invoiceNumber}</h1>
        <p>From ${data.companyName}</p>
      </div>
      <div class="content">
        <p>Hi ${data.clientName},</p>
        <p>Please find your invoice below. Payment is due by ${data.dueDate}.</p>
        
        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        
        <p class="total">Total: ${data.currency}${data.amount}</p>
        
        ${data.notes ? `<div class="note">Note: ${data.notes}</div>` : ''}
        
        <a href="${data.link}" class="button">View & Pay Invoice</a>
        
        <p>You can also view this invoice online at any time by clicking the button above.</p>
      </div>
      <div class="footer">
        <p>${data.companyName}</p>
        <p>This email was sent to ${data.clientEmail}</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Invoice #${data.invoiceNumber}
From ${data.companyName}

Hi ${data.clientName},

Please find your invoice below. Payment is due by ${data.dueDate}.

${data.items.map(i => `${i.description}: ${i.quantity} x ${i.rate} = ${i.amount}`).join('\n')}

Total: ${data.currency}${data.amount}

${data.notes ? `Note: ${data.notes}` : ''}

View & Pay Invoice: ${data.link}

${data.companyName}
`;

  return {
    subject: `Invoice #${data.invoiceNumber} from ${data.companyName}`,
    html,
    text
  };
}

// Estimate email template
export function estimateTemplate(data: EstimateData): EmailTemplate {
  const itemsList = data.items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.rate}</td>
      <td>${item.amount}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="header" style="background: #059669;">
        <h1>Estimate #${data.estimateNumber}</h1>
        <p>From ${data.companyName}</p>
      </div>
      <div class="content">
        <p>Hi ${data.clientName},</p>
        <p>Here's your estimate for the work we discussed. This estimate is valid until ${data.validUntil}.</p>
        
        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        
        <p class="total">Total: ${data.currency}${data.amount}</p>
        
        ${data.notes ? `<div class="note">Note: ${data.notes}</div>` : ''}
        
        <a href="${data.link}" class="button" style="background: #059669;">View & Approve Estimate</a>
        
        <p>Approve this estimate to get started. Questions? Reply to this email.</p>
      </div>
      <div class="footer">
        <p>${data.companyName}</p>
        <p>This email was sent to ${data.clientEmail}</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Estimate #${data.estimateNumber}
From ${data.companyName}

Hi ${data.clientName},

Here's your estimate for the work we discussed. This estimate is valid until ${data.validUntil}.

${data.items.map(i => `${i.description}: ${i.quantity} x ${i.rate} = ${i.amount}`).join('\n')}

Total: ${data.currency}${data.amount}

${data.notes ? `Note: ${data.notes}` : ''}

View & Approve Estimate: ${data.link}

Questions? Reply to this email.

${data.companyName}
`;

  return {
    subject: `Estimate #${data.estimateNumber} from ${data.companyName}`,
    html,
    text
  };
}

// Payment confirmation template
export function paymentConfirmationTemplate(data: PaymentConfirmationData): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="header" style="background: #059669;">
        <h1>Payment Received</h1>
        <p>${data.companyName}</p>
      </div>
      <div class="content">
        <p>Hi ${data.clientName},</p>
        <p>Great news! We've received your payment.</p>
        
        <table class="table">
          <tr>
            <th>Invoice</th>
            <td>#${data.invoiceNumber}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>${data.currency}${data.amount}</td>
          </tr>
          <tr>
            <th>Date</th>
            <td>${data.paymentDate}</td>
          </tr>
          <tr>
            <th>Payment Method</th>
            <td>${data.paymentMethod}</td>
          </tr>
          <tr>
            <th>Receipt #</th>
            <td>${data.receiptNumber}</td>
          </tr>
        </table>
        
        <p>Thank you for your business! If you have any questions, just reply to this email.</p>
      </div>
      <div class="footer">
        <p>${data.companyName}</p>
        <p>This email was sent to ${data.clientEmail}</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Payment Received
${data.companyName}

Hi ${data.clientName},

Great news! We've received your payment.

Invoice: #${data.invoiceNumber}
Amount: ${data.currency}${data.amount}
Date: ${data.paymentDate}
Payment Method: ${data.paymentMethod}
Receipt #: ${data.receiptNumber}

Thank you for your business! If you have any questions, just reply to this email.

${data.companyName}
`;

  return {
    subject: `Payment Received - ${data.companyName}`,
    html,
    text
  };
}

// Appointment reminder template
export function appointmentReminderTemplate(data: AppointmentReminderData): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="header">
        <h1>Appointment Reminder</h1>
        <p>${data.companyName}</p>
      </div>
      <div class="content">
        <p>Hi ${data.clientName},</p>
        <p>This is a reminder about your upcoming ${data.jobType} appointment.</p>
        
        <table class="table">
          <tr>
            <th>Date</th>
            <td>${data.date}</td>
          </tr>
          <tr>
            <th>Time</th>
            <td>${data.time}</td>
          </tr>
          <tr>
            <th>Location</th>
            <td>${data.address}</td>
          </tr>
          ${data.technician ? `<tr><th>Technician</th><td>${data.technician}</td></tr>` : ''}
        </table>
        
        ${data.notes ? `<div class="note">Note: ${data.notes}</div>` : ''}
        
        <p>Please make sure someone is home or the area is accessible. If you need to reschedule, please contact us.</p>
      </div>
      <div class="footer">
        <p>${data.companyName}</p>
        <p>This email was sent to ${data.clientEmail}</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Appointment Reminder
${data.companyName}

Hi ${data.clientName},

This is a reminder about your upcoming ${data.jobType} appointment.

Date: ${data.date}
Time: ${data.time}
Location: ${data.address}
${data.technician ? `Technician: ${data.technician}` : ''}

${data.notes ? `Note: ${data.notes}` : ''}

Please make sure someone is home or the area is accessible. If you need to reschedule, please contact us.

${data.companyName}
`;

  return {
    subject: `Reminder: ${data.jobType} appointment on ${data.date}`,
    html,
    text
  };
}

// Helper to send emails via API (integrate with SendGrid/Postmark)
export async function sendEmail(to: string, template: EmailTemplate): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // In production, integrate with your email service
  // Example: SendGrid, Postmark, AWS SES, etc.
  
  const emailApiKey = process.env.EMAIL_API_KEY;
  const emailService = process.env.EMAIL_SERVICE || 'sendgrid';
  
  if (!emailApiKey) {
    console.log('[EMAIL] Would send to:', to);
    console.log('[EMAIL] Subject:', template.subject);
    console.log('[EMAIL] Body:', template.text.substring(0, 100) + '...');
    return { success: true, messageId: `dev-${Date.now()}` };
  }
  
  try {
    const endpoint = emailService === 'sendgrid' 
      ? 'https://api.sendgrid.com/v3/mail/send'
      : 'https://api.postmarkapp.com/email/withTemplate';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.EMAIL_FROM || 'noreply@cypress-signal.app' },
        subject: template.subject,
        content: [
          { type: 'text/plain', value: template.text },
          { type: 'text/html', value: template.html },
        ],
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }
    
    return { success: true, messageId: response.headers.get('X-Message-Id') || undefined };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}