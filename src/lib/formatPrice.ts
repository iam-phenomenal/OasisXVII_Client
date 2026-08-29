// Hoisted: constructing an Intl.NumberFormat is the expensive part, and cart
// and checkout call formatPrice several times per render.
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function formatPrice(price: number, currency: "NGN" | "USD"): string {
  if (currency === "NGN") {
    return `₦${price.toLocaleString("en-NG")}`
  }
  return `${usdFormatter.format(price)} USD`
}
