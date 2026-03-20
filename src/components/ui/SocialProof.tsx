'use client';

import { motion } from 'framer-motion';
import { Star, Shield, Clock, Users } from 'lucide-react';

const socialProofStats = [
  { value: '2,500+', label: 'Trade Professionals', icon: Users },
  { value: '4.9/5', label: 'Average Rating', icon: Star },
  { value: '24/7', label: 'Customer Support', icon: Clock },
  { value: '99.9%', label: 'Uptime SLA', icon: Shield },
];

const logos = [
  { name: 'Roberts Electric', trade: 'electrician' },
  { name: 'Clear Flow Plumbing', trade: 'plumber' },
  { name: 'Comfort Air HVAC', trade: 'hvac' },
  { name: 'Green Acres Landscaping', trade: 'landscaper' },
  { name: 'TopTier Roofing', trade: 'roofer' },
];

export function SocialProofSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Trusted by Trade Professionals
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From solo operators to growing crews, thousands of trades have streamlined their business with TradeSuite.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {socialProofStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Logo Cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-b border-gray-200 py-8"
        >
          <p className="text-center text-gray-500 text-sm mb-6">Trusted by companies like</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600 font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                {logo.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials section for homepage
const homeTestimonials = [
  {
    name: 'Mike Roberts',
    company: 'Roberts Electric LLC',
    trade: 'Electrician',
    quote: 'Panel upgrade quotes used to take me an hour. Now I crank them out in 10 minutes. This software actually understands what electricians do.',
  },
  {
    name: 'Joe Martinez',
    company: 'Clear Flow Plumbing',
    trade: 'Plumber',
    quote: 'I used to lose track of which houses had what fixtures. Now every property has photos and notes. Game changer for my business.',
  },
  {
    name: 'Tom Anderson',
    company: 'Comfort Air HVAC',
    trade: 'HVAC',
    quote: 'Maintenance contracts used to fall through the cracks. Now my customers get reminded automatically. Revenue is predictable for the first time.',
  },
];

import { TestimonialCard } from './TestimonialCard';

export function HomeTestimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            What Trade Pros Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real stories from real trades. See how TradeSuite helps them close more jobs and get paid faster.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {homeTestimonials.map((item, index) => (
            <TestimonialCard key={item.name} {...item} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}