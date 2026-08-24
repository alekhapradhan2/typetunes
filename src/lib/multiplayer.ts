import { getRandomPassage } from './words';

export type GameModeId =
  | 'racer'
  | 'space'
  | 'boss'
  | 'cascade'
  | 'sudden-death'
  | 'boxing'
  | 'castle'
  | 'submarine'
  | 'wizard'
  | 'sprint';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  progress: number; // 0 - 100%
  wpm: number;
  accuracy: number;
  rank?: number;
  isFinished: boolean;
  lastActive: number;
}

export interface MultiplayerRoom {
  code: string;
  gameId: GameModeId;
  gameTitle: string;
  status: 'lobby' | 'countdown' | 'playing' | 'finished';
  text: string;
  words: string[];
  players: MultiplayerPlayer[];
  countdownStartTime?: number;
  matchStartTime?: number;
  createdAt: number;
}

// In-memory room store (high-speed synchronized state)
const rooms = new Map<string, MultiplayerRoom>();

// Clean up stale rooms older than 3 hours
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.createdAt > 3 * 60 * 60 * 1000) {
      rooms.delete(code);
    }
  }
}, 10 * 60 * 1000);

const GAME_TITLES: Record<GameModeId, string> = {
  racer: 'Nitro Highway Racer 🏎️',
  space: 'Cosmic Galaxy Defender 🚀',
  boss: 'Boss Battle RPG ⚔️',
  cascade: 'Falling Notes Arcade 👾',
  'sudden-death': 'Sudden Death Gauntlet ⚡',
  boxing: 'Speed Boxing Knockout 🥊',
  castle: 'Castle Siege Defense 🏰',
  submarine: 'Submarine Depth Rush 🌊',
  wizard: 'Wizard Spell PvP Duel 🧙',
  sprint: 'Sprint Relay 1v1 ⏱️',
};

// Generate memorable 6-character room codes
export function generateRoomCode(): string {
  const prefixes = ['RACE', 'TUNE', 'SPEED', 'NOVA', 'TURBO', 'CYBER', 'HYPER', 'STAR'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}-${num}`;
}

export function createRoom(
  gameId: GameModeId,
  hostPlayerName: string,
  hostAvatar: string = '🏎️'
): { room: MultiplayerRoom; playerId: string } {
  let code = generateRoomCode();
  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const text = getRandomPassage('medium');
  const words = text.split(/\s+/).filter(Boolean);
  const playerId = `player_${Math.random().toString(36).substring(2, 9)}`;

  const hostPlayer: MultiplayerPlayer = {
    id: playerId,
    name: hostPlayerName.trim() || 'Host Typist',
    avatar: hostAvatar,
    isHost: true,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    isFinished: false,
    lastActive: Date.now(),
  };

  const room: MultiplayerRoom = {
    code,
    gameId,
    gameTitle: GAME_TITLES[gameId] || 'Typing Match',
    status: 'lobby',
    text,
    words,
    players: [hostPlayer],
    createdAt: Date.now(),
  };

  rooms.set(code, room);
  return { room, playerId };
}

export function joinRoom(
  code: string,
  playerName: string,
  avatar: string = '🚀'
): { room: MultiplayerRoom; playerId: string } | { error: string } {
  const normalized = code.trim().toUpperCase();
  const room = rooms.get(normalized);

  if (!room) {
    return { error: 'Room not found. Please verify the code.' };
  }

  if (room.status === 'playing' || room.status === 'finished') {
    return { error: 'Match already in progress or completed.' };
  }

  if (room.players.length >= 8) {
    return { error: 'Room is full (max 8 players).' };
  }

  const playerId = `player_${Math.random().toString(36).substring(2, 9)}`;
  const newPlayer: MultiplayerPlayer = {
    id: playerId,
    name: playerName.trim() || `Player ${room.players.length + 1}`,
    avatar,
    isHost: false,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    isFinished: false,
    lastActive: Date.now(),
  };

  room.players.push(newPlayer);
  return { room, playerId };
}

export function getRoom(code: string): MultiplayerRoom | null {
  const normalized = code.trim().toUpperCase();
  return rooms.get(normalized) || null;
}

export function startRoomMatch(code: string, hostPlayerId: string): { success: boolean; error?: string } {
  const room = getRoom(code);
  if (!room) return { success: false, error: 'Room not found' };

  const host = room.players.find((p) => p.id === hostPlayerId);
  if (!host || !host.isHost) return { success: false, error: 'Only the host can start the match' };

  room.status = 'countdown';
  room.countdownStartTime = Date.now();

  // Reset players
  room.players.forEach((p) => {
    p.progress = 0;
    p.wpm = 0;
    p.accuracy = 100;
    p.isFinished = false;
    delete p.rank;
  });

  return { success: true };
}

export function updatePlayerSync(
  code: string,
  playerId: string,
  progress: number,
  wpm: number,
  accuracy: number,
  isFinished: boolean
): MultiplayerRoom | null {
  const room = getRoom(code);
  if (!room) return null;

  const player = room.players.find((p) => p.id === playerId);
  if (player) {
    player.progress = Math.min(100, Math.max(0, progress));
    player.wpm = Math.max(0, Math.round(wpm));
    player.accuracy = Math.max(0, Math.round(accuracy));
    player.isFinished = isFinished;
    player.lastActive = Date.now();

    // Assign ranks as players finish
    if (isFinished && !player.rank) {
      const finishedCount = room.players.filter((p) => p.isFinished && p.rank).length;
      player.rank = finishedCount + 1;
    }
  }

  // If countdown is active, transition to playing after 3.5s
  if (room.status === 'countdown' && room.countdownStartTime) {
    if (Date.now() - room.countdownStartTime >= 3500) {
      room.status = 'playing';
      room.matchStartTime = Date.now();
    }
  }

  // Check if all finished
  if (room.status === 'playing' && room.players.every((p) => p.isFinished)) {
    room.status = 'finished';
  }

  return room;
}
