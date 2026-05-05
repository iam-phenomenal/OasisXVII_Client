"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";

export function ProductInfoPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function handleAddToCart() {
    if (!selectedSize) return;

    addItem({
      productId: product.id,
      size: selectedSize,
      color: product.colors[0],
      quantity: 1,
    });

    setAdded(true);

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  return (
    <aside className="col-span-12 lg:col-span-5 lg:sticky lg:top-40 h-fit">
      <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] font-[900] tracking-tighter uppercase leading-[0.8] mb-12">
        {product.name}
      </h1>

      <div className="flex items-center gap-4 mb-16">
        <span className="text-4xl font-headline font-medium text-on-surface">
          {formatPrice(product.price, product.currency)}
        </span>
        {product.badge ? (
          <span className="px-4 py-1 bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest font-headline">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <p className="font-headline font-bold uppercase text-xs tracking-[0.3em] text-on-surface-variant">
            SELECT SIZE
          </p>
          <p className="font-headline font-bold uppercase text-xs tracking-[0.3em] text-on-surface-variant">
            SIZE GUIDE
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.sizes.slice(0, 8).map((size) => {
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={[
                  "h-16 flex items-center justify-center font-headline font-bold transition-all",
                  isSelected
                    ? "border-2 border-primary bg-primary/10 text-primary"
                    : "border border-outline-variant/30 hover:border-primary hover:bg-on-surface hover:text-surface",
                ].join(" ")}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-16">
        <Button
          variant="primary"
          fullWidth
          disabled={!selectedSize}
          className="h-24 text-2xl"
          onClick={handleAddToCart}
        >
          {added ? (
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check</span>
              ADDED
            </span>
          ) : (
            "ADD TO CART"
          )}
        </Button>
        <Button variant="ghost" fullWidth className="h-20 text-xs">
          ADD TO WISHLIST
        </Button>
      </div>

      <div className="pt-16 border-t border-outline-variant/20 space-y-12">
        <div>
          <p className="font-headline font-black uppercase text-xs tracking-[0.3em] mb-6 text-primary">
            PRODUCT SPECS
          </p>
          <p className="text-on-surface-variant font-body text-lg leading-relaxed max-w-lg uppercase">
            {product.description}
          </p>
        </div>

        <div className="p-8 bg-surface-container-low border-l-4 border-primary">
          <p className="font-headline text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3">
            SHIPPING & RETURNS
          </p>
          <p className="font-body text-sm leading-relaxed text-on-surface-variant">
            Dispatched in 2-4 business days. Complimentary returns within 14
            days of delivery.
          </p>
        </div>
      </div>
    </aside>
  );
}
