import type { Metadata } from "next";
import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { shipping } from "@/data/policies";

export const metadata: Metadata = {
  title: `${shipping.title} | OasisXVII`,
  description: shipping.description,
};

export default function ShippingPage() {
  return <PolicyLayout policy={shipping} />;
}
