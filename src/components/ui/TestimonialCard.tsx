'use client';

import { motion } from 'framer-motion';
import { Quote, Star, Building2 } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  company: string;
  quote: string;
  rating?: number;
  trade?: string;
  variant?: 'default' | 'featured';
  delay?: number;
}

// Generate consistent avatar based on name
function getAvatarUrl(name: string, size: number = 64): string {
  const encodedName = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=f59e0b&textColor=ffffff&fontSize=32&size=${size}`;
}

export function TestimonialCard({ 
  name, 
  company, 
  quote, 
  rating = 5, 
  trade,
  variant = 'default',
  delay = 0 
}: TestimonialCardProps) {
  const isFeatured = variant === 'featured';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className={`${isFeatured ? 'md:col-span-2' : ''} relative overflow-hidden ${isFeatured ? 'p-10' : 'p-8'} rounded-2xl ${isFeatured ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'} shadow-sm border border-gray-100 hover:shadow-lg transition-shadow`}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
      
      {/* Avatar and info */}
      <div className="flex items-start gap-4 mb-4">
        <img 
          src={getAvatarUrl(name, isFeatured ? 80 : 56)}
          alt={`${name}'s avatar`}
          className={`${isFeatured ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-gray-200`}
        />
        <div className="flex-1">
          <h4 className={`font-bold text-gray-900 ${isFeatured ? 'text-xl' : 'text-lg'}`}>{name}</h4>
          <div className="flex items-center gap-2 text-gray-500">
            <Building2 className="w-4 h-4" />
            <span className={isFeatured ? 'text-base' : 'text-sm'}>{company}</span>
          </div>
          {trade && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
              {trade}
            </span>
          )}
        </div>
      </div>
      
      {/* Rating stars */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
          />
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className={`text-gray-700 ${isFeatured ? 'text-lg leading-relaxed' : ''}`}>
        &ldquo;{quote}&rdquo;
      </blockquote>
    </motion.div>
  );
}

export function TestimonialGrid({ testimonials }: { testimonials: Array<{ name: string; company: string; quote: string; trade?: string }> }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {testimonials.map((item, index) => (
        <TestimonialCard 
          key={item.name}
          {...item}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}

// Trust badges section
export function TrustBadges() {
  const badges = [
    { value: '850+', label: 'Electricians' },
    { value: '420+', label: 'Plumbers' },
    { value: '600+', label: 'HVAC Pros' },
    { value: '350+', label: 'Landscapers' },
    { value: '280+', label: 'Roofers' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-wrap justify-center gap-8 py-8"
    >
      {badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div className="text-2xl font-bold text-gray-900">{badge.value}</div>
          <div className="text-sm text-gray-500">{badge.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}