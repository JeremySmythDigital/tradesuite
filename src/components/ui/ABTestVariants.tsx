'use client';

import { useABTest } from '@/components/auth/ABTestProvider';
import Link from 'next/link';

// A/B test variants for homepage CTA
export function CTAVariants() {
  const { variant } = useABTest('home_cta');
  
  if (variant === 'control') {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5">
          Start Free Trial
        </Link>
        <a href="#features" className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-medium text-lg border border-gray-300 hover:border-gray-400">
          See How It Works
        </a>
      </div>
    );
  }
  
  // Variant B: More urgency-focused
  if (variant === 'variant_b') {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-lg shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
          Start Free Trial
          <span className="px-2 py-0.5 bg-white/20 rounded text-sm">14 Days Free</span>
        </Link>
        <a href="#features" className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-medium text-lg border border-gray-300 hover:border-gray-400">
          See How It Works
        </a>
      </div>
    );
  }
  
  // Variant C: Social proof in CTA
  if (variant === 'variant_c') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5">
            Start Free Trial
          </Link>
          <a href="#features" className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-medium text-lg border border-gray-300 hover:border-gray-400">
            See How It Works
          </a>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span className="text-amber-500">★★★★★</span>
          <span>2,500+ trade professionals trust us</span>
        </p>
      </div>
    );
  }
  
  return null;
}

// A/B test for headline
export function HeadlineVariants() {
  const { variant } = useABTest('home_headline');
  
  if (variant === 'control') {
    return (
      <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 font-display">
        The CRM Built for<span className="text-blue-600"> Your Trade</span>
      </h1>
    );
  }
  
  if (variant === 'variant_b') {
    return (
      <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 font-display">
        Stop Losing Jobs.<br />
        <span className="text-blue-600">Start Closing More.</span>
      </h1>
    );
  }
  
  if (variant === 'variant_c') {
    return (
      <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 font-display">
        <span className="text-blue-600">Trade-Specific CRM</span><br />
        That Actually Works
      </h1>
    );
  }
  
  return null;
}

// A/B test for pricing display
export function PricingVariants() {
  const { variant } = useABTest('pricing_display');
  
  // These would be used in the pricing section
  // The parent component would use this to determine pricing presentation
  
  const pricingConfig = {
    control: {
      showAnnualFirst: false,
      highlightSavings: false,
      discountPercentage: 0,
    },
    variant_b: {
      showAnnualFirst: true,
      highlightSavings: true,
      discountPercentage: 20,
    },
    variant_c: {
      showAnnualFirst: true,
      highlightSavings: true,
      discountPercentage: 15,
    },
  };
  
  return pricingConfig[variant as keyof typeof pricingConfig] || pricingConfig.control;
}