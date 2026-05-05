import { products as staticProducts } from "@/data/products";
import type { Product } from "@/types/product";
import { ApiError, apiFetch } from "./client";

function sanitize(p: Product): Product {
  return {
    ...p,
    images: p.images.filter(
      (img): img is string => typeof img === "string" && img.length > 0,
    ),
  };
}

export async function getActiveProducts(): Promise<Product[]> {
  try {
    const products = await apiFetch<Product[]>("/products", {
      next: { tags: ["products"] },
    });
    return products.map(sanitize);
  } catch {
    return staticProducts;
  }
}

export async function getActiveProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const product = await apiFetch<Product>(`/products/${slug}`, {
      next: { tags: ["products", `product-${slug}`] },
    });
    return sanitize(product);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    return staticProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getActiveProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) {
    return [];
  }

  try {
    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join("&");

    const products = await apiFetch<Product[]>(`/products/by-ids?${query}`, {
      next: { tags: ["products"] },
    });
    return products.map(sanitize);
  } catch {
    return staticProducts.filter((product) => ids.includes(product.id));
  }
}