'use client';

import { useState, useEffect, useRef } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { getRandomPassage } from '@/lib/words';
import { Trophy, RotateCcw, Play, Zap, Flame, Timer } from 'lucide-react';

interface SprintRelayProps {
  onSyncProgress?: (progress: number, wpm: number, accuracy: number, isFinished: boolean) => void;
  externalText?: string;
  opponentName?: string;
  opponentAvatar?: string;
  opponentProgress?: number;
  opponentWpm?: number;
  autoStart?: boolean;
}

export default function SprintRelayGame({
  onSyncProgress,
  externalText,
  opponentName = 'Bolt AI Runner',
  opponentAvatar = '🏃‍♂️',
  opponentProgress = 0,
  opponentWpm = 65,
  autoStart = false,
}: SprintRelayProps) {
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');

  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [aiProgress, setAiProgress] = useState<number>(0);
  const [playerWpm, setPlayerWpm] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const correctCharsRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const { playKeystroke } = usePiano();

  const initSprint = () => {
    const raw = externalText || getRandomPassage('short');
    const split = raw.split(/\s+/).filter(Boolean);
    setWords(split);
    setCurrentWordIdx(0);
    setTypedInput('');
    setPlayerProgress(0);
    setAiProgress(0);
    setElapsedTime(0);
    correctCharsRef.current = 0;
  };

  const startSprint = () => {
    initSprint();
    setGameState('running');
    startTimeRef.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  // Keyboard shortcut listener (Enter to start/restart)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((gameState === 'idle' || gameState === 'finished') && e.key === 'Enter') {
        startSprint();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Auto-start on multiplayer start
  useEffect(() => {
    if (autoStart && gameState === 'idle') {
      startSprint();
    }
  }, [autoStart, gameState]);

  // AI Opponent Runner Loop
  useEffect(() => {
    if (gameState !== 'running') return;

    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const elapsed = (time - startTimeRef.current) / 1000;
      setElapsedTime(Math.round(elapsed * 10) / 10);

      // AI Progress
      const wordsPerSec = opponentWpm / 60;
      const inc = ((wordsPerSec * delta) / Math.max(1, words.length)) * 100;
      setAiProgress((prev) => Math.min(100, prev + inc));

      if (elapsed > 1) {
        const wpm = Math.round((correctCharsRef.current / 5) / (elapsed / 60));
        setPlayerWpm(wpm);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState, words.length, opponentWpm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'running') return;
    const val = e.target.value;
    const currentTarget = words[currentWordIdx] || '';

    setTypedInput(val);
    playKeystroke(true);

    if (val.trim() === currentTarget) {
      correctCharsRef.current += currentTarget.length + 1;
      const nextIdx = currentWordIdx + 1;
      setCurrentWordIdx(nextIdx);
      setTypedInput('');

      const prog = Math.min(100, (nextIdx / Math.max(1, words.length)) * 100);
      setPlayerProgress(prog);

      if (nextIdx >= words.length) {
        setGameState('finished');
        if (onSyncProgress) {
          onSyncProgress(100, playerWpm, 98, true);
        }
      } else if (onSyncProgress) {
        onSyncProgress(prog, playerWpm, 98, false);
      }
    }
  };

  const currentTargetWord = words[currentWordIdx] || '';
  const displayAiProg = opponentProgress > 0 ? opponentProgress : aiProgress;
  const isWinner = playerProgress >= 100 && playerProgress >= displayAiProg;

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            Sprint Relay 1v1 Track & Field Race
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            100% burst speed! Sprint against rival runners across the Olympic 100m track!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
            <Timer size={14} /> {elapsedTime.toFixed(1)}s
          </span>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400">
            {playerWpm} WPM
          </span>
        </div>
      </div>

      {/* Stadium Sprint Track Arena */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border-2 border-slate-800 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Idle Splash */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-3">🏃💨</span>
            <h3 className="text-2xl font-bold">On Your Mark... Get Set...</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              Type the sprint passage at maximum burst velocity to outrun your opponent to the finish tape!
            </p>
            <button
              onClick={startSprint}
              className="mt-6 px-8 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              Sprint! (Enter)
            </button>
          </div>
        )}

        {/* Finished Modal */}
        {gameState === 'finished' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg ${
                isWinner ? 'bg-amber-500/20 border border-amber-400 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Trophy size={36} />
            </div>
            <h3 className="text-3xl font-bold text-white">
              {isWinner ? 'GOLD MEDAL FINISH! 🥇' : 'RACE COMPLETE!'}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Time: <strong className="text-orange-400 font-mono">{elapsedTime.toFixed(1)}s</strong> • Speed:{' '}
              <strong className="text-emerald-400 font-mono">{playerWpm} WPM</strong>
            </p>
            <button
              onClick={startSprint}
              className="mt-6 px-8 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Sprint Again (Enter)
            </button>
          </div>
        )}

        {/* Sprint Lanes */}
        <div className="space-y-4 pb-6 border-b border-slate-800">
          {/* Lane 1: Player */}
          <div className="relative bg-slate-900/90 rounded-2xl h-12 border border-slate-800 flex items-center px-4 overflow-hidden">
            <div className="absolute left-2 text-[10px] font-mono text-emerald-400 font-bold z-10">YOU (Lane 1)</div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-amber-400/40 z-10 border-l border-amber-300" />
            <div
              className="absolute flex items-center gap-1"
              style={{ left: `calc(${Math.min(90, Math.max(5, playerProgress))}% - 20px)`, willChange: 'left' }}
            >
              <span className="text-2xl">🏃💨</span>
            </div>
          </div>

          {/* Lane 2: Opponent */}
          <div className="relative bg-slate-900/60 rounded-2xl h-12 border border-slate-800 flex items-center px-4 overflow-hidden">
            <div className="absolute left-2 text-[10px] font-mono text-slate-400 z-10">
              {opponentName} ({opponentWpm} WPM)
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-amber-400/20 z-10 border-l border-amber-300/40" />
            <div
              className="absolute flex items-center gap-1"
              style={{ left: `calc(${Math.min(90, Math.max(5, displayAiProg))}% - 20px)`, willChange: 'left' }}
            >
              <span className="text-2xl">{opponentAvatar}</span>
            </div>
          </div>
        </div>

        {/* Sprint Target Word */}
        <div className="py-8 flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold">
            🏃‍♂️ Sprint Step:
          </span>

          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-wider py-3 px-8 rounded-2xl bg-slate-900/95 border-2 border-orange-500/80 shadow-2xl inline-block">
            {currentTargetWord.split('').map((char, i) => {
              const isMatched = i < typedInput.length && typedInput[i] === char;
              const isWrong = i < typedInput.length && typedInput[i] !== char;
              return (
                <span
                  key={i}
                  className={
                    isWrong
                      ? 'text-rose-500 underline'
                      : isMatched
                      ? 'text-emerald-400 font-black'
                      : 'text-white'
                  }
                >
                  {char}
                </span>
              );
            })}
          </div>

          <div className="w-full max-w-md">
            <input
              ref={inputRef}
              type="text"
              value={typedInput}
              onChange={handleInputChange}
              disabled={gameState !== 'running'}
              placeholder={gameState === 'running' ? 'Type word and hit space...' : 'Click Sprint to start race'}
              className="w-full px-5 py-3 bg-slate-900 border-2 border-orange-500/80 rounded-2xl font-mono text-center text-xl text-orange-400 font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/20 placeholder:text-slate-600 shadow-inner"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}
