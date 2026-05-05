"use client";

import { useState } from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/getSafeImageUrl";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const validImages = (Array.isArray(images) ? images : []).filter(
    (img) => getSafeImageUrl([img]) !== undefined,
  ) as string[];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="aspect-[4/5] bg-surface-container overflow-hidden group relative">
        {validImages[activeIndex] ? (
          <Image
            src={validImages[activeIndex]}
            alt={productName}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
        ) : null}
      </div>

      {validImages.length > 1 ? (
        <div className="grid grid-cols-2 gap-6">
          {validImages.slice(0, 4).map((src, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${productName}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${productName} image ${index + 1}`}
                aria-pressed={isActive}
                className={[
                  "aspect-[4/5] bg-surface-container overflow-hidden relative transition-all duration-300",
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "opacity-60 hover:opacity-100 cursor-crosshair",
                ].join(" ")}
              >
                <Image
                  src={src}
                  alt={`${productName} view ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 29vw, 50vw"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
