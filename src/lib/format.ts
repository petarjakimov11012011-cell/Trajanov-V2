// Formatting helpers. Kept tiny and dependency-free.

/** Whole MKD with the given currency label, e.g. formatMkd(3700, "ден") → "3.700 ден". */
export function formatMkd(amount: number, currency: string): string {
  return `${amount.toLocaleString("mk-MK")} ${currency}`;
}
