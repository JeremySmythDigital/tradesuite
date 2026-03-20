import Link from 'next/link';
import { Briefcase } from 'lucide-react';

interface FooterProps {
  trade?: string;
  tradeColor?: string;
}

const baseLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/support', label: 'Support' },
  { href: '/about', label: 'About' },
];

export function Footer({ trade, tradeColor = 'blue' }: FooterProps) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    orange: 'text-orange-500',
    green: 'text-green-500',
    slate: 'text-slate-400',
  };

  return (
    <footer className="py-12 bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Briefcase className={`w-6 h-6 ${colorClasses[tradeColor] || 'text-blue-500'}`} />
              <span className="font-bold text-white text-xl">TradeSuite</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs">
              The CRM built for trades. Electricians, plumbers, HVAC techs, landscapers, and roofers all love us.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="https://twitter.com/tradesuite" className="text-gray-500 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com/company/tradesuite" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/electrician/game" className="text-gray-400 hover:text-white transition-colors">Simulator</Link></li>
              <li><Link href="/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>

          {/* Trades */}
          <div>
            <h4 className="font-bold text-white mb-4">For Trades</h4>
            <ul className="space-y-2">
              <li><Link href="/electrician" className="text-gray-400 hover:text-white transition-colors">Electricians</Link></li>
              <li><Link href="/plumber" className="text-gray-400 hover:text-white transition-colors">Plumbers</Link></li>
              <li><Link href="/hvac" className="text-gray-400 hover:text-white transition-colors">HVAC Pros</Link></li>
              <li><Link href="/landscaper" className="text-gray-400 hover:text-white transition-colors">Landscapers</Link></li>
              <li><Link href="/roofer" className="text-gray-400 hover:text-white transition-colors">Roofers</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center gap-6">
            {baseLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-500 hover:text-white transition-colors text-sm">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TradeSuite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}