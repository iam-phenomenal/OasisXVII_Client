import { ApiError } from "./client";

export interface CreateOrderPayload {
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  items: Array<{
    productId: string;
    size: string;
    color: string;
    quantity: number;
  }>;
}

export interface OrderConfirmation {
  id: string;
  status: string;
  totalDue: number;
  currency: string;
  createdAt: string;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<OrderConfirmation> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : response.statusText;

    throw new ApiError(response.status, message);
  }

  return body as OrderConfirmation;
}