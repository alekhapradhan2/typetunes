"use client";

import { usePathname } from "next/navigation";
import { GlobalMultiplexAd } from "./GlobalMultiplexAd";

// Pages where we should NOT show ads (policy compliance)
const BLACKLISTED_ROUTES = [
  "/privacy-policy",
  "/terms",
  "/contact",
  "/api",
  "/admin",
];

/**
 * GlobalMultiplexWrapper — renders the global multiplex ad
 * above the footer on all pages except blacklisted ones.
 */
export function GlobalMultiplexWrapper() {
  const pathname = usePathname();

  const isBlacklisted = BLACKLISTED_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  if (isBlacklisted) return null;

  return <GlobalMultiplexAd key={pathname} />;
}
