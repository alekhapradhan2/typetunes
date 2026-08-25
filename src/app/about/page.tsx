import type { Metadata } from 'next';
import Link from 'next/link';
import { Music2, Heart, Shield, Zap, BookOpen } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Typetune — Musical Typing Philosophy',
  description:
    'Learn why we built Typetune — combining touch typing practice with melodic piano audio, calm aesthetics, deep error diagnostics, and zero distractions.',
  alternates: { canonical: 'https://typetune.ollypedia.in/about' },
  openGraph: {
    title: 'About Typetune — Musical Typing Philosophy',
    description:
      'Learn why we built Typetune — combining touch typing practice with melodic piano audio, calm aesthetics, deep error diagnostics, and zero distractions.',
    url: 'https://typetune.ollypedia.in/about',
    siteName: 'Typetune',
    type: 'website',
    images: [
      {
        url: 'https://typetune.ollypedia.in/og-default.png',
        width: 1200,
        height: 630,
        alt: 'About Typetune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Typetune — Musical Typing Philosophy',
    description:
      'Learn why we built Typetune — combining touch typing practice with melodic piano audio, calm aesthetics, deep error diagnostics, and zero distractions.',
    images: ['https://typetune.ollypedia.in/og-default.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-hero min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12 py-12">
        <Breadcrumbs items={[{ label: 'About Typetune' }]} />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-sage-500 flex items-center justify-center text-white shadow-xs">
              <Music2 size={22} />
            </div>
            <h1
              className="text-4xl font-bold text-slate-800"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              About Typetune
            </h1>
          </div>
          <p className="text-slate-500 text-lg leading-relaxed">
            Typetune is an open, melodic typing speed test engineered to cultivate keyboard fluency and rhythm through acoustic feedback.
          </p>
        </div>

        <div className="prose-like space-y-6 text-slate-600 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-700" style={{ fontFamily: 'var(--font-display)' }}>
            Why we built this
          </h2>
          <p>
            Most typing tests are stressful by design. A big red countdown. Loud error sounds.
            A final score that feels like a verdict. We wanted something different — a practice tool
            you would actually enjoy returning to, not one that makes your hands tense up the moment
            you see the timer.
          </p>
          <p>
            The core idea came from noticing something: the best typing sessions feel rhythmic,
            almost musical. When you are in flow, your fingers move like you are playing an
            instrument. So we made that literal. Every keystroke plays a soft piano note from
            a pentatonic scale — a set of notes that always sound harmonious together, so
            mistakes never jar the melody.
          </p>
          <p>
            The result is a typing test where even a challenging session sounds beautiful.
            Where the feedback is a gentle note, not a buzzer. Where the design is built
            around keeping you calm and focused, not anxious and rushed.
          </p>

          <h2 className="text-2xl font-bold text-slate-700 mt-10" style={{ fontFamily: 'var(--font-display)' }}>
            What makes TypeTunes different
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 not-prose my-6">
            {[
              {
                icon: Music2,
                color: '#6aa850',
                title: 'Piano on every keystroke',
                desc: 'Web Audio API synthesizes warm piano tones on demand. Pentatonic scale means strokes always harmonize.',
              },
              {
                icon: Zap,
                color: '#54b3d9',
                title: 'Deep analytics, not just WPM',
                desc: 'WPM over time, keystroke rhythm distribution, anatomical error heatmap, consistency score, and personal coaching.',
              },
              {
                icon: Heart,
                color: '#c8887a',
                title: 'Calm design philosophy',
                desc: 'Muted sage-and-sky palette. Generous whitespace. No blinking red timers. Soft transitions.',
              },
              {
                icon: Shield,
                color: '#b8a8c8',
                title: 'Privacy-first architecture',
                desc: 'No sign-up required. Results are saved anonymously by ID. No tracking cookies across the web.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-5 flex gap-3 border border-slate-200/80">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: item.color + '18', color: item.color }}
                >
                  <item.icon size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-700 mt-10" style={{ fontFamily: 'var(--font-display)' }}>
            Editorial Team & Technology
          </h2>
          <p>
            TypeTunes is created and maintained by the TypeTunes Editorial Team — a collective of typists, developers, and educators dedicated to modern digital ergonomics and tactile performance.
          </p>
          <p>
            The platform is built with Next.js 16 (App Router) and TypeScript, styled with Tailwind CSS, and hosted globally on high-speed edge infrastructure. Keystroke sound synthesis is powered natively by the client-side Web Audio API without bulky external audio files.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
          <Link href="/" className="btn-primary">
            Take Speed Test →
          </Link>
          <Link href="/blog" className="btn-ghost flex items-center gap-1.5">
            <BookOpen size={14} />
            Read & Practice Guides
          </Link>
          <Link href="/faq" className="btn-ghost">
            View FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}

