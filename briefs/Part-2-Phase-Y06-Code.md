# Part 2 · Phase Y.06 · Code — Composition & care wiring + removal of the 2-item order cap

**Why this matters —** two things. First, the "Composition & care" box on every product page is
hard-wired to a placeholder: the `careMk` / `careEn` fields already exist in the product config but
nothing reads them, so when Vladimir finally reads the labels there is no slot to put the text in.
This phase builds that slot, so filling it later is a one-line config edit instead of another code
phase. Second, the "Max 2 items per order" rule is removed on Petar's call — the standing line under
the buy button, the cart cap, the copy on Terms and Cart, and the cap inside `create_order()` all go,
replaced by a non-business sanity ceiling.

**Model & effort —** Claude Opus, reasoning effort **high**. This phase edits `create_order()` — the
one function standing between this project and a public oversell on drop day. Do not treat it as a
copy phase.

**Mandatory skills —** `test-driven-development` (the cart module and the DB function are app logic:
tests first), `systematic-debugging` (if any concurrency test goes red, do not patch around it),
`humanizer` (the three changed customer-facing strings), `logging-project-decisions`,
`writing-completion-reports`, `syncing-project-state`.

---

## Context

### Read first, by path
- `CLAUDE.md` (repo root) — standing rules. **§ Branch & PR rules** and the line requiring the
  concurrent-order test for *any* change to stock or reservation logic. That line binds this phase.
- `facts.md` (repo root) — **§ 7 Product & commerce**. `Fabric / composition / care` is
  `UNVERIFIED — OWED (Vladimir)`. It stays that way after this phase.
- `src/_project-state/current-state.md` — the NEXT line, the placeholder register (rows **#3** and
  **#9** are the fabric/care rows) and the owed-verification register.
- `Decisions.md` — `D-1.06-6` (the 2-unit cap), `D-Y.03-1` (slug-keyed product lookups),
  `D-1.06-3` (photo/fabric DB columns land with **Y.01**, not before), `D-1.06-5` (the cart is
  DB-free), `D-1.03-3` (`create_order()` is the only path that creates an order).
- `src/_project-state/completions/Part-1-Phase-06-Completion.md` — where the cap was introduced.

### The code as it stands today (verified against `main`)

**Composition & care**
- `src/config/schema.ts:41-42` — `ProductConfig` already declares `careMk?: string | null` and
  `careEn?: string | null`, commented "Forward-looking … Not yet persisted."
- `src/config/products.ts` — all three products (`test-mustard-ochre`, `test-off-white`,
  `test-baby-blue`) carry `careMk: null, careEn: null`.
- `src/app/[locale]/catalog/[slug]/page.tsx:196-201` — the section renders
  `<Placeholder>{t('Placeholder.composition')}</Placeholder>` **unconditionally**. Nothing reads
  `careMk` / `careEn`. That is the whole defect.
- The page's `product` object is a `ProductView` (`src/types/drop.ts`) built by `getProductView`
  from the **database**. `ProductView` has no care fields and there is no DB column for them.
- The precedent for exactly this problem is photography: `src/lib/product-images.ts` exposes
  `getProductImage(slug)`, a **slug-keyed** lookup the page calls beside the DB-derived product
  (`D-Y.03-1`). Mirror it.

**The 2-item cap** — it lives in six places:
1. `src/lib/cart/cart.ts:19` — `export const MAX_UNITS_PER_ORDER = 2`; enforced in `atCap` (`:49`),
   `addItem` (`:60`) and `setItemQty` (`:81`).
2. `supabase/migrations/20260715120001_create_order_tr006.sql:56-60` — **step 3** raises `TR003`
   `quantity_cap_violated` when the summed quantity is `< 1 or > 2`. This file is the current
   definition of `create_order()`; nothing after it redefines the function.
3. `supabase/migrations/20260715021215_schema.sql:137` — `order_items.quantity integer not null
   check (quantity between 1 and 2)`. **This is the landmine.** Relaxing only the function would let
   a 3-unit line reach the INSERT and fail with a raw `23514` check violation instead of a clean
   `TR` code — a 500 served to a real customer at the one moment that matters.
4. `src/components/product/AddToCartPanel.tsx:97` — the standing `Max 2 items per order.` line under
   the buy button (the line visible in production today), plus the inline `cap` feedback at `:92`.
5. `src/components/cart/CartView.tsx:165,178-181` — the `+` button `disabled={atCap}` and the
   `capNotice` banner in the summary.
6. Copy: `Product.oneUnitLimit`, `Cart.capNotice`, `Order.capViolated`, `Terms.orderingBody2` — in
   **both** `src/messages/mk.json` and `src/messages/en.json`.

Tests that assert the cap today: `tests/cart/cart.test.ts:74-110` and
`tests/orders/checkout-items.test.ts:120-144`.

Docs that record the cap as a sourced fact: `docs/legal/facts-audit-2.03.md` rows 85, 86, 246 and
`docs/i18n/string-inventory.md` rows 32, 178, 223, 278.

---

## Decisions — already made, bake them in, do not re-open

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.06-1` | Care copy reaches the page through a **slug-keyed lookup** — `src/lib/product-care.ts`, mirroring `src/lib/product-images.ts` (`D-Y.03-1`) — reading `careMk` / `careEn` straight out of `src/config/products.ts`. | A DB column + sync change. | Care copy is not in the database, so changing it needs a deploy. Correct anyway: photo and fabric columns are **Y.01's** job (`D-1.06-3`), and adding one here would collide with that phase. |
| `D-Y.06-2` | While `careMk` / `careEn` are `null`, the page renders **exactly today's placeholder, byte-identical**. Placeholder register rows **#3** and **#9** stay OPEN. | Shipping any interim fabric text. | This half of the phase is invisible on production. That is the point — it is plumbing, and `facts.md` §7 still says OWED. |
| `D-Y.06-3` | The 2-unit business cap is **removed** — Petar's call, 2026-08-27. **Supersedes `D-1.06-6`.** | Removing only the standing line and keeping the rule. | Named plainly: with no per-order cap, one person can take an entire drop on cash on delivery having paid nothing up front. What is left holding the line is real stock, the per-drop rate limit (`D-1.04-7`), and `TR005` (one live order per phone per drop). |
| `D-Y.06-4` | A **sanity ceiling of 99 units** — per line and per order — replaces the cap. It is input validation, not a business rule, and it keeps `TR003` alive so an absurd or malformed quantity is refused cleanly instead of becoming a cast error or a 500. | No ceiling at all. | A customer who genuinely wanted 100 units in one order cannot. Nobody will. |
| `D-Y.06-5` | The `order_items.quantity` CHECK is relaxed to `between 1 and 99` in a **new** migration. Existing migration files are never edited. | Editing `20260715021215_schema.sql` in place. | One more migration file. |
| `D-Y.06-6` | Copy: `Cart.capNotice` is **deleted**; `Product.oneUnitLimit` → **`Product.quantityLimit`** (inline feedback only, no number in the string); `Order.capViolated` → **`Order.quantityInvalid`**; `Terms.orderingBody2` loses its first sentence and keeps its second. | Keeping the old key names with new values. | Three key renames ripple into two docs. Worth it — a key named `capViolated` in an audited catalog after the cap is gone is a lie in the codebase. |
| `D-Y.06-7` | The cart still does not know about stock (`D-1.06-5` intact), so a customer can build a cart bigger than the stock and only find out at checkout. | Teaching the cart to read stock. | They get a clean `TR004 insufficient_stock` at checkout instead of a disabled `+` earlier. A stock-aware cart would either lie (stale numbers) or reserve stock, and a reserving cart hands a saboteur a free stock-lock. |

---

## Scope

**In scope**
- A new `src/lib/product-care.ts` slug-keyed lookup, and the product page reading it.
- Removal of the 2-unit cap from the cart module, `create_order()`, the `order_items` CHECK, the
  three components, the four message keys (× 2 catalogs), and the two docs that source them.
- Test changes, including **two** concurrency proofs (one existing, one new).
- `Decisions.md`, the registers in `current-state.md`, the completion report.

**Out of scope — do not touch**
- `facts.md` §7. Fabric/composition/care stays `UNVERIFIED — OWED`. **Do not write any composition
  or care text into `products.ts`, the messages, or anywhere else.** There is no label text yet.
  Inventing "100% cotton" here is the single worst thing this phase could do — it is a
  consumer-protection claim on a cash-on-delivery product sold by a minor.
- Any DB column for care or photos — that is **Y.01**.
- `src/lib/seo/product-jsonld.ts`. It suppresses the Product node while composition is a
  placeholder; care stays null, so its behaviour must be **unchanged**. Prove it, do not assume it.
- `src/app/llms.txt/route.ts`. Composition is excluded there by `facts.md` and stays excluded.
- The 48h reservation, the expiry sweep, the rate limit, `TR001/TR002/TR004/TR005/TR006`, the
  variant-id sort order, and the atomic conditional UPDATE in step 4. **Do not "tidy" step 4.** It
  is proven concurrency code and the ORDER BY is not cosmetic.
- `docs/i18n/mk-review-2.02.md` and `mk-review-2.03.md`. Those are dated records of reviews that
  actually happened; leave them alone and note the supersession in the completion report instead.

---

## Tasks

### A — Composition & care wiring

1. Create `src/lib/product-care.ts`. Export `getProductCare(slug: string): {mk: string | null; en:
   string | null} | null` (or an equivalent shape you document), resolving the slug against
   `PRODUCTS` in `src/config/products.ts` across all drops. Keyed by **slug, never by index** — a
   position-based lookup would let a re-order in `products.ts` silently move one shirt's fabric
   claim onto another colourway. Put that reasoning in the file header, as `product-images.ts` does.
2. In `src/app/[locale]/catalog/[slug]/page.tsx`, the "Composition & care" section renders the real
   per-locale string when it is non-null, and falls back to the existing
   `<Placeholder>{t('Placeholder.composition')}</Placeholder>` when it is null. Style the real copy
   to match the adjacent Shipping block (`text-muted-foreground text-small`), not the placeholder.
3. Update the `careMk` / `careEn` comment in `src/config/schema.ts:40-42`: still not persisted, but
   now read by the UI through `product-care.ts`.
4. **Prove the wiring, do not assert it.** Temporarily set `careMk` / `careEn` on
   `test-mustard-ochre` to an obvious throwaway (`"ТЕСТ"` / `"TEST"`), render `/katalog/
   test-mustard-ochre` and `/en/catalog/test-mustard-ochre`, confirm the real copy replaces the
   placeholder in both locales, then **revert both fields to `null`** and confirm the placeholder is
   back. The reverted state is what gets committed. Show the before/after in the report.

### B — Removing the cap

5. **Tests first.** Rewrite `tests/cart/cart.test.ts:74-110` and
   `tests/orders/checkout-items.test.ts:120-144` to assert the new behaviour — a third unit is
   accepted client-side and server-side — and watch them fail before you change any source.
6. `src/lib/cart/cart.ts`: rename `MAX_UNITS_PER_ORDER` → `SANITY_MAX_UNITS_PER_ORDER = 99`. Keep
   `atCap` and the `setItemQty` clamp, both now measured against the ceiling, and rewrite their
   JSDoc so a future reader cannot mistake the ceiling for a business rule.
7. New migration, `supabase/migrations/<timestamp>_remove_order_quantity_cap.sql`:
   - `create or replace function public.create_order(...)` with the **identical signature** — this
     preserves the EXECUTE grants — and the body byte-for-byte as it is in
     `20260715120001_create_order_tr006.sql` except step 3, which becomes: reject `< 1` or `> 99`
     with `TR003`. Keep the `v_qty < 1` → `TR003` guard inside the loop.
   - `alter table public.order_items` — drop the existing quantity CHECK and add
     `check (quantity between 1 and 99)`. Look the constraint's real name up in
     `information_schema` first; do not assume `order_items_quantity_check`.
   - Update the `TR003` line in the file's ERROR VOCABULARY header comment, and the stale
     `schema.sql:137` intent in the new file's comments.
8. `src/components/product/AddToCartPanel.tsx`: **delete line 97** — the standing notice. Keep the
   inline `cap` feedback branch (a silently dead button is worse than a message nobody will see) and
   point it at the renamed `Product.quantityLimit`.
9. `src/components/cart/CartView.tsx`: delete the `{atCap && …capNotice}` block from the summary.
   Keep `disabled={atCap}` on `+` as the 99-unit backstop.
10. `src/components/checkout/CheckoutForm.tsx:230-231`: `TR003` → `Order.quantityInvalid`.
11. Both `src/messages/mk.json` and `src/messages/en.json` — apply exactly these:
    - **delete** `Cart.capNotice`
    - **rename** `Product.oneUnitLimit` → `Product.quantityLimit`
      MK: `Ја достигна максималната количина за една нарачка.`
      EN: `You've reached the maximum quantity for one order.`
    - **rename** `Order.capViolated` → `Order.quantityInvalid`
      MK: `Провери ја количината во кошничката и обиди се повторно.`
      EN: `Check the quantity in your cart and try again.`
    - **`Terms.orderingBody2`** — drop the first sentence, keep the rest verbatim (it is already
      MK-reviewed; do not re-translate it):
      MK: `Спуштањата се ограничени и залихата е вистинска — кога ќе се распродаде, готово е.`
      EN: `Drops are limited and the stock is real — when it's gone, it's gone.`
    Run the `humanizer` pass over the two new strings before committing them.
12. Update `docs/legal/facts-audit-2.03.md` (rows 85, 86, 246) and `docs/i18n/string-inventory.md`
    (rows 32, 178, 223, 278) to match reality. A copy audit that cites a rule the code no longer
    enforces is worse than no audit.

### C — Concurrency (the part that actually protects drop day)

13. Re-run the existing gate unchanged: **10 simultaneous orders against 3 units → exactly 3
    succeed**, final stock 0, no partial orders. Required by `CLAUDE.md`.
14. **Add a new case, because removing the cap opens a hole the old rule was hiding.** Until today no
    single order could request more than 2 units. Now one can request the whole drop. Add:
    **5 simultaneous orders each requesting 3 units of the same 3-unit variant → exactly 1 succeeds,
    4 fail with `TR004`, final stock 0, and no partial `order_items` rows exist.** Put it beside the
    existing oversell test in `tests/concurrency/oversell.test.ts`.
15. Add a plain single-order case: one order of **3 units** now succeeds end to end where it
    previously raised `TR003`.

### D — Close out

16. `Decisions.md`: append `D-Y.06-1 … D-Y.06-7` plus anything you decided on your own, and set
    `D-1.06-6`'s Status to `Superseded by D-Y.06-3`. **Do not edit or delete the D-1.06-6 entry
    itself** — the log is append-only.
17. `src/_project-state/current-state.md` per `syncing-project-state`: the NEXT line, the Y.06 entry,
    the file map if `product-care.ts` warrants it, and **two new owed-verification rows**:
    - Native MK review of `Product.quantityLimit`, `Order.quantityInvalid` and the shortened
      `Terms.orderingBody2`. Owner: **Lazar / Petar**.
    - A real 3-unit order placed end to end on `www.trajanovv.com` — only provable against a live
      drop. Owner: **Lazar + Vladimir**, at the 2.06 rehearsal.
    Placeholder register rows **#3** and **#9** are **unchanged and still open**.

---

## Definition of Done

**Verifiable by you**

- [ ] `npm run build && npm run lint && npx tsc --noEmit` all clean.
- [ ] `npm test` green, with the rewritten cart/checkout tests and the new concurrency case included;
      report the pass count against the 85 recorded in `current-state.md` and explain the delta.
- [ ] **10 simultaneous orders vs 3 units → exactly 3 succeed**, final stock 0. Paste the output.
- [ ] **5 simultaneous 3-unit orders vs one 3-unit variant → exactly 1 succeeds**, 4 × `TR004`,
      final stock 0, zero orphan `order_items` rows. Paste the output.
- [ ] A single 3-unit order succeeds end to end (previously `TR003`).
- [ ] `grep -rn "2 items\|2 парчиња\|MAX_UNITS_PER_ORDER\|capNotice\|capViolated\|oneUnitLimit" src/ tests/`
      returns **nothing** outside `src/_project-state/` and `Decisions.md` (history, correctly kept).
- [ ] `tests/i18n/catalog-parity.test.ts` passes — MK and EN key sets identical after four key
      changes in each catalog.
- [ ] The migration applies cleanly on a fresh database **and** on top of the existing chain; the
      `create_order` signature is unchanged and its EXECUTE grants survive (`\df+` or a query against
      `information_schema.role_routine_grants`).
- [ ] With `careMk`/`careEn` set to a throwaway value, the real copy renders on the product page in
      **both** locales; reverted to `null`, the placeholder renders **byte-identically to `main`**.
      Both states shown in the report.
- [ ] `productJsonLd` still returns `null` for all three products — proven, not assumed.
- [ ] No composition or care text of any kind is committed. `facts.md` §7 untouched.
- [ ] All three product pages render in a browser, both locales: composition placeholder present,
      **no "Max 2 items per order" line anywhere**, buy panel otherwise unchanged.
- [ ] `/uslovi` and `/en/terms` render the shortened ordering paragraph, both locales.
- [ ] `/kosnicka` and `/en/cart` with 3 units of one variant: `+` enabled, no cap banner, checkout
      accepts it.

**Owed to the operator — goes on the register, not ticked here**

- [ ] Native MK review of the three changed strings.
- [ ] A real 3-unit order on the production domain, at the 2.06 rehearsal.

---

## Branch, PR, review

- Branch `phase-y.06-care-wiring-and-cap-removal`. **One phase branch at a time** — confirm no other
  phase branch is unmerged before you cut it.
- One contiguous commit block, every commit message prefixed `Y.06:`. PR to `main`. One PR.
- **This phase touches `create_order()`.** Before merge, a **fresh Claude Code session — one that did
  not write this code — reviews the PR against this brief**, the way `D-0-3` requires for 1.03 and
  1.04. This project has no automated review gate, so that fresh read plus the two concurrency
  proofs are the entire safety net. Say so plainly in the report; do not describe it as equivalent
  to a real review gate, because it is not.
- Do not merge your own PR. The other operator merges.

## Outputs & where they go

- Brief → `briefs/Part-2-Phase-Y06-Code.md`
- New source → `src/lib/product-care.ts`
- New migration → `supabase/migrations/<timestamp>_remove_order_quantity_cap.sql`
- Completion report → `src/_project-state/completions/Part-2-Phase-Y06-Completion.md`,
  written per `writing-completion-reports`, with a **"Decisions I made on my own"** section even if
  it is empty. Nothing gets ratified silently.
