import { getSettings } from "@/lib/api/settings";
import { CheckoutClient } from "./CheckoutClient";

// Render per request, never at build time. Prerendering called the settings API
// from the build machine, so an unreachable or slow backend stalled the build
// past Next's 60s page-generation limit. Settings caching is unchanged:
// `getSettings` sets its own 300s window and `settings` tag.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <CheckoutClient
      logisticsFeeNgn={settings.logisticsFeeNgn}
      dutyTaxNgn={settings.dutyTaxNgn}
    />
  );
}
