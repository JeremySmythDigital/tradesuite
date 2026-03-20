import { Metadata } from 'next';
import './globals.css';
import { ABTestProvider } from '@/components/auth/ABTestProvider';

export const metadata: Metadata = {
  title: 'TradeSuite - The CRM Built for Your Trade',
  description: 'Trade-specific CRM for electricians, plumbers, HVAC, landscapers, and roofers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-body text-gray-900 antialiased">
        <ABTestProvider>
          {children}
        </ABTestProvider>
      </body>
    </html>
  );
}
