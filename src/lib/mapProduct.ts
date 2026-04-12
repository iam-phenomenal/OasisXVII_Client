import type { InferSelectModel } from "drizzle-orm";
import type { products } from "@/db/schema";
import type { Product } from "@/types/product";

type DbProduct = InferSelectModel<typeof products>;

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

export function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    price: Number(row.price),
    currency: row.currency as Product["currency"],
    category: row.category,
    badge: row.badge as Product["badge"],
    images: toStringArray(row.images),
    sizes: toStringArray(row.sizes),
    colors: toStringArray(row.colors),
    specs: toStringRecord(row.specs),
    relatedProductIds: toStringArray(row.relatedProductIds),
  };
}
