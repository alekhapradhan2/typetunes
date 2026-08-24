'use client';

import { useState, useEffect, useRef } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { getRandomPassage } from '@/lib/words';
import { Trophy, RotateCcw, Play, Sparkles, Wand2, Shield, Flame } from 'lucide-react';

interface WizardDuelProps {
  onSyncProgress?: (progress: number, wpm: number, accuracy: number, isFinished: boolean) => void;
  externalText?: string;
  opponentName?: string;
  opponentAvatar?: string;
  opponentWpm?: number;
  autoStart?: boolean;
}

export default function WizardDuelGame({
  onSyncProgress,
  externalText,
  opponentName = 'Archmage Malakor',
  opponentAvatar = '🧙‍♂️',
  opponentWpm = 58,
  autoStart = false,
}: WizardDuelProps) {
  const [gameState, setGameState] = useState<'idle' | 'dueling' | 'victory' | 'defeat'>('idle');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');

  const [playerHp, setPlayerHp] = useState<number>(100);
  const [opponentHp, setOpponentHp] = useState<number>(100);
  const [mana, setMana] = useState<number>(30);
  const [playerWpm, setPlayerWpm] = useState<number>(0);
  const [spellsCast, setSpellsCast] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const correctCharsRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const { playKeystroke } = usePiano();

  const initDuel = () => {
    const raw = externalText || getRandomPassage('short');
    const split = raw.split(/\s+/).filter(Boolean);
    setWords(split);
    setCurrentWordIdx(0);
    setTypedInput('');
    setPlayerHp(100);
    setOpponentHp(100);
    setMana(30);
    setSpellsCast(0);
    correctCharsRef.current = 0;
  };

  const startDuel = () => {
    initDuel();
    setGameState('dueling');
    startTimeRef.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  // Keyboard shortcut listener (Enter to start/restart)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((gameState === 'idle' || gameState === 'victory' || gameState === 'defeat') && e.key === 'Enter') {
        startDuel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Auto-start when triggered by multiplayer match start
  useEffect(() => {
    if (autoStart && gameState === 'idle') {
      startDuel();
    }
  }, [autoStart, gameState]);

  // AI Opponent Spellcasting Loop
  useEffect(() => {
    if (gameState !== 'dueling') return;

    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const aiDps = (opponentWpm / 60) * 11;
      setPlayerHp((hp) => {
        const next = hp - aiDps * delta;
        if (next <= 0) {
          setGameState('defeat');
          return 0;
        }
        return next;
      });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'dueling') return;
    const val = e.target.value;
    const currentTarget = words[currentWordIdx] || '';

    setTypedInput(val);
    playKeystroke(true);

    if (val.trim() === currentTarget) {
      correctCharsRef.current += currentTarget.length + 1;
      const nextIdx = currentWordIdx + 1;
      setCurrentWordIdx(nextIdx);
      setTypedInput('');
      setSpellsCast((s) => s + 1);
      setMana((m) => Math.min(100, m + 15));

      const dmg = 15;
      setOpponentHp((hp) => {
        const next = hp - dmg;
        if (next <= 0) {
          setGameState('victory');
          if (onSyncProgress) {
            onSyncProgress(100, playerWpm, 98, true);
          }
          return 0;
        }
        return next;
      });

      const progress = Math.min(100, (nextIdx / Math.max(1, words.length)) * 100);
      if (onSyncProgress) {
        onSyncProgress(progress, playerWpm, 98, false);
      }
    }
  };

  const currentTargetWord = words[currentWordIdx] || '';

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🧙</span>
            Wizard Spell PvP Duel & Arcane Clash
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Channel mystical runes! Cast arcane fireballs and frost blasts to vanquish your rival wizard!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 border border-purple-200">
            {spellsCast} Spells Cast
          </span>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-purple-300">
            {playerWpm} WPM
          </span>
        </div>
      </div>

      {/* Duel Arena */}
      <div className="relative bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 rounded-3xl border-2 border-purple-900 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Idle Splash */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-3 animate-pulse">🧙</span>
            <h3 className="text-2xl font-bold">Begin Arcane Spell Duel</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              Type spell incantations to fire mana bolts at your rival wizard before their hexes deplete your health!
            </p>
            <button
              onClick={startDuel}
              className="mt-6 px-8 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              Cast Duel Spell (Enter)
            </button>
          </div>
        )}

        {/* Victory Modal */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-400 mb-3 shadow-lg">
              <Trophy size={36} />
            </div>
            <h3 className="text-3xl font-bold text-purple-300">GRAND ARCHMAGE VICTORY! 🧙</h3>
            <p className="text-sm text-slate-300 mt-1">
              You cast <strong className="text-emerald-400 font-mono">{spellsCast}</strong> spells at{' '}
              <strong className="text-purple-300 font-mono">{playerWpm} WPM</strong>!
            </p>
            <button
              onClick={startDuel}
              className="mt-6 px-8 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Duel Again (Enter)
            </button>
          </div>
        )}

        {/* Defeat Modal */}
        {gameState === 'defeat' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-2">⚡</span>
            <h3 className="text-3xl font-bold text-rose-400">HEX OVERWHELMED!</h3>
            <p className="text-sm text-slate-300 mt-1">Speed up your spell incantations to counter rival hexes!</p>
            <button
              onClick={startDuel}
              className="mt-6 px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Re-engage (Enter)
            </button>
          </div>
        )}

        {/* Wizards Health HUD */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-purple-300">
                <span>🧙</span> YOU (Archmage)
              </span>
              <span className="text-slate-400">{Math.round(playerHp)} HP</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-150"
                style={{ width: `${playerHp}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-rose-400">
                <span>{opponentAvatar}</span> {opponentName}
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

        {/* Spell Casting Target Word */}
        <div className="py-8 flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
            ✨ Incantation Spell:
          </span>

          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-wider py-3 px-8 rounded-2xl bg-slate-900/95 border-2 border-purple-700 shadow-2xl inline-block">
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
                      ? 'text-purple-300 font-black'
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
              disabled={gameState !== 'dueling'}
              placeholder={gameState === 'dueling' ? 'Type incantation...' : 'Click Start to begin duel'}
              className="w-full px-5 py-3 bg-slate-900 border-2 border-purple-500/80 rounded-2xl font-mono text-center text-xl text-purple-300 font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/20 placeholder:text-slate-600 shadow-inner"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}
