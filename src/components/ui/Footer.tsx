import Link from 'next/link';
import { Music2, GitFork, Share2 } from 'lucide-react';

const footerLinks = {
  Product: [
    { href: '/', label: 'Typing Test' },
    { href: '/test/15s', label: '15-Second Test' },
    { href: '/test/60s', label: '1-Minute Test' },
    { href: '/test/zen', label: 'Zen Mode' },
  ],
  Learn: [
    { href: '/blog', label: 'Blog & Guides' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About TypeTunes' },
  ],
  Legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact Us' },
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-500 text-white">
                <Music2 size={16} strokeWidth={2.5} />
              </div>
              <span
                className="text-lg font-bold text-slate-800"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                TypeTunes
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
              The calm typing test that turns your keystrokes into music.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://twitter.com"
                aria-label="TypeTunes on Twitter"
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
            © {new Date().getFullYear()} TypeTunes. Free to use, always.
          </p>
          <p className="text-xs text-slate-400">
            Built with ♪ and Next.js. Deployed at https://typetunes.in.
          </p>
        </div>
      </div>
    </footer>
  );
}

