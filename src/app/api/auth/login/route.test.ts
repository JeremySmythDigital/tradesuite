import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Response and Request for Node environment
class MockRequest {
  method: string;
  headers: Headers;
  private body: string;
  
  constructor(url: string, init?: RequestInit) {
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers as Record<string, string> || {});
    this.body = init?.body as string || '';
  }
  
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}

// Mock global fetch
const mockDirectusResponse = { access_token: 'test-token', user: { id: '1', email: 'test@test.com' } };

vi.mock('@/lib/directus', () => ({
  getDirectusClient: vi.fn().mockResolvedValue({
    login: vi.fn().mockResolvedValue('test-token'),
    request: vi.fn().mockResolvedValue(mockDirectusResponse),
  }),
}));

describe('POST /api/auth/login', () => {
  it('validates the route exists', async () => {
    const { POST } = await import('./route');
    expect(POST).toBeDefined();
    expect(typeof POST).toBe('function');
  });

  it('rejects missing credentials', async () => {
    const { POST } = await import('./route');
    
    const request = new MockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }) as unknown as Request;

    const response = await POST(request);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('rejects invalid email format', async () => {
    const { POST } = await import('./route');
    
    const request = new MockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', password: 'password123' }),
    }) as unknown as Request;

    const response = await POST(request);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('requires password field', async () => {
    const { POST } = await import('./route');
    
    const request = new MockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    }) as unknown as Request;

    const response = await POST(request);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});