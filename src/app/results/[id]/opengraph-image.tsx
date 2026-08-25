import { ImageResponse } from 'next/og';
import { getResultById } from '@/lib/db';

export const runtime = 'nodejs';
export const alt = 'TypeTune typing result card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResultById(id).catch(() => null);

  const wpm      = result?.netWpm      ?? '—';
  const accuracy = result?.accuracy    ?? '—';
  const rhythm   = result?.rhythmProfile ?? 'mixed';
  const takeaway = result?.takeawayMessage ?? 'TypeTune — the musical typing test.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f5f0e8 0%, #ece5d8 100%)',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#6aa850',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color: '#fff',
            }}
          >
            ♪
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#1e293b' }}>
            TypeTunes
          </span>
        </div>

        {/* Middle: big stats */}
        <div style={{ display: 'flex', gap: 64, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 100, fontWeight: 800, color: '#6aa850', lineHeight: 1 }}>
              {wpm}
            </span>
            <span style={{ fontSize: 22, color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: 4 }}>
              WPM
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 80, fontWeight: 700, color: '#54b3d9', lineHeight: 1 }}>
              {accuracy}%
            </span>
            <span style={{ fontSize: 22, color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: 4 }}>
              Accuracy
            </span>
          </div>
          <div
            style={{
              padding: '10px 20px',
              borderRadius: 32,
              background: '#b8a8c820',
              border: '1.5px solid #b8a8c850',
              fontSize: 20,
              color: '#b8a8c8',
              marginBottom: 8,
            }}
          >
            {rhythm} rhythm
          </div>
        </div>

        {/* Bottom: takeaway + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <p
            style={{
              fontSize: 22,
              color: '#475569',
              lineHeight: 1.5,
              maxWidth: 760,
              margin: 0,
            }}
          >
            "{takeaway.slice(0, 120)}{takeaway.length > 120 ? '…' : ''}"
          </p>
          <span
            style={{
              fontSize: 18,
              color: '#94a3b8',
            }}
          >
            https://typetune.ollypedia.in · The musical typing speed test
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
