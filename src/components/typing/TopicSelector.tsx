'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { PRESET_TOPICS } from '@/lib/topics';
import { Sparkles, ChevronDown, Check, X, Search } from 'lucide-react';

interface TopicSelectorProps {
  selectedTopic: string | null;
  onTopicSelect: (topicId: string, customText?: string) => void;
  disabled: boolean;
}

export default function TopicSelector({
  selectedTopic,
  onTopicSelect,
  disabled,
}: TopicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const activeTopicObj = useMemo(() => {
    if (!selectedTopic) return null;
    if (selectedTopic === 'custom') return { id: 'custom', label: 'Custom Topic', emoji: '✨' };
    return PRESET_TOPICS.find((t) => t.id === selectedTopic) || null;
  }, [selectedTopic]);

  const filteredTopics = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return PRESET_TOPICS;
    return PRESET_TOPICS.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelect = (id: string) => {
    if (disabled) return;
    onTopicSelect(id);
    setIsOpen(false);
  };

  const handleGenerate = async () => {
    const topic = customInput.trim();
    if (!topic || disabled) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 400));
    onTopicSelect('custom', topic);
    setGenerating(false);
    setIsOpen(false);
    setCustomInput('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTopicSelect('');
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left" data-topic-dropdown>
      {/* Dropdown Trigger Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled}
          className={[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border shadow-xs',
            activeTopicObj
              ? 'bg-sage-100 text-sage-800 border-sage-300 hover:bg-sage-200'
              : 'bg-white/80 text-slate-600 border-cream-dark hover:bg-white hover:border-slate-300',
            disabled && 'opacity-50 cursor-not-allowed',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="text-sm leading-none">
            {activeTopicObj ? activeTopicObj.emoji : '🎯'}
          </span>
          <span className="max-w-[130px] truncate">
            {activeTopicObj ? activeTopicObj.label : 'Choose Topic'}
          </span>
          <ChevronDown
            size={13}
            className={`text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-sage-600' : ''
            }`}
          />
        </button>

        {activeTopicObj && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="p-1 rounded-full text-slate-400 hover:text-coral hover:bg-coral/10 transition-colors"
            title="Reset to random words"
            aria-label="Clear topic"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div
          onKeyDownCapture={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUpCapture={(e) => e.stopPropagation()}
          className="absolute z-[999] mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-4 animate-scale-in origin-top-left"
          style={{ backdropFilter: 'blur(16px)' }}
        >
          {/* Header & Search */}
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Practice Topics
              </span>
              <button
                type="button"
                onClick={() => handleSelect('')}
                className="text-xs font-medium text-sage-600 hover:underline"
              >
                Random Words
              </button>
            </div>

            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDownCapture={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search topics (e.g. Tech, Space, Art)…"
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* 20 Preset Topics in scrollable 2-column grid */}
          <div className="max-h-48 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
            <div className="grid grid-cols-2 gap-1.5">
              {filteredTopics.map((topic) => {
                const active = selectedTopic === topic.id;
                return (
                  <button
                    type="button"
                    key={topic.id}
                    onClick={() => handleSelect(topic.id)}
                    className={[
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all',
                      active
                        ? 'bg-sage-500 text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-sm leading-none">{topic.emoji}</span>
                      <span className="truncate">{topic.label}</span>
                    </span>
                    {active && <Check size={12} className="flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            {filteredTopics.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-3">
                No matching preset topics. Try generating a custom one below!
              </p>
            )}
          </div>

          {/* Custom Topic Generator Section */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <label
              htmlFor="custom-topic-input-dropdown"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"
            >
              <Sparkles size={12} className="text-lavender-dark" />
              Custom Topic Generator
            </label>
            <div className="flex gap-1.5">
              <input
                id="custom-topic-input-dropdown"
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDownCapture={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="e.g. quantum physics, coffee, jazz…"
                maxLength={50}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-lavender focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!customInput.trim() || generating}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 flex-shrink-0',
                  customInput.trim() && !generating
                    ? 'bg-lavender text-white hover:opacity-90 shadow-xs cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Sparkles size={11} />
                {generating ? 'Generating…' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
