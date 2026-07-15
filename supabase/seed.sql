-- Phase 1.03 — dev/test seed. NEVER runs against a deployed database (D-1.03-5); local `db reset` only.
--
-- Every product slug is prefixed `test-` so that if one of these rows ever appears in production it is
-- instantly obvious rather than plausible. Prices, names, and sizes here are INVENTED test fixtures —
-- fine ONLY because nothing in this phase renders them. Real values are OWED by Vladimir (facts.md §7)
-- and arrive as typed drop config in 1.04/1.06.

-- An OPEN drop (window covers now): the target of the concurrency + RLS tests.
insert into public.drops (slug, starts_at, ends_at)
values ('test-open-drop', now() - interval '1 day', now() + interval '7 days');

-- An UPCOMING drop (starts in the future): the target of the "rejected before starts_at" test (D-1.03-7).
insert into public.drops (slug, starts_at, ends_at)
values ('test-upcoming-drop', now() + interval '7 days', now() + interval '14 days');

insert into public.products (drop_id, slug, name_mk, name_en, price_mkd, sort_order)
values
  ((select id from public.drops where slug = 'test-open-drop'),
   'test-tee-black', 'ТЕСТ — Маица 01', 'TEST — Tee 01', 999, 1),
  -- A SECOND product in the open drop (sort_order 2). The cart-flow phase test (Phase 1.06) uses it to
  -- prove the customer's chosen product survives to order_items: it is NOT the drop's first product, so
  -- the deleted first-in-stock stand-in would have named test-tee-black instead of this one.
  ((select id from public.drops where slug = 'test-open-drop'),
   'test-tee-two', 'ТЕСТ — Маица 03', 'TEST — Tee 03', 1500, 2),
  ((select id from public.drops where slug = 'test-upcoming-drop'),
   'test-tee-upcoming', 'ТЕСТ — Маица 02', 'TEST — Tee 02', 1234, 1);

-- The stock = 3 variant is what the concurrency test attacks: 10 orders fired at once, exactly 3 win.
insert into public.variants (product_id, size, stock)
values
  ((select id from public.products where slug = 'test-tee-black'),    'M', 3),
  ((select id from public.products where slug = 'test-tee-black'),    'L', 10),
  ((select id from public.products where slug = 'test-tee-two'),      'M', 4),
  ((select id from public.products where slug = 'test-tee-two'),      'L', 6),
  ((select id from public.products where slug = 'test-tee-upcoming'), 'M', 5);
