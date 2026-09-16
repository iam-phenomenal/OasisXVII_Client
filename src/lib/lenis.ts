/**
 * Registry for the single Lenis instance.
 *
 * Lenis drives scrolling itself on a rAF loop and ignores `overflow: hidden`
 * entirely, so `scrollLock` has to stop and start it explicitly. That makes the
 * instance a cross-module concern: the provider owns its lifecycle, the scroll
 * lock only needs a handle to it.
 *
 * Under `prefers-reduced-motion: reduce` there is no instance at all —
 * `getLenis()` returns null and every caller degrades to native scrolling.
 */

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
