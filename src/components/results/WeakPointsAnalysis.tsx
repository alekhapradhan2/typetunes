'use client';

import { useMemo } from 'react';
import type { TestResult } from '@/lib/types';
import {
  AlertTriangle,
  Compass,
  Zap,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Keyboard,
  Target,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

// Key to finger mapping for actionable anatomical coaching
const FINGER_MAP: Record<string, string> = {
  q: 'Left Pinky',
  a: 'Left Pinky',
  z: 'Left Pinky',
  w: 'Left Ring',
  s: 'Left Ring',
  x: 'Left Ring',
  e: 'Left Middle',
  d: 'Left Middle',
  c: 'Left Middle',
  r: 'Left Index',
  f: 'Left Index',
  v: 'Left Index',
  t: 'Left Index',
  g: 'Left Index',
  b: 'Left Index',
  y: 'Right Index',
  h: 'Right Index',
  n: 'Right Index',
  u: 'Right Index',
  j: 'Right Index',
  m: 'Right Index',
  i: 'Right Middle',
  k: 'Right Middle',
  ',': 'Right Middle',
  o: 'Right Ring',
  l: 'Right Ring',
  '.': 'Right Ring',
  p: 'Right Pinky',
  ';': 'Right Pinky',
  '/': 'Right Pinky',
  "'": 'Right Pinky',
  '[': 'Right Pinky',
  ']': 'Right Pinky',
  '-': 'Right Pinky',
  '=': 'Right Pinky',
  ' ': 'Thumb (Space)',
};

interface WeakPointsAnalysisProps {
  result: TestResult;
}

export default function WeakPointsAnalysis({ result }: WeakPointsAnalysisProps) {
  // 1. Identify top 4 weakest keys
  const weakKeys = useMemo(() => {
    const entries = Object.entries(result.errorsByKey || {}).filter(
      ([, count]) => count > 0
    );
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 4).map(([key, count]) => ({
      key,
      count,
      finger: FINGER_MAP[key.toLowerCase()] || 'Finger reach',
    }));
  }, [result.errorsByKey]);

  // 2. Identify the primary bottleneck
  const bottleneck = useMemo(() => {
    const accuracy = result.accuracy;
    const rawWpm = result.rawWpm;
    const netWpm = result.netWpm;
    const wpmLost = Math.max(0, rawWpm - netWpm);

    if (accuracy < 88) {
      return {
        type: 'accuracy_penalty',
        title: 'Accuracy Bottleneck (Rushing Ahead)',
        severity: 'high',
        icon: AlertTriangle,
        color: '#dc2626',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        description: `You reached a raw speed of ${rawWpm} WPM, but errors dropped your net score to ${netWpm} WPM (lost ${wpmLost} WPM to typos). Backspacing and micro-freezes are holding you back.`,
        recommendation: `Slow down to ${Math.max(15, Math.round(rawWpm * 0.75))} WPM until your accuracy consistently stays above 96%. Speed will rise automatically once errors disappear.`,
      };
    }

    if (result.consistencyScore < 65) {
      return {
        type: 'inconsistent_rhythm',
        title: 'Rhythm & Pacing Bottleneck (Bursty Typing)',
        severity: 'medium',
        icon: Zap,
        color: '#d97706',
        bgColor: '#fffbeb',
        borderColor: '#fde68a',
        description: `Your consistency score is ${result.consistencyScore}/100. You type in rapid bursts on easy words, then experience sharp deceleration on difficult characters.`,
        recommendation: `Focus on an even metronome pace. Treat keystrokes like a continuous musical rhythm instead of sprinting and pausing.`,
      };
    }

    if (accuracy >= 94 && netWpm < 50) {
      return {
        type: 'lookahead_buffer',
        title: 'Visual Lookahead Opportunity',
        severity: 'low',
        icon: Compass,
        color: '#2563eb',
        bgColor: '#eff6ff',
        borderColor: '#bfdbfe',
        description: `Your accuracy is fantastic (${accuracy}%), but your raw speed is conservative (${netWpm} WPM). You are likely reading character-by-character.`,
        recommendation: `Train your eyes to scan 2 to 3 words ahead in the text stream while your fingers type the current word automatically.`,
      };
    }

    return {
      type: 'mastery',
      title: 'Strong Balanced Technique',
      severity: 'good',
      icon: CheckCircle,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
      description: `Solid performance! Your ${netWpm} WPM with ${accuracy}% accuracy demonstrates balanced muscle memory and smooth motor coordination.`,
      recommendation: `Challenge yourself with longer 2-minute sessions, punctuation mode, or custom vocabulary drills to push past your current speed ceiling.`,
    };
  }, [result]);

  return (
    <div className="card p-6 sm:p-8 mb-8 border border-slate-200/80 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
        <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center text-sage-700">
          <Lightbulb size={18} />
        </div>
        <div>
          <h2
            className="text-xl font-bold text-slate-800"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Weak Points & Personal Action Plan
          </h2>
          <p className="text-xs text-slate-500">
            Diagnostic breakdown of your mistakes and actionable steps to improve.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Weakest Keys Diagnosis */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Keyboard size={14} className="text-slate-400" />
            Top Problem Keys in This Test
          </h3>

          {weakKeys.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {weakKeys.map(({ key, count, finger }) => (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-mono font-bold text-base flex items-center justify-center text-coral shadow-2xs">
                      {key === ' ' ? '␣' : key}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-700">
                        {count} {count === 1 ? 'error' : 'errors'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {finger}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-sage-50/70 border border-sage-200 text-xs text-sage-800 flex items-center gap-2.5">
              <CheckCircle size={18} className="text-sage-600 flex-shrink-0" />
              <span>
                <strong>Zero key errors detected!</strong> Your finger placement
                and keystroke accuracy were flawless.
              </span>
            </div>
          )}

          {/* Actionable Finger Advice */}
          {weakKeys.length > 0 && (
            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              💡 <strong>Coaching tip:</strong> Your most missed key was{' '}
              <strong className="text-slate-700">
                "{weakKeys[0].key === ' ' ? 'Space' : weakKeys[0].key}"
              </strong>{' '}
              ({weakKeys[0].finger}). Keep your wrists hovering slightly and
              re-anchor your hand to the home row after each reach.
            </p>
          )}
        </div>

        {/* Right Column: Bottleneck & Practice Strategy */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Target size={14} className="text-slate-400" />
            Performance Diagnosis
          </h3>

          <div
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: bottleneck.bgColor,
              borderColor: bottleneck.borderColor,
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <bottleneck.icon size={16} style={{ color: bottleneck.color }} />
              <h4
                className="text-sm font-bold"
                style={{ color: bottleneck.color }}
              >
                {bottleneck.title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {bottleneck.description}
            </p>
            <div className="pt-2.5 border-t border-black/5 text-xs text-slate-700 font-medium leading-relaxed">
              🎯 <strong>What to do next:</strong> {bottleneck.recommendation}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Practice CTA */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Sparkles size={14} className="text-lavender-dark" />
          <span>Ready to turn your weak points into muscle memory?</span>
        </div>

        <Link
          href="/"
          className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5"
        >
          Practice Again with Focused Accuracy
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
