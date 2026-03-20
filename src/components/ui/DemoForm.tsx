'use client';

import { useState } from 'react';
import { FadeIn } from './Motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface DemoFormProps {
  trade?: string;
  variant?: 'hero' | 'inline';
}

export function DemoForm({ trade, variant = 'hero' }: DemoFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, this would submit to an API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re on the list!</h3>
        <p className="text-gray-600">We&apos;ll contact you within 24 hours with your personalized demo.</p>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
        <input type="hidden" name="trade" value={trade || ''} />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
        >
          Get Your Free Demo
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-sm text-gray-500">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </form>
    );
  }

  return (
    <FadeIn>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Get Your Free Demo</h3>
        <p className="text-gray-600 mb-6">See how TradeSuite can save you 12+ hours per week.</p>
        
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <input type="hidden" name="trade" value={trade || ''} />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            Get Your Free Demo
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-sm text-gray-500">
            No credit card required
          </p>
        </div>
      </form>
    </FadeIn>
  );
}

// Inline demo form for embedding in pages
export function InlineDemoForm({ trade }: { trade?: string }) {
  return <DemoForm trade={trade} variant="inline" />;
}