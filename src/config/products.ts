// The product CATALOGUE, keyed by drop slug (D-0-4). Prices, names, and stock live here.
//
// NOTHING here is invented (facts.md): no real product has a name, a price, a fabric claim, or a size
// chart yet — all are OWED by Vladimir (facts.md §7). So every product below is priced `null` and named
// `null` (the UI renders a neutral slot, "Производ 01", from position). The ONLY concrete values are
// sizes + stock, which exist purely to exercise the card states (in-stock / low / sold-out) of the
// rehearsal drop. When Vladimir supplies real data, fill nameMk/nameEn + priceMkd here and re-sync.

import type { ProductConfig } from "./schema";

export const PRODUCTS: Readonly<Record<string, readonly ProductConfig[]>> = {
  // Rehearsal drop — mirrors the 1.02 handover's 4-piece grid (incl. a sold-out card). test- slugs +
  // null prices/names make it obviously not real (Task 1). Stock states: in-stock, low, in-stock, sold-out.
  "test-drop": [
    {
      slug: "test-piece-01",
      nameMk: null,
      nameEn: null,
      priceMkd: null,
      photoPath: null,
      careMk: null,
      careEn: null,
      sizes: [
        { size: "S", stock: 5 },
        { size: "M", stock: 5 },
        { size: "L", stock: 5 },
        { size: "XL", stock: 0 }, // shows an unavailable size in the picker
      ],
    },
    {
      slug: "test-piece-02",
      nameMk: null,
      nameEn: null,
      priceMkd: null,
      photoPath: null,
      careMk: null,
      careEn: null,
      sizes: [
        { size: "S", stock: 0 },
        { size: "M", stock: 1 },
        { size: "L", stock: 1 },
        { size: "XL", stock: 0 }, // total 2 remaining → "low stock" badge (≤ threshold)
      ],
    },
    {
      slug: "test-piece-03",
      nameMk: null,
      nameEn: null,
      priceMkd: null,
      photoPath: null,
      careMk: null,
      careEn: null,
      sizes: [
        { size: "S", stock: 5 },
        { size: "M", stock: 5 },
        { size: "L", stock: 5 },
        { size: "XL", stock: 0 },
      ],
    },
    {
      slug: "test-piece-04",
      nameMk: null,
      nameEn: null,
      priceMkd: null,
      photoPath: null,
      careMk: null,
      careEn: null,
      sizes: [
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 }, // fully sold out → non-interactive sold-out card
      ],
    },
  ],
};
