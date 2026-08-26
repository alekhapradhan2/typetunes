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
import { saveLocalResult } from '@/lib/storage';

export interface UseTypingTestReturn {
  phase: TestPhase;
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  wordHistory: string[];
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

export function useTypingTest(
  config: DifficultyConfig,
  onKeystroke?: (correct: boolean) => void,
  overrideText?: string
): UseTypingTestReturn {
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [wordHistory, setWordHistory] = useState<string[]>([]);

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

  // Keep references to avoid re-render race conditions
  const phaseRef = useRef<TestPhase>(phase);
  phaseRef.current = phase;

  const wordsRef = useRef<string[]>(words);
  wordsRef.current = words;

  const currentWordIndexRef = useRef<number>(currentWordIndex);
  currentWordIndexRef.current = currentWordIndex;

  const currentInputRef = useRef<string>(currentInput);
  currentInputRef.current = currentInput;

  const wordHistoryRef = useRef<string[]>(wordHistory);
  wordHistoryRef.current = wordHistory;

  // ── Build test words ───────────────────────────────────────────────────────

  const buildWords = useCallback(() => {
    if (overrideText && overrideText.trim()) {
      return overrideText.trim().split(/\s+/).filter(Boolean);
    }
    let raw = '';
    if (config.useQuotes) {
      raw = getRandomQuote();
    } else {
      const count =
        config.mode === 'words'
          ? (config.wordCount ?? 50)
          : config.mode === 'time'
          ? Math.ceil((config.timeDuration ?? 60) * 3) // safe word buffer
          : 250; // zen: endless words
      raw = generateTestText({
        count,
        includePunctuation: config.includePunctuation,
        includeNumbers: config.includeNumbers,
      });
    }
    return raw.split(/\s+/).filter(Boolean);
  }, [
    config.mode,
    config.wordCount,
    config.timeDuration,
    config.includePunctuation,
    config.includeNumbers,
    config.useQuotes,
    overrideText,
  ]);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    keystrokeEvents.current = [];
    wpmHistory.current = [];
    startTimestamp.current = 0;

    setPhase('idle');
    setCurrentWordIndex(0);
    setCurrentInput('');
    setWordHistory([]);
    setLiveWpm(0);
    setLiveAccuracy(100);
    setTimeLeft(config.timeDuration ?? 60);
    setTimeElapsed(0);
    setWordsTyped(0);
    setResultId(null);

    const initialWords = buildWords();
    setWords(initialWords);
  }, [config.timeDuration, buildWords]);

  // ── Finish ────────────────────────────────────────────────────────────────

  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    setPhase('finished');

    const elapsed = Math.max(500, performance.now() - startTimestamp.current);
    const result = buildTestResult(
      config,
      keystrokeEvents.current,
      wpmHistory.current,
      elapsed
    );

    saveLocalResult(result);
    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    }).catch(() => {});

    setResultId(result.id);
  }, [config]);

  // ── Start ─────────────────────────────────────────────────────────────────

  const startTest = useCallback(() => {
    if (phaseRef.current === 'active') return;

    let targetWords = wordsRef.current;
    if (!targetWords || targetWords.length === 0) {
      targetWords = buildWords();
      setWords(targetWords);
    }

    setPhase('active');
    startTimestamp.current = performance.now();

    if (config.mode === 'time') {
      const duration = config.timeDuration ?? 60;
      setTimeLeft(duration);
      let remaining = duration;

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        remaining -= 1;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishTest();
        }
      }, 1000);
    }

    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
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
    }, 400);
  }, [config.mode, config.timeDuration, buildWords, finishTest]);

  // ── Keyboard handler (Monkeytype exact behavior) ──────────────────────────

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phaseRef.current === 'finished') return;

      // Ignore modifier keys
      if (
        e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'Alt' ||
        e.key === 'Meta' ||
        e.key === 'CapsLock' ||
        e.key === 'Tab' ||
        e.key === 'Escape'
      ) {
        return;
      }

      // First keystroke starts test immediately
      if (phaseRef.current === 'idle') {
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
        startTest();
      }

      e.preventDefault();

      const activeWords = wordsRef.current;
      const activeWordIdx = currentWordIndexRef.current;
      const activeInput = currentInputRef.current;
      const activeHistory = wordHistoryRef.current;
      const currentWord = activeWords[activeWordIdx] || '';

      // ── Handle Backspace
      if (e.key === 'Backspace') {
        if (activeInput.length > 0) {
          const next = activeInput.slice(0, -1);
          currentInputRef.current = next;
          setCurrentInput(next);
        } else if (activeWordIdx > 0) {
          const prevIndex = activeWordIdx - 1;
          const prevTyped = activeHistory[prevIndex] || '';
          const prevTarget = activeWords[prevIndex] || '';
          if (prevTyped !== prevTarget) {
            const nextHistory = activeHistory.slice(0, -1);
            wordHistoryRef.current = nextHistory;
            currentWordIndexRef.current = prevIndex;
            currentInputRef.current = prevTyped;
            setCurrentWordIndex(prevIndex);
            setCurrentInput(prevTyped);
            setWordHistory(nextHistory);
          }
        }
        return;
      }

      // ── Handle Space (Submit current word & move to next)
      if (e.key === ' ') {
        if (activeInput.length === 0) return; // ignore empty spaces

        const isWordFullyCorrect = activeInput === currentWord;
        onKeystroke?.(isWordFullyCorrect);

        const newHistory = [...activeHistory, activeInput];
        const nextWordIndex = activeWordIdx + 1;
        wordHistoryRef.current = newHistory;
        currentWordIndexRef.current = nextWordIndex;
        currentInputRef.current = '';

        setWordHistory(newHistory);
        setCurrentWordIndex(nextWordIndex);
        setCurrentInput('');
        setWordsTyped(nextWordIndex);

        // Check completion conditions
        if (config.mode === 'words' && nextWordIndex >= (config.wordCount ?? 50)) {
          finishTest();
          return;
        }

        if (nextWordIndex >= activeWords.length) {
          if (config.mode === 'zen' || config.mode === 'time') {
            const extra = generateTestText({
              count: 30,
              includePunctuation: config.includePunctuation,
              includeNumbers: config.includeNumbers,
            }).split(/\s+/).filter(Boolean);
            const combined = [...activeWords, ...extra];
            wordsRef.current = combined;
            setWords(combined);
          } else {
            finishTest();
            return;
          }
        }
        return;
      }

      // ── Handle Regular Character
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const expectedChar = currentWord[activeInput.length];
        const isCorrect = e.key === expectedChar;

        const timestamp = performance.now() - (startTimestamp.current || performance.now());
        keystrokeEvents.current.push({
          char: e.key,
          expected: expectedChar || '',
          correct: isCorrect,
          timestamp,
          wpmAtMoment: liveWpm,
        });

        // Update live accuracy
        const total = keystrokeEvents.current.length;
        const correctCount = keystrokeEvents.current.filter((k) => k.correct).length;
        setLiveAccuracy(Math.round((correctCount / total) * 100));

        onKeystroke?.(isCorrect);
        const nextInput = activeInput + e.key;
        currentInputRef.current = nextInput;
        setCurrentInput(nextInput);

        // Word mode early finish check on last character
        if (
          config.mode === 'words' &&
          activeWordIdx === (config.wordCount ?? 50) - 1 &&
          nextInput === currentWord
        ) {
          finishTest();
        }
      }
    },
    [
      config.mode,
      config.wordCount,
      config.includePunctuation,
      config.includeNumbers,
      liveWpm,
      onKeystroke,
      startTest,
      finishTest,
    ]
  );

  const charStates: CharState[] = [];
  const cursorIndex = 0;

  // ── Init on mount or when mode/config changes ────────────────────────────

  useEffect(() => {
    if (phaseRef.current === 'idle') {
      const initialWords = buildWords();
      setWords(initialWords);
      setTimeLeft(config.timeDuration ?? 60);
    }
  }, [buildWords, config.timeDuration]);

  // ── Cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    };
  }, []);

  return {
    phase,
    words,
    currentWordIndex,
    currentInput,
    wordHistory,
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
