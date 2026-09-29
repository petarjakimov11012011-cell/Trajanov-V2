# Completion report — Part Y Phase 09: Shipping page — 200 MKD delivery cost, returns removed, approximate USD on EN

| | |
|---|---|
| **Phase** | Y.09 |
| **Name** | Shipping page: 200 MKD delivery cost, returns section removed, approximate USD on the English site |
| **Executor** | Claude Code (Claude Opus 5.5, reasoning effort medium) |
| **Operator** | Petar (session) · instruction from Lazar |
| **Date** | 2026-09-29 |
| **Branch** | `phase-Y.09-shipping-and-usd` (cut from `main` at `eab5333`) |
| **PR** | [#44](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/44). **Open, NOT merged**, and it waits for Petar's review (`D-0-3`, owed #75) |
| **Commits** | `6bafdf6` (formatter + config + their tests) → `c8fd281` (page, copy, rendering) → the docs/state commit that files this report |
| **Brief** | `briefs/Part-Y-Phase-09-Code.md` (supplied in session; committed so the reviewer can check the diff against it) |

---

## 1. What shipped

- **Delivery now has a price.** Delivery costs **200 MKD**, VERIFIED (owner via Lazar, 2026-09-29). It shows in four places: the Shipping page, the Home FAQ answer about delivery (and the FAQ's structured data for search engines), and the cart's shipping line. MK reads „200 ден“; EN reads "200 MKD (≈ $4)". The number lives in **one** place (`src/config/shipping.ts`). A test fails if anyone types it into the copy.
- **The Shipping page is only about shipping.** It is titled „Испорака“ / "Shipping" and has four sections: where, payment, delivery time and cost, and who to call if something is wrong. The two grey placeholder boxes are gone. **The returns window and "What we can't do yet" were removed by Lazar's decision, not filled.** The site now says nothing about returns. The web addresses did **not** change, so old links still work.
- **English visitors see an approximate dollar price.** Every price on the English site reads like "1,199 MKD ≈ $22", with the dollar part smaller and greyer. The rate is a hand-set 54.3 MKD per dollar. **Denars are still the price and what the customer pays.** The Macedonian site shows **no dollar sign anywhere**. The Terms page says this in both languages.
- **Two placeholder rows close.** #6 (delivery cost) is **cleared** by a real fact. #7 (returns window) is **closed by removal**: the window is still unknown, and the site just stopped talking about it. **4 rows stay open:** #2, #4, #8 and #10, all photos and names from Vladimir.
- **Product 01's second photo slot still shows its placeholder.** Lazar sent a photo for it, but the orchestrator is holding that photo until someone confirms it is an unaltered photograph of the real shirt (`D-0-6`). It is not in this PR.

---

## 2. Decisions I made on my own

`D-Y.09-1…5` came from the brief (logged as instructed). These seven are mine. All are appended to `Decisions.md`.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.09-6` | `D-2.01-8`'s Status reads **"Superseded by D-Y.09-4 — in part only"**, naming the no-conversion clause. The brief said to mark "the 2.01 currency decision" superseded, but `D-2.01-8`'s actual decision (`formatMkd` takes an explicit `locale`) is still live and Y.09 builds on it. | A plain `Superseded by D-Y.09-4` | A longer, qualified Status line; a reader opens `D-Y.09-4` to see which sentence died |
| `D-Y.09-7` | `DELIVERY_COST_MKD` lives in a **new `src/config/shipping.ts`** (the brief said "pick the file and state it") | `products.ts` (per-drop, read by the sync), `currency.ts` (mixes a verified fact with a stale-prone rate), `index.ts` (not imported by the app) | Two more tiny config files; the cart's client bundle now imports from `src/config/` (plain constants, harmless) |
| `D-Y.09-8` | One shared **`WithUsdApprox`** wrapper for the three price sites. **On MK it returns the price element untouched**, so MK markup is byte-identical to `main` | Inline markup at each site (styling can drift); an always-on wrapper (changes MK DOM for nothing) | EN and MK DOMs now differ in shape (one extra span on EN); future price-style changes need checking in both |
| `D-Y.09-9` | Prose cost comes from a helper, `formatMkdWithApproxUsd`, with **ordinary spaces**, byte-matching the brief's `200 MKD (≈ $4)` | Non-breaking spaces inside the phrase (the Y.07 `30 °C` pattern) | At some width a line could break as `(≈` / `$4)`. Measured at 390 px: the FAQ keeps it on one line |
| `D-Y.09-10` | The "no Placeholder on the Shipping page" test is a **source guard**. It asserts: no `<Placeholder`, exactly four `LegalSection`s in order, the removed keys gone, `LAST_UPDATED`. It does not render the page | Rendering the async server component under Vitest with `next-intl/server` mocked | A placeholder nested inside a child component would slip past it. Today no child renders one. The rendered HTML was checked by hand |
| `D-Y.09-11` | For the render check I **moved the local seed drops' windows into the past** (local DB only, guarded to `127.0.0.1`), so the catalog shows the real three shirts like production. Then I ran `supabase db reset` + `npm run sync:drop` to restore the seed before the final test run | Checking the catalog against seed fixture prices (999 / 1,500) | A DB action the brief didn't authorise (like `D-Y.08-9`). It was local, reversed, and never `--linked` |
| `D-Y.09-12` | **Two stale public claims found in passing are reported, NOT fixed** (§ 3) | Fixing them here (each is one line) | Both false statements stay live on production until a follow-up ships |

Smaller choices, not logged separately. `HomeFaq` passes `{cost}` to **every** FAQ string through one translator (`faqText`), so the visible list and the JSON-LD cannot diverge (`D-2.11-5`); ICU ignores the value where there is no slot. The Shipping page's `params` type went from `{locale: string}` to `{locale: Locale}`, matching Home, so no cast was needed.

---

## 3. Surprises and off-spec changes

- **Two stale public claims are live on production, found while rendering. Not fixed (`D-Y.09-12`, Known issue #13).**
  1. `src/app/llms.txt/route.ts` line 58 says "a **maximum of 2 units per order**". The cap was removed by `D-Y.06-3`, and FAQ a3 says "There's no per-order limit". So the machine-readable file AI assistants read contradicts the site. Y.06's `D-Y.06-8` caught the FAQ but missed this line.
  2. Every product page renders `Placeholder.sizesSample`, „величини — примерок, се чекаат од Владимир“ / "sizes — sample, pending Vladimir". It renders **unconditionally** (`AddToCartPanel.tsx` line 76), yet sizes have been VERIFIED since 2026-07-18 (`facts.md` §7). No decision keeps it; it looks forgotten.
  Each is a one-line fix, and each needs its own brief. **`CLAUDE.md` also still says "max 2 units per order"** under Stock & orders; that one is for the orchestrator to reconcile.
- **Locally, the catalog doesn't show the real shirts.** `supabase/seed.sql` creates an **open** fixture drop (999 / 1,500 MKD) for the concurrency tests, and the catalog prefers an open drop. So a local `/catalog` and Home showcase render fixture prices and no photographs. I worked around it for the render check (`D-Y.09-11`). Any future phase whose DoD names catalog prices will hit this too. Worth a line in the next brief, or a dev-only helper.
- **The cart now shows a real delivery cost beside placeholder prices.** The cart line, subtotal and total still render `[PLACEHOLDER: price MKD]`, as before this phase. That is register row #1's mechanism: the cart holds no price. Now "Shipping 200 ден" sits between two placeholder boxes. It is honest, but it reads oddly. **The cart still computes no total**, as the brief requires. The real fix is the cart knowing prices, and that is not this phase.
- **`{cost}` does appear once in every page's HTML**, as the untranslated `Cart.shippingValue` template inside the client message payload, the same way `{orderNumber}` and every other ICU slot ships to the browser. It appears **nowhere in visible text or JSON-LD** (checked on all 16 URLs). I read the DoD's "no literal `{cost}` anywhere in the rendered HTML" as visible text + structured data. If the orchestrator meant the raw byte stream, the only way to get there is to take `Cart` out of the client namespaces or move the cost out of ICU, both bigger changes.
- **The string inventory now flags `Cart.shippingValue` as "byte-identical MK/EN"** (`{cost}` in both). That is correct: the template is shared and the rendered value differs. The MK review pack says so, so nobody "fixes" it.
- **The humanizer pass proposed no changes.** The eight EN strings are plain and present-tense. The Terms line's "approximate… for reference only" + "You always pay in denars" looks like doubled hedging, but it is deliberate legal clarity, so it stays.
- **`npm test` passed on clean `main` (186/186), so no preflight reset was needed.** The reset in this phase was only for rendering (`D-Y.09-11`).
- **The rate itself is not independently checked.** 54.3 MKD/USD is recorded in `facts.md` as *supplied in the brief*. My knowledge doesn't reach 2026-09-29, and I did not look it up. Owed #78 covers the re-check.
- **Nothing in the brief was wrong.** The one ambiguity, "the 2.01 currency decision", resolved to `D-2.01-8` (it is the only 2.01 entry with the no-conversion clause) and got the partial-supersession treatment above.

---

## 4. Files touched

`file-map.md` updated: **yes** (status paragraph, tree lines, change-log row).

| File | Added / Modified / Deleted |
|---|---|
| `src/config/currency.ts` | Added |
| `src/config/shipping.ts` | Added |
| `src/components/system/WithUsdApprox.tsx` | Added |
| `tests/format/usd-approx.test.ts` | Added |
| `tests/config/delivery-cost.test.ts` | Added |
| `tests/i18n/delivery-cost-copy.test.ts` | Added |
| `tests/pages/shipping-page.test.ts` | Added |
| `docs/i18n/mk-review-y09.md` | Added (unsigned) |
| `briefs/Part-Y-Phase-09-Code.md` | Added |
| `src/_project-state/completions/Part-Y-Phase-09-Completion.md` | Added |
| `src/lib/format.ts` | Modified (+2 functions, header comment; `formatMkd` body unchanged) |
| `src/app/[locale]/shipping-returns/page.tsx` | Modified |
| `src/app/[locale]/terms/page.tsx` | Modified (`LAST_UPDATED` only) |
| `src/app/[locale]/catalog/[slug]/page.tsx` | Modified (price wrapped) |
| `src/components/product/ProductCard.tsx` | Modified (price wrapped) |
| `src/components/home/HomeShowcase.tsx` | Modified (price wrapped) |
| `src/components/home/HomeFaq.tsx` | Modified (`{cost}` translator) |
| `src/components/cart/CartView.tsx` | Modified (shipping line) |
| `src/app/llms.txt/route.ts` | Modified (line 35 only) |
| `src/messages/mk.json`, `src/messages/en.json` | Modified (9 keys changed, 6 deleted each → 268) |
| `docs/i18n/string-inventory.md` | Modified (regenerated) |
| `facts.md` | Modified (§7 rows + paragraph, header date, changelog) |
| `Decisions.md` | Modified (`D-Y.09-1…12` appended; `D-2.01-8` Status line only) |
| `src/_project-state/current-state.md` | Modified |
| `src/_project-state/file-map.md` | Modified |
| `src/_project-state/00_stack-and-config.md` | Modified (one row appended) |

**Keys changed, both locales:** `Nav.shipping`, `ShippingReturns.h1`, `ShippingReturns.intro`, `ShippingReturns.deliveryHeading`, `ShippingReturns.deliveryBody`, `Faq.a5`, `Cart.shippingValue`, `Meta.shippingTitle`, `Terms.pricesBody`.
**Keys deleted, both locales:** `ShippingReturns.limitsHeading`, `ShippingReturns.limitsBody`, `ShippingReturns.returnsHeading`, `ShippingReturns.returnsBody`, `Placeholder.courier`, `Placeholder.returnsWindow`. The styleguide referenced neither placeholder key.
**The catalog sweep (Task 5)** found **no other** string stating the cost was unknown. The only matches were `ShippingReturns.deliveryBody`, `Faq.a5` and `Cart.shippingValue` ("calculated on delivery").

**Out-of-scope proof.** `git diff main --stat` is **empty** on: `src/i18n/routing.ts`, `supabase/`, `src/lib/orders`, `src/lib/email`, `src/lib/drop/`, `src/config/{drops,products,index}.ts`, `scripts/sync-drop.ts`, `src/lib/seo/product-jsonld.ts`, `src/lib/product-images.ts`, `src/components/system/PhotoSlot.tsx`, `src/app/[locale]/privacy`, `src/app/[locale]/styleguide`, `src/app/globals.css`, `brand.md`, `next.config.ts`, `package.json`, `package-lock.json`, `src/types`, `public/`.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ clean |
| Types | `npx tsc --noEmit` | ✅ clean |
| Lint | `npm run lint` | ✅ **0 errors**, 143 warnings, all in the untracked `.claude/` folder; `npx eslint src tests scripts` → no output |
| Unit / integration | `npm test` | ✅ **225/225** (30 files): 186 existing + **39 new**. Final run was against a fresh `supabase db reset` + `sync:drop` |

**TDD.** All five brief-listed tests were written first and run red for the right reason: `formatUsdApprox is not a function` ×6, `formatMkdWithApproxUsd is not a function` ×6, `expected undefined to be 200`, `expected undefined to be 54.3`, catalog strings missing `{cost}`, "unconfirmed" strings present, `<Placeholder` found in the page source, and so on. The module-not-found import errors were first turned into assertion failures with empty `export {}` stubs. **Four tests passed on first run, correctly, because they are regression guards over the pre-change state:** no literal `200` in either catalog (×2), `formatMkd` unchanged, no `$` in MK.

**Concurrent-order test.** Not mandatory for Y.09 (no stock or reservation change), but it ran as part of `npm test`:

```
✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 209ms
✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 5 simultaneous 3-unit orders against one 3-unit variant → exactly 1 succeeds, 4 × TR004, stock 0, no partial rows 38ms
```

---

## 6. Definition of Done

### Verified here (by me)

Rendered on the dev server against the local DB (real rehearsal drop, `D-Y.09-11`). I used curl for all 16 Task-9 URLs (all **200**) and the in-app browser at **390 px and 1280 px**, both locales.

| Item | Result |
|---|---|
| New tests watched red, then green: USD formatter (22 / 37 / 4 / null on MK), delivery constant, no literal `200`, no "unconfirmed cost" string, no placeholder on Shipping | ☑ (see § 5) |
| `/en/catalog`, all three EN product pages and the EN Home showcase show `≈ $22` next to 1,199 MKD and `≈ $37` next to 1,999 MKD; no truncation at 390 px | ☑ At 390 px on the 2-column grid, each card reads "1,199 MKD ≈ $22" on **one line** with 34 px to spare and no overflow. Price is 13px/600 foreground, dollar figure 13px/400 muted `#ABA79E`. Product page: 20px price, 13px dollar. Showcase: 20px/600 price, 13px/400 dollar |
| No `$` renders anywhere on the MK locale | ☑ Zero `$` and zero `≈` in visible text on `/`, `/katalog`, all three `/katalog/<slug>`, `/isporaka-i-vrakjanje`, `/uslovi`, `/kosnicka` (curl, scripts stripped). Rechecked in the browser including client-rendered content and the Home FAQ with every answer opened. MK price markup is byte-identical (no wrapper) |
| Shipping page: h1 "Shipping" / „Испорака“; exactly four sections; "Delivery time: 3–5 business days." + "Delivery cost: 200 MKD (≈ $4)." / „Цена на достава: 200 ден.“; zero Placeholder; Last updated 29 September 2026 | ☑ All confirmed in both locales ("Last updated: September 29, 2026" / „Последно ажурирано: 29 септември 2026 г.“). `data-placeholder` count 0. Tab titles "Shipping — Trajanov" / „Испорака — Trajanov“. The footer link reads the new label |
| Home FAQ answer 5 and its FAQPage JSON-LD both carry the interpolated cost; no literal `{cost}` | ☑ JSON-LD a5 **equals** the visible a5 in both locales (EN "…costs 200 MKD (≈ $4). You pay cash at the door.", MK "…Цената на доставата е 200 ден. …"). No `{cost}` in visible text or any JSON-LD. One occurs in the client message payload; see § 3 |
| Cart shipping line shows the cost in both locales; the cart still shows no total | ☑ "Shipping 200 MKD (≈ $4)" / „Испорака 200 ден“, with Total still a placeholder. The cart needs an item to show the summary, so I seeded one line in the tab's `sessionStorage` for inspection only |
| Terms prices text updated in both locales; Terms "Last updated" 29 September 2026 | ☑ |
| Product JSON-LD (if any) states MKD only | ☑ **No Product node renders** (names still null). The pages carry only Organization/WebSite (+ FAQPage on Home), with no price and no USD |
| MK ⇔ EN key counts identical; inventory regenerated; `mk-review-y09.md` committed unsigned | ☑ 268 = 268 (parity test green) |
| `git diff main` empty on every out-of-scope path, incl. `src/i18n/routing.ts` | ☑ (§ 4) |
| build, lint, typecheck, test all pass | ☑ (§ 5) |
| `facts.md`, `Decisions.md` (`D-Y.09-1…12`, `D-2.01-8` marked), `current-state.md`, `file-map.md` updated | ☑ |
| PR open, not merged | ☑ #44 |

Checked against `brand.md`: the dollar figure uses only tokens (`text-muted-foreground`, `text-small`, the spacing scale), with no hardcoded colour or size. Muted on ground is 7.9:1 in the ledger (WCAG AA 4.5), and the card surface is a hair lighter.

### Owed to Lazar (only he / a real device / a real account can confirm)

All four are on the register as **#75–#78**.

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 75 | **Petar reviews PR #44 before merge** (`D-0-3`) | https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/44 — read against `briefs/Part-Y-Phase-09-Code.md` | A review recorded on the PR, not only a merge |
| 76 | **Real phone, live domain, after deploy** | `https://www.trajanovv.com/en/catalog`, one EN product page, `/en/shipping-returns`, `/isporaka-i-vrakjanje` | Checklist below |
| 77 | **Native MK review** | `docs/i18n/mk-review-y09.md` | Both boxes signed. Check especially „кого да го викаш“ (phone?), „достава“ vs „испорака“, and plain „долари“ |
| 78 | **USD rate re-check** | `src/config/currency.ts` + `facts.md` §7 | Re-checked **before the first real drop**, then at least quarterly. Constant + date + facts row change in one commit |

**Real-phone checklist for #76:**
1. On the English catalog, every price reads like "1,199 MKD ≈ $22", with the dollar part smaller and greyer, and nothing cut off.
2. On the Macedonian site there is no dollar sign anywhere.
3. The Shipping page title is "Shipping", and there is no "Returns" section and no grey placeholder box.
4. The Shipping page says delivery takes 3–5 business days and costs 200 MKD (≈ $4 in English), and 200 ден in Macedonian.
5. The Home FAQ answer about delivery states the 200 MKD cost in both languages.

---

## 7. Placeholders shipped

**None added.** Two rows changed:

| Placeholder | Page | Change |
|---|---|---|
| #6 `[PLACEHOLDER: курир и цена на испорака — Владимир]` | Shipping | **CLEARED** — 200 MKD VERIFIED; the courier is not named and no placeholder remains (`D-Y.09-2`) |
| #7 `[PLACEHOLDER: рок за враќање и замена — Владимир]` | Shipping | **CLOSED — removed by owner decision, NOT filled.** The window is still unknown (`D-Y.09-3`) |

Register now at **4 open rows (#2, #4, #8, #10)**. **Product 01's slot 2 still shows its photo placeholder** (row #2); the held photo is not in this phase.

**Page-is-wrong check.** The Shipping page now looks finished **because a section was removed, not because a fact was found.** The returns window is still missing. Removing it was Lazar's call, recorded with its downside (`D-Y.09-3`, Known issue #11): the site says nothing about returns, and the law's distance-selling rights apply whatever it says.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ Every rendered claim maps to a §7 row: 200 MKD → *Delivery cost*; 3–5 days → *Delivery time*; "approximate price in US dollars, for reference only / you always pay in denars" → amended *Currency* row; the `≈ $N` figures → *USD reference rate* row. That last row is recorded as **supplied**, not independently verified by Code (§ 3) |
| `humanizer` pass run on user-facing copy | ☑ 8 EN strings; no changes proposed (§ 3) |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ No courier name invented, and no returns window, "no returns" policy or statutory period written |
| Template-propagated strings verified once against `facts.md` before generation | ☑ `Faq.a5` → visible + JSON-LD from one translator. A unit test asserts JSON-LD a5 carries the cost in both locales, and the rendered HTML confirms visible == JSON-LD |
| No AI-generated product imagery (`D-0-6`) | ☑ No images touched |
| No untranslated EN string in the MK build | ☑ Every changed key is translated. `Cart.shippingValue` is `{cost}` in both, which renders „200 ден“ on MK |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ Nothing secret was added. The local-only DB URL was masked when inspected, and the render scripts live in the scratchpad, not the repo |
| `.env*` still gitignored | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ No env var added |
| No order PII (phone, address) in logs | ☑ No logging added |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Merge of PR #44 | Petar's review (#75) | Petar |
| Real-phone check (#76) | Merge + deploy | Lazar |
| Native MK review (#77) | Reviewers | Lazar + Petar |
| USD rate re-check (#78) | Before the first real drop | Lazar / Petar |
| `llms.txt` "maximum of 2 units" + product-page „величини — примерок“ (Known issue #13) | A brief | Orchestrator |
| Product 01 slot-2 photo | Confirmation it is an unaltered photo of the real shirt (`D-0-6`) | Orchestrator / Lazar |
| Courier name | Vladimir, if the owner wants it shown | Vladimir |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ NEXT target **unchanged**; Y.09 status text added after it |
| `current-state.md` — owed-verification register | ☑ #75–#78 added |
| `current-state.md` — placeholder register | ☑ #6 struck CLEARED, #7 struck CLOSED (removed, not filled), Y.09 note added |
| `current-state.md` — Known issues | ☑ #11 (silent on returns), #12 (USD drift), #13 (two stale claims) |
| `file-map.md` — matches what is actually on disk | ☑ |
| `00_stack-and-config.md` — new deps / pins / config | ☑ One row: no dependency; two hand-maintained constants |
| `Decisions.md` — every § 2 entry appended | ☑ `D-Y.09-1…12`; `D-2.01-8` Status only |

**`NEXT:` line I set:** unchanged: `NEXT: **[P2] `/impeccable polish` + the closing `/impeccable audit` — on a NEW branch (`D-2.25-26`).**`, with the Y.09 status text after it.
