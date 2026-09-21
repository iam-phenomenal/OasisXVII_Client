import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { ProductInfoPanel } from "./ProductInfoPanel";
import {
  getActiveProductBySlug,
  getActiveProductsByIds,
} from "@/lib/api/products";

// The catalog is read per request — every product fetch this page makes is
// `no-store` (see `src/lib/api/products.ts`), so there is no cached data to
// prerender from. Do not add `export const revalidate` or `generateStaticParams`
// here: either one promises build-time output that the `no-store` reads cannot
// satisfy, and `next build` fails with DYNAMIC_SERVER_USAGE on this route.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (
    await getActiveProductsByIds(product.relatedProductIds)
  ).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-32 px-6 md:px-12">
        <div className="grid grid-cols-12 gap-y-16 lg:gap-16">
          <section className="col-span-12 lg:col-span-7">
            <ImageGallery images={product.images} productName={product.name} />
          </section>

          <ProductInfoPanel product={product} />
        </div>

        <section className="mt-72">
          <div className="flex items-baseline justify-between mb-20 border-b border-outline-variant/10 pb-8 gap-6">
            <h2 className="font-headline font-black text-5xl md:text-7xl uppercase tracking-tighter">
              SUGGESTED DROPS
            </h2>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-label-lg hover:text-on-surface-primary transition-colors"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
