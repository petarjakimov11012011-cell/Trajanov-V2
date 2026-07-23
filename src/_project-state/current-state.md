NEXT: 2.06 operator half — the LIVE drop rehearsal on `www.trajanovv.com` (Lazar + Vladimir), which clears owed **#15** (live Turnstile renders + solves on the real-domain checkout) + **#16** (a real order email delivers from `info@trajanovv.com` end to end); then **Y.01** (drop content load) + the placeholder register to **zero** before the first REAL drop. **Phase 2.06 — Drop rehearsal + contingency — CODE HALF COMPLETE (2026-07-22, branch `phase-2.06-rehearsal-contingency`; PR open to `main`).** Two repo docs shipped under `docs/ops/`, no commerce logic touched: (1) the `D-0-2` **drop-day contingency plan** (`docs/ops/drop-day-contingency.md`) — detection (no uptime monitor yet, so customer report or manual check; register **L7**), a **bilingual MK+EN Instagram hold post** (story + feed caption; humanizer pass run; **Lazar sign-off owed**), the **manual DM/phone order channel** with the six recorded fields + an **anti-oversell written tally** so the manual path can't oversell, the **X.01** recovery trigger, roles (Lazar posts, Vladimir fulfils, Lazar-calls/Code-runs X.01), and the hard don'ts — every claim traced to `facts.md` (no invented delivery cost/courier/stock); (2) the **rehearsal runbook** (`docs/ops/drop-rehearsal-runbook.md`) — plain-language, non-coder, scripting the full lifecycle **countdown→live→order→sold out→expiry** + Vladimir's fulfilment walk + the contingency dry-run + the **mandatory safe teardown** (explicit ban on `db reset --linked`; "hosted only, never committed to `main`"). Backed by **seven copy-paste `docs/ops/rehearsal-sql/*.sql`** helpers for the Supabase SQL Editor (baseline → open ONE sellable unit → verify-live → verify-order → backdate-hold → verify-expiry → teardown → verify-clean, reusing the 1.08 open→order→verify→close method exactly) + a tracked `docs/ops/rehearsal-evidence/` folder. **No `create_order`/`expire_reservations`/`supabase/migrations/`/cart/checkout/`src/config/` change; no new dependency;** the committed drop stays **ENDED** (past window June 2026) and grep-proves nothing live/priced or any new placeholder ships to `main`. `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected …, stock 0`. **Owed to the operator rehearsal (Lazar + Vladimir):** #15 + #16 (now have a runbook), countdown→LIVE + SOLD OUT + expiry observations, Vladimir's fulfilment walk, the contingency dry-run, **Lazar's sign-off of the MK+EN hold copy**, and a **verified-clean hosted reset**. **Flagged gap (`D-2.06-2`):** the **X.01 (Vercel Pro migration) brief is not yet written** — the contingency plan points at it and recommends authoring `briefs/Part-X-Phase-01-*.md` before the first real drop, so `D-0-2`'s "pre-written recovery" is literally true. Decisions `D-2.06-1/2`. **PR #16 MERGED to `main` (merge `20e5d3d`, 2026-07-22) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted.** Docs-only — nothing under `src/`/`public/`/`supabase/`/config changed, so the merge-triggered redeploy is a **no-op for the running site** (no production behaviour to smoke-verify; the same build already passed the gates). **Phase 2.05 — Cutover — COMPLETE (2026-07-22, branch `phase-2.05-cutover`; PR open to `main`).** `SITE_URL` (`src/lib/site.ts`) flipped to **`https://www.trajanovv.com`** — the canonical non-redirecting host (apex `trajanovv.com` + old `trajanov-v2.vercel.app` both 308→www; the brief said the apex, live prod canonicalises on www, `D-2.05-6`); **grep gate GREEN** (zero `trajanov-v2.vercel.app` / single-v `trajanov.com` in any emitted URL/canonical/OG/schema — prose in docs allowed). Order email from **`info@trajanovv.com`** (the one Vladimir notification; **no customer-confirmation email exists**, `D-Z.01-1`, so one `ORDER_FROM_ADDRESS` change; recipient env var untouched; mocked-Resend tests updated + green). **`info@trajanovv.com` published on Contact** both locales as a real `mailto:` (shared `EMAIL` const; `Placeholder.email` removed) — placeholder **#5 cleared**. Shipping got the reviewed delivery-time line (**„Рок на достава: 3–5 работни дена." / „Delivery time: 3–5 business days."**); courier placeholder **#6 narrowed** to courier + cost (dropped „време"/"time"); returns-window **#7** unchanged; `deliveryBody` reworded to match (`D-2.05-7`). **Turnstile:** `verifyTurnstile` **does not assert hostname** (checks `success` only — hostname is the Cloudflare widget's job) → **no code change**; site key rotated to `0x4AAAAAAD6pSIvEa1p8GkZX` (env-only, `D-2.05-4`). `facts.md` §5/§7/§9 updated + `docs/i18n/mk-review-2.03.md` **stamped** (Lazar + Petar, 2026-07-21, 63 strings + `Common.skipToContent`, passed no changes) — owed **#8/#9/#10 cleared**, **#11/#12** re-pointed to `www.trajanovv.com`, new owed **#15** (live captcha) + **#16** (real order email from `info@`) for the 2.06 rehearsal. Cutover shipped with placeholders **#2/#3/#4/#7 open** (Lazar's override `D-2.05-2`) — register must reach zero **before the first REAL drop** (2.06 gate), not before cutover. Known issue **#10 RESOLVED**; **#1** updated (store now on its real public domain — Hobby drop-day takedown risk fully live). `create_order`/`expire_reservations`/migrations/cart/`src/config/` **untouched**; `npm test` **85/85** incl. the 10-vs-3 oversell gate; build/lint/tsc clean. Decisions `D-2.05-1…7`. **PR #15 MERGED to `main` (merge `49fe2ca`, 2026-07-22) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted. Production deploy VERIFIED** — live `https://www.trajanovv.com` now emits `www.trajanovv.com` in the home canonical, `/sitemap.xml`, `/robots.txt`, the Organization JSON-LD `@id`/`logo`, `og:image`, and `/llms.txt`; Contact publishes `info@trajanovv.com` (MK „Е-пошта" + EN "Email"), Shipping shows „3–5 работни дена" / "3–5 business days"; **zero** `trajanov-v2.vercel.app` / single-v `trajanov.com` on any live surface. **Phase 2.04b — SEO/GEO polish — COMPLETE (2026-07-22, branch `phase-2.04b-seo-geo-polish`).** Closed the three GEO/SEO gaps 2.04 left, none touching commerce: (1) **`llms.txt`** now serves at the root (`src/app/llms.txt/route.ts`) — a `noindex`, facts.md-clean English summary listing both-locale absolute URLs, built from a NEW shared route module (`src/lib/seo/routes.ts`) that `sitemap.ts` was refactored onto so the two can't drift (no hand-typed slug, no hardcoded domain); (2) a **real typographic wordmark** ("Trajanov" in Rubik 700 + brand colours) shipped as `public/logo.svg` (embedded font) + `public/logo-512.png`, and the Organization JSON-LD now carries a resolving absolute `logo: ${SITE_URL}/logo-512.png` (the 2.04 "NO logo" refusal is retired — a real mark exists; still `D-0-6`-clean, it's typography not AI imagery); (3) a **modern icon set + web manifest** — `src/app/icon.svg` + `apple-icon.png` (a "T" monogram derived from the wordmark), `public/icon-{192,512}.png`, and `src/app/manifest.ts` (name/short_name Trajanov, brand-token colours, `lang mk`, `start_url /`, installable). Plus (4) an **IndexNow** key served bare at `public/78dec4b97e3fbb0f22d1c8df38050f74.txt` + a `pingIndexNow()` helper (`src/lib/seo/indexnow.ts`) built from `SITE_URL` but **wired to nothing** (pinging is meaningless until the real domain). All PNGs generated by a committed manual script (`scripts/generate-brand-assets.ts` / `npm run assets:brand`) via `next/og` — **no new dependency**. Verified by curl: `/llms.txt` (headers `x-robots-tag: noindex` + `text/plain`, facts-clean body, absolute bilingual URLs matching the sitemap slugs), the bare key file (32 bytes), `/logo-512.png` 200 image, the JSON-LD `logo` in page HTML, `/manifest.webmanifest` JSON, icon/apple/manifest `<link>`s in `<head>`, and sitemap.xml still lists all routes with **zero** llms.txt entries. Home + About rendered clean (no console errors), `logo.svg` embedded-font wordmark confirmed in-browser. `SITE_URL` untouched; **no `supabase/`, `create_order`, `expire_reservations`, cart, stock, `src/config/`, or npm dependency touched**; `npm test` **85/85** incl. the 10-vs-3 oversell gate, build / lint / tsc clean. **Owed to Lazar (registered below):** wordmark brand-direction sign-off (#13), register the IndexNow key in Bing Webmaster Tools post-domain (#14), and the human OG/logo paste-test (#11, extended). Decisions `D-2.04b-1…6`. **PR #14 MERGED to `main` (merge `c562195`, 2026-07-22) on Petar's explicit instruction (`D-0-3`: an operator, not Code, authorised the merge); branch deleted; production deploy VERIFIED** — `/llms.txt` (facts-clean, `x-robots-tag: noindex`), the Organization JSON-LD `logo` (`…/logo-512.png`, still no address), and the `manifest`/`icon.svg`/`apple-icon` `<link>`s all serve on production. **⚠️ DOMAIN SURPRISE (surfaced 2026-07-22):** production `https://trajanov-v2.vercel.app` now **308-redirects to `https://www.trajanovv.com`** — a custom domain (**`trajanovv.com`, double-v**, matching the IG handle `@trajanovv2026`) was attached to the Vercel project **outside this repo**. Petar confirmed **the domain is his** and chose to **leave `SITE_URL` on the vercel.app origin until the full 2.05 cutover** — so every 2.04b absolute URL (llms.txt links, JSON-LD `logo`, sitemap, OG, canonical/hreflang) currently points at the redirecting `trajanov-v2.vercel.app` host. **`facts.md` §9 is now STALE** (it records the target as `trajanov.com` **single-v**, "NOT YET PURCHASED") — reconcile the spelling + purchased status in **2.05**, which must also flip `SITE_URL` to `https://www.trajanovv.com`. Code did **not** edit `facts.md` or `SITE_URL` (owner/orchestrator call). **Phase 2.04 — Perf, a11y, SEO — COMPLETE (2026-07-20, branch `phase-2.04-perf-a11y-seo`).** Shipped: `sitemap.xml` (both locales, absolute on `SITE_URL`, slugs from next-intl `getPathname` — no hand-typed slug — plus each DB product; Cart/Checkout/`/styleguide` excluded), `robots.txt` (Sitemap + Disallow `/styleguide`), per-page **noindex** on Cart/Checkout/`/styleguide` (content routes stay indexable), site-wide **Organization + WebSite JSON-LD** (no address, no fabricated logo, no SearchAction, no EAM/partner; `sameAs` = the one IG URL), a **Product JSON-LD** generator gated on a REAL name (emits no node while names are placeholders #4; availability derived from `src/lib/drop/state.ts`, never hardcoded InStock; `image`/`description` omitted while #2/#3), and per-locale **typographic OG share cards** (`next/og`, vendored Rubik Cyrillic woff — the MK card renders native Cyrillic, screenshotted) wired through a central `pageMetadata()` so an absolute `og:image` + `twitter:summary_large_image` sits on **every** route (grep-proven). **a11y: axe zero serious/critical** on Home/Catalog/Product/Checkout/Terms; skip-to-content link + `<main id>`, one H1/page + no heading skips, checkout real `<label>`s + `aria-describedby`/`aria-live` (triggered + verified), a global focus-visible ring, `lang` on the language switch + the About quote, WCAG-2.2 24px tap targets (footer) + 44px cart icon, the reduced-motion rule ships. **Lighthouse (actual, per route/form-factor pasted in the report): Accessibility 100 + Best-Practices 100 on all five routes; Desktop Performance 100; SEO 100 on the real production origin** — the localhost SEO 92 is the cross-origin `canonical` artifact (canonical → `SITE_URL` while testing on `127.0.0.1`), **proven 100 on `https://trajanov-v2.vercel.app/en`**; Checkout SEO 58 is the intentional noindex correctly failing the crawlable audit. **Gaps owed to Lazar:** mobile Performance **94** on Catalog + Checkout (throttled SSR — re-check on PageSpeed Insights after 2.05); the human **OG paste-test** into Instagram/Viber (only a human with those apps can confirm the card). `SITE_URL` unchanged; **no `supabase/`, `create_order`, `expire_reservations`, cart, `src/config/`, `src/types/database.ts`, or npm dependency touched**; `npm test` **84/84** incl. the 10-vs-3 oversell gate (re-run GREEN); build / lint / tsc clean. **PR #13 MERGED to `main` (merge `6375a0d`, 2026-07-20) on Petar's explicit instruction (`D-0-3`: an operator, not Code, authorised the merge); production deploy VERIFIED** — `/sitemap.xml` (both locales + product entries), `/robots.txt`, the MK `/og` card (`image/png`), the Organization+WebSite JSON-LD, and an absolute `og:image` all serve on `https://trajanov-v2.vercel.app`, and the production product page correctly ships **NO** Product node (names still placeholders) with a neutral, non-placeholder OG title. Prior: **Phase 2.03 — Legal + facts audit — COMPLETE (2026-07-19, branch `phase-2.03-legal-facts`).** Three **static** legal pages shipped both locales — Terms (`/uslovi`·`/en/terms`), Privacy (`/privatnost`·`/en/privacy`), Shipping & Returns (`/isporaka-i-vrakjanje`·`/en/shipping-returns`) — built from the `/about`+`/contact` editorial pattern via a shared `LegalPage` shell, all `●` SSG. Responsible party is **Vladimir Trajanov, Струмица, alone** (`D-2.03-1`, Lazar's call) — **no parent named anywhere in the diff**; **no statute/article/withdrawal period cited** (Decision 5); **no cookie banner** (Decision 4); the email **stays unpublished**. Privacy's collected-field list matches the real `orders` columns (`20260715021215_schema.sql`: name/phone/city/address/note — **no email**); the IP line matches `src/lib/rate-limit/hash.ts` (one-way hash, raw IP never stored). Courier/delivery-cost and returns-window ship as **visible `[PLACEHOLDER: …]`** (register #6, #7 — owner Vladimir), not guesses. **Full `facts.md` audit** committed at `docs/legal/facts-audit-2.03.md` — every rendered claim traced; **2 findings** (F-1 the `facts.md` §1 responsible-party contradiction, resolved by the §1 amendment; F-2 the cart's "calculated on delivery", surfaced not reworded, `D-2.03-6`); **zero UNSOURCED remain**; §10 clean (`grep`-checked). `facts.md` §1 amended (both the displayed party and the intake fact kept; open parental-confirmation flag intact). **63→213 message keys** (63 new, MK+EN identical); humanizer pass run; `docs/i18n/mk-review-2.03.md` committed **unsigned**; `string-inventory.md` regenerated (213) + committed. **69 tests pass** (63 + 6 new legal-route pathname assertions) incl. the 10-vs-3 oversell gate; build/lint/tsc clean; parity driven **RED→GREEN**. **No `supabase/migrations/`, `create_order`, `expire_reservations`, cart, `src/config/`, hosted DB, or npm dependency touched.** **Owed-verification register is NO LONGER EMPTY** — 2.03 added **two rows** (#9 no human legal review; #10 MK legal copy unreviewed) — both verify by 2.05 cutover. Placeholder register **+2** (#6, #7). **PR #12 MERGED to `main` (merge `4fcc0bd`) on Petar's explicit instruction (`D-0-3`: an operator, not Code, authorised the merge); production deploy VERIFIED** — the six legal URLs serve on `https://trajanov-v2.vercel.app` (MK slugs `/uslovi`·`/privatnost`·`/isporaka-i-vrakjanje` → 200 direct; `/en/*` → 200; MK Terms renders „Услови на продажба" + „Владимир Трајанов, од Струмица"). Recommended operator housekeeping (L1–L4, L7) still open.

# Current state — Trajanov-V2

**This file is the single source of truth for project status.** The orchestrator reads it before
every brief. Nobody's memory outranks it. Line 1 is always the `NEXT:` line — Code updates it when
closing every phase.

Last updated: **2026-07-23** · By: **Claude Code (Phase 2.08 — header redesign: nav + build credit)**

---

## Status

**2.08 COMPLETE — the site-wide header is redesigned (this update, 2026-07-23).** An out-of-band UI
phase (the 2.07/Y.02 precedent) — **no commerce logic touched**, and **line 1 `NEXT:` is unchanged**
(2.06 operator rehearsal remains next). What shipped:
- **`src/components/layout/SiteHeader.tsx` rebuilt** to the target layout: wordmark → build credit →
  **Catalog · About · Contact** → **MK · EN** → cart, in that exact left-to-right order (**cart last**),
  on **every** page in both locales. The three page links reuse the reviewed `Nav.catalog/about/contact`
  keys — **no** Home/Reviews/Blog/Book link (the wordmark is the only route to Home; grep-proven). An
  **active-page underline** (mustard `border-b-2`, space reserved so the row can't shift) + `aria-current`
  marks the current page. Every colour/size/spacing/radius/type value is a `brand.md` token — **zero hex,
  zero raw px literal**.
- **Build credit** „Изработено од **Vertex Consulting**" / "Built by **Vertex Consulting**", subordinate +
  muted, baseline-aligned to the wordmark. **Only "Vertex Consulting" is the link** → `https://www.vertexconsulting.mk/en`,
  `target="_blank" rel="noopener noreferrer"`, mustard, with a locale-correct **visually-hidden** "opens in
  a new tab" / „се отвора во нов прозорец". The credit is a **`facts.md` § 11 VERIFIED** fact (`D-2.08-2`) —
  a build credit **only**, contained to the header: grep-proven **zero** "vertex" in JSON-LD, OG/twitter
  meta, `llms.txt`, `sitemap.xml`, `robots.txt`, the footer, and the legal pages (source **and** emitted).
- **`LanguageSwitch` restyled** to the `MK · EN` dot pattern (active full-contrast, inactive muted, `·`
  separator) — **behaviour unchanged** (switches locale in place, preserves page + query/`?preview`;
  re-verified live: `/en/contact` → `/kontakt`, `/en/catalog` → `/katalog`).
- **Non-sticky** (`D-2.08-3`): the old `sticky top-0 … backdrop-blur` was dropped for a **static** header
  on a **solid** `--color-ground` — **this is the notable brief-vs-repo difference** (the brief lists a
  sticky header as out of scope; the repo had one), so on long pages the nav/cart now scroll away with the
  page. **`SiteHeader` is now a client component** (`D-2.08-4`) so the nav can read `usePathname()`.
  **Mobile** is a deterministic 3-row grid — row 1 wordmark | MK·EN·cart, row 2 nav, row 3 the credit on
  its own full width above the hairline — so the long MK credit is never shrunk or hidden (`D-2.08-5`).
- **Strings:** new `Credit` namespace (`builtBy` next-intl rich-text + `opensInNewTab`) in
  `src/messages/{mk,en}.json`; MK+EN parity driven **RED→GREEN**; `string-inventory.md` regenerated
  **217 → 219**.

**Gates:** `npm run build` (exit 0, "Compiled successfully") / `npx tsc --noEmit` / `npm run lint` clean;
`npm test` **85/85** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with
insufficient_stock, stock 0` (untouched — no commerce code changed) + the i18n catalog-parity test.
**Rendered + measured in-browser** (dev server, both locales, at **desktop + 375px + 320px**): correct
L-to-R order + cart-last (accessibility tree), active underline + `aria-current` on the current page (row
does not shift), `header{position:static}` on `#0F1210`, **no horizontal overflow at 320/375 either
locale**, no console errors on Home/Catalog/About/Contact both locales. **WCAG 2.2 AA contrast (measured on
ground `#0F1210`):** credit muted **7.85**, Vertex link (mustard) **8.95**, nav default **7.85**, nav active
**15.42**, lang active **15.42**, lang inactive **7.85** — all ≥ 4.5. Tap targets: all interactive ≥ 24px
(lang buttons 24×24 via `min-w-6`/`min-h-6`), **cart 44×44**. **Frozen:** `src/lib/orders/` /
`create_order` / `expire_reservations` / `supabase/migrations/` / cart / checkout / `src/config/` /
`src/lib/site.ts` (`SITE_URL`) / **the footer** / `src/lib/seo/` / `sitemap.ts` / `llms.txt` / `manifest.ts`
/ logo+icon assets **byte-unchanged** (`git diff --stat main`); **no new dependency** (`package.json` +
lockfile unchanged); **no new placeholder**. **Owed to Lazar:** native MK review of the 2 new `Credit`
strings (register **#19**), **click-test `https://www.vertexconsulting.mk/en`** (register **#20** — a link
to a page that does not resolve is a broken fact on every page of the site), and **client sign-off**
(Vladimir + parents) on a third-party credit + outbound link in the top nav of the store on every page
(register **#21**). Decisions `D-2.08-1…5`. Branch `phase-2.08-header-redesign`; **PR #19 MERGED to `main`
(merge `d40541b`, 2026-07-23) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code);
branch deleted.** (Merge completed via a local `--no-ff` merge commit: GitHub's PR API was stuck on a stale
head OID — its merge endpoint kept returning "head branch is out of date" while the authoritative ref was
current — so the GitHub PR shows **Closed** rather than the "Merged" badge, but **all 2.08 commits are on
`main`**, verified reachable from `d40541b`.) **Production deploy VERIFIED** — `https://www.trajanovv.com`
now renders the redesigned header: **non-sticky** (`position: static`) with „Built by Vertex Consulting"
linking `https://www.vertexconsulting.mk/en` (`target="_blank"`) and exactly **Catalog · About · Contact**;
the 2.07 footer is intact. `NEXT:` line **unchanged** — out-of-band, does not touch the 2.06 → Y.01 critical
path.

**2.08 ALIGNMENT FIX — the header is now on one shared centerline (`D-2.08-6`, supersedes `D-2.08-5`; this
update, 2026-07-23).** After 2.08 merged, Petar reported the header rendered but **nothing was aligned**: on
the desktop row the wordmark, credit and three nav links floated on the text **baseline** while MK·EN and the
cart sat on the vertical **center** (the D-2.08-5 layout used `sm:items-baseline` + a `sm:self-center` on the
controls), and the gaps were uneven. **Fix:** `SiteHeader.tsx` is rebuilt as **one flex row, `items-center` +
`justify-between`**, two groups — LEFT (wordmark + credit), RIGHT (nav, then MK·EN, then cart). Every
container is `items-center`; **no baseline nudge, no `self-*` override, no margin-top on any item.** The cart
keeps its 44px target but is centered (sets row height, not anyone's offset). Gaps are exactly two tokens:
**`gap-4` (16px)** between the three nav links, **`gap-6` (24px)** used identically for nav → MK·EN and
MK·EN → cart. Narrow screens wrap (`flex-wrap` / `sm:flex-nowrap`). **Verified by computed geometry (not by
eye):** at 1280px all seven items report an identical vertical center **34.0px, max delta 0**; gaps measured
**16 / 16 / 24 / 24 px**. Contrast re-measured on `#0F1210` (credit 7.85 · Vertex link 8.95 · nav default
7.85 · nav active 15.42 · lang active 15.42 · lang inactive 7.85 — all ≥ 4.5); active underline + `aria-current`
intact; header still `position: static`; **no horizontal overflow at 320px or 375px, both locales**; no console
errors. **Only `SiteHeader.tsx` changed** (`git diff --stat main`) — **no** frozen path, **no** message/`facts.md`
edit, **no** new dependency (`package.json` + lockfile unchanged), **no** new placeholder. `npm run build`
(exit 0) / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the 10-vs-3 oversell gate.
Decision `D-2.08-6` (D-2.08-5 marked Superseded). Shipped on a **recreated** `phase-2.08-header-redesign`
branch (the original merged + was deleted); **new PR open to `main` — NOT merged** (`D-0-3`). `NEXT:` line
**unchanged**.

**2.07 COMPLETE — the site-wide footer is redesigned (this update, 2026-07-23).** An out-of-band UI phase
(the Y.02 precedent): the session was handed the original **Phase 1.05** footer brief, but that footer
shipped long ago and the project is ~15 phases past it (live on `www.trajanovv.com`, real 2.03 Privacy page,
published `info@trajanovv.com`). Rather than execute the stale brief literally — which would **overwrite the
real Privacy page** with a `[PLACEHOLDER: … 2.03]` stub and **re-introduce the email placeholder** 2.05 already
cleared — **Petar chose to apply the brief's richer two-zone design as a new phase, preserving the real
Privacy page + the published email** (`D-2.07-1`). **No commerce logic touched.** What shipped:
- **`src/components/layout/SiteFooter.tsx` rebuilt** to two zones. **Zone 1** — two columns: `КОНТАКТ`
  (email `info@trajanovv.com` + phone `078 820 520`) and `СЛЕДИ` (`@trajanovv2026`), each a real `<h2>`
  eyebrow heading with a 16px Lucide line icon per item. **Zone 2** — a 1px hairline rule, then a
  `© 2026 Трајанов. Сите права задржани.` row carrying **all five** page links
  (About/Contact/Terms/Privacy/Shipping) so no live link is dropped. Single stacked column at 375px, two
  columns at `sm`. Every colour/size/spacing/type value is a `brand.md` token — zero hardcoded values.
- **Instagram icon:** this `lucide-react` dropped its brand icons, so the social row uses **`AtSign`** (`@`)
  paired with the handle — honest, no fabricated brand glyph (`D-2.07-2`).
- **Strings:** a new `Footer` namespace (`contact`/`social`/`rights`) in `src/messages/{mk,en}.json`;
  page-link labels **reuse** the reviewed `Nav` keys (`D-2.07-3`). MK+EN parity green; `string-inventory.md`
  regenerated **214 → 217**.
- **Preserved:** the real 2.03 Privacy page (`/privatnost` + `/en/privacy` → **200** with real „Приватност"
  content, **not** a stub) and the published email — **no placeholder re-introduced**.

**Gates:** `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the
10-vs-3 oversell gate (untouched — no commerce code changed) + the i18n catalog-parity test. **Rendered +
measured in-browser** (dev server, both locales, 375px + desktop): real `<h2>` headings, 3 icons; MK
`КОНТАКТ`/`СЛЕДИ`/`© 2026 Трајанов…` + MK slugs (`/privatnost` etc.); EN `CONTACT`/`FOLLOW`/`© 2026 Trajanov…`
+ `/en/*`; IG `rel="noopener noreferrer" target="_blank"`; phone `tel:+38978820520`. **WCAG 2.2 AA contrast
(measured on ground `#0F1210`):** muted headings/© row/page-links `#ABA79E` = **7.85:1**; full-contrast
contact items `#ECE8E0` = **15.42:1** — both pass (need 4.5). Tap targets ≥24px (email 178×34, Privacy 46×28).
Mobile: single column, sections stack, © row vertical, **no horizontal overflow**. No console errors. (The
footer-band *screenshot* was blocked by a browser-pane scroll timeout on the dark page; the page paints —
hero captured — and the footer is fully verified via the accessibility tree + computed styles.) **Frozen:**
`create_order`/`expire_reservations`/`supabase/migrations/`/cart/checkout/`src/config/` byte-unchanged; **no
new dependency**; `SITE_URL` unchanged; **no new placeholder** (email published, Privacy real). **Owed to
Lazar:** design sign-off incl. the `@`-for-Instagram icon (register **#17**) + native review of the 3 new MK
strings (register **#18**). Decisions `D-2.07-1/2/3`. Branch `phase-2.07-footer-redesign`; **PR #18 MERGED to `main` (merge `27b51ea`,
2026-07-23) on Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted.**
Production deploy VERIFIED — `https://www.trajanovv.com` footer now renders the two-zone design (MK
`КОНТАКТ`/`СЛЕДИ` + `© 2026 Трајанов…`, EN `CONTACT`/`FOLLOW`), publishes `info@trajanovv.com` as a
`mailto:`, and links Privacy to `/privatnost` (MK) / `/en/privacy` (EN). `NEXT:` line **unchanged** —
out-of-band, does not touch the 2.06 → Y.01 critical path.

**Y.02 COMPLETE — a third product, "Product 03" (baby blue), is now a visible, honest catalog stub
(this update, 2026-07-22).** An owner-authorised out-of-order insert (`D-Y.02-1`, Lazar, 2026-07-22) —
it does **NOT** replace the 2.06 operator rehearsal on the critical path (line 1 `NEXT:` is unchanged).
**No commerce logic touched.** What shipped:
- **`facts.md` §7** gained a `### Product 03 — baby blue` sub-block: **price 1999 MKD** + **sizes
  S/M/L/XL** marked **VERIFIED (owner, 2026-07-22)**; the **colourway is owner-stated, NOT photographed**
  (deliberately *not* "VERIFIED (photos)" like mustard/ochre + off-white); **photos + fabric/care OWED**
  (Vladimir); the real name OWED.
- **`src/config/products.ts`** — a **third** product, `test-baby-blue`, added to the existing **ENDED**
  `test-drop`, mirroring the two colourways there exactly: `name_* = null` (→ neutral slot "Производ 03",
  `sort_order` 3), `priceMkd: 1999`, `photoPath`/`careMk`/`careEn` null, sizes **S/M/L/XL** (stock 3 each,
  nominal — the drop is ended, nothing is buyable). It renders **browsable-but-not-buyable** (the site's
  default state between drops). It is **NOT** in a live/real drop — `drops.ts` (the schedule) is untouched;
  true drop assignment is `Y.01` (`D-Y.02-2`).
- **No migration** (`D-Y.02-3`): the product + its per-size variant rows land via the existing typed config
  + `npm run sync:drop` (INSERT-only, `D-1.04-5`/`D-1.04-11`) — a data operation, not a schema change. The
  `products`/`variants` tables, `create_order`, `expire_reservations`, the atomic decrement + reservation
  logic, cart, checkout, `SITE_URL`, and the drop schedule are all **byte-unchanged** (grep-proven in the
  report).
- **Product JSON-LD stays suppressed** for Product 03 (its name is a placeholder → `productJsonLd` returns
  null), consistent with the existing two.
- **No new user-facing string:** Product 03 reuses the existing shared placeholder keys
  (`Placeholder.productPhoto` / `Placeholder.composition` / the `Placeholder.productName` neutral slot) and
  the shared MKD price format — both locales already carry them, so no MK/EN catalog change was needed.

**Gates:** `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the
10-vs-3 oversell gate (the concurrency test targets the seed's `test-open-drop`/`test-tee-black`, wholly
independent of `src/config/products.ts`, so adding a catalog product cannot disturb the oversell
guarantee — proven, not assumed). Rendered in-browser (see the report): the catalog lists **three**
products with Product 03 the baby-blue one, and its product page shows price **1.999 ден** / **1,999 MKD**,
selectable sizes S/M/L/XL, visible photo + composition placeholders, the neutral name "Производ 03" /
"Product 03", and the browsable-but-not-buyable (ended, no live drop) state. **Placeholder register +3
rows** (#8 photo, #9 fabric/care, #10 real name — all Product 03, owner Vladimir); **owed-verification
register unchanged**. Decisions `D-Y.02-1/2/3`. Branch `phase-y.02-product-03-stub`; **PR #17 MERGED to
`main` (merge `25573de`, 2026-07-22) on Petar's explicit instruction (`D-0-3`: operator-authorised, not
Code); branch deleted.** ✅ **HOSTED SYNC DONE — Product 03 is LIVE (2026-07-22, the `D-Y.02-3` deferred
sync, on Petar's instruction; NOT Y.01/the real content load).** `npm run sync:drop` was run against the
hosted Frankfurt DB (`SUPABASE_DB_URL` from gitignored `.env.hosted`; confirmed host
`aws-0-eu-central-1.pooler.supabase.com`, not local — no silent no-op). **Purely additive, INSERT-only
(`D-1.04-5`):** report `products inserted: 1` (`test-baby-blue`), `variants inserted: 4` (S/M/L/XL stock
3), `products updated: 2` (mustard/off-white re-written to the same null names / 1199 MKD), `variants
untouched: 5` (**existing stock preserved**), `rows deleted: 0`. Hosted `test-drop` now carries **3**
products, **stays ENDED** (window June 2026), **orders = 0**. **No code / migration / `create_order` /
`expire_reservations` / cart / checkout / `src/config/` edit / new dependency.** Verified on the live
domain: `www.trajanovv.com/katalog` (+ `/en/catalog`) now lists **three** boxes — `Производ 03` /
`Product 03`, **1.999 ден / 1,999 MKD**, S/M/L/XL, the same `[PLACEHOLDER: …]` photo slot + box styling
as the other two, **browsable-but-not-buyable** („Распродадено" / "Sold out"); the product page
`/katalog/test-baby-blue` loads and emits **no** Product JSON-LD (name still a placeholder). Placeholders
#8/#9/#10 (photo/fabric/name) remain **open** — the stub is visible, its owed content is still owed.

**2.06 CODE HALF COMPLETE — drop day is now a script, and the rehearsal is ready to run (this update,
2026-07-22).** A Code + operator phase like the 1.08 gate: Code shipped the two repo documents, the safe
open/reset tooling, and the Code-verifiable gates; the **live rehearsal is owed to Lazar + Vladimir** and
is what clears owed **#15** + **#16**. **No commerce logic touched.** Shipped under `docs/ops/`:
- **`drop-day-contingency.md`** — the `D-0-2` plan for the site going down mid-drop: **detection** (no
  uptime monitor yet — customer report or a manual mobile-data check of `https://www.trajanovv.com`;
  register **L7**), a pre-written **bilingual (MK+EN) Instagram hold post** (story + feed caption) that says
  the drop is paused for a technical reason, is **not** cancelled, and points buyers to **DM `@trajanovv2026`
  or phone `078 820 520`, cash on delivery, same prices, while stock lasts** — every claim traced to
  `facts.md`, humanizer pass run, **no** invented delivery cost/courier/stock; the **manual order channel**
  (six recorded fields: name/phone/city/address/size/qty, max 2) with an **anti-oversell written tally**
  (last-known stock per size, decrement per manual order, never below zero, reconcile into the DB before
  reopening); the **X.01** recovery trigger (Vercel Pro, Lazar-decides/Code-runs, an afternoon because of
  the portability rule); **roles**; and the **hard don'ts** (no unbacked delivery promise, no unbacked
  stock claim, no false urgency, no card/online payment, don't lose the DMs, don't ship outside NMK).
  **Lazar signs off the MK+EN copy** (owed — client-facing brand copy).
- **`drop-rehearsal-runbook.md`** — a plain-language, non-coder script for a full fake drop on the real
  domain: **pre-flight** (site up, Turnstile renders on `/naracka`, `info@trajanovv.com` routes to
  Vladimir), **open hosted-only** (a 5-minute countdown + the whole drop constrained to **one** sellable
  unit so a single order sells it out — never committed to `main`), **walk the lifecycle on a phone**
  (countdown→LIVE; one real order through a browser-solved Turnstile = **#15**; stock→0→SOLD OUT; the
  notification email from `info@trajanovv.com` = **#16**; Vladimir phones the "customer" and records the
  order = the fulfilment walk), **rehearse expiry** (backdate the hold, watch the `*/5` `expire-reservations`
  job return the unit — the 1.08 method), **contingency dry-run** (a walk-through, no public post), the
  **mandatory teardown** (targeted deletes, restore stock, reset `TRJ-####`, re-sync ENDED — **explicit ban
  on `db reset --linked`**), and the **evidence** to capture.
- **`docs/ops/rehearsal-sql/`** — seven copy-paste SQL files for the Supabase SQL Editor
  (`00-baseline` → `01-open-rehearsal-drop` → `02-verify-live` → `03-verify-order` → `04-backdate-hold` →
  `05-verify-expiry` → `06-teardown` → `07-verify-clean`), each touching only `test-drop`. Plus a tracked
  `docs/ops/rehearsal-evidence/` folder (with a PII-caution README, `D-0-1`).

**Gates:** `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the
10-vs-3 oversell gate. **Frozen:** `create_order` / `expire_reservations` / `supabase/migrations/` / cart /
checkout / `src/config/` byte-unchanged; **no new npm dependency**; the committed `test-drop` stays ENDED
(past window) — grep-proven that no live/priced drop and no new placeholder ship to `main`. **Flagged
(`D-2.06-2`):** the **X.01 brief is not yet written** — the contingency plan points at X.01 as-planned and
recommends authoring `briefs/Part-X-Phase-01-*.md` before the first real drop. Decisions `D-2.06-1/2`.
Branch `phase-2.06-rehearsal-contingency`; **PR #16 MERGED to `main` (merge `20e5d3d`, 2026-07-22) on
Petar's explicit instruction (`D-0-3`: operator-authorised, not Code); branch deleted — docs-only, so the
redeploy is a no-op for the running site.** The owed-verification register gains no new rows (the rehearsal is what verifies the existing #15/#16); the
placeholder register is unchanged (#2/#3/#4/#7 still open — the register must reach zero before the first
real drop).

**2.05 COMPLETE — the store now speaks in its real identity (this update, 2026-07-22).** Cutover to the
live domain, **no commerce logic touched.** `SITE_URL` (`src/lib/site.ts`) flipped to
**`https://www.trajanovv.com`** — the canonical, non-redirecting host (the apex `trajanovv.com` and the
old `trajanov-v2.vercel.app` both 308→www; the brief said the apex, but live production canonicalises on
www, so `SITE_URL` uses www to keep every derived URL off a redirect — `D-2.05-6`). After build,
`/sitemap.xml`, `/robots.txt`, every `canonical` + `hreflang`, the OG image URLs, the Organization JSON-LD
`@id`/`logo`, and `/llms.txt` links all emit `www.trajanovv.com`; the **grep gate is GREEN** — zero
`trajanov-v2.vercel.app` and zero single-v `trajanov.com` in any emitted URL/canonical/OG/schema (prose
mentions in docs remain, allowed). **Order email:** `ORDER_FROM_ADDRESS` → `info@trajanovv.com` for the
(only) Vladimir notification — there is **no customer-confirmation email** (no customer email is collected,
`D-Z.01-1`), so Task 3's "both … and …" is one from-address change; `ORDER_NOTIFICATION_EMAIL` (recipient)
untouched; the mocked-Resend email tests were updated and pass. **Contact publishes `info@trajanovv.com`**
in both locales as a real `mailto:` (shared `EMAIL` constant in `src/lib/social.ts`; the `Placeholder.email`
key removed from both catalogs) — placeholder **#5 cleared**. **Shipping & Returns** gained the reviewed
delivery-time line (**„Рок на достава: 3–5 работни дена." / „Delivery time: 3–5 business days."**); the
courier placeholder **#6 narrowed** to courier + cost (dropped „време"/"time"); returns-window **#7**
unchanged; `deliveryBody` reworded to scope the "unconfirmed" statement to courier + cost since the time is
now VERIFIED (`D-2.05-7`). **Turnstile:** server-side `verifyTurnstile` **does not assert hostname** (checks
`success` only — hostname allowlisting is the Cloudflare widget's job), so **no code change**; the site key
rotated to `0x4AAAAAAD6pSIvEa1p8GkZX` (env-only, `D-2.05-4`). **`facts.md` §5/§7/§9** updated (email
published; delivery time VERIFIED, courier+cost OWED; domain `trajanovv.com` VERIFIED — PURCHASED).
**`docs/i18n/mk-review-2.03.md` stamped** (Lazar + Petar, 2026-07-21; 63 strings + `Common.skipToContent`;
passed, no changes) — owed **#10 cleared**; owed **#8** (branded from-address) and **#9** (a lawyer read the
pages, operator 2026-07-21) also cleared; owed **#11/#12** re-pointed to `www.trajanovv.com`; **new owed
#15** (live captcha on the real-domain checkout) + **#16** (a real order email delivering from `info@` end
to end), both for the 2.06 rehearsal. Cutover proceeded with placeholders **#2/#3/#4/#7 still open** —
Lazar's override (`D-2.05-2`); the register must reach zero **before the first REAL drop opens**, not
before cutover. Known issue **#10 RESOLVED** (SITE_URL/facts reconciled); **#1** updated (the store is now
on its real public domain — the Hobby drop-day takedown risk is fully live). `create_order` /
`expire_reservations` / migrations / cart / `src/config/` **untouched**; `npm test` **85/85** incl. the
10-vs-3 oversell gate, build / lint / tsc clean. Decisions `D-2.05-1…7`. Branch `phase-2.05-cutover`; **PR
#15 MERGED to `main` (merge `49fe2ca`, 2026-07-22) on Petar's instruction (`D-0-3`: operator-authorised,
not Code); branch deleted; production deploy VERIFIED** — live `www.trajanovv.com` emits the new host on
every SEO surface, Contact publishes `info@`, Shipping shows the delivery time, grep-clean of the old
hosts.

**2.04b COMPLETE — Trajanov now has a face: a real logo, a full icon set, an `llms.txt`, and an
IndexNow key (2026-07-22).** A small pre-cutover polish closing the three GEO/SEO gaps
2.04 left open — **no commerce logic touched.** (1) **`llms.txt`** serves at the root
(`src/app/llms.txt/route.ts`, `force-static`): an `# H1` + `>` blockquote + link sections, English
prose, every claim traced to `facts.md` (brand/Strumica/2026/Vladimir/the one competition win/oversized
unisex tees/limited drops/COD/NMK-only/max-2/IG/phone — and **nothing** excluded: no price, size,
fabric, email, address, or review/partner claim). Its links are both-locale **absolute** URLs pulled
from a **new shared module** `src/lib/seo/routes.ts` (`INDEXABLE_STATIC_HREFS` + `absoluteUrl`) that
`src/app/sitemap.ts` was refactored onto — so the sitemap and llms.txt read **one** route list and
cannot drift; the response carries `X-Robots-Tag: noindex` and is **absent from the sitemap** (not a
page). (2) A **real brand wordmark** (`D-2.04b-1`, owner-level, flagged for sign-off): "Trajanov" set in
Rubik 700 + brand mustard/ground, as `public/logo.svg` (Rubik embedded as base64 so it renders anywhere)
and `public/logo-512.png` (on a solid ground square). `src/lib/seo/site-jsonld.ts` now emits
`logo: ${SITE_URL}/logo-512.png` on the Organization node — the 2.04 "NO logo, no real asset exists"
refusal is **resolved and its comment rewritten to say why**; still no address, no SearchAction, no
partner. This is a legitimate typographic mark, **not** the AI product imagery barred by `D-0-6`. (3) A
**modern icon set + manifest**: `src/app/icon.svg` + `src/app/apple-icon.png` are a geometric **"T"
monogram** derived from the wordmark (`D-2.04b-4` — a wordmark is illegible at favicon size); `public/
icon-{192,512}.png` + `src/app/manifest.ts` (name/short_name "Trajanov", brand-token colours, `lang:
"mk"`, `start_url: "/"`, `display: standalone`, maskable-safe icon) make it installable; the legacy
`favicon.ico` stays as fallback. (4) An **IndexNow** key (32-char hex) served bare at
`public/78dec4b97e3fbb0f22d1c8df38050f74.txt`, plus `pingIndexNow(urls)` in `src/lib/seo/indexnow.ts`
built from `SITE_URL` — **deliberately wired to nothing** (`D-2.04b-6`; a preview host can't own
submissions). The key is **public by design and NOT a secret under `D-0-1`**. All four PNGs are
generated by a committed, manually-run script (`scripts/generate-brand-assets.ts` / `npm run
assets:brand`) using **`next/og` — no new dependency** (`D-2.04b-5`), reusing the Rubik woff already
vendored for the OG cards. **Verified by Code (curl + in-browser):** `/llms.txt` headers + facts-clean
body + absolute bilingual URLs matching the sitemap's slugs; the key file returns the bare 32-byte key;
`/logo-512.png`, `/icon.svg`, `/apple-icon.png`, `/icon-{192,512}.png` all 200 with correct types; the
homepage HTML carries `"logo":"…/logo-512.png"` in the JSON-LD and the manifest/icon/apple `<link>`s in
`<head>`; `/manifest.webmanifest` is valid JSON; **sitemap.xml has 0 llms.txt entries** and still lists
all 7 routes × 2 locales + DB products; Home + About render with **no console errors**; the `logo.svg`
embedded-font wordmark renders correctly in-browser. **Gates:** `npm test` **85/85** (84 + 1 new
JSON-LD-logo assertion) incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected
…, stock 0`; `npm run build` / `npx tsc --noEmit` / `npm run lint` clean. `SITE_URL` unchanged; **no
`supabase/`, `create_order`, `expire_reservations`, cart, stock, `src/config/`, `src/types/database.ts`,
or npm dependency touched.** No new placeholder; none cleared/reworded/hidden (#2–#7 byte-unchanged).
Owed-verification register **+2 rows** (#13 wordmark sign-off; #14 register IndexNow key in Bing) and #11
extended to cover the logo; placeholder register unchanged. Decisions `D-2.04b-1…6`. Branch
`phase-2.04b-seo-geo-polish`; **PR #14 MERGED to `main` (merge `c562195`, 2026-07-22) on Petar's explicit
instruction (`D-0-3` — an operator, not Code, authorised it); branch deleted; production deploy VERIFIED**
(`/llms.txt`, the JSON-LD `logo`, and the manifest/icon `<link>`s serve on production). **⚠️ Discovered at
merge: production `trajanov-v2.vercel.app` now 308-redirects to `https://www.trajanovv.com` — a real
custom domain (`trajanovv.com`, double-v) attached outside the repo; Petar confirmed it is his and chose
to leave `SITE_URL` for 2.05.** So the served absolute URLs still reference the vercel.app origin, and
`facts.md` §9 (single-v, "not purchased") is stale — both are 2.05 reconciliation items. See line 1 + the
Known-issue below.

**2.04 COMPLETE — the store is fast, accessible, and survives being pasted into an Instagram story
(2026-07-20).** Discoverability + share surfaces shipped, none of which 2.03 touched:
a dynamic **`/sitemap.xml`** (both locales, every indexable route absolute on `SITE_URL` via next-intl
`getPathname` + each DB product; Cart/Checkout/`/styleguide` absent), **`/robots.txt`** (Sitemap +
`Disallow /styleguide`), and per-page **`noindex`** on Cart/Checkout/`/styleguide` while the content
routes stay indexable. **Structured data:** site-wide Organization + WebSite JSON-LD in the locale
layout (`src/lib/seo/site-jsonld.ts`) — **no address (`facts.md` §1), no fabricated logo, no
SearchAction, no EAM/partner**, `sameAs` = the one Instagram URL from `src/lib/social.ts`; and a
Product JSON-LD generator (`src/lib/seo/product-jsonld.ts`) that **emits no node while product names
are placeholders (register #4)** and, once a product has a real name, carries the real `price` + `MKD`
and an availability **derived from `src/lib/drop/state.ts`** (never a hardcoded `InStock`), with
`image`/`description` omitted while #2/#3 stand. Verified end-to-end against the local seed DB (which
carries real test names) — a real `Product` node rendered with `availability InStock`, `price "999"`,
`priceCurrency MKD`, no image/description; on production (null names) no node ships. **Share cards:** a
per-locale, **type-only** `next/og` card (`src/app/og/route.tsx`, 1200×630, brand ground + mustard
wordmark + the page's `Meta` title + the `@trajanovv2026` handle) rendered with a **vendored Rubik
Cyrillic woff** so the MK card shows native Cyrillic (screenshot in the report) — no photo, no baked
countdown. Every route's metadata now flows through one helper `pageMetadata()` (`src/lib/metadata.ts`),
so an **absolute** `og:image` + `twitter:card="summary_large_image"` is present on **every** route
(grep-confirmed across all 10 routes × both locales), reusing the 2.01 hreflang/canonical. **a11y —
WCAG 2.2 AA:** axe (axe-core 4.10 in a headless Chromium, tall viewport) returns **zero
serious/critical** on Home (live), Catalog, Product, Checkout (form populated), and Terms; a
skip-to-content link + `<main id="main-content">`, one H1 per page with no skipped levels (ProductCard
`h3`→`h2`; a visually-hidden H1 on the live home), checkout **real `<label>`s** + `aria-invalid` /
`aria-describedby` (triggered and confirmed) + a polite `aria-live` region, a global `:focus-visible`
ring on the brand focus-ring token, `lang` on the language switch + the About quote, WCAG-2.2 **24px**
footer targets + a **44px** cart icon, and the `prefers-reduced-motion` rule shipping in the CSS
(neutralises the live-dot pulse; the countdown is value-updates-only and the drop reveal is a plain
swap — framer-motion unused). **Two real a11y bugs were found and fixed:** the low-stock card count
was accent-red on the surface card (**4.31:1**, fails AA) → now the near-black-on-red pill (4.8:1,
`D-2.04-4`); the footer nav links were under the 24px target size (`D-2.04-5`). **Lighthouse (real
scores, pasted per route/form-factor in the completion report): Accessibility 100 + Best-Practices 100
on all five routes; Desktop Performance 100 on all five; SEO 100 on the live production origin** — the
localhost SEO **92** on content routes is purely the cross-origin `canonical` audit artifact (canonical
points at `SITE_URL` while Lighthouse runs on `127.0.0.1`), **verified 100 on
`https://trajanov-v2.vercel.app/en` with the canonical audit passing**; Checkout SEO **58** is the
deliberate `noindex` correctly failing the is-crawlable audit. **Owed:** mobile Performance **94** on
Catalog + Checkout (throttled-mobile SSR — re-check on PageSpeed Insights post-2.05), and the human
**OG paste-test** into Instagram + Viber (code cannot confirm a real link preview). **Standing gates:**
`npm test` **84/84** (69 prior + 15 new SEO/JSON-LD) incl. the **10-vs-3 oversell gate** (re-run GREEN),
build / lint / tsc clean; `vitest.config.ts` gained the `@`→`src` alias (`D-2.04-8`), no new dependency,
`package.json` runtime deps unchanged, `SITE_URL` unchanged. **No `supabase/migrations/`, `create_order`,
`expire_reservations`, cart, `src/config/`, `src/types/database.ts`, or hosted DB touched.** **No new
placeholder shipped and none cleared/reworded/hidden (#2–#7 byte-unchanged).** Branch
`phase-2.04-perf-a11y-seo`; **PR #13 MERGED to `main` (merge `6375a0d`, 2026-07-20) on Petar's explicit
instruction (`D-0-3` — an operator, not Code, authorised it); branch deleted; production deploy VERIFIED**
(sitemap/robots/OG card/site JSON-LD serve on `https://trajanov-v2.vercel.app`; the product page correctly
ships no Product node while names are placeholders, with a neutral non-placeholder OG title). Owed-verification
register **+2 rows** (#11 OG paste-test; #12 the mobile-Perf/SEO Lighthouse gaps).

**2.03 COMPLETE — the store has honest legal pages and every rendered claim is now audited
(2026-07-19).** Three **static** pages joined the site in both locales, built from the same
editorial pattern as `/about`+`/contact` through a shared `src/components/legal/LegalPage.tsx` shell:
**Terms** (`/uslovi` · `/en/terms`), **Privacy** (`/privatnost` · `/en/privacy`), and **Shipping &
Returns** (`/isporaka-i-vrakjanje` · `/en/shipping-returns`) — all prerendered `●` SSG per locale, no
`force-dynamic`. Every line is written to a source: `facts.md §1/§7`, shipped code (the 48h reservation,
the 2-per-order cap, COD, the one-way IP hash, the `orders`-column field list, the notification email),
or a logged decision. **No statute, article, directive, or statutory withdrawal period is cited**
(Decision 5); **no cookie banner** was added (Decision 4); the **email is not published** on any page
(register #5 intact). The responsible party displayed on Terms + Privacy is **Vladimir Trajanov,
Струмица, alone** (`D-2.03-1`, Lazar's call) — **no parent or guardian name appears anywhere in the
diff.** Delivery cost/time and the returns/exchange window ship as **visible `[PLACEHOLDER: …]`** markers
(register #6, #7 — owner Vladimir), never estimated. The **full `facts.md` audit** is committed at
`docs/legal/facts-audit-2.03.md`: every rendered claim traced, **2 findings surfaced** (F-1 the §1
responsible-party contradiction — resolved by amending §1; F-2 the cart's "calculated on delivery" —
surfaced, not reworded, `D-2.03-6`), **zero UNSOURCED rows remain**, and the §10 "do-NOT-have" list
(reviews, counts, partners, team, second location) `grep`-confirmed **absent**. `facts.md` §1 amended so
the file and the site agree (displayed party + intake fact both kept; the open parental-confirmation flag
**unchanged**). Message catalogs grew **150 → 213 keys** (63 new, MK+EN identical, no empty value); a
`humanizer` pass ran over every new string; `docs/i18n/mk-review-2.03.md` is committed **unsigned** for
the native review; `docs/i18n/string-inventory.md` regenerated (213) and committed. **69 tests pass** (63
+ 6 new legal-route pathname assertions) incl. the **10-vs-3 oversell gate**; build/lint/tsc clean;
parity driven **RED→GREEN**. **Nothing touched** in `supabase/migrations/`, `create_order`,
`expire_reservations`, the cart, `src/config/`, the hosted DB, or dependencies. All three pages rendered
in-browser at 390px + 1180px in both locales (Cyrillic native, placeholders visible, footer links resolve
to the localised slugs). **The owed-verification register is NO LONGER EMPTY** — 2.03 added rows **#9**
(no human legal review) and **#10** (MK legal copy unreviewed), both owner-verifiable by the 2.05 cutover.
Branch `phase-2.03-legal-facts`; **PR #12 MERGED to `main` (merge `4fcc0bd`, 2026-07-19)** on Petar's instruction and the production deploy verified live (six legal URLs serve; MK Terms renders MK). Code did not self-merge — an operator authorised it (`D-0-3`).

**2.02 COMPLETE — the native MK review passed clean (2026-07-19).** Two native Macedonian
speakers, Lazar and Petar, read all **150** MK strings and all **8** URLs in both locales against
`docs/i18n/string-inventory.md`, plus the six MK route slugs. Verdict: **every string OK — no
spelling / grammar / agreement / terminology fault, no English-in-MK leak, and no style change — and all six
slugs confirmed Keep** (`/katalog`, `/katalog/[slug]`, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`; the
Latin transliteration, `D-2.01-1`, and the shared product slug, `D-2.01-2`, both stand — `D-2.02-3`). The
working record is `docs/i18n/mk-review-2.02.md`: the how-to, the URL walk, the slug question, the full
150-row table with a verdict on every row, and **both sign-off blocks filled** (the two reviewed **jointly**
and Code transcribed the verdicts, `D-2.02-2`; provenance noted in the file). Because nothing was a fault,
**`src/messages/{mk,en}.json` are untouched** (Task 3 a no-op — no string changed, so no humanizer pass and
no `facts.md` re-verify was needed); because every slug is Keep, **`next.config.ts`, the redirect table,
`src/i18n/routing.ts` `pathnames`, and `tests/i18n/` are unchanged** — the only code change in the whole
phase is the `routing.ts` comment flipping from "provisional" to "confirmed", and the removal of "provisional"
slug language from `routing.ts` and this file. **63 tests pass** (unchanged from 2.01) incl. the 10-vs-3
oversell gate; build / lint / tsc clean; the parity test was driven **RED then GREEN**; `npm run i18n:inventory`
regenerated `docs/i18n/string-inventory.md` **byte-identical** (no commit — no string changed). **No
`supabase/migrations/`, `src/config/`, `create_order`, `expire_reservations`, hosted DB, or npm dependency
touched.** Branch `phase-2.02-mk-review`. **Owed-verification register stays EMPTY; placeholder register
unchanged.**

**2.01 COMPLETE — the store is bilingual down to the URL (2026-07-19).** next-intl `pathnames`
localise the MK route slugs (Latin transliteration, `D-2.01-1`) while the internal route folders are
unchanged; the product slug is single/shared across locales (`D-2.01-2`). Old English MK paths **308** to
the new slugs (`next.config.ts`, kept in lockstep with `routing.ts`), `/en/*` untouched (`D-2.01-3`). Every
user-facing string lives in `src/messages/{mk,en}.json` — the only literals left to extract were the cart
quantity-stepper `aria-label`s (`Cart.decrease`/`increase`); a new `Meta` namespace drives per-locale
`<title>`/description on every route. Reciprocal **hreflang** (mk/en/x-default→MK) + a self-referencing
`canonical`, all absolute on the single `SITE_URL` constant (`src/lib/site.ts`, `TODO(2.05): trajanov.com`),
are emitted per page via `src/lib/metadata.ts`'s `localeAlternates` + next-intl `getPathname`. The MK-only
**shipping statement** (one shared key `Common.shippingNotice`, traced to `facts.md` §7 VERIFIED) renders
above Add-to-cart on the product page and in the checkout COD block, both locales; the EN wording is
explicit that we do not deliver outside North Macedonia (`ShippingNotice.tsx`, `D-2.01-7`). `formatMkd` is
now locale-aware (MK `1.199 ден` / EN `1,199 MKD`; MKD always, **no currency conversion anywhere**,
`D-2.01-8`). The `LanguageSwitch` switches locale in place and preserves the page + query/`?preview` across
the slug change (`D-2.01-6`). A committed `docs/i18n/string-inventory.md` (regen `npm run i18n:inventory`)
lists every key/MK/EN/where + two flag sections for the 2.02 reviewers. **63 tests pass** (56 + 7 new i18n:
catalog parity + pathname coverage; the parity test was confirmed RED when a key was removed from `en.json`,
then restored). Verified in-browser both locales at 390px + 1180px: redirects (308 + Location), MK slugs 200,
`/en/*` 200, reciprocal hreflang, the shipping notice, and the language switch on a dynamic product page with
`?preview`. **No `supabase/migrations/`, `create_order`, `expire_reservations`, component-of-record, or
hosted DB touched; no new npm dependency** (added the `i18n:inventory` script only). Branch
`phase-2.01-bilingual`. **Owed-verification register stays EMPTY.**

**1.08 CODE HALF PASSED against hosted (2026-07-18); operator half + email prereq still OWED.**
The gate ran its Code-verifiable half against the live Frankfurt DB and returned it clean (`D-1.08-3`):
- **Real content recorded.** `facts.md` §7 marks **1199 MKD** + currency **MKD** + sizes **S/M/L/XL
  (off-white XL-only)** VERIFIED (owner via Lazar, 2026-07-18); the old ~$65/3,700 MKD indicative ceiling is
  SUPERSEDED; fabric/care + per-size measurements stay OWED. `src/config/products.ts` now prices the two
  verified colourways at 1199 MKD — `test-mustard-ochre` (S/M/L/XL) and `test-off-white` (XL-only, the
  single-variant path) — names still `null`/placeholder. No USD anywhere.
- **Concurrent oversell re-run on hosted (DoD):** `10 simultaneous orders against 3 units → exactly 3 succeed,
  7 rejected with insufficient_stock, stock 0` (726 ms). Full suite **56/56 against `kmuocwmevyyuhcvwoebf`**
  (25 s), incl. both expiry tests.
- **Reservation expiry observed LIVE on hosted** (no 48h wait): a backdated hold was expired by the scheduled
  `*/5` pg_cron job at the 10:00:00 cycle (`cron.job_run_details`: succeeded, "1 row"), stock returned; **2
  active cron jobs**; test row cleaned.
- **Turnstile enforced (real production secret):** Siteverify rejected a **missing** token
  (`missing-input-response`) and an **invalid** token (`invalid-input-response`); wrong-secret control
  (`invalid-input-secret`) proves the real secret is genuinely validated. Hosted `orders=0` — no order row, no
  stock change. Closes register #5 per the brief's Task 5 (`D-1.07-7`, `D-1.08-3`).
- **Rate limits fire:** IP limit (`check_order_rate_limit`, max=5) → 5 allowed, 6th–7th rejected; phone limit
  (`create_order` one-live-order-per-phone) → 2nd same-phone order rejected `TR005`, stock decremented only by
  the 1st. Test rows cleaned.
- **Hosted returned to pre-session clean:** seed fixtures removed; `orders/order_items/order_attempts = 0`;
  only the ended `test-drop` (still its old `test-piece-01..04` placeholder products — the new priced config
  was **not** synced, because the live order is deferred); `order_number_seq` reset to **1/false → TRJ-0001**.
- **NOT done this session (operator half, deferred to the runbook — `D-1.08-3`):** publishing the buyable
  rehearsal drop + the **one real phone order**; the **notification email landing in Vladimir's inbox** (#7);
  the **design sign-off** (#1); the **Instagram click-test** (#2); the **auto-expose toggle** (#6); and the
  Z.01 email prereqs (Resend account + Vercel keys) are **UNCONFIRMED**. The register is therefore **not at
  zero** and `NEXT:` stays `1.08`. Method note: Turnstile + rate-limit enforcement were proven at the exact
  server-side calls the Server Action makes (Siteverify with the real secret; the `check_order_rate_limit`
  RPC; `create_order` `TR005`), not by hand-driving the deployed Next Server Action (which needs a
  browser-solved token / an open drop — the operator path). Branch `phase-1.08-verification-gate`.

**Z.01 SHIPPED — the order-notification email is built (Phase Z.01, prior update).** When `create_order()`
returns success, the order path fires a **best-effort** MK notification to Vladimir via **Resend** (SDK
`resend 6.17.2`), so he can phone the customer to confirm. It is wired as an injected, awaited-but-guarded
`notifyOrder` dep on the pure `processOrder` core (`D-Z.01-5`): a Resend outage, timeout, thrown error, or
**missing env var never fails, delays past ~8s, or rolls back the order** — the DB is the record, the email
is a side channel (Plan §8, `D-0-5`). Sender in `src/lib/email/order-notification.ts`; from
`onboarding@resend.dev` until `trajanov.com` (`D-Z.01-2`); **no customer email collected** (`D-Z.01-1`).
Vladimir's address lives **only** in `ORDER_NOTIFICATION_EMAIL` and is **not** published on Contact
(`D-Z.01-3`; placeholder #5 stays). **56 tests pass** (46 + 6 email, Resend mocked + 4 notify-wiring),
incl. the re-run 10-vs-3 oversell gate; build/lint/tsc clean. **What is owed to 1.08:** that a real order
actually *delivers* to Vladimir's inbox — needs the live Vercel keys (operator prereq) + a live, priced
drop. Branch `phase-Z01-order-email`. **`create_order`/`expire_reservations`/migrations untouched; the only
new dependency is `resend`.**

**THE STORE IS LIVE ON A PUBLIC URL — https://trajanov-v2.vercel.app — running against the real
Frankfurt database with real bot-protection keys.** Phase 1.07 (Code) linked the repo to hosted
Supabase (`kmuocwmevyyuhcvwoebf`, `eu-central-1`, Postgres 17.6), pushed the schema, proved parity,
deployed, and verified production. **Six phases of "local only" (`D-1.03-5`) are over.**

**Hosted parity is PROVEN, not asserted (owed #4 CLOSED).** All **8** migrations pushed; `migration
list` shows local and remote carrying the same 8 with **no migration edited to make that true**.
**pg_cron came up from the migration with no dashboard step** — `cron.job` returns **2 active rows**
in the `postgres` database (the phase's biggest named risk, and it was a non-event). The **real
46-test suite ran against Frankfurt and all 46 passed**, including the **10-vs-3 oversell gate
(exactly 3 succeed, 7 cleanly rejected, stock 0)** and both expiry tests — **the atomic decrement
holds on the real host, under real latency**. Hosted was then **reset clean and verified**: 0 rows in
all 6 tables, `TRJ-####` back to **TRJ-0001**, 2 cron jobs still active. Local re-run: **46 still
pass**, `.env.local` untouched and still pointing at Colima (`D-1.07-9`).

**The phase found a real bug and fixed it (`D-1.07-14`).** The parity run failed **1 of 46**:
hosted `anon` held `INSERT/UPDATE/DELETE/TRUNCATE` on `drops`/`products`/`variants`; local held
none of them. Cause: `schema.sql:150-152` assumes *"a table is unreachable until GRANTed here"* —
true locally (`auto_expose_new_tables` unset), **false on hosted**, where Cowork left
**"Automatically expose new tables" ON** (`D-1.07-3`). **No data was ever exposed** — RLS with
SELECT-only policies blocked every write (verified: stock 5→5, INSERT rejected `42501`) — but hosted
had **one barrier where local has two**. New migration `20260716120000_catalog_grant_hardening.sql`
REVOKEs those privileges from `anon`/`authenticated`/`public`; **both environments now report
`REFERENCES,SELECT,TRIGGER`** and the test passes for the right reason. Everywhere the migrations
already revoked explicitly (`orders`, `order_items`, `order_attempts`, all 3 functions), hosted
matched local exactly.

**Real Turnstile is live and proven end to end (owed #5 NARROWED, not closed — `D-1.07-7`).** The
deployed `/checkout` serves site key **`0x4AAAAAAD23OFW7Ka1hTR1F`**; **no dummy key appears anywhere
in the deployed build** (961 KB of JS + HTML scanned). A widget mounted on the production hostname
**solved in Managed mode and minted a real token**, which Siteverify accepted with the real secret:
**`success: true`, `hostname: trajanov-v2.vercel.app`**. A wrong-secret control returned
`invalid-input-secret`, so the pass is meaningful. **Still owed to 1.08:** whether Cloudflare
actually challenges a *bot* on a *real order* — that needs a live drop, which 1.07 deliberately does
not create.

**`test-drop` published to hosted** via `npm run sync:drop` — **stock INSERT-only (16 inserted, 0
overwritten), 0 rows deleted** (`D-1.04-5`). It is **ended and null-priced** (`D-1.04-12`), so the
site renders the *ended* state and **nothing is buyable**. **0 orders on production.**

**Resend was struck from 1.07 (`D-1.07-8`) and BUILT in Z.01 (this update).** 1.07 shipped no key, no
code, no stub; Z.01 added the SDK + sender. The email code is done and unit-tested; the remaining Resend
work is real-world only (live keys + a live drop), owed to 1.08 — see the register.

**Two credential facts the operator must know (`D-1.07-12`):** (1) the Vercel env vars are marked
**Sensitive**, which makes them **write-only** — `vercel env pull` returns all six as empty strings,
so Cowork's "no functional impact" is true for the build and **false** for anyone working locally;
(2) **the Supabase DB password was RESET this phase at the operator's instruction** — the password
manager's entry is now **stale and wrong**; the new one exists only in gitignored `.env.hosted` on
Petar's machine and is **unrecoverable if lost**. A Supabase **account access token**
(`claude-code-phase-1.07`, expires 2026-08-15) was minted to drive the CLI and **should be revoked**.

**`supabase db reset --linked` is broken against this schema (`D-1.07-15`)** — it drops tables but not
sequences, then fails its own re-apply on `order_number_seq already exists`, leaving the database
wiped. Recovered by hand (drop sequence → `db push --include-all`). **Never run it against a database
with real orders — on the free tier there is no backup.**

Prior (1.07 Cowork): the accounts — Vercel project, hosted Supabase (Frankfurt), Turnstile widget,
and six env vars set in Vercel (Production + Preview, Sensitive). Reports:
`completions/Part-1-Phase-07-Cowork-Completion.md` + `Ops-Handoff-Phase-1.07.md`.

Prior (1.06): the cart flow —

**The cart flow is real — checkout now orders what the customer actually chose (`D-1.04-16` closed).**
A client-side cart (a pure reducer in `src/lib/cart/cart.ts` + a sessionStorage `useSyncExternalStore`
store in `src/components/cart/cart-store.ts`) carries the chosen **(product, variant, qty)** from the
product page through the cart to checkout and into `create_order()`. The **stand-in** that submitted
the active drop's first in-stock variant is **deleted** (`getActiveOrderContext` gone; grep clean); the
client sends **`variant_id` + `qty` only** — never a price or a name. `SizePicker`/`BuyButton` are
wired via a new `AddToCartPanel` (size required before Add; sold-out sizes unselectable; the six buy
states); `CartView` and `CheckoutForm` read real cart state; empty checkout is rejected before
`create_order()` (client empty state + `processOrder` `"empty"` guard). The cart **never** writes to
`variants`/`orders`/`order_items` and never reserves stock. The cap mirrors what `create_order()`
enforces — **2 total units per order** (not per line), which agrees with the Plan. **No new dependency;
no `supabase/migrations/` file touched; `create_order`/`expire_reservations` unchanged.** `seed.sql`
gained a second product (`test-tee-two`) so a test can prove the *chosen* product (not the drop's
first) reaches the order row. **46 Vitest tests pass** (31 + 15 new), incl. the re-run 10-vs-3 oversell
gate; the phase test was confirmed to fail against the stand-in before it was deleted. Pages rendered
in-browser both locales at 390px + 1180px. Branch `phase-1.06-cart-flow`; PR `#6` to `main`.

Prior (1.05): About + Contact —

**About + Contact are live, sourced entirely from `facts.md`.** Two **static** editorial pages
(`/about`, `/contact`, both locales, prerendered `●`/SSG via `setRequestLocale`) join the site. About
tells the competition story from `facts.md` §3 and lists **all five** press outlets as links (Трн.мк,
Струмица Денес, Бизнис Вести, Cultural Chat, Република) under a plain heading — no count, no adjective
(`D-1.05-5`); the one approved quote renders in MK and as a marked EN translation (`D-1.05-6`). Contact
carries the phone (`078 820 520` → `tel:+38978820520`), the single Instagram account, and a visible
email `[PLACEHOLDER]` — **no form, no address** (`facts.md` §1). The phone joined `src/lib/social.ts`
as a shared constant (`D-1.05-9`); the footer now links About + Contact and shows a **translated**
location (fixed a pre-existing EN-in-MK leak, `D-1.05-10`); Home shows one quiet About link in its
**countdown** and **ended** states only (`D-1.05-7`). **No hero photo and no photo slot** (`D-1.05-4`).
The header is unchanged. **31 tests still pass; build/tsc/lint clean.** Branch
`phase-1.05-about-contact`. **No `src/lib/{drop,orders}`, `src/config/`, `supabase/`, or `tests/` file
was touched.**

Prior (1.04): the drop engine —

**Drop engine landed — the site is DB-driven and a drop can open and close on its own.** The
catalogue, countdown, and buy path now come from the **database, computed on the server**;
`src/lib/demo.ts` is deleted. A typed drop config lives in `src/config/` (`D-0-4`) and a
`npm run sync:drop` script writes it to Supabase (direct-Postgres, `D-1.04-11`). Drop state
(countdown/live/ended) is server-computed from the DB and drop-state routes are `force-dynamic`
(`D-1.04-9`); the countdown is anchored to the server clock, and at T-0 the client re-validates with
the server. `create_order()` gained **`TR006 price_missing`** (before any decrement); `price_mkd`
and product names are **nullable** (`D-1.04-6/10` — no fabricated prices/names). `expire_reservations()`
is now **scheduled by pg_cron** (every 5 min) with a nightly run-log prune (`D-1.04-2/3`). Order
creation is gated by **real Cloudflare Turnstile** (Siteverify server-side, token minted at submit,
dummy keys until 1.07) and an **IP rate limit** (peppered SHA-256 hash, 20/10 min, threshold on the
drop row — no raw IP stored). **31 Vitest tests pass**, including the re-run oversell gate (10 vs 3 →
exactly 3, stock 0) and the sync-never-resets-stock test. A full order was placed end-to-end
in-browser (Turnstile → Siteverify → rate limit → `create_order` → `TRJ-0001`). **Local only, no
deploy (`D-1.03-5`).** UI unchanged bar the retired client preview switcher (`D-1.04-13`). Branch
`phase-1.04-drop-engine`; PR `#4` to `main`.

Prior (1.03): Postgres schema + atomic `create_order`/`expire_reservations` + RLS + typed clients.
Prior (1.02): design system + full clickable site, MK default + EN.

| | |
|---|---|
| Part | 2 of 2 — Launch prep |
| Phase | **2.06 Code half complete — Drop rehearsal + contingency** (two `docs/ops/` docs: the `D-0-2` contingency plan + the operator rehearsal runbook; seven `rehearsal-sql/` helpers; no commerce/dep change; gates 85/85; `D-2.06-1/2`). **Operator half owed** — the live rehearsal (Lazar + Vladimir) clears #15/#16. Prior: **2.05 — Cutover**; **2.04b — SEO/GEO polish**. Next: **Y.01** (drop content) then the first REAL drop, gated on placeholder-register-to-zero |
| Branch | `phase-2.06-rehearsal-contingency` → **PR #16 MERGED to `main`** (merge `20e5d3d`, 2026-07-22) on Petar's instruction; branch deleted. Prior: `phase-2.05-cutover` → PR **#15 MERGED** (`49fe2ca`, 2026-07-22); `phase-2.04b-seo-geo-polish` → PR `#14`, merged `c562195` (2026-07-22) |
| Open PR | **None.** `#16` merged (2026-07-22). Prior merged: 1.01–1.07 `#1`–`#7`; Z.01 `#8`; 1.08 `#9`; 2.01 `#10`; 2.02 `#11`; 2.03 `#12`; 2.04 `#13`; 2.04b `#14`; 2.05 `#15`; 2.06 `#16` |
| Deployed | **YES — served + canonicalised on `https://www.trajanovv.com`** (real custom domain, double-v; the apex `trajanovv.com` + `trajanov-v2.vercel.app` both 308-redirect to it). **2.05 is LIVE and smoke-verified by Code (2026-07-22):** the deployed build now emits `www.trajanovv.com` in the home canonical, `/sitemap.xml`, `/robots.txt`, the Organization JSON-LD `@id`/`logo`, `og:image`, and `/llms.txt`; Contact publishes `info@trajanovv.com` (MK „Е-пошта" + EN "Email"); Shipping shows „3–5 работни дена" / "3–5 business days"; **zero** `trajanov-v2.vercel.app` / single-v `trajanov.com` on any live surface. Prior smoke-verifications (2.04b/2.04/2.01) stand. `D-1.03-5`/`D-1.06-4` closed |
| Domain | **`trajanovv.com` (double-v) — PURCHASED + LIVE** (`facts.md` §9 now **VERIFIED — PURCHASED**, reconciled from the stale single-v "not purchased" entry, 2.05). Served/canonicalised on **`https://www.trajanovv.com`** (apex + vercel.app 308→www). **`SITE_URL` flipped to `https://www.trajanovv.com` (2.05, `D-2.05-6`)** — deploys on merge |

---

## Stack

**Canonical: `00_stack-and-config.md`.** Not restated here.

Installed and pinned in 1.01 (versions recorded there). Toolchain: Node `v24.17.0`, npm `11.13.0`.
Note: shadcn's default style is Base UI-based (`base-nova`), not Radix — see `D-1.01-1`.

---

## Built

### Drop rehearsal + contingency (2.06, Code half) — drop day as a script

- **`docs/ops/drop-day-contingency.md`** — the `D-0-2` drop-day contingency plan. Detection · bilingual
  (MK+EN) Instagram hold post [story + feed caption, humanizer pass, Lazar sign-off owed] · manual DM/phone
  order channel + anti-oversell tally · X.01 recovery trigger · roles · hard don'ts. Every fact traced to
  `facts.md` (phone `078 820 520`, IG `@trajanovv2026`, `info@trajanovv.com`, COD, NMK-only, delivery 3–5
  business days); no invented courier/cost/stock.
- **`docs/ops/drop-rehearsal-runbook.md`** — plain-language operator script: pre-flight → open (hosted only,
  one sellable unit, never committed to `main`) → lifecycle on a phone (countdown→LIVE→order [#15]→SOLD
  OUT→email [#16]→fulfilment walk) → expiry (backdated hold, `*/5` job) → contingency dry-run → mandatory
  teardown (ban on `db reset --linked`) → evidence.
- **`docs/ops/rehearsal-sql/`** — `00-baseline` · `01-open-rehearsal-drop` · `02-verify-live` ·
  `03-verify-order` · `04-backdate-hold` · `05-verify-expiry` · `06-teardown` · `07-verify-clean` (+
  `README`). Supabase SQL Editor, `test-drop` only, reusing the 1.08 open→order→verify→close method.
- **`docs/ops/rehearsal-evidence/`** — evidence drop folder (README with the `D-0-1` PII caution).
- **Decisions:** `D-2.06-1` (one order against a one-unit drop, reused for the expiry test),
  `D-2.06-2` (contingency points at X.01; the X.01 brief is flagged-not-written, out of 2.06 scope).
- **No code:** `create_order`/`expire_reservations`/`supabase/migrations/`/cart/checkout/`src/config/`
  untouched; no new dependency; committed drop stays ENDED.

### Cutover (2.05) — the real domain, the branded email, the published contact

- **`SITE_URL`** `src/lib/site.ts` → `https://www.trajanovv.com` (the canonical 200-serving host; apex +
  `trajanov-v2.vercel.app` 308→www, `D-2.05-6`). Single source — every canonical/hreflang/OG/JSON-LD/
  sitemap/robots/llms.txt/IndexNow URL rebuilds from it. Grep gate: **zero** `trajanov-v2.vercel.app` /
  single-v `trajanov.com` in emitted URLs/canonicals/OG/schema.
- **Order-email from-address** `src/lib/email/order-notification.ts` — `ORDER_FROM_ADDRESS` →
  `info@trajanovv.com` (the one Vladimir notification; no customer email exists, `D-Z.01-1`).
  `ORDER_NOTIFICATION_EMAIL` (recipient) untouched. Email unit tests (mocked Resend) assert the new
  from-address.
- **Contact publishes the email** `src/app/[locale]/contact/page.tsx` — a real
  `mailto:info@trajanovv.com` in both locales via the shared `EMAIL`/`EMAIL_MAILTO` constants
  (`src/lib/social.ts`); the `<Placeholder>` + `Placeholder.email` key are gone (removed from both
  catalogs). Placeholder **#5 cleared**.
- **Shipping delivery time** `src/app/[locale]/shipping-returns/page.tsx` + `ShippingReturns.deliveryTime`
  — „Рок на достава: 3–5 работни дена." / „Delivery time: 3–5 business days." (verbatim reviewed strings).
  `Placeholder.courier` **narrowed** to courier + cost; `deliveryBody` reworded to match (`D-2.05-7`);
  returns-window placeholder unchanged.
- **Turnstile** — `src/lib/turnstile/verify.ts` unchanged: it verifies `success` only and **does not
  assert hostname**, so the new domain needs no code allowlist. Site key rotated to
  `0x4AAAAAAD6pSIvEa1p8GkZX` (env-only, `D-2.05-4`); secret in Vercel, never in the repo.
- **Facts + review** — `facts.md` §5 (email published), §7 (delivery time VERIFIED; courier + cost OWED),
  §9 (domain `trajanovv.com` VERIFIED — PURCHASED, serving host www). `docs/i18n/mk-review-2.03.md`
  sign-off blocks filled (Lazar + Petar, 2026-07-21, passed no changes).
- **Decisions:** `D-2.05-1…5` (verbatim: domain, placeholder override, info@ routing, Turnstile rotation,
  analytics deferral), `D-2.05-6` (SITE_URL = www), `D-2.05-7` (shipping copy + single from-address).

### SEO/GEO polish (2.04b) — a face for the brand: llms.txt, logo, icons, IndexNow

- **`llms.txt`** `src/app/llms.txt/route.ts` (`force-static`, served at `/llms.txt`): `# Trajanov` H1, a
  one-paragraph `>` blockquote summary, a details paragraph, and `## Pages` / `## Legal` / `## Contact`
  link sections. English prose (LLM lingua franca); every claim traced to `facts.md` (see the file header
  for the line-by-line trace); **excludes** price/size/fabric/email/address/review/partner (`facts.md`
  §7/§10). Links are both-locale **absolute** URLs from the shared route list; `Content-Type: text/plain;
  charset=utf-8` + **`X-Robots-Tag: noindex`**; **not** in the sitemap (not a page).
- **Shared route module** `src/lib/seo/routes.ts` — `INDEXABLE_STATIC_HREFS` (the 7 static indexable
  routes, `as const`) + `absoluteUrl(href, locale)`. `src/app/sitemap.ts` was **refactored** onto it
  (dropping its inline `STATIC_HREFS`/`abs`/`Href`), and `llms.txt` reads the same, so the two route sets
  **cannot drift**; adding a route forces a compile-time label in llms.txt's exhaustive `PAGE_META`.
- **Brand wordmark** `public/logo.svg` (Rubik 700 embedded as base64 → renders anywhere; transparent
  ground) + `public/logo-512.png` (mustard wordmark on a solid ground square). `src/lib/seo/site-jsonld.ts`
  Organization node now carries **`logo: ${SITE_URL}/logo-512.png`** (absolute); the "NO logo" comment was
  rewritten to explain a real mark now exists — still **no** address / SearchAction / partner. `tests/seo/
  site-jsonld.test.ts` gained a positive `logo` assertion (and dropped the stale "no logo" one) → 85 tests.
- **Icon set + manifest** — `src/app/icon.svg` (geometric "T" monogram, brand colours, crisp at any size,
  font-independent) + `src/app/apple-icon.png` (180); `public/icon-192.png` + `public/icon-512.png` for the
  manifest; `src/app/manifest.ts` (`name`/`short_name` "Trajanov", facts-clean description, `lang: "mk"`,
  `start_url: "/"`, `display: "standalone"`, `theme`/`background` = ground token, icons incl. a
  maskable-safe 512). Next auto-injects the `manifest`/`icon`/`apple-touch-icon` `<link>`s; the legacy
  `favicon.ico` remains as fallback.
- **IndexNow** `public/78dec4b97e3fbb0f22d1c8df38050f74.txt` (the bare 32-char hex key) + `src/lib/seo/
  indexnow.ts` — `INDEXNOW_KEY` + a best-effort `pingIndexNow(urls)` that builds `host`/`keyLocation` from
  `SITE_URL` and POSTs to `api.indexnow.org`. **Exported, wired to nothing** (`D-2.04b-6`) — a preview host
  can't own submissions; a post-2.05 hook fires it. Key is **public by design, not a `D-0-1` secret.**
- **Asset generator** `scripts/generate-brand-assets.ts` (`npm run assets:brand`) — renders the four PNGs +
  the embedded-font `logo.svg` via **`next/og`** (satori + resvg, already in Next) from the vendored Rubik
  woff and brand token literals. **No new dependency** (`D-2.04b-5`); run by hand, outputs committed.
- **Gates**: `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** (84 + 1) incl.
  the 10-vs-3 oversell gate. Verified by curl + in-browser (see the register's 2.04b note). **No `supabase/`,
  `create_order`, `expire_reservations`, cart, stock, `src/config/`, `src/types/database.ts`, or npm
  dependency touched; `SITE_URL` unchanged.**
- **Decisions:** `D-2.04b-1` (introduce the wordmark — owner-level, sign-off owed), `D-2.04b-2` (ship
  `llms.txt`), `D-2.04b-3` (shared route module + sitemap refactor), `D-2.04b-4` ("T" monogram favicon),
  `D-2.04b-5` (`next/og` generator, no dep; token values mirrored as literals), `D-2.04b-6` (IndexNow key
  public + `pingIndexNow` un-wired).

### Perf, a11y, SEO (2.04) — discoverable, accessible, and shareable

- **Sitemap** `src/app/sitemap.ts` (dynamic): one `<url>` per (route, locale) with reciprocal
  `alternates.languages`, every URL absolute on `SITE_URL` + next-intl `getPathname` (grep: no hand-typed
  slug), plus each real product from `listCatalogProductSlugs()` (new export on `src/lib/drop/state.ts`,
  reads the DB). **Home, Catalog, About, Contact, Terms, Privacy, Shipping & Returns + each Product** in
  both locales; **Cart, Checkout, `/styleguide` excluded.** DB read wrapped in try/catch → static routes
  still serve if the product read fails.
- **robots** `src/app/robots.ts`: `Allow /`, `Disallow /styleguide` + `/en/styleguide`, `Host` +
  `Sitemap: ${SITE_URL}/sitemap.xml`.
- **noindex** on Cart, Checkout, `/styleguide` (both locales) via `pageMetadata({index:false})` →
  `<meta name="robots" content="noindex, nofollow">`; the content routes carry no robots meta (indexable).
  Verified by curl on all routes.
- **Site JSON-LD** `src/lib/seo/site-jsonld.ts` + `src/components/seo/JsonLd.tsx`, rendered in the locale
  layout: an `@graph` of **Organization** (`@id #organization`, `sameAs` = `INSTAGRAM_URL` only) +
  **WebSite** (`inLanguage ["mk","en"]`, `publisher` → the org). **No `address`, no `logo`, no
  `potentialAction`/SearchAction, no EAM/partner** (asserted by `tests/seo/site-jsonld.test.ts`).
- **Product JSON-LD** `src/lib/seo/product-jsonld.ts`, rendered on `/catalog/[slug]` **only when the
  product has a real name**. `brand` = Trajanov; `offers` with real `price` (string) + `priceCurrency
  "MKD"` + `availability` from `availabilityFor(dropState, stock)` (live+stock → InStock, live+soldout →
  SoldOut, countdown → PreOrder, ended+stock → OutOfStock — never hardcoded InStock, `D-2.04-3`);
  `image`/`description` omitted while #2/#3. `tests/seo/product-jsonld.test.ts` (12 cases) proves the
  placeholder gate + real-name node + the mapping. Exercised live: the seed's real-named product rendered
  a valid node; production's null-named `test-drop` renders none.
- **OG share cards** `src/app/og/route.tsx` (`next/og`, Node runtime): 1200×630, brand ground + mustard
  wordmark + the page's `Meta` title + `@trajanovv2026`, type-only (no photo, no baked countdown). Rubik
  700 latin + cyrillic loaded from **vendored woff** (`src/app/og/*.woff`, SIL OFL) via `readFileSync(new
  URL(...))` — no runtime Google request; MK renders native Cyrillic (screenshot). `/og` excluded from the
  proxy matcher (`src/proxy.ts`) so next-intl doesn't 404 it.
- **Central metadata** `src/lib/metadata.ts` — new `pageMetadata()` + `ogImageUrl()`: title/description +
  `localeAlternates` (2.01 hreflang/canonical, unchanged) + absolute `openGraph.images` +
  `twitter.card:"summary_large_image"` + optional noindex. **All 11 pages + the layout default** switched
  to it, so `og:image` + `twitter:image` are absolute on **every** route (grep-verified, 10 routes × 2
  locales). The product page passes a neutral brand `ogTitle` while names are placeholders, so **no
  placeholder value is baked into a card**.
- **a11y (WCAG 2.2 AA)** — axe-core 4.10 (headless Chromium, tall viewport so off-screen sampling doesn't
  false-positive) = **zero serious/critical** on Home (live), Catalog, Product, Checkout (form populated),
  Terms. Changes: skip-to-content link + `<main id="main-content">` (`layout.tsx`, new `Common.skipToContent`);
  `ProductCard` heading `h3`→`h2` + a visually-hidden `h1` on the live home (no heading skips); the
  low-stock card count → the `StockBadge` red pill (AA contrast, `D-2.04-4`); footer link 24px targets +
  44px cart icon (`D-2.04-5`); a global `:focus-visible` ring (`globals.css`, `D-2.04-6`); `lang` on the
  language-switch buttons + the About quote; `PhotoSlot` label 11.2px→12px (legible). Checkout already had
  real `<label>`s + `aria-invalid`/`aria-describedby` + `aria-live` — **triggered and confirmed** (error
  submit flips `aria-invalid="true"` + wires `aria-describedby` → the error text). `prefers-reduced-motion`
  rule ships in the CSS bundle; countdown is value-updates-only, reveal is a plain swap.
- **Lighthouse** (actual scores in `completions/Part-2-Phase-04-Completion.md`): Desktop **P/A/BP = 100**
  on all five routes; Mobile **A/BP = 100** on all five, Mobile **P** = Home 98 / Product 97 / Legal 95 /
  Catalog 94 / Checkout 94; **SEO 100 on the production origin** (localhost 92 = cross-origin canonical
  artifact, proven 100 on prod; Checkout 58 = intentional noindex).
- **Gates**: `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **84/84** (69 + 15
  new) incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected …, stock 0`; the
  catalog-parity test stays GREEN (both catalogs gained `Common.skipToContent`). `docs/i18n/string-inventory.md`
  regenerated (213 → 214). **No `supabase/migrations/`, `create_order`, `expire_reservations`, cart,
  `src/config/`, `src/types/database.ts`, hosted DB, or npm dependency touched; `SITE_URL` unchanged.**
- **Decisions:** `D-2.04-1` (dynamic `/og` + central `pageMetadata`), `D-2.04-2` (brand hex literals +
  vendored Rubik woff), `D-2.04-3` (availability mapping), `D-2.04-4` (low-stock pill for AA contrast),
  `D-2.04-5` (24px/44px tap targets), `D-2.04-6` (global focus-visible), `D-2.04-7` (skip link + new MK
  string), `D-2.04-8` (vitest `@` alias).

### Legal pages + facts audit (2.03) — three honest pages, every claim traced

- **Three static legal pages**, both locales, all `●` SSG (`setRequestLocale`, no `force-dynamic`):
  `src/app/[locale]/terms/page.tsx` (`/uslovi` · `/en/terms`), `privacy/page.tsx` (`/privatnost` ·
  `/en/privacy`), `shipping-returns/page.tsx` (`/isporaka-i-vrakjanje` · `/en/shipping-returns`). Built
  from the `/about`+`/contact` editorial pattern through a **shared shell** `src/components/legal/LegalPage.tsx`
  (`LegalPage` + `LegalSection`, `D-2.03-3`); brand.md tokens only. Each carries a per-locale `Meta`
  title/description + `localeAlternates` (canonical + reciprocal hreflang) and a fixed, per-locale-formatted
  **last-updated date** (`Common.lastUpdated` + a `LAST_UPDATED` constant, `D-2.03-4`).
- **Terms** — who you buy from (**Vladimir Trajanov, Струмица, alone** — `D-2.03-1`; no company, no
  address), reach us (phone + IG from `social.ts`, email unpublished), COD-only, NMK-only, the 48h
  reservation + 2-per-order + call-to-confirm flow, MKD prices/no conversion, and "what we don't do".
- **Privacy** — collected fields **matched to the real `orders` columns** in
  `supabase/migrations/20260715021215_schema.sql` (name/phone/city/address/note, **no email** — `D-Z.01-1`);
  why/who (notification email to Vladimir, `D-Z.01-5`); Frankfurt storage; the **one-way IP hash, raw IP
  never stored** (`src/lib/rate-limit/hash.ts`); `sessionStorage` cart + **no advertising/tracking/analytics/
  social cookies** (no consent banner — Decision 4); deletion by phone; responsible party Vladimir alone.
- **Shipping & Returns** — reuses the shared `ShippingNotice` (`Common.shippingNotice`, §7); pay-courier-on-
  arrival; **two visible `[PLACEHOLDER: …]`** (courier/time/cost, returns window — register #6/#7, owner
  Vladimir), never estimated; "call the phone, Vladimir sorts it" and a plain statement that there is no
  online returns portal / prepaid label. **No statutory withdrawal period cited** (Decision 5).
- **Facts audit** `docs/legal/facts-audit-2.03.md` — Part A walks all 150 pre-2.03 keys + rendered
  constants; Part B the 63 new keys. Status per row (VERIFIED `facts.md` / VERIFIED code / PLACEHOLDER /
  NOT A CLAIM / UNSOURCED). **2 findings:** F-1 (`facts.md` §1 responsible-party contradiction → resolved
  by the §1 amendment) and F-2 (cart "calculated on delivery" → surfaced, not reworded, `D-2.03-6`).
  **Zero UNSOURCED remain.** §10 "do-NOT-have" list `grep`-confirmed absent (EAM appears only as the
  competition organiser/prize factory on About).
- **`facts.md` §1 amended** so file and site agree (displayed party = Vladimir alone `D-2.03-1`; intake
  fact kept; **open parental-confirmation flag unchanged**); dated change-log row added.
- **Strings**: `Terms`/`Privacy`/`ShippingReturns` namespaces + `Nav.terms/privacy/shipping` + 6 `Meta`
  + `Common.lastUpdated` + `Placeholder.courier`/`returnsWindow` — **63 new, MK+EN key sets identical
  (150 → 213)**, no empty value. `humanizer` pass run (cut a stiff "Here is exactly" and a self-praising
  "Short and honest:" opener; the "no X, no Y, no Z" negations match the established voice and stayed).
  `docs/i18n/string-inventory.md` regenerated (213) + committed; `docs/i18n/mk-review-2.03.md` committed
  **unsigned** (63-row table + 3-slug question + two sign-off blocks).
- **Routing**: three `pathnames` entries (MK Latin transliteration, `D-2.01-1`); **no 308 redirects**
  (new paths, nothing to redirect from); lockstep comment updated. Footer links all three (locale-aware
  `Link`, `Nav.*` keys). `tests/i18n/pathnames.test.ts` gained explicit both-locale assertions for the
  three routes.
- **Gates**: `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **69/69** incl.
  `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock,
  stock 0`; parity driven **RED** (`Terms.sellerHeading` removed from `en.json`) **→ GREEN**. Rendered
  in-browser at 390px + 1180px, both locales. **No `supabase/migrations/`, `create_order`,
  `expire_reservations`, cart, `src/config/`, hosted DB, or npm dependency touched.**
- **Decisions:** `D-2.03-1` (responsible party — Lazar), `D-2.03-2` (audit treats operational claims as
  code-VERIFIED), `D-2.03-3` (shared `LegalPage` shell), `D-2.03-4` (fixed last-updated date), `D-2.03-5`
  (placeholders in the `Placeholder` namespace), `D-2.03-6` (cart F-2 surfaced, not reworded).

### Native MK review (2.02) — clean pass, no source change

- **Review record** `docs/i18n/mk-review-2.02.md`: the instrument the two reviewers worked from **and** the
  recorded result. Six sections — a plain-language how-to, an 8-page URL walk (both locales, live absolute
  links on `https://trajanov-v2.vercel.app`, checked 200 before writing), the six-slug Keep/Change question,
  the full **150-key** MK/EN table with a verdict on every row, the "intentionally not translated" list, and
  two sign-off blocks. The 150 keys were diffed against `docs/i18n/string-inventory.md` — **150 = 150**, exact.
- **Result: clean pass.** All 150 strings `OK` (no faults, no style notes); all six MK slugs `Keep`. Both
  reviewers (Lazar + Petar) signed off; they reviewed **jointly** and Code transcribed the verdicts, with the
  provenance stated in the file's Section 6 (`D-2.02-2`).
- **What that means for the code:** nothing to fix. `src/messages/{mk,en}.json` are **unchanged** (Task 3 a
  no-op); `next.config.ts`, the redirect table, `src/i18n/routing.ts` `pathnames`, and `tests/i18n/` are
  **unchanged** (all six slugs Keep, `D-2.02-3`). The only code edit in the phase is the `routing.ts` comment
  flipping "provisional"→"confirmed"; the word "provisional" is now gone from `routing.ts` and this file
  (`D-2.01-5` in `Decisions.md` is left intact as the historical record).
- **Decisions:** `D-2.02-1` (review pack in English prose, MK strings verbatim, dev-path column dropped),
  `D-2.02-2` (joint review transcribed by Code), `D-2.02-3` (all six slugs confirmed Keep).
- **Gates re-run (standing protection, none skipped):** `npm run build` / `npx tsc --noEmit` / `npm run lint`
  clean; `npm test` **63/63** incl. `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected
  with insufficient_stock, stock 0`; the catalog-parity test driven **RED** (removed `Nav.contact` from
  `en.json` → `keys present only in mk.json: [ 'Nav.contact' ]`) **then GREEN** (restored); `npm run
  i18n:inventory` regenerated `string-inventory.md` **byte-identical** (no string changed → nothing to commit).

### Bilingual (2.01) — Macedonian down to the URL

- **Localised route slugs** (`src/i18n/routing.ts`): `pathnames` maps each internal route to its MK Latin
  slug (`/katalog`, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`) and EN English slug (`/en/catalog`, …);
  `localePrefix: 'as-needed'`, `defaultLocale: 'mk'` unchanged. Route **folders** under `src/app/[locale]/`
  are NOT renamed. Product route `/catalog/[slug]` keeps a single shared slug in both locales (`D-2.01-2`).
  `src/proxy.ts` consumes `routing` unchanged — **no edit needed**.
- **Redirects** (`next.config.ts`): six **308** rules from the old English MK paths to the new MK slugs
  (`/catalog→/katalog`, `/catalog/:slug→/katalog/:slug`, `/cart→/kosnicka`, `/checkout→/naracka`,
  `/about→/za-nas`, `/contact→/kontakt`). `/en/*` is not matched. Runs before the next-intl middleware.
  Carries a "keep in lockstep with `routing.ts`" comment (`D-2.01-3`).
- **Typed navigation everywhere**: `ProductCard`'s dynamic link uses the object form
  `{pathname:'/catalog/[slug]', params:{slug}}` so next-intl emits the localised URL; `HomeExperience`'s
  `useRouter` moved to `@/i18n/navigation`. The only remaining `next/navigation` imports are `notFound`
  (layout, product page — not a route link) and `useParams` (LanguageSwitch — a param reader with no
  next-intl equivalent). No hand-written MK slug in any component.
- **String extraction**: the only user-facing literals still inline were the cart quantity-stepper
  `aria-label`s → `Cart.decrease` / `Cart.increase`. Everything else was already in the catalogs.
- **Per-locale metadata** (`Meta` namespace): `generateMetadata` on every route (+ the layout default)
  sets a locale-distinct `<title>` + description from the catalog; nothing hardcoded in `layout.tsx`.
  `<html lang>` renders `mk`/`en` correctly.
- **hreflang + canonical** (`src/lib/site.ts` + `src/lib/metadata.ts`): a single `SITE_URL` constant
  (`https://trajanov-v2.vercel.app`, `TODO(2.05): trajanov.com` — **not** from a Vercel var, no new env
  var). `localeAlternates(href, locale)` builds `alternates` via next-intl `getPathname`: `canonical` in
  the page's own locale, `languages.mk`/`languages.en`/`languages['x-default']`(→MK), all absolute and
  reciprocal (EN↔MK point at each other for the same page, incl. the shared product slug).
- **Shipping statement** (`src/components/system/ShippingNotice.tsx`, `Common.shippingNotice`): one shared
  key, traced to `facts.md` §7 ("Shipping — North Macedonia only", VERIFIED). Renders above Add-to-cart on
  the product page and in the checkout COD block, both locales. EN: "We ship inside North Macedonia only.
  We can't deliver outside the country. Cash on delivery." (`D-2.01-7`). The product page's existing
  below-fold Shipping detail (`Product.shippingBody`) is unchanged, so shipping shows twice there.
- **Locale-correct formatting** (`src/lib/format.ts`): `formatMkd(amount, currency, locale)` groups per
  locale (MK `1.199`, EN `1,199`), MKD always. Dates already go through the next-intl formatter (About).
  **No currency conversion exists anywhere** (`D-2.01-8`).
- **Language switch** (`src/components/layout/LanguageSwitch.tsx`): `router.replace({pathname, params,
  query}, {locale})` keeps the customer on the same page across the slug change; query + `?preview` read
  from `window.location.search` at click time (avoids a CSR bail-out on the static pages, `D-2.01-6`).
- **String inventory** (`scripts/i18n-inventory.ts`, `npm run i18n:inventory` → `docs/i18n/string-inventory.md`,
  committed): 150 keys with MK/EN/where + "Intentionally not translated" + "byte-identical" (4) sections.
  Flags ~12 apparently-unused keys carried from earlier phases (e.g. `Home.title`, `Product.details`) for
  2.02 — **not removed** (out of scope).
- **Tests** (`tests/i18n/`): catalog parity (identical key sets, no empty value bar the deliberate
  `About.quoteNote`, `D-2.01-10`) + pathname coverage (route folders ⇔ `pathnames`, both-locale slugs,
  `D-2.01-9`). **63 pass** total; parity confirmed RED then GREEN. No DB needed for the i18n suites.

### Order notification email (Z.01) — the side channel, best-effort

- **Sender** `src/lib/email/order-notification.ts`: `composeOrderNotification()` (pure MK subject + body —
  order number, each product/size/qty, customer name/phone/city/address/notes) and `sendOrderNotification()`
  (reads `RESEND_API_KEY` + `ORDER_NOTIFICATION_EMAIL` at call time, sends via `resend`, **never throws**,
  bounds the call at 8s, logs failures **without PII** — only the order number + Resend error code). From
  `onboarding@resend.dev` (`D-Z.01-2`). **No `import "server-only"`** — deliberately, so it stays unit-
  testable; it is only ever imported by the "use server" action + tests, never a client component.
- **Wiring**: optional `notifyOrder(input, orderNumber)` on `ProcessDeps`; `processOrder` calls it **only**
  after `create_order()` succeeds, awaited inside a `try/catch` so the order outcome is fixed before the
  email is attempted (`D-Z.01-5`). `actions.ts` supplies the closure: `resolveOrderLines()` does one bounded
  (4s abort), best-effort `service_role` SELECT (`variants` embed `products.name_mk/name_en/slug`) to name
  the lines, degrading to quantity-only on failure (`D-Z.01-6`); then `sendOrderNotification`.
- **Customer confirmation** (Task 5): `Order.success` extended in **both** locales to state the order number,
  the 48h reservation, **COD**, and **"we'll call you to confirm"** (`D-Z.01-7`). No new message key — MK/EN
  key sets stay identical. No customer email is collected (`D-Z.01-1`).
- **Tests**: `tests/email/order-notification.test.ts` (Resend **mocked**, no DB) proves: one email to the
  right recipient from `onboarding@resend.dev` with the right fields; a thrown Resend error and a missing
  env var both degrade silently (no throw); **no PII in any log line**; and the null-line fallback fabricates
  nothing. `tests/orders/process-order.test.ts` (+4) proves notify fires exactly once after success, never on
  failure/empty, and a throwing notify still returns success. **56 pass** incl. the re-run oversell gate.
- **Dep**: `resend 6.17.2` — the only new dependency; no new `npm audit` advisory. **No migration,
  `create_order`, `expire_reservations`, component, route, or existing test changed.**

### Deploy + hosted Supabase + real keys (1.07 Code) — the store left the laptop

- **Live**: `https://trajanov-v2.vercel.app`, Vercel Hobby, project `trajanov-v2`, `main` =
  production. Deployed from the phase branch via CLI **before** the PR merged (`D-1.07-5`) — Turnstile
  will not accept preview hostnames (`D-1.07-6`), so production is the only place it can be proven.
- **Hosted DB**: Frankfurt `eu-central-1`, ref `kmuocwmevyyuhcvwoebf`, **Postgres 17.6** (= local
  major). **8/8 migrations pushed**; local and remote lists match; no migration edited to force it.
  `config.toml`'s `major_version = 17` agreed with hosted — no mismatch warning.
- **New migration** `20260716120000_catalog_grant_hardening.sql` (`D-1.07-14`) — the phase's one code
  change. REVOKEs `insert/update/delete/truncate` on `drops`/`products`/`variants` from
  `anon`/`authenticated`/`public`; re-asserts `grant select`. Idempotent; `db reset` reproduces it.
  **No function, table shape, component, string, or test changed.**
- **pg_cron on hosted**: `create extension if not exists pg_cron` **worked straight from the
  migration** — no dashboard step. 2 active jobs (`expire-reservations` `*/5 * * * *`,
  `prune-cron-run-details` `17 3 * * *`) in the `postgres` database. **Named risk: a PAUSED free-tier
  project silently pauses pg_cron, and reservations then stop expiring** (register #4).
- **Parity method** (`D-1.07-4`): ran the **real** suite against Frankfurt while empty, then reset.
  `seed.sql` applied for the run against its own "never on a deployed database" header (`D-1.07-13`)
  — the only way to reach the fixtures; erased by the reset, which was **verified**, not assumed.
  All four hosted vars exported together, not just `SUPABASE_DB_URL` (`D-1.07-10`) — exporting only
  the DB URL would have run the RLS suites against **local** and reported a **false** 46/46.
- **Connection**: the **session pooler** (`aws-0-eu-central-1.pooler.supabase.com:5432`), not the
  direct host (`D-1.07-11`). Direct is **IPv6-only** and this machine has **no IPv6** — `dns.resolve6`
  finds the AAAA, `getaddrinfo` refuses it, so every tool fails `ENOTFOUND`. Session mode keeps
  prepared statements (transaction mode on 6543 would have forced a test-helper edit). **The app never
  uses `SUPABASE_DB_URL`** — it is admin/test only (`D-1.03-12`), so nothing in production depends on
  this.
- **RLS on hosted, real anon key** (Task 6, `D-1.07-3`): `orders`/`order_items` deny **select, insert,
  update** — all `42501`. Catalog **readable, not writable** (verified against ground truth: stock
  5→5, row counts unchanged). `create_order`/`expire_reservations`/`check_order_rate_limit`
  **`anon=false, authenticated=false, service_role=true`** — **identical to local**.
- **Types**: `gen types --linked` schema content is identical to committed (6 tables, 4 functions,
  2 enums), and committed matches `--local` **byte-for-byte** (sha256 equal). `--linked` adds a
  cloud-only `__InternalSupabase { PostgrestVersion: "14.5" }` block that `--local` never emits — so
  the DoD's "byte-identical to `--linked`" is **unmeetable as worded**, for a non-schema reason.
  `src/types/database.ts` left untouched, as the brief instructs.
- **Rehearsal drop**: `npm run sync:drop` → 1 drop, 4 products, **16 variants INSERT-only, 0
  overwritten, 0 deleted** (`D-1.04-5`). `test-drop` is **ended + null-priced** (`D-1.04-12`) — the
  site renders the ended state, nothing is buyable, **0 orders** on production.
- **Turnstile proven end to end**: deployed `/checkout` carries `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy
  key in 961 KB of deployed JS + HTML**; no `service_role`/secret/pepper/connection-string in the
  client payload. A widget on the production hostname **solved in Managed mode** and its **real token
  + the real secret** returned Siteverify **`success: true, hostname: trajanov-v2.vercel.app`**
  (wrong-secret control: `invalid-input-secret`).
- **Credentials**: hosted values live in gitignored **`.env.hosted`** (`D-1.07-9`), NOT in
  `.env.local` — pointing `.env.local` at Frankfurt would aim `npm run dev`/`test`/`sync:drop` at
  **production** by default. Verified: exported vars beat `process.loadEnvFile`, so both coexist.

### Cart flow (1.06) — the customer's choice reaches the order row

- **Pure cart** `src/lib/cart/cart.ts` — React-free reducer: `addItem`/`setItemQty`/`removeItem`/
  `toOrderItems` + `MAX_UNITS_PER_ORDER = 2` (total units, mirrors `create_order()` step 3, `D-1.06-6`).
  Node-testable; never touches the DB.
- **Cart store** `src/components/cart/cart-store.ts` — a module-singleton external store via
  `useSyncExternalStore`, **sessionStorage**-backed (`D-1.06-5`): survives refresh + in-session
  navigation, dies with the tab. Null server snapshot → a clean `hydrated` flag, no hydration flash, no
  setState-in-effect. No new dependency.
- **Add to cart** `src/components/product/AddToCartPanel.tsx` — owns the selected variant; wires
  `SizePicker` (available/selected/unavailable) + `BuyButton` (six states). Size required before Add
  (`Product.chooseSize`), sold-out sizes unselectable, cap enforced, inline `aria-live` feedback
  ("Added. — View cart"), header cart badge left unwired (header out of scope, `D-1.06-10`).
- **Wiring**: `SizePicker` (controllable) + `BuyButton` (real `onClick`) wired without breaking the
  styleguide; `CartView` reads the store (steppers/cap/empty); `catalog/[slug]` passes
  `variantId`/`dropSlug`; `cart`/`checkout` pages read real state; `CheckoutForm` submits
  `variant_id`+`qty` only.
- **Stand-in deleted**: `getActiveOrderContext`/`CheckoutContext` removed from `src/lib/drop/state.ts`
  (now exposes `variantId` on `SizeOption` + `dropSlug` on the product view, `D-1.06-7`); grep clean.
- **Empty-cart guard**: `processOrder` rejects `items: []` with `"empty"` before `create_order()`
  (`D-1.06-8`), plus the client's own empty checkout state.
- **Tests**: `tests/cart/cart.test.ts` (pure reducer) + `tests/orders/checkout-items.test.ts` (chosen
  variant → order_items, two items, cap client+server, TR004 sellout) + empty-cart case in
  `process-order.test.ts`. `seed.sql` gained `test-tee-two` (`D-1.06-9`). **46 pass; the phase test
  confirmed to fail against the stand-in (RED captured), then pass against the cart.**
- **Strings**: `Buy.added`, `Buy.viewCart`, `Order.emptyCart` in both catalogs (**130 keys each,
  identical**). Humanizer pass run.

### About + Contact (1.05) — static editorial pages

- **About** `src/app/[locale]/about/page.tsx` — **static** (`setRequestLocale`, no `force-dynamic`).
  Eyebrow → H1 → 3 body paragraphs (brand, competition, prize) → pull-quote → coverage list → link to
  `/catalog`. Every claim traced to `facts.md` §1/§2/§3/§4/§7. Quote renders in MK (original) and EN
  (marked translation, `D-1.05-6`). Coverage = all five outlets as links, dates via the next-intl
  formatter, **no count/adjective** (`D-1.05-5`, `D-1.05-11`). Press URLs copied character-exact from
  `facts.md` §4 (Cultural Chat's Cyrillic path keeps its stripped `fbclid`); all five verified live
  (HTTP 200) and confirmed as the competition article.
- **Contact** `src/app/[locale]/contact/page.tsx` — **static**. Phone (`078 820 520` →
  `tel:+38978820520`, ≥44px tap target), Instagram (`@trajanovv2026`, ≥44px), email
  `[PLACEHOLDER]` via the `<Placeholder>` component. Context line (Strumica · ships NMK only · COD).
  **No form, no address.**
- **`src/lib/social.ts`** gained `PHONE_DISPLAY` + `PHONE_TEL` (`D-1.05-9`) — single source for the
  phone, imported by the footer + Contact, never retyped.
- **`SiteFooter.tsx`** — About + Contact links (locale-aware `Link`), phone imported from `social.ts`,
  location now translated via `Nav.location` (`D-1.05-10`). Header untouched (`D-1.05-7`).
- **`HomeExperience.tsx`** — one quiet About link in the **countdown** and **ended** states; **none** in
  live/opening (verified in-browser).
- **Strings**: new `About` + `Contact` namespaces and `Nav.about/contact/location`, `Placeholder.email`
  in **both** catalogs — **identical key sets (126 each), verified**. Humanizer pass run.
- Rendered in-browser at 390px + 1180px, both locales (Task 8). `completions/_TEMPLATE.md` filename
  corrected to `Part-X-Phase-YY-Completion.md`.

### Drop engine (1.04) — server-driven, local only

- **Typed drop config** (`src/config/`, `D-0-4`): `schema.ts` (strict types + runtime validators +
  `LOW_STOCK_THRESHOLD`/`DEFAULT_RATE_LIMIT`), `time.ts` (DST-aware Europe/Skopje wall-clock → UTC,
  `D-1.04-4`), `drops.ts` + `products.ts` + `index.ts`. One committed **ended, null-priced** `test-drop`
  rehearsal (`D-1.04-12`).
- **Config→DB sync** (`scripts/`, `npm run sync:drop`): idempotent; **stock written INSERT-only**
  (`D-1.04-5`); refuses to publish an open/future drop with a null price, or to change a started drop's
  price; never deletes a row with `order_items`; direct-Postgres admin tool, not runtime (`D-1.04-11`).
- **Server drop state** (`src/lib/drop/state.ts`, server-only): countdown/live/ended computed from the
  DB; product mapping to the card shape; a dev-only `?preview` override (`D-1.04-13`). Routes
  `force-dynamic` (`D-1.04-9`); countdown anchored to server time; T-0 re-validates (`router.refresh`).
- **Migrations** (4): `price_mkd`/`name_*` nullable + CHECK; `create_order` `TR006` before decrement;
  `drops.rate_limit_per_window` + `order_attempts` + `check_order_rate_limit()`; `pg_cron` (sweep 5-min
  + nightly prune). `db reset` builds a working schedule from scratch (`select * from cron.job` = 2).
- **Order path** (`src/lib/orders/`): `placeOrder` Server Action → `verifyTurnstile` (Siteverify) →
  IP rate limit → `create_order`. `process-order.ts` is the testable core; `phone.ts` normalises MK
  numbers to `+389########`.
- **Turnstile** (`src/lib/turnstile/`, `src/components/checkout/Turnstile.tsx`): real widget, token
  minted at submit, dummy keys until 1.07 (`D-1.04-8/17`).
- **IP rate limit** (`src/lib/rate-limit/`): peppered SHA-256 in Node, only the hash in the DB
  (`D-1.04-7/14`).
- **UI wired to real data** (same components/handover): home/catalog/product/checkout. `demo.ts` +
  `TurnstilePlaceholder` deleted; IG constants moved to `src/lib/social.ts`.
- **Strings**: MK + EN for every `TR001`–`TR006`, rate-limit, Turnstile, and the "opening" state;
  humanizer pass run (`TR004` reads "someone got there first", `TR006` is honest self-guard copy).
- **Tests**: `npm test` → **31 pass** (13 prior + 18 new): DST resolver, sync no-reset/idempotent/
  refusals, `TR006` no-decrement, rate limit 20/21 + hash-not-IP, Turnstile-gates-create_order, cron
  jobs present, and the re-run 10-vs-3 oversell gate.

### Data layer (1.03) — Supabase, local only

- **Schema** (`supabase/migrations/`): `drops`, `products`, `variants` (stock per size, `stock >= 0`
  backstop), `orders` (enum `order_status`, `TRJ-####` sequence, phone `^\+389\d{8}$` — `TODO(2.02)`,
  partial unique index for one-live-order-per-phone-per-drop, expiry-sweep index), `order_items`
  (qty 1–2, `unit_price_mkd` **price snapshot**). Every table commented.
- **`create_order()`** — the only path that creates an order. Atomic conditional decrement, sorted by
  `variant_id`, drop-window + cap + duplicate-phone enforcement. Distinct error codes `TR001`–`TR005`
  on `error.code` (`src/lib/orders/order-errors.ts`); `D-1.03-11`.
- **`expire_reservations()`** — releases lapsed holds, returns stock exactly once, concurrency-safe
  (`FOR UPDATE SKIP LOCKED` + conditional claim). Ships now; **scheduling is 1.04** (`D-1.03-6`).
- **RLS + grants**: catalog read-only public; `orders`/`order_items` deny-all; functions
  `service_role`-only (`SECURITY DEFINER`, execute revoked from `PUBLIC`; `D-1.03-9`).
- **Typed clients**: `src/lib/supabase/client.ts` (anon), `server.ts` (service-role + `server-only`),
  generated `src/types/database.ts` (`npm run gen:types`).
- **Tests** (`npm test`, Vitest): 13 pass — oversell gate, expiry (incl. concurrent double-return),
  anon RLS wall, drop window + full error vocabulary.

### Design tokens
- **`brand.md` filled** (source of truth) and mirrored into `src/app/globals.css`: full dark palette
  (ground/surface/surface-2, foreground/muted, mustard + hover + on-mustard, accent red + on-accent,
  live, soldout, error, border/border-strong, focus-ring, mustard tints), type scale, radius, shadow,
  motion. **Every colour pair computed against WCAG 2.2 AA — all pass** (`brand.md` §3 ledger).
- **Fonts:** Rubik (display) + Inter (body), OFL, self-hosted via `next/font` with the `cyrillic`
  subset; MK glyphs verified at display size in-browser.

### Pages (MK default `/`, EN `/en/`)
- **Home** `/[locale]` — hero countdown (loudest object; <1h + <1min thresholds + zero→LIVE) that
  switches to the LIVE drop grid; a preview switcher mirrors the handover's demo buttons.
- **Catalog** `/catalog` — 4-piece grid incl. a sold-out card.
- **Product** `/catalog/[slug]` — buy path above the fold, detail below.
- **Cart** `/cart` — shown at the 2-unit cap (disabled `+`, cap notice); remove to reach empty state.
- **Checkout** `/checkout` — one screen, fields + error validation, Turnstile-resolving gate, COD.
- **Styleguide** `/styleguide` — component-state strip + colour/type reference (review aid).

### Components (all handover states)
- `drop/` — Countdown, DropBanner (live/ended/countdown-eyebrow), StockBadge.
- `product/` — ProductCard, BuyButton (6 states), SizePicker.
- `cart/` — CartView (steppers, cap, empty). `checkout/` — CheckoutField, TurnstilePlaceholder,
  CheckoutForm. `layout/` — SiteHeader, SiteFooter, LanguageSwitch. `system/` — Placeholder,
  PhotoSlot, PreviewNotice. `home/` — HomeExperience. (`components/ui/` still shadcn-reserved, empty.)

### Integrations wired
- **next-intl** — MK default (`/`), EN (`/en/`), `localePrefix: as-needed`; message catalogs
  expanded for all UI strings (full extraction/hreflang still 2.01).
- **shadcn/ui** — config + `cn()` only; brand components hand-authored (`D-1.02-6`). No `ui/` yet.

| Integration | Status |
|---|---|
| Supabase | **HOSTED + MIGRATIONS PUSHED + PARITY PROVEN** (1.07 Code) — Frankfurt `eu-central-1`, ref `kmuocwmevyyuhcvwoebf`, **Postgres 17.6**. 8/8 migrations; local == remote. **46/46 tests pass against hosted**, incl. the 10-vs-3 oversell gate; pg_cron = **2 active jobs**; RLS verified with the real anon key; DB left **clean, TRJ-0001**. `test-drop` published (ended, null-priced). **Owed #4 CLOSED.** Legacy keys (`D-1.07-1`) confirmed in use. Admin access via the **session pooler** (`D-1.07-11`, IPv6). ⚠ **"Auto-expose new tables" is still ON** — future tables land anon-writable (`D-1.07-14`); ⚠ **`db reset --linked` is broken here** (`D-1.07-15`). |
| Resend | **BUILT (Z.01).** SDK `resend 6.17.2`; server-side best-effort order-notification sender in `src/lib/email/order-notification.ts`, fired after `create_order()` succeeds (`D-Z.01-5`), never affecting the order (Plan §8). From `onboarding@resend.dev` (`D-Z.01-2`); recipient in `ORDER_NOTIFICATION_EMAIL`, not published on Contact (`D-Z.01-3`). Unit-tested with **Resend mocked**. ✅ **Real inbox delivery VERIFIED — 1.08 operator (2026-07-18, `D-1.08-4`):** prereqs live (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed); a real order (`TRJ-0001`) delivered the MK notification to Vladimir's inbox from `onboarding@resend.dev` with the correct order number / line / customer block / COD copy. Register #7 cleared. Branded from-address on `trajanov.com` still owed (#8 → 2.05, `D-Z.01-2`). |
| Turnstile | **REAL KEYS LIVE IN PRODUCTION** (1.07 Code) — "Trajanov store", **Managed** (`D-1.07-2`), hostnames `trajanov-v2.vercel.app` + `localhost` only (`D-1.07-6`). Deployed `/checkout` serves `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key anywhere in the deployed build** (`D-1.04-8` superseded). Widget **solves on the production hostname**; real token + real secret → Siteverify **`success: true`**. **Owed #5 CLEARED — 1.08 Code (2026-07-18):** the real secret also *rejects* a missing token (`missing-input-response`) and an invalid token (`invalid-input-response`), wrong-secret control → `invalid-input-secret`; `orders=0`, no stock change. Server-side enforcement proven both directions (`D-1.07-7`, `D-1.08-3`). |
| Cloudflare DNS | Not configured (2.05) |
| Cloudflare Analytics | Not configured (2.05) |
| Vercel project | **DEPLOYED** (1.07 Code) — `trajanov-v2`, Hobby, `main` = production, live at `https://trajanov-v2.vercel.app` serving both locales from the hosted DB. 6 env vars in effect. ⚠ All six are **Sensitive = write-only**: `vercel env pull` returns them **empty** (`D-1.07-12`). ⚠ Stray **`trajanov`** project still exists — one repo, two projects (Lazar). |

---

## Owed-verification register

Things claimed done that only Lazar (or a real device / real account) can confirm. **At 3+ items,
or before any phase that builds on unverified work, the next phase is a verification phase.**
**Must be empty before Part 2 — hard gate at 1.08.**

| # | Item | Owed since | Phase that verifies |
|---|---|---|---|
| ~~1~~ | **Design direction sign-off** — **CLEARED — 1.08 operator (2026-07-18).** Lazar reviewed the live site (`/`, `/about`, `/contact`, `/catalog`, product, `/cart`, `/checkout`) and **signed off on the tokens** (palette + fonts derived from the handover ledger, `D-1.02-1`). No changes requested. | 1.02 | **CLEARED — Lazar review of the live site** |
| ~~2~~ | **IG profile URL click-test** — **CLEARED — 1.08 operator (2026-07-18).** A human clicked `@trajanovv2026` and confirmed it opens **Vladimir's actual profile** (`facts.md` §6). The handle was already VERIFIED and the link renders correctly (footer, drop-ended banner, Contact). | 1.02 | **CLEARED — Lazar click-test** |
| ~~4~~ | ~~**Hosted-Supabase parity**~~ — **CLOSED by 1.07 Code, with evidence.** 8/8 migrations pushed to `kmuocwmevyyuhcvwoebf`; `migration list` shows local == remote, **no migration edited to force it**. **`npm test` against Frankfurt: 46/46**, incl. the **10-vs-3 oversell gate (exactly 3 succeed, 7 rejected, stock 0)** and both expiry tests. `cron.job` = **2 active rows**, extension created **by the migration, no dashboard step**. Rate-limit table + `check_order_rate_limit` present and exercised (20/21 test passed on hosted). RLS re-verified with the **real anon key**: `orders`/`order_items` deny select/insert/update (`42501`); functions `anon=false`, identical to local. Hosted then **reset and verified clean** (0 rows, TRJ-0001). **One real divergence was found and fixed, not waved through** (`D-1.07-14`). **Residual risk, NOT a verification debt — moved to Known issues #7:** a **paused free-tier project silently pauses pg_cron**, and reservations stop expiring. | 1.03/1.04 | **1.07 Code — DONE** |
| 5 | **Real Turnstile keys — NARROWED, still open** (`D-1.07-7`). **Proven in 1.07 Code:** the deployed `/checkout` serves the **real** site key `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key appears anywhere in the deployed build** (961 KB of JS + HTML scanned) — `D-1.04-8`'s "dummy keys until 1.07" is fully retired; the widget **renders and solves in Managed mode on `trajanov-v2.vercel.app`**, and a **real token + the real secret** returned Siteverify **`success: true, hostname: trajanov-v2.vercel.app`** (a wrong-secret control returned `invalid-input-secret`, so the pass is meaningful); Managed mode's silent auto-pass **matches** the local dummy-key behaviour (`D-1.07-2` confirmed). **STILL OWED:** whether Cloudflare actually **challenges a bot on a real order**. That needs a **live drop**, which 1.07 deliberately does not create (the only drop is `test-drop`, ended + null-priced, `D-1.04-12`). Also unexercisable on preview URLs at all (`D-1.07-6`). **CLEARED — 1.08 Code (2026-07-18):** against the deployed **real production secret**, Siteverify rejected a **missing** token (`missing-input-response`) and an **invalid** token (`invalid-input-response`), and a wrong-secret control returned `invalid-input-secret` — so the real gate genuinely validates; hosted `orders=0`, no stock change. Per the brief's Task 5 this is what closes #5 (the load-bearing server-side gate is proven; a browser-solved bot on a *real* order is exercised whenever the operator runs the runbook order). | 1.04 | **CLEARED — 1.08 Code** |
| ~~6~~ | **"Automatically expose new tables"** — **CLEARED — 1.08 operator (2026-07-18).** Lazar turned the toggle **OFF** on `kmuocwmevyyuhcvwoebf`. **Standing caveat (not a debt):** turning it off does **not** retroactively revoke, so any future migration that adds a table (e.g. `Y.01`'s photo/fabric work) must still pair it with an explicit `REVOKE` — carry this into that migration's DoD (`D-1.07-3/14`). | 1.07 | **CLEARED — Lazar (dashboard)** |
| ~~7~~ | **A real order sends a notification email that arrives in Vladimir's inbox** — **CLEARED — 1.08 operator (2026-07-18).** The Z.01 email prereqs were set up (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed), the rehearsal drop was opened, and **a real order (`TRJ-0001`) was placed end to end on a phone.** The MK notification **arrived in Vladimir's inbox** from `onboarding@resend.dev` — subject "Нова нарачка TRJ-0001 — Trajanov", listing the ordered line (`test-mustard-ochre — величина L — 1 бр.`), the full customer block (name/phone/city/address/notes), and the COD + call-to-confirm + "Supabase is the record" lines. DB side confirmed: order row, atomic decrement (3→2), 48h reservation. Order + reservation then deleted; hosted returned clean (`D-1.08-4`). | Z.01 | **CLEARED — 1.08 operator (real order + email)** |
| ~~8~~ | **Branded from-address — CLEARED 2026-07-22 (2.05 Code).** `ORDER_FROM_ADDRESS` is now `info@trajanovv.com` (`src/lib/email/order-notification.ts`); the domain is verified in Resend in the same account that holds `RESEND_API_KEY`, so a `from: info@trajanovv.com` delivers (`D-2.05-3`). Email unit tests (mocked Resend) assert the new from-address and pass. That a *real* order delivers from `info@` end to end is tracked as **new owed #16** (needs an open drop, 2.06). | Z.01 → | **CLEARED — 2.05 Code** |
| ~~9~~ | **Human legal review — CLEARED (operator, 2026-07-21).** A lawyer read Terms, Privacy, and Shipping & Returns; **no changes were reported.** Recorded at the 2.05 cutover on the operator's report; the pages are unchanged. | 2.03 | **CLEARED — operator (lawyer read, 2026-07-21)** |
| ~~10~~ | **MK legal copy native review — CLEARED (2.05 Code, stamped 2026-07-22).** Two native speakers (Lazar + Petar) reviewed all 63 new 2.03 `Terms`/`Privacy`/`ShippingReturns` (+ `Nav`/`Meta`/`Placeholder`) MK strings **plus `Common.skipToContent`** (the 2.04 skip link, `D-2.04-7`) — **passed, no changes**. `docs/i18n/mk-review-2.03.md` sign-off blocks are now filled (dated 2026-07-21). | 2.03 | **CLEARED — 2.05 Code (stamped)** |
| 11 | **OG paste-test — the real traffic path (Plan §10).** Lazar pastes the deployed **MK + EN Home and Product** URLs into an Instagram story/DM **and** Viber and confirms the branded card renders — image **and** title, Cyrillic intact on the MK card. Code proved the card serves at 1200×630 and renders native Cyrillic (screenshot), and that `og:image`/`twitter:image` are absolute on every route — but **only a human with those apps can confirm the actual in-app link preview**; a link-preview/OG-debugger check by Code is **not** a substitute. **2.04b adds the brand `logo`** to this check — the same paste should confirm the wordmark reads well where a platform shows the Organization logo, and Lazar should run the deployed Home URL through **Google's Rich Results Test** to see the `logo` resolve/preview. Verifies **after the 2.05 deploy** — the URLs to paste are now on **`https://www.trajanovv.com`** (`SITE_URL` flipped this phase). Owner: **Lazar**. | 2.04 / 2.04b / 2.05 | **after 2.05 deploy (real domain)** |
| 12 | **Lighthouse categories that could not reach 95 in-phase** (measured on `next start` + local seed DB, headless Chrome). **(a)** Mobile **Performance 94** on Catalog + Checkout (throttled-mobile SSR with a DB read; Desktop is 100, mobile Home/Product/Legal are 98/97/95). **(b)** Content-route **SEO 92 on localhost is a cross-origin `canonical` artifact** — Code verified **SEO 100 with the canonical audit passing on the real origin `https://trajanov-v2.vercel.app/en`**, so this should read 100 once 2.04 deploys; **(c)** Checkout **SEO 58** is the intentional `noindex` correctly failing the crawlable audit (not a defect). Lazar re-checks (a) + (b) on **PageSpeed Insights** against the live **`www.trajanovv.com`** deploy (2.05). Owner: **Lazar**. | 2.04 | **after 2.05 deploy (PageSpeed Insights, real domain)** |
| 13 | **Wordmark brand-direction sign-off** (`D-2.04b-1`). Code shipped a real typographic wordmark ("Trajanov" in Rubik 700 + brand colours) as `public/logo.svg` / `public/logo-512.png` and wired it into the Organization JSON-LD `logo`, **outside a Design phase**. It invents nothing (the brand's own name in the brand font) and is `D-0-6`-clean, but the *visual-brand call* is Lazar's/Design's. If a properly designed mark is wanted instead, regenerate via `npm run assets:brand` after editing `scripts/generate-brand-assets.ts` (or drop in a hand-made asset at the same paths) — one commit. Owner: **Lazar / Design**. | 2.04b | **2.05 shipped with the wordmark live — sign off anytime, before the first real drop** |
| 14 | **Register the IndexNow key in Bing Webmaster Tools** (`D-2.04b-6`). Key `78dec4b97e3fbb0f22d1c8df38050f74`, served at `${SITE_URL}/78dec4b97e3fbb0f22d1c8df38050f74.txt`. **Public by design, NOT a secret (`D-0-1`).** Ops-only, and only meaningful **after the real domain is live** (2.05) — the key file must resolve on the final host before Bing accepts it, and `pingIndexNow()` stays un-wired until a post-2.05 hook. **Now actionable — the domain is live and `SITE_URL` is flipped (2.05); the key file resolves on `https://www.trajanovv.com`.** Owner: **Lazar (ops)**. | 2.04b | **post-2.05 (domain live — now actionable)** |
| 15 | **Live Turnstile captcha renders + solves on the real-domain checkout.** The site key rotated to `0x4AAAAAAD6pSIvEa1p8GkZX` (new Managed widget, hostnames `trajanovv.com` + `www`, `D-2.05-4`); the server-side `verifyTurnstile` **does not assert hostname** (it checks `success` only), so no code gate depends on the host. But a real browser render + solve on `https://www.trajanovv.com/checkout` needs an **open drop** — deferred to the 2.06 rehearsal. **2.06 Code (2026-07-22): the runbook is ready** — `docs/ops/drop-rehearsal-runbook.md` step 2b (open drop via `docs/ops/rehearsal-sql/01-open-rehearsal-drop.sql`, solve the real Turnstile on `/naracka`, place one order). Still owed until Lazar + Vladimir run it. Owner: **Lazar / 2.06 rehearsal**. | 2.05 | **2.06 rehearsal (runbook ready; operator runs it)** |
| 16 | **A real order email delivers from `info@trajanovv.com` end to end.** `ORDER_FROM_ADDRESS` is now `info@trajanovv.com` and the domain is Resend-verified (`D-2.05-3`); unit tests (mocked Resend) assert the new from-address. That a live order's notification actually **arrives** in Vladimir's inbox `from: info@trajanovv.com` needs a real order → the 2.06 rehearsal. **2.06 Code (2026-07-22): the runbook is ready** — `docs/ops/drop-rehearsal-runbook.md` step 2d (confirm the email in Vladimir's inbox: subject "Нова нарачка TRJ-0001 — Trajanov", ordered line, customer block, COD copy) + step 0 pre-flight (test that `info@` routes to his inbox). Still owed until the operator runs it. Owner: **Lazar / 2.06 rehearsal**. | 2.05 | **2.06 rehearsal (runbook ready; operator runs it)** |
| 17 | **Footer redesign — Lazar design sign-off (2.07).** The footer was rebuilt to the two-zone design (contact/social columns + © row) **outside a Design phase**; the Instagram row uses the Lucide **`AtSign`** (`@`) icon because this `lucide-react` ships **no** brand Instagram glyph (`D-2.07-2`). Code verified structure, contrast (every pair passes WCAG 2.2 AA), tap targets (≥24px), MK+EN strings, and mobile stacking — but the **visual-brand call** (the redesign itself + the `@`-for-Instagram icon) is Lazar's/Design's. Eyeball the `https://www.trajanovv.com` footer (any page), **MK + EN, 375px + desktop**. If a real Instagram glyph is wanted, drop an SVG in and swap the `AtSign` import — one commit. Owner: **Lazar / Design**. | 2.07 | **after 2.07 deploy — sign off anytime before the first real drop** |
| 18 | **New MK footer strings — native review (2.07).** Three MK strings post-date the 2.02 native review and ship exactly as the 1.05 brief proposed them: `Footer.contact` „КОНТАКТ", `Footer.social` „СЛЕДИ", `Footer.rights` „© 2026 Трајанов. Сите права задржани." A native speaker (Lazar/Petar) confirms spelling / agreement / tone — same process as `docs/i18n/mk-review-2.03.md`. Owner: **Lazar / Petar**. | 2.07 | **before the first real drop (MK review pass)** |
| 19 | **New MK `Credit` strings — native review (2.08).** Two strings post-date the 2.02/2.03 reviews and render on **every** page: `Credit.builtBy` „Изработено од Vertex Consulting" (rich-text; only the company name is linked, and it stays untranslated) and `Credit.opensInNewTab` „се отвора во нов прозорец" (the visually-hidden new-tab announcement). Two native speakers read both **in context, in the browser**, and sign the review pack — same process as `docs/i18n/mk-review-2.03.md`. Owner: **Lazar + Petar**. | 2.08 | **before the first real drop (MK review pass)** |
| 20 | **Click-test `https://www.vertexconsulting.mk/en`** (`facts.md` § 11, marked VERIFIED — **must be click-tested before it ships**). The credit link opens a **working** page in a **new tab** from the **live** header, on a **phone and on desktop**, in **both locales**. Same rule as the Instagram URL in `facts.md` § 6 — a link to a page that does not resolve is a **broken fact on every page of the site**. Code confirmed the anchor is correct (`target="_blank" rel="noopener noreferrer"`, hidden new-tab text, mustard link) but **cannot confirm the destination resolves**. Owner: **Lazar**. | 2.08 | **before the first real drop (live click-test, both platforms + locales)** |
| 21 | **Client sign-off on the header build credit (2.08).** Vladimir (and his parents) confirm they are content for a **third-party company name + outbound link** (Vertex Consulting → an off-site page) to sit in the **top nav of the store on every page** — client-facing and prominent (`D-2.08-2`). Easy to move to the footer later if they'd rather: one component edit. Owner: **Lazar → Vladimir**. | 2.08 | **before the first real drop (client confirms placement)** |

*Code verified directly (not owed) in 1.06 — carried forward; the 1.07 Cowork half is ops-only and
verified no code directly: `npm run build`, `npx tsc --noEmit`, `npm run lint`,
`npm test` (**46**) all green, incl. the re-run 10-vs-3 oversell gate; the phase test was confirmed to
**fail against the stand-in** (RED captured) before the stand-in was deleted; `/catalog`,
`/catalog/[slug]`, `/cart`, `/checkout` rendered in-browser at 390px + 1180px, both locales, against
the 1.02 handover; the cart writes to **no** DB table and reserves no stock (verified by reading — no
cart code path touches `variants`/`orders`/`order_items`); the stand-in grep returns nothing; no
`supabase/migrations/` file and neither `create_order` nor `expire_reservations` changed; no new
dependency (`package.json` unchanged). (Prior direct-verified items carry forward unchanged.)*

*Code verified directly in **Z.01** (not owed): `npm run build`, `npx tsc --noEmit`, `npm run lint`, and
`npm test` (**56** — 46 + 6 email + 4 notify) all green, incl. the re-run 10-vs-3 oversell gate; the email
sender's best-effort guarantees (sends once on success with the right recipient/fields; a thrown Resend
error, a Resend error object, and a missing env var all leave the order successful; **no PII in any log
line**) are proven by unit tests against a **mocked** Resend — the real API is never called; the diff was
grepped clean of any email literal, key, or PII, and `.env.local`/`.env.hosted` remain gitignored; no
`supabase/migrations/` file, `create_order`, `expire_reservations`, component, or route changed; the only
new dependency is `resend 6.17.2`.*

*Code verified directly in **1.08** (not owed): local `npm run build`, `npx tsc --noEmit`, `npm run lint`, and
`npm test` (**56**) all green; and **against the live Frankfurt DB**: the full suite **56/56** incl. the
**10-vs-3 oversell gate** (exactly 3 succeed, 7 `insufficient_stock`, stock 0), **live pg_cron expiry** (a
backdated hold expired by the scheduled `*/5` job at the 10:00:00 cycle — `cron.job_run_details` succeeded,
"1 row" — stock returned; **2 active cron jobs**), **Turnstile enforcement with the real production secret**
(missing→`missing-input-response`, invalid→`invalid-input-response`, wrong-secret control→`invalid-input-secret`;
`orders=0`, no stock change), and **rate limits** (IP `check_order_rate_limit` max=5 → 5 allowed / 6th–7th
rejected; phone `create_order` → 2nd same-phone `TR005`). All hosted writes were seed/test fixtures, removed
after; hosted left at `orders=0`, only the ended `test-drop`, **2 cron jobs**, `order_number_seq` reset to
**TRJ-0001**. No `supabase/migrations/` file, `create_order`, `expire_reservations`, component, or route
changed; the only source changes are `facts.md` §7, `src/config/products.ts`, `src/config/drops.ts` (comment),
plus state/decision/report docs. **Then verified by the operator, same session (`D-1.08-4`):** the Z.01 email
prereqs were set up, the rehearsal drop was opened, a **real phone order (`TRJ-0001`)** was placed, the **MK
notification email arrived in Vladimir's inbox**, and the order + reservation were deleted (hosted re-verified
clean); the **design sign-off**, **IG click-test**, and **auto-expose toggle OFF** were all done by Lazar. The
hosted `test-drop` is left **ended** and carrying the two real-priced colourways (`test-mustard-ochre`
S/M/L/XL, `test-off-white` XL-only, 1199 MKD, stock 3) — matching the committed config, nothing buyable.*

*Code verified directly in **2.04b** (not owed): `npm run build`, `npx tsc --noEmit`, `npm run lint`, and
`npm test` (**85/85**) all green, incl. the re-run **10-vs-3 oversell gate** (exactly 3 succeed, 7 rejected,
stock 0). Against the dev server (curl + in-browser): `/llms.txt` returns `200` with `content-type:
text/plain; charset=utf-8` + `x-robots-tag: noindex`, a valid `# H1`/`>`-blockquote/link-section body,
facts.md-clean claims only, and both-locale **absolute** URLs whose slugs match the sitemap
(`/katalog`·`/za-nas`·`/kontakt`·`/uslovi`·`/privatnost`·`/isporaka-i-vrakjanje` + `/en/*`); the IndexNow
key file returns the **bare 32-byte key**; `/logo-512.png` `200 image/png`, `/icon.svg` `image/svg+xml`,
`/apple-icon.png` + `/icon-{192,512}.png` `image/png`; the MK homepage HTML carries
`"logo":"https://trajanov-v2.vercel.app/logo-512.png"` in the Organization JSON-LD (still no address / no
SearchAction / `sameAs` = the one IG) and the `manifest`/`icon`/`apple-touch-icon` `<link>`s in `<head>`;
`/manifest.webmanifest` is valid JSON (name/short_name/lang mk/start_url/display standalone/brand colours/
icons); **`sitemap.xml` contains 0 `llms.txt` occurrences** and still lists 7 routes × 2 locales + the seed
DB products. Home + About rendered with **no console errors**; the `logo.svg` embedded-font wordmark and the
`logo-512.png`/`icon-512.png` marks were eyeballed. The only non-doc source changes are the four new SEO/
asset files + the shared `routes.ts`, the `site-jsonld.ts` `logo` line (+ its test), `sitemap.ts` refactor,
`manifest.ts`, `indexnow.ts`, the generator script, `package.json` (`assets:brand` script only), and the
generated binary assets. **No `supabase/`, `create_order`, `expire_reservations`, cart, stock, `src/config/`,
`src/types/database.ts`, or npm dependency touched; `SITE_URL` unchanged.**

***2.03 update (2026-07-19): the register is NO LONGER EMPTY.*** Phase 2.03 added rows **#9** (the legal
pages have had no human legal review) and **#10** (the new MK legal copy is unreviewed by a native
speaker). Neither is a build blocker; **both are 2.05-cutover blockers**, owned jointly by Lazar +
Vladimir (#9) and Lazar + Petar (#10). This is expected — the phase brief said this register "is why it
stops being empty." The 1.08 note below stands as the historical record of how the **Part 2 hard gate**
(register-to-zero before Part 2) was met; that gate is unaffected — it fired before 2.01 and passed.

*After **1.08 (Code + operator, 2026-07-18) the register's zero-condition was MET — the register was EMPTY.**
Cleared/moved this session: **#5 CLEARED** (Code — real-secret Siteverify enforcement); **#1** design sign-off,
**#2** IG click-test, **#6** auto-expose toggle OFF, and **#7** real-order-delivers-email-to-Vladimir's-inbox
all **CLEARED by the operator** (`D-1.08-4`, evidence in each row above); **#8 RECLASSIFIED to the 2.05 cutover
track** (`D-1.08-2`); **#4 remains CLOSED** (1.07, struck above). Item #3 (fresh-session review of PR `#4`) was
removed at the PR-#4 merge; the old #6 (review of PR `#6`, `D-1.06-2`) was **WAIVED** (`D-1.06-11`). **1.08 was
the hard gate before Part 2, and it has now PASSED — nothing sits in front of 2.01.** The only operator items
still open are **recommended housekeeping** (L1–L4, L7), which are explicitly **not** part of the gate's
zero-condition.*

**Owed to Lazar / the operator — dashboard + password-manager jobs only he can do:**

| # | Item | What "pass" looks like |
|---|---|---|
| L1 | **Delete the stray Stockholm Supabase project.** **Confirmed still live this phase**: ref `ewcqwbuvbbfduytiiaxy`, region `eu-north-1`, name "petarjakimov11012011-cell's Project", status ACTIVE_HEALTHY, empty. | Only `kmuocwmevyyuhcvwoebf` (Frankfurt) remains in the Supabase account |
| L2 | **Review/remove the stray `trajanov` Vercel project.** Confirmed still present alongside `trajanov-v2`. | Exactly one Vercel project points at this repo, so one push cannot trigger two deployments |
| L3 | **SAVE THE NEW DB PASSWORD — CHANGED THIS PHASE (`D-1.07-12`).** The password manager's entry is **stale and wrong**: the DB password was **reset** at the operator's instruction. The new value exists **only** in gitignored `.env.hosted` on Petar's machine. **Unrecoverable if that file is lost** (another reset would be needed). Also confirm `ORDER_IP_HASH_PEPPER` is saved — the **Vercel** value must never change or every rate-limit window resets (`D-1.04-7`). | Both retrievable from the password manager, and the DB password matches `.env.hosted` |
| L4 | **Revoke the Supabase access token `claude-code-phase-1.07`** (Account → Access Tokens; expires 2026-08-15). It controls the **whole Supabase account** and was only needed for `link`/`db push`/`gen types --linked`. | Token no longer listed |
| ~~L5~~ | **DONE (2026-07-18).** Lazar turned OFF "Automatically expose new tables" on `kmuocwmevyyuhcvwoebf` (register #6 cleared). Standing caveat: does not retroactively revoke — pair with an explicit REVOKE in any migration that adds a table. | ✅ Toggle off |
| ~~L6~~ | **DONE (2026-07-18).** Register #1 (design sign-off) and #2 (Instagram click-test) both cleared by Lazar against the live site. | ✅ Both confirmed |
| L7 | **Uptime monitor** — a paused free-tier project silently pauses pg_cron and takes the store offline (Known issues #7). Not set up this phase (out of scope). | A monitor hits the URL ≥ every 5 min, alerting two inboxes |

---

## Placeholder register

Every visible `[PLACEHOLDER: …]` on the site. **Cutover (2.05) proceeded with #2/#3/#4/#7 still open —
Lazar's explicit override (`D-2.05-2`).** The zero-condition is **re-pointed to the first REAL drop
(2.06 gate)**, not cutover: nothing is buyable on day one, so the consumer-protection exposure the rule
prevents is not triggered by cutover alone — it IS the moment a drop opens. **The register must reach
zero before the first real drop.**

*Y.02 update (2026-07-22): **+3 rows — #8, #9, #10 — all for Product 03 (baby blue).** The new catalog
stub (`D-Y.02-1`) ships with the SAME visible placeholders as the two existing colourways: a photo slot
(#8), a fabric/care slot (#9), and the neutral name slot (#10). These are **not new placeholder strings** —
Product 03 reuses the exact shared keys the generic rows #2/#3/#4 already cover (`Placeholder.productPhoto`
/ `Placeholder.composition` / the `Placeholder.productName` neutral slot); the new rows make **baby blue's
own** owed photo + fabric + name explicit, so the "register to zero before the first REAL drop" gate counts
three products' worth of owed content, not two. **Cleared / reworded / hid none** — #2–#7 are
byte-unchanged. Product 03's price (1999 MKD) and sizes (S/M/L/XL) are VERIFIED and render as real facts, so
they are **not** placeholders.*

*2.06 update (2026-07-22): **no change to the register.** The Code half of 2.06 shipped only ops docs +
SQL helpers under `docs/ops/` — no new placeholder, and #2/#3/#4/#7 are byte-unchanged. The rehearsal runs
against the existing `test-drop` (placeholder names, no photos) and does **not** fill any product
placeholder; the register must still reach **zero before the first REAL drop** (`Y.01` content), which the
rehearsal is explicitly **not**.*

*2.05 update (2026-07-22): **#5 CLEARED, #6 NARROWED.** The contact email `info@trajanovv.com` is now
published on Contact in both locales (a real `mailto:`, `EMAIL` in `src/lib/social.ts`; `Placeholder.email`
removed) — **#5 struck**. Delivery **time** is now VERIFIED (3–5 business days, `facts.md` §7) and renders
on Shipping & Returns, so **#6 narrowed** to courier + delivery cost (dropped „време"/"time"). #2/#3/#4/#7
remain open; cutover shipped with them open per `D-2.05-2` (see the header note).*

*2.04b update (2026-07-22): **no change to the register.** Phase 2.04b shipped **no new placeholder** and
**cleared, reworded, hid, or filled none** — #2–#7 are byte-for-byte unchanged. The load-bearing rule
carried over from 2.04 holds: **no placeholder value reaches `llms.txt`, the logo, or the manifest.**
`llms.txt` writes only facts.md-VERIFIED claims (no product name/price/photo/fabric slot appears — it
links the catalog page, not individual products), the manifest description is a facts-clean one-liner, and
the marks are pure brand typography. The still-null product **names** (#4) never surface in any 2.04b file.*

*2.04 update (2026-07-20): **no change to the register.** Phase 2.04 shipped **no new placeholder** and
**cleared, reworded, hid, or filled none** — #2–#7 are byte-for-byte unchanged. The load-bearing rule
for this phase: **no placeholder value reaches any JSON-LD or OG image.** The Product JSON-LD emits **no
node** while product names are placeholders (#4) — proven both by unit test (null name → null) and by
grep across the rendered pages — and the OG card falls back to a neutral brand title rather than baking
the neutral slot ("Производ NN"). (Note: this phase's font-size fix bumped the `PhotoSlot` placeholder
label from 11.2px to 12px for legibility — the placeholder **text is unchanged**, only its size.)*

*2.03 update (2026-07-19): **+2 rows** — #6 (courier / delivery time / delivery cost) and #7
(returns/exchange window), both on the new Shipping & Returns page, owner Vladimir. 2.03 **cleared,
reworded, or hid no existing placeholder** (#2–#5 are byte-for-byte unchanged); it added two honest
`[PLACEHOLDER: …]` markers rather than guessing a delivery cost or a returns window.*

*2.01 shipped **no new placeholder** and **cleared/reworded/hid none** — the existing rows below are
unchanged. The placeholder strings themselves (`Placeholder.*`) were already in the catalogs; 2.01 only
confirmed they are translated in both locales.*

| # | Placeholder | Page | Waiting on | Owner |
|---|---|---|---|---|
| ~~1~~ | ~~`[PLACEHOLDER: цена MKD]` (product price)~~ | ~~Catalog cards, Product, Cart, Checkout~~ | **CLEARED 2026-07-18** — a real price now exists: **1199 MKD** VERIFIED (`facts.md` §7), set in `src/config/products.ts`, and **synced to hosted** (the rehearsal `test-drop` products carry 1199 MKD). When the drop was briefly opened for the gate's real order, the checkout/cart/confirmation rendered **1199 ден** (no placeholder, no USD). Each *future* drop still needs its own real price, but that is per-drop, not a standing placeholder. | — |
| 2 | `[PLACEHOLDER: фотографија — Владимир]` (product photo) | Catalog cards, Product | Real product photos (`D-0-6`) | Vladimir |
| 3 | `[PLACEHOLDER: состав и нега — од етикетата]` (fabric/care) | Product | Composition from the labels | Vladimir |
| 4 | Product **names** render as neutral slots ("Производ 01…") — **NARROWED to names-only 2026-07-18**: sizes are now **real** (S/M/L/XL, off-white XL-only, VERIFIED `facts.md` §7), no longer a flagged sample. Per-size **measurements** (cm/fit chart) are still owed. | Catalog, Product | Real product **names** + a size-**measurement** chart | Vladimir |
| ~~5~~ | ~~`[PLACEHOLDER: е-пошта — Владимир]` (contact email)~~ | ~~Contact~~ | **CLEARED 2026-07-22 (2.05).** `info@trajanovv.com` is now published on Contact in both locales (a real `mailto:`, `EMAIL` constant in `src/lib/social.ts`); the `Placeholder.email` key was removed from both catalogs. VERIFIED for public display (Lazar/Vladimir, 2026-07-21, `facts.md` §5). It is a **domain** address (Cloudflare Email Routing → Vladimir's inbox), **not** his personal email — so the `D-Z.01-3` concern (publishing a minor's personal address) does not apply. | — |
| 6 | `[PLACEHOLDER: курир и цена на испорака — Владимир]` (courier + delivery cost) | **Shipping & Returns** (`/isporaka-i-vrakjanje`, `/en/shipping-returns`) | **NARROWED 2026-07-22 (2.05):** delivery **time** is now VERIFIED (3–5 business days, `facts.md` §7) and shows on the page, so this placeholder dropped „време"/"time" — only **courier + delivery cost** remain, neither in `facts.md`. Deliberately **not** estimated: on cash-on-delivery a wrong delivery cost is money asked for at the door on a promise nobody made (`D-2.03` Task 5) | Vladimir |
| 7 | `[PLACEHOLDER: рок за враќање и замена — Владимир]` (returns/exchange window) | **Shipping & Returns** | The returns/exchange **window** — not in `facts.md`; **no statutory withdrawal period is cited** (Decision 5). A real number comes from Vladimir | Vladimir |
| 8 | `[PLACEHOLDER: фотографија — Владимир]` — **Product 03 (baby blue)** photo | Catalog card, Product (`/katalog/test-baby-blue`, `/en/catalog/test-baby-blue`) | A **real baby-blue product photo** (`D-0-6`, `D-Y.02-1`) — no stand-in, no generated image, no other shirt's photo. Same shared key as #2, scoped to the new colourway | Vladimir |
| 9 | `[PLACEHOLDER: состав и нега — од етикетата]` — **Product 03 (baby blue)** fabric/care | Product | Composition + care **read off baby blue's label** — never guessed (`D-Y.02-1`). Same shared key as #3, scoped to the new colourway | Vladimir |
| 10 | Product 03 **name** renders as the neutral slot "Производ 03" / "Product 03" | Catalog, Product | The **real customer-facing name** for baby blue — no invented name (`D-Y.02-1`). Same neutral-slot mechanism as #4, scoped to the new colourway | Vladimir |

*#5 (email) was a pure UI placeholder via `<Placeholder>` (`Placeholder.email` key), shipped by 1.05
(`D-1.05-3`) and held pending Vladimir's OK to publish a contact email (`D-Z.01-3`). **That sign-off came
(Lazar/Vladimir, 2026-07-21), and 2.05 published `info@trajanovv.com` on Contact** — a **domain** address
(Cloudflare Email Routing → Vladimir), not his personal inbox — so #5 is **cleared** and `Placeholder.email`
is removed from the catalogs. **Every remaining placeholder below is publicly visible on
`https://www.trajanovv.com`.**
#1–#4 are now driven by the **DB via the typed drop config** (not `demo.ts`, deleted): a null
`price_mkd`/`name_*` renders the price/name placeholder (`D-1.04-6/10`); photo + fabric/care have **no
DB column yet** — those columns land with **`Y.01 — Drop content load`** (`D-1.06-3`), not 1.06 — and
render as pure UI placeholders. The price (#1) and neutral-name (#4) placeholders also surface on the
new **Cart** rows (existing placeholders, no new one shipped by 1.06). When
Vladimir supplies real prices/names, filling `src/config/products.ts` + `npm run sync:drop` clears #1
and #4 (for a drop). Sizes for a real drop come from config (the rehearsal's are a flagged sample).
**The register must be empty before the first REAL drop opens (2.06 gate), not before cutover — cutover
shipped with #2/#3/#4/#7 open per `D-2.05-2`.***

**Already known to be coming** (from `facts.md`, will become entries the moment the relevant page
is built):

- Real prices in MKD → Product pages
- Sizes / measurements → Product pages
- Fabric composition + care → Product pages
- Product photos → Catalog, Product

*Resolved this phase: **Vladimir's email** is now a live register row (#5). The **press links** are no
longer "coming" — all five are VERIFIED (`facts.md` §4, 2026-07-15) and cited on About as links, with
no placeholder (`D-1.05-5`).*

---

## Carryovers

- **`Z.01 — Order email (Resend)` is DONE on the code side** (this update; `D-1.07-8` satisfied). The
  sender is built and unit-tested against a mocked Resend; the order path fires it best-effort after
  `create_order()`. **What remains is real-world only, and it is owed to 1.08** (register #7): the operator
  prereqs (Resend account under Vladimir's email, API key, the two Vercel env vars) plus a live, priced
  drop and a real order, to prove an email actually lands in Vladimir's inbox. **This session had no
  independent confirmation that the operator prereqs are done** — the wiring + mocked tests are valid
  either way, and real delivery is (as designed) a 1.08 concern.
- **1.08 also needs a live drop.** Owed #5's remainder (does Cloudflare challenge a real bot), Z.01's
  register #7 (a real order emails Vladimir), and 1.08's own "one real order" DoD all require an **open,
  priced** drop. The only committed drop is `test-drop` — ended and null-priced (`D-1.04-12`) — and creating
  a live one is out of scope here. Prices/names come from Vladimir via `Y.01`.
- Prior: `D-1.04-16` (no real product→cart→checkout item flow) is **closed by Phase 1.06**: the
  cart flow is built, the stand-in is deleted, and an automated test proves the customer's chosen
  product+variant reaches the `order_items` row.

---

## Known issues / accepted risks

| # | Item | Ref | State |
|---|---|---|---|
| 1 | **Vercel Hobby ToS violation.** Commercial use prohibited; Vercel may pull the deployment without notice, explicitly including during traffic spikes — i.e. drop day. Accepted by Lazar. **Now materially live: 1.07 deployed the store to Hobby, and 2.05 put it on its real public domain `www.trajanovv.com` — the drop-day takedown risk is fully live.** | `D-0-2` | Live. Mitigations: portability rule (**re-verified 1.07: nothing Vercel-specific added; no Postgres/Blob/KV; the only Vercel artifacts are the gitignored `.vercel/` link dir**), the X.01 Pro migration, the 2.06 contingency — **the contingency plan is now WRITTEN (`docs/ops/drop-day-contingency.md`, 2.06 Code); the X.01 *brief* is flagged not-yet-written (`D-2.06-2`) — author `briefs/Part-X-Phase-01-*.md` before the first real drop.** |
| 2 | **No automated PR review.** House review gate waived for this project. Risk concentrated on 1.03/1.04 concurrency code. | `D-0-3` | Live. Mitigations: cross-review, fresh-session review on 1.03/1.04, concurrent-order test. |
| 3 | **Public repo.** One committed secret is scraped before you notice. | `D-0-1` | Live. Mitigation: hard rule in `CLAUDE.md`. Rotate, never just delete. |
| 4 | **Legal responsibility unconfirmed.** Minor, no registered entity, collecting consumer PII. 2.03 shipped Terms + Privacy naming **Vladimir alone** (`D-2.03-1`) and the pages have had **no legal review** (owed #9) — the underlying legal exposure is unchanged and still owed. | `facts.md` § 1 · `D-2.03-1` | **Cutover blocker.** Owner: Vladimir + parents. |
| 5 | **Product photos do not exist.** | `D-0-6` | **Blocks 1.06.** Owner: Vladimir. Critical path. |
| 6 | **Bar photos: model + venue permission unconfirmed**, and age-appropriateness of an alcohol backdrop for a 12+ audience is an open owner call. | `facts.md` § 8 | **No longer blocks 1.05** — `D-1.05-4` shipped Home + About with **no photo and no photo slot**. Still blocks any future photo hero / lifestyle imagery. Owner: Vladimir. |
| 7 | **A paused free-tier Supabase project silently pauses pg_cron.** Free projects pause after ~7 quiet days — and this store is quiet between drops **by design**. Paused cron means `expire_reservations` stops running, so lapsed 48h holds never return their stock: **the shirt is sold to nobody, forever.** Moved here from register #4 (it is a standing risk, not a verification debt — the schedule itself is proven live on hosted). | `D-1.04-2/3` · register #4 · `D-1.07-4` | **Live and unmitigated.** No uptime monitor exists (owed: L7). Real fix is Supabase Pro ($25/mo) — a decision and a phase, never a silent upgrade. |
| 8 | **`supabase db reset --linked` wipes the hosted database and cannot rebuild it.** It drops tables/types but not sequences, then fails its own re-apply on `order_number_seq already exists`. Recovered by hand this phase (`drop sequence` → `db push --include-all`) — harmless only because the DB was deliberately empty. | `D-1.07-15` | **Live.** **Never run against a database with real orders — the free tier has no backup.** |
| 9 | **The six Vercel env vars are marked Sensitive = write-only.** `vercel env pull` returns all six as empty strings, so no one can recover a credential from Vercel. The DB password and pepper are **unrecoverable if the password manager and `.env.hosted` are both lost**. | `D-1.07-12` · Cowork report §3.4 | **Live.** Cowork's "cosmetic only, no functional impact" is true for the deployed build, false for anyone working locally. Mitigation: L3. |
| ~~10~~ | **Live domain ≠ `SITE_URL` ≠ `facts.md` — RESOLVED 2026-07-22 (2.05 Code).** 2.05 flipped `SITE_URL` → **`https://www.trajanovv.com`** (`D-2.05-6`; the canonical 200-serving host — apex + vercel.app both 308→www), so every emitted absolute URL — canonical, hreflang, JSON-LD `@id`/`logo`, sitemap, OG images, llms.txt links, IndexNow host — now points at the non-redirecting host. `facts.md` §9 reconciled (spelling `trajanovv.com` + status **VERIFIED — PURCHASED**). The **grep gate is GREEN** — zero `trajanov-v2.vercel.app` and zero single-v `trajanov.com` in any emitted URL/canonical/OG/schema. | `SITE_URL` (`src/lib/site.ts`) · `facts.md` §9 · line 1 | **RESOLVED — 2.05 Code.** Takes effect on the merge-triggered redeploy; registering the IndexNow key in Bing stays owed (#14, ops). |

---

## Parallel track

Canonical table with gates: `Trajanov-V2-Plan.md` § 13. Status only:

| Task | Owner | Status |
|---|---|---|
| Buy the domain | Lazar / Petar | **⚠️ DONE, but as `trajanovv.com` (double-v), NOT `trajanov.com` (single-v).** Live + attached to Vercel (`www.trajanovv.com`; the vercel.app URL 308-redirects to it), Petar-confirmed his 2026-07-22. **`facts.md` §9 still says single-v "not purchased" — STALE.** 2.05 must flip `SITE_URL` to `https://www.trajanovv.com` + reconcile `facts.md` §9. See Known issues #10. |
| **Product photos** | **Vladimir** | **Not started — critical path** |
| Vladimir's email | Lazar → Vladimir | **DONE (2026-07-18).** Address VERIFIED (`facts.md` §5); Z.01 code shipped against it; the operator prereqs are now **live** (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed) and a real order (`TRJ-0001`) **delivered the MK notification to his inbox** (register #7 cleared, `D-1.08-4`). Still **not** published on Contact (`D-Z.01-3`, placeholder #5). |
| Real prices (MKD) | Vladimir | **This drop: 1199 MKD VERIFIED (2026-07-18)** — recorded in `facts.md` §7 + `src/config/products.ts`. Each future drop still needs its own price. |
| Sizes + fabric (read the labels) | Vladimir | **Sizes VERIFIED (2026-07-18):** S/M/L/XL, off-white XL-only (`facts.md` §7). **Still owed:** fabric/composition/care (from the labels) + a per-size measurement chart. |
| Legal responsibility w/ parents | Vladimir | **Still owed (cutover blocker).** 2.03 shipped Terms + Privacy naming **Vladimir Trajanov, Струмица, alone** as the responsible party (`D-2.03-1`, Lazar's call), with the `facts.md` §1 open flag kept — but no parent has confirmed legal responsibility and **no lawyer has read the pages** (new owed-verification row #9). |
| Model + venue permission | Vladimir | Not started |
| Verify press links | Lazar | **Done** — all 5 fetched, read, VERIFIED 2026-07-15 (`facts.md` §4); cited on About (`D-1.05-5`) |
| First drop date + products | Vladimir | Not started |
| MK copy review | Lazar + Petar | **150 strings DONE (2.02); +63 new legal strings OWED (2.03).** 2.02 was a clean pass on the original 150 (`docs/i18n/mk-review-2.02.md`, both signed). 2.03 added 63 new MK strings (Terms/Privacy/ShippingReturns + Nav/Meta/Placeholder) that **no native speaker has read** — pack **unsigned** at `docs/i18n/mk-review-2.03.md` (owed-verification row #10), verifies before 2.05 cutover. |

---

## Update rules

On closing every phase, Code must:

1. Rewrite **line 1** — `NEXT: <phase id> — <name>`
2. Update Last updated + By
3. Move completed work into **Built**
4. Add every owed item to the **owed-verification register**
5. Add every `[PLACEHOLDER: …]` shipped to the **placeholder register**
6. Record carryovers and new issues
7. Update the parallel-track status if anything landed

**Never delete a register row because it feels resolved. Remove it only when it is verified, and
say so in the completion report.**
