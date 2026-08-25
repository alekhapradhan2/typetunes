import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ArrowRight, BookOpen, Zap } from 'lucide-react';
import { InContentAd } from '@/components/ads/InContentAd';

export const metadata: Metadata = {
  title: 'Typing Speed FAQ & Touch Typing Guide',
  description:
    'Clear answers to common typing questions: what is a good WPM, how to calculate typing speed, touch typing vs hunt-and-peck, and piano typing benefits.',
  alternates: { canonical: 'https://typetune.ollypedia.in/faq' },
  openGraph: {
    title: 'Typing Speed FAQ & Touch Typing Guide',
    description:
      'Clear answers to common typing questions: what is a good WPM, how to calculate typing speed, touch typing vs hunt-and-peck, and piano typing benefits.',
    url: 'https://typetune.ollypedia.in/faq',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Typing Speed FAQ – Typetune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typing Speed FAQ & Touch Typing Guide',
    description:
      'Clear answers to common typing questions: what is a good WPM, how to calculate typing speed, touch typing vs hunt-and-peck, and piano typing benefits.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
};

const FAQS = [
  {
    q: 'What is WPM and how is it calculated?',
    a: 'WPM stands for words per minute. By convention, one "word" is defined as 5 characters (including spaces), so typing "hello world" counts as 2.2 words. This standardization makes scores comparable regardless of the actual words used. TypeTunes shows both raw WPM (all keystrokes) and net WPM (subtracting errors), which is the more meaningful metric.',
    guideLink: '/blog/what-is-a-good-wpm',
    guideLabel: 'Read WPM benchmark guide →',
  },
  {
    q: 'What is a good typing speed?',
    a: 'The average internet user types about 40 WPM. Office professionals average 55–65 WPM. 70+ WPM is considered fast for non-professional typists, and 100+ WPM places you in expert territory. Court reporters are certified at 225+ WPM using stenotype machines. For most knowledge workers, 65–75 WPM with high accuracy is enough that typing stops being a bottleneck.',
    guideLink: '/blog/what-is-a-good-wpm',
    guideLabel: 'View full WPM charts & percentiles →',
  },
  {
    q: 'What is the difference between raw WPM and net WPM?',
    a: 'Raw WPM counts all characters typed (correct and incorrect) divided by 5, divided by minutes. Net WPM subtracts errors to represent your actual productive output. If you type at 70 raw WPM but make 10 uncorrected errors per minute, your net WPM is significantly lower. TypeTunes displays both so you understand the full picture.',
    guideLink: '/blog/how-to-improve-typing-speed',
    guideLabel: 'Read accuracy-first practice guide →',
  },
  {
    q: 'What is accuracy in typing tests?',
    a: 'Accuracy is the percentage of keystrokes that were correct out of all keystrokes typed. 100% accuracy means no errors. For productive typing, aim for 95%+ accuracy — below that, you spend more time correcting errors than the speed gain from typing faster is worth.',
    guideLink: '/blog/the-psychology-of-mistakes-and-recovery',
    guideLabel: 'Read guide on error recovery →',
  },
  {
    q: 'What is the average typing speed for my age?',
    a: 'Adults without specific typing training average 35–45 WPM. Touch-typists who practice average 55–80 WPM. Speed generally increases with age up to early adulthood, then plateaus. Children learning to type typically reach 20–30 WPM initially. The age variation matters much less than whether you have learned touch typing technique.',
    guideLink: '/blog/kids-learning-touch-typing',
    guideLabel: 'Read touch typing roadmap →',
  },
  {
    q: 'How does TypeTunes use piano sounds?',
    a: 'Every keystroke you type triggers a soft piano note using the Web Audio API. Correct keystrokes cycle through a pentatonic scale (C, D, E, G, A — notes that always sound harmonious together). Incorrect keystrokes play softer, lower notes that are still pleasant — not a harsh buzzer. The musical feedback helps you develop a steady rhythm, which research shows improves both speed and accuracy.',
    guideLink: '/blog/science-of-rhythm-and-muscle-memory',
    guideLabel: 'Read neuroscience of rhythm guide →',
  },
  {
    q: 'Will the piano sounds distract me or slow me down?',
    a: 'Most users find the opposite — the audio feedback actually helps them find a rhythm and relax. There is a mute button and volume slider always visible in the typing area if you prefer silence. Your audio preference is saved automatically for future sessions.',
    guideLink: '/blog/neuroscience-of-typing-flow-states',
    guideLabel: 'Read flow state typing guide →',
  },
  {
    q: 'How can I improve my typing speed?',
    a: 'The most effective approach: (1) Learn proper touch typing — home row position, one finger per key column. (2) Prioritize accuracy over speed — never practice at a pace where errors exceed 5%. (3) Practice deliberately — 15 minutes daily beats 2 hours on weekends. (4) Use the error heatmap in TypeTunes results to identify your weakest keys and drill them specifically. Most people can go from 40 WPM to 70+ WPM within three to six months of consistent practice.',
    guideLink: '/blog/how-to-improve-typing-speed',
    guideLabel: 'Read comprehensive typing guide →',
  },
  {
    q: 'What is "consistency score" in TypeTunes results?',
    a: 'Consistency score measures how steady your WPM was throughout the test. A score of 100 means your speed was perfectly even; lower scores mean you had significant speed variations. Bursty typing (fast spurts followed by slow patches) tends to produce more errors. TypeTunes computes this from the standard deviation of your WPM-over-time samples.',
    guideLink: '/blog/science-of-rhythm-and-muscle-memory',
    guideLabel: 'Read pacing & consistency guide →',
  },
  {
    q: 'Is TypeTunes free? Do I need an account?',
    a: 'TypeTunes is completely free to use with no account required. Your test results are saved to our database with a shareable link (your ID is in the URL), and recent result IDs are cached in your browser so you can access your history. No email, no sign-up, no tracking — just open the site and start typing.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};


export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-hero min-h-screen">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12 py-12">
          <Breadcrumbs items={[{ label: 'FAQ' }]} />

          <div className="mb-10">
            <h1
              className="text-4xl font-bold text-slate-800 mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Frequently Asked Questions
            </h1>
            <p className="text-slate-500">
              Everything you wanted to know about WPM, typing speed, ergonomics, and how TypeTunes works.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <React.Fragment key={i}>
                <details
                  className="card p-0 overflow-hidden group border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90"
                >
                  <summary
                    className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-800 dark:text-white hover:text-sage-700 dark:hover:text-sage-300 transition-colors list-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <span className="text-base">{faq.q}</span>
                    <span className="text-slate-400 dark:text-slate-400 group-open:rotate-45 transition-transform duration-200 ml-4 flex-shrink-0 text-xl font-bold">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 -mt-2">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{faq.a}</p>
                    {faq.guideLink && (
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Link
                          href={faq.guideLink}
                          className="text-xs font-semibold text-sage-600 dark:text-sage-400 hover:underline inline-flex items-center gap-1"
                        >
                          <BookOpen size={12} />
                          {faq.guideLabel}
                        </Link>
                      </div>
                    )}
                  </div>
                </details>

                {i === 4 && (
                  <div className="py-2">
                    <InContentAd />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Quick Interlink Footer Card */}
          <div className="mt-12 card p-6 bg-gradient-to-r from-cream-light/60 to-white dark:from-slate-900 dark:to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 text-center sm:text-left">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Ready to test your typing speed?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Take a quick 1-minute test or practice on blog articles.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="btn-primary text-xs py-2 px-3.5">
                Take Speed Test →
              </Link>
              <Link href="/blog" className="btn-ghost text-xs py-2 px-3.5 dark:text-slate-300 dark:border-slate-700">
                Browse Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
