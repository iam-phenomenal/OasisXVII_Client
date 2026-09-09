import type { Product } from "@/types/product";

export type SortKey =
  | "featured"
  | "best-selling"
  | "price-asc"
  | "price-desc"
  | "newest";

export function parseSortKey(raw: string | null | undefined): SortKey {
  return raw === "best-selling" ||
    raw === "price-asc" ||
    raw === "price-desc" ||
    raw === "newest"
    ? raw
    : "featured";
}

export function parsePageNumber(raw: string | null | undefined): number {
  return Math.max(1, parseInt(raw ?? "1", 10) || 1);
}

export function sortProducts(list: Product[], sort: SortKey) {
  const cloned = [...list];

  switch (sort) {
    case "price-asc":
      return cloned.sort((a, b) => a.price - b.price);
    case "price-desc":
      return cloned.sort((a, b) => b.price - a.price);
    case "newest":
      return cloned.reverse();
    case "best-selling":
      return cloned.sort((a, b) => {
        const aScore =
          (a.badge === "New Drop" ? 2 : 0) + (a.badge === "Limited" ? 1 : 0);
        const bScore =
          (b.badge === "New Drop" ? 2 : 0) + (b.badge === "Limited" ? 1 : 0);
        return bScore - aScore;
      });
    case "featured":
    default:
      return cloned;
  }
}
