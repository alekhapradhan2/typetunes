'use client';

import { useState, useEffect, useRef } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { ARCADE_WORD_POOLS } from '@/lib/customPractice';
import { Trophy, RotateCcw, Play, Anchor, Compass } from 'lucide-react';

interface SeaHazard {
  id: string;
  word: string;
  x: number; // 0 - 80%
  y: number; // 0 - 85%
  type: 'mine' | 'torpedo' | 'shark';
  speed: number;
}

export default function SubmarineDepthGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [hullIntegrity, setHullIntegrity] = useState<number>(100);
  const [depthMeters, setDepthMeters] = useState<number>(0);
  const [hazards, setHazards] = useState<SeaHazard[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const { playKeystroke } = usePiano();

  const spawnHazard = (initialY = 0): SeaHazard => {
    const pool = ARCADE_WORD_POOLS['easy'];
    const word = pool[Math.floor(Math.random() * pool.length)];
    const types: ('mine' | 'torpedo' | 'shark')[] = ['mine', 'torpedo', 'shark'];
    return {
      id: Math.random().toString(36).substring(2, 9) + Date.now(),
      word,
      x: 10 + Math.random() * 75,
      y: initialY,
      type: types[Math.floor(Math.random() * types.length)],
      speed: 12 + Math.min(20, Math.floor(depthMeters / 100)) + Math.random() * 5,
    };
  };

  const startGame = () => {
    setGameState('playing');
    setHullIntegrity(100);
    setDepthMeters(0);
    setTypedInput('');
    lastSpawnRef.current = performance.now();

    setHazards([spawnHazard(5), spawnHazard(25), spawnHazard(45)]);
    setTimeout(() => inputRef.current?.focus(), 60);
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

  // Main Submarine Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Descend depth meters
      setDepthMeters((d) => d + Math.round(15 * delta));

      // Spawn hazard check
      if (time - lastSpawnRef.current > 2200) {
        setHazards((prev) => [...prev, spawnHazard(0)]);
        lastSpawnRef.current = time;
      }

      // Move hazards
      setHazards((prevHazards) => {
        const next: SeaHazard[] = [];
        let hullDmg = 0;

        for (const h of prevHazards) {
          const newY = h.y + h.speed * delta;
          if (newY >= 82) {
            // Collision with submarine!
            hullDmg += h.type === 'mine' ? 25 : 15;
          } else {
            next.push({ ...h, y: newY });
          }
        }

        if (hullDmg > 0) {
          setHullIntegrity((hull) => {
            const nextHull = hull - hullDmg;
            if (nextHull <= 0) {
              setGameState('gameover');
              return 0;
            }
            return nextHull;
          });
        }

        return next;
      });

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, depthMeters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    const val = e.target.value.toLowerCase().trimStart();
    setTypedInput(val);
    playKeystroke(true);

    const matchIdx = hazards.findIndex((h) => h.word.toLowerCase() === val.trim());
    if (matchIdx !== -1) {
      setHazards((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setTypedInput('');
      setDepthMeters((d) => d + 30);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            Submarine Ocean Depth Rush
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Dive deep into Mariana Trench! Type sonar telemetry words to disarm sea mines and depth charges!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-cyan-100 text-cyan-800 border border-cyan-200 flex items-center gap-1">
            <Compass size={14} /> {depthMeters}m Depth
          </span>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-cyan-300">
            Hull: {Math.round(hullIntegrity)}%
          </span>
        </div>
      </div>

      {/* Ocean Depth Stage */}
      <div className="relative h-[440px] sm:h-[480px] bg-gradient-to-b from-blue-950 via-slate-950 to-slate-950 rounded-3xl border-2 border-blue-900 overflow-hidden shadow-2xl flex flex-col justify-between text-white">
        {/* Ocean Grid Overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Idle Splash */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-3">🚢</span>
            <h3 className="text-2xl font-bold">Submarine Dive Mission</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              Type the sonar targets to disarm naval mines before they impact your submarine hull!
            </p>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              Dive Submarine (Enter)
            </button>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-2">💥</span>
            <h3 className="text-3xl font-bold text-rose-400">HULL CRUSH DEPTH!</h3>
            <p className="text-sm text-slate-300 mt-1">
              Max Depth Reached: <strong className="text-cyan-400 font-mono text-xl">{depthMeters} meters</strong>
            </p>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Re-submerge (Enter)
            </button>
          </div>
        )}

        {/* Sonar Hazards Rendering */}
        <div className="relative flex-1 w-full overflow-hidden">
          {hazards.map((h) => {
            const isTarget = typedInput && h.word.toLowerCase().startsWith(typedInput.toLowerCase());
            return (
              <div
                key={h.id}
                className={`absolute transform -translate-x-1/2 px-3.5 py-1.5 rounded-xl font-mono font-extrabold text-sm sm:text-base select-none shadow-xl flex items-center gap-1.5 ${
                  isTarget
                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-amber-400/70 z-20 border-2 border-white ring-2 ring-amber-300'
                    : 'bg-slate-900/95 text-white border-2 border-blue-800 shadow-slate-900'
                }`}
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  willChange: 'top, left',
                }}
              >
                <span>{h.type === 'mine' ? '💣' : h.type === 'torpedo' ? '🚀' : '🦈'}</span>
                {isTarget ? (
                  <>
                    <span className="text-emerald-950 underline font-black">
                      {h.word.slice(0, typedInput.length)}
                    </span>
                    <span>{h.word.slice(typedInput.length)}</span>
                  </>
                ) : (
                  h.word
                )}
              </div>
            );
          })}
        </div>

        {/* Submarine Hull Dock Line */}
        <div className="h-3 w-full bg-blue-900 border-t-2 border-cyan-400 shadow-md flex items-center justify-center">
          <span className="text-lg -mt-3">🚢</span>
        </div>

        {/* Sonar Typing Input Dock */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            disabled={gameState !== 'playing'}
            placeholder={gameState === 'playing' ? 'Type sonar target...' : 'Click Dive to start'}
            className="w-full max-w-md px-5 py-3 bg-slate-800 border-2 border-cyan-500/80 rounded-2xl font-mono text-center text-cyan-300 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/20 placeholder:text-slate-500 shadow-inner"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
