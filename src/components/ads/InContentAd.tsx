"use client";

import { useAdSense } from "@/hooks/useAdSense";

const AD_CLIENT = "ca-pub-5823659147566885";

interface InContentAdProps {
  slot?: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal";
}

export function InContentAd({
  slot = "8191172163",
  className = "",
  format = "auto",
}: InContentAdProps) {
  const { adLoaded, adUnfilled, insRef, pathname, isMounted } = useAdSense();

  if (adUnfilled || !isMounted) return null;

  return (
    <aside
      className={`my-6 sm:my-8 w-full flex items-center justify-center transition-all duration-300 ${className}`}
      aria-label="In-content advertisement"
      aria-hidden="true"
    >
      <div
        className={`w-full min-h-[60px] sm:min-h-[100px] max-w-5xl mx-auto flex items-center justify-center rounded-2xl overflow-hidden ${
          adLoaded ? "bg-white/5 border border-stone-200/40 dark:border-slate-800" : "bg-transparent"
        }`}
      >
        {isMounted && (
          <ins
            key={`in-content-${pathname}-${slot}`}
            ref={insRef}
            className="adsbygoogle w-full"
            style={{ display: "block" }}
            data-ad-client={AD_CLIENT}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        )}
      </div>
    </aside>
  );
}
