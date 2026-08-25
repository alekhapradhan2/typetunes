"use client";

import { useAdSense } from "@/hooks/useAdSense";

const AD_CLIENT = "ca-pub-5823659147566885";

interface TopBannerAdProps {
  slot?: string;
  className?: string;
}

export function TopBannerAd({
  slot = "8392104821",
  className = "",
}: TopBannerAdProps) {
  const { adLoaded, adUnfilled, insRef, pathname, isMounted } = useAdSense();

  if (adUnfilled) return null;

  return (
    <aside
      className={`w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-8 py-2 overflow-hidden flex items-center justify-center transition-all duration-300 ${className}`}
      aria-label="Top Advertisement"
      aria-hidden="true"
    >
      <div
        className={`w-full min-h-[90px] max-h-[120px] sm:min-h-[100px] flex items-center justify-center rounded-xl overflow-hidden ${
          adLoaded ? "bg-white/5 border border-stone-200/40 dark:border-slate-800" : "bg-transparent"
        }`}
      >
        {isMounted && (
          <ins
            key={`top-banner-${pathname}`}
            ref={insRef}
            className="adsbygoogle w-full"
            style={{ display: "block", minHeight: "90px", maxHeight: "120px" }}
            data-ad-client={AD_CLIENT}
            data-ad-slot={slot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </aside>
  );
}
