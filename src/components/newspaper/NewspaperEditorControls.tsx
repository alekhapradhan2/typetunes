'use client';

import React, { useState } from 'react';
import {
  NewspaperConfig,
  FAMOUS_NEWSPAPERS,
  HISTORICAL_STORY_PACKS,
  VINTAGE_PHOTO_GALLERY,
  PhotoFilter,
  PaperTheme,
  MastheadFont,
} from '@/data/newspaperTemplates';
import {
  Sparkles,
  Layout,
  Type,
  Image as ImageIcon,
  Palette,
  Megaphone,
  Download,
  Printer,
  Upload,
  RefreshCw,
  Sliders,
  FileText,
  Stamp,
  Check,
} from 'lucide-react';
import { exportNewspaperElement, printNewspaper } from '@/lib/newspaperExporter';

interface NewspaperEditorControlsProps {
  config: NewspaperConfig;
  onChange: (config: NewspaperConfig) => void;
  onReset: () => void;
}

type TabType = 'templates' | 'text' | 'photo' | 'paper' | 'ads' | 'export';

export default function NewspaperEditorControls({
  config,
  onChange,
  onReset,
}: NewspaperEditorControlsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const found = FAMOUS_NEWSPAPERS.find((n) => n.id === templateId);
    if (found) {
      onChange(JSON.parse(JSON.stringify(found.template)));
    }
  };

  const handleStoryPackSelect = (storyId: string) => {
    const story = HISTORICAL_STORY_PACKS.find((s) => s.id === storyId);
    if (!story) return;

    onChange({
      ...config,
      meta: {
        ...config.meta,
        date: story.date,
        city: story.city,
      },
      mainArticle: {
        ...config.mainArticle,
        headline: story.headline,
        subheadline: story.subhead,
        leadParagraph: story.lead,
        bodyParagraphs: [...story.body],
      },
      heroPhoto: {
        ...config.heroPhoto,
        url: story.photoUrl,
        caption: story.photoCaption,
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange({
          ...config,
          heroPhoto: {
            ...config.heroPhoto,
            url: event.target.result,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerExport = async (format: 'png' | 'jpeg' | 'pdf') => {
    try {
      setIsExporting(true);
      setExportSuccessMsg(null);
      await exportNewspaperElement('printable-newspaper', {
        fileName: `${config.id || 'newspaper'}-custom-edition`,
        format,
        scale: 2.5,
      });
      setExportSuccessMsg(`Successfully generated and downloaded ${format.toUpperCase()}!`);
      setTimeout(() => setExportSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to generate export file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/90 overflow-x-auto scrollbar-none p-1.5 gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'templates'
              ? 'bg-sage-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <Layout size={14} />
          <span>Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'text'
              ? 'bg-sage-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <Type size={14} />
          <span>Headlines & Text</span>
        </button>

        <button
          onClick={() => setActiveTab('photo')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'photo'
              ? 'bg-sage-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <ImageIcon size={14} />
          <span>Photo Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('paper')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'paper'
              ? 'bg-sage-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <Palette size={14} />
          <span>Paper & FX</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'ads'
              ? 'bg-sage-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          <Megaphone size={14} />
          <span>Ads & Sidebars</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap font-bold ml-auto ${
            activeTab === 'export'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
        >
          <Download size={14} />
          <span>Download</span>
        </button>
      </div>

      {/* Tab Contents Container */}
      <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-slate-800 space-y-4 max-h-[75vh]">
        
        {/* ─── TAB 1: TEMPLATES & STORY PACKS ─── */}
        {activeTab === 'templates' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Layout size={16} className="text-sage-600" />
                <span>Famous Newspaper Presets</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Select an iconic historical or modern newspaper format:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FAMOUS_NEWSPAPERS.map((np) => (
                  <button
                    key={np.id}
                    onClick={() => handleTemplateSelect(np.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      config.id === np.id
                        ? 'border-sage-500 bg-sage-50/80 shadow-md ring-2 ring-sage-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{np.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {np.era}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {np.description}
                    </p>
                    {config.id === np.id && (
                      <span className="absolute bottom-2 right-2 text-sage-600">
                        <Check size={16} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Story Packs */}
            <div className="pt-3 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Sparkles size={16} className="text-amber-500" />
                <span>Historic & Sensational Story Packs</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Populate your newspaper with historic breaking headlines:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HISTORICAL_STORY_PACKS.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => handleStoryPackSelect(story.id)}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-left transition-colors flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-bold text-slate-800">{story.name}</span>
                    <span className="text-[11px] text-slate-500 truncate">{story.headline}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: HEADLINES & TEXT ─── */}
        {activeTab === 'text' && (
          <div className="space-y-4 text-xs">
            {/* Masthead Controls */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <Type size={14} className="text-sage-600" />
                <span>Masthead & Header Branding</span>
              </h4>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Newspaper Title
                </label>
                <input
                  type="text"
                  value={config.masthead.title}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      masthead: { ...config.masthead, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Masthead Font Style
                  </label>
                  <select
                    value={config.masthead.font}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        masthead: { ...config.masthead, font: e.target.value as MastheadFont },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="gothic">Gothic Old English (Vintage 1920s)</option>
                    <option value="pirata">Bold Pirate / Tabloid (Daily Bugle)</option>
                    <option value="broadsheet">Playfair Classic Broadsheet</option>
                    <option value="cinzel">Cinzel Imperial Serif (Victorian)</option>
                    <option value="special-elite">Special Elite Noir Typewriter</option>
                    <option value="typewriter">Courier Prime Monospace</option>
                    <option value="newsreader">Newsreader Editorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Banner Badge
                  </label>
                  <input
                    type="text"
                    value={config.masthead.bannerBadge || ''}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        masthead: { ...config.masthead, bannerBadge: e.target.value },
                      })
                    }
                    placeholder="e.g. LATE CITY EDITION"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Tagline / Submotto
                </label>
                <input
                  type="text"
                  value={config.masthead.submotto}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      masthead: { ...config.masthead, submotto: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Latin / Official Motto
                </label>
                <input
                  type="text"
                  value={config.masthead.latinMotto}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      masthead: { ...config.masthead, latinMotto: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Meta bar: Date, City, Price */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Publication Metadata</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">City / Origin</label>
                  <input
                    type="text"
                    value={config.meta.city}
                    onChange={(e) =>
                      onChange({ ...config, meta: { ...config.meta, city: e.target.value } })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date</label>
                  <input
                    type="text"
                    value={config.meta.date}
                    onChange={(e) =>
                      onChange({ ...config, meta: { ...config.meta, date: e.target.value } })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Price</label>
                  <input
                    type="text"
                    value={config.meta.price}
                    onChange={(e) =>
                      onChange({ ...config, meta: { ...config.meta, price: e.target.value } })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Volume</label>
                  <input
                    type="text"
                    value={config.meta.volume}
                    onChange={(e) =>
                      onChange({ ...config, meta: { ...config.meta, volume: e.target.value } })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Issue</label>
                  <input
                    type="text"
                    value={config.meta.issue}
                    onChange={(e) =>
                      onChange({ ...config, meta: { ...config.meta, issue: e.target.value } })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Weather</label>
                  <input
                    type="text"
                    value={config.meta.weather.temp}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        meta: {
                          ...config.meta,
                          weather: { ...config.meta.weather, temp: e.target.value },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Breaking Ribbon */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Breaking News Alert Ribbon</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={config.breakingRibbon?.enabled || false}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        breakingRibbon: {
                          enabled: e.target.checked,
                          text: config.breakingRibbon?.text || 'EXTRA: SPECIAL HISTORIC BULLETIN',
                        },
                      })
                    }
                    className="rounded text-sage-600"
                  />
                  <span>Show Ribbon</span>
                </label>
              </div>
              {config.breakingRibbon?.enabled && (
                <input
                  type="text"
                  value={config.breakingRibbon.text}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      breakingRibbon: { ...config.breakingRibbon!, text: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              )}
            </div>

            {/* Main Lead Story */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Hero Article & Story Content</h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Main Headline</label>
                <textarea
                  rows={2}
                  value={config.mainArticle.headline}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      mainArticle: { ...config.mainArticle, headline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Sub-headline / Deck</label>
                <textarea
                  rows={2}
                  value={config.mainArticle.subheadline}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      mainArticle: { ...config.mainArticle, subheadline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Byline (Author)</label>
                  <input
                    type="text"
                    value={config.mainArticle.byline}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        mainArticle: { ...config.mainArticle, byline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Dateline</label>
                  <input
                    type="text"
                    value={config.mainArticle.dateline}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        mainArticle: { ...config.mainArticle, dateline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Columns & Dropcap */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Article Columns</label>
                  <select
                    value={config.mainArticle.columns}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        mainArticle: { ...config.mainArticle, columns: Number(e.target.value) },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value={1}>1 Column</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns (Standard Broadsheet)</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={config.mainArticle.showDropCap}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          mainArticle: { ...config.mainArticle, showDropCap: e.target.checked },
                        })
                      }
                      className="rounded text-sage-600"
                    />
                    <span>Illuminated Drop Cap</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Lead Paragraph (First sentence / opening)
                </label>
                <textarea
                  rows={3}
                  value={config.mainArticle.leadParagraph}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      mainArticle: { ...config.mainArticle, leadParagraph: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-serif"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Main Body Paragraphs (One per line)
                </label>
                <textarea
                  rows={5}
                  value={config.mainArticle.bodyParagraphs.join('\n\n')}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      mainArticle: {
                        ...config.mainArticle,
                        bodyParagraphs: e.target.value.split('\n\n').filter(Boolean),
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-serif"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: PHOTO STUDIO ─── */}
        {activeTab === 'photo' && (
          <div className="space-y-4 text-xs">
            {/* Custom Photo Upload */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Upload size={14} className="text-sage-600" />
                <span>Upload Custom Photo</span>
              </h4>
              <p className="text-slate-500 text-[11px]">
                Upload any picture to feature as the front-page hero image:
              </p>
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition-colors group">
                <Upload size={22} className="text-slate-400 group-hover:text-sage-600 transition-colors" />
                <span className="mt-1.5 font-semibold text-slate-700 text-xs">
                  Choose an image or drop file here
                </span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WebP supported</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Vintage Filter Picker */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sliders size={14} className="text-sage-600" />
                <span>Authentic Print Filters</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'halftone', label: 'Halftone Dots', desc: 'Screen print texture' },
                  { id: 'bw', label: '1930s B&W', desc: 'High contrast' },
                  { id: 'sepia', label: 'Aged Sepia', desc: '1920s warmth' },
                  { id: 'daguerreotype', label: 'Daguerreotype', desc: 'Victorian plate' },
                  { id: 'aged', label: 'Vintage Grain', desc: 'Dust & grain' },
                  { id: 'none', label: 'Modern Color', desc: 'No filter' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() =>
                      onChange({
                        ...config,
                        heroPhoto: { ...config.heroPhoto, filter: filter.id as PhotoFilter },
                      })
                    }
                    className={`p-2 rounded-lg border text-left transition-all ${
                      config.heroPhoto.filter === filter.id
                        ? 'border-sage-500 bg-sage-50 font-bold text-sage-800 ring-1 ring-sage-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs">{filter.label}</div>
                    <div className="text-[9px] text-slate-500 font-normal">{filter.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect ratio & captions */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Aspect Ratio</label>
                  <select
                    value={config.heroPhoto.aspectRatio}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        heroPhoto: {
                          ...config.heroPhoto,
                          aspectRatio: e.target.value as '16/9' | '4/3' | '1/1' | '3/4' | '21/9',
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="16/9">16:9 Landscape</option>
                    <option value="4/3">4:3 Classic Photo</option>
                    <option value="1/1">1:1 Square</option>
                    <option value="3/4">3:4 Portrait</option>
                    <option value="21/9">21:9 Ultra Panoramic</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={config.heroPhoto.showBorder}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          heroPhoto: { ...config.heroPhoto, showBorder: e.target.checked },
                        })
                      }
                      className="rounded text-sage-600"
                    />
                    <span>Photo Frame Border</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Photo Caption</label>
                <input
                  type="text"
                  value={config.heroPhoto.caption}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      heroPhoto: { ...config.heroPhoto, caption: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Photographer Credit</label>
                <input
                  type="text"
                  value={config.heroPhoto.credit}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      heroPhoto: { ...config.heroPhoto, credit: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Archive Photo Gallery */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Or Pick From Historic Archive:</h4>
              <div className="grid grid-cols-4 gap-2">
                {VINTAGE_PHOTO_GALLERY.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      onChange({
                        ...config,
                        heroPhoto: {
                          ...config.heroPhoto,
                          url: img.url,
                          credit: img.credit,
                        },
                      })
                    }
                    className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-sage-500 transition-all group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[8px] text-white p-0.5 truncate">
                      {img.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: PAPER & STYLING ─── */}
        {activeTab === 'paper' && (
          <div className="space-y-4 text-xs">
            {/* Paper Theme Picker */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Palette size={14} className="text-sage-600" />
                <span>Paper Age & Texture Style</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'aged', name: 'Aged Parchment', bg: '#f4ebd9', desc: '1920s Yellow' },
                  { id: 'newsprint', name: 'Classic Newsprint', bg: '#ede8dc', desc: 'Standard Grey' },
                  { id: 'sepia', name: 'Warm Sepia', bg: '#ebd8bd', desc: 'Antique Brown' },
                  { id: 'clean', name: 'Crisp White', bg: '#fdfcf9', desc: 'Modern Clean' },
                  { id: 'noir', name: 'Noir Dark Press', bg: '#16181d', desc: 'Midnight Dark' },
                  { id: 'cyber', name: 'Cyber Neon Matrix', bg: '#0c1017', desc: '2088 Future' },
                ].map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() =>
                      onChange({
                        ...config,
                        paper: { ...config.paper, theme: paper.id as PaperTheme },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      config.paper.theme === paper.id
                        ? 'border-sage-500 shadow-md ring-2 ring-sage-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-inner shrink-0"
                      style={{ backgroundColor: paper.bg }}
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-xs">{paper.name}</div>
                      <div className="text-[10px] text-slate-500">{paper.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Overlays & Physical Effects */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Physical Paper Overlays</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-semibold p-2 bg-white rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    checked={config.paper.showCreases}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        paper: { ...config.paper, showCreases: e.target.checked },
                      })
                    }
                    className="rounded text-sage-600"
                  />
                  <span>Fold Creases</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold p-2 bg-white rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    checked={config.paper.showCoffeeRing}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        paper: { ...config.paper, showCoffeeRing: e.target.checked },
                      })
                    }
                    className="rounded text-sage-600"
                  />
                  <span>Coffee Ring Stain</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold p-2 bg-white rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    checked={config.paper.showBarcode}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        paper: { ...config.paper, showBarcode: e.target.checked },
                      })
                    }
                    className="rounded text-sage-600"
                  />
                  <span>Vintage Barcode</span>
                </label>
              </div>
            </div>

            {/* Rubber Stamp Controls */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                  <Stamp size={14} className="text-red-600" />
                  <span>Rubber Official Stamp</span>
                </h4>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={config.stamp?.enabled || false}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        stamp: {
                          enabled: e.target.checked,
                          text: config.stamp?.text || 'TOP SECRET',
                          color: config.stamp?.color || 'red',
                          rotation: config.stamp?.rotation || -12,
                        },
                      })
                    }
                    className="rounded text-sage-600"
                  />
                  <span>Enable Stamp</span>
                </label>
              </div>

              {config.stamp?.enabled && (
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Stamp Text</label>
                    <input
                      type="text"
                      value={config.stamp.text}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          stamp: { ...config.stamp!, text: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg uppercase font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Color</label>
                      <select
                        value={config.stamp.color}
                        onChange={(e) =>
                          onChange({
                            ...config,
                            stamp: {
                              ...config.stamp!,
                              color: e.target.value as 'red' | 'navy' | 'black' | 'gold' | 'cyan',
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="red">Blood Red</option>
                        <option value="navy">Navy Blue</option>
                        <option value="gold">Gold Seal</option>
                        <option value="cyan">Cyber Cyan</option>
                        <option value="black">Ink Black</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Angle ({config.stamp.rotation}°)
                      </label>
                      <input
                        type="range"
                        min={-45}
                        max={45}
                        value={config.stamp.rotation}
                        onChange={(e) =>
                          onChange({
                            ...config,
                            stamp: { ...config.stamp!, rotation: Number(e.target.value) },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 5: ADS & SIDEBARS ─── */}
        {activeTab === 'ads' && (
          <div className="space-y-4 text-xs">
            {/* Retro Classified Ad */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Megaphone size={14} className="text-amber-600" />
                <span>Vintage Classified Advertisement</span>
              </h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ad Title</label>
                <input
                  type="text"
                  value={config.ad.title}
                  onChange={(e) =>
                    onChange({ ...config, ad: { ...config.ad, title: e.target.value } })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ad Tagline</label>
                <input
                  type="text"
                  value={config.ad.tagline}
                  onChange={(e) =>
                    onChange({ ...config, ad: { ...config.ad, tagline: e.target.value } })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ad Body</label>
                <textarea
                  rows={2}
                  value={config.ad.body}
                  onChange={(e) =>
                    onChange({ ...config, ad: { ...config.ad, body: e.target.value } })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Call to Action (CTA)</label>
                <input
                  type="text"
                  value={config.ad.cta}
                  onChange={(e) =>
                    onChange({ ...config, ad: { ...config.ad, cta: e.target.value } })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>
            </div>

            {/* Editorial Column */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Editorial Opinion Column</h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Editorial Title</label>
                <input
                  type="text"
                  value={config.editorial.title}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      editorial: { ...config.editorial, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Editor Name</label>
                <input
                  type="text"
                  value={config.editorial.editorName}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      editorial: { ...config.editorial, editorName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Editorial Text</label>
                <textarea
                  rows={3}
                  value={config.editorial.text}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      editorial: { ...config.editorial, text: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Quote of the Day */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Quote of the Day Box</h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Quote</label>
                <textarea
                  rows={2}
                  value={config.quoteOfTheDay.quote}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      quoteOfTheDay: { ...config.quoteOfTheDay, quote: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Author</label>
                <input
                  type="text"
                  value={config.quoteOfTheDay.author}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      quoteOfTheDay: { ...config.quoteOfTheDay, author: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 6: DOWNLOAD & EXPORT ─── */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-950">
              <h3 className="font-bold text-sm flex items-center gap-1.5 mb-1">
                <Download size={16} className="text-amber-700" />
                <span>Download Your Custom Newspaper</span>
              </h3>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                Export your creation in ultra-high resolution ready for physical printing, poster framing, or sharing across social channels.
              </p>
            </div>

            {exportSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>{exportSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* High-Res PNG */}
              <button
                disabled={isExporting}
                onClick={() => triggerExport('png')}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow transition-all text-left flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">PNG Image (Ultra HD)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Lossless high-resolution graphic with authentic paper texture & crisp text rendering.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-sage-700 group-hover:text-sage-800">
                  <Download size={14} />
                  <span>Download PNG File</span>
                </div>
              </button>

              {/* PDF Document */}
              <button
                disabled={isExporting}
                onClick={() => triggerExport('pdf')}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow transition-all text-left flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">PDF Document (A4 / Broadsheet)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Print Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Standard document format calibrated for desktop printers and commercial presses.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:text-blue-800">
                  <Download size={14} />
                  <span>Download PDF File</span>
                </div>
              </button>

              {/* High-Quality JPEG */}
              <button
                disabled={isExporting}
                onClick={() => triggerExport('jpeg')}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow transition-all text-left flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">JPEG Image (Web Optimized)</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Compact file size ideal for social media sharing and email attachments.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-slate-900">
                  <Download size={14} />
                  <span>Download JPEG File</span>
                </div>
              </button>

              {/* Direct Print */}
              <button
                onClick={printNewspaper}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow transition-all text-left flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">Direct Print</span>
                    <Printer size={16} className="text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Trigger your browser&apos;s physical printer dialog with edge-to-edge formatting.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-slate-900">
                  <Printer size={14} />
                  <span>Open Print Dialog</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Reset & Helper Bar */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-slate-600 hover:text-red-600 transition-colors font-medium"
        >
          <RefreshCw size={12} />
          <span>Reset All Defaults</span>
        </button>

        <span className="text-[11px] italic">
          Click any text on the newspaper preview or edit in the control panel.
        </span>
      </div>
    </div>
  );
}
