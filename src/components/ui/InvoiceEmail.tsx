// Invoice Email Templates for sending via email

export interface InvoiceEmailData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  companyPhone: string;
  amount: number;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  paymentLink?: string;
}

export function generateInvoiceEmail(data: InvoiceEmailData): { subject: string; html: string; text: string } {
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.08; // 8% tax example
  const total = subtotal + tax;

  const subject = `Invoice #${data.invoiceNumber} from ${data.companyName} - $${total.toFixed(2)}`;

  const text = `
Invoice #${data.invoiceNumber}

From: ${data.companyName}
To: ${data.clientName}

Amount Due: $${total.toFixed(2)}
Due Date: ${new Date(data.dueDate).toLocaleDateString()}

Items:
${data.items.map(item => `  - ${item.description}: $${item.rate} x ${item.quantity} = $${item.amount.toFixed(2)}`).join('\n')}

Subtotal: $${subtotal.toFixed(2)}
Tax: $${tax.toFixed(2)}
Total: $${total.toFixed(2)}

${data.paymentLink ? `Pay Online: ${data.paymentLink}` : ''}

Questions? Call ${data.companyPhone}
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${data.invoiceNumber}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0 0 10px 0;">Invoice #${data.invoiceNumber}</h1>
    <p style="color: white; opacity: 0.9; margin: 0;">${data.companyName}</p>
  </div>
  
  <div style="background: white; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
      <div>
        <h3 style="margin: 0 0 5px 0; color: #374151;">Billed To</h3>
        <p style="margin: 0; color: #6b7280;">${data.clientName}</p>
      </div>
      <div style="text-align: right;">
        <h3 style="margin: 0 0 5px 0; color: #374151;">Amount Due</h3>
        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2563eb;">$${total.toFixed(2)}</p>
        <p style="margin: 5px 0 0 0; color: #6b7280;">Due ${new Date(data.dueDate).toLocaleDateString()}</p>
      </div>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background: #f9fafb;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Description</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Rate</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">$${item.rate.toFixed(2)}</td>
            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">$${item.amount.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
      <div style="width: 200px;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #6b7280;">Subtotal</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #6b7280;">Tax</span>
          <span>$${tax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px 0; font-weight: bold;">
          <span>Total</span>
          <span>$${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
    
    ${data.paymentLink ? `
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${data.paymentLink}" style="display: inline-block; background: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Pay Online Now
        </a>
      </div>
    ` : ''}
    
    <div style="text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      <p style="margin: 0 0 5px 0;">Questions about this invoice?</p>
      <p style="margin: 0;">Call us at ${data.companyPhone}</p>
    </div>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>Powered by Cypress Signal</p>
  </div>
</body>
</html>
`;

  return { subject, html, text };
}

// Late payment reminder
export function generatePaymentReminderEmail(data: InvoiceEmailData): { subject: string; html: string; text: string } {
  const subject = `Payment Reminder: Invoice #${data.invoiceNumber} is overdue`;
  
  // Similar structure but with different messaging
  // ... (abbreviated for brevity)
  
  return { subject, html: `<p>Payment reminder for Invoice #${data.invoiceNumber}</p>`, text: subject };
}