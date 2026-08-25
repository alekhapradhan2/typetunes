'use client';

import { useState, useMemo } from 'react';
import { generateWeakKeyDrill } from '@/lib/customPractice';
import { Target, RotateCcw, Play, CheckCircle, Sparkles } from 'lucide-react';

interface WeakKeyGymProps {
  onStartDrill: (drillText: string, targetKeys: string[]) => void;
}

const PRESET_DRILLS = [
  { label: 'Left Pinky (Q, A, Z)', keys: ['q', 'a', 'z'], color: 'border-rose-300 bg-rose-50/70 text-rose-800' },
  { label: 'Right Pinky (P, ;, [ )', keys: ['p', ';', '['], color: 'border-purple-300 bg-purple-50/70 text-purple-800' },
  { label: 'Bottom Row (Z, X, C, V)', keys: ['z', 'x', 'c', 'v'], color: 'border-amber-300 bg-amber-50/70 text-amber-800' },
  { label: 'Top Numbers (1 - 9)', keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], color: 'border-sky-300 bg-sky-50/70 text-sky-800' },
  { label: 'Code Symbols ({ } [ ] @ #)', keys: ['{', '}', '[', ']', '@', '#', '(', ')'], color: 'border-emerald-300 bg-emerald-50/70 text-emerald-800' },
];

const KEYBOARD_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ['{', '}', '(', ')', '@', '#', '$', '%', '&', '='],
];

export default function WeakKeyGym({ onStartDrill }: WeakKeyGymProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['q', 'z', 'x', 'p']);
  const [wordCount, setWordCount] = useState<number>(35);

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectPreset = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  const clearAll = () => {
    setSelectedKeys([]);
  };

  const previewDrill = useMemo(() => {
    if (selectedKeys.length === 0) return 'Select at least one key below to generate your custom drill.';
    return generateWeakKeyDrill(selectedKeys, wordCount);
  }, [selectedKeys, wordCount]);

  const handleLaunch = () => {
    if (selectedKeys.length === 0) return;
    onStartDrill(previewDrill, selectedKeys);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Target className="text-sage-600 dark:text-sage-400" size={22} />
            Weak-Key & Finger Dexterity Gym
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Pinpoint the exact characters, pinky keys, or code symbols that slow you down and drill them into muscle memory.
          </p>
        </div>

        {/* Selected Keys summary pill */}
        <div className="flex items-center gap-2 bg-sage-50 dark:bg-sage-950/80 border border-sage-200 dark:border-sage-800 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          <span className="text-xs font-semibold text-sage-800 dark:text-sage-300">
            {selectedKeys.length} Target {selectedKeys.length === 1 ? 'Key' : 'Keys'}
          </span>
          {selectedKeys.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline ml-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Preset Key Bundles */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Target Muscle Groups & Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_DRILLS.map((p) => (
            <button
              key={p.label}
              onClick={() => selectPreset(p.keys)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all hover:scale-102 cursor-pointer ${p.color}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Keyboard */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Click keys below to add/remove them from your custom drill:
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">Green = Active Target</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 bg-slate-100/70 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 justify-center">
              {row.map((key) => {
                const isSelected = selectedKeys.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleKey(key)}
                    className={`w-8 h-9 sm:w-10 sm:h-10 rounded-lg font-mono text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center justify-center select-none shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'bg-sage-600 text-white scale-105 shadow-md shadow-sage-200 dark:shadow-none border-2 border-sage-700'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Drill Settings (Word count) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Drill Length:</span>
            {[20, 35, 60, 100].map((count) => (
              <button
                key={count}
                onClick={() => setWordCount(count)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  wordCount === count
                    ? 'bg-sage-500 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {count} words
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 dark:text-slate-500">
            Generates high-frequency repetitive target n-grams
          </span>
        </div>
      </div>

      {/* Generated Drill Preview & Launch */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-sage-600 dark:text-sage-400" size={18} />
            <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Generated Training Drill</h4>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {selectedKeys.length > 0 ? `Targeting [ ${selectedKeys.join(', ')} ]` : 'No keys selected'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-h-36 overflow-y-auto">
          {previewDrill}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleLaunch}
            disabled={selectedKeys.length === 0}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              selectedKeys.length > 0
                ? 'bg-sage-600 hover:bg-sage-700 text-white shadow-sage-200 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Play size={16} fill="currentColor" />
            Launch Muscle Memory Drill
          </button>
        </div>
      </div>
    </div>
  );
}
