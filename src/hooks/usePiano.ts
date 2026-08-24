'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getAudioSettings, saveAudioSettings } from '@/lib/storage';
import type { AudioSettings } from '@/lib/types';

// Scales
export const SCALES: Record<string, number[]> = {
  'pentatonic-major': [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25],
  'minor-melodic': [220.00, 246.94, 261.63, 293.66, 329.63, 369.99, 415.30, 440.00, 493.88, 523.25],
  'japanese-insen': [220.00, 233.08, 293.66, 329.63, 392.00, 440.00, 466.16, 587.33],
  'blues': [261.63, 311.13, 349.23, 369.99, 392.00, 466.16, 523.25, 622.25],
};

const ERROR_FREQS = [220.00, 196.00, 164.81, 174.61];

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  muted: false,
  volume: 0.6,
  soundPack: 'piano',
  scale: 'pentatonic-major',
};

interface UsePianoReturn {
  playKeystroke: (correct: boolean) => void;
  settings: AudioSettings;
  updateSettings: (patch: Partial<AudioSettings>) => void;
}

/**
 * Multi-sound synthesizer engine using Web Audio API.
 * Supports Piano, Lo-Fi Chime, 8-Bit Retro Synth, Thock Mechanical, and Zen Marimba.
 */
function playSynthSound(
  ctx: AudioContext,
  masterGain: GainNode,
  frequency: number,
  soundPack: string = 'piano',
  velocity: number = 0.5
) {
  const now = ctx.currentTime;

  if (soundPack === 'synth-8bit') {
    // 8-bit retro square synth
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(frequency * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(frequency, now + 0.04);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(velocity * 0.4, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
    return;
  }

  if (soundPack === 'lofi-chime') {
    // Crystal lo-fi sine chime with high harmonic ring
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 3.01, now);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(velocity * 0.45, now + 0.008);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(velocity * 0.15, now + 0.008);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(masterGain);
    gain2.connect(masterGain);

    osc1.start(now);
    osc1.stop(now + 0.65);
    osc2.start(now);
    osc2.stop(now + 0.4);
    return;
  }

  if (soundPack === 'thock-mechanical') {
    // Mechanical keyboard: crisp transient pop + low bottom-out thock
    // 1. Click transient (burst)
    const oscClick = ctx.createOscillator();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(1400, now);
    oscClick.frequency.exponentialRampToValueAtTime(300, now + 0.02);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(velocity * 0.5, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    // 2. Thock body (low sine drop)
    const oscThock = ctx.createOscillator();
    oscThock.type = 'sine';
    oscThock.frequency.setValueAtTime(240, now);
    oscThock.frequency.exponentialRampToValueAtTime(60, now + 0.06);

    const thockGain = ctx.createGain();
    thockGain.gain.setValueAtTime(velocity * 0.6, now);
    thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    oscClick.connect(clickGain);
    oscThock.connect(thockGain);
    clickGain.connect(masterGain);
    thockGain.connect(masterGain);

    oscClick.start(now);
    oscClick.stop(now + 0.03);
    oscThock.start(now);
    oscThock.stop(now + 0.08);
    return;
  }

  if (soundPack === 'marimba') {
    // Woody resonant strike
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    const oscOver = ctx.createOscillator();
    oscOver.type = 'triangle';
    oscOver.frequency.setValueAtTime(frequency * 4, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(velocity * 0.6, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    const overGain = ctx.createGain();
    overGain.gain.setValueAtTime(velocity * 0.2, now);
    overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    oscOver.connect(overGain);
    gain.connect(masterGain);
    overGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.3);
    oscOver.start(now);
    oscOver.stop(now + 0.06);
    return;
  }

  // Default: Grand Piano
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, now);
  osc.detune.setValueAtTime(Math.random() * 4 - 2, now);

  const envGain = ctx.createGain();
  envGain.gain.setValueAtTime(0, now);
  envGain.gain.linearRampToValueAtTime(velocity * 0.6, now + 0.005);
  envGain.gain.exponentialRampToValueAtTime(velocity * 0.15, now + 0.14);
  envGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2400, now);
  filter.Q.setValueAtTime(0.5, now);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(frequency * 2, now);
  const harmGain = ctx.createGain();
  harmGain.gain.setValueAtTime(velocity * 0.08, now);
  harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(envGain);
  envGain.connect(filter);
  filter.connect(masterGain);

  osc2.connect(harmGain);
  harmGain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.4);
  osc2.start(now);
  osc2.stop(now + 0.2);
}

export function usePiano(): UsePianoReturn {
  const ctxRef        = useRef<AudioContext | null>(null);
  const masterRef     = useRef<GainNode | null>(null);
  const reverbRef     = useRef<ConvolverNode | null>(null);
  const dryRef        = useRef<GainNode | null>(null);
  const wetRef        = useRef<GainNode | null>(null);

  const [settings, setSettings] = useState<AudioSettings>(DEFAULT_AUDIO_SETTINGS);
  const settingsRef   = useRef<AudioSettings>(DEFAULT_AUDIO_SETTINGS);
  const noteIndex     = useRef(0);
  const errorIndex    = useRef(0);
  const initialized   = useRef(false);

  useEffect(() => {
    const saved = getAudioSettings();
    const merged = { ...DEFAULT_AUDIO_SETTINGS, ...saved };
    settingsRef.current = merged;
    setSettings(merged);
  }, []);

  function buildReverb(ctx: AudioContext): ConvolverNode {
    const convolver = ctx.createConvolver();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 1.2;
    const ir = ctx.createBuffer(2, length, sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = ir.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    convolver.buffer = ir;
    return convolver;
  }

  const initAudio = useCallback(() => {
    if (initialized.current) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = settingsRef.current.muted
        ? 0
        : settingsRef.current.volume * 0.75;
      master.connect(ctx.destination);
      masterRef.current = master;

      const reverb = buildReverb(ctx);
      const wet = ctx.createGain();
      wet.gain.value = 0.18;
      reverb.connect(wet);
      wet.connect(master);
      reverbRef.current = reverb;
      wetRef.current = wet;

      const dry = ctx.createGain();
      dry.gain.value = 1.0;
      dry.connect(master);
      dry.connect(reverb);
      dryRef.current = dry;

      initialized.current = true;
    } catch (err) {
      console.warn('[TypeTunes] Web Audio init failed:', err);
    }
  }, []);

  const playKeystroke = useCallback(
    (correct: boolean) => {
      if (settingsRef.current.muted) return;

      if (!initialized.current) {
        initAudio();
      }

      const ctx    = ctxRef.current;
      const dry    = dryRef.current;
      const reverb = reverbRef.current;
      if (!ctx || !dry || !reverb) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
        return;
      }

      try {
        const soundPack = settingsRef.current.soundPack || 'piano';
        const scaleName = settingsRef.current.scale || 'pentatonic-major';
        const freqs = SCALES[scaleName] || SCALES['pentatonic-major'];

        if (correct) {
          const freq     = freqs[noteIndex.current % freqs.length];
          const velocity = 0.42 + Math.random() * 0.2;
          noteIndex.current++;
          playSynthSound(ctx, dry, freq, soundPack, velocity);
        } else {
          const freq = ERROR_FREQS[errorIndex.current % ERROR_FREQS.length];
          errorIndex.current++;
          playSynthSound(ctx, dry, freq, soundPack === 'synth-8bit' ? 'synth-8bit' : 'piano', 0.28);
        }
      } catch (err) {
        console.debug('[TypeTunes] play error:', err);
      }
    },
    [initAudio]
  );

  const updateSettings = useCallback((patch: Partial<AudioSettings>) => {
    const updated = { ...settingsRef.current, ...patch };
    settingsRef.current = updated;
    setSettings(updated);
    saveAudioSettings(updated);

    const master = masterRef.current;
    if (!master) return;

    master.gain.value = updated.muted
      ? 0
      : updated.volume * 0.75;
  }, []);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return { playKeystroke, settings, updateSettings };
}
