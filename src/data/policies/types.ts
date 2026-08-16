export type InlineNode = string | { text: string; href: string };

export type PolicyBlock =
  | { type: "paragraph"; content: InlineNode[] }
  | { type: "list"; items: string[] };

export interface PolicySection {
  id: string;
  heading: string;
  blocks: PolicyBlock[];
}

export interface Policy {
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  effectiveDate: string;
  intro: PolicyBlock[];
  sections: PolicySection[];
}
