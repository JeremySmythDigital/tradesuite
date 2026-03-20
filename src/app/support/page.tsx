import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Mail, Phone, MessageCircle, Book, Video } from 'lucide-react';
import { FadeIn } from '@/components/ui/Motion';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Support - Cypress Signal',
  description: 'Get help with Cypress Signal. Contact support, browse documentation, and learn how to use our platform.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-2xl">Cypress Signal</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FadeIn>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 font-display">
            How can we help?
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We\'re here to help you succeed. Choose how you\'d like to get support.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team in real-time.</p>
              <button className="text-blue-600 font-medium hover:text-blue-700">
                Start Chat →
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours.</p>
              <a href="mailto:support@cypress-signal.app" className="text-green-600 font-medium hover:text-green-700">
                support@cypress-signal.app →
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call us Monday-Friday, 8am-6pm PT.</p>
              <a href="tel:+19165550100" className="text-purple-600 font-medium hover:text-purple-700">
                (916) 555-0100 →
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 mb-4">Browse guides, tutorials, and FAQs.</p>
              <a href="/docs" className="text-amber-600 font-medium hover:text-amber-700">
                View Docs →
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">Watch step-by-step video tutorials.</p>
              <a href="/tutorials" className="text-red-600 font-medium hover:text-red-700">
                Watch Videos →
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Schedule Training</h3>
              <p className="text-gray-600 mb-4">Book a 1-on-1 training session with our team.</p>
              <a href="/book?service=training" className="text-cyan-600 font-medium hover:text-cyan-700">
                Book Training →
              </a>
            </div>
          </FadeIn>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'How do I cancel my subscription?', a: 'Go to Settings → Account → Cancel Subscription. Your data remains accessible until the billing period ends.' },
              { q: 'Can I export my data?', a: 'Yes! Go to Settings → Data → Export. You can download all your clients, jobs, estimates, and invoices as CSV.' },
              { q: 'Do you offer refunds?', a: 'We offer a full refund within the first 30 days. After that, refunds are prorated based on unused time.' },
              { q: 'Is my data secure?', a: 'Absolutely. We use 256-bit SSL encryption, SOC 2 Type II compliance, and regular security audits.' },
              { q: 'How do I add team members?', a: 'Upgrade to Team ($79/mo) or Business ($149/mo) plan, then go to Settings → Team → Invite.' },
              { q: 'Can I white-label Cypress Signal?', a: 'Yes, on the Business plan. Upload your logo, customize colors, and use your own domain.' },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="font-medium text-gray-900 mb-1">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
