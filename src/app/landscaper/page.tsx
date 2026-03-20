import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Briefcase, TreePine, Truck, FileText, DollarSign, Calendar, MapPin, Leaf, Gamepad2 } from 'lucide-react';
import { FadeIn, ScaleIn, BlurBlob } from '@/components/ui/Motion';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { Footer } from '@/components/ui/Footer';
import { TradeMobileNav } from '@/components/ui/MobileNav';
import { generateTradeMetadata, generateTradeViewport } from '@/lib/metadata';

export const metadata: Metadata = generateTradeMetadata('landscaper');
export const viewport: Viewport = generateTradeViewport('landscaper');

const features = [
  { icon: Leaf, title: 'Maintenance Routes', description: 'Schedule weekly/bi-weekly visits and track crew locations.' },
  { icon: TreePine, title: 'Design Projects', description: 'Manage design consultations, plant lists, and project timelines.' },
  { icon: Truck, title: 'Equipment Tracking', description: 'Know which trucks have which tools and equipment.' },
  { icon: Calendar, title: 'Seasonal Services', description: 'Track snow removal, spring cleanups, and fall prep.' },
  { icon: DollarSign, title: 'Invoicing', description: 'Bill maintenance contracts and one-time projects separately.' },
  { icon: MapPin, title: 'Site Mapping', description: 'Save property layouts, irrigation zones, and notes per site.' },
];

const stats = [
  { value: '47%', label: 'Faster invoicing' },
  { value: '3.5x', label: 'Contract renewals' },
  { value: '8hrs', label: 'Saved per week' },
  { value: '97%', label: 'Customer satisfaction' },
];


export default function LandscaperPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <BlurBlob color="green" className="top-0 -right-48 opacity-40" />
      <BlurBlob color="emerald" className="bottom-96 -left-48 opacity-30" />
      
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-green-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/landscaper/game" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-md">
                <Gamepad2 className="w-4 h-4" />
                Play Simulator
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=landscaper" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
            
            {/* Mobile Nav */}
            <TradeMobileNav trade="landscaper" tradeColor="green" signupLink="/signup?trade=landscaper" gameLink="/landscaper/game" />
          </div>
        </div>
      </header>

      {/* Game Promo Banner */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white">
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">NEW: Try the Landscaper Business Simulator</span>
            </div>
            <Link href="/landscaper/game" className="px-4 py-1.5 bg-white text-green-700 rounded-lg font-medium text-sm hover:bg-green-50 transition-colors">
              Play Now - Takes 3 Minutes →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-green-600 to-emerald-600 text-white py-20 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                  The CRM Built for <span className="text-yellow-300">Landscapers</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-xl text-green-100 mb-8">
                  Maintenance contracts. Design installs. Seasonal services. Snow removal.
                  <br />Every property organized, every crew on schedule.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup?trade=landscaper" className="px-8 py-4 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Start Free Trial
                  </Link>
                  <Link href="/landscaper/game" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-medium text-lg flex items-center gap-2 justify-center">
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
                    <p className="text-green-100">{stat.label}</p>
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
                Every landscaper loses money to disorganization. Crews go to wrong properties. Contracts slip through cracks.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0.2}>
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-red-800 text-lg mb-4">❌ Without TradeSuite</h3>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Crews show up at wrong properties</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Client info scattered across apps</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Forget contract renewals</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>Can&apos;t track which jobs are profitable</li>
                  <li className="flex items-start gap-2"><span className="text-red-500">•</span>No equipment tracking for trucks</li>
                </ul>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-4">✓ With TradeSuite</h3>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>GPS-tracked crew routes</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>All client info in one dashboard</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Auto contract renewal reminders</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Profitability per property</li>
                  <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Equipment tracking built in</li>
                </ul>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4}>
            <div className="text-center mt-8">
              <Link
                href="/landscaper/game"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
              >
                <Gamepad2 className="w-5 h-5" />
                See the Difference - Play the Simulator
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="features" className="py-24 bg-gray-50 relative">
        <BlurBlob color="green" className="top-0 left-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-bold text-4xl mb-4 font-display">Features That Grow With You</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                From solo operators to multi-crew businesses. Manage properties, crews, and schedules in one place.
              </p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScaleIn key={feature.title} delay={index * 0.1}>
                <div className="p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all bg-white group">
                  <feature.icon className="w-10 h-10 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
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
              <h2 className="font-bold text-4xl mb-4 font-display">What Landscapers Say</h2>
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

      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-600 relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <FadeIn>
            <h2 className="font-bold text-4xl text-white mb-6 font-display">Ready to Grow Your Landscaping Business?</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-green-100 text-xl mb-8">Learn how TradeSuite can help your landscaping business who stay organized year-round.</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link href="/signup?trade=landscaper" className="inline-block px-8 py-4 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start Your Free Trial
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer trade="landscaper" tradeColor="green" />
    </div>
  );
}