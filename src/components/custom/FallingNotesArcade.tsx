'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { ARCADE_WORD_POOLS } from '@/lib/customPractice';
import { Gamepad2, Heart, RotateCcw, Trophy, Zap, Sparkles, Volume2, Play } from 'lucide-react';

interface FallingWord {
  id: string;
  word: string;
  x: number; // percentage 5% to 85%
  y: number; // percentage 0% to 100%
  speed: number;
}

export default function FallingNotesArcade() {
  const [speedLevel, setSpeedLevel] = useState<'chill' | 'lively' | 'hyper'>('chill');
  const [wordDifficulty, setWordDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');

  const [words, setWords] = useState<FallingWord[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [wordsCleared, setWordsCleared] = useState<number>(0);

  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const { playKeystroke } = usePiano();
  const inputRef = useRef<HTMLInputElement>(null);

  // Speed in percent per second
  const speedRates = {
    chill: 11,
    lively: 17,
    hyper: 24,
  };

  // Load high score from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('typetunes_arcade_high_score');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  // Spawn a new falling word
  const createFallingWord = useCallback((initialY = 0): FallingWord => {
    const pool = ARCADE_WORD_POOLS[wordDifficulty];
    const word = pool[Math.floor(Math.random() * pool.length)];
    return {
      id: Math.random().toString(36).substring(2, 9) + Date.now(),
      word,
      x: 12 + Math.random() * 70,
      y: initialY,
      speed: (speedRates[speedLevel] * (1 + level * 0.06)) * (0.85 + Math.random() * 0.3),
    };
  }, [wordDifficulty, speedLevel, level, speedRates]);

  // Main Game Loop (requestAnimationFrame)
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      // Spawn timer
      const spawnInterval = Math.max(1200, 2600 - level * 200);
      if (time - lastSpawnRef.current > spawnInterval) {
        const newWord = createFallingWord(0);
        setWords((prev) => [...prev, newWord]);
        lastSpawnRef.current = time;
      }

      // Move falling words smoothly
      setWords((prevWords) => {
        const nextWords: FallingWord[] = [];
        let lostLives = 0;

        for (const w of prevWords) {
          const newY = w.y + w.speed * delta;
          if (newY >= 86) {
            // Reached the bottom ground line! Lose a life
            lostLives += 1;
          } else {
            nextWords.push({ ...w, y: newY });
          }
        }

        if (lostLives > 0) {
          setLives((l) => {
            const nextLives = l - lostLives;
            if (nextLives <= 0) {
              setGameState('gameover');
            }
            return Math.max(0, nextLives);
          });
          setCombo(0);
        }

        return nextWords;
      });

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, level, createFallingWord]);

  // Start / Restart Game
  const startGame = () => {
    setCurrentInput('');
    setScore(0);
    setLives(3);
    setCombo(0);
    setLevel(1);
    setWordsCleared(0);
    setGameState('playing');
    lastSpawnRef.current = performance.now();

    // Instantly spawn 3 words
    const initialWords: FallingWord[] = [
      createFallingWord(5),
      createFallingWord(22),
      createFallingWord(40),
    ];
    setWords(initialWords);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
  };

  // Keyboard shortcut listener (Enter to start/restart)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((gameState === 'idle' || gameState === 'gameover') && e.key === 'Enter') {
        startGame();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Handle word input matching
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    const val = e.target.value.toLowerCase().trimStart();
    setCurrentInput(val);

    playKeystroke(true);

    // Check if typed string exactly matches any active falling word
    const matchIndex = words.findIndex((w) => w.word.toLowerCase() === val.trim());
    if (matchIndex !== -1) {
      const matched = words[matchIndex];
      // Remove word
      setWords((prev) => prev.filter((_, idx) => idx !== matchIndex));
      setCurrentInput('');

      // Update score & combo
      const newCombo = combo + 1;
      const points = matched.word.length * 15 * Math.min(5, Math.floor(newCombo / 5) + 1);
      setScore((s) => {
        const nextScore = s + points;
        if (nextScore > highScore) {
          setHighScore(nextScore);
          try {
            localStorage.setItem('typetunes_arcade_high_score', nextScore.toString());
          } catch {}
        }
        return nextScore;
      });
      setCombo(newCombo);

      const nextCleared = wordsCleared + 1;
      setWordsCleared(nextCleared);

      // Level progression every 7 words
      if (nextCleared % 7 === 0) {
        setLevel((l) => l + 1);
      }
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header & Mode controls */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Gamepad2 className="text-sage-600" size={24} />
            Falling Notes & Word Cascade Arcade
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Musical words fall from the sky. Type them before they hit the ground to trigger harmonious chords and level up!
          </p>
        </div>

        {/* Game settings (when idle) */}
        {gameState === 'idle' && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['chill', 'lively', 'hyper'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeedLevel(spd)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all capitalize ${
                    speedLevel === spd ? 'bg-sage-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setWordDifficulty(diff)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all capitalize ${
                    wordDifficulty === diff ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Arcade Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Lives */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Lives</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((i) => (
              <Heart
                key={i}
                size={18}
                className={`transition-all ${
                  i <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Level</span>
          <span className="font-mono font-bold text-slate-800 text-base">Stage {level}</span>
        </div>

        {/* Combo */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Combo</span>
          <span className="font-mono font-bold text-amber-600 text-base">
            {combo > 0 ? `${combo}x Streak` : '0'}
          </span>
        </div>

        {/* Score */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Score</span>
          <span className="font-mono font-bold text-emerald-600 text-base">{score}</span>
        </div>

        {/* High Score */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 font-medium">High Score</span>
          <span className="font-mono font-bold text-purple-600 text-base">{highScore}</span>
        </div>
      </div>

      {/* Main Arcade Stage */}
      <div className="relative h-[440px] sm:h-[480px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#34d399 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Idle Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-sage-500/20 border border-sage-400 flex items-center justify-center text-sage-300 mb-3 shadow-lg shadow-sage-950">
              <Gamepad2 size={36} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Word Cascade Arcade</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              Type the descending musical words before they touch the red ground line.
            </p>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-3 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-sm transition-all shadow-lg shadow-sage-500/30 flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              Start Arcade Run (Press Enter)
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 mb-3">
              <Trophy size={28} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">ROUND FINISHED!</h3>
            <p className="text-sm text-slate-300 mt-1">
              Final Score: <strong className="text-emerald-400 font-mono text-lg">{score}</strong> pts
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400">
              <span>Cleared: {wordsCleared} words</span>
              <span>•</span>
              <span>Highest Stage: {level}</span>
            </div>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Play Again (Enter)
            </button>
          </div>
        )}

        {/* Falling Words Rendering */}
        <div className="relative flex-1 w-full overflow-hidden">
          {words.map((item) => {
            const isTarget = currentInput && item.word.toLowerCase().startsWith(currentInput.toLowerCase());
            return (
              <div
                key={item.id}
                className={`absolute transform -translate-x-1/2 px-3.5 py-1.5 rounded-xl font-mono font-extrabold text-sm sm:text-base select-none shadow-xl ${
                  isTarget
                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-amber-400/70 z-20 border-2 border-white ring-2 ring-amber-300'
                    : 'bg-slate-900/95 text-white border-2 border-slate-700 shadow-slate-900'
                }`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  willChange: 'top, left',
                }}
              >
                {isTarget ? (
                  <>
                    <span className="text-emerald-950 underline font-black">
                      {item.word.slice(0, currentInput.length)}
                    </span>
                    <span>{item.word.slice(currentInput.length)}</span>
                  </>
                ) : (
                  item.word
                )}
              </div>
            );
          })}
        </div>

        {/* Ground Barrier Line */}
        <div className="h-2.5 w-full bg-rose-500/80 shadow-md shadow-rose-500/50" />

        {/* Typing Input Dock */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            disabled={gameState !== 'playing'}
            placeholder={gameState === 'playing' ? 'Type falling word here...' : 'Click Start or press Enter'}
            className="w-full max-w-md px-5 py-3 bg-slate-800 border-2 border-slate-700 rounded-2xl font-mono text-center text-emerald-400 font-bold text-lg focus:outline-none focus:border-emerald-400 placeholder:text-slate-500 shadow-inner"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
