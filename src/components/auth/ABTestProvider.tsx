'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Feature flags and A/B test configurations
interface ABTestConfig {
  id: string;
  variants: Record<string, number>; // variant name -> weight (0-1)
  defaultValue: string;
}

// Current A/B tests
export const AB_TESTS: Record<string, ABTestConfig> = {
  // Test different hero headlines
  heroHeadline: {
    id: 'hero_001',
    variants: {
      'The CRM Built for Your Trade': 0.5,
      'Stop Losing Jobs to Chaos': 0.3,
      'Close More Jobs, Get Paid Faster': 0.2,
    },
    defaultValue: 'The CRM Built for Your Trade',
  },
  // Test different CTA button texts
  ctaText: {
    id: 'cta_001',
    variants: {
      'Start Free Trial': 0.4,
      'Get Started Free': 0.3,
      'Try TradeSuite Free': 0.3,
    },
    defaultValue: 'Start Free Trial',
  },
  // Test different pricing emphasis
  pricingEmphasis: {
    id: 'price_001',
    variants: {
      'No credit card required': 0.5,
      '14-day free trial': 0.3,
      'Cancel anytime': 0.2,
    },
    defaultValue: 'No credit card required',
  },
};

interface ABTestContextType {
  getVariant: (testId: string) => string;
  trackConversion: (testId: string, conversionType: string) => void;
  loaded: boolean;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

export function ABTestProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load or assign variants on mount
    const storedVariants = localStorage.getItem('ab_variants');
    let assigned: Record<string, string>;

    if (storedVariants) {
      assigned = JSON.parse(storedVariants);
    } else {
      assigned = {};
      Object.entries(AB_TESTS).forEach(([key, config]) => {
        assigned[key] = assignVariant(config);
      });
      localStorage.setItem('ab_variants', JSON.stringify(assigned));
    }

    setVariants(assigned);
    setLoaded(true);
  }, []);

  const assignVariant = (config: ABTestConfig): string => {
    const random = Math.random();
    let cumulative = 0;

    for (const [variant, weight] of Object.entries(config.variants)) {
      cumulative += weight;
      if (random < cumulative) {
        return variant;
      }
    }

    return config.defaultValue;
  };

  const getVariant = (testId: string): string => {
    return variants[testId] || AB_TESTS[testId]?.defaultValue || '';
  };

  const trackConversion = (testId: string, conversionType: string): void => {
    const variant = variants[testId];
    if (!variant) return;

    // Track conversion (send to analytics)
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (type: string, event: string, params: Record<string, string>) => void }).gtag) {
      (window as unknown as { gtag: (type: string, event: string, params: Record<string, string>) => void }).gtag('event', 'ab_conversion', {
        test_id: AB_TESTS[testId]?.id,
        variant,
        conversion_type: conversionType,
      });
    }

    // Also store locally for debugging
    console.log(`AB Test Conversion: ${testId} (${variant}) - ${conversionType}`);
  };

  return (
    <ABTestContext.Provider value={{ getVariant, trackConversion, loaded }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest(testId: string): { variant: string; trackConversion: (type: string) => void; loaded: boolean } {
  const context = useContext(ABTestContext);
  
  if (!context) {
    return { variant: AB_TESTS[testId]?.defaultValue || '', trackConversion: () => {}, loaded: false };
  }

  return {
    variant: context.getVariant(testId),
    trackConversion: (type: string) => context.trackConversion(testId, type),
    loaded: context.loaded,
  };
}

// Hook for tracking page views
export function useTrackPageView(pageName: string): void {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (type: string, event: string, params: Record<string, string>) => void }).gtag) {
      (window as unknown as { gtag: (type: string, event: string, params: Record<string, string>) => void }).gtag('event', 'page_view', {
        page_name: pageName,
        page_location: window.location.href,
      });
    }
  }, [pageName]);
}

// Hook for tracking events
export function useTrackEvent(): (eventName: string, params?: Record<string, unknown>) => void {
  return (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (type: string, event: string, params?: Record<string, unknown>) => void }).gtag) {
      (window as unknown as { gtag: (type: string, event: string, params?: Record<string, unknown>) => void }).gtag('event', eventName, params);
    }
  };
}