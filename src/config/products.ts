// The product CATALOGUE, keyed by drop slug (D-0-4). Prices, names, and stock live here.
//
// PHASE 1.08 (D-1.08-1): the rehearsal drop now carries Vladimir's REAL price and REAL sizes — the
// only two facts we had at the time (facts.md §7, VERIFIED 2026-07-18): price 1199 MKD, currency MKD,
// sizes S/M/L/XL with the off-white shirt XL-only. Names and photos are still OWED and stay
// placeholders (name_* = null → the UI renders a neutral slot "Производ 01"; no photo/fabric columns
// exist yet — D-1.06-3); fabric/care is no longer owed — see the Y.07 note below. The two products
// below are the two VERIFIED colourways (facts.md §7); the colourway is used only as an INTERNAL slug
// identifier — the customer-facing name stays a placeholder
// until Vladimir supplies real product names (placeholder register #4).
//
// This is a STAND-IN rehearsal drop for the 1.08 machinery-verification gate, NOT the real first drop
// (that is 2.04/2.05, gated on photos + fabric + names + a drop date). The `test-` slug prefix keeps it
// obviously non-production even though the price is now real. Its committed window is in the PAST
// (drops.ts) so it renders "ended" and nothing is buyable by default; the gate opens it briefly, then
// closes it (Task 7 → Task 12). When Vladimir supplies real names, fill nameMk/nameEn here and re-sync.
//
// PHASE Y.02 (D-Y.02-1/2): a THIRD product, "Product 03" (baby blue), is added below as a catalog stub —
// owner-authorised out of order (Lazar, 2026-07-22) ahead of Y.01. Its price (1999 MKD) + sizes (S/M/L/XL)
// are owner-VERIFIED (facts.md §7); its photo and real name are OWED, so it ships with the same
// placeholders as the two above (its fabric/care is filled — see the Y.07 note below). It joins THIS
// ended rehearsal drop (the only drop the catalog reads) so it renders browsable-but-not-buyable; it
// is NOT assigned to any live/real drop — that is Y.01.

// PHASE Y.06 (D-Y.06-1): `careMk` / `careEn` below are READ BY THE PRODUCT PAGE, by slug, through
// `src/lib/product-care.ts`. They are not persisted (no DB column until Y.01, D-1.06-3), so this file
// is the only source — the copy below renders on a live page, and changing it needs a DEPLOY, not
// `npm run sync:drop`.
//
// PHASE Y.07 (D-Y.07-1/3): all six are now FILLED with the composition and wash temperature Vladimir
// confirmed — `facts.md` §7, VERIFIED 2026-08-27, the owner's statement, covering all three colourways.
// Placeholder register rows #3 and #9 are CLEARED by it. The two strings are an allowlist enforced by
// `tests/config/product-care.test.ts`: null or exactly those words, and both locales or neither.
// Never write a guessed composition here — a false material claim on a cash-on-delivery product page
// is a consumer-protection issue, not a copy issue.

import type { ProductConfig } from "./schema";

export const PRODUCTS: Readonly<Record<string, readonly ProductConfig[]>> = {
  // Rehearsal drop — real price (1199 MKD) + real sizes; names still placeholder (null). The two
  // verified colourways: mustard/ochre in S/M/L/XL, off-white in XL only (a single-variant product —
  // a deliberately-exercised path). Stock is small and INSERT-only (D-1.04-5): enough to place the
  // gate's one real order and see an atomic decrement, not real inventory.
  "test-drop": [
    {
      // Colourway: mustard/ochre (internal identifier only — facts.md §7). Sizes S, M, L, XL.
      slug: "test-mustard-ochre",
      nameMk: null,
      nameEn: null,
      priceMkd: 1199,
      photoPath: null,
      // COMPOSITION & CARE (Y.07, D-Y.07-1/2/3). The ONLY permitted care copy: `facts.md` §7,
      // VERIFIED 2026-08-27 on the OWNER'S STATEMENT (Vladimir, via Petar) — not a label read.
      // One statement covers all three colourways, which amends `D-Y.02-1` (D-Y.07-2), so the same
      // two strings are set explicitly on each product below — never through a shared constant or a
      // default, so a fabric claim cannot drift onto a garment it was never given (D-Y.06-1).
      // `\u00A0` is a NON-BREAKING space: at 320px the column would otherwise break `30 / °C`.
      // Nothing beyond these two facts is verified — no weight, drying, ironing, bleach, fibre
      // origin or country of manufacture. Adding a word here means editing `facts.md` first.
      careMk: "100% памук. Перење на 30\u00A0°C.",
      careEn: "100% cotton. Wash at 30\u00A0°C.",
      sizes: [
        { size: "S", stock: 3 },
        { size: "M", stock: 3 },
        { size: "L", stock: 3 },
        { size: "XL", stock: 3 },
      ],
    },
    {
      // Colourway: off-white (internal identifier only — facts.md §7). XL ONLY — a single-variant
      // product, so the gate exercises the one-size buy path as well.
      slug: "test-off-white",
      nameMk: null,
      nameEn: null,
      priceMkd: 1199,
      photoPath: null,
      careMk: "100% памук. Перење на 30\u00A0°C.",
      careEn: "100% cotton. Wash at 30\u00A0°C.",
      sizes: [{ size: "XL", stock: 3 }],
    },
    {
      // Product 03 — CATALOG STUB, baby blue (D-Y.02-1/2). A third colourway Vladimir has confirmed with
      // a REAL price (1999 MKD) and REAL sizes (S/M/L/XL) — both owner-VERIFIED (facts.md §7). Its photo,
      // and real customer-facing name are still OWED, so it ships exactly like the two above:
      // name_* = null → the UI renders the neutral slot "Производ 03" (sort_order 3 → "03"); no photo
      // column exists yet (D-1.06-3) → a visible placeholder. Its care copy is the same owner statement
      // as the other two (D-Y.07-2, amending D-Y.02-1's "read baby blue's own label"). It lives in THIS ended rehearsal drop
      // only so the catalog lists it browsable-but-not-buyable — the site's default state between drops.
      // It is NOT in a live/real drop; true drop assignment is Y.01, once real photos exist (D-Y.02-2).
      // Stock is a nominal placeholder (mirrors the two above) — test-drop is ended, so nothing is sold.
      slug: "test-baby-blue",
      nameMk: null,
      nameEn: null,
      priceMkd: 1999,
      photoPath: null,
      careMk: "100% памук. Перење на 30\u00A0°C.",
      careEn: "100% cotton. Wash at 30\u00A0°C.",
      sizes: [
        { size: "S", stock: 3 },
        { size: "M", stock: 3 },
        { size: "L", stock: 3 },
        { size: "XL", stock: 3 },
      ],
    },
  ],
};
