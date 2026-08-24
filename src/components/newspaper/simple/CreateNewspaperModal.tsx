'use client';

import React, { useState } from 'react';
import { TEMPLATE_METAS } from '@/lib/newspaper/templatePresets';
import { TemplateId, PageSize, PageOrientation } from '@/lib/newspaper/simpleTypes';
import { Newspaper, X, Sparkles, ArrowRight, Check } from 'lucide-react';

interface CreateNewspaperModalProps {
  isOpen: boolean;
  initialTemplateId?: TemplateId;
  onClose: () => void;
  onCreate: (config: {
    title: string;
    tagline: string;
    editionDate: string;
    pageSize: PageSize;
    orientation: PageOrientation;
    templateId: TemplateId;
  }) => void;
}

export default function CreateNewspaperModal({
  isOpen,
  initialTemplateId = 'school',
  onClose,
  onCreate,
}: CreateNewspaperModalProps) {
  const [title, setTitle] = useState('THE SCHOOL TIMES');
  const [tagline, setTagline] = useState('Your Voice. Your Stories. Your Community.');
  const [editionDate, setEditionDate] = useState(
    new Date().toLocaleDateString('en-US', { dateStyle: 'full' })
  );
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(initialTemplateId);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      tagline: tagline.trim(),
      editionDate,
      pageSize,
      orientation,
      templateId: selectedTemplate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl max-w-2xl w-full space-y-6 animate-scale-in rounded-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center text-lg font-bold">
              📰
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                Create New Newspaper
              </h2>
              <p className="text-xs text-slate-500">
                Set up your publication details and pick a starting layout.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Newspaper Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Newspaper Name:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., THE SCHOOL TIMES, THE DAILY HERALD..."
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif"
            />
          </div>

          {/* Tagline & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Tagline / Motto:
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g., Your Voice. Your Stories."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Edition Date:
              </label>
              <input
                type="text"
                value={editionDate}
                onChange={(e) => setEditionDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Page Size & Orientation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Page Size:
              </label>
              <div className="flex gap-2">
                {(['A4', 'A3'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setPageSize(sz)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      pageSize === sz
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {sz} Standard
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Orientation:
              </label>
              <div className="flex gap-2">
                {(['portrait', 'landscape'] as const).map((ori) => (
                  <button
                    key={ori}
                    type="button"
                    onClick={() => setOrientation(ori)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                      orientation === ori
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {ori}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Starting Layout Template:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto p-1">
              {TEMPLATE_METAS.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50 text-amber-950 border-amber-400 shadow-sm ring-2 ring-amber-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{tmpl.previewImage}</span>
                      {isSelected && <Check size={14} className="text-amber-700" />}
                    </div>
                    <div className="font-bold text-xs truncate">{tmpl.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{tmpl.badge}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost text-xs py-2.5 px-4 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md cursor-pointer"
            >
              <span>Open Newspaper Editor</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
