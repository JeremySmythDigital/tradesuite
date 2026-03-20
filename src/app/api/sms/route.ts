import { NextRequest, NextResponse } from 'next/server';
import { twilioService, SMS_TEMPLATES } from '@/lib/twilio';
import { z } from 'zod';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

// Validation schemas
const templateNames = Object.keys(SMS_TEMPLATES) as [keyof typeof SMS_TEMPLATES];

const sendSchema = z.object({
  to: z.string().min(10, 'Invalid phone number'),
  template: z.enum(templateNames).optional(),
  body: z.string().min(1, 'Message body required').max(1600, 'Message too long').optional(),
  data: z.record(z.string(), z.string()).optional(),
});

const bulkSchema = z.object({
  recipients: z.array(z.object({
    to: z.string().min(10),
    name: z.string().optional(),
  })).max(100, 'Maximum 100 recipients'),
  template: z.enum(templateNames),
  data: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a bulk send
    if (body.recipients && Array.isArray(body.recipients)) {
      const validated = bulkSchema.parse(body);
      
      const results = await Promise.allSettled(
        validated.recipients.map(recipient => {
          const templateData = { ...validated.data, clientName: recipient.name || 'Customer' };
          return twilioService.sendTemplate(validated.template, templateData, recipient.to);
        })
      );
      
      const succeeded = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
      const failed = results.length - succeeded;
      
      return NextResponse.json({
        success: true,
        sent: succeeded,
        failed,
        results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Failed' }),
      });
    }
    
    // Single send
    const validated = sendSchema.parse(body);
    
    let result;
    
    if (validated.template && validated.data) {
      result = await twilioService.sendTemplate(
        validated.template,
        validated.data,
        validated.to
      );
    } else if (validated.body) {
      result = await twilioService.sendMessage({
        to: validated.to,
        body: validated.body,
      });
    } else {
      return NextResponse.json({ error: 'Either template+data or body is required' }, { status: 400 });
    }
    
    if (result.success) {
      // Log SMS in Directus
      await fetch(`${directusUrl}/items/sms_logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: validated.to,
          template: validated.template || 'custom',
          body: validated.body || JSON.stringify(validated.data),
          message_id: result.messageId,
          sent_at: new Date().toISOString(),
        }),
      }).catch(console.error);
      
      return NextResponse.json({ success: true, messageId: result.messageId });
    }
    
    return NextResponse.json({ error: result.error || 'Failed to send SMS' }, { status: 500 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('SMS API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Check Twilio configuration status
export async function GET() {
  return NextResponse.json({
    configured: twilioService.isConfigured(),
    templates: Object.keys(SMS_TEMPLATES),
  });
}