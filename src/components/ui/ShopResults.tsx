import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { RevealSection } from "@/components/ui/RevealSection";
import { sortProducts, type SortKey } from "@/lib/sortProducts";
import type { Product } from "@/types/product";

const PAGE_SIZE = 6;

interface ShopResultsProps {
  products: Product[];
  sort: SortKey;
  page: number;
}

// Rendered twice: once on the server as the static fallback for the default
// view, and once on the client with the real search params. Keep it free of
// hooks so both trees can use it.
export function ShopResults({
  products,
  sort,
  page: requestedPage,
}: ShopResultsProps) {
  const sortedProducts = sortProducts(products, sort);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const pageProducts = sortedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function pageUrl(p: number) {
    const q = new URLSearchParams();
    if (sort !== "featured") q.set("sort", sort);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <section className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {pageProducts.map((product, index) => (
            <RevealSection
              key={product.id}
              stagger={((index % 9) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
            >
              <ProductCard product={product} priority={index < 3} />
            </RevealSection>
          ))}
        </div>
      </section>

      <div className="mt-24 px-6 flex justify-center items-center gap-12">
        {page > 1 ? (
          <Link
            href={pageUrl(page - 1)}
            className="font-headline font-bold uppercase tracking-widest hover:text-on-surface-primary transition-colors"
          >
            Prev
          </Link>
        ) : (
          <span className="font-headline font-bold uppercase tracking-widest text-on-surface-variant/40 pointer-events-none">
            Prev
          </span>
        )}
        <span className="font-headline font-black text-2xl text-on-surface-primary italic">
          {pad(page)}
        </span>
        <div className="w-8 h-[2px] bg-primary/30" />
        <span className="font-headline font-black text-2xl text-on-surface-variant italic">
          {pad(totalPages)}
        </span>
        {page < totalPages ? (
          <Link
            href={pageUrl(page + 1)}
            className="font-headline font-bold uppercase tracking-widest hover:text-on-surface-primary transition-colors"
          >
            Next
          </Link>
        ) : (
          <span className="font-headline font-bold uppercase tracking-widest text-on-surface-variant/40 pointer-events-none">
            Next
          </span>
        )}
      </div>
    </>
  );
}
