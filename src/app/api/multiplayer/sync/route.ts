import { NextResponse } from 'next/server';
import { updatePlayerSync, getRoom } from '@/lib/multiplayer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, playerId, progress = 0, wpm = 0, accuracy = 100, isFinished = false } = body;

    if (!code) {
      return NextResponse.json({ error: 'Room code is required' }, { status: 400 });
    }

    if (playerId) {
      const updatedRoom = updatePlayerSync(code, playerId, progress, wpm, accuracy, isFinished);
      if (!updatedRoom) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json({ room: updatedRoom });
    } else {
      // Just fetching status
      const room = getRoom(code);
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json({ room });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sync failed' }, { status: 500 });
  }
}
