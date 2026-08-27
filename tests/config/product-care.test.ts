import { describe, it, expect } from "vitest";
import { getProductCare } from "../../src/lib/product-care";
import { PRODUCTS } from "../../src/config/products";

// The Y.06 care wiring, with the Y.07 copy in it. Two things are worth a test here, and neither is
// "does a lookup look up".
//
// 1. THE SLUG KEYING. A fabric composition is a consumer-protection claim about what the customer is
//    paying cash for at the door. If the lookup were positional, re-ordering `products.ts` would move
//    one colourway's claim onto another — the same failure `product-images.ts` guards against
//    (D-Y.03-1), except the wrong answer here is a false material claim rather than a wrong photo.
//
// 2. ONLY THE APPROVED STRINGS ARE COMMITTED. Y.06's guard asserted every product's care copy was
//    still null (D-Y.06-9); `facts.md` §7 is now VERIFIED, so that guard is REPLACED — not deleted —
//    by an exact-string allowlist (D-Y.07-4). Null (a product whose care is still owed) and the two
//    approved strings are the only permitted values. Anything else — a fibre origin, a GSM weight, a
//    drying symbol, a "premium", or the right words with a plain space instead of the non-breaking
//    one — goes RED.

// THE ONLY PERMITTED CARE COPY. Source: `facts.md` §7, VERIFIED 2026-08-27 — owner's statement
// (Vladimir, via Petar), covering all three colourways. Not a label read; if a label later disagrees,
// `facts.md` changes first and these two literals change with it (D-Y.07-3).
// The space before `°C` is U+00A0 (non-breaking): at 320px the product column is narrow enough to
// break `30 / °C` across two lines, which reads as a defect.
const APPROVED_CARE_MK = "100% памук. Перење на 30\u00A0°C.";
const APPROVED_CARE_EN = "100% cotton. Wash at 30\u00A0°C.";

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

describe("care copy is the approved facts.md §7 string, or nothing at all", () => {
  it("every configured product carries only the approved MK/EN strings, or null", () => {
    // Goes red on ANY other composition or care text — including a near-miss of the approved string.
    // Filling a product's care copy is legitimate only when the words are the ones `facts.md` §7
    // carries; a new fact means editing `facts.md` and this file together, deliberately.
    for (const products of Object.values(PRODUCTS)) {
      for (const p of products) {
        expect([null, APPROVED_CARE_MK]).toContain(p.careMk);
        expect([null, APPROVED_CARE_EN]).toContain(p.careEn);
      }
    }
  });

  it("states the composition in both locales or in neither — never one and not the other", () => {
    // A product page that states a composition in MK and renders `[PLACEHOLDER: …]` in EN is a defect:
    // the same garment would be telling two different stories depending on the language you read it in.
    for (const products of Object.values(PRODUCTS)) {
      for (const p of products) {
        expect(p.careMk === null).toBe(p.careEn === null);
      }
    }
  });
});
