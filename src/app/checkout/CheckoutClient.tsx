"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useCartProducts } from "@/hooks/useCartProducts";
import { createOrder, type CreateOrderPayload } from "@/lib/api/orders";
import { formatPrice } from "@/lib/formatPrice";
import { getSafeImageUrl } from "@/lib/getSafeImageUrl";
import { isSoldOut } from "@/lib/isSoldOut";
import { Country, State } from "country-state-city";

interface CheckoutClientProps {
  logisticsFeeNgn: number;
  dutyTaxNgn: number;
}

type FieldKey =
  | "email"
  | "fullName"
  | "address"
  | "country"
  | "city"
  | "state"
  | "postalCode";

// Visual/DOM order of the form, which is what "focus the first invalid field"
// has to mean. Deliberately not derived from Object.keys(form) — that order is
// incidental and would silently drift if the state object were reordered.
const FIELD_ORDER: readonly FieldKey[] = [
  "email",
  "fullName",
  "address",
  "country",
  "city",
  "state",
  "postalCode",
];

export function CheckoutClient({
  logisticsFeeNgn,
  dutyTaxNgn,
}: CheckoutClientProps) {
  const router = useRouter();
  const { cartItems, clearCart, hydrated } = useCart();
  const { products, isLoading, hasError, retry } = useCartProducts();

  const [emailOptIn, setEmailOptIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [form, setForm] = useState<Record<FieldKey, string>>({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "NG",
    state: "",
  });
  const [errors, setErrors] = useState<Record<FieldKey, string>>({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    state: "",
  });

  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});

  // One stable callback per field, built once, so passing these as refs does
  // not detach and re-attach on every render.
  const setFieldRef = useMemo(() => {
    const map = {} as Record<FieldKey, (el: HTMLElement | null) => void>;
    for (const key of FIELD_ORDER) {
      map[key] = (el) => {
        fieldRefs.current[key] = el;
      };
    }
    return map;
  }, []);

  useEffect(() => {
    if (hydrated && cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [hydrated, cartItems, router]);

  // Checked again here rather than trusting the cart's gate: /checkout is
  // reachable directly, and a piece can sell out between the two pages.
  const soldOutIds = useMemo(
    () => new Set(products.filter(isSoldOut).map((product) => product.id)),
    [products],
  );
  const hasUnavailable = cartItems.some((item) =>
    soldOutIds.has(item.productId),
  );

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      if (soldOutIds.has(item.productId)) return sum;
      const product = products.find((entry) => entry.id === item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);
  }, [cartItems, products, soldOutIds]);

  const currency =
    cartItems.length > 0
      ? (products.find((entry) => entry.id === cartItems[0].productId)
          ?.currency ?? "NGN")
      : "NGN";

  const totalsUnavailable = isLoading || hasError;

  const logisticsFee = currency === "NGN" ? logisticsFeeNgn : 0;
  const dutyTax = currency === "NGN" ? dutyTaxNgn : 0;
  const totalDue = subtotal + logisticsFee + dutyTax;

  const countryOptions = useMemo(() => {
    const all = Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
    const nigeria = all.find((c) => c.value === "NG");
    const rest = all
      .filter((c) => c.value !== "NG")
      .sort((a, b) => a.label.localeCompare(b.label));
    return nigeria ? [nigeria, ...rest] : rest;
  }, []);

  const stateOptions = useMemo(
    () =>
      State.getStatesOfCountry(form.country).map((s) => ({
        value: s.isoCode,
        label: s.name,
      })),
    [form.country],
  );

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCountryChange(value: string) {
    setForm((prev) => ({ ...prev, country: value, state: "" }));
    setErrors((prev) => ({ ...prev, country: "", state: "" }));
  }

  function getFieldError<K extends keyof typeof form>(
    key: K,
    value: string,
  ): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (key) {
      case "email":
        if (value.trim() === "") return "Email address is required";
        if (!emailRegex.test(value.trim())) {
          return "Enter a valid email address";
        }
        return "";
      case "fullName":
        return value.trim().length < 2 ? "Full name is required" : "";
      case "address":
        return value.trim().length < 5 ? "Enter a valid street address" : "";
      case "city":
        return value.trim().length < 2 ? "City is required" : "";
      // postalCode is deliberately optional — plenty of Nigerian addresses
      // ship without one. Its label says so; it falls through to "" below.
      case "country":
        return value.trim() === "" ? "Country is required" : "";
      case "state":
        return stateOptions.length > 0 && value.trim() === ""
          ? "State is required"
          : "";
      default:
        return "";
    }
  }

  function validateField<K extends keyof typeof form>(key: K) {
    setErrors((prev) => ({ ...prev, [key]: getFieldError(key, form[key]) }));
  }

  function validate(): boolean {
    const next = FIELD_ORDER.reduce<Record<FieldKey, string>>(
      (acc, key) => ({ ...acc, [key]: getFieldError(key, form[key]) }),
      { ...errors },
    );
    setErrors(next);

    const firstInvalid = FIELD_ORDER.find((key) => next[key] !== "");
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return false;
    }
    return true;
  }

  async function handleCompletePurchase() {
    setOrderError("");

    // Guarded before validation so a sold-out bag reports the blocking problem
    // rather than sending the shopper through the form first.
    if (hasUnavailable) {
      setOrderError(
        "One or more pieces in your bag have sold out. Return to your bag to remove them.",
      );
      return;
    }

    if (!validate()) return;

    const orderPayload: CreateOrderPayload = {
      customerEmail: form.email.trim(),
      customerName: form.fullName.trim(),
      shippingAddress: {
        line1: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country,
        ...(form.state ? { state: form.state } : {}),
      },
      paymentMethod: "paystack",
      items: cartItems.map((item) => ({
        productId: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);

    try {
      const order = await createOrder(orderPayload);
      clearCart();

      if (order.paystack?.authorizationUrl) {
        window.location.href = order.paystack.authorizationUrl;
      } else {
        router.push(
          `/order-confirmation?id=${encodeURIComponent(order.id)}&total=${order.totalDue}&currency=${order.currency}`,
        );
      }
    } catch {
      setOrderError("Unable to place order. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (hydrated && cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar variant="checkout" />
      <main className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          <section className="lg:col-span-7 space-y-20">
            <div>
              <h1 className="font-serif font-black text-4xl tracking-tighter uppercase mb-10 italic">
                Contact <span className="text-on-surface-primary">_</span>
              </h1>
              <div className="space-y-8">
                <FloatingInput
                  label="Email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  inputRef={setFieldRef.email}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  onBlur={() => validateField("email")}
                  error={errors.email}
                />

                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailOptIn"
                    checked={emailOptIn}
                    onChange={(event) => setEmailOptIn(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className="w-5 h-5 border border-outline flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
                  >
                    {emailOptIn ? (
                      <span className="w-2 h-2 bg-primary" />
                    ) : null}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Email me with news and exclusive drops
                  </span>
                </label>
              </div>
            </div>

            <div>
              <h2 className="font-headline font-black text-4xl tracking-tighter uppercase mb-10 italic">
                Shipping <span className="text-on-surface-primary">_</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <FloatingInput
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    inputRef={setFieldRef.fullName}
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
                    name="address"
                    autoComplete="street-address"
                    inputRef={setFieldRef.address}
                    placeholder="House number and street"
                    value={form.address}
                    onChange={(value) => updateField("address", value)}
                    onBlur={() => validateField("address")}
                    error={errors.address}
                  />
                </div>
                <div className="md:col-span-2">
                  <FloatingSelect
                    label="Country"
                    name="country"
                    autoComplete="country"
                    selectRef={setFieldRef.country}
                    value={form.country}
                    onChange={handleCountryChange}
                    onBlur={() => validateField("country")}
                    options={countryOptions}
                    error={errors.country}
                  />
                </div>
                <div className={stateOptions.length > 0 ? "" : "md:col-span-2"}>
                  <FloatingInput
                    label="City"
                    name="city"
                    autoComplete="address-level2"
                    inputRef={setFieldRef.city}
                    placeholder="City"
                    value={form.city}
                    onChange={(value) => updateField("city", value)}
                    onBlur={() => validateField("city")}
                    error={errors.city}
                  />
                </div>
                {stateOptions.length > 0 ? (
                  <FloatingSelect
                    label="State"
                    name="state"
                    autoComplete="address-level1"
                    selectRef={setFieldRef.state}
                    value={form.state}
                    onChange={(value) => updateField("state", value)}
                    onBlur={() => validateField("state")}
                    options={stateOptions}
                    error={errors.state}
                  />
                ) : null}
                <div className="md:col-span-2">
                  <FloatingInput
                    label="Postal Code (Optional)"
                    name="postalCode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    inputRef={setFieldRef.postalCode}
                    placeholder="Postal code"
                    value={form.postalCode}
                    onChange={(value) => updateField("postalCode", value)}
                    onBlur={() => validateField("postalCode")}
                    error={errors.postalCode}
                  />
                </div>
              </div>
            </div>

          </section>

          <aside className="lg:col-span-5 sticky top-32 h-fit">
            <div className="bg-surface-container border border-outline p-10 shadow-wine-glow">
              <h2 className="font-headline font-black text-2xl tracking-tighter uppercase mb-10 italic">
                My Cart
              </h2>

              <div className="space-y-8 mb-12">
                {isLoading ? (
                  <p className="text-on-surface-variant font-headline text-[10px] uppercase tracking-widest animate-pulse">
                    Loading items...
                  </p>
                ) : hasError ? (
                  <div>
                    <p className="text-on-surface-variant font-headline text-[10px] uppercase tracking-widest mb-4">
                      Couldn&apos;t load your bag
                    </p>
                    <button
                      type="button"
                      onClick={retry}
                      className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-primary underline underline-offset-4 transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const product = products.find(
                      (entry) => entry.id === item.productId,
                    );
                    if (!product) return null;

                    const itemSoldOut = soldOutIds.has(item.productId);

                    return (
                      <article
                        key={`${item.productId}-${item.size}-${item.color}`}
                        className={[
                          "flex gap-6 items-start",
                          itemSoldOut ? "opacity-40" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div className="relative w-28 aspect-[3/4] bg-surface-container-high overflow-hidden border border-outline">
                          {getSafeImageUrl(product.images) ? (
                            <Image
                              src={getSafeImageUrl(product.images)!}
                              alt={product.name}
                              fill
                              className="object-cover mix-blend-luminosity hover:mix-blend-normal"
                              sizes="7rem"
                            />
                          ) : null}
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
                          {itemSoldOut ? (
                            <p className="text-[10px] text-error font-bold uppercase tracking-widest mt-2">
                              No longer available
                            </p>
                          ) : null}
                          <p
                            className={[
                              "text-base font-headline font-bold mt-4",
                              itemSoldOut ? "line-through" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {formatPrice(
                              product.price * item.quantity,
                              product.currency,
                            )}
                          </p>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              <div className="pt-10 border-t border-outline space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{totalsUnavailable ? "—" : formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Logistics</span>
                  <span>{totalsUnavailable ? "—" : formatPrice(logisticsFee, currency)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  <span>Duty &amp; Tax</span>
                  <span>{totalsUnavailable ? "—" : formatPrice(dutyTax, currency)}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Total Due
                  </span>
                  <span className="text-2xl font-headline font-black uppercase tracking-tighter text-on-surface-primary underline decoration-2 underline-offset-8">
                    {totalsUnavailable ? "—" : formatPrice(totalDue, currency)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompletePurchase}
                disabled={
                  isSubmitting || isLoading || hasError || hasUnavailable
                }
                className="w-full bg-primary py-6 mt-12 text-on-primary font-headline font-black uppercase tracking-[0.3em] text-sm shadow-wine-glow hover:shadow-wine-glow-hover transition-[box-shadow,opacity] duration-300 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full pointer-fine:group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">
                  {isSubmitting ? "Redirecting to Paystack..." : "Pay with Paystack"}
                </span>
              </button>
              {hasUnavailable ? (
                <p className="font-body text-xs leading-relaxed text-error mt-4">
                  One or more pieces in your bag have sold out.{" "}
                  <Link
                    href="/cart"
                    className="underline underline-offset-4 hover:text-on-surface"
                  >
                    Return to your bag
                  </Link>{" "}
                  to remove them.
                </p>
              ) : null}
              <p
                role="alert"
                aria-live="polite"
                className="text-[10px] font-bold uppercase tracking-widest text-error mt-4 empty:mt-0"
              >
                {orderError}
              </p>

              <div className="mt-6 border border-outline px-6 py-5 flex items-center gap-3">
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
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

function FloatingSelect({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  autoComplete,
  error,
  selectRef,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: { value: string; label: string }[];
  autoComplete?: string;
  error?: string;
  selectRef?: (el: HTMLSelectElement | null) => void;
}) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;

  return (
    <div className="relative group">
      <label
        htmlFor={fieldId}
        className={`absolute -top-2 left-4 bg-surface px-2 text-[10px] font-bold uppercase tracking-widest transition-colors z-10 ${
          error
            ? "text-error"
            : "text-on-surface-variant group-focus-within:text-on-surface-primary"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          ref={selectRef}
          name={name}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full bg-surface border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background p-5 font-body text-sm text-on-surface appearance-none pr-12 ${
            error ? "border-error" : "border-outline focus:border-primary"
          }`}
          style={{ backgroundColor: "#131318", color: "#E4E1E9", colorScheme: "dark" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-surface text-on-surface"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">
          expand_more
        </span>
      </div>
      {error && (
        <p
          id={errorId}
          className="text-[10px] font-bold uppercase tracking-widest text-error mt-2"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function FloatingInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  spellCheck,
  error,
  inputRef,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  type?: string;
  inputMode?: "text" | "email" | "numeric";
  autoComplete?: string;
  spellCheck?: boolean;
  error?: string;
  inputRef?: (el: HTMLInputElement | null) => void;
}) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;

  return (
    <div className="relative group">
      <label
        htmlFor={fieldId}
        className={`absolute -top-2 left-4 bg-surface px-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
          error
            ? "text-error"
            : "text-on-surface-variant group-focus-within:text-on-surface-primary"
        }`}
      >
        {label}
      </label>
      <input
        id={fieldId}
        ref={inputRef}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full bg-transparent border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background p-5 font-body text-sm ${
          error ? "border-error" : "border-outline focus:border-primary"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {error && (
        <p
          id={errorId}
          className="text-[10px] font-bold uppercase tracking-widest text-error mt-2"
        >
          {error}
        </p>
      )}
    </div>
  );
}
