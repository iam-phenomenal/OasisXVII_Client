/**
 * Shape check only. It rejects the obvious typos a shopper makes in a hurry
 * (missing @, missing TLD, stray spaces) and deliberately does not attempt
 * RFC 5322 — the only proof an address is real is mail arriving at it.
 *
 * Shared by the checkout form, the footer newsletter form, and the subscribe
 * route so the client and the server agree on what they accept.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}
