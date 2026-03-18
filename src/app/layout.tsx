import { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="__variable_dd5b2f __variable_f367f3">
      <body className="bg-gray-50 font-body text-gray-900 antialiased">{children}</body>
    </html>
  );
}