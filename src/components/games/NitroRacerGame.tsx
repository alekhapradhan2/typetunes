'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePiano } from '@/hooks/usePiano';
import {
  Trophy,
  Zap,
  Gauge,
  RotateCcw,
  Play,
  Flag,
  Flame,
  Sparkles,
  Award,
  Radio,
  Compass,
} from 'lucide-react';
import { generateTestText } from '@/lib/words';
import { MultiplayerRoom, MultiplayerPlayer } from '@/lib/multiplayer';

interface NitroRacerProps {
  multiplayerRoom?: MultiplayerRoom | null;
  currentPlayerId?: string;
  onSyncProgress?: (progress: number, wpm: number, accuracy: number, isFinished: boolean) => void;
  externalText?: string;
  autoStart?: boolean;
}

interface RivalCar {
  id: string;
  name: string;
  avatar: string;
  color: string;
  baseWpm: number;
  progress: number; // 0 to 100%
  lane: number; // -0.6 to 0.6
  speed: number;
  currentWpm: number;
}

const AI_RIVALS: RivalCar[] = [
  { id: 'rival-1', name: 'Rookie Cruz', avatar: '🚗', color: '#f59e0b', baseWpm: 45, progress: 0, lane: -0.45, speed: 0, currentWpm: 45 },
  { id: 'rival-2', name: 'Drift Bot', avatar: '🏎️', color: '#38bdf8', baseWpm: 68, progress: 0, lane: 0.45, speed: 0, currentWpm: 68 },
  { id: 'rival-3', name: 'Phantom V', avatar: '⚡', color: '#ec4899', baseWpm: 88, progress: 0, lane: 0.0, speed: 0, currentWpm: 88 },
];

export default function NitroRacerGame({
  multiplayerRoom,
  currentPlayerId,
  onSyncProgress,
  externalText,
  autoStart = false,
}: NitroRacerProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [difficulty, setDifficulty] = useState<'rookie' | 'pro' | 'master'>('pro');
  const [timeLimit, setTimeLimit] = useState<number>(30); // 30s, 45s, 60s, 0
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'racing' | 'finished' | 'timeout'>('idle');
  const [countdown, setCountdown] = useState<number>(3);

  // Full continuous passage text & typing position
  const [raceText, setRaceText] = useState<string>('');
  const [typedChars, setTypedChars] = useState<string>('');
  const [currentInputWord, setCurrentInputWord] = useState<string>('');

  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [playerWpm, setPlayerWpm] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [mph, setMph] = useState<number>(0);
  const [rpm, setRpm] = useState<number>(1000);
  const [gear, setGear] = useState<string>('1ST');
  const [nitroActive, setNitroActive] = useState<boolean>(false);
  const [nitroCharge, setNitroCharge] = useState<number>(30);
  const [streak, setStreak] = useState<number>(0);
  const [cameraShake, setCameraShake] = useState<boolean>(false);

  const [rivals, setRivals] = useState<RivalCar[]>([]);
  const [finishStandings, setFinishStandings] = useState<{ name: string; time: number; wpm: number; rank: number }[]>([]);

  const raceStartTimeRef = useRef<number>(0);
  const lastKeyTimeRef = useRef<number>(0);
  const totalCorrectCharsRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const roadOffsetRef = useRef<number>(0);
  const roadCurveRef = useRef<number>(0);
  const { playKeystroke } = usePiano();

  const totalWordsInRace = 35;

  // Initialize Race
  const initRace = useCallback(() => {
    let fullText = '';
    if (multiplayerRoom?.text) {
      fullText = multiplayerRoom.text;
    } else if (externalText) {
      fullText = externalText;
    } else {
      fullText = generateTestText({ count: totalWordsInRace, includePunctuation: true, includeNumbers: false });
    }

    setRaceText(fullText);
    setTypedChars('');
    setCurrentInputWord('');
    setPlayerProgress(0);
    setPlayerWpm(0);
    setMph(0);
    setRpm(1000);
    setGear('1ST');
    setNitroActive(false);
    setNitroCharge(35);
    setStreak(0);
    setFinishStandings([]);
    totalCorrectCharsRef.current = 0;
    roadOffsetRef.current = 0;

    if (multiplayerRoom && multiplayerRoom.players.length > 0) {
      const otherPlayers = multiplayerRoom.players.filter((p) => p.id !== currentPlayerId);
      const lanes = [-0.5, 0.5, 0, -0.25, 0.25];
      const mapped: RivalCar[] = otherPlayers.map((p, idx) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar || '🏎️',
        color: idx % 2 === 0 ? '#38bdf8' : '#ec4899',
        baseWpm: p.wpm || 0,
        progress: p.progress || 0,
        lane: lanes[idx % lanes.length],
        speed: 0,
        currentWpm: p.wpm || 0,
      }));
      setRivals(mapped);
    } else {
      const mult = difficulty === 'rookie' ? 0.75 : difficulty === 'pro' ? 1.0 : 1.35;
      const initial: RivalCar[] = AI_RIVALS.map((r) => ({
        ...r,
        baseWpm: Math.round(r.baseWpm * mult),
        currentWpm: Math.round(r.baseWpm * mult),
        progress: 0,
      }));
      setRivals(initial);
    }
  }, [difficulty, multiplayerRoom, currentPlayerId, externalText]);

  useEffect(() => {
    initRace();
  }, [initRace]);

  // Sync multiplayer player positions & live WPM
  useEffect(() => {
    if (multiplayerRoom && currentPlayerId) {
      const otherPlayers = multiplayerRoom.players.filter((p) => p.id !== currentPlayerId);
      setRivals((prev) =>
        prev.map((r) => {
          const matched = otherPlayers.find((p) => p.id === r.id);
          return matched ? { ...r, progress: matched.progress, currentWpm: matched.wpm, baseWpm: matched.wpm } : r;
        })
      );
    }
  }, [multiplayerRoom, currentPlayerId]);

  // Auto-start if triggered by multiplayer countdown
  useEffect(() => {
    if (autoStart && (gameState === 'idle' || gameState === 'countdown')) {
      setGameState('racing');
      raceStartTimeRef.current = performance.now();
      lastKeyTimeRef.current = performance.now();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [autoStart, gameState]);

  // Keyboard shortcut listener (Enter to start/restart)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((gameState === 'idle' || gameState === 'finished') && e.key === 'Enter') {
        startRace();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Solo Start Race Sequence
  const startRace = () => {
    initRace();
    setGameState('countdown');
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else if (count === 0) {
        setCountdown(0);
      } else {
        clearInterval(interval);
        setGameState('racing');
        raceStartTimeRef.current = performance.now();
        lastKeyTimeRef.current = performance.now();
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 750);
  };

  // Trigger Nitro Boost
  const triggerNitro = () => {
    if (nitroCharge < 40 || nitroActive || gameState !== 'racing') return;
    setNitroActive(true);
    setNitroCharge(0);
    setCameraShake(true);
    setTimeout(() => {
      setNitroActive(false);
      setCameraShake(false);
    }, 3200);
    inputRef.current?.focus();
  };

  // 60FPS Pseudo-3D Highway Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const delta = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;

      // Calculate smooth speed & telemetry based on typing speed
      const timeSinceLastKey = (time - lastKeyTimeRef.current) / 1000;
      const activeFactor = gameState === 'racing' && timeSinceLastKey < 2.5 ? 1 : 0.2;
      const targetMph = gameState === 'racing'
        ? Math.max(15, (playerWpm * 1.8 + (nitroActive ? 65 : 0)) * activeFactor)
        : 0;

      setMph((prev) => prev + (targetMph - prev) * 0.12);

      // Gear calculation
      const currentMph = targetMph;
      let calculatedGear = '1ST';
      if (currentMph > 160) calculatedGear = 'OVERDRIVE 🔥';
      else if (currentMph > 130) calculatedGear = '6TH';
      else if (currentMph > 100) calculatedGear = '5TH';
      else if (currentMph > 75) calculatedGear = '4TH';
      else if (currentMph > 50) calculatedGear = '3RD';
      else if (currentMph > 25) calculatedGear = '2ND';
      setGear(calculatedGear);

      // RPM calculation
      const targetRpm = gameState === 'racing' ? 2500 + (playerWpm * 65) % 6000 + (nitroActive ? 1500 : 0) : 1000;
      setRpm((prev) => prev + (targetRpm - prev) * 0.1);

      // Road movement speed
      const roadSpeed = (currentMph / 100) * 18;
      roadOffsetRef.current = (roadOffsetRef.current + roadSpeed * delta) % 1;
      roadCurveRef.current = Math.sin(time / 2000) * 0.25;

      // --- 1. DRAW SKY & HORIZON GRADIENT ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
      skyGrad.addColorStop(0, '#050814');
      skyGrad.addColorStop(0.6, '#0f172a');
      skyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.45);

      // Cyberpunk Retro Grid on Horizon
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.45;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, horizonY);
        ctx.lineTo(width / 2 + (x - width / 2) * 0.2, horizonY - 40);
        ctx.stroke();
      }

      // Neon City Skyline
      ctx.fillStyle = '#090d1f';
      const buildingWidths = [45, 30, 60, 25, 50, 40, 70, 35, 55, 65, 40, 50];
      let bX = 10;
      buildingWidths.forEach((bw, i) => {
        const bh = 25 + (i * 17) % 55;
        ctx.fillRect(bX, horizonY - bh, bw, bh);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(56, 189, 248, 0.3)';
        ctx.fillRect(bX + 6, horizonY - bh + 6, bw - 12, bh - 10);
        ctx.fillStyle = '#090d1f';
        bX += bw + 8;
      });

      // --- 2. DRAW 3D PSEUDO-PERSPECTIVE HIGHWAY ---
      const numSegments = 80;
      for (let i = 0; i < numSegments; i++) {
        const segProgress = i / numSegments;
        const nextSegProgress = (i + 1) / numSegments;

        const y1 = horizonY + Math.pow(segProgress, 2.2) * (height - horizonY);
        const y2 = horizonY + Math.pow(nextSegProgress, 2.2) * (height - horizonY);

        const w1 = width * 0.18 + Math.pow(segProgress, 1.8) * width * 0.72;
        const w2 = width * 0.18 + Math.pow(nextSegProgress, 1.8) * width * 0.72;

        const curve1 = Math.pow(segProgress, 2) * roadCurveRef.current * width * 0.3;
        const curve2 = Math.pow(nextSegProgress, 2) * roadCurveRef.current * width * 0.3;

        const x1 = width / 2 + curve1;
        const x2 = width / 2 + curve2;

        const isStripe = Math.floor((i + roadOffsetRef.current * 10) % 2) === 0;
        ctx.fillStyle = isStripe ? '#181b26' : '#12141d';

        // Draw Asphalt
        ctx.beginPath();
        ctx.moveTo(x1 - w1 / 2, y1);
        ctx.lineTo(x1 + w1 / 2, y1);
        ctx.lineTo(x2 + w2 / 2, y2);
        ctx.lineTo(x2 - w2 / 2, y2);
        ctx.closePath();
        ctx.fill();

        // Rumble Strips (Red & White)
        const curbW1 = w1 * 0.05;
        const curbW2 = w2 * 0.05;
        ctx.fillStyle = isStripe ? '#ef4444' : '#ffffff';

        ctx.beginPath();
        ctx.moveTo(x1 - w1 / 2 - curbW1, y1);
        ctx.lineTo(x1 - w1 / 2, y1);
        ctx.lineTo(x2 - w2 / 2, y2);
        ctx.lineTo(x2 - w2 / 2 - curbW2, y2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x1 + w1 / 2, y1);
        ctx.lineTo(x1 + w1 / 2 + curbW1, y1);
        ctx.lineTo(x2 + w2 / 2 + curbW2, y2);
        ctx.lineTo(x2 + w2 / 2, y2);
        ctx.closePath();
        ctx.fill();

        // Golden Dashed Lane Lines
        if (isStripe) {
          ctx.fillStyle = '#fbbf24';
          const laneOffset1 = w1 * 0.28;
          const laneOffset2 = w2 * 0.28;
          const dashW1 = Math.max(1.5, w1 * 0.015);
          const dashW2 = Math.max(2, w2 * 0.015);

          ctx.beginPath();
          ctx.moveTo(x1 - laneOffset1 - dashW1 / 2, y1);
          ctx.lineTo(x1 - laneOffset1 + dashW1 / 2, y1);
          ctx.lineTo(x2 - laneOffset2 + dashW2 / 2, y2);
          ctx.lineTo(x2 - laneOffset2 - dashW2 / 2, y2);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(x1 + laneOffset1 - dashW1 / 2, y1);
          ctx.lineTo(x1 + laneOffset1 + dashW1 / 2, y1);
          ctx.lineTo(x2 + laneOffset2 + dashW2 / 2, y2);
          ctx.lineTo(x2 + laneOffset2 - dashW2 / 2, y2);
          ctx.closePath();
          ctx.fill();
        }
      }

      // --- 3. DRAW RIVAL OPPONENT CARS WITH LIVE WPM SPEED BADGES ---
      rivals.forEach((rival) => {
        const relProg = rival.progress - playerProgress;
        // Smooth non-linear depth mapping so cars NEVER disappear off-screen
        const depth = Math.min(0.92, Math.max(0.12, 0.62 - (relProg / 100) * 0.7));

        const segY = horizonY + Math.pow(depth, 2.2) * (height - horizonY);
        const roadW = width * 0.18 + Math.pow(depth, 1.8) * width * 0.72;
        const curveX = Math.pow(depth, 2) * roadCurveRef.current * width * 0.3;
        const carX = width / 2 + curveX + rival.lane * roadW * 0.65;
        const carScale = Math.max(0.32, depth * 1.25);

        ctx.save();
        ctx.translate(carX, segY);
        ctx.scale(carScale, carScale);

        // Car Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.ellipse(0, 8, 32, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Car Body
        ctx.fillStyle = rival.color;
        ctx.beginPath();
        ctx.roundRect(-26, -18, 52, 26, [8, 8, 4, 4]);
        ctx.fill();

        // Windshield
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-18, -14, 36, 14, 4);
        ctx.fill();

        // Taillights or Headlights based on relative position
        if (relProg > 0) {
          // Rival is ahead -> we see their taillights
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
          ctx.fillRect(-22, 2, 8, 4);
          ctx.fillRect(14, 2, 8, 4);
        } else {
          // Rival is behind -> we see their xenon headlights
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fillRect(-22, -16, 8, 4);
          ctx.fillRect(14, -16, 8, 4);
        }
        ctx.shadowBlur = 0;

        // LIVE MULTIPLAYER WPM SPEED BADGE OVER CAR
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.strokeStyle = rival.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-48, -44, 96, 22, 6);
        ctx.fill();
        ctx.stroke();

        // Name & Live WPM Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${rival.avatar} ${rival.name.slice(0, 8)}`, 0, -33);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 8px monospace';
        const distText = relProg > 0 ? `+${Math.round(relProg)}%` : `${Math.round(relProg)}%`;
        ctx.fillText(`⚡ ${rival.currentWpm || rival.baseWpm} WPM (${distText})`, 0, -24);

        ctx.restore();
      });

      // --- 3.5. DRAW 3D CHECKERED FINISH LINE BANNER ---
      if (playerProgress >= 75) {
        const finishDist = Math.max(0, (100 - playerProgress) / 25);
        const depth = 1 - finishDist;
        const finishY = horizonY + Math.pow(depth, 2.2) * (height - horizonY);
        const finishW = width * 0.18 + Math.pow(depth, 1.8) * width * 0.72;
        const finishX = width / 2;

        if (finishY < height + 40 && finishY > horizonY) {
          ctx.save();
          // Arch Overhead Banner
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(finishX - finishW / 2 - 8, finishY - 55, finishW + 16, 22);

          ctx.fillStyle = '#0f172a';
          ctx.font = `bold ${Math.max(9, Math.round(finishW * 0.038))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('🏁 CHECKERED FINISH LINE 🏁', finishX, finishY - 40);

          // Checkerboard road strip
          const numTiles = 16;
          for (let c = 0; c < numTiles; c++) {
            ctx.fillStyle = (c + Math.floor(roadOffsetRef.current * 10)) % 2 === 0 ? '#ffffff' : '#0f172a';
            ctx.fillRect(finishX - finishW / 2 + (c * finishW) / numTiles, finishY - 4, finishW / numTiles, 8);
          }
          ctx.restore();
        }
      }

      // --- 4. DRAW PLAYER SUPERCAR (Foreground) ---
      const playerCarX = width / 2;
      const playerCarY = height - 42;

      ctx.save();
      ctx.translate(playerCarX, playerCarY);

      // Headlight Beams illuminating the road ahead
      const lightGrad = ctx.createLinearGradient(0, 0, 0, -180);
      lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      lightGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(-28, -10);
      ctx.lineTo(-85, -170);
      ctx.lineTo(85, -170);
      ctx.lineTo(28, -10);
      ctx.closePath();
      ctx.fill();

      // Car Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.ellipse(0, 12, 54, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Neon Underglow
      ctx.shadowColor = nitroActive ? '#38bdf8' : '#a855f7';
      ctx.shadowBlur = nitroActive ? 28 : 16;
      ctx.fillStyle = nitroActive ? 'rgba(56, 189, 248, 0.6)' : 'rgba(168, 85, 247, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 10, 48, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Supercar Chassis (Aerodynamic GT Body)
      const bodyGrad = ctx.createLinearGradient(-42, 0, 42, 0);
      bodyGrad.addColorStop(0, '#06b6d4');
      bodyGrad.addColorStop(0.5, '#38bdf8');
      bodyGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-42, -24, 84, 38, [14, 14, 6, 6]);
      ctx.fill();

      // Carbon Fiber Rear Wing
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-46, -26, 92, 6);
      ctx.fillRect(-32, -20, 6, 8);
      ctx.fillRect(26, -20, 6, 8);

      // Cabin Glass
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.roundRect(-28, -18, 56, 20, 6);
      ctx.fill();

      // Glowing LED Taillights
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 14;
      ctx.fillRect(-38, 4, 16, 5);
      ctx.fillRect(22, 4, 16, 5);
      ctx.shadowBlur = 0;

      // Nitrous Exhaust Flames
      if (nitroActive || (gameState === 'racing' && playerWpm > 70 && timeSinceLastKey < 1.5)) {
        const flameLength = nitroActive ? 34 + Math.random() * 12 : 14 + Math.random() * 6;
        const flameGrad = ctx.createLinearGradient(0, 8, 0, 8 + flameLength);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#38bdf8');
        flameGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-24, 8);
        ctx.lineTo(-20, 8 + flameLength);
        ctx.lineTo(-16, 8);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(20, 8 + flameLength);
        ctx.lineTo(24, 8);
        ctx.closePath();
        ctx.fill();
      }

      // PLAYER LIVE SPEED BADGE OVER CAR
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-52, -54, 104, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🏎️ YOU (Lane 1)', 0, -42);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'black 9px monospace';
      ctx.fillText(`⚡ ${playerWpm} WPM • ${Math.round(mph)} MPH`, 0, -34);

      ctx.restore();

      // --- 5. SPEED LINES OVERLAY ---
      if (currentMph > 90 || nitroActive) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        for (let s = 0; s < 12; s++) {
          const sX = Math.random() * width;
          const sY = horizonY + Math.random() * (height - horizonY);
          const sLen = 20 + Math.random() * 40;
          ctx.beginPath();
          ctx.moveTo(sX, sY);
          ctx.lineTo(sX + (sX - width / 2) * 0.15, sY + sLen);
          ctx.stroke();
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, playerWpm, nitroActive, playerProgress, rivals, mph]);

  // Dedicated Race Timer & AI Progress Loop (Runs constantly without stopping)
  const hasStartedTypingRef = useRef<boolean>(false);

  useEffect(() => {
    if (gameState !== 'racing') {
      hasStartedTypingRef.current = false;
      return;
    }

    let lastTime = performance.now();

    const interval = setInterval(() => {
      if (!hasStartedTypingRef.current) {
        return;
      }

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const elapsed = Math.max(0.01, (now - raceStartTimeRef.current) / 1000);
      setElapsedTime(elapsed);

      // Update AI Progress
      const totalChars = Math.max(10, raceText.length);
      setRivals((prevRivals) =>
        prevRivals.map((racer) => {
          if (racer.progress >= 100) return racer;
          const charsPerSec = (racer.baseWpm * 5) / 60;
          const jitter = 0.95 + Math.random() * 0.1;
          const inc = ((charsPerSec * jitter * delta) / totalChars) * 100;
          const nextProg = Math.min(100, racer.progress + inc);
          return { ...racer, progress: nextProg };
        })
      );

      // Calculate Player live WPM
      const liveWpm = Math.round((totalCorrectCharsRef.current / 5) / (elapsed / 60));
      setPlayerWpm(liveWpm);

      // Check timeout if time limit is set
      if (timeLimit > 0 && elapsed >= timeLimit) {
        setGameState('timeout');
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, raceText.length, timeLimit]);

  // Handle Player Continuous Sentence Typing
  const handleSentenceTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'racing') return;
    const inputVal = e.target.value;

    // Start timer on first keystroke!
    if (!hasStartedTypingRef.current && inputVal.length > 0) {
      hasStartedTypingRef.current = true;
      raceStartTimeRef.current = performance.now();
    }
    lastKeyTimeRef.current = performance.now();

    const fullExpected = raceText;
    const expectedSub = fullExpected.slice(0, inputVal.length);

    if (inputVal === expectedSub) {
      // Valid typing match!
      setTypedChars(inputVal);
      playKeystroke(true);

      totalCorrectCharsRef.current = inputVal.length;
      const prog = Math.min(100, (inputVal.length / Math.max(1, fullExpected.length)) * 100);
      setPlayerProgress(prog);

      // Calculate live WPM
      const elapsed = Math.max(0.5, (performance.now() - raceStartTimeRef.current) / 1000);
      const currentLiveWpm = Math.round((inputVal.length / 5) / (elapsed / 60));
      setPlayerWpm(currentLiveWpm);

      // Build streak and nitro
      setStreak((s) => s + 1);
      setNitroCharge((nc) => Math.min(100, nc + 2));

      // Check Race Finished
      if (inputVal.length >= fullExpected.length || prog >= 100) {
        const finalWpm = Math.max(1, Math.round((inputVal.length / 5) / (elapsed / 60)));
        setPlayerWpm(finalWpm);
        setPlayerProgress(100);

        const allRacers = [
          { name: 'You', time: elapsed, wpm: finalWpm, progress: 100 },
          ...rivals.map((r) => ({
            name: r.name,
            time: ((fullExpected.length / 5) / (Math.max(1, r.baseWpm) / 60)),
            wpm: r.baseWpm,
            progress: r.progress,
          })),
        ].sort((a, b) => (b.progress === a.progress ? a.time - b.time : b.progress - a.progress));

        const ranked = allRacers.map((item, idx) => ({ ...item, rank: idx + 1 }));
        setFinishStandings(ranked);
        setGameState('finished');

        if (onSyncProgress) {
          onSyncProgress(100, finalWpm, 98, true);
        }
      } else if (onSyncProgress) {
        onSyncProgress(prog, currentLiveWpm, 98, false);
      }
    } else {
      // Typo
      playKeystroke(false);
      setTypedChars(inputVal);
    }
  };

  const currentIndex = typedChars.length;
  const isTypo = typedChars !== raceText.slice(0, typedChars.length);

  return (
    <div className={`space-y-4 select-none ${cameraShake ? 'animate-shake' : ''}`}>
      {/* 3D Highway Canvas Arena & Cockpit */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-950 text-white">
        {/* Fullscreen HTML5 3D Canvas */}
        <canvas
          ref={canvasRef}
          width={960}
          height={460}
          className="w-full h-[340px] sm:h-[420px] block"
        />

        {/* Cockpit HUD Top Bar */}
        <div className="absolute top-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20">
          {/* Speedometer, Gear & Timer */}
          <div className="flex items-center gap-3 bg-slate-900/90 px-3.5 py-1.5 rounded-2xl border border-cyan-500/40 backdrop-blur-md shadow-lg">
            <div className="text-center">
              <span className="text-[9px] font-mono text-cyan-400 font-bold block uppercase">SPEED</span>
              <span className="text-xl sm:text-2xl font-mono font-black text-white">
                {Math.round(mph)} <span className="text-[10px] text-cyan-400 font-normal">MPH</span>
              </span>
            </div>

            <div className="h-7 w-px bg-slate-700" />

            <div className="text-center">
              <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase">GEAR</span>
              <span className="text-base sm:text-lg font-mono font-black text-amber-300">{gear}</span>
            </div>

            <div className="h-7 w-px bg-slate-700" />

            <div className="text-center">
              <span className="text-[9px] font-mono text-purple-400 font-bold block uppercase">SPEED (WPM)</span>
              <span className="text-base sm:text-lg font-mono font-black text-purple-300">{playerWpm} WPM</span>
            </div>

            <div className="h-7 w-px bg-slate-700" />

            <div className="text-center">
              <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase">
                {timeLimit > 0 ? '⏱️ TIME LEFT' : '⏱️ RACE TIME'}
              </span>
              <span
                className={`text-base sm:text-lg font-mono font-black ${
                  timeLimit > 0 && timeLimit - elapsedTime <= 7
                    ? 'text-rose-400 animate-pulse'
                    : 'text-emerald-300'
                }`}
              >
                {timeLimit > 0
                  ? `${Math.max(0, timeLimit - elapsedTime).toFixed(1)}s`
                  : `${Math.floor(elapsedTime / 60) < 10 ? '0' : ''}${Math.floor(elapsedTime / 60)}:${
                      elapsedTime % 60 < 10 ? '0' : ''
                    }${(elapsedTime % 60).toFixed(1)}s`}
              </span>
            </div>
          </div>

          {/* Live Mini-Map Track Radar */}
          <div className="flex-1 max-w-xs mx-auto hidden md:block bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-slate-700 backdrop-blur-md">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>START</span>
              <span className="text-amber-400 font-bold">🏁 FINISH</span>
            </div>
            <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              {rivals.map((r) => (
                <div
                  key={r.id}
                  className="absolute top-0 bottom-0 w-2 rounded-full bg-sky-400 transition-all duration-200"
                  style={{ left: `calc(${Math.min(95, r.progress)}% - 4px)` }}
                  title={`${r.name}: ${Math.round(r.progress)}% (${r.currentWpm} WPM)`}
                />
              ))}
              <div
                className="absolute top-0 bottom-0 w-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 ring-2 ring-white transition-all duration-150 z-10"
                style={{ left: `calc(${Math.min(95, playerProgress)}% - 6px)` }}
              />
            </div>
          </div>

          {/* NOS Nitrous Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={triggerNitro}
              disabled={nitroCharge < 40 || nitroActive || gameState !== 'racing'}
              className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
                nitroActive
                  ? 'bg-cyan-400 text-slate-950 animate-pulse ring-4 ring-cyan-400/50 shadow-cyan-400/50'
                  : nitroCharge >= 40
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 shadow-blue-500/40'
                  : 'bg-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <Flame size={16} className={nitroActive ? 'animate-bounce' : ''} />
              <span>{nitroActive ? 'NOS BURST! ⚡' : `NOS (${Math.round(nitroCharge)}%)`}</span>
            </button>
          </div>
        </div>

        {/* Solo Idle Splash Screen */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in overflow-y-auto">
            <span className="text-5xl mb-2 animate-bounce">🏎️💨</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Nitro Supercar Grand Prix</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-md">
              Type the sentence passage at high speed to beat the countdown timer and cross the checkered finish line!
            </p>

            {/* Timer Challenge Selector */}
            <div className="mt-3 text-left w-full max-w-sm">
              <span className="text-[10px] font-mono font-bold text-amber-400 block mb-1">
                ⏱️ SELECT RACE TIME LIMIT:
              </span>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700">
                {[
                  { label: '30s Sprint', sec: 30 },
                  { label: '45s GP', sec: 45 },
                  { label: '60s Endurance', sec: 60 },
                  { label: 'Unlimited', sec: 0 },
                ].map((t) => (
                  <button
                    key={t.sec}
                    onClick={() => setTimeLimit(t.sec)}
                    className={`py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      timeLimit === t.sec
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="mt-2 text-left w-full max-w-sm">
              <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">
                🏎️ SELECT AI DIFFICULTY:
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700">
                <button
                  onClick={() => setDifficulty('rookie')}
                  className={`py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    difficulty === 'rookie' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Rookie (45 WPM)
                </button>
                <button
                  onClick={() => setDifficulty('pro')}
                  className={`py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    difficulty === 'pro' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pro (70 WPM)
                </button>
                <button
                  onClick={() => setDifficulty('master')}
                  className={`py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    difficulty === 'master' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Master (95+ WPM) 🔥
                </button>
              </div>
            </div>

            <button
              onClick={startRace}
              className="mt-4 px-10 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-black text-sm transition-all shadow-xl shadow-rose-500/30 flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              Start Race (Press Enter)
            </button>
          </div>
        )}

        {/* Timeout Modal */}
        {gameState === 'timeout' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-6xl mb-2 animate-pulse">⏰💥</span>
            <h3 className="text-3xl font-extrabold text-rose-400">TIME EXPIRED!</h3>
            <p className="text-sm text-slate-300 mt-1 max-w-sm">
              The race clock ran out before you crossed the finish line! Reached{' '}
              <strong className="text-amber-400 font-mono">{Math.round(playerProgress)}%</strong> of the track at{' '}
              <strong className="text-cyan-400 font-mono">{playerWpm} WPM</strong>.
            </p>

            <button
              onClick={startRace}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <RotateCcw size={18} />
              Retry Race (Press Enter)
            </button>
          </div>
        )}

        {/* Solo Countdown Screen */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <span className="text-8xl font-black font-mono text-amber-400 animate-bounce">
              {countdown > 0 ? countdown : 'GO! 🔥'}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-2">
              REV YOUR ENGINES...
            </span>
          </div>
        )}

        {/* Race Finished Modal */}
        {gameState === 'finished' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center text-white animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
              <Trophy size={36} />
            </div>
            <h3 className="text-3xl font-extrabold text-amber-300">CHECKERED FLAG FINISH! 🏁</h3>
            <p className="text-sm text-slate-300 mt-1">
              Top Speed: <strong className="text-cyan-400 font-mono">{Math.round(mph)} MPH</strong> • Typing Speed:{' '}
              <strong className="text-emerald-400 font-mono">{playerWpm} WPM</strong>
            </p>

            {/* Standings list */}
            <div className="w-full max-w-sm my-4 bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-1.5 text-xs font-mono">
              {finishStandings.map((st) => (
                <div
                  key={st.name}
                  className={`flex items-center justify-between p-2 rounded-xl ${
                    st.name === 'You' ? 'bg-purple-950/80 text-amber-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>
                    #{st.rank} {st.name}
                  </span>
                  <span>{st.wpm} WPM</span>
                </div>
              ))}
            </div>

            <button
              onClick={startRace}
              className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} />
              Race Again (Enter)
            </button>
          </div>
        )}

        {/* CONTINUOUS PASSAGE SENTENCE TYPING DOCK */}
        <div className="p-4 sm:p-6 bg-slate-950/95 border-t border-slate-800 flex flex-col space-y-4 z-20">
          {/* Full Sentence Passage Teleprompter */}
          <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border-2 border-slate-800 shadow-inner font-mono text-base sm:text-lg leading-relaxed select-none">
            {raceText.split('').map((char, index) => {
              let charStyle = 'text-slate-500'; // Upcoming
              if (index < typedChars.length) {
                charStyle =
                  typedChars[index] === char
                    ? 'text-cyan-400 font-bold bg-cyan-950/40 rounded-xs'
                    : 'text-rose-500 font-bold underline bg-rose-950/50';
              } else if (index === typedChars.length) {
                charStyle = 'text-white font-black bg-cyan-500/30 border-b-2 border-cyan-400 animate-pulse';
              }

              return (
                <span key={index} className={`transition-colors duration-75 ${charStyle}`}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Typing Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={typedChars}
              onChange={handleSentenceTyping}
              disabled={gameState !== 'racing'}
              placeholder={gameState === 'racing' ? 'Type the sentence above to accelerate your supercar...' : 'Click Start to race'}
              className={`w-full px-5 py-3.5 bg-slate-900 border-2 rounded-2xl font-mono text-lg text-cyan-300 font-bold focus:outline-none focus:ring-4 placeholder:text-slate-600 shadow-inner ${
                isTypo
                  ? 'border-rose-500 focus:ring-rose-500/30 text-rose-300'
                  : 'border-cyan-500 focus:ring-cyan-500/30'
              }`}
              autoFocus
            />

            {isTypo && (
              <span className="absolute right-4 top-3.5 text-xs font-mono text-rose-400 font-bold bg-rose-950 px-2 py-1 rounded-lg border border-rose-800 animate-pulse">
                Typo! Press Backspace
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
