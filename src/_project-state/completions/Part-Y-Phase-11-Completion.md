# Completion report — Part Y Phase 11: Product 03 hosted price + honest display and wording

| | |
|---|---|
| **Phase** | Y.11 |
| **Name** | Product 03 hosted price + honest display and wording |
| **Executor** | Claude Code (Claude Opus 5.5, high effort) |
| **Operator** | Petar |
| **Date** | 2026-10-02 |
| **Branch** | `phase-Y.11-honest-display` |
| **PR** | see the PR opened from this branch (not merged — Lazar reviews, Petar merges, `D-0-3`) |
| **Brief** | `briefs/Part-Y-Phase-11-Code.md` (first commit, `ff68852`) |
| **Commit range** | `ff68852..` the head of the branch (11 commits on `d04efe9`) |

---

## 1. What shipped

- **Product 03 now costs 1,199 MKD on the live site.** On Petar's typed "go", the one guarded statement from the Y.10 brief changed the hosted row. It changed exactly one row, a separate read confirmed 1199, and production showed "≈ $22", "You pay 1,199 MKD in cash on delivery." and „1.199 ден" on every price surface.
- **On the branch (live after merge and deploy):**
  - Customers no longer see internal notes: the "design-system preview" banner, the "sizes — sample, pending Vladimir" line and the empty `[PLACEHOLDER: product photo — Vladimir]` slot are all gone.
  - Between drops, product pages show no stock and a disabled "Ordering is closed" / „Нарачките се затворени" button instead of "Sold out" beside "In stock". "Sold out" appears only when a product has 0 stock in a live drop.
  - The product page and Terms say the 200 MKD delivery is paid on top of the shirt price, in both languages.
  - Unknown addresses get a branded 404 in the visitor's language.
  - The FAQ, `llms.txt`, meta text and the manifest only say things that are true when no drop is open.
  - The countdown uses correct singular/plural forms, and Macedonian uses „дроп".
- The test suite now refuses to run against anything but the local database.

---

## 2. Decisions I made on my own

The brief's eight decisions are logged as `D-Y.11-1…8`; `D-Y.11-10` records the CLAUDE.md unit rule the brief asked for. These are the ones the brief did **not** make. They need ratification (owed #86):

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.11-9` | Owed #79 (Petar reads the Y.10 diff) stays OPEN as a post-merge read: PR #45 merged with `reviews: []`. | Closing it because the operator merged. | Another after-the-fact row. |
| `D-Y.11-11` | `tests/setup.ts` refuses non-local DB hosts. A page-render harness renders real pages (async server components too) with `react-dom/static` `prerender` and the real catalogs, mocking only `next-intl/server`, `server-only`, `@/i18n/navigation` and `@/lib/drop/state`. | Source-only guards (cannot prove what renders per drop state). | The harness rebuilds localized paths and a drop fixture; it must follow `routing.ts` / `ProductView` if they change. |
| `D-Y.11-12` | `PreviewNotice.tsx` **deleted** (the styleguide never used it) with the 4 dead keys `Placeholder.notice/sizesSample/productPhoto/composition`. | Keeping unused code and keys. | Re-adding a component if a review banner is ever wanted. |
| `D-Y.11-13` | Decision 3 applied to branches not visible today: missing price → omitted; no photo → "No photo yet" (`Product.noPhoto`); missing care → no section. **Supersedes `D-Y.06-2` in part.** | Fixing only what renders now — the next drop starts with nulls. | A page without care copy no longer signals it is owed. |
| `D-Y.11-14` | "Closed" = the handover's disabled look; sizes listed but **not struck**; countdown never says "Sold out"; between drops photos stay in colour and cards stay links; the Home showcase follows the same rule. | A new visual state; struck sizes; greyscale between drops. | "Closed" and "Coming soon" differ only by label; showcase change is beyond "product and catalog pages". |
| `D-Y.11-15` | One photo takes the gallery column: phone full width, `max-w-md` 640–1023px, 536px at desktop. | Half-width with an empty right half; full width on tablets. | Desktop photo grows 262 → 536px wide. Sources are 1333px, so no upscaling. |
| `D-Y.11-16` | The amount-due line renders in **both** locales and shows delivery in **plain denars** ("200 MKD", not "200 MKD (≈ $4)"). **Supersedes `D-Y.10-4` in part.** | "(≈ $4)" on that line too. | EN shows the delivery cost two ways on two pages; MK shows the price twice at the top. |
| `D-Y.11-17` | 404 via `[locale]/not-found.tsx` + `[...rest]` catch-all + a root fallback under a **pass-through root layout** (next-intl's pattern); fonts moved to `src/app/fonts.ts`; catch-all exempt from the pathnames test. | `global-not-found.js` (experimental, needs a config flag). | The 404's `<title>` is the layout default — non-global not-found files cannot set metadata. |
| `D-Y.11-18` | `formatMkd` and `formatUsdApprox` group thousands by hand. | `Intl` + polyfill. | Whole numbers only. |
| `D-Y.11-19` | Plurals: EN "HR/HRS"; one full-word `Drop.timerAria`; EN `remaining` unchanged ("{count} left"). | Four aria keys; a pointless EN plural. | EN "HR" is an unusual abbreviation. |
| `D-Y.11-20` | Copy beyond the brief's list: FAQ a7 (availability "during a drop"); MK `Privacy.browserBody` mirrors the EN change; humanizer fix to `Meta.catalogDescription`; unrendered `Drop.liveNow`; `llms.txt` Home note + "go on sale together"; Terms + Privacy last-updated 2026-10-02; `Styleguide.intro` keeps „во живо" (dev page, means "live demo"). | Leaving them. | Larger copy diff; all MK changes are in the review pack. |
| `D-Y.11-21` | New test: EN/MK interpolation arguments and rich-text tags must match per key (the inventory script does not check variables). | Extending the inventory script. | A hand-written ICU parser for this project's syntax only. |
| `D-Y.11-22` | For the render matrix, local-only: seed drops moved into January, one product's stock set to 0; then `supabase db reset` (local) + `sync:drop` (local) and 403/403 on the restored DB. | Rendering the seed products as Y.10 did. | A hand edit to local data, reversed by reset. |

Past entries changed **only in Status**: `D-Y.06-2` (superseded in part by -13), `D-Y.10-4` (superseded in part by -16), `D-Y.09-12` (resolved — both stale claims fixed).

---

## 3. Surprises and off-spec changes

- **A sold-out drop now reads "Ordering is closed".** `computeState` marks a drop with 0 total stock as `ended`, so under decision 7 the "Sold out" signal disappears the moment the last unit sells. It's the brief's rule applied faithfully, but Lazar should know (Known issue #14).
- **Cart and checkout still show `[PLACEHOLDER: price]`.** That's the brief's scope (Y.12), but under the new CLAUDE.md rule it's now a known violation on a customer page, reachable only during a live drop (Known issue #16).
- **The brief said "keep PreviewNotice only where /styleguide uses it" — the styleguide never used it**, so the component was deleted (`D-Y.11-12`).
- **The real cause of the showcase hydration risk** was `toLocaleString('mk-MK')`: Node prints „1.199", a browser without Macedonian data prints "1,199" or "1199". A test reproduced the mismatch before the fix.
- **`next-intl/navigation` cannot be imported in vitest.** Its ESM build imports `next/navigation` in a way plain Node rejects, so the test harness builds localized paths from `routing.pathnames` itself.
- **The browser pane carried a `NEXT_LOCALE=en` cookie** (the trap Y.10 noted), which redirects `/nema-takva` to `/en/nema-takva`. I pinned the cookie per locale while rendering.
- **The design hook flagged gradient text at `globals.css:698`.** That's the wordmark hover shine, an owner-level exception (`D-2.19-1`, `D-2.20-1`) in a file this phase did not touch. It's intentional and was left unchanged.
- **Reconciliations (brief's rule):** `current-state.md` line 1 said Y.10 "PR OPEN, NOT MERGED", but git shows PR #45 merged at `cf77299`, so the status text was corrected (owed #79 stays open, `D-Y.11-9`). CLAUDE.md "max 2 units per order" was rewritten per `D-Y.06-3/4` (`D-Y.11-10`). Three code comments describing the removed placeholder branches were corrected (`schema.ts`, `product-care.ts`, `PhotoSlot.tsx`).
- **The page needed no fact we don't have** to look finished. Removing the markers made it look *more* finished than it is (Known issue #15).

---

## 4. Files touched

| File | Added / Modified / Deleted |
|---|---|
| `src/lib/drop/display.ts` | Added |
| `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/fonts.ts` | Added |
| `src/app/[locale]/not-found.tsx`, `src/app/[locale]/[...rest]/page.tsx` | Added |
| `src/components/system/PreviewNotice.tsx` | **Deleted** |
| `src/app/[locale]/catalog/page.tsx`, `catalog/[slug]/page.tsx`, `terms/page.tsx`, `privacy/page.tsx`, `styleguide/page.tsx`, `layout.tsx` | Modified |
| `src/components/product/{ProductCard,AddToCartPanel,BuyButton,SizePicker,AmountDue}.tsx` | Modified |
| `src/components/home/{HomeShowcase,HomeExperience,HomeFaq}.tsx`, `src/components/drop/Countdown.tsx` | Modified |
| `src/components/system/{PhotoSlot,ShippingNotice}.tsx`, `src/config/schema.ts`, `src/lib/product-care.ts` | Modified (comments only) |
| `src/lib/format.ts`, `src/app/llms.txt/route.ts`, `src/app/manifest.ts` | Modified |
| `src/messages/{mk,en}.json` | Modified (−4 +8 keys → 273; 37 MK / 12 EN values changed) |
| `tests/setup.ts`, `tests/helpers/local-db-guard.ts`, `tests/helpers/harness/*` (5) | Modified / Added |
| `tests/setup-guard.test.ts`, `tests/drop/{display,plurals}.test.ts`, `tests/format/format-mkd.test.ts`, `tests/i18n/interpolation-parity.test.ts`, `tests/pages/{public-pages,drop-state-display,not-found,price-wording,state-true-copy}.test.ts` | Added |
| `tests/format/display-price.test.ts`, `tests/i18n/{pathnames,delivery-cost-copy}.test.ts` | Modified |
| `docs/i18n/mk-review-y11.md` | Added (unsigned) |
| `docs/i18n/string-inventory.md` | Regenerated |
| `CLAUDE.md`, `Decisions.md`, `current-state.md`, `file-map.md`, `briefs/Part-Y-Phase-11-Code.md`, this report | Modified / Added |

**Untouched, as required:** `CartView.tsx`, `CheckoutForm.tsx`, the order email, `scripts/sync-core.ts`, `create_order()` and every migration, stock/reservations/rate limit/Turnstile, `drops.ts`, `src/config/currency.ts`, `package.json`. No dependency, script, `next.config.ts` or `vitest.config.ts` change, so there is no `00_stack-and-config.md` entry.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | Clean — zero warnings; routes include `ƒ /[locale]/[...rest]` and `○ /_not-found` |
| Types | `npx tsc --noEmit` | Clean |
| Lint | `npm run lint` | **0 errors** (143 warnings, same count as `main`) |
| Unit / integration | `npm test` | **403/403**, 42 files (baseline on branch start: 244/244, 32 files) |
| i18n | `npm run i18n:inventory` | 273 keys; EN/MK parity test green; **interpolation parity test green**; the same 33 unlocated keys as `main` (no new dead key) |

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` (byte-unchanged since `main`: `git diff cf77299 -- tests/concurrency/` empty) |
| Output | `✓ create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` · `✓ … 5 simultaneous 3-unit orders against one 3-unit variant → exactly 1 succeeds, 4 × TR004, stock 0, no partial rows` — run on the database restored by local reset + sync |

TDD: every behaviour test was run red first. The guard failed on a missing module. Public pages failed 38 cases on the notice/`[PLACEHOLDER`. Ended-vs-sold-out failed 14. Formatting reproduced the „1199 ден" hydration case. Price wording failed 13, state-true copy 10, plurals 8. All are green now.

Local-DB proof before DB-backed runs: `SUPABASE_DB_URL host = 127.0.0.1 port = 54322`, `NEXT_PUBLIC_SUPABASE_URL host = 127.0.0.1 port = 54321`, nothing exported in the shell. With a hosted-looking URL exported, `vitest` refuses: "Refusing to run tests: SUPABASE_DB_URL does not point at 127.0.0.1 or localhost…"

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| Task 1: one row updated, read-back `test-baby-blue \| 1199`, production ≈ $22 / 1,199 MKD / 1.199 ден | ✅ `UPDATE returned 1 row(s): test-baby-blue \| 1199`; read-only select: all three rows 1199, `orders` 0; prod `/en/catalog/test-baby-blue` "≈ $22" + "You pay 1,199 MKD in cash on delivery.", `/katalog/test-baby-blue` „1.199 ден", 3 equal cards on `/en/catalog`, `/katalog`, `/en`, `/`; `no-store` / `x-vercel-cache: MISS` |
| Branch; brief first commit; Y.10 merge recorded | ✅ `ff68852` brief; `0843194` records PR #45 / `cf77299` |
| `tests/setup.ts` refuses non-local DB URLs (tested) | ✅ `tests/setup-guard.test.ts` 8/8 + live refusal shown above |
| Listed pages render no `[PLACEHOLDER`, notice or "sizes — sample" (tested); inventory table | ✅ `tests/pages/public-pages.test.ts` (home, catalog, 3 products, about, contact, terms, privacy, shipping, 404 × 2 locales × ended/countdown/live/no-drop); table in §7 |
| Ended: no badge/count; button „Нарачките се затворени" / "Ordering is closed" (tested) | ✅ `tests/pages/drop-state-display.test.ts`, `tests/drop/display.test.ts`; rendered locally |
| Product page and Terms state delivery separately, both locales | ✅ `tests/pages/price-wording.test.ts`; rendered: „…плус 200 ден за достава." / "…plus 200 MKD for delivery."; Terms „Доставата чини 200 ден и се додава на цената на маицата." / "Delivery costs 200 MKD (≈ $4) on top of the shirt price." |
| MK „1.199 ден" identical on showcase, catalog, product, server and client | ✅ `tests/format/format-mkd.test.ts` (ICU broken → identical markup); in browser no hydration warning on `/`, `/katalog`, product pages |
| Unknown path and slug → HTTP 404 localized, both locales | ✅ dev server: `/nema-takva`, `/en/nope`, `/katalog/nope`, `/en/catalog/nope`, `/nope/deeper`, `/missing.png` all `404` + `noindex`; branded page in MK and EN (and both on the root fallback); `tests/pages/not-found.test.ts` |
| Plurals for 1 and 2, both locales, incl. aria | ✅ `tests/drop/plurals.test.ts`; in browser: labels „ДЕН · ЧАСА · МИН · СЕК", aria „1 ден, 23 часа, 59 минути, 58 секунди", banner „Преостануваат 27" |
| `llms.txt` no unit limit / no timer promise; FAQ JSON-LD = visible FAQ | ✅ `tests/pages/state-true-copy.test.ts` |
| EN/MK key sets + interpolation identical; inventory clean | ✅ catalog-parity + interpolation-parity tests; inventory 273 keys |
| Every new/changed factual claim traces to VERIFIED `facts.md` | ✅ see §8 |
| `npm test` incl. 10-vs-3; lint 0 errors; typecheck; build | ✅ §5 |
| Render matrix with per-page pass list; `mk-review-y11.md`; CLAUDE.md amended; decisions logged | ✅ below; `docs/i18n/mk-review-y11.md`; `10ea16b`; `D-Y.11-1…22` |

**Render matrix (local dev, `trajanov-dev`, the three shirts in `test-drop`'s real ended state).** Checked in-page for language, h1, horizontal overflow, forbidden markers, buttons/stock words and price text, plus console hydration warnings. Screenshots taken where marked.

| Page | MK 390 | EN 390 | MK 1280 | EN 1280 | Countdown | Live | Sold out (local stock 0, live) |
|---|---|---|---|---|---|---|---|
| Home | ✅ „Последниот дроп", 3 × „1.199 ден", no badge | ✅ 3 × "≈ $22", no badge | — | — | ✅ eyebrow, plural labels + aria | ✅ banner „ДРОПОТ Е ОТВОРЕН · Преостануваат 27", cards with stock, „Овој дроп" (screenshot) | — |
| Catalog | ✅ no notice, no stock, 3 photos | ✅ "This drop has ended." | ✅ colour cards, links (screenshot) | ✅ no stock, 3 links, no aria-disabled | ✅ intro „…ќе стигне до нула", „На залиха" | — | ✅ card 01 greyed „РАСПРОДАДЕНО", 02 „Уште 2", 03 „На залиха" (screenshot) |
| Product 01 mustard | ✅ 1 photo, sizes disabled not struck, closed button (screenshots) | ✅ | — | — | ✅ „Наскоро", „На залиха" | ✅ „Додај во кошничка" | ✅ „Распродадено" button + badge, sizes struck, greyed; **ended + stock 0 → „Нарачките се затворени", colour, not struck** |
| Product 02 off-white | ✅ 1 photo (358px) | ✅ | — | ✅ 536×670 photo, sticky buy column (screenshot) | — | — | — |
| Product 03 baby blue | ✅ 2 photos, no `$` | ✅ 2 photos | ✅ 2 × 262px (screenshot) | — | — | — | — |
| Terms | ✅ delivery sentence, updated 2 октомври 2026 | ✅ prices paragraph, October 2, 2026 | — | — | n/a | n/a | n/a |
| Privacy | ✅ no "sessionStorage" | ✅ cart + delete wording | — | — | n/a | n/a | n/a |
| Shipping | ✅ „кому да се јавиш", 200 ден | ✅ "200 MKD (≈ $4)" | — | — | n/a | n/a | n/a |
| About / Contact | ✅ „дропови од 3 до 5 производи" / „дроповите" | — | — | — | n/a | n/a | n/a |
| 404 | ✅ branded, `/katalog` + `/` (screenshot) | ✅ `/en/catalog` + `/en` | — | — | n/a | n/a | n/a |

Every checked page reported `overflow: 0` and no hydration warning. Compared against the handover: the closed button matches §5 "Disabled (pre-drop)", sizes the §6 quiet border without strike-through, the sold-out card §3 and badge §4 unchanged, and the 404 buttons reuse the Home hero CTA recipe. Tokens only, no new colour or size.

### Owed to Lazar (only he / a real device / a real account can confirm)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 82 | Lazar reads the PR diff before Petar merges (`D-0-3`) | the PR from `phase-Y.11-honest-display` vs `briefs/Part-Y-Phase-11-Code.md` | A review recorded on the PR |
| 83 | Native MK review | `docs/i18n/mk-review-y11.md` | Both boxes signed; corrections in `mk.json` |
| 84 | Production read-back after deploy | `/katalog`, `/katalog/test-off-white`, `/en/catalog/test-baby-blue`, `/llms.txt`, `/nema-takva`, `/en/catalog/nope` | No banner, no "sample", no "Sold out" while ended, „1.199 ден", delivery line, `llms.txt` clean, 404 status + page |
| 85 | Real-phone check, both locales | `/katalog/test-off-white`, `/en/catalog/test-baby-blue`, `/nema-takva`, `/en/nope` | Photo, closed button, delivery line and 404 buttons read and tap well |
| 86 | Ratify Code's own decisions | §2 above | Accepted or reversed by a new entry |

---

## 7. Placeholders shipped

**None added.** No placeholder row was cleared either. #2, #4, #8 and #10 stay OPEN with dated notes, and the register must still reach zero before the first real drop.

**Inventory of every remaining `[PLACEHOLDER`, `Placeholder.*` use and "Vladimir" string in `src/` (Task 5):**

| Where | What | Class |
|---|---|---|
| `src/messages/{mk,en}.json` `Placeholder.price` → `CartView.tsx:131/187/201`, `CheckoutForm.tsx:150` | `[PLACEHOLDER: цена MKD]` for line price, subtotal, total | **cart/checkout — deferred to Y.12** (Known issue #16) |
| `Placeholder.productName` → product page title + metadata, `ProductCard`, `HomeShowcase`, `CartView:125` | neutral „Производ 01" / "Product 01" | customer-facing **neutral name** — allowed (`D-Y.11-4`), not a marker |
| `src/components/system/Placeholder.tsx` | the marker component | used only by cart/checkout now |
| Comments in `catalog/[slug]/page.tsx`, `ProductCard.tsx`, `CartView.tsx`, `schema.ts`, `product-care.ts`, `Placeholder.tsx` | code comments mentioning `[PLACEHOLDER` | dev note, never rendered |
| `src/messages/*.json` About, Terms, Privacy, Shipping, About quote | „Владимир Трајанов" as founder, seller, responsible party, who answers the phone | customer-facing **fact** (`facts.md` §1/§2), not a task owner |
| Comments in `llms.txt/route.ts`, `terms/page.tsx`, `privacy/page.tsx`, `config/*`, `lib/*` | "Vladimir" in code comments | dev note |
| `src/app/[locale]/styleguide/page.tsx` | sample cards with null price | styleguide / dev fixture (price now omitted) |
| Input hints | none use a placeholder string (`Checkout.notePlaceholder` is a form hint, now „Влез, кат, ориентир…") | input hint |

**Removed:** `Placeholder.notice`, `Placeholder.sizesSample`, `Placeholder.productPhoto`, `Placeholder.composition` and `PreviewNotice.tsx`.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ Delivery 200 MKD, paid in cash to the courier (§7 Delivery cost); price 1199 (§7, Product 03 row); 3 to 5 products per drop (§7); oversized unisex t-shirts from Strumica (§1, §7); Instagram @trajanovv2026 is where drops are announced (§6; already on Contact); COD, North Macedonia only (§7). "Every order is counted the moment it's placed" is a statement about `create_order()`'s atomic decrement, not a business fact. "The cart stays in this tab and clears when you close it" is the existing sessionStorage claim, reworded. Removed: "for a set time" from `llms.txt` (drops can be open-ended). |
| `humanizer` pass run on user-facing copy | ✅ one fix (doubled "limited" in `Meta.catalogDescription`); the rest was plain |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ |
| Template-propagated strings verified once against `facts.md` | ✅ the delivery cost flows from `DELIVERY_COST_MKD` through `{cost}`; the handle from `INSTAGRAM_HANDLE` through `{handle}` |
| No AI-generated product imagery (`D-0-6`) | ✅ no image added or changed |
| No untranslated EN string in the MK build | ✅ parity tests; rendered MK pages show no EN; no `$` on MK |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ A scan of every added line in `d04efe9..HEAD` found no JWT, Resend/Stripe key, Turnstile secret, hosted project ref or real Postgres URL. The only URL-with-password strings are **deliberately fake** guard-test fixtures (`u:p@…`, `hunter2-secret@db.example.supabase.co`) and Supabase's shared local default (`postgres:postgres@127.0.0.1`). |
| `.env*` still gitignored | ✅ `.gitignore:34 .env*` covers `.env.local` and `.env.hosted`; only `.env.example` is tracked |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ none added |
| No order PII (phone, address) in logs | ✅ no logging added; the hosted URL was loaded from `.env.hosted` into a subprocess and its output passed through a redaction filter. It was never printed. |

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Cart/checkout `[PLACEHOLDER: price]` markers, cart totals, sync lock for open/future drops | Y.12 | Orchestrator |
| Merge + deploy (the branch changes are not live) | Lazar's review (#82), then Petar | Lazar / Petar |
| Production read-back + real-phone check | Deploy (#84, #85) | Code / Lazar |
| Native MK review incl. „дроп" | #83 | Lazar + Petar |
| Slogan candidate | Vladimir (`D-Y.11-6`) | Vladimir |
| Whether a fully sold-out drop should read "Sold out" | Lazar (Known issue #14) | Lazar |

---

## 11. State updated

- `current-state.md`: line 1 (NEXT target unchanged), Last updated, Status, Built, owed register (#77 note, #79 post-merge, #81 closed, #82–#86 new), placeholder register (Y.11 note; #2/#4/#8/#10 dated, OPEN), known issues (#13 resolved; #14–#16 new).
- `file-map.md`: Status block, tree entries, change-log row.
- `00_stack-and-config.md`: no entry — no dependency, script or build config changed.
- `Decisions.md`: `D-Y.11-1…22`; Status-only updates to `D-Y.06-2`, `D-Y.10-4`, `D-Y.09-12`.

**What's now possible:** between drops, the store tells the truth about stock, price and delivery in both languages. When the next drop's content arrives, the remaining gaps stay off customer pages and in the register, where they gate the first real drop.
