import type { Metadata } from 'next';
import TypingTest from '@/components/typing/TypingTest';
import { BLOG_POSTS } from '@/data/blog-posts';
import {
  Music2,
  Zap,
  BarChart3,
  Heart,
  BookOpen,
  Keyboard,
  ArrowRight,
  Clock,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TypeTunes — Free Online Typing Speed Test with Piano Sounds',
  description:
    'Take a free WPM typing test that plays soft piano notes on every keystroke. Discover your typing speed, accuracy, and consistency with live analytics.',
  alternates: { canonical: 'https://typetunes.in' },
};

const features = [
  {
    icon: Music2,
    color: '#6aa850',
    title: 'Piano on Every Keystroke',
    desc: 'Each key you press plays a soft piano note from a pentatonic scale. Typing becomes music — calming, not stressful.',
  },
  {
    icon: Zap,
    color: '#54b3d9',
    title: 'Multiple Test Modes',
    desc: 'Choose 15s, 30s, 1-min or 2-min timed tests, 25/50/100 word targets, or Zen mode with no timer at all.',
  },
  {
    icon: BarChart3,
    color: '#b8a8c8',
    title: 'Deep Analytics & Weak Points',
    desc: 'Get your WPM over time, rhythm distribution, and an anatomical finger error diagnostic — not just a single number.',
  },
  {
    icon: Heart,
    color: '#c8887a',
    title: 'Calm by Design',
    desc: 'Muted palette, generous whitespace, no blaring countdown. Anxiety-free practice that you will actually return to.',
  },
];

const testModes = [
  { slug: '15s', label: '15s Sprint', desc: 'Fast reflex check' },
  { slug: '30s', label: '30s Test', desc: 'Standard burst' },
  { slug: '60s', label: '1-Minute Standard', desc: 'Official benchmark' },
  { slug: '120s', label: '2-Minute Endurance', desc: 'Sustained stamina' },
  { slug: 'zen', label: 'Zen Mode 🌿', desc: 'No timer or pressure' },
  { slug: 'quotes', label: 'Quotes Mode 📜', desc: 'Classic literature' },
];

const faqs = [
  {
    q: 'What is a good typing speed for everyday work?',
    a: 'Average typing speed is around 40 WPM. Professional office work averages 55–65 WPM, while 75+ WPM is considered high velocity.',
    link: '/blog/what-is-a-good-wpm',
  },
  {
    q: 'How do piano sounds help typing rhythm?',
    a: 'Rhythmic auditory feedback stimulates motor entrainment in the brain, helping you type with an even cadence rather than error-prone bursts.',
    link: '/blog/science-of-rhythm-and-muscle-memory',
  },
  {
    q: 'Can I practice typing on real blog articles?',
    a: 'Yes! Every article in our library includes an interactive Practice mode that loads the passage directly into our typing engine.',
    link: '/blog',
  },
];

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TypeTunes',
  url: 'https://typetunes.in',
  description:
    'A free online typing speed test that plays piano notes on every keystroke, with detailed WPM analytics and an error heatmap.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};


export default function HomePage() {
  const featuredPosts = BLOG_POSTS.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-hero">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-12 pb-8 text-center">
          <div className="chip mb-6 inline-flex animate-fade-in">
            ♪ Every keystroke plays a note
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-5 animate-slide-up tracking-tight"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.12 }}
          >
            The typing test that{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6aa850, #54b3d9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              plays music
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: '80ms' }}
          >
            Test your words-per-minute as soft piano notes turn every keystroke
            into a melody. No stress, no harsh buzzers — just you, your keyboard,
            and the music you make.
          </p>

          {/* The test itself lives here — SSR shell, CSR widget */}
          <div className="animate-scale-in max-w-5xl lg:max-w-6xl mx-auto w-full" style={{ animationDelay: '160ms' }}>
            <TypingTest initialConfig={{ mode: 'time', timeDuration: 60 }} />
          </div>
        </section>

        {/* Quick Test Modes Interlink Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-6">
          <div className="card p-6 sm:p-8 bg-gradient-to-r from-cream-light/60 to-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2
                className="text-lg font-bold text-slate-800 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <Zap size={18} className="text-sage-600" />
                Explore All Test Modes
              </h2>
              <span className="text-xs text-slate-400 font-medium">Instant benchmark & endurance modes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {testModes.map((tm) => (
                <Link
                  key={tm.slug}
                  href={`/test/${tm.slug}`}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-sage-400 hover:shadow-md transition-all text-center group transform hover:-translate-y-0.5"
                >
                  <div className="font-bold text-sm text-slate-700 group-hover:text-sage-700">
                    {tm.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{tm.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Arcade & Action Typing Games Showcase */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 text-white shadow-2xl relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles size={13} />
                  New Arcade Universe
                </span>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Typing Games & <span className="text-purple-400">Action Arcade</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                  Level up your speed while racing sports cars, firing starship lasers, and conquering monster RPG bosses!
                </p>
              </div>

              <Link
                href="/games"
                className="px-6 py-3.5 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-950 flex items-center gap-2 self-start md:self-auto cursor-pointer transform hover:scale-105 shrink-0"
              >
                <span>Launch Games Arcade 🎮</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Games Grid Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
              <Link
                href="/games"
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/60 hover:bg-slate-850 transition-all group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🏎️</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      RACING
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-rose-400 transition-colors">
                    Nitro Highway Racer
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    Shift gears, trigger Nitrous speed boosts, and race against AI rivals on the highway!
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-rose-400 font-semibold">
                  <span>Play Race ↗</span>
                  <span className="text-[11px] text-slate-500 font-mono">180 MPH</span>
                </div>
              </Link>

              <Link
                href="/games"
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-850 transition-all group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🛸</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      DEFENDER
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">
                    Cosmic Galaxy Defender
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    Lock on telemetry codes and fire plasma torpedoes to shoot down alien invaders and meteors!
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold">
                  <span>Defend Sector ↗</span>
                  <span className="text-[11px] text-slate-500 font-mono">EMP Blast</span>
                </div>
              </Link>

              <Link
                href="/games"
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-850 transition-all group flex flex-col justify-between shadow-lg sm:col-span-2 lg:col-span-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🐉</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ACTION RPG
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    Boss Battle RPG
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    Cast shield spells, build mana surge, and execute critical strikes against 4 elemental raid bosses!
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>Engage Bosses ↗</span>
                  <span className="text-[11px] text-slate-500 font-mono">4 Stages</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Newspaper & Media Typewriter Studio Banner */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-950 via-[#2d2218] to-stone-950 border-2 border-amber-800/40 text-amber-100 shadow-2xl relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles size={13} />
                  New Creation Studio
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Media Typewriter & <span className="text-amber-400">Newspaper Studio</span> 📰
                </h2>
                <p className="text-amber-200/80 text-sm sm:text-base mt-3 leading-relaxed font-serif">
                  Generate authentic vintage broadsheets, 1920s front pages, and tabloid editions with custom headlines, stories, halftone photo filters, and high-res PDF/PNG downloads.
                </p>
                <div className="flex flex-wrap gap-2.5 mt-4 text-xs font-medium text-amber-300/90">
                  <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-700/50">✨ 7 Famous Presets</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-700/50">📸 Halftone Photo Filters</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-700/50">⌨️ Real Typewriter Audio</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-700/50">📥 Ultra-HD PDF & PNG</span>
                </div>
              </div>

              <Link
                href="/newspaper"
                className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm sm:text-base transition-all shadow-xl shadow-amber-950/60 flex items-center gap-2.5 transform hover:scale-105 shrink-0 whitespace-nowrap"
              >
                <span>Launch Newspaper Studio</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Read & Practice Blog Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="chip mb-2 inline-flex">
                <Sparkles size={11} className="mr-1" />
                Interactive Library
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-slate-800"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Read & Practice Guides
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-1">
                Read in-depth typing guides, then practice typing the actual text with piano audio!
              </p>
            </div>
            <Link
              href="/blog"
              className="btn-ghost text-xs sm:text-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              View All {BLOG_POSTS.length} Articles
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredPosts.map((post) => (
              <div
                key={post.slug}
                className="card p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-200 group border border-slate-200/80 transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sage-700 bg-sage-50 px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={11} /> {post.readingTime} min
                    </span>
                  </div>

                  <h3
                    className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-sage-700 transition-colors mb-2 leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {post.description}
                  </p>
                </div>

                {/* Dual Action: Read or Practice */}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="btn-ghost text-xs py-2 px-3 flex items-center justify-center gap-1.5 w-full"
                  >
                    <BookOpen size={13} />
                    Read Article
                  </Link>

                  <Link
                    href={`/blog/${post.slug}?tab=practice`}
                    className="btn-primary text-xs py-2 px-3 flex items-center justify-center gap-1.5 shadow-2xs w-full"
                  >
                    <Keyboard size={13} />
                    Practice Typing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why TypeTunes is different */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Why TypeTunes is different
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Engineered from the ground up for calming musical rhythm, rich diagnostics, and pure typing flow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 flex flex-col gap-4 border border-slate-200/80 hover:shadow-lg transition-all">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
                  style={{ background: f.color + '18', color: f.color }}
                >
                  <f.icon size={22} strokeWidth={2} />
                </div>
                <div>
                  <h3
                    className="font-bold text-base text-slate-800 mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Preview Strip */}
        <section className="bg-section py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
            <div className="text-center mb-10">
              <span className="chip mb-2 inline-flex">
                <HelpCircle size={11} className="mr-1" />
                Got Questions?
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-slate-800"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3 mb-8">
              {faqs.map((faq, i) => (
                <Link
                  key={i}
                  href="/faq"
                  className="card p-5 block hover:border-sage-300 hover:shadow-md transition-all group"
                >
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-sage-700 mb-1.5 flex items-center justify-between">
                    <span>{faq.q}</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-sage-600 transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/faq" className="btn-primary text-xs sm:text-sm py-2.5 px-5 inline-flex items-center gap-2 shadow-md">
                View All FAQ Questions & Answers
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
