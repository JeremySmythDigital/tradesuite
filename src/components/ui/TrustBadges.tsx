'use client';

import { Shield, Lock, Clock, Server, Cloud, ShieldCheck } from 'lucide-react';
import { ScaleIn } from './Motion';

interface TrustBadgeProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

// HONEST badges - only things we can actually claim
const badges = [
  { icon: Lock, label: 'Secure by Design', description: 'Built with security best practices' },
  { icon: Shield, label: 'Data Encrypted', description: 'TLS 1.3 in transit, encrypted at rest' },
  { icon: Cloud, label: 'Cloud Hosted', description: 'Reliable cloud infrastructure' },
  { icon: Clock, label: 'Fast Performance', description: 'Optimized for speed' },
  { icon: Server, label: '99%+ Uptime Goal', description: 'Built for reliability' },
  { icon: ShieldCheck, label: 'Privacy First', description: 'Your data stays yours' },
];

// Remove fake awards - only show integrations that are actually available
const integrations = [
  { name: 'Stripe', label: 'Payments' },
  { name: 'QuickBooks', label: 'Accounting' },
  { name: 'Twilio', label: 'SMS' },
  { name: 'Google', label: 'Calendar' },
];

export function TrustBadges({ variant = 'full', className = '' }: TrustBadgeProps) {
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
        {badges.slice(0, 3).map((badge) => (
          <ScaleIn key={badge.label}>
            <div className="flex items-center gap-2 text-gray-600">
              <badge.icon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          </ScaleIn>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg">
                <badge.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{badge.label}</p>
                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-1">Built for Trade Professionals</h3>
        <p className="text-sm text-gray-600">Modern software, straightforward pricing</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {badges.map((badge, index) => (
          <ScaleIn key={badge.label} delay={index * 0.05}>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <badge.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900 text-sm">{badge.label}</p>
              <p className="text-xs text-gray-500">{badge.description}</p>
            </div>
          </ScaleIn>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {integrations.map((integration) => (
          <div key={integration.name} className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
            <span className="font-bold text-gray-900">{integration.name}</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
              {integration.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Security badges for footer/auth pages - HONEST claims only
export function SecurityBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 ${className}`}>
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4" />
        <span>Encrypted Data</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4" />
        <span>Secure Infrastructure</span>
      </div>
      <div className="flex items-center gap-2">
        <Cloud className="w-4 h-4" />
        <span>Cloud Hosted</span>
      </div>
    </div>
  );
}