import type { Metadata } from 'next';
import TypingTest from '@/components/typing/TypingTest';
import type { DifficultyConfig } from '@/lib/types';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Zap, BookOpen } from 'lucide-react';

// Valid mode slugs → config mapping
type ModeSlug =
  | '15s' | '30s' | '60s' | '120s'
  | '25w' | '50w' | '100w'
  | 'zen'  | 'quotes';

const MODE_MAP: Record<ModeSlug, Partial<DifficultyConfig>> = {
  '15s':    { mode: 'time', timeDuration: 15  },
  '30s':    { mode: 'time', timeDuration: 30  },
  '60s':    { mode: 'time', timeDuration: 60  },
  '120s':   { mode: 'time', timeDuration: 120 },
  '25w':    { mode: 'words', wordCount: 25  },
  '50w':    { mode: 'words', wordCount: 50  },
  '100w':   { mode: 'words', wordCount: 100 },
  'zen':    { mode: 'zen'    },
  'quotes': { mode: 'zen', useQuotes: true },
};

const MODE_LABELS: Record<ModeSlug, string> = {
  '15s':    '15-Second Typing Test',
  '30s':    '30-Second Typing Test',
  '60s':    '1-Minute Typing Test',
  '120s':   '2-Minute Typing Test',
  '25w':    '25-Word Typing Test',
  '50w':    '50-Word Typing Test',
  '100w':   '100-Word Typing Test',
  'zen':    'Zen Typing Mode',
  'quotes': 'Quote Typing Mode',
};

const MODE_SEO: Record<
  ModeSlug,
  { title: string; desc: string }
> = {
  '15s': {
    title: '15-Second Typing Test – Rapid WPM Sprint',
    desc: 'Take a fast 15-second typing speed test on Typetune. Test rapid reflexes, burst WPM, and keyboard accuracy with melodic piano keystrokes.',
  },
  '30s': {
    title: '30-Second Typing Test – Standard WPM Burst',
    desc: 'Test your typing speed with a 30-second WPM test. Track live velocity, error heatmaps, and accuracy with soothing acoustic feedback on Typetune.',
  },
  '60s': {
    title: '1-Minute Typing Test – Official WPM Benchmark',
    desc: 'Take the official 1-minute typing speed test on Typetune. Measure your words per minute (WPM), accuracy, and consistency with live piano audio.',
  },
  '120s': {
    title: '2-Minute Typing Test – Endurance Benchmark',
    desc: 'Challenge your typing stamina with a 2-minute endurance test on Typetune. Benchmark long-passage WPM, pacing, and muscle memory rhythm.',
  },
  '25w': {
    title: '25-Word Typing Test – Quick Accuracy Sprint',
    desc: 'Complete a quick 25-word typing sprint on Typetune. Measure your exact completion time, accuracy percentage, and keystroke rhythm with live audio.',
  },
  '50w': {
    title: '50-Word Typing Test – Word Target Check',
    desc: 'Test your touch typing speed across 50 standard words on Typetune. Get instant WPM diagnostics, weak key analysis, and acoustic feedback.',
  },
  '100w': {
    title: '100-Word Typing Test – Long Accuracy Drill',
    desc: 'Test your typing accuracy and speed across 100 words on Typetune. Perfect for students and typists building long-passage muscle memory.',
  },
  'zen': {
    title: 'Zen Typing Mode – Calm & Untimed Practice',
    desc: 'Practice typing without timers, countdowns, or pressure. Enjoy continuous flow-state typing with harmonic piano feedback on Typetune.',
  },
  'quotes': {
    title: 'Quote Typing Test – Classic Literature',
    desc: 'Practice typing famous quotes, classic literature, and historical passages with real-time WPM tracking and acoustic feedback on Typetune.',
  },
};

interface Props {
  params: Promise<{ mode: string }>;
}

export async function generateStaticParams() {
  return Object.keys(MODE_MAP).map((mode) => ({ mode }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mode } = await params;
  const seo = MODE_SEO[mode as ModeSlug] || {
    title: `${MODE_LABELS[mode as ModeSlug] || 'Typing Test'} | Typetune`,
    desc: `Take the ${MODE_LABELS[mode as ModeSlug] || 'typing test'} on Typetune with real-time WPM analytics.`,
  };
  const url = `https://typetune.ollypedia.in/test/${mode}`;

  return {
    title: seo.title,
    description: seo.desc,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title,
      description: seo.desc,
      url,
      siteName: 'Typetune',
      type: 'website',
      images: [
        {
          url: 'https://typetune.ollypedia.in/og-default.png',
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.desc,
      images: ['https://typetune.ollypedia.in/og-default.png'],
    },
  };
}

export default async function TestModePage({ params }: Props) {
  const { mode } = await params;
  const config = MODE_MAP[mode as ModeSlug];
  if (!config) notFound();

  const label = MODE_LABELS[mode as ModeSlug];
  const seo = MODE_SEO[mode as ModeSlug];
  const otherModes = (Object.keys(MODE_MAP) as ModeSlug[]).filter((m) => m !== mode);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Typetune ${label}`,
    url: `https://typetune.ollypedia.in/test/${mode}`,
    description: seo ? seo.desc : `Practice typing with ${label} on Typetune.`,
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
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-10 pb-16">
          <Breadcrumbs
            items={[
              { label: 'Typing Tests', href: '/' },
              { label },
            ]}
          />

          <div className="mb-8 mt-2">
            <h1
              className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {label}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              {config.mode === 'zen'
                ? 'No timer, no pressure. Type at your own pace — the music will keep you company.'
                : config.mode === 'words'
                ? `Type ${config.wordCount} words as quickly and accurately as you can.`
                : `You have ${config.timeDuration} seconds. Ready when you are — just start typing.`}
            </p>
          </div>

          <div className="w-full">
            <TypingTest initialConfig={config} />
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
                  key={om}
                  href={`/test/${om}`}
                  className="p-3 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-sage-400 dark:hover:border-sage-500 hover:shadow-xs transition-all text-center group"
                >
                  <div className="font-semibold text-xs text-slate-700 dark:text-slate-200 group-hover:text-sage-700 dark:group-hover:text-sage-300">
                    {MODE_LABELS[om]}
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
