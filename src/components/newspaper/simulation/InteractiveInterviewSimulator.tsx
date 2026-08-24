'use client';

import { useState } from 'react';
import { VirtualSource } from '@/lib/newspaper/types';
import { MessageSquare, Mic, ShieldCheck, Quote, Award, Sparkles } from 'lucide-react';

interface InteractiveInterviewSimulatorProps {
  sources: VirtualSource[];
  onQuoteCaptured: (quote: { speaker: string; title: string; quote: string }) => void;
  capturedQuotes: { speaker: string; title: string; quote: string }[];
}

export default function InteractiveInterviewSimulator({
  sources,
  onQuoteCaptured,
  capturedQuotes,
}: InteractiveInterviewSimulatorProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(sources[0]?.id || '');
  const [askedQuestions, setAskedQuestions] = useState<Record<string, string[]>>({});
  const [activeDialogueLog, setActiveDialogueLog] = useState<
    { speaker: 'student' | 'source'; text: string; isQuote?: boolean }[]
  >([]);

  const currentSource = sources.find((s) => s.id === selectedSourceId) || sources[0];

  const handleAskQuestion = (questionId: string, questionText: string, answerText: string, isKeyQuote?: boolean) => {
    // Record question asked
    setAskedQuestions((prev) => ({
      ...prev,
      [selectedSourceId]: [...(prev[selectedSourceId] || []), questionId],
    }));

    // Add to dialogue stream
    setActiveDialogueLog((prev) => [
      ...prev,
      { speaker: 'student', text: questionText },
      { speaker: 'source', text: answerText, isQuote: isKeyQuote },
    ]);
  };

  const handleCaptureQuote = (quoteText: string) => {
    if (!currentSource) return;
    onQuoteCaptured({
      speaker: currentSource.name,
      title: currentSource.role,
      quote: quoteText,
    });
  };

  return (
    <div className="card p-6 border border-slate-200/90 shadow-lg bg-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Mic size={13} className="text-sage-600 animate-pulse" />
            Live Press Interview Simulation
          </div>
          <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
            Interview Virtual Witnesses & Officials
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an on-the-record source, ask targeted questions, and clip key quotes for your article.
          </p>
        </div>

        {/* Notebook count pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <Quote size={14} className="text-amber-600" />
          <span>{capturedQuotes.length} Quotes in Notebook</span>
        </div>
      </div>

      {/* Sources Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sources.map((src) => {
          const isSelected = src.id === selectedSourceId;
          const questionsCount = askedQuestions[src.id]?.length || 0;

          return (
            <button
              key={src.id}
              onClick={() => {
                setSelectedSourceId(src.id);
                setActiveDialogueLog([]);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-3xl p-2 rounded-xl bg-white/10 border border-white/20 shadow-inner">
                {src.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm truncate flex items-center justify-between">
                  <span>{src.name}</span>
                  <span className="text-[10px] font-mono font-normal opacity-80">
                    {src.credibilityScore}% Trust
                  </span>
                </div>
                <div className={`text-xs mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {src.role}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-medium opacity-80">
                  <MessageSquare size={11} />
                  <span>{questionsCount} of {src.dialogueTree.length} Asked</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Source Dialogue Stage */}
      {currentSource && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left: Questions Press Pad (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mic size={14} className="text-sage-600" />
              Reporter Inquiries for {currentSource.name}
            </h4>

            <div className="space-y-2">
              {currentSource.dialogueTree.map((item) => {
                const isAsked = (askedQuestions[currentSource.id] || []).includes(item.questionId);

                return (
                  <button
                    key={item.questionId}
                    disabled={isAsked}
                    onClick={() => handleAskQuestion(item.questionId, item.questionText, item.answerText, item.isKeyQuote)}
                    className={`w-full p-3.5 rounded-xl text-left text-xs font-medium transition-all border cursor-pointer ${
                      isAsked
                        ? 'bg-slate-100/80 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                        : 'bg-white hover:bg-sage-50 text-slate-800 border-slate-200/90 hover:border-sage-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sage-600 font-bold">Q:</span>
                      <span className="leading-snug">{item.questionText}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Source Bio Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-sage-600" />
                Source Background & Vetting
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">{currentSource.bio}</p>
            </div>
          </div>

          {/* Right: Live Dialogue Transcription (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 rounded-2xl p-5 border border-slate-800 text-white min-h-[340px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-emerald-400">AUDIO TRANSCRIPT STREAM</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">On-The-Record Interview</span>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1">
              {activeDialogueLog.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <Mic size={24} className="mx-auto mb-2 opacity-40 text-slate-400" />
                  Select a question on the left to begin questioning {currentSource.name}.
                </div>
              ) : (
                activeDialogueLog.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      entry.speaker === 'student' ? 'items-end' : 'items-start'
                    } animate-fade-in`}
                  >
                    <div
                      className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        entry.speaker === 'student'
                          ? 'bg-sage-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-60 mb-1">
                        {entry.speaker === 'student' ? 'YOU (REPORTER)' : currentSource.name.toUpperCase()}
                      </div>
                      <p>{entry.text}</p>

                      {entry.speaker === 'source' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                            <Sparkles size={11} /> Key Quotation
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCaptureQuote(entry.text)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                          >
                            <Quote size={10} />
                            Clip to Article
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Press pass active</span>
              <span className="font-mono text-emerald-400 font-bold">100% Encrypted Audio</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
