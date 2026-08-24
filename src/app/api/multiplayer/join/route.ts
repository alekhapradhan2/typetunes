import { NextResponse } from 'next/server';
import { joinRoom } from '@/lib/multiplayer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code: string = body.code || '';
    const playerName: string = body.playerName || 'Rival Typist';
    const avatar: string = body.avatar || '🚀';

    if (!code) {
      return NextResponse.json({ error: 'Room code is required' }, { status: 400 });
    }

    const result = joinRoom(code, playerName, avatar);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to join room' }, { status: 500 });
  }
}
