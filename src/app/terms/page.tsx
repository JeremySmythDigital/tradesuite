import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service - Cypress Signal',
  description: 'Cypress Signal terms of service and user agreement.',
};

export default function TermsPage() {
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-6">Last updated: March 2026</p>

        <div className="prose prose-blue max-w-none">
          <h2>1. Agreement to Terms</h2>
          <p>By using Cypress Signal, you agree to these terms. If you disagree with any part, you may not access our service.</p>

          <h2>2. Description of Service</h2>
          <p>Cypress Signal provides CRM and business management software for trade professionals, including:</p>
          <ul>
            <li>Client and job management</li>
            <li>Estimates and invoices</li>
            <li>Scheduling and dispatch</li>
            <li>Payment processing</li>
            <li>Reporting and analytics</li>
          </ul>

          <h2>3. Accounts and Security</h2>
          <ul>
            <li>You are responsible for your account security</li>
            <li>You must provide accurate information</li>
            <li>You must be 18+ to use our service</li>
            <li>We may suspend accounts that violate these terms</li>
          </ul>

          <h2>4. Subscription and Payment</h2>
          <ul>
            <li>Plans are billed monthly or annually in advance</li>
            <li>Prices may change with 30 days notice</li>
            <li>You may cancel anytime; service continues until billing period ends</li>
            <li>Refunds are provided at our discretion</li>
          </ul>

          <h2>5. Your Data</h2>
          <ul>
            <li>You own your data</li>
            <li>We don't sell your data</li>
            <li>You can export or delete your data anytime</li>
            <li>We retain data for 30 days after account deletion</li>
          </ul>

          <h2>6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for illegal purposes</li>
            <li>Upload malicious content</li>
            <li>Interfere with other users</li>
            <li>Resell or redistribute our service</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>All Cypress Signal content, features, and functionality are owned by Cypress Signal and protected by intellectual property laws.</p>

          <h2>8. Limitation of Liability</h2>
          <p>Cypress Signal is provided "as is." We are not liable for indirect, incidental, or consequential damages.</p>

          <h2>9. Termination</h2>
          <p>We may terminate your account for violation of these terms. You may terminate at any time.</p>

          <h2>10. Contact</h2>
          <p>Questions? Contact us:</p>
          <ul>
            <li>Email: legal@cypress-signal.app</li>
            <li>Phone: (916) 555-0100</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
