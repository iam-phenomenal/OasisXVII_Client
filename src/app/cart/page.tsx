import { CartClient } from "./CartClient";
import { getActiveProducts } from "@/lib/getProducts";

export default async function CartPage() {
  const products = await getActiveProducts();

  return <CartClient products={products} />;
}
