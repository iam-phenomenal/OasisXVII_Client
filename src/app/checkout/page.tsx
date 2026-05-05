import {
  DEFAULT_DUTY_TAX,
  DEFAULT_LOGISTICS_FEE,
  DEFAULT_PAYMENT_METHODS,
  getSettings,
} from "@/lib/api/settings";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  const settings = await getSettings();

  const paymentMethods = settings?.paymentMethods ?? DEFAULT_PAYMENT_METHODS;
  const logisticsFeeNgn = settings?.logisticsFeeNgn ?? DEFAULT_LOGISTICS_FEE;
  const dutyTaxNgn = settings?.dutyTaxNgn ?? DEFAULT_DUTY_TAX;

  return (
    <CheckoutClient
      paymentMethods={paymentMethods.map((method) => ({ ...method }))}
      logisticsFeeNgn={logisticsFeeNgn}
      dutyTaxNgn={dutyTaxNgn}
    />
  );
}
