# Part Y · Phase 11 · Code — Product 03 hosted price + honest display and wording

**Why this matters —** the live site shows the blue shirt at the old price, shows internal notes to customers, and contradicts itself on stock. This phase fixes the price in the database and makes every public page true in both languages — without opening a drop and without touching cart/checkout logic (that is Y.12).

**Model & effort —** Claude Opus, high effort.
**Mandatory skills —** test-driven-development, systematic-debugging, designing-and-coding-branded-web-ui, humanizer, logging-project-decisions, syncing-project-state, writing-completion-reports, verification-before-completion.

## Context — read first, in this order
1. `CLAUDE.md`
2. `src/_project-state/current-state.md` — line 1, Status, owed register, placeholder register
3. `facts.md` §7 and §8
4. `brand.md`; `docs/design-handovers/Part-1-Phase-02-Handover.md`
5. `Decisions.md`: D-0-3, D-0-6, D-1.04-5, D-2.05-2, D-2.25-26, D-Y.06-3/4, D-Y.09-2/3/4/5/12, D-Y.10-1…8
6. `briefs/Part-Y-Phase-10-Code.md` (Tasks 7 and 11) and `src/_project-state/completions/Part-Y-Phase-10-Completion.md`

**Reconciliation rule.** Where a status or instruction file contradicts git history, a later Decisions entry or `facts.md`, the later approved source wins. Fix only current-status narrative and stale comments; never edit or delete a past Decisions entry. List every reconciliation in the report. Known stale items:
- `current-state.md` line 1 says Y.10 "PR OPEN, NOT MERGED" — git shows PR #45 merged at `cf77299`. Verify with `git log`.
- `CLAUDE.md` "max 2 units per order" — superseded by D-Y.06-3 (99-unit sanity ceiling, D-Y.06-4). Never restore a 2-unit limit.

## Decisions made for this phase (Lazar + orchestrator, 2026-10-02) — log each as D-Y.11-n with alternative rejected and downside accepted
1. Runs out of order ahead of NEXT (`/impeccable polish`, D-2.25-26). NEXT line text unchanged.
2. Y.10 Task 7 (hosted Product 03 price → 1199) is executed in this session, on Petar's explicit go, exactly as written in the Y.10 brief. Closes owed #81 if it passes.
3. **Public presentation of unresolved content (amends the CLAUDE.md "Content truth" placeholder rule).** Customer pages never show internal notes, the client's name as a task owner, "later phase", or `[PLACEHOLDER: …]` markup. A missing fact is omitted (when omission states nothing false) or shown as a neutral customer-language gap. Every such gap keeps its placeholder-register row OPEN; the register must still reach zero before the first real drop (D-2.05-2 unchanged). Rewrite the CLAUDE.md rule to say exactly this. Rejected: raw markers on public pages. Downside: the site looks more finished than it is; a sync lock follows in Y.12, and until then nobody syncs an open or future drop to hosted.
4. Product names stay the neutral "Product 01/02/03" / „Производ 01/02/03" until Vladimir supplies real ones. Invent nothing.
5. MK term for "drop" is „дроп" (дропот, дропови, следниот дроп), consistently, including metadata, alt and aria text, and JSON-LD. Native reviewer confirms (owed).
6. MK slogan `Home.sub` is NOT changed. Candidate „Пронајди сродна душа во свет полн со продадени души." goes into the review pack only, marked "awaiting Vladimir".
7. Ended or no-drop state: product and catalog pages show NO stock badge and NO per-size counts. Buy button disabled with new label "Ordering is closed" / „Нарачките се затворени" — never "Sold out". "Sold out" only when stock is 0 in a live drop. Server purchase gating unchanged.
8. The empty second photo slot on mustard and off-white is omitted (gallery shows real photos only). Register #2 stays OPEN with a dated note.

## Scope
**In scope:** the tasks below.
**Out of scope — do not touch:** cart and checkout price/total logic, `CartView.tsx`, `CheckoutForm.tsx`, the order email, `scripts/sync-core.ts`, Privacy claims beyond the two wording edits in Task 13 (all Y.12); `create_order()` and all migrations; stock, reservations, rate limiting, Turnstile, COD; `drops.ts` dates; `src/config/currency.ts`; `package.json`; visual redesign; any returns copy, seller entity or address.

## Hard stops — stop and report instead of proceeding
- The ONLY hosted database action allowed is the single Y.10 Task 7 statement, after Petar types "go" in this session. No `db push`, never `db reset --linked`, no `sync:drop` against hosted, no other hosted SQL. Never print a database URL or key.
- No production orders, emails, stock changes, drop opening or deployment. No merge — Petar merges after Lazar reviews (D-0-3).
- Before any DB-backed test: prove `SUPABASE_DB_URL` and `NEXT_PUBLIC_SUPABASE_URL` point at `127.0.0.1`/`localhost`. Clear any hosted URL exported for Task 1 first. If the check fails, stop.
- If a fact you need is not VERIFIED in `facts.md`, do not write it — report it.

## Tasks
1. **Hosted Product 03 price (Y.10 Task 7), before any branch work.**
   - Show the precondition output to Petar: no drop is open (`test-drop` ended); the hosted row reads `test-baby-blue | 1999`.
   - Then ask Petar to type "go". Without it, skip to Task 2 and record #81 as still owed.
   - On "go", using the hosted connection `npm run sync:drop` uses, run exactly: `update products set price_mkd = 1199 where slug = 'test-baby-blue' and price_mkd = 1999 returning slug, price_mkd;`
   - It must return exactly one row. Zero or more than one → stop and report; do not retry with a different statement.
   - Read back with a separate `select`. Touch no other row, `stock`, `variants` or `order_items`.
   - Then run Y.10 Task 11 production checks:
     - `/en/catalog/test-baby-blue` shows "≈ $22" and "You pay 1,199 MKD in cash on delivery."
     - `/katalog/test-baby-blue` shows „1.199 ден"
     - all three cards are equal on `/en/catalog`, `/katalog`, `/en`, `/`
   - If pages still show the old price, diagnose caching (route revalidation, fetch cache) and report. Do not redeploy.
2. **Branch + record Y.10.** From up-to-date `main`, cut `phase-Y.11-honest-display`. First commit: this brief at `briefs/Part-Y-Phase-11-Code.md`. Update `current-state.md` to record the Y.10 merge (PR #45, `cf77299`) and the Task 1 result.
3. **Test-DB safety guard.** In `tests/setup.ts`, throw unless both DB env values resolve to `127.0.0.1` or `localhost`. Test the guard. Run DB suites only against local Supabase (local reset + `npm run sync:drop` against local only, per D-Y.08-9).
4. **Tests first** for every behaviour below (TDD). The 10-vs-3 concurrency test stays unchanged and green.
5. **Banner, size label, photo slot (decisions 3, 8).**
   - Remove `PreviewNotice` from `src/app/[locale]/catalog/page.tsx` and `catalog/[slug]/page.tsx`. Keep it only where `/styleguide` uses it.
   - Remove the unconditional `Placeholder.sizesSample` in `src/components/product/AddToCartPanel.tsx:76`.
   - Implement decision 8.
   - Inventory every remaining `[PLACEHOLDER`, `Placeholder.*` use and "Vladimir"/„Владимир"-as-task string in `src/`. Classify each as customer-facing, styleguide/dev fixture, input hint, or cart/checkout (deferred to Y.12), and include the table in the report.
   - Add a test that fails if home, catalog, product, about, contact, terms, privacy, shipping or 404 renders `[PLACEHOLDER` or the old notice text.
6. **Ended vs sold out (decision 7).** Change the `buyState` mapping in `catalog/[slug]/page.tsx` (~99–108) and the catalog card equivalent. Add the new label keys in EN and MK. Hide stock badges and counts in ended/no-drop states.
7. **Price wording near the buy decision.**
   - On the product page, both locales, state the delivery cost (200 MKD, from `DELIVERY_COST_MKD`) beside the price and COD note.
   - Rewrite `Product.amountDue` so it reads as the shirt price, not an all-in amount (EN e.g. "1,199 MKD per shirt in cash on delivery, plus 200 MKD delivery"; MK uses informal „Плаќаш").
   - Update `Terms.pricesBody` EN + MK to mention the separate delivery cost.
   - Humanizer on EN.
8. **MK number formatting.** Make `formatMkd` in `src/lib/format.ts` deterministic for MK (dot grouping, "1.199 ден") without depending on runtime ICU. Fix the Home showcase so server and client render identically (no hydration mismatch). Tests for both paths.
9. **Localized 404.** Add `src/app/[locale]/not-found.tsx` (branded, MK/EN, links to home and catalog, noindex), the locale catch-all route that calls `notFound()`, and a root fallback. Verify HTTP 404 for an unknown path in each locale and an unknown product slug.
10. **State-true copy.**
    - FAQ a1 + its FAQPage JSON-LD: ordering opens only during a drop; follow the Instagram handle from `facts.md` for the next one. No timer promise.
    - `Meta.catalogDescription`: no "active drop".
    - "3 to 5 pieces" → "3 to 5 products" (`facts.md` §7) in FAQ a8, About body3, `Meta.homeDescription`, MK equivalents.
    - `src/app/llms.txt/route.ts` ~58: remove "maximum of 2 units per order" and "a countdown marks the next one". Test that `llms.txt` has no unit limit.
11. **Plurals + manifest.**
    - ICU plurals for `Drop.days/hours` (visual labels and full-word aria text in `Countdown.tsx` ~133–135, 150–154) and `Drop.remaining`. Cases: EN 1 DAY / 2 DAYS, MK 1 ДЕН / 2 ДЕНА, 1 ЧАС / 2 ЧАСА, „Преостанува 1" / „Преостануваат 2".
    - `src/app/manifest.ts` keeps `lang: 'mk'`; its description becomes the MK `Meta.homeDescription` value.
12. **MK fixes.** Apply:
    - „дроп" everywhere
    - „ќе стигне до нула" (Home.headline, Catalog.countdownIntro)
    - replace „во живо" with wording that means ordering is open
    - FAQ a7: „Маиците се со оверсајз унисекс крој."
    - ShippingReturns.intro: „кому да се јавиш"
    - Checkout.notePlaceholder: „Влез, кат, ориентир…"
    - Credit.opensInNewTab: „се отвора во ново јазиче"

    Preserve quotations and proper names (Trajanov, Cultural Chat, Трн.мк, Струмица Денес). Write `docs/i18n/mk-review-y11.md`: every changed MK string old → new, marked grammar / terminology / style, plus the slogan candidate (not applied).
13. **EN plain language.**
    - FAQ a1: "nothing is buyable" → ordering is closed
    - FAQ a8: drop "counted on the server, not on the screen"
    - Privacy browserBody: no "sessionStorage" — the cart stays in this browser tab and clears when it closes
    - Privacy deleteBody: "delete your data"

    Clearer, not flowery. Humanizer pass.
14. **CLAUDE.md** — amend the units rule (D-Y.06-3/4) and the placeholder rule (decision 3). Log both.
15. **Checks.** `npm test` (all, incl. 10-vs-3), `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run i18n:inventory` — EN/MK key parity and matching interpolation variables.
16. **Render, local only.** Both locales at 390 px and 1280 px: home, catalog, all three products, terms, privacy, shipping, 404 — in ended (default), countdown and live (`?preview=`, dev only), and sold-out (local stock 0) states. Check against the handover and `brand.md`.
17. **Close.** Update `current-state.md` (Status, owed register, placeholder register — rows stay OPEN with dated notes), `file-map.md`, `Decisions.md`. Write the completion report listing every decision you made that this brief did not, for ratification. Open the PR from `phase-Y.11-honest-display`. Do not merge.

## Definition of Done
### Verifiable by Code
- [ ] Task 1: one row updated, read-back `test-baby-blue | 1199`, production pages show ≈ $22 / 1,199 MKD / 1.199 ден — or recorded as not run, with the reason.
- [ ] Branch `phase-Y.11-honest-display`; brief is the first commit; Y.10 merge recorded.
- [ ] `tests/setup.ts` refuses non-local DB URLs (tested).
- [ ] Listed pages render no `[PLACEHOLDER`, preview notice or "sizes — sample" (tested); inventory table in report.
- [ ] Ended state: no stock badge or count; button "Ordering is closed" / „Нарачките се затворени" (tested).
- [ ] Product page and Terms state the delivery cost separately from the shirt price, both locales.
- [ ] MK prices „1.199 ден" identical on Home showcase, catalog and product, server and client.
- [ ] Unknown path and unknown slug → HTTP 404 with localized page, both locales.
- [ ] Plural tests pass for 1 and 2 days/hours/remaining in both locales, including aria text.
- [ ] `llms.txt` has no unit limit and no timer promise (tested); FAQ JSON-LD equals visible FAQ.
- [ ] EN/MK key sets and interpolation variables identical; `i18n:inventory` clean.
- [ ] Every new or changed factual claim traces to a VERIFIED `facts.md` row (listed in report).
- [ ] `npm test` all green incl. 10-vs-3; lint 0 errors; typecheck clean; build clean.
- [ ] Render matrix done with a per-page pass list; `mk-review-y11.md` exists; CLAUDE.md amended; decisions logged.

### Owed to Lazar / Petar (add to the owed register)
- [ ] Lazar reads the PR diff before Petar merges (D-0-3).
- [ ] Native MK review of `docs/i18n/mk-review-y11.md`.
- [ ] After deploy: production read-back — no banner, no "sample" label, no "Sold out" on ended pages, „1.199 ден" on MK, `llms.txt` clean, 404 works.
- [ ] Real-phone check of a product page and the 404 page, both locales.

## Outputs
- PR from `phase-Y.11-honest-display`
- `docs/i18n/mk-review-y11.md`
- Completion report → `src/_project-state/completions/Part-Y-Phase-11-Completion.md`
