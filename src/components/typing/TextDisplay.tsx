'use client';

import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { MousePointerClick } from 'lucide-react';

interface WordItemProps {
  wIdx: number;
  targetWord: string;
  isPastWord: boolean;
  isCurrentWord: boolean;
  typed: string;
}

const WordItem = memo(function WordItem({
  wIdx,
  targetWord,
  isPastWord,
  isCurrentWord,
  typed,
}: WordItemProps) {
  const hasError = isPastWord && typed !== targetWord;
  const maxLen = Math.max(targetWord.length, typed.length);
  const letterElements = [];

  for (let i = 0; i < maxLen; i++) {
    const origChar = targetWord[i];
    const typedChar = typed[i];
    let status: 'correct' | 'incorrect' | 'extra' | 'pending' = 'pending';
    let displayChar = origChar;

    if (isPastWord) {
      if (i < typed.length && i < targetWord.length) {
        status = typedChar === origChar ? 'correct' : 'incorrect';
      } else if (i < typed.length) {
        status = 'extra';
        displayChar = typedChar;
      } else {
        status = 'incorrect';
      }
    } else if (isCurrentWord) {
      if (i < typed.length && i < targetWord.length) {
        status = typedChar === origChar ? 'correct' : 'incorrect';
      } else if (i < typed.length) {
        status = 'extra';
        displayChar = typedChar;
      } else {
        status = 'pending';
      }
    }

    letterElements.push(
      <span
        key={i}
        data-letter-idx={i}
        className={`letter transition-colors duration-75 ${
          status === 'correct'
            ? 'char-correct'
            : status === 'incorrect'
            ? 'char-incorrect'
            : status === 'extra'
            ? 'char-extra'
            : 'char-pending'
        }`}
      >
        {displayChar}
      </span>
    );
  }

  return (
    <div
      data-word-idx={wIdx}
      className={`word relative inline-flex flex-nowrap mr-3.5 my-1.5 transition-colors ${
        hasError ? 'border-b-2 border-red-500/70' : ''
      }`}
    >
      {letterElements}
    </div>
  );
});

interface TextDisplayProps {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  wordHistory: string[];
  isFocused?: boolean;
}

export default function TextDisplay({
  words,
  currentWordIndex,
  currentInput,
  wordHistory,
  isFocused = true,
}: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);
  const [caretStyle, setCaretStyle] = useState<{
    x: number;
    y: number;
    height: number;
    opacity: number;
  }>({
    x: 0,
    y: 0,
    height: 32,
    opacity: 0,
  });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef<number>(-1);

  // Position the smooth yellow caret instantaneously without layout reflows
  const updateCaretPosition = useCallback(() => {
    if (!wordsWrapperRef.current || !containerRef.current) return;

    const wrapper = wordsWrapperRef.current;
    const currentWordEl = wrapper.querySelector(
      `[data-word-idx="${currentWordIndex}"]`
    ) as HTMLElement | null;

    if (!currentWordEl) return;

    const targetWord = words[currentWordIndex] || '';
    const inputLen = currentInput.length;

    let x = currentWordEl.offsetLeft;
    const y = currentWordEl.offsetTop;
    const height = currentWordEl.offsetHeight || 32;

    if (inputLen < targetWord.length) {
      const letterEl = currentWordEl.querySelector(
        `[data-letter-idx="${inputLen}"]`
      ) as HTMLElement | null;

      if (letterEl) {
        x = currentWordEl.offsetLeft + letterEl.offsetLeft;
      }
    } else {
      const letters = currentWordEl.querySelectorAll('.letter');
      const lastLetter = letters[letters.length - 1] as HTMLElement | undefined;
      if (lastLetter) {
        x = currentWordEl.offsetLeft + lastLetter.offsetLeft + lastLetter.offsetWidth;
      } else {
        x = currentWordEl.offsetLeft + currentWordEl.offsetWidth;
      }
    }

    setCaretStyle({
      x,
      y: y + 2,
      height: Math.max(26, height - 4),
      opacity: 1,
    });

    // Auto-scroll ONLY when changing lines
    const targetScroll = Math.max(0, currentWordEl.offsetTop - 48);
    if (Math.abs(targetScroll - lastScrollTopRef.current) > 20) {
      lastScrollTopRef.current = targetScroll;
      containerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [currentWordIndex, currentInput, words]);

  // Update immediately upon typing
  useEffect(() => {
    updateCaretPosition();
    setIsTyping(true);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 450);

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [currentWordIndex, currentInput, updateCaretPosition]);

  // Handle window resize & initial mount
  useEffect(() => {
    const handleResize = () => updateCaretPosition();
    window.addEventListener('resize', handleResize);
    const timeout = setTimeout(updateCaretPosition, 20);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [updateCaretPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
        isFocused ? 'opacity-100' : 'opacity-50 blur-[0.3px]'
      }`}
      style={{
        height: '184px',
        maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
      }}
      aria-label="Typing text area"
    >
      {/* Monkeytype focus overlay when unfocused */}
      {!isFocused && currentWordIndex === 0 && currentInput.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-mono font-medium animate-fade-in bg-white/90 dark:bg-slate-900/90 px-5 py-2.5 rounded-2xl shadow-lg border border-stone-300/80 dark:border-slate-800 backdrop-blur-md">
            <MousePointerClick size={16} className="text-amber-500 animate-pulse" />
            <span>Click here or press any key to focus</span>
          </div>
        </div>
      )}

      {/* Words Container */}
      <div
        ref={wordsWrapperRef}
        className="relative font-mono text-xl sm:text-2xl md:text-3xl tracking-wide flex flex-wrap leading-relaxed select-none"
      >
        {/* Monkeytype Smooth Gliding Golden Yellow Caret */}
        <div
          className={`smooth-caret ${!isTyping ? 'smooth-caret-blinking' : ''}`}
          style={{
            transform: `translate3d(${caretStyle.x}px, ${caretStyle.y}px, 0)`,
            height: `${caretStyle.height}px`,
            opacity: isFocused ? caretStyle.opacity : 0,
          }}
          aria-hidden="true"
        />

        {words.map((targetWord, wIdx) => {
          const isPastWord = wIdx < currentWordIndex;
          const isCurrentWord = wIdx === currentWordIndex;
          const typed = isPastWord
            ? wordHistory[wIdx] || ''
            : isCurrentWord
            ? currentInput
            : '';

          return (
            <WordItem
              key={wIdx}
              wIdx={wIdx}
              targetWord={targetWord}
              isPastWord={isPastWord}
              isCurrentWord={isCurrentWord}
              typed={typed}
            />
          );
        })}
      </div>
    </div>
  );
}
