// JSON-LD Structured Data for SEO
// https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo: string;
  contactPoint: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
  sameAs: string[];
  address: {
    '@type': 'PostalAddress';
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
}

export interface SoftwareApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
  };
}

export interface LocalBusinessSchema {
  '@context': 'https://schema.org';
  '@type': 'LocalBusiness';
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
}

export interface FAQSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

// Cypress Signal Organization Schema
export function getOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cypress Signal',
    description: 'Trade-specific CRM software for electricians, plumbers, HVAC contractors, landscapers, and roofers. Manage clients, jobs, estimates, invoices, and scheduling.',
    url: 'https://cypress-signal.com',
    logo: 'https://cypress-signal.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-0123',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://twitter.com/cypress-signal',
      'https://www.linkedin.com/company/cypress-signal',
      'https://www.facebook.com/cypress-signal',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
  };
}

// Software Application Schema for CRM
export function getSoftwareSchema(): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cypress Signal',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
    },
  };
}

// Trade-specific schemas
export function getTradeSchema(trade: string): LocalBusinessSchema & { softwareApp: SoftwareApplicationSchema } {
  const tradeData: Record<string, { name: string; description: string }> = {
    electrician: {
      name: 'Electrician CRM - Cypress Signal',
      description: 'CRM software built for electrical contractors. Manage service calls, panel upgrades, estimates, and invoicing.',
    },
    plumber: {
      name: 'Plumber CRM - Cypress Signal',
      description: 'CRM software built for plumbing contractors. Manage service calls, installations, estimates, and invoicing.',
    },
    hvac: {
      name: 'HVAC CRM - Cypress Signal',
      description: 'CRM software built for HVAC contractors. Manage service calls, maintenance contracts, and installations.',
    },
    landscaper: {
      name: 'Landscaper CRM - Cypress Signal',
      description: 'CRM software built for landscaping businesses. Manage maintenance contracts, design projects, and crews.',
    },
    roofer: {
      name: 'Roofer CRM - Cypress Signal',
      description: 'CRM software built for roofing contractors. Manage inspections, estimates, insurance claims, and invoicing.',
    },
  };

  const data = tradeData[trade] || tradeData.electrician;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    description: data.description,
    url: `https://cypress-signal.com/${trade}`,
    softwareApp: getSoftwareSchema(),
  };
}

// FAQ Schema for common questions
export function getFAQSchema(): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What trades does Cypress Signal support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cypress Signal supports electricians, plumbers, HVAC contractors, landscapers, and roofers with trade-specific features and workflows.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does Cypress Signal cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cypress Signal offers flexible pricing starting at $29/month for the Starter plan. Professional plans start at $79/month, and Enterprise plans are available for larger teams.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Cypress Signal integrate with QuickBooks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Cypress Signal integrates seamlessly with QuickBooks for accounting, allowing you to sync invoices, estimates, and client data.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I send estimates and invoices from Cypress Signal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Cypress Signal includes professional estimate and invoice templates that you can customize with your branding. Send via email or SMS and track when clients view them.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a mobile app?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cypress Signal is fully responsive and works on any device. A dedicated mobile app for iOS and Android is coming soon.',
        },
      },
    ],
  };
}

// Breadcrumb Schema
export function getBreadcrumbSchema(items: Array<{ name: string; path: string }>): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://cypress-signal.com${item.path}`,
    })),
  };
}

// Convert schema to JSON-LD script tag
export function schemaToScript(schema: object): string {
  return JSON.stringify(schema);
}