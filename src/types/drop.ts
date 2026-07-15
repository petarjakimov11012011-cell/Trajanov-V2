// Shared shape for drop state and products used across the UI.
// Real, server-computed drop state + typed drop config land in Phase 1.04;
// these types describe what the components render, not the source of truth.

export type DropState = 'countdown' | 'live' | 'ended';

export type StockLevel = 'in-stock' | 'low' | 'sold-out';

export interface DemoSize {
  label: string;
  available: boolean;
}

export interface DemoProduct {
  slug: string;
  /** Neutral slot index — real names are owed from Vladimir (facts.md §7). */
  index: number;
  stock: StockLevel;
  /** Only meaningful when stock === 'low' — units remaining. */
  remaining?: number;
  sizes: DemoSize[];
}
