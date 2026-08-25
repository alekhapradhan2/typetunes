'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  Mail,
  Zap,
  Flame,
} from 'lucide-react';
import CustomizeSoundsNav from '@/components/audio/CustomizeSoundsNav';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: 'new' | 'count' | 'tech';
}

const PRIMARY_LINKS: NavItem[] = [
  { href: '/', label: 'Speed Test', icon: Keyboard },
  {
    href: '/games',
    label: 'Arcade Games',
    icon: Gamepad2,
    badge: '10 Games',
    badgeType: 'count',
  },
  {
    href: '/newspaper',
    label: 'Newspaper Studio',
    icon: Newspaper,
    badge: 'New',
    badgeType: 'new',
  },
  {
    href: '/custom',
    label: 'Custom Drills',
    icon: PenTool,
    badge: 'Code',
    badgeType: 'tech',
  },
  {
    href: '/blog',
    label: 'Guides',
    icon: BookOpen,
  },
];

const MORE_LINKS = [
  {
    href: '/faq',
    label: 'Typing FAQ & WPM',
    description: 'Benchmarks, formulas & questions',
    icon: HelpCircle,
  },
  {
    href: '/about',
    label: 'About Typetune',
    description: 'Our acoustic typing philosophy',
    icon: Sparkles,
  },
  {
    href: '/contact',
    label: 'Contact & Support',
    description: 'Feedback, inquiries & help',
    icon: Mail,
  },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close mobile & more menu on page navigation
  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Click outside listener for More dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [moreOpen]);

  const isMoreActive = MORE_LINKS.some((l) => pathname === l.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/70 dark:border-slate-800 bg-cream/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-[0_1px_15px_-4px_rgba(0,0,0,0.03)] transition-all duration-200">
      <nav
        className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-1.5 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-transform duration-200 active:scale-95"
            aria-label="Typetune home"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-green-700 via-emerald-500 to-green-400 text-white shadow-xs group-hover:scale-105 transition-all duration-200">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9.5" cy="14.5" r="3.2" />
                <path d="M12.7 14.5 V5.5 L19.5 9" />
              </svg>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-300 border-2 border-cream dark:border-slate-900 ring-1 ring-emerald-600/30 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span
                className="text-lg font-bold tracking-tight text-slate-800 dark:text-white leading-none group-hover:text-sage-700 dark:group-hover:text-sage-400 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Typetune
              </span>
              <span className="text-[9px] font-medium text-sage-600 dark:text-sage-400 tracking-wider uppercase mt-0.5">
                Musical Typing
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-0.5 rounded-xl bg-stone-200/40 dark:bg-slate-900/80 border border-stone-200/60 dark:border-slate-800 backdrop-blur-sm">
          {PRIMARY_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/'
                ? pathname === '/' || pathname.startsWith('/test')
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-sage-800 dark:text-sage-300 shadow-xs border border-stone-200/80 dark:border-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  size={13}
                  className={`transition-colors shrink-0 ${
                    isActive ? 'text-sage-600 dark:text-sage-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{link.label}</span>

                {link.badge && (
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full border uppercase tracking-wider ${
                      link.badgeType === 'new'
                        ? 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-700/50'
                        : link.badgeType === 'count'
                        ? 'bg-purple-100/80 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-700/50'
                        : 'bg-sky-100/80 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-700/50'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isMoreActive || moreOpen
                  ? 'bg-white dark:bg-slate-800 text-sage-800 dark:text-sage-300 shadow-xs border border-stone-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>More</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  moreOpen ? 'rotate-180 text-sage-600 dark:text-sage-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-2xl border border-stone-200/90 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-scale-in space-y-0.5">
                {MORE_LINKS.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-sage-50 dark:bg-sage-950/60 text-sage-900 dark:text-sage-200 font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                        <ItemIcon size={14} />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 dark:text-white leading-tight">{item.label}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Audio Synthesizer & Theme Toggle & Quick Action CTA */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <CustomizeSoundsNav />
          <ThemeToggle />

          <Link
            href="/test/60s"
            className="group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sage-600 via-sage-500 to-emerald-600 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0"
          >
            <Play size={12} fill="currentColor" className="group-hover:translate-x-0.5 transition-transform" />
            <span>Start Test</span>
          </Link>
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="sm:hidden">
            <CustomizeSoundsNav />
          </div>
          <ThemeToggle />

          <button
            className="rounded-xl p-2 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-stone-200/80 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="border-t border-stone-200/80 bg-cream/98 backdrop-blur-2xl lg:hidden animate-fade-in shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
            {/* Primary Apps */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Features & Modes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                {PRIMARY_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === '/'
                      ? pathname === '/' || pathname.startsWith('/test')
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                        isActive
                          ? 'bg-sage-600 text-white border-sage-600 shadow-xs'
                          : 'bg-white/70 text-slate-700 hover:text-sage-800 hover:bg-white border-stone-200/60'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          size={16}
                          className={isActive ? 'text-white' : 'text-slate-400'}
                        />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${
                            isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : link.badgeType === 'new'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : link.badgeType === 'count'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-sky-100 text-sky-800 border-sky-200'
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Resources & More */}
            <div className="space-y-1 pt-2 border-t border-stone-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Resources & Legal
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-1">
                {MORE_LINKS.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isActive
                          ? 'bg-sage-100 text-sage-900 border-sage-300'
                          : 'bg-white/50 text-slate-600 hover:bg-white border-stone-200/50'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <ItemIcon size={14} className="text-slate-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Sound Config & Action */}
            <div className="pt-3 border-t border-stone-200/60 flex flex-col sm:flex-row items-center gap-2.5">
              <div className="w-full sm:w-auto">
                <CustomizeSoundsNav />
              </div>
              <Link
                href="/test/60s"
                className="w-full py-2.5 rounded-xl font-bold text-sm text-center text-white bg-gradient-to-r from-sage-600 to-emerald-600 shadow-md flex items-center justify-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Play size={14} fill="currentColor" />
                <span>Start Speed Test</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

