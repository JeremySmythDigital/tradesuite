import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Briefcase, Droplet, FileText, DollarSign, Calendar, MapPin, Wrench, Gamepad2 } from 'lucide-react';
import { FadeIn, ScaleIn, BlurBlob } from '@/components/ui/Motion';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { Footer } from '@/components/ui/Footer';
import { TradeMobileNav } from '@/components/ui/MobileNav';
import { generateTradeMetadata, generateTradeViewport } from '@/lib/metadata';

export const metadata: Metadata = generateTradeMetadata('plumber');
export const viewport: Viewport = generateTradeViewport('plumber');

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


export default function PlumberPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <BlurBlob color="blue" className="top-0 -right-48 opacity-40" />
      <BlurBlob color="cyan" className="bottom-96 -left-48 opacity-30" />
      
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/plumber/game" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-md">
                <Gamepad2 className="w-4 h-4" />
                Play Simulator
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=plumber" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
            
            {/* Mobile Nav */}
            <TradeMobileNav trade="plumber" tradeColor="blue" signupLink="/signup?trade=plumber" gameLink="/plumber/game" />
          </div>
        </div>
      </header>

      {/* Game Promo Banner */}
      <section className="bg-gradient-to-r from-blue-500 to-cyan-600 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white">
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">NEW: Try the Plumber Business Simulator</span>
            </div>
            <Link href="/plumber/game" className="px-4 py-1.5 bg-white text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
              Play Now - Takes 3 Minutes →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-20 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                  The CRM Built for <span className="text-blue-200">Plumbers</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-xl text-blue-100 mb-8">
                  Emergency calls. Drain cleaning. Water heaters. Remodels.
                  <br />Every job tracked. Every customer happy.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup?trade=plumber" className="px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Start Free Trial
                  </Link>
                  <Link href="/plumber/game" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-medium text-lg flex items-center gap-2 justify-center">
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
                    <p className="text-3xl font-bold text-blue-200">{stat.value}</p>
                    <p className="text-blue-100">{stat.label}</p>
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
                Stop Leaking Revenue
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Every plumber loses money to disorganization. Emergency calls get buried.
                Follow-ups get forgotten. Invoices don&apos;t get sent.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0.2}>
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-red-800 text-lg mb-4">❌ Without TradeSuite</h3>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Emergency calls lost in text threads</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Customer info scattered across apps</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Forget to invoice completed jobs</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Can&apos;t quote jobs on the spot</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>No idea which jobs are profitable</li>
                </ul>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-4">✓ With TradeSuite</h3>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Emergency calls highlighted instantly</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>All customer info in one dashboard</li>
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
                href="/plumber/game"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md"
              >
                <Gamepad2 className="w-5 h-5" />
                See the Difference - Play the Simulator
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="features" className="py-24 bg-gray-50 relative">
        <BlurBlob color="blue" className="top-0 left-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl mb-4 font-display">Plumbing Features That Work</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                From emergency calls to full remodels. Tools built for how plumbers actually work.
              </p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScaleIn key={feature.title} delay={index * 0.1}>
                <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all bg-white group">
                  <feature.icon className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl mb-4 font-display">Built for Plumbing Professionals</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to run your plumbing business. No custom fields. No workarounds.
              </p>
            </FadeIn>
          </div>
          <TrustBadges />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <FadeIn>
            <h2 className="font-bold text-4xl text-white mb-6 font-display">Ready to Stop Leaking Revenue?</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-blue-100 text-xl mb-8">
              Join thousands of plumbers who trust TradeSuite to manage their business.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link href="/signup?trade=plumber" className="inline-block px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start Your Free Trial
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer trade="plumber" tradeColor="blue" />
    </div>
  );
}