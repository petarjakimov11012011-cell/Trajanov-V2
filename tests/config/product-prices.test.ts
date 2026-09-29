import { describe, it, expect } from "vitest";
import { PRODUCTS } from "../../src/config/products";

// Product 03 (baby blue) is priced like the other two shirts since 2026-09-29 — 1199 MKD, owner via
// Lazar (facts.md §7, D-Y.10-1). Was 1999 MKD (owner, 2026-07-22). The hosted row is changed by one
// guarded UPDATE after merge; this pins the config the sync script and the local DB read.
describe("configured product prices", () => {
  const all = Object.values(PRODUCTS).flat();
  const price = (slug: string) => all.find((p) => p.slug === slug)?.priceMkd;

  it("test-baby-blue is 1199 MKD", () => {
    expect(price("test-baby-blue")).toBe(1199);
  });

  it("all three committed shirts are 1199 MKD", () => {
    expect(price("test-mustard-ochre")).toBe(1199);
    expect(price("test-off-white")).toBe(1199);
    expect(price("test-baby-blue")).toBe(1199);
  });
});
