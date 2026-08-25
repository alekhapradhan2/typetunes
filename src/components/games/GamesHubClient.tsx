'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import NitroRacerGame from '@/components/games/NitroRacerGame';
import SpaceDefenderGame from '@/components/games/SpaceDefenderGame';
import BossBattleRPG from '@/components/custom/BossBattleRPG';
import FallingNotesArcade from '@/components/custom/FallingNotesArcade';
import SuddenDeathMode from '@/components/custom/SuddenDeathMode';
import SpeedBoxingGame from '@/components/games/SpeedBoxingGame';
import CastleSiegeGame from '@/components/games/CastleSiegeGame';
import SubmarineDepthGame from '@/components/games/SubmarineDepthGame';
import WizardDuelGame from '@/components/games/WizardDuelGame';
import SprintRelayGame from '@/components/games/SprintRelayGame';

import MultiplayerLobby from '@/components/multiplayer/MultiplayerLobby';
import LiveMultiplayerTrack from '@/components/multiplayer/LiveMultiplayerTrack';
import { InContentAd } from '@/components/ads/InContentAd';
import { MultiplayerRoom, GameModeId } from '@/lib/multiplayer';

import {
  Gamepad2,
  Users,
  User,
  Sparkles,
  ArrowLeft,
  Maximize2,
  Minimize2,
  HelpCircle,
  Radio,
} from 'lucide-react';
import Link from 'next/link';

interface GameCard {
  id: GameModeId;
  title: string;
  category: string;
  tag: string;
  color: string;
  accentBg: string;
  desc: string;
  icon: string;
  howToPlay: {
    objective: string;
    controls: string;
    special: string;
  };
}

const GAMES_CATALOG: GameCard[] = [
  {
    id: 'racer',
    title: 'Nitro Highway Racer 🏎️',
    category: 'Racing & Driving',
    tag: 'Multiplayer 🏁',
    color: 'from-rose-500 to-orange-500 text-white',
    accentBg: 'bg-rose-50 border-rose-200 text-rose-800',
    desc: 'Race your sports car on a multi-lane highway against friends. Type fast to shift gears and trigger nitrous boosts!',
    icon: '🏎️',
    howToPlay: {
      objective: 'Race against rivals and cross the checkered finish line in 1st place.',
      controls: 'Type the highlighted road word and press Space to accelerate your car.',
      special: 'Maintain high WPM to ignite Nitrous Flame Boosts (NOS) and surge past rivals!',
    },
  },
  {
    id: 'space',
    title: 'Cosmic Galaxy Defender 🚀',
    category: 'Space Action',
    tag: 'Multiplayer 🛸',
    color: 'from-purple-600 to-indigo-600 text-white',
    accentBg: 'bg-purple-50 border-purple-200 text-purple-800',
    desc: 'Shoot down alien UFOs, plasma drones, and cosmic meteor showers by typing rapid target coordinates.',
    icon: '🛸',
    howToPlay: {
      objective: 'Protect your starship and planetary shield from descending alien invaders.',
      controls: 'Type the letters of any enemy on screen — your laser automatically targets and destroys it.',
      special: 'Click Launch EMP Bomb to instantly vaporize all on-screen invaders!',
    },
  },
  {
    id: 'boss',
    title: 'Boss Battle RPG ⚔️',
    category: 'Action RPG',
    tag: 'Multiplayer 🐉',
    color: 'from-red-600 to-amber-600 text-white',
    accentBg: 'bg-red-50 border-red-200 text-red-800',
    desc: 'Engage 4 elemental raid bosses. Type spell incantations, build mana surge, and cast shields & lightning strikes.',
    icon: '🐉',
    howToPlay: {
      objective: 'Shatter elemental raid monsters before their attack charge depletes your HP.',
      controls: 'Type the incantation word in the center to deal damage and generate Mana (MP).',
      special: 'Press 1 for Shield Barrier (40 MP) to block attacks; press 2 for Lightning (60 MP) for 220 burst DMG!',
    },
  },
  {
    id: 'boxing',
    title: 'Speed Boxing Knockout 🥊',
    category: 'Combat Sports',
    tag: 'Multiplayer 🥊',
    color: 'from-amber-600 to-rose-600 text-white',
    accentBg: 'bg-amber-50 border-amber-200 text-amber-800',
    desc: 'Step into the championship ring! Rapid typing unleashes hooks, jabs, and knockout blows.',
    icon: '🥊',
    howToPlay: {
      objective: 'Deplete your opponent’s health bar in the ring with high-velocity punches.',
      controls: 'Type the punch word shown in the center and hit space to land a blow.',
      special: 'Consecutive punches build combination multipliers and devastating knockout power!',
    },
  },
  {
    id: 'wizard',
    title: 'Wizard Spell PvP Duel 🧙',
    category: 'Magic Duel',
    tag: 'Multiplayer ⚡',
    color: 'from-purple-600 to-pink-600 text-white',
    accentBg: 'bg-purple-50 border-purple-200 text-purple-800',
    desc: 'Arcane magical duel! Cast fireballs, ice blasts, and arcane shields against rival wizards in real-time.',
    icon: '🧙‍♂️',
    howToPlay: {
      objective: 'Overwhelm your rival wizard with rapid magical incantations.',
      controls: 'Type the rune incantations swiftly to fire mana bolts.',
      special: 'High typing accuracy charges mystical mana for critical elemental surges!',
    },
  },
  {
    id: 'sprint',
    title: 'Sprint Relay 1v1 ⏱️',
    category: 'Olympic Track',
    tag: 'Multiplayer 🏃',
    color: 'from-orange-500 to-amber-600 text-white',
    accentBg: 'bg-orange-50 border-orange-200 text-orange-800',
    desc: '100% pure burst speed! Sprint across the 100m track against friends to claim the Olympic gold medal.',
    icon: '🏃💨',
    howToPlay: {
      objective: 'Sprint through the passage at maximum velocity to cross the finish line 1st.',
      controls: 'Type the words as fast as humanly possible.',
      special: 'Flawless streaks grant acceleration boosts on the track!',
    },
  },
  {
    id: 'castle',
    title: 'Castle Siege Defense 🏰',
    category: 'Strategy Siege',
    tag: 'Survival 🏰',
    color: 'from-cyan-600 to-blue-600 text-white',
    accentBg: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    desc: 'Defend your castle ramparts from advancing battering rams, catapults, and siege ladders.',
    icon: '🏰',
    howToPlay: {
      objective: 'Stop siege engines before they ram and breach your stone wall.',
      controls: 'Type the siege enemy names to fire ballista bolts.',
      special: 'Clear siege engines in rapid succession to advance waves and rebuild wall health!',
    },
  },
  {
    id: 'submarine',
    title: 'Submarine Depth Rush 🌊',
    category: 'Ocean Exploration',
    tag: 'Survival 🌊',
    color: 'from-blue-600 to-teal-600 text-white',
    accentBg: 'bg-blue-50 border-blue-200 text-blue-800',
    desc: 'Dive into the abyss! Type sonar telemetry to disarm naval mines and reach record ocean depths.',
    icon: '🌊',
    howToPlay: {
      objective: 'Reach the deepest trench without letting naval mines crush your hull.',
      controls: 'Type the sonar target codes before they collide with your submarine.',
      special: 'Every cleared naval hazard accelerates your dive depth meters!',
    },
  },
  {
    id: 'cascade',
    title: 'Falling Notes Arcade 👾',
    category: 'Classic Arcade',
    tag: 'Harmonic 🎹',
    color: 'from-emerald-500 to-teal-600 text-white',
    accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    desc: 'Musical words descend from the sky. Clear them before they touch the ground to trigger harmonious piano chords.',
    icon: '🎹',
    howToPlay: {
      objective: 'Clear falling words before they hit the red baseline barrier.',
      controls: 'Type any falling word in the input box and hit Enter or finish typing.',
      special: 'Consecutive clearances build musical combo multipliers and trigger melodic chords!',
    },
  },
  {
    id: 'sudden-death',
    title: 'Sudden Death Gauntlet ⚡',
    category: 'Precision Stakes',
    tag: 'Elimination 🔥',
    color: 'from-amber-500 to-yellow-600 text-white',
    accentBg: 'bg-amber-50 border-amber-200 text-amber-800',
    desc: 'A single typo ends your run. Lock your backspace key and rack up massive combo multipliers!',
    icon: '🔥',
    howToPlay: {
      objective: 'Type continuously with 100% precision — 1 typo instantly ends the run.',
      controls: 'Type the passage carefully. Backspace is disabled for true sudden death stakes.',
      special: 'Achieve massive high scores by keeping uninterrupted character flow!',
    },
  },
];

export default function GamesHubClient() {
  const [activeGame, setActiveGame] = useState<GameModeId>('racer');
  const [playMode, setPlayMode] = useState<'solo' | 'multiplayer'>('solo');
  const [invitedRoomCode, setInvitedRoomCode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Multiplayer State
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);

  // Toggle browser and CSS fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (stageRef.current?.requestFullscreen) {
          await stageRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Poll multiplayer room status every 450ms when connected
  useEffect(() => {
    if (!room?.code) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/multiplayer/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: room.code, playerId }),
        });
        const data = await res.json();
        if (data.room) {
          setRoom(data.room);
          if (data.room.status === 'playing' && room.status === 'lobby') {
            setCountdown(3);
            let c = 3;
            const cdInterval = setInterval(() => {
              c -= 1;
              if (c <= 0) {
                clearInterval(cdInterval);
                setCountdown(null);
              } else {
                setCountdown(c);
              }
            }, 800);
          }
        } else {
          // Room closed by host or expired
          handleLeaveRoom();
        }
      } catch {}
    }, 450);

    return () => clearInterval(interval);
  }, [room?.code, playerId, room?.status]);

  // Handle URL room param on load (e.g. /games?room=SPEED-31)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setPlayMode('multiplayer');
      setInvitedRoomCode(roomParam.toUpperCase());
    }
  }, []);

  // Create Multiplayer Room
  const handleCreateRoom = async (gameId: GameModeId, playerName: string, avatar: string) => {
    try {
      const res = await fetch('/api/multiplayer/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, playerName, avatar }),
      });
      const data = await res.json();
      if (data.room && data.playerId) {
        setRoom(data.room);
        setPlayerId(data.playerId);
        setActiveGame(gameId);
      }
    } catch {}
  };

  // Join Multiplayer Room
  const handleJoinRoom = async (code: string, playerName: string, avatar: string) => {
    try {
      const res = await fetch('/api/multiplayer/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, playerName, avatar }),
      });
      const data = await res.json();
      if (data.room && data.playerId) {
        setRoom(data.room);
        setPlayerId(data.playerId);
        setActiveGame(data.room.gameId);
      }
    } catch {}
  };

  // Host starts the match
  const handleStartMatch = async () => {
    if (!room?.code || !playerId) return;
    try {
      await fetch('/api/multiplayer/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: room.code, playerId }),
      });
    } catch {}
  };

  // Leave room & clean up fullscreen
  const handleLeaveRoom = () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
    setRoom(null);
    setPlayerId('');
    setCountdown(null);
    setInvitedRoomCode(null);
  };

  // Sync player progress during active match
  const handleSyncProgress = async (progress: number, wpm: number, accuracy: number, isFinished: boolean) => {
    if (!room?.code || !playerId) return;
    try {
      const res = await fetch('/api/multiplayer/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: room.code,
          playerId,
          progress,
          wpm,
          accuracy,
          isFinished,
        }),
      });
      const data = await res.json();
      if (data.room) {
        setRoom(data.room);
      }
    } catch {}
  };

  const currentGameMeta = GAMES_CATALOG.find((g) => g.id === activeGame) || GAMES_CATALOG[0];

  return (
    <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Typing Test
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/custom"
            className="text-xs font-semibold px-3 py-1 rounded-full bg-sage-100 text-sage-800 border border-sage-200/80 hover:bg-sage-200 transition-colors"
          >
            📝 Practice Studio
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200/80 flex items-center gap-1.5 shadow-2xs">
            <Gamepad2 size={13} className="text-purple-600" />
            10-Game Arcade 🎮
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1
          className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Typing Speed <span className="text-purple-600 dark:text-purple-400">Games & Multiplayer</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          10 unique action typing games. Play solo campaigns or create a private room with a code to race live against friends simultaneously!
        </p>
      </div>

      {/* Mode Switcher: Solo vs Multiplayer */}
      <div className="flex items-center justify-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs max-w-sm mx-auto">
        <button
          onClick={() => {
            setPlayMode('solo');
            handleLeaveRoom();
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            playMode === 'solo'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User size={15} />
          Solo Arcade (10 Games)
        </button>

        <button
          onClick={() => setPlayMode('multiplayer')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            playMode === 'multiplayer'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users size={15} />
          Multiplayer Rooms 🌐
        </button>
      </div>

      {/* Multiplayer Lobby / Code Generator when in Multiplayer Mode and not playing */}
      {playMode === 'multiplayer' && (!room || room.status === 'lobby') && (
        <MultiplayerLobby
          room={room}
          playerId={playerId}
          selectedGameId={activeGame}
          onSelectGameId={(g) => setActiveGame(g)}
          onStartMatch={handleStartMatch}
          onLeaveRoom={handleLeaveRoom}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          invitedRoomCode={invitedRoomCode}
        />
      )}

      {/* 10 Games Selector Cards Grid (Only shown in Solo Arcade mode to avoid duplicate selection) */}
      {playMode === 'solo' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select From 10 Action Games:
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{GAMES_CATALOG.length} Games Available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {GAMES_CATALOG.map((g) => {
              const isSelected = activeGame === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveGame(g.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-purple-500 ring-2 ring-purple-400/40 shadow-sm scale-102'
                      : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-2xl">{g.icon}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${g.accentBg}`}>
                        {g.tag}
                      </span>
                    </div>
                    <h2 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">{g.title}</h2>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{g.category}</p>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[10px] font-semibold flex items-center justify-between">
                    <span className={isSelected ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400 dark:text-slate-500'}>
                      {isSelected ? '▶ Active' : 'Select'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Visual "How to Play" Guide Bar for Current Game */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <HelpCircle size={16} className="text-purple-600 dark:text-purple-400" />
            How to Play: <span className="text-purple-600 dark:text-purple-400">{currentGameMeta.title}</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            Quick Guide
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              1. Objective 🎯
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentGameMeta.howToPlay.objective}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              2. Controls ⌨️
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentGameMeta.howToPlay.controls}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/40 space-y-1">
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
              3. Special Power ⚡
            </span>
            <p className="text-xs text-purple-900 dark:text-purple-200 leading-relaxed font-medium">
              {currentGameMeta.howToPlay.special}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Page In-Content Banner Ad */}
      {!isFullscreen && <InContentAd className="my-3" />}

      {/* Live Multiplayer Track HUD (when playing in multiplayer) */}
      {playMode === 'multiplayer' && room && (room.status === 'playing' || room.status === 'finished') && (
        <LiveMultiplayerTrack
          players={room.players}
          currentPlayerId={playerId}
          gameTitle={room.gameTitle}
        />
      )}

      {/* Game Stage Wrapper (Supports Fullscreen Mode) */}
      <div
        ref={stageRef}
        className={`transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-0 z-[99999] bg-slate-950 p-4 sm:p-8 flex flex-col justify-center overflow-y-auto max-w-none'
            : 'relative space-y-3'
        }`}
      >
        {/* Fullscreen Bar & Game Switcher Toolbar */}
        <div className="flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentGameMeta.icon}</span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white">{currentGameMeta.title}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2 hidden sm:inline">{currentGameMeta.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {room && (
              <button
                onClick={handleLeaveRoom}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200 transition-all cursor-pointer"
                title="Leave match and return to lobby"
              >
                <span>Leave Room</span>
              </button>
            )}

            {/* Full Screen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                isFullscreen
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
              title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Play Game in Full Screen'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 size={14} />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 size={14} />
                  <span>Full Screen ⛶</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Synchronized Match Countdown Overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center text-white animate-fade-in">
            <span className="text-8xl sm:text-9xl font-black font-mono text-amber-400 animate-bounce">
              {countdown}
            </span>
            <span className="text-lg font-mono text-purple-300 uppercase tracking-widest mt-4">
              Synchronizing All Players...
            </span>
          </div>
        )}

        {/* Active Game Stage View */}
        <div className="animate-fade-in">
          {activeGame === 'racer' && (
            <NitroRacerGame
              multiplayerRoom={room}
              currentPlayerId={playerId}
              onSyncProgress={handleSyncProgress}
              onExitGame={handleLeaveRoom}
              autoStart={room?.status === 'playing'}
            />
          )}
          {activeGame === 'space' && <SpaceDefenderGame />}
          {activeGame === 'boss' && <BossBattleRPG />}
          {activeGame === 'boxing' && (
            <SpeedBoxingGame
              onSyncProgress={handleSyncProgress}
              externalText={room?.text}
              autoStart={room?.status === 'playing'}
            />
          )}
          {activeGame === 'wizard' && (
            <WizardDuelGame
              onSyncProgress={handleSyncProgress}
              externalText={room?.text}
              autoStart={room?.status === 'playing'}
            />
          )}
          {activeGame === 'sprint' && (
            <SprintRelayGame
              onSyncProgress={handleSyncProgress}
              externalText={room?.text}
              autoStart={room?.status === 'playing'}
            />
          )}
          {activeGame === 'castle' && <CastleSiegeGame />}
          {activeGame === 'submarine' && <SubmarineDepthGame />}
          {activeGame === 'cascade' && <FallingNotesArcade />}
          {activeGame === 'sudden-death' && <SuddenDeathMode />}
        </div>
      </div>
    </div>
  );
}
