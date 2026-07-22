-- 03 · VERIFY THE ORDER — read-only. Run right after you place the one real order on the phone.
-- Confirms: one order row, held as a 48h reservation, correct total; and the atomic stock decrement.

-- The order (expect exactly one): status 'reserved', reserved_until ≈ now() + 48h, total_mkd = 1199 × units.
select order_number, status, reserved_until, total_mkd, city, created_at
  from public.orders
 order by created_at desc
 limit 1;

-- The order line(s): product + size + quantity + the price snapshot taken at order time.
select oi.quantity, oi.unit_price_mkd, p.slug as product, v.size
  from public.order_items oi
  join public.variants v on v.id = oi.variant_id
  join public.products p on p.id = v.product_id
 order by oi.quantity desc;

-- Stock: the size you ordered should now be 0 (was 1) — the whole drop is sold out.
select p.slug as product, v.size, v.stock
  from public.variants v
  join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug = 'test-drop')
 order by p.slug, v.size;
