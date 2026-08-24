import type { KeystrokeEvent, TestResult, DifficultyConfig } from './types';
import { nanoid } from 'nanoid';

// ─── WPM Calculation ─────────────────────────────────────────────────────────

/**
 * Raw WPM = (correct characters typed / 5) / minutes elapsed
 * The /5 converts chars to "words" (standard word length).
 */
export function calcRawWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(correctChars / 5 / minutes);
}

/**
 * Net WPM = Raw WPM − (errors / minutes)
 * Penalises uncorrected errors.
 */
export function calcNetWpm(
  correctChars: number,
  errors: number,
  elapsedMs: number
): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  const raw = correctChars / 5 / minutes;
  const penalty = errors / minutes;
  return Math.max(0, Math.round(raw - penalty));
}

/**
 * Accuracy = correct keystrokes / total keystrokes * 100
 */
export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 1000) / 10; // 1 decimal place
}

// ─── Consistency Score ────────────────────────────────────────────────────────

/**
 * Computes consistency as 100 − (normalized std dev of WPM samples).
 * A score of 100 means perfectly steady typing; 0 means wildly inconsistent.
 */
export function calcConsistencyScore(wpmSamples: number[]): number {
  if (wpmSamples.length < 2) return 100;
  const mean = wpmSamples.reduce((a, b) => a + b, 0) / wpmSamples.length;
  if (mean === 0) return 100;
  const variance =
    wpmSamples.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
    wpmSamples.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100; // coefficient of variation
  return Math.max(0, Math.round(100 - cv));
}

// ─── Rhythm Classification ────────────────────────────────────────────────────

/**
 * Classifies typing rhythm based on inter-keystroke interval distribution.
 */
export function classifyRhythm(
  events: KeystrokeEvent[]
): 'steady' | 'bursty' | 'mixed' {
  if (events.length < 5) return 'steady';

  const intervals: number[] = [];
  for (let i = 1; i < events.length; i++) {
    intervals.push(events[i].timestamp - events[i - 1].timestamp);
  }

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
    intervals.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean;

  if (cv < 0.3) return 'steady';
  if (cv > 0.7) return 'bursty';
  return 'mixed';
}

// ─── Error Map ────────────────────────────────────────────────────────────────

export function buildErrorMap(events: KeystrokeEvent[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const ev of events) {
    if (!ev.correct) {
      const key = ev.expected || ev.char;
      map[key] = (map[key] || 0) + 1;
    }
  }
  return map;
}

// ─── Takeaway Message ─────────────────────────────────────────────────────────

export function generateTakeaway(result: {
  netWpm: number;
  accuracy: number;
  consistencyScore: number;
  rhythmProfile: string;
  errorsByKey: Record<string, number>;
}): string {
  const { netWpm, accuracy, consistencyScore, rhythmProfile, errorsByKey } =
    result;

  const topErrors = Object.entries(errorsByKey)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => (k === ' ' ? 'space' : `"${k}"`));

  const hasPunctuationErrors = Object.keys(errorsByKey).some((k) =>
    '.,;:\'"!?-()[]{}\\/@#$%^&*'.includes(k)
  );

  if (accuracy < 85) {
    return `Focus on accuracy before speed — you're at ${accuracy.toFixed(1)}%. Slow down by 20% and aim for 95%+ accuracy first; speed follows naturally.`;
  }
  if (consistencyScore < 50 && rhythmProfile === 'bursty') {
    return `Your typing comes in bursts — great peak speed, but uneven rhythm. Try to maintain a steady tap-tap-tap instead of sprinting and pausing.`;
  }
  if (hasPunctuationErrors && topErrors.length > 0) {
    return `Your speed is solid, but punctuation slows you down (especially ${topErrors.join(', ')}). A punctuation-focused round could bump your net WPM significantly.`;
  }
  if (netWpm >= 80) {
    return `Impressive — ${netWpm} WPM puts you in the top tier of typists. Work on getting that consistency score above 90 for truly effortless speed.`;
  }
  if (netWpm >= 60) {
    return `You're comfortably above average at ${netWpm} WPM. Your biggest gain will come from reducing the ${topErrors[0] || 'common'} errors — small wins add up fast.`;
  }
  if (netWpm >= 40) {
    return `Solid foundation at ${netWpm} WPM! Daily 5-minute practice sessions will move you to 60+ within weeks. Rhythm and muscle memory build faster than you'd think.`;
  }
  return `Everyone starts somewhere — ${netWpm} WPM is your baseline. Focus on finger placement over the home row, and let the music guide your rhythm.`;
}

// ─── Result Builder ───────────────────────────────────────────────────────────

export function buildTestResult(
  config: DifficultyConfig,
  events: KeystrokeEvent[],
  wpmOverTime: { second: number; wpm: number }[],
  elapsedMs: number
): TestResult {
  const correct = events.filter((e) => e.correct).length;
  const incorrect = events.filter((e) => !e.correct).length;
  const total = events.length;

  const rawWpm = calcRawWpm(correct, elapsedMs);
  const netWpm = calcNetWpm(correct, incorrect, elapsedMs);
  const accuracy = calcAccuracy(correct, total);
  const consistencyScore = calcConsistencyScore(wpmOverTime.map((s) => s.wpm));
  const errorsByKey = buildErrorMap(events);
  const rhythmProfile = classifyRhythm(events);

  const partial = {
    netWpm,
    accuracy,
    consistencyScore,
    rhythmProfile,
    errorsByKey,
  };

  const takeawayMessage = generateTakeaway(partial);

  return {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    config,
    rawWpm,
    netWpm,
    accuracy,
    consistencyScore,
    totalKeystrokes: total,
    correctKeystrokes: correct,
    incorrectKeystrokes: incorrect,
    duration: Math.round(elapsedMs / 1000),
    wpmOverTime,
    keystrokeEvents: events,
    errorsByKey,
    rhythmProfile,
    takeawayMessage,
  };
}
