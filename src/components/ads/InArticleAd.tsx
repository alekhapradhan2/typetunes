"use client";

import { useAdSense } from "@/hooks/useAdSense";

const AD_CLIENT = "ca-pub-5823659147566885";
// In-article ad slot — 'Blogs' unit (2701894920) or 'Article' (9266272699)
const AD_SLOT = "2701894920";

interface InArticleAdProps {
  slot?: string;
  className?: string;
}

/**
 * InArticleAd — native Google AdSense in-article fluid ad unit for blog articles.
 * Matches AdSense 'In-article' ad format guidelines.
 */
export function InArticleAd({
  slot = AD_SLOT,
  className = "",
}: InArticleAdProps) {
  const { adLoaded, adUnfilled, insRef, pathname, isMounted } = useAdSense();

  if (adUnfilled || !isMounted) return null;

  return (
    <div
      className={`my-6 sm:my-8 w-full block overflow-hidden transition-all duration-500 rounded-xl ${
        adLoaded ? "bg-white/5 border border-stone-200/40 dark:border-slate-800 p-1" : "bg-transparent"
      } ${className}`}
      aria-label="In-article advertisement"
    >
      {isMounted && (
        <ins
          key={`in-article-${pathname}-${slot}`}
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
        />
      )}
    </div>
  );
}
