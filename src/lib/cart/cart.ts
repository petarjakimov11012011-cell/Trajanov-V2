// The cart — pure, framework-free, and DB-free (Phase 1.06, D-1.06-5).
//
// The cart is a SUGGESTION; create_order() is the fact — the same principle as the client clock
// (D-1.04-9). Nothing here reserves, holds, locks, or decrements stock, and nothing here writes to
// variants/orders/order_items. A cart that reserved stock would hand a saboteur a free stock-lock
// (brief Task 3). Stock is touched by exactly one thing: create_order().
//
// This module is deliberately React-free so the cap and the "the customer's choice survives" logic
// are unit-testable in the node test env (no jsdom). The React store + sessionStorage persistence
// live in src/components/cart/cart-store.ts.

/**
 * The whole-order unit cap. Mirrors what create_order() ACTUALLY enforces — step 3 asserts the SUM of
 * quantities across the order is in 1..2 (src/../create_order.sql). That is the binding rule; the
 * order_items per-row `qty` 1..2 CHECK is looser and never binds once the total is capped at 2. The
 * Plan's "max 2 units per order" agrees with the database here (brief Task 2). Client and server share
 * this number by intent — see tests/cart + tests/orders/create-order.
 */
export const MAX_UNITS_PER_ORDER = 2;

/** One cart line: a chosen variant (product + size) and how many units of it. */
export interface CartItem {
  /** The variant id — a product-and-size pair. The ONLY id the server needs (with qty). */
  variantId: string;
  /** Which drop this belongs to. Every item in a cart shares it (adds happen on the active drop). */
  dropSlug: string;
  /** The product's slug — lets a cart row link back to its product page. */
  productSlug: string;
  /** 1-based sort position → the neutral slot name ("Производ 01") while names are OWED (facts.md §7). */
  productIndex: number;
  /** The size label, for display in the cart row. */
  size: string;
  /** Units of this variant. Kept >= 1; total across the cart is capped at MAX_UNITS_PER_ORDER. */
  qty: number;
}

export interface Cart {
  items: CartItem[];
}

export const emptyCart: Cart = { items: [] };

/** Total units across the whole cart — the number the cap is measured against. */
export function totalUnits(cart: Cart): number {
  return cart.items.reduce((n, i) => n + i.qty, 0);
}

/** True when the cart already holds the maximum units allowed in one order. */
export function atCap(cart: Cart): boolean {
  return totalUnits(cart) >= MAX_UNITS_PER_ORDER;
}

/**
 * Add `qty` units of a variant. Enforces the whole-order cap: if adding would push the cart over
 * MAX_UNITS_PER_ORDER, the cart is returned UNCHANGED (the caller surfaces the cap notice). Adding a
 * variant already in the cart increments its line rather than duplicating it.
 */
export function addItem(cart: Cart, item: Omit<CartItem, "qty">, qty = 1): Cart {
  if (qty < 1) return cart;
  if (totalUnits(cart) + qty > MAX_UNITS_PER_ORDER) return cart;
  const existing = cart.items.find((i) => i.variantId === item.variantId);
  if (existing) {
    return {
      items: cart.items.map((i) =>
        i.variantId === item.variantId ? { ...i, qty: i.qty + qty } : i,
      ),
    };
  }
  return { items: [...cart.items, { ...item, qty }] };
}

/**
 * Set a line's quantity to an absolute value. Clamped to >= 1 and to whatever the whole-order cap
 * leaves after the other lines. A qty of 0 (or less) removes the line.
 */
export function setItemQty(cart: Cart, variantId: string, qty: number): Cart {
  if (qty <= 0) return removeItem(cart, variantId);
  const others = cart.items
    .filter((i) => i.variantId !== variantId)
    .reduce((n, i) => n + i.qty, 0);
  const capped = Math.min(qty, MAX_UNITS_PER_ORDER - others);
  if (capped < 1) return cart; // no room left; the UI disables "+" before this, so it is a backstop
  return {
    items: cart.items.map((i) => (i.variantId === variantId ? { ...i, qty: capped } : i)),
  };
}

export function removeItem(cart: Cart, variantId: string): Cart {
  return { items: cart.items.filter((i) => i.variantId !== variantId) };
}

/**
 * The ONLY thing that crosses the client → server boundary: variant_id + qty. Never a price, never a
 * name — the server snapshots unit_price_mkd inside create_order() (brief Task 6). A price that
 * arrived from a browser is a price a customer chose.
 */
export function toOrderItems(cart: Cart): { variantId: string; quantity: number }[] {
  return cart.items.map((i) => ({ variantId: i.variantId, quantity: i.qty }));
}

/** Which drop the cart is for (all items share it), or null for an empty cart. */
export function cartDropSlug(cart: Cart): string | null {
  return cart.items[0]?.dropSlug ?? null;
}

/** Defensive parse for persisted carts — returns emptyCart for anything not shaped like a Cart. */
export function parseCart(raw: unknown): Cart {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as Cart).items)) return emptyCart;
  const items = (raw as Cart).items.filter(
    (i): i is CartItem =>
      !!i &&
      typeof i.variantId === "string" &&
      typeof i.dropSlug === "string" &&
      typeof i.productSlug === "string" &&
      typeof i.productIndex === "number" &&
      typeof i.size === "string" &&
      typeof i.qty === "number" &&
      i.qty >= 1,
  );
  return { items };
}
