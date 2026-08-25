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
      className="flex items-center gap-2.5 sm:gap-3.5 transition-all duration-300"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* WPM Pill */}
      <div
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
          isActive
            ? 'bg-sage-50/90 dark:bg-emerald-950/70 border-sage-300 dark:border-emerald-700/80 shadow-xs'
            : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80'
        }`}
      >
        <Zap
          size={15}
          className={isActive ? 'text-sage-600 dark:text-emerald-400 animate-pulse' : 'text-slate-400 dark:text-slate-400'}
        />
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl font-bold tabular-nums ${
              isActive ? 'text-sage-800 dark:text-emerald-300' : 'text-slate-700 dark:text-white'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {wpm}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
            WPM
          </span>
        </div>
      </div>

      {/* Accuracy Pill */}
      <div
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
          isActive
            ? 'bg-sky-50/90 dark:bg-sky-950/70 border-sky-300 dark:border-sky-700/80 shadow-xs'
            : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80'
        }`}
      >
        <Target
          size={15}
          className={isActive ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400 dark:text-slate-400'}
        />
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl font-bold tabular-nums ${
              isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-white'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {accuracy}
            <span className="text-xs font-medium">%</span>
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
            ACC
          </span>
        </div>
      </div>

      {/* Timer Pill */}
      {timeLeft !== undefined && (
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
            timeLeft <= 10 && isActive
              ? 'bg-coral-50 dark:bg-rose-950/80 border-coral-300 dark:border-rose-700 ring-2 ring-coral-200/50'
              : isActive
              ? 'bg-amber-50/70 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 shadow-xs'
              : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <Clock
            size={15}
            className={
              timeLeft <= 10 && isActive
                ? 'text-coral-500 dark:text-rose-400 animate-bounce'
                : isActive
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-400 dark:text-slate-400'
            }
          />
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-bold tabular-nums ${
                timeLeft <= 10 && isActive
                  ? 'text-coral-600 dark:text-rose-300'
                  : isActive
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-slate-700 dark:text-white'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {timeLeft}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
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
              ? 'bg-purple-50/70 dark:bg-purple-950/70 border-purple-300 dark:border-purple-700/80 shadow-xs'
              : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <BookOpen
            size={15}
            className={isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-400'}
          />
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-bold tabular-nums ${
                isActive ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-white'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {wordsTyped}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/{wordGoal}</span>
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold uppercase tracking-wider">
              WORDS
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
