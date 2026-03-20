import { Metadata } from 'next';
import './globals.css';
import { ABTestProvider } from '@/components/auth/ABTestProvider';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

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
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-gray-50 font-body text-gray-900 antialiased">
        <ABTestProvider>
          {children}
        </ABTestProvider>
      </body>
    </html>
  );
}