import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, FileText, DollarSign, Calendar, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'TradeSuite - The CRM Built for Your Trade',
  description: 'Trade-specific CRM for electricians, plumbers, HVAC, landscapers, and roofers. Manage clients, jobs, estimates, invoices, and scheduling.',
  keywords: 'electrician CRM, plumber software, HVAC scheduling, landscaper management, roofing estimates',
};

const trades = [
  { name: 'Electrician', href: '/electrician' },
  { name: 'Plumber', href: '/plumber' },
  { name: 'HVAC', href: '/hvac' },
  { name: 'Landscaper', href: '/landscaper' },
  { name: 'Roofer', href: '/roofer' },
];

const features = [
  {
    icon: Users,
    title: 'Client Management',
    description: 'Track all your clients, contacts, and job history in one place.',
  },
  {
    icon: Briefcase,
    title: 'Job Tracking',
    description: "From first call to final invoice - manage every job's progress.",
  },
  {
    icon: FileText,
    title: 'Estimates',
    description: 'Create professional estimates in seconds with industry templates.',
  },
  {
    icon: DollarSign,
    title: 'Invoicing',
    description: 'Send invoices, track payments, and get paid faster.',
  },
  {
    icon: Calendar,
    title: 'Scheduling',
    description: 'Calendar view of all jobs, appointments, and team availability.',
  },
  {
    icon: TrendingUp,
    title: 'Reports',
    description: 'Revenue, win rates, and productivity insights at a glance.',
  },
];

const workflow = [
  { step: '1', title: 'Lead Comes In', description: 'Capture every call, text, and web inquiry automatically.' },
  { step: '2', title: 'Create Estimate', description: 'Use industry templates to build estimates in 30 seconds.' },
  { step: '3', title: 'Schedule Job', description: 'Assign team, track progress, and keep clients updated.' },
  { step: '4', title: 'Invoice & Get Paid', description: 'Send invoices with payment links. Track overdue payments.' },
];

const pricing = [
  {
    name: 'Solo',
    price: '$29',
    period: '/month',
    description: 'For individuals and single-owner businesses.',
    features: ['Unlimited clients', 'Estimates & invoices', 'Scheduling calendar', 'Industry templates', '1 user'],
    cta: 'Start Free Trial',
    ctaLink: '/signup?plan=solo',
    highlighted: false,
  },
  {
    name: 'Team',
    price: '$79',
    period: '/month',
    description: 'For crews with 2-5 team members.',
    features: ['Everything in Solo', 'Up to 5 users', 'Team scheduling', 'Client portal', 'Priority support'],
    cta: 'Start Free Trial',
    ctaLink: '/signup?plan=team',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$149',
    period: '/month',
    description: 'For larger teams and growing companies.',
    features: ['Everything in Team', 'Unlimited users', 'API access', 'Custom branding', 'Dedicated support'],
    cta: 'Contact Us',
    ctaLink: '/signup?plan=business',
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6">
            The CRM Built for<span className="text-blue-600"> Your Trade</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Electricians. Plumbers. HVAC techs. Landscapers. Roofers.
            <br />Stop using generic CRMs. Get software that speaks your language.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg shadow-blue-600/25">
              Start Free Trial
            </Link>
            <a href="#features" className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-colors font-medium text-lg border border-gray-300">
              See How It Works
            </a>
          </div>
        </div>

        {/* Trade Selection */}
        <div className="mt-16">
          <h2 className="text-center text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">
            Select Your Trade
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {trades.map((trade) => (
              <Link
                key={trade.name}
                href={trade.href}
                className="px-6 py-4 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 transition-all group"
              >
                <span className="block mt-2 font-medium text-gray-700 group-hover:text-gray-900">
                  {trade.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl mb-4">Everything You Need, Nothing You Don&apos;t</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Trade-specific features built from day one. No custom fields. No workarounds.
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

      {/* Workflow */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl mb-4">Built for How You Work</h2>
            <p className="text-gray-600 text-lg">From first call to final payment - all in one place.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl md:text-5xl mb-4">Simple, Honest Pricing</h2>
            <p className="text-gray-600 text-lg">No per-feature gates. No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl ${
                  plan.highlighted
                    ? 'border-2 border-blue-500 bg-white shadow-xl relative'
                    : 'border border-gray-200 bg-gray-50'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-bold text-2xl mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-blue-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 text-center font-bold ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25'
                      : 'border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-4xl md:text-5xl text-white mb-6">
            Ready to Streamline Your Business?
          </h2>
          <p className="text-blue-100 text-xl mb-8">
            Join thousands of trade professionals who&apos;ve simplified their workflow.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-colors font-bold text-lg shadow-lg"
          >
            Start Your 14-Day Free Trial
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
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} TradeSuite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}