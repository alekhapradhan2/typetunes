"use client";

import { useAdSense } from "@/hooks/useAdSense";

const AD_CLIENT = "ca-pub-5823659147566885";
// Multiplex ad slot — same as Ollypedia's GlobalMultiplexAd
const AD_SLOT = "8191172163";

/**
 * GlobalMultiplexAd — auto-format multiplex ad that sits at the
 * bottom of every page just above the footer (like in Ollypedia).
 */
export function GlobalMultiplexAd() {
  const { adLoaded, adUnfilled, insRef, pathname, isMounted } = useAdSense();

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-8 my-8 transition-all duration-700 ${
        adUnfilled ? "hidden" : ""
      }`}
    >
      <div
        className={`adsense-container w-full min-h-[100px] block rounded-xl border border-stone-200/40 p-2 transition-all duration-700 ${
          adLoaded ? "bg-white/5" : "bg-transparent"
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
            data-ad-slot={AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}
