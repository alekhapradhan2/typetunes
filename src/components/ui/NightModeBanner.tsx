'use client';

import { useState, useEffect } from 'react';
import { Moon, Sparkles, X, Sun } from 'lucide-react';

export default function NightModeBanner() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default true until mounted to avoid SSR flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = sessionStorage.getItem('dismissed_night_banner');
    if (dismissed === 'true') {
      setIsDismissed(true);
    } else {
      setIsDismissed(false);
    }

    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsLightMode(!isDark);
    };

    checkTheme();

    // Listen for theme changes on documentElement
    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const enableDarkMode = () => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    setIsLightMode(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('dismissed_night_banner', 'true');
  };

  if (!mounted || !isLightMode || isDismissed) {
    return null;
  }

  return (
    <aside
      className="relative z-40 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white px-4 py-2.5 shadow-md border-b border-slate-800 animate-fade-in transition-all duration-300"
      aria-label="Night mode suggestion"
    >
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30 flex-shrink-0 animate-pulse">
            <Moon size={15} />
          </span>
          <p className="text-slate-200">
            <strong className="text-white font-semibold mr-1">Tired eyes?</strong>
            Switch to <span className="text-amber-300 font-medium">Night Mode</span> for a soothing, distraction-free typing session.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={enableDarkMode}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Moon size={13} className="fill-slate-950" />
            <span>Turn On Night Mode</span>
          </button>

          <button
            onClick={handleDismiss}
            type="button"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Dismiss night mode banner"
            title="Dismiss banner"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
