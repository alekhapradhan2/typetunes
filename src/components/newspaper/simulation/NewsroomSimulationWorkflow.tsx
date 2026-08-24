'use client';

import { useState, useEffect } from 'react';
import { NEWS_CHALLENGES } from '@/lib/newspaper/challengesData';
import { NewsScenarioChallenge, ArticleDraft, NewspaperDocument } from '@/lib/newspaper/types';
import { analyzeArticleWithCoach, getTieredHints, CoachEvaluation, CoachHint } from '@/lib/newspaper/aiCoach';
import { awardXPAndBadge, saveStoredNewspaper, saveStoredProfile, getStoredProfile } from '@/lib/newspaper/storage';
import InteractiveInterviewSimulator from './InteractiveInterviewSimulator';
import FactCheckDetective from './FactCheckDetective';
import EthicsDilemmaSimulator from './EthicsDilemmaSimulator';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  FileSearch,
  Scale,
  PenTool,
  Layout,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  Shield,
  Send,
  Zap,
  Flame,
} from 'lucide-react';

interface NewsroomSimulationWorkflowProps {
  initialChallengeId?: string;
  onFinish?: () => void;
  onOpenDesigner?: (doc: NewspaperDocument) => void;
}

type SimulationStep =
  | 'choose_scenario'
  | 'briefing'
  | 'interview'
  | 'fact_check'
  | 'ethics'
  | 'write_article'
  | 'design_layout'
  | 'published_score';

export default function NewsroomSimulationWorkflow({
  initialChallengeId,
  onFinish,
  onOpenDesigner,
}: NewsroomSimulationWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<SimulationStep>(initialChallengeId ? 'briefing' : 'choose_scenario');
  const [selectedChallenge, setSelectedChallenge] = useState<NewsScenarioChallenge>(
    NEWS_CHALLENGES.find((c) => c.id === initialChallengeId) || NEWS_CHALLENGES[0]
  );

  // Simulation State
  const [capturedQuotes, setCapturedQuotes] = useState<{ speaker: string; title: string; quote: string }[]>([]);
  const [factCheckScore, setFactCheckScore] = useState<number>(100);
  const [ethicsScore, setEthicsScore] = useState<number>(100);

  // Article writing state
  const [headline, setHeadline] = useState<string>('Flash Flood Shuts River Valley High; Students Shift Remote');
  const [leadParagraph, setLeadParagraph] = useState<string>(
    'River Valley High transitioned 1,200 students to remote instruction early Monday after torrential flash floods submerged the cafeteria basement following 3.4 inches of rainfall.'
  );
  const [bodyText, setBodyText] = useState<string>(
    'Emergency crews deployed vacuum pumps while structural engineers verified building safety. "Zero injuries were recorded, and we expect campus reopening by Thursday," confirmed Incident Commander Chief Robert Davis.'
  );

  // AI Coach state
  const [aiEvaluation, setAiEvaluation] = useState<CoachEvaluation | null>(null);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showCoachModal, setShowCoachModal] = useState(false);

  // Final published score
  const [finalScore, setFinalScore] = useState<number>(0);
  const [xpEarned, setXpEarned] = useState<number>(0);
  const [unlockedBadge, setUnlockedBadge] = useState<string | undefined>(undefined);

  // Re-run AI coach analysis when writing changes
  useEffect(() => {
    const evalResult = analyzeArticleWithCoach(
      headline,
      leadParagraph,
      [bodyText],
      capturedQuotes.length
    );
    setAiEvaluation(evalResult);
  }, [headline, leadParagraph, bodyText, capturedQuotes]);

  const handleQuoteCaptured = (q: { speaker: string; title: string; quote: string }) => {
    setCapturedQuotes((prev) => [...prev, q]);
    // Insert into body text automatically
    setBodyText((prev) => `${prev}\n\n"${q.quote}" — ${q.speaker}, ${q.title}`);
  };

  const handleRevealHint = (level: number) => {
    if (!revealedHints.includes(level)) {
      setRevealedHints((prev) => [...prev, level]);
    }
  };

  const handlePublishNewspaper = () => {
    const articleScore = aiEvaluation?.overallScore || 85;
    const computedTotal = Math.round(
      factCheckScore * 0.25 + ethicsScore * 0.25 + articleScore * 0.35 + (capturedQuotes.length >= 2 ? 15 : 10)
    );

    setFinalScore(computedTotal);
    const rewardXP = selectedChallenge.xpReward + (computedTotal >= 90 ? 100 : 50);
    setXpEarned(rewardXP);

    const { badgeUnlocked } = awardXPAndBadge(rewardXP, 'first_story');
    setUnlockedBadge(badgeUnlocked);

    // Save final generated newspaper to local storage
    const newDoc: NewspaperDocument = {
      id: `paper_${Date.now()}`,
      title: 'THE VALLEY HERALD',
      tagline: 'The Independent Voice of Student Journalism',
      mastheadStyle: 'classic_broadsheet',
      paperTexture: 'paper-newsprint',
      editionNumber: 'Vol. XXXII · Special Breaking Edition',
      dateString: new Date().toLocaleDateString('en-US', { dateStyle: 'full' }),
      location: 'River Valley District',
      price: 'Free · Student Edition',
      volumeNumber: 'No. 104',
      authorName: getStoredProfile().name,
      schoolName: getStoredProfile().school,
      status: 'published',
      score: computedTotal,
      teacherFeedback: {
        teacherName: 'AI Journalism Newsdesk',
        score: computedTotal,
        comments: `Outstanding investigative rigor! Fact-check accuracy: ${factCheckScore}%, Ethics score: ${ethicsScore}%, Writing quality: ${articleScore}%.`,
        gradedAt: new Date().toISOString(),
      },
      pages: [
        {
          pageNumber: 1,
          pageTitle: 'Front Page',
          sections: [
            {
              id: 'lead_story_1',
              type: 'lead_article',
              title: headline,
              content: `${leadParagraph}\n\n${bodyText}`,
              author: `${getStoredProfile().name}, Staff Reporter`,
              imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
              imageFilter: 'filter-halftone',
              columnSpan: 3,
            },
            {
              id: 'quote_box_1',
              type: 'pull_quote',
              title: 'Key Attribution',
              content: capturedQuotes[0]
                ? `"${capturedQuotes[0].quote}" — ${capturedQuotes[0].speaker}`
                : '"Zero injuries recorded as emergency crews secure the campus." — Fire Chief Davis',
              columnSpan: 1,
            },
            {
              id: 'weather_box_1',
              type: 'weather_widget',
              title: 'District Advisory & Weather',
              content: 'Torrential alert downgraded · River gauge crest passed · Remote classes active',
              columnSpan: 2,
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveStoredNewspaper(newDoc);
    setCurrentStep('published_score');
  };

  const stepsList: { id: SimulationStep; label: string; icon: React.ElementType }[] = [
    { id: 'choose_scenario', label: '1. Story Lead', icon: BookOpen },
    { id: 'briefing', label: '2. News Brief', icon: Clock },
    { id: 'interview', label: '3. Interview Sources', icon: Mic },
    { id: 'fact_check', label: '4. Fact Check', icon: FileSearch },
    { id: 'ethics', label: '5. Ethics Council', icon: Scale },
    { id: 'write_article', label: '6. Write & AI Coach', icon: PenTool },
    { id: 'design_layout', label: '7. Front Page Design', icon: Layout },
    { id: 'published_score', label: '8. Published Edition', icon: Award },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Workflow Progress Breadcrumb Bar */}
      <div className="card p-3.5 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {stepsList.map((st, idx) => {
            const Icon = st.icon;
            const isCurrent = currentStep === st.id;
            const isCompleted = stepsList.findIndex((s) => s.id === currentStep) > idx;

            return (
              <div key={st.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(st.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-sage-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-sage-100 text-sage-800'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon size={14} />
                  <span>{st.label}</span>
                  {isCompleted && <CheckCircle2 size={12} className="text-sage-600" />}
                </button>
                {idx < stepsList.length - 1 && <span className="text-slate-300">→</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── STEP 1: CHOOSE SCENARIO ────────────────────────────────────────── */}
      {currentStep === 'choose_scenario' && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="chip inline-flex">
              <Zap size={12} className="mr-1 text-sage-600" />
              Interactive Newsroom Engine
            </span>
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Select a Journalism Simulation Mission
            </h2>
            <p className="text-sm text-slate-500">
              Step into the shoes of a reporter. Chase breaking leads, interrogate sources, verify raw data, and publish your own front page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS_CHALLENGES.map((ch) => (
              <div
                key={ch.id}
                className="card p-6 border border-slate-200 hover:border-sage-400 hover:shadow-xl transition-all flex flex-col justify-between group bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-800 border border-sage-200">
                      {ch.difficulty}
                    </span>
                    <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                      <Sparkles size={12} /> +{ch.xpReward} XP
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold text-slate-900 group-hover:text-sage-700 transition-colors mb-2 leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {ch.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {ch.briefing}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setCurrentStep('briefing');
                  }}
                  className="btn-primary w-full py-2.5 text-xs font-bold justify-center cursor-pointer shadow-sm"
                >
                  <span>Accept Assignment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── STEP 2: BRIEFING ────────────────────────────────────────────────── */}
      {currentStep === 'briefing' && (
        <div className="card p-8 border border-slate-200 shadow-xl bg-white space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sage-600">
                Editorial Assignment Briefing
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                {selectedChallenge.title}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
              Est. {selectedChallenge.estimatedMinutes} Mins
            </span>
          </div>

          {/* Wire Briefing */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-600" />
              City Desk Dispatch
            </h4>
            <p className="text-sm font-serif leading-relaxed text-amber-950">
              {selectedChallenge.briefing}
            </p>
          </div>

          {/* Live Wire Feed Ticker */}
          {selectedChallenge.breakingNewsFeed && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Incoming News Wire Ticker:
              </h4>
              <div className="space-y-2">
                {selectedChallenge.breakingNewsFeed.map((wire, wi) => (
                  <div key={wi} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-3">
                    <span className="font-mono font-bold text-sage-700 shrink-0">{wire.timestamp}</span>
                    <span className="text-slate-700 flex-1">{wire.updateText}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        wire.isReliable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {wire.isReliable ? 'Verified Wire' : 'Unconfirmed Rumor'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep('choose_scenario')}
              className="btn-ghost text-xs py-2.5 px-4"
            >
              <ArrowLeft size={14} />
              <span>Back to Scenarios</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep('interview')}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <span>Proceed to Source Interviews</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3: INTERVIEW ──────────────────────────────────────────────── */}
      {currentStep === 'interview' && (
        <div className="space-y-4 animate-fade-in">
          {selectedChallenge.sources && selectedChallenge.sources.length > 0 ? (
            <InteractiveInterviewSimulator
              sources={selectedChallenge.sources}
              onQuoteCaptured={handleQuoteCaptured}
              capturedQuotes={capturedQuotes}
            />
          ) : (
            <div className="card p-8 text-center text-slate-500">
              No interview sources required for this quick drill.
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep('briefing')}
              className="btn-ghost text-xs py-2.5 px-4"
            >
              <ArrowLeft size={14} />
              <span>Back to Briefing</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep('fact_check')}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <span>Next: Fact-Check Evidence Claims</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 4: FACT CHECK ─────────────────────────────────────────────── */}
      {currentStep === 'fact_check' && (
        <div className="space-y-4 animate-fade-in">
          {selectedChallenge.claimsToVerify && selectedChallenge.claimsToVerify.length > 0 ? (
            <FactCheckDetective
              claims={selectedChallenge.claimsToVerify}
              onComplete={(sc) => setFactCheckScore(sc)}
            />
          ) : (
            <div className="card p-8 text-center text-slate-500">
              No claims flagged for verification.
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep('interview')}
              className="btn-ghost text-xs py-2.5 px-4"
            >
              <ArrowLeft size={14} />
              <span>Back to Interviews</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(selectedChallenge.ethicsDilemma ? 'ethics' : 'write_article')}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <span>Next: {selectedChallenge.ethicsDilemma ? 'Ethics Council' : 'Write Article'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 5: ETHICS ─────────────────────────────────────────────────── */}
      {currentStep === 'ethics' && (
        <div className="space-y-4 animate-fade-in">
          {selectedChallenge.ethicsDilemma && (
            <EthicsDilemmaSimulator
              dilemma={selectedChallenge.ethicsDilemma}
              onDecision={(sc) => setEthicsScore(sc)}
            />
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep('fact_check')}
              className="btn-ghost text-xs py-2.5 px-4"
            >
              <ArrowLeft size={14} />
              <span>Back to Fact Checking</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep('write_article')}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <span>Next: Write Article with AI Coach</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 6: WRITE ARTICLE & AI COACH ───────────────────────────────── */}
      {currentStep === 'write_article' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left: Article Writing Desk (7 Cols) */}
          <div className="lg:col-span-7 card p-6 border border-slate-200 bg-white space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <PenTool size={14} className="text-sage-600" />
                Reporter Writing Desk (Inverted Pyramid)
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                Word Count: {(headline + ' ' + leadParagraph + ' ' + bodyText).split(/\s+/).filter(Boolean).length}
              </span>
            </div>

            {/* Headline */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Headline:
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Active 6-10 word headline..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sage-400 font-serif"
              />
            </div>

            {/* Lead Paragraph */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Lead Paragraph (Who, What, Where, When, Why):
              </label>
              <textarea
                rows={3}
                value={leadParagraph}
                onChange={(e) => setLeadParagraph(e.target.value)}
                placeholder="The essential facts upfront..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-serif leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>

            {/* Body & Quotes */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Body Details & Sourced Quotes:
              </label>
              <textarea
                rows={5}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Supporting context, expert quotes, and next steps..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-serif leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>

            {/* Clipped Notebook Quotes Quick Insert */}
            {capturedQuotes.length > 0 && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-1.5">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Mic size={12} className="text-amber-600" />
                  Your Interview Quotes:
                </span>
                <div className="space-y-1">
                  {capturedQuotes.map((q, qi) => (
                    <div key={qi} className="text-[11px] text-amber-950 font-serif">
                      "{q.quote}" — <strong>{q.speaker}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('interview')}
                className="btn-ghost text-xs py-2 px-3"
              >
                <ArrowLeft size={13} />
                <span>Interviews</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('design_layout')}
                className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
              >
                <span>Format Front Page</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right: Socratic AI Journalism Coach (5 Cols) */}
          <div className="lg:col-span-5 card p-6 border border-slate-200 bg-slate-900 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sage-400 animate-ping" />
                <span className="text-xs font-bold text-sage-400 uppercase tracking-wider">
                  Socratic AI Journalism Coach
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-800">
                Quality: {aiEvaluation?.overallScore || 85}%
              </span>
            </div>

            {/* Score Gauges */}
            {aiEvaluation && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-base font-bold text-sage-400">{aiEvaluation.invertedPyramidScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Lead Structure</div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-base font-bold text-sky-400">{aiEvaluation.objectivityScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Objectivity</div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-base font-bold text-purple-400">{aiEvaluation.headlineScore}%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Headline Impact</div>
                </div>
              </div>
            )}

            {/* Coach Socratic Guidance */}
            {aiEvaluation && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 leading-relaxed">
                  <span className="font-bold text-sage-400 block mb-1">Editor In-Chief Note:</span>
                  {aiEvaluation.leadFeedback}
                </div>

                {/* Probing Questions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Socratic Questions to Elevate Your Story:
                  </span>
                  <ul className="space-y-1.5">
                    {aiEvaluation.probingQuestions.map((q, qi) => (
                      <li key={qi} className="text-xs text-amber-300 font-serif leading-snug flex items-start gap-1.5">
                        <span>•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tiered Hint System */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Editorial Assistance & Hints:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {getTieredHints(selectedChallenge.category).map((hint) => {
                  const isUnlocked = revealedHints.includes(hint.level);

                  return (
                    <button
                      key={hint.level}
                      type="button"
                      onClick={() => handleRevealHint(hint.level)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isUnlocked
                          ? 'bg-sage-600 text-white border-sage-500'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {hint.levelName} (-{hint.xpPenalty} XP)
                    </button>
                  );
                })}
              </div>

              {/* Show Revealed Hint Text */}
              {revealedHints.map((lvl) => {
                const hint = getTieredHints(selectedChallenge.category).find((h) => h.level === lvl);
                if (!hint) return null;
                return (
                  <div key={lvl} className="p-3 rounded-xl bg-sage-950/80 border border-sage-700/60 text-xs text-sage-200">
                    <strong>{hint.levelName}: </strong>
                    {hint.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 7: DESIGN FRONT PAGE LAYOUT ───────────────────────────────── */}
      {currentStep === 'design_layout' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-6 bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sage-600">
                Front Page Composition Preview
              </span>
              <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                Review Your Broadsheet Layout
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your written story, quotes, and emergency advisory are laid out on authentic broadsheet newsprint.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep('write_article')}
                className="btn-ghost text-xs py-2 px-3"
              >
                <ArrowLeft size={13} />
                <span>Edit Copy</span>
              </button>

              <button
                type="button"
                onClick={handlePublishNewspaper}
                className="btn-primary py-2.5 px-6 text-sm font-bold shadow-lg flex items-center gap-2"
              >
                <Send size={15} />
                <span>Publish Newspaper Edition</span>
              </button>
            </div>
          </div>

          {/* Broadsheet Canvas Preview */}
          <div className="max-w-[900px] mx-auto p-8 sm:p-12 shadow-2xl rounded-sm border border-stone-400 paper-newsprint text-stone-900 space-y-6">
            {/* Masthead */}
            <div className="text-center border-b-4 border-stone-900 pb-4">
              <div className="text-xs uppercase tracking-widest font-mono text-stone-600 mb-1">
                Vol. XXXII · No. 42 · River Valley District · {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold font-broadsheet tracking-tight uppercase">
                THE VALLEY HERALD
              </h1>
              <div className="text-xs italic font-newsreader mt-1 border-t border-stone-700 pt-1">
                "The Independent Voice of Truth, Accuracy, and Student Enterprise"
              </div>
            </div>

            {/* Lead Headline */}
            <div className="text-center py-2 border-b-2 border-stone-800">
              <h2 className="text-2xl sm:text-4xl font-bold font-broadsheet leading-tight uppercase">
                {headline}
              </h2>
              <div className="text-xs font-mono font-bold text-stone-700 mt-1">
                By {getStoredProfile().name}, Staff Investigative Reporter
              </div>
            </div>

            {/* 3-Column Newspaper Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-newsreader text-sm leading-relaxed text-justify">
              <div className="space-y-3">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                  {leadParagraph}
                </p>
                <p>{bodyText}</p>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-stone-200/60 border-y-2 border-stone-800 text-center italic font-bold text-base leading-snug">
                  {capturedQuotes[0]
                    ? `"${capturedQuotes[0].quote}"`
                    : '"Zero injuries recorded as vacuum pumps clear the lower levels."'}
                </div>
                <p className="text-xs">
                  District engineering specialists confirmed that drainage culverts overwhelmed by 3.4 inches of rainfall were augmented with secondary bypass channels.
                </p>
              </div>

              <div className="space-y-3 border-l md:border-stone-300 md:pl-4">
                <div className="p-3 bg-stone-100 border border-stone-400 text-xs font-mono space-y-1">
                  <div className="font-bold uppercase tracking-wider text-stone-800">CAMPUS BULLETIN:</div>
                  <div>• Classes: Remote Zoom 9:30 AM</div>
                  <div>• Reopening: Thursday Planned</div>
                  <div>• Hotlines: 555-0199</div>
                </div>
                <p className="text-xs">
                  Parents and students are requested to consult the official portal for asynchronous assignments and transport notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 8: PUBLISHED SCORE & XP ───────────────────────────────────── */}
      {currentStep === 'published_score' && (
        <div className="card p-8 sm:p-12 border border-slate-200 shadow-2xl bg-white text-center space-y-6 max-w-2xl mx-auto animate-scale-in">
          <div className="w-16 h-16 rounded-3xl bg-sage-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sage-500/30">
            <Award size={32} />
          </div>

          <div>
            <span className="chip mb-2 inline-flex">
              <Flame size={12} className="mr-1 text-amber-500" />
              Edition Successfully Printed
            </span>
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Newspaper Edition Published!
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your front-page investigative story has been added to your official student press portfolio.
            </p>
          </div>

          {/* Score & XP Showcase */}
          <div className="grid grid-cols-3 gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-2xl font-bold text-slate-800">{finalScore}/100</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Quality Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-600">+{xpEarned}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Journalism XP</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">Level {getStoredProfile().level}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{getStoredProfile().rank}</div>
            </div>
          </div>

          {unlockedBadge && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center gap-3">
              <span className="text-3xl">🏅</span>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider">New Badge Unlocked!</div>
                <div className="text-sm font-bold">First Scoop Reporter</div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onFinish) onFinish();
                else setCurrentStep('choose_scenario');
              }}
              className="btn-primary w-full sm:w-auto py-3 px-6 text-sm font-bold justify-center"
            >
              <span>Return to Newsroom Hub</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
