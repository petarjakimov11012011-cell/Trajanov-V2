import { describe, it, expect } from "vitest";
import { getProductImage, getProductSecondImage } from "@/lib/product-images";

// The slug → photograph maps (Y.03, extended by Y.08). Pure lookups, but the wiring they encode is
// the one place a cash-on-delivery customer can be shown the wrong garment: a photograph belongs to
// a product only because it shows that product's COLOURWAY (D-Y.03-1). These tests pin the mapping
// itself — which file lands on which slug, and which slugs still have no second frame — so a future
// re-order or a copy-paste cannot move a shirt's photo onto another colourway unnoticed.

describe("getProductImage", () => {
  it("returns baby-blue-01 for test-baby-blue (Y.08 — Product 03's first real frame)", () => {
    expect(getProductImage("test-baby-blue")?.src).toBe("/images/lifestyle/baby-blue-01.webp");
  });

  it("keeps Products 01 and 02 on their own colourway's frame", () => {
    expect(getProductImage("test-mustard-ochre")?.src).toBe("/images/lifestyle/mustard-ochre-01.webp");
    expect(getProductImage("test-off-white")?.src).toBe("/images/lifestyle/off-white-01.webp");
  });

  it("returns null for a slug with no photograph", () => {
    expect(getProductImage("test-no-photo")).toBeNull();
  });
});

describe("getProductSecondImage", () => {
  it("returns baby-blue-02 for test-baby-blue — the only product with a second frame", () => {
    expect(getProductSecondImage("test-baby-blue")?.src).toBe("/images/lifestyle/baby-blue-02.webp");
  });

  it("returns null for test-mustard-ochre — slot 2 stays a visible placeholder (register #2)", () => {
    expect(getProductSecondImage("test-mustard-ochre")).toBeNull();
  });

  it("returns null for test-off-white — slot 2 stays a visible placeholder (register #2)", () => {
    expect(getProductSecondImage("test-off-white")).toBeNull();
  });

  it("returns null for an unknown slug", () => {
    expect(getProductSecondImage("test-no-photo")).toBeNull();
  });
});

describe("alt keys", () => {
  it("gives both baby-blue frames the same alt key (D-Y.08-5)", () => {
    expect(getProductImage("test-baby-blue")?.altKey).toBe("Product.photoAltBabyBlue");
    expect(getProductSecondImage("test-baby-blue")?.altKey).toBe("Product.photoAltBabyBlue");
  });
});
