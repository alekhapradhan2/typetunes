"use client";

import { useAdSense } from "@/hooks/useAdSense";

const AD_CLIENT = "ca-pub-5823659147566885";

interface RailAdProps {
  side: "left" | "right";
  slot?: string;
}

function SingleRailAd({ side, slot }: RailAdProps) {
  const { adLoaded, adUnfilled, insRef, pathname, isMounted } = useAdSense();

  if (adUnfilled) return null;

  return (
    <aside
      className={`fixed top-24 ${
        side === "left" ? "left-2 2xl:left-6" : "right-2 2xl:right-6"
      } z-30 hidden xl:flex flex-col items-center justify-center w-[120px] 2xl:w-[160px] h-[600px] pointer-events-auto select-none`}
      aria-label={`${side} skyscraper advertisement`}
      aria-hidden="true"
    >
      <div
        className={`w-full h-full flex items-center justify-center rounded-2xl overflow-hidden ${
          adLoaded ? "bg-white/5 border border-stone-200/40 dark:border-slate-800 shadow-xs" : "bg-transparent"
        }`}
      >
        {isMounted && (
          <ins
            key={`rail-${side}-${pathname}`}
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "inline-block", width: "100%", height: "600px" }}
            data-ad-client={AD_CLIENT}
            data-ad-slot={slot || (side === "left" ? "8431068054" : "2932419707")}
            data-ad-format="vertical"
          />
        )}
      </div>
    </aside>
  );
}

export function DesktopSideRails() {
  return (
    <>
      <SingleRailAd side="left" />
      <SingleRailAd side="right" />
    </>
  );
}
