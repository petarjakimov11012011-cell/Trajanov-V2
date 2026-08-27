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

  // NEW in Y.06, because removing the 2-unit cap opened a hole the old rule was hiding. Until Y.06 no
  // single order could ask for more than 2 units, so "5 orders each wanting the WHOLE drop" was not a
  // reachable state. It is now (D-Y.06-3). The whole-order decrement must still be all-or-nothing:
  // exactly one caller may win, and the four losers must leave nothing behind — not a stranded order
  // row, not a half-decremented variant, not an orphan order_items line.
  it("5 simultaneous 3-unit orders against one 3-unit variant → exactly 1 succeeds, 4 × TR004, stock 0, no partial rows", async () => {
    const N = 5;
    const QTY = 3; // the ENTIRE stock of the variant, in one order — impossible before Y.06

    const attempts = Array.from({ length: N }, (_, i) => {
      // DISTINCT phone per attempt, as above: a shared phone would make TR005 reject four of these and
      // the test would pass for the wrong reason.
      const phone = "+3898" + String(i).padStart(7, "0");
      return svc.rpc("create_order", {
        p_drop_slug: "test-open-drop",
        p_customer_name: `Цел дроп ${i}`,
        p_phone: phone,
        p_phone_normalized: phone,
        p_address: `Адреса ${i}`,
        p_city: "Струмица",
        p_items: [{ variant_id: variantId, quantity: QTY }],
      });
    });

    const results = await Promise.all(attempts);

    const succeeded = results.filter((r) => r.error === null);
    const failed = results.filter((r) => r.error !== null);

    expect(succeeded.length).toBe(1);
    expect(failed.length).toBe(N - 1);

    // Every loser must fail for insufficient stock specifically — not TR003 (the cap is gone), not a
    // deadlock 500, not a raw 23514 from the order_items quantity CHECK (D-Y.06-5).
    for (const r of failed) {
      expect(r.error?.code).toBe(ORDER_ERROR_CODES.INSUFFICIENT_STOCK);
    }

    expect(await getStock("test-tee-black", "M")).toBe(0);
    // Exactly one order, holding exactly one 3-unit line. Four rolled-back attempts left nothing.
    expect(await countOrders()).toBe(1);
    expect(await sumOrderItemQty()).toBe(QTY);
    const rows = await sql<{ n: number; q: number }[]>`
      select count(*)::int as n, coalesce(max(quantity), 0)::int as q from order_items`;
    expect(rows[0].n).toBe(1);
    expect(rows[0].q).toBe(QTY);
    // No order_items row may exist without its order (the FK + rollback guarantee it; assert it anyway).
    const orphans = await sql<{ n: number }[]>`
      select count(*)::int as n from order_items oi
      left join orders o on o.id = oi.order_id where o.id is null`;
    expect(orphans[0].n).toBe(0);
  });
});
