/**
 * Size conversion charts, keyed by `Product["category"]`.
 *
 * Categories map 1:1 onto size systems: tops run alpha, bottoms run waist
 * inches, footwear runs UK. Accessories are one-size and have no chart — the
 * PDP hides the size-guide trigger entirely for those.
 *
 * These are published conversion standards, not measurements of our garments.
 * Per-garment measurements would need to come from the supplier.
 */

export interface SizeChart {
  /** Column headers; the first column always holds the value on the size button. */
  columns: string[]
  rows: string[][]
}

export const sizeCharts: Record<string, SizeChart> = {
  tops: {
    columns: ["OASIS", "UK", "US", "EU"],
    rows: [
      ["XS", "34", "34", "44"],
      ["S", "36", "36", "46"],
      ["M", "38", "38", "48"],
      ["L", "40", "40", "50"],
      ["XL", "42", "42", "52"],
      ["XXL", "44", "44", "54"],
    ],
  },
  bottoms: {
    columns: ["OASIS", "WAIST (CM)", "EU", "ALPHA"],
    rows: [
      ["28", "71", "44", "XS"],
      ["30", "76", "46", "S"],
      ["32", "81", "48", "M"],
      ["34", "86", "50", "L"],
      ["36", "91", "52", "XL"],
    ],
  },
  footwear: {
    columns: ["OASIS", "US", "EU", "CM"],
    rows: [
      ["UK 6", "7", "39-40", "24.5"],
      ["UK 7", "8", "41", "25.5"],
      ["UK 8", "9", "42", "26.5"],
      ["UK 9", "10", "43", "27.5"],
      ["UK 10", "11", "44-45", "28.5"],
      ["UK 11", "12", "46", "29.5"],
    ],
  },
}

/** Keyed by the `Fit` value already carried in `Product["specs"]`. */
export const fitNotes: Record<string, string> = {
  Oversized: "Cut generously through the body and shoulder. Size down for a closer fit.",
  "Box Fit": "Squared through the body with a shorter length. True to size.",
  Relaxed: "Roomy through the hip and thigh without being loose. True to size.",
  Slim: "Cut close to the body. Size up if you prefer room through the chest.",
  Slouch: "Deliberately loose. One size, worn however you like it.",
}

export function getSizeChart(category: string): SizeChart | null {
  return sizeCharts[category] ?? null
}
