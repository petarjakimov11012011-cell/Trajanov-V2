import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { sql, serviceClient, getVariantId, setStock, getStock, clearOrders } from "../helpers/db";
import { ORDER_ERROR_CODES } from "../../src/lib/orders/order-errors";

// The happy path, the drop-window guard (D-1.03-7), and the full raised-error vocabulary. Every error
// is switched on by its `code`, never its message.
describe("create_order — happy path, drop window, and error vocabulary", () => {
  const svc = serviceClient();
  let variantId: string;

  beforeAll(async () => {
    variantId = await getVariantId("test-tee-black", "M");
  });

  beforeEach(async () => {
    await clearOrders();
    await setStock("test-tee-black", "M", 3);
  });

  afterAll(async () => {
    await sql.end();
  });

  it("creates an order: returns TRJ-#### + snapshotted total, decrements stock", async () => {
    const { data, error } = await svc.rpc("create_order", {
      p_drop_slug: "test-open-drop",
      p_customer_name: "Марко",
      p_phone: "070123123",
      p_phone_normalized: "+38970123123",
      p_address: "Адреса 5",
      p_city: "Струмица",
      p_items: [{ variant_id: variantId, quantity: 1 }],
    });
    expect(error).toBeNull();
    expect(data![0].order_number).toMatch(/^TRJ-\d{4}$/);
    expect(data![0].total_mkd).toBe(999); // seed price for test-tee-black
    expect(await getStock("test-tee-black", "M")).toBe(2);
  });

  it("rejects an order before starts_at with drop_not_open (D-1.03-7)", async () => {
    const upcomingVariant = await getVariantId("test-tee-upcoming", "M");
    const { error } = await svc.rpc("create_order", {
      p_drop_slug: "test-upcoming-drop",
      p_customer_name: "Рано",
      p_phone: "070222333",
      p_phone_normalized: "+38970222333",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: [{ variant_id: upcomingVariant, quantity: 1 }],
    });
    expect(error?.code).toBe(ORDER_ERROR_CODES.DROP_NOT_OPEN);
  });

  it("rejects an unknown drop with drop_not_found", async () => {
    const { error } = await svc.rpc("create_order", {
      p_drop_slug: "no-such-drop",
      p_customer_name: "x",
      p_phone: "070000000",
      p_phone_normalized: "+38970000000",
      p_address: "x",
      p_city: "x",
      p_items: [{ variant_id: variantId, quantity: 1 }],
    });
    expect(error?.code).toBe(ORDER_ERROR_CODES.DROP_NOT_FOUND);
  });

  it("rejects more than 2 total units with quantity_cap_violated", async () => {
    const { error } = await svc.rpc("create_order", {
      p_drop_slug: "test-open-drop",
      p_customer_name: "Алчен",
      p_phone: "070444555",
      p_phone_normalized: "+38970444555",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: [{ variant_id: variantId, quantity: 2 }, { variant_id: await getVariantId("test-tee-black", "L"), quantity: 1 }],
    });
    expect(error?.code).toBe(ORDER_ERROR_CODES.QUANTITY_CAP_VIOLATED);
  });

  it("rejects a second live order from the same phone with duplicate_phone, and keeps stock intact", async () => {
    const args = {
      p_drop_slug: "test-open-drop",
      p_customer_name: "Двоен",
      p_phone: "070777888",
      p_phone_normalized: "+38970777888",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: [{ variant_id: variantId, quantity: 1 }],
    };
    const first = await svc.rpc("create_order", args);
    expect(first.error).toBeNull();
    expect(await getStock("test-tee-black", "M")).toBe(2);

    const second = await svc.rpc("create_order", args);
    expect(second.error?.code).toBe(ORDER_ERROR_CODES.DUPLICATE_PHONE);
    // The rejected duplicate must NOT have consumed a unit — the whole transaction rolled back.
    expect(await getStock("test-tee-black", "M")).toBe(2);
  });
});
