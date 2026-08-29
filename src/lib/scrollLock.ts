/**
 * Ref-counted body scroll lock.
 *
 * Overlays can stack — the mobile menu and a dialog can both be open — so an
 * overlay must not clear the lock on close while another one is still up.
 * Callers pair every lock() with exactly one unlock().
 */

let lockCount = 0;
let previousOverflow = "";

export function lockScroll() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  lockCount += 1;
}

export function unlockScroll() {
  if (lockCount === 0) return;

  lockCount -= 1;

  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
}
