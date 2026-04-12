"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";

interface PaymentMethod {
  id: string;
  enabled: boolean;
  label: string;
  description: string;
}

interface CheckoutClientProps {
  products: Product[];
  paymentMethods: PaymentMethod[];
  logisticsFeeNgn: number;
  dutyTaxNgn: number;
}

export function CheckoutClient({
  products,
  paymentMethods,
  logisticsFeeNgn,
  dutyTaxNgn,
}: CheckoutClientProps) {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>(
    paymentMethods.find((method) => method.enabled)?.id ?? "",
  );
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const enabledPaymentMethods = paymentMethods.filter(
    (method) => method.enabled,
  );
  const paystackDescription = paymentMethods.find(
    (method) => method.id === "paystack",
  )?.description;

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [cartItems, router]);

  useEffect(() => {
    if (!enabledPaymentMethods.some((method) => method.id === paymentMethod)) {
      setPaymentMethod(enabledPaymentMethods[0]?.id ?? "");
    }
  }, [enabledPaymentMethods, paymentMethod]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);
  }, [cartItems, products]);

  const currency =
    cartItems.length > 0
      ? (products.find((entry) => entry.id === cartItems[0].productId)
          ?.currency ?? "NGN")
      : "NGN";

  const logisticsFee = currency === "NGN" ? logisticsFeeNgn : 0;
  const dutyTax = currency === "NGN" ? dutyTaxNgn : 0;
  const totalDue = subtotal + logisticsFee + dutyTax;

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function getFieldError<K extends keyof typeof form>(
    key: K,
    value: string,
  ): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+\d][\d\s\-()+]{6,}$/;

    switch (key) {
      case "email":
        if (value.trim() === "") return "Email or mobile number is required";
        if (!emailRegex.test(value) && !phoneRegex.test(value.trim()))
          return "Enter a valid email address or phone number";
        return "";
      case "fullName":
        return value.trim().length < 2 ? "Full name is required" : "";
      case "address":
        return value.trim().length < 5 ? "Enter a valid street address" : "";
      case "city":
        return value.trim().length < 2 ? "City is required" : "";
      case "postalCode":
        return value.trim() === "" ? "Postal code is required" : "";
      default:
        return "";
    }
  }

  function validateField<K extends keyof typeof form>(key: K) {
    setErrors((prev) => ({ ...prev, [key]: getFieldError(key, form[key]) }));
  }

  function validate(): boolean {
    const next = (
      Object.keys(form) as (keyof typeof form)[]
    ).reduce<typeof errors>(
      (acc, key) => ({ ...acc, [key]: getFieldError(key, form[key]) }),
      { ...errors },
    );
    setErrors(next);
    return Object.values(next).every((e) => e === "");
  }

  function handleCompletePurchase() {
    if (!validate()) return;
    clearCart();
    router.push("/");
  }

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar variant="checkout" />
      <main className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          <section className="lg:col-span-7 space-y-20">
            <div>
              <h1 className="font-headline font-black text-4xl tracking-tighter uppercase mb-10 italic">
                Contact <span className="text-primary">_</span>
              </h1>
              <div className="space-y-8">
                <FloatingInput
                  label="Email / Mobile"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  onBlur={() => validateField("email")}
                  error={errors.email}
                />

                <button
                  type="button"
                  onClick={() => setEmailOptIn((value) => !value)}
                  className="inline-flex items-center gap-3"
                >
                  <span className="w-5 h-5 border border-outline flex items-center justify-center">
                    {emailOptIn ? (
                      <span className="w-2 h-2 bg-primary" />
                    ) : null}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Email me with news and exclusive drops
                  </span>
                </button>
              </div>
            </div>

            <div>
              <h2 className="font-headline font-black text-4xl tracking-tighter uppercase mb-10 italic">
                Shipping <span className="text-primary">_</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <FloatingInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(value) => updateField("fullName", value)}
                    onBlur={() => validateField("fullName")}
                    error={errors.fullName}
                  />
                </div>
                <div className="md:col-span-2">
                  <FloatingInput
                    label="Street Address"
                    placeholder="House number and street"
                    value={form.address}
                    onChange={(value) => updateField("address", value)}
                    onBlur={() => validateField("address")}
                    error={errors.address}
                  />
                </div>
                <FloatingInput
                  label="City"
                  placeholder="City"
                  value={form.city}
                  onChange={(value) => updateField("city", value)}
                  onBlur={() => validateField("city")}
                  error={errors.city}
                />
                <FloatingInput
                  label="Postal Code"
                  placeholder="Postal code"
                  value={form.postalCode}
                  onChange={(value) => updateField("postalCode", value)}
                  onBlur={() => validateField("postalCode")}
                  error={errors.postalCode}
                />
              </div>
            </div>

            <div>
              <h2 className="font-headline font-black text-4xl tracking-tighter uppercase mb-10 italic">
                Payment <span className="text-primary">_</span>
              </h2>

              <div className="space-y-4">
                {enabledPaymentMethods.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className="w-full flex items-center gap-4 border border-outline p-5 text-left hover:border-primary transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full border-2 border-outline flex items-center justify-center shrink-0">
                      {paymentMethod === id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {label}
                    </span>
                  </button>
                ))}

                {paymentMethod === "paystack" && (
                  <div className="border border-outline border-t-0 px-6 py-5 flex items-center gap-3">
                    {paystackDescription ? (
                      <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                        {paystackDescription}
                      </p>
                    ) : (
                      <>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Secured by
                        </span>
                        <span className="text-[11px] font-black uppercase tracking-wider text-on-surface">
                          Paystack
                        </span>
                        <div className="ml-2 flex items-center gap-2">
                          {["Mastercard", "Visa", "Verve"].map((card) => (
                            <span
                              key={card}
                              className="text-[9px] font-bold uppercase tracking-widest border border-outline px-2 py-1 text-on-surface-variant"
                            >
                              {card}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5 sticky top-32 h-fit">
            <div className="bg-surface-container border border-outline p-10 shadow-wine-glow">
              <h2 className="font-headline font-black text-2xl tracking-tighter uppercase mb-10 italic">
                My Cart
              </h2>

              <div className="space-y-8 mb-12">
                {cartItems.map((item) => {
                  const product = products.find(
                    (entry) => entry.id === item.productId,
                  );
                  if (!product) return null;

                  return (
                    <article
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex gap-6 items-start"
                    >
                      <div className="relative w-28 aspect-[3/4] bg-surface-container-high overflow-hidden border border-outline">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover mix-blend-luminosity hover:mix-blend-normal"
                          sizes="7rem"
                        />
                        <span className="absolute top-2 right-2 bg-primary text-on-primary font-headline font-black text-[10px] px-2 py-1">
                          {item.quantity}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-headline font-black uppercase tracking-tight text-base italic">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                          {item.color} / {item.size}
                        </p>
                        <p className="text-base font-headline font-bold mt-4">
                          {formatPrice(
                            product.price * item.quantity,
                            product.currency,
                          )}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="pt-10 border-t border-outline space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Logistics</span>
                  <span>{formatPrice(logisticsFee, currency)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Duty &amp; Tax</span>
                  <span>{formatPrice(dutyTax, currency)}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Total Due
                  </span>
                  <span className="text-2xl font-headline font-black uppercase tracking-tighter text-primary underline decoration-2 underline-offset-8">
                    {formatPrice(totalDue, currency)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompletePurchase}
                className="w-full bg-primary py-6 mt-12 text-on-primary font-headline font-black uppercase tracking-[0.3em] text-sm shadow-wine-glow hover:shadow-wine-glow-hover transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">Complete Purchase</span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

function FloatingInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div className="relative group">
      <label
        className={`absolute -top-2 left-4 bg-surface px-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
          error
            ? "text-error"
            : "text-on-surface-variant group-focus-within:text-primary"
        }`}
      >
        {label}
      </label>
      <input
        className={`w-full bg-transparent border transition-all outline-none p-5 font-body text-sm ${
          error ? "border-error" : "border-outline focus:border-primary"
        }`}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {error && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-error mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
