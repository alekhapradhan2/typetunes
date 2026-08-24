'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePiano } from '@/hooks/usePiano';
import { RPG_BOSSES, BossDefinition } from '@/lib/customPractice';
import {
  Swords,
  Shield,
  Zap,
  Heart,
  RotateCcw,
  Trophy,
  Sparkles,
  Flame,
  Snowflake,
  Crown,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface FloatingCombatText {
  id: string;
  text: string;
  type: 'player-dmg' | 'boss-dmg' | 'crit' | 'shield' | 'heal';
  x: number;
}

export default function BossBattleRPG() {
  const [currentBossIndex, setCurrentBossIndex] = useState<number>(0);
  const boss = RPG_BOSSES[currentBossIndex];

  const [gameState, setGameState] = useState<'idle' | 'fighting' | 'victory' | 'defeat'>('idle');
  const [bossHp, setBossHp] = useState<number>(boss.maxHp);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerMana, setPlayerMana] = useState<number>(0);
  const [hasShield, setHasShield] = useState<boolean>(false);

  const [currentSpellWord, setCurrentSpellWord] = useState<string>('');
  const [wordQueue, setWordQueue] = useState<string[]>([]);
  const [typedInput, setTypedInput] = useState<string>('');

  const [bossChargePercent, setBossChargePercent] = useState<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingCombatText[]>([]);
  const [shake, setShake] = useState<boolean>(false);
  const [totalDmgDealt, setTotalDmgDealt] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const { playKeystroke } = usePiano();
  const bossAttackTimerRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Initialize word queue for the boss
  const initWordQueue = useCallback((bossDef: BossDefinition) => {
    const shuffled = [...bossDef.spells].sort(() => Math.random() - 0.5);
    setCurrentSpellWord(shuffled[0]);
    setWordQueue(shuffled.slice(1));
    setTypedInput('');
  }, []);

  // Reset / Start Encounter
  const startBattle = (bossIdx = currentBossIndex) => {
    const targetBoss = RPG_BOSSES[bossIdx];
    setCurrentBossIndex(bossIdx);
    setBossHp(targetBoss.maxHp);
    setPlayerHp(100);
    setPlayerMana(30);
    setHasShield(false);
    setBossChargePercent(0);
    setFloatingTexts([]);
    setTotalDmgDealt(0);
    setGameState('fighting');

    initWordQueue(targetBoss);
    bossAttackTimerRef.current = performance.now();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Add floating combat text
  const addCombatText = (text: string, type: FloatingCombatText['type']) => {
    const newText: FloatingCombatText = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      type,
      x: 30 + Math.random() * 40,
    };
    setFloatingTexts((prev) => [...prev.slice(-4), newText]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newText.id));
    }, 1200);
  };

  // Boss Attack Loop
  useEffect(() => {
    if (gameState !== 'fighting') return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setBossChargePercent((prev) => {
        const rate = (100 / boss.attackIntervalSec) * delta;
        const next = prev + rate;

        if (next >= 100) {
          // Boss Attacks!
          handleBossAttack();
          return 0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, boss, hasShield]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle incoming boss attack
  const handleBossAttack = () => {
    if (hasShield) {
      setHasShield(false);
      addCombatText('🛡️ BLOCKED!', 'shield');
      return;
    }

    setShake(true);
    setTimeout(() => setShake(false), 250);

    const dmg = boss.attackDmg;
    addCombatText(`-${dmg} HP`, 'boss-dmg');

    setPlayerHp((hp) => {
      const remaining = hp - dmg;
      if (remaining <= 0) {
        setGameState('defeat');
        return 0;
      }
      return remaining;
    });
  };

  // Player Types a Letter / Word
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'fighting') return;
    const val = e.target.value;
    setTypedInput(val);

    playKeystroke(true);

    // Check if word completed
    if (val.trim() === currentSpellWord) {
      // Calculate attack damage
      const baseDmg = currentSpellWord.length * 14;
      const isCrit = Math.random() < 0.35;
      const finalDmg = isCrit ? Math.round(baseDmg * 1.75) : baseDmg;

      addCombatText(isCrit ? `⚡ CRIT! -${finalDmg}` : `-${finalDmg} DMG`, isCrit ? 'crit' : 'player-dmg');
      setTotalDmgDealt((d) => d + finalDmg);

      // Gain Mana
      setPlayerMana((m) => Math.min(100, m + 18));

      // Damage Boss
      setBossHp((prevHp) => {
        const nextHp = prevHp - finalDmg;
        if (nextHp <= 0) {
          setGameState('victory');
          return 0;
        }
        return nextHp;
      });

      // Next word in queue
      if (wordQueue.length > 0) {
        setCurrentSpellWord(wordQueue[0]);
        setWordQueue((q) => q.slice(1));
      } else {
        // refill queue
        initWordQueue(boss);
      }
      setTypedInput('');
    }
  };

  // Special Spell Actions
  const castShieldSpell = () => {
    if (playerMana < 40 || hasShield || gameState !== 'fighting') return;
    setPlayerMana((m) => m - 40);
    setHasShield(true);
    addCombatText('✨ Shield Cast!', 'shield');
    inputRef.current?.focus();
  };

  const castLightningSpell = () => {
    if (playerMana < 60 || gameState !== 'fighting') return;
    setPlayerMana((m) => m - 60);
    const dmg = 220;
    addCombatText(`⚡ LIGHTNING -${dmg}!`, 'crit');
    setBossHp((hp) => {
      const next = hp - dmg;
      if (next <= 0) {
        setGameState('victory');
        return 0;
      }
      return next;
    });
    inputRef.current?.focus();
  };

  // Keyboard shortcut listener for spells (1: Shield, 2: Lightning) and Enter
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((gameState === 'idle' || gameState === 'defeat') && e.key === 'Enter') {
        startBattle(currentBossIndex);
      } else if (gameState === 'fighting') {
        if (e.key === '1' && playerMana >= 40 && !hasShield) {
          castShieldSpell();
        } else if (e.key === '2' && playerMana >= 60) {
          castLightningSpell();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, playerMana, hasShield, currentBossIndex]);

  // Advance to next boss on victory
  const handleNextStage = () => {
    if (currentBossIndex < RPG_BOSSES.length - 1) {
      startBattle(currentBossIndex + 1);
    } else {
      startBattle(0); // Loop or victory
    }
  };

  return (
    <div className={`space-y-6 select-none ${shake ? 'animate-shake' : ''}`}>
      {/* Header & Stage Selection */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Swords className="text-rose-600" size={24} />
            Typing Boss Battle RPG & Monster Gauntlet
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Defeat elemental monsters by typing incantations, building combo mana, and casting tactical spells!
          </p>
        </div>

        {/* Stage Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {RPG_BOSSES.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => startBattle(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentBossIndex === idx
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{b.avatar}</span>
              <span className="hidden md:inline">Stage {idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Battle Arena */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border-2 border-slate-800 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Ambient Element Glow */}
        <div
          className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none ${
            boss.element === 'fire'
              ? 'bg-orange-500'
              : boss.element === 'ice'
              ? 'bg-cyan-500'
              : boss.element === 'electric'
              ? 'bg-yellow-400'
              : 'bg-purple-600'
          }`}
        />

        {/* Floating Combat Text Renderer */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {floatingTexts.map((f) => (
            <div
              key={f.id}
              className={`absolute top-1/3 transform -translate-x-1/2 font-bold font-mono text-lg animate-bounce ${
                f.type === 'crit'
                  ? 'text-yellow-300 text-2xl drop-shadow-md'
                  : f.type === 'player-dmg'
                  ? 'text-emerald-400 text-xl'
                  : f.type === 'shield'
                  ? 'text-cyan-300 text-lg'
                  : 'text-rose-400 text-xl'
              }`}
              style={{ left: `${f.x}%` }}
            >
              {f.text}
            </div>
          ))}
        </div>

        {/* Victory Modal */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-40 p-6 text-center text-white animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-950">
              <Trophy size={36} />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              VICTORY ACHIEVED
            </span>
            <h3 className="text-3xl font-bold mt-1">{boss.name} DEFEATED!</h3>
            <p className="text-sm text-slate-300 mt-2 max-w-md">
              You dealt a total of <strong className="text-emerald-400">{totalDmgDealt}</strong> damage and shattered the monster's core.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => startBattle(currentBossIndex)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                Replay Boss
              </button>
              {currentBossIndex < RPG_BOSSES.length - 1 && (
                <button
                  onClick={handleNextStage}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 cursor-pointer transform hover:scale-105"
                >
                  <ChevronRight size={16} />
                  Next Stage ({RPG_BOSSES[currentBossIndex + 1].name})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Defeat Modal */}
        {gameState === 'defeat' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-40 p-6 text-center text-white animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-3 shadow-lg">
              <ShieldAlert size={36} />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
              FALLEN IN BATTLE
            </span>
            <h3 className="text-3xl font-bold mt-1">DEFEATED BY {boss.name}</h3>
            <p className="text-sm text-slate-300 mt-2">
              Boss remaining health: <span className="text-rose-400 font-mono font-bold">{bossHp} HP</span>
            </p>
            <button
              onClick={() => startBattle(currentBossIndex)}
              className="mt-6 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={15} />
              Revive & Retry (Enter)
            </button>
          </div>
        )}

        {/* Boss Display Box */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">{boss.avatar}</span>
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                  {boss.title}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {boss.name}
                </h3>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-2xl font-extrabold text-rose-400">{bossHp}</span>
              <span className="text-xs text-slate-500 block">/ {boss.maxHp} HP</span>
            </div>
          </div>

          {/* Boss HP Bar */}
          <div className="space-y-1">
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  boss.element === 'fire'
                    ? 'bg-gradient-to-r from-orange-500 to-rose-600'
                    : boss.element === 'ice'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600'
                    : boss.element === 'electric'
                    ? 'bg-gradient-to-r from-amber-300 to-purple-600'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                }`}
                style={{ width: `${Math.max(0, (bossHp / boss.maxHp) * 100)}%` }}
              />
            </div>

            {/* Boss Attack Charge Indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Flame size={12} className="text-orange-400" />
                Boss Attack Charge
              </span>
              <span className="text-orange-300 font-bold">{Math.round(bossChargePercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full transition-all duration-75"
                style={{ width: `${bossChargePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combat Zone & Word Spell Cast Area */}
        <div className="py-6 flex flex-col items-center justify-center space-y-5">
          {gameState === 'idle' ? (
            <div className="text-center space-y-4 max-w-lg mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles size={13} />
                  How to Play (3 Simple Steps)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">1. Type Spell Word</span>
                    <p className="text-[11px] text-slate-400">Type the word on screen. Each word deals attack damage.</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-cyan-400 font-bold block mb-1">2. Cast Shield (1)</span>
                    <p className="text-[11px] text-slate-400">Press 1 to block when the orange Boss Charge bar fills up.</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-yellow-400 font-bold block mb-1">3. Lightning (2)</span>
                    <p className="text-[11px] text-slate-400">Press 2 for 220 massive burst DMG when Mana is charged.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startBattle(currentBossIndex)}
                className="px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all shadow-lg shadow-rose-950 flex items-center gap-2 mx-auto cursor-pointer transform hover:scale-105"
              >
                <Swords size={18} />
                Start Boss Battle (Press Enter)
              </button>
            </div>
          ) : (
            <>
              {/* Active Spell Word Target */}
              <div className="text-center space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  ⚔️ Type This Incantation to Attack:
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-bold tracking-wider py-2.5 px-8 rounded-2xl bg-slate-900/95 border-2 border-slate-700 shadow-2xl inline-block">
                  {currentSpellWord.split('').map((char, i) => {
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
              </div>

              {/* Combat Input Dock */}
              <div className="w-full max-w-md space-y-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedInput}
                  onChange={handleInputChange}
                  placeholder="Type target word above..."
                  className="w-full px-5 py-3 bg-slate-900 border-2 border-emerald-500/80 rounded-2xl font-mono text-center text-xl text-emerald-400 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-500 shadow-inner"
                  autoFocus
                />
                <span className="text-[10px] text-slate-400 text-center block font-mono">
                  Press <strong>1</strong> for Shield (40 MP) • Press <strong>2</strong> for Lightning (60 MP)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Player Stats & Special Abilities Dock */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Player HP & Mana Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <Heart size={14} className="fill-rose-400" />
                Player Health: {playerHp}/100
              </span>
              {hasShield && (
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Shield size={13} />
                  Barrier Active
                </span>
              )}
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>

            {/* Mana Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
              <span className="flex items-center gap-1 font-bold">
                <Zap size={12} className="fill-cyan-400" />
                Mana Surge: {playerMana}/100
              </span>
              <span className="text-slate-500">Fast typing charges mana</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-200"
                style={{ width: `${playerMana}%` }}
              />
            </div>
          </div>

          {/* Spell Power Buttons */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={castShieldSpell}
              disabled={playerMana < 40 || hasShield || gameState !== 'fighting'}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                playerMana >= 40 && !hasShield && gameState === 'fighting'
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30 cursor-pointer transform hover:scale-102'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Shield size={14} />
              Shield (40 MP)
            </button>

            <button
              onClick={castLightningSpell}
              disabled={playerMana < 60 || gameState !== 'fighting'}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                playerMana >= 60 && gameState === 'fighting'
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-md shadow-yellow-400/30 cursor-pointer transform hover:scale-102'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap size={14} fill="currentColor" />
              Lightning Strike (60 MP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
