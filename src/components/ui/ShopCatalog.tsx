"use client";

import { useSearchParams } from "next/navigation";
import { ShopResults } from "@/components/ui/ShopResults";
import { parsePageNumber, parseSortKey } from "@/lib/sortProducts";
import type { Product } from "@/types/product";

// Sorting and pagination live here, on the client, so /shop never reads
// searchParams on the server and can stay statically rendered.
export function ShopCatalog({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();

  return (
    <ShopResults
      products={products}
      sort={parseSortKey(searchParams.get("sort"))}
      page={parsePageNumber(searchParams.get("page"))}
    />
  );
}
