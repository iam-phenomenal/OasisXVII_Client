import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { OrderConfirmation } from "@/lib/api/orders";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  try {
    const order = await apiFetch<OrderConfirmation>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    throw error;
  }
}
