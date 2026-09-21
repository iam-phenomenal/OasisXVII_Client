import { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getActiveProductsByIds } from "@/lib/api/products";
import { jsonNoStore } from "@/lib/jsonNoStore";

export const dynamic = "force-dynamic";

/**
 * Cart product lookup, backing `useCartProducts`.
 *
 * Two layers, for two different reasons:
 *
 * - **Upstream read** — delegated to `getActiveProductsByIds` so the cart and
 *   the PDP's related-products grid go through one function. They render the
 *   same catalog; showing two different prices for one product was the accident.
 *   That read is uncached, so the two surfaces agree because both are current,
 *   not because they share a cache entry.
 * - **Response to the browser** — `private, no-store` via `jsonNoStore`. The
 *   query string is the shopper's bag, so this must never land in a shared or
 *   heuristic cache, however fresh the catalog data behind it is.
 *
 * Prices here are display values. `POST /orders` receives ids and quantities
 * only and the backend computes `totalDue`, so a price rendered here cannot
 * become the amount a customer is charged.
 */
export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.getAll("ids");

  try {
    const products = await getActiveProductsByIds(ids);
    return jsonNoStore(products);
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonNoStore({ error: error.message }, { status: error.status });
    }

    return jsonNoStore({ error: "Catalog unavailable" }, { status: 502 });
  }
}
