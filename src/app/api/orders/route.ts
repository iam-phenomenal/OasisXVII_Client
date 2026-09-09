import { NextRequest } from "next/server";
import { ApiError, apiFetch } from "@/lib/api/client";
import { jsonNoStore } from "@/lib/jsonNoStore";
import type { OrderConfirmation } from "@/lib/api/orders";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonNoStore({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const order = await apiFetch<OrderConfirmation>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    return jsonNoStore(order, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonNoStore({ error: error.message }, { status: error.status });
    }

    throw error;
  }
}
