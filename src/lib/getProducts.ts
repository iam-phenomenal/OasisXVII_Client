import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { products as fallbackProducts } from "@/data/products";
import { mapProduct } from "@/lib/mapProduct";

export async function getActiveProducts() {
  try {
    const rawProducts = await getDb().query.products.findMany({
      where: eq(schema.products.status, "active"),
      orderBy: [desc(schema.products.createdAt)],
    });

    return rawProducts.map(mapProduct);
  } catch (error) {
    console.error("[getActiveProducts] Database query failed:", error);
    return fallbackProducts;
  }
}

export async function getActiveProductBySlug(slug: string) {
  try {
    const rawProduct = await getDb().query.products.findFirst({
      where: and(
        eq(schema.products.slug, slug),
        eq(schema.products.status, "active"),
      ),
    });

    return rawProduct ? mapProduct(rawProduct) : null;
  } catch (error) {
    console.error(
      `[getActiveProductBySlug] Database query failed for slug "${slug}":`,
      error,
    );
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getActiveProductsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  try {
    const rawProducts = await getDb().query.products.findMany({
      where: and(
        inArray(schema.products.id, ids),
        eq(schema.products.status, "active"),
      ),
    });

    return rawProducts.map(mapProduct);
  } catch (error) {
    console.error("[getActiveProductsByIds] Database query failed:", error);
    return fallbackProducts.filter((product) => ids.includes(product.id));
  }
}
