"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface ProductCache {
  key: string;
  products: Product[];
  failed: boolean;
}

/**
 * Loads the full product records backing the current cart.
 *
 * The fetched set is stored keyed by the cart's product ids so both the results
 * and the loading flag are derived during render rather than synchronised back
 * into state by an effect.
 *
 * A failed fetch is recorded as its own state rather than collapsing to an
 * empty array — callers need to tell "your bag is empty" apart from "we
 * couldn't load your bag", and offer `retry` for the latter.
 */
export function useCartProducts() {
  const { cartItems, hydrated } = useCart();
  const [cache, setCache] = useState<ProductCache | null>(null);
  const [attempt, setAttempt] = useState(0);

  const productKey = useMemo(
    () => [...new Set(cartItems.map((item) => item.productId))].sort().join(","),
    [cartItems],
  );

  useEffect(() => {
    if (!hydrated || productKey === "") return;

    const query = productKey
      .split(",")
      .map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&");

    let cancelled = false;

    fetch(`/api/products/by-ids?${query}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        return res.json();
      })
      .then((data: unknown) => {
        if (cancelled) return;
        setCache({
          key: productKey,
          products: Array.isArray(data) ? (data as Product[]) : [],
          failed: false,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setCache({ key: productKey, products: [], failed: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, productKey, attempt]);

  // Dropping the cache alongside the attempt bump puts the hook back into its
  // loading state, so a retry reads as a retry rather than a frozen error.
  const retry = useCallback(() => {
    setCache(null);
    setAttempt((n) => n + 1);
  }, []);

  const isFresh = cache?.key === productKey;
  const hasError = isFresh ? cache.failed : false;

  return {
    products: isFresh && !cache.failed ? cache.products : [],
    isLoading: !hydrated || (productKey !== "" && !isFresh),
    hasError,
    retry,
  };
}
