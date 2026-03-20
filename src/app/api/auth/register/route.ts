import { NextRequest, NextResponse } from 'next/server';
import { registerSchema, validateForm, sanitizeInput } from '@/lib/validation';
import { authLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-1dd5.up.railway.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || process.env.DIRECTUS_TOKEN;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const { success: rateOk, remaining, reset } = await authLimiter.limit(ip);
  
  if (!rateOk) {
    return rateLimitResponse(remaining, reset);
  }

  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validation = validateForm(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { email, password, first_name, last_name } = validation.data;

    // Use admin token for user creation (more secure)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (DIRECTUS_ADMIN_TOKEN) {
      headers['Authorization'] = `Bearer ${DIRECTUS_ADMIN_TOKEN}`;
    }

    const response = await fetch(`${DIRECTUS_URL}/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: sanitizeInput(email),
        password,
        first_name: sanitizeInput(first_name),
        last_name: sanitizeInput(last_name),
        status: 'active',
        role: 'd02dcc10-11be-48f7-a9e8-ed8bfd4ff6b0', // Public role ID
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors?.[0]?.message || 'Failed to create user';
      
      // Don't leak if email exists (security best practice)
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        return NextResponse.json(
          { success: true, message: 'Account created successfully' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: { id: data.data?.id, email: data.data?.email } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
