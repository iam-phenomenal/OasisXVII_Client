import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/contact";
import { POLICY_EFFECTIVE_DATE } from "./effectiveDate";
import type { Policy } from "./types";

export const terms: Policy = {
  slug: "terms",
  title: "Terms of Service",
  navLabel: "Terms",
  description:
    "The terms governing your use of oasisxvii.xyz and purchases made from OasisXVII CORP.",
  effectiveDate: POLICY_EFFECTIVE_DATE,
  intro: [
    {
      type: "paragraph",
      content: [
        "These Terms of Service govern your use of oasisxvii.xyz and purchases made from OasisXVII CORP (“OasisXVII,” “we,” “us,” or “our”). By using our website or placing an order, you agree to these Terms.",
      ],
    },
  ],
  sections: [
    {
      id: "products-and-orders",
      heading: "Products & Orders",
      blocks: [
        {
          type: "paragraph",
          content: [
            "OasisXVII offers fashion and apparel products through its online store. Product availability may be limited, and products may sell out without notice. We make reasonable efforts to ensure product descriptions, images, sizes, colors, and prices are accurate, although minor variations may occur.",
          ],
        },
        {
          type: "paragraph",
          content: [
            "An order is accepted only after payment has been successfully confirmed and the order has been approved for fulfillment. We reserve the right to cancel an order where a product is unavailable, a listing or pricing error occurs, payment cannot be verified, or fraudulent or unauthorized activity is suspected.",
          ],
        },
      ],
    },
    {
      id: "payment",
      heading: "Payment",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Prices are displayed in Nigerian Naira (₦) unless otherwise stated. Payments are processed through the payment options available at checkout. By submitting payment, you authorize the applicable payment provider to process the amount due.",
          ],
        },
      ],
    },
    {
      id: "shipping",
      heading: "Shipping",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Orders are processed after successful payment confirmation. Delivery times vary by destination and shipping method. Delivery estimates are not guaranteed dates. Customers are responsible for providing accurate delivery information. Full details are set out in the ",
            { text: "Shipping & Delivery Policy", href: "/shipping" },
            ".",
          ],
        },
      ],
    },
    {
      id: "returns-and-refunds",
      heading: "Returns & Refunds",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Returns, cancellations, exchanges, and refunds are governed by the ",
            { text: "OasisXVII Refund & Cancellation Policy", href: "/refund" },
            " published on this website.",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      heading: "Intellectual Property",
      blocks: [
        {
          type: "paragraph",
          content: [
            "All OasisXVII names, logos, product images, designs, text, graphics, and other website content are owned by or licensed to OasisXVII and may not be copied, reproduced, or commercially used without permission.",
          ],
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes",
      blocks: [
        {
          type: "paragraph",
          content: [
            "We may update these Terms from time to time. The latest version will be published on this website.",
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
            "For questions regarding these Terms or an order, please contact OasisXVII at ",
            { text: CONTACT_EMAIL, href: CONTACT_HREF },
            ".",
          ],
        },
      ],
    },
  ],
};
