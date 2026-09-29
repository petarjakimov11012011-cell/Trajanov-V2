# Part Y · Phase 09 · Code — Shipping page: 200 MKD delivery cost, returns section removed, approximate USD on the English site

*Committed by Code from the brief supplied in session on 2026-09-29, so the PR reviewer can check the diff
against it. Text as supplied; only markdown formatting added.*

**Why this matters —** The shipping page still says the delivery cost is unknown and shows two placeholder
boxes. Vladimir's side has now confirmed the cost (200 MKD), Lazar has decided to drop the returns section
entirely, and English-language visitors will now see an approximate dollar figure next to every denar
price. Customers get a real price for delivery, and two placeholder rows close.

**Model & effort —** Claude Opus, reasoning effort medium. Copy, config and one formatter. No database, no
order path, no images.

**Mandatory skills —** `test-driven-development` (the formatter and the delivery-cost constant are logic
with tests), `designing-and-coding-branded-web-ui` (placing the USD figure against `brand.md`), `humanizer`
(every new or changed EN string), `logging-project-decisions`, `writing-completion-reports`,
`syncing-project-state`.

## Context

### Why this phase exists now

Out of order, on Lazar's instruction, 2026-09-29. Line 1 of `current-state.md` names the
`/impeccable polish` pass as NEXT. This phase runs before it and does not replace it. Leave the NEXT target
unchanged. Update only the status text in line 1 to record that Y.09 shipped.

### Read first, by path

- `CLAUDE.md`, especially § Branch & PR rules and § Decisions.
- `facts.md` §7: the `Currency` row ("the site renders MKD only, never USD", 2026-07-18), the
  `Delivery time` row (3–5 business days, VERIFIED), the `Courier + delivery cost` row (UNVERIFIED — OWED),
  and the paragraph under the table ("no USD figure ever renders").
- `src/_project-state/current-state.md`: NEXT line, the placeholder register (the courier + delivery cost
  row and the returns and exchange window row), and the owed-verification register.
- `Decisions.md`: the 2.01 decision behind "Never a currency conversion" (referenced in
  `src/lib/format.ts` as "D-2.01, Task 8"; find its ID), `D-2.03` (Shipping & Returns page, placeholders),
  `D-2.11-5` (FAQ copy and FAQPage JSON-LD share one key list).

### The code as it stands (verified against `main` at `eab5333`, 2026-09-29)

- `src/lib/format.ts`: `formatMkd(amount, currency, locale)`, whose comment says MKD always and never a
  conversion. Used by `ProductCard.tsx`, `HomeShowcase.tsx` and `src/app/[locale]/catalog/[slug]/page.tsx`.
- `src/app/[locale]/shipping-returns/page.tsx` has six sections: where, payment, delivery (with
  `<Placeholder>{tp('courier')}</Placeholder>`), problem (phone), limits ("What we can't do yet"), and
  returns (with `<Placeholder>{tp('returnsWindow')}</Placeholder>`). `LAST_UPDATED = '2026-07-19'`.
- `src/i18n/routing.ts`: `'/shipping-returns': {mk: '/isporaka-i-vrakjanje', en: '/shipping-returns'}`.
- `src/messages/{mk,en}.json`:
  - Nav label `shipping`: EN "Shipping & returns" / MK „Испорака и враќање".
  - `ShippingReturns.*`: h1, intro, `deliveryHeading`, `deliveryBody` (says the cost is not confirmed),
    `limitsHeading/Body`, `returnsHeading/Body`.
  - `FAQ.a5` (both locales) says the courier and delivery cost are not confirmed. It feeds the visible FAQ
    and the FAQPage JSON-LD (`src/lib/faq.ts`, `src/lib/seo/faq-jsonld.ts`).
  - `Terms.pricesBody` (both locales) ends "There is no conversion to any other currency." / „Нема
    конверзија во друга валута."
  - `Cart.shippingValue`: "calculated on delivery". The cart computes no total.
  - `Meta.shippingTitle`: "Shipping & returns — Trajanov".
  - `Placeholder.courier`, `Placeholder.returnsWindow`.
- `src/app/llms.txt/route.ts` line 35: `label: 'Shipping & Returns'`, `note: 'How delivery and returns work.'`
- `src/app/[locale]/terms/page.tsx`: `LAST_UPDATED = '2026-07-19'`.
- `src/lib/seo/product-jsonld.ts`: currency is always MKD.

### Facts supplied for this phase (Lazar, 2026-09-29)

- Delivery cost: 200 MKD. The customer pays it. Delivery time 3–5 business days is unchanged and still
  correct.
- The courier's name was not supplied. It is not rendered anywhere after this phase.
- Returns: Lazar's decision is to remove the returns and exchange window from the site entirely, and make
  the page about shipping only.
- USD: Lazar's decision is that the English site shows prices in dollars as well. Settled with the
  orchestrator: MKD stays the price and the amount the customer pays. The USD figure is an approximation
  shown next to it, on the English locale only. Showing USD alone would misstate what a cash-on-delivery
  customer hands the courier, so that is not an option.

## Scope

### In scope

- The Shipping page: new delivery-cost copy, the courier placeholder removed, the "What we can't do yet"
  section and the "Returns and exchange window" section removed, retitled "Shipping".
- One delivery-cost constant, rendered through one formatter everywhere the cost appears.
- An approximate-USD figure next to every rendered MKD price on the EN locale.
- Every string that says the delivery cost is unconfirmed, in both locales.
- `Terms.pricesBody` in both locales. `LAST_UPDATED` on Terms and Shipping.
- `facts.md`, `Decisions.md`, `current-state.md`, `file-map.md`, string inventory, MK review pack.

### Out of scope, do not touch

- Route slugs in `src/i18n/routing.ts`. `/shipping-returns` and `/isporaka-i-vrakjanje` stay as they are,
  so existing links, the sitemap and search results don't break.
- `supabase/`, `create_order`, `expire_reservations`, order emails, `src/lib/drop/`, `src/config/drops.ts`,
  `src/config/products.ts`, `npm run sync:drop`. No price, stock or order total changes. The cart still
  computes no total.
- `src/lib/seo/product-jsonld.ts` and every other structured-data price: MKD only (it must state the
  currency actually charged).
- Product photos, `src/lib/product-images.ts`, `PhotoSlot.tsx`. The Product 01 photo Lazar sent is held
  (see the completion-report note below) and is not part of this phase.
- The MK locale shows no USD anywhere.
- The "If something is wrong with your order" section and phone link: kept, unchanged.
- The Privacy page. `globals.css`, `brand.md`, `next.config.ts`, npm dependencies.
- The Styleguide page, except removing a now-unused placeholder key if the styleguide references it.

## Tasks

1. **Preflight.** Confirm `main` is clean and no other phase branch is unmerged. Cut
   `phase-Y.09-shipping-and-usd`. If `npm test` fails on clean `main` because the seeded drop windows are
   stale, run a local-only `supabase db reset` + `npm run sync:drop` as in `D-Y.08-9`. Never `--linked`
   (`D-1.07-15`).
2. **Tests first (red).** Write and watch fail:
   - The approximate-USD formatter (Task 3): `en` + 1199 → `≈ $22`; `en` + 1999 → `≈ $37`; `en` + 200 →
     `≈ $4`; `mk` + any amount → `null` (no USD rendered).
   - `DELIVERY_COST_MKD === 200`.
   - No string in `src/messages/mk.json` or `en.json` contains the literal `200` for the delivery cost (the
     figure is interpolated from the constant, never typed into copy).
   - No string in either catalog still says the delivery cost is unconfirmed (match on the EN phrase
     "aren't confirmed" / "not confirmed" and the MK „сè уште не се потврдени" / „сè уште ги немаме
     потврдено" in delivery context).
   - The Shipping page renders no `Placeholder` element.
3. **Currency config + formatter.**
   - New `src/config/currency.ts`: `MKD_PER_USD = 54.3` and `USD_RATE_DATE = '2026-09-29'`, with a comment
     saying this is a mid-market reference rate (1,000 MKD = 18.43 USD on 2026-09-29), for display only,
     updated by hand, and never used to compute anything charged.
   - `DELIVERY_COST_MKD = 200` lives next to the other commerce config (in `src/config/`; pick the file and
     state it in the report), with a comment citing `facts.md` §7.
   - In `src/lib/format.ts`, add `formatUsdApprox(amountMkd, locale): string | null` → `null` unless
     `locale === 'en'`; otherwise `≈ $<whole dollars>`, rounded half-up from `amountMkd / MKD_PER_USD`.
     Leave `formatMkd` unchanged. Rewrite the file's header comment: MKD is still the price and the amount
     paid; EN adds an approximate USD reference (`D-Y.09-4`).
4. **Render the USD figure on EN** wherever `formatMkd` renders a price: `ProductCard.tsx`,
   `HomeShowcase.tsx`, `catalog/[slug]/page.tsx`. The MKD figure keeps its current type, weight and
   position. The USD figure comes after it, in the muted foreground colour at the `text-small` token, never
   larger or heavier than the MKD figure. It sits on the same line where it fits and wraps below where it
   doesn't. It must not truncate at 390 px on the two-column catalog grid. On MK nothing changes.
5. **Delivery cost everywhere it's stated** (both locales, interpolated with ICU `{cost}`; EN cost =
   `200 MKD (≈ $4)`, MK cost = `200 ден`, built from `formatMkd` + `formatUsdApprox`):
   - `ShippingReturns.deliveryHeading`: EN "Delivery time and cost" / MK „Рок и цена на достава".
   - `ShippingReturns.deliveryBody`: EN "Delivery cost: {cost}." / MK „Цена на достава: {cost}." It reads
     as a pair with the existing `deliveryTime` line above it.
   - Remove `<Placeholder>{tp('courier')}</Placeholder>` from the page.
   - `FAQ.a5`: EN "Delivery takes 3 to 5 business days and costs {cost}. You pay cash at the door." / MK
     „Рок на достава: 3–5 работни дена. Цената на доставата е {cost}. Плаќаш готовина на врата." Confirm the
     FAQPage JSON-LD receives the interpolated text, not a literal `{cost}` (template-propagated: one key,
     two outputs, `D-2.11-5`).
   - `Cart.shippingValue`: the `{cost}` value, both locales. The cart still shows no total.
   - Grep both catalogs for any other string stating the delivery cost is unknown and update it the same
     way. List every key changed in the report.
6. **Remove returns, retitle the page "Shipping."**
   - Delete the "What we can't do yet" section (`limitsHeading/Body`) and the "Returns and exchange window"
     section (`returnsHeading/Body` + the `returnsWindow` placeholder) from the page and from both catalogs.
   - `ShippingReturns.h1`: EN "Shipping" / MK „Испорака". Nav label `shipping`: same. `Meta.shippingTitle`:
     EN "Shipping — Trajanov" / MK equivalent.
   - `ShippingReturns.intro`: EN "Where we ship, how you pay, what delivery costs, and who to call if
     something goes wrong." / MK „Каде испорачуваме, како плаќаш, колку чини доставата и кого да го викаш
     ако нешто тргне наопаку."
   - `llms.txt`: label "Shipping", note "How delivery works."
   - Delete `Placeholder.courier` and `Placeholder.returnsWindow` if nothing else references them. MK ⇔ EN
     key counts stay identical.
   - Update the page's header comment: the cost is filled (`D-Y.09-2`), the returns content was removed by
     owner decision (`D-Y.09-3`), and route slugs were deliberately kept.
   - `LAST_UPDATED` → `'2026-09-29'`.
7. **Terms, prices.** `Terms.pricesBody`:
   - EN: "Prices are in Macedonian denars (MKD) and shown on the product page. That is the amount you pay
     the courier. On the English site we also show an approximate price in US dollars, for reference only.
     You always pay in denars."
   - MK: „Цените се во денари (MKD) и стојат на страницата на производот. Тоа е износот што му го плаќаш на
     курирот. На англиската верзија прикажуваме и приближна цена во долари, само за информација. Секогаш
     плаќаш во денари."
   - Terms `LAST_UPDATED` → `'2026-09-29'`.
8. **Copy pass.** Run `humanizer` on every new or changed EN string. Any change it proposes must keep the
   facts exactly as stated above. Regenerate `docs/i18n/string-inventory.md`. Commit an unsigned MK review
   pack at `docs/i18n/mk-review-y09.md` listing every new or changed MK string.
9. **Render check.** At 390 px and 1280 px: `/en`, `/en/catalog`, all three `/en/catalog/<slug>`,
   `/en/shipping-returns`, `/en/terms`, `/en/cart`, and the MK equivalents `/`, `/katalog`,
   `/katalog/test-mustard-ochre`, `/isporaka-i-vrakjanje`, `/uslovi`, `/kosnicka`. Confirm: EN shows `≈ $`
   next to every price and in the delivery cost; MK shows no `$` anywhere; the Shipping page has four
   sections (where, payment, delivery time and cost, if something is wrong) and no placeholder.
10. **`facts.md`** (dated 2026-09-29, changelog row):
    - `Courier + delivery cost` row → split into Delivery cost: 200 MKD, VERIFIED, owner via Lazar,
      2026-09-29 and Courier name: not supplied, not rendered anywhere.
    - `Currency` row: amended, not deleted → "MKD is the price and the amount paid. The EN locale also shows
      an approximate USD reference at a fixed rate (below); MK shows MKD only." Status: owner decision via
      Lazar, 2026-09-29, `D-Y.09-4`. Keep the 2026-07-18 wording visible as struck through with its date,
      same pattern as the retired price-ceiling row.
    - New row: USD reference rate: 1 USD = 54.3 MKD, mid-market, 2026-09-29, display only.
    - Rewrite the "no USD figure ever renders" sentence under the table the same way (amend, date it).
    - Returns and exchange window: record that the site makes no statement about a returns window by owner
      decision (`D-Y.09-3`). The window itself remains unknown.
11. **Decisions** (append-only, each with alternative rejected + downside accepted):
    - `D-Y.09-1`: Phase run out of order ahead of NEXT, on Lazar's instruction. NEXT target unchanged.
    - `D-Y.09-2`: Delivery cost 200 MKD rendered from one constant. The courier's name is not rendered and
      "Courier" leaves the heading. Rejected: keeping a courier-name placeholder. Downside: a customer
      doesn't know which company will knock on the door.
    - `D-Y.09-3`: Returns window and "What we can't do yet" removed; page retitled "Shipping"; route slugs
      kept. Decided by Lazar. Rejected: keeping the placeholder until Vladimir supplies a window. Downside:
      the site now says nothing about returns. A customer who wants to send a shirt back has only the phone
      number under "If something is wrong". Consumer rights the law gives a distance-selling customer apply
      whatever the page says. The URL still says "returns" while the page doesn't.
    - `D-Y.09-4`: Approximate USD on EN only, MKD primary. Fixed hand-updated rate 54.3, whole dollars, `≈`
      prefix. Decided by Lazar; supersedes the "MKD only, never USD" part of the 2.01 currency decision and
      the 2026-07-18 `facts.md` row (set that old decision's Status to `Superseded by D-Y.09-4`; do not edit
      its body). Rejected: USD-only on EN, because it misstates the amount paid on cash on delivery; a live
      exchange-rate API, because it adds a runtime dependency and a failure mode on drop day. Downside: the
      rate goes stale and nobody is alerted. The dollar figure is a guide, not a quote.
    - `D-Y.09-5`: Structured data, order emails and the database stay MKD-only.
    - Plus every decision you make on your own. Surface each one in the report.
12. **State.** `current-state.md`: line 1 status text (NEXT target unchanged); placeholder register: the
    courier + delivery cost row → CLEARED (`D-Y.09-2`); the returns and exchange window row → CLOSED —
    removed from the site by owner decision (`D-Y.09-3`), worded so nobody reads it as "filled". Owed rows:
    (a) Petar reviews the PR (`D-0-3`); (b) after deploy, Lazar checks the EN catalog, a product page and
    the Shipping page on a real phone, and MK shows no `$`; (c) native MK review of `mk-review-y09.md`
    (Lazar + Petar); (d) USD rate review — re-check `MKD_PER_USD` before the first real drop and at least
    every three months after. Update `file-map.md` (tree + change-log row).
13. **Verify, PR, report.** `npm run build && npm run lint && npx tsc --noEmit` and `npm test` pass. The diff
    proves every out-of-scope path untouched. Open the PR from `phase-Y.09-shipping-and-usd`. Do not merge.

## Definition of Done

### Verifiable by Code

- [ ] New tests watched red, then green: USD formatter (22 / 37 / 4 / null on MK), delivery constant, no
      literal `200` in either catalog, no "unconfirmed cost" string left, no placeholder on the Shipping
      page.
- [ ] `/en/catalog`, all three EN product pages and the EN Home showcase show `≈ $22` next to 1,199 MKD and
      `≈ $37` next to 1,999 MKD. No truncation at 390 px.
- [ ] No `$` character renders anywhere on the MK locale.
- [ ] `/en/shipping-returns` and `/isporaka-i-vrakjanje`: h1 "Shipping" / „Испорака"; exactly four
      sections; delivery reads "Delivery time: 3–5 business days." + "Delivery cost: 200 MKD (≈ $4)." (EN) /
      „Цена на достава: 200 ден." (MK); zero `Placeholder` elements; "Last updated" shows 29 September 2026.
- [ ] Home FAQ answer 5 and its FAQPage JSON-LD both carry the interpolated cost in each locale; no literal
      `{cost}` anywhere in the rendered HTML.
- [ ] Cart shipping line shows the cost in both locales; the cart still shows no total.
- [ ] Terms prices text updated in both locales; Terms "Last updated" 29 September 2026.
- [ ] Product JSON-LD (if any renders) states MKD only.
- [ ] MK ⇔ EN key counts identical; string inventory regenerated; `mk-review-y09.md` committed unsigned.
- [ ] `git diff main --` on every out-of-scope path is empty, including `src/i18n/routing.ts`.
- [ ] build, lint, typecheck, test all pass.
- [ ] `facts.md`, `Decisions.md` (`D-Y.09-1…5`+, old currency decision marked Superseded),
      `current-state.md`, `file-map.md` updated.
- [ ] PR open, not merged.

### Owed to Lazar (goes on the register)

- [ ] Petar reviews the PR before merge (`D-0-3`).
- [ ] After deploy: EN catalog, one EN product page and the EN Shipping page on a real phone; MK Shipping
      page shows 200 ден and no dollar sign.
- [ ] Native MK review of `mk-review-y09.md`.
- [ ] USD rate re-checked before the first real drop.

If Code has no browser tool, the report lists the URLs from Task 9 and this checklist:

1. On the English catalog, every price reads like "1,199 MKD ≈ $22", with the dollar part smaller and
   greyer.
2. On the Macedonian site there is no dollar sign anywhere.
3. The Shipping page title is "Shipping", and there is no "Returns" section and no grey placeholder box.
4. The Shipping page says delivery takes 3–5 business days and costs 200 MKD (≈ $4 in English).
5. The Home FAQ answer about delivery states the 200 MKD cost in both languages.

## Completion-report note: held photo

Lazar also sent a photo for Product 01's second slot. It is not in this phase. The orchestrator is holding
it pending confirmation that it is an unaltered photograph of the real shirt (`D-0-6`). Don't add any
Product 01 image. Record in the report that Product 01's slot 2 still shows its placeholder.

## Outputs & where they go

- Code, config, copy, tests → branch `phase-Y.09-shipping-and-usd`, one PR.
- MK review pack → `docs/i18n/mk-review-y09.md`.
- Completion report → `src/_project-state/completions/Part-Y-Phase-09-Completion.md`.
