'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Music2,
  Menu,
  X,
  Keyboard,
  Newspaper,
  Gamepad2,
  PenTool,
  BookOpen,
  HelpCircle,
  Play,
  Sparkles,
} from 'lucide-react';
import CustomizeSoundsNav from '@/components/audio/CustomizeSoundsNav';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navLinks: NavItem[] = [
  { href: '/', label: 'Test', icon: Keyboard },
  {
    href: '/newspaper',
    label: 'Newspaper Studio',
    icon: Newspaper,
    badge: 'NEW',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    href: '/games',
    label: 'Games Arcade',
    icon: Gamepad2,
    badge: '10 Games',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    href: '/custom',
    label: 'Custom Studio',
    icon: PenTool,
    badge: 'Drills',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/about', label: 'About', icon: Sparkles },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on page navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/60 bg-cream/90 backdrop-blur-xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] transition-all">
      <nav
        className="w-full max-w-[1720px] mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-12 py-2.5"
        aria-label="Main navigation"
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-slate-900 transition-all"
            aria-label="TypeTunes home"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sage-600 via-sage-500 to-emerald-400 text-white shadow-md shadow-sage-500/25 group-hover:scale-105 group-hover:shadow-sage-500/40 transition-all">
              <Music2 size={18} strokeWidth={2.5} className="animate-pulse" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-cream" />
            </div>
            <div className="flex flex-col">
              <span
                className="text-xl font-bold tracking-tight text-slate-800 leading-none group-hover:text-sage-700 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                TypeTunes
              </span>
              <span className="text-[10px] font-semibold text-sage-600 tracking-wider uppercase mt-0.5">
                Acoustic Typing
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Responsive, Never Breaks) */}
        <ul className="hidden items-center gap-1 xl:gap-1.5 2xl:gap-2 lg:flex" role="list">
          {/* Primary Main Feature Links */}
          {navLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap border ${
                    isActive
                      ? 'bg-sage-600 text-white border-sage-600 shadow-sm shadow-sage-600/20'
                      : 'text-slate-600 hover:text-sage-800 hover:bg-sage-100/70 border-transparent hover:border-sage-200/50'
                  }`}
                >
                  <Icon
                    size={14}
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-sage-600'
                    }`}
                  />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[8px] xl:text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : link.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}

          {/* Secondary Links (Visible on 2XL screens) */}
          {navLinks.slice(4).map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <li key={link.href} className="hidden 2xl:block shrink-0">
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap border ${
                    isActive
                      ? 'bg-sage-600 text-white border-sage-600 shadow-sm shadow-sage-600/20'
                      : 'text-slate-600 hover:text-sage-800 hover:bg-sage-100/70 border-transparent hover:border-sage-200/50'
                  }`}
                >
                  <Icon
                    size={14}
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-sage-600'
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: Sound Customizer & Primary Action CTA (Shrink Protected) */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-2.5 shrink-0">
          <CustomizeSoundsNav />

          <Link
            href="/test/60s"
            className="btn-primary text-xs sm:text-sm py-2 px-3.5 sm:px-4 font-bold flex items-center gap-1.5 whitespace-nowrap shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <Play size={13} fill="currentColor" />
            <span>Start Typing</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="sm:hidden">
            <CustomizeSoundsNav />
          </div>

          <button
            className="rounded-xl p-2.5 text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-200/70 shadow-2xs transition-all cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Clean Full-Width Dropdown) */}
      {open && (
        <div className="border-t border-stone-200/60 bg-cream/98 backdrop-blur-2xl lg:hidden animate-fade-in shadow-xl">
          <div className="w-full max-w-[1720px] mx-auto px-4 py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      isActive
                        ? 'bg-sage-600 text-white border-sage-600 shadow-xs'
                        : 'text-slate-700 hover:text-sage-800 hover:bg-sage-100/70 border-transparent hover:border-sage-200/50'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={17}
                        className={isActive ? 'text-white' : 'text-slate-400'}
                      />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : link.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200/60 flex flex-col sm:flex-row items-center gap-2.5">
              <div className="w-full sm:w-auto">
                <CustomizeSoundsNav />
              </div>
              <Link
                href="/test/60s"
                className="btn-primary w-full justify-center py-2.5 text-sm font-bold shadow-md"
                onClick={() => setOpen(false)}
              >
                <Play size={14} fill="currentColor" />
                <span>Start 1-Minute Speed Test</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
