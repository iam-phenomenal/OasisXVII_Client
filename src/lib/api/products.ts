import type { Product } from "@/types/product";
import { ApiError, apiFetch } from "./client";

/**
 * The catalog is read per request. All three reads below are `no-store`, so a
 * product edit in the backend is visible on the next page load with nothing to
 * invalidate and no window to wait out.
 *
 * The consequence to keep in mind: none of these responses are cached, so the
 * routes that read them cannot be prerendered. `/`, `/shop` and
 * `/products/[slug]` each declare `export const dynamic = "force-dynamic"` to
 * say so out loud — the product page in particular fails the build if it also
 * exports `generateStaticParams`.
 *
 * `POST /api/revalidate` still accepts the `products` and `product-<slug>` tags
 * so the backend's mutation webhook keeps succeeding, but there are no cache
 * entries left for those tags to purge. They are no-ops. Only `settings`, which
 * `src/lib/api/settings.ts` still caches, does real work there.
 */

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
    cache: "no-store",
  });
  return products.map(sanitize);
}

export async function getActiveProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const product = await apiFetch<Product>(`/products/${slug}`, {
      cache: "no-store",
    });
    return sanitize(product);
  } catch (error) {
    // A 404 is an answer, not a failure: the catalog is reachable and says this
    // slug does not exist, so `null` is real data and the page can render its
    // own not-found. Every other error propagates and fails the render.
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
 * surface you are looking at. That guarantee now rests on freshness rather than
 * on a shared cache entry: both callers read through this function, and this
 * function always goes to the catalog.
 */
export async function getActiveProductsByIds(
  ids: string[],
): Promise<Product[]> {
  if (ids.length === 0) {
    return [];
  }

  const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join("&");

  const products = await apiFetch<Product[]>(`/products/by-ids?${query}`, {
    cache: "no-store",
  });
  return products.map(sanitize);
}
