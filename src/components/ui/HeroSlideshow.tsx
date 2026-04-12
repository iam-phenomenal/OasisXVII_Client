"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroSlideshowProps {
  images: string[];
  interval?: number;
}

export function HeroSlideshow({ images, interval = 4000 }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % images.length;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 z-0">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          className="w-full h-full object-cover object-center brightness-[0.35] grayscale contrast-125 transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 2 : i === prev ? 1 : 0,
          }}
          priority={i === 0}
          sizes="100vw"
        />
      ))}
    </div>
  );
}
