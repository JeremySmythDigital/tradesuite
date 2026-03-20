import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, FileText, DollarSign, Calendar, TrendingUp, Menu } from 'lucide-react';
import { FadeIn, FadeInUp, ScaleIn, BlurBlob } from '@/components/ui/Motion';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { SocialProofSection, HomeTestimonials } from '@/components/ui/SocialProof';
import { Footer } from '@/components/ui/Footer';
import { MobileNav } from '@/components/ui/MobileNav';
import { ROICalculator } from '@/components/ui/ROICalculator';
import { DemoForm } from '@/components/ui/DemoForm';
import { LiveChatWidget } from '@/components/ui/LiveChatWidget';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { baseMetadata, viewport } from '@/lib/metadata';

export const metadata: Metadata = baseMetadata;
export { viewport };

const trades = [
  { name: 'Electrician', href: '/electrician', color: 'from-yellow-500 to-orange-500', hoverColor: 'hover:border-yellow-400' },
  { name: 'Plumber', href: '/plumber', color: 'from-blue-500 to-cyan-500', hoverColor: 'hover:border-blue-400' },
  { name: 'HVAC', href: '/hvac', color: 'from-orange-500 to-red-500', hoverColor: 'hover:border-orange-400' },
  { name: 'Landscaper', href: '/landscaper', color: 'from-green-500 to-emerald-500', hoverColor: 'hover:border-green-400' },
  { name: 'Roofer', href: '/roofer', color: 'from-slate-600 to-slate-800', hoverColor: 'hover:border-slate-400' },
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Blur blob backgrounds */}
      <BlurBlob color="blue" className="top-0 -left-48 opacity-50" />
      <BlurBlob color="yellow" className="top-96 -right-48 opacity-40" />
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
            
            {/* Mobile Nav */}
            <MobileNav />
          </div>
        </nav>
      </header>

      {/* Hero with Demo Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Hero Content */}
          <div className="text-center lg:text-left">
            <FadeIn>
              <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 font-display">
                The CRM Built for<span className="text-blue-600"> Your Trade</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto lg:mx-0 mb-8">
                Electricians. Plumbers. HVAC techs. Landscapers. Roofers.
                <br className="hidden md:block" />Stop using generic CRMs. Get software that speaks your language.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5">
                  Start Free Trial
                </Link>
                <a href="#features" className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-medium text-lg border border-gray-300 hover:border-gray-400">
                  See How It Works
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-3">No credit card required • 14-day free trial</p>
            </FadeIn>
          </div>

          {/* Right - Demo Form */}
          <FadeIn delay={0.3}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100 rounded-full translate-y-12 -translate-x-12 opacity-50" />
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">Get Your Free Demo</h3>
                <p className="text-gray-600 mb-6">See how TradeSuite saves you 12+ hours per week.</p>
                <DemoForm />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Trade Selection */}
        <div className="mt-16">
          <FadeIn delay={0.3}>
            <h2 className="text-center text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">
              Select Your Trade
            </h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-4">
            {trades.map((trade, index) => (
              <FadeIn key={trade.name} delay={0.4 + index * 0.1}>
                <Link
                  href={trade.href}
                  className={`px-6 py-4 rounded-xl border-2 border-gray-200 bg-white ${trade.hoverColor} transition-all group flex flex-col items-center`}
                >
                  <span className={`font-medium text-gray-700 group-hover:text-gray-900`}>
                    {trade.name}
                  </span>
                  <div className={`mt-2 h-1 w-16 rounded-full bg-gradient-to-r ${trade.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProofSection />

      {/* Features */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl md:text-5xl mb-4 font-display">Everything You Need, Nothing You Don&apos;t</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Trade-specific features built from day one. No custom fields. No workarounds.
              </p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScaleIn key={feature.title} delay={index * 0.1}>
                <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all bg-gray-50 group">
                  <feature.icon className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-24 bg-gray-50 relative">
        <BlurBlob color="orange" className="top-0 right-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl md:text-5xl mb-4 font-display">Built for How You Work</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg">From first call to final payment - all in one place.</p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <FadeIn key={step.step} delay={index * 0.15}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <HomeTestimonials />

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl md:text-5xl mb-4 font-display">Simple, Honest Pricing</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg">No per-feature gates. No hidden fees. Cancel anytime.</p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <ScaleIn key={plan.name} delay={index * 0.1}>
                <div
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
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges variant="full" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 left-0 opacity-10" />
        <BlurBlob color="white" className="bottom-0 right-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <FadeIn>
            <h2 className="font-bold text-4xl md:text-5xl text-white mb-6 font-display">
              Ready to Streamline Your Business?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-blue-100 text-xl mb-8">
              Join thousands of trade professionals who&apos;ve simplified their workflow.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Your 14-Day Free Trial
            </Link>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-blue-200 text-sm mt-4">No credit card required. Cancel anytime.</p>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      
      {/* Live Chat Widget */}
      <LiveChatWidget company="TradeSuite" primaryColor="#2563eb" />
    </div>
  );
}