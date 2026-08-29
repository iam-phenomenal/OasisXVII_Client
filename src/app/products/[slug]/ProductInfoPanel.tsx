"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { fitNotes, getSizeChart } from "@/data/sizeGuide";

export function ProductInfoPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  // Accessories are one-size and have no chart, so they get no trigger at all.
  const sizeChart = getSizeChart(product.category);
  const fitValue = product.specs.Fit;
  const fitNote = fitValue ? fitNotes[fitValue] : undefined;

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
          {sizeChart ? (
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={sizeGuideOpen}
              className="font-headline font-bold uppercase text-xs tracking-[0.3em] text-on-surface-variant underline underline-offset-4 decoration-outline-variant transition-colors hover:text-on-surface hover:decoration-on-surface-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              SIZE GUIDE
            </button>
          ) : null}
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
                  "h-16 flex items-center justify-center font-headline font-bold transition-colors " +
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isSelected
                    ? "border-2 border-primary bg-primary/10 text-on-surface-primary"
                    : "border border-outline-variant/30 hover:border-primary hover:bg-on-surface hover:text-surface",
                ].join(" ")}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-16">
        <Button
          type="button"
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
        <span aria-live="polite" className="sr-only">
          {added ? "Added to bag" : ""}
        </span>
      </div>

      <div className="pt-16 border-t border-outline-variant/20 space-y-12">
        <div>
          <p className="font-headline font-black uppercase text-xs tracking-[0.3em] mb-6 text-on-surface-primary">
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

      {sizeChart ? (
        <Dialog
          open={sizeGuideOpen}
          onClose={() => setSizeGuideOpen(false)}
          title="SIZE GUIDE"
        >
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Size conversions for {product.name}
            </caption>
            <thead>
              <tr className="border-b border-outline-variant/30">
                {sizeChart.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="py-3 pr-4 last:pr-0 font-headline font-bold uppercase text-[10px] tracking-[0.2em] text-on-surface-variant"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeChart.rows.map((row) => {
                const inStock = product.sizes.includes(row[0]);

                return (
                  <tr
                    key={row[0]}
                    className={[
                      "border-b border-outline-variant/15 last:border-b-0",
                      inStock ? "" : "opacity-40",
                    ].join(" ")}
                  >
                    <th
                      scope="row"
                      className="py-4 pr-4 font-headline font-bold text-sm text-on-surface"
                    >
                      {row[0]}
                      {inStock ? null : (
                        <span className="sr-only"> (not available)</span>
                      )}
                    </th>
                    {row.slice(1).map((cell, index) => (
                      <td
                        key={sizeChart.columns[index + 1]}
                        className="py-4 pr-4 last:pr-0 font-body text-sm text-on-surface-variant"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {sizeChart.rows.some((row) => !product.sizes.includes(row[0])) ? (
            <p className="mt-6 font-body text-xs leading-relaxed text-on-surface-variant">
              Dimmed sizes are not available for this product.
            </p>
          ) : null}

          {fitNote ? (
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <p className="font-headline font-bold uppercase text-[10px] tracking-[0.2em] text-accent mb-3">
                HOW IT FITS
              </p>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                {fitNote}
              </p>
            </div>
          ) : null}
        </Dialog>
      ) : null}
    </aside>
  );
}
