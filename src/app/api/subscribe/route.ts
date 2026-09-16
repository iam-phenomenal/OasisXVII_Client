import { NextRequest } from "next/server";
import { ApiError, apiFetch } from "@/lib/api/client";
import { isValidEmail } from "@/lib/email";
import { jsonNoStore } from "@/lib/jsonNoStore";

export const dynamic = "force-dynamic";

/**
 * The backend has no /subscribers endpoint yet. Rather than let the footer
 * form report a success it cannot deliver, this route stays off until
 * NEWSLETTER_ENABLED is set — an unconfigured deploy returns a visible 503 and
 * the shopper knows their address was not taken.
 *
 * TODO: build /subscribers on the API service, then set NEWSLETTER_ENABLED=true
 * and confirm the forwarded payload shape below matches what it expects.
 */
const IS_ENABLED = process.env.NEWSLETTER_ENABLED === "true";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonNoStore({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof payload === "object" &&
    payload !== null &&
    "email" in payload &&
    typeof payload.email === "string"
      ? payload.email.trim()
      : "";

  // Re-validated here because the client check is a convenience, not a gate —
  // this route is reachable without it.
  if (!isValidEmail(email)) {
    return jsonNoStore(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (!IS_ENABLED) {
    return jsonNoStore(
      { error: "Signups aren't open yet. Check back shortly." },
      { status: 503 },
    );
  }

  try {
    await apiFetch("/subscribers", {
      method: "POST",
      body: JSON.stringify({ email, source: "footer" }),
      cache: "no-store",
    });

    return jsonNoStore({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonNoStore({ error: error.message }, { status: error.status });
    }

    throw error;
  }
}
