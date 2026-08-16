import { privacy } from "./privacy";
import { refund } from "./refund";
import { shipping } from "./shipping";
import { terms } from "./terms";
import type { Policy } from "./types";

export { POLICY_EFFECTIVE_DATE } from "./effectiveDate";
export { privacy, refund, shipping, terms };
export type { InlineNode, Policy, PolicyBlock, PolicySection } from "./types";

export const ALL_POLICIES: Policy[] = [terms, privacy, refund, shipping];
