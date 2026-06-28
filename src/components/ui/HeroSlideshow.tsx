"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (validImages.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % validImages.length;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [validImages.length, interval]);

  return (
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
  );
}
