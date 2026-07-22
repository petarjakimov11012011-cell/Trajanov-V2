# Completion report — Part 2 Phase Y.02: Add "Product 03" (baby blue) catalog stub

| | |
|---|---|
| **Phase** | Y.02 |
| **Name** | Add "Product 03" (baby blue) catalog stub |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-22 |
| **Branch** | `phase-y.02-product-03-stub` |
| **PR** | _(open to `main`)_ |
| **Brief** | Part 2 · Phase Y.02 · Code — Add "Product 03" (baby blue) catalog stub |

---

## 1. What shipped

- **A third product, "Product 03" (baby blue), is now a visible catalog stub** — recorded honestly
  with the two facts we have (price **1999 MKD**, sizes **S/M/L/XL**, both owner-VERIFIED) and visible
  placeholders for everything we do not (photo, fabric/care, real name).
- **`facts.md` §7 gained a `### Product 03 — baby blue` sub-block:** price + sizes VERIFIED (owner,
  2026-07-22); the colourway itself is **owner-stated, NOT photographed** (deliberately *not* marked
  "VERIFIED (photos)" like the other two); photos + fabric/care + real name **OWED** (Vladimir).
- **`src/config/products.ts` carries a third product, `test-baby-blue`,** added to the existing
  **ENDED** `test-drop`, mirroring the two colourways exactly (null names → neutral slot "Производ 03";
  1999 MKD; null photo/care; sizes S/M/L/XL, stock 3 each — nominal, the drop is ended so nothing is
  buyable).
- **The catalog now lists three products** and Product 03 has its own product page — both rendered and
  verified in-browser, both locales (see §5 / §6). It renders **browsable-but-not-buyable** (the site's
  default state between drops), because `test-drop` is ended and no live drop exists.
- **No commerce logic touched, no migration, no new user-facing string, no new dependency.** Product 03
  reuses the existing shared placeholder keys and the shared MKD price format, so both `mk` and `en`
  already carry every string it renders.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.02-1` | Owner-authorised out-of-order insert — Product 03 added as a catalog stub ahead of Y.01 (this is the brief's own decision, logged verbatim; Lazar's call, 2026-07-22). | Option A — fold baby blue into the full Y.01 drop-content load. | Two new placeholders on the register (photo, fabric — plus the name), and a product page that cannot enter a live drop until real photos + fabric arrive. |
| `D-Y.02-2` | Product 03 joins the **existing ENDED `test-drop`**, not a new or live drop. This is the only placement that satisfies "catalog lists three products" + "browsable-but-not-buyable" + "committed drop stays ENDED" together, because `products.drop_id` is NOT NULL and the catalog is drop-scoped (`pickActiveDrop` renders exactly one drop's products). | (a) A separate new drop — would make `pickActiveDrop` feature either the new drop (hiding the other two) or keep `test-drop` active (Product 03 never appears); either breaks "three products." (b) A drop-less product — impossible under the schema + drop-scoped catalog. | Product 03 shares `test-drop`'s `drop_id`, its ENDED window, and the `test-` slug prefix (`test-baby-blue`). Its real drop assignment is deferred to Y.01. |
| `D-Y.02-3` | **No migration.** Product 03 + its per-size variant rows land via the typed config + the existing INSERT-only `npm run sync:drop` (`D-1.04-5`/`D-1.04-11`) — a data operation, not a schema change. | A hand-written migration inserting the product/variant rows — would duplicate the sync, bypass its preflights + INSERT-only-stock guarantee, and put catalog DATA in a schema-migration file. | The rows reach a database only when someone runs the sync against it, so **production shows Product 03 only after the operator syncs** (the same step every drop change needs). Verified against the local DB this phase. |

---

## 3. Surprises and off-spec changes

- **"NOT assigned to any drop" is architecturally impossible as stated — read as "no *live* drop."**
  The brief says Product 03 is "added to the catalog only; NOT assigned to any drop." But the data model
  makes a drop-less product impossible: `products.drop_id` is **NOT NULL** (`schema.sql`), the config
  `PRODUCTS` map is **keyed by drop slug**, and the catalog is **drop-scoped** (`getActiveDropView` →
  `pickActiveDrop` renders one drop's products). I resolved this by adding Product 03 to the existing
  **ENDED** `test-drop` — the DoD's own words back this reading: "browsable but not buyable **(no live
  drop)**." `drops.ts` (the schedule) is untouched, so the committed drop stays ENDED and nothing is
  buyable. Logged as `D-Y.02-2`. **The orchestrator should phrase the Y.01 brief as "assign to its own
  real drop," not "assign to a drop from none," since it already has one (`test-drop`).**
- **No migration was needed** — see `D-Y.02-3`. The brief anticipated one "if adding it requires" it;
  it does not, because the sync is the established INSERT path for products/variants. I wrote none.
- **No new user-facing string.** The brief says "every new user-facing string in both `mk` and `en`."
  There are **zero** new strings: Product 03 reuses the shared `Placeholder.productPhoto` /
  `Placeholder.composition` / `Placeholder.productName` (neutral slot) keys and the shared `formatMkd`
  price format — all already in both catalogs. The "name shows 'Product 03'" requirement is satisfied by
  the existing neutral-slot mechanism (sort_order 3 → "Производ 03" / "Product 03"), not a hardcoded name.
- **"Description" maps to the composition/fabric section.** The product page has no separate visible
  "description" element; `Placeholder.productDescription` is used only as the page's meta description.
  The visible descriptive placeholder is the **composition/fabric** section, which renders
  `[PLACEHOLDER: …]` exactly like the other two. Mirroring the existing two is byte-for-byte in behaviour.
- **The shared size note still reads "величини — примерок" ("sizes — sample").** This pre-existing shared
  string sits under the size picker for *all three* products (it predates this phase). Since sizes are now
  VERIFIED, it is slightly stale — but it is shared UI, not per-product, and out of scope for a stub that
  must "mirror the existing two exactly." Left unchanged; flagged here for whoever does Y.01.
- **Production is not synced by this PR.** This change reaches production only when the operator runs
  `npm run sync:drop` against the hosted DB (see §10). I synced **local only**, verified, then reset local.

---

## 4. Files touched

`file-map.md` updated: **yes** (change-log row added; no file added/moved/deleted under the reserved
tree — only `products.ts` modified and this report added).

| File | Added / Modified / Deleted |
|---|---|
| `facts.md` | Modified — §7 `### Product 03 — baby blue` sub-block + change-log row |
| `src/config/products.ts` | Modified — third product `test-baby-blue` added to `test-drop` + header note |
| `Decisions.md` | Modified — `D-Y.02-1/2/3` appended |
| `src/_project-state/current-state.md` | Modified — Built note, placeholder register +3 rows (#8/#9/#10), `Last updated`/`By`; **`NEXT:` unchanged** |
| `src/_project-state/file-map.md` | Modified — change-log row for Y.02 |
| `src/_project-state/completions/Part-2-Phase-Y02-Completion.md` | Added — this report |

**Frozen files, grep-proven byte-unchanged vs `main` (empty diff):** `create_order` (both migrations),
`expire_reservations`, `schema.sql`, all 8 `supabase/migrations/*`, `src/config/drops.ts` (drop
schedule), `src/lib/site.ts` (`SITE_URL`), `src/lib/cart`, `src/components/cart`,
`src/components/checkout`, `src/lib/orders`, `src/lib/supabase`, `src/app/[locale]/{cart,checkout}`. No
`.env*` changed. Full changeset = **4 tracked files** (`facts.md`, `products.ts`, `Decisions.md`,
`current-state.md`) + this report + the `file-map.md` row.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ clean (all routes prerendered/dynamic as before) |
| Types | `npx tsc --noEmit` | ✅ clean |
| Lint | `npm run lint` | ✅ clean (no output) |
| Unit / integration | `npm test` | ✅ **85 passed (85)**, 17 files |

**Concurrent-order (oversell) test — mandatory:**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 50ms` |

**Why adding a product cannot disturb the oversell guarantee (proven, not assumed):** the concurrency
test targets the seed's `test-open-drop` / `test-tee-black` variant (`supabase/seed.sql`), which is
entirely independent of `src/config/products.ts`. Adding `test-baby-blue` to the config touches no seed
row, no `variants` table definition, and no `create_order` code — the atomic decrement is byte-unchanged.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `facts.md` §7 carries baby blue: 1999 MKD + S/M/L/XL VERIFIED (owner, 2026-07-22); photos + fabric OWED; colourway **not** claimed photographed | ☑ |
| A third product ("Product 03", baby blue, 1999 MKD, S/M/L/XL) exists where the other two are defined, mirroring their pattern | ☑ (`src/config/products.ts`, synced → DB rows verified: `sort_order` 3, 4 variants) |
| Catalog lists three products; the Product 03 page renders | ☑ (rendered both locales — see checklist below) |
| Photo, fabric/care, description ship as visible `[PLACEHOLDER: …]`; no generated image, no press photo, no stand-in, no invented fabric/description/name | ☑ |
| No user-facing English string in the MK build; both `mk`+`en` carry every new string | ☑ (zero new strings; MK render is Cyrillic throughout) |
| Product JSON-LD emits no node for Product 03 (name is a placeholder) | ☑ (page source has **no** `"@type":"Product"`; only the site-wide Organization/WebSite `@graph`) |
| `create_order`, `expire_reservations`, decrement/reservation logic, cart, checkout, `SITE_URL`, drop schedule byte-unchanged | ☑ (grep-proven — §4) |
| `npm run build`, `npx tsc --noEmit`, `npm run lint` clean | ☑ |
| `npm test` green incl. the 10-vs-3 oversell test | ☑ (85/85; result line in §5) |
| No secret committed; `.env*` gitignored; no order PII logged | ☑ (§9) |

### Owed to Lazar — UI checklist (rendered by me; re-confirmable on the real deploy after a hosted sync)

I **rendered the pages myself** (local dev server, both locales, seed drops removed locally so `test-drop`
is the sole/active drop, matching production where `test-drop` is the only drop). Evidence per item:

1. **`/katalog` (+ `/en/catalog`) — three products, Product 03 is the baby-blue one.** ✅ MK shows
   `Производ 01` / `Производ 02` / `Производ 03`; EN shows `Product 01/02/03`. Product 03 is the third card.
2. **Product 03's page — price in the same MKD format as the others; sizes S M L XL selectable.** ✅
   MK `1.999 ден`, EN `1,999 MKD` (same `formatMkd` as the 1.199 shirts); size picker shows S/M/L/XL.
3. **Photo area shows a visible placeholder — not a broken image, not a stand-in.** ✅
   `[PLACEHOLDER: фотографија — Владимир]` / `[PLACEHOLDER: product photo — Vladimir]`.
4. **Fabric/care + description show placeholders; name shows "Product 03".** ✅
   `[PLACEHOLDER: состав и нега — од етикетата]` / `[… composition & care — from the label]`; h1
   `Производ 03` / `Product 03`.
5. **Browsable but not buyable (no live drop) — the between-drops state.** ✅ Buy button `Распродадено` /
   `Sold out` (non-interactive; `test-drop` is ended); no console errors.

*No new owed-verification-register row.* When Vladimir supplies the photo / fabric / real name, filling
`facts.md` §7 + `src/config/products.ts` + `npm run sync:drop` clears register #8/#9/#10 (that is Y.01).

---

## 7. Placeholders shipped

All three are on the placeholder register (`current-state.md`), rows **#8 / #9 / #10**, owner Vladimir.
They are the **same shared placeholder strings** the generic rows #2/#3/#4 already cover, scoped now to
the new colourway so the "register to zero before the first REAL drop" gate counts three products.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| `[PLACEHOLDER: фотографија — Владимир]` (Product 03 photo) | Catalog card, Product | A real baby-blue product photo (`D-0-6`) — no stand-in, no generated image | Vladimir |
| `[PLACEHOLDER: состав и нега — од етикетата]` (Product 03 fabric/care) | Product | Composition + care read off baby blue's label | Vladimir |
| Product 03 **name** = neutral slot "Производ 03" / "Product 03" | Catalog, Product | The real customer-facing name for baby blue | Vladimir |

Price (1999 MKD) and sizes (S/M/L/XL) are **VERIFIED** and render as real facts — not placeholders.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ (price 1999 MKD + sizes S/M/L/XL — §7) |
| `humanizer` pass run on user-facing copy | ☑ (n/a — no new user-facing copy; reused existing keys) |
| No fashion-magazine filler | ☑ (no new copy) |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` | ☑ (n/a — no new strings) |
| No AI-generated product imagery (`D-0-6`) | ☑ (photo is a visible placeholder; no image) |
| No untranslated EN string in the MK build | ☑ (MK render Cyrillic throughout; no new strings) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ (4 changed files are config/facts/state/decisions — no secrets) |
| `.env*` still gitignored | ☑ (`.gitignore` line 34: `.env*`) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ (no env change) |
| No order PII (phone, address) in logs | ☑ (no logging added; local render used no real orders) |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| ~~**Production shows Product 03 only after `npm run sync:drop` against the hosted DB**~~ (`D-Y.02-3`) — **DONE 2026-07-22 (operator instruction).** The hosted sync was run (INSERT-only: +1 product `test-baby-blue`, +4 variants, existing stock untouched, 0 deleted, drop stays ENDED, orders = 0). Verified live: `www.trajanovv.com/katalog` (+ `/en`) now lists three boxes, Product 03 renders, product page loads, no Product JSON-LD. | ~~operator-run hosted sync~~ **done** | Lazar / operator |
| Product 03's photo, fabric/care, and real name (placeholder register #8/#9/#10) | Vladimir | Vladimir |
| Product 03's real drop assignment (its own live drop, real slug) | Real photos + fabric, then Y.01 | Vladimir → Y.01 |
| Shared size note "величини — примерок" is stale now sizes are VERIFIED (pre-existing, out of scope here) | A copy pass in Y.01 | Lazar / Y.01 |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (unchanged — still the 2.06 operator rehearsal, per the brief) |
| `current-state.md` — owed-verification register | ☑ (unchanged — no new owed-to-Lazar item; render done by me) |
| `current-state.md` — placeholder register | ☑ (+3 rows #8/#9/#10) |
| `file-map.md` — matches disk | ☑ (change-log row added) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (n/a — no dependency or config change) |
| `Decisions.md` — every §2 entry appended | ☑ (`D-Y.02-1/2/3`) |

**`NEXT:` line I set:** _unchanged_ — `NEXT: 2.06 operator half — the LIVE drop rehearsal on
`www.trajanovv.com` …` (this phase is an owner-authorised insert; it does not sit on the critical path).
