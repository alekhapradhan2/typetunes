'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { Rocket, Shield, Trophy, RotateCcw, Zap, Sparkles, Heart, Crosshair, Play } from 'lucide-react';
import { ARCADE_WORD_POOLS } from '@/lib/customPractice';

interface SpaceInvader {
  id: string;
  word: string;
  x: number; // percentage 10% to 85%
  y: number; // percentage 0% to 100%
  type: 'drone' | 'ufo' | 'meteor';
  speed: number;
}

export default function SpaceDefenderGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [wave, setWave] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [shieldHp, setShieldHp] = useState<number>(100);
  const [streak, setStreak] = useState<number>(0);
  const [empReady, setEmpReady] = useState<boolean>(false);

  const [invaders, setInvaders] = useState<SpaceInvader[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');

  const invadersRef = useRef<SpaceInvader[]>([]);
  const animRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playKeystroke } = usePiano();

  // Keep invadersRef in sync
  invadersRef.current = invaders;

  // Word pool based on wave
  const getWordPool = useCallback(() => {
    if (wave === 1) return ARCADE_WORD_POOLS.easy;
    if (wave === 2) return ARCADE_WORD_POOLS.medium;
    return ARCADE_WORD_POOLS.hard;
  }, [wave]);

  // Create single invader
  const createInvader = useCallback((initialY = 0): SpaceInvader => {
    const pool = getWordPool();
    const word = pool[Math.floor(Math.random() * pool.length)];
    const types: SpaceInvader['type'][] = ['drone', 'ufo', 'meteor'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      id: Math.random().toString(36).substring(2, 9) + Date.now(),
      word,
      type,
      x: 12 + Math.random() * 70,
      y: initialY,
      speed: 12 + wave * 2.5 + Math.random() * 4, // percent per second
    };
  }, [wave, getWordPool]);

  // Main 60FPS Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      // Spawn Interval
      const spawnInterval = Math.max(1400, 2800 - wave * 250);
      if (time - lastSpawnRef.current > spawnInterval) {
        const newInvader = createInvader(0);
        setInvaders((prev) => [...prev, newInvader]);
        lastSpawnRef.current = time;
      }

      // Move Invaders smoothly
      setInvaders((prev) => {
        const next: SpaceInvader[] = [];
        let damage = 0;

        for (const inv of prev) {
          const nextY = inv.y + inv.speed * delta;
          if (nextY >= 82) {
            damage += 20; // impact shield
          } else {
            next.push({ ...inv, y: nextY });
          }
        }

        if (damage > 0) {
          setShieldHp((hp) => {
            const nextHp = hp - damage;
            if (nextHp <= 0) {
              setGameState('gameover');
              return 0;
            }
            return nextHp;
          });
          setStreak(0);
        }

        return next;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState, wave, createInvader]);

  // Start / Restart Game
  const startGame = () => {
    setTypedInput('');
    setScore(0);
    setShieldHp(100);
    setWave(1);
    setStreak(0);
    setEmpReady(false);
    setGameState('playing');
    lastSpawnRef.current = performance.now();

    // Spawn 3 active targets immediately at staggered heights
    const initialList: SpaceInvader[] = [
      createInvader(5),
      createInvader(22),
      createInvader(38),
    ];
    setInvaders(initialList);

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

  // Handle typing to shoot lasers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    const val = e.target.value.toLowerCase().trimStart();
    setTypedInput(val);

    playKeystroke(true);

    // Check matching invader
    const matchIdx = invaders.findIndex((inv) => inv.word.toLowerCase() === val.trim());
    if (matchIdx !== -1) {
      const destroyed = invaders[matchIdx];
      setInvaders((prev) => prev.filter((_, i) => i !== matchIdx));
      setTypedInput('');

      // Add points
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = destroyed.word.length * 20 * Math.min(4, Math.floor(newStreak / 4) + 1);
      setScore((s) => s + points);

      if (newStreak >= 6 && !empReady) {
        setEmpReady(true);
      }

      // Wave level up every 6 enemies destroyed
      if ((score + points) > wave * 380) {
        setWave((w) => w + 1);
      }
    }
  };

  // Fire EMP Blast (Clears all current on-screen invaders)
  const triggerEmp = () => {
    if (!empReady || gameState !== 'playing') return;
    setInvaders([]);
    setEmpReady(false);
    setScore((s) => s + 150);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Rocket className="text-purple-600" size={24} />
            Cosmic Galaxy Defender 🚀
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Incoming asteroid swarms and alien drones! Type target words to fire plasma lasers and defend your shield.
          </p>
        </div>

        {/* HUD stats */}
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-purple-800">
            Sector Wave: {wave}
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-800">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Main Space Combat Canvas */}
      <div className="relative h-[440px] sm:h-[480px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between text-white">
        {/* Starfield background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '32px 32px, 48px 48px',
            backgroundPosition: '0 0, 16px 16px',
          }}
        />

        {/* Idle Start Modal */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-400 mb-3 shadow-lg shadow-purple-950">
              <Crosshair size={36} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Cosmic Defender Ready</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              Type the descending space targets to fire laser cannons.
            </p>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-950 flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              Launch Starship (Press Enter)
            </button>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-3 shadow-lg">
              <Trophy size={36} />
            </div>
            <h3 className="text-3xl font-bold tracking-tight">MISSION CONCLUDED</h3>
            <p className="text-sm text-slate-300 mt-1">
              Final Sector Score: <strong className="text-purple-400 font-mono text-lg">{score}</strong> pts
            </p>
            <p className="text-xs text-slate-400 mt-1">Highest Sector Cleared: Wave {wave}</p>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              Re-Deploy Defense (Enter)
            </button>
          </div>
        )}

        {/* Descending Invaders Arena */}
        <div className="relative flex-1 w-full overflow-hidden">
          {invaders.map((inv) => {
            const isMatch = typedInput && inv.word.toLowerCase().startsWith(typedInput.toLowerCase());
            return (
              <div
                key={inv.id}
                className={`absolute transform -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-extrabold text-sm sm:text-base select-none shadow-xl ${
                  isMatch
                    ? 'bg-purple-600 text-white scale-110 shadow-purple-500/80 z-20 border-2 border-white ring-2 ring-purple-400/50'
                    : 'bg-slate-900/95 text-white border-2 border-slate-700 shadow-slate-950/80'
                }`}
                style={{
                  left: `${inv.x}%`,
                  top: `${inv.y}%`,
                  willChange: 'top, left',
                }}
              >
                <span className="text-base">{inv.type === 'ufo' ? '🛸' : inv.type === 'meteor' ? '☄️' : '👾'}</span>
                {isMatch ? (
                  <span>
                    <span className="text-emerald-400 font-black underline">{inv.word.slice(0, typedInput.length)}</span>
                    <span className="text-purple-100">{inv.word.slice(typedInput.length)}</span>
                  </span>
                ) : (
                  <span>{inv.word}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Planetary Shield Barrier & Starship Gun */}
        <div className="relative px-6 py-4 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-3">
          {/* Shield Health Bar */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <Shield size={14} />
              Planetary Shield: {shieldHp}%
            </span>
            <span className="text-amber-400 font-semibold">Streak: {streak}x</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-yellow-400 to-cyan-400 rounded-full transition-all duration-150"
              style={{ width: `${shieldHp}%` }}
            />
          </div>

          {/* Typing Telemetry Dock */}
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={typedInput}
              onChange={handleInputChange}
              disabled={gameState !== 'playing'}
              placeholder={gameState === 'playing' ? 'Type target word to lock and fire...' : 'Click Launch Starship or press Enter'}
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl font-mono text-center text-purple-300 font-bold text-base focus:outline-none focus:border-purple-400 placeholder:text-slate-500 shadow-inner"
              autoFocus
            />

            <button
              onClick={triggerEmp}
              disabled={!empReady || gameState !== 'playing'}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                empReady && gameState === 'playing'
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/40 cursor-pointer animate-pulse'
                  : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap size={15} fill="currentColor" />
              EMP BOMB
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
