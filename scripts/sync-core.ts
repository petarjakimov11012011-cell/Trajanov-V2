// Config → DB sync, the testable core (Task 3). `sync-drop.ts` is the CLI wrapper around this.
//
// WHY A DIRECT POSTGRES CONNECTION, NOT THE SERVICE-ROLE CLIENT (D-1.04-10): the brief says "writes via
// the service-role client", but 1.03's D-1.03-9 made service_role SELECT-only on every table, with all
// writes going through SECURITY DEFINER functions — precisely so the privileged runtime role can never
// write stock directly. Granting service_role catalogue writes to satisfy the brief would re-open that
// door (a service_role UPDATE path on variants.stock). The sync is not runtime code: it is an
// operator-run, migration-time tool, exactly like the test suites (D-1.03-12), so it uses the same
// direct admin connection. Portable — hosted Supabase hands out a direct Postgres URL too (1.07).
//
// The load-bearing safety rule (D-1.04-5): STOCK IS WRITTEN ON INSERT ONLY. A re-sync during a live
// drop must never reset sold stock to its starting number — that is a silent oversell, worse than the
// one 1.03's gate catches. There is no flag to override it.

import type { Sql } from "postgres";
import {
  type DropConfig,
  validateConfig,
  nullPricedProducts,
  isDropEnded,
  resolveWallClockToUtc,
  DEFAULT_RATE_LIMIT_PER_WINDOW,
} from "../src/config/index";

/** Thrown when the sync deliberately refuses to write (bad config, priceless publish, price-after-open). */
export class SyncRefusedError extends Error {
  readonly reasons: string[];
  constructor(reasons: string[]) {
    super(`Sync refused:\n  - ${reasons.join("\n  - ")}`);
    this.name = "SyncRefusedError";
    this.reasons = reasons;
  }
}

export interface SyncReport {
  dropsUpserted: number;
  productsInserted: number;
  productsUpdated: number;
  variantsInserted: number;
  variantsUntouched: number; // existing variants — stock deliberately not written (D-1.04-5)
  rowsDeleted: number;
  deletionsSkippedWithOrders: string[]; // rows kept because they have order_items against them
}

interface ProductRow {
  id: string;
  price_mkd: number | null;
}

/**
 * Sync the given drops into the database. Idempotent: a second run with the same config changes nothing.
 * Throws SyncRefusedError (writing nothing) if the config is invalid, if an open/future drop still has a
 * null price, or if a started drop's price would change. `opts.now` is injectable for tests.
 */
export async function syncDrops(
  sql: Sql,
  drops: readonly DropConfig[],
  opts: { now?: Date } = {},
): Promise<SyncReport> {
  const now = opts.now ?? new Date();

  // ── Preflight 1: structural validity (types can't catch wall-clock format, ranges, uniqueness). ──
  const structural = validateConfig(drops);
  if (structural.length > 0) throw new SyncRefusedError(structural);

  const refusals: string[] = [];

  // ── Preflight 2: no priceless product on a drop that is open or in the future (D-1.04-6). ────────
  for (const drop of drops) {
    if (isDropEnded(drop, now)) continue; // an ended drop can never be ordered — a null price is moot.
    const priceless = nullPricedProducts(drop);
    if (priceless.length > 0) {
      refusals.push(
        `drop "${drop.slug}" is open or in the future but these products have no price: ${priceless.join(", ")}. ` +
          `Set a real MKD price in products.ts before publishing, or date the drop in the past.`,
      );
    }
  }

  // ── Preflight 3: never change a price after a drop's window has started (D-1.04-5 spirit). ────────
  // Read existing prices for products whose drop has already started; a differing config price is refused.
  for (const drop of drops) {
    const started = resolveWallClockToUtc(drop.startsAt) <= now;
    if (!started) continue;
    for (const p of drop.products) {
      const existing = await sql<ProductRow[]>`
        select id, price_mkd from products where slug = ${p.slug}`;
      if (existing.length === 0) continue; // brand-new product; insert sets the price, nothing to change.
      if (existing[0].price_mkd !== p.priceMkd) {
        refusals.push(
          `product "${p.slug}" belongs to a drop ("${drop.slug}") whose window has already started; ` +
            `its price cannot be changed by a sync (DB=${existing[0].price_mkd}, config=${p.priceMkd}). ` +
            `Change a live price deliberately in the dashboard.`,
        );
      }
    }
  }

  if (refusals.length > 0) throw new SyncRefusedError(refusals);

  // ── Write. One transaction: either the whole config lands or none of it does. ────────────────────
  const report: SyncReport = {
    dropsUpserted: 0,
    productsInserted: 0,
    productsUpdated: 0,
    variantsInserted: 0,
    variantsUntouched: 0,
    rowsDeleted: 0,
    deletionsSkippedWithOrders: [],
  };

  await sql.begin(async (tx) => {
    for (const drop of drops) {
      const startsAt = resolveWallClockToUtc(drop.startsAt);
      const endsAt = drop.endsAt === null ? null : resolveWallClockToUtc(drop.endsAt);
      const rateLimit = drop.rateLimitPerWindow ?? DEFAULT_RATE_LIMIT_PER_WINDOW;
      const started = startsAt <= now;

      const [{ id: dropId }] = await tx<{ id: string }[]>`
        insert into drops (slug, starts_at, ends_at, rate_limit_per_window)
        values (${drop.slug}, ${startsAt}, ${endsAt}, ${rateLimit})
        on conflict (slug) do update
          set starts_at = excluded.starts_at,
              ends_at = excluded.ends_at,
              rate_limit_per_window = excluded.rate_limit_per_window
        returning id`;
      report.dropsUpserted += 1;

      const keepProductSlugs: string[] = [];
      for (let i = 0; i < drop.products.length; i++) {
        const p = drop.products[i];
        keepProductSlugs.push(p.slug);
        const sortOrder = i + 1;

        const existing = await tx<ProductRow[]>`
          select id, price_mkd from products where slug = ${p.slug}`;

        let productId: string;
        if (existing.length === 0) {
          const [row] = await tx<{ id: string }[]>`
            insert into products (drop_id, slug, name_mk, name_en, price_mkd, sort_order)
            values (${dropId}, ${p.slug}, ${p.nameMk}, ${p.nameEn}, ${p.priceMkd}, ${sortOrder})
            returning id`;
          productId = row.id;
          report.productsInserted += 1;
        } else {
          productId = existing[0].id;
          // Update everything except price when the drop has started (preflight guaranteed no change).
          // When not started, the price is free to move. Stock is NOT a product column — it never appears.
          await tx`
            update products
              set drop_id = ${dropId},
                  name_mk = ${p.nameMk},
                  name_en = ${p.nameEn},
                  sort_order = ${sortOrder},
                  price_mkd = ${started ? existing[0].price_mkd : p.priceMkd}
              where id = ${productId}`;
          report.productsUpdated += 1;
        }

        // ── Variants: INSERT sets stock; an existing variant is left completely untouched (D-1.04-5). ──
        const keepSizes: string[] = [];
        for (const v of p.sizes) {
          keepSizes.push(v.size);
          const existingV = await tx<{ id: string }[]>`
            select id from variants where product_id = ${productId} and size = ${v.size}`;
          if (existingV.length === 0) {
            await tx`
              insert into variants (product_id, size, stock)
              values (${productId}, ${v.size}, ${v.stock})`;
            report.variantsInserted += 1;
          } else {
            // Deliberately no UPDATE: stock is owned by the DB from here on. Nothing else to write.
            report.variantsUntouched += 1;
          }
        }

        // Remove variants dropped from config — but never one with orders against it.
        await deleteOrphans(
          report,
          "variant",
          await tx<{ id: string; size: string }[]>`
            select id, size from variants
            where product_id = ${productId} and size <> all(${keepSizes})`,
          (r) => `${p.slug}/${r.size}`,
          (id) => tx`select 1 from order_items where variant_id = ${id} limit 1`,
          (id) => tx`delete from variants where id = ${id}`,
        );
      }

      // Remove products dropped from config — but never one whose variants have orders against them.
      await deleteOrphans(
        report,
        "product",
        await tx<{ id: string; slug: string }[]>`
          select id, slug from products
          where drop_id = ${dropId} and slug <> all(${keepProductSlugs})`,
        (r) => r.slug,
        (id) => tx`
          select 1 from order_items oi join variants v on v.id = oi.variant_id
          where v.product_id = ${id} limit 1`,
        async (id) => {
          await tx`delete from variants where product_id = ${id}`;
          await tx`delete from products where id = ${id}`;
        },
      );
    }
  });

  return report;
}

/** Delete config-removed rows, skipping (and recording) any that have order_items behind them. */
async function deleteOrphans<T extends { id: string }>(
  report: SyncReport,
  kind: "product" | "variant",
  orphans: T[],
  label: (row: T) => string,
  hasOrders: (id: string) => PromiseLike<ArrayLike<unknown>>,
  del: (id: string) => PromiseLike<unknown>,
): Promise<void> {
  for (const row of orphans) {
    const orders = await hasOrders(row.id);
    if (orders.length > 0) {
      report.deletionsSkippedWithOrders.push(`${kind} ${label(row)}`);
      continue; // A config deletion never deletes a row that has order_items against it (D-1.04-5).
    }
    await del(row.id);
    report.rowsDeleted += 1;
  }
}
