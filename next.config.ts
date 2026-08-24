import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode for better React error detection
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Security headers — crawlable, no restrictive X-Robots-Tag
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for SEO — permanent 301s
  async redirects() {
    return [
      // www to non-www canonical redirect (when www host is matched)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.typetunes.in',
          },
        ],
        destination: 'https://typetunes.in/:path*',
        permanent: true,
      },
      // Short / variant test paths canonicalized to standardized test slugs
      {
        source: '/test',
        destination: '/test/60s',
        permanent: true,
      },
      {
        source: '/test/60',
        destination: '/test/60s',
        permanent: true,
      },
      {
        source: '/test/15',
        destination: '/test/15s',
        permanent: true,
      },
      {
        source: '/test/30',
        destination: '/test/30s',
        permanent: true,
      },
      {
        source: '/test/120',
        destination: '/test/120s',
        permanent: true,
      },
      // Privacy alias redirect
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

