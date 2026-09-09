import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ShopCatalog } from "@/components/ui/ShopCatalog";
import { ShopResults } from "@/components/ui/ShopResults";
import { SortDropdown, SortDropdownFallback } from "@/components/ui/SortDropdown";
import { getActiveProducts } from "@/lib/api/products";

// This route's revalidate window is derived from the product fetch it reads
// (`CATALOG_REVALIDATE_SECONDS` in `src/lib/api/products.ts`). Do not add
// `export const revalidate` here — a segment window stacks on top of the fetch
// window instead of capping it.

export const metadata: Metadata = {
  title: "Shop | OasisXVII",
};

export default async function ShopPage() {
  const products = await getActiveProducts();

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-32">
        <header className="px-6 mb-12">
          <h1 className="text-[clamp(4rem,12vw,10rem)] leading-[0.85] font-black font-serif uppercase tracking-tighter mb-8 italic">
            SHOP
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-primary/30 pb-8">
            <p className="text-on-surface-variant text-lg font-body leading-relaxed border-l-4 border-primary pl-6 max-w-md">
              Every piece is created with quiet intention. Curated silhouettes,
              limited quantities, and a palette built for the after-hours.
            </p>
            <Suspense fallback={<SortDropdownFallback />}>
              <SortDropdown />
            </Suspense>
          </div>
        </header>

        {/* The fallbacks are what gets prerendered, so they render the default
            view: the static HTML carries a real first page of products, and the
            client only takes over when the search params say otherwise. */}
        <Suspense
          fallback={<ShopResults products={products} sort="featured" page={1} />}
        >
          <ShopCatalog products={products} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
