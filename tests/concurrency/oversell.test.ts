import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import {
  sql,
  serviceClient,
  getVariantId,
  setStock,
  getStock,
  clearOrders,
  countOrders,
  sumOrderItemQty,
} from "../helpers/db";
import { ORDER_ERROR_CODES } from "../../src/lib/orders/order-errors";

// THE test this whole phase exists for (D-0-3): one person cannot click twice at once, so this is the
// only place the oversell bug can be caught. 10 orders, 3 units, exactly 3 win.
describe("create_order — concurrent oversell protection", () => {
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

  it("10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0", async () => {
    const N = 10;

    const attempts = Array.from({ length: N }, (_, i) => {
      // DISTINCT phone per attempt. If they shared a phone, the one-live-order-per-phone index
      // (D-1.03-4) would reject 9 of them and this test would pass for the WRONG reason.
      const phone = "+3897" + String(i).padStart(7, "0");
      return svc.rpc("create_order", {
        p_drop_slug: "test-open-drop",
        p_customer_name: `Купувач ${i}`,
        p_phone: phone,
        p_phone_normalized: phone,
        p_address: `Адреса ${i}`,
        p_city: "Струмица",
        p_items: [{ variant_id: variantId, quantity: 1 }],
      });
    });

    const results = await Promise.all(attempts);

    const succeeded = results.filter((r) => r.error === null);
    const failed = results.filter((r) => r.error !== null);

    // Distinct phones actually used (guards the "wrong reason" trap above).
    const distinctPhones = new Set(Array.from({ length: N }, (_, i) => "+3897" + String(i).padStart(7, "0")));
    expect(distinctPhones.size).toBe(N);

    expect(succeeded.length).toBe(3);
    expect(failed.length).toBe(7);

    // EVERY one of the 7 must fail specifically for insufficient stock — not a deadlock 500, not a
    // duplicate-phone rejection, not anything else.
    for (const r of failed) {
      expect(r.error?.code).toBe(ORDER_ERROR_CODES.INSUFFICIENT_STOCK);
    }

    expect(await getStock("test-tee-black", "M")).toBe(0);
    expect(await countOrders()).toBe(3);
    expect(await sumOrderItemQty()).toBe(3);
  });
});
