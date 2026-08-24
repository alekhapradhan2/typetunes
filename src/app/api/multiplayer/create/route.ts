import { NextResponse } from 'next/server';
import { createRoom, GameModeId } from '@/lib/multiplayer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const gameId: GameModeId = body.gameId || 'racer';
    const playerName: string = body.playerName || 'Host Typist';
    const avatar: string = body.avatar || '🏎️';

    const result = createRoom(gameId, playerName, avatar);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create room' }, { status: 500 });
  }
}
