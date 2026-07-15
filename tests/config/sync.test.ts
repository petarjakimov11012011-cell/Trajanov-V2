import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { sql } from "../helpers/db";
import { syncDrops, SyncRefusedError } from "../../scripts/sync-core";
import type { DropConfig } from "../../src/config/schema";

// The config→DB sync guarantees (Task 3). Fixed "now" so wall-clock windows are deterministic.
const NOW = new Date("2026-07-15T12:00:00Z");

const SLUGS = ["test-sync-noreset", "test-sync-idem", "test-sync-nullprice", "test-sync-pricelock"];

async function deleteDrop(slug: string): Promise<void> {
  const rows = await sql<{ id: string }[]>`select id from drops where slug = ${slug}`;
  const id = rows[0]?.id;
  if (!id) return;
  await sql`delete from order_items where variant_id in (
    select v.id from variants v join products p on p.id = v.product_id where p.drop_id = ${id})`;
  await sql`delete from variants where product_id in (select id from products where drop_id = ${id})`;
  await sql`delete from products where drop_id = ${id}`;
  await sql`delete from drops where id = ${id}`;
}

async function stockOf(productSlug: string, size: string): Promise<number> {
  const rows = await sql<{ stock: number }[]>`
    select v.stock from variants v join products p on p.id = v.product_id
    where p.slug = ${productSlug} and v.size = ${size}`;
  return rows[0].stock;
}

beforeEach(async () => {
  for (const s of SLUGS) await deleteDrop(s);
});
afterAll(async () => {
  for (const s of SLUGS) await deleteDrop(s);
});

describe("config→DB sync", () => {
  it("NEVER resets stock on an existing variant — the test that saves the drop (D-1.04-5)", async () => {
    // An open, priced drop so it can actually be sold from.
    const drop: DropConfig = {
      slug: "test-sync-noreset",
      startsAt: "2026-07-01T20:00", // past → started
      endsAt: "2026-12-31T20:00", // future → open
      products: [
        {
          slug: "test-sync-noreset-p1",
          nameMk: null,
          nameEn: null,
          priceMkd: 500,
          sizes: [{ size: "M", stock: 10 }],
        },
      ],
    };

    await syncDrops(sql, [drop], { now: NOW });
    expect(await stockOf("test-sync-noreset-p1", "M")).toBe(10);

    // Simulate 7 units sold (the DB now owns stock).
    await sql`update variants set stock = 3
      where size = 'M' and product_id = (select id from products where slug = 'test-sync-noreset-p1')`;

    // Re-run the sync with the SAME config (stock: 10). It must NOT reset the sold-down stock.
    await syncDrops(sql, [drop], { now: NOW });
    expect(await stockOf("test-sync-noreset-p1", "M")).toBe(3);
  });

  it("is idempotent — a second run inserts nothing", async () => {
    const drop: DropConfig = {
      slug: "test-sync-idem",
      startsAt: "2026-05-01T20:00",
      endsAt: "2026-05-03T20:00", // ended (past) → null price allowed
      products: [
        {
          slug: "test-sync-idem-p1",
          nameMk: null,
          nameEn: null,
          priceMkd: null,
          sizes: [
            { size: "S", stock: 4 },
            { size: "M", stock: 4 },
          ],
        },
      ],
    };

    const first = await syncDrops(sql, [drop], { now: NOW });
    expect(first.productsInserted).toBe(1);
    expect(first.variantsInserted).toBe(2);

    const second = await syncDrops(sql, [drop], { now: NOW });
    expect(second.productsInserted).toBe(0);
    expect(second.variantsInserted).toBe(0);
    expect(second.variantsUntouched).toBe(2); // stock deliberately not rewritten
    expect(second.rowsDeleted).toBe(0);
  });

  it("REFUSES to publish an open/future drop with a null price, naming the product (D-1.04-6)", async () => {
    const drop: DropConfig = {
      slug: "test-sync-nullprice",
      startsAt: "2026-12-01T20:00", // future
      endsAt: "2026-12-02T20:00",
      products: [
        {
          slug: "test-sync-nullprice-p1",
          nameMk: null,
          nameEn: null,
          priceMkd: null, // the offence
          sizes: [{ size: "M", stock: 5 }],
        },
      ],
    };

    await expect(syncDrops(sql, [drop], { now: NOW })).rejects.toThrowError(SyncRefusedError);
    // And it names the offending product, and writes nothing.
    try {
      await syncDrops(sql, [drop], { now: NOW });
    } catch (e) {
      expect((e as SyncRefusedError).reasons.join(" ")).toContain("test-sync-nullprice-p1");
    }
    const rows = await sql`select 1 from drops where slug = 'test-sync-nullprice'`;
    expect(rows.length).toBe(0);
  });

  it("REFUSES to change a price after the drop's window has started (D-1.04-5 spirit)", async () => {
    const base: DropConfig = {
      slug: "test-sync-pricelock",
      startsAt: "2026-07-01T20:00", // already started at NOW
      endsAt: "2026-12-31T20:00",
      products: [
        {
          slug: "test-sync-pricelock-p1",
          nameMk: null,
          nameEn: null,
          priceMkd: 500,
          sizes: [{ size: "M", stock: 5 }],
        },
      ],
    };
    await syncDrops(sql, [base], { now: NOW });

    const changed: DropConfig = {
      ...base,
      products: [{ ...base.products[0], priceMkd: 999 }],
    };
    await expect(syncDrops(sql, [changed], { now: NOW })).rejects.toThrowError(SyncRefusedError);
    // Price in the DB is unchanged.
    const rows = await sql<{ price_mkd: number }[]>`
      select price_mkd from products where slug = 'test-sync-pricelock-p1'`;
    expect(rows[0].price_mkd).toBe(500);
  });
});
