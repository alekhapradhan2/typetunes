'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NewspaperProject, CanvasElement, ElementType, TemplateId } from '@/lib/newspaper/simpleTypes';
import { saveSingleProject } from '@/lib/newspaper/simpleStorage';
import {
  GeneratedStoryPackage,
  PRELOADED_STORY_PACKAGES,
  generateStoryPackage,
  StoryBlockItem,
} from '@/lib/newspaper/aiTopicGenerator';
import SimpleNewspaperCanvas from './SimpleNewspaperCanvas';
import SimplePreviewModal from './SimplePreviewModal';
import {
  Newspaper,
  Layout,
  Type,
  ImageIcon,
  Plus,
  Trash2,
  Copy,
  Eye,
  Download,
  Share2,
  Grid,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Save,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Megaphone,
  Sparkles,
  Layers,
  ArrowLeft,
  Upload,
  Palette,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Bot,
  X,
  Loader2,
  Wand2,
  GripHorizontal,
  Move,
  Maximize2,
  Minimize2,
  Maximize,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SimpleCanvaEditorProps {
  initialProject: NewspaperProject;
  onBackToDashboard: () => void;
}

export default function SimpleCanvaEditor({
  initialProject,
  onBackToDashboard,
}: SimpleCanvaEditorProps) {
  const [project, setProject] = useState<NewspaperProject>(initialProject);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Editor Display States
  const [showGrid, setShowGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLeftTab, setActiveLeftTab] = useState<'elements' | 'blocks' | 'ai' | 'styles'>('elements');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // AI Story & Multi-Block Generator Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [generatedPackage, setGeneratedPackage] = useState<GeneratedStoryPackage>(PRELOADED_STORY_PACKAGES[0]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isAiBarExpanded, setIsAiBarExpanded] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Floating Draggable Teleprompter Window Position
  const [teleprompterPos, setTeleprompterPos] = useState({ x: 35, y: 70 });
  const [isDraggingTeleprompter, setIsDraggingTeleprompter] = useState(false);
  const teleprompterDragRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 35,
    initY: 70,
  });

  const handleTeleprompterMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingTeleprompter(true);
    teleprompterDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: teleprompterPos.x,
      initY: teleprompterPos.y,
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - teleprompterDragRef.current.startX;
      const dy = moveEvent.clientY - teleprompterDragRef.current.startY;
      setTeleprompterPos({
        x: Math.max(10, Math.min(window.innerWidth - 320, teleprompterDragRef.current.initX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 150, teleprompterDragRef.current.initY + dy)),
      });
    };

    const onMouseUp = () => {
      setIsDraggingTeleprompter(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Fullscreen & Full-Width Canvas State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullWidthCanvas, setIsFullWidthCanvas] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // History for Undo/Redo
  const [history, setHistory] = useState<NewspaperProject[]>([initialProject]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPage = project.pages[activePageIndex] || project.pages[0];
  const selectedElement = currentPage?.elements.find((el) => el.id === selectedElementId);

  // Autosave when project changes
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveSingleProject(project);
      setSaveStatus('saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [project]);

  const updateProjectState = (newProj: NewspaperProject) => {
    setProject(newProj);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newProj]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setProject(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setProject(history[historyIndex + 1]);
    }
  };

  // ─── CLOUDINARY IMAGE UPLOAD ──────────────────────────────────────────────
  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/newspaper/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        console.warn('Upload endpoint error, using fallback');
        return URL.createObjectURL(file);
      }

      const data = await res.json();
      return data.url || URL.createObjectURL(file);
    } catch (e) {
      console.warn('Cloudinary upload error:', e);
      return URL.createObjectURL(file);
    }
  };

  // ─── ADD ELEMENT / BLOCK TO CURRENT PAGE ─────────────────────────────────
  const handleAddElement = (
    type: ElementType,
    customContent?: Partial<CanvasElement['content']>,
    layoutOverrides?: { insertIndex?: number; width?: number; x?: number }
  ) => {
    let newElement: CanvasElement;

    switch (type) {
      case 'headline':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'headline',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 100,
          content: {
            title: customContent?.title || 'NEW FRONT PAGE HEADLINE STORY',
            author: customContent?.author || 'Student Reporter',
            fontFamily: 'font-broadsheet',
            textAlign: 'center',
            ...customContent,
          },
        };
        break;
      case 'subheadline':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'subheadline',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 100,
          content: {
            title: customContent?.title || 'Supporting Context and Developing News Updates',
            fontFamily: 'font-newsreader',
            ...customContent,
          },
        };
        break;
      case 'paragraph':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'paragraph',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 100,
          content: {
            bodyText:
              customContent?.bodyText ||
              'Write your story details here. Include who was involved, what happened, when it occurred, where it took place, and why it matters to your school and community.',
            fontFamily: 'font-newsreader',
            textAlign: 'justify',
            ...customContent,
          },
        };
        break;
      case 'main_story_block':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'main_story_block',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 100,
          content: {
            title: customContent?.title || 'COMMUNITY CELEBRATES ANNUAL HARVEST FESTIVAL',
            author: customContent?.author || 'Lead Staff Reporter',
            bodyText:
              customContent?.bodyText ||
              'Hundreds of families gathered in the school courtyard yesterday for the annual festival, enjoying student musical performances and fundraising booths.\n\n"The collaborative spirit of our student volunteers made this our most successful event to date," said event organizer Sarah Jenkins.',
            imageUrl:
              customContent?.imageUrl ||
              'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
            imageCaption: customContent?.imageCaption || 'Student performers kick off the opening assembly.',
            imageFilter: 'filter-halftone',
            ...customContent,
          },
        };
        break;
      case 'secondary_story_block':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'secondary_story_block',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 100,
          content: {
            title: customContent?.title || 'Art Department Unveils Hallway Mural',
            bodyText:
              customContent?.bodyText ||
              'Senior art students completed a vibrant 40-foot mural depicting the history and cultural heritage of our local river valley.',
            ...customContent,
          },
        };
        break;
      case 'sports_block':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'sports_block',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 100,
          content: {
            title: customContent?.title || 'VARSITY SOCCER EXTENDS WINNING STREAK TO 8 GAMES',
            bodyText:
              customContent?.bodyText ||
              'Behind a stout defensive effort and two second-half goals from striker Marcus Cole, the team earned a crucial 2-0 shutout victory against rival Westgate.',
            ...customContent,
          },
        };
        break;
      case 'opinion_block':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'opinion_block',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 100,
          content: {
            title: customContent?.title || 'Editorial: The Value of Student-Led Discussions in History Class',
            author: customContent?.author || 'Alex Rivera',
            bodyText:
              customContent?.bodyText ||
              'When students are encouraged to debate primary sources collaboratively, critical thinking replaces memorization and fosters deeper empathy.',
            ...customContent,
          },
        };
        break;
      case 'quote':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'quote',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 100,
          content: {
            quoteText: customContent?.quoteText || '"Education is not the filling of a pail, but the lighting of a fire."',
            quoteSpeaker: customContent?.quoteSpeaker || 'William Butler Yeats',
            ...customContent,
          },
        };
        break;
      case 'image':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'image',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? (layoutOverrides?.width ? layoutOverrides.width : 50),
          content: {
            imageUrl:
              customContent?.imageUrl ||
              'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
            imageCaption: customContent?.imageCaption || 'Photo by Student Photojournalist',
            imageFilter: 'filter-halftone',
            ...customContent,
          },
        };
        break;
      case 'divider':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'divider',
          x: 0,
          y: 0,
          width: 100,
          content: {},
        };
        break;
      case 'weather_widget':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'weather_widget',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 50,
          content: {
            weatherCity: 'Local Weather',
            weatherTemp: '72°F · Clear',
            weatherForecast: 'Sunny skies expected all weekend with mild evening breezes.',
            ...customContent,
          },
        };
        break;
      case 'ad_box':
        newElement = {
          id: `el_${Date.now()}`,
          type: 'ad_box',
          x: layoutOverrides?.x ?? 0,
          y: 0,
          width: layoutOverrides?.width ?? 50,
          content: {
            adTitle: 'CAMPUS BOOKSTORE ANNUAL BOOK FAIR',
            adText: 'Get 25% off all student paperbacks, stationery, and art supplies this Thursday.',
            ...customContent,
          },
        };
        break;
      default:
        return;
    }

    if (layoutOverrides?.width !== undefined) newElement.width = layoutOverrides.width;
    if (layoutOverrides?.x !== undefined) newElement.x = layoutOverrides.x;

    const updatedPages = project.pages.map((p, idx) => {
      if (idx !== activePageIndex) return p;
      const elements = [...p.elements];
      if (layoutOverrides?.insertIndex !== undefined) {
        elements.splice(layoutOverrides.insertIndex, 0, newElement);
      } else {
        elements.push(newElement);
      }
      return { ...p, elements };
    });

    updateProjectState({ ...project, pages: updatedPages });
    setSelectedElementId(newElement.id);
  };

  // ─── INSERT AI GENERATED STORY PACKAGE ──────────────────────────────────
  const handleInsertAiStory = (storyPackage: GeneratedStoryPackage) => {
    storyPackage.blocks.forEach((block) => {
      handleAddElement(
        block.blockType,
        {
          title: block.headline,
          subtitle: block.subheadline,
          author: block.author,
          bodyText: block.bodyText,
          quoteText: block.quoteText,
          quoteSpeaker: block.quoteSpeaker,
          imageUrl: block.imageUrl,
          imageCaption: block.imageCaption,
          weatherCity: block.weatherCity,
          weatherTemp: block.weatherTemp,
          weatherForecast: block.weatherForecast,
          adTitle: block.adTitle,
          adText: block.adText,
        },
        { width: block.suggestedWidth }
      );
    });
    setIsAiModalOpen(false);
  };

  const handleUpdateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setProject((prevProject) => {
      const updatedPages = prevProject.pages.map((p, idx) => {
        if (idx !== activePageIndex) return p;
        const updatedElements = p.elements.map((el) => {
          if (el.id !== id) return el;
          return { ...el, ...updates };
        });
        return { ...p, elements: updatedElements };
      });

      const nextProject = { ...prevProject, pages: updatedPages };
      saveSingleProject(nextProject);
      return nextProject;
    });
  }, [activePageIndex]);

  const handleSwapElements = useCallback((sourceId: string, targetId: string) => {
    setProject((prevProject) => {
      const updatedPages = prevProject.pages.map((p, idx) => {
        if (idx !== activePageIndex) return p;
        const elements = [...p.elements];
        const sourceIdx = elements.findIndex((el) => el.id === sourceId);
        const targetIdx = elements.findIndex((el) => el.id === targetId);
        if (sourceIdx < 0 || targetIdx < 0) return p;

        const temp = elements[sourceIdx];
        elements[sourceIdx] = elements[targetIdx];
        elements[targetIdx] = temp;

        return { ...p, elements };
      });

      const nextProject = { ...prevProject, pages: updatedPages };
      saveSingleProject(nextProject);
      return nextProject;
    });
    setSelectedElementId(sourceId);
  }, [activePageIndex]);

  const handleReorderElementToIndex = useCallback(
    (elementId: string, targetIndex: number, layoutProps?: { width?: number; x?: number }) => {
      setProject((prevProject) => {
        const updatedPages = prevProject.pages.map((p, idx) => {
          if (idx !== activePageIndex) return p;
          const elements = [...p.elements];
          const currentIndex = elements.findIndex((el) => el.id === elementId);
          if (currentIndex < 0) return p;

          const [movedItem] = elements.splice(currentIndex, 1);
          const updatedItem = {
            ...movedItem,
            ...(layoutProps?.width !== undefined ? { width: layoutProps.width } : {}),
            ...(layoutProps?.x !== undefined ? { x: layoutProps.x } : {}),
          };

          const safeTarget = Math.max(0, Math.min(elements.length, targetIndex));
          elements.splice(safeTarget, 0, updatedItem);

          return { ...p, elements };
        });

        const nextProject = { ...prevProject, pages: updatedPages };
        saveSingleProject(nextProject);
        return nextProject;
      });
      setSelectedElementId(elementId);
    },
    [activePageIndex]
  );

  // ─── ELEMENT MODIFICATIONS ───────────────────────────────────────────────
  const handleUpdateElementContent = useCallback((id: string, updates: Partial<CanvasElement['content']>) => {
    setProject((prevProject) => {
      const updatedPages = prevProject.pages.map((p, idx) => {
        if (idx !== activePageIndex) return p;
        const updatedElements = p.elements.map((el) => {
          if (el.id !== id) return el;
          return { ...el, content: { ...el.content, ...updates } };
        });
        return { ...p, elements: updatedElements };
      });

      const nextProject = { ...prevProject, pages: updatedPages };
      saveSingleProject(nextProject);
      return nextProject;
    });
  }, [activePageIndex]);

  const handleDeleteElement = (id: string) => {
    const updatedPages = project.pages.map((p, idx) => {
      if (idx !== activePageIndex) return p;
      return { ...p, elements: p.elements.filter((el) => el.id !== id) };
    });

    updateProjectState({ ...project, pages: updatedPages });
    setSelectedElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    const elementToDup = currentPage.elements.find((el) => el.id === id);
    if (!elementToDup) return;

    const newDuplicated: CanvasElement = {
      ...elementToDup,
      id: `el_${Date.now()}`,
    };

    const updatedPages = project.pages.map((p, idx) => {
      if (idx !== activePageIndex) return p;
      return { ...p, elements: [...p.elements, newDuplicated] };
    });

    updateProjectState({ ...project, pages: updatedPages });
    setSelectedElementId(newDuplicated.id);
  };

  const handleMoveElementOrder = (id: string, direction: 'up' | 'down') => {
    const elements = [...currentPage.elements];
    const index = elements.findIndex((el) => el.id === id);
    if (index < 0) return;

    const targetIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(elements.length - 1, index + 1);
    if (targetIndex === index) return;

    const [moved] = elements.splice(index, 1);
    elements.splice(targetIndex, 0, moved);

    const updatedPages = project.pages.map((p, idx) => {
      if (idx !== activePageIndex) return p;
      return { ...p, elements };
    });

    updateProjectState({ ...project, pages: updatedPages });
  };

  // ─── MULTI-PAGE CONTROLS ──────────────────────────────────────────────────
  const handleAddPage = () => {
    const newPageNumber = project.pages.length + 1;
    const newPage = {
      id: `page_${Date.now()}_${newPageNumber}`,
      pageNumber: newPageNumber,
      title: newPageNumber === 2 ? 'News & Features' : newPageNumber === 3 ? 'Sports & Rec' : `Page ${newPageNumber}`,
      elements: [],
    };

    const updatedPages = [...project.pages, newPage];
    updateProjectState({ ...project, pages: updatedPages });
    setActivePageIndex(updatedPages.length - 1);
  };

  const handleDeletePage = (pageIndexToDelete: number) => {
    if (project.pages.length <= 1) return;
    const updatedPages = project.pages
      .filter((_, i) => i !== pageIndexToDelete)
      .map((p, i) => ({ ...p, pageNumber: i + 1 }));

    updateProjectState({ ...project, pages: updatedPages });
    setActivePageIndex(Math.max(0, activePageIndex - 1));
  };

  // ─── IMAGE UPLOAD HANDLER VIA FILE PICKER ──────────────────────────────────
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedElementId) return;

    const cloudUrl = await uploadImageToCloudinary(file);
    if (cloudUrl) {
      handleUpdateElementContent(selectedElementId, { imageUrl: cloudUrl });
    }
  };

  return (
    <div
      className={`w-full flex flex-col overflow-hidden bg-slate-900 text-slate-100 select-none ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] w-screen h-screen max-h-screen'
          : 'h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] relative'
      }`}
    >
      {/* ─── 1. TOP EDITOR TOOLBAR ────────────────────────────────────────── */}
      <header className="h-14 shrink-0 z-40 w-full bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shadow-md">
        {/* Left: Exit & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="btn-ghost text-xs py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">My Newspapers</span>
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={project.title}
              onChange={(e) => updateProjectState({ ...project, title: e.target.value })}
              className="font-bold text-sm bg-transparent border-b border-transparent hover:border-slate-600 focus:border-amber-500 outline-none text-white px-1 max-w-[180px] sm:max-w-[280px] truncate"
            />
            <span className="text-[10px] text-slate-500 hidden md:inline">
              {saveStatus === 'saving' ? 'Saving...' : '✓ All changes saved'}
            </span>
          </div>
        </div>

        {/* Center: Quick Canvas Controls */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-850 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded hover:bg-slate-750 disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded hover:bg-slate-750 disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            <Redo2 size={14} />
          </button>

          <div className="h-4 w-px bg-slate-750 mx-1" />

          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
            className="p-1.5 rounded hover:bg-slate-750 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="font-mono text-[11px] px-1 text-slate-400">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded hover:bg-slate-750 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>

          <div className="h-4 w-px bg-slate-750 mx-1" />

          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded cursor-pointer ${
              showGrid ? 'bg-amber-500/20 text-amber-400 font-bold' : 'hover:bg-slate-750 text-slate-400'
            }`}
            title="Toggle Alignment Grid"
          >
            <Grid size={14} />
          </button>

          <div className="h-4 w-px bg-slate-750 mx-1" />

          {/* Full-Width Newspaper Sheet Toggle (Hides sidebars to stretch canvas) */}
          <button
            type="button"
            onClick={() => setIsFullWidthCanvas((prev) => !prev)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
              isFullWidthCanvas
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-750 text-slate-400 hover:text-white'
            }`}
            title={isFullWidthCanvas ? 'Switch to Standard Broadsheet Width with Sidebars' : 'Stretch Canvas to Full-Width (Collapse Sidebars)'}
          >
            <Maximize size={14} />
            <span className="hidden xl:inline">{isFullWidthCanvas ? 'Standard Sheet' : 'Full-Width Sheet'}</span>
          </button>

          {/* Full Screen Mode Toggle (Maintains all sidebars in true fullscreen) */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
              isFullscreen
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'hover:bg-slate-750 text-slate-400 hover:text-white'
            }`}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen Window'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden xl:inline">{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
          </button>
        </div>

        {/* Right: AI Assistant, Preview, Export CTAs */}
        <div className="flex items-center gap-2">
          {/* AI Generator Button */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all animate-pulse"
          >
            <Sparkles size={13} className="text-amber-300" />
            <span>AI Story Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="btn-ghost text-xs py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="btn-primary text-xs py-1.5 px-4 rounded-xl flex items-center gap-1.5 font-bold shadow-md bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 cursor-pointer"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN 3-PANEL EDITOR WORKSPACE (STICKY SIDEBARS) ───────────── */}
      <div className="flex-1 flex flex-row overflow-hidden relative h-[calc(100vh-3.5rem-3rem)]">
        {/* ─── LEFT SIDEBAR: ELEMENTS & STORY BLOCKS (STICKY) ─────────────── */}
        <aside
          className={`w-72 h-full bg-slate-900 border-r border-slate-800 flex-col shrink-0 overflow-hidden sticky left-0 top-0 z-30 transition-all duration-200 ${
            isFullWidthCanvas ? 'hidden' : 'flex'
          }`}
        >
          {/* Sidebar Tabs */}
          <div className="grid grid-cols-4 border-b border-slate-800 text-[11px] font-bold text-center">
            <button
              type="button"
              onClick={() => setActiveLeftTab('elements')}
              className={`py-3 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'elements'
                  ? 'border-amber-500 text-amber-400 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Elements
            </button>
            <button
              type="button"
              onClick={() => setActiveLeftTab('blocks')}
              className={`py-3 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'blocks'
                  ? 'border-amber-500 text-amber-400 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Blocks
            </button>
            <button
              type="button"
              onClick={() => setActiveLeftTab('ai')}
              className={`py-3 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'ai'
                  ? 'border-purple-500 text-purple-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              ✨ AI Story
            </button>
            <button
              type="button"
              onClick={() => setActiveLeftTab('styles')}
              className={`py-3 border-b-2 transition-all cursor-pointer ${
                activeLeftTab === 'styles'
                  ? 'border-amber-500 text-amber-400 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Paper
            </button>
          </div>

          {/* Left Tab Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* TAB 1: BASIC ELEMENTS */}
            {activeLeftTab === 'elements' && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Drag or Click to Add:
                </span>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'headline')}
                  onClick={() => handleAddElement('headline')}
                  className="w-full p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group"
                >
                  <Type size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-slate-200">Main Headline</div>
                    <div className="text-[10px] text-slate-400">Large bold front page title</div>
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'subheadline')}
                  onClick={() => handleAddElement('subheadline')}
                  className="w-full p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group"
                >
                  <Type size={16} className="text-sky-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-slate-200">Subheadline</div>
                    <div className="text-[10px] text-slate-400">Secondary italic lead line</div>
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'paragraph')}
                  onClick={() => handleAddElement('paragraph')}
                  className="w-full p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group"
                >
                  <Type size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-slate-200">Article Text Box</div>
                    <div className="text-[10px] text-slate-400">Body paragraph with column format</div>
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'quote')}
                  onClick={() => handleAddElement('quote')}
                  className="w-full p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group"
                >
                  <Sparkles size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-slate-200">Pull Quote</div>
                    <div className="text-[10px] text-slate-400">Large centered statement</div>
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'image')}
                  onClick={() => handleAddElement('image')}
                  className="w-full p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group"
                >
                  <ImageIcon size={16} className="text-rose-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-slate-200">Photo / Illustration</div>
                    <div className="text-[10px] text-slate-400">Cloudinary stored & resizable</div>
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'weather_widget')}
                  onClick={() => handleAddElement('weather_widget')}
                  className="w-full p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group"
                >
                  <Sun size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-slate-200">Weather Ticker</div>
                    <div className="text-[10px] text-slate-400">Forecast and temperature widget</div>
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'ad_box')}
                  onClick={() => handleAddElement('ad_box')}
                  className="w-full p-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group"
                >
                  <Megaphone size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xs text-slate-200">Classified Ad Box</div>
                    <div className="text-[10px] text-slate-400">Vintage border sponsor notice</div>
                  </div>
                </button>
              </div>
            )}

            {/* TAB 2: PRE-BUILT STORY BLOCKS */}
            {activeLeftTab === 'blocks' && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Drag or Click Story Blocks:
                </span>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'main_story_block')}
                  onClick={() => handleAddElement('main_story_block')}
                  className="w-full p-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all space-y-1.5 cursor-grab active:cursor-grabbing"
                >
                  <div className="font-bold text-xs text-amber-400 flex items-center justify-between">
                    <span>Main Story Block</span>
                    <Plus size={14} />
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Lead headline + featured photo + 2-column article with caption.
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'secondary_story_block')}
                  onClick={() => handleAddElement('secondary_story_block')}
                  className="w-full p-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all space-y-1.5 cursor-grab active:cursor-grabbing"
                >
                  <div className="font-bold text-xs text-sky-400 flex items-center justify-between">
                    <span>Secondary Story Block</span>
                    <Plus size={14} />
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Medium headline with concise supporting report.
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'sports_block')}
                  onClick={() => handleAddElement('sports_block')}
                  className="w-full p-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all space-y-1.5 cursor-grab active:cursor-grabbing"
                >
                  <div className="font-bold text-xs text-emerald-400 flex items-center justify-between">
                    <span>Sports Roundup Box</span>
                    <Plus size={14} />
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Dark-mode scoreboard banner with bold typography.
                  </div>
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', 'opinion_block')}
                  onClick={() => handleAddElement('opinion_block')}
                  className="w-full p-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/60 transition-all space-y-1.5 cursor-grab active:cursor-grabbing"
                >
                  <div className="font-bold text-xs text-purple-400 flex items-center justify-between">
                    <span>Opinion / Editorial Column</span>
                    <Plus size={14} />
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Author byline callout with left accent border.
                  </div>
                </button>
              </div>
            )}

            {/* TAB 3: AI STORY & SITUATIONS */}
            {activeLeftTab === 'ai' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                  AI Topic & Story Generator:
                </span>

                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="w-full p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles size={14} />
                  <span>Open AI Story Lab</span>
                </button>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-slate-400 block">Instant Story Packages:</span>
                  {PRELOADED_STORY_PACKAGES.slice(0, 3).map((pkg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleInsertAiStory(pkg)}
                      className="w-full p-2.5 rounded-xl bg-slate-850 hover:bg-purple-900/30 text-left border border-slate-800 hover:border-purple-500/60 transition-all space-y-1 cursor-pointer"
                    >
                      <div className="text-[10px] font-bold text-purple-300 uppercase">{pkg.category}</div>
                      <div className="text-xs font-bold text-slate-200 line-clamp-1">{pkg.topic}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PAPER TEXTURES */}
            {activeLeftTab === 'styles' && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Paper Texture & Finish:
                </span>
                {(
                  [
                    { id: 'paper-newsprint', label: 'Classic Newsprint', desc: 'Slightly warm pulp paper' },
                    { id: 'paper-clean', label: 'Clean White Modern', desc: 'Contemporary crisp finish' },
                    { id: 'paper-aged', label: 'Vintage 1920s Broadsheet', desc: 'Aged parchment patina' },
                    { id: 'paper-sepia', label: 'Warm Sepia Antique', desc: 'Deep sepia contrast' },
                  ] as const
                ).map((tex) => (
                  <button
                    key={tex.id}
                    type="button"
                    onClick={() => updateProjectState({ ...project, paperTexture: tex.id })}
                    className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      project.paperTexture === tex.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                        : 'bg-slate-850 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs">{tex.label}</div>
                    <div className="text-[10px] opacity-75">{tex.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ─── CENTER CANVA-STYLE REALISTIC NEWSPAPER CANVAS + SLIM AI BAR ── */}
        <div className="flex-1 h-full flex flex-col overflow-hidden relative bg-stone-200/70">
          {/* ─── SLIM TOP AI STORY WIRE COPY TICKER (DOES NOT SHRINK CANVAS) ─── */}
          {generatedPackage && (
            <div className="bg-slate-900 border-b border-amber-500/40 text-white px-3 py-1.5 shrink-0 shadow-md z-30 transition-all">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
                {/* Left: Topic & Current Headline Summary */}
                <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    <Bot size={12} />
                  </div>
                  <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    {generatedPackage.category}
                  </span>
                  <span className="font-bold text-white truncate max-w-[140px] sm:max-w-[200px] text-xs">
                    {generatedPackage.topic}
                  </span>
                  <span className="text-slate-500 hidden md:inline">·</span>
                  <span className="text-stone-300 font-mono text-[11px] truncate hidden md:inline">
                    {generatedPackage.blocks[currentBlockIndex]?.headline ||
                      generatedPackage.blocks[currentBlockIndex]?.stepName}
                  </span>
                </div>

                {/* Right: Actions (Copy, Fill, Stepper, Expand Overlay) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const b = generatedPackage.blocks[currentBlockIndex];
                      if (!b) return;
                      const fullCopy = `${b.headline ? b.headline + '\n\n' : ''}${
                        b.author ? 'By ' + b.author + '\n\n' : ''
                      }${b.bodyText ? b.bodyText + '\n\n' : ''}${
                        b.quoteText ? '"' + b.quoteText + '" — ' + b.quoteSpeaker : ''
                      }`;
                      navigator.clipboard?.writeText(fullCopy);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                    title="Copy full copy to clipboard"
                  >
                    <Copy size={11} />
                    <span className="hidden sm:inline">Copy</span>
                  </button>

                  {/* Fill Selected Element */}
                  <button
                    type="button"
                    onClick={() => {
                      const b = generatedPackage.blocks[currentBlockIndex];
                      if (!b) return;
                      if (selectedElementId) {
                        handleUpdateElementContent(selectedElementId, {
                          title: b.headline,
                          subtitle: b.subheadline,
                          author: b.author,
                          bodyText: b.bodyText,
                          quoteText: b.quoteText,
                          quoteSpeaker: b.quoteSpeaker,
                          imageUrl: b.imageUrl,
                          imageCaption: b.imageCaption,
                        });
                      } else {
                        handleAddElement(
                          b.blockType,
                          {
                            title: b.headline,
                            subtitle: b.subheadline,
                            author: b.author,
                            bodyText: b.bodyText,
                            quoteText: b.quoteText,
                            quoteSpeaker: b.quoteSpeaker,
                            imageUrl: b.imageUrl,
                            imageCaption: b.imageCaption,
                          },
                          { width: b.suggestedWidth }
                        );
                      }
                    }}
                    className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                    title="Fill active selected element"
                  >
                    <Sparkles size={11} />
                    <span className="hidden sm:inline">Fill Active</span>
                  </button>

                  {/* Block Stepper */}
                  <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700">
                    <button
                      type="button"
                      disabled={currentBlockIndex === 0}
                      onClick={() => setCurrentBlockIndex((i) => Math.max(0, i - 1))}
                      className="text-[10px] font-bold text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer px-1.5 py-1 rounded-l-lg hover:bg-slate-700"
                      title="Previous Block"
                    >
                      ←
                    </button>
                    <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 border-x border-slate-700">
                      {currentBlockIndex + 1}/{generatedPackage.blocks.length}
                    </span>
                    <button
                      type="button"
                      disabled={currentBlockIndex === generatedPackage.blocks.length - 1}
                      onClick={() =>
                        setCurrentBlockIndex((i) => Math.min(generatedPackage.blocks.length - 1, i + 1))
                      }
                      className="text-[10px] font-bold text-amber-300 hover:text-amber-100 disabled:opacity-30 cursor-pointer px-1.5 py-1 rounded-r-lg hover:bg-amber-900/40"
                      title="Next Block"
                    >
                      Next →
                    </button>
                  </div>

                  {/* Expand / Collapse Full Wire Copy Drawer (Floating Overlay) */}
                  <button
                    type="button"
                    onClick={() => setIsAiBarExpanded((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                      isAiBarExpanded
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-750'
                    }`}
                  >
                    <span>{isAiBarExpanded ? '▲ Hide Copy' : '▼ View Full Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer border border-slate-700"
                    title="Change Topic"
                  >
                    <Wand2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── FLOATING DRAGGABLE WIRE COPY TELEPROMPTER WINDOW ─────────── */}
          {isAiBarExpanded && generatedPackage && generatedPackage.blocks[currentBlockIndex] && (
            <div
              style={{
                left: `${teleprompterPos.x}px`,
                top: `${teleprompterPos.y}px`,
              }}
              className="fixed z-50 w-[92vw] sm:w-[480px] md:w-[540px] bg-slate-950/95 border-2 border-amber-500/60 rounded-3xl shadow-2xl p-4 text-white space-y-3 backdrop-blur-md animate-scale-in max-h-[78vh] flex flex-col overflow-hidden"
            >
              {/* Draggable Header Bar */}
              <div
                onMouseDown={handleTeleprompterMouseDown}
                className="flex items-center justify-between border-b border-slate-800 pb-2.5 cursor-grab active:cursor-grabbing select-none bg-slate-900/60 -mx-4 -mt-4 p-3.5 rounded-t-3xl border-b border-slate-800/80"
              >
                <div className="flex items-center gap-2">
                  <GripHorizontal size={16} className="text-amber-400 opacity-90 animate-pulse" />
                  <span className="text-xs font-bold uppercase font-mono text-amber-400">
                    📜 Wire Copy · Step {currentBlockIndex + 1}/{generatedPackage.blocks.length} ({generatedPackage.blocks[currentBlockIndex].stepName})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Quick Dock Presets */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTeleprompterPos({ x: 20, y: 70 });
                    }}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    title="Snap to Top-Left"
                  >
                    ↖ Left
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTeleprompterPos({ x: Math.max(20, window.innerWidth - 560), y: 70 });
                    }}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    title="Snap to Top-Right"
                  >
                    ↗ Right
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAiBarExpanded(false);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable Copy Content */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {/* Exact Headline */}
                {generatedPackage.blocks[currentBlockIndex].headline && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Headline to Write:</span>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold font-broadsheet text-sm sm:text-base select-all tracking-tight shadow-inner">
                      {generatedPackage.blocks[currentBlockIndex].headline}
                    </div>
                  </div>
                )}

                {/* Exact Body Article */}
                {generatedPackage.blocks[currentBlockIndex].bodyText && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Article Content to Write:</span>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-stone-200 font-newsreader text-xs sm:text-sm leading-relaxed select-all whitespace-pre-line max-h-44 overflow-y-auto shadow-inner">
                      {generatedPackage.blocks[currentBlockIndex].bodyText}
                    </div>
                  </div>
                )}

                {/* Exact Interview Quote */}
                {generatedPackage.blocks[currentBlockIndex].quoteText && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400">Interview Quote:</span>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 italic font-broadsheet text-xs select-all shadow-inner">
                      "{generatedPackage.blocks[currentBlockIndex].quoteText}" — <span className="text-slate-300 font-normal">{generatedPackage.blocks[currentBlockIndex].quoteSpeaker}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs shrink-0">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Move size={11} className="text-amber-400" />
                  <span>Drag top header to move anywhere</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const b = generatedPackage.blocks[currentBlockIndex];
                      if (!b) return;
                      const fullCopy = `${b.headline ? b.headline + '\n\n' : ''}${
                        b.author ? 'By ' + b.author + '\n\n' : ''
                      }${b.bodyText ? b.bodyText + '\n\n' : ''}${
                        b.quoteText ? '"' + b.quoteText + '" — ' + b.quoteSpeaker : ''
                      }`;
                      navigator.clipboard?.writeText(fullCopy);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer flex items-center gap-1"
                  >
                    <Copy size={12} />
                    <span>Copy Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAiBarExpanded(false)}
                    className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Realistic Newspaper Canvas */}
          <SimpleNewspaperCanvas
            project={project}
            activePageIndex={activePageIndex}
            selectedElementId={selectedElementId}
            showGrid={showGrid}
            zoomLevel={zoomLevel}
            isFullWidth={isFullWidthCanvas}
            onSelectElement={(id) => setSelectedElementId(id)}
            onUpdateElement={handleUpdateElement}
            onUpdateElementContent={handleUpdateElementContent}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onMoveElementOrder={handleMoveElementOrder}
            onReorderElementToIndex={handleReorderElementToIndex}
            onSwapElements={handleSwapElements}
            onDropNewElement={(type, options) => handleAddElement(type, undefined, options)}
            onUploadImageToCloudinary={uploadImageToCloudinary}
          />

          {/* Floating Restore Panels Button when canvas is in full-width mode */}
          {isFullWidthCanvas && (
            <button
              type="button"
              onClick={() => setIsFullWidthCanvas(false)}
              className="absolute bottom-4 left-4 z-40 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-amber-300 hover:text-amber-200 border border-amber-500/50 shadow-2xl backdrop-blur-md text-xs font-bold flex items-center gap-1.5 cursor-pointer animate-fade-in transition-all"
            >
              <Maximize size={14} />
              <span>Show Panels (Standard Sheet)</span>
            </button>
          )}
        </div>

        {/* ─── RIGHT SIDEBAR: CONTEXTUAL CUSTOMIZATION INSPECTOR (STICKY) ─── */}
        <aside
          className={`w-80 h-full bg-slate-900 border-l border-slate-800 flex-col shrink-0 overflow-y-auto p-4 space-y-5 sticky right-0 top-0 z-30 transition-all duration-200 ${
            isFullWidthCanvas ? 'hidden' : 'flex'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders size={14} className="text-amber-500" />
              Element Inspector
            </h3>
            {selectedElement && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {selectedElement.type}
              </span>
            )}
          </div>

          {selectedElement ? (
            <div className="space-y-4 text-xs">
              {/* Column Width & Alignment Quick Presets */}
              <div className="space-y-1.5 pb-3 border-b border-slate-800">
                <label className="text-[11px] font-bold text-slate-400 block">
                  Column Width & Alignment:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateElement(selectedElement.id, { width: 100, x: 0 })}
                    className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      (selectedElement.width || 100) === 100
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Full Row (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateElement(selectedElement.id, { width: 50, x: 0 })}
                    className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      (selectedElement.width || 100) === 50 && (selectedElement.x || 0) === 0
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Left Half (50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateElement(selectedElement.id, { width: 50, x: 50 })}
                    className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      (selectedElement.width || 100) === 50 && (selectedElement.x || 0) === 50
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Right Half (50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateElement(selectedElement.id, { width: 33, x: 0 })}
                    className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      (selectedElement.width || 100) === 33
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    1/3 Col (33%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateElement(selectedElement.id, { width: 66, x: 0 })}
                    className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      (selectedElement.width || 100) === 66
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    2/3 Col (66%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateElement(selectedElement.id, { width: 25, x: 0 })}
                    className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      (selectedElement.width || 100) === 25
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    1/4 Col (25%)
                  </button>
                </div>
              </div>

              {/* Text / Title Edit */}
              {selectedElement.content.title !== undefined && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Headline / Title Text:
                  </label>
                  <input
                    type="text"
                    value={selectedElement.content.title}
                    onChange={(e) =>
                      handleUpdateElementContent(selectedElement.id, { title: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-serif"
                  />
                </div>
              )}

              {/* Author Byline */}
              {selectedElement.content.author !== undefined && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Author Byline:
                  </label>
                  <input
                    type="text"
                    value={selectedElement.content.author}
                    onChange={(e) =>
                      handleUpdateElementContent(selectedElement.id, { author: e.target.value })
                    }
                    placeholder="e.g. Alex Rivera, Staff Reporter"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              )}

              {/* Body Text */}
              {selectedElement.content.bodyText !== undefined && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Story Body Content:
                  </label>
                  <textarea
                    rows={6}
                    value={selectedElement.content.bodyText}
                    onChange={(e) =>
                      handleUpdateElementContent(selectedElement.id, { bodyText: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs leading-relaxed font-serif resize-none"
                  />
                </div>
              )}

              {/* Image URL, Cloudinary Upload & Resizing Options */}
              {selectedElement.content.imageUrl !== undefined && (
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 block">
                    Photo & Cloudinary Media:
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Upload size={14} />
                    <span>Upload to Cloudinary</span>
                  </button>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Image URL:</label>
                    <input
                      type="text"
                      value={selectedElement.content.imageUrl}
                      onChange={(e) =>
                        handleUpdateElementContent(selectedElement.id, { imageUrl: e.target.value })
                      }
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  {/* Photo Filters */}
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Photo Filter Finish:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(
                        [
                          { id: 'filter-halftone', label: 'Halftone Vintage' },
                          { id: 'filter-bw-contrast', label: 'B&W Newsprint' },
                          { id: 'filter-sepia-vintage', label: 'Sepia Antique' },
                          { id: 'none', label: 'Full Color' },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() =>
                            handleUpdateElementContent(selectedElement.id, { imageFilter: f.id })
                          }
                          className={`p-2 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                            (selectedElement.content.imageFilter || 'none') === f.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions: Duplicate & Delete */}
              <div className="pt-4 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDuplicateElement(selectedElement.id)}
                  className="btn-ghost flex-1 py-2 text-xs rounded-xl bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>Duplicate</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteElement(selectedElement.id)}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Type size={28} className="mx-auto opacity-30 text-slate-400" />
              <p className="text-xs">Click on any headline, article, or photo on the newspaper to customize its properties.</p>
            </div>
          )}
        </aside>
      </div>

      {/* ─── 3. BOTTOM MULTI-PAGE THUMBNAILS NAVIGATOR (STICKY) ─────────── */}
      <footer className="h-12 shrink-0 z-40 w-full bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Pages ({project.pages.length}):
          </span>

          {project.pages.map((p, idx) => {
            const isActive = activePageIndex === idx;

            return (
              <div key={p.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActivePageIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                  }`}
                >
                  Page {p.pageNumber}: {p.title}
                </button>

                {project.pages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePage(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer text-xs"
                    title="Delete Page"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddPage}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Plus size={13} />
            <span>Add Page</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
          <span>{project.pageSize} {project.orientation}</span>
        </div>
      </footer>

      {/* ─── 4. AI NEWSROOM TOPIC & SITUATION SELECTOR MODAL ───────────── */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card bg-slate-900 border border-purple-800/70 shadow-2xl max-w-2xl w-full text-white rounded-3xl animate-scale-in max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/40">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">AI Newsroom Topic & Mission Studio</h3>
                  <p className="text-xs text-purple-300">Generate journalistic situations, research briefs, and story missions.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Custom Prompt Generator Bar */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Enter Topic, Event, or Situation Keyword:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiCustomPrompt}
                    onChange={(e) => setAiCustomPrompt(e.target.value)}
                    placeholder="e.g. Robotics championship, solar eclipse, community garden, sports comeback..."
                    className="flex-1 p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!aiCustomPrompt) return;
                      setIsAiLoading(true);
                      setTimeout(() => {
                        setGeneratedPackage(generateStoryPackage(aiCustomPrompt));
                        setCurrentBlockIndex(0);
                        setIsAiLoading(false);
                      }, 300);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white cursor-pointer transition-all shadow-md shrink-0"
                  >
                    Generate Topic
                  </button>
                </div>
              </div>

              {/* Quick Pick Scenarios */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Or Pick a Real-World Scenario:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRELOADED_STORY_PACKAGES.map((pkg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setGeneratedPackage(pkg);
                        setCurrentBlockIndex(0);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        generatedPackage.topic === pkg.topic
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500 font-bold'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {pkg.topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOPIC SCENARIO BRIEF CARD */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                    SCENARIO RESEARCH BRIEF · {generatedPackage.category}
                  </span>
                  <span className="text-[10px] bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded-full font-mono font-bold">
                    {generatedPackage.blocks.length} Story Steps
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white font-broadsheet">
                  {generatedPackage.topic}
                </h4>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {generatedPackage.situation}
                </p>

                {generatedPackage.keyFacts && (
                  <div className="pt-1 flex flex-wrap gap-1.5 text-[11px] text-slate-400 font-mono">
                    {generatedPackage.keyFacts.map((fact, fIdx) => (
                      <span key={fIdx} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                        ✓ {fact}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* STORY MISSIONS OVERVIEW */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Sequential Story Missions Included:
                </span>
                <div className="space-y-1.5">
                  {generatedPackage.blocks.map((block, bIdx) => (
                    <div
                      key={block.id}
                      className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-300 text-[10px] font-bold flex items-center justify-center font-mono">
                          {bIdx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-200">{block.stepName}</div>
                          <div className="text-[10px] text-slate-400">{block.stepDescription}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer (Always Visible at Bottom) */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="btn-ghost text-xs py-2 px-4 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentBlockIndex(0);
                  setIsAiModalOpen(false);
                }}
                className="btn-primary text-xs py-2 px-5 font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <CheckCircle2 size={14} />
                <span>Set Active Story Mission & Start Writing</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. FULLSCREEN PREVIEW & EXPORT MODAL ─────────────────────────── */}
      <SimplePreviewModal
        project={project}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
