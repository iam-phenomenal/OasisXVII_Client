export function formatPrice(price: number, currency: "NGN" | "USD"): string {
  if (currency === "NGN") {
    return `₦${price.toLocaleString("en-NG")}`
  }
  return `$${price.toFixed(2)}`
}
