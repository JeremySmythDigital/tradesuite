import { z } from 'zod';

// User registration validation
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Checkout validation
export const checkoutSchema = z.object({
  plan: z.enum(['solo', 'team', 'business']),
  email: z.string().email('Invalid email address'),
  userId: z.string().optional(),
  referrer: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Referral validation
export const referralPostSchema = z.object({
  referrerCode: z.string().length(8, 'Invalid referral code'),
  newEmail: z.string().email('Invalid email address'),
});

export type ReferralPostInput = z.infer<typeof referralPostSchema>;

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Validate and sanitize form data
export function validateForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data as z.infer<T> };
    }
    const errors = result.error.issues.map(e => e.message).join(', ');
    return { success: false, error: errors };
  } catch {
    return { success: false, error: 'Validation failed' };
  }
}