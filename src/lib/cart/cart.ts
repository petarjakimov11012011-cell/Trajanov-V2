// The cart — pure, framework-free, and DB-free (Phase 1.06, D-1.06-5; 2-unit cap removed in Y.06).
//
// The cart is a SUGGESTION; create_order() is the fact — the same principle as the client clock
// (D-1.04-9). Nothing here reserves, holds, locks, or decrements stock, and nothing here writes to
// variants/orders/order_items. A cart that reserved stock would hand a saboteur a free stock-lock
// (brief Task 3). Stock is touched by exactly one thing: create_order().
//
// This module is deliberately React-free so the ceiling and the "the customer's choice survives" logic
// are unit-testable in the node test env (no jsdom). The React store + sessionStorage persistence
// live in src/components/cart/cart-store.ts.

/**
 * A SANITY CEILING, NOT A BUSINESS RULE (D-Y.06-4). Do not read a policy into this number.
 *
 * The 2-unit-per-order business cap was REMOVED in Y.06 on Petar's call (D-Y.06-3, superseding
 * D-1.06-6). Nothing in this codebase now limits how much of a drop one person may buy. What holds
 * that line instead is real stock, the per-drop rate limit (D-1.04-7), and TR005 (one live order per
 * phone per drop) — named plainly because the downside is real: on cash on delivery, ordering is free,
 * so one person taking a whole drop having paid nothing up front is a thing that can now happen.
 *
 * 99 exists only as input validation. It keeps TR003 alive so an absurd or malformed quantity is
 * refused CLEANLY at the door instead of becoming a cast error or a 500 mid-drop. It mirrors exactly
 * what create_order() enforces — step 3 asserts the SUM of quantities across the order is in 1..99,
 * and the order_items per-row CHECK is `between 1 and 99` to match (D-Y.06-5). Client and server share
 * this number by intent — see tests/cart + tests/orders/create-order.
 */
export const SANITY_MAX_UNITS_PER_ORDER = 99;

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
  /** Units of this variant. Kept >= 1; the cart total is held under SANITY_MAX_UNITS_PER_ORDER. */
  qty: number;
}

export interface Cart {
  items: CartItem[];
}

export const emptyCart: Cart = { items: [] };

/** Total units across the whole cart — the number the sanity ceiling is measured against. */
export function totalUnits(cart: Cart): number {
  return cart.items.reduce((n, i) => n + i.qty, 0);
}

/**
 * True when the cart has reached the 99-unit SANITY ceiling — NOT a "you have bought enough" signal.
 * The UI uses it only to disable `+` so the control cannot produce a quantity the server would refuse
 * with TR003. Nobody will ever see it; it exists so the button is never silently dead.
 */
export function atCap(cart: Cart): boolean {
  return totalUnits(cart) >= SANITY_MAX_UNITS_PER_ORDER;
}

/**
 * Add `qty` units of a variant. The only refusal is the sanity ceiling: if adding would push the cart
 * past SANITY_MAX_UNITS_PER_ORDER the cart is returned UNCHANGED (the caller surfaces the inline
 * quantity message). A third, fourth, or fiftieth unit is accepted — that is the point of D-Y.06-3.
 * Adding a variant already in the cart increments its line rather than duplicating it.
 */
export function addItem(cart: Cart, item: Omit<CartItem, "qty">, qty = 1): Cart {
  if (qty < 1) return cart;
  if (totalUnits(cart) + qty > SANITY_MAX_UNITS_PER_ORDER) return cart;
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
 * Set a line's quantity to an absolute value. Clamped to >= 1 and to whatever the 99-unit sanity
 * ceiling leaves after the other lines — a clamp nobody will meet in practice, kept so the cart can
 * never hand create_order() a total it would refuse. A qty of 0 (or less) removes the line.
 */
export function setItemQty(cart: Cart, variantId: string, qty: number): Cart {
  if (qty <= 0) return removeItem(cart, variantId);
  const others = cart.items
    .filter((i) => i.variantId !== variantId)
    .reduce((n, i) => n + i.qty, 0);
  const capped = Math.min(qty, SANITY_MAX_UNITS_PER_ORDER - others);
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
