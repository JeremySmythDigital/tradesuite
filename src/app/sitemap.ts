import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradesuite.com';

// Trade-specific landing pages
const trades = ['electrician', 'plumber', 'hvac', 'landscaper', 'roofer'] as const;

// Static pages with priorities
const staticPages = [
  { path: '/', priority: 1, changeFreq: 'weekly' as const },
  { path: '/pricing', priority: 0.9, changeFreq: 'monthly' as const },
  { path: '/features', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/about', priority: 0.6, changeFreq: 'monthly' as const },
  { path: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/book', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/demo', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/login', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/register', priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
  { path: '/support', priority: 0.5, changeFreq: 'monthly' as const },
];

// Blog posts (when added)
const blogPosts: Array<{ slug: string; lastModified: string }> = [];

// Help articles
const helpArticles = [
  'getting-started',
  'invoicing',
  'estimates',
  'scheduling',
  'client-management',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  
  // Static pages
  const staticRoutes = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));
  
  // Trade landing pages
  const tradeRoutes = trades.map((trade) => ({
    url: `${baseUrl}/${trade}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  
  // Blog posts
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  // Help articles
  const helpRoutes = helpArticles.map((article) => ({
    url: `${baseUrl}/help/${article}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
  
  return [...staticRoutes, ...tradeRoutes, ...blogRoutes, ...helpRoutes];
}