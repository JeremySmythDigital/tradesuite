import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, Home, Shield, FileText, DollarSign, Calendar, Camera, Hammer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Roofer CRM - TradeSuite',
  description: 'The CRM built specifically for roofing contractors. Manage roof replacements, repairs, inspections, and estimates.',
  keywords: 'roofer CRM, roofing contractor software, roofing scheduling, roof replacement tracking',
};

const features = [
  { icon: Home, title: 'Roof Inspections', description: 'Document damage with photos, measurements, and notes.' },
  { icon: Hammer, title: 'Replacement Projects', description: 'Track materials, crews, and multi-day installations.' },
  { icon: FileText, title: 'Insurance Claims', description: 'Generate reports for insurance adjusters automatically.' },
  { icon:	Camera, title: 'Photo Documentation', description: 'Before/after photos organized by property and job.' },
  { icon: DollarSign, title: 'Estimates', description: 'Create detailed quotes with material and labor breakdown.' },
  { icon: Shield, title: 'Warranty Tracking', description: 'Manage manufacturer and workmanship warranties.' },
];

const stats = [
  { value: '56%', label: 'Faster estimate turnaround' },
  { value: '4.2x', label: 'More estimates closed' },
  { value: '12hrs', label: 'Saved per week' },
  { value: '98%', label: 'Customer satisfaction' },
];

const testimonials = [
  { name: 'Robert Martinez', company: 'TopTier Roofing', quote: 'Insurance claims used to eat my weekends. Now I generate the report in 5 minutes.' },
  { name: 'James Wilson', company: 'Wilson & Sons Roofing', quote: 'Photo documentation is a game changer. Customers can see exactly what needs fixing.' },
];

export default function RooferPage() {
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
              <Link href="/signup?trade=roofer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-slate-700 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                The CRM Built for <span className="text-yellow-400">Roofers</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Inspections. Replacements. Repairs. Insurance claims.
                <br />From first call to final warranty, all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?trade=roofer" className="px-8 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-colors font-bold text-lg shadow-lg">
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
                  <p className="text-3xl font-bold text-yellow-400">{stat.value}</p>
                  <p className="text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">Roofing Features That Drive Results</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From emergency repairs to full replacements. Tools built for how roofing actually works.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all bg-gray-50">
                <feature.icon className="w-10 h-10 text-yellow-600 mb-4" />
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
            <h2 className="font-bold text-4xl mb-4">What Roofers Say</h2>
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

      <section className="py-24 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-4xl text-white mb-6">Ready to Stop Climbing Ladders for Paperwork?</h2>
          <p className="text-slate-300 text-xl mb-8">Join 280+ roofers who close more deals with better estimates.</p>
          <Link href="/signup?trade=roofer" className="inline-block px-8 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-colors font-bold text-lg shadow-lg">
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