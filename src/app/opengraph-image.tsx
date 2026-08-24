import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'TypeTunes — Musical Typing Speed Test with Piano Sounds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Top: logo & badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: '#6aa850',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#fff',
              }}
            >
              ♪
            </div>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
              TypeTunes
            </span>
          </div>

          <div
            style={{
              padding: '8px 18px',
              borderRadius: 30,
              background: 'rgba(106, 168, 80, 0.15)',
              border: '1.5px solid rgba(106, 168, 80, 0.3)',
              fontSize: 16,
              fontWeight: 700,
              color: '#4e8239',
            }}
          >
            Free Online WPM Test
          </div>
        </div>

        {/* Middle: Headline & Feature Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.15,
              margin: 0,
              maxWidth: 900,
            }}
          >
            The typing speed test that plays piano music.
          </h1>
          <p
            style={{
              fontSize: 24,
              color: '#475569',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: 800,
            }}
          >
            Test your WPM with soothing pentatonic piano notes on every keystroke. Real-time analytics, error heatmaps, and zero pressure.
          </p>
        </div>

        {/* Bottom: URL footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: 24,
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 600, color: '#6aa850' }}>
            https://typetunes.in
          </span>
          <span style={{ fontSize: 18, color: '#64748b' }}>
            Free · No Account Required · Piano Feedback
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
