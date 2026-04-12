import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { RevealSection } from "@/components/ui/RevealSection";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getActiveProducts } from "@/lib/getProducts";
import {
  DEFAULT_HERO_HEADLINE,
  DEFAULT_HERO_IMAGES,
  DEFAULT_HERO_SUBHEADING,
  getSettings,
} from "@/lib/getSettings";

export const metadata: Metadata = {
  title: "Home | OasisXVII",
};

export default async function Home() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getSettings(),
  ]);

  const heroImages =
    (settings?.heroImages as string[] | null) ?? DEFAULT_HERO_IMAGES;
  const heroHeadline = settings?.heroHeadline ?? DEFAULT_HERO_HEADLINE;
  const heroSubheading = settings?.heroSubheading ?? DEFAULT_HERO_SUBHEADING;

  return (
    <>
      <Navbar />
      <main>
        <section className="relative min-h-screen flex items-end px-6 pb-24 md:pb-32 pt-24 overflow-hidden">
          <HeroSlideshow images={heroImages.slice(0, 5)} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <div className="relative z-10 w-full">
            <h1 className="font-display text-on-surface text-[10vw] md:text-[9vw] lg:text-[7.5rem] leading-none font-black uppercase tracking-tighter mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] md:whitespace-nowrap">
              {heroHeadline}
            </h1>
            <h2 className="font-display text-lg md:text-4xl font-bold uppercase tracking-[0.2em] text-accent mb-10">
              {heroSubheading}
            </h2>

            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <Link href="/shop">
                <Button
                  variant="primary"
                  className="px-9 py-4 text-lg md:px-12 md:py-5 md:text-2xl"
                >
                  Shop Now
                </Button>
              </Link>

              <p className="max-w-md text-on-surface-variant uppercase tracking-widest text-sm leading-relaxed border-l-2 border-accent/40 pl-6">
                This is built for the ones who move with intent. Every drop is
                limited, every piece tells a story.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-background py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <RevealSection className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-4">
              <h2 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter">
                NEW DROPS
              </h2>
              <Link
                href="/shop"
                className="font-display text-accent uppercase tracking-[0.2em] text-lg hover:underline underline-offset-8 transition-all"
              >
                View Archive →
              </Link>
            </RevealSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {products.slice(0, 6).map((product, index) => (
                <RevealSection
                  key={product.id}
                  stagger={
                    ((index % 9) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
                  }
                >
                  <ProductCard product={product} priority={index < 3} />
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
