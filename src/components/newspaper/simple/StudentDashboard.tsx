'use client';

import React from 'react';
import { NewspaperProject } from '@/lib/newspaper/simpleTypes';
import {
  Newspaper,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Eye,
  Download,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface StudentDashboardProps {
  projects: NewspaperProject[];
  onCreateNew: () => void;
  onEditProject: (project: NewspaperProject) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onPreviewProject: (project: NewspaperProject) => void;
}

export default function StudentDashboard({
  projects,
  onCreateNew,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onPreviewProject,
}: StudentDashboardProps) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-2">
      {/* Top Welcome Bar */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-500/30 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={13} className="text-amber-400" />
            <span>Student Newsroom Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
            My Newspapers
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Manage your newspaper editions, resume editing drafts, duplicate existing broadsheets, or publish new front pages.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="px-6 py-3.5 rounded-2xl bg-white text-amber-950 hover:bg-amber-50 font-bold text-sm flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 shrink-0 cursor-pointer z-10"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Create New Newspaper</span>
        </button>
      </div>

      {/* Newspapers Gallery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Newspaper size={18} className="text-amber-600" />
            <span>All Editions ({projects.length})</span>
          </h3>
        </div>

        {projects.length === 0 ? (
          <div className="card p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto">
              📰
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-lg text-slate-800">No newspapers created yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Start your very first student newspaper edition with our drag-and-drop Canva-style editor.
              </p>
            </div>
            <button
              type="button"
              onClick={onCreateNew}
              className="btn-primary py-2.5 px-6 text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
            >
              <Plus size={15} />
              <span>Create Your First Newspaper</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const frontPage = proj.pages[0];
              const leadElement = frontPage?.elements.find(
                (el) => el.type === 'main_story_block' || el.type === 'headline'
              );

              return (
                <div
                  key={proj.id}
                  className="card p-6 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between rounded-3xl group"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          proj.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {proj.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{proj.editionDate || 'Today'}</span>
                      </span>
                    </div>

                    {/* Broadsheet Mockup Thumbnail */}
                    <div
                      onClick={() => onEditProject(proj)}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-serif text-center space-y-1.5 cursor-pointer group-hover:bg-amber-50/40 transition-colors shadow-2xs"
                    >
                      <div className="text-xs font-bold font-broadsheet text-stone-900 truncate uppercase border-b border-stone-300 pb-1">
                        {proj.title}
                      </div>
                      <div className="text-[10px] text-stone-500 italic truncate">
                        "{proj.tagline}"
                      </div>
                      <div className="text-[11px] font-bold text-stone-800 line-clamp-2 pt-1 font-broadsheet">
                        {leadElement?.content.title || 'Front Page Headline News'}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {proj.pages.length} {proj.pages.length === 1 ? 'Page' : 'Pages'} · {proj.pageSize} {proj.orientation}
                      </p>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditProject(proj)}
                      className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer flex-1 justify-center rounded-xl"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPreviewProject(proj)}
                      className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Preview Newspaper"
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateProject(proj.id)}
                      className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
