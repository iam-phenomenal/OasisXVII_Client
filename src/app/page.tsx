import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { RevealSection } from "@/components/ui/RevealSection";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getActiveProducts } from "@/lib/api/products";
import {
  DEFAULT_HERO_HEADLINE,
  DEFAULT_HERO_IMAGES,
  DEFAULT_HERO_SUBHEADING,
  getSettings,
} from "@/lib/api/settings";

// The product fetch is `no-store` (see `src/lib/api/products.ts`), so this page
// already rendered per request by way of Next's dynamic bailout. Declaring it
// keeps that visible rather than implied.
//
// This does not change how settings are read: `force-dynamic` only forces
// `no-store` onto fetches that set no cache policy of their own, and
// `getSettings` sets its own. Hero content still comes from its 300s window and
// is still purged by the `settings` tag.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getSettings(),
  ]);

  const rawHeroImages = settings.heroImages ?? DEFAULT_HERO_IMAGES;
  const validHeroImages = rawHeroImages.filter(
    (src): src is string => typeof src === "string" && src.length > 0,
  );
  const heroImages = validHeroImages.length > 0 ? validHeroImages : DEFAULT_HERO_IMAGES;
  const heroHeadline = settings.heroHeadline ?? DEFAULT_HERO_HEADLINE;
  const heroSubheading = settings.heroSubheading ?? DEFAULT_HERO_SUBHEADING;

  return (
    <>
      <Navbar />
      <main>
        <section className="relative min-h-screen flex items-end px-6 pb-24 md:pb-32 pt-24 overflow-hidden">
          <HeroSlideshow images={heroImages.slice(0, 5)} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <div className="relative z-10 w-full">
            <h1 className="font-serif text-on-surface text-[10vw] md:text-[9vw] lg:text-[7.5rem] leading-none font-black uppercase tracking-tighter mb-4 drop-shadow-hero">
              {heroHeadline}
            </h1>
            <h2 className="font-display text-lg md:text-4xl font-bold uppercase tracking-label text-accent mb-10">
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
                className="font-display text-accent uppercase tracking-label text-lg hover:underline underline-offset-8 transition-colors"
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
