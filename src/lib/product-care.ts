// Composition & care copy, keyed by product SLUG (D-Y.06-1) — mirroring src/lib/product-images.ts.
//
// KEYED BY SLUG, NEVER BY INDEX OR POSITION. Fabric composition and care instructions are a
// consumer-protection claim: the customer pays cash at the door for a garment they were told is made
// of something. Index-based lookup would let a re-order in `products.ts` silently move one shirt's
// fabric claim onto another colourway — the same failure mode `product-images.ts` guards against
// (D-Y.03-1), except here the wrong answer is a false material claim rather than a wrong photo.
// `products.slug` is globally UNIQUE (schema.sql:59, `slug text not null unique`), so the first match
// across all drops is the only match.
//
// WHY THIS READS CONFIG AND NOT THE DATABASE. `D-1.04-9` says the app reads drop state from the DB,
// never from config, and that still holds — nothing here touches drop state, stock, price, or
// openness. There is simply no DB column for care copy: photo and fabric columns land with **Y.01**
// (`D-1.06-3`), and adding one here would collide with that phase. So this is the one narrow thing
// the app reads out of `src/config/products.ts`, and the accepted cost is that changing care copy
// needs a deploy rather than a sync (`D-Y.06-1`).
//
// NOTHING IS INVENTED HERE. Every `careMk` / `careEn` in `products.ts` is `null` today and stays that
// way until Vladimir reads the actual labels — `facts.md` §7 has fabric/composition/care as
// `UNVERIFIED — OWED`, and placeholder register rows #3 and #9 are OPEN. While they are null the
// product page renders exactly the placeholder it rendered before this module existed (`D-Y.06-2`).
// Filling them in is a one-line config edit; guessing at them is the worst thing this file could do.

import { PRODUCTS } from "@/config/products";

/** A product's per-locale care copy. Either side may be null — MK could land before EN, or vice versa. */
export type ProductCare = {
  /** Macedonian composition & care, or null while it is OWED (facts.md §7). */
  readonly mk: string | null;
  /** English composition & care, or null while it is OWED. */
  readonly en: string | null;
};

/**
 * Blank-safe read: an empty or whitespace-only config value is treated as "not supplied yet", not as
 * a real (empty) claim. Without this, a stray `careMk: ""` would render an empty Composition & care
 * section — which reads as "we checked and there is nothing to say" rather than as the honest
 * `[PLACEHOLDER: …]` the fact is still owed under.
 */
function orNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * The care copy for a product slug, or null when the slug is not in `products.ts` at all.
 *
 * A found product with both fields still OWED returns `{mk: null, en: null}` — the caller falls back
 * to the placeholder per locale. The two cases are kept distinct on purpose: "no such product" and
 * "this product's label has not been read yet" are different facts.
 */
export function getProductCare(slug: string): ProductCare | null {
  for (const products of Object.values(PRODUCTS)) {
    const product = products.find((p) => p.slug === slug);
    if (product) {
      return { mk: orNull(product.careMk), en: orNull(product.careEn) };
    }
  }
  return null;
}
