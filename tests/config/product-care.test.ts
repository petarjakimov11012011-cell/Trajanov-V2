import { describe, it, expect } from "vitest";
import { getProductCare } from "../../src/lib/product-care";
import { PRODUCTS } from "../../src/config/products";

// The Y.06 care wiring. Two things are worth a test here, and neither is "does a lookup look up".
//
// 1. THE SLUG KEYING. A fabric composition is a consumer-protection claim about what the customer is
//    paying cash for at the door. If the lookup were positional, re-ordering `products.ts` would move
//    one colourway's claim onto another — the same failure `product-images.ts` guards against
//    (D-Y.03-1), except the wrong answer here is a false material claim rather than a wrong photo.
//
// 2. NOTHING INVENTED IS COMMITTED. `facts.md` §7 has fabric/composition/care as UNVERIFIED — OWED,
//    and placeholder register rows #3/#9 are OPEN. This suite goes RED the moment anyone commits a
//    plausible-sounding composition to `products.ts` without a label to read it off.

describe("getProductCare — keyed by slug, never by position", () => {
  it("returns a result for every configured slug, and null for anything else", () => {
    const slugs = Object.values(PRODUCTS).flatMap((ps) => ps.map((p) => p.slug));
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(getProductCare(slug)).not.toBeNull();
    }
    expect(getProductCare("no-such-product")).toBeNull();
    expect(getProductCare("")).toBeNull();
  });

  it("answers for the slug asked for, not for the first product in the list", () => {
    // A positional lookup would answer identically for every slug in a drop. Assert the identity of
    // the answer is tied to the slug by checking each slug resolves to ITS OWN config entry.
    for (const products of Object.values(PRODUCTS)) {
      for (const p of products) {
        const care = getProductCare(p.slug)!;
        expect(care.mk).toBe(p.careMk?.trim() ? p.careMk.trim() : null);
        expect(care.en).toBe(p.careEn?.trim() ? p.careEn.trim() : null);
      }
    }
  });
});

describe("getProductCare — no composition or care copy is committed (facts.md §7 OWED)", () => {
  it("every configured product still has null care copy in BOTH locales", () => {
    // Goes red on any committed composition text. Filling these in is legitimate ONLY once Vladimir
    // has read the labels and `facts.md` §7 is VERIFIED — at which point this test is updated in the
    // same commit, deliberately, rather than silently satisfied.
    for (const products of Object.values(PRODUCTS)) {
      for (const p of products) {
        expect(getProductCare(p.slug)).toEqual({ mk: null, en: null });
      }
    }
  });
});
