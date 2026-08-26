import type { Metadata } from 'next';
import TypingTest from '@/components/typing/TypingTest';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Zap, BookOpen, Sparkles, Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Typing Speed Test – Free 1-Minute Standard WPM Test',
  description:
    'Test your typing speed (WPM) and accuracy with our full-screen 1-minute benchmark. Enjoy melodic piano keystroke audio, live analytics, and finger diagnostics.',
  alternates: {
    canonical: 'https://typetune.ollypedia.in/test',
  },
  openGraph: {
    title: 'Typing Speed Test – Free 1-Minute Standard WPM Test',
    description:
      'Test your typing speed (WPM) and accuracy with our full-screen 1-minute benchmark. Melodic piano audio and live error diagnostics.',
    url: 'https://typetune.ollypedia.in/test',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Typetune Speed Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typing Speed Test – Free 1-Minute Standard WPM Test',
    description:
      'Test your typing speed (WPM) and accuracy with our full-screen 1-minute benchmark.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
};

const otherModes = [
  { slug: '15s', label: '15s Sprint' },
  { slug: '30s', label: '30s Burst' },
  { slug: '120s', label: '2-Min Endurance' },
  { slug: '25w', label: '25 Words' },
  { slug: '50w', label: '50 Words' },
  { slug: '100w', label: '100 Words' },
  { slug: 'zen', label: 'Zen Mode 🌿' },
  { slug: 'quotes', label: 'Quotes Mode 📜' },
];

export default function TestPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Typetune Official Speed Test',
    url: 'https://typetune.ollypedia.in/test',
    description: 'Measure your typing speed and accuracy with acoustic piano feedback on Typetune.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-hero min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12 pt-8 pb-16">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Speed Test' },
            ]}
          />

          <div className="mb-8 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="chip text-xs">
                <Sparkles size={12} className="mr-1" />
                Dedicated Test Arena
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              1-Minute Standard Typing Speed Test
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              You have 60 seconds to benchmark your words per minute (WPM), accuracy, and rhythmic consistency. Ready when you are — start typing below.
            </p>
          </div>

          {/* Large Expansive Typing Arena Card */}
          <div className="w-full">
            <TypingTest initialConfig={{ mode: 'time', timeDuration: 60 }} />
          </div>

          {/* Other Modes & Blog Interlinks */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800">
            <h2
              className="text-base font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Zap size={16} className="text-sage-600 dark:text-sage-400" />
              Switch to Another Test Mode
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
              {otherModes.map((om) => (
                <Link
                  key={om.slug}
                  href={`/test/${om.slug}`}
                  className="p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-sage-400 dark:hover:border-sage-500 hover:shadow-xs transition-all text-center group"
                >
                  <div className="font-semibold text-xs text-slate-700 dark:text-slate-200 group-hover:text-sage-700 dark:group-hover:text-sage-300">
                    {om.label}
                  </div>
                </Link>
              ))}
            </div>

            <div className="card p-5 bg-gradient-to-r from-cream-light/60 to-white dark:from-slate-900 dark:to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <BookOpen size={20} className="text-lavender-dark dark:text-lavender flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Want to practice on real articles?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Read interesting guides on ergonomics & speed, then practice typing them.</p>
                </div>
              </div>
              <Link href="/blog" className="btn-primary text-xs py-2 px-4 flex-shrink-0">
                Browse Practice Articles →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
