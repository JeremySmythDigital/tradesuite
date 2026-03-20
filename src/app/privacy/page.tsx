import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - TradeSuite',
  description: 'TradeSuite privacy policy and data handling practices.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-2xl">TradeSuite</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">Last updated: March 2026</p>

        <div className="prose prose-blue max-w-none">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly, including:</p>
          <ul>
            <li>Account information (name, email, phone, business details)</li>
            <li>Client and job data you enter into our system</li>
            <li>Payment information for subscriptions (processed securely via Stripe)</li>
            <li>Communications with our support team</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Process payments and send invoices</li>
            <li>Send important notifications about your account</li>
            <li>Respond to your questions and support requests</li>
            <li>Detect and prevent fraud</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>256-bit SSL encryption for all data transfers</li>
            <li>Encrypted storage of sensitive information</li>
            <li>Regular security audits and penetration testing</li>
            <li>SOC 2 Type II compliance</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>We do not sell your data. We may share data with:</p>
          <ul>
            <li>Service providers who help us operate (Stripe, Twilio, etc.)</li>
            <li>Law enforcement when legally required</li>
            <li>Business partners with your consent</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Export your data</li>
            <li>Object to processing</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>We use cookies for:</p>
          <ul>
            <li>Authentication and security</li>
            <li>Remembering your preferences</li>
            <li>Analytics (anonymized)</li>
          </ul>

          <h2>7. Contact</h2>
          <p>For privacy-related questions, contact us at:</p>
          <ul>
            <li>Email: privacy@tradesuite.app</li>
            <li>Phone: (916) 555-0100</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
