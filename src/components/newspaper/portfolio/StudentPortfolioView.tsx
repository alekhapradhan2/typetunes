'use client';

import { useState } from 'react';
import { getStoredProfile, getStoredNewspapers } from '@/lib/newspaper/storage';
import { ALL_BADGES } from '@/lib/newspaper/challengesData';
import {
  Award,
  BookOpen,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Flame,
  FileText,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

export default function StudentPortfolioView() {
  const profile = getStoredProfile();
  const newspapers = getStoredNewspapers();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ─── OFFICIAL PRESS PASS ID CARD ──────────────────────────────────── */}
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#1a2333] to-slate-900 border-2 border-slate-700 text-white shadow-2xl rounded-3xl relative overflow-hidden">
        {/* Background lanyard hole & holographic seal */}
        <div className="absolute top-4 right-8 flex items-center gap-2">
          <div className="w-8 h-3 rounded-full bg-slate-800 border border-slate-700 shadow-inner" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">
            PRESS
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-800 border-2 border-sage-400/80 flex items-center justify-center text-5xl shadow-xl">
              {profile.avatar}
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-sage-500 text-white text-[10px] font-bold shadow-md">
              LVL {profile.level}
            </span>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sage-400">
                Official Student Press Credential
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                ACTIVE STAFFER
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {profile.name}
            </h2>

            <p className="text-xs text-slate-400">
              {profile.rank} · {profile.school} ({profile.grade}) · {profile.location}
            </p>

            <p className="text-xs text-slate-300 max-w-xl italic font-serif pt-1">
              "{profile.bio}"
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 w-full md:w-auto shrink-0 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-center">
            <div>
              <div className="text-lg font-bold font-mono text-amber-400">{profile.xp}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Total XP</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-sage-400">{profile.newspapersPublished}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Published</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-sky-400">{profile.factsChecked}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Fact-Checks</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-purple-400">{profile.streakDays}d</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">Press Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BADGES SHOWCASE ───────────────────────────────────────────────── */}
      <div className="card p-6 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              Journalism Badges & Honors ({profile.badges.length}/{ALL_BADGES.length})
            </h3>
            <p className="text-xs text-slate-500">
              Unlocked through investigative reporting, fact audits, headline speed, and ethical leadership.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = profile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-40 grayscale'
                }`}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="font-bold text-xs text-slate-800">{badge.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-tight">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── PUBLISHED NEWSPAPERS PORTFOLIO ─────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={18} className="text-sage-600" />
            Published Broadsheets & Editions ({newspapers.length})
          </h3>

          <button
            type="button"
            onClick={handleShare}
            className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Share2 size={13} />
            <span>{copied ? 'Link Copied!' : 'Share Portfolio'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newspapers.map((paper) => (
            <div
              key={paper.id}
              className="card p-6 border border-slate-200 bg-white hover:shadow-xl transition-all space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {paper.editionNumber} · {paper.dateString}
                  </span>
                  <h4 className="text-xl font-bold font-broadsheet text-slate-900 mt-0.5">
                    {paper.title}
                  </h4>
                </div>
                {paper.score && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800">
                    Rating: {paper.score}%
                  </span>
                )}
              </div>

              {/* Front Page Excerpt */}
              {paper.pages[0]?.sections[0] && (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-300 font-newsreader text-xs space-y-1.5">
                  <div className="font-bold text-sm uppercase text-stone-900">
                    {paper.pages[0].sections[0].title}
                  </div>
                  <p className="text-stone-700 leading-relaxed line-clamp-3">
                    {paper.pages[0].sections[0].content}
                  </p>
                </div>
              )}

              {/* Teacher Feedback Note if available */}
              {paper.teacherFeedback && (
                <div className="text-xs p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-serif">
                  <strong>{paper.teacherFeedback.teacherName}: </strong>
                  "{paper.teacherFeedback.comments}"
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {paper.pages.length} Page Broadsheet
                </span>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download / Print PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
