"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { REDUCED_MOTION_QUERY, setLenis } from "@/lib/lenis";
import { isScrollLocked } from "@/lib/scrollLock";

/**
 * Owns the Lenis lifecycle.
 *
 * Under `prefers-reduced-motion: reduce` Lenis is never constructed — the user
 * gets native scrolling, not a faster version of the smooth kind. The media
 * query is watched rather than read once, so toggling the OS setting takes
 * effect without a reload. Phase 4 verifies reduced motion by toggling the real
 * setting, and that check is only meaningful if the app responds to it live.
 *
 * Renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    let lenis: Lenis | null = null;
    let frame = 0;

    const start = () => {
      if (lenis) return;

      lenis = new Lenis({ autoRaf: false });
      setLenis(lenis);

      // An overlay may already hold the scroll lock — see isScrollLocked().
      if (isScrollLocked()) lenis.stop();

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };

      frame = requestAnimationFrame(raf);
    };

    const stop = () => {
      if (!lenis) return;

      cancelAnimationFrame(frame);
      frame = 0;
      lenis.destroy();
      lenis = null;
      setLenis(null);
    };

    const sync = () => (query.matches ? stop() : start());

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
