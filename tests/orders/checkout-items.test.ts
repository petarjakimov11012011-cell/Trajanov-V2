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

  it("a 3rd unit is ACCEPTED client-side AND server-side — the 2-unit cap is gone (D-Y.06-3)", async () => {
    // Before Y.06 the cart refused the third unit and create_order() raised TR003 on it. Both now let
    // it through: what limits an order is real stock, not a number in the cart module.
    let cart = addItem(emptyCart, {
      variantId: twoL,
      dropSlug: DROP,
      productSlug: "test-tee-two",
      productIndex: 2,
      size: "L",
    });
    cart = addItem(cart, {
      variantId: blackM,
      dropSlug: DROP,
      productSlug: "test-tee-black",
      productIndex: 1,
      size: "M",
    });
    cart = addItem(cart, {
      variantId: twoM,
      dropSlug: DROP,
      productSlug: "test-tee-two",
      productIndex: 2,
      size: "M",
    });
    expect(totalUnits(cart)).toBe(3); // the cart kept all three — it would have refused the last one
    expect(cart.items).toHaveLength(3);

    const { error } = await svc.rpc("create_order", {
      p_drop_slug: DROP,
      p_customer_name: "Три",
      p_phone: "070555666",
      p_phone_normalized: "+38970555666",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: submitItems(toOrderItems(cart)),
    });
    expect(error).toBeNull();

    // All three lines reached order_items with the quantities the customer chose.
    expect(await writtenOrderItems()).toEqual([
      { slug: "test-tee-black", size: "M", quantity: 1 },
      { slug: "test-tee-two", size: "L", quantity: 1 },
      { slug: "test-tee-two", size: "M", quantity: 1 },
    ]);
  });

  it("a single line of 3 units of ONE variant is accepted — the per-row CHECK was 1..2 before Y.06", async () => {
    // The landmine D-Y.06-5 defuses: relaxing only the function would have let this line reach the
    // INSERT and fail with a raw 23514 check violation — a 500 served to a real customer.
    const cart = addItem(
      emptyCart,
      {
        variantId: twoL,
        dropSlug: DROP,
        productSlug: "test-tee-two",
        productIndex: 2,
        size: "L",
      },
      3,
    );
    expect(totalUnits(cart)).toBe(3);

    const { error } = await svc.rpc("create_order", {
      p_drop_slug: DROP,
      p_customer_name: "Три на еден ред",
      p_phone: "070555777",
      p_phone_normalized: "+38970555777",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: submitItems(toOrderItems(cart)),
    });
    expect(error).toBeNull();
    expect(await writtenOrderItems()).toEqual([
      { slug: "test-tee-two", size: "L", quantity: 3 },
    ]);
  });

  it("100 units is still refused with TR003 — the sanity ceiling, not a business cap (D-Y.06-4)", async () => {
    // The cart cannot build this (it clamps at 99), so this is the server refusing a client that
    // bypassed the cart. It must be a clean TR003, not a cast error and not a 500.
    const { error } = await svc.rpc("create_order", {
      p_drop_slug: DROP,
      p_customer_name: "Апсурд",
      p_phone: "070555888",
      p_phone_normalized: "+38970555888",
      p_address: "Адреса",
      p_city: "Струмица",
      p_items: [{ variant_id: twoL, quantity: 100 }],
    });
    expect(error?.code).toBe(ORDER_ERROR_CODES.QUANTITY_CAP_VIOLATED);
    expect(await countOrders()).toBe(0);
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
