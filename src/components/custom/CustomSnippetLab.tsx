'use client';

import { useState } from 'react';
import { CUSTOM_PRESETS } from '@/lib/customPractice';
import type { CustomSnippetPreset } from '@/lib/types';
import { Code, BookOpen, Zap, Sparkles, Play, Trash2, Copy, Check } from 'lucide-react';

interface CustomSnippetLabProps {
  onStartCustomTest: (text: string, title?: string) => void;
}

export default function CustomSnippetLab({ onStartCustomTest }: CustomSnippetLabProps) {
  const [customText, setCustomText] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'code' | 'prose' | 'speed' | 'fun'>('all');
  const [copied, setCopied] = useState(false);

  const wordCount = customText.trim() ? customText.trim().split(/\s+/).length : 0;
  const charCount = customText.length;
  const estimatedWpm = 60; // baseline
  const estimatedTimeSec = wordCount > 0 ? Math.round((wordCount / estimatedWpm) * 60) : 0;

  const filteredPresets = activeCategory === 'all'
    ? CUSTOM_PRESETS
    : CUSTOM_PRESETS.filter((p) => p.category === activeCategory);

  const handleSelectPreset = (preset: CustomSnippetPreset) => {
    setCustomText(preset.content);
  };

  const handleClear = () => {
    setCustomText('');
  };

  const handleStart = () => {
    if (!customText.trim()) return;
    onStartCustomTest(customText.trim(), 'Custom Snippet');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Code className="text-sage-600" size={22} />
            Custom Text & Code Snippet Lab
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Paste your own code, essays, lyrics, or choose from our curated presets to practice real-world typing.
          </p>
        </div>

        {/* Live text metrics */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-2 text-xs">
          <div className="text-center">
            <span className="font-bold text-slate-800 text-sm">{wordCount}</span>
            <span className="text-slate-400 block">words</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <span className="font-bold text-slate-800 text-sm">{charCount}</span>
            <span className="text-slate-400 block">chars</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <span className="font-bold text-sage-600 text-sm">~{estimatedTimeSec}s</span>
            <span className="text-slate-400 block">duration</span>
          </div>
        </div>
      </div>

      {/* Preset Category Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quick-Load Presets
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['all', 'code', 'prose', 'speed', 'fun'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all capitalize ${
                  activeCategory === cat
                    ? 'bg-sage-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-600 hover:bg-sage-100/80 border border-slate-200/60'
                }`}
              >
                {cat === 'all' ? '✨ All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Cards Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="text-left p-3.5 rounded-xl border border-slate-200/80 bg-white/70 hover:bg-sage-50/70 hover:border-sage-300 transition-all group flex flex-col justify-between shadow-2xs hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sage-100 text-sage-700 uppercase">
                    {preset.language || preset.category}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-sage-600 transition-colors">
                    Load ↗
                  </span>
                </div>
                <h4 className="font-semibold text-slate-800 text-xs line-clamp-1 group-hover:text-sage-800">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/90 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-xs font-mono text-slate-500 ml-2">custom-practice.txt</span>
          </div>

          <div className="flex items-center gap-1.5">
            {customText && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 transition-colors text-xs flex items-center gap-1"
                  title="Copy text"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-xs flex items-center gap-1"
                  title="Clear text"
                >
                  <Trash2 size={14} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Paste or type any code snippet, book quote, or custom text here... or pick a preset above!"
          rows={7}
          className="w-full p-4 font-mono text-sm text-slate-800 focus:outline-none resize-y bg-transparent placeholder:text-slate-400 leading-relaxed"
        />

        <div className="flex items-center justify-between p-4 bg-slate-50/50 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {customText.trim()
              ? '✨ Ready to test! Click Launch to type this text with live piano audio.'
              : '💡 Tip: You can paste multiline programming code, Python scripts, or JSON.'}
          </span>

          <button
            onClick={handleStart}
            disabled={!customText.trim()}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              customText.trim()
                ? 'bg-sage-600 hover:bg-sage-700 text-white shadow-sage-200 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Play size={16} fill="currentColor" />
            Launch Practice
          </button>
        </div>
      </div>
    </div>
  );
}
