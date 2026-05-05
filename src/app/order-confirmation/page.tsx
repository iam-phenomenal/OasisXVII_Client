import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/formatPrice";

export const metadata: Metadata = {
  title: "Order Confirmed | OasisXVII",
  robots: { index: false },
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; total?: string; currency?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.id;

  if (!orderId) {
    redirect("/shop");
  }

  const total = params.total ? Number(params.total) : null;
  const currency = params.currency === "USD" ? "USD" : "NGN";

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-32 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <span className="material-symbols-outlined text-primary block mb-6 text-7xl">
            check_circle
          </span>

          <h1 className="font-serif font-black text-5xl uppercase tracking-tighter mb-4">
            Order Confirmed
          </h1>
          <p className="text-on-surface-variant font-body mb-12">
            Your order has been placed. We&apos;ll be in touch soon.
          </p>

          <div className="bg-surface-container border border-outline p-8 text-left mb-10 shadow-wine-glow space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Order ID
              </span>
              <span className="font-headline font-bold text-sm text-on-surface">
                {orderId}
              </span>
            </div>

            {total !== null && (
              <div className="flex justify-between items-center border-t border-outline pt-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Total Paid
                </span>
                <span className="font-headline font-black text-2xl text-primary">
                  {formatPrice(total, currency)}
                </span>
              </div>
            )}
          </div>

          <Link href="/shop">
            <Button variant="primary" className="px-10 py-4 text-base">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
