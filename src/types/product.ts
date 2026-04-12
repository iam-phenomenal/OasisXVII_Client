export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  price: number
  currency: "NGN" | "USD"
  images: string[]
  badge?: "New Drop" | "Limited" | "Sold Out"
  sizes: string[]
  colors: string[]
  description: string
  specs: Record<string, string>
  category: string
  relatedProductIds: string[]
}

export interface CartItem {
  productId: string
  quantity: number
  size: string
  color: string
}
