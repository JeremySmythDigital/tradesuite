import { Metadata, Viewport } from 'next';
import './globals.css';
import { ABTestProvider } from '@/components/auth/ABTestProvider';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { baseMetadata, viewport as baseViewport } from '@/lib/metadata';

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

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-gray-50 font-body text-gray-900 antialiased">
        <ABTestProvider>
          {children}
        </ABTestProvider>
      </body>
    </html>
  );
}