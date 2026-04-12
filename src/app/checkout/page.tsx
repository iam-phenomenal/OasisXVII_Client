import { getActiveProducts } from "@/lib/getProducts";
import {
  DEFAULT_DUTY_TAX,
  DEFAULT_LOGISTICS_FEE,
  DEFAULT_PAYMENT_METHODS,
  getSettings,
} from "@/lib/getSettings";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getSettings(),
  ]);

  const paymentMethods =
    (settings?.paymentMethods as
      | (typeof DEFAULT_PAYMENT_METHODS)[number][]
      | null) ?? DEFAULT_PAYMENT_METHODS;
  const logisticsFeeNgn = settings?.logisticsFeeNgn
    ? Number(settings.logisticsFeeNgn)
    : DEFAULT_LOGISTICS_FEE;
  const dutyTaxNgn = settings?.dutyTaxNgn
    ? Number(settings.dutyTaxNgn)
    : DEFAULT_DUTY_TAX;

  return (
    <CheckoutClient
      products={products}
      paymentMethods={paymentMethods.map((method) => ({ ...method }))}
      logisticsFeeNgn={logisticsFeeNgn}
      dutyTaxNgn={dutyTaxNgn}
    />
  );
}
