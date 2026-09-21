import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ShopCatalog } from "@/components/ui/ShopCatalog";
import { ShopResults } from "@/components/ui/ShopResults";
import { SortDropdown, SortDropdownFallback } from "@/components/ui/SortDropdown";
import { getActiveProducts } from "@/lib/api/products";

// The product fetch is `no-store` (see `src/lib/api/products.ts`), so this page
// already rendered per request by way of Next's dynamic bailout. Declaring it
// keeps that visible rather than implied.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
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

        {/* The fallback renders the default view — featured sort, first page —
            from products already fetched on the server, so the first paint
            carries a real grid. `ShopCatalog` reads the search params and takes
            over only when they ask for something other than the default. */}
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
