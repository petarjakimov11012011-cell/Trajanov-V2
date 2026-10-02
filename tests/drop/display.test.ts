import { describe, it, expect } from "vitest";
import { buyStateFor, visibleStock } from "@/lib/drop/display";
import type { DropState, StockLevel } from "@/types/drop";

// Ended vs sold out (Phase Y.11, brief decision 7). What the buy button and the stock line say is a pure
// function of the SERVER's drop state and the product's stock. "Sold out" is only ever true inside a live
// drop; an ended drop (or no drop) is closed — the shirt was not necessarily sold out, ordering simply
// isn't open. The server's purchase gating (create_order) is unchanged and is not decided here.

const LEVELS: StockLevel[] = ["in-stock", "low", "sold-out"];

describe("buyStateFor", () => {
  it("live: Add to cart unless this product is sold out", () => {
    expect(buyStateFor("live", "in-stock")).toBe("default");
    expect(buyStateFor("live", "low")).toBe("default");
    expect(buyStateFor("live", "sold-out")).toBe("sold-out");
  });

  it.each(LEVELS)("countdown (%s): Coming soon — never sold out before it opens", (stock) => {
    expect(buyStateFor("countdown", stock)).toBe("disabled");
  });

  it.each(LEVELS)("ended (%s): Ordering is closed — never Sold out", (stock) => {
    expect(buyStateFor("ended", stock)).toBe("closed");
  });

  it.each(LEVELS)("no drop (%s): Ordering is closed", (stock) => {
    expect(buyStateFor(null, stock)).toBe("closed");
  });
});

describe("visibleStock", () => {
  it.each(LEVELS)("live shows the real level (%s)", (stock) => {
    expect(visibleStock("live", stock)).toBe(stock);
  });

  it("countdown shows availability but never 'sold out'", () => {
    expect(visibleStock("countdown", "in-stock")).toBe("in-stock");
    expect(visibleStock("countdown", "low")).toBe("low");
    expect(visibleStock("countdown", "sold-out")).toBeNull();
  });

  it.each([
    ["ended", "in-stock"],
    ["ended", "low"],
    ["ended", "sold-out"],
    [null, "in-stock"],
    [null, "sold-out"],
  ] as [DropState | null, StockLevel][])("%s shows no stock line at all (%s)", (state, stock) => {
    expect(visibleStock(state, stock)).toBeNull();
  });
});
