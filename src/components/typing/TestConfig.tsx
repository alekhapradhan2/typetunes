'use client';

import type { DifficultyConfig, TestMode, TimeDuration, WordCount } from '@/lib/types';
import {
  Clock,
  Type,
  Quote,
  Mountain,
  Wrench,
  AtSign,
  Hash,
} from 'lucide-react';

interface TestConfigProps {
  config: DifficultyConfig;
  disabled: boolean;
  onConfigChange: (c: DifficultyConfig) => void;
}

const TIME_OPTIONS: TimeDuration[] = [15, 30, 60, 120];
const WORD_OPTIONS: WordCount[] = [25, 50, 100];

export default function TestConfig({
  config,
  disabled,
  onConfigChange,
}: TestConfigProps) {
  const set = (patch: Partial<DifficultyConfig>) =>
    onConfigChange({ ...config, ...patch });

  return (
    <nav
      className="inline-flex items-center flex-wrap gap-1 sm:gap-2 px-3 py-1.5 rounded-2xl bg-stone-200/50 dark:bg-slate-900/90 border border-stone-300/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 select-none shadow-2xs"
      aria-label="Typing test configuration"
    >
      {/* ── Segment 1: Modifiers (@ punctuation, # numbers) ────────────────── */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={disabled}
          onClick={() => set({ includePunctuation: !config.includePunctuation })}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            config.includePunctuation
              ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <AtSign size={13} />
          <span>punctuation</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => set({ includeNumbers: !config.includeNumbers })}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            config.includeNumbers
              ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Hash size={13} />
          <span>numbers</span>
        </button>
      </div>

      <div className="h-4 w-px bg-stone-300 dark:bg-slate-800 mx-1 hidden sm:block" />

      {/* ── Segment 2: Modes (time, words, quote, zen) ────────────────────── */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={disabled}
          onClick={() => set({ mode: 'time', useQuotes: false })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            config.mode === 'time' && !config.useQuotes
              ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Clock size={13} />
          <span>time</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => set({ mode: 'words', useQuotes: false })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            config.mode === 'words' && !config.useQuotes
              ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Type size={13} />
          <span>words</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => set({ useQuotes: true, mode: 'zen' })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            config.useQuotes
              ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Quote size={13} />
          <span>quote</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => set({ mode: 'zen', useQuotes: false })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
            config.mode === 'zen' && !config.useQuotes
              ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10'
              : 'hover:text-slate-800 dark:hover:text-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Mountain size={13} />
          <span>zen</span>
        </button>
      </div>

      <div className="h-4 w-px bg-stone-300 dark:bg-slate-800 mx-1 hidden sm:block" />

      {/* ── Segment 3: Sub-durations & Word limits ────────────────────────── */}
      <div className="flex items-center gap-1">
        {config.mode === 'time' && !config.useQuotes &&
          TIME_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              disabled={disabled}
              onClick={() => set({ timeDuration: t })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer font-mono font-medium ${
                config.timeDuration === t
                  ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t}
            </button>
          ))}

        {config.mode === 'words' && !config.useQuotes &&
          WORD_OPTIONS.map((w) => (
            <button
              key={w}
              type="button"
              disabled={disabled}
              onClick={() => set({ wordCount: w })}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer font-mono font-medium ${
                config.wordCount === w
                  ? 'text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10'
                  : 'hover:text-slate-800 dark:hover:text-slate-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {w}
            </button>
          ))}

        {config.useQuotes && (
          <span className="text-amber-500/80 dark:text-amber-400/80 text-[11px] px-2 py-1 font-mono">
            Classic Literature
          </span>
        )}

        {config.mode === 'zen' && !config.useQuotes && (
          <span className="text-sage-600 dark:text-sage-400 text-[11px] px-2 py-1 font-medium">
            🌿 Flow State
          </span>
        )}
      </div>
    </nav>
  );
}
