import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { jsonNoStore } from "@/lib/jsonNoStore";

/**
 * `settings` is the only tag that purges anything today. The catalog reads in
 * `src/lib/api/products.ts` are `no-store`, so `products` — and the
 * `product-<slug>` tags below — have no cache entries to invalidate and are
 * accepted as no-ops.
 *
 * They stay accepted on purpose. The backend fires this endpoint on every
 * product mutation; rejecting those calls would turn a harmless no-op into a
 * stream of failed webhook deliveries on its side. Keeping them also means this
 * endpoint works unchanged if the catalog ever returns to ISR.
 */
const VALID_TAGS = ["products", "settings"] as const;
type ValidTag = (typeof VALID_TAGS)[number];

/**
 * Per-product tags are unbounded, so they are validated by shape instead of
 * enumeration: `product-<slug>`, where the slug is the lowercase hyphenated
 * form the catalog emits.
 */
const PRODUCT_TAG_PATTERN = /^product-[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidTag(tag: unknown): tag is string {
  return (
    typeof tag === "string" &&
    (VALID_TAGS.includes(tag as ValidTag) || PRODUCT_TAG_PATTERN.test(tag))
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).secret !== "string" ||
    (body as Record<string, unknown>).secret !== process.env.REVALIDATE_SECRET
  ) {
    return jsonNoStore({ error: "Unauthorized." }, { status: 401 });
  }

  const tag = (body as Record<string, unknown>).tag;

  if (!isValidTag(tag)) {
    return jsonNoStore(
      {
        error: `"tag" must be one of: ${VALID_TAGS.join(", ")}, or a per-product tag of the form "product-<slug>"`,
      },
      { status: 400 },
    );
  }

  revalidateTag(tag, "max");

  return jsonNoStore({ revalidated: true, tag });
}
