import { describe, it, expect } from "vitest";
import {
  emptyCart,
  addItem,
  setItemQty,
  removeItem,
  toOrderItems,
  totalUnits,
  atCap,
  SANITY_MAX_UNITS_PER_ORDER,
  type CartItem,
} from "../../src/lib/cart/cart";

// The pure cart logic (Phase 1.06, cap removed in Y.06). Node env, no DB, no jsdom — just the reducer
// that decides what the customer's choice is and holds it under the 99-unit SANITY ceiling. The
// integration half (that this choice reaches order_items) lives in tests/orders/checkout-items.test.ts.

const A: Omit<CartItem, "qty"> = {
  variantId: "var-A",
  dropSlug: "d",
  productSlug: "prod-a",
  productIndex: 1,
  size: "L",
};
const B: Omit<CartItem, "qty"> = {
  variantId: "var-B",
  dropSlug: "d",
  productSlug: "prod-b",
  productIndex: 2,
  size: "M",
};
const C: Omit<CartItem, "qty"> = {
  variantId: "var-C",
  dropSlug: "d",
  productSlug: "prod-c",
  productIndex: 3,
  size: "S",
};

describe("cart — the customer's choice is recorded faithfully", () => {
  it("records the exact variant, size, and quantity the customer added", () => {
    const cart = addItem(emptyCart, A);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].variantId).toBe("var-A");
    expect(cart.items[0].size).toBe("L");
    expect(cart.items[0].qty).toBe(1);
  });

  it("two different variants → two lines, each with its own variant and quantity", () => {
    let cart = addItem(emptyCart, A);
    cart = addItem(cart, B);
    expect(cart.items.map((i) => i.variantId)).toEqual(["var-A", "var-B"]);
    expect(toOrderItems(cart)).toEqual([
      { variantId: "var-A", quantity: 1 },
      { variantId: "var-B", quantity: 1 },
    ]);
  });

  it("adding the same variant again increments its line rather than duplicating it", () => {
    let cart = addItem(emptyCart, A);
    cart = addItem(cart, A);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].qty).toBe(2);
  });

  it("removeItem drops exactly that line", () => {
    let cart = addItem(emptyCart, A);
    cart = addItem(cart, B);
    cart = removeItem(cart, "var-A");
    expect(cart.items.map((i) => i.variantId)).toEqual(["var-B"]);
  });
});

describe("cart — the 99-unit SANITY ceiling (not a business rule — D-Y.06-3/4)", () => {
  // The 2-unit business cap is GONE (D-Y.06-3, Petar's call, supersedes D-1.06-6). What is left is
  // input validation: a ceiling absurd enough that no real customer meets it, kept only so a malformed
  // or absurd quantity is refused cleanly (TR003) instead of becoming a cast error or a 500 at the one
  // moment that matters. Nothing here limits how much of a drop one person may buy — real stock, the
  // per-drop rate limit (D-1.04-7) and TR005 (one live order per phone per drop) do that.
  it("the ceiling is 99, matching what create_order() enforces", () => {
    expect(SANITY_MAX_UNITS_PER_ORDER).toBe(99);
  });

  it("ACCEPTS a third unit across different lines — the old cap is gone", () => {
    let cart = addItem(emptyCart, A); // 1
    cart = addItem(cart, B); // 2
    expect(atCap(cart)).toBe(false); // 2 was the old cap; it is nothing now
    cart = addItem(cart, C); // 3 — refused before Y.06
    expect(totalUnits(cart)).toBe(3);
    expect(cart.items.map((i) => i.variantId)).toEqual(["var-A", "var-B", "var-C"]);
  });

  it("ACCEPTS a third unit on the same line too", () => {
    let cart = addItem(emptyCart, A);
    cart = addItem(cart, A);
    cart = addItem(cart, A); // qty 3 — clamped to 2 before Y.06
    expect(cart.items[0].qty).toBe(3);
  });

  it("setItemQty sets 3 exactly, and still removes the line at zero", () => {
    let cart = addItem(emptyCart, A);
    cart = setItemQty(cart, "var-A", 3); // clamped to 2 before Y.06
    expect(cart.items[0].qty).toBe(3);
    cart = setItemQty(cart, "var-A", 0); // removes
    expect(cart.items).toHaveLength(0);
  });

  it("atCap is false at ordinary quantities and true only AT the ceiling", () => {
    let cart = addItem(emptyCart, A, 98);
    expect(atCap(cart)).toBe(false);
    cart = addItem(cart, B, 1); // 99
    expect(totalUnits(cart)).toBe(99);
    expect(atCap(cart)).toBe(true);
  });

  it("refuses to cross the ceiling — cart returned unchanged", () => {
    const cart = addItem(emptyCart, A, 99);
    const over = addItem(cart, B); // would be 100
    expect(over).toEqual(cart);
    expect(totalUnits(over)).toBe(99);
  });

  it("setItemQty clamps to the ceiling, counting units already held by the other lines", () => {
    let cart = addItem(emptyCart, A); // A qty 1
    cart = addItem(cart, B, 10); // B qty 10 (total 11)
    cart = setItemQty(cart, "var-A", 500); // A wants 500; B holds 10 → clamp A to 89
    expect(cart.items.find((i) => i.variantId === "var-A")!.qty).toBe(89);
    expect(totalUnits(cart)).toBe(99);
  });
});

describe("cart — the submission boundary carries only variant_id + qty", () => {
  it("toOrderItems emits exactly {variantId, quantity} — never a price or a name", () => {
    const cart = addItem(emptyCart, A, 2);
    const items = toOrderItems(cart);
    expect(items).toEqual([{ variantId: "var-A", quantity: 2 }]);
    expect(Object.keys(items[0]).sort()).toEqual(["quantity", "variantId"]);
  });
});
