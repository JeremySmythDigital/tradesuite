import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, Award, Heart, Target, Zap } from 'lucide-react';
import { FadeIn, BlurBlob } from '@/components/ui/Motion';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'About TradeSuite - The CRM Built for Trades',
  description: 'Learn about TradeSuite and our mission to help trade professionals succeed.',
};

const team = [
  { name: 'Sarah Chen', role: 'CEO & Founder', bio: 'Former electrician turned tech entrepreneur.' },
  { name: 'Mike Roberts', role: 'Head of Product', bio: '15 years in field service software.' },
  { name: 'Emily Garcia', role: 'Engineering Lead', bio: 'Built systems at scale.' },
  { name: 'James Wilson', role: 'Customer Success', bio: 'Passionate about helping trades grow.' },
];

const values = [
  { icon: Target, title: 'Built for Trades', description: 'We understand the unique challenges of field service businesses.' },
  { icon: Zap, title: 'Fast & Simple', description: 'Software should work as fast as you do. No bloat, no complexity.' },
  { icon: Heart, title: 'Customer First', description: 'Your success is our success. We're here to help you grow.' },
  { icon: Award, title: 'Excellence', description: 'We hold ourselves to the highest standards in everything we do.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-2xl">TradeSuite</span>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <BlurBlob color="white" className="top-0 right-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              Built by Trades,<br />For Trades
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We started TradeSuite because we were tired of generic CRMs that didn't understand 
              what it's like to run a trade business.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">
                  Our Mission
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-lg text-gray-600 mb-4">
                  TradeSuite exists to help tradespeople succeed. We know the challenges - 
                  juggling jobs, customers, estimates, invoices, and still trying to grow your business.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-gray-600 mb-4">
                  Our founder spent 10 years as an electrician before building TradeSuite. 
                  Every feature is designed with real-world trade experience in mind.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="text-lg text-gray-600">
                  We're not here to sell you software. We're here to help you build a better business.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.4}>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-blue-600">10,000+</p>
                    <p className="text-gray-600">Users</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-blue-600">$2.5B</p>
                    <p className="text-gray-600">Managed Revenue</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-blue-600">4.9/5</p>
                    <p className="text-gray-600">Rating</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-blue-600">99.9%</p>
                    <p className="text-gray-600">Uptime</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 font-display">
              Our Values
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <FadeIn key={value.title} delay={index * 0.1}>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges variant="compact" />
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 font-display">
              Meet the Team
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <FadeIn key={member.name} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
            Ready to Join Us?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-medium text-lg hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
