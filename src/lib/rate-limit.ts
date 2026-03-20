import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client - uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env
const redis = Redis.fromEnv();

// Different rate limits for different endpoints
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
  analytics: true,
  prefix: 'tradesuite:auth',
});

export const checkoutLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 m'), // 3 checkout attempts per minute
  analytics: true,
  prefix: 'tradesuite:checkout',
});

export const referralLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 referral operations per minute
  analytics: true,
  prefix: 'tradesuite:referral',
});

export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute for general API
  analytics: true,
  prefix: 'tradesuite:api',
});

// Helper to get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

// Rate limit response helper
export function rateLimitResponse(remaining: number, reset: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please try again later.',
      remaining,
      reset,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
      },
    }
  );
}