import { NextResponse } from "next/server";

/**
 * JSON response carrying an explicit `private, no-store` freshness directive.
 *
 * `export const dynamic` governs Next's render mode and `cache: "no-store"`
 * governs its fetch cache; neither writes a response header. Without one, a 200
 * GET is eligible for heuristic caching by browsers and proxies (RFC 9111
 * section 4.2.2) — for the cart lookup that means one shopper's bag, or a stale
 * price, held in a shared cache.
 *
 * `init` is narrowed to `status` on purpose: every caller passes only that, and
 * accepting a full `ResponseInit` invites a `headers` value that would quietly
 * replace the directive.
 */
export function jsonNoStore<T>(data: T, init?: { status?: number }) {
  return NextResponse.json(data, {
    status: init?.status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
