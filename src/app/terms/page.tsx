import type { Metadata } from "next";
import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { terms } from "@/data/policies";

export const metadata: Metadata = {
  title: `${terms.title} | OasisXVII`,
  description: terms.description,
};

export default function TermsPage() {
  return <PolicyLayout policy={terms} />;
}
