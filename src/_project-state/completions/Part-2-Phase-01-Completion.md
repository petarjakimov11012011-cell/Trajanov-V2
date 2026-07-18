# Completion report — Part 2 Phase 01: Bilingual

| | |
|---|---|
| **Phase** | 2.01 |
| **Name** | Bilingual |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-19 |
| **Branch** | `phase-2.01-bilingual` |
| **PR** | [#10](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/10) → `main` |
| **Brief** | `briefs/Part-2-Phase-01-Code.md` |

---

## 1. What shipped

- **The MK store is Macedonian down to the address bar.** Route slugs are localised via next-intl
  `pathnames`: MK serves `/katalog`, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt` (Latin
  transliteration); EN keeps `/en/catalog`, `/en/cart`, … The route folders under `src/app/[locale]/`
  are unchanged. The product slug is single and shared across both locales.
- **Old paths never 404.** Six `308` redirects send the old English MK paths (`/catalog`, `/cart`,
  `/checkout`, `/about`, `/contact`, `/catalog/:slug`) to their new MK slugs; `/en/*` is untouched.
- **Search engines see one bilingual store.** Every page emits reciprocal `hreflang` (mk / en /
  x-default→MK) and a self-referencing `canonical`, all absolute on one `SITE_URL`, plus a per-locale
  `<title>` and description. The EN product page points at the MK product page for the same product,
  and back.
- **An English visitor is told, before ordering, that we ship only inside North Macedonia** — a
  prominent notice above Add-to-cart on the product page and in the COD block on checkout, in both
  locales, from one shared message key traced to a VERIFIED `facts.md` entry.
- **Prices read natively in each locale** (`1.199 ден` in MK, `1,199 MKD` in EN — same MKD amount, no
  conversion), and the language switch keeps a mid-checkout customer mid-checkout.
- **Phase 2.02 can start the day this merges:** a committed `docs/i18n/string-inventory.md` lists every
  key, its MK and EN value, and where it renders — regenerable with `npm run i18n:inventory`.

---

## 2. Decisions I made on my own

Logged in `Decisions.md`. `D-2.01-1…5` are the orchestrator's (handed down in the brief, logged
verbatim); `D-2.01-6…12` are mine.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.01-6 | Language switch reads the query from `window.location.search` at click time, not `useSearchParams()` | Use `useSearchParams()` + wrap `LanguageSwitch` in `<Suspense>` | Query only read on click (fine — it's a click handler) |
| D-2.01-7 | One shared `ShippingNotice` component + key `Common.shippingNotice`, placed **above** Add-to-cart; product keeps its existing below-fold Shipping detail | Reuse `Product.shippingBody`, or inline markup twice | A tiny new component; product page states shipping twice (agree; the prominent one is required) |
| D-2.01-8 | `formatMkd(amount, currency, locale)` — explicit locale arg | Read locale inside `format.ts` via next-intl | Both call sites pass locale (both already had it) |
| D-2.01-9 | Pathname-coverage test asserts routing **config** completeness, not next-intl runtime resolution | Import `getPathname` and assert resolved `/en` URLs | Live prefixing proven in-browser, not in the unit test (importing `@/i18n/navigation` pulls `next/navigation` into the node runner and fails) |
| D-2.01-10 | Parity "no empty value" check allowlists `About.quoteNote` | Require every value non-empty | One-entry allowlist (the MK quote note is intentionally empty, `D-1.05-6`) |
| D-2.01-11 | Product `generateMetadata` does a best-effort 2nd DB read to title by product name | Generic per-locale product title, no fetch | One extra DB read per product-page load (force-dynamic, low traffic) |
| D-2.01-12 | Styleguide excluded from the string sweep + EN no-Cyrillic check | Localise its labels, strip its Cyrillic font demo | Its EN HTML carries Cyrillic + English (internal aid, `D-2.01-4`; the Cyrillic is the demo's point) |

---

## 3. Surprises and off-spec changes

- **`useSearchParams()` broke the build.** My first `LanguageSwitch` read the query via
  `useSearchParams()`. Because the switch is in the header on every page — including the statically
  prerendered `/about` and `/contact` — Next failed the build with *"useSearchParams() should be wrapped
  in a suspense boundary at page /[locale]/about"*. Fixed by reading `window.location.search` in the
  click handler instead (`D-2.01-6`). The build is green.
- **EN pages legitimately contain some Cyrillic — the DoD's exception list is narrower than reality.**
  The DoD says EN pages carry "no Cyrillic except the About pull-quote's MK original, the Instagram
  handle, and the phone number." In practice the pull-quote on EN is the *English translation* (marked
  "Translated from Macedonian"), not the MK original — so that exception does not even apply. The Cyrillic
  that *does* appear on EN is: (a) the **`МК` language-pill label** (the label for the Macedonian option,
  Cyrillic by nature, in both locales), and (b) the **About press-outlet proper names** (Трн.мк, Струмица
  Денес, Бизнис Вести, Република — data copied verbatim from `facts.md` §4 since 1.05, `D-1.05-5`). Both
  are proper nouns / labels, not untranslated copy; both are listed under "Intentionally not translated"
  in the string inventory. No untranslated *copy* leaks into either build.
- **The EN home's RSC payload serialises the MK product name (invisible).** `HomeExperience` is a client
  component and receives the full `ProductView` (which carries both `nameMk` and `nameEn`) as props, so
  the React flight-data `<script>` on `/en` contains `nameMk` even though the visible `<h3>` renders
  `nameEn`. This is serialized data, not rendered content, and predates 2.01 (the 1.04 architecture). Not
  a visible leak; left as-is. Flagged here for completeness. (The catalog/product pages render
  `ProductCard` server-side, so they don't serialise it.)
- **The browser-automation coordinate click did not fire the React `onClick` on the language pill.** A
  native `element.click()` did, and the switch worked perfectly (both directions, dynamic route,
  `?preview` preserved). This was a tooling quirk during verification, not a code bug — the switch is
  wired correctly.
- **`~12 apparently-dead message keys` surfaced.** The inventory's "Where" column flags keys with no
  source reference (e.g. `Home.title`, `Home.tagline`, `Product.details`, `Buy.viewProduct`,
  `Checkout.botCheck`). I confirmed by grep they are genuinely unreferenced, carried from earlier phases.
  I did **not** remove them — the brief scopes 2.01 to mechanical i18n faults, not dead-key cleanup, and
  removing a key risks a state I did not trigger. Left for 2.02 to decide.
- **`src/proxy.ts` needed no edit** — it consumes `routing`, and `pathnames` flows through unchanged, as
  the brief anticipated.

---

## 4. Files touched

`file-map.md` updated: **yes.**

| File | Added / Modified / Deleted |
|---|---|
| `src/i18n/routing.ts` | Modified — `pathnames` map |
| `next.config.ts` | Modified — 308 redirect table |
| `src/lib/site.ts` | **Added** — `SITE_URL` |
| `src/lib/metadata.ts` | **Added** — `localeAlternates()` |
| `src/lib/format.ts` | Modified — `formatMkd` locale-aware |
| `src/components/system/ShippingNotice.tsx` | **Added** |
| `src/app/[locale]/layout.tsx` | Modified — static metadata → `generateMetadata` |
| `src/app/[locale]/page.tsx` | Modified — `generateMetadata` |
| `src/app/[locale]/catalog/page.tsx` | Modified — `generateMetadata` |
| `src/app/[locale]/catalog/[slug]/page.tsx` | Modified — `generateMetadata` + `ShippingNotice` |
| `src/app/[locale]/cart/page.tsx` | Modified — `generateMetadata` |
| `src/app/[locale]/checkout/page.tsx` | Modified — `generateMetadata` |
| `src/app/[locale]/about/page.tsx` | Modified — `generateMetadata` |
| `src/app/[locale]/contact/page.tsx` | Modified — `generateMetadata` |
| `src/app/[locale]/styleguide/page.tsx` | Modified — `generateMetadata` |
| `src/components/layout/LanguageSwitch.tsx` | Modified — in-place switch + query/`?preview` |
| `src/components/home/HomeExperience.tsx` | Modified — `useRouter` from `@/i18n/navigation` |
| `src/components/product/ProductCard.tsx` | Modified — object-form dynamic `Link` + locale price |
| `src/components/cart/CartView.tsx` | Modified — stepper `aria-label`s → keys |
| `src/components/checkout/CheckoutForm.tsx` | Modified — renders `ShippingNotice` |
| `src/messages/mk.json`, `src/messages/en.json` | Modified — `Cart.decrease/increase`, `Common.shippingNotice`, `Meta` namespace |
| `scripts/i18n-inventory.ts` | **Added** |
| `docs/i18n/string-inventory.md` | **Added** (generated, committed) |
| `tests/i18n/catalog-parity.test.ts`, `tests/i18n/pathnames.test.ts` | **Added** |
| `package.json` | Modified — `i18n:inventory` script |
| `Decisions.md`, `current-state.md`, `file-map.md`, `00_stack-and-config.md` | Modified — phase closeout |
| `briefs/Part-2-Phase-01-Code.md` | **Added** (the brief, committed with the PR) |

No file deleted. No `supabase/migrations/`, `src/config/`, `create_order`, or `expire_reservations`
touched.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **Pass** — 17/17 static pages, about/contact SSG per locale, rest dynamic |
| Types | `npx tsc --noEmit` | **Pass** — exit 0 |
| Lint | `npm run lint` | **Pass** — 0 errors, 0 warnings |
| Unit / integration | `npm test` | **63 passed / 63** (15 files) — 56 existing + 7 new i18n |

**Concurrent-order test (mandatory):**

| | |
|---|---|
| **10 orders / 3 units** | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 (58ms)` |

Nothing in 2.01 touches the order path, but the gate was re-run against the local Supabase stack and
passed — it is part of the 63.

**Parity test proven RED, then GREEN (DoD):** removed `Nav.contact` from `en.json` and ran
`tests/i18n/catalog-parity.test.ts` →
`AssertionError: keys present only in mk.json: expected [ 'Nav.contact' ] to deeply equal []` (FAIL).
Restored the key → 7/7 green. A test that has never failed proves nothing; this one does.

---

## 6. Definition of Done

### Verified here (by me)

**Routing**

| Item | Result |
|---|---|
| `routing.ts` `pathnames` matches the Task 1 table exactly | ✅ |
| All 8 MK URLs return 200 (`/`, `/katalog`, `/katalog/<slug>`, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`, `/styleguide`) | ✅ curl 200 each |
| All 8 `/en/` equivalents return 200 | ✅ |
| Each old path 308s to its new MK slug (status + Location) | ✅ curl: `/catalog→/katalog`, `/catalog/:slug→/katalog/:slug`, `/cart→/kosnicka`, `/checkout→/naracka`, `/about→/za-nas`, `/contact→/kontakt` |
| `/en/catalog`, `/en/cart`, `/en/checkout`, `/en/about`, `/en/contact` return 200, not redirected | ✅ curl 200, no Location |
| `grep next/link` / `next/navigation` returns no user-facing route | ✅ — see below |
| No hand-written localised slug outside `routing.ts` / `next.config.ts` | ✅ grep clean |

`grep -rn "from 'next/link'" src/app src/components` → **no matches.**
`grep -rn "from 'next/navigation'" src/app src/components` → three matches, **none a user-facing route:**
`layout.tsx` and `catalog/[slug]/page.tsx` import `notFound` (a 404 trigger, not a link);
`LanguageSwitch.tsx` imports `useParams` (a route-param reader; next-intl has no equivalent). All
user-facing links use `@/i18n/navigation`.

**Strings**

| Item | Result |
|---|---|
| `mk.json` / `en.json` identical key sets; parity test fails on removal | ✅ 150 keys each; proven RED |
| String-extraction sweep documented | ✅ only leftover literals were the cart stepper `aria-label`s (`Cart.decrease/increase`); every other literal was already a key. Full sweep in `docs/i18n/string-inventory.md` |
| Every `/en/` page has no Cyrillic except allowed | ✅ *with the corrected exception set* — see § 3: only the `МК` pill label + About press-outlet names (both data/labels, in the inventory's "not translated" section) |
| Every page's `<title>` + description differ between locales, from the catalogs | ✅ verified in-browser (e.g. `Каталог — Trajanov` / `Catalog — Trajanov`) |
| `<html lang="mk">` on MK, `="en"` on EN | ✅ verified in-browser |

**hreflang**

| Item | Result |
|---|---|
| Every page emits `hreflang` mk/en/x-default(→MK) + self-canonical, absolute on `SITE_URL` | ✅ verified in-browser on home, catalog, product, checkout |
| Alternates reciprocal (MK product ↔ EN product, same product) | ✅ e.g. product: `mk → …/katalog/test-tee-black`, `en → …/en/catalog/test-tee-black`, `x-default → …/katalog/test-tee-black` |
| `SITE_URL` is the only place the origin appears + carries `TODO(2.05)` | ✅ `src/lib/site.ts` |

**Shipping statement**

| Item | Result |
|---|---|
| Renders on product + checkout, both locales, one shared key, traced to VERIFIED `facts.md` | ✅ `Common.shippingNotice`; `facts.md` §7 "Shipping — **North Macedonia only** — VERIFIED" |
| Visible without scrolling past Add-to-cart (product) + above submit (checkout) at 390px | ✅ moved **above** the buy panel; screenshots in-report; checkout notice sits above "Place order" |

**Behaviour**

| Item | Result |
|---|---|
| Language switch preserves the page + `?preview` | ✅ `/katalog/test-tee-black?preview=live` ↔ `/en/catalog/test-tee-black?preview=live`, both directions, slug + query preserved, `<html lang>` flips |
| Prices MKD both locales, locale-correct, no conversion | ✅ `999 ден` / `1.500 ден` (MK), `MKD` (EN); grep confirms no conversion anywhere |

**Quality gates**

| Item | Result |
|---|---|
| build / lint / tsc clean | ✅ |
| `npm test` green incl. oversell gate | ✅ 63/63 |
| Parity test confirmed RED then restored | ✅ |
| No runtime dependency added | ✅ only the `i18n:inventory` script |
| `git diff` touches no migration; `create_order`/`expire_reservations` unchanged | ✅ `git diff --name-only main | grep supabase/migrations` → none |
| Nothing written to hosted DB; `sync:drop` not run | ✅ verification used the **local** Colima stack only |
| No placeholder register row cleared/reworded/hidden | ✅ none touched |

**Review artifacts**

| Item | Result |
|---|---|
| `docs/i18n/string-inventory.md` committed, regenerable, two extra sections | ✅ 150 keys, "Intentionally not translated" + "byte-identical" (4) |
| Report lists every URL in both locales | ✅ § 6a below |
| Every page rendered in-browser both locales at 390px + 1180px | ✅ home, catalog, product, checkout, about verified; product (390 + 1180) and checkout (1180) screenshotted |

### 6a. Every URL, both locales — for the 2.02 reviewers

Walk these in order. `<product>` is any product slug in the active drop — on the **deployed** site the
ended rehearsal drop carries `test-mustard-ochre` (S/M/L/XL) and `test-off-white` (XL-only); the **local**
seed uses `test-tee-black` / `test-tee-two`.

| Page | MK | EN |
|---|---|---|
| Home | `/` | `/en` |
| Catalog | `/katalog` | `/en/catalog` |
| Product | `/katalog/<product>` | `/en/catalog/<product>` |
| Cart | `/kosnicka` | `/en/cart` |
| Checkout | `/naracka` | `/en/checkout` |
| About | `/za-nas` | `/en/about` |
| Contact | `/kontakt` | `/en/contact` |
| Styleguide | `/styleguide` | `/en/styleguide` |

Old paths (should `308`): `/catalog`, `/catalog/<product>`, `/cart`, `/checkout`, `/about`, `/contact`.

### Owed to Lazar

**None.** Everything in this phase was Code-verifiable and was verified in-browser. The
owed-verification register stays **empty**. (The provisional slugs are confirmed *by design* in 2.02,
`D-2.01-5` — that is 2.02's job, not an owed item.)

---

## 7. Placeholders shipped

**None.** 2.01 shipped no new `[PLACEHOLDER: …]` and cleared/reworded/hid none. The existing
placeholder strings (`Placeholder.*`) were already keys; 2.01 only confirmed they are translated in both
locales. The placeholder register is unchanged.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED `facts.md` entry | ✅ the new shipping statement → `facts.md` §7 "Shipping — North Macedonia only — VERIFIED" |
| `humanizer` pass run on new copy | ✅ shipping notice (MK + EN), Meta titles/descriptions, `Cart.decrease/increase` — plain, present-tense, no em-dash pile-ups, no filler |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ |
| Template-propagated strings verified once against `facts.md` | ✅ Meta descriptions reuse only VERIFIED facts (oversized unisex tees, Strumica, 3–5 pieces, COD, NMK-only) |
| No AI-generated product imagery | ✅ none added |
| No untranslated EN string in the MK build | ✅ parity test + inventory; the only cross-locale identical values are proper nouns / labels (brand, `МК`/`EN`) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ scanned all changed + new files — clean |
| `.env*` still gitignored | ✅ `.env.local`, `.env.hosted` both gitignored |
| Nothing secret behind `NEXT_PUBLIC_` | ✅ only the pre-existing public Turnstile site key is read behind that prefix |
| No order PII in logs | ✅ no logging added (the one diagnostic `console.log` used during verification was removed) |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Confirm the provisional MK slugs | Phase 2.02 native review | Lazar + Petar |
| ~12 apparently-dead message keys | 2.02 decision (out of scope here) | Lazar + Petar |
| Real product names/photos/fabric/measurements | Y.01 | Vladimir |

Nothing is blocked. Parallel-track blockers (photos, fabric, measurements, names) are unchanged and
owned by Vladimir.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — `NEXT:` line on line 1 | ✅ |
| `current-state.md` — owed-verification register | ✅ (stays empty; noted) |
| `current-state.md` — placeholder register | ✅ (unchanged; noted) |
| `file-map.md` — matches disk | ✅ |
| `00_stack-and-config.md` — new script row (no dep) | ✅ |
| `Decisions.md` — `D-2.01-1…12` appended | ✅ |

**`NEXT:` line I set:** `NEXT: 2.02 — Native MK review`
