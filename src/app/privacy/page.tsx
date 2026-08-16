import type { Metadata } from "next";
import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { privacy } from "@/data/policies";

export const metadata: Metadata = {
  title: `${privacy.title} | OasisXVII`,
  description: privacy.description,
};

export default function PrivacyPage() {
  return <PolicyLayout policy={privacy} />;
}
