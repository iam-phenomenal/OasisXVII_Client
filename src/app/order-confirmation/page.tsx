import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/formatPrice";
import { apiFetch, ApiError } from "@/lib/api/client";
import type { OrderStatus } from "@/lib/api/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Status | OasisXVII",
  robots: { index: false },
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string;
    total?: string;
    currency?: string;
  }>;
}) {
  const params = await searchParams;
  const orderId = params.id;

  if (!orderId) {
    redirect("/shop");
  }

  const urlTotal = params.total ? Number(params.total) : null;
  const urlCurrency = params.currency === "USD" ? "USD" : "NGN";

  let orderStatus: OrderStatus | null = null;
  let fetchError = false;

  try {
    orderStatus = await apiFetch<OrderStatus>(`/orders/${orderId}/status`, {
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      fetchError = true;
    } else {
      fetchError = true;
    }
  }

  const status = fetchError ? "error" : orderStatus?.status;
  const totalDue = orderStatus?.totalDue ?? urlTotal;
  const currency =
    orderStatus?.currency === "USD" || orderStatus?.currency === "NGN"
      ? orderStatus.currency
      : urlCurrency;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-32 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          {status === "success" && (
            <>
              <span className="material-symbols-outlined text-primary block mb-6 text-7xl">
                check_circle
              </span>
              <h1 className="font-serif font-black text-5xl uppercase tracking-tighter mb-4">
                Payment Successful
              </h1>
              <p className="text-on-surface-variant font-body mb-12">
                Thank you for choosing us.
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

                {totalDue !== null && (
                  <div className="flex justify-between items-center border-t border-outline pt-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Total Paid
                    </span>
                    <span className="font-headline font-black text-2xl text-primary">
                      {formatPrice(totalDue, currency)}
                    </span>
                  </div>
                )}
              </div>

              <Link href="/shop">
                <Button variant="primary" className="px-10 py-4 text-base">
                  Continue Shopping
                </Button>
              </Link>
            </>
          )}

          {status === "failed" && (
            <>
              <span className="material-symbols-outlined text-error block mb-6 text-7xl">
                cancel
              </span>
              <h1 className="font-serif font-black text-5xl uppercase tracking-tighter mb-4">
                Payment Failed
              </h1>
              <p className="text-on-surface-variant font-body mb-12">
                Your payment could not be processed. Please try again or contact
                support.
              </p>

              <Link href="/shop">
                <Button variant="ghost" className="px-10 py-4 text-base">
                  Return to Shop
                </Button>
              </Link>
            </>
          )}

          {status === "pending" && (
            <>
              <span className="material-symbols-outlined text-on-surface-variant block mb-6 text-7xl">
                schedule
              </span>
              <h1 className="font-serif font-black text-5xl uppercase tracking-tighter mb-4">
                Transaction Processing
              </h1>
              <p className="text-on-surface-variant font-body mb-12">
                Your transaction is still being processed. You will receive a
                notification once it&apos;s complete.
              </p>

              <Link href="/shop">
                <Button variant="ghost" className="px-10 py-4 text-base">
                  Return to Shop
                </Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <span className="material-symbols-outlined text-error block mb-6 text-7xl">
                error_outline
              </span>
              <h1 className="font-serif font-black text-5xl uppercase tracking-tighter mb-4">
                Something Went Wrong
              </h1>
              <p className="text-on-surface-variant font-body mb-4">
                We couldn&apos;t retrieve your payment status. Please contact
                support with your order ID.
              </p>
              <p className="font-headline font-bold text-sm text-on-surface mb-12">
                {orderId}
              </p>

              <Link href="/shop">
                <Button variant="ghost" className="px-10 py-4 text-base">
                  Return to Shop
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
