"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface ProductCache {
  key: string;
  products: Product[];
}

/**
 * Loads the full product records backing the current cart.
 *
 * The fetched set is stored keyed by the cart's product ids so both the results
 * and the loading flag are derived during render rather than synchronised back
 * into state by an effect.
 */
export function useCartProducts() {
  const { cartItems, hydrated } = useCart();
  const [cache, setCache] = useState<ProductCache | null>(null);

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
      .then((res) => res.json())
      .then((data: unknown) => {
        if (cancelled) return;
        setCache({
          key: productKey,
          products: Array.isArray(data) ? (data as Product[]) : [],
        });
      })
      .catch(() => {
        if (!cancelled) setCache({ key: productKey, products: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, productKey]);

  const isFresh = cache?.key === productKey;

  return {
    products: isFresh ? cache.products : [],
    isLoading: !hydrated || (productKey !== "" && !isFresh),
  };
}
