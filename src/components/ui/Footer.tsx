import Link from 'next/link';
import { Music2, GitFork, Share2 } from 'lucide-react';

const footerLinks = {
  'Typing Tests': [
    { href: '/', label: 'Free Typing Speed Test' },
    { href: '/test/60s', label: '1-Minute Standard Test' },
    { href: '/test/15s', label: '15-Second Speed Sprint' },
    { href: '/test/120s', label: '2-Minute Endurance Test' },
    { href: '/test/zen', label: 'Zen Calm Mode' },
  ],
  'Activities & Games': [
    { href: '/newspaper', label: 'Newspaper Studio for Students' },
    { href: '/games', label: 'Typing Games & Action Arcade' },
    { href: '/custom', label: 'Custom Typing Practice & Code' },
    { href: '/test/quotes', label: 'Quote Typing Mode' },
  ],
  'Learn & Guides': [
    { href: '/blog', label: 'Read & Practice Blog' },
    { href: '/faq', label: 'Typing Speed FAQ' },
    { href: '/about', label: 'About Typetune' },
  ],
  'Company & Legal': [
    { href: '/contact', label: 'Contact Support' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200/60 bg-cream-dark/40">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-14">
        {/* Top row */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-green-700 via-emerald-500 to-green-400 text-white shadow-xs">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9.5" cy="14.5" r="3.2" />
                  <path d="M12.7 14.5 V5.5 L19.5 9" />
                </svg>
              </div>
              <span
                className="text-lg font-bold text-slate-800"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Typetune
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
              The calm typing test that turns your keystrokes into music.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://twitter.com"
                aria-label="Typetune on Twitter"
                className="p-2 rounded-lg text-slate-400 hover:text-sage-600 hover:bg-sage-100 transition-colors"
              >
                <Share2 size={16} />
              </a>
              <a
                href="https://github.com"
                aria-label="TypeTunes on GitHub"
                className="p-2 rounded-lg text-slate-400 hover:text-sage-600 hover:bg-sage-100 transition-colors"
              >
                <GitFork size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-sage-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-2 border-t border-cream-dark pt-8 text-center md:flex-row md:justify-between">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Typetune. Free to use, always.
          </p>
          <p className="text-xs text-slate-400">
            Built with ♪ and Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}

