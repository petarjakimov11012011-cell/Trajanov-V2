import {describe, it, expect} from "vitest";
import {DELIVERY_COST_MKD} from "../../src/config/shipping";

// Delivery cost (Phase Y.09, D-Y.09-2). facts.md §7: 200 MKD, VERIFIED — owner via Lazar, 2026-09-29.
// It is the ONE place the number lives; every rendered mention interpolates it through the formatter,
// so changing the cost is a one-line edit here plus a deploy — never a copy hunt across two catalogs.

describe("DELIVERY_COST_MKD", () => {
  it("is 200 MKD (facts.md §7, VERIFIED 2026-09-29)", () => {
    expect(DELIVERY_COST_MKD).toBe(200);
  });
});
