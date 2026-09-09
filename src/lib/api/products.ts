import type { Product } from "@/types/product";
import { ApiError, apiFetch } from "./client";

/**
 * The catalog's freshness window, in seconds.
 *
 * `POST /api/revalidate` with the `products` tag is the real invalidation
 * mechanism — the backend fires it on every product mutation, which collapses
 * the window to near zero. This TTL is only the backstop for a webhook that
 * never arrives, so it is deliberately longer than the freshness we actually
 * expect to run at.
 *
 * The routes that read these fetches deliberately do not export their own
 * `revalidate`. A segment-level window would not cap this one, it would stack
 * on top of it: a regeneration that starts against a nearly-expired data entry
 * renders near-stale data and then caches that render for the full segment
 * window again, roughly doubling the real worst case. Letting Next derive each
 * segment's window from these fetches keeps one number in one place.
 */
// const CATALOG_REVALIDATE_SECONDS = 900;

function sanitize(p: Product): Product {
  return {
    ...p,
    images: p.images.filter(
      (img): img is string => typeof img === "string" && img.length > 0,
    ),
  };
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await apiFetch<Product[]>("/products", {
    // next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["products"] },
    cache: "no-store",
  });
  return products.map(sanitize);
}

export async function getActiveProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const product = await apiFetch<Product>(`/products/${slug}`, {
      // next: {
      //   revalidate: CATALOG_REVALIDATE_SECONDS,
      //   tags: ["products", `product-${slug}`],
      // },
      cache: "no-store",
    });
    return sanitize(product);
  } catch (error) {
    // A 404 is an answer, not a failure: the catalog is reachable and says this
    // slug does not exist, so `null` is real data and safe to cache. Every other
    // error propagates, failing the render so no ISR entry is written for it.
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    console.log(error);

    throw error;
  }
}

/**
 * The single by-ids product read. Both callers go through it — the PDP's
 * related-products grid on the server, and `GET /api/products/by-ids` on behalf
 * of the cart — so one product cannot show two prices depending on which
 * surface you are looking at. The window and tag here are the catalog's, the
 * same pair used by `getActiveProducts` and `getActiveProductBySlug`.
 */
export async function getActiveProductsByIds(
  ids: string[],
): Promise<Product[]> {
  if (ids.length === 0) {
    return [];
  }

  const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join("&");

  const products = await apiFetch<Product[]>(`/products/by-ids?${query}`, {
    // next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["products"] },
    cache: "no-store",
  });
  return products.map(sanitize);
}
