// Stand-in for `@/lib/drop/state` in the page-render harness (Phase Y.11). The real module is
// server-only and reads Supabase; pages here render from a fixture shaped like the committed drop
// (src/config/products.ts): three shirts at 1199 MKD, off-white XL-only. A test sets the drop state and
// any per-product stock it needs, then renders.
import type { DropView, ProductPageView } from "../../../src/lib/drop/state";
import type { DropState, ProductView, StockLevel } from "../../../src/types/drop";

function sizes(slug: string, labels: string[], available = true) {
  return labels.map((label) => ({ variantId: `${slug}-${label}`, label, available }));
}

function baseProducts(): ProductView[] {
  return [
    {
      slug: "test-mustard-ochre",
      index: 1,
      nameMk: null,
      nameEn: null,
      priceMkd: 1199,
      stock: "in-stock",
      remaining: 12,
      sizes: sizes("test-mustard-ochre", ["S", "M", "L", "XL"]),
    },
    {
      slug: "test-off-white",
      index: 2,
      nameMk: null,
      nameEn: null,
      priceMkd: 1199,
      stock: "low",
      remaining: 2,
      sizes: sizes("test-off-white", ["XL"]),
    },
    {
      slug: "test-baby-blue",
      index: 3,
      nameMk: null,
      nameEn: null,
      priceMkd: 1199,
      stock: "in-stock",
      remaining: 12,
      sizes: sizes("test-baby-blue", ["S", "M", "L", "XL"]),
    },
  ];
}

// A fourth product with NOTHING supplied: no price, no photograph, no care copy (its slug is in neither
// src/lib/product-images.ts nor src/config/products.ts). Off by default; tests that prove a missing fact
// is omitted rather than marked switch it on.
const UNFILLED: ProductView = {
  slug: "test-unfilled",
  index: 4,
  nameMk: null,
  nameEn: null,
  priceMkd: null,
  stock: "in-stock",
  remaining: 12,
  sizes: sizes("test-unfilled", ["M"]),
};

export const dropFixture: {
  state: DropState | null;
  stock: Partial<Record<string, StockLevel>>;
  withUnfilled: boolean;
} = { state: "ended", stock: {}, withUnfilled: false };

/** Reset to the default: the committed drop, ended (which is what production serves today). */
export function resetDropFixture(state: DropState | null = "ended") {
  dropFixture.state = state;
  dropFixture.stock = {};
  dropFixture.withUnfilled = false;
}

function products(): ProductView[] {
  const list = dropFixture.withUnfilled ? [...baseProducts(), UNFILLED] : baseProducts();
  return list.map((p) => {
    const level = dropFixture.stock[p.slug];
    if (!level) return p;
    const remaining = level === "sold-out" ? 0 : level === "low" ? 2 : 12;
    return {
      ...p,
      stock: level,
      remaining,
      sizes: p.sizes.map((s) => ({ ...s, available: remaining > 0 })),
    };
  });
}

export function parsePreviewState(): DropState | undefined {
  return undefined;
}

export async function getActiveDropView(): Promise<DropView | null> {
  if (dropFixture.state === null) return null;
  const list = products();
  return {
    slug: "test-drop",
    state: dropFixture.state,
    startsAtMs: Date.UTC(2026, 9, 9, 18),
    endsAtMs: Date.UTC(2026, 9, 11, 18),
    serverNowMs: Date.UTC(2026, 9, 2, 12),
    remaining: list.reduce((s, p) => s + p.remaining, 0),
    products: list,
    isPreview: false,
  };
}

export async function getProductView(slug: string): Promise<ProductPageView | null> {
  if (dropFixture.state === null) return null;
  const product = products().find((p) => p.slug === slug);
  return product ? { product, dropSlug: "test-drop", dropState: dropFixture.state } : null;
}

export async function listCatalogProductSlugs(): Promise<string[]> {
  return products().map((p) => p.slug).sort();
}
