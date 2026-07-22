-- 00 · BASELINE — run first, before touching anything. Read-only.
-- Confirms hosted is at the clean pre-rehearsal state: only the ended test-drop, all stock 3, 0 orders,
-- 2 active cron jobs, next order number TRJ-0001. Write these numbers down; teardown restores to them.

-- The drop and its window (expect: only 'test-drop', window in the PAST → ended):
select slug, starts_at, ends_at, rate_limit_per_window
  from public.drops
 order by slug;

-- Stock per product/size (expect: mustard/ochre S/M/L/XL = 3, off-white XL = 3):
select p.slug as product, v.size, v.stock
  from public.variants v
  join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug = 'test-drop')
 order by p.slug, v.size;

-- Order tables (expect all 0):
select
  (select count(*) from public.orders)        as orders,
  (select count(*) from public.order_items)   as order_items,
  (select count(*) from public.order_attempts) as order_attempts;

-- Cron jobs (expect 2 active: expire-reservations + prune-cron-run-details):
select jobname, schedule, active from cron.job order by jobname;

-- Next order number (expect last_value = 1, is_called = false → next order is TRJ-0001):
select last_value, is_called from order_number_seq;
