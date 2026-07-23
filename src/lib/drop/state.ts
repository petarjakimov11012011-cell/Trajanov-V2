import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { LOW_STOCK_THRESHOLD } from "@/config/schema";
import { compareSizeLabels } from "@/lib/drop/size-order";
import type { DropState, StockLevel, ProductView, SizeOption } from "@/types/drop";

// SERVER-ONLY drop-state (Task 4, D-1.04-9). Drop state (countdown / live / ended) and stock are
// computed HERE, on the server, from the database — never trusted from the browser. `import "server-only"`
// makes importing this module from a client component a build error (proven the way 1.03 proved
// server.ts). Stock *display* may be up to ~60s stale; create_order() remains the only authority.

/** The full server-computed view a drop-state page renders. Times are epoch ms for the client clock. */
export interface DropView {
  slug: string;
  state: DropState;
  /** Countdown target — the drop's start, epoch ms. */
  startsAtMs: number;
  endsAtMs: number | null;
  /** The server's authoritative "now", epoch ms. The client anchors its countdown to this so a wrong
   *  device clock cannot skew it (Task 4). */
  serverNowMs: number;
  /** Total units remaining across the whole drop (the LIVE banner count). */
  remaining: number;
  products: ProductView[];
  /** True when `state` was forced by the dev-only ?preview override (never true in production). */
  isPreview: boolean;
}

interface RawVariant {
  id: string;
  size: string;
  stock: number;
}
interface RawProduct {
  slug: string;
  name_mk: string | null;
  name_en: string | null;
  price_mkd: number | null;
  sort_order: number;
  variants: RawVariant[];
}
interface RawDrop {
  slug: string;
  starts_at: string;
  ends_at: string | null;
  products: RawProduct[];
}

function totalStock(drop: RawDrop): number {
  return drop.products.reduce((sum, p) => sum + p.variants.reduce((s, v) => s + v.stock, 0), 0);
}

function windowOpen(drop: RawDrop, now: Date): boolean {
  const starts = new Date(drop.starts_at);
  const ends = drop.ends_at ? new Date(drop.ends_at) : null;
  return starts <= now && (ends === null || now <= ends);
}

/** live = window open AND stock remaining; ended = window closed OR all stock gone; else countdown. */
function computeState(drop: RawDrop, now: Date): DropState {
  const starts = new Date(drop.starts_at);
  const ends = drop.ends_at ? new Date(drop.ends_at) : null;
  const windowClosed = ends !== null && now > ends;
  if (windowClosed || totalStock(drop) === 0) {
    // Before the window even opens, "0 stock" should still read as a countdown, not "ended".
    return now < starts ? "countdown" : "ended";
  }
  if (windowOpen(drop, now)) return "live";
  return "countdown";
}

/** Which drop the site features: a live one wins, else the soonest upcoming, else the most recent. */
function pickActiveDrop(drops: RawDrop[], now: Date): RawDrop | null {
  if (drops.length === 0) return null;
  const live = drops
    .filter((d) => windowOpen(d, now) && totalStock(d) > 0)
    .sort((a, b) => +new Date(b.starts_at) - +new Date(a.starts_at));
  if (live[0]) return live[0];

  const upcoming = drops
    .filter((d) => new Date(d.starts_at) > now)
    .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));
  if (upcoming[0]) return upcoming[0];

  return drops
    .slice()
    .sort((a, b) => +new Date(b.starts_at) - +new Date(a.starts_at))[0];
}

function stockLevel(remaining: number): StockLevel {
  if (remaining <= 0) return "sold-out";
  if (remaining <= LOW_STOCK_THRESHOLD) return "low";
  return "in-stock";
}

function toProductView(p: RawProduct): ProductView {
  const remaining = p.variants.reduce((s, v) => s + v.stock, 0);
  // Sort into the canonical garment order (S · M · L · XL …), NOT alphabetically — Postgres does not
  // guarantee variant row order, so this explicit sort decides what the size row shows. `compareSizeLabels`
  // ranks by clothing size; the label kept is the DB's original string, unmodified (D-2.09-3).
  const sizes: SizeOption[] = p.variants
    .slice()
    .sort((a, b) => compareSizeLabels(a.size, b.size))
    .map((v) => ({ variantId: v.id, label: v.size, available: v.stock > 0 }));
  return {
    slug: p.slug,
    index: p.sort_order,
    nameMk: p.name_mk,
    nameEn: p.name_en,
    priceMkd: p.price_mkd,
    stock: stockLevel(remaining),
    remaining,
    sizes,
  };
}

const SELECT =
  "slug, starts_at, ends_at, products(slug, name_mk, name_en, price_mkd, sort_order, variants(id, size, stock))";

async function fetchDrops(): Promise<RawDrop[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("drops").select(SELECT);
  if (error) throw new Error(`Failed to read drops: ${error.message}`);
  return (data ?? []) as unknown as RawDrop[];
}

/** Only honoured outside production (double-gated: the page also refuses to pass it in prod). */
export function parsePreviewState(value: string | undefined): DropState | undefined {
  if (process.env.NODE_ENV === "production") return undefined;
  if (value === "countdown" || value === "live" || value === "ended") return value;
  return undefined;
}

/**
 * The active drop, server-computed, or null when there is no drop at all. `preview` (dev only) forces
 * the returned state so all three visual states are reviewable against one committed config.
 */
export async function getActiveDropView(
  opts: { preview?: DropState } = {},
): Promise<DropView | null> {
  const now = new Date();
  const drops = await fetchDrops();
  const drop = pickActiveDrop(drops, now);
  if (!drop) return null;

  const realState = computeState(drop, now);
  const state = opts.preview ?? realState;
  const products = drop.products
    .map(toProductView)
    .sort((a, b) => a.index - b.index);
  const remaining = products.reduce((s, p) => s + p.remaining, 0);

  // For a countdown PREVIEW against a past-dated rehearsal drop, synthesise a future target so the
  // clock actually ticks; real (non-preview) countdowns always use the true start.
  const startsAtMs =
    opts.preview === "countdown" && new Date(drop.starts_at) <= now
      ? now.getTime() + 2 * 24 * 60 * 60 * 1000
      : new Date(drop.starts_at).getTime();

  return {
    slug: drop.slug,
    state,
    startsAtMs,
    endsAtMs: drop.ends_at ? new Date(drop.ends_at).getTime() : null,
    serverNowMs: now.getTime(),
    remaining,
    products,
    isPreview: opts.preview !== undefined && opts.preview !== realState,
  };
}

/** A single product, the drop it belongs to, and that drop's state (for the product page). The slug
 *  is what a cart line records so the checkout can name the drop to create_order() (Phase 1.06). */
export interface ProductPageView {
  product: ProductView;
  dropSlug: string;
  dropState: DropState;
}

/** Every real product slug across all drops, for the sitemap (Task 1). Deduped and sorted so the
 *  output is stable. Read from the DB — the server product list, never a hand-typed slug. */
export async function listCatalogProductSlugs(): Promise<string[]> {
  const drops = await fetchDrops();
  const slugs = new Set<string>();
  for (const drop of drops) {
    for (const product of drop.products) slugs.add(product.slug);
  }
  return [...slugs].sort();
}

export async function getProductView(
  slug: string,
  opts: { preview?: DropState } = {},
): Promise<ProductPageView | null> {
  const now = new Date();
  const drops = await fetchDrops();
  for (const drop of drops) {
    const raw = drop.products.find((p) => p.slug === slug);
    if (raw) {
      return {
        product: toProductView(raw),
        dropSlug: drop.slug,
        dropState: opts.preview ?? computeState(drop, now),
      };
    }
  }
  return null;
}
