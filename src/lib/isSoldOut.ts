import type { Product } from "@/types/product";

/**
 * The catalog's single availability signal.
 *
 * `badge` is the only field the backend sends that carries stock state, so
 * every surface that has to block a purchase — the product page, the cart and
 * checkout — reads it through here rather than re-deriving the comparison. If
 * the catalog ever grows a real stock field, this is the one line that changes.
 */
export function isSoldOut(product: Pick<Product, "badge">): boolean {
  return product.badge === "Sold Out";
}
