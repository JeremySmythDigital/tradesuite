import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, Thermometer, Wind, FileText, DollarSign, Calendar, Shield, Snowflake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HVAC CRM - TradeSuite',
  description: 'The CRM built specifically for HVAC contractors. Manage installations, service calls, maintenance contracts, and more.',
  keywords: 'HVAC CRM, HVAC contractor software, HVAC scheduling, maintenance contract tracking',
};

const features = [
  { icon: Thermometer, title: 'Service Calls', description: 'Track emergency calls, scheduled maintenance, and seasonal tune-ups.' },
  { icon: Wind, title: 'Installations', description: 'Manage equipment specs, permits, and installation timelines.' },
  { icon: Calendar, title: 'Maintenance Plans', description: 'Schedule recurring services and send automatic reminders.' },
  { icon: Snowflake, title: 'Seasonal Prep', description: 'Track pre-season inspections and equipment readiness.' },
  { icon: DollarSign, title: 'Invoicing', description: 'Create invoices for parts, labor, and service contracts.' },
  { icon: Shield, title: 'Warranty Tracking', description: 'Manage equipment warranties and manufacturer rebates.' },
];

const stats = [
  { value: '52%', label: 'Faster invoicing' },
  { value: '4.1x', label: 'Maintenance plan renewals' },
  { value: '10hrs', label: 'Saved per week' },
  { value: '99%', label: 'Customer satisfaction' },
];

const testimonials = [
  { name: 'Tom Anderson', company: 'Comfort Air HVAC', quote: 'Maintenance contracts used to fall through the cracks. Now my customers get reminded automatically.' },
  { name: 'Jennifer Park', company: 'Climate Control Pros', quote: 'Seasonal prep is a breeze. I know exactly which units need inspection before summer rush.' },
];

export default function HVACPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=hvac" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                The CRM Built for <span className="text-yellow-300">HVAC Pros</span>
              </h1>
              <p className="text-xl text-orange-100 mb-8">
                Installation quotes. Service calls. Maintenance contracts. Seasonal prep.
                <br />Everything you need to stay cool (or warm) all year.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?trade=hvac" className="px-8 py-4 bg-white text-orange-700 rounded-xl hover:bg-orange-50 transition-colors font-bold text-lg shadow-lg">
                  Start Free Trial
                </Link>
                <Link href="#features" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors font-medium text-lg">
                  See Features
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                  <p className="text-3xl font-bold text-yellow-300">{stat.value}</p>
                  <p className="text-orange-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">HVAC Features That Keep You Running</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From emergency calls to annual maintenance, everything organized in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all bg-gray-50">
                <feature.icon className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">What HVAC Contractors Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((item) => (
              <div key={item.name} className="bg-white p-8 rounded-xl shadow-sm">
                <p className="text-gray-700 mb-4 italic">"{item.quote}"</p>
                <p className="font-bold">{item.name}</p>
                <p className="text-gray-500 text-sm">{item.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-4xl text-white mb-6">Ready to Stay Cool Under Pressure?</h2>
          <p className="text-orange-100 text-xl mb-8">Join 600+ HVAC contractors who stay organized year-round.</p>
          <Link href="/signup?trade=hvac" className="inline-block px-8 py-4 bg-white text-orange-700 rounded-xl hover:bg-orange-50 transition-colors font-bold text-lg shadow-lg">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-white">TradeSuite</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}