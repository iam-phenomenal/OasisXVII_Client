"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

interface HeroSlideshowProps {
  images: string[];
  interval?: number;
}

export function HeroSlideshow({ images, interval = 4000 }: HeroSlideshowProps) {
  const validImages = (Array.isArray(images) ? images : []).filter(
    (src): src is string => typeof src === "string" && src.length > 0,
  );
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  // Read as an external store rather than syncing into state from an effect —
  // that would setState during the first commit and cascade a second render.
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  // Null until the visitor presses the control; the media query is only the
  // starting position, so their explicit choice wins from then on.
  const [pausedByUser, setPausedByUser] = useState<boolean | null>(null);
  const paused = pausedByUser ?? prefersReducedMotion;

  useEffect(() => {
    if (validImages.length < 2 || paused) return;
    const timer = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % validImages.length;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [validImages.length, interval, paused]);

  return (
    <>
      <div className="absolute inset-0 z-0">
        {validImages.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            className="brightness-[0.35] transition-opacity duration-1000"
            style={{
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 2 : i === prev ? 1 : 0,
              objectFit: "cover",
              objectPosition: "center",
            }}
            priority={i === 0}
            sizes="100vw"
          />
        ))}
      </div>
      {validImages.length >= 2 && (
        <button
          type="button"
          onClick={() => setPausedByUser(!paused)}
          aria-pressed={paused}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/40 text-on-surface opacity-0 backdrop-blur-sm transition pointer-events-none hover:bg-background/60 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {paused ? (
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 2l11 6-11 6V2z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="3" y="2" width="3.5" height="12" />
              <rect x="9.5" y="2" width="3.5" height="12" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
