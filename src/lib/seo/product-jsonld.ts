import type {DropState, StockLevel} from '@/types/drop';

// Product structured data (Task 5), wired to the REAL server drop-state source. Gated hard on a real
// product name: while names are placeholders (register #4), this returns null and NO Product node
// ships — a neutral slot ("Производ 01") is never emitted as a name. `image` and `description` are
// omitted while photos (#2) and composition (#3) are placeholders: an incomplete-but-true node, never
// one padded with fakes.

export interface ProductJsonLdInput {
  /** The REAL per-locale product name, or null when OWED. Null ⇒ no node (the gate). */
  name: string | null;
  /** Whole MKD, or null when OWED. Present ⇒ the real figure; the currency is always MKD. */
  priceMkd: number | null;
  stock: StockLevel;
  dropState: DropState;
  /** Absolute canonical product URL. */
  url: string;
}

/**
 * schema.org availability from the SERVER drop state + stock — NEVER hardcoded InStock (Plan §10):
 *   • sold out (any state)      → SoldOut
 *   • live + stock              → InStock
 *   • countdown (not yet open)  → PreOrder  (announced, opens at the countdown's zero)
 *   • ended, stock left         → OutOfStock (the drop is over — not purchasable)
 */
export function availabilityFor(dropState: DropState, stock: StockLevel): string {
  const S = 'https://schema.org/';
  if (stock === 'sold-out') return `${S}SoldOut`;
  if (dropState === 'live') return `${S}InStock`;
  if (dropState === 'countdown') return `${S}PreOrder`;
  return `${S}OutOfStock`;
}

export function productJsonLd(input: ProductJsonLdInput): object | null {
  if (!input.name) return null;

  const offers: Record<string, unknown> = {
    '@type': 'Offer',
    priceCurrency: 'MKD',
    availability: availabilityFor(input.dropState, input.stock),
    url: input.url,
  };
  if (input.priceMkd != null) offers.price = String(input.priceMkd);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    brand: {'@type': 'Brand', name: 'Trajanov'},
    offers,
  };
}
