'use client';

import { useRef, useEffect } from 'react';
import type { CharState } from '@/lib/types';

interface TextDisplayProps {
  charStates: CharState[];
  cursorIndex: number;
}

const LINE_HEIGHT_PX = 52; // generous line height for effortless readability

export default function TextDisplay({ charStates, cursorIndex }: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll: keep the cursor's line near the top of the visible area
  useEffect(() => {
    if (!containerRef.current || !cursorRef.current) return;
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const cursorTop = cursor.offsetTop;

    // Scroll so the cursor's line is visible (show current line + 2 below)
    const targetScroll = Math.max(0, cursorTop - LINE_HEIGHT_PX);
    container.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, [cursorIndex]);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-xl bg-white/40 p-3 sm:p-4 border border-cream-dark/40"
      style={{
        height: `${LINE_HEIGHT_PX * 3 + 16}px`, // 3 visible lines + padding
        maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
      }}
      aria-label="Test text"
      aria-live="off"
    >
      <div
        className="font-mono text-xl sm:text-2xl tracking-wide leading-none flex flex-wrap"
        style={{ lineHeight: `${LINE_HEIGHT_PX}px` }}
      >
        {charStates.map((cs, i) => {
          const isCursor = i === cursorIndex;
          return (
            <span
              key={i}
              ref={isCursor ? cursorRef : undefined}
              className={[
                cs.status === 'pending' && 'char-pending',
                cs.status === 'correct' && 'char-correct',
                cs.status === 'incorrect' && 'char-incorrect',
                isCursor && 'char-cursor',
                'transition-colors duration-75',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden="true"
            >
              {cs.char === ' ' ? '\u00A0' : cs.char}
            </span>
          );
        })}
        {/* End-of-text cursor position */}
        {cursorIndex >= charStates.length && (
          <span className="char-cursor" ref={cursorRef} aria-hidden="true">
            &nbsp;
          </span>
        )}
      </div>
    </div>
  );
}
