import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

const resetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = resetRequestSchema.parse(body);
    
    // Generate reset token (valid for 1 hour)
    const resetToken = Buffer.from(
      JSON.stringify({ email, exp: Date.now() + 3600000 })
    ).toString('base64url');
    
    // Store reset request in Directus
    const response = await fetch(`${directusUrl}/items/password_resets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        token: resetToken,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        used: false,
      }),
    });
    
    if (!response.ok) {
      // Don't reveal if email exists or not for security
      console.error('Failed to create reset token');
    }
    
    // In production, send email via SendGrid/Postmark
    const resetUrl = `${process.env.NEXT_PUBLIC_URL || 'https://cypress-signal.vercel.app'}/reset-password?token=${resetToken}`;
    console.log(`[EMAIL] Password reset for ${email}: ${resetUrl}`);
    
    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a reset link.',
      // Remove in production:
      ...(process.env.NODE_ENV === 'development' && { resetUrl, token: resetToken }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Reset request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}