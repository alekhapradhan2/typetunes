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
  Gamepad2,
  Users,
  PenTool,
  Newspaper,
  GraduationCap,
  Trophy,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    absolute: 'Typetune – Typing Speed Tests, Games & Newspaper Studio',
  },
  description:
    'Improve typing speed with musical piano tests, educational typing games, multiplayer races, custom drills, and student Newspaper Studio on Typetune.',
  alternates: { canonical: 'https://typetune.ollypedia.in' },
  openGraph: {
    title: 'Typetune – Typing Speed Tests, Games & Newspaper Studio',
    description:
      'Improve typing speed with musical piano tests, educational typing games, multiplayer races, custom drills, and student Newspaper Studio on Typetune.',
    url: 'https://typetune.ollypedia.in',
    siteName: 'Typetune',
    type: 'website',
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
};

const testModes = [
  { slug: '15s', label: '15s Sprint', desc: 'Fast reflex check' },
  { slug: '30s', label: '30s Test', desc: 'Standard burst' },
  { slug: '60s', label: '1-Minute Standard', desc: 'Official benchmark' },
  { slug: '120s', label: '2-Minute Endurance', desc: 'Sustained stamina' },
  { slug: '25w', label: '25 Words', desc: 'Short sprint' },
  { slug: '50w', label: '50 Words', desc: 'Word benchmark' },
  { slug: '100w', label: '100 Words', desc: 'Accuracy check' },
  { slug: 'zen', label: 'Zen Mode 🌿', desc: 'No timer or pressure' },
  { slug: 'quotes', label: 'Quotes Mode 📜', desc: 'Classic literature' },
];

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

const homepageFaqs = [
  {
    q: 'What is Typetune?',
    a: 'Typetune is an all-in-one typing platform designed for students, developers, and keyboard enthusiasts. It combines acoustic piano sound synthesis, comprehensive WPM speed tests, interactive arcade typing games, multiplayer competitions, custom programming practice, and a student Newspaper Studio to make typing practice engaging and effective.',
    link: '/about',
    linkLabel: 'Learn more about Typetune →',
  },
  {
    q: 'How can I improve my typing speed?',
    a: 'Improving your typing speed requires consistent daily practice (15–20 minutes), mastering proper touch typing with home-row positioning, focusing on 95%+ accuracy before raw speed, and using Typetune error heatmaps to drill your weakest keys.',
    link: '/blog/how-to-improve-typing-speed',
    linkLabel: 'Read our speed improvement guide →',
  },
  {
    q: 'How does the typing speed test work?',
    a: 'The Typetune typing speed test measures your raw Words Per Minute (WPM), net WPM (deducting uncorrected errors), accuracy percentage, keystroke consistency, and finger-by-finger error distribution in real time using standardized 5-character word metrics.',
    link: '/blog/what-is-a-good-wpm',
    linkLabel: 'Understand WPM benchmarks →',
  },
  {
    q: 'Can students play typing games?',
    a: 'Yes! Typetune features an entire action arcade including Nitro Highway Racer (car racing with nitro boosts), Cosmic Galaxy Defender (laser space shooter), Boss Battle RPG, Speed Boxing, and Castle Siege that help students build muscle memory while having fun.',
    link: '/games',
    linkLabel: 'Explore typing games arcade →',
  },
  {
    q: 'Does Typetune support multiplayer typing?',
    a: 'Yes. Typetune supports real-time multiplayer racing and practice rooms where classmates, friends, or colleagues can join via a room code and race against each other with live position tracking and instant leaderboards.',
    link: '/games',
    linkLabel: 'Join multiplayer typing games →',
  },
  {
    q: 'Can I create custom typing practice?',
    a: 'Absolutely. With Typetune Custom Studio, you can practice typing real programming code in JavaScript, Python, TypeScript, React, HTML/CSS, and SQL, paste your own custom passages, or generate targeted drills for your weakest keys and pinky fingers.',
    link: '/custom',
    linkLabel: 'Open Custom Typing Studio →',
  },
  {
    q: 'What is Newspaper Studio?',
    a: 'Newspaper Studio is an interactive front-page newspaper creator designed for students and educators. It allows users to write custom headlines, compose articles, format columns, apply vintage halftone photo filters, and export authentic high-resolution PDF and PNG newspapers.',
    link: '/newspaper',
    linkLabel: 'Launch Newspaper Studio →',
  },
  {
    q: 'Can students create their own newspaper online?',
    a: 'Yes! Students can use Newspaper Studio to create school gazettes, historical 1920s front pages, classroom reports, or creative journalism projects from scratch using simple drag-and-drop tools with zero software installation required.',
    link: '/newspaper',
    linkLabel: 'Create a student newspaper →',
  },
];

// Structured data for rich search results
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Typetune',
  url: 'https://typetune.ollypedia.in',
  description:
    'Free online typing speed test, educational typing games, multiplayer competitions, custom coding drills, and student Newspaper Studio.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://typetune.ollypedia.in/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Typetune',
  url: 'https://typetune.ollypedia.in',
  logo: 'https://typetune.ollypedia.in/icon.svg',
  sameAs: ['https://twitter.com', 'https://github.com'],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Typetune',
  url: 'https://typetune.ollypedia.in',
  description:
    'Improve typing speed with musical piano notes, arcade games, multiplayer rooms, custom programming drills, and Newspaper Studio.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homepageFaqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function HomePage() {
  const featuredPosts = BLOG_POSTS.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-hero">
        {/* Primary Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-12 pb-8 text-center">
          <div className="chip mb-6 inline-flex animate-fade-in">
            ♪ Every keystroke plays a note
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-5 animate-slide-up tracking-tight max-w-5xl mx-auto"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.15 }}
          >
            Improve Your Typing Speed with Games, Challenges and{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6aa850, #54b3d9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Interactive Practice
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-10 animate-slide-up leading-relaxed"
            style={{ animationDelay: '80ms' }}
          >
            Typetune transforms standard typing practice into an engaging, musical experience.
            Measure your WPM, play exciting educational typing games, race friends in real-time multiplayer,
            drill programming syntax, and create authentic vintage broadsheets in Newspaper Studio.
          </p>

          {/* Interactive Typing Engine Widget */}
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
                Explore Typing Speed Test Modes
              </h2>
              <span className="text-xs text-slate-400 font-medium">Standard WPM benchmarks, word targets & zen modes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
              {testModes.map((tm) => (
                <Link
                  key={tm.slug}
                  href={`/test/${tm.slug}`}
                  className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-sage-400 hover:shadow-md transition-all text-center group transform hover:-translate-y-0.5"
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-700 group-hover:text-sage-700">
                    {tm.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tm.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section: What is Typetune? */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-12">
          <div className="card p-8 sm:p-12 border border-slate-200 bg-white shadow-sm">
            <div className="max-w-3xl mb-8">
              <span className="chip mb-3 inline-flex">
                <Sparkles size={11} className="mr-1" />
                Platform Overview
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                What is Typetune?
              </h2>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                Typetune is a modern, student-centered touch typing and keyboard fluency ecosystem.
                Unlike traditional typing software with harsh buzzers and stressful timers, Typetune
                integrates harmonious acoustic piano sound synthesis powered by the Web Audio API.
                Typists develop steady muscle memory, natural rhythm, and high typing velocity while
                practicing through diverse formats.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-sage-50/70 border border-sage-200/60">
                <div className="w-10 h-10 rounded-xl bg-sage-500 text-white flex items-center justify-center mb-4">
                  <Keyboard size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Practice & Benchmark Speed
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Take accurate 15s, 30s, 60s, and 2-minute typing tests with live net WPM, accuracy %, and finger error diagnostics.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200/60">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                  <Gamepad2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Educational Typing Games
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Race sports cars in Nitro Highway Racer, battle alien invaders in space, and defeat monster RPG bosses with speed typing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4">
                  <Newspaper size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Newspaper Studio for Students
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Design authentic vintage broadsheets and school newspapers with headlines, columns, halftone photos, and PDF downloads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Typing Speed Tests & Analytics */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <span className="chip mb-3 inline-flex">
                <BarChart3 size={11} className="mr-1" />
                Benchmark Analytics
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Typing Speed Tests with Real-Time Analytics
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Typetune provides more than just a single WPM number. After every typing test session,
                you receive comprehensive diagnostics that pinpoint exactly how to improve your technique:
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-sage-600 shrink-0 mt-0.5" />
                  <span><strong>Raw vs. Net WPM:</strong> Standardized 5-keystroke word calculation deducting uncorrected errors for true productivity metrics.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-sage-600 shrink-0 mt-0.5" />
                  <span><strong>Anatomical Error Heatmap:</strong> Color-coded keyboard diagnostic revealing which finger and letter columns produce the most mistakes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-sage-600 shrink-0 mt-0.5" />
                  <span><strong>Pacing & Consistency Score:</strong> Statistical measurement of keystroke cadence to prevent error-prone bursts and fatigue.</span>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/test/60s" className="btn-primary text-xs sm:text-sm py-2.5 px-5">
                  Take 1-Minute Official Test →
                </Link>
                <Link href="/test/zen" className="btn-ghost text-xs sm:text-sm py-2.5 px-4">
                  Try Zen Flow Mode
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="card p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white border-2 border-slate-800 shadow-xl rounded-3xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-sage-400 font-bold">Session Analytics</div>
                    <div className="text-xl font-bold text-white">WPM & Accuracy Metrics</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-sage-500/20 text-sage-300 text-xs font-mono font-bold">
                    Acoustic Live
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-6">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl sm:text-3xl font-extrabold text-sage-400">78</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Net WPM</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">98.4%</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Accuracy</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">94</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">Consistency</div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                  💡 Tip: Typists with 95%+ accuracy reach higher speeds 3x faster than typists who rush with high error rates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Arcade & Action Typing Games Showcase */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-10">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles size={13} />
                  Educational Action Arcade
                </span>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Typing Games for Students & Typists
                </h2>
                <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                  Level up your typing velocity while racing sports cars, firing starship lasers, and conquering monster RPG bosses!
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
                      RACING & BOOSTS
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-rose-400 transition-colors">
                    Nitro Highway Racer
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    Shift gears, trigger Nitrous speed boosts, and race against rivals on the high-speed motorway!
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
                      SPACE DEFENDER
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">
                    Cosmic Galaxy Defender
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    Type telemetry coordinates and fire plasma torpedoes to shoot down alien invaders and meteors!
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

        {/* Section: Typing Challenges & Multiplayer */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8 bg-white border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Trophy size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Typing Challenges
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Push your limits with structured typing challenges designed to increase bursts, maintain stamina, and eliminate hesitation on uncommon punctuation and symbol keys.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 mb-6">
                <li>⚡ <strong>15s Speed Reflex Challenge:</strong> Test peak burst velocity.</li>
                <li>🎯 <strong>Sudden Death Precision:</strong> One error and the run resets.</li>
                <li>📜 <strong>Quotes Literature Challenge:</strong> Type prose with complex syntax.</li>
              </ul>
              <Link href="/test/15s" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
                <span>Start Speed Challenge</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="card p-8 bg-white border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Multiplayer Typing Competitions
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Engage classmates and friends in real-time typing races. Create private multiplayer rooms or join live global lobbies with real-time race position tracks and leaderboards.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 mb-6">
                <li>🏁 <strong>Live Track Visualization:</strong> Watch rival cars accelerate in real time.</li>
                <li>👥 <strong>Classroom Friendly:</strong> Simple 6-character room codes for quick joins.</li>
                <li>🏆 <strong>Post-Race Leaderboards:</strong> Compare WPM and accuracy side-by-side.</li>
              </ul>
              <Link href="/games" className="btn-ghost text-xs py-2 px-4 inline-flex items-center gap-1.5 border border-slate-200">
                <span>Join Multiplayer Lobby</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* Section: Custom Typing Practice */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-10">
          <div className="card p-8 sm:p-10 bg-gradient-to-r from-sky-50/80 to-white border border-sky-200/80">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
                  <PenTool size={13} />
                  Developer & Custom Studio
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  Create Custom Typing Practice & Coding Drills
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Tailor your typing sessions to your specific learning goals. Practice programming syntax in JavaScript, Python, TypeScript, React, HTML/CSS, and SQL. Teachers can paste customized reading curriculum, while typists can isolate and drill weak pinky keys.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 text-xs font-medium text-slate-700">
                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">💻 JavaScript & Python Code</span>
                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">🎯 Weak Key Isolator</span>
                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">📝 Paste Custom Text</span>
                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">⚡ Shift & Symbol Mastery</span>
                </div>
              </div>

              <Link
                href="/custom"
                className="btn-primary py-3 px-6 text-sm font-bold whitespace-nowrap shrink-0 shadow-md"
              >
                <span>Launch Custom Studio</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Newspaper Studio Showcase */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-10">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-950 via-[#2d2218] to-stone-950 border-2 border-amber-800/40 text-amber-100 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles size={13} />
                  Newspaper Studio for Students
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Create Your Own Newspaper Online 📰
                </h2>
                <p className="text-amber-200/80 text-sm sm:text-base mt-3 leading-relaxed font-serif">
                  Newspaper Studio empowers students to design personalized newspapers from scratch.
                  Compose breaking headlines, write stories across multi-column layouts, apply authentic vintage halftone photo filters, and export ultra-high-resolution PDF and PNG editions ready for classroom print.
                </p>
                <div className="flex flex-wrap gap-2.5 mt-4 text-xs font-medium text-amber-300/90">
                  <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-700/50">✨ 7 Vintage & Modern Presets</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-700/50">📸 Halftone Photo Filters</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-700/50">⌨️ Real Typewriter Audio</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-900/60 border border-amber-700/50">📥 Print-Ready PDF & PNG</span>
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

        {/* Section: How Typetune Helps Students */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="chip mb-2 inline-flex">
              <GraduationCap size={11} className="mr-1" />
              Educational Impact
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              How Typetune Helps Students & Educators
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Typing is the primary input method for modern education, coding, and writing.
              Typetune creates a motivating learning atmosphere that turns repetitive typing drills into rewarding creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 border border-slate-200 bg-white">
              <h3 className="font-bold text-base text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Auditory Motor Entrainment
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Neuroscientific research shows that rhythmic auditory cues help the motor cortex establish uniform keystroke intervals, eliminating erratic speed spikes and error clusters.
              </p>
            </div>

            <div className="card p-6 border border-slate-200 bg-white">
              <h3 className="font-bold text-base text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Stress-Free Learning
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                By replacing abrasive error buzzers with gentle, harmonious pentatonic notes, students remain in a relaxed flow state and practice longer without mental fatigue.
              </p>
            </div>

            <div className="card p-6 border border-slate-200 bg-white">
              <h3 className="font-bold text-base text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Cross-Curricular Journalism
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Newspaper Studio connects keyboard fluency directly with history, English, and science writing projects, giving students pride in publishing tangible print newspapers.
              </p>
            </div>
          </div>
        </section>

        {/* Read & Practice Blog Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-10">
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
                Read research-backed typing guides, then practice typing the actual text with piano audio!
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

        {/* Why Typetune is different */}
        <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Why Typetune is Different
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

        {/* SEO FAQ Section with Accordion and Schema Match */}
        <section className="bg-section py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-12">
            <div className="text-center mb-10">
              <span className="chip mb-2 inline-flex">
                <HelpCircle size={11} className="mr-1" />
                Frequently Asked Questions
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Everything You Need to Know About Typetune
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Common questions about typing speed tests, educational games, multiplayer racing, and Newspaper Studio.
              </p>
            </div>

            <div className="space-y-3.5 mb-10">
              {homepageFaqs.map((faq, i) => (
                <details
                  key={i}
                  className="card p-0 overflow-hidden group border border-slate-200/80 bg-white"
                >
                  <summary
                    className="flex items-center justify-between p-5 sm:p-6 cursor-pointer font-semibold text-slate-700 hover:text-sage-700 transition-colors list-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <span className="text-sm sm:text-base font-bold">{faq.q}</span>
                    <span className="text-slate-400 group-open:rotate-45 transition-transform duration-200 ml-4 flex-shrink-0 text-xl font-mono">
                      +
                    </span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-6 -mt-2">
                    <p className="text-slate-600 leading-relaxed text-sm">{faq.a}</p>
                    {faq.link && (
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <Link
                          href={faq.link}
                          className="text-xs font-semibold text-sage-600 hover:underline inline-flex items-center gap-1"
                        >
                          {faq.linkLabel}
                        </Link>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>

            <div className="text-center flex flex-wrap items-center justify-center gap-3">
              <Link href="/test/60s" className="btn-primary text-xs sm:text-sm py-2.5 px-5 shadow-md">
                Start 1-Minute Speed Test →
              </Link>
              <Link href="/faq" className="btn-ghost text-xs sm:text-sm py-2.5 px-5 border border-slate-200">
                View Full FAQ Hub
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
