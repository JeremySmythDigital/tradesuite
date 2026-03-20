import { Metadata, Viewport } from 'next';

// Base metadata for the site
export const baseMetadata: Metadata = {
  title: {
    default: 'Cypress Signal - The CRM Built for Your Trade',
    template: '%s | Cypress Signal',
  },
  description: 'Trade-specific CRM for electricians, plumbers, HVAC, landscapers, and roofers. Manage clients, jobs, estimates, invoices, and scheduling.',
  keywords: ['electrician CRM', 'plumber software', 'HVAC scheduling', 'landscaper management', 'roofing estimates', 'trade CRM', 'contractor software'],
  authors: [{ name: 'Cypress Signal' }],
  creator: 'Cypress Signal',
  publisher: 'Cypress Signal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cypress-signal.com'),
  openGraph: {
    title: 'Cypress Signal - The CRM Built for Your Trade',
    description: 'Trade-specific CRM for electricians, plumbers, HVAC, landscapers, and roofers. Stop using generic CRMs.',
    url: 'https://cypress-signal.com',
    siteName: 'Cypress Signal',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cypress Signal - Trade-Specific CRM',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'Cypress Signal Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cypress Signal - The CRM Built for Your Trade',
    description: 'Trade-specific CRM for electricians, plumbers, HVAC, landscapers, and roofers.',
    images: ['/og-image.png'],
    creator: '@cypress-signal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#2563eb' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://cypress-signal.com',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Trade-specific metadata generators
interface TradeMetadata {
  tradeId: string;
  tradeName: string;
  title: string;
  description: string;
  keywords: string[];
  themeColor: string;
  ogImage: string;
}

export const tradeMetadata: Record<string, TradeMetadata> = {
  electrician: {
    tradeId: 'electrician',
    tradeName: 'Electrician',
    title: 'Electrician CRM - Client & Job Management Software',
    description: 'The CRM built specifically for electricians. Manage service calls, panel upgrades, inspections, estimates, and invoices.',
    keywords: ['electrician CRM', 'electrical contractor software', 'electrician scheduling', 'service call tracking', 'electrical estimates'],
    themeColor: '#f59e0b',
    ogImage: '/og-electrician.png',
  },
  plumber: {
    tradeId: 'plumber',
    tradeName: 'Plumber',
    title: 'Plumber CRM - Plumbing Business Management Software',
    description: 'The CRM built specifically for plumbers. Manage service calls, installations, estimates, and invoices.',
    keywords: ['plumber CRM', 'plumbing contractor software', 'plumbing scheduling', 'drain cleaning software'],
    themeColor: '#2563eb',
    ogImage: '/og-plumber.png',
  },
  hvac: {
    tradeId: 'hvac',
    tradeName: 'HVAC Contractor',
    title: 'HVAC CRM - HVAC Business Management Software',
    description: 'The CRM built specifically for HVAC contractors. Manage service calls, maintenance contracts, installations, and invoices.',
    keywords: ['HVAC CRM', 'HVAC contractor software', 'HVAC scheduling', 'maintenance contract tracking'],
    themeColor: '#ea580c',
    ogImage: '/og-hvac.png',
  },
  landscaper: {
    tradeId: 'landscaper',
    tradeName: 'Landscaper',
    title: 'Landscaper CRM - Landscaping Business Management Software',
    description: 'The CRM built specifically for landscapers. Manage maintenance contracts, design projects, crews, and invoices.',
    keywords: ['landscaper CRM', 'landscaping software', 'lawn care scheduling', 'landscape design tracking'],
    themeColor: '#16a34a',
    ogImage: '/og-landscaper.png',
  },
  roofer: {
    tradeId: 'roofer',
    tradeName: 'Roofer',
    title: 'Roofer CRM - Roofing Business Management Software',
    description: 'The CRM built specifically for roofing contractors. Manage inspections, estimates, insurance claims, and invoices.',
    keywords: ['roofer CRM', 'roofing contractor software', 'roofing scheduling', 'roof replacement tracking'],
    themeColor: '#475569',
    ogImage: '/og-roofer.png',
  },
};

export function generateTradeMetadata(trade: string): Metadata {
  const meta = tradeMetadata[trade];
  if (!meta) return baseMetadata;

  return {
    ...baseMetadata,
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      ...baseMetadata.openGraph!,
      title: meta.title,
      description: meta.description,
      images: [{ url: meta.ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      ...baseMetadata.twitter!,
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
  };
}

// Trade-specific viewport for theme colors
export function generateTradeViewport(trade: string): { themeColor: string } {
  const meta = tradeMetadata[trade];
  return { themeColor: meta?.themeColor || '#2563eb' };
}