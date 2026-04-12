"use client";

import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";

export function CartClient({ products }: { products: Product[] }) {
  const { cartItems, removeItem, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const currency =
    cartItems.length > 0
      ? (products.find((entry) => entry.id === cartItems[0].productId)
          ?.currency ?? "NGN")
      : "NGN";

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-8">
          <h1 className="editorial-text font-black mb-12 text-4xl md:text-5xl">
            YOUR BAG OF SWAG
          </h1>

          <div className="flex flex-col gap-px bg-outline-variant/20 border border-outline-variant/20">
            {cartItems.length === 0 ? (
              <div className="p-16 text-center bg-surface-container-low">
                <p className="text-on-surface-variant font-headline uppercase tracking-widest mb-8">
                  Your bag is empty
                </p>
                <Link href="/shop">
                  <Button variant="primary">SHOP NOW</Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const product = products.find(
                  (entry) => entry.id === item.productId,
                );
                if (!product) return null;

                return (
                  <article
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="group flex flex-col md:flex-row gap-6 p-6 bg-surface-container-low hover:bg-surface-container transition-colors"
                  >
                    <div className="w-full md:w-40 aspect-[4/5] bg-surface-container-highest flex-shrink-0 overflow-hidden relative">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 768px) 10rem, 100vw"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-grow py-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-black tracking-tighter text-3xl">
                              {product.name}
                            </span>
                            {product.badge === "Limited" ? (
                              <span className="bg-primary-container text-primary text-[10px] font-black px-2 py-0.5 editorial-text border border-primary/20 ml-2">
                                LIMITED
                              </span>
                            ) : null}
                          </div>
                          <p className="text-on-surface-variant text-sm font-body uppercase">
                            {item.color} /{" "}
                            {product.specs.Material ?? product.tagline}
                          </p>
                        </div>

                        <span className="editorial-text text-xl font-bold">
                          {formatPrice(
                            product.price * item.quantity,
                            product.currency,
                          )}
                        </span>
                      </div>

                      <div className="mt-8 md:mt-0 flex justify-between items-end gap-4">
                        <div className="flex gap-8 items-center">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-on-surface-variant font-bold mb-1">
                              Size
                            </span>
                            <span className="editorial-text text-lg font-bold">
                              {item.size}
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-on-surface-variant font-bold mb-1">
                              Quantity
                            </span>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.size,
                                    item.color,
                                    item.quantity - 1,
                                  )
                                }
                                className="hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  remove
                                </span>
                              </button>
                              <span className="editorial-text text-lg font-bold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.size,
                                    item.color,
                                    item.quantity + 1,
                                  )
                                }
                                className="hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  add
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.productId, item.size, item.color)
                          }
                          className="text-on-surface-variant hover:text-error transition-colors"
                          aria-label={`Remove ${product.name}`}
                        >
                          <span className="material-symbols-outlined text-xl">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <div className="bg-surface-container p-8 border border-outline-variant/30 shadow-2xl">
            <h2 className="editorial-text text-3xl font-black mb-8 border-b border-outline-variant/30 pb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Taxes</span>
                <span>{formatPrice(0, currency)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-outline-variant/30 pt-4">
                <span className="text-on-surface-variant uppercase text-xs tracking-widest">
                  Total
                </span>
                <span className="editorial-text text-2xl font-black text-primary">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/checkout">
                <Button variant="primary" fullWidth className="py-4 text-base">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex justify-between opacity-30 grayscale contrast-150">
              <span className="material-symbols-outlined">credit_card</span>
              <span className="material-symbols-outlined">payments</span>
              <span className="material-symbols-outlined">wallet</span>
              <span className="material-symbols-outlined">shield</span>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </>
  );
}
