import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/contact";
import { POLICY_EFFECTIVE_DATE } from "./effectiveDate";
import type { Policy } from "./types";

export const refund: Policy = {
  slug: "refund",
  title: "Refund & Cancellation Policy",
  navLabel: "Refunds",
  description:
    "How OasisXVII handles order cancellations, returns, exchanges, and refunds.",
  effectiveDate: POLICY_EFFECTIVE_DATE,
  intro: [
    {
      type: "paragraph",
      content: [
        "OasisXVII wants customers to have a clear and straightforward purchasing experience. This policy explains cancellations, returns, exchanges, and refunds.",
      ],
    },
  ],
  sections: [
    {
      id: "order-cancellations",
      heading: "Order Cancellations",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Customers may request cancellation before an order has been processed for shipment. Once an order has been dispatched, cancellation may no longer be possible and the customer may need to follow the return process.",
          ],
        },
      ],
    },
    {
      id: "returns",
      heading: "Returns",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Eligible items may be returned within 7 days of confirmed delivery. Items must be unworn, unused, unwashed, undamaged, and in their original condition with tags attached where applicable.",
          ],
        },
      ],
    },
    {
      id: "non-returnable-items",
      heading: "Non-Returnable Items",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Items identified as final sale, personalized, hygiene-sensitive, or otherwise marked as non-returnable are not eligible for standard returns unless required by applicable law.",
          ],
        },
      ],
    },
    {
      id: "damaged-or-incorrect-orders",
      heading: "Damaged or Incorrect Orders",
      blocks: [
        {
          type: "paragraph",
          content: [
            "If you receive a damaged, defective, or incorrect item, contact OasisXVII promptly with your order details and clear photographs of the issue. We will review the claim and provide an appropriate resolution.",
          ],
        },
      ],
    },
    {
      id: "exchanges",
      heading: "Exchanges",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Exchanges are subject to product availability. If the requested replacement is unavailable, an alternative resolution may be offered.",
          ],
        },
      ],
    },
    {
      id: "refunds",
      heading: "Refunds",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Approved refunds are normally returned through the original payment method. Processing times may vary depending on the payment provider and your bank or financial institution.",
          ],
        },
      ],
    },
    {
      id: "return-shipping",
      heading: "Return Shipping",
      blocks: [
        {
          type: "paragraph",
          content: [
            "For standard customer-initiated returns, return shipping may be the customer’s responsibility. Where OasisXVII sends an incorrect, defective, or damaged item, appropriate return instructions will be provided. See the ",
            { text: "Shipping & Delivery Policy", href: "/shipping" },
            " for delivery details.",
          ],
        },
      ],
    },
    {
      id: "how-to-request",
      heading: "How to Request a Return or Refund",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Please contact OasisXVII at ",
            { text: CONTACT_EMAIL, href: CONTACT_HREF },
            " and include your order number, name, reason for the request, and supporting photographs where applicable.",
          ],
        },
      ],
    },
  ],
};
