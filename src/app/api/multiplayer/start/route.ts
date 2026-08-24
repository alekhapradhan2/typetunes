import { NextResponse } from 'next/server';
import { startRoomMatch } from '@/lib/multiplayer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code: string = body.code || '';
    const playerId: string = body.playerId || '';

    if (!code || !playerId) {
      return NextResponse.json({ error: 'Code and playerId required' }, { status: 400 });
    }

    const result = startRoomMatch(code, playerId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to start match' }, { status: 500 });
  }
}
