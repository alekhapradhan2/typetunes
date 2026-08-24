'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Bell, Type } from 'lucide-react';

interface TypewriterSoundProps {
  enabled?: boolean;
  onToggleSound?: (enabled: boolean) => void;
}

// Web Audio API Synthesizer for Authentic Mechanical Typewriter Sounds
class TypewriterAudioEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Mechanical Keystroke Clack
  playKeyClack(isSpace = false) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // 1. Transient click noise
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isSpace ? 1200 : 2800 + Math.random() * 800, now);
      filter.Q.setValueAtTime(3, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(isSpace ? 0.35 : 0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);

      // 2. Mechanical body resonance thud
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = isSpace ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isSpace ? 110 : 220 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio synthesis errors on locked browsers
    }
  }

  // Authentic Vintage Carriage Return Bell Ding / Chime 🔔
  playBellRing() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Dual harmonic bell strike (e.g. 2400Hz and 4800Hz with long decay)
      [2400, 4820].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = idx === 0 ? 0.4 : 0.15;
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      });
    } catch {
      // Ignore
    }
  }
}

export const typewriterAudio = new TypewriterAudioEngine();

export default function NewspaperTypewriterSoundBar({
  enabled = true,
  onToggleSound,
}: TypewriterSoundProps) {
  const [soundOn, setSoundOn] = useState(enabled);

  const toggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    if (onToggleSound) onToggleSound(next);
    if (next) {
      typewriterAudio.playBellRing();
    }
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-amber-950/80 px-3 py-1.5 text-xs text-amber-100 shadow-md backdrop-blur-md border border-amber-800/40">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1.5 font-medium transition-colors hover:text-white"
        title="Toggle authentic mechanical typewriter sound FX"
      >
        {soundOn ? (
          <>
            <Volume2 size={15} className="text-emerald-400 animate-pulse" />
            <span>Typewriter Sound: <strong>ON</strong></span>
          </>
        ) : (
          <>
            <VolumeX size={15} className="text-amber-400" />
            <span>Typewriter Sound: <strong>MUTED</strong></span>
          </>
        )}
      </button>

      <div className="h-3 w-[1px] bg-amber-700/50" />

      <button
        type="button"
        onClick={() => typewriterAudio.playBellRing()}
        className="flex items-center gap-1 text-amber-200/80 hover:text-amber-100 transition-colors"
        title="Test Typewriter Bell Chime"
      >
        <Bell size={13} />
        <span>Ding</span>
      </button>
    </div>
  );
}

// Hook for typing listener
export function useTypewriterKeystrokeAudio(active = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active) return;
      if (e.key === 'Enter') {
        typewriterAudio.playBellRing();
      } else if (e.key === ' ') {
        typewriterAudio.playKeyClack(true);
      } else if (e.key.length === 1) {
        typewriterAudio.playKeyClack(false);
      }
    },
    [active]
  );

  useEffect(() => {
    if (!active) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, handleKeyDown]);
}
