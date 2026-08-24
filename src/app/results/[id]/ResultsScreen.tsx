'use client';

import { useState, useEffect } from 'react';
import type { TestResult } from '@/lib/types';
import { getLocalResult } from '@/lib/storage';
import WpmChart from '@/components/charts/WpmChart';
import ErrorHeatmap from '@/components/charts/ErrorHeatmap';
import RhythmChart from '@/components/charts/RhythmChart';
import WeakPointsAnalysis from '@/components/results/WeakPointsAnalysis';
import {
  Zap,
  Target,
  Clock,
  TrendingUp,
  Music2,
  Share2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Minus,
} from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

interface ResultsScreenProps {
  id?: string;
  initialResult?: TestResult | null;
  result?: TestResult;
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: color + '20', color }}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <div>
        <div
          className="text-3xl font-bold tabular-nums"
          style={{ fontFamily: 'var(--font-display)', color }}
        >
          {value}
          {unit && <span className="text-lg font-normal ml-1 opacity-60">{unit}</span>}
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}

function RhythmBadge({ profile }: { profile: string }) {
  const map = {
    steady: { icon: CheckCircle2, color: '#6aa850', label: 'Steady' },
    bursty: { icon: Zap, color: '#c8a878', label: 'Bursty' },
    mixed:  { icon: Minus,        color: '#b8a8c8', label: 'Mixed'  },
  } as const;
  const { icon: Icon, color, label } =
    map[profile as keyof typeof map] ?? map.mixed;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
      style={{ backgroundColor: color + '18', color }}
    >
      <Icon size={13} />
      {label} rhythm
    </span>
  );
}

export default function ResultsScreen({ id, initialResult, result: legacyResult }: ResultsScreenProps) {
  const [result, setResult] = useState<TestResult | null>(legacyResult ?? initialResult ?? null);
  const [loading, setLoading] = useState(!legacyResult && !initialResult);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result) return;
    if (!id) {
      setLoading(false);
      return;
    }

    // 1. Try local storage first (instant & works offline)
    const local = getLocalResult(id);
    if (local) {
      setResult(local);
      setLoading(false);
      return;
    }

    // 2. Fetch from API endpoint if not in local storage
    fetch(`/api/results?id=${encodeURIComponent(id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error && data.id) {
          setResult(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, result]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      prompt('Copy this link to share your result:', url);
    }
  };

  if (loading) {
    return (
      <div className="bg-hero min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-sm">Loading your result...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-hero min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="card p-8 max-w-md w-full text-center animate-slide-up">
          <AlertCircle size={44} className="text-amber-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Result Not Found
          </h1>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            We couldn&apos;t find this test result. It may have expired or was recorded in a different browser session.
          </p>
          <Link href="/" className="btn-primary w-full justify-center">
            <RotateCcw size={16} />
            Start a New Test
          </Link>
        </div>
      </div>
    );
  }

  const avgWpm =
    result.wpmOverTime.length > 0
      ? Math.round(
          result.wpmOverTime.reduce((s, p) => s + p.wpm, 0) /
            result.wpmOverTime.length
        )
      : result.netWpm;

  // Compute keystroke intervals from events
  const intervals = result.keystrokeEvents
    .slice(1)
    .map((ev, i) => ev.timestamp - result.keystrokeEvents[i].timestamp)
    .filter((iv) => iv > 0 && iv < 2000); // remove pauses >2s

  return (
    <div className="bg-hero min-h-screen py-10 px-4">
      <div className="mx-auto max-w-6xl w-full px-2 sm:px-6 animate-slide-up">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: 'Typing Test', href: '/' },
            { label: `${result.netWpm} WPM Result` },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Music2 size={16} className="text-sage-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-sage-600">
                TypeTunes Result
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold text-slate-800"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {result.netWpm} WPM · {result.accuracy}% accuracy
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {new Date(result.createdAt).toLocaleDateString('en-US', {
                dateStyle: 'medium',
              })}{' '}
              · {result.config.mode} mode
              {result.config.timeDuration
                ? ` · ${result.config.timeDuration}s`
                : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="share-result-btn"
              onClick={handleShare}
              className="btn-ghost"
            >
              <Share2 size={14} />
              {copied ? 'Copied!' : 'Share'}
            </button>
            <Link href="/" className="btn-primary">
              <RotateCcw size={14} />
              Try Again
            </Link>
          </div>
        </div>

        {/* Takeaway banner */}
        <div className="card p-5 mb-8 flex items-start gap-3 border-l-4" style={{ borderLeftColor: '#6aa850' }}>
          <AlertCircle size={18} className="text-sage-500 mt-0.5 flex-shrink-0" />
          <p className="text-slate-600 text-sm leading-relaxed">
            {result.takeawayMessage}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Net WPM"
            value={result.netWpm}
            icon={Zap}
            color="#6aa850"
          />
          <StatCard
            label="Raw WPM"
            value={result.rawWpm}
            icon={TrendingUp}
            color="#54b3d9"
          />
          <StatCard
            label="Accuracy"
            value={result.accuracy}
            unit="%"
            icon={Target}
            color="#b8a8c8"
          />
          <StatCard
            label="Consistency"
            value={result.consistencyScore}
            unit="/100"
            icon={Clock}
            color="#c8a878"
          />
        </div>

        {/* Weak Points & Action Plan Section */}
        <WeakPointsAnalysis result={result} />

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* WPM over time */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-semibold text-slate-700"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Speed Over Time
              </h2>
              <RhythmBadge profile={result.rhythmProfile} />
            </div>
            <WpmChart data={result.wpmOverTime} avgWpm={avgWpm} />
          </div>

          {/* Rhythm distribution */}
          <div className="card p-6">
            <h2
              className="font-semibold text-slate-700 mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Keystroke Rhythm
            </h2>
            <RhythmChart intervals={intervals} />
            <p className="text-xs text-slate-400 mt-2 text-center">
              Bars clustered left = fast, consistent rhythm
            </p>
          </div>
        </div>

        {/* Error heatmap */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-semibold text-slate-700"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Error Heatmap
            </h2>
            <span className="text-xs text-slate-400">
              {result.incorrectKeystrokes} errors /{' '}
              {result.totalKeystrokes} keystrokes
            </span>
          </div>
          <div className="overflow-x-auto">
            <ErrorHeatmap errorsByKey={result.errorsByKey} />
          </div>
        </div>

        {/* Bottom details */}
        <div className="card p-6">
          <h2
            className="font-semibold text-slate-700 mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Session Details
          </h2>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              ['Total keystrokes', result.totalKeystrokes],
              ['Correct', result.correctKeystrokes],
              ['Errors', result.incorrectKeystrokes],
              ['Duration', `${result.duration}s`],
              ['Mode', result.config.mode],
              ['Punctuation', result.config.includePunctuation ? 'On' : 'Off'],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <dt className="text-slate-400 text-xs uppercase tracking-widest">
                  {label}
                </dt>
                <dd className="font-semibold text-slate-700 mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
