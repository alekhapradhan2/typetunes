'use client';

import { MultiplayerPlayer } from '@/lib/multiplayer';
import { Trophy, Crown, Zap, Flame } from 'lucide-react';

interface LiveMultiplayerTrackProps {
  players: MultiplayerPlayer[];
  currentPlayerId: string;
  gameTitle?: string;
}

export default function LiveMultiplayerTrack({
  players,
  currentPlayerId,
  gameTitle,
}: LiveMultiplayerTrackProps) {
  // Sort players by progress (descending)
  const sortedPlayers = [...players].sort((a, b) => b.progress - a.progress);

  return (
    <div className="bg-slate-900/95 border-2 border-purple-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="font-bold text-sm text-purple-300 uppercase tracking-wider">
            Live Synchronized Match Arena
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-xl">
          {players.length} Players Connected
        </span>
      </div>

      {/* Players Progress Lanes */}
      <div className="space-y-2.5">
        {sortedPlayers.map((p, idx) => {
          const isMe = p.id === currentPlayerId;
          return (
            <div
              key={p.id}
              className={`p-3 rounded-2xl border transition-all ${
                isMe
                  ? 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-400/30'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-5">#{idx + 1}</span>
                  <span className="text-lg">{p.avatar}</span>
                  <span className={`font-bold ${isMe ? 'text-purple-300' : 'text-slate-200'}`}>
                    {p.name} {isMe && '(YOU)'}
                  </span>
                  {p.isHost && (
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                      HOST
                    </span>
                  )}
                  {p.rank === 1 && (
                    <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                      <Crown size={10} /> 1ST
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">{p.wpm} WPM</span>
                  <span className="text-slate-400 min-w-[36px] text-right">{Math.round(p.progress)}%</span>
                </div>
              </div>

              {/* Live Track Bar */}
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 relative">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isMe
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${Math.max(3, p.progress)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
