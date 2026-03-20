// JSON-LD Structured Data for SEO

export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
}

export interface SoftwareApplicationData {
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    price: number | string;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
}

export interface BreadcrumbData {
  name: string;
  url: string;
}

// Organization Schema
export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TradeSuite',
    url: 'https://tradesuite.vercel.app',
    logo: 'https://tradesuite.vercel.app/logo.png',
    description: 'Trade-specific CRM software for electricians, plumbers, HVAC contractors, landscapers, and roofers.',
    sameAs: [
      'https://twitter.com/tradesuite',
      'https://linkedin.com/company/tradesuite',
      'https://facebook.com/tradesuite',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-TRADES',
      contactType: 'sales',
      areaServed: 'US',
      availableLanguage: ['English'],
    },
  };
}

// Software Application Schema
export function generateSoftwareSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TradeSuite',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '29',
      highPrice: '149',
      priceCurrency: 'USD',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2850',
    },
  };
}

// Local Business Schema for each trade
export function generateTradeSchema(trade: string): object {
  const tradeNames: Record<string, string> = {
    electrician: 'Electrician CRM Software',
    plumber: 'Plumber CRM Software',
    hvac: 'HVAC CRM Software',
    landscaper: 'Landscaper CRM Software',
    roofer: 'Roofer CRM Software',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tradeNames[trade] || 'TradeSuite',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    description: `Professional CRM software designed specifically for ${trade} contractors.`,
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(items: BreadcrumbData[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ Schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Product Schema for pricing
export function generateProductSchema(plan: 'solo' | 'team' | 'business'): object {
  const plans = {
    solo: { name: 'TradeSuite Solo', price: 29, description: 'For individuals and single-owner businesses' },
    team: { name: 'TradeSuite Team', price: 79, description: 'For crews with 2-5 team members' },
    business: { name: 'TradeSuite Business', price: 149, description: 'For larger teams and growing companies' },
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: plans[plan].name,
    description: plans[plan].description,
    brand: {
      '@type': 'Brand',
      name: 'TradeSuite',
    },
    offers: {
      '@type': 'Offer',
      price: plans[plan].price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  };
}