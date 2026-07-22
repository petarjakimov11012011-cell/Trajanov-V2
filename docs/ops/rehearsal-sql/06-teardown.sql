-- 06 · TEARDOWN — MANDATORY. Removes every trace of the rehearsal so nothing is buyable and hosted is
-- back to its clean pre-rehearsal state. Run as one block.
--
-- NEVER use `supabase db reset --linked` for this (Known issue #8 — it wipes the DB, no free-tier backup).
-- These targeted deletes are the only correct cleanup, exactly as Phase 1.08 did it.

-- (a) Close the window immediately, so nothing is buyable again even before the re-sync.
update public.drops
   set ends_at = now() - interval '1 minute'
 where slug = 'test-drop';

-- (b) Delete the rehearsal order line(s), then the order itself. The order IS the reservation
--     (D-1.03-2), so deleting the order removes the hold too.
delete from public.order_items
 where order_id in (
   select id from public.orders
    where drop_id = (select id from public.drops where slug = 'test-drop')
 );

delete from public.orders
 where drop_id = (select id from public.drops where slug = 'test-drop');

-- (c) Clear any rate-limit attempt rows the rehearsal order created (keeps order_attempts at 0).
delete from public.order_attempts;

-- (d) Restore every rehearsal variant to the committed config stock (3). This is a deliberate human
--     stock write to undo a rehearsal — exactly the "deliberate SQL by someone who has thought about
--     it" the no-auto-restock rule (D-1.04-5) intends. It is NOT the sync writing stock.
update public.variants v
   set stock = 3
  from public.products p
 where v.product_id = p.id
   and p.drop_id = (select id from public.drops where slug = 'test-drop');

-- (e) Reset the order-number sequence so the FIRST REAL order is TRJ-0001.
select setval('order_number_seq', 1, false);

-- Show the result (expect: 0 orders, all stock 3, window in the past):
select (select count(*) from public.orders) as orders,
       (select count(*) from public.order_items) as order_items,
       (select count(*) from public.order_attempts) as order_attempts;

select p.slug as product, v.size, v.stock
  from public.variants v
  join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug = 'test-drop')
 order by p.slug, v.size;
