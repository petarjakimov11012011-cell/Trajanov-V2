import { describe, it, expect } from "vitest";
import {
  emptyCart,
  addItem,
  setItemQty,
  removeItem,
  toOrderItems,
  totalUnits,
  atCap,
  MAX_UNITS_PER_ORDER,
  type CartItem,
} from "../../src/lib/cart/cart";

// The pure cart logic (Phase 1.06). Node env, no DB, no jsdom — just the reducer that decides what the
// customer's choice is and enforces the whole-order cap. The integration half (that this choice reaches
// order_items) lives in tests/orders/checkout-items.test.ts.

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

describe("cart — the 2-unit whole-order cap (mirrors create_order TR003)", () => {
  it("the cap constant is 2, matching what create_order() enforces", () => {
    expect(MAX_UNITS_PER_ORDER).toBe(2);
  });

  it("refuses a third unit across different lines — cart returned unchanged", () => {
    let cart = addItem(emptyCart, A); // 1
    cart = addItem(cart, B); // 2 (total 2 — at cap)
    expect(totalUnits(cart)).toBe(2);
    expect(atCap(cart)).toBe(true);
    const capped = addItem(cart, C); // would be 3
    expect(capped).toEqual(cart); // unchanged
    expect(totalUnits(capped)).toBe(2);
  });

  it("refuses a third unit on the same line too", () => {
    let cart = addItem(emptyCart, A); // qty 1
    cart = addItem(cart, A); // qty 2
    cart = addItem(cart, A); // would be qty 3
    expect(cart.items[0].qty).toBe(2);
  });

  it("setItemQty clamps to the cap and removes the line at zero", () => {
    let cart = addItem(emptyCart, A);
    cart = setItemQty(cart, "var-A", 5); // clamps to 2
    expect(cart.items[0].qty).toBe(2);
    cart = setItemQty(cart, "var-A", 0); // removes
    expect(cart.items).toHaveLength(0);
  });

  it("setItemQty on one line respects units already held by the others", () => {
    let cart = addItem(emptyCart, A); // A qty 1
    cart = addItem(cart, B); // B qty 1 (total 2)
    cart = setItemQty(cart, "var-A", 2); // A wants 2, but B holds 1 → clamp A to 1
    expect(cart.items.find((i) => i.variantId === "var-A")!.qty).toBe(1);
    expect(totalUnits(cart)).toBe(2);
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
