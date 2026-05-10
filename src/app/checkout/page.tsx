import {
  DEFAULT_DUTY_TAX,
  DEFAULT_LOGISTICS_FEE,
  getSettings,
} from "@/lib/api/settings";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  const settings = await getSettings();

  const logisticsFeeNgn = settings?.logisticsFeeNgn ?? DEFAULT_LOGISTICS_FEE;
  const dutyTaxNgn = settings?.dutyTaxNgn ?? DEFAULT_DUTY_TAX;

  return (
    <CheckoutClient
      logisticsFeeNgn={logisticsFeeNgn}
      dutyTaxNgn={dutyTaxNgn}
    />
  );
}
