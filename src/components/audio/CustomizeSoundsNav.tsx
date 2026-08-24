'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Volume2, VolumeX, Volume1, ChevronDown, Sliders, Check, Sparkles } from 'lucide-react';
import { usePiano } from '@/hooks/usePiano';
import type { SoundPack, MusicalScale } from '@/lib/types';

const SOUND_PACK_OPTIONS: { id: SoundPack; name: string; icon: string; tag: string; desc: string }[] = [
  { id: 'piano', name: 'Concert Piano', icon: '🎹', tag: 'Acoustic', desc: 'Warm acoustic grand piano tones' },
  { id: 'lofi-chime', name: 'Lo-Fi Chimes', icon: '✨', tag: 'Crystal', desc: 'Sparkling celestial sine bell chime' },
  { id: 'synth-8bit', name: '8-Bit Synth', icon: '👾', tag: 'Retro', desc: 'Vintage square-wave arcade chip' },
  { id: 'thock-mechanical', name: 'Thock Switch', icon: '⌨️', tag: 'ASMR', desc: 'Creamy tactile mechanical switch thock' },
  { id: 'marimba', name: 'Zen Marimba', icon: '🪵', tag: 'Woody', desc: 'Resonant wooden mallet percussions' },
];

const SCALE_OPTIONS: { id: MusicalScale; name: string; mood: string }[] = [
  { id: 'pentatonic-major', name: 'C Major Pentatonic', mood: 'Peaceful' },
  { id: 'minor-melodic', name: 'D Minor Melodic', mood: 'Cinematic' },
  { id: 'japanese-insen', name: 'Japanese Insen', mood: 'Meditative' },
  { id: 'blues', name: 'Blues Scale', mood: 'Groovy' },
];

export default function CustomizeSoundsNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { settings, updateSettings, playKeystroke } = usePiano();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMute = useCallback(() => {
    updateSettings({ muted: !settings.muted });
  }, [settings.muted, updateSettings]);

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      updateSettings({ volume: v, muted: v === 0 });
    },
    [updateSettings]
  );

  const VolumeIcon =
    settings.muted || settings.volume === 0
      ? VolumeX
      : settings.volume < 0.5
      ? Volume1
      : Volume2;

  const currentPack = settings.soundPack || 'piano';
  const currentPackMeta = SOUND_PACK_OPTIONS.find((p) => p.id === currentPack) || SOUND_PACK_OPTIONS[0];

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      {/* Navbar Button labeled "Customize Sounds" */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-2xs ${
          isOpen
            ? 'bg-sage-600 text-white border-sage-600 shadow-sm'
            : 'bg-white/80 hover:bg-white text-slate-700 hover:text-sage-800 border-slate-200/80 hover:border-sage-200'
        }`}
        aria-expanded={isOpen}
        aria-label="Customize typing sounds and music synthesizer"
      >
        <span className="text-base leading-none">{currentPackMeta.icon}</span>
        <span className="whitespace-nowrap font-medium text-xs">Sounds: {currentPackMeta.name}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-slate-400'}`}
        />
      </button>

      {/* Floating Sound Customizer Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-88 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-4 z-[100] animate-scale-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders size={14} className="text-sage-600" />
                Customize Audio & Synthesizers
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">Applies globally across all tests & games</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sage-100 text-sage-800 font-semibold">
              Live Engine
            </span>
          </div>

          {/* Volume Control Row */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-slate-600 hover:text-sage-700 hover:bg-white transition-all cursor-pointer"
              title={settings.muted ? 'Unmute sound' : 'Mute sound'}
            >
              <VolumeIcon size={18} />
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.muted ? 0 : settings.volume}
              onChange={handleVolume}
              className="w-full h-1.5 appearance-none rounded-full cursor-pointer bg-slate-200 accent-sage-600 focus:outline-none"
            />

            <span className="text-xs font-mono font-semibold text-slate-600 min-w-[36px] text-right">
              {settings.muted ? '0%' : `${Math.round(settings.volume * 100)}%`}
            </span>
          </div>

          {/* Sound Packs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Sound Pack
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {SOUND_PACK_OPTIONS.map((pack) => {
                const isSelected = currentPack === pack.id;
                return (
                  <button
                    key={pack.id}
                    onClick={() => {
                      updateSettings({ soundPack: pack.id });
                      playKeystroke(true);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-sage-50 text-sage-900 border border-sage-300 shadow-2xs font-bold'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{pack.icon}</span>
                      <div>
                        <div className="font-semibold text-slate-800">{pack.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{pack.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-normal">
                        {pack.tag}
                      </span>
                      {isSelected && <Check size={15} className="text-sage-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scales */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Musical Melody Scale
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {SCALE_OPTIONS.map((scale) => {
                const isSelected = (settings.scale || 'pentatonic-major') === scale.id;
                return (
                  <button
                    key={scale.id}
                    onClick={() => {
                      updateSettings({ scale: scale.id });
                      playKeystroke(true);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all text-left truncate cursor-pointer ${
                      isSelected
                        ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <span className="block truncate font-semibold">{scale.name}</span>
                    <span className="text-[9px] text-slate-400 font-normal">{scale.mood}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
