'use client';

import { usePiano, SCALES } from '@/hooks/usePiano';
import type { SoundPack, MusicalScale } from '@/lib/types';
import { Music, Sliders, Volume2, Sparkles, Disc, Radio } from 'lucide-react';

const SOUND_PACKS: { id: SoundPack; name: string; desc: string; icon: string; tag: string }[] = [
  {
    id: 'piano',
    name: 'Concert Grand Piano',
    desc: 'Warm acoustic grand piano tones with harmonic richness and soft reverb decay.',
    icon: '🎹',
    tag: 'Classic',
  },
  {
    id: 'lofi-chime',
    name: 'Lo-Fi Crystal Chimes',
    desc: 'Shimmering sine bells with high harmonic resonance for deep focus and meditation.',
    icon: '✨',
    tag: 'Calm',
  },
  {
    id: 'synth-8bit',
    name: '8-Bit Retro Arcade Synth',
    desc: 'Punchy square-wave chip synths inspired by classic NES and Game Boy gaming.',
    icon: '👾',
    tag: 'Arcade',
  },
  {
    id: 'thock-mechanical',
    name: 'Thock Mechanical Switch',
    desc: 'Crisp tactile click transient paired with a deep bassy bottom-out key stroke.',
    icon: '⌨️',
    tag: 'ASMR',
  },
  {
    id: 'marimba',
    name: 'Zen Woody Marimba',
    desc: 'Organic wooden bars struck with soft mallets for a breezy, rhythmic cadence.',
    icon: '🪵',
    tag: 'Zen',
  },
];

const SCALES_CONFIG: { id: MusicalScale; name: string; desc: string; mood: string }[] = [
  {
    id: 'pentatonic-major',
    name: 'C Pentatonic Major',
    desc: 'Always harmonious. No dissonant intervals, creating effortlessly beautiful melodies.',
    mood: 'Peaceful & Warm',
  },
  {
    id: 'minor-melodic',
    name: 'D Minor Melodic',
    desc: 'Rich, cinematic, and emotional scale commonly used in film scores and neo-classical piano.',
    mood: 'Epic & Focus',
  },
  {
    id: 'japanese-insen',
    name: 'Japanese Insen Scale',
    desc: 'Traditional Japanese folk tuning with subtle exotic intervals and deep mindfulness vibes.',
    mood: 'Meditative',
  },
  {
    id: 'blues',
    name: 'Pentatonic Blues Scale',
    desc: 'Soulful flat-fifth blue notes that bring groove and dynamic rhythm to your typing.',
    mood: 'Soul & Groove',
  },
];

export default function SoundStudio() {
  const { settings, updateSettings, playKeystroke } = usePiano();

  const currentPack = settings.soundPack || 'piano';
  const currentScale = settings.scale || 'pentatonic-major';

  const handleSelectPack = (pack: SoundPack) => {
    updateSettings({ soundPack: pack });
    // Play test note
    setTimeout(() => playKeystroke(true), 40);
  };

  const handleSelectScale = (scale: MusicalScale) => {
    updateSettings({ scale: scale });
    setTimeout(() => playKeystroke(true), 40);
  };

  const handleTestKey = () => {
    playKeystroke(true);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Music className="text-sage-600" size={24} />
            Sound Engine & Musical Scale Studio
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Customize the auditory feedback of every single keystroke. Switch between acoustic pianos, retro 8-bit synths, and ASMR mechanical switches.
          </p>
        </div>

        {/* Live Audio Test Pad */}
        <button
          onClick={handleTestKey}
          className="px-5 py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-semibold text-xs transition-all shadow-md shadow-sage-200 flex items-center gap-2 self-start sm:self-auto cursor-pointer transform active:scale-95"
        >
          <Sparkles size={15} />
          Tap to Test Sound Note ♪
        </button>
      </div>

      {/* Sound Packs Grid */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Select Sound Synthesizer Pack
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SOUND_PACKS.map((pack) => {
            const isSelected = currentPack === pack.id;
            return (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(pack.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between shadow-2xs hover:shadow-sm ${
                  isSelected
                    ? 'bg-sage-50/90 border-sage-500 ring-2 ring-sage-400/40'
                    : 'bg-white/80 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl">{pack.icon}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-sage-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {pack.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">{pack.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pack.desc}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-xs">
                  <span className={isSelected ? 'text-sage-700 font-semibold' : 'text-slate-400'}>
                    {isSelected ? '✓ Active Sound' : 'Click to activate'}
                  </span>
                  <span className="text-[11px] text-slate-400">WebAudio 0ms</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Musical Scales Grid */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Select Musical Melody Scale
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCALES_CONFIG.map((scale) => {
            const isSelected = currentScale === scale.id;
            return (
              <button
                key={scale.id}
                onClick={() => handleSelectScale(scale.id)}
                className={`p-4 rounded-2xl border text-left transition-all shadow-2xs hover:shadow-sm ${
                  isSelected
                    ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-400/40'
                    : 'bg-white/80 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    {scale.mood}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-800">{scale.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {scale.desc}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                  <span className={isSelected ? 'text-purple-700 font-semibold' : 'text-slate-400'}>
                    {isSelected ? '✓ Active Scale' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
