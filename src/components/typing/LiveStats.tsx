'use client';

import type { TestPhase } from '@/lib/types';
import { Zap, Target, Clock, BookOpen } from 'lucide-react';

interface LiveStatsProps {
  wpm: number;
  accuracy: number;
  timeLeft?: number;
  wordsTyped?: number;
  wordGoal?: number;
  phase: TestPhase;
}

export default function LiveStats({
  wpm,
  accuracy,
  timeLeft,
  wordsTyped,
  wordGoal,
  phase,
}: LiveStatsProps) {
  const isActive = phase === 'active';

  return (
    <div
      className="flex items-center gap-3 sm:gap-4 transition-all duration-300"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* WPM Pill */}
      <div
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
          isActive
            ? 'bg-sage-50/90 border-sage-200 shadow-xs'
            : 'bg-slate-50/60 border-slate-200/60'
        }`}
      >
        <Zap
          size={15}
          className={isActive ? 'text-sage-600 animate-pulse' : 'text-slate-400'}
        />
        <div className="flex items-baseline gap-1">
          <span
            className="text-xl font-bold tabular-nums"
            style={{
              fontFamily: 'var(--font-display)',
              color: isActive ? 'var(--sage-700)' : '#64748b',
            }}
          >
            {wpm}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            WPM
          </span>
        </div>
      </div>

      {/* Accuracy Pill */}
      <div
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
          isActive
            ? 'bg-sky-50/90 border-sky-200 shadow-xs'
            : 'bg-slate-50/60 border-slate-200/60'
        }`}
      >
        <Target
          size={15}
          className={isActive ? 'text-sky-500' : 'text-slate-400'}
        />
        <div className="flex items-baseline gap-1">
          <span
            className="text-xl font-bold tabular-nums"
            style={{
              fontFamily: 'var(--font-display)',
              color: isActive ? 'var(--sky-600)' : '#64748b',
            }}
          >
            {accuracy}
            <span className="text-xs font-medium">%</span>
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            ACC
          </span>
        </div>
      </div>

      {/* Timer Pill */}
      {timeLeft !== undefined && (
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
            timeLeft <= 10 && isActive
              ? 'bg-coral-50 border-coral-300 ring-2 ring-coral-200/50'
              : isActive
              ? 'bg-amber-50/70 border-amber-200 shadow-xs'
              : 'bg-slate-50/60 border-slate-200/60'
          }`}
        >
          <Clock
            size={15}
            className={
              timeLeft <= 10 && isActive
                ? 'text-coral-500 animate-bounce'
                : isActive
                ? 'text-amber-600'
                : 'text-slate-400'
            }
          />
          <div className="flex items-baseline gap-1">
            <span
              className="text-xl font-bold tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                color:
                  timeLeft <= 10 && isActive
                    ? 'var(--coral-500)'
                    : isActive
                    ? '#b45309'
                    : '#64748b',
              }}
            >
              {timeLeft}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              SEC
            </span>
          </div>
        </div>
      )}

      {/* Word Count Goal Pill */}
      {wordsTyped !== undefined && wordGoal !== undefined && (
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
            isActive
              ? 'bg-purple-50/70 border-purple-200 shadow-xs'
              : 'bg-slate-50/60 border-slate-200/60'
          }`}
        >
          <BookOpen
            size={15}
            className={isActive ? 'text-purple-600' : 'text-slate-400'}
          />
          <div className="flex items-baseline gap-1">
            <span
              className="text-xl font-bold tabular-nums"
              style={{
                fontFamily: 'var(--font-display)',
                color: isActive ? '#7e22ce' : '#64748b',
              }}
            >
              {wordsTyped}
              <span className="text-xs font-normal text-slate-400">/{wordGoal}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              WORDS
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
