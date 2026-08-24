'use client';

import { useState, useEffect, useRef } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { ARCADE_WORD_POOLS } from '@/lib/customPractice';
import { Shield, Trophy, RotateCcw, Flame, Sparkles, Play } from 'lucide-react';

interface SiegeEnemy {
  id: string;
  word: string;
  x: number; // 0 - 80%
  y: number; // 0 - 85%
  type: 'ram' | 'catapult' | 'knight';
  speed: number;
}

export default function CastleSiegeGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [wallHp, setWallHp] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [wave, setWave] = useState<number>(1);
  const [enemies, setEnemies] = useState<SiegeEnemy[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');
  const [enemiesDefeated, setEnemiesDefeated] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const { playKeystroke } = usePiano();

  const spawnEnemy = (initialY = 0): SiegeEnemy => {
    const pool = ARCADE_WORD_POOLS['medium'];
    const word = pool[Math.floor(Math.random() * pool.length)];
    const types: ('ram' | 'catapult' | 'knight')[] = ['ram', 'catapult', 'knight'];
    return {
      id: Math.random().toString(36).substring(2, 9) + Date.now(),
      word,
      x: 10 + Math.random() * 75,
      y: initialY,
      type: types[Math.floor(Math.random() * types.length)],
      speed: 10 + wave * 2 + Math.random() * 5,
    };
  };

  const startGame = () => {
    setGameState('playing');
    setWallHp(100);
    setScore(0);
    setWave(1);
    setEnemiesDefeated(0);
    setTypedInput('');
    lastSpawnRef.current = performance.now();

    setEnemies([spawnEnemy(5), spawnEnemy(25), spawnEnemy(45)]);
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

  // Main Siege Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Spawn check
      const interval = Math.max(1200, 2600 - wave * 200);
      if (time - lastSpawnRef.current > interval) {
        setEnemies((prev) => [...prev, spawnEnemy(0)]);
        lastSpawnRef.current = time;
      }

      // Move enemies toward castle wall (bottom)
      setEnemies((prevEnemies) => {
        const next: SiegeEnemy[] = [];
        let wallDmg = 0;

        for (const e of prevEnemies) {
          const newY = e.y + e.speed * delta;
          if (newY >= 82) {
            // Hit castle wall!
            wallDmg += e.type === 'ram' ? 18 : 10;
          } else {
            next.push({ ...e, y: newY });
          }
        }

        if (wallDmg > 0) {
          setWallHp((hp) => {
            const nextHp = hp - wallDmg;
            if (nextHp <= 0) {
              setGameState('gameover');
              return 0;
            }
            return nextHp;
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
  }, [gameState, wave]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    const val = e.target.value.toLowerCase().trimStart();
    setTypedInput(val);
    playKeystroke(true);

    const matchIdx = enemies.findIndex((en) => en.word.toLowerCase() === val.trim());
    if (matchIdx !== -1) {
      const matched = enemies[matchIdx];
      setEnemies((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setTypedInput('');
      setScore((s) => s + matched.word.length * 20);
      const nextDefeated = enemiesDefeated + 1;
      setEnemiesDefeated(nextDefeated);

      if (nextDefeated % 6 === 0) {
        setWave((w) => w + 1);
      }
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🏰</span>
            Castle Siege Defense & Wall Guardian
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Defend the fortress! Type siege engine names before battering rams breach the stone wall!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 border border-purple-200">
            Wave {wave}
          </span>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
            {score} pts
          </span>
        </div>
      </div>

      {/* Siege Battlefield Stage */}
      <div className="relative h-[440px] sm:h-[480px] bg-slate-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between text-white">
        {/* Wall HP Header */}
        <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-300">Fortress Wall Integrity:</span>
          </div>
          <div className="w-48 sm:w-64 h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-cyan-400 rounded-full transition-all duration-200"
              style={{ width: `${wallHp}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">{Math.round(wallHp)}%</span>
        </div>

        {/* Idle Splash */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-3">🏰</span>
            <h3 className="text-2xl font-bold">Defend the Fortress</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              Type the names of descending battering rams and catapults to fire ballista bolts before they hit your wall.
            </p>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              Man the Ramparts! (Enter)
            </button>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-5xl mb-2">💥</span>
            <h3 className="text-3xl font-bold text-rose-400">WALL BREACHED!</h3>
            <p className="text-sm text-slate-300 mt-1">
              Final Score: <strong className="text-emerald-400 font-mono text-lg">{score}</strong> pts • Reached Wave {wave}
            </p>
            <button
              onClick={startGame}
              className="mt-6 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Rebuild & Defend (Enter)
            </button>
          </div>
        )}

        {/* Enemy Siege Engines Rendering */}
        <div className="relative flex-1 w-full overflow-hidden">
          {enemies.map((en) => {
            const isTarget = typedInput && en.word.toLowerCase().startsWith(typedInput.toLowerCase());
            return (
              <div
                key={en.id}
                className={`absolute transform -translate-x-1/2 px-3.5 py-1.5 rounded-xl font-mono font-extrabold text-sm sm:text-base select-none shadow-xl flex items-center gap-1.5 ${
                  isTarget
                    ? 'bg-amber-400 text-slate-950 scale-110 shadow-amber-400/70 z-20 border-2 border-white ring-2 ring-amber-300'
                    : 'bg-slate-900/95 text-white border-2 border-slate-700 shadow-slate-900'
                }`}
                style={{
                  left: `${en.x}%`,
                  top: `${en.y}%`,
                  willChange: 'top, left',
                }}
              >
                <span>{en.type === 'ram' ? '🪵' : en.type === 'catapult' ? '☄️' : '⚔️'}</span>
                {isTarget ? (
                  <>
                    <span className="text-emerald-950 underline font-black">
                      {en.word.slice(0, typedInput.length)}
                    </span>
                    <span>{en.word.slice(typedInput.length)}</span>
                  </>
                ) : (
                  en.word
                )}
              </div>
            );
          })}
        </div>

        {/* Castle Wall Rampart Line */}
        <div className="h-3 w-full bg-slate-700 border-t-2 border-cyan-400 shadow-md flex items-center justify-around">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-4 h-3 bg-slate-600 border-x border-slate-800" />
          ))}
        </div>

        {/* Ballista Typing Input Dock */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            disabled={gameState !== 'playing'}
            placeholder={gameState === 'playing' ? 'Type target to fire ballista...' : 'Click Start to play'}
            className="w-full max-w-md px-5 py-3 bg-slate-800 border-2 border-cyan-500/80 rounded-2xl font-mono text-center text-cyan-300 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/20 placeholder:text-slate-500 shadow-inner"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
