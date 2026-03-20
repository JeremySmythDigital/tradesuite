import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Briefcase, Thermometer, Wind, FileText, DollarSign, Calendar, Shield, Snowflake, Gamepad2 } from 'lucide-react';
import { FadeIn, ScaleIn, BlurBlob } from '@/components/ui/Motion';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { Footer } from '@/components/ui/Footer';
import { TradeMobileNav } from '@/components/ui/MobileNav';
import { generateTradeMetadata, generateTradeViewport } from '@/lib/metadata';

export const metadata: Metadata = generateTradeMetadata('hvac');
export const viewport: Viewport = generateTradeViewport('hvac');

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


export default function HVACPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <BlurBlob color="orange" className="top-0 -right-48 opacity-40" />
      <BlurBlob color="red" className="bottom-96 -left-48 opacity-30" />
      
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-orange-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/hvac/game" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-md">
                <Gamepad2 className="w-4 h-4" />
                Play Simulator
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=hvac" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
            
            {/* Mobile Nav */}
            <TradeMobileNav trade="hvac" tradeColor="orange" signupLink="/signup?trade=hvac" gameLink="/hvac/game" />
          </div>
        </div>
      </header>

      {/* Game Promo Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white">
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">NEW: Try the HVAC Business Simulator</span>
            </div>
            <Link href="/hvac/game" className="px-4 py-1.5 bg-white text-orange-700 rounded-lg font-medium text-sm hover:bg-orange-50 transition-colors">
              Play Now - Takes 3 Minutes →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-20 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                  The CRM Built for <span className="text-yellow-300">HVAC Pros</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-xl text-orange-100 mb-8">
                  Installation quotes. Service calls. Maintenance contracts. Seasonal prep.
                  <br />Everything you need to stay cool (or warm) all year.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup?trade=hvac" className="px-8 py-4 bg-white text-orange-700 rounded-xl hover:bg-orange-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Start Free Trial
                  </Link>
                  <Link href="/hvac/game" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-medium text-lg flex items-center gap-2 justify-center">
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
                    <p className="text-3xl font-bold text-yellow-300">{stat.value}</p>
                    <p className="text-orange-100">{stat.label}</p>
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
                Every HVAC contractor loses money to disorganization. Maintenance contracts slip through the cracks. Follow-ups get forgotten.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0.2}>
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-red-800 text-lg mb-4">❌ Without TradeSuite</h3>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Maintenance contracts fall through cracks</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Customer info scattered across apps</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Forget seasonal prep reminders</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Can&apos;t track warranty expiration</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>No idea which jobs are profitable</li>
                </ul>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-4">✓ With TradeSuite</h3>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Auto reminders for maintenance contracts</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>All customer info in one dashboard</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Seasonal prep alerts automated</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Warranty tracking built in</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Revenue tracking at a glance</li>
                </ul>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4}>
            <div className="text-center mt-8">
              <Link
                href="/hvac/game"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
              >
                <Gamepad2 className="w-5 h-5" />
                See the Difference - Play the Simulator
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="features" className="py-24 bg-gray-50 relative">
        <BlurBlob color="orange" className="top-0 left-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl mb-4 font-display">HVAC Features That Keep You Running</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                From emergency calls to annual maintenance, everything organized in one place.
              </p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScaleIn key={feature.title} delay={index * 0.1}>
                <div className="p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all bg-white group">
                  <feature.icon className="w-10 h-10 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
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
              <h2 className="font-bold text-4xl mb-4 font-display">What HVAC Contractors Say</h2>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((item, index) => (
              <TestimonialCard key={item.name} {...item} delay={index * 0.1} />
            ))}
          </div>
          <TrustBadges />
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-orange-500 to-red-600 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <FadeIn>
            <h2 className="font-bold text-4xl text-white mb-6 font-display">Ready to Stay Cool Under Pressure?</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-orange-100 text-xl mb-8">Learn how TradeSuite can help your HVAC business who stay organized year-round.</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link href="/signup?trade=hvac" className="inline-block px-8 py-4 bg-white text-orange-700 rounded-xl hover:bg-orange-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start Your Free Trial
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer trade="hvac" tradeColor="orange" />
    </div>
  );
}