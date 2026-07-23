import { describe, it, expect } from "vitest";
import { compareSizeLabels, CANONICAL_SIZE_ORDER } from "../../src/lib/drop/size-order";

// Phase 2.09 (D-2.09-3): garment-size ordering is a PURE, unit-tested rule so it can be proven without
// the server-only `state.ts`. Sizes rank by their position in the canonical clothing order
// (XS · S · M · L · XL · XXL · XXXL), not alphabetically — `localeCompare` gave L, M, S, XL, which read
// as broken on the product page. The comparator NEVER mutates a label; it only orders. The label the UI
// renders stays the original database string (original spelling, original case, original whitespace).

/** Sort labels through the comparator — the exact call `toProductView()` makes on `variant.size`. */
const order = (labels: string[]): string[] => [...labels].sort(compareSizeLabels);

describe("compareSizeLabels — canonical garment-size order", () => {
  it("orders a shuffled S/M/L/XL set to S, M, L, XL (the Product 01 / 03 case)", () => {
    expect(order(["XL", "L", "S", "M"])).toEqual(["S", "M", "L", "XL"]);
  });

  it("returns a single ['XL'] unchanged (the Product 02 case — a one-item sort is a no-op)", () => {
    expect(order(["XL"])).toEqual(["XL"]);
  });

  it("orders ['XXL','S','XL'] to ['S','XL','XXL']", () => {
    expect(order(["XXL", "S", "XL"])).toEqual(["S", "XL", "XXL"]);
  });

  it("treats 2XL as XXL and 3XL as XXXL, keeping the original spelling", () => {
    expect(order(["3XL", "2XL", "XL", "L"])).toEqual(["L", "XL", "2XL", "3XL"]);
  });

  it("lands an unknown label after every known size, deterministically", () => {
    expect(order(["M", "One size", "S"])).toEqual(["S", "M", "One size"]);
  });

  it("orders two unknown labels alphabetically among themselves (order stays total)", () => {
    expect(order(["Zebra", "One size", "Alpha"])).toEqual(["Alpha", "One size", "Zebra"]);
  });

  it("orders lowercase/padded input correctly and keeps each label's original spelling", () => {
    // " s " ranks as S (< M), and both labels come back byte-identical to the input.
    expect(order(["m", " s "])).toEqual([" s ", "m"]);
  });

  it("exposes the canonical order small-to-large", () => {
    expect(CANONICAL_SIZE_ORDER).toEqual(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
  });
});
