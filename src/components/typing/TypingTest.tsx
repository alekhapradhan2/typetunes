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
import { RotateCcw, PlayCircle, Sparkles, Command } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { playKeystroke, settings: audioSettings, updateSettings } = usePiano();

  const {
    phase,
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Allow escape key to quickly reset test
      if (e.key === 'Escape') {
        resetTest();
        return;
      }

      // STRICT CHECK: Never start or process test keystrokes if the event comes from any input/interactive element
      if (
        isFormOrInteractiveElement(e.target) ||
        isFormOrInteractiveElement(document.activeElement)
      ) {
        return;
      }

      // Start on first real key
      if (phase === 'idle' && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        startTest();
      }
      onKeyDown(e);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, onKeyDown, startTest, resetTest]);

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
      className="outline-none w-full select-none"
      onClick={handleContainerClick}
      aria-label="Typing test area"
    >
      {/* Top Configuration & Topic Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Mode / Difficulty Pills */}
        <TestConfig
          config={config}
          disabled={phase === 'active'}
          onConfigChange={(c) => {
            setConfig(c);
            resetTest();
          }}
        />

        {/* Dropdown Topic Selector (aligned right on desktop) */}
        {!hideTopicSelector && !config.useQuotes && (
          <div className="flex items-center gap-2">
            <TopicSelector
              selectedTopic={selectedTopic}
              onTopicSelect={handleTopicSelect}
              disabled={phase === 'active'}
            />
          </div>
        )}
      </div>

      {/* Main interactive typing card */}
      <div
        className={`card p-8 md:p-10 relative transition-all duration-300 ${
          phase === 'active'
            ? 'ring-2 ring-sage-400 shadow-xl'
            : isFocused
            ? 'ring-1 ring-sage-300/60 shadow-md'
            : ''
        }`}
      >
        {/* Subtle decorative gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 10% 0%, rgba(135,186,114,0.15) 0%, transparent 60%)',
          }}
        />

        {/* Top Status Strip */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Active Topic / Passage Badge */}
          <div>
            {selectedTopic ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sage-100/90 text-sage-800 border border-sage-200 animate-fade-in">
                <Sparkles size={12} className="text-sage-600" />
                Topic: {selectedTopic === 'custom' ? customTopicName : selectedTopic}
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-medium">
                {config.useQuotes
                  ? 'Quote Mode'
                  : config.mode === 'zen'
                  ? 'Zen Mode'
                  : 'Random Words'}
              </span>
            )}
          </div>

          {/* Live stats */}
          <LiveStats
            wpm={liveWpm}
            accuracy={liveAccuracy}
            timeLeft={config.mode === 'time' ? timeLeft : undefined}
            wordsTyped={config.mode === 'words' ? wordsTyped : undefined}
            wordGoal={config.mode === 'words' ? config.wordCount : undefined}
            phase={phase}
          />
        </div>

        {/* Idle prompt */}
        {phase === 'idle' && (
          <div className="text-center py-2 text-sm text-slate-400 animate-fade-in">
            <span className="inline-flex items-center gap-1.5 bg-cream/70 px-3 py-1 rounded-full border border-cream-dark/60 text-xs text-slate-500">
              Click here or press any key to start typing
            </span>
          </div>
        )}

        {/* Text display */}
        <div className="my-3">
          <TextDisplay charStates={charStates} cursorIndex={cursorIndex} />
        </div>

        {/* Action bar & Audio controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100/80">
          <div className="flex items-center gap-3">
            {phase === 'idle' && (
              <button
                id="start-test-btn"
                onClick={startTest}
                className="btn-primary"
              >
                <PlayCircle size={16} />
                Start Test
              </button>
            )}
            <button
              id="reset-test-btn"
              onClick={resetTest}
              className="btn-ghost"
              aria-label="Reset test"
              title="Reset test (Esc)"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
              <Command size={11} /> Esc to reset
            </span>
          </div>

          {/* Audio controls */}
          <AudioControls
            settings={audioSettings}
            onUpdate={updateSettings}
          />
        </div>
      </div>
    </section>
  );
}
