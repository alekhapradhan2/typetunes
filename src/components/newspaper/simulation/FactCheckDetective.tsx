'use client';

import { useState } from 'react';
import { FactCheckClaim } from '@/lib/newspaper/types';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, HelpCircle, Award, FileSearch, Sparkles } from 'lucide-react';

interface FactCheckDetectiveProps {
  claims: FactCheckClaim[];
  onComplete: (score: number, verifiedCount: number) => void;
}

export default function FactCheckDetective({ claims, onComplete }: FactCheckDetectiveProps) {
  const [verdicts, setVerdicts] = useState<Record<string, 'true' | 'false' | 'misleading' | 'unverified'>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectVerdict = (claimId: string, verdict: 'true' | 'false' | 'misleading' | 'unverified') => {
    if (isSubmitted) return;
    setVerdicts((prev) => ({ ...prev, [claimId]: verdict }));
  };

  const handleSubmitAudit = () => {
    let correctCount = 0;
    claims.forEach((claim) => {
      if (verdicts[claim.id] === claim.correctVerdict) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / claims.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    onComplete(calculatedScore, correctCount);
  };

  return (
    <div className="card p-6 border border-slate-200/90 shadow-lg bg-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileSearch size={13} className="text-sky-600" />
            Fact Check & Evidence Audit Lab
          </div>
          <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
            Investigate Claims Before Publication
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit circulating social posts and unverified statements against corroborated evidence.
          </p>
        </div>

        {score !== null && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
            <Award size={18} className="text-emerald-600" />
            <span className="font-bold text-sm">Accuracy: {score}%</span>
          </div>
        )}
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim, index) => {
          const userVerdict = verdicts[claim.id];
          const isCorrect = isSubmitted && userVerdict === claim.correctVerdict;

          return (
            <div
              key={claim.id}
              className={`p-5 rounded-2xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-rose-50/50 border-rose-300'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Claim #{index + 1} · Origin: {claim.sourceOrigin}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">"{claim.statement}"</h4>
                </div>

                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={13} /> Verified Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                        <XCircle size={13} /> Misidentified
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Evidence Clues */}
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 mb-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Corroborating Evidence:
                </span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                  {claim.evidenceClues.map((clue, ci) => (
                    <li key={ci}>{clue}</li>
                  ))}
                </ul>
              </div>

              {/* Verdict Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: 'true', label: 'True / Verified', icon: CheckCircle2, color: 'hover:bg-emerald-100 hover:text-emerald-800 border-emerald-300' },
                    { id: 'false', label: 'False / Debunked', icon: XCircle, color: 'hover:bg-rose-100 hover:text-rose-800 border-rose-300' },
                    { id: 'misleading', label: 'Misleading / Out of Context', icon: AlertTriangle, color: 'hover:bg-amber-100 hover:text-amber-800 border-amber-300' },
                    { id: 'unverified', label: 'Unverified / Insufficient Data', icon: HelpCircle, color: 'hover:bg-slate-200 hover:text-slate-800 border-slate-300' },
                  ] as const
                ).map((opt) => {
                  const isSelected = userVerdict === opt.id;
                  const Icon = opt.icon;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectVerdict(claim.id, opt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : `bg-white text-slate-700 ${opt.color}`
                      } ${isSubmitted ? 'cursor-default' : ''}`}
                    >
                      <Icon size={13} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Educational Explanation when submitted */}
              {isSubmitted && (
                <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-700 leading-relaxed font-serif">
                  <span className="font-bold text-slate-900">Lead Fact-Checker Verdict: </span>
                  {claim.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={Object.keys(verdicts).length < claims.length}
            onClick={handleSubmitAudit}
            className="btn-primary py-2.5 px-6 text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            <ShieldCheck size={16} />
            <span>Lock In Fact-Check Verdicts ({Object.keys(verdicts).length}/{claims.length})</span>
          </button>
        </div>
      )}
    </div>
  );
}
