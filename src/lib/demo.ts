// ─────────────────────────────────────────────────────────────────────────
// PLACEHOLDER demo data for the Phase 1.02 design-system pass ONLY.
//
// This is NOT the real drop. It exists so the components can be seen in every
// state (available / low / sold-out, countdown / live / ended) on real routes.
// Per facts.md, no owed fact is invented here:
//   • product names        → neutral slot indices, rendered via a placeholder
//   • prices               → never a number; the price slot renders a PLACEHOLDER
//   • sizes                → generic S–XL to demo the picker (flagged as sample)
//   • photos               → none exist (D-0-6); the card shows a photo PLACEHOLDER
//
// The real, typed drop config + server-computed state replace this in 1.04.
// See the placeholder register in current-state.md and D-1.02-3.
// ─────────────────────────────────────────────────────────────────────────

import type {DemoProduct} from '@/types/drop';

const SIZES_MOSTLY_STOCKED = [
  {label: 'S', available: true},
  {label: 'M', available: true},
  {label: 'L', available: true},
  {label: 'XL', available: false},
];

const SIZES_LOW = [
  {label: 'S', available: false},
  {label: 'M', available: true},
  {label: 'L', available: true},
  {label: 'XL', available: false},
];

const SIZES_SOLD_OUT = [
  {label: 'S', available: false},
  {label: 'M', available: false},
  {label: 'L', available: false},
  {label: 'XL', available: false},
];

// A 4-piece drop that shows all three card states, incl. a sold-out card.
export const DEMO_PRODUCTS: DemoProduct[] = [
  {slug: 'p-01', index: 1, stock: 'in-stock', sizes: SIZES_MOSTLY_STOCKED},
  {slug: 'p-02', index: 2, stock: 'low', remaining: 2, sizes: SIZES_LOW},
  {slug: 'p-03', index: 3, stock: 'in-stock', sizes: SIZES_MOSTLY_STOCKED},
  {slug: 'p-04', index: 4, stock: 'sold-out', sizes: SIZES_SOLD_OUT},
];

export function getDemoProduct(slug: string): DemoProduct | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

// The Instagram handle IS verified (facts.md §6); the URL still owes a
// click-test before launch, so we surface the handle and link but log it.
export const INSTAGRAM_HANDLE = '@trajanovv2026';
export const INSTAGRAM_URL = 'https://instagram.com/trajanovv2026';
