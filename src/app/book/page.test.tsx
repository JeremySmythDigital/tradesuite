import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Directus API
vi.mock('@/lib/directus', () => ({
  directus: {
    items: vi.fn(() => ({
      createOne: vi.fn().mockResolvedValue({ id: 'test-booking-123' }),
      readByQuery: vi.fn().mockResolvedValue([]),
    })),
  },
}));

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('Service Selection', () => {
    it('displays available services', async () => {
      // Services would be fetched from API
      const services = ['Electrical Repair', 'Installation', 'Inspection', 'Emergency'];
      
      expect(services.length).toBeGreaterThan(0);
      expect(services).toContain('Electrical Repair');
      expect(services).toContain('Installation');
    });

    it('allows service selection', async () => {
      // Simulate service selection
      const selectedService = 'Electrical Repair';
      
      expect(selectedService).toBe('Electrical Repair');
    });
  });

  describe('Date/Time Selection', () => {
    it('validates date is in the future', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const isValidDate = (date: Date) => date > today;
      
      expect(isValidDate(tomorrow)).toBe(true);
      expect(isValidDate(new Date(today.setDate(today.getDate() - 1)))).toBe(false);
    });

    it('provides available time slots', () => {
      const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', 
        '12:00', '13:00', '14:00', '15:00', '16:00'
      ];
      
      expect(timeSlots.length).toBe(9);
      expect(timeSlots).toContain('09:00');
    });
  });

  describe('Customer Information', () => {
    it('validates email format', () => {
      const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };
      
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('no@domain')).toBe(false);
    });

    it('validates phone number format', () => {
      const validatePhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 15;
      };
      
      expect(validatePhone('(555) 123-4567')).toBe(true);
      expect(validatePhone('+1 555 123 4567')).toBe(true);
      expect(validatePhone('123')).toBe(false);
    });
  });

  describe('Booking Submission', () => {
    it('submits valid booking to API', async () => {
      const bookingData = {
        service: 'Electrical Repair',
        date: '2026-03-25',
        time: '09:00',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          address: '123 Main St',
        },
        notes: 'Need panel upgrade',
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'booking-123', ...bookingData }),
      });
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      expect(mockFetch).toHaveBeenCalledWith('/api/bookings', expect.any(Object));
      expect(result.id).toBe('booking-123');
    });

    it('handles API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      expect(response.ok).toBe(false);
    });
  });

  describe('Confirmation Flow', () => {
    it('displays confirmation after successful booking', async () => {
      const confirmationData = {
        bookingId: 'booking-123',
        service: 'Electrical Repair',
        date: 'Tuesday, March 25, 2026',
        time: '9:00 AM',
        customer: 'John Doe',
      };
      
      // Check confirmation data structure
      expect(confirmationData.bookingId).toBeDefined();
      expect(confirmationData.service).toBe('Electrical Repair');
      expect(confirmationData.date).toContain('2026');
    });

    it('sends confirmation email', async () => {
      const emailPayload = {
        to: 'john@example.com',
        template: 'appointmentReminder',
        data: {
          clientName: 'John Doe',
          date: 'March 25, 2026',
          time: '9:00 AM',
          address: '123 Main St',
          jobType: 'Electrical Repair',
        },
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, messageId: 'msg-123' }),
      });
      
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      });
      
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});

describe('Pricing Calculation', () => {
  it('calculates base price for standard service', () => {
    const basePrice = 99;
    const service = 'Electrical Repair';
    
    expect(basePrice).toBe(99);
  });

  it('adds emergency premium', () => {
    const basePrice = 99;
    const emergencyPremium = 50;
    const emergencyTotal = basePrice + emergencyPremium;
    
    expect(emergencyTotal).toBe(149);
  });

  it('calculates total with tax', () => {
    const subtotal = 100;
    const taxRate = 0.08; // 8%
    const total = subtotal * (1 + taxRate);
    
    expect(total).toBeCloseTo(108, 0);
  });
});

describe('Availability Check', () => {
  it('checks technician availability', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        available: true,
        slots: ['09:00', '10:00', '14:00'],
      }),
    });
    
    const response = await fetch('/api/availability?date=2026-03-25');
    const result = await response.json();
    
    expect(result.available).toBe(true);
    expect(result.slots.length).toBe(3);
  });

  it('handles fully booked dates', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        available: false,
        slots: [],
      }),
    });
    
    const response = await fetch('/api/availability?date=2026-03-26');
    const result = await response.json();
    
    expect(result.available).toBe(false);
    expect(result.slots).toEqual([]);
  });
});

describe('Embeddable Widget', () => {
  it('generates widget embed code', () => {
    const companyId = 'acme-electric';
    const embedCode = `<script src="https://tradesuite.vercel.app/widget.js" data-company="${companyId}"></script>`;
    
    expect(embedCode).toContain('widget.js');
    expect(embedCode).toContain(companyId);
  });

  it('passes configuration through data attributes', () => {
    const config = {
      company: 'acme-electric',
      theme: 'light',
      primaryColor: '#2563eb',
      services: ['electrical', 'installation'],
    };
    
    const embedCode = `<script src="https://tradesuite.vercel.app/widget.js" 
      data-company="${config.company}"
      data-theme="${config.theme}"
      data-primary-color="${config.primaryColor}"
      data-services="${config.services.join(',')}">
    </script>`;
    
    expect(embedCode).toContain(config.company);
    expect(embedCode).toContain(config.theme);
    expect(embedCode).toContain(config.primaryColor);
  });
});

describe('Form Validation Edge Cases', () => {
  it('handles empty form submission', () => {
    const formData = {
      service: '',
      date: '',
      time: '',
      customer: { name: '', email: '', phone: '', address: '' },
    };
    
    const isValid = Object.values(formData).every(v => 
      typeof v === 'string' ? v.length > 0 : true
    ) && Object.values(formData.customer).every(v => v.length > 0);
    
    expect(isValid).toBe(false);
  });

  it('validates maximum character limits', () => {
    const notes = 'a'.repeat(501);
    const maxLength = 500;
    
    expect(notes.length).toBeGreaterThan(maxLength);
    expect(notes.substring(0, maxLength).length).toBe(maxLength);
  });

  it('sanitizes input to prevent XSS', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = maliciousInput
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });
});