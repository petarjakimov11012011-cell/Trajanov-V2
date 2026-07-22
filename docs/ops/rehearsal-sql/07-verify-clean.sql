-- 07 · VERIFY CLEAN — read-only. Run after 06-teardown.sql AND after the final `npm run sync:drop`
-- (which reconciles the committed, ended window). This is the proof that nothing buyable remains.

-- Orders (expect all 0):
select
  (select count(*) from public.orders)         as orders,
  (select count(*) from public.order_items)    as order_items,
  (select count(*) from public.order_attempts) as order_attempts;

-- Drop (expect: only 'test-drop', window back in the PAST → ended, nothing buyable):
select slug, starts_at, ends_at, (now() between starts_at and ends_at) as window_open
  from public.drops
 order by slug;

-- Stock restored to config (expect mustard/ochre S/M/L/XL = 3, off-white XL = 3):
select p.slug as product, v.size, v.stock
  from public.variants v
  join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug = 'test-drop')
 order by p.slug, v.size;

-- Cron still scheduled (expect 2 active jobs):
select jobname, schedule, active from cron.job order by jobname;

-- Next order number (expect last_value = 1, is_called = false → next real order is TRJ-0001):
select last_value, is_called from order_number_seq;
