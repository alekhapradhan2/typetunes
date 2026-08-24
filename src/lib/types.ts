// Shared TypeScript types for TypeTunes

export type TestMode = 'time' | 'words' | 'zen';
export type TimeDuration = 15 | 30 | 60 | 120;
export type WordCount = 25 | 50 | 100;

export interface DifficultyConfig {
  mode: TestMode;
  timeDuration?: TimeDuration;
  wordCount?: WordCount;
  includePunctuation: boolean;
  includeNumbers: boolean;
  useQuotes: boolean;
}

export interface KeystrokeEvent {
  char: string;
  expected: string;
  correct: boolean;
  timestamp: number; // performance.now()
  wpmAtMoment: number;
}

export interface CharState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'extra';
}

export interface TestResult {
  id: string;
  userId?: string;           // null for anonymous
  createdAt: string;         // ISO string
  config: DifficultyConfig;
  rawWpm: number;
  netWpm: number;
  accuracy: number;          // 0–100
  consistencyScore: number;  // 0–100 (lower std dev = higher score)
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  duration: number;          // seconds
  wpmOverTime: { second: number; wpm: number }[];
  keystrokeEvents: KeystrokeEvent[];
  errorsByKey: Record<string, number>;  // char → error count
  rhythmProfile: 'steady' | 'bursty' | 'mixed';
  takeawayMessage: string;
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  netWpm: number;
  accuracy: number;
  mode: TestMode;
  duration?: number;
  wordCount?: number;
}

export type TestPhase = 'idle' | 'countdown' | 'active' | 'finished';

export type SoundPack = 'piano' | 'lofi-chime' | 'synth-8bit' | 'thock-mechanical' | 'marimba';
export type MusicalScale = 'pentatonic-major' | 'minor-melodic' | 'japanese-insen' | 'blues';

export interface AudioSettings {
  muted: boolean;
  volume: number; // 0–1
  soundPack?: SoundPack;
  scale?: MusicalScale;
}

export interface CustomSnippetPreset {
  id: string;
  title: string;
  category: 'code' | 'prose' | 'fun' | 'speed';
  language?: string;
  description: string;
  content: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: number; // minutes
  category: string;
  content: string;
}
