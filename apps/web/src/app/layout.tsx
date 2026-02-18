import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Zen Canvas — Mandala Art Shop',
    template: '%s | Zen Canvas',
  },
  description: 'Handcrafted mandala art prints, posters and originals. Shop wall art, framed prints and gift sets crafted in sacred geometry.',
  keywords: ['mandala', 'mandala art', 'wall art', 'art prints', 'sacred geometry', 'handcrafted', 'mandala shop'],
  authors: [{ name: 'Zen Canvas' }],
  openGraph: {
    type: 'website',
    siteName: 'Zen Canvas',
    title: 'Zen Canvas — Mandala Art Shop',
    description: 'Handcrafted mandala art prints, posters and originals.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zencanvas.art',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zen Canvas — Mandala Art Shop',
    description: 'Handcrafted mandala art prints, posters and originals.',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zencanvas.art'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased bg-stone-50 min-h-screen`}>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
