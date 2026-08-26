'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { DifficultyConfig } from '@/lib/types';
import { useTypingTest } from '@/hooks/useTypingTest';
import { usePiano } from '@/hooks/usePiano';
import TextDisplay from './TextDisplay';
import LiveStats from './LiveStats';
import TestConfig from './TestConfig';
import TopicSelector from './TopicSelector';
import AudioControls from '@/components/audio/AudioControls';
import { getTopicText } from '@/lib/topics';
import { RotateCcw, Globe, Sparkles, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DEFAULT_CONFIG: DifficultyConfig = {
  mode: 'time',
  timeDuration: 60,
  includePunctuation: false,
  includeNumbers: false,
  useQuotes: false,
};

interface TypingTestProps {
  initialConfig?: Partial<DifficultyConfig>;
  initialText?: string;
  hideTopicSelector?: boolean;
}

function isFormOrInteractiveElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') return true;
  if ((target as HTMLElement).isContentEditable) return true;
  if (target.closest('input, textarea, select, button, [contenteditable="true"], [data-topic-dropdown]')) return true;
  return false;
}

export default function TypingTest({
  initialConfig,
  initialText,
  hideTopicSelector = false,
}: TypingTestProps) {
  const router = useRouter();
  const [config, setConfig] = useState<DifficultyConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [customTopicName, setCustomTopicName] = useState<string>('');
  const [activeText, setActiveText] = useState<string | undefined>(initialText);
  const [isFocused, setIsFocused] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const { playKeystroke, settings: audioSettings, updateSettings } = usePiano();

  const {
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
    wordsTyped,
    startTest,
    resetTest,
    onKeyDown,
    resultId,
  } = useTypingTest(config, playKeystroke, activeText);

  // ── Handle Topic Selection ───────────────────────────────────────────────

  const handleTopicSelect = useCallback(
    (topicId: string, customPrompt?: string) => {
      if (!topicId) {
        setSelectedTopic(null);
        setCustomTopicName('');
        setActiveText(initialText);
        resetTest();
        return;
      }

      setSelectedTopic(topicId);
      if (topicId === 'custom' && customPrompt) {
        setCustomTopicName(customPrompt);
        const generated = getTopicText('custom', customPrompt);
        setActiveText(generated);
      } else {
        const generated = getTopicText(topicId);
        setActiveText(generated);
      }
      resetTest();
    },
    [initialText, resetTest]
  );

  // ── Keyboard listener ─────────────────────────────────────────────────────

  const onKeyDownRef = useRef(onKeyDown);
  onKeyDownRef.current = onKeyDown;

  const resetTestRef = useRef(resetTest);
  resetTestRef.current = resetTest;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Escape to reset
      if (e.key === 'Escape') {
        resetTestRef.current();
        return;
      }

      // Ignore if user is inside an input/dropdown/modal
      if (
        isFormOrInteractiveElement(e.target) ||
        isFormOrInteractiveElement(document.activeElement)
      ) {
        return;
      }

      setIsFocused(true);
      onKeyDownRef.current(e);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── Redirect to results on finish ──────────────────────────────────────────

  useEffect(() => {
    if (phase === 'finished' && resultId) {
      router.push(`/results/${resultId}`);
    }
  }, [phase, resultId, router]);

  // ── Click to focus container ──────────────────────────────────────────────

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (isFormOrInteractiveElement(e.target)) return;
    containerRef.current?.focus();
    setIsFocused(true);
  }, []);

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="outline-none w-full select-none max-w-5xl mx-auto py-4"
      onClick={handleContainerClick}
      aria-label="Typing test arena"
    >
      {/* ── 1. Monkeytype Centered Navigation Toolbar ──────────────────────── */}
      <div className="flex flex-col items-center justify-center gap-3 mb-6 animate-fade-in">
        <TestConfig
          config={config}
          disabled={phase === 'active'}
          onConfigChange={(c) => {
            setConfig(c);
            resetTest();
          }}
        />

        {/* Sub-label / Language or Topic Info */}
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
          {!hideTopicSelector && !config.useQuotes ? (
            <div className="flex items-center gap-1.5">
              <TopicSelector
                selectedTopic={selectedTopic}
                onTopicSelect={handleTopicSelect}
                disabled={phase === 'active'}
              />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Globe size={13} />
              <span>english / literature</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Live Minimalist Stats Strip (During Active Run) ──────────────── */}
      <div className="min-h-[32px] flex items-center justify-between px-6 mb-2">
        {phase === 'active' ? (
          <div className="text-xl sm:text-2xl font-mono font-bold text-amber-500 dark:text-amber-400 animate-fade-in flex items-center gap-4">
            {config.mode === 'time' && <span>{timeLeft}</span>}
            {config.mode === 'words' && <span>{wordsTyped}/{config.wordCount}</span>}
            <span className="text-sm font-normal text-slate-400">
              {liveWpm} wpm &bull; {liveAccuracy}%
            </span>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* ── 3. Main Text Typing Area with Smooth Gliding Caret ──────────────── */}
      <div className="relative my-2 cursor-text" onClick={handleContainerClick}>
        <TextDisplay
          words={words}
          currentWordIndex={currentWordIndex}
          currentInput={currentInput}
          wordHistory={wordHistory}
          isFocused={isFocused}
        />
      </div>

      {/* ── 4. Bottom Controls: Minimal Restart Button & Sound Preset ───────── */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 text-xs text-slate-400 dark:text-slate-500">
        <div className="hidden sm:block text-[11px]">
          <span className="bg-stone-200/60 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 font-mono">
            esc
          </span>
          <span className="ml-1.5">to restart test</span>
        </div>

        {/* Center Restart Button (Monkeytype style) */}
        <div className="flex items-center justify-center">
          <button
            id="reset-test-btn"
            onClick={resetTest}
            type="button"
            className="p-3 rounded-full hover:bg-stone-200/70 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all duration-200 cursor-pointer group"
            title="Restart test (Esc)"
            aria-label="Restart test"
          >
            <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center">
          <AudioControls
            settings={audioSettings}
            onUpdate={updateSettings}
          />
        </div>
      </div>
    </section>
  );
}
