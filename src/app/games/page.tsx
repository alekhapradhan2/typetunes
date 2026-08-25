import type { Metadata } from 'next';
import GamesHubClient from '@/components/games/GamesHubClient';

export const metadata: Metadata = {
  title: 'Typing Games for Students – Free Arcade',
  description:
    'Play free educational typing games for students. Race sports cars, defend space sectors, and battle RPG monsters while boosting your typing speed and accuracy.',
  keywords: [
    'typing games for students',
    'typing speed games',
    'online typing games',
    'free typing games',
    'typing car racer',
    'nitro typing game',
    'space typing defender',
    'typing boss battle rpg',
    'keyboard speed games',
    'wpm arcade games',
    'fun typing practice',
    'Typetune games',
  ],
  alternates: {
    canonical: 'https://typetune.ollypedia.in/games',
  },
  openGraph: {
    title: 'Typing Games for Students – Free Arcade',
    description:
      'Play free educational typing games for students. Race sports cars, defend space sectors, and battle RPG monsters while boosting your typing speed and accuracy.',
    url: 'https://typetune.ollypedia.in/games',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Typing Games for Students – Typetune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typing Games for Students – Free Arcade',
    description:
      'Play free educational typing games for students. Race sports cars, defend space sectors, and battle RPG monsters on Typetune.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Typetune Typing Games & Arcade',
  url: 'https://typetune.ollypedia.in/games',
  description:
    'Free online typing speed arcade for students and typists featuring high-speed car racing, space defense, boss battles, and musical note cascade games.',
  genre: ['Educational', 'Typing', 'Arcade', 'Racing', 'RPG'],
  gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
  applicationCategory: 'Game',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function GamesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-hero pb-20 pt-8 px-4 sm:px-6">
        <GamesHubClient />
      </main>
    </>
  );
}
