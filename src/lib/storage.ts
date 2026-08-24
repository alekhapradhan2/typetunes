import type { AudioSettings, TestResult } from './types';

const STORAGE_KEYS = {
  AUDIO: 'typetune_audio',
  HISTORY: 'typetune_history',
  PREFERENCES: 'typetune_prefs',
  RESULT_PREFIX: 'typetune_res_',
} as const;

// ─── Audio Settings ───────────────────────────────────────────────────────────

export function getAudioSettings(): AudioSettings {
  if (typeof window === 'undefined') return { muted: false, volume: 0.6 };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIO);
    if (!raw) return { muted: false, volume: 0.6 };
    return JSON.parse(raw) as AudioSettings;
  } catch {
    return { muted: false, volume: 0.6 };
  }
}

export function saveAudioSettings(settings: AudioSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.AUDIO, JSON.stringify(settings));
}

// ─── Full Test Results ────────────────────────────────────────────────────────

export function saveLocalResult(result: TestResult): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.RESULT_PREFIX + result.id, JSON.stringify(result));
    pushLocalHistoryId(result.id);
  } catch (e) {
    console.warn('[TypeTunes] Failed to save local result:', e);
  }
}

export function getLocalResult(id: string): TestResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULT_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as TestResult;
  } catch {
    return null;
  }
}

// ─── Recent Result IDs (for history linking) ─────────────────────────────────

export function getLocalHistoryIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function pushLocalHistoryId(id: string): void {
  if (typeof window === 'undefined') return;
  const ids = getLocalHistoryIds();
  const updated = [id, ...ids.filter((x) => x !== id)].slice(0, 50); // keep last 50 unique
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
}

// ─── User Preferences ─────────────────────────────────────────────────────────

interface Preferences {
  darkMode?: boolean;
  reducedMotion?: boolean;
  lastMode?: string;
  lastDuration?: number;
}

export function getPreferences(): Preferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return {};
    return JSON.parse(raw) as Preferences;
  } catch {
    return {};
  }
}

export function savePreferences(prefs: Partial<Preferences>): void {
  if (typeof window === 'undefined') return;
  const current = getPreferences();
  localStorage.setItem(
    STORAGE_KEYS.PREFERENCES,
    JSON.stringify({ ...current, ...prefs })
  );
}

