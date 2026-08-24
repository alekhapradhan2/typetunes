'use client';

import React, { useRef } from 'react';
import { NewspaperConfig } from '@/data/newspaperTemplates';
import { Sparkles, Calendar, MapPin, CloudSun, DollarSign, Award, Feather, ShieldAlert, CheckCircle2, Camera, Edit3 } from 'lucide-react';
import { typewriterAudio } from './NewspaperTypewriter';

interface NewspaperCanvasProps {
  config: NewspaperConfig;
  onChange?: (config: NewspaperConfig) => void;
  scale?: number;
  readOnly?: boolean;
  onSelectPhotoTab?: () => void;
}

export default function NewspaperCanvas({
  config,
  onChange,
  scale = 1,
  readOnly = false,
  onSelectPhotoTab,
}: NewspaperCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to update shallow or nested config
  const update = (updater: (prev: NewspaperConfig) => NewspaperConfig) => {
    if (onChange && !readOnly) {
      onChange(updater(config));
    }
  };

  const handlePhotoClick = () => {
    if (readOnly) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        update((prev) => ({
          ...prev,
          heroPhoto: {
            ...prev.heroPhoto,
            url: event.target?.result as string,
          },
        }));
        typewriterAudio.playBellRing();
      }
    };
    reader.readAsDataURL(file);
  };

  const getMastheadFontClass = () => {
    switch (config.masthead.font) {
      case 'gothic':
        return 'font-gothic';
      case 'pirata':
        return 'font-pirata';
      case 'broadsheet':
        return 'font-broadsheet';
      case 'cinzel':
        return 'font-cinzel';
      case 'special-elite':
        return 'font-special-elite';
      case 'typewriter':
        return 'font-typewriter';
      case 'newsreader':
      default:
        return 'font-newsreader';
    }
  };

  const getPaperClass = () => {
    switch (config.paper.theme) {
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

  const getPhotoFilterClass = () => {
    switch (config.heroPhoto.filter) {
      case 'halftone':
        return 'filter-halftone';
      case 'bw':
        return 'filter-bw-contrast';
      case 'sepia':
        return 'filter-sepia-vintage';
      case 'aged':
        return 'filter-aged-grain';
      case 'daguerreotype':
        return 'filter-daguerreotype';
      case 'none':
      default:
        return '';
    }
  };

  const getStampColorClass = () => {
    if (!config.stamp) return '';
    switch (config.stamp.color) {
      case 'red':
        return 'border-red-700 text-red-700 bg-red-900/10';
      case 'navy':
        return 'border-blue-900 text-blue-900 bg-blue-900/10';
      case 'gold':
        return 'border-amber-700 text-amber-800 bg-amber-600/10';
      case 'cyan':
        return 'border-cyan-400 text-cyan-400 bg-cyan-900/20';
      case 'black':
      default:
        return 'border-black text-black bg-black/5';
    }
  };

  const getBorderColor = () => {
    if (config.paper.theme === 'noir' || config.paper.theme === 'cyber') {
      return 'border-slate-700';
    }
    return 'border-[#2d251e]';
  };

  const editableClass = !readOnly
    ? 'outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 -mx-1 transition-colors cursor-text focus:ring-1 focus:ring-amber-600/50 focus:bg-amber-100/30'
    : '';

  return (
    <div
      id="printable-newspaper"
      className={`relative mx-auto w-full max-w-[960px] min-h-[1280px] p-6 sm:p-10 shadow-2xl transition-all duration-300 select-text overflow-hidden ${getPaperClass()}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Paper Crease Overlay */}
      {config.paper.showCreases && <div className="paper-crease-overlay" />}

      {/* Coffee Cup Ring Stain Overlay */}
      {config.paper.showCoffeeRing && (
        <div
          className="absolute top-24 right-12 w-36 h-36 rounded-full border-[10px] border-[#7a4b1c]/15 pointer-events-none mix-blend-multiply blur-[0.6px] rotate-45"
          style={{
            boxShadow: 'inset 0 0 15px rgba(122, 75, 28, 0.12), 0 0 6px rgba(122, 75, 28, 0.1)',
          }}
        />
      )}

      {/* Rubber Stamp Badge */}
      {config.stamp?.enabled && (
        <div
          className={`absolute top-16 right-8 z-30 px-5 py-2 border-4 border-dashed rounded-lg font-black uppercase tracking-widest text-lg md:text-xl transform pointer-events-none select-none shadow-sm ${getStampColorClass()}`}
          style={{
            transform: `rotate(${config.stamp.rotation}deg)`,
            fontFamily: 'var(--font-display)',
            textShadow: '0 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          {config.stamp.text}
        </div>
      )}

      {/* Outer Decorative Double Border */}
      <div className={`border-4 ${getBorderColor()} p-2 sm:p-3 relative`}>
        <div className={`border ${getBorderColor()} p-3 sm:p-4`}>

          {/* ─── 1. TOP ORNAMENTAL BANNER & BANNER BADGE ─── */}
          {config.masthead.bannerBadge && (
            <div className="flex justify-between items-center mb-1 pb-1 border-b border-current text-[11px] font-bold tracking-widest uppercase opacity-90">
              <span>★ ★ ★</span>
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    masthead: { ...prev.masthead, bannerBadge: e.currentTarget.textContent || '' },
                  }))
                }
                className={`bg-current text-white dark:text-black px-3 py-0.5 tracking-widest ${editableClass}`}
              >
                {config.masthead.bannerBadge}
              </span>
              <span>★ ★ ★</span>
            </div>
          )}

          {/* ─── 2. LATIN MOTTO & SUBMOTTO ─── */}
          <div
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={(e) =>
              update((prev) => ({
                ...prev,
                masthead: { ...prev.masthead, latinMotto: e.currentTarget.textContent || '' },
              }))
            }
            className={`text-center text-[11px] tracking-[0.2em] uppercase font-semibold opacity-75 mb-1 font-newsreader ${editableClass}`}
          >
            {config.masthead.latinMotto}
          </div>

          {/* ─── 3. MASTHEAD / NEWSPAPER TITLE ─── */}
          <div className="text-center my-2 relative py-2">
            <h1
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onBlur={(e) =>
                update((prev) => ({
                  ...prev,
                  masthead: { ...prev.masthead, title: e.currentTarget.textContent || '' },
                }))
              }
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none ${getMastheadFontClass()} ${editableClass}`}
              style={{
                letterSpacing: config.masthead.font === 'gothic' ? '0.04em' : '-0.02em',
                lineHeight: 0.95,
              }}
            >
              {config.masthead.title}
            </h1>
            <p
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onBlur={(e) =>
                update((prev) => ({
                  ...prev,
                  masthead: { ...prev.masthead, submotto: e.currentTarget.textContent || '' },
                }))
              }
              className={`mt-2 text-xs sm:text-sm italic font-newsreader opacity-85 ${editableClass}`}
            >
              {config.masthead.submotto}
            </p>
          </div>

          {/* ─── 4. METADATA HEADER BAR (Date, Vol, Issue, Price, Weather) ─── */}
          <div className="my-2 border-y-2 border-current py-1.5 px-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider font-newsreader">
            <div className="flex items-center gap-2">
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, city: e.currentTarget.textContent || '' },
                  }))
                }
                className={`font-bold ${editableClass}`}
              >
                {config.meta.city}
              </span>
              <span>•</span>
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, date: e.currentTarget.textContent || '' },
                  }))
                }
                className={editableClass}
              >
                {config.meta.date}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, volume: e.currentTarget.textContent || '' },
                  }))
                }
                className={editableClass}
              >
                {config.meta.volume}
              </span>
              <span>|</span>
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, issue: e.currentTarget.textContent || '' },
                  }))
                }
                className={editableClass}
              >
                {config.meta.issue}
              </span>
              <span>|</span>
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, edition: e.currentTarget.textContent || '' },
                  }))
                }
                className={`font-bold ${editableClass}`}
              >
                {config.meta.edition}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    meta: { ...prev.meta, price: e.currentTarget.textContent || '' },
                  }))
                }
                className={`bg-current text-white dark:text-black px-1.5 py-0.5 rounded font-black text-[10px] ${editableClass}`}
              >
                {config.meta.price}
              </span>
              <span className="text-[11px] flex items-center gap-1 opacity-90">
                <span>{config.meta.weather.icon}</span>
                <span
                  contentEditable={!readOnly}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    update((prev) => ({
                      ...prev,
                      meta: {
                        ...prev.meta,
                        weather: { ...prev.meta.weather, temp: e.currentTarget.textContent || '' },
                      },
                    }))
                  }
                  className={editableClass}
                >
                  {config.meta.weather.temp}
                </span>
              </span>
            </div>
          </div>

          {/* ─── 5. BREAKING NEWS RIBBON (Optional) ─── */}
          {config.breakingRibbon?.enabled && (
            <div className="my-2 bg-current text-white dark:text-black px-3 py-1.5 text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 text-center">
              <span className="animate-pulse font-black">▶ EXTRA:</span>
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    breakingRibbon: {
                      enabled: true,
                      text: e.currentTarget.textContent || '',
                    },
                  }))
                }
                className={`outline-none cursor-text ${editableClass}`}
              >
                {config.breakingRibbon.text}
              </span>
            </div>
          )}

          {/* ─── 6. MAIN FRONT-PAGE HEADLINE & DECK ─── */}
          <div className="my-4 text-center">
            <h2
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onBlur={(e) =>
                update((prev) => ({
                  ...prev,
                  mainArticle: { ...prev.mainArticle, headline: e.currentTarget.textContent || '' },
                }))
              }
              className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] font-broadsheet py-1 ${editableClass}`}
              style={{
                textWrap: 'balance',
              }}
            >
              {config.mainArticle.headline}
            </h2>
            <p
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onBlur={(e) =>
                update((prev) => ({
                  ...prev,
                  mainArticle: {
                    ...prev.mainArticle,
                    subheadline: e.currentTarget.textContent || '',
                  },
                }))
              }
              className={`mt-2 text-sm sm:text-lg italic font-newsreader max-w-4xl mx-auto opacity-90 leading-snug ${editableClass}`}
            >
              {config.mainArticle.subheadline}
            </p>
          </div>

          {/* ─── 7. BYLINE & DATELINE BAR ─── */}
          <div className="my-2 flex items-center justify-between border-b border-current pb-1.5 text-xs font-semibold tracking-wider font-newsreader uppercase opacity-85">
            <div>
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    mainArticle: { ...prev.mainArticle, byline: e.currentTarget.textContent || '' },
                  }))
                }
                className={editableClass}
              >
                {config.mainArticle.byline}
              </span>
            </div>
            <div>
              <span
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onBlur={(e) =>
                  update((prev) => ({
                    ...prev,
                    mainArticle: { ...prev.mainArticle, dateline: e.currentTarget.textContent || '' },
                  }))
                }
                className={`italic font-normal ${editableClass}`}
              >
                {config.mainArticle.dateline}
              </span>
            </div>
          </div>

          {/* ─── 8. HERO PHOTO SECTION ─── */}
          <div className="my-4">
            <div
              className={`relative overflow-hidden bg-neutral-900 group ${
                config.heroPhoto.showBorder ? 'p-1 border-2 border-current' : ''
              }`}
            >
              {/* Image Element with Click-to-Upload Overlay */}
              <div
                onClick={handlePhotoClick}
                className="relative w-full overflow-hidden bg-black flex items-center justify-center cursor-pointer"
                style={{
                  aspectRatio: config.heroPhoto.aspectRatio.replace('/', ' / '),
                  maxHeight: '440px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.heroPhoto.url}
                  alt={config.heroPhoto.caption || 'Newspaper Hero Photograph'}
                  className={`w-full h-full object-cover transition-all duration-300 ${getPhotoFilterClass()}`}
                />

                {/* Halftone Dot Overlay for vintage authenticity */}
                {config.heroPhoto.filter === 'halftone' && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
                      backgroundSize: '4px 4px',
                    }}
                  />
                )}

                {/* Hover Click to Upload Prompt */}
                {!readOnly && (
                  <div className="no-export absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 select-none pointer-events-none">
                    <Camera size={28} className="animate-bounce" />
                    <span className="text-xs font-bold uppercase tracking-wider bg-black/75 px-3 py-1 rounded-full">
                      Click to Change / Upload Photo 📸
                    </span>
                  </div>
                )}
              </div>

              {/* Photo Caption & Credits */}
              <div className="p-2 border-t border-current flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] font-newsreader">
                <span
                  contentEditable={!readOnly}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    update((prev) => ({
                      ...prev,
                      heroPhoto: {
                        ...prev.heroPhoto,
                        caption: e.currentTarget.textContent || '',
                      },
                    }))
                  }
                  className={`italic opacity-90 font-medium ${editableClass}`}
                >
                  {config.heroPhoto.caption}
                </span>
                <span
                  contentEditable={!readOnly}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    update((prev) => ({
                      ...prev,
                      heroPhoto: {
                        ...prev.heroPhoto,
                        credit: e.currentTarget.textContent || '',
                      },
                    }))
                  }
                  className={`text-[10px] uppercase font-bold tracking-wider opacity-75 shrink-0 ${editableClass}`}
                >
                  {config.heroPhoto.credit}
                </span>
              </div>
            </div>
          </div>

          {/* ─── 9. MULTI-COLUMN ARTICLE BODY & SIDEBARS ─── */}
          <div className="my-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Main Lead Story Columns (Spans 8 of 12 cols on desktop) */}
            <div className="md:col-span-8">
              <div
                className="gap-4 text-justify font-newsreader text-[13.5px] leading-relaxed"
                style={{
                  columnCount: config.mainArticle.columns,
                  columnRule: `1px solid ${config.paper.theme === 'noir' ? '#334155' : '#8c765c'}`,
                  columnGap: '1.25rem',
                }}
              >
                {/* Lead Paragraph */}
                <p
                  contentEditable={!readOnly}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    update((prev) => ({
                      ...prev,
                      mainArticle: {
                        ...prev.mainArticle,
                        leadParagraph: e.currentTarget.textContent || '',
                      },
                    }))
                  }
                  className={`mb-3 ${editableClass}`}
                >
                  {config.mainArticle.leadParagraph}
                </p>

                {/* Body Paragraphs */}
                {config.mainArticle.bodyParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newParas = [...config.mainArticle.bodyParagraphs];
                      newParas[idx] = e.currentTarget.textContent || '';
                      update((prev) => ({
                        ...prev,
                        mainArticle: {
                          ...prev.mainArticle,
                          bodyParagraphs: newParas,
                        },
                      }));
                    }}
                    className={`mb-3 indent-4 ${editableClass}`}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Secondary Stories inside the main section */}
              {config.secondaryStories.length > 0 && (
                <div className="mt-4 pt-3 border-t-2 border-current">
                  <div className="text-[11px] font-black uppercase tracking-widest mb-2 pb-1 border-b border-dashed border-current opacity-80 flex items-center gap-1">
                    <Feather size={12} />
                    <span>LATEST DISPATCHES & SPECIAL CORRESPONDENCE</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.secondaryStories.map((story, sIdx) => (
                      <div key={story.id} className="p-2 border border-current/30 rounded bg-black/5 dark:bg-white/5">
                        {story.category && (
                          <div
                            contentEditable={!readOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const newStories = [...config.secondaryStories];
                              newStories[sIdx].category = e.currentTarget.textContent || '';
                              update((prev) => ({ ...prev, secondaryStories: newStories }));
                            }}
                            className={`text-[9px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 ${editableClass}`}
                          >
                            {story.category}
                          </div>
                        )}
                        <h4
                          contentEditable={!readOnly}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newStories = [...config.secondaryStories];
                            newStories[sIdx].title = e.currentTarget.textContent || '';
                            update((prev) => ({ ...prev, secondaryStories: newStories }));
                          }}
                          className={`font-bold text-xs uppercase font-broadsheet mt-0.5 mb-1 leading-snug ${editableClass}`}
                        >
                          {story.title}
                        </h4>
                        {story.author && (
                          <div
                            contentEditable={!readOnly}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const newStories = [...config.secondaryStories];
                              newStories[sIdx].author = e.currentTarget.textContent || '';
                              update((prev) => ({ ...prev, secondaryStories: newStories }));
                            }}
                            className={`text-[10px] italic font-newsreader opacity-75 mb-1 ${editableClass}`}
                          >
                            {story.author}
                          </div>
                        )}
                        <p
                          contentEditable={!readOnly}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newStories = [...config.secondaryStories];
                            newStories[sIdx].snippet = e.currentTarget.textContent || '';
                            update((prev) => ({ ...prev, secondaryStories: newStories }));
                          }}
                          className={`text-[11.5px] font-newsreader leading-snug text-justify opacity-90 ${editableClass}`}
                        >
                          {story.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column: Editorial, Quote, Retro Ad, Barcode (Spans 4 of 12 cols) */}
            <div className="md:col-span-4 flex flex-col gap-4 border-t-2 md:border-t-0 md:border-l-2 border-current md:pl-4 pt-4 md:pt-0">
              
              {/* Editorial / Word From Editor */}
              {config.editorial && (
                <div className="border-b-2 border-current pb-3 font-newsreader">
                  <div className="text-[10px] font-black uppercase tracking-widest text-center border-y border-current py-0.5 mb-2">
                    EDITORIAL OPINION
                  </div>
                  <h4
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        editorial: {
                          ...prev.editorial,
                          title: e.currentTarget.textContent || '',
                        },
                      }))
                    }
                    className={`font-bold text-sm uppercase font-broadsheet text-center mb-1 ${editableClass}`}
                  >
                    {config.editorial.title}
                  </h4>
                  <p
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        editorial: {
                          ...prev.editorial,
                          text: e.currentTarget.textContent || '',
                        },
                      }))
                    }
                    className={`text-xs italic text-justify leading-relaxed opacity-90 ${editableClass}`}
                  >
                    {config.editorial.text}
                  </p>
                  <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        editorial: {
                          ...prev.editorial,
                          editorName: e.currentTarget.textContent || '',
                        },
                      }))
                    }
                    className={`text-right text-[10px] font-bold uppercase mt-1 opacity-75 ${editableClass}`}
                  >
                    — {config.editorial.editorName}
                  </div>
                </div>
              )}

              {/* Quote of the Day */}
              {config.quoteOfTheDay && (
                <div className="p-3 border-2 border-dashed border-current rounded text-center bg-black/5 dark:bg-white/5 font-newsreader">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-75 mb-1">
                    QUOTE OF THE DAY
                  </div>
                  <blockquote
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        quoteOfTheDay: {
                          ...prev.quoteOfTheDay,
                          quote: e.currentTarget.textContent || '',
                        },
                      }))
                    }
                    className={`text-xs italic font-medium leading-snug mb-1 ${editableClass}`}
                  >
                    {config.quoteOfTheDay.quote}
                  </blockquote>
                  <cite
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        quoteOfTheDay: {
                          ...prev.quoteOfTheDay,
                          author: e.currentTarget.textContent || '',
                        },
                      }))
                    }
                    className={`text-[10px] font-bold not-italic block uppercase opacity-80 ${editableClass}`}
                  >
                    {config.quoteOfTheDay.author}
                  </cite>
                </div>
              )}

              {/* Vintage Classified / Retro Advertisement */}
              {config.ad && (
                <div className="p-3 border-2 border-current bg-current/5 text-center font-newsreader relative">
                  <div className="text-[9px] font-black uppercase tracking-widest bg-current text-white dark:text-black py-0.5 px-2 inline-block mb-1">
                    ★ CLASSIFIED ADVERTISEMENT ★
                  </div>
                  <h5
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        ad: { ...prev.ad, title: e.currentTarget.textContent || '' },
                      }))
                    }
                    className={`font-black text-xs sm:text-sm uppercase font-broadsheet tracking-tight mt-1 mb-0.5 ${editableClass}`}
                  >
                    {config.ad.title}
                  </h5>
                  <p
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        ad: { ...prev.ad, tagline: e.currentTarget.textContent || '' },
                      }))
                    }
                    className={`text-[11px] font-bold italic mb-1 text-amber-900 dark:text-amber-300 ${editableClass}`}
                  >
                    {config.ad.tagline}
                  </p>
                  <p
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        ad: { ...prev.ad, body: e.currentTarget.textContent || '' },
                      }))
                    }
                    className={`text-[11px] leading-tight text-justify opacity-85 mb-2 ${editableClass}`}
                  >
                    {config.ad.body}
                  </p>
                  <div
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      update((prev) => ({
                        ...prev,
                        ad: { ...prev.ad, cta: e.currentTarget.textContent || '' },
                      }))
                    }
                    className={`text-[10px] font-black uppercase tracking-wider border-t border-current pt-1 ${editableClass}`}
                  >
                    {config.ad.cta}
                  </div>
                </div>
              )}

              {/* Vintage Barcode / Authentication Tag */}
              {config.paper.showBarcode && (
                <div className="mt-auto pt-2 border-t border-current/50 flex items-center justify-between text-[9px] opacity-75">
                  <div>
                    <div className="tracking-widest uppercase font-mono">CODE: TT-{config.id.toUpperCase()}-940</div>
                    <div className="font-mono text-[8px]">AUTHENTIC PRESS RELEASE ARCHIVE</div>
                  </div>
                  <div className="font-mono text-sm tracking-tighter font-black select-none">
                    ||| | |||| || ||| || ||||
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ─── 10. BOTTOM FOOTER BAR ─── */}
          <div className="mt-4 pt-2 border-t-2 border-current flex flex-wrap items-center justify-between text-[10px] uppercase tracking-wider font-semibold font-newsreader opacity-75">
            <div>
              <span>PRINTED & DISTRIBUTED BY THE INDEPENDENT NEWSPAPER SYNDICATE</span>
            </div>
            <div>
              <span>ALL RIGHTS RESERVED • REGISTERED HISTORICAL RECORD</span>
            </div>
            <div>
              <span>PAGE 1 OF 1</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
