'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import TypingTest from '@/components/typing/TypingTest';
import { BookOpen, Keyboard, Clock, ChevronRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';

interface BlogArticleViewProps {
  post: BlogPost;
  renderedHtml: React.ReactNode;
}

/**
 * Splits markdown into clean paragraph blocks suitable for bite-sized typing practice.
 */
function extractSectionsFromMarkdown(md: string): { title: string; text: string }[] {
  const lines = md.split('\n');
  const sections: { title: string; text: string }[] = [];
  let currentTitle = 'Introduction';
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      if (currentLines.length > 0) {
        const text = cleanText(currentLines.join(' '));
        if (text.length > 30) {
          sections.push({ title: currentTitle, text });
        }
        currentLines = [];
      }
      currentTitle = trimmed.replace(/^#+\s+/, '');
    } else if (
      trimmed &&
      !trimmed.startsWith('|') &&
      !trimmed.startsWith('---')
    ) {
      currentLines.push(trimmed);
    }
  }

  if (currentLines.length > 0) {
    const text = cleanText(currentLines.join(' '));
    if (text.length > 30) {
      sections.push({ title: currentTitle, text });
    }
  }

  if (sections.length === 0) {
    sections.push({ title: 'Full Article', text: cleanText(md) });
  }

  return sections;
}

function cleanText(raw: string): string {
  return raw
    .replace(/^-\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function BlogArticleView({ post, renderedHtml }: BlogArticleViewProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'practice' ? 'practice' : 'read';
  const [activeTab, setActiveTab] = useState<'read' | 'practice'>(initialTab);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(0);

  const sections = useMemo(() => extractSectionsFromMarkdown(post.content), [post.content]);

  const activeSection = sections[selectedSectionIdx] || sections[0];
  const activeWordCount = activeSection?.text.split(/\s+/).filter(Boolean).length || 0;

  return (
    <div>
      {/* Read vs Practice Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-dark pb-4 mb-8">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('read')}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
              activeTab === 'read'
                ? 'bg-sage-500 text-white shadow-sm'
                : 'bg-white/80 text-slate-600 border border-cream-dark hover:bg-sage-100 hover:text-sage-700',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <BookOpen size={16} />
            Read Article
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
              activeTab === 'practice'
                ? 'bg-lavender text-white shadow-sm'
                : 'bg-white/80 text-slate-600 border border-cream-dark hover:bg-lavender/20 hover:text-lavender-dark',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Keyboard size={16} />
            Practice Typing
          </button>
        </div>

        <span className="text-xs text-slate-400 inline-flex items-center gap-1.5 font-medium">
          <Clock size={12} /> {post.readingTime} min read · {sections.length} practice sections
        </span>
      </div>

      {activeTab === 'read' ? (
        <div className="animate-fade-in">{renderedHtml}</div>
      ) : (
        <div className="animate-fade-in space-y-6">
          {/* Section Selection Bar */}
          <div className="card p-5 bg-gradient-to-r from-cream-light/60 to-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers size={13} className="text-lavender-dark" />
                Select Section to Practice ({selectedSectionIdx + 1} of {sections.length})
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {activeWordCount} words
              </span>
            </div>

            {/* Section Pills */}
            <div className="flex flex-wrap gap-2">
              {sections.map((sec, idx) => {
                const active = selectedSectionIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSectionIdx(idx)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all max-w-[200px] truncate',
                      active
                        ? 'bg-lavender text-white font-semibold shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    title={sec.title}
                  >
                    {idx + 1}. {sec.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Practice Typing Engine */}
          <div key={`section-${selectedSectionIdx}`}>
            <TypingTest
              initialConfig={{ mode: 'zen' }}
              initialText={activeSection.text}
              hideTopicSelector={true}
            />
          </div>

          {/* Next Section Prompt */}
          {selectedSectionIdx < sections.length - 1 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSectionIdx((prev) => prev + 1)}
                className="btn-ghost text-xs flex items-center gap-1.5"
              >
                Next Section: {sections[selectedSectionIdx + 1]?.title}
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
