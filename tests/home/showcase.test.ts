import { describe, it, expect } from "vitest";
import { showcaseSlides, wrapIndex } from "@/lib/showcase";
import type { DropView } from "@/lib/drop/state";
import type { DropState, ProductView } from "@/types/drop";

// Pure unit tests for the Home showcase slide source (Phase 2.21). No DB, no React: showcaseSlides
// decides WHICH products get a slide and in WHAT order. Its one deliberate exclusion — no
// photograph → no slide (2.21 decision 2) — is behaviour under test, so nobody "fixes" it without
// failing here first. The former second exclusion (`live` → no slides, 2.21 decision 5) was
// REVERSED by the owner on 2026-07-29 (D-2.25-23): live now yields slides like every other state,
// and that too is pinned below.

function product(overrides: Partial<ProductView> & { slug: string; index: number }): ProductView {
  return {
    nameMk: null,
    nameEn: null,
    priceMkd: 1199,
    stock: "sold-out",
    remaining: 0,
    sizes: [],
    ...overrides,
  };
}

// The three committed catalog products in sort order. Photographs exist for the first two only
// (src/lib/product-images.ts); test-baby-blue deliberately has none (placeholder register #8).
const PRODUCTS: ProductView[] = [
  product({ slug: "test-mustard-ochre", index: 1, priceMkd: 1199, stock: "in-stock", remaining: 5 }),
  product({ slug: "test-off-white", index: 2, priceMkd: 1199, stock: "low", remaining: 2 }),
  product({ slug: "test-baby-blue", index: 3, priceMkd: 1999 }),
];

function view(state: DropState, products: ProductView[] = PRODUCTS): DropView {
  return {
    slug: "test-drop",
    state,
    startsAtMs: 1_700_000_000_000,
    endsAtMs: null,
    serverNowMs: 1_700_000_000_000,
    remaining: products.reduce((s, p) => s + p.remaining, 0),
    products,
    isPreview: false,
  };
}

describe("showcaseSlides", () => {
  it("returns [] when there is no drop at all", () => {
    expect(showcaseSlides(null)).toEqual([]);
  });

  it("live: the same photographed slides as every other state (D-2.25-23, reversing 2.21 decision 5)", () => {
    const slides = showcaseSlides(view("live"));
    expect(slides.map((s) => s.slug)).toEqual(["test-mustard-ochre", "test-off-white"]);
  });

  it("countdown: only the photographed products, in view.products order", () => {
    const slides = showcaseSlides(view("countdown"));
    expect(slides.map((s) => s.slug)).toEqual(["test-mustard-ochre", "test-off-white"]);
    expect(slides.map((s) => s.index)).toEqual([1, 2]);
    for (const slide of slides) {
      expect(slide.image).not.toBeNull();
      expect(slide.image.src).toMatch(/^\/images\/lifestyle\//);
    }
  });

  it("ended: same two slides — the state gate is live-only, not ended", () => {
    const slides = showcaseSlides(view("ended"));
    expect(slides.map((s) => s.slug)).toEqual(["test-mustard-ochre", "test-off-white"]);
  });

  it("never includes test-baby-blue — no photograph exists (register #8, decision 2)", () => {
    for (const state of ["countdown", "live", "ended"] as const) {
      const slugs = showcaseSlides(view(state)).map((s) => s.slug);
      expect(slugs).not.toContain("test-baby-blue");
    }
  });

  it("carries the product's real data through to the slide", () => {
    const [first] = showcaseSlides(view("countdown"));
    expect(first).toMatchObject({
      slug: "test-mustard-ochre",
      index: 1,
      priceMkd: 1199,
      stock: "in-stock",
      remaining: 5,
    });
  });

  it("preserves a re-ordered products array (order comes from the view, never from the image map)", () => {
    const reversed = [...PRODUCTS].reverse();
    const slides = showcaseSlides(view("countdown", reversed));
    expect(slides.map((s) => s.slug)).toEqual(["test-off-white", "test-mustard-ochre"]);
  });

  it("returns [] when no product has a photograph", () => {
    const slides = showcaseSlides(view("countdown", [product({ slug: "test-baby-blue", index: 3 })]));
    expect(slides).toEqual([]);
  });
});

describe("wrapIndex", () => {
  it("wraps past the end back to 0", () => {
    expect(wrapIndex(2, 2)).toBe(0);
    expect(wrapIndex(3, 3)).toBe(0);
  });

  it("wraps before the start back to the last slide", () => {
    expect(wrapIndex(-1, 2)).toBe(1);
    expect(wrapIndex(-1, 3)).toBe(2);
  });

  it("is the identity inside the range", () => {
    expect(wrapIndex(0, 2)).toBe(0);
    expect(wrapIndex(1, 2)).toBe(1);
  });

  it("wraps far out-of-range values in both directions", () => {
    expect(wrapIndex(7, 3)).toBe(1);
    expect(wrapIndex(-7, 3)).toBe(2);
  });

  it("never returns NaN or a negative index, even at length <= 0", () => {
    for (const [i, len] of [
      [0, 0],
      [5, 0],
      [-5, 0],
      [3, -2],
      [-3, -2],
      [-9, 4],
    ]) {
      const out = wrapIndex(i, len);
      expect(Number.isNaN(out)).toBe(false);
      expect(out).toBeGreaterThanOrEqual(0);
    }
  });
});
