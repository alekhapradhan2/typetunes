'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PaperTheme,
  PhotoFilter,
} from '@/data/newspaperTemplates';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Type,
  Layout,
  MessageSquare,
  Megaphone,
  Sun,
  Download,
  Printer,
  Sparkles,
  Camera,
  ZoomIn,
  ZoomOut,
  Palette,
  Trophy,
  Flame,
  Award,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  FileText,
  Sliders,
  Maximize2,
  HelpCircle,
} from 'lucide-react';
import { exportNewspaperElement, printNewspaper } from '@/lib/newspaperExporter';
import NewspaperTypewriterSoundBar, { typewriterAudio, useTypewriterKeystrokeAudio } from './NewspaperTypewriter';
import confetti from 'canvas-confetti';

export type BlockType =
  | 'masthead'
  | 'breaking-banner'
  | 'headline'
  | 'photo'
  | 'article'
  | 'two-column-split'
  | 'quote'
  | 'ad'
  | 'editorial'
  | 'weather-ticker'
  | 'divider';

export interface NewspaperBlock {
  id: string;
  type: BlockType;
  content: Record<string, any>;
}

// Newspaper Editor Challenges / Quests
interface NewspaperChallenge {
  id: string;
  title: string;
  badge: string;
  desc: string;
  reward: string;
  checkComplete: (blocks: NewspaperBlock[], photoUploaded: boolean, wordCount: number) => boolean;
}

const JOURNALISM_CHALLENGES: NewspaperChallenge[] = [
  {
    id: 'first-edition',
    title: 'The Rookie Scoop',
    badge: '🗞️',
    desc: 'Add a Masthead, a Giant Headline, and a Photo block to print your very first front page.',
    reward: 'Rookie Reporter Badge',
    checkComplete: (blocks) => {
      const types = blocks.map((b) => b.type);
      return types.includes('masthead') && types.includes('headline') && types.includes('photo');
    },
  },
  {
    id: 'breaking-tabloid',
    title: 'Tabloid Sensationalist',
    badge: '🔥',
    desc: 'Add a Breaking Alert Ribbon, a Giant Headline, a Photo with Halftone or B&W filter, and a Classified Ad.',
    reward: 'Sensationalist Gold Stamp',
    checkComplete: (blocks) => {
      const types = blocks.map((b) => b.type);
      return (
        types.includes('breaking-banner') &&
        types.includes('headline') &&
        types.includes('photo') &&
        types.includes('ad')
      );
    },
  },
  {
    id: 'broadsheet-master',
    title: 'Pulitzer Broadsheet Master',
    badge: '🏆',
    desc: 'Build a full 6-section broadsheet with Masthead, Headline, Photo, Multi-column Story, Editorial, and Quote Box with 120+ words.',
    reward: 'Pulitzer Prize Seal',
    checkComplete: (blocks, _, wordCount) => {
      const types = blocks.map((b) => b.type);
      return (
        types.includes('masthead') &&
        types.includes('headline') &&
        types.includes('photo') &&
        types.includes('article') &&
        types.includes('editorial') &&
        types.includes('quote') &&
        wordCount >= 100
      );
    },
  },
];

const STARTER_BLOCKS: NewspaperBlock[] = [
  {
    id: 'block-1',
    type: 'masthead',
    content: {
      title: 'THE CHRONICLE DISPATCH',
      submotto: '“The World’s Foremost Authority on Truth & Discovery”',
      latinMotto: 'VERITAS VOS LIBERABIT • ESTABLISHED 1929',
      font: 'gothic',
      city: 'NEW YORK & LONDON',
      date: 'FRIDAY, OCTOBER 24, 1929',
      volume: 'VOL. LXXVIII',
      edition: 'EXTRA EDITION',
      price: '5 CENTS',
    },
  },
  {
    id: 'block-2',
    type: 'headline',
    content: {
      headline: 'AUSTERE RECORD SHATTERED AS EXTRAORDINARY TRIUMPH CAPTIVATES WORLD',
      subheadline: 'Scores of Scholars and Observers Marvel at Unprecedented Feat of Speed and Determination',
      byline: 'BY SPECIAL CORRESPONDENT ALEXANDER VANE',
      dateline: 'NEW YORK',
    },
  },
  {
    id: 'block-3',
    type: 'photo',
    content: {
      url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&auto=format&fit=crop&q=80',
      caption: 'Fig. 1 — The breathless scene as witnesses gather to verify the historic tally.',
      credit: 'Press Photo Archive • Silver Gelatin Print',
      filter: 'sepia',
      aspectRatio: '16/9',
    },
  },
  {
    id: 'block-4',
    type: 'article',
    content: {
      columns: 3,
      leadParagraph: 'Before a spellbound congregation of citizens, engineers, and observers from across the hemisphere, an astounding landmark was achieved today that promises to reshape our understanding of human perseverance.',
      paragraphs: [
        'From the early hours of the morning, thousands gathered upon the steps of the grand pavilion. Teletype operators worked in relentless unison as telegraph lines carried rapid dispatches across oceans and continents without pause.',
        '“Never in our storied lifetime have we witnessed such absolute harmony of rhythm and unrelenting purpose,” proclaimed the Chief Commissioner to an applauding multitude.',
      ],
    },
  },
  {
    id: 'block-5',
    type: 'divider',
    content: { style: 'filigree' },
  },
  {
    id: 'block-6',
    type: 'ad',
    content: {
      title: 'ACME PRECISION TYPEWRITER CO.',
      tagline: 'Built Like a Tank — Snappy Precision Keys!',
      body: 'The choice of investigative reporters and prize-winning novelists. Ribbon cartridge included. 10-day money-back guarantee!',
      cta: 'Call ORchard 4-5000 for Nearest Dealership',
    },
  },
];

const AVAILABLE_BLOCKS_TOOLBOX: {
  type: BlockType;
  label: string;
  icon: any;
  desc: string;
  defaultContent: Record<string, any>;
}[] = [
  {
    type: 'masthead',
    label: 'Masthead / Title Banner',
    icon: Layout,
    desc: 'Paper name, Gothic/Serif typography, date, price',
    defaultContent: {
      title: 'THE DAILY GAZETTE',
      submotto: '“First With The Truth That Matters”',
      latinMotto: 'LUX ET VERITAS • ANNO DOMINI 1924',
      font: 'gothic',
      city: 'CHICAGO & SAN FRANCISCO',
      date: 'FRIDAY, NOVEMBER 13, 1924',
      volume: 'VOL. XIV',
      edition: 'EXTRA EDITION',
      price: '5 CENTS',
    },
  },
  {
    type: 'breaking-banner',
    label: 'Breaking Alert Ribbon',
    icon: Megaphone,
    desc: 'High-impact ribbon strip across the paper',
    defaultContent: {
      text: 'SPECIAL BULLETIN: SENSATIONAL DISCOVERY REPORTED BEFORE THOUSANDS IN THE CENTRAL PLAZA',
    },
  },
  {
    type: 'headline',
    label: 'Giant Main Headline',
    icon: Type,
    desc: 'Dramatic front-page title, subhead deck & byline',
    defaultContent: {
      headline: 'ASTONISHING BREAKTHROUGH ANNOUNCED AS NEW WORLD STANDARD IS ESTABLISHED',
      subheadline: 'Scores of Scholars and Citizens Marvel at Unprecedented Triumph of Human Ingenuity',
      byline: 'BY SPECIAL CORRESPONDENT ALEXANDER VANE',
      dateline: 'DOWNTOWN',
    },
  },
  {
    type: 'photo',
    label: 'Photo with Vintage Filter',
    icon: ImageIcon,
    desc: 'Custom photo upload with Halftone/B&W filters',
    defaultContent: {
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
      caption: 'Fig. 1 — The triumphant moment as the record is broken before the cheering crowd.',
      credit: 'Press Photo Archive • Silver Gelatin Print',
      filter: 'bw',
      aspectRatio: '16/9',
    },
  },
  {
    type: 'article',
    label: 'Multi-Column Story',
    icon: Type,
    desc: 'Justified 1, 2, 3 or 4 columns with drop caps',
    defaultContent: {
      columns: 3,
      leadParagraph: 'Before a spellbound congregation of citizens, engineers, and observers from across the hemisphere, an astounding landmark was achieved today that promises to reshape our understanding of what perseverance may accomplish.',
      paragraphs: [
        'From the early hours of the morning, thousands gathered upon the steps of the grand pavilion. Teletype operators worked in relentless unison as telegraph lines carried rapid dispatches across oceans and continents without pause.',
        '“Never in our storied lifetime have we witnessed such absolute harmony of rhythm and unrelenting purpose,” proclaimed the Chief Commissioner.',
      ],
    },
  },
  {
    type: 'two-column-split',
    label: '2-Column Split Stories',
    icon: Layout,
    desc: 'Two parallel stories in side-by-side columns',
    defaultContent: {
      leftTitle: 'Steam Locomotive Speed Standard Exceeded',
      leftText: 'Engine No. 402 tore through the northern pass at a relentless pace of 84 miles per hour.',
      rightTitle: 'Telegraph Cable Reaches Remote Observatory',
      rightText: 'Communications have been established with the arctic meteorological station.',
    },
  },
  {
    type: 'quote',
    label: 'Pull Quote of the Day',
    icon: MessageSquare,
    desc: 'Framed inspirational or dramatic quote box',
    defaultContent: {
      quote: '“Genius is the capacity for exerting continuous effort without succumbing to weariness.”',
      author: 'Lord Harrington, 1898',
    },
  },
  {
    type: 'ad',
    label: 'Vintage Classified Ad',
    icon: Megaphone,
    desc: 'Retro advertisement with border and bold CTA',
    defaultContent: {
      title: 'DR. SHELTON’S COGNITIVE ELIXIR',
      tagline: 'Fortifies the Nervous System & Calms the Restless Mind!',
      body: 'Crafted from pure mountain botanicals. Approved by apothecaries across three empires.',
      cta: 'Available at all Reputable Chemists — 25 Cents per Vial',
    },
  },
  {
    type: 'editorial',
    label: 'Editorial Column',
    icon: Type,
    desc: 'Word from the editor with signature signoff',
    defaultContent: {
      title: 'The March of Progress',
      editorName: 'The Editorial Board',
      text: 'In an epoch characterized by mechanical wonders and restless ambition, let it not be forgotten that the most profound machinery remains the human mind.',
    },
  },
  {
    type: 'divider',
    label: 'Woodcut Filigree Divider',
    icon: Layout,
    desc: 'Ornamental divider separating article sections',
    defaultContent: {
      style: 'filigree',
    },
  },
];

export default function NewspaperDragDropBuilder() {
  const [blocks, setBlocks] = useState<NewspaperBlock[]>(STARTER_BLOCKS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [paperTheme, setPaperTheme] = useState<PaperTheme>('aged');
  const [showCreases, setShowCreases] = useState(true);
  const [showCoffeeRing, setShowCoffeeRing] = useState(true);
  const [stampText, setStampText] = useState('PULITZER APPROVED');
  const [showStamp, setShowStamp] = useState(true);
  const [zoom, setZoom] = useState(0.95);
  const [isExporting, setIsExporting] = useState(false);

  // Journalistic Quest System
  const [showQuestDrawer, setShowQuestDrawer] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [questNotification, setQuestNotification] = useState<string | null>(null);

  // 60-Second Deadline Rush Challenge Game State
  const [deadlineGameActive, setDeadlineGameActive] = useState(false);
  const [deadlineSecondsLeft, setDeadlineSecondsLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useTypewriterKeystrokeAudio(true);

  // Compute total word count on page
  const totalWords = blocks.reduce((acc, b) => {
    const textValues = Object.values(b.content)
      .map((val) => (typeof val === 'string' ? val : Array.isArray(val) ? val.join(' ') : ''))
      .join(' ');
    return acc + (textValues.match(/\b\w+\b/g)?.length || 0);
  }, 0);

  // Check quests on block updates
  useEffect(() => {
    JOURNALISM_CHALLENGES.forEach((quest) => {
      if (!completedQuests.includes(quest.id)) {
        if (quest.checkComplete(blocks, true, totalWords)) {
          setCompletedQuests((prev) => [...prev, quest.id]);
          setQuestNotification(`🎉 Quest Completed: "${quest.title}"! Unlocked: ${quest.reward}`);
          typewriterAudio.playBellRing();
          try {
            confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
          } catch {}
          setTimeout(() => setQuestNotification(null), 5000);
        }
      }
    });
  }, [blocks, completedQuests, totalWords]);

  // Deadline Rush Timer
  useEffect(() => {
    if (deadlineGameActive && deadlineSecondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setDeadlineSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (deadlineSecondsLeft === 0 && deadlineGameActive) {
      setDeadlineGameActive(false);
      typewriterAudio.playBellRing();
      alert(`⏰ DEADLINE IS UP! Your newspaper has ${blocks.length} sections and ${totalWords} words printed!`);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [deadlineGameActive, deadlineSecondsLeft, blocks.length, totalWords]);

  const startDeadlineRush = () => {
    setDeadlineSecondsLeft(60);
    setDeadlineGameActive(true);
    typewriterAudio.playBellRing();
  };

  const handleStartBlankSheet = () => {
    if (window.confirm('Start from a clean blank newspaper canvas?')) {
      setBlocks([]);
      typewriterAudio.playBellRing();
    }
  };

  const handleLoadStarterOutline = () => {
    setBlocks(STARTER_BLOCKS);
    typewriterAudio.playBellRing();
  };

  const handleAddBlock = (preset: typeof AVAILABLE_BLOCKS_TOOLBOX[0]) => {
    const newBlock: NewspaperBlock = {
      id: `block-${Date.now()}`,
      type: preset.type,
      content: JSON.parse(JSON.stringify(preset.defaultContent)),
    };
    setBlocks([...blocks, newBlock]);
    typewriterAudio.playBellRing();
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    typewriterAudio.playKeyClack(true);
  };

  const handleDuplicateBlock = (index: number) => {
    const target = blocks[index];
    const clone: NewspaperBlock = {
      id: `block-${Date.now()}`,
      type: target.type,
      content: JSON.parse(JSON.stringify(target.content)),
    };
    const next = [...blocks];
    next.splice(index + 1, 0, clone);
    setBlocks(next);
    typewriterAudio.playBellRing();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const next = [...blocks];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setBlocks(next);
    typewriterAudio.playKeyClack(false);
  };

  const updateBlockContent = (id: string, newContent: Record<string, any>) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b))
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    const next = [...blocks];
    const item = next.splice(draggedIndex, 1)[0];
    next.splice(index, 0, item);
    setBlocks(next);
    setDraggedIndex(null);
    setDragOverIndex(null);
    typewriterAudio.playBellRing();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getPaperClass = () => {
    switch (paperTheme) {
      case 'aged':
        return 'paper-aged text-[#1f1b18]';
      case 'newsprint':
        return 'paper-newsprint text-[#1a1a1a]';
      case 'sepia':
        return 'paper-sepia text-[#241408]';
      case 'clean':
        return 'paper-clean text-[#111827]';
      case 'noir':
        return 'paper-noir text-[#e5e7eb]';
      case 'cyber':
        return 'paper-cyber text-[#00f0ff]';
      default:
        return 'paper-aged text-[#1f1b18]';
    }
  };

  const handleExport = async (format: 'png' | 'pdf') => {
    try {
      setIsExporting(true);
      await exportNewspaperElement('printable-newspaper', {
        fileName: 'my-custom-newspaper',
        format,
        scale: 2.5,
      });
    } catch (err) {
      console.error(err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate Readership Hype / Polish Score (0 - 100%)
  const calculatePressScore = () => {
    let score = 0;
    const types = blocks.map((b) => b.type);
    if (types.includes('masthead')) score += 20;
    if (types.includes('headline')) score += 25;
    if (types.includes('photo')) score += 20;
    if (types.includes('article')) score += 20;
    if (types.includes('ad') || types.includes('quote') || types.includes('editorial')) score += 15;
    return Math.min(100, score);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      
      {/* ─── QUEST SUCCESS NOTIFICATION ─── */}
      {questNotification && (
        <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 rounded-xl shadow-lg font-bold text-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Trophy size={18} />
            <span>{questNotification}</span>
          </div>
          <button onClick={() => setQuestNotification(null)} className="text-sm font-black px-2">
            ✕
          </button>
        </div>
      )}

      {/* ─── TOP MASTER STUDIO HEADER ─── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📰</span>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Newspaper Creator & Typewriter Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Build custom front pages from scratch, drag and drop blocks, type with realistic typewriter sound effects, and download print-ready newspapers!
          </p>
        </div>

        {/* Top Actions & Sound Control */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <NewspaperTypewriterSoundBar enabled={true} />

          {/* Quests & Game Mode Button */}
          <button
            onClick={() => setShowQuestDrawer(!showQuestDrawer)}
            className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all border border-amber-300"
          >
            <Trophy size={14} className="text-amber-700" />
            <span>Journalism Quests ({completedQuests.length}/{JOURNALISM_CHALLENGES.length})</span>
          </button>

          {/* Zoom controls */}
          <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.05).toFixed(2))))}
              className="p-1 rounded text-slate-600 hover:bg-white hover:text-slate-900"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-1.5 font-mono font-bold text-slate-700 text-xs">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.3, Number((z + 0.05).toFixed(2))))}
              className="p-1 rounded text-slate-600 hover:bg-white hover:text-slate-900"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Direct Print */}
          <button
            onClick={printNewspaper}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* PDF Download */}
          <button
            disabled={isExporting}
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>

          {/* PNG Download */}
          <button
            disabled={isExporting}
            onClick={() => handleExport('png')}
            className="btn-primary py-2 px-4 text-xs sm:text-sm whitespace-nowrap"
          >
            <Download size={14} />
            <span>{isExporting ? 'Generating...' : 'Download Newspaper'}</span>
          </button>
        </div>
      </div>

      {/* ─── QUESTS & DEADLINE RUSH DRAWER ─── */}
      {showQuestDrawer && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950 text-amber-100 border-2 border-amber-800 shadow-xl space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h3 className="text-base font-bold text-white">Press Desk Challenges & Deadline Rush</h3>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Complete editorial goals to earn official stamps and test your journalistic speed!
              </p>
            </div>

            {/* 60s Deadline Rush Game Button */}
            <div className="flex items-center gap-2">
              {deadlineGameActive ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-black rounded-xl animate-pulse text-sm">
                  <Clock size={16} />
                  <span>PRESS DEADLINE: {deadlineSecondsLeft}s LEFT!</span>
                </div>
              ) : (
                <button
                  onClick={startDeadlineRush}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transform hover:scale-105 transition-all"
                >
                  <Flame size={15} />
                  <span>Start 60s Deadline Rush Game 🎮</span>
                </button>
              )}
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {JOURNALISM_CHALLENGES.map((quest) => {
              const isDone = completedQuests.includes(quest.id);
              return (
                <div
                  key={quest.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100 ring-1 ring-emerald-500'
                      : 'bg-amber-900/40 border-amber-800/60 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base">{quest.badge}</span>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                        <CheckCircle2 size={11} />
                        <span>COMPLETED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold opacity-70">In Progress</span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-white">{quest.title}</h4>
                  <p className="text-[11px] opacity-80 mt-1 leading-snug">{quest.desc}</p>
                  <div className="text-[10px] font-semibold text-amber-400 mt-2">
                    Reward: {quest.reward}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── WORKSPACE: LEFT BLOCKS DOCK & RIGHT NEWSPAPER SHEET ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Toolbox & Paper Settings (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Actions / Blank Start */}
          <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Canvas Setup
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleStartBlankSheet}
                  className="px-2.5 py-1 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-[11px] font-bold transition-colors"
                  title="Clear all blocks and start with a blank sheet"
                >
                  Start Blank Sheet
                </button>
                <button
                  onClick={handleLoadStarterOutline}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold transition-colors"
                  title="Load standard broadsheet starter layout"
                >
                  Load Starter
                </button>
              </div>
            </div>

            {/* Readership Polish Score Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600">Front Page Impact Score:</span>
                <span className="font-bold text-sage-700">{calculatePressScore()}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-sage-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${calculatePressScore()}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                <span>{blocks.length} Sections</span>
                <span>{totalWords} Words Total</span>
              </div>
            </div>

            {/* Paper Theme Picker */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Paper Texture:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'aged', label: '1920s Aged', bg: '#f4ebd9' },
                  { id: 'newsprint', label: 'Newsprint', bg: '#ede8dc' },
                  { id: 'sepia', label: 'Sepia Noir', bg: '#ebd8bd' },
                  { id: 'clean', label: 'Clean White', bg: '#fdfcf9' },
                  { id: 'noir', label: 'Dark Press', bg: '#16181d' },
                  { id: 'cyber', label: 'Cyber 2088', bg: '#0c1017' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPaperTheme(t.id as PaperTheme)}
                    className={`p-1.5 rounded-lg border flex items-center gap-1.5 text-[11px] font-semibold transition-all ${
                      paperTheme === t.id
                        ? 'border-sage-500 bg-sage-50 text-sage-900 ring-1 ring-sage-500'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border shrink-0" style={{ backgroundColor: t.bg }} />
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overlays */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label className="flex items-center gap-1 cursor-pointer font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-200 text-xs">
                <input
                  type="checkbox"
                  checked={showCreases}
                  onChange={(e) => setShowCreases(e.target.checked)}
                  className="rounded text-sage-600"
                />
                <span>Fold Creases</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-200 text-xs">
                <input
                  type="checkbox"
                  checked={showCoffeeRing}
                  onChange={(e) => setShowCoffeeRing(e.target.checked)}
                  className="rounded text-sage-600"
                />
                <span>Coffee Stain</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-200 text-xs">
                <input
                  type="checkbox"
                  checked={showStamp}
                  onChange={(e) => setShowStamp(e.target.checked)}
                  className="rounded text-sage-600"
                />
                <span>Rubber Stamp</span>
              </label>
            </div>
          </div>

          {/* Draggable Blocks Palette Dock */}
          <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <Plus size={14} className="text-sage-600" />
                <span>Insert Newspaper Blocks</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to Add</span>
            </div>

            <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
              {AVAILABLE_BLOCKS_TOOLBOX.map((blockItem) => {
                const IconComponent = blockItem.icon;
                return (
                  <button
                    key={blockItem.type}
                    onClick={() => handleAddBlock(blockItem)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-sage-50 hover:border-sage-300 text-left transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-sage-600 shadow-2xs">
                        <IconComponent size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-sage-900">
                          {blockItem.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                          {blockItem.desc}
                        </div>
                      </div>
                    </div>

                    <span className="p-1 rounded bg-white border border-slate-200 text-slate-400 group-hover:text-sage-600">
                      <Plus size={13} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Live Canvas (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Quick Helper Banner */}
          <div className="w-full mb-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-sm text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-base animate-pulse">✏️</span>
              <span>
                <strong>WYSIWYG Builder:</strong> Drag sections to reorder, or click directly on any text or photo to edit!
              </span>
            </div>
            <span className="text-[11px] text-amber-800">
              {blocks.length} Sections on Sheet
            </span>
          </div>

          {/* Newspaper Canvas Container */}
          <div className="w-full rounded-2xl bg-stone-300/80 dark:bg-stone-900/80 p-3 sm:p-6 border border-stone-400/40 backdrop-blur-sm overflow-x-auto shadow-inner min-h-[750px] flex justify-center">
            
            <div
              id="printable-newspaper"
              className={`relative mx-auto w-full max-w-[960px] min-h-[1280px] p-6 sm:p-10 shadow-2xl transition-all duration-300 select-text overflow-hidden ${getPaperClass()}`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Paper Crease Overlay */}
              {showCreases && <div className="paper-crease-overlay" />}

              {/* Coffee Stain Overlay */}
              {showCoffeeRing && (
                <div
                  className="absolute top-24 right-12 w-36 h-36 rounded-full border-[10px] border-[#7a4b1c]/15 pointer-events-none mix-blend-multiply blur-[0.6px] rotate-45"
                  style={{
                    boxShadow: 'inset 0 0 15px rgba(122, 75, 28, 0.12), 0 0 6px rgba(122, 75, 28, 0.1)',
                  }}
                />
              )}

              {/* Rubber Stamp */}
              {showStamp && (
                <div
                  className="absolute top-16 right-8 z-30 px-5 py-2 border-4 border-dashed border-red-700 text-red-700 bg-red-900/10 rounded-lg font-black uppercase tracking-widest text-lg md:text-xl transform pointer-events-none select-none shadow-sm -rotate-12"
                  style={{
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {stampText}
                </div>
              )}

              {/* Outer Decorative Double Border */}
              <div className="border-4 border-[#2d251e] dark:border-slate-700 p-2 sm:p-3 relative">
                <div className="border border-[#2d251e] dark:border-slate-700 p-3 sm:p-4 space-y-4">

                  {/* Empty state prompt if user starts from blank sheet */}
                  {blocks.length === 0 && (
                    <div className="py-24 text-center border-2 border-dashed border-current/40 rounded-xl p-8 space-y-3">
                      <span className="text-4xl">📄</span>
                      <h3 className="text-xl font-bold font-broadsheet uppercase">Blank Newspaper Canvas</h3>
                      <p className="text-xs font-newsreader opacity-75 max-w-sm mx-auto">
                        Click any block from the left dock (+Masthead, +Headline, +Photo, +Article) to start designing your front page!
                      </p>
                      <button
                        onClick={handleLoadStarterOutline}
                        className="btn-primary py-2 px-4 text-xs font-bold"
                      >
                        Load Starter Layout
                      </button>
                    </div>
                  )}

                  {/* Render Ordered Draggable Blocks */}
                  {blocks.map((block, index) => {
                    const isDragging = draggedIndex === index;
                    const isOver = dragOverIndex === index;

                    return (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        className={`relative group transition-all duration-150 rounded-lg p-1.5 ${
                          isDragging ? 'opacity-40 scale-[0.98]' : ''
                        } ${isOver ? 'ring-2 ring-sage-500 bg-sage-100/20' : ''}`}
                      >
                        {/* Hover Action Toolbar (Reorder, Move, Duplicate, Delete) */}
                        <div className="no-export absolute -top-3 right-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white rounded-lg shadow-lg px-2 py-1 flex items-center gap-1.5 text-xs select-none">
                          <span
                            className="cursor-grab active:cursor-grabbing p-1 hover:text-sage-400"
                            title="Drag to reorder section"
                          >
                            <GripVertical size={13} />
                          </span>

                          <button
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:text-sage-400 disabled:opacity-30"
                            title="Move section up"
                          >
                            <ArrowUp size={13} />
                          </button>

                          <button
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === blocks.length - 1}
                            className="p-1 hover:text-sage-400 disabled:opacity-30"
                            title="Move section down"
                          >
                            <ArrowDown size={13} />
                          </button>

                          <button
                            onClick={() => handleDuplicateBlock(index)}
                            className="p-1 hover:text-amber-400"
                            title="Duplicate section"
                          >
                            <Copy size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-1 hover:text-red-400"
                            title="Delete section"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* ─── BLOCK CONTENT RENDERERS ─── */}

                        {/* 1. Masthead */}
                        {block.type === 'masthead' && (
                          <div className="text-center">
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  latinMotto: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-[11px] tracking-[0.2em] uppercase font-semibold opacity-75 mb-1 font-newsreader outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.latinMotto}
                            </div>

                            <h1
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  title: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none font-gothic outline-none cursor-text hover:bg-black/5 rounded my-1"
                            >
                              {block.content.title}
                            </h1>

                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  submotto: e.currentTarget.textContent || '',
                                })
                              }
                              className="mt-1 text-xs sm:text-sm italic font-newsreader opacity-85 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.submotto}
                            </p>

                            {/* Metadata Date Bar */}
                            <div className="my-2 border-y-2 border-current py-1.5 px-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider font-newsreader">
                              <div className="flex items-center gap-2">
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    updateBlockContent(block.id, {
                                      city: e.currentTarget.textContent || '',
                                    })
                                  }
                                  className="font-bold outline-none cursor-text hover:bg-black/5 rounded px-1"
                                >
                                  {block.content.city}
                                </span>
                                <span>•</span>
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    updateBlockContent(block.id, {
                                      date: e.currentTarget.textContent || '',
                                    })
                                  }
                                  className="outline-none cursor-text hover:bg-black/5 rounded px-1"
                                >
                                  {block.content.date}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-[11px]">
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    updateBlockContent(block.id, {
                                      volume: e.currentTarget.textContent || '',
                                    })
                                  }
                                  className="outline-none cursor-text hover:bg-black/5 rounded px-1"
                                >
                                  {block.content.volume}
                                </span>
                                <span>|</span>
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    updateBlockContent(block.id, {
                                      edition: e.currentTarget.textContent || '',
                                    })
                                  }
                                  className="font-bold outline-none cursor-text hover:bg-black/5 rounded px-1"
                                >
                                  {block.content.edition}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    updateBlockContent(block.id, {
                                      price: e.currentTarget.textContent || '',
                                    })
                                  }
                                  className="bg-current text-white dark:text-black px-1.5 py-0.5 rounded font-black text-[10px] outline-none cursor-text"
                                >
                                  {block.content.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. Breaking Alert Ribbon */}
                        {block.type === 'breaking-banner' && (
                          <div className="bg-current text-white dark:text-black px-3 py-1.5 text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 text-center">
                            <span className="animate-pulse font-black">▶ EXTRA:</span>
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  text: e.currentTarget.textContent || '',
                                })
                              }
                              className="outline-none cursor-text"
                            >
                              {block.content.text}
                            </span>
                          </div>
                        )}

                        {/* 3. Headline */}
                        {block.type === 'headline' && (
                          <div className="text-center py-2">
                            <h2
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  headline: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] font-broadsheet py-1 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.headline}
                            </h2>
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  subheadline: e.currentTarget.textContent || '',
                                })
                              }
                              className="mt-2 text-sm sm:text-lg italic font-newsreader max-w-4xl mx-auto opacity-90 leading-snug outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.subheadline}
                            </p>

                            <div className="my-2 flex items-center justify-between border-b border-current pb-1 text-xs font-semibold tracking-wider font-newsreader uppercase opacity-85">
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateBlockContent(block.id, {
                                    byline: e.currentTarget.textContent || '',
                                  })
                                }
                                className="outline-none cursor-text hover:bg-black/5 rounded px-1"
                              >
                                {block.content.byline}
                              </span>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateBlockContent(block.id, {
                                    dateline: e.currentTarget.textContent || '',
                                  })
                                }
                                className="italic font-normal outline-none cursor-text hover:bg-black/5 rounded px-1"
                              >
                                {block.content.dateline}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 4. Photo */}
                        {block.type === 'photo' && (
                          <div className="my-2 border-2 border-current p-1 bg-neutral-900">
                            <div
                              className="relative w-full overflow-hidden bg-black flex items-center justify-center group"
                              style={{
                                aspectRatio: block.content.aspectRatio?.replace('/', ' / ') || '16 / 9',
                                maxHeight: '420px',
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={block.content.url}
                                alt="Newspaper Photo"
                                className={`w-full h-full object-cover ${
                                  block.content.filter === 'halftone'
                                    ? 'filter-halftone'
                                    : block.content.filter === 'bw'
                                    ? 'filter-bw-contrast'
                                    : block.content.filter === 'sepia'
                                    ? 'filter-sepia-vintage'
                                    : ''
                                }`}
                              />

                              <label className="no-export absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 cursor-pointer select-none">
                                <Camera size={26} className="animate-bounce" />
                                <span className="text-xs font-bold uppercase tracking-wider bg-black/80 px-3 py-1 rounded-full">
                                  Upload / Change Photo 📸
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (evt) => {
                                        if (typeof evt.target?.result === 'string') {
                                          updateBlockContent(block.id, {
                                            url: evt.target.result,
                                          });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            <div className="p-2 border-t border-current flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] font-newsreader bg-current/5">
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateBlockContent(block.id, {
                                    caption: e.currentTarget.textContent || '',
                                  })
                                }
                                className="italic opacity-90 outline-none cursor-text hover:bg-black/5 rounded px-1"
                              >
                                {block.content.caption}
                              </span>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateBlockContent(block.id, {
                                    credit: e.currentTarget.textContent || '',
                                  })
                                }
                                className="text-[10px] uppercase font-bold tracking-wider opacity-75 shrink-0 outline-none cursor-text hover:bg-black/5 rounded px-1"
                              >
                                {block.content.credit}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 5. Article Multi-Column */}
                        {block.type === 'article' && (
                          <div
                            className="gap-4 text-justify font-newsreader text-[13.5px] leading-relaxed my-2"
                            style={{
                              columnCount: block.content.columns || 3,
                              columnRule: '1px solid #8c765c',
                              columnGap: '1.25rem',
                            }}
                          >
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  leadParagraph: e.currentTarget.textContent || '',
                                })
                              }
                              className="mb-3 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.leadParagraph}
                            </p>

                            {(block.content.paragraphs || []).map((p: string, pIdx: number) => (
                              <p
                                key={pIdx}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  const newParas = [...(block.content.paragraphs || [])];
                                  newParas[pIdx] = e.currentTarget.textContent || '';
                                  updateBlockContent(block.id, { paragraphs: newParas });
                                }}
                                className="mb-3 indent-4 outline-none cursor-text hover:bg-black/5 rounded"
                              >
                                {p}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* 6. Two-Column Split Stories */}
                        {block.type === 'two-column-split' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2 pt-2 border-t border-current">
                            <div className="p-2.5 border border-current/40 rounded bg-black/5 dark:bg-white/5">
                              <h4
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateBlockContent(block.id, {
                                    leftTitle: e.currentTarget.textContent || '',
                                  })
                                }
                                className="font-bold text-xs uppercase font-broadsheet mb-1 outline-none cursor-text hover:bg-black/5 rounded"
                              >
                                {block.content.leftTitle}
                              </h4>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateBlockContent(block.id, {
                                    leftText: e.currentTarget.textContent || '',
                                  })
                                }
                                className="text-[11.5px] font-newsreader leading-snug text-justify opacity-90 outline-none cursor-text hover:bg-black/5 rounded"
                              >
                                {block.content.leftText}
                              </p>
                            </div>

                            <div className="p-2.5 border border-current/40 rounded bg-black/5 dark:bg-white/5">
                              <h4
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateBlockContent(block.id, {
                                    rightTitle: e.currentTarget.textContent || '',
                                  })
                                }
                                className="font-bold text-xs uppercase font-broadsheet mb-1 outline-none cursor-text hover:bg-black/5 rounded"
                              >
                                {block.content.rightTitle}
                              </h4>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateBlockContent(block.id, {
                                    rightText: e.currentTarget.textContent || '',
                                  })
                                }
                                className="text-[11.5px] font-newsreader leading-snug text-justify opacity-90 outline-none cursor-text hover:bg-black/5 rounded"
                              >
                                {block.content.rightText}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 7. Quote of the Day */}
                        {block.type === 'quote' && (
                          <div className="p-3 border-2 border-dashed border-current rounded text-center bg-black/5 dark:bg-white/5 font-newsreader my-2">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-75 mb-1">
                              ★ QUOTE OF THE DAY ★
                            </div>
                            <blockquote
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  quote: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-sm italic font-medium leading-snug mb-1 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.quote}
                            </blockquote>
                            <cite
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  author: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-[11px] font-bold not-italic block uppercase opacity-80 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              — {block.content.author}
                            </cite>
                          </div>
                        )}

                        {/* 8. Retro Classified Ad */}
                        {block.type === 'ad' && (
                          <div className="p-3 border-2 border-current bg-current/5 text-center font-newsreader my-2">
                            <div className="text-[9px] font-black uppercase tracking-widest bg-current text-white dark:text-black py-0.5 px-2 inline-block mb-1">
                              ★ CLASSIFIED ADVERTISEMENT ★
                            </div>
                            <h5
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  title: e.currentTarget.textContent || '',
                                })
                              }
                              className="font-black text-sm uppercase font-broadsheet tracking-tight mt-1 mb-0.5 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.title}
                            </h5>
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  tagline: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-xs font-bold italic mb-1 text-amber-900 dark:text-amber-300 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.tagline}
                            </p>
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  body: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-xs leading-tight text-justify opacity-85 mb-2 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.body}
                            </p>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  cta: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-[10px] font-black uppercase tracking-wider border-t border-current pt-1 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.cta}
                            </div>
                          </div>
                        )}

                        {/* 9. Editorial Column */}
                        {block.type === 'editorial' && (
                          <div className="border border-current/50 p-3 rounded bg-black/5 dark:bg-white/5 font-newsreader my-2">
                            <div className="text-[10px] font-black uppercase tracking-widest text-center border-b border-current pb-1 mb-1.5">
                              EDITORIAL OPINION
                            </div>
                            <h4
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  title: e.currentTarget.textContent || '',
                                })
                              }
                              className="font-bold text-sm uppercase font-broadsheet text-center mb-1 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              {block.content.title}
                            </h4>
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  text: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-xs italic text-justify leading-relaxed opacity-90 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              “{block.content.text}”
                            </p>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateBlockContent(block.id, {
                                  editorName: e.currentTarget.textContent || '',
                                })
                              }
                              className="text-right text-[10px] font-bold uppercase mt-1 opacity-75 outline-none cursor-text hover:bg-black/5 rounded"
                            >
                              — {block.content.editorName}
                            </div>
                          </div>
                        )}

                        {/* 10. Divider */}
                        {block.type === 'divider' && (
                          <div className="my-3 py-1 flex items-center justify-center gap-3 text-current opacity-70">
                            <div className="h-[1px] bg-current flex-1" />
                            <span className="text-xs tracking-widest select-none">❖ ❖ ❖</span>
                            <div className="h-[1px] bg-current flex-1" />
                          </div>
                        )}

                      </div>
                    );
                  })}

                </div>
              </div>

              {/* Bottom Print Syndicate Tag */}
              <div className="mt-4 pt-2 border-t-2 border-current flex flex-wrap items-center justify-between text-[10px] uppercase tracking-wider font-semibold font-newsreader opacity-75">
                <span>PRINTED & DISTRIBUTED BY THE INDEPENDENT NEWSPAPER SYNDICATE</span>
                <span>PAGE 1 OF 1</span>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
