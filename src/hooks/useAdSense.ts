"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function useAdSense() {
  const pathname = usePathname();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adUnfilled, setAdUnfilled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // AdSense ads do not serve on localhost; disable dummy white boxes in local dev
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      setAdUnfilled(true);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      return;
    }

    setAdLoaded(false);
    setAdUnfilled(false);

    const timer = setTimeout(() => {
      const el = insRef.current;
      if (
        el &&
        !el.hasAttribute("data-adsbygoogle-status") &&
        !el.hasAttribute("data-pushed")
      ) {
        try {
          el.setAttribute("data-pushed", "true");
          ((window as unknown as Record<string, unknown>).adsbygoogle =
            (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdSense initialization error", e);
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const el = insRef.current;
    if (!el) return;

    const checkStatus = () => {
      const status = el.getAttribute("data-ad-status");
      if (status === "filled") {
        setAdLoaded(true);
        setAdUnfilled(false);
      } else if (status === "unfilled") {
        setAdUnfilled(true);
        setAdLoaded(false);
      }
    };

    checkStatus();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-ad-status") {
          checkStatus();
        }
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ["data-ad-status"] });

    return () => observer.disconnect();
  }, [pathname, isMounted]);

  return { adLoaded, adUnfilled, insRef, pathname, isMounted };
}
