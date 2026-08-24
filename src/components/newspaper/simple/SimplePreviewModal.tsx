'use client';

import React, { useState } from 'react';
import { NewspaperProject, CanvasElement } from '@/lib/newspaper/simpleTypes';
import {
  X,
  Printer,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

interface SimplePreviewModalProps {
  project: NewspaperProject;
  isOpen: boolean;
  onClose: () => void;
}

export default function SimplePreviewModal({
  project,
  isOpen,
  onClose,
}: SimplePreviewModalProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalPages = project.pages.length;
  const currentPage = project.pages[currentPageIndex] || project.pages[0];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render all elements of a page cleanly
  const renderElements = (elements: CanvasElement[]) => {
    return elements.map((el) => (
      <div
        key={el.id}
        style={{
          width: `${el.width !== undefined ? el.width : 100}%`,
          marginLeft: `${el.x || 0}%`,
          boxSizing: 'border-box',
        }}
        className="space-y-2 px-2"
      >
        {/* Masthead */}
        {el.type === 'masthead' && (
          <div className="text-center border-b-4 border-stone-900 pb-4 pt-1">
            <div className="text-[10px] uppercase font-mono tracking-widest text-stone-600 mb-1">
              {project.editionDate || 'Official Student Edition'} · {project.schoolName}
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold font-broadsheet tracking-tight uppercase text-stone-950">
              {el.content.title}
            </h1>
            <p className="text-xs italic font-newsreader mt-1 border-t border-stone-700 pt-1 text-stone-700">
              "{el.content.subtitle}"
            </p>
          </div>
        )}

        {/* Headline */}
        {el.type === 'headline' && (
          <div className="py-2 border-b-2 border-stone-800">
            <h2 className="text-2xl sm:text-4xl font-bold font-broadsheet leading-tight uppercase text-stone-950">
              {el.content.title}
            </h2>
            {el.content.author && (
              <div className="text-xs font-mono font-bold text-stone-700 mt-1">
                By {el.content.author}
              </div>
            )}
          </div>
        )}

        {/* Subheadline */}
        {el.type === 'subheadline' && (
          <div className="py-1">
            <h3 className="text-lg sm:text-xl font-bold italic font-newsreader leading-snug text-stone-800">
              {el.content.title}
            </h3>
          </div>
        )}

        {/* Paragraph / Article Text Box */}
        {el.type === 'paragraph' && (
          <div className="py-1">
            <p className="font-newsreader text-sm leading-relaxed text-stone-800 text-justify whitespace-pre-line">
              {el.content.bodyText}
            </p>
          </div>
        )}

        {/* Divider */}
        {el.type === 'divider' && (
          <div className="py-2 flex items-center gap-2">
            <div className="flex-1 border-t-2 border-stone-800" />
            <span className="text-[10px] text-stone-600 font-mono font-bold">★ ★ ★</span>
            <div className="flex-1 border-t-2 border-stone-800" />
          </div>
        )}

        {/* Main Story Block */}
        {el.type === 'main_story_block' && (
          <div className="space-y-3 pb-3 border-b border-stone-300">
            <h2 className="text-2xl sm:text-3xl font-bold font-broadsheet uppercase leading-tight text-stone-950">
              {el.content.title}
            </h2>
            {el.content.author && (
              <div className="text-xs font-mono font-bold text-stone-600">
                By {el.content.author}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {el.content.imageUrl && (
                <div className="md:col-span-5 space-y-1">
                  <img
                    src={el.content.imageUrl}
                    alt="Story"
                    className={`w-full max-h-72 object-cover border border-stone-800 ${
                      el.content.imageFilter || 'filter-halftone'
                    }`}
                  />
                  {el.content.imageCaption && (
                    <p className="text-[10px] font-newsreader italic text-stone-600">
                      {el.content.imageCaption}
                    </p>
                  )}
                </div>
              )}
              <div className={`${el.content.imageUrl ? 'md:col-span-7' : 'md:col-span-12'}`}>
                <p className="font-newsreader text-xs sm:text-sm leading-relaxed text-stone-800 text-justify whitespace-pre-line">
                  {el.content.bodyText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Story */}
        {el.type === 'secondary_story_block' && (
          <div className="p-3 bg-stone-100/60 border border-stone-300 space-y-1.5 rounded">
            <h3 className="text-base sm:text-lg font-bold font-broadsheet uppercase text-stone-900">
              {el.content.title}
            </h3>
            <p className="font-newsreader text-xs leading-relaxed text-stone-700 whitespace-pre-line text-justify">
              {el.content.bodyText}
            </p>
          </div>
        )}

        {/* Sports Block */}
        {el.type === 'sports_block' && (
          <div className="p-4 bg-stone-900 text-stone-100 space-y-2 rounded">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 border-b border-stone-800 pb-1">
              SPORTS ROUNDUP & RECAP
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-broadsheet uppercase text-white">
              {el.content.title}
            </h3>
            <p className="font-newsreader text-xs sm:text-sm leading-relaxed text-stone-300 whitespace-pre-line">
              {el.content.bodyText}
            </p>
          </div>
        )}

        {/* Opinion Block */}
        {el.type === 'opinion_block' && (
          <div className="p-4 bg-stone-200/60 border-l-4 border-stone-800 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
              EDITORIAL OPINION · {el.content.author || 'Guest Columnist'}
            </div>
            <h3 className="text-base font-bold font-broadsheet italic text-stone-900">
              {el.content.title}
            </h3>
            <p className="font-newsreader text-xs leading-relaxed text-stone-800 whitespace-pre-line text-justify">
              {el.content.bodyText}
            </p>
          </div>
        )}

        {/* Quote */}
        {el.type === 'quote' && (
          <div className="p-4 border-y-2 border-stone-800 text-center space-y-1">
            <div className="text-base sm:text-lg italic font-bold font-broadsheet text-stone-900">
              {el.content.quoteText}
            </div>
            {el.content.quoteSpeaker && (
              <div className="text-xs font-newsreader text-stone-600 font-semibold">
                — {el.content.quoteSpeaker}
              </div>
            )}
          </div>
        )}

        {/* Image */}
        {el.type === 'image' && el.content.imageUrl && (
          <div className="space-y-1">
            <img
              src={el.content.imageUrl}
              alt="Photo"
              style={{
                height: el.height ? `${Math.min(el.height, 450)}px` : undefined,
              }}
              className={`w-full max-h-80 object-cover border border-stone-800 ${
                el.content.imageFilter || 'none'
              }`}
            />
            {el.content.imageCaption && (
              <p className="text-[11px] font-newsreader italic text-stone-600">
                {el.content.imageCaption}
              </p>
            )}
          </div>
        )}

        {/* Weather Widget */}
        {el.type === 'weather_widget' && (
          <div className="p-3 bg-stone-100 border border-stone-300 text-xs font-mono flex items-center justify-between">
            <div>
              <div className="font-bold text-stone-900">{el.content.weatherCity || 'Forecast'}</div>
              <div className="text-[10px] text-stone-500">{el.content.weatherTemp || '72°F · Clear'}</div>
            </div>
            <div className="text-[10px] text-stone-600">{el.content.weatherForecast}</div>
          </div>
        )}

        {/* Ad Box */}
        {el.type === 'ad_box' && (
          <div className="p-4 border-2 border-dashed border-stone-600 text-center space-y-1 bg-stone-100/80">
            <div className="font-bold text-xs uppercase text-stone-900 font-serif">
              {el.content.adTitle}
            </div>
            <div className="text-[10px] text-stone-600 font-mono">
              {el.content.adText}
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      {/* ─── DEDICATED PRINT STYLESHEET ──────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          @page {
            size: portrait;
            margin: 10mm 12mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
          }
          body * {
            visibility: hidden !important;
          }
          #newspaper-print-area, #newspaper-print-area * {
            visibility: visible !important;
          }
          #newspaper-print-area {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }
          .newspaper-print-single-page {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            width: 100% !important;
            min-height: 96vh !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            padding: 0 0 16px 0 !important;
          }
          .newspaper-print-single-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ─── DEDICATED PRINT DOM CONTAINER (Visible ONLY during print) ────── */}
      <div id="newspaper-print-area" className="hidden print:block">
        {project.pages.map((page, pIdx) => (
          <div key={page.id || pIdx} className="newspaper-print-single-page space-y-4">
            <div className="flex flex-wrap items-start w-full gap-y-4 text-stone-900">
              {renderElements(page.elements)}
            </div>
          </div>
        ))}
      </div>

      {/* ─── ON-SCREEN INTERACTIVE PREVIEW MODAL ─────────────────────────── */}
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between overflow-y-auto p-4 sm:p-6 select-none no-print">
        {/* Top Floating Action Bar */}
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between bg-slate-900/95 border border-slate-700 px-5 py-3 rounded-2xl text-white shadow-2xl">
          <div>
            <h3 className="font-bold text-sm font-broadsheet">{project.title}</h3>
            <span className="text-[11px] text-slate-400">
              Page {currentPageIndex + 1} of {totalPages} ({currentPage.title})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="btn-ghost text-xs py-1.5 px-3 rounded-xl bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center gap-1"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary text-xs py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-lg"
            >
              <Download size={13} />
              <span>Download PDF / Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Center Realistic Newspaper Page on Screen */}
        <div className="my-6 flex items-center justify-center">
          <div
            className={`w-full max-w-[840px] min-h-[1050px] p-8 sm:p-14 shadow-2xl rounded-sm ${project.paperTexture} text-stone-900 flex flex-wrap items-start gap-y-6 select-text`}
          >
            {renderElements(currentPage.elements)}
          </div>
        </div>

        {/* Bottom Page Flip Bar */}
        {totalPages > 1 && (
          <div className="max-w-xs mx-auto flex items-center justify-between bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-2xl text-white shadow-xl">
            <button
              type="button"
              disabled={currentPageIndex === 0}
              onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-xs font-mono font-bold">
              Page {currentPageIndex + 1} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPageIndex === totalPages - 1}
              onClick={() => setCurrentPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
