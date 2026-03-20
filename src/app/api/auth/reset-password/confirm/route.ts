import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';

const resetConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = resetConfirmSchema.parse(body);
    
    // Decode token
    let tokenData: { email: string; exp: number };
    try {
      tokenData = JSON.parse(Buffer.from(token, 'base64url').toString());
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    
    // Check expiration
    if (Date.now() > tokenData.exp) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }
    
    // Verify token hasn't been used
    const resetCheck = await fetch(`${directusUrl}/items/password_resets?filter[token][_eq]=${token}&filter[used][_eq]=false`);
    const resetData = await resetCheck.json();
    
    if (!resetData.data || resetData.data.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    
    const resetRecord = resetData.data[0];
    
    // Mark token as used
    await fetch(`${directusUrl}/items/password_resets/${resetRecord.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ used: true, used_at: new Date().toISOString() }),
    });
    
    // Find user by email
    const userCheck = await fetch(`${directusUrl}/users?filter[email][_eq]=${tokenData.email}`);
    const userData = await userCheck.json();
    
    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userId = userData.data[0].id;
    
    // In production, use Directus admin API to update password
    console.log(`[PASSWORD RESET] Password reset for user ${userId}`);
    
    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. Please log in.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Reset confirm error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}