import type { Metadata } from 'next';
import CustomStudioClient from '@/components/custom/CustomStudioClient';

export const metadata: Metadata = {
  title: 'Programming Typing Practice & Custom Speed Studio — Code, Drills & Weak Keys | TypeTunes',
  description:
    'Practice programming typing speed with real code snippets in JavaScript, Python, TypeScript, React, HTML/CSS, and SQL. Drill weak keys, isolate pinky characters, paste custom text, and master muscle memory with acoustic piano feedback.',
  keywords: [
    'programming typing test',
    'coding typing practice',
    'code speed test',
    'javascript typing test',
    'python typing test',
    'weak key practice',
    'custom typing test',
    'programmer typing speed',
    'touch typing drills',
    'syntax typing speed',
    'react typing test',
    'sql typing practice',
  ],
  alternates: {
    canonical: 'https://typetunes.in/custom',
  },
  openGraph: {
    title: 'Programming Typing Practice & Custom Speed Studio — Code, Drills & Weak Keys | TypeTunes',
    description:
      'Practice coding speed with JavaScript, Python, TypeScript, React, and SQL. Drill weak keys and custom text with soft acoustic feedback.',
    url: 'https://typetunes.in/custom',
    siteName: 'TypeTunes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programming Typing Practice & Custom Speed Studio',
    description:
      'Level up your developer typing speed. Practice real code, weak-finger drills, and custom text on TypeTunes.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TypeTunes Programming & Custom Typing Studio',
  url: 'https://typetunes.in/custom',
  description:
    'Free programming typing speed practice studio and targeted weak-key drill generator for developers and touch typists.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function CustomPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-hero pb-20 pt-8 px-4 sm:px-6">
        <CustomStudioClient />
      </main>
    </>
  );
}
