-- Phase 1.04 — make product price and names nullable (D-1.04-6).
--
-- No real price, and no real product name, exists for any product yet (facts.md §7 — both OWED by
-- Vladimir). The site must render browsable-with-placeholders between drops, so a product with no
-- price and no name must be REPRESENTABLE. A NOT NULL column forces whoever fills the drop config to
-- type a number and a name, and the only ones available are invented — the schema was applying
-- pressure toward fabrication. This removes that pressure at the schema level.
--
-- NOTE ON WHERE PRICE LIVES: the brief (D-1.04-6, Task 2) says "variants.price_mkd". The real column
-- is public.products.price_mkd — variants carry only (product, size, stock); create_order() reads the
-- price by joining variant → product. This migration therefore relaxes products.price_mkd, the column
-- that actually exists and that create_order() snapshots. See the Phase 1.04 completion report §3.
--
-- Names are relaxed for the same anti-fabrication reason (D-1.04-11, executor): a null name renders as
-- a neutral slot ("Производ 01") derived from sort_order, exactly as the 1.02 pass did — never a made-
-- up name stored as if real. The UI shows a real name only when the DB actually holds one.

-- price_mkd: nullable, and the CHECK becomes "null OR positive" (a price is never zero or negative).
alter table public.products alter column price_mkd drop not null;
alter table public.products drop constraint products_price_mkd_check;
alter table public.products
  add constraint products_price_mkd_check check (price_mkd is null or price_mkd > 0);
comment on column public.products.price_mkd is
  'Whole MKD (денари). NULLABLE (D-1.04-6): null = no real price yet (OWED by Vladimir, facts.md §7). create_order() rejects a null-priced product with TR006 before any decrement, and the config→DB sync refuses to publish an open/future drop that still has a null price. A price is never <= 0.';

-- name_mk / name_en: nullable. null = no real name yet; the UI renders a neutral slot from sort_order.
alter table public.products alter column name_mk drop not null;
alter table public.products alter column name_en drop not null;
comment on column public.products.name_mk is
  'Macedonian product name. NULLABLE (D-1.04-11): null = OWED by Vladimir; the UI renders a neutral slot ("Производ NN") from sort_order rather than an invented name.';
comment on column public.products.name_en is
  'English product name. NULLABLE (D-1.04-11): null = OWED by Vladimir; the UI renders a neutral slot ("Product NN") from sort_order.';

comment on table public.products is
  'A product within a drop. price_mkd (whole MKD) and name_mk/name_en are NULLABLE — real values are OWED by Vladimir (facts.md §7) and arrive as typed drop config synced to the DB. A null price cannot be ordered (create_order TR006) and cannot be published on an open/future drop (sync preflight).';
