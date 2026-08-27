# Completion report — Part 2 Phase Y.06: Composition & care wiring + removal of the 2-item order cap

| | |
|---|---|
| **Phase** | Y.06 |
| **Name** | Composition & care wiring + removal of the 2-item order cap |
| **Executor** | Claude Code |
| **Operator** | Petar (the cap-removal call) / Lazar (orchestrator) |
| **Date** | 2026-08-27 |
| **Branch** | `phase-y.06-care-wiring-and-cap-removal` |
| **PR** | *(not opened — see § 10; the other operator merges, `D-0-3`)* |
| **Brief** | `briefs/Part-2-Phase-Y06-Code.md` |

---

## 1. What shipped

- **A slot for composition & care exists.** `src/lib/product-care.ts` resolves `careMk`/`careEn` out
  of `src/config/products.ts` **by slug**, and the product page renders the real per-locale string
  when it is there. Filling it in is now a one-line config edit, not another code phase.
- **Nothing about the site changed for a visitor from that half.** All six values are still `null`,
  so the „Состав и нега" section renders the same placeholder — proven by diffing the rendered HTML
  against `main` in both locales. `facts.md` §7 untouched; placeholder rows **#3/#9 still OPEN**.
- **The "Max 2 items per order" rule is gone**, in all seven places it lived — the cart module,
  `create_order()` step 3, the `order_items.quantity` CHECK, the standing line under the buy button,
  the cart summary banner, the Terms paragraph, and the Home FAQ answer. A customer can now order
  three, ten, or the whole drop.
- **A 99-unit sanity ceiling replaces it** so `TR003` still refuses an absurd or malformed quantity
  cleanly instead of it becoming a cast error or a 500 mid-drop. No customer-facing string states the
  number, so no copy can go stale if it ever moves.
- **The concurrency guarantee is proven against the newly-reachable case.** Until this phase no single
  order could ask for more than 2 units; now one can ask for an entire drop. Five simultaneous
  3-unit orders against a 3-unit variant → exactly one wins.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.06-8` | **Rewrote the Home FAQ answer `Faq.a3`** — a **seventh** cap site the brief did not list, found by the phase's own closing grep. It renders on the home page **and ships inside the FAQPage JSON-LD**, so the old answer was a machine-readable public claim of a rule the code no longer enforces. Key, question, and the 8-item structure untouched; only the answer text moved, so the JSON-LD shape and `tests/seo/faq-jsonld.test.ts` are unaffected. | Deleting `q3`/`a3` outright. "How many can I order" is a real customer question that now has a real answer; deleting it would shrink the FAQ to 7 and change the structured data for no reason. | A string the brief did not authorise was changed, and it is **owed the same native MK review** as the other three (register #66). `docs/i18n/mk-review-2.11.md` now records a superseded value; like `2.02`/`2.03` it is a dated record and is left untouched. |
| `D-Y.06-9` | **(a)** `getProductCare` trims and maps an empty/whitespace-only config value to `null`. **(b)** Added `tests/config/product-care.test.ts` asserting the lookup is slug-keyed **and that every configured product still has null care copy in both locales**. | Trusting review to catch invented fabric copy. | When Vladimir's real care copy lands, that test must be updated in the same commit — deliberately, rather than silently satisfied. |
| *(mechanism, folded into `D-Y.06-5`)* | The migration drops the `order_items` quantity CHECK **by discovered `pg_constraint` name** (a `DO` loop over every CHECK whose definition mentions `quantity`), with a post-condition block that raises unless exactly one such CHECK remains and it mentions 99. | `drop constraint if exists order_items_quantity_check` with the name assumed. Rejected because if the name ever differed the drop would **silently no-op**, leaving the old 1..2 CHECK in force — the exact silent failure this migration exists to prevent. | A `DO` block where a one-line `ALTER` would read more simply. |
| *(scope, comments only)* | Updated four stale comments outside the brief's list — `src/config/products.ts` header, `src/lib/orders/process-order.ts`, `src/lib/orders/actions.ts`, `src/app/[locale]/checkout/page.tsx` — all of which described "the unit cap" as a live rule. | Leaving them. | Four more files in the diff, all comment-only, no behaviour change. |

---

## 3. Surprises and off-spec changes

- **The brief's list of six cap sites was incomplete — there were seven.** `Faq.a3` ("How many pieces
  can I order?" → "Two pieces per order, maximum.") renders on the **home page** and, via
  `src/lib/faq.ts` → `src/lib/seo/faq-jsonld.ts`, ships inside the **FAQPage JSON-LD**. That makes it
  strictly worse than the Terms sentence the brief *did* list: it is the one format built to be read
  by Google and AI answer surfaces. It was caught only by the brief's own closing grep, which is a
  good argument for keeping that grep in future briefs. Fixed under `D-Y.06-8`.
  **For the next brief:** when retiring a customer-facing rule, `src/lib/faq.ts` and the JSON-LD
  builders belong on the checklist beside the message catalogs.

- **The brief says to report the test count "against the 85 recorded in `current-state.md`". That
  figure is stale by several phases.** `current-state.md` most recently records **166/166**; 85 was
  the count around 1.06. Baseline measured on `main` before any change: **166 passed / 24 files**.
  After: **176 passed / 25 files**. Delta **+10, +1 file**:

  | Where | Δ | Why |
  |---|---|---|
  | `tests/config/product-care.test.ts` | **+3** | new file (`D-Y.06-9`) |
  | `tests/cart/cart.test.ts` | **+2** | the 5-test cap block became a 7-test ceiling block |
  | `tests/orders/checkout-items.test.ts` | **+2** | 1 cap test → 3 (3 lines accepted; a single 3-unit line; 100 units still `TR003`) |
  | `tests/orders/create-order.test.ts` | **+2** | 1 `TR003` test → 3 (3 units accepted; 100 refused; qty 0 refused) |
  | `tests/concurrency/oversell.test.ts` | **+1** | the new 5 × 3-unit case (Task 14) |

- **The baseline suite was red before I touched anything — for an unrelated, environmental reason.**
  Local Supabase had been stopped and its seed data was stale: `test-open-drop`'s window is seeded
  relative to `now()` at seed time, so it had expired and 10 order-flow tests failed with `TR002`.
  `supabase db reset` fixed it. Worth knowing: **a red suite on this project is as likely to be a
  stale local DB as a real regression** — reset before diagnosing. (Also: `db reset` restarts the
  containers, and a `npm test` fired immediately after fails on connection errors. Wait ~6s.)

- **One of my own new tests was order-dependent and the full suite caught it.** The 3-unit
  end-to-end test asserted an absolute stock for `test-tee-black / L`, which `beforeEach` never
  resets — every suite shares one database (`fileParallelism: false`), so its value depends on what
  ran earlier. It passed in isolation and failed in the full run. Fixed by **arranging the state in
  the test** (`setStock(…, 'L', 10)`), not by relaxing the assertion, and re-run twice to confirm.

- **`src/lib/product-images.ts` was never added to the tree in `file-map.md`** when Y.03 shipped —
  a pre-existing gap. Added alongside `product-care.ts`, flagged in the tree comment.

- **`src/config/products.ts` is now imported by the Next.js app for the first time.** The comment at
  the top of `src/config/index.ts` ("imported by the Node sync script and by Vitest, **not** by the
  Next.js app") is still literally true — `product-care.ts` imports `./products` directly, not
  `index.ts` — but the *spirit* has a documented exception now. `D-1.04-9` is intact: nothing about
  drop state, stock, price, or openness comes from config. Only care copy does. Noted in three file
  headers so nobody is surprised.

---

## 4. Files touched

`file-map.md` updated: **yes** (tree + the SLUG-keying rule + a change-log row).

| File | A/M/D |
|---|---|
| `src/lib/product-care.ts` | **Added** |
| `supabase/migrations/20260827120000_remove_order_quantity_cap.sql` | **Added** |
| `tests/config/product-care.test.ts` | **Added** |
| `briefs/Part-2-Phase-Y06-Code.md` | **Added** |
| `src/_project-state/completions/Part-2-Phase-Y06-Completion.md` | **Added** |
| `src/app/[locale]/catalog/[slug]/page.tsx` | Modified |
| `src/config/schema.ts` | Modified *(comment only)* |
| `src/config/products.ts` | Modified *(comment only — no value changed)* |
| `src/lib/cart/cart.ts` | Modified |
| `src/components/product/AddToCartPanel.tsx` | Modified |
| `src/components/cart/CartView.tsx` | Modified |
| `src/components/checkout/CheckoutForm.tsx` | Modified |
| `src/lib/orders/process-order.ts` | Modified *(comment only)* |
| `src/lib/orders/actions.ts` | Modified *(comment only)* |
| `src/app/[locale]/checkout/page.tsx` | Modified *(comment only)* |
| `src/messages/mk.json` · `src/messages/en.json` | Modified |
| `tests/cart/cart.test.ts` | Modified |
| `tests/orders/checkout-items.test.ts` | Modified |
| `tests/orders/create-order.test.ts` | Modified |
| `tests/concurrency/oversell.test.ts` | Modified |
| `docs/legal/facts-audit-2.03.md` | Modified |
| `docs/i18n/string-inventory.md` | Modified |
| `Decisions.md` | Modified |
| `src/_project-state/current-state.md` · `file-map.md` · `00_stack-and-config.md` | Modified |

**Deliberately untouched** (checked, not assumed): `facts.md`, `src/lib/seo/product-jsonld.ts`,
`src/app/llms.txt/route.ts`, `src/config/drops.ts`, `src/lib/drop/`, `brand.md`, `SITE_URL`,
`next.config.ts`, `package.json`/lockfile, `docs/i18n/mk-review-2.02|2.03|2.11.md`, and inside
`create_order()` the 48h reservation, `TR001`/`TR002`/`TR004`/`TR005`/`TR006`, step 4's atomic
conditional UPDATE and its `order by (e->>'variant_id')::uuid`.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **clean** (exit 0) |
| Types | `npx tsc --noEmit` | **clean** (exit 0, no output) |
| Lint | `npm run lint` | **0 errors.** 143 warnings, **all** inside `.claude/skills/impeccable/` — the locally-installed, gitignored skill (2.25 P0). Zero warnings in `src/`, `tests/`, `scripts/`. |
| Unit / integration | `npm test` | **176 passed / 176, 25 files** (baseline on `main`: 166/166, 24 files — delta explained in § 3) |

**TDD, as required.** Tests were rewritten first and **watched RED**: 11 failing assertions across
4 files, every one failing because the cap was still enforced — e.g.
`expected undefined to be 99` (`SANITY_MAX_UNITS_PER_ORDER` did not exist yet),
`expected 2 to be 3` (the cart clamped), and
`expected { code: 'TR003', … } to be null` (`create_order` refused 3 units). Only then did source change.

### Concurrent-order test — mandatory (`CLAUDE.md`)

| | |
|---|---|
| **10 simultaneous orders / 3 units** | **exactly 3 succeeded, 7 rejected: YES** |
| Test file | `tests/concurrency/oversell.test.ts` |

```
 ✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous
   orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 138ms
 ✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 5 simultaneous
   3-unit orders against one 3-unit variant → exactly 1 succeeds, 4 × TR004, stock 0, no partial rows 18ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

The first test is **unchanged from `main`** — same 10 attempts, same distinct-phone guard (so TR005
cannot make it pass for the wrong reason), same assertions: 3 succeed, 7 × `TR004`, stock 0,
`countOrders() === 3`, `sumOrderItemQty() === 3`.

The second is **new (Task 14)** and asserts, beyond the counts: every loser fails specifically with
`TR004` (not `TR003`, not a deadlock 500, **not a raw `23514`** from the CHECK), final stock 0,
exactly **one** `order_items` row holding **quantity 3**, and **zero orphan `order_items`** (left
join to `orders` where `o.id is null` → 0).

### A single 3-unit order, end to end

Three ways, all green:

1. **RPC** (`tests/orders/create-order.test.ts`) — 2 units of one variant + 1 of another (the exact
   order that raised `TR003` on `main`): succeeds, `order_number` matches `/^TRJ-\d{4}$/`,
   `total_mkd` 2997, both variants decremented.
2. **Cart → create_order** (`tests/orders/checkout-items.test.ts`) — a 3-line cart reaches
   `order_items` with the right quantities; and separately a **single line of quantity 3**, the row
   shape the old `between 1 and 2` CHECK forbade.
3. **Through the real MK checkout form in a browser** (localhost, Turnstile test keys, no Resend key
   so no email could leave the machine). Order **`TRJ-0055`**, `status = reserved`, `total_mkd`
   **3597** (3 × 1199), **one `order_items` row of quantity 3**, stock 3 → 0. The rehearsal drop was
   opened **in the local database only** for this and closed again immediately; `src/config/drops.ts`
   was never touched, and the local orders/stock were reset afterwards.

### The migration

| Check | Result |
|---|---|
| Applies on a **fresh chain** (`supabase db reset`, all 9 migrations) | ✅ |
| Applies on a **hand-restored pre-Y.06 database** (CHECK put back to `1..2`, 1.04 function body re-applied, then only this migration) | ✅ — `NOTICE: dropped order_items CHECK order_items_quantity_check` |
| **Re-applied a second time** (idempotent in practice) | ✅ — still exactly one CHECK |
| `create_order` **signature unchanged** | ✅ `p_drop_slug text, p_customer_name text, p_phone text, p_phone_normalized text, p_address text, p_city text, p_items jsonb, p_notes text, p_hold_hours integer` |
| **EXECUTE grants survive** (`information_schema.role_routine_grants`) | ✅ `postgres`, `service_role` only — never `anon`/`authenticated`, in all three scenarios |
| `order_items` CHECK | ✅ `order_items_quantity_check` → `CHECK (((quantity >= 1) AND (quantity <= 99)))`, exactly one |

**The function body diff against the 1.04 body is 2 removed / 10 added lines, of which exactly ONE is
executable:** `if v_total_qty < 1 or v_total_qty > 2` → `> 99`. Everything else is comment. The
per-loop `v_qty < 1` → `TR003` guard is intact; step 4 is byte-for-byte untouched.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `npm run build && npm run lint && npx tsc --noEmit` all clean | ✅ |
| `npm test` green, count reported + delta explained | ✅ 176/176 (was 166) — § 5 / § 3 |
| 10 simultaneous orders vs 3 units → exactly 3 succeed, stock 0; output pasted | ✅ |
| 5 simultaneous 3-unit orders → exactly 1 succeeds, 4 × `TR004`, stock 0, zero orphan rows; output pasted | ✅ |
| A single 3-unit order succeeds end to end (previously `TR003`) | ✅ three ways, incl. a real browser checkout — § 5 |
| Closing grep returns nothing outside `src/_project-state/` and `Decisions.md` | ✅ **nothing** |
| `tests/i18n/catalog-parity.test.ts` passes; MK ⇔ EN identical | ✅ **273 keys**, zero MK-only, zero EN-only |
| Migration applies on a fresh DB **and** on top of the existing chain; signature + grants survive | ✅ three scenarios — § 5 |
| Throwaway care value renders in both locales; reverted to null the placeholder is **byte-identical to `main`** | ✅ below |
| `productJsonLd` still returns `null` for all three products — proven | ✅ `grep -c '"@type":"Product"'` = **0** on all three products × both locales, **including while care copy was set** |
| No composition or care text committed; `facts.md` §7 untouched | ✅ `git diff facts.md` empty; `products.ts` diff is +6 comment lines only |
| All three product pages, both locales: composition placeholder present, **no cap line**, buy panel otherwise unchanged | ✅ 6/6 pages: placeholder 1, cap hits 0 |
| `/uslovi` + `/en/terms` render the shortened ordering paragraph | ✅ MK „Спуштањата се ограничени…", EN "Drops are limited…", no first sentence |
| `/kosnicka` + `/en/cart` with 3 units of one variant: `+` enabled, no cap banner, checkout accepts | ✅ screenshots + `TRJ-0055` |
| *(extra)* Sitewide sweep — 16 routes, both locales, for any surviving cap copy | ✅ **0 hits on every route** |

**The care wiring, both states (Task A.4).** Same server, same product, only `products.ts` changed:

```
care = null  (committed state) — MK /katalog/test-mustard-ochre
  <section class="flex flex-col gap-2"><h2 …>Состав и нега</h2>
  <span … data-placeholder="true">[PLACEHOLDER: состав и нега — од етикетата]</span></section>

care = "ТЕСТ"/"TEST"  (throwaway, reverted) — MK
  <section class="flex flex-col gap-2"><h2 …>Состав и нега</h2>
  <p class="text-muted-foreground text-small">ТЕСТ</p></section>
                                                     — EN
  <section class="flex flex-col gap-2"><h2 …>Composition &amp; care</h2>
  <p class="text-muted-foreground text-small">TEST</p></section>

control, same moment — test-off-white (still null) kept its placeholder → the slug keying works,
it is not "any product on the page gets the copy".
```

Byte-identity against `main` was proven mechanically, not by eye: `main`'s `page.tsx` was checked out
under the running dev server, the section HTML captured, then this branch's restored and captured
again. `diff` on both locales: **identical**.

### Owed to the operator

| # | Item | Exact steps | What "pass" looks like |
|---|---|---|---|
| **68** | **⚠ Push the migration to hosted Supabase — an ACTION, not a check** | `supabase db push` (only `20260827120000_remove_order_quantity_cap.sql` is unapplied). **Do this immediately after merge, before any drop opens.** Note `D-1.07-15`: never `supabase db reset --linked`. | On hosted: `create_order` signature unchanged with EXECUTE for `service_role` only; `order_items_quantity_check` reads `between 1 and 99`. |
| **66** | Native MK review of the **four** strings Y.06 changed | `Product.quantityLimit`, `Order.quantityInvalid`, the shortened `Terms.orderingBody2` (`/uslovi`), and `Faq.a3` (`/`, also in the JSON-LD). Two native speakers, in the browser. | All four read as natural Macedonian in the site's ти-form register, and **`Faq.a3` does not over-promise** — it must not read as "buy as much as you like" when stock is 3–5 pieces. |
| **67** | A real 3-unit order on `https://www.trajanovv.com` | At the **2.06 rehearsal**, against a live drop and hosted Supabase. | Accepted; confirmation names a real `TRJ-####`; one `order_items` row of quantity 3; stock −3; notification email arrives. **Also the first live test of the removed cap's downside** — watch whether one person takes the whole drop. |

**⚠ Read #68 before merging.** Between the merge and that push, the deployed UI says **nothing** about
a limit anywhere, while hosted `create_order()` still asserts `1..2`. A customer would add 3 units,
be told nothing, fill in the entire checkout form, and be refused at the final click with
„Провери ја количината во кошничката…" and no way to know what is wrong. This is the single most
important operational fact in this report.

---

## 7. Placeholders shipped

**None added, none cleared.** The placeholder register table in `current-state.md` is **byte-unchanged**.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| *(no new row)* | — | — | — |

Rows **#3** and **#9** (fabric/care for the verified colourways and for Product 03) are **still OPEN
and unchanged**. This phase built the slot they will eventually fill, not the content: every
`careMk`/`careEn` is `null`, `facts.md` §7 still reads `UNVERIFIED — OWED (Vladimir)`, and
`tests/config/product-care.test.ts` now fails the build if composition text is ever committed without
a label to read it off. What changed is the *cost* of clearing them — a one-line config edit plus a
**deploy**, rather than another code phase.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ — and one claim **retired**: the site no longer states a per-order limit anywhere. The two audit docs were amended to match (`facts-audit-2.03.md` rows 85/86/246, `string-inventory.md` rows for `Cart.capNotice`, `Product.oneUnitLimit`, `Order.capViolated`, `Terms.orderingBody2`, `Faq.a3`). |
| `humanizer` pass run on user-facing copy | ✅ — five strings reviewed. The four the brief specified verbatim came back clean: direct address, present tense, no inflated symbolism, no rule of three, no promotional filler, and the em dashes match the established house voice (`Terms.orderingBody1`, `Faq.a5`/`a8`) rather than being an AI tell. **No change was needed, so none was made** — the brief's strings ship as written. The fifth (`Faq.a3`, my own) was written to the same register and checked against the same list. |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ — and specifically **no invented composition**. Not "100% cotton", not anything. |
| Template-propagated strings verified once against `facts.md` | ✅ n/a — no templated generation this phase |
| No AI-generated product imagery (`D-0-6`) | ✅ — zero files under `public/` touched |
| No untranslated EN string in the MK build | ✅ — parity test green at 273 keys; every changed string exists in both catalogs; MK rendering verified in-browser on `/uslovi`, `/`, `/kosnicka`, and all three product pages |

**One claim is newly asserted and worth the operator's eye:** `Faq.a3` now says there is **no
per-order limit**. That is true in code (`D-Y.06-3/4` — 99 is a sanity ceiling, unreachable against
3–5 pieces of stock), and it is sourced the same way the old answer was: to `create_order()`. It is
on register #66 precisely so a human confirms it does not *read* as an invitation.

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ |
| `.env*` still gitignored | ✅ unchanged |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ no env var added or changed |
| No order PII in logs | ✅ no logging added; the browser checkout used obviously-fake data ("ТЕСТ Y06 Нарачка", `070000106`) against the **local** database only, and that order was truncated afterwards |

**No secret was committed at any point in this branch's history.** Local Supabase credentials appear
only in tool output in this session, never in a file. Nothing in the diff carries a value.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| **PR not opened; branch not merged** | The brief requires a **fresh Claude Code session — one that did not write this code — to review the PR against the brief before merge**, and forbids me merging my own PR. Both stand. | Lazar / Petar |
| **Migration not on hosted** (owed #68) | `supabase db push` after merge, before any drop opens | Lazar |
| Native MK review of the four changed strings (owed #66) | Two native speakers | Lazar / Petar |
| A real 3-unit order on production (owed #67) | A live drop — the 2.06 rehearsal | Lazar + Vladimir |
| Fabric/composition/care copy itself (placeholder #3/#9) | **Vladimir reading the actual labels.** The slot is built; the text is not ours to write. | Vladimir |

**On the review gate, plainly, as the brief asks:** this project has **no automated review Action**
(`D-0-3`). A fresh-session read plus the two concurrency proofs are the entire safety net on a change
to `create_order()`. **That is not equivalent to a real review gate** — it is one model reading
another model's diff with no independent test infrastructure behind it, and it cannot catch what
neither session thinks to look for. The evidence I can actually stand behind is the mechanical part:
the function body differs from the proven 1.04 body by **one executable line**, step 4 is untouched,
both concurrency gates pass, and the migration was verified on three separate database states.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ |
| `current-state.md` — owed-verification register (**#66, #67, #68**) | ✅ |
| `current-state.md` — placeholder register (**note added; table byte-unchanged, #3/#9 open**) | ✅ |
| `current-state.md` — Built section (Y.06 entry) | ✅ |
| `file-map.md` — tree (`product-care.ts` + the long-missing `product-images.ts`), the SLUG-keying rule, `cart.ts` line, change-log row | ✅ |
| `00_stack-and-config.md` — no new dep; the migration + the hosted-push requirement recorded | ✅ |
| `Decisions.md` — `D-Y.06-1…9` appended; `D-1.06-6` Status → `Superseded by D-Y.06-3` (**entry body untouched**) | ✅ |

**`NEXT:` line I set:** `NEXT: [P2] /impeccable polish + the closing /impeccable audit — on a NEW
branch. Phase Y.06 — Composition & care wiring + removal of the 2-item order cap — CODE COMPLETE on
branch phase-y.06-care-wiring-and-cap-removal, awaiting the fresh-session PR review and the other
operator's merge.`
