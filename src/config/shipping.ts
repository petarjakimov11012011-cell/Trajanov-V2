// Delivery cost (Phase Y.09, D-Y.09-2).
//
// facts.md §7 — Delivery cost: 200 MKD, VERIFIED, owner via Lazar, 2026-09-29. The customer pays it,
// in cash, to the courier. This is the ONLY place the number lives: the Shipping page, the Home FAQ
// (and its FAQPage JSON-LD) and the cart all interpolate it through `formatMkdWithApproxUsd` into an
// ICU `{cost}` slot, and `tests/i18n/delivery-cost-copy.test.ts` fails if the figure is ever typed into
// a message catalog. Changing the cost is this line, the facts.md row, and a deploy.
//
// Display only. The cart still computes no total and create_order() never adds delivery to anything —
// the order path is untouched by this constant (D-Y.09-5).

/** What delivery costs the customer, in whole MKD. */
export const DELIVERY_COST_MKD = 200;
