"use client";

import { useAdSense } from "@/hooks/useAdSense";

const AD_CLIENT = "ca-pub-5823659147566885";
// In-feed fluid ad slot — same as Ollypedia
const AD_SLOT = "3815666049";

interface InFeedAdProps {
  slot?: string;
  className?: string;
}

/**
 * InFeedAd — fluid in-feed ad for blog listing pages or between content sections.
 */
export function InFeedAd({ slot = AD_SLOT, className = "" }: InFeedAdProps) {
  const { adLoaded, adUnfilled, insRef, pathname, isMounted } = useAdSense();

  if (adUnfilled || !isMounted) return null;

  return (
    <div
      className={`w-full min-h-[100px] overflow-hidden block rounded-xl transition-all duration-700 ${className} ${
        adLoaded
          ? "bg-white/5 border border-stone-200/40"
          : "bg-transparent"
      }`}
    >
      {isMounted && (
        <ins
          key={pathname}
          ref={insRef}
          className="adsbygoogle w-full"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="-6t+ed+2i-1n-4w"
          data-ad-client={AD_CLIENT}
          data-ad-slot={AD_SLOT}
        />
      )}
    </div>
  );
}
