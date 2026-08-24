'use client';

import { useState } from 'react';
import { Shield, ShieldAlert, Users, School, Flag, CheckCircle2, XCircle, FileText, Settings } from 'lucide-react';

interface ModerationItem {
  id: string;
  type: 'article' | 'comment' | 'headline' | 'image';
  author: string;
  school: string;
  content: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const INITIAL_MODERATION_ITEMS: ModerationItem[] = [
  {
    id: 'mod_1',
    type: 'headline',
    author: 'Sam K.',
    school: 'Oakridge High',
    content: 'PRINCIPAL CANCELS SUMMER VACATION FOREVER',
    reason: 'Flagged as potential viral disinformation / clickbait penalty.',
    status: 'pending',
    submittedAt: '10 mins ago',
  },
  {
    id: 'mod_2',
    type: 'article',
    author: 'Liam R.',
    school: 'West Valley Academy',
    content: 'Student council elections were rigged by faculty members without proof...',
    reason: 'Flagged for unsubstantiated defamatory claims without source attribution.',
    status: 'pending',
    submittedAt: '35 mins ago',
  },
];

export default function AdminSafetyDashboard() {
  const [items, setItems] = useState<ModerationItem[]>(INITIAL_MODERATION_ITEMS);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: action } : it))
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="card p-6 bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Shield size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Platform Super Admin & Safety Moderation Desk
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                COPPA / FERPA SAFE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervise multi-school newsrooms, automated content filters, student privacy, and challenge scenarios.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Filter Engine: Active</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled Schools</span>
          <div className="text-2xl font-bold text-slate-800">148 Schools</div>
          <span className="text-[10px] text-emerald-600 font-bold">12,400+ Active Students</span>
        </div>

        <div className="card p-5 border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published Editions</span>
          <div className="text-2xl font-bold text-purple-600">3,820 Papers</div>
          <span className="text-[10px] text-slate-500">100% FERPA Compliant</span>
        </div>

        <div className="card p-5 border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Mod Queue</span>
          <div className="text-2xl font-bold text-rose-600">
            {items.filter((i) => i.status === 'pending').length} Items
          </div>
          <span className="text-[10px] text-slate-500">Requires Staff Review</span>
        </div>

        <div className="card p-5 border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Safety Health Rating</span>
          <div className="text-2xl font-bold text-emerald-600">99.8%</div>
          <span className="text-[10px] text-slate-500">Zero Privacy Breaches</span>
        </div>
      </div>

      {/* Moderation Queue Table */}
      <div className="card p-6 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-600" />
            Live Moderation Queue & Flagged Submissions
          </h3>
          <span className="text-xs text-slate-400">Automated Natural Language Classifier</span>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const isPending = item.status === 'pending';

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {item.author} ({item.school})
                    </span>
                    <span className="text-[11px] text-slate-400">· {item.submittedAt}</span>
                  </div>

                  <p className="text-xs font-serif text-slate-900 font-bold">"{item.content}"</p>
                  <p className="text-[11px] text-rose-700">Flag reason: {item.reason}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPending ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      >
                        <CheckCircle2 size={13} />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(item.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      >
                        <XCircle size={13} />
                        <span>Reject & Warn</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.status === 'approved' ? 'Approved by Admin' : 'Rejected & Scrubbed'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
