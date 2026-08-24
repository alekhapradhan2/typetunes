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
  CheckCircle2,
  FileText,
  Play,
  Layers,
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
    <div className="w-full space-y-16 py-4 sm:py-8">
      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider shadow-2xs animate-fade-in">
          <Sparkles size={13} className="text-amber-600" />
          <span>Simple Canva-Style Drag & Drop Editor</span>
        </div>

        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.12] animate-slide-up"
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

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-slide-up">
          Design, write, and publish your own newspaper. Drag, drop, customize, and bring your stories to life with zero design experience required.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 animate-scale-in">
          <button
            type="button"
            onClick={onStartCreating}
            className="btn-primary py-3.5 px-8 text-base font-bold flex items-center justify-center gap-2.5 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all cursor-pointer bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl"
          >
            <span>Start Creating Now</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={onGoToDashboard}
            className="btn-ghost py-3.5 px-7 text-base font-bold flex items-center justify-center gap-2 w-full sm:w-auto rounded-2xl bg-white/80 hover:bg-white text-slate-700 border-slate-300 shadow-2xs transition-all cursor-pointer"
          >
            <Newspaper size={17} />
            <span>My Newspapers</span>
          </button>
        </div>
      </section>

      {/* ─── HOW IT WORKS (3 SIMPLE STEPS) ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            How Newspaper Studio Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-7 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 text-center rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Choose a Layout
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Start with a ready-to-use template (Classic, Modern, School, Sports) or a completely blank canvas.
            </p>
          </div>

          <div className="card p-7 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 text-center rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Create Your Newspaper
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Drag and drop headlines, articles, photos, quotes, and pre-built news blocks directly onto the page.
            </p>
          </div>

          <div className="card p-7 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 text-center rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mx-auto text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Publish Your Creation
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Preview your real newspaper, save drafts, publish a shareable link, or download high-resolution PDFs.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TEMPLATES SHOWCASE GALLERY ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Explore Newspaper Templates
            </h2>
            <p className="text-sm text-slate-500">
              Pick a template to instantly load a pre-arranged broadsheet layout you can customize.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartCreating}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Custom Blank Page →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEMPLATE_METAS.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className="card p-6 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between rounded-3xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {tmpl.previewImage}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {tmpl.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 group-hover:text-amber-700 transition-colors mb-1">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tmpl.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-bold">
                <span>Use This Template</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
