import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/contact";
import { POLICY_EFFECTIVE_DATE } from "./effectiveDate";
import type { Policy } from "./types";

export const shipping: Policy = {
  slug: "shipping",
  title: "Shipping & Delivery Policy",
  navLabel: "Shipping",
  description:
    "How OasisXVII processes and delivers orders placed through oasisxvii.xyz.",
  effectiveDate: POLICY_EFFECTIVE_DATE,
  intro: [
    {
      type: "paragraph",
      content: [
        "This policy explains how OasisXVII processes and delivers orders placed through oasisxvii.xyz.",
      ],
    },
  ],
  sections: [
    {
      id: "order-processing",
      heading: "Order Processing",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Orders are processed after successful payment confirmation. Processing time may vary depending on product availability, order volume, weekends, public holidays, and other operational circumstances.",
          ],
        },
      ],
    },
    {
      id: "delivery",
      heading: "Delivery",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Delivery time depends on the destination and shipping method selected at checkout. Any delivery timeframe shown is an estimate and is not a guaranteed delivery date.",
          ],
        },
      ],
    },
    {
      id: "shipping-information",
      heading: "Shipping Information",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Customers must provide a complete and accurate delivery address. OasisXVII is not responsible for delivery problems caused by incorrect or incomplete information provided by the customer.",
          ],
        },
      ],
    },
    {
      id: "tracking",
      heading: "Tracking",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Where tracking is available, tracking information may be provided after an order has been dispatched. Carrier tracking updates may take time to appear.",
          ],
        },
      ],
    },
    {
      id: "delays",
      heading: "Delays",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Delivery may be delayed by carrier issues, weather, public holidays, customs procedures, incorrect addresses, or other circumstances outside our reasonable control.",
          ],
        },
      ],
    },
    {
      id: "failed-delivery",
      heading: "Failed Delivery",
      blocks: [
        {
          type: "paragraph",
          content: [
            "If delivery cannot be completed because of an incorrect address, missed delivery, refusal, or other customer-related issue, additional delivery charges or return-to-sender arrangements may apply. Returns are handled under the ",
            { text: "Refund & Cancellation Policy", href: "/refund" },
            ".",
          ],
        },
      ],
    },
    {
      id: "international-orders",
      heading: "International Orders",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Where international delivery is available, customs duties, import taxes, or destination-country charges may apply unless expressly included at checkout. Such charges are the customer’s responsibility where legally payable by the recipient.",
          ],
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        {
          type: "paragraph",
          content: [
            "For shipping questions or order assistance, please contact OasisXVII at ",
            { text: CONTACT_EMAIL, href: CONTACT_HREF },
            ".",
          ],
        },
      ],
    },
  ],
};
