import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { sql, anonClient, getVariantId, getStock } from "../helpers/db";

// The anon key ships to every browser. RLS + grants are the only wall between the internet and this
// database. Each assertion here is that wall holding.
describe("RLS — anon key is caught by the wall", () => {
  const anon = anonClient();
  let variantId: string;

  beforeAll(async () => {
    variantId = await getVariantId("test-tee-black", "M");
  });

  afterAll(async () => {
    await sql.end();
  });

  it("cannot read orders (PII)", async () => {
    const { data, error } = await anon.from("orders").select("*");
    expect(error !== null || (data?.length ?? 0) === 0).toBe(true);
  });

  it("cannot read order_items (PII)", async () => {
    const { data, error } = await anon.from("order_items").select("*");
    expect(error !== null || (data?.length ?? 0) === 0).toBe(true);
  });

  it("CAN read variants (the catalog must stay browsable)", async () => {
    const { data, error } = await anon.from("variants").select("*");
    expect(error).toBeNull();
    expect((data?.length ?? 0)).toBeGreaterThan(0);
  });

  it("cannot UPDATE variants stock (no anon write path exists)", async () => {
    const before = await getStock("test-tee-black", "M");
    const { error } = await anon.from("variants").update({ stock: 999 }).eq("id", variantId);
    expect(error).not.toBeNull();
    // And prove it: the value did not move.
    expect(await getStock("test-tee-black", "M")).toBe(before);
  });

  it("cannot call create_order (execute revoked from anon)", async () => {
    const { error } = await anon.rpc("create_order", {
      p_drop_slug: "test-open-drop",
      p_customer_name: "x",
      p_phone: "070000000",
      p_phone_normalized: "+38970000000",
      p_address: "x",
      p_city: "x",
      p_items: [{ variant_id: variantId, quantity: 1 }],
    });
    expect(error).not.toBeNull();
  });
});
