'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  DifficultyConfig,
  KeystrokeEvent,
  TestPhase,
  CharState,
} from '@/lib/types';
import { generateTestText, getRandomQuote } from '@/lib/words';
import { calcRawWpm, buildTestResult } from '@/lib/analytics';
import { saveLocalResult, pushLocalHistoryId } from '@/lib/storage';


// ─── Types ───────────────────────────────────────────────────────────────────

interface UseTypingTestReturn {
  phase: TestPhase;
  charStates: CharState[];
  cursorIndex: number;
  liveWpm: number;
  liveAccuracy: number;
  timeLeft: number;
  timeElapsed: number;
  wordsTyped: number;
  startTest: () => void;
  resetTest: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
  resultId: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTypingTest(
  config: DifficultyConfig,
  onKeystroke?: (correct: boolean) => void,
  overrideText?: string
): UseTypingTestReturn {
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [text, setText] = useState('');
  const [charStates, setCharStates] = useState<CharState[]>([]);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState<number>(config.timeDuration ?? 60);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [resultId, setResultId] = useState<string | null>(null);

  const keystrokeEvents = useRef<KeystrokeEvent[]>([]);
  const wpmHistory = useRef<{ second: number; wpm: number }[]>([]);
  const startTimestamp = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Build test text ───────────────────────────────────────────────────────

  const buildText = useCallback(() => {
    if (overrideText && overrideText.trim()) {
      return overrideText.trim();
    }
    let t = '';
    if (config.useQuotes) {
      t = getRandomQuote();
    } else {
      const count =
        config.mode === 'words'
          ? (config.wordCount ?? 50)
          : config.mode === 'time'
          ? Math.ceil((config.timeDuration ?? 60) * 2.5) // ~2.5 words/sec buffer
          : 200; // zen: lots of words
      t = generateTestText({
        count,
        includePunctuation: config.includePunctuation,
        includeNumbers: config.includeNumbers,
      });
    }
    return t;
  }, [config, overrideText]);

  // ── Initialize chars ──────────────────────────────────────────────────────

  const initChars = useCallback(
    (rawText: string) => {
      setCharStates(
        rawText.split('').map((ch) => ({ char: ch, status: 'pending' }))
      );
    },
    []
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetTest = useCallback(() => {
    clearInterval(timerRef.current!);
    clearInterval(wpmIntervalRef.current!);
    keystrokeEvents.current = [];
    wpmHistory.current = [];
    startTimestamp.current = 0;
    setPhase('idle');
    setCursorIndex(0);
    setLiveWpm(0);
    setLiveAccuracy(100);
    setTimeLeft(config.timeDuration ?? 60);
    setTimeElapsed(0);
    setWordsTyped(0);
    setResultId(null);

    const t = buildText();
    setText(t);
    initChars(t);
  }, [config, buildText, initChars]);

  // ── Start ─────────────────────────────────────────────────────────────────

  const startTest = useCallback(() => {
    const t = buildText();
    setText(t);
    initChars(t);
    setCursorIndex(0);
    setPhase('active');
    startTimestamp.current = performance.now();

    if (config.mode === 'time') {
      const duration = config.timeDuration ?? 60;
      setTimeLeft(duration);
      let remaining = duration;

      timerRef.current = setInterval(() => {
        remaining -= 1;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current!);
          finishTest();
        }
      }, 1000);
    }

    // WPM sampling every 500ms
    wpmIntervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTimestamp.current;
      const sec = Math.floor(elapsed / 1000);
      const correct = keystrokeEvents.current.filter((e) => e.correct).length;
      const wpm = calcRawWpm(correct, elapsed);
      if (sec > 0) {
        wpmHistory.current.push({ second: sec, wpm });
        setLiveWpm(wpm);
        setTimeElapsed(sec);
      }
    }, 500);
  }, [config, buildText, initChars]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Finish ────────────────────────────────────────────────────────────────

  const finishTest = useCallback(() => {
    clearInterval(timerRef.current!);
    clearInterval(wpmIntervalRef.current!);
    setPhase('finished');

    const elapsed = performance.now() - startTimestamp.current;
    const result = buildTestResult(
      config,
      keystrokeEvents.current,
      wpmHistory.current,
      elapsed
    );

    // Persist locally immediately and to MongoDB
    saveLocalResult(result);
    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    }).catch(() => {}); // non-blocking

    setResultId(result.id);
  }, [config]);

  // ── Keyboard handler ──────────────────────────────────────────────────────

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase === 'idle') return;
      if (phase === 'finished') return;

      // Ignore modifier-only keys
      if (
        e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'Alt' ||
        e.key === 'Meta' ||
        e.key === 'CapsLock' ||
        e.key === 'Tab' ||
        e.key === 'Escape'
      )
        return;

      e.preventDefault();

      // Backspace
      if (e.key === 'Backspace') {
        if (cursorIndex > 0) {
          setCursorIndex((i) => i - 1);
          setCharStates((prev) => {
            const next = [...prev];
            next[cursorIndex - 1] = { ...next[cursorIndex - 1], status: 'pending' };
            return next;
          });
        }
        return;
      }

      if (cursorIndex >= text.length) return;

      const expected = text[cursorIndex];
      const correct = e.key === expected;
      const timestamp = performance.now() - startTimestamp.current;
      const wpmAtMoment = liveWpm;

      const event: KeystrokeEvent = {
        char: e.key,
        expected,
        correct,
        timestamp,
        wpmAtMoment,
      };
      keystrokeEvents.current.push(event);

      // Update accuracy live
      const totalKeys = keystrokeEvents.current.length;
      const correctKeys = keystrokeEvents.current.filter((k) => k.correct).length;
      setLiveAccuracy(Math.round((correctKeys / totalKeys) * 100));

      // Update char state
      setCharStates((prev) => {
        const next = [...prev];
        next[cursorIndex] = {
          ...next[cursorIndex],
          status: correct ? 'correct' : 'incorrect',
        };
        return next;
      });

      const nextIndex = cursorIndex + 1;
      setCursorIndex(nextIndex);

      // Count completed words
      if (e.key === ' ' || nextIndex === text.length) {
        setWordsTyped((w) => w + 1);
      }

      // Trigger audio callback
      onKeystroke?.(correct);

      // Finish conditions
      if (config.mode === 'words' && nextIndex === text.length) {
        finishTest();
      }
      if (config.mode === 'zen' && nextIndex === text.length) {
        // Zen: generate more text seamlessly
        const extra = generateTestText({
          count: 50,
          includePunctuation: config.includePunctuation,
          includeNumbers: config.includeNumbers,
        });
        setText((t) => t + ' ' + extra);
        setCharStates((prev) => [
          ...prev,
          { char: ' ', status: 'pending' },
          ...extra.split('').map((ch) => ({ char: ch, status: 'pending' as const })),
        ]);
      }
    },
    [phase, cursorIndex, text, liveWpm, config, onKeystroke, finishTest]
  );

  // ── Init on mount ─────────────────────────────────────────────────────────

  useEffect(() => {
    const t = buildText();
    setText(t);
    initChars(t);
    setTimeLeft(config.timeDuration ?? 60);
  }, [buildText, initChars, config.timeDuration]);

  // ── Cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current!);
      clearInterval(wpmIntervalRef.current!);
    };
  }, []);

  return {
    phase,
    charStates,
    cursorIndex,
    liveWpm,
    liveAccuracy,
    timeLeft,
    timeElapsed,
    wordsTyped,
    startTest,
    resetTest,
    onKeyDown,
    resultId,
  };
}
