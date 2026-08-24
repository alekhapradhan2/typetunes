'use client';

import type { DifficultyConfig, TestMode, TimeDuration, WordCount } from '@/lib/types';

interface TestConfigProps {
  config: DifficultyConfig;
  disabled: boolean;
  onConfigChange: (c: DifficultyConfig) => void;
}

const TIME_OPTIONS: TimeDuration[] = [15, 30, 60, 120];
const WORD_OPTIONS: WordCount[] = [25, 50, 100];

function Chip({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'px-4 py-2 min-h-[40px] rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center justify-center',
        active
          ? 'bg-sage-500 text-white shadow-sm font-semibold'
          : 'text-slate-600 hover:bg-sage-100 hover:text-sage-700 bg-white/70 border border-slate-200/60',
        disabled && 'cursor-not-allowed opacity-50',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span className="text-slate-200 select-none">|</span>;
}

export default function TestConfig({
  config,
  disabled,
  onConfigChange,
}: TestConfigProps) {
  const set = (patch: Partial<DifficultyConfig>) =>
    onConfigChange({ ...config, ...patch });

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 text-sm"
      aria-label="Test configuration"
    >
      {/* Mode */}
      <Chip
        label="Time"
        active={config.mode === 'time'}
        disabled={disabled}
        onClick={() => set({ mode: 'time', timeDuration: 60, useQuotes: false })}
      />
      <Chip
        label="Words"
        active={config.mode === 'words'}
        disabled={disabled}
        onClick={() => set({ mode: 'words', wordCount: 50, useQuotes: false })}
      />
      <Chip
        label="Zen"
        active={config.mode === 'zen'}
        disabled={disabled}
        onClick={() => set({ mode: 'zen', useQuotes: false })}
      />
      <Chip
        label="Quotes"
        active={config.useQuotes}
        disabled={disabled}
        onClick={() => set({ useQuotes: !config.useQuotes, mode: 'zen' })}
      />

      <Divider />

      {/* Time sub-options */}
      {config.mode === 'time' &&
        TIME_OPTIONS.map((t) => (
          <Chip
            key={t}
            label={`${t}s`}
            active={config.timeDuration === t}
            disabled={disabled}
            onClick={() => set({ timeDuration: t })}
          />
        ))}

      {/* Word sub-options */}
      {config.mode === 'words' &&
        WORD_OPTIONS.map((w) => (
          <Chip
            key={w}
            label={String(w)}
            active={config.wordCount === w}
            disabled={disabled}
            onClick={() => set({ wordCount: w })}
          />
        ))}

      <Divider />

      {/* Difficulty toggles */}
      <Chip
        label="@ punctuation"
        active={config.includePunctuation}
        disabled={disabled}
        onClick={() => set({ includePunctuation: !config.includePunctuation })}
      />
      <Chip
        label="# numbers"
        active={config.includeNumbers}
        disabled={disabled}
        onClick={() => set({ includeNumbers: !config.includeNumbers })}
      />

      <Divider />

      {/* Games Arcade & Custom Studio Hub Links */}
      <a
        href="/games"
        className="px-3.5 py-2 min-h-[40px] rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 shadow-2xs hover:shadow-xs"
        title="Open Typing Games (Racing, Space Defender, RPG Bosses)"
      >
        <span>🏎️ Games</span>
      </a>

      <a
        href="/custom"
        className="px-3.5 py-2 min-h-[40px] rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 shadow-2xs hover:shadow-xs"
        title="Open Custom Game & Practice Studio"
      >
        <span>✨ Studio</span>
      </a>
    </div>
  );
}
