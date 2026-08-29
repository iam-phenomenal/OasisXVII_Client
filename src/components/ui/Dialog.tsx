"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/** Never fires; the dialog only needs the server/client split of the snapshots. */
const emptySubscribe = () => () => {};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Rendered as the heading and used as the dialog's accessible name. */
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  // The portal target only exists after hydration.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;

    lockScroll();

    return unlockScroll;
  }, [open]);

  // Take focus on open, hand it back to whatever opened us on close.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    panelRef.current?.focus();

    return () => {
      previouslyFocused?.focus();
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      // Nothing to move to — keep focus on the panel rather than letting it
      // escape to the page underneath.
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div
        className="dialog-scrim fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 pointer-events-none">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="dialog-panel pointer-events-auto w-full max-w-lg max-h-[85vh] overflow-y-auto bg-surface-container border border-outline-variant/30 shadow-wine-ambient outline-none"
        >
          <div className="flex items-start justify-between gap-6 px-8 pt-8 pb-6">
            <h2
              id={titleId}
              className="font-headline font-black uppercase text-xs tracking-[0.3em] text-accent"
            >
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-3 -mt-3 h-10 w-10 shrink-0 flex items-center justify-center text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                close
              </span>
            </button>
          </div>

          <div className="px-8 pb-8">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
}
