'use client';

import { useState } from 'react';
import { COMPETITIONS_DATA } from '@/lib/newspaper/challengesData';
import { Trophy, Award, Users, Flame, Sparkles, Globe, School, ArrowRight } from 'lucide-react';

export default function CompetitionsHub() {
  const [selectedComp, setSelectedComp] = useState(COMPETITIONS_DATA[0]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-2 border-purple-800/40 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy size={13} className="text-amber-400" />
              Championship Circuit
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Interscholastic Press Competitions
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Compete against student newsrooms across the globe or challenge neighboring schools in breaking news coverage and design sprints.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
            <div className="text-xs uppercase tracking-wider text-purple-200">Current Grand Prize</div>
            <div className="text-xl font-bold text-amber-400">Gold Plaque & +1,500 XP</div>
          </div>
        </div>
      </div>

      {/* Competitions Grid & Selected Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Competitions List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Globe size={16} className="text-purple-600" />
            Active Tournaments ({COMPETITIONS_DATA.length})
          </h3>

          <div className="space-y-3">
            {COMPETITIONS_DATA.map((comp) => {
              const isSelected = comp.id === selectedComp.id;

              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setSelectedComp(comp)}
                  className={`w-full p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 text-purple-950 border-purple-400 shadow-md ring-2 ring-purple-200'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {comp.scope} cup
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {comp.participantsCount} Schools
                    </span>
                  </div>
                  <h4 className="font-bold text-base mb-1">{comp.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{comp.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Live Leaderboard (7 Cols) */}
        <div className="lg:col-span-7 card p-6 border border-slate-200 bg-white shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Official Standings
              </span>
              <h3 className="text-lg font-bold text-slate-900">{selectedComp.title}</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Ends {selectedComp.endDate}
            </span>
          </div>

          <div className="space-y-2.5">
            {selectedComp.leaderboard.map((team) => (
              <div
                key={team.rank}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  team.rank === 1
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      team.rank === 1
                        ? 'bg-amber-500 text-slate-950'
                        : team.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : team.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    #{team.rank}
                  </span>
                  <span className="text-2xl">{team.avatar}</span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{team.name}</div>
                    <div className="text-xs text-slate-500">{team.school}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold font-mono text-purple-700">{team.score} pts</div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Quality Rating</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
