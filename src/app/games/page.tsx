import type { Metadata } from 'next';
import GamesHubClient from '@/components/games/GamesHubClient';

export const metadata: Metadata = {
  title: 'Typing Speed Games — Free Online Car Racing, Space & RPG Arcade | TypeTunes',
  description:
    'Play free online typing speed games with musical piano audio. Race sports cars in Nitro Highway Racer, shoot meteors in Cosmic Galaxy Defender, and conquer monster RPG bosses to boost your WPM velocity and accuracy.',
  keywords: [
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
    'typing games for kids and adults',
  ],
  alternates: {
    canonical: 'https://typetunes.in/games',
  },
  openGraph: {
    title: 'Typing Speed Games — Free Online Car Racing, Space & RPG Arcade | TypeTunes',
    description:
      'Level up your keyboard velocity! Play Nitro Highway Racer, Cosmic Space Defender, and Boss RPG with live musical audio and real-time WPM stats.',
    url: 'https://typetunes.in/games',
    siteName: 'TypeTunes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typing Speed Games — Free Online Car Racing, Space & RPG Arcade',
    description:
      'Race sports cars, shoot space meteors, and fight RPG bosses with free musical typing speed games on TypeTunes.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'TypeTunes Typing Speed Games & Arcade',
  url: 'https://typetunes.in/games',
  description:
    'Free online typing speed arcade featuring high-speed car racing, space defense, boss battles, and musical note cascade games.',
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
