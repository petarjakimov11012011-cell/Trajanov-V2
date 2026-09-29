// USD reference rate for the English site (Phase Y.09, D-Y.09-4).
//
// A MID-MARKET REFERENCE rate, taken on 2026-09-29: 1,000 MKD = 18.43 USD, i.e. 1 USD ≈ 54.3 MKD
// (facts.md §7). It is FOR DISPLAY ONLY — it produces the "≈ $22" shown next to a denar price on the
// EN locale. It is NEVER used to compute anything charged: the price, the order, the database, the
// emails and the structured data are all MKD, and the customer always pays the courier in denars.
//
// UPDATED BY HAND. Nothing refreshes it and nothing alerts when it goes stale — re-check it before the
// first real drop and at least every three months after (owed-verification register). When you change
// the rate, change the date with it, and update the facts.md §7 row in the same commit.

/** Macedonian denars per one US dollar, mid-market, on USD_RATE_DATE. Display only. */
export const MKD_PER_USD = 54.3;

/** The day MKD_PER_USD was read. */
export const USD_RATE_DATE = "2026-09-29";
