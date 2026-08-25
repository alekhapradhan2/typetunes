import {
  Inter,
  Outfit,
} from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import Script from 'next/script';
import { GlobalMultiplexWrapper } from '@/components/ads/GlobalMultiplexWrapper';

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
  metadataBase: new URL('https://typetune.ollypedia.in'),
  title: {
    default: 'Typetune – Typing Speed Tests, Games & Newspaper Studio',
    template: '%s | Typetune',
  },
  description:
    'Improve typing speed with musical piano tests, educational typing games, multiplayer races, custom drills, and student Newspaper Studio on Typetune.',
  keywords: [
    'typing speed test',
    'typing games',
    'typing games for students',
    'typing challenges',
    'multiplayer typing game',
    'custom typing practice',
    'newspaper studio',
    'online newspaper maker',
    'WPM test',
    'typing practice',
    'words per minute',
    'touch typing',
    'Typetune',
  ],
  authors: [{ name: 'Typetune', url: 'https://typetune.ollypedia.in' }],
  creator: 'Typetune',
  publisher: 'Typetune',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://typetune.ollypedia.in',
    siteName: 'Typetune',
    title: 'Typetune – Typing Speed Tests, Games & Newspaper Studio',
    description:
      'Improve typing speed with musical piano tests, educational typing games, multiplayer races, custom drills, and student Newspaper Studio on Typetune.',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Typetune – Typing Speed Tests, Games & Newspaper Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typetune – Typing Speed Tests, Games & Newspaper Studio',
    description:
      'Improve typing speed with musical piano tests, educational typing games, multiplayer races, custom drills, and student Newspaper Studio on Typetune.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
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
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch(e) {}
            })()`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5823659147566885"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
        <GlobalMultiplexWrapper />
        <Footer />
      </body>
    </html>
  );
}

