import { getSettings } from "@/lib/api/settings";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <CheckoutClient
      logisticsFeeNgn={settings.logisticsFeeNgn}
      dutyTaxNgn={settings.dutyTaxNgn}
    />
  );
}
