// Google Analytics 4 tracking utilities
// GA4 Measurement ID from environment

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Track page views
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  // @ts-ignore - gtag is loaded via script
  if (window.gtag) {
    // @ts-ignore
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }
}

// Track custom events
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  // @ts-ignore
  if (window.gtag) {
    // @ts-ignore
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Track conversions (GA4)
export function trackConversion(conversionName: string, value?: number, currency: string = 'USD') {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  // @ts-ignore
  if (window.gtag) {
    // @ts-ignore
    window.gtag('event', 'conversion', {
      send_to: `${GA_MEASUREMENT_ID}/${conversionName}`,
      value: value,
      currency: currency,
    });
  }
}

// Predefined conversion events for Cypress Signal
export const conversions = {
  // Sign up conversions
  signupStarted: () => trackEvent('sign_up_started', 'engagement', 'signup'),
  signupCompleted: (plan: string, value: number) => {
    trackEvent('sign_up', 'engagement', plan, value);
    trackConversion('signup', value);
  },
  
  // Booking conversions
  bookingStarted: () => trackEvent('booking_started', 'engagement', 'booking'),
  bookingCompleted: (service: string, value?: number) => {
    trackEvent('booking_completed', 'engagement', service, value);
    trackConversion('booking', value || 0);
  },
  
  // Estimate conversions
  estimateCreated: (value: number) => {
    trackEvent('estimate_created', 'sales', 'estimate', value);
    trackConversion('estimate', value);
  },
  estimateApproved: (value: number) => {
    trackEvent('estimate_approved', 'sales', 'estimate', value);
    trackConversion('estimate_approved', value);
  },
  
  // Invoice conversions
  invoiceSent: (value: number) => {
    trackEvent('invoice_sent', 'sales', 'invoice', value);
  },
  invoicePaid: (value: number) => {
    trackEvent('invoice_paid', 'sales', 'invoice', value);
    trackConversion('payment', value);
  },
  
  // Demo conversions
  demoRequested: () => {
    trackEvent('demo_requested', 'leads', 'demo');
    trackConversion('demo_request');
  },
  
  // Contact conversions
  contactFormSubmitted: () => {
    trackEvent('contact_form', 'leads', 'contact');
  },
  
  // Portal engagement
  portalLogin: () => trackEvent('portal_login', 'engagement', 'customer_portal'),
  portalViewInvoice: (invoiceId: string) => trackEvent('view_invoice', 'engagement', invoiceId),
  portalViewEstimate: (estimateId: string) => trackEvent('view_estimate', 'engagement', estimateId),
  
  // Trade landing page conversions
  tradeLandingPageView: (trade: string) => trackEvent('trade_page_view', 'landing', trade),
  tradeCtaClick: (trade: string) => {
    trackEvent('trade_cta_click', 'landing', trade);
    trackConversion('trade_cta', 0);
  },
};

// Initialize GA4 script (add to _document.tsx or layout.tsx)
export function getGAScript(): string {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return '';
  }
  
  return `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname,
        send_page_view: true
      });
    </script>
  `;
}

// React hook for tracking page views
export function usePageTracking(path: string, title?: string) {
  if (typeof window !== 'undefined') {
    trackPageView(path, title);
  }
}

// Track outbound links
export function trackOutboundLink(url: string) {
  trackEvent('click', 'outbound', url);
}

// Track file downloads
export function trackDownload(fileType: string, fileName: string) {
  trackEvent('download', 'engagement', `${fileType}: ${fileName}`);
}

// Track scroll depth
export function trackScrollDepth(depth: number) {
  trackEvent('scroll', 'engagement', `${depth}%`, depth);
}

// Track time on page
export function trackTimeOnPage(seconds: number) {
  trackEvent('time_on_page', 'engagement', `${Math.round(seconds / 60)} minutes`);
}

// E-commerce tracking (enhanced e-commerce events)
export function trackPurchase(transactionId: string, value: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;
  
  // @ts-ignore
  if (window.gtag) {
    // @ts-ignore
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'USD',
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }
}

// Add GA types to window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}