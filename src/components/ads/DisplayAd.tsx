"use client";

import { useAdSense } from "@/hooks/useAdSense";

// Publisher ID shared with Ollypedia (same AdSense account)
const AD_CLIENT = "ca-pub-5823659147566885";

/**
 * DisplayAd — standard rectangular banner ad.
 * Usage: <DisplayAd slot="SLOT_ID" />
 */
export function DisplayAd({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string;
  format?: string;
  className?: string;
}) {
  const { adLoaded, adUnfilled, insRef, pathname, isMounted } = useAdSense();

  if (adUnfilled) return null;

  return (
    <div
      className={`adsense-container w-full min-h-[250px] block transition-all duration-700 rounded-xl ${className} ${
        adLoaded ? "bg-white/5 border border-stone-200/40" : "bg-transparent"
      }`}
      aria-hidden="true"
    >
      {isMounted && (
        <ins
          key={pathname}
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
  );
}
