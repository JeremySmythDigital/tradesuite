'use client';

import { Shield, Lock, Award, Star, Users, Clock } from 'lucide-react';
import { ScaleIn } from './Motion';

interface TrustBadgeProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

const badges = [
  { icon: Shield, label: 'SOC 2 Compliant', description: 'Enterprise-grade security' },
  { icon: Lock, label: '256-bit SSL', description: 'Encrypted data transfer' },
  { icon: Award, label: 'BBB Accredited', description: 'A+ Rating' },
  { icon: Star, label: '4.9/5 Rating', description: '500+ reviews' },
  { icon: Users, label: '10,000+ Users', description: 'Growing community' },
  { icon: Clock, label: '99.9% Uptime', description: 'Reliable service' },
];

const awards = [
  { name: 'Capterra', badge: 'Best Value 2025' },
  { name: 'G2', badge: 'High Performer' },
  { name: 'Software Advice', badge: 'FrontRunner' },
  { name: 'GetApp', badge: 'Category Leader' },
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
        <h3 className="font-bold text-lg text-gray-900 mb-1">Trusted by Trade Professionals</h3>
        <p className="text-sm text-gray-600">Enterprise-grade security and reliability</p>
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
        {awards.map((award) => (
          <div key={award.name} className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
            <span className="font-bold text-gray-900">{award.name}</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
              {award.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Security badges for footer/auth pages
export function SecurityBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 ${className}`}>
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4" />
        <span>Bank-level Security</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4" />
        <span>SOC 2 Type II</span>
      </div>
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4" />
        <span>GDPR Compliant</span>
      </div>
    </div>
  );
}