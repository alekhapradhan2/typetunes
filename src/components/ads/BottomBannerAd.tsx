"use client";

import { useAdSense } from "@/hooks/useAdSense";

const AD_CLIENT = "ca-pub-5823659147566885";

interface BottomBannerAdProps {
  slot?: string;
  className?: string;
}

export function BottomBannerAd({
  slot = "8191172163",
  className = "",
}: BottomBannerAdProps) {
  const { adLoaded, adUnfilled, insRef, pathname, isMounted } = useAdSense();

  if (adUnfilled || !isMounted) return null;

  return (
    <aside
      className={`w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-8 py-4 overflow-hidden flex items-center justify-center transition-all duration-300 ${className}`}
      aria-label="Bottom Advertisement"
      aria-hidden="true"
    >
      <div
        className={`w-full min-h-[60px] sm:min-h-[90px] flex items-center justify-center rounded-2xl overflow-hidden ${
          adLoaded ? "bg-white/5 border border-stone-200/40 dark:border-slate-800" : "bg-transparent"
        }`}
      >
        {isMounted && (
          <ins
            key={`bottom-banner-${pathname}`}
            ref={insRef}
            className="adsbygoogle w-full"
            style={{ display: "block" }}
            data-ad-client={AD_CLIENT}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </aside>
  );
}
