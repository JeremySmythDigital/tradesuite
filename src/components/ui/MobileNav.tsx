'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  trade?: string;
  signupLink?: string;
}

export function MobileNav({ trade, signupLink = '/signup' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/#features"
              className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href={signupLink}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              onClick={() => setIsOpen(false)}
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

interface TradeNavProps {
  trade: string;
  tradeColor: string;
  signupLink: string;
  gameLink?: string;
}

export function TradeMobileNav({ trade, tradeColor, signupLink, gameLink = '/electrician/game' }: TradeNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const colorClasses: Record<string, string> = {
    electrician: 'bg-amber-500 hover:bg-amber-600',
    plumber: 'bg-blue-600 hover:bg-blue-700',
    hvac: 'bg-orange-600 hover:bg-orange-700',
    landscaper: 'bg-green-600 hover:bg-green-700',
    roofer: 'bg-yellow-500 hover:bg-yellow-600',
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href={gameLink}
              className={`px-4 py-3 ${colorClasses[trade] || 'bg-gray-600 hover:bg-gray-700'} text-white rounded-lg font-medium text-center flex items-center justify-center gap-2`}
              onClick={() => setIsOpen(false)}
            >
              Play Simulator
            </Link>
            <Link
              href="/login"
              className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href={signupLink}
              className={`px-4 py-3 ${colorClasses[trade] || 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-medium text-center`}
              onClick={() => setIsOpen(false)}
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}