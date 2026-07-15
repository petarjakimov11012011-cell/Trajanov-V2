import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { sql, serviceClient, getVariantId, setStock, clearOrders, countOrders } from "../helpers/db";
import { ORDER_ERROR_CODES } from "../../src/lib/orders/order-errors";
import { emptyCart, addItem, toOrderItems, totalUnits } from "../../src/lib/cart/cart";

// THE test this phase (1.06) exists for — D-1.04-16 closed. The customer's chosen product + size must
// survive the cart → checkout → create_order path into the order_items row. Before this phase the
// checkout submitted a stand-in (the drop's FIRST in-stock variant), so a COD order could name a shirt
// the customer never picked and arrive as a cash demand for the wrong item.
//
// test-tee-two is the SECOND product in test-open-drop (sort_order 2). The deleted stand-in would have
// named test-tee-black (sort_order 1) here — so choosing test-tee-two is what makes this test fail
// against the stand-in and pass against the cart. (RED-vs-stand-in captured in the completion report.)

const DROP = "test-open-drop";

/** Map the cart's { variantId, quantity } to create_order's jsonb item shape — as the checkout does. */
function submitItems(items: { variantId: string; quantity: number }[]) {
  return items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity }));
}

/** The order_items actually written, resolved to product slug + size (there is one order per test). */
function writtenOrderItems(): Promise<{ slug: string; size: string; quantity: number }[]> {
  return sql`
    select p.slug, v.size, oi.quantity
    from order_items oi
    join variants v on v.id = oi.variant_id
    join products p on p.id = v.product_id
    order by p.sort_order, v.size` as unknown as Promise<
    { slug: string; size: string; quantity: number }[]
  >;
}

describe("cart → create_order — the customer's choice reaches order_items", () => {
  const svc = serviceClient();
  let twoL: string, twoM: string, blackM: string;

  beforeAll(async () => {
    twoL = await getVariantId("test-tee-two", "L");
    twoM = await getVariantId("test-tee-two", "M");
    blackM = await getVariantId("test-tee-black", "M");
  });

  beforeEach(async () => {
    await clearOrders();
    await setStock("test-tee-two", "L", 6);
    await setStock("test-tee-two", "M", 4);
    await setStock("test-tee-black", "M", 3);
  });

  afterAll(async () => {
    await sql.end();
  });

  it("selecting test-tee-two / L (NOT the drop's first product) names THAT variant in order_items", async () => {
    // The customer picks the SECOND product, size L, through the real cart.
    const cart = addItem(emptyCart, {
      variantId: twoL,
      dropSlug: DROP,
      productSlug: "test-tee-two",
      productIndex: 2,
      size: "L",
    });
    const items = toOrderItems(cart);
    expect(items).toEqual([{ variantId: twoL, quantity: 1 }]); // choice preserved client-side

    const { error } = await svc.rpc("create_order", {
      p_drop_slug: DROP,
      p_customer_name: "Избор",
      p_phone: "070111222",
      p_phone_normalized: "+38970111222",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: submitItems(items),
    });
    expect(error).toBeNull();

    const rows = await writtenOrderItems();
    expect(rows).toEqual([{ slug: "test-tee-two", size: "L", quantity: 1 }]);
    // The stand-in would have produced test-tee-black here — the whole point of the phase.
    expect(rows[0].slug).not.toBe("test-tee-black");
  });

  it("two different items in one cart → two order_items rows, correct variants and quantities", async () => {
    let cart = addItem(emptyCart, {
      variantId: twoM,
      dropSlug: DROP,
      productSlug: "test-tee-two",
      productIndex: 2,
      size: "M",
    });
    cart = addItem(cart, {
      variantId: blackM,
      dropSlug: DROP,
      productSlug: "test-tee-black",
      productIndex: 1,
      size: "M",
    });
    const items = toOrderItems(cart); // 2 units total — within the cap

    const { error } = await svc.rpc("create_order", {
      p_drop_slug: DROP,
      p_customer_name: "Две",
      p_phone: "070333444",
      p_phone_normalized: "+38970333444",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: submitItems(items),
    });
    expect(error).toBeNull();

    const rows = await writtenOrderItems();
    // sorted by sort_order → test-tee-black (1) then test-tee-two (2)
    expect(rows).toEqual([
      { slug: "test-tee-black", size: "M", quantity: 1 },
      { slug: "test-tee-two", size: "M", quantity: 1 },
    ]);
  });

  it("the cart cap matches create_order: a 3rd unit is refused client-side AND rejected server-side (TR003)", async () => {
    // Client: the cart never lets a third unit in, so a 3-unit order cannot even be built from it.
    let full = addItem(emptyCart, {
      variantId: twoL,
      dropSlug: DROP,
      productSlug: "test-tee-two",
      productIndex: 2,
      size: "L",
    });
    full = addItem(full, {
      variantId: blackM,
      dropSlug: DROP,
      productSlug: "test-tee-black",
      productIndex: 1,
      size: "M",
    });
    const overfilled = addItem(full, {
      variantId: twoM,
      dropSlug: DROP,
      productSlug: "test-tee-two",
      productIndex: 2,
      size: "M",
    });
    expect(overfilled).toEqual(full); // refused — cart unchanged
    expect(totalUnits(overfilled)).toBe(2);

    // Server: even if a client bypasses the cart, create_order rejects 3 units before any decrement.
    const { error } = await svc.rpc("create_order", {
      p_drop_slug: DROP,
      p_customer_name: "Алчен",
      p_phone: "070555666",
      p_phone_normalized: "+38970555666",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: [
        { variant_id: twoL, quantity: 2 },
        { variant_id: blackM, quantity: 1 },
      ], // 3 units
    });
    expect(error?.code).toBe(ORDER_ERROR_CODES.QUANTITY_CAP_VIOLATED);
  });

  it("a variant selling out between add-to-cart and submit → clean TR004, no partial order", async () => {
    // The cart holds test-tee-two / L (a suggestion — the cart never checks stock).
    const cart = addItem(emptyCart, {
      variantId: twoL,
      dropSlug: DROP,
      productSlug: "test-tee-two",
      productIndex: 2,
      size: "L",
    });
    const items = toOrderItems(cart);

    // It sells out before the customer submits.
    await setStock("test-tee-two", "L", 0);

    const { error } = await svc.rpc("create_order", {
      p_drop_slug: DROP,
      p_customer_name: "Доцна",
      p_phone: "070777999",
      p_phone_normalized: "+38970777999",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: submitItems(items),
    });
    expect(error?.code).toBe(ORDER_ERROR_CODES.INSUFFICIENT_STOCK);
    // No partial order — the whole transaction rolled back.
    expect(await countOrders()).toBe(0);
  });
});
