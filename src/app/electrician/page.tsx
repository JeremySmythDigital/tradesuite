import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, Zap, Shield, Clock, FileText, DollarSign, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Electrician CRM - TradeSuite',
  description: 'The CRM built specifically for electricians. Manage panel upgrades, rewiring jobs, inspections, and more.',
  keywords: 'electrician CRM, electrical contractor software, electrician scheduling, panel upgrade tracking',
};

const features = [
  { icon: Zap, title: 'Panel Upgrades', description: 'Track 100-400A upgrades with material lists and progress photos.' },
  { icon: FileText, title: 'Inspection Reports', description: 'Generate professional reports for city inspections.' },
  { icon: Users, title: 'Client Portal', description: 'Homeowners view job progress and approve estimates online.' },
  { icon: Calendar, title: 'Job Scheduling', description: 'Drag-and-drop calendar for crews and trucks.' },
  { icon: DollarSign, title: 'Material Tracking', description: 'Track wire, breakers, panels by job with cost reports.' },
  { icon: Shield, title: 'License Management', description: 'Never let licenses or insurance expire unnoticed.' },
];

const stats = [
  { value: '43%', label: 'Faster invoicing' },
  { value: '2.8x', label: 'More estimates closed' },
  { value: '8hrs', label: 'Saved per week' },
  { value: '99%', label: 'Customer satisfaction' },
];

const testimonials = [
  { name: 'Mike Rodriguez', company: 'Rodriguez Electric', quote: 'Finally, software that understands my business. Panel upgrades used to be a paperwork nightmare.' },
  { name: 'Sarah Chen', company: 'Bright Spark Electric', quote: 'The inspection report generator alone saves me hours every week.' },
];

export default function ElectricianPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=electrician" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                The CRM Built for <span className="text-yellow-400">Electricians</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Panel upgrades. Rewiring. Service calls. Inspections.
                <br />Stop fumbling with spreadsheets. Get software that speaks your language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?trade=electrician" className="px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-colors font-bold text-lg shadow-lg">
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
                  <p className="text-blue-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">Built for How You Work</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every feature designed by electricians, for electricians. No generic CRM workarounds.
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

      {/* Testimonials */}
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

      {/* Workflow */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">From Call to Payment in 4 Steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Call Comes In', desc: 'Log the service call, capture client details automatically.' },
              { step: '2', title: 'Estimate Sent', desc: 'Pre-built templates for common jobs like panel upgrades.' },
              { step: '3', title: 'Work Done', desc: 'Track progress, materials, and hours in real-time.' },
              { step: '4', title: 'Get Paid', desc: 'Invoice on the spot, accept card payments, done.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-4xl text-white mb-6">Ready to Grow Your Electrical Business?</h2>
          <p className="text-blue-100 text-xl mb-8">Join 500+ electricians who switched from paper to TradeSuite.</p>
          <Link href="/signup?trade=electrician" className="inline-block px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-colors font-bold text-lg shadow-lg">
            Start Your Free Trial
          </Link>
          <p className="text-blue-200 text-sm mt-4">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-white">TradeSuite</span>
            </Link>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/support" className="hover:text-white">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}