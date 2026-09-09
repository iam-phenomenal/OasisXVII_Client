import { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getActiveProductsByIds } from "@/lib/api/products";
import { jsonNoStore } from "@/lib/jsonNoStore";

export const dynamic = "force-dynamic";

/**
 * Cart product lookup, backing `useCartProducts`.
 *
 * Two cache layers, deliberately opposite:
 *
 * - **Upstream read** — delegated to `getActiveProductsByIds` so the cart and
 *   the PDP's related-products grid share one policy (`CATALOG_REVALIDATE_SECONDS`
 *   plus the `products` tag). They render the same catalog; showing two
 *   different prices for one product was the accident. It also means
 *   `revalidateTag("products")` now purges this lookup, which a per-request
 *   `no-store` fetch never allowed.
 * - **Response to the browser** — `private, no-store` via `jsonNoStore`. The
 *   query string is the shopper's bag, so this must never land in a shared or
 *   heuristic cache regardless of how fresh the catalog data behind it is.
 *
 * `force-dynamic` does not undo the first: it only forces `no-store` on fetches
 * that set no cache config of their own, and this one sets `revalidate`.
 *
 * Prices here are display values. `POST /orders` receives ids and quantities
 * only and the backend computes `totalDue`, so a price inside the catalog window
 * cannot become the amount a customer is charged.
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
