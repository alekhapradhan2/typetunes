'use client';

import { useState, useEffect } from 'react';
import { MultiplayerRoom, MultiplayerPlayer, GameModeId } from '@/lib/multiplayer';
import {
  Users,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Radio,
  Gamepad2,
} from 'lucide-react';

interface MultiplayerLobbyProps {
  room: MultiplayerRoom | null;
  playerId: string;
  onStartMatch: () => void;
  onLeaveRoom: () => void;
  onCreateRoom: (gameId: GameModeId, playerName: string, avatar: string) => void;
  onJoinRoom: (code: string, playerName: string, avatar: string) => void;
  selectedGameId: GameModeId;
  onSelectGameId?: (gameId: GameModeId) => void;
  invitedRoomCode?: string | null;
}

const AVATAR_OPTIONS = ['🏎️', '🚀', '🧙‍♂️', '🐉', '🥊', '🏰', '🚢', '🏃💨', '⚡', '🤖'];

const GAME_OPTIONS: { id: GameModeId; title: string; icon: string }[] = [
  { id: 'racer', title: 'Nitro Highway Racer', icon: '🏎️' },
  { id: 'space', title: 'Cosmic Galaxy Defender', icon: '🚀' },
  { id: 'boss', title: 'Boss Battle RPG', icon: '🐉' },
  { id: 'boxing', title: 'Speed Boxing Knockout', icon: '🥊' },
  { id: 'wizard', title: 'Wizard Spell PvP Duel', icon: '🧙' },
  { id: 'sprint', title: 'Sprint Relay 1v1', icon: '⏱️' },
  { id: 'castle', title: 'Castle Siege Defense', icon: '🏰' },
  { id: 'submarine', title: 'Submarine Depth Rush', icon: '🌊' },
  { id: 'cascade', title: 'Falling Notes Arcade', icon: '🎹' },
  { id: 'sudden-death', title: 'Sudden Death Gauntlet', icon: '⚡' },
];

export default function MultiplayerLobby({
  room,
  playerId,
  onStartMatch,
  onLeaveRoom,
  onCreateRoom,
  onJoinRoom,
  selectedGameId,
  onSelectGameId,
  invitedRoomCode,
}: MultiplayerLobbyProps) {
  const [playerName, setPlayerName] = useState<string>('Speed Typist');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🏎️');
  const [inputCode, setInputCode] = useState<string>(invitedRoomCode || '');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>(invitedRoomCode ? 'join' : 'create');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<GameModeId>(selectedGameId || 'racer');

  useEffect(() => {
    if (invitedRoomCode) {
      setInputCode(invitedRoomCode);
      setActiveTab('join');
    }
  }, [invitedRoomCode]);

  const isHost = room?.players.find((p) => p.id === playerId)?.isHost ?? false;

  const handleCopyCode = () => {
    if (!room?.code) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    if (!room?.code) return;
    const url = `${window.location.origin}/games?room=${room.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If already in an active room lobby
  if (room) {
    return (
      <div className="bg-slate-900/95 border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-scale-in">
        {/* Lobby Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold flex items-center gap-1.5 mb-1">
              <Radio size={14} className="animate-pulse text-emerald-400" />
              Live Match Lobby
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{room.gameTitle}</span>
            </h2>
          </div>

          {/* Room Code Share Box */}
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-purple-500/40">
            <div className="px-3">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Room Code:</span>
              <span className="text-xl font-mono font-black text-amber-400 tracking-wider">
                {room.code}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-xs flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Copy Room Code"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Connected Players in Room */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users size={14} className="text-purple-400" />
              Connected Typists ({room.players.length}/8)
            </h3>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Lobby Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {room.players.map((p) => {
              const isMe = p.id === playerId;
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    isMe
                      ? 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-400/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <span className={`text-xs font-bold ${isMe ? 'text-purple-300' : 'text-white'}`}>
                        {p.name} {isMe && '(YOU)'}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {p.isHost ? '👑 Room Host' : 'Ready to Race'}
                      </span>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Lobby Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={onLeaveRoom}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Leave Room
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-none justify-center"
            >
              <Globe size={14} />
              Copy Direct Invite Link
            </button>

            {isHost ? (
              <button
                onClick={onStartMatch}
                className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transform hover:scale-105 flex-1 sm:flex-none justify-center"
              >
                <Play size={18} fill="currentColor" />
                START MATCH (ALL PLAYERS) 🚀
              </button>
            ) : (
              <div className="px-6 py-3 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold animate-pulse text-center">
                ⏳ Waiting for Host to Launch Match...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pre-join / Create Room Screen
  return (
    <div className="bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-scale-in">
      {/* Header */}
      <div className="text-center space-y-1.5 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 mx-auto mb-1">
          <Users size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {invitedRoomCode ? `Join Room [${invitedRoomCode}]` : 'Multiplayer Matchmaking'}
        </h2>
        <p className="text-xs text-slate-400">
          {invitedRoomCode
            ? 'You were invited! Enter your name below to enter the match lobby.'
            : 'Create a private room to generate a code, or join friends with a 6-character code!'}
        </p>
      </div>

      {/* Tabs (Hidden if joining via invite link) */}
      {!invitedRoomCode && (
        <div className="flex items-center justify-center gap-2 bg-slate-950 p-1.5 rounded-2xl max-w-xs mx-auto border border-slate-800">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'join' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Join with Code
          </button>
        </div>
      )}

      {/* Form Fields Container */}
      <div className="max-w-md mx-auto space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
        {/* Game Mode Selection (In Create Room tab only) */}
        {activeTab === 'create' && (
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-400 block">Select Game Mode</label>
            <select
              value={selectedGame}
              onChange={(e) => {
                const g = e.target.value as GameModeId;
                setSelectedGame(g);
                if (onSelectGameId) onSelectGameId(g);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-semibold focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              {GAME_OPTIONS.map((g) => (
                <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                  {g.icon} {g.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Player Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-400 block">Your Typist Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={18}
            placeholder="Enter your name..."
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-semibold focus:outline-none focus:border-purple-400"
            autoFocus
          />
        </div>

        {/* Avatar Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-400 block">Choose Avatar</label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {AVATAR_OPTIONS.map((av) => (
              <button
                key={av}
                onClick={() => setSelectedAvatar(av)}
                className={`p-2 rounded-xl text-xl transition-all cursor-pointer ${
                  selectedAvatar === av
                    ? 'bg-purple-600 ring-2 ring-purple-300 scale-110'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Join Tab Code Input */}
        {activeTab === 'join' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800 animate-fade-in">
            <label className="text-xs font-mono font-bold text-amber-400 block">6-Character Room Code</label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. RACE-88"
              maxLength={10}
              className="w-full px-4 py-3 bg-slate-900 border-2 border-amber-500/80 rounded-xl text-center font-mono text-lg font-bold text-amber-400 tracking-wider focus:outline-none"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {activeTab === 'create' ? (
            <button
              onClick={() => onCreateRoom(selectedGame, playerName, selectedAvatar)}
              className="w-full py-3.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102"
            >
              <Sparkles size={16} />
              Create Match Room & Get Code
            </button>
          ) : (
            <button
              onClick={() => onJoinRoom(inputCode, playerName, selectedAvatar)}
              disabled={!inputCode.trim()}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight size={16} />
              Enter Match Lobby 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
