// What a product's buy button and stock line SAY, from the server's drop state (Phase Y.11, brief
// decision 7). Pure — no React, no I/O — so pages, cards, the showcase and a plain vitest run share one
// rule. The drop state itself is computed on the server (src/lib/drop/state.ts, D-1.04-9); this only
// maps it to display. Whether an order is accepted is still decided by create_order(), never here.
//
//  • live      → the real stock: "In stock" / "n left" / "Sold out", and Add to cart unless sold out.
//  • countdown → "Coming soon"; availability may show, but never "Sold out" — nothing has sold yet.
//  • ended, or no drop → ordering is closed: no stock badge, no count, and a disabled "Ordering is
//    closed" button. Never "Sold out": between drops a shirt is not sold out, ordering just isn't open,
//    and "Sold out" on a page that also says "In stock" was the contradiction this rule removes.

import type { DropState, StockLevel } from "@/types/drop";

/** The buy button's states — the six handover states plus `closed` (ordering is not open). */
export type BuyState = "default" | "loading" | "disabled" | "closed" | "sold-out";

/** The button state for a product, before any client-side `loading` flash. */
export function buyStateFor(
  dropState: DropState | null,
  stock: StockLevel,
): Exclude<BuyState, "loading"> {
  if (dropState === "live") return stock === "sold-out" ? "sold-out" : "default";
  if (dropState === "countdown") return "disabled";
  return "closed";
}

/** The stock level to show, or null to show no stock line at all. */
export function visibleStock(dropState: DropState | null, stock: StockLevel): StockLevel | null {
  if (dropState === "live") return stock;
  if (dropState === "countdown") return stock === "sold-out" ? null : stock;
  return null;
}
