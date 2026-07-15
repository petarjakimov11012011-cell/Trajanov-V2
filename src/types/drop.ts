// Shared shapes for drop state and products used across the UI. As of 1.04 these describe REAL,
// server-computed data (src/lib/drop) — the 1.02 throwaway demo shapes are gone with src/lib/demo.ts.
// The components render this; the server (src/lib/drop) is the source of truth for it.

export type DropState = "countdown" | "live" | "ended";

export type StockLevel = "in-stock" | "low" | "sold-out";

export interface SizeOption {
  label: string;
  /** Derived server-side from variant stock > 0. */
  available: boolean;
}

export interface ProductView {
  slug: string;
  /** 1-based position (products.sort_order) — drives the neutral slot name when nameMk/En is null. */
  index: number;
  /** Real Macedonian name, or null when OWED (facts.md §7) → UI renders a neutral slot. */
  nameMk: string | null;
  /** Real English name, or null when OWED. */
  nameEn: string | null;
  /** Whole MKD, or null when OWED → UI renders a price PLACEHOLDER. */
  priceMkd: number | null;
  stock: StockLevel;
  /** Units remaining across all sizes (the "n left" count when low). */
  remaining: number;
  sizes: SizeOption[];
}
