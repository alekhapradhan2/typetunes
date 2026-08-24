import type { Metadata } from 'next';
import TypingTest from '@/components/typing/TypingTest';
import type { DifficultyConfig, TestMode, TimeDuration, WordCount } from '@/lib/types';
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

interface Props {
  params: Promise<{ mode: string }>;
}

export async function generateStaticParams() {
  return Object.keys(MODE_MAP).map((mode) => ({ mode }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mode } = await params;
  const label = MODE_LABELS[mode as ModeSlug] ?? 'Typing Test';
  return {
    title: `${label} — Free Musical WPM Test | TypeTunes`,
    description: `Take the ${label.toLowerCase()} on TypeTunes. Hear piano notes on every keystroke, track live WPM and accuracy, and view your error heatmap.`,
    alternates: { canonical: `https://typetunes.in/test/${mode}` },
  };
}


export default async function TestModePage({ params }: Props) {
  const { mode } = await params;
  const config = MODE_MAP[mode as ModeSlug];
  if (!config) notFound();

  const label = MODE_LABELS[mode as ModeSlug];
  const otherModes = (Object.keys(MODE_MAP) as ModeSlug[]).filter((m) => m !== mode);

  return (
    <div className="bg-hero min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-10 pb-16">
        <Breadcrumbs
          items={[
            { label: 'Typing Tests', href: '/' },
            { label },
          ]}
        />

        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-slate-800 mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {label}
          </h1>
          <p className="text-slate-500 text-sm">
            {config.mode === 'zen'
              ? 'No timer, no pressure. Type at your own pace — the music will keep you company.'
              : config.mode === 'words'
              ? `Type ${config.wordCount} words as quickly and accurately as you can.`
              : `You have ${config.timeDuration} seconds. Ready when you are — just start typing.`}
          </p>
        </div>

        <TypingTest initialConfig={config} />

        {/* Other Modes & Blog Interlinks */}
        <div className="mt-14 pt-8 border-t border-slate-200/80">
          <h2
            className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Zap size={16} className="text-sage-600" />
            Switch to Another Test Mode
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
            {otherModes.map((om) => (
              <Link
                key={om}
                href={`/test/${om}`}
                className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-sage-400 hover:shadow-xs transition-all text-center group"
              >
                <div className="font-semibold text-xs text-slate-700 group-hover:text-sage-700">
                  {MODE_LABELS[om]}
                </div>
              </Link>
            ))}
          </div>

          <div className="card p-5 bg-gradient-to-r from-cream-light/60 to-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-lavender-dark flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Want to practice on real articles?</h3>
                <p className="text-xs text-slate-500">Read interesting guides on ergonomics & speed, then practice typing them.</p>
              </div>
            </div>
            <Link href="/blog" className="btn-primary text-xs py-2 px-4 flex-shrink-0">
              Browse Practice Articles →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
