-- 02 · VERIFY LIVE — read-only. Run after the countdown reaches zero, to confirm the drop is open and
-- exactly one unit is sellable. (The site computes drop state on the server from these rows.)

-- Window: starts_at should be in the PAST now and ends_at in the future → the drop is open.
select slug,
       starts_at,
       ends_at,
       (now() between starts_at and ends_at) as window_open
  from public.drops
 where slug = 'test-drop';

-- Sellable units: exactly one row should show stock > 0 (mustard/ochre M = 1); total_units should be 1.
select p.slug as product, v.size, v.stock
  from public.variants v
  join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug = 'test-drop')
 order by p.slug, v.size;

select sum(v.stock) as total_units
  from public.variants v
  join public.products p on p.id = v.product_id
 where p.drop_id = (select id from public.drops where slug = 'test-drop');
