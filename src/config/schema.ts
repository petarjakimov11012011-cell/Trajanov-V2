// Typed drop + product config (D-0-4: config lives in the repo, no CMS). This is the switch Lazar
// flips: `drops.ts` is the schedule, `products.ts` is the catalogue, and `index.ts` joins them. The
// config→DB sync (`npm run sync:drop`) reads these and writes Supabase.
//
// The types are strict on purpose (Task 1): a malformed drop should be caught by the compiler, not a
// reviewer. Anything the types cannot express (wall-clock format, positive prices, unique slugs) is
// caught at runtime by `validateConfig()` below, which the sync runs before it writes anything.

import { isWallClock, resolveWallClockToUtc } from "./time";

/** Default order-attempt cap per IP-hash per 10-min window (D-1.04-7). Editable per drop in the DB. */
export const DEFAULT_RATE_LIMIT_PER_WINDOW = 20;

/**
 * Display heuristic only: at or below this many units remaining, a product shows the "low stock" badge
 * (handover §3/§4). NOT a stock authority — create_order() is the only authority — and safe to tune.
 */
export const LOW_STOCK_THRESHOLD = 5;

/** A buyable size and its STARTING stock. The sync writes stock on INSERT only, never on update (D-1.04-5). */
export interface VariantConfig {
  /** e.g. "S" | "M" | "L" | "XL". Unique within a product. */
  readonly size: string;
  /** Starting units for this size. Non-negative integer. Seeded once; the DB owns it thereafter. */
  readonly stock: number;
}

export interface ProductConfig {
  /** Stable, URL-safe, globally unique (products.slug is unique in the DB). */
  readonly slug: string;
  /** Macedonian name, or null when not yet supplied (facts.md §7). null → UI renders a neutral slot. */
  readonly nameMk: string | null;
  /** English name, or null when not yet supplied. */
  readonly nameEn: string | null;
  /** Whole MKD, or null when no real price exists yet (D-1.04-6). A null price can never be published
   *  on an open/future drop (sync preflight) nor ordered (create_order TR006). Positive when set. */
  readonly priceMkd: number | null;
  /** Forward-looking (photos land in 1.06). No DB column yet, so the sync does not persist this. */
  readonly photoPath?: string | null;
  /** Forward-looking fabric/care copy (from the label, OWED by Vladimir — facts.md §7). Not yet persisted. */
  readonly careMk?: string | null;
  readonly careEn?: string | null;
  /** At least one size. */
  readonly sizes: readonly VariantConfig[];
}

/** The schedule half of a drop (drops.ts) — times + the rate-limit knob. */
export interface DropSchedule {
  /** Stable, URL-safe, unique. `test-`-prefixed slugs mark non-real rehearsal drops. */
  readonly slug: string;
  /** Naive Europe/Skopje wall-clock, no offset: "YYYY-MM-DDTHH:mm" (D-1.04-4). */
  readonly startsAt: string;
  /** Naive Europe/Skopje wall-clock, or null for an open-ended drop. Must be after startsAt. */
  readonly endsAt: string | null;
  /** Per-drop order-attempt cap (D-1.04-7). Defaults to DEFAULT_RATE_LIMIT_PER_WINDOW when omitted. */
  readonly rateLimitPerWindow?: number;
}

/** A full drop: schedule + its products (assembled by index.ts). */
export interface DropConfig extends DropSchedule {
  readonly products: readonly ProductConfig[];
}

// ── Validation (runtime; the sync refuses to write if this returns anything) ─────────────────────

function isPositiveInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n > 0;
}
function isNonNegativeInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 0;
}

/**
 * Structural validation of the whole config. Returns a list of human-readable problems (empty = OK).
 * Covers what the types cannot: wall-clock format, price/stock ranges, and uniqueness of slugs/sizes.
 */
export function validateConfig(drops: readonly DropConfig[]): string[] {
  const errors: string[] = [];
  const dropSlugs = new Set<string>();
  const productSlugs = new Set<string>();

  for (const drop of drops) {
    const where = `drop "${drop.slug}"`;
    if (dropSlugs.has(drop.slug)) errors.push(`Duplicate drop slug: "${drop.slug}".`);
    dropSlugs.add(drop.slug);

    if (!isWallClock(drop.startsAt)) {
      errors.push(`${where}: startsAt "${drop.startsAt}" is not "YYYY-MM-DDTHH:mm".`);
    }
    if (drop.endsAt !== null && !isWallClock(drop.endsAt)) {
      errors.push(`${where}: endsAt "${drop.endsAt}" is not "YYYY-MM-DDTHH:mm" (or null).`);
    }
    if (drop.endsAt !== null && isWallClock(drop.startsAt) && isWallClock(drop.endsAt)) {
      if (resolveWallClockToUtc(drop.endsAt) <= resolveWallClockToUtc(drop.startsAt)) {
        errors.push(`${where}: endsAt must be after startsAt.`);
      }
    }
    if (drop.rateLimitPerWindow !== undefined && !isPositiveInt(drop.rateLimitPerWindow)) {
      errors.push(`${where}: rateLimitPerWindow must be a positive integer.`);
    }
    if (drop.products.length === 0) errors.push(`${where}: has no products.`);

    for (const p of drop.products) {
      const pw = `${where}, product "${p.slug}"`;
      if (productSlugs.has(p.slug)) errors.push(`Duplicate product slug: "${p.slug}".`);
      productSlugs.add(p.slug);

      if (p.priceMkd !== null && !isPositiveInt(p.priceMkd)) {
        errors.push(`${pw}: priceMkd must be a positive integer or null.`);
      }
      if (p.sizes.length === 0) errors.push(`${pw}: has no sizes.`);

      const sizeLabels = new Set<string>();
      for (const s of p.sizes) {
        if (sizeLabels.has(s.size)) errors.push(`${pw}: duplicate size "${s.size}".`);
        sizeLabels.add(s.size);
        if (!isNonNegativeInt(s.stock)) {
          errors.push(`${pw}, size "${s.size}": stock must be a non-negative integer.`);
        }
      }
    }
  }
  return errors;
}

/** Product slugs in this drop that still have a null price (used by the sync preflight — D-1.04-6). */
export function nullPricedProducts(drop: DropConfig): string[] {
  return drop.products.filter((p) => p.priceMkd === null).map((p) => p.slug);
}

/**
 * True when the drop's window has already CLOSED (ends set and in the past). An ended drop may carry
 * null prices — nobody can order it — so the sync's price preflight does not apply to it (D-1.04-6).
 */
export function isDropEnded(drop: DropSchedule, now: Date = new Date()): boolean {
  return drop.endsAt !== null && resolveWallClockToUtc(drop.endsAt) < now;
}
