import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Briefcase, Zap, FileText, DollarSign, Calendar, Shield, Building, Gamepad2, Menu } from 'lucide-react';
import { FadeIn, FadeInUp, ScaleIn, BlurBlob } from '@/components/ui/Motion';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { Footer } from '@/components/ui/Footer';
import { MobileNav, TradeMobileNav } from '@/components/ui/MobileNav';
import { generateTradeMetadata, generateTradeViewport } from '@/lib/metadata';

export const metadata: Metadata = generateTradeMetadata('electrician');
export const viewport: Viewport = generateTradeViewport('electrician');

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

export default function ElectricianPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Blur blob backgrounds - yellow for electricians */}
      <BlurBlob color="yellow" className="top-0 -right-48 opacity-40" />
      <BlurBlob color="orange" className="bottom-96 -left-48 opacity-30" />
      
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-amber-600" />
              <span className="font-bold text-2xl">Cypress Signal</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/electrician/game" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-md">
                <Gamepad2 className="w-4 h-4" />
                Play Simulator
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=electrician" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
            
            {/* Mobile Nav */}
            <TradeMobileNav trade="electrician" tradeColor="amber" signupLink="/signup?trade=electrician" gameLink="/electrician/game" />
          </div>
        </div>
      </header>

      {/* Game Promo Banner */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white">
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">NEW: Try the Electrician Business Simulator</span>
            </div>
            <Link href="/electrician/game" className="px-4 py-1.5 bg-white text-amber-700 rounded-lg font-medium text-sm hover:bg-amber-50 transition-colors">
              Play Now - Takes 3 Minutes →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white py-20 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                  The CRM Built for <span className="text-yellow-200">Electricians</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-xl text-yellow-100 mb-8">
                  Service calls. Panel upgrades. Inspections. Remodels.
                  <br />Stop juggling spreadsheets. Start closing more jobs.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup?trade=electrician" className="px-8 py-4 bg-white text-orange-700 rounded-xl hover:bg-yellow-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Start Free Trial
                  </Link>
                  <Link href="/electrician/game" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-medium text-lg flex items-center gap-2 justify-center">
                    <Gamepad2 className="w-5 h-5" />
                    Try the Simulator
                  </Link>
                </div>
              </FadeIn>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <FadeIn key={stat.label} delay={0.3 + index * 0.1}>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                    <p className="text-3xl font-bold text-yellow-200">{stat.value}</p>
                    <p className="text-yellow-100">{stat.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
                Stop Losing Jobs to Chaos
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Every electrician loses money to disorganization. Emergency calls get buried. 
                Follow-ups get forgotten. Invoices don&apos;t get sent.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0.2}>
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-red-800 text-lg mb-4">❌ Without Cypress Signal</h3>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Emergency calls lost in text threads</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Client info scattered across apps</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Forget to invoice completed jobs</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Can&apos;t quote jobs on the spot</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>No idea which jobs are profitable</li>
                </ul>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-4">✓ With Cypress Signal</h3>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Emergency calls highlighted instantly</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>All client info in one dashboard</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>One-click invoices after each job</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Professional quotes in 60 seconds</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Revenue tracking at a glance</li>
                </ul>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4}>
            <div className="text-center mt-8">
              <Link
                href="/electrician/game"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
              >
                <Gamepad2 className="w-5 h-5" />
                See the Difference - Play the Simulator
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="features" className="py-24 bg-gray-50 relative">
        <BlurBlob color="yellow" className="top-0 left-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl mb-4 font-display">Built for Electrical Contractors</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to run your electrical business. No custom fields. No workarounds.
              </p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScaleIn key={feature.title} delay={index * 0.1}>
                <div className="p-6 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all bg-white group">
                  <feature.icon className="w-10 h-10 text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl mb-4 font-display">Built for Electrical Contractors</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to run your electrical business. No custom fields. No workarounds.
              </p>
            </FadeIn>
          </div>
          <TrustBadges />
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-amber-500 to-orange-600 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <FadeIn>
            <h2 className="font-bold text-4xl text-white mb-6 font-display">Ready to Power Up Your Business?</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-amber-100 text-xl mb-8">Learn how Cypress Signal can help your electrical business with Cypress Signal.</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link href="/signup?trade=electrician" className="inline-block px-8 py-4 bg-white text-amber-700 rounded-xl hover:bg-amber-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start Your Free Trial
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer trade="electrician" tradeColor="amber" />
    </div>
  );
}