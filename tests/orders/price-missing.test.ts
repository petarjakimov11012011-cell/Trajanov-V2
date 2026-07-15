import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { sql, serviceClient, getVariantId, getStock } from "../helpers/db";

// create_order() rejects a priceless product with TR006 BEFORE any decrement (D-1.04-6). We build the
// null-priced OPEN drop directly (the sync would refuse to publish it — that is the point of TR006: the
// last-ditch guard for a state the sync tries to make impossible).
const DROP = "test-tr006-drop";
const PRODUCT = "test-tr006-p1";

beforeAll(async () => {
  await cleanup();
  await sql`insert into drops (slug, starts_at, ends_at)
    values (${DROP}, now() - interval '1 day', now() + interval '7 days')`;
  await sql`insert into products (drop_id, slug, name_mk, name_en, price_mkd, sort_order)
    values ((select id from drops where slug = ${DROP}), ${PRODUCT}, null, null, null, 1)`;
  await sql`insert into variants (product_id, size, stock)
    values ((select id from products where slug = ${PRODUCT}), 'M', 5)`;
});
afterAll(cleanup);

async function cleanup(): Promise<void> {
  const rows = await sql<{ id: string }[]>`select id from drops where slug = ${DROP}`;
  const id = rows[0]?.id;
  if (!id) return;
  await sql`delete from order_items where variant_id in (
    select v.id from variants v join products p on p.id = v.product_id where p.drop_id = ${id})`;
  await sql`delete from orders where drop_id = ${id}`;
  await sql`delete from variants where product_id in (select id from products where drop_id = ${id})`;
  await sql`delete from products where drop_id = ${id}`;
  await sql`delete from drops where id = ${id}`;
}

describe("create_order() price guard (TR006)", () => {
  it("rejects a null-priced variant with TR006 and does NOT decrement stock", async () => {
    const variantId = await getVariantId(PRODUCT, "M");
    const supabase = serviceClient();

    const { data, error } = await supabase.rpc("create_order", {
      p_drop_slug: DROP,
      p_customer_name: "Test Buyer",
      p_phone: "078820520",
      p_phone_normalized: "+38978820520",
      p_address: "Some street 1",
      p_city: "Strumica",
      p_items: [{ variant_id: variantId, quantity: 1 }],
    });

    expect(error?.code).toBe("TR006");
    expect(data).toBeNull();
    // The guard runs BEFORE any decrement — stock is untouched.
    expect(await getStock(PRODUCT, "M")).toBe(5);
  });
});
