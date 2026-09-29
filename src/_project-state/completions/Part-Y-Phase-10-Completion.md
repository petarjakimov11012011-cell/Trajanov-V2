# Completion report — Part Y Phase 10: English prices in dollars, and Product 03 at 1,199 MKD

| | |
|---|---|
| **Phase** | Y.10 |
| **Name** | English prices in dollars, and Product 03 at 1,199 MKD |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-09-29 |
| **Branch** | `phase-Y.10-usd-prices-p03` |
| **PR** | see the PR opened from this branch (not merged) |
| **Brief** | `briefs/Part-Y-Phase-10-Code.md` (first commit on the branch) |

---

## 1. What shipped

- On the **English** site, the catalog card, the Home showcase and the product page show **"≈ $22"** as the price. It uses the exact classes the MKD figure had at each call site, so size, weight, colour and `tabular` are unchanged. The "≈" is always there.
- The **English product page** adds one muted `text-small` line directly under the price: **"You pay 1,199 MKD in cash on delivery."** The card and the showcase don't carry it.
- The **Macedonian** site is unchanged. The price span is byte-identical to `main` (`<span class="text-foreground">1.199 ден</span>` on the product page), and there is no `$` on any MK page.
- **Product 03 is 1199 MKD** in `src/config/products.ts` and `facts.md` §7 (strike-and-date).
- `Terms.pricesBody` (EN) now says prices are set in denars and paid in denars, the English site shows dollars as an approximate guide, and each product page shows the exact denar amount.
- **Not yet done:** the hosted database row still reads 1999. Task 7 runs only after merge + deploy, on Petar's explicit go.

---

## 2. Decisions I made on my own

Decisions `D-Y.10-1…4` record the brief's own decisions (price, dollars as price, "≈", amount-due line). These are the ones the brief left to me:

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.10-5` | `WithUsdApprox` renamed **`DisplayPrice`**. It now renders one span from `amountMkd`, `currency`, `locale` and the call site's `className`: EN "≈ $22", MK `formatMkd(...)`. | Keeping the children-wrapper and swapping the text via `cloneElement` on EN. The call site would show a denar span that never renders on EN. | A larger call-site diff. The price class list moves into a prop string. |
| `D-Y.10-6` | The amount-due `<p>` sits **inside** `div.text-price.tabular`, after the price span. MK markup of that div is untouched. No locale-specific-key convention was needed: nothing flagged the unrendered MK key. | A sibling after the div. It would sit 12 px away, like the stock badge, and grouping it would need a wrapper that changes MK markup. | The line inherits `tabular`, which only affects digits. |
| `D-Y.10-7` | The §7 *USD reference rate* row's "beside an MKD figure" phrase is also struck and dated. The brief named only the Currency paragraph. | Leaving it, which would make `facts.md` contradict the site. | An edit to a row the brief didn't list. |
| `D-Y.10-8` | The local DB was reset and synced **twice**. The first sync raced my config edit and inserted 1999. Local read-back: `test-baby-blue|1199`. | A hand `UPDATE` on the local row. | See §3: the local seed's live drop hides the three shirts on catalog/Home. |

Also: `D-Y.09-4` Status → *Superseded in part by `D-Y.10-2`* (its "USD shown next to the MKD price" clause only). `D-Y.09-8` Status → *Superseded by `D-Y.10-5`*. No past entry's body was edited.

---

## 3. Surprises and off-spec changes

- **Locally, the catalog and Home don't show the three shirts.** After `supabase db reset`, `seed.sql` creates `test-open-drop` live around today, and the catalog reads that. So `/katalog`, `/en/catalog` and `/` render the seed products ("TEST — Tee 01", 999 / 1500 MKD). I verified the **card** there instead: EN "≈ $18" / "≈ $28" at 13 px / 600 in `text-foreground text-small font-semibold tabular`, and MK "999 ден" / "1.500 ден". The **showcase** renders no slides locally because the seed products have no photos. Its EN/MK output is pinned by unit tests on its exact class list, and the live render is covered by Task 11. The three product pages resolve by slug and were rendered directly.
- **The MK string for `Product.amountDue` uses the formal „Плаќате".** The rest of the site uses the informal „плаќаш" (e.g. `Terms.pricesBody`). I used the brief's string verbatim. MK never renders it, but a native reader should align it before it is ever used.
- **A locale cookie trap while verifying.** After visiting `/en/*`, the `NEXT_LOCALE=en` cookie made `/katalog/*` fetches return EN HTML. The MK checks were re-run with the cookie set to `mk`, and all of them pass.
- `tests/format/display-price.test.ts` casts `NextIntlClientProvider`'s prop type. Its type requires `children` as a prop, and `react/no-children-prop` forbids passing it that way in `createElement`.

---

## 4. Files touched

- **Renamed:** `src/components/system/WithUsdApprox.tsx` → `src/components/system/DisplayPrice.tsx`
- **New:** `src/components/product/AmountDue.tsx`, `tests/format/display-price.test.ts`, `tests/config/product-prices.test.ts`, `briefs/Part-Y-Phase-10-Code.md`, this report
- **Modified:** `src/components/product/ProductCard.tsx`, `src/components/home/HomeShowcase.tsx`, `src/app/[locale]/catalog/[slug]/page.tsx`, `src/config/products.ts`, `src/messages/en.json` (`Product.amountDue`, `Terms.pricesBody`), `src/messages/mk.json` (`Product.amountDue` only), `docs/i18n/string-inventory.md` (269 keys), `tests/format/usd-approx.test.ts`, `tests/home/showcase.test.ts`, `facts.md`, `Decisions.md`, `src/_project-state/current-state.md`, `src/_project-state/file-map.md`
- **Untouched, as required:** `src/config/currency.ts`, `src/lib/format.ts`, `scripts/sync-core.ts` (Preflight 3), migrations, JSON-LD, emails, cart, Shipping, FAQ, `package.json`

---

## 5. Tests run + results

- **TDD:** `tests/config/product-prices.test.ts` failed (2/2 red) before the config edit. `tests/format/display-price.test.ts` failed (module not found) before `DisplayPrice`/`AmountDue` existed. Both are green now.
- `npm test`: **244/244 passed**, 32 files, including the **10-vs-3 oversell gate** (`tests/concurrency/oversell.test.ts`)
- `npm run lint`: **0 errors** (143 pre-existing warnings)
- `npx tsc --noEmit`: clean
- `npm run build`: clean
- No stock or reservation logic changed.

---

## 6. Definition of Done

| Item | State |
|---|---|
| Branch + brief as first commit | ✅ `5a19e00` |
| EN card / showcase / product page "≈ $22" in the old classes, no MKD in the price element | ✅ unit-tested at all three class lists. Rendered: product pages ×3 and card (seed products). Showcase and the three-shirt cards are **owed on production** (Task 11). |
| EN product page amount-due line; card and showcase without it | ✅ rendered ×3 product pages; one line at 390 px |
| MK byte-identical, zero `$` | ✅ tested against `main` markup; rendered MK product pages ×3, `/katalog`, `/`: no `$` |
| Delivery-cost prose unchanged | ✅ `/en` FAQ "200 MKD (≈ $4)", `/` „200 ден" |
| Config 1199 + comments | ✅ |
| `facts.md` §7 strike-and-date + Currency paragraph + changelog | ✅ |
| `Terms.pricesBody` EN rewritten, MK unchanged | ✅ rendered on `/en/terms` |
| `Product.amountDue` in both catalogs | ✅ |
| Preflight 3 untouched | ✅ |
| Tests / lint / types / build | ✅ |
| Rendered 390 + 1280 px | ✅ product pages + card. ⚠ showcase not renderable locally (see §3) |
| Hosted `UPDATE` (one row) + read-back | ⏳ **after merge + deploy, on Petar's go** (owed #81) |
| Production checks (Task 11) | ⏳ after Task 7 |
| Decisions, state, file-map, report | ✅ |

**Owed register additions:** #79 Petar reads the diff (`D-0-3`). #80 real-phone look at `/en/catalog` + `/en/catalog/test-baby-blue`. #81 the hosted `UPDATE` and read-back. **#78 annotated:** the rate is now the headline EN price, so staleness shows directly on the price.

---

## 7. Placeholders shipped

None new. Register unchanged at 4 open rows (#2, #4, #8, #10).

---

## 8. Content truth check

- 1199 MKD for Product 03: `facts.md` §7, **VERIFIED — owner via Lazar, 2026-09-29**.
- "≈ $22": the conversion at the §7 reference rate (54.3, supplied in Y.09, not re-checked, per the brief).
- "You pay … in cash on delivery.": cash on delivery is VERIFIED (§7 Payment).
- `humanizer` pass on the two EN strings: plain, present tense, direct address. No filler, no inflated vocabulary.

---

## 9. Secrets check

No keys, phone numbers or addresses were committed or logged. The only DB URL used is the local `127.0.0.1:54322` dev default. No hosted command was run in this phase so far.

---

## 10. Blocked / carryover

- **Task 7 (hosted `UPDATE`)** and **Task 11 (production verification)** wait for merge + deploy and Petar's explicit go.
- Until Task 7 runs, live EN shows Product 03 at "≈ $37" (1999 MKD) while config says 1199.
- Still open from Y.09: `D-Y.09-12` (`llms.txt` "maximum of 2 units", „величини — примерок"). Not touched, per the brief.

---

## 11. State updated

`current-state.md`: line 1 status text only (NEXT target unchanged), Status section, owed #78 note, #79–#81. `file-map.md`: rename + change-log row. `Decisions.md`: `D-Y.10-1…8`, plus Status lines on `D-Y.09-4` and `D-Y.09-8`. `00_stack-and-config.md`: no change (no dependency or config change).
