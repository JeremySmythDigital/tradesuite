import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, Droplet, FileText, DollarSign, Calendar, MapPin, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Plumber CRM - TradeSuite',
  description: 'The CRM built specifically for plumbers. Manage service calls, installations, inspections, and more.',
  keywords: 'plumber CRM, plumbing contractor software, plumbing scheduling, service call tracking',
};

const features = [
  { icon: Droplet, title: 'Service Calls', description: 'Track emergency calls, drain cleaning, and repairs.' },
  { icon: Wrench, title: 'Installations', description: 'Manage water heaters, fixtures, and piping projects.' },
  { icon: FileText, title: 'Estimates', description: 'Create accurate quotes with parts and labor breakdown.' },
  { icon: MapPin, title: 'Site Notes', description: 'Save property details, shut-off locations, and access codes.' },
  { icon: DollarSign, title: 'Invoicing', description: 'Send invoices, collect payments, and track aging.' },
  { icon: Calendar, title: 'Scheduling', description: 'Dispatch techs efficiently and reduce drive time.' },
];

const stats = [
  { value: '52%', label: 'Faster invoicing' },
  { value: '4.2x', label: 'Quote-to-close rate' },
  { value: '10hrs', label: 'Saved per week' },
  { value: '97%', label: 'Customer satisfaction' },
];

const testimonials = [
  { name: 'Joe Martinez', company: 'Clear Flow Plumbing', quote: 'I used to lose track of which houses had what fixtures. Now every property has photos and notes.' },
  { name: 'Dan Thompson', company: 'Thompson Plumbing Co', quote: 'Emergency calls at 2am? My dispatch sees the schedule on their phone. Game changer.' },
];

export default function PlumberPage() {
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
              <Link href="/signup?trade=plumber" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                The CRM Built for <span className="text-blue-200">Plumbers</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Emergency calls. Drain cleaning. Water heaters. Remodels.
                <br />Every job tracked. Every customer happy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?trade=plumber" className="px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-colors font-bold text-lg shadow-lg">
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
                  <p className="text-3xl font-bold text-blue-200">{stat.value}</p>
                  <p className="text-blue-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">Plumbing Features That Work</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From emergency calls to full remodels. Tools built for how plumbers actually work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all bg-gray-50">
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
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
            <h2 className="font-bold text-4xl mb-4">What Plumbers Say</h2>
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

      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-4xl text-white mb-6">Ready to Stop Leaking Revenue?</h2>
          <p className="text-blue-100 text-xl mb-8">Join 420+ plumbers who get paid faster with TradeSuite.</p>
          <Link href="/signup?trade=plumber" className="inline-block px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-colors font-bold text-lg shadow-lg">
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
