import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { saveResult, getResultById } from '@/lib/db';
import type { TestResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TestResult;
    if (!body.id) {
      return NextResponse.json({ error: 'Missing result id' }, { status: 400 });
    }
    await saveResult(body);
    return NextResponse.json({ ok: true, id: body.id }, { status: 201 });
  } catch (err: any) {
    console.error('[/api/results POST]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  try {
    const result = await getResultById(id);
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[/api/results GET]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
