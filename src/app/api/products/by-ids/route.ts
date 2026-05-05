import { NextRequest, NextResponse } from "next/server";
import { products as staticProducts } from "@/data/products";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.getAll("ids");

  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  try {
    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join("&");
    const products = await apiFetch<Product[]>(`/products/by-ids?${query}`, {
      cache: "no-store",
    });
    return NextResponse.json(products);
  } catch (error) {
    if (error instanceof ApiError && error.status !== 404) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(staticProducts.filter((p) => ids.includes(p.id)));
  }
}
