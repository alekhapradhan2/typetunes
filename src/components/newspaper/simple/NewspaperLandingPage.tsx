'use client';

import React from 'react';
import { TEMPLATE_METAS } from '@/lib/newspaper/templatePresets';
import { TemplateId } from '@/lib/newspaper/simpleTypes';
import {
  Newspaper,
  Sparkles,
  ArrowRight,
  Layout,
  MousePointer,
  Download,
  PlusCircle,
  FileText,
  BookOpen,
} from 'lucide-react';

interface NewspaperLandingPageProps {
  onStartCreating: () => void;
  onSelectTemplate: (templateId: TemplateId) => void;
  onGoToDashboard: () => void;
}

export default function NewspaperLandingPage({
  onStartCreating,
  onSelectTemplate,
  onGoToDashboard,
}: NewspaperLandingPageProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-1 sm:py-3">
      {/* ─── COMPACT HERO SECTION (STREAMLINED & TIGHT HEIGHT) ─────────────── */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-3.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/80 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
          <Sparkles size={12} className="text-amber-600" />
          <span>Drag & Drop Newspaper Studio</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Create Your Own{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #d97706, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Newspaper
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Design, compose, and download authentic vintage front pages, school gazettes, and tabloids with zero design experience required.
        </p>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onStartCreating}
            className="btn-primary py-2.5 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl"
          >
            <PlusCircle size={15} />
            <span>Start Blank Canvas</span>
          </button>

          <button
            type="button"
            onClick={onGoToDashboard}
            className="btn-ghost py-2.5 px-5 text-sm font-bold flex items-center justify-center gap-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 border-slate-300 shadow-2xs transition-all cursor-pointer"
          >
            <Newspaper size={15} />
            <span>My Newspapers</span>
          </button>
        </div>

        {/* 3-Step Quick Process Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/80">
            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">1</span>
            Pick a Layout
          </span>
          <span className="text-slate-300 hidden sm:inline">→</span>
          <span className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/80">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">2</span>
            Drag & Write Articles
          </span>
          <span className="text-slate-300 hidden sm:inline">→</span>
          <span className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/80">
            <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 text-[10px] flex items-center justify-center font-bold">3</span>
            Download PDF & Print
          </span>
        </div>
      </section>

      {/* ─── TEMPLATES SHOWCASE GALLERY (ABOVE-THE-FOLD QUICK ACCESS) ───────── */}
      <section className="space-y-4 px-2 sm:px-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Choose a Broadsheet Template to Start
            </h2>
            <p className="text-xs text-slate-500">
              Click any layout to immediately launch the drag-and-drop editor.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartCreating}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Custom Blank →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATE_METAS.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className="card p-4 sm:p-5 bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between rounded-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                    {tmpl.previewImage}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                    {tmpl.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors mb-0.5">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{tmpl.description}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform">
                <span>Start Editing</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

