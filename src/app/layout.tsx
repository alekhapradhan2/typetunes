import {
  Inter,
  Outfit,
} from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://typetunes.in'),
  title: 'TypeTunes — Free Online Typing Speed Test with Piano Sounds',
  description:
    'Test and improve your typing speed with TypeTunes — the WPM typing test that plays piano music as you type. Real-time analytics, error heatmaps, and results.',
  keywords: [
    'typing speed test',
    'WPM test',
    'typing practice',
    'online typing test',
    'words per minute',
    'typing speed',
    'typing game',
    'keyboard speed test',
    'touch typing',
    'TypeTunes',
  ],
  authors: [{ name: 'TypeTunes' }],
  creator: 'TypeTunes',
  publisher: 'TypeTunes',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://typetunes.in',
    siteName: 'TypeTunes',
    title: 'TypeTunes — Free Online Typing Speed Test with Piano Sounds',
    description:
      'The calm typing test that plays soft piano notes on every keystroke. Test your WPM, see detailed analytics, and enjoy the music of your own typing.',
    images: [
      {
        url: 'https://typetunes.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'TypeTunes — Musical Typing Speed Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypeTunes — Free Online Typing Speed Test with Piano Sounds',
    description:
      'The calm typing test that plays soft piano notes on every keystroke.',
    images: ['https://typetunes.in/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=DM+Serif+Display:ital@0;1&family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..800&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Pirata+One&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Special+Elite&family=UnifrakturCook:wght@700&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-slate-700 antialiased min-h-screen flex flex-col">
        <NavBar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

