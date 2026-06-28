import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/ui/ProductCard";
import { RevealSection } from "@/components/ui/RevealSection";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { getActiveProducts } from "@/lib/api/products";
import type { Product } from "@/types/product";

const PAGE_SIZE = 6;

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop | OasisXVII",
};

type SortKey =
  | "featured"
  | "best-selling"
  | "price-asc"
  | "price-desc"
  | "newest";

function sortProducts(list: Product[], sort: SortKey) {
  const cloned = [...list];

  switch (sort) {
    case "price-asc":
      return cloned.sort((a, b) => a.price - b.price);
    case "price-desc":
      return cloned.sort((a, b) => b.price - a.price);
    case "newest":
      return cloned.reverse();
    case "best-selling":
      return cloned.sort((a, b) => {
        const aScore =
          (a.badge === "New Drop" ? 2 : 0) + (a.badge === "Limited" ? 1 : 0);
        const bScore =
          (b.badge === "New Drop" ? 2 : 0) + (b.badge === "Limited" ? 1 : 0);
        return bScore - aScore;
      });
    case "featured":
    default:
      return cloned;
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ sort?: string; page?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const rawSort = params?.sort;
  const sort =
    rawSort === "best-selling" ||
    rawSort === "price-asc" ||
    rawSort === "price-desc" ||
    rawSort === "newest"
      ? rawSort
      : "featured";

  const products = await getActiveProducts();
  const sortedProducts = sortProducts(products, sort);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, parseInt(params?.page ?? "1", 10) || 1), totalPages);
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
            <SortDropdown />
          </div>
        </header>

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
              className="font-headline font-bold uppercase tracking-widest hover:text-primary transition-colors"
            >
              Prev
            </Link>
          ) : (
            <span className="font-headline font-bold uppercase tracking-widest text-on-surface-variant/40 pointer-events-none">
              Prev
            </span>
          )}
          <span className="font-headline font-black text-2xl text-primary italic">
            {pad(page)}
          </span>
          <div className="w-8 h-[2px] bg-primary/30" />
          <span className="font-headline font-black text-2xl text-on-surface-variant italic">
            {pad(totalPages)}
          </span>
          {page < totalPages ? (
            <Link
              href={pageUrl(page + 1)}
              className="font-headline font-bold uppercase tracking-widest hover:text-primary transition-colors"
            >
              Next
            </Link>
          ) : (
            <span className="font-headline font-bold uppercase tracking-widest text-on-surface-variant/40 pointer-events-none">
              Next
            </span>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
