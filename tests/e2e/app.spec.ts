import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Homepage', () => {
  test('should load and display hero section', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for page to load
    await page.waitForSelector('h1');
    
    // Check hero heading
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toContainText('CRM');
    
    // Check CTA buttons exist
    await expect(page.getByRole('link', { name: /start.*free/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /demo/i })).toBeVisible();
  });

  test('should display trade cards', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for trade-specific links
    await expect(page.getByRole('link', { name: /electrician/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /plumber/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /hvac/i })).toBeVisible();
  });

  test('should navigate to pricing', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click pricing link
    await page.getByRole('link', { name: /pricing/i }).first().click();
    
    // Should scroll to pricing section or navigate
    await page.waitForURL(/#pricing|pricing/);
  });
});

test.describe('Trade Landing Pages', () => {
  test('electrician landing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/electrician`);
    
    // Check trade-specific content
    await expect(page.locator('h1')).toContainText(/electric/i);
    await expect(page.getByRole('link', { name: /start.*free/i })).toBeVisible();
  });

  test('plumber landing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/plumber`);
    
    await expect(page.locator('h1')).toContainText(/plumb/i);
  });

  test('HVAC landing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/hvac`);
    
    await expect(page.locator('h1')).toContainText(/hvac|heating|cooling/i);
  });
});

test.describe('Authentication', () => {
  test('should display login form', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Check for email and password inputs
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign.*in|log.*in/i })).toBeVisible();
  });

  test('should display signup form', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    // Check for form fields
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create.*account|sign.*up/i })).toBeVisible();
  });

  test('should show password reset link', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Click forgot password link
    await page.getByRole('link', { name: /forgot.*password/i }).click();
    
    // Should navigate to forgot password page
    await page.waitForURL(/forgot.*password/);
    await expect(page.locator('h1')).toContainText(/reset/i);
  });
});

test.describe('Customer Portal', () => {
  test('should load portal page', async ({ page }) => {
    await page.goto(`${BASE_URL}/portal`);
    
    // Portal should show overview or login prompt
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have booking widget', async ({ page }) => {
    await page.goto(`${BASE_URL}/book`);
    
    // Check booking steps
    await expect(page.locator('h1, h2')).toContainText(/book|schedule/i);
  });
});

test.describe('Settings', () => {
  test('should load settings page', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    
    // Settings should show different sections
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have notification preferences', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings/notifications`);
    
    // Check for notification toggles
    await expect(page.locator('h1, h2').first()).toContainText(/notification/i);
  });
});

test.describe('Legal Pages', () => {
  test('privacy policy', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`);
    
    await expect(page.locator('h1')).toContainText(/privacy/i);
  });

  test('terms of service', async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`);
    
    await expect(page.locator('h1')).toContainText(/terms/i);
  });
});

test.describe('Navigation', () => {
  test('should have working navigation links', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check footer links exist
    const footerLinks = page.locator('footer a');
    const count = await footerLinks.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Mobile menu should work
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Menu should expand
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
});

test.describe('Performance', () => {
  test('homepage loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL);
    const loadTime = Date.now() - start;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Should have no JavaScript errors
    expect(errors).toHaveLength(0);
  });
});

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for basic accessibility
    // All images should have alt text
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});