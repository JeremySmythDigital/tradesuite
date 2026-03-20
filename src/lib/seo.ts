import { Metadata } from 'next';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  siteName?: string;
}

export function generateSEO(data: SEOData): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.png',
    url,
    type = 'website',
    siteName = 'TradeSuite',
  } = data;

  const fullTitle = title.includes('TradeSuite') ? title : `${title} | TradeSuite`;
  const fullUrl = url || 'https://tradesuite.vercel.app';
  const fullImage = image.startsWith('http') ? image : `https://tradesuite.vercel.app${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@tradesuite',
    },
    alternates: {
      canonical: fullUrl,
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
  };
}

// Trade-specific SEO presets
export const tradeSEO = {
  electrician: generateSEO({
    title: 'Electrician CRM - Job Tracking & Invoicing Made Simple',
    description: 'The CRM built for electricians. Track service calls, panel upgrades, inspections. Create quotes in 60 seconds. Get paid faster with automatic invoicing.',
    keywords: ['electrician CRM', 'electrical contractor software', 'electrician scheduling', 'service call tracking', 'panel upgrade quotes'],
    url: 'https://tradesuite.vercel.app/electrician',
  }),
  plumber: generateSEO({
    title: 'Plumber CRM - Drain Cleaning & Service Call Tracking',
    description: 'The CRM built for plumbers. Track emergency calls, drain cleaning, water heaters. Manage properties with photos and notes. Get paid faster.',
    keywords: ['plumber CRM', 'plumbing software', 'plumber scheduling', 'drain cleaning software', 'service call tracking'],
    url: 'https://tradesuite.vercel.app/plumber',
  }),
  hvac: generateSEO({
    title: 'HVAC CRM - Maintenance Contracts & Service Tracking',
    description: 'The CRM built for HVAC contractors. Track maintenance plans, seasonal prep, warranty expiration. Never miss a renewal again.',
    keywords: ['HVAC CRM', 'HVAC contractor software', 'maintenance contract tracking', 'HVAC scheduling', 'seasonal prep software'],
    url: 'https://tradesuite.vercel.app/hvac',
  }),
  landscaper: generateSEO({
    title: 'Landscaper CRM - Job Tracking & Client Management',
    description: 'The CRM built for landscapers. Track mowing schedules, installations, seasonal contracts. Manage crews and properties efficiently.',
    keywords: ['landscaper CRM', 'landscaping software', 'lawn care scheduling', 'landscaping job tracking'],
    url: 'https://tradesuite.vercel.app/landscaper',
  }),
  roofer: generateSEO({
    title: 'Roofer CRM - Estimates & Job Tracking for Roofing',
    description: 'The CRM built for roofers. Create professional estimates in minutes. Track materials, crews, and inspections. Get paid faster.',
    keywords: ['roofer CRM', 'roofing software', 'roofing estimates', 'roofing job tracking', 'contractor CRM'],
    url: 'https://tradesuite.vercel.app/roofer',
  }),
  home: generateSEO({
    title: 'TradeSuite - The CRM Built for Your Trade',
    description: 'Trade-specific CRM for electricians, plumbers, HVAC, landscapers, and roofers. Manage clients, jobs, estimates, invoices, and scheduling. Start free trial.',
    keywords: ['trade CRM', 'contractor software', 'job tracking', 'invoicing', 'scheduling', 'estimates'],
    url: 'https://tradesuite.vercel.app',
  }),
};