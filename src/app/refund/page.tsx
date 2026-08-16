import type { Metadata } from "next";
import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { refund } from "@/data/policies";

export const metadata: Metadata = {
  title: `${refund.title} | OasisXVII`,
  description: refund.description,
};

export default function RefundPage() {
  return <PolicyLayout policy={refund} />;
}
