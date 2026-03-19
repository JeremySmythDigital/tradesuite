import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, Zap, FileText, DollarSign, Calendar, Shield, Building, Gamepad2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Electrician CRM - TradeSuite',
  description: 'The CRM built specifically for electricians. Manage service calls, panel upgrades, inspections, and more.',
  keywords: 'electrician CRM, electrical contractor software, electrical scheduling, service call tracking',
};

const features = [
  { icon: Zap, title: 'Service Calls', description: 'Track emergency calls, scheduled maintenance, and installations.' },
  { icon: Building, title: 'Panel Upgrades', description: 'Manage upgrade quotes, permits, and installation schedules.' },
  { icon: FileText, title: 'Estimates', description: 'Create professional quotes with material and labor breakdowns.' },
  { icon: Shield, title: 'Inspections', description: 'Track inspection dates, permit statuses, and compliance.' },
  { icon: DollarSign, title: 'Invoicing', description: 'Send invoices, track payments, and manage aging reports.' },
  { icon: Calendar, title: 'Scheduling', description: 'Calendar view of all jobs, team availability, and reminders.' },
];

const stats = [
  { value: '45%', label: 'Faster invoicing' },
  { value: '3.8x', label: 'Quote-to-close rate' },
  { value: '12hrs', label: 'Saved per week' },
  { value: '98%', label: 'Customer satisfaction' },
];

const testimonials = [
  { name: 'Mike Roberts', company: 'Roberts Electric LLC', quote: 'Panel upgrade quotes used to take me an hour. Now I crank them out in 10 minutes.' },
  { name: 'Sarah Chen', company: 'Bright Spark Electric', quote: 'Finally, software that understands what electricians actually do. No more generic CRMs.' },
];

export default function ElectricianPage() {
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
              <Link href="/electrician/game" className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                <Gamepad2 className="w-4 h-4" />
                Play Game
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=electrician" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                The CRM Built for <span className="text-yellow-200">Electricians</span>
              </h1>
              <p className="text-xl text-yellow-100 mb-8">
                Service calls. Panel upgrades. Inspections. Remodels.
                <br />Stop juggling spreadsheets. Start closing more jobs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?trade=electrician" className="px-8 py-4 bg-white text-orange-700 rounded-xl hover:bg-yellow-50 transition-colors font-bold text-lg shadow-lg">
                  Start Free Trial
                </Link>
                <Link href="/electrician/game" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors font-medium text-lg flex items-center gap-2 justify-center">
                  <Gamepad2 className="w-5 h-5" />
                  Try the Simulator
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                  <p className="text-3xl font-bold text-yellow-200">{stat.value}</p>
                  <p className="text-yellow-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Game Promo Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                🎮 Try the Electrician Business Simulator
              </h2>
              <p className="text-purple-100 text-lg mb-6">
                Run your own electrical business for 30 days. Take jobs, manage customers, and see why electricians love TradeSuite.
              </p>
              <ul className="text-purple-100 space-y-2 mb-6">
                <li>✓ Learn to prioritize emergency calls</li>
                <li>✓ See how jobs affect your revenue</li>
                <li>✓ Experience what TradeSuite manages for you</li>
              </ul>
              <Link
                href="/electrician/game"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-50 transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
                Play Now - Takes 2 Minutes
              </Link>
            </div>
            <div className="md:w-1/2 bg-white/10 backdrop-blur rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-4xl font-bold">30</p>
                  <p className="text-sm">Days Simulated</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-4xl font-bold">$$</p>
                  <p className="text-sm">Revenue Tracking</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-4xl font-bold">⚡</p>
                  <p className="text-sm">Emergency Jobs</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-4xl font-bold">📊</p>
                  <p className="text-sm">Business Stats</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">Built for Electrical Contractors</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to run your electrical business. No custom fields. No workarounds.
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
            <h2 className="font-bold text-4xl mb-4">What Electricians Say</h2>
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

      <section className="py-24 bg-yellow-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-4xl text-white mb-6">Ready to Power Up Your Business?</h2>
          <p className="text-yellow-100 text-xl mb-8">Join 850+ electricians who close more jobs with TradeSuite.</p>
          <Link href="/signup?trade=electrician" className="inline-block px-8 py-4 bg-white text-yellow-700 rounded-xl hover:bg-yellow-50 transition-colors font-bold text-lg shadow-lg">
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