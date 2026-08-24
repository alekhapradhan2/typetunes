'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Music, ChevronDown, Sparkles, Sliders, Check } from 'lucide-react';
import type { AudioSettings, SoundPack, MusicalScale } from '@/lib/types';

interface AudioControlsProps {
  settings: AudioSettings;
  onUpdate: (patch: Partial<AudioSettings>) => void;
  dropdownDirection?: 'up' | 'down';
  compact?: boolean;
}

const SOUND_PACK_OPTIONS: { id: SoundPack; name: string; icon: string; tag: string }[] = [
  { id: 'piano', name: 'Concert Piano', icon: '🎹', tag: 'Acoustic' },
  { id: 'lofi-chime', name: 'Lo-Fi Chimes', icon: '✨', tag: 'Crystal' },
  { id: 'synth-8bit', name: '8-Bit Synth', icon: '👾', tag: 'Retro' },
  { id: 'thock-mechanical', name: 'Thock Switch', icon: '⌨️', tag: 'ASMR' },
  { id: 'marimba', name: 'Zen Marimba', icon: '🪵', tag: 'Woody' },
];

const SCALE_OPTIONS: { id: MusicalScale; name: string; mood: string }[] = [
  { id: 'pentatonic-major', name: 'C Major Pentatonic', mood: 'Peaceful' },
  { id: 'minor-melodic', name: 'D Minor Melodic', mood: 'Cinematic' },
  { id: 'japanese-insen', name: 'Japanese Insen', mood: 'Meditative' },
  { id: 'blues', name: 'Blues Scale', mood: 'Groovy' },
];

export default function AudioControls({
  settings,
  onUpdate,
  dropdownDirection = 'up',
  compact = false,
}: AudioControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMute = useCallback(() => {
    onUpdate({ muted: !settings.muted });
  }, [settings.muted, onUpdate]);

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      onUpdate({ volume: v, muted: v === 0 });
    },
    [onUpdate]
  );

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
      <div
        className="flex items-center gap-2 bg-slate-50/90 border border-slate-200/80 rounded-2xl px-3 py-1.5 shadow-2xs"
        aria-label="Audio & Sound pack settings"
        role="group"
      >
        {/* Mute Button */}
        <button
          id="audio-mute-btn"
          onClick={toggleMute}
          className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-600 hover:text-sage-700 hover:bg-sage-100 transition-all flex-shrink-0"
          aria-label={settings.muted ? 'Unmute sound' : 'Mute sound'}
          aria-pressed={settings.muted}
          title={settings.muted ? 'Unmute' : 'Mute'}
        >
          <VolumeIcon size={17} />
        </button>

        {/* Volume Slider */}
        <input
          id="audio-volume-slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={settings.muted ? 0 : settings.volume}
          onChange={handleVolume}
          className="w-16 sm:w-20 h-1.5 appearance-none rounded-full cursor-pointer bg-slate-200 accent-sage-600 focus:outline-none"
          aria-label="Volume slider"
        />

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Sound Pack Config Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 hover:bg-sage-50 text-slate-700 hover:text-sage-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          title="Customize Sound Synthesizer & Scales"
        >
          <span>{currentPackMeta.icon}</span>
          <span className="hidden sm:inline">{currentPackMeta.name}</span>
          <ChevronDown size={13} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Floating Sound Customizer Popover Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-4 z-[100] animate-scale-in space-y-3.5 ${
            dropdownDirection === 'down' ? 'top-full mt-2.5' : 'bottom-full mb-2.5'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders size={14} className="text-sage-600" />
              Keystroke Audio Engine
            </span>
            <span className="text-[10px] font-mono text-slate-400">WebAudio 0ms</span>
          </div>

          {/* Sound Packs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Sound Synthesizer Pack
            </span>
            <div className="grid grid-cols-1 gap-1">
              {SOUND_PACK_OPTIONS.map((pack) => {
                const isSelected = currentPack === pack.id;
                return (
                  <button
                    key={pack.id}
                    onClick={() => {
                      onUpdate({ soundPack: pack.id });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isSelected
                        ? 'bg-sage-50 text-sage-800 border border-sage-300 shadow-2xs font-bold'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{pack.icon}</span>
                      <span>{pack.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        {pack.tag}
                      </span>
                      {isSelected && <Check size={14} className="text-sage-600" />}
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
                    onClick={() => onUpdate({ scale: scale.id })}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left truncate ${
                      isSelected
                        ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <span className="block truncate">{scale.name}</span>
                    <span className="text-[9px] text-slate-400">{scale.mood}</span>
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
