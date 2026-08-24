'use client';

import { useState } from 'react';
import CustomSnippetLab from '@/components/custom/CustomSnippetLab';
import WeakKeyGym from '@/components/custom/WeakKeyGym';
import SuddenDeathMode from '@/components/custom/SuddenDeathMode';
import TypingTest from '@/components/typing/TypingTest';
import { Code, Target, Flame, Gamepad2, Sparkles, ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

type StudioTab = 'snippets' | 'weak-keys' | 'sudden-death';

export default function CustomStudioClient() {
  const [activeTab, setActiveTab] = useState<StudioTab>('snippets');
  const [activeTestText, setActiveTestText] = useState<string | null>(null);
  const [activeTestTitle, setActiveTestTitle] = useState<string>('');

  // Handle launching standard typing engine with custom text or drills
  const handleStartCustomSession = (text: string, title?: string) => {
    setActiveTestText(text);
    setActiveTestTitle(title || 'Custom Practice');
  };

  const handleExitCustomSession = () => {
    setActiveTestText(null);
    setActiveTestTitle('');
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Standard Test
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/games"
            className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200/80 hover:bg-purple-200 transition-colors"
          >
            🎮 Games Arcade
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sage-100 text-sage-800 border border-sage-200/80 flex items-center gap-1.5 shadow-2xs">
            <Sparkles size={13} className="text-sage-600" />
            Programming & Custom Studio
          </span>
        </div>
      </div>

      {/* If user launched a custom test into standard engine */}
      {activeTestText ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                Active Custom Session
              </span>
              <h2 className="text-lg font-bold text-slate-800">{activeTestTitle}</h2>
            </div>
            <button
              onClick={handleExitCustomSession}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              Exit to Studio Hub
            </button>
          </div>

          <TypingTest
            initialConfig={{ mode: 'words', wordCount: 50 }}
            initialText={activeTestText}
            hideTopicSelector={true}
          />
        </div>
      ) : (
        <>
          {/* Studio Hero Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h1
              className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Programming & Custom <span className="text-sage-600">Typing Studio</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Practice coding speed with JavaScript, Python, TypeScript, SQL, and React snippets, drill your weakest pinky keys, or paste your own custom text.
            </p>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-1.5 border-b border-slate-200/80">
            <button
              onClick={() => setActiveTab('snippets')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'snippets'
                  ? 'bg-sage-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-sage-50 hover:text-slate-900 bg-white/60 border border-slate-200/60'
              }`}
            >
              <Code size={16} />
              Code & Snippet Lab
            </button>

            <button
              onClick={() => setActiveTab('weak-keys')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'weak-keys'
                  ? 'bg-sage-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-sage-50 hover:text-slate-900 bg-white/60 border border-slate-200/60'
              }`}
            >
              <Target size={16} />
              Weak-Key & Finger Gym
            </button>

            <button
              onClick={() => setActiveTab('sudden-death')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sudden-death'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900 bg-white/60 border border-slate-200/60'
              }`}
            >
              <Flame size={16} />
              Sudden Death
            </button>

            <Link
              href="/games"
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 shadow-2xs"
            >
              <Gamepad2 size={16} />
              Play All Games 🎮 ↗
            </Link>
          </div>

          {/* Active Tab View */}
          <div className="pt-2 animate-fade-in">
            {activeTab === 'snippets' && (
              <CustomSnippetLab onStartCustomTest={handleStartCustomSession} />
            )}
            {activeTab === 'weak-keys' && (
              <WeakKeyGym
                onStartDrill={(drillText, keys) =>
                  handleStartCustomSession(drillText, `Key Drill [ ${keys.join(', ')} ]`)
                }
              />
            )}
            {activeTab === 'sudden-death' && <SuddenDeathMode />}
          </div>
        </>
      )}
    </div>
  );
}
