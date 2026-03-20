import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Briefcase, Home, Shield, FileText, DollarSign, Camera, Hammer, Gamepad2 } from 'lucide-react';
import { FadeIn, ScaleIn, BlurBlob } from '@/components/ui/Motion';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { Footer } from '@/components/ui/Footer';
import { TradeMobileNav } from '@/components/ui/MobileNav';
import { generateTradeMetadata, generateTradeViewport } from '@/lib/metadata';

export const metadata: Metadata = generateTradeMetadata('roofer');
export const viewport: Viewport = generateTradeViewport('roofer');

const features = [
  { icon: Home, title: 'Roof Inspections', description: 'Document damage with photos, measurements, and notes.' },
  { icon: Hammer, title: 'Replacement Projects', description: 'Track materials, crews, and multi-day installations.' },
  { icon: FileText, title: 'Insurance Claims', description: 'Generate reports for insurance adjusters automatically.' },
  { icon: Camera, title: 'Photo Documentation', description: 'Before/after photos organized by property and job.' },
  { icon: DollarSign, title: 'Estimates', description: 'Create detailed quotes with material and labor breakdown.' },
  { icon: Shield, title: 'Warranty Tracking', description: 'Manage manufacturer and workmanship warranties.' },
];

const stats = [
  { value: '56%', label: 'Faster estimate turnaround' },
  { value: '4.2x', label: 'More estimates closed' },
  { value: '12hrs', label: 'Saved per week' },
  { value: '98%', label: 'Customer satisfaction' },
];


export default function RooferPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <BlurBlob color="slate" className="top-0 -right-48 opacity-40" />
      <BlurBlob color="gray" className="bottom-96 -left-48 opacity-30" />
      
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-slate-600" />
              <span className="font-bold text-2xl">Cypress Signal</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/roofer/game" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg hover:from-slate-700 hover:to-slate-900 transition-all font-medium shadow-md">
                <Gamepad2 className="w-4 h-4" />
                Play Simulator
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=roofer" className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
            
            {/* Mobile Nav */}
            <TradeMobileNav trade="roofer" tradeColor="slate" signupLink="/signup?trade=roofer" gameLink="/roofer/game" />
          </div>
        </div>
      </header>

      {/* Game Promo Banner */}
      <section className="bg-gradient-to-r from-slate-600 to-slate-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white">
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">NEW: Try the Roofer Business Simulator</span>
            </div>
            <Link href="/roofer/game" className="px-4 py-1.5 bg-white text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
              Play Now - Takes 3 Minutes →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-700 to-slate-900 text-white py-20 relative overflow-hidden">
        <BlurBlob color="yellow" className="top-0 right-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                  The CRM Built for <span className="text-yellow-400">Roofing Contractors</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-xl text-slate-300 mb-8">
                  Inspections. Estimates. Insurance claims. Installations.
                  <br />Every job tracked. Every customer happy.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup?trade=roofer" className="px-8 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Start Free Trial
                  </Link>
                  <Link href="/roofer/game" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-medium text-lg flex items-center gap-2 justify-center">
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
                    <p className="text-3xl font-bold text-yellow-400">{stat.value}</p>
                    <p className="text-slate-300">{stat.label}</p>
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
                Stop Climbing Ladders for Paperwork
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Every roofer loses time to disorganization. Estimates get lost.
                Follow-ups get forgotten. Insurance claims drag on forever.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0.2}>
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-red-800 text-lg mb-4">❌ Without Cypress Signal</h3>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Estimates scribbled on paper</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Photos scattered across phones</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Insurance claims with missing info</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Forget to follow up on quotes</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Warranty tracking a nightmare</li>
                </ul>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-4">✓ With Cypress Signal</h3>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Professional estimates in 60 seconds</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>All photos organized by job</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Insurance-ready reports auto-generated</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Automatic follow-up reminders</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Warranty expiration alerts</li>
                </ul>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4}>
            <div className="text-center mt-8">
              <Link
                href="/roofer/game"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg font-medium hover:from-slate-700 hover:to-slate-900 transition-all shadow-md"
              >
                <Gamepad2 className="w-5 h-5" />
                See the Difference - Play the Simulator
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="features" className="py-24 bg-gray-50 relative">
        <BlurBlob color="slate" className="top-0 left-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl mb-4 font-display">Roofing Features That Drive Results</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                From emergency repairs to full replacements. Tools built for how roofing actually works.
              </p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScaleIn key={feature.title} delay={index * 0.1}>
                <div className="p-6 rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all bg-white group">
                  <feature.icon className="w-10 h-10 text-yellow-600 mb-4 group-hover:scale-110 transition-transform" />
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
              <h2 className="font-bold text-4xl mb-4 font-display">Built for Roofing Professionals</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to run your roofing business. No custom fields. No workarounds.
              </p>
            </FadeIn>
          </div>
          <TrustBadges />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
        <BlurBlob color="yellow" className="top-0 right-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <FadeIn>
            <h2 className="font-bold text-4xl text-white mb-6 font-display">Ready to Stop Climbing Ladders for Paperwork?</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-slate-300 text-xl mb-8">
              Join thousands of roofers who trust Cypress Signal to close more deals with better estimates.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link href="/signup?trade=roofer" className="inline-block px-8 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start Your Free Trial
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer trade="roofer" tradeColor="slate" />
    </div>
  );
}