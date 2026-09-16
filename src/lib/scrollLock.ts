/**
 * Ref-counted body scroll lock.
 *
 * Overlays can stack — the mobile menu and a dialog can both be open — so an
 * overlay must not clear the lock on close while another one is still up.
 * Callers pair every lock() with exactly one unlock().
 *
 * The lock drives Lenis as well as `overflow`. Lenis runs its own rAF loop and
 * ignores `overflow: hidden`, so without the paired stop/start the page keeps
 * scrolling behind an open overlay. Both writes happen only on the outermost
 * transition, which is what the ref count is for.
 */

import { getLenis } from "./lenis";

let lockCount = 0;
let previousOverflow = "";

export function lockScroll() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
  }

  lockCount += 1;
}

export function unlockScroll() {
  if (lockCount === 0) return;

  lockCount -= 1;

  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    getLenis()?.start();
  }
}

/**
 * Whether an overlay currently holds the lock.
 *
 * Lenis can be created while an overlay is already open — the user toggles the
 * OS reduced-motion setting off with the mobile menu up, and the provider
 * builds a fresh instance. A new instance starts running, so it has to be
 * stopped to match the lock that is already held.
 */
export function isScrollLocked(): boolean {
  return lockCount > 0;
}
