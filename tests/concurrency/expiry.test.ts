import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { sql, serviceClient, getVariantId, setStock, getStock, clearOrders } from "../helpers/db";

// expire_reservations() must return stock EXACTLY once per expired order — including when two sweeps
// run at the same time. Double-returning stock is as damaging as overselling: it invents inventory.
describe("expire_reservations — stock returns exactly once", () => {
  const svc = serviceClient();
  let variantId: string;

  beforeAll(async () => {
    variantId = await getVariantId("test-tee-black", "M");
  });

  beforeEach(async () => {
    await clearOrders();
    await setStock("test-tee-black", "M", 5);
  });

  afterAll(async () => {
    await sql.end();
  });

  async function createOrderWithElapsedHold(phone: string, qty: number): Promise<string> {
    const { data, error } = await svc.rpc("create_order", {
      p_drop_slug: "test-open-drop",
      p_customer_name: "Истечен",
      p_phone: phone,
      p_phone_normalized: phone,
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: [{ variant_id: variantId, quantity: qty }],
    });
    if (error) throw new Error(`setup create_order failed: ${error.message}`);
    const orderId = data![0].order_id;
    // Simulate time passing: backdate the hold into the past (realistic; the sweep keys off now()).
    await sql`update orders set reserved_until = now() - interval '1 hour' where id = ${orderId}`;
    return orderId;
  }

  it("expires an elapsed order, returns its stock exactly once, and a second sweep is a no-op", async () => {
    const orderId = await createOrderWithElapsedHold("+38971000001", 2);
    expect(await getStock("test-tee-black", "M")).toBe(3); // 5 - 2 held

    const first = await svc.rpc("expire_reservations");
    expect(first.error).toBeNull();
    expect(first.data).toBe(1); // one order expired

    const [{ status }] = await sql<{ status: string }[]>`select status from orders where id = ${orderId}`;
    expect(status).toBe("expired");
    expect(await getStock("test-tee-black", "M")).toBe(5); // stock returned once

    // Running it again must NOT return the stock a second time.
    const second = await svc.rpc("expire_reservations");
    expect(second.data).toBe(0);
    expect(await getStock("test-tee-black", "M")).toBe(5);
  });

  it("two concurrent sweeps do not double-return stock", async () => {
    await createOrderWithElapsedHold("+38971000002", 2);
    expect(await getStock("test-tee-black", "M")).toBe(3);

    const [a, b] = await Promise.all([svc.rpc("expire_reservations"), svc.rpc("expire_reservations")]);
    expect(a.error).toBeNull();
    expect(b.error).toBeNull();

    // Exactly one order was expired in total across the two racing calls…
    expect((a.data ?? 0) + (b.data ?? 0)).toBe(1);
    // …and its 2 units were returned exactly once, not twice.
    expect(await getStock("test-tee-black", "M")).toBe(5);
  });
});
