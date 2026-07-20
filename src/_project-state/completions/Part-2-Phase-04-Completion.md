# Completion report — Part 2 Phase 04: Performance, accessibility & SEO

| | |
|---|---|
| **Phase** | 2.04 |
| **Name** | Performance, accessibility & SEO |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-20 |
| **Branch** | `phase-2.04-perf-a11y-seo` |
| **PR** | *not yet opened — awaits an operator-authorised PR + merge (`D-0-3`)* |
| **Brief** | Part 2 · Phase 04 · Code — Performance, accessibility & SEO |

---

## 1. What shipped

- **The store is discoverable.** A dynamic `/sitemap.xml` (both locales, every indexable route absolute on
  `SITE_URL` via next-intl `getPathname` + each DB product; Cart/Checkout/`/styleguide` excluded) and a
  `/robots.txt` pointing at it. Cart, Checkout, and `/styleguide` return `noindex`; content routes stay
  indexable.
- **The store has honest structured data.** Site-wide Organization + WebSite JSON-LD (no address, no
  fabricated logo, no SearchAction, no partner; `sameAs` = the one Instagram account), and a Product
  JSON-LD generator that emits **nothing** while product names are placeholders and, for a real-named
  product, carries the real MKD price + an availability computed from the server drop state.
- **The store survives being pasted into an Instagram story.** A per-locale, type-only `next/og` share
  card (brand ground, mustard wordmark, the page's title, the IG handle) — the MK card renders native
  Cyrillic. Every route now carries an absolute `og:image` + `twitter:summary_large_image`.
- **The store is accessible.** WCAG 2.2 AA: axe zero serious/critical on Home/Catalog/Product/Checkout/Terms;
  a skip link, one H1 per page, real form labels + error wiring, a global focus ring, `lang` on the
  language switch, 24px/44px tap targets, reduced-motion respected. Two real contrast/target bugs found
  and fixed.
- **The store is fast.** Lighthouse Accessibility 100 + Best-Practices 100 on all five routes; Desktop
  Performance 100; SEO 100 on the production origin.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.04-1 | OG cards = a dynamic `/og?l=&t=` endpoint baking the Meta title, wired via a central `pageMetadata()` helper (not file-convention images) | Next file-convention `opengraph-image.tsx` (per-locale, can't carry the page title) | A public image endpoint with a title query param (clamped, non-PII); 11 pages + layout switched to the helper |
| D-2.04-2 | OG image uses brand.md hex **values** as literals + vendored Rubik Cyrillic/Latin **woff** | Parse globals.css at build / fetch the font from Google at runtime | A brand.md colour change must be mirrored in the OG route too; two small font binaries committed |
| D-2.04-3 | Product availability mapped from drop state (countdown → `PreOrder`) | Omit availability / hardcode InStock (forbidden, Plan §10) | `PreOrder` slightly implies orderability before a drop opens — closest honest schema.org value; dormant while names are placeholders |
| D-2.04-4 | Low-stock card count → the near-black-on-red **pill** (4.8:1) not raw accent-red text (4.31:1, fails AA on surface) | Recolour to error-pink / bump to large-text size | The low pill shows twice on a low card (overlay + body); surfaced a brand-ledger gap (accent validated on ground, not surface) |
| D-2.04-5 | Footer links → 24px targets; cart icon 36→44px (SC 2.5.8) | Leave them under the inline-links exception | Footer column a few px taller; cart is the tallest header control |
| D-2.04-6 | Global `:focus-visible` outline backstop (focus-ring token) | Add focus styles per un-styled link | Two focus treatments site-wide (ring on buttons, outline on links), both in the focus-ring colour |
| D-2.04-7 | Skip link ships a new `Common.skipToContent` MK string | Reuse a string / no skip link | One machine-written MK string ships ahead of native review → folded into the existing MK-review owed row #10 |
| D-2.04-8 | vitest `@`→`src` alias for the pure SEO tests | Relative imports in `src/lib/seo/*` | A test-infra config change (additive, no dep, no runtime effect) |

All eight are logged in `Decisions.md`. None is load-bearing on business facts; the two worth a second
look are **D-2.04-3** (the `PreOrder` semantics for a not-yet-open drop) and **D-2.04-4** (the brand
ledger never validated accent-red on the surface card — a real, if small, palette gap).

---

## 3. Surprises and off-spec changes

- **The brand contrast ledger has a gap the brief didn't anticipate.** `brand.md` §3 validates accent-red
  only on *ground* (4.6:1). The product card is *surface*, where accent-red text is **4.31:1 — fails AA**.
  Fixed by using the existing red pill (D-2.04-4), but `brand.md` should note that accent-as-text is
  ground-only. Flagging for the design track.
- **The `/og` route had to be excluded from the next-intl middleware.** Because `/og` has no file
  extension, the proxy matcher treated it as a MK-default page and 404'd it (the card never rendered).
  One-line matcher fix (`src/proxy.ts`); worth carrying into the brief for any future non-`[locale]` route.
- **The `canonical` Lighthouse SEO audit "fails" on localhost.** It reports "Points to another hreflang
  location" because the canonical points at the production `SITE_URL` while the test runs on `127.0.0.1`.
  I verified it **passes with SEO 100 on the real origin** (`https://trajanov-v2.vercel.app/en`). This is
  a measurement artifact of testing a not-yet-deployed branch against a production-absolute canonical, not
  a defect — but it means the local Lighthouse SEO number (92) understates the deployed reality.
- **Checkout SEO scores 58 — and that is correct.** A `noindex` page cannot score 95 SEO because the
  "page is blocked from indexing" audit is (rightly) failed. The brief lists Checkout under both "SEO ≥95"
  and "noindex"; these conflict, and the honest resolution is that the noindex wins (Checkout must not be
  indexed). Reported as such rather than smoothed over.
- **axe false-positives when content is below the fold.** In a short viewport, axe's background sampling
  returns the page's ground colour and mis-flags the live banner (near-black on mustard = 9.3:1) as
  failing. Re-running with a tall viewport cleared it. Method note for anyone re-running axe here.

---

## 4. Files touched

`file-map.md` updated: **yes.**

| File | Added / Modified / Deleted |
|---|---|
| `src/app/sitemap.ts` | Added |
| `src/app/robots.ts` | Added |
| `src/app/og/route.tsx` | Added |
| `src/app/og/rubik-latin-700.woff`, `rubik-cyrillic-700.woff` | Added (vendored, SIL OFL) |
| `src/components/seo/JsonLd.tsx` | Added |
| `src/lib/seo/site-jsonld.ts`, `src/lib/seo/product-jsonld.ts` | Added |
| `tests/seo/site-jsonld.test.ts`, `tests/seo/product-jsonld.test.ts` | Added |
| `src/lib/metadata.ts` | Modified — `pageMetadata()` + `ogImageUrl()` |
| `src/app/[locale]/layout.tsx` | Modified — default OG/Twitter, site JSON-LD, skip link, `<main id>` |
| `src/app/[locale]/{page,catalog,catalog/[slug],cart,checkout,about,contact,terms,privacy,shipping-returns,styleguide}/…page.tsx` | Modified — switched to `pageMetadata`; product page also renders Product JSON-LD |
| `src/proxy.ts` | Modified — exclude `/og` from the matcher |
| `src/lib/drop/state.ts` | Modified — `listCatalogProductSlugs()` for the sitemap |
| `src/app/globals.css` | Modified — global `:focus-visible` ring |
| `src/components/product/ProductCard.tsx` | Modified — `h2`; low-stock pill |
| `src/components/home/HomeExperience.tsx` | Modified — sr-only `h1` on live |
| `src/components/layout/{LanguageSwitch,SiteFooter,SiteHeader}.tsx` | Modified — `lang`; 24px/44px targets |
| `src/components/system/PhotoSlot.tsx` | Modified — label 11.2px → 12px |
| `src/messages/{mk,en}.json` | Modified — `Common.skipToContent` |
| `docs/i18n/string-inventory.md` | Modified — regenerated (213 → 214) |
| `vitest.config.ts` | Modified — `@`→`src` alias |
| `Decisions.md`, `current-state.md`, `file-map.md` | Modified |

**No `supabase/migrations/`, `create_order`, `expire_reservations`, cart logic, `src/config/`,
`src/types/database.ts`, or `package.json` runtime dependency touched. `SITE_URL` unchanged.**

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **Pass** — compiled, `/og` `ƒ`, `/sitemap.xml` `ƒ`, `/robots.txt` `○` |
| Types | `npx tsc --noEmit` | **Pass** (exit 0) |
| Lint | `npm run lint` | **Pass** (exit 0) |
| Unit / integration | `npm test` | **84/84 pass** (69 prior + 12 product-jsonld + 3 site-jsonld) |

**Concurrent-order oversell gate (re-run — this phase must not disturb it):**

| | |
|---|---|
| **10 simultaneous orders / 3 units** | **exactly 3 succeeded, 7 rejected: YES** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` |

### Lighthouse — actual scores (headless Chrome, `next start` prod build + local seed DB)

| Route | Desktop P / A / BP / SEO | Mobile P / A / BP / SEO |
|---|---|---|
| Home (`/en`) | **100 / 100 / 100 /** 92\* | **98 / 100 / 100 /** 92\* |
| Catalog (`/en/catalog`) | **100 / 100 / 100 /** 92\* | **94† / 100 / 100 /** 92\* |
| Product (`/en/catalog/test-tee-black`) | **100 / 100 / 100 /** 92\* | **97 / 100 / 100 /** 92\* |
| Checkout (`/en/checkout`) | **100 / 100 / 100 /** 58‡ | **94† / 100 / 100 /** 58‡ |
| Legal (`/en/terms`) | **100 / 100 / 100 /** 92\* | **95 / 100 / 100 /** 92\* |

- **\* SEO 92 on localhost is the cross-origin `canonical` artifact.** Verified on the real origin:
  `https://trajanov-v2.vercel.app/en` scores **SEO 100 with the `canonical` audit passing** — so content
  routes read 100 once 2.04 deploys. Owed row #12 for Lazar to re-confirm on PageSpeed Insights.
- **† Mobile Performance 94 on Catalog + Checkout** (throttled-mobile SSR with a DB read). Reported as a
  gap; owed row #12.
- **‡ Checkout SEO 58 is the intentional `noindex`** correctly failing the crawlable audit — the desired
  behaviour, not a defect.

### axe-core 4.10 (headless Chromium, tall viewport) — serious/critical

| Route | Serious/Critical |
|---|---|
| Home (live drop) | **0** |
| Catalog | **0** |
| Product | **0** |
| Checkout (form populated) | **0** |
| Terms (legal) | **0** |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `/sitemap.xml` served; both locales; every indexable route; absolute on `SITE_URL`; slugs from `getPathname` (no hand-typed slug); Cart/Checkout/`/styleguide` absent | ✅ (curl'd) |
| `/robots.txt` served; references `${SITE_URL}/sitemap.xml` | ✅ |
| Cart, Checkout, `/styleguide` return `noindex`; content routes do not | ✅ (curl'd all routes) |
| Organization + WebSite JSON-LD; no address, no fabricated logo, no SearchAction, no partner; `sameAs` = the one IG URL | ✅ (rendered + unit test) |
| Product JSON-LD emits no node while names are placeholders; real-name fixture emits real price + MKD + state-derived availability, image/description omitted; **no placeholder string in any JSON-LD (grep)** | ✅ (unit test + live seed render + grep) |
| Per-locale OG serves at 1200×630; MK renders Cyrillic (screenshot); `og:image` + `twitter:summary_large_image` absolute on every route; no photo, no baked countdown | ✅ (fetched PNGs + curl'd all routes) |
| Lighthouse ≥95 mobile+desktop, 4 categories, 5 routes — actual scores pasted; any <95 listed as a gap | ✅ (table above; gaps flagged) |
| axe zero serious/critical on the five routes; manual a11y checks; reduced-motion rule ships | ✅ |
| `SITE_URL` unchanged; `trajanov.com` hardcoded nowhere (grep) | ✅ |
| No `supabase/migrations/`, `create_order`, `expire_reservations`, cart, or DB change; `package.json` unchanged | ✅ |
| No placeholder (#2–#7) cleared/reworded/hidden/filled; no fabricated fact in any OG image or JSON-LD | ✅ |
| `npm run build` / `tsc` / `lint` clean; `npm test` passes incl. the 10-vs-3 gate | ✅ (84/84) |
| `current-state.md` / `file-map.md` / `Decisions.md` updated; report filed | ✅ |

### Owed to Lazar (on the owed-verification register)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 11 | **OG paste-test** (the real traffic path) | After 2.04 deploys, paste the URLs below into Instagram + Viber | Branded card renders — image **and** title; Cyrillic intact on MK; no fake product name/price |
| 12 | **Lighthouse categories <95 in-phase** | Re-run on **PageSpeed Insights** against the live 2.04 deploy | Mobile Perf Catalog/Checkout ≥95 (or an accepted gap); content-route SEO reads 100 (canonical passes on the real origin) |

**5-item human checklist** (exact URLs — valid **after 2.04 deploys**; on production the product name is
still a placeholder, so the product card correctly shows a neutral brand title, **not** a fake name):

1. Paste **`https://trajanov-v2.vercel.app/`** (MK Home) into an Instagram story → branded card appears;
   MK title „Trajanov — следно спуштање" readable, **no tofu**.
2. Paste **`https://trajanov-v2.vercel.app/en`** (EN Home) into Viber → branded card; EN title "Trajanov —
   next drop" correct.
3. Paste a Product URL — **`https://trajanov-v2.vercel.app/katalog/test-mustard-ochre`** (MK) — into
   Instagram → card appears (title only; **no fake image, no fake name, no price**).
4. On any content page, "view source" shows the OG tags with an **absolute** `og:image` URL
   (`https://trajanov-v2.vercel.app/og?...`).
5. Cart (`/kosnicka`) and Checkout (`/naracka`) are **not** indexable (no card required there); content
   pages are.

---

## 7. Placeholders shipped

**None.** Phase 2.04 shipped **no** `[PLACEHOLDER: …]` and cleared/reworded/hid/filled **none** (#2–#7
byte-unchanged). The load-bearing guarantee: **no placeholder value reaches any JSON-LD or OG image** —
the Product node is suppressed while names are placeholders, and the OG card falls back to a neutral
brand title rather than the neutral slot. The `PhotoSlot` placeholder **label text is unchanged**; only
its font size went 11.2px → 12px for legibility.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ — JSON-LD uses only `Trajanov`, `SITE_URL`, the one IG URL, real MKD price; OG uses only the `Meta` catalog titles + IG handle |
| `humanizer` pass on user-facing copy | ✅ — one new string (`Common.skipToContent`, a11y boilerplate); no marketing copy written |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ — explicitly excluded from Organization JSON-LD |
| Template-propagated strings verified once against `facts.md` | ✅ — OG/JSON-LD reuse existing `Meta`/`facts.md`/`social.ts` values |
| No AI-generated product imagery (`D-0-6`) | ✅ — OG card is type-only |
| No untranslated EN string in the MK build | ✅ — `Common.skipToContent` added to both catalogs; parity test green |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ |
| `.env*` still gitignored | ✅ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ — no new env var |
| No order PII in logs | ✅ — no logging added |

No secret was committed at any point on this branch. The two committed binaries are SIL-OFL Rubik font
subsets (public, licensed for redistribution).

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| OG paste-test into Instagram/Viber (owed #11) | 2.04 deploy | Lazar |
| Mobile-Perf/SEO Lighthouse re-check (owed #12) | 2.04 deploy + PageSpeed Insights | Lazar |
| `Common.skipToContent` MK native review | folded into MK-review owed #10 | Lazar + Petar |
| PR + merge of `phase-2.04-perf-a11y-seo` | operator authorisation (`D-0-3`) | Lazar / Petar |

Nothing in this phase was blocked by a parallel-track fact — it is pure code, no new copy or facts. The
one brand-track flag is the accent-red-on-surface contrast gap (§3), for the design track to note in
`brand.md`.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ |
| `current-state.md` — owed-verification register | ✅ (+#11, #12) |
| `current-state.md` — placeholder register | ✅ (2.04 note: no change) |
| `file-map.md` — matches disk | ✅ |
| `00_stack-and-config.md` — new deps / pins / config | ➖ n/a (no dependency added; `npx` one-offs only) |
| `Decisions.md` — every §2 entry appended | ✅ (`D-2.04-1…8`) |

**`NEXT:` line I set:** `NEXT: 2.05 — Cutover: buy trajanov.com, flip SITE_URL, Cloudflare DNS + Web
Analytics, and clear the placeholder + owed-verification registers before launch.`
