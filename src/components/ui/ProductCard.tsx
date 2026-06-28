import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { getSafeImageUrl } from "@/lib/getSafeImageUrl";
import type { Product } from "@/types/product";
import { VintageTag } from "@/components/ui/VintageTag";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isSoldOut = product.badge === "Sold Out";

  const articleClasses = [
    "group cursor-pointer",
    isSoldOut ? "" : "product-card-hover",
  ]
    .filter(Boolean)
    .join(" ");

  const imageClasses = [
    "object-cover grayscale transition-all duration-700",
    isSoldOut ? "opacity-40" : "group-hover:grayscale-0 group-hover:scale-105",
  ]
    .filter(Boolean)
    .join(" ");

  const infoClasses = ["flex flex-col gap-1", isSoldOut ? "opacity-40" : ""]
    .filter(Boolean)
    .join(" ");

  const titleClasses = [
    "font-headline font-black uppercase tracking-tight text-xl transition-colors",
    isSoldOut ? "" : "group-hover:text-primary",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={articleClasses}>
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        <div className="aspect-[4/5] overflow-hidden bg-surface-container mb-6 relative">
          {getSafeImageUrl(product.images) ? (
            <Image
              src={getSafeImageUrl(product.images)!}
              alt={product.name}
              fill
              className={imageClasses}
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : null}

          {product.badge ? (
            <div className="absolute top-0 right-0">
              <VintageTag
                label={product.badge}
                size="md"
                variant={product.badge === "Limited" ? "vintage" : "wine"}
                className="bg-primary text-white border-transparent"
              />
            </div>
          ) : null}

          {isSoldOut ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
              <span className="bg-on-surface/10 backdrop-blur-md text-on-surface text-[12px] font-headline font-black px-6 py-2 uppercase tracking-[0.3em] border border-on-surface/20">
                Sold Out
              </span>
            </div>
          ) : null}
        </div>

        <div className={infoClasses}>
          <div className="flex justify-between items-baseline gap-2">
            <h3 className={titleClasses}>{product.name}</h3>
            <span className="font-headline font-black text-xl">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>
          <p className="text-on-surface-variant text-xs font-headline font-medium uppercase tracking-[0.2em]">
            {product.tagline}
          </p>
        </div>
      </Link>
    </article>
  );
}
