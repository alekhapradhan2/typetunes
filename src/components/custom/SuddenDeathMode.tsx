'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { Flame, ShieldAlert, Heart, RotateCcw, Trophy, Sparkles, Zap, AlertTriangle } from 'lucide-react';
import { generateTestText } from '@/lib/words';

interface SuddenDeathModeProps {
  onFinishStats?: (stats: { score: number; maxStreak: number; wpm: number }) => void;
}

export default function SuddenDeathMode({ onFinishStats }: SuddenDeathModeProps) {
  const [maxLives, setMaxLives] = useState<1 | 3 | 5>(1);
  const [lockBackspace, setLockBackspace] = useState<boolean>(true);
  const [wordTarget, setWordTarget] = useState<number>(30);

  const [text, setText] = useState<string>('');
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [livesRemaining, setLivesRemaining] = useState<number>(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'failed' | 'victory'>('idle');
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [errorsMade, setErrorsMade] = useState<number>(0);
  const [shake, setShake] = useState(false);

  const startTimeRef = useRef<number>(0);
  const totalCorrectRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playKeystroke } = usePiano();

  // Reset/Generate Game Text
  const initGame = useCallback(() => {
    const generated = generateTestText({
      count: wordTarget,
      includePunctuation: false,
      includeNumbers: false,
    });
    setText(generated);
    setCursorIndex(0);
    setLivesRemaining(maxLives);
    setGameState('idle');
    setCurrentStreak(0);
    setMaxStreak(0);
    setScore(0);
    setErrorsMade(0);
    totalCorrectRef.current = 0;
  }, [maxLives, wordTarget]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Key Listener for Sudden Death
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'failed' || gameState === 'victory') {
        if (e.key === 'Enter' || e.key === 'Escape') {
          initGame();
        }
        return;
      }

      if (e.key === 'Escape') {
        initGame();
        return;
      }

      // Ignore modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

      // Prevent backspace if lock is on
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (lockBackspace) {
          // Locked backspace feedback
          setShake(true);
          setTimeout(() => setShake(false), 200);
          return;
        }
        if (cursorIndex > 0) {
          setCursorIndex((i) => i - 1);
        }
        return;
      }

      if (e.key.length !== 1 || e.ctrlKey || e.metaKey) return;
      e.preventDefault();

      // Start game on first keystroke
      if (gameState === 'idle') {
        setGameState('playing');
        startTimeRef.current = performance.now();
      }

      const expectedChar = text[cursorIndex];
      const isCorrect = e.key === expectedChar;

      playKeystroke(isCorrect);

      if (isCorrect) {
        totalCorrectRef.current += 1;
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        setMaxStreak((m) => Math.max(m, newStreak));

        // Combo multiplier
        const multiplier = Math.min(5, Math.floor(newStreak / 10) + 1);
        setScore((s) => s + 10 * multiplier);

        const nextIndex = cursorIndex + 1;
        setCursorIndex(nextIndex);

        // Check Victory
        if (nextIndex >= text.length) {
          setGameState('victory');
        }
      } else {
        // Mistake made!
        setErrorsMade((e) => e + 1);
        setCurrentStreak(0);
        setShake(true);
        setTimeout(() => setShake(false), 300);

        const newLives = livesRemaining - 1;
        setLivesRemaining(newLives);

        if (newLives <= 0) {
          setGameState('failed');
        } else {
          // Move cursor forward even on mistake in arcade mode
          const nextIndex = cursorIndex + 1;
          setCursorIndex(nextIndex);
          if (nextIndex >= text.length) {
            setGameState('victory');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, cursorIndex, text, livesRemaining, currentStreak, lockBackspace, initGame, playKeystroke]);

  // Calculate live WPM
  const timeElapsedSec = startTimeRef.current ? Math.max(1, (performance.now() - startTimeRef.current) / 1000) : 1;
  const liveWpm = Math.round((totalCorrectRef.current / 5) / (timeElapsedSec / 60));

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`space-y-6 outline-none select-none transition-transform ${
        shake ? 'animate-shake' : ''
      }`}
    >
      {/* Header & Modes */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Flame className="text-rose-500" size={24} />
            Sudden Death & Precision Gauntlet
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Zero-room for error. Keep your streak alive, protect your lives, and rack up combo multipliers!
          </p>
        </div>

        {/* Lives Selector & Controls (Only when idle) */}
        {gameState === 'idle' && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {([1, 3, 5] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setMaxLives(l)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                    maxLives === l
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Heart size={12} fill={maxLives === l ? 'currentColor' : 'none'} />
                  {l === 1 ? '1 Life (Zero Error)' : `${l} Lives`}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLockBackspace(!lockBackspace)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
                lockBackspace
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
              title="Lock Backspace key so every typo immediately docks a life"
            >
              <ShieldAlert size={14} />
              {lockBackspace ? 'Backspace: LOCKED' : 'Backspace: Allowed'}
            </button>
          </div>
        )}
      </div>

      {/* Live Status HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Lives Counter */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Lives Remaining</span>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  size={20}
                  className={`transition-all duration-300 ${
                    i < livesRemaining
                      ? 'text-rose-500 fill-rose-500 scale-100'
                      : 'text-slate-200 fill-slate-100 scale-90'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-2xl font-bold font-mono text-rose-600">{livesRemaining}</span>
        </div>

        {/* Combo Streak */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Current Streak</span>
            <span className="text-xs font-semibold text-amber-600">
              {currentStreak >= 20 ? '🔥 ON FIRE!' : currentStreak >= 10 ? '⚡ Heating Up' : 'Active'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-amber-500">{currentStreak}</span>
            <span className="text-[10px] text-slate-400 block">Max: {maxStreak}</span>
          </div>
        </div>

        {/* Multiplier & Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Arcade Score</span>
            <span className="text-xs font-bold text-emerald-600">
              {Math.min(5, Math.floor(currentStreak / 10) + 1)}x Multiplier
            </span>
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-600">{score}</span>
        </div>

        {/* Speed / WPM */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Velocity</span>
            <span className="text-xs text-slate-500">
              {gameState === 'playing' ? 'Live test' : 'Ready'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-slate-800">
              {gameState === 'playing' ? liveWpm : 0}
            </span>
            <span className="text-[10px] text-slate-400 block">WPM</span>
          </div>
        </div>
      </div>

      {/* Main Gauntlet Text Area */}
      <div className={`relative bg-white rounded-2xl border p-8 shadow-sm transition-all overflow-hidden ${
        gameState === 'failed'
          ? 'border-rose-300 bg-rose-50/20'
          : gameState === 'victory'
          ? 'border-emerald-300 bg-emerald-50/20'
          : 'border-slate-200'
      }`}>
        {/* Game State Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3 animate-pulse">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Ready for Sudden Death?</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Press any key to begin typing. {maxLives === 1 ? 'A single mistake will end your run!' : `You have ${maxLives} lives.`}
            </p>
          </div>
        )}

        {gameState === 'failed' && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center text-white animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 mb-3">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">GAME OVER</h3>
            <p className="text-sm text-rose-200 mt-1">
              You ran out of lives! Final Score: <strong className="text-white">{score}</strong> pts
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs font-mono text-rose-300">
              <span>Max Streak: {maxStreak}</span>
              <span>•</span>
              <span>Speed: {liveWpm} WPM</span>
            </div>
            <button
              onClick={initGame}
              className="mt-6 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              Try Again (Enter)
            </button>
          </div>
        )}

        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center text-white animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-3">
              <Trophy size={28} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">GAUNTLET CLEARED!</h3>
            <p className="text-sm text-emerald-200 mt-1">
              Flawless victory! Total Score: <strong className="text-white">{score}</strong>
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs font-mono text-emerald-300">
              <span>Max Streak: {maxStreak}</span>
              <span>•</span>
              <span>Avg Speed: {liveWpm} WPM</span>
            </div>
            <button
              onClick={initGame}
              className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              Play Next Level (Enter)
            </button>
          </div>
        )}

        {/* Text Stream Display */}
        <div className="font-mono text-lg sm:text-xl leading-relaxed tracking-wide min-h-[120px]">
          {text.split('').map((char, index) => {
            let colorClass = 'text-slate-300';
            if (index < cursorIndex) {
              colorClass = 'text-sage-600 font-semibold';
            } else if (index === cursorIndex) {
              colorClass = 'text-slate-900 bg-amber-200/80 rounded-xs border-b-2 border-amber-500 animate-pulse';
            }

            return (
              <span key={index} className={colorClass}>
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
