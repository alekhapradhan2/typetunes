'use client';

import { useState, useEffect, useRef } from 'react';
import { MINI_GAMES_CATALOG } from '@/lib/newspaper/challengesData';
import { MiniGameId } from '@/lib/newspaper/types';
import { awardXPAndBadge } from '@/lib/newspaper/storage';
import {
  Zap,
  Timer,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Flame,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function NewspaperGamesHub() {
  const [selectedGame, setSelectedGame] = useState<MiniGameId | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [xpWon, setXpWon] = useState<number>(0);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ─── GAME 1: HEADLINE RUSH STATE ──────────────────────────────────────────
  const [headlineInput, setHeadlineInput] = useState('');
  const [headlineStory] = useState({
    brief: 'Scientists at the state observatory detected an unusual asteroid passing within lunar orbit today. No danger to Earth, but telescopes gathered rare mineral spectral data.',
  });

  // ─── GAME 2: SPOT THE FAKE STATE ──────────────────────────────────────────
  const [fakeGameItems] = useState([
    { id: 'f1', text: 'State Department of Transportation approves $4M bridge overhaul after structural stress test.', isFake: false, reason: 'Official government public record.' },
    { id: 'f2', text: 'Eating two raw lemons before a math exam increases IQ by 35 points, study claims.', isFake: true, reason: 'Pseudoscience health claim with no peer-reviewed basis.' },
    { id: 'f3', text: 'Local library introduces 3D printing lab accessible free for all student cardholders.', isFake: false, reason: 'Verified community initiative.' },
    { id: 'f4', text: 'NASA confirms moon will permanently turn pink starting next Tuesday.', isFake: true, reason: 'Viral optical illusion disinformation.' },
  ]);
  const [selectedFakeIds, setSelectedFakeIds] = useState<string[]>([]);

  // ─── GAME 4: FACT OR OPINION STATE ────────────────────────────────────────
  const [factOpinionIndex, setFactOpinionIndex] = useState(0);
  const factOpinionStatements = [
    { text: 'The municipal water tower was constructed in 1954.', isFact: true },
    { text: 'The school orchestra gave the most moving concert in city history.', isFact: false },
    { text: 'High school graduation rates in the district rose 3.2% this year.', isFact: true },
    { text: 'Electric scooters are the most dangerous form of student transport.', isFact: false },
    { text: 'Water freezes at zero degrees Celsius at standard atmospheric pressure.', isFact: true },
    { text: 'Winter is unquestionably the best season of the year for studying.', isFact: false },
  ];

  // ─── GAME 5: SOURCE HUNTER STATE ──────────────────────────────────────────
  const [sourceHunterIndex, setSourceHunterIndex] = useState(0);
  const sourceHunterScenarios = [
    {
      event: 'A minor 3.8 magnitude earthquake shakes city buildings at 4:15 AM.',
      options: [
        { text: 'Senior Seismologist, US Geological Survey', isBest: true },
        { text: 'Anonymous TikTok user claiming alien activity', isBest: false },
        { text: 'Local shoe store manager', isBest: false },
      ],
    },
    {
      event: 'District School Board proposes 15-minute earlier bell schedule.',
      options: [
        { text: 'School Board President & Transportation Director', isBest: true },
        { text: 'A random student from a different state', isBest: false },
        { text: 'A celebrity influencer on YouTube', isBest: false },
      ],
    },
  ];

  // Start / Reset Game
  const startGame = (gameId: MiniGameId) => {
    setSelectedGame(gameId);
    setGameState('playing');
    setScore(0);
    setSelectedFakeIds([]);
    setHeadlineInput('');
    setFactOpinionIndex(0);
    setSourceHunterIndex(0);

    const meta = MINI_GAMES_CATALOG.find((g) => g.id === gameId);
    const duration = meta ? meta.durationSeconds : 45;
    setTimeLeft(duration);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('gameover');
    const xp = Math.max(50, score * 15 + 50);
    setXpWon(xp);
    awardXPAndBadge(xp, 'headline_master');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="chip inline-flex">
          <Flame size={12} className="mr-1 text-amber-500" />
          Fast-Paced Journalism Arcade
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
          7 Newsroom Mini-Games
        </h2>
        <p className="text-sm text-slate-500">
          Train your reflex speed, headline writing, fake-news detection, and visual layout instincts under ticking deadlines.
        </p>
      </div>

      {/* ─── GAMES SELECTION GRID ──────────────────────────────────────────── */}
      {gameState === 'idle' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
          {MINI_GAMES_CATALOG.map((game) => (
            <div
              key={game.id}
              className="card p-5 border border-slate-200 hover:border-sage-400 hover:shadow-xl transition-all flex flex-col justify-between group bg-white"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Timer size={11} /> {game.durationSeconds}s
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-800 group-hover:text-sage-700 transition-colors mb-1">
                  {game.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{game.description}</p>
                <div className="text-[10px] text-sage-700 font-bold uppercase tracking-wider bg-sage-50 px-2 py-1 rounded-md inline-block">
                  🎯 {game.skillFocus}
                </div>
              </div>

              <button
                type="button"
                onClick={() => startGame(game.id)}
                className="btn-primary w-full py-2 px-3 text-xs font-bold justify-center mt-4 cursor-pointer shadow-xs"
              >
                <Play size={13} fill="currentColor" />
                <span>Play Game</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ─── ACTIVE GAME ARENA ─────────────────────────────────────────────── */}
      {gameState === 'playing' && selectedGame && (
        <div className="card p-6 sm:p-8 border border-slate-200 shadow-2xl bg-white space-y-6 max-w-3xl mx-auto animate-scale-in">
          {/* Top Timer & Score Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {MINI_GAMES_CATALOG.find((g) => g.id === selectedGame)?.icon}
              </span>
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {MINI_GAMES_CATALOG.find((g) => g.id === selectedGame)?.name}
                </h3>
                <span className="text-xs text-slate-400">Score: {score} Points</span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl font-mono font-bold text-sm ${
                timeLeft <= 10 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-800'
              }`}
            >
              <Timer size={16} />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* GAME 1: HEADLINE RUSH */}
          {selectedGame === 'headline_rush' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-serif leading-relaxed text-amber-950">
                <strong>News Wire Summary: </strong>
                {headlineStory.brief}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Draft Your Punchy Front-Page Headline:
                </label>
                <input
                  type="text"
                  value={headlineInput}
                  onChange={(e) => setHeadlineInput(e.target.value)}
                  placeholder="e.g., Near-Earth Asteroid Yields Rare Mineral Data..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 font-serif font-bold text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const words = headlineInput.trim().split(/\s+/).filter(Boolean).length;
                  if (words >= 4 && words <= 12) {
                    setScore((s) => s + 50);
                    endGame();
                  } else {
                    setScore((s) => s + 20);
                    endGame();
                  }
                }}
                className="btn-primary w-full py-2.5 text-xs font-bold justify-center"
              >
                Submit Headline for Scoring
              </button>
            </div>
          )}

          {/* GAME 2: SPOT THE FAKE */}
          {selectedGame === 'spot_the_fake' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Tap on the 2 fabricated / disinformation stories below:
              </p>
              <div className="space-y-2">
                {fakeGameItems.map((item) => {
                  const isSelected = selectedFakeIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedFakeIds((p) => p.filter((x) => x !== item.id));
                        } else {
                          setSelectedFakeIds((p) => [...p, item.id]);
                          if (item.isFake) setScore((s) => s + 40);
                        }
                      }}
                      className={`w-full p-3.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 text-rose-900 border-rose-300 font-semibold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.text}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={endGame}
                className="btn-primary w-full py-2.5 text-xs font-bold justify-center mt-2"
              >
                Lock In Selections
              </button>
            </div>
          )}

          {/* GAME 4: FACT OR OPINION */}
          {selectedGame === 'fact_or_opinion' && (
            <div className="space-y-6 text-center">
              <div className="p-6 rounded-2xl bg-slate-900 text-white font-serif text-base font-bold min-h-[100px] flex items-center justify-center">
                "{factOpinionStatements[factOpinionIndex]?.text}"
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (factOpinionStatements[factOpinionIndex]?.isFact) {
                      setScore((s) => s + 25);
                    }
                    if (factOpinionIndex + 1 < factOpinionStatements.length) {
                      setFactOpinionIndex((i) => i + 1);
                    } else {
                      endGame();
                    }
                  }}
                  className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md cursor-pointer transition-all"
                >
                  VERIFIABLE FACT
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!factOpinionStatements[factOpinionIndex]?.isFact) {
                      setScore((s) => s + 25);
                    }
                    if (factOpinionIndex + 1 < factOpinionStatements.length) {
                      setFactOpinionIndex((i) => i + 1);
                    } else {
                      endGame();
                    }
                  }}
                  className="p-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm shadow-md cursor-pointer transition-all"
                >
                  SUBJECTIVE OPINION
                </button>
              </div>
            </div>
          )}

          {/* GAME 5: SOURCE HUNTER */}
          {selectedGame === 'source_hunter' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs font-serif text-sky-950">
                <strong>Event Lead: </strong>
                {sourceHunterScenarios[sourceHunterIndex]?.event}
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select the most credible primary source to interview:
              </p>

              <div className="space-y-2">
                {sourceHunterScenarios[sourceHunterIndex]?.options.map((opt, oi) => (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => {
                      if (opt.isBest) setScore((s) => s + 50);
                      if (sourceHunterIndex + 1 < sourceHunterScenarios.length) {
                        setSourceHunterIndex((i) => i + 1);
                      } else {
                        endGame();
                      }
                    }}
                    className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-sage-50 text-slate-800 text-xs font-bold text-left border border-slate-200 hover:border-sage-300 transition-all cursor-pointer"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* OTHER GAMES FALLBACK ACTION */}
          {!['headline_rush', 'spot_the_fake', 'fact_or_opinion', 'source_hunter'].includes(selectedGame) && (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-slate-600 font-medium">
                Arrange and resolve incoming newsroom items before the deadline expires!
              </p>
              <button
                type="button"
                onClick={() => {
                  setScore((s) => s + 60);
                  endGame();
                }}
                className="btn-primary py-2.5 px-6 text-xs font-bold"
              >
                Complete Round Fast
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── GAME OVER SCOREBOARD ─────────────────────────────────────────── */}
      {gameState === 'gameover' && (
        <div className="card p-8 sm:p-12 border border-slate-200 shadow-2xl bg-white text-center space-y-6 max-w-lg mx-auto animate-scale-in">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <Award size={32} />
          </div>

          <div>
            <span className="chip mb-2 inline-flex">
              <Sparkles size={12} className="mr-1 text-amber-500" />
              Round Complete
            </span>
            <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Awesome Reporting!
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-2xl font-bold text-slate-800">{score} pts</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Score Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-600">+{xpWon} XP</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Journalism Level</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => startGame(selectedGame || 'headline_rush')}
              className="btn-primary text-xs py-2.5 px-5 font-bold"
            >
              <RotateCcw size={13} />
              <span>Play Again</span>
            </button>
            <button
              type="button"
              onClick={() => setGameState('idle')}
              className="btn-ghost text-xs py-2.5 px-5 font-bold"
            >
              All Mini-Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
