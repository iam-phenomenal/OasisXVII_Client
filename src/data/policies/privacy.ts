import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/contact";
import { POLICY_EFFECTIVE_DATE } from "./effectiveDate";
import type { Policy } from "./types";

export const privacy: Policy = {
  slug: "privacy",
  title: "Privacy Policy",
  navLabel: "Privacy",
  description:
    "How OasisXVII CORP collects, uses, and protects information gathered through oasisxvii.xyz.",
  effectiveDate: POLICY_EFFECTIVE_DATE,
  intro: [
    {
      type: "paragraph",
      content: [
        "OasisXVII CORP respects your privacy. This Privacy Policy explains how we handle information collected through oasisxvii.xyz.",
      ],
    },
  ],
  sections: [
    {
      id: "information-we-collect",
      heading: "Information We Collect",
      blocks: [
        {
          type: "paragraph",
          content: [
            "We may collect information you provide when you place an order, contact us, subscribe for updates, or use our website, including your name, email address, phone number, billing and delivery information, order details, and customer-service communications.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-information",
      heading: "How We Use Information",
      blocks: [
        {
          type: "list",
          items: [
            "Process and fulfill orders and payments.",
            "Arrange delivery and provide order updates.",
            "Respond to customer-service requests.",
            "Improve our website, products, and services.",
            "Protect our website and prevent fraud or unauthorized transactions.",
            "Comply with applicable legal and regulatory requirements.",
          ],
        },
      ],
    },
    {
      id: "payment-information",
      heading: "Payment Information",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Payments may be processed by third-party payment providers. Payment information is handled according to the applicable provider’s security and privacy practices.",
          ],
        },
      ],
    },
    {
      id: "sharing-information",
      heading: "Sharing Information",
      blocks: [
        {
          type: "paragraph",
          content: [
            "We may share necessary information with trusted service providers that help us process payments, deliver orders, operate our website, provide communications, or comply with legal obligations. We do not sell customers’ personal information.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      heading: "Cookies",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Our website may use cookies and similar technologies to support essential functions, remember preferences, improve performance, and understand website usage.",
          ],
        },
      ],
    },
    {
      id: "security-and-retention",
      heading: "Security & Retention",
      blocks: [
        {
          type: "paragraph",
          content: [
            "We take reasonable measures to protect personal information and retain it only as long as reasonably necessary for legitimate business, legal, security, and transaction purposes.",
          ],
        },
      ],
    },
    {
      id: "your-rights",
      heading: "Your Rights",
      blocks: [
        {
          type: "paragraph",
          content: [
            "Where applicable, you may request access to, correction of, or deletion of your personal information. Requests can be made by contacting OasisXVII at ",
            { text: CONTACT_EMAIL, href: CONTACT_HREF },
            ".",
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
            "This Privacy Policy may be updated when our services, technology, or legal requirements change. Updates will be posted on this page.",
          ],
        },
      ],
    },
  ],
};
