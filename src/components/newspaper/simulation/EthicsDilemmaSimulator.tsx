'use client';

import { useState } from 'react';
import { EthicsDilemmaScenario } from '@/lib/newspaper/types';
import { Scale, AlertCircle, CheckCircle2, Award, Users } from 'lucide-react';

interface EthicsDilemmaSimulatorProps {
  dilemma: EthicsDilemmaScenario;
  onDecision: (score: number, chosenOptionId: string) => void;
}

export default function EthicsDilemmaSimulator({ dilemma, onDecision }: EthicsDilemmaSimulatorProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isDecided, setIsDecided] = useState(false);

  const selectedOption = dilemma.options.find((o) => o.id === selectedOptionId);

  const handleConfirmDecision = () => {
    if (!selectedOption) return;
    setIsDecided(true);
    onDecision(selectedOption.score, selectedOption.id);
  };

  return (
    <div className="card p-6 border border-slate-200/90 shadow-lg bg-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Scale size={13} className="text-purple-600" />
            Journalism Ethics & Standards Council
          </div>
          <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
            {dilemma.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate harm minimization, public interest, and editorial integrity before going to print.
          </p>
        </div>

        {isDecided && selectedOption && (
          <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center gap-2">
            <Award size={18} className="text-purple-600" />
            <span className="font-bold text-sm">Ethics Score: {selectedOption.score}/100</span>
          </div>
        )}
      </div>

      {/* Situation Narrative */}
      <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
          <AlertCircle size={15} />
          <span>EDITORIAL DILEMMA BRIEFING</span>
        </div>
        <p className="text-sm leading-relaxed font-serif text-slate-100">{dilemma.situation}</p>

        <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
          <Users size={13} className="text-slate-400" />
          <span>Stakeholders: {dilemma.stakeholders.join(' · ')}</span>
        </div>
      </div>

      {/* Action Options */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Choose Your Editorial Course of Action:
        </span>

        {dilemma.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isDecided}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50 text-purple-950 border-purple-400 shadow-md ring-2 ring-purple-200'
                  : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200'
              } ${isDecided ? 'cursor-default' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                    isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <CheckCircle2 size={12} />}
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-sm leading-snug">{opt.actionText}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Decision Debrief & SPJ Code Evaluation */}
      {isDecided && selectedOption && (
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2 animate-fade-in">
          <div className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Scale size={14} className="text-amber-600" />
            SPJ Code of Ethics Debrief
          </div>
          <p className="text-xs leading-relaxed font-serif">
            <span className="font-bold">Real-World Consequence: </span>
            {selectedOption.consequence}
          </p>
          <p className="text-xs leading-relaxed font-serif">
            <span className="font-bold">Journalistic Evaluation: </span>
            {selectedOption.ethicalEvaluation}
          </p>
        </div>
      )}

      {/* Submit Action */}
      {!isDecided && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={!selectedOptionId}
            onClick={handleConfirmDecision}
            className="btn-primary py-2.5 px-6 text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            <Scale size={16} />
            <span>Enforce Editorial Decision</span>
          </button>
        </div>
      )}
    </div>
  );
}
