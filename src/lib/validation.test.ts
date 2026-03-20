import { describe, it, expect } from 'vitest';
import { 
  registerSchema, 
  loginSchema, 
  checkoutSchema, 
  referralPostSchema,
  sanitizeInput,
  validateForm 
} from './validation';

describe('validation schemas', () => {
  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
        first_name: 'John',
        last_name: 'Doe',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'invalid-email',
        password: 'Password123',
        first_name: 'John',
        last_name: 'Doe',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
        first_name: 'John',
        last_name: 'Doe',
      });
      expect(result.success).toBe(false);
    });

    it('requires uppercase, lowercase, and number in password', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'alllowercase',
        first_name: 'John',
        last_name: 'Doe',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anypassword',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'password',
      });
      expect(result.success).toBe(false);
    });

    it('requires password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('checkoutSchema', () => {
    it('validates correct checkout data', () => {
      const result = checkoutSchema.safeParse({
        plan: 'solo',
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('accepts all plan types', () => {
      ['solo', 'team', 'business'].forEach(plan => {
        const result = checkoutSchema.safeParse({
          plan,
          email: 'test@example.com',
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid plan', () => {
      const result = checkoutSchema.safeParse({
        plan: 'enterprise',
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('referralPostSchema', () => {
    it('validates correct referral code', () => {
      const result = referralPostSchema.safeParse({
        referrerCode: 'ABCDEFGH',
        newEmail: 'new@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('rejects short referral code', () => {
      const result = referralPostSchema.safeParse({
        referrerCode: 'ABC',
        newEmail: 'new@example.com',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('sanitizeInput', () => {
  it('escapes HTML characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapes single quotes', () => {
    expect(sanitizeInput("test's data")).toBe('test&#x27;s data');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
  });
});

describe('validateForm', () => {
  it('returns success with valid data', () => {
    const result = validateForm(loginSchema, {
      email: 'test@example.com',
      password: 'password',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });

  it('returns error with invalid data', () => {
    const result = validateForm(loginSchema, {
      email: 'invalid',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });
});