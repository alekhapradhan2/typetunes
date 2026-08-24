'use client';

import { useState, useEffect, useRef } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { getRandomPassage } from '@/lib/words';
import { Trophy, RotateCcw, Flame, Zap, Heart, Play } from 'lucide-react';

interface SpeedBoxingGameProps {
  onSyncProgress?: (progress: number, wpm: number, accuracy: number, isFinished: boolean) => void;
  externalText?: string;
  opponentName?: string;
  opponentAvatar?: string;
  opponentProgress?: number;
  opponentWpm?: number;
  autoStart?: boolean;
}

export default function SpeedBoxingGame({
  onSyncProgress,
  externalText,
  opponentName = 'Iron Jabber AI',
  opponentAvatar = '🤖',
  opponentProgress = 0,
  opponentWpm = 55,
  autoStart = false,
}: SpeedBoxingGameProps) {
  const [gameState, setGameState] = useState<'idle' | 'fighting' | 'knockout' | 'defeated'>('idle');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');

  const [playerHp, setPlayerHp] = useState<number>(100);
  const [opponentHp, setOpponentHp] = useState<number>(100);
  const [punchCombo, setPunchCombo] = useState<number>(0);
  const [playerWpm, setPlayerWpm] = useState<number>(0);
  const [punchesLanded, setPunchesLanded] = useState<number>(0);
  const [shake, setShake] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const correctCharsRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const { playKeystroke } = usePiano();

  // Initialize match words
  const initMatch = () => {
    const raw = externalText || getRandomPassage('short');
    const split = raw.split(/\s+/).filter(Boolean);
    setWords(split);
    setCurrentWordIdx(0);
    setTypedInput('');
    setPlayerHp(100);
    setOpponentHp(100);
    setPunchCombo(0);
    setPunchesLanded(0);
    correctCharsRef.current = 0;
  };

  const startMatch = () => {
    initMatch();
    setGameState('fighting');
    startTimeRef.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  // Keyboard shortcut listener (Enter to start/restart)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((gameState === 'idle' || gameState === 'knockout' || gameState === 'defeated') && e.key === 'Enter') {
        startMatch();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Auto-start on multiplayer countdown finish
  useEffect(() => {
    if (autoStart && gameState === 'idle') {
      startMatch();
    }
  }, [autoStart, gameState]);

  // AI Punch Loop (if not multiplayer)
  useEffect(() => {
    if (gameState !== 'fighting') return;

    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Opponent punch rate
      const aiDps = (opponentWpm / 60) * 12; // HP per sec
      setPlayerHp((hp) => {
        const next = hp - aiDps * delta;
        if (next <= 0) {
          setGameState('defeated');
          return 0;
        }
        return next;
      });

      // Calculate live WPM
      const elapsed = (time - startTimeRef.current) / 1000;
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
  }, [gameState, opponentWpm]);

  // Handle typing punches
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'fighting') return;
    const val = e.target.value;
    const currentTarget = words[currentWordIdx] || '';

    setTypedInput(val);
    playKeystroke(true);

    if (val.trim() === currentTarget) {
      // Land a heavy punch!
      correctCharsRef.current += currentTarget.length + 1;
      const nextIdx = currentWordIdx + 1;
      setCurrentWordIdx(nextIdx);
      setTypedInput('');
      setPunchesLanded((p) => p + 1);

      const newCombo = punchCombo + 1;
      setPunchCombo(newCombo);

      const dmg = 12 + Math.min(20, newCombo * 2);
      setOpponentHp((hp) => {
        const next = hp - dmg;
        if (next <= 0) {
          setGameState('knockout');
          if (onSyncProgress) {
            onSyncProgress(100, playerWpm, 98, true);
          }
          return 0;
        }
        return next;
      });

      setShake(true);
      setTimeout(() => setShake(false), 150);

      // Sync progress
      const progress = Math.min(100, (nextIdx / Math.max(1, words.length)) * 100);
      if (onSyncProgress) {
        onSyncProgress(progress, playerWpm, 98, false);
      }
    }
  };

  const currentTargetWord = words[currentWordIdx] || '';

  return (
    <div className={`space-y-6 select-none ${shake ? 'animate-shake' : ''}`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🥊</span>
            Speed Boxing Knockout Championship
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Step into the ring! Rapid typing unleashes devastating combinations, hooks, and knockouts!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
            Combo: {punchCombo}x Hits
          </span>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-white">
            {playerWpm} WPM
          </span>
        </div>
      </div>

      {/* Boxing Ring Arena */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border-2 border-slate-800 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Ring Ropes graphic */}
        <div className="absolute inset-x-0 top-12 h-1 bg-rose-500/40" />
        <div className="absolute inset-x-0 top-16 h-1 bg-slate-200/40" />
        <div className="absolute inset-x-0 top-20 h-1 bg-cyan-500/40" />

        {/* Idle Splash */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-3 animate-bounce">🥊</span>
            <h3 className="text-2xl font-bold">Ready to Step in the Ring?</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              Type the punch words swiftly to deplete your opponent's stamina before they land counters on you!
            </p>
            <button
              onClick={startMatch}
              className="mt-6 px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              Fight! (Press Enter)
            </button>
          </div>
        )}

        {/* Knockout Victory Modal */}
        {gameState === 'knockout' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
              <Trophy size={36} />
            </div>
            <h3 className="text-3xl font-extrabold text-amber-300">KNOCKOUT VICTORY! 🏆</h3>
            <p className="text-sm text-slate-300 mt-1">
              You landed <strong className="text-emerald-400 font-mono">{punchesLanded}</strong> punches at{' '}
              <strong className="text-cyan-400 font-mono">{playerWpm} WPM</strong>!
            </p>
            <button
              onClick={startMatch}
              className="mt-6 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Rematch (Enter)
            </button>
          </div>
        )}

        {/* Defeat Modal */}
        {gameState === 'defeated' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-2">💫</span>
            <h3 className="text-3xl font-bold text-rose-400">KNOCKED DOWN!</h3>
            <p className="text-sm text-slate-300 mt-1">Keep your speed up to block incoming counters!</p>
            <button
              onClick={startMatch}
              className="mt-6 px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Get Back Up (Enter)
            </button>
          </div>
        )}

        {/* Fighters Health & Stamina HUD */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-800">
          {/* Player Corner */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="text-lg">🥊</span> YOU
              </span>
              <span className="text-slate-400">{Math.round(playerHp)} HP</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150"
                style={{ width: `${playerHp}%` }}
              />
            </div>
          </div>

          {/* Opponent Corner */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-rose-400">
                <span className="text-lg">{opponentAvatar}</span> {opponentName}
              </span>
              <span className="text-slate-400">{Math.round(opponentHp)} HP</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-150"
                style={{ width: `${opponentHp}%` }}
              />
            </div>
          </div>
        </div>

        {/* Ring Center: Target Punch Word */}
        <div className="py-8 flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
            🥊 Punch Target:
          </span>

          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-wider py-3 px-8 rounded-2xl bg-slate-900/95 border-2 border-slate-700 shadow-2xl inline-block">
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

          {/* Input Field */}
          <div className="w-full max-w-md">
            <input
              ref={inputRef}
              type="text"
              value={typedInput}
              onChange={handleInputChange}
              disabled={gameState !== 'fighting'}
              placeholder={gameState === 'fighting' ? 'Type punch word and hit space...' : 'Click Start to enter ring'}
              className="w-full px-5 py-3 bg-slate-900 border-2 border-amber-500/80 rounded-2xl font-mono text-center text-xl text-amber-400 font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/20 placeholder:text-slate-600 shadow-inner"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}
