# Part Y · Phase 10 · Code — English prices in dollars, and Product 03 at 1,199 MKD

**Why this matters** — On the English site every price currently reads "1,199 MKD ≈ $22". Lazar wants English visitors to see the price in dollars only, and Product 03 (baby blue) is now priced the same as the other two shirts, 1,199 MKD instead of 1,999 MKD. After this phase the English catalog reads "≈ $22" on all three cards, and the product page still tells the customer exactly how many denars they hand the courier.

**Model & effort** — Claude Opus, reasoning effort medium. One display component, one config value, one EN string, one guarded single-row update on the hosted database.

**Mandatory skills** — `test-driven-development` (the price display and the config value have tests), `designing-and-coding-branded-web-ui` (the dollar figure takes over the price's styling against `brand.md`), `humanizer` (every new or changed EN string), `logging-project-decisions`, `writing-completion-reports`, `syncing-project-state`.

## Context

### Why this phase exists now

Out of order, on Lazar's instruction, 2026-09-29. Line 1 of `current-state.md` names the `/impeccable polish` pass as NEXT. This phase runs before it and does not replace it. Leave the NEXT target unchanged; update only the status text in line 1 to record that Y.10 shipped. Y.09 is merged and its branch is deleted, so the one-branch rule allows a new branch now.

### Read first, by path

* `CLAUDE.md`, especially § Branch & PR rules and § Decisions.
* `facts.md` §7: the `Currency` row and the `USD reference rate` row (both amended in Y.09), the paragraph under the table, and the `### Product 03` sub-block (the `Price | 1999 MKD | VERIFIED — owner, 2026-07-22` row).
* `Decisions.md`: `D-Y.09-4` (approximate USD on EN, MKD stays the price), `D-Y.09-5` (structured data, emails, database stay MKD-only), `D-Y.09-8` (the shared `WithUsdApprox` wrapper), `D-1.04-5` and the "price-after-open" preflight in `scripts/sync-core.ts`, `D-1.07-15` (never `supabase db reset --linked`), `D-Y.07-6` (precedent for a hosted-database change made on Petar's instruction and read back).
* `src/_project-state/current-state.md`: NEXT line, placeholder register, owed-verification register (especially #78, the USD rate going stale).
* `src/_project-state/completions/Part-Y-Phase-09-Completion.md`.

### The code as it stands (verified against `main` at `206fe1c`, 2026-09-29)

* `src/components/system/WithUsdApprox.tsx`: on EN, renders the caller's MKD element followed by a muted `text-small` "≈ $22"; on MK, returns the caller's element untouched.
* Three call sites wrap an MKD price in it: `src/components/product/ProductCard.tsx` (catalog card), `src/components/home/HomeShowcase.tsx` (Home showcase), `src/app/[locale]/catalog/[slug]/page.tsx` (product page, inside `text-price tabular`).
* `src/lib/format.ts`: `formatMkd`, `formatUsdApprox` (EN → "≈ $22", MK → null), `formatMkdWithApproxUsd` (prose: "200 MKD (≈ $4)").
* `src/config/currency.ts`: `MKD_PER_USD = 54.3`, dated 2026-09-29, display only, updated by hand.
* `src/config/products.ts`: `test-baby-blue` has `priceMkd: 1999` (with comments at ~lines 19 and 83 that quote 1999). The two other products are 1199.
* The live site reads prices from the hosted database, not from the config: `src/lib/drop/state.ts` selects `products.price_mkd`. `npm run sync:drop` will refuse to change Product 03's price because its drop (`test-drop`, ended 2026-06-08) has already started (Preflight 3, `scripts/sync-core.ts` ~line 80). That refusal is correct and stays; the hosted row is changed by a single deliberate update (Task 7).
* Cart and checkout show no product price today — row, subtotal and total are placeholders — and the cart shows the delivery cost as "200 MKD (≈ $4)". So on the English site the product page is the only place a customer sees a product price before the courier arrives.
* Tests that quote 1999 or "$37": `tests/format/usd-approx.test.ts`, `tests/home/showcase.test.ts`.
* `Terms.pricesBody` (EN) currently says prices "are shown on the product page" in MKD and that the English site "also" shows an approximate dollar price.

### Facts and decisions supplied for this phase (Lazar + orchestrator, 2026-09-29)

1. Product 03 price: 1,199 MKD (was 1,999). Owner via Lazar, 2026-09-29. At the current reference rate this renders "≈ $22" on EN.
2. English locale, product price displays (catalog card, Home showcase, product page): the dollar figure replaces the denar figure as the displayed price. It renders as "≈ $22" in the styling the MKD figure has today at that call site (same type size, weight, colour, `tabular`), not in the muted small style.
3. The "≈" stays. The dollar figure is a conversion at a hand-updated rate, not a dollar price. Showing "$22" bare would present a converted figure as a set price.
4. The English product page keeps one muted line under the price stating the amount due in denars: "You pay 1,199 MKD in cash on delivery." (amount from `formatMkd`, EN grouping). Reason: the customer pays the courier in denars, and on the English site this is the only place they would otherwise ever see that figure — the cart and checkout show no product price. Rejected: dollars everywhere with no denar figure. That would put an English-reading customer on the doorstep owing an amount the site never showed them, on cash on delivery, under a minor's brand name. The catalog card and the Home showcase do not carry this line — dollars only there.
5. The Macedonian locale does not change. No `$`, and MK price markup byte-identical to `main`.
6. Delivery-cost prose is unchanged ("200 MKD (≈ $4)" on the Shipping page, FAQ answer 5 and its JSON-LD, and the cart). This request was about product prices.
7. Structured data, order emails and the database stay MKD-only (`D-Y.09-5`, unchanged).
8. Hosted database: Product 03's `price_mkd` is set to 1199 by one guarded `UPDATE`, run by Code after the PR is merged and deployed and only on Petar's explicit go in session — precedent `D-Y.07-6`.

## Scope

### In scope

* The EN price display on the catalog card, the Home showcase and the product page (decisions 2–4).
* One new EN string for the amount-due line, with its MK counterpart for key parity.
* `Terms.pricesBody` (EN only) rewritten so it is true after this phase. Terms `LAST_UPDATED` already reads 2026-09-29; leave it unless you change it on a later day.
* Product 03's price in `src/config/products.ts` (value and the comments quoting it), in `facts.md` §7, and in the hosted database.
* Tests, state files, decisions, completion report.

### Out of scope — do not touch

* Any MK rendering or MK copy (except adding the one parity key, which MK does not render).
* Delivery-cost prose, `formatMkdWithApproxUsd`, the Shipping page, FAQ, cart.
* `src/config/currency.ts` and the rate. Do not re-check or change it.
* Product JSON-LD, FAQPage JSON-LD, order emails, `create_order()`, migrations, stock, variants, drop windows, images, routes.
* The sync preflight that refuses price changes after a drop starts — do not weaken, bypass or flag it off.
* The two stale public claims from `D-Y.09-12` (`llms.txt` "maximum of 2 units", „величини — примерок").
* `package.json`, new dependencies.

## Tasks

1. **Branch.** From up-to-date `main`, cut `phase-Y.10-usd-prices-p03`. Commit this brief to `briefs/Part-Y-Phase-10-Code.md` as the first commit so the reviewer can diff against it.
2. **Tests first** (`test-driven-development`). Write failing tests for:
   * EN price display at each of the three call sites renders "≈ $22" for 1199 and contains no "MKD" in the price element.
   * MK price display at each call site is unchanged ("1.199 ден", no `$`).
   * The EN product page renders the amount-due line "You pay 1,199 MKD in cash on delivery."; the EN card and showcase do not; MK renders no amount-due line.
   * `test-baby-blue` in `src/config/products.ts` is 1199. Update `tests/format/usd-approx.test.ts` and `tests/home/showcase.test.ts` where they assert 1999 or "$37".
3. **Price display.** Replace the EN behaviour of `WithUsdApprox` so that on EN it renders the dollar figure as the price in the caller's price styling, and on MK returns the caller's element untouched exactly as today. Rename the component if the old name would now mislead a reader; log the name in a decision. Do not hardcode colours or sizes — tokens only, per `brand.md`.
4. **Amount-due line (product page, EN only).** Add `Product.amountDue` to `src/messages/en.json` — "You pay {amount} in cash on delivery." — and to `src/messages/mk.json` — „Плаќате {amount} во готово при достава." (parity only; MK does not render it). Render it on the EN product page directly under the price, muted, `text-small`. Run `humanizer` on the EN string. If the i18n inventory or a test flags an unrendered MK key, follow the repo's existing convention for locale-specific keys and log what you did.
5. **Terms copy (EN).** Rewrite `Terms.pricesBody` in `en.json` to say, in plain words: prices are set in Macedonian denars and that is what you pay the courier; the English site shows prices in US dollars as an approximate guide; the product page shows the exact amount in denars; you always pay in denars. `humanizer` pass. Leave the MK string as it is — it remains true.
6. **Product 03 price.**
   * `src/config/products.ts`: `test-baby-blue` `priceMkd: 1999` → `1199`; update the comments that quote 1999.
   * `facts.md` §7 `### Product 03`: strike the `1999 MKD — VERIFIED, owner, 2026-07-22` row through with its date kept visible, and add `Price | 1199 MKD | VERIFIED — owner via Lazar, 2026-09-29`. Fix any prose in that sub-block that quotes 1999. Add a changelog row. Header "Last updated" → 2026-09-29.
   * `facts.md` §7 Currency paragraph: amend (strike-and-date, not delete) the sentence that says the EN site shows the dollar figure "beside" each denar price, so it matches decisions 2–4.
   * Local database only: to render the new price locally, `supabase db reset` (local) then `npm run sync:drop` against local, as in `D-Y.08-9`. Never `--linked`.
7. **Hosted database — only after merge and deploy, and only on Petar's explicit go in this session.**
   * Precondition checks, reported with their output: no drop is open (`test-drop` ended 2026-06-08); the current hosted row reads `test-baby-blue | 1999`.
   * Run exactly one statement, using the same hosted connection `npm run sync:drop` uses: `update products set price_mkd = 1199 where slug = 'test-baby-blue' and price_mkd = 1999 returning slug, price_mkd;` It must return exactly one row. If it returns zero or more than one, stop and report — do not retry with a different statement.
   * Read the row back with a separate `select`. Do not touch any other row, `stock`, `variants` or `order_items`. Do not run `supabase db reset --linked` or `db push`.
8. **Render and check** (`designing-and-coding-branded-web-ui`). Locally, at 390 px and 1280 px, both locales: `/katalog`, `/en/catalog`, `/`, `/en`, all three product pages in both locales, `/en/terms`. Confirm against `brand.md` that the dollar figure matches the old MKD figure's styling at each call site and nothing wraps badly at 390 px.
9. **Checks.** `npm test` (including the 10-vs-3 oversell gate), lint, typecheck, build — all clean.
10. **PR.** Open the PR from `phase-Y.10-usd-prices-p03`. Do not merge on your own; merge only on Petar's explicit instruction in session, then run Task 7, then Task 11.
11. **Production verification** on `https://www.trajanovv.com` after deploy and after Task 7:
    * `/en/catalog`: three cards, each "≈ $22", zero "MKD" in any price.
    * `/en/catalog/test-baby-blue`: price "≈ $22"; line "You pay 1,199 MKD in cash on delivery."
    * `/katalog` and `/katalog/test-baby-blue`: „1.199 ден" on all three, zero `$`.
    * `/en` showcase: "≈ $22"; `/` showcase: „1.199 ден".
    * `/en/terms`: new prices paragraph.
    * Shipping page and cart delivery line unchanged ("200 MKD (≈ $4)" / „200 ден").
12. **State and decisions.** Log `D-Y.10-n` in `Decisions.md` — at minimum: out-of-order run with NEXT unchanged; decisions 2–4 above (with the rejected alternative in 4 and its reason); `D-Y.09-4` marked Superseded in part by the new entry (only its "the USD figure is shown next to the MKD price" clause — MKD remains the price and the amount paid); the component name; the hosted update and its read-back. Update `current-state.md` (line 1 status text only, Status section, owed register), `file-map.md` if a file was renamed. Owed items to add: Petar reads the PR diff (`D-0-3`); real-phone look at `/en/catalog` and one EN product page. Add a note to existing owed #78: the rate is now the headline price on the English site, so staleness shows directly on the price.
13. **Completion report** per `writing-completion-reports`, including every decision you made that this brief did not make, listed for ratification.

## Definition of Done

### Verifiable by Code

* [ ] Branch `phase-Y.10-usd-prices-p03`; this brief committed as the first commit.
* [ ] EN catalog card, showcase and product page render "≈ $22" as the price, in the old MKD figure's styling; no "MKD" in any of those price elements.
* [ ] EN product page renders "You pay 1,199 MKD in cash on delivery." under the price; EN card and showcase do not.
* [ ] MK price markup byte-identical to `main` at all three call sites; zero `$` on any MK page.
* [ ] Delivery-cost prose, Shipping page, FAQ + FAQ JSON-LD, cart unchanged.
* [ ] `src/config/products.ts` `test-baby-blue` = 1199, comments updated.
* [ ] `facts.md` §7 Product 03 price amended strike-and-date to 1199 (owner via Lazar, 2026-09-29); Currency paragraph amended; changelog row added.
* [ ] `Terms.pricesBody` EN rewritten and humanized; MK unchanged.
* [ ] `Product.amountDue` present in both catalogs.
* [ ] Sync preflight 3 untouched.
* [ ] `npm test` all green incl. the 10-vs-3 oversell gate; lint 0 errors; typecheck clean; build clean.
* [ ] Rendered locally at 390 px and 1280 px in both locales on the pages listed in Task 8.
* [ ] After merge, on Petar's go: hosted `UPDATE` returned exactly one row; separate read-back shows `test-baby-blue | 1199`; no other row changed.
* [ ] Production checks in Task 11 all pass.
* [ ] `Decisions.md`, `current-state.md` (NEXT target unchanged), `file-map.md` if needed, completion report written.

### Owed to Lazar / Petar

* [ ] Petar reads the PR diff before merging (`D-0-3`).
* [ ] Real-phone look at `/en/catalog` and `/en/catalog/test-baby-blue`.
* [ ] Owed #78 (USD rate goes stale) — re-check the rate before the first real drop.

## Hard stops

* Do not run the hosted `UPDATE` without Petar's explicit go in this session, or before the PR is merged and deployed.
* Never `supabase db reset --linked`, never `db push`, never edit `stock`.
* Do not remove the denar amount-due line from the EN product page, and do not show a bare "$" without "≈".
* Do not change the NEXT target on line 1 of `current-state.md`.

## Outputs & where they go

* Code on branch `phase-Y.10-usd-prices-p03`, one PR.
* Brief → `briefs/Part-Y-Phase-10-Code.md`.
* Completion report → `src/_project-state/completions/Part-Y-Phase-10-Completion.md`.
