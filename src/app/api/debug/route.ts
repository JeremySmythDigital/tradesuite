import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stripe_key_exists: !!process.env.STRIPE_SECRET_KEY,
    stripe_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 20) || 'NOT SET',
    publishable_key_exists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    node_env: process.env.NODE_ENV,
  });
}