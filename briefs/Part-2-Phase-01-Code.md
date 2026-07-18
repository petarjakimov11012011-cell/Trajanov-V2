# Part 2 · Phase 01 · Code — Bilingual

**Why this matters —** the store already serves two languages, but only halfway: the URLs are English
in both, some strings are still baked into components, and Google has no way to know the MK and EN
pages are the same page in two languages. This phase finishes the job, so a Macedonian customer gets a
Macedonian site down to the address bar, an English-speaking visitor is told *before* ordering that we
only ship inside North Macedonia, and search engines index one store rather than two half-duplicates.
It is also the phase that hands Phase 2.02 something reviewable: a complete list of every MK string
and every URL, so two native speakers can read the whole site in an afternoon.

---

## Context

### What already exists

- **Phase 1.08 — the verification gate — PASSED IN FULL (2026-07-18).** The owed-verification register
  is **empty**. A real order (`TRJ-0001`) was placed on a phone against the live Frankfurt database and
  its MK notification email arrived in Vladimir's inbox. Part 2 is open; nothing sits in front of 2.01.
- **The store is live** at `https://trajanov-v2.vercel.app` (Vercel Hobby, `main` = production),
  running against hosted Supabase `kmuocwmevyyuhcvwoebf` (Frankfurt, Postgres 17.6) with real
  Turnstile keys and a working Resend side channel. The only drop is `test-drop`: **ended and not
  buyable**. Hosted is clean — `orders = 0`, `order_number_seq` at `TRJ-0001`.
- **next-intl `4.13.2` is already installed and wired** (`D-1.01-2`): `src/i18n/routing.ts`,
  `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/proxy.ts`, and `src/messages/{mk,en}.json`
  with **identical key sets** (130 keys each as of 1.06, plus the Z.01 `Order.success` copy edit).
  Routing today is `locales: ['mk','en']`, `defaultLocale: 'mk'`, `localePrefix: 'as-needed'` — so MK
  serves at `/` and EN at `/en/`. **There is no `pathnames` config: the route slugs are English in
  both locales** (`D-1.02-4` deferred that here, and the comment in `routing.ts` says so).
- **Pages that exist** (all under `src/app/[locale]/`): home, `about`, `contact`, `catalog`,
  `catalog/[slug]`, `cart`, `checkout`, `styleguide`. `about` and `contact` are static
  (`setRequestLocale`); the rest are `force-dynamic` (`D-1.04-9`).
- **56 tests pass** (`npm test`, Vitest, against the local Supabase stack), including the
  10-vs-3 concurrent-order gate.

### Read first, by path

| Path | Why |
|---|---|
| `CLAUDE.md` | Standing repo rules — secrets, branches, content truth, UI. Non-negotiable. |
| `src/_project-state/current-state.md` | Live status. Line 1 is `NEXT:`. Read before touching anything. |
| `src/_project-state/file-map.md` | What lives where. Read before creating a file. |
| `src/_project-state/00_stack-and-config.md` | Pinned versions + env var names. Read before adding any dependency. |
| `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/proxy.ts` | The next-intl surface this phase changes. |
| `src/messages/mk.json`, `src/messages/en.json` | The catalogs. MK is the source language; EN mirrors its key set exactly. |
| `docs/design-handovers/Part-1-Phase-02-Handover.md` | The UI spec. The shipping notice must fit it, not fight it. |
| `brand.md` | Tokens. Never hardcode a colour, size, or spacing value. |
| `facts.md` | The **only** legal source for any factual claim, including the shipping statement. |
| `Decisions.md` | Why the project is like this; also where your `D-2.01-n` entries go. |
| `src/_project-state/completions/_TEMPLATE.md` | The completion-report shape. |

---

## Decisions already made — build to these, do not re-open

These were resolved by the orchestrator before this brief was written. **Log each one in
`Decisions.md` as a `D-2.01-n` entry naming the alternative rejected and the downside accepted**, per
`CLAUDE.md`.

1. **MK route slugs are Latin transliteration, not Cyrillic** — decided by Lazar. `/katalog`,
   `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`. *Alternative rejected:* Cyrillic slugs
   (`/каталог`, `/кошничка`). *Downside accepted:* a Macedonian reader sees transliterated Latin in
   the address bar, which is less native than Cyrillic. *Reason:* links get shared in Viber and
   Instagram bios, where Cyrillic paths percent-encode into unreadable strings
   (`/каталог` → `/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3`) and some clients mangle them.
2. **Product-detail slugs stay single and shared across both locales** — `/katalog/[slug]` and
   `/en/catalog/[slug]` resolve the *same* product slug, which continues to come from
   `src/config/products.ts` / the DB. *Alternative rejected:* per-locale product slugs
   (`slug_mk`/`slug_en` columns). *Downside accepted:* an MK product URL carries a non-localised
   product token. *Reason:* real product names do not exist yet (placeholder register #4, owner
   Vladimir); adding per-locale slug columns now would be a migration built on invented content.
3. **Old paths redirect permanently, they do not 404** — `/catalog`, `/catalog/:slug`, `/cart`,
   `/checkout`, `/about`, `/contact` each `308` to their new MK slug. *Alternative rejected:* letting
   them 404 since the store has no traffic yet. *Downside accepted:* a small redirect table to carry
   forward. *Reason:* the site has been publicly reachable since 1.07 and links may already exist;
   a dead link on a store that sells three times a year is expensive.
4. **`/styleguide` is not localised** — it stays `/styleguide` and `/en/styleguide`. It is an
   internal review aid, not a customer surface.
5. **Slugs are provisional until 2.02 confirms them.** Phase 2.02 has native speakers confirm the
   slugs. If one changes there, it is a one-line change in `routing.ts` plus one more redirect —
   build the redirect table so that adding a row is trivial.

---

## Scope

**In scope**

- Localised route slugs via next-intl `pathnames`, and every internal link/redirect moved onto the
  typed locale-aware navigation helpers.
- A complete user-facing string extraction sweep: no user-visible literal left in a component, a
  page, a metadata block, an `aria-label`, an `alt`, a `placeholder`, or a server-returned message.
- Localised page metadata (`<title>`, description) per locale.
- `hreflang` + self-referencing canonical alternates on every page, including `x-default`.
- The MK-only shipping statement on the **product page** and the **checkout page**, in both locales.
- Locale-correct formatting (price, dates, numbers) through next-intl formatters.
- The language switch preserving the current page across the slug change.
- Permanent redirects from the old English MK paths.
- Tests: MK/EN catalog parity, pathname coverage, and the existing suite staying green.
- A string inventory document + a script that regenerates it, for the 2.02 reviewers.

**Out of scope — do not touch**

- `supabase/migrations/`, `create_order()`, `expire_reservations()`, `check_order_rate_limit()`,
  stock, reservations, rate limiting, Turnstile, the Resend sender. **No schema change, no
  `npm run sync:drop`, no write of any kind to the hosted database.**
- Legal pages (Terms / Privacy / Shipping & Returns) — **2.03**.
- Lighthouse work, WCAG audit, JSON-LD / Product schema, `sitemap.xml`, `robots.txt`, OG images —
  **2.04**. Only `hreflang` + canonical land here, because they are routing facts.
- Domain, DNS, Cloudflare, analytics, the branded email from-address — **2.05**.
- Product names, photos, fabric/care, measurements — **Y.01**, owner Vladimir. **Do not clear,
  reword, or hide a single placeholder register row.**
- Rewriting existing MK copy for style. Phase 2.02 is the copy review. Fix mechanical faults only
  (a missing string, an untranslated string, a wrong key). New copy you write here gets a
  `humanizer` pass; existing copy stays as-is.
- **No new npm dependency.** next-intl is already installed. If you believe you need one, stop and
  say so in the report instead.
- No new component unless the shipping notice genuinely needs one, and no visual redesign.

---

## Tasks

### 1. Localise the route slugs

Add `pathnames` to `src/i18n/routing.ts` with exactly this table, keeping
`localePrefix: 'as-needed'` and `defaultLocale: 'mk'`:

| Page | MK | EN |
|---|---|---|
| Home | `/` | `/en` |
| Catalog | `/katalog` | `/en/catalog` |
| Product | `/katalog/[slug]` | `/en/catalog/[slug]` |
| Cart | `/kosnicka` | `/en/cart` |
| Checkout | `/naracka` | `/en/checkout` |
| About | `/za-nas` | `/en/about` |
| Contact | `/kontakt` | `/en/contact` |
| Styleguide | `/styleguide` | `/en/styleguide` |

Do not rename the folders under `src/app/[locale]/` — `pathnames` maps public slugs onto the
existing internal routes. Confirm `src/proxy.ts` picks the config up unchanged (it consumes
`routing`); if it needs an edit, make the smallest one that works and say so in the report.

### 2. Move every internal link onto the typed navigation helpers

`src/i18n/navigation.ts` exports the locale-aware `Link`, `redirect`, `usePathname`, `useRouter`,
`getPathname`. Grep `src/app` and `src/components` for imports from `next/link` and `next/navigation`
and convert every one that produces a user-facing route. Internal hrefs must be written as the
**internal** pathname (`/catalog`, `/catalog/[slug]`) and let next-intl emit the localised one — never
hand-write `/katalog` in a component. External links (Instagram, press URLs, `tel:`) are unaffected.

### 3. Redirect the old paths

Add permanent (`308`) redirects in `next.config.ts`:

`/catalog → /katalog` · `/catalog/:slug → /katalog/:slug` · `/cart → /kosnicka` ·
`/checkout → /naracka` · `/about → /za-nas` · `/contact → /kontakt`

`/en/*` paths must be untouched by these rules. Keep the table in one obvious place with a comment
saying a slug change in `routing.ts` needs a matching row here.

### 4. Extract every remaining user-facing string

Sweep `src/app/[locale]/**`, `src/components/**`, and any user-facing message returned from
`src/lib/**` for literals a customer can see or a screen reader can read: JSX text, `aria-label`,
`aria-live` content, `alt`, `placeholder`, `title`, button labels, form validation text, error
copy, and empty/loading states. Move each into `src/messages/mk.json` + `src/messages/en.json` under
the existing namespace conventions.

MK is the source language. EN is a translation of it, not a paraphrase. **Never ship an English
string into the MK build.** A handful of literals are legitimately untranslated — the brand name
`Trajanov`, the Instagram handle, the phone number, and the About pull-quote's MK original
(`D-1.05-6`). List every one of those in the inventory (Task 10) under "intentionally not
translated" so 2.02's reviewers do not report them as bugs.

### 5. Localise page metadata

Every route gets a per-locale `<title>` and description via `generateMetadata` +
`getTranslations`, under a `Meta` namespace in the catalogs. No metadata string stays hardcoded in
`layout.tsx` or any page. Verify `<html lang>` renders `mk` on MK pages and `en` on EN pages.

### 6. hreflang + canonical

Add a single origin constant in `src/lib/site.ts` — `SITE_URL = 'https://trajanov-v2.vercel.app'`
with a `TODO(2.05): trajanov.com` comment. **Do not read it from a Vercel-provided variable** (the
portability rule in `00_stack-and-config.md` — nothing Vercel-specific, ever) and do not introduce a
new env var.

Every page emits, via Next's `alternates` metadata built with next-intl's `getPathname`:

- `canonical` — the page's own absolute URL in its own locale
- `languages.mk` — the MK absolute URL for the same page
- `languages.en` — the EN absolute URL for the same page
- `languages['x-default']` — the **MK** URL

Both directions must be present and reciprocal: the EN page points at the MK page and vice versa.

### 7. State MK-only shipping where it changes a decision

The site ships **within North Macedonia only** (already stated in the 1.05 Contact context line —
trace the claim to its `facts.md` entry and, if it is not marked VERIFIED there, ship a
`[PLACEHOLDER: …]` and a register row instead of writing it, per `CLAUDE.md`).

Render that statement in **both** locales in **two** new places, using one shared message key:

1. **The product page** — near the buy panel, visible without scrolling past the Add-to-cart control.
2. **The checkout page** — near the address fields / COD block, before the submit button.

The EN wording must be unambiguous that we do not deliver outside North Macedonia — a foreign
visitor placing a cash-on-delivery order to an address nobody can reach is a real, cheap-to-prevent
failure, and the footer alone has not been preventing it. Style it from `brand.md` tokens, consistent
with the existing notice/COD copy in the 1.02 handover. `humanizer` pass on the new copy, both
languages.

### 8. Locale-correct formatting

Audit every rendered number and date. Prices go through `src/lib/format.ts` — make `formatMkd()`
locale-aware so MK renders MK-conventional currency output and EN renders the EN convention for the
same MKD amount (no currency conversion, ever — the price is MKD in both). Dates and relative times
go through next-intl's formatter, never a hardcoded `toLocaleDateString('mk-MK')`. Countdown digits
stay as they are.

### 9. Language switch keeps you on the same page

`src/components/layout/LanguageSwitch.tsx` must switch locale **in place**: `/katalog/majica-01` →
`/en/catalog/majica-01`, `/naracka` → `/en/checkout`, and back. Query strings and the dev `?preview`
parameter survive. It must not bounce the customer to the home page — a customer mid-checkout who
taps EN should still be mid-checkout.

### 10. String inventory for Phase 2.02

Add `scripts/i18n-inventory.ts` and an `npm run i18n:inventory` script that reads both catalogs and
writes `docs/i18n/string-inventory.md` containing, for every key: the key, the MK value, the EN
value, and the page(s)/component(s) where it renders. Include two extra sections: **"intentionally
not translated"** (Task 4) and **"MK and EN values are byte-identical"** (a flag list for human
eyes, not an error). Commit the generated file — 2.02 reads it.

Also list, in the completion report, **every URL in both locales** (`/`, `/katalog`, one product
URL, `/kosnicka`, `/naracka`, `/za-nas`, `/kontakt`, and each `/en/` equivalent) so the 2.02
reviewers can walk the site without reconstructing it.

### 11. Tests

Add to `tests/i18n/`:

- **Catalog parity** — MK and EN key sets are identical, no key has an empty value, no key exists in
  one file only. This must fail if someone adds a key to one catalog and forgets the other.
- **Pathname coverage** — every route folder under `src/app/[locale]/` has a `pathnames` entry, and
  every `pathnames` entry resolves in both locales. This must fail when a new page is added without
  a slug.

Then run the **full** suite. The local Supabase stack must be up (Colima) for the DB suites. All 56
existing tests stay green, including the 10-vs-3 oversell gate — nothing in this phase should be able
to touch it, and the run is the proof.

### 12. See it before you close it

**No UI phase closes sight-unseen** (`CLAUDE.md`). Render every page in a browser, in **both**
locales, at **390px and 1180px**, against the 1.02 handover and `brand.md`. Check the new shipping
notice, the language switch, and that nothing shifted. If you cannot render them, put the exact URLs
and a 5-item checklist in the report for Lazar instead of asserting.

### 13. Close the phase

Per `CLAUDE.md` state duties: rewrite line 1 of `current-state.md` (`NEXT: 2.02 — Native MK review`),
update Last updated + By, move this work into **Built**, update both registers (do not delete a row
because it feels resolved), sync `file-map.md` with what is actually on disk, append to
`00_stack-and-config.md` only if config changed (no new dependency is expected), append your
`D-2.01-n` entries to `Decisions.md`, and file the completion report.

---

## Definition of Done

Every line below is provably true or false. This list becomes the completion report's checklist.

**Routing**

- [ ] `src/i18n/routing.ts` carries a `pathnames` map matching the Task 1 table exactly.
- [ ] All eight MK URLs return `200`: `/`, `/katalog`, `/katalog/<a real product slug>`, `/kosnicka`,
      `/naracka`, `/za-nas`, `/kontakt`, `/styleguide`.
- [ ] All eight `/en/` equivalents return `200`.
- [ ] Each old path returns `308` to its new MK slug: `/catalog`, `/catalog/:slug`, `/cart`,
      `/checkout`, `/about`, `/contact` — verified with the actual response status and `Location` header.
- [ ] `/en/catalog`, `/en/cart`, `/en/checkout`, `/en/about`, `/en/contact` still return `200` and are
      **not** caught by any redirect.
- [ ] `grep -rn "from 'next/link'" src/app src/components` and the equivalent for `next/navigation`
      return no user-facing route (result pasted in the report).
- [ ] No component contains a hand-written localised slug (`/katalog`, `/kosnicka`, `/naracka`,
      `/za-nas`, `/kontakt`) — grep clean outside `routing.ts` and `next.config.ts`.

**Strings**

- [ ] `src/messages/mk.json` and `src/messages/en.json` have **identical key sets**; the new parity
      test proves it and fails when a key is removed from one file.
- [ ] The string-extraction sweep is documented in the report: every literal found, and for each,
      moved-to-key or listed as intentionally untranslated.
- [ ] Every `/en/` page fetched as HTML contains **no Cyrillic** except the About pull-quote's MK
      original (`D-1.05-6`), the Instagram handle, and the phone number.
- [ ] Every page's `<title>` and description differ between locales and come from the catalogs.
- [ ] `<html lang="mk">` on MK pages, `<html lang="en">` on EN pages.

**hreflang**

- [ ] Every page of both locales emits `hreflang="mk"`, `hreflang="en"`, and `hreflang="x-default"`
      (pointing at MK), plus a self-referencing `canonical`, all as absolute URLs on `SITE_URL`.
- [ ] The alternates are reciprocal — the MK product page points at the EN product page for the
      **same** product, and back. Verified on at least the home, catalog, product, and checkout pages.
- [ ] `src/lib/site.ts` is the only place the origin appears, and carries the `TODO(2.05)` comment.

**Shipping statement**

- [ ] The MK-only shipping statement renders on the **product page** and on **checkout**, in **both**
      locales, from one shared message key, traced to a VERIFIED `facts.md` entry (quoted in the report).
- [ ] It is visible without scrolling past the Add-to-cart control on the product page, and above the
      submit button on checkout, at 390px — confirmed in-browser, both locales.

**Behaviour**

- [ ] The language switch preserves the page: `/katalog/<slug>` ↔ `/en/catalog/<slug>`, `/naracka` ↔
      `/en/checkout`, `/za-nas` ↔ `/en/about`, and the `?preview` parameter survives. Checked by hand.
- [ ] Prices render in MKD in both locales with locale-correct formatting, and no currency conversion
      exists anywhere in the codebase.

**Quality gates**

- [ ] `npm run build` · `npm run lint` · `npx tsc --noEmit` all clean.
- [ ] `npm test` green: the 56 existing tests plus the new i18n tests (total stated in the report),
      including the 10-vs-3 concurrent-order gate.
- [ ] The catalog-parity test was confirmed to **fail** when a key is deliberately removed from
      `en.json`, then restored — the RED captured in the report. A test that has never failed proves nothing.
- [ ] `package.json` gains no runtime dependency (the `i18n:inventory` script may be added).
- [ ] `git diff` touches **no** file under `supabase/migrations/`, and neither `create_order` nor
      `expire_reservations` changed. Stated explicitly in the report.
- [ ] Nothing was written to the hosted database; `npm run sync:drop` was not run.
- [ ] No placeholder register row was cleared, reworded, or hidden.

**Review artifacts**

- [ ] `docs/i18n/string-inventory.md` is committed, regenerable via `npm run i18n:inventory`, and
      carries both extra sections.
- [ ] The report lists every URL in both locales for the 2.02 reviewers.
- [ ] Every page rendered in-browser in both locales at 390px and 1180px against the 1.02 handover
      (or exact URLs + a 5-item checklist handed to Lazar).

**Closing**

- [ ] `current-state.md` line 1 reads `NEXT: 2.02 — Native MK review`; Built, registers, Last
      updated/By all current.
- [ ] `file-map.md` matches what is actually on disk.
- [ ] Every on-the-fly decision logged in `Decisions.md` as `D-2.01-n`, each naming the alternative
      rejected and the downside accepted, and surfaced in the report — the orchestrator ratifies nothing silently.

---

## Working rules for this phase

- Branch **`phase-2.01-bilingual`**, cut from up-to-date `main`. **One phase branch at a time** — do
  not cut it if another phase branch is unmerged.
- One PR to `main`. No direct commits to `main`. `npm run build && npm run lint && npx tsc --noEmit`
  before you open it — a red build is not a PR.
- **Review gate:** the other operator reviews the PR (`D-0-3`). No fresh-session Claude Code review is
  required for this phase — that requirement applied to 1.03 and 1.04 only.
- **The repo is public (`D-0-1`).** No secret, key, phone number, address, or customer datum in any
  file, comment, test fixture, or log line — not once, not temporarily.
- All commands in **zsh**. Project path `/Users/petarjakimov/Projects/Trajanov-V2`.
- If a task here turns out to require a schema change, a new dependency, or an invented fact —
  **stop and report it**. Do not work around it.

---

## Outputs & where they go

| Output | Path |
|---|---|
| Code | `src/i18n/`, `src/app/[locale]/`, `src/components/`, `src/lib/{site,format}.ts`, `next.config.ts`, `src/messages/{mk,en}.json` |
| New tests | `tests/i18n/` |
| Inventory script | `scripts/i18n-inventory.ts` + `npm run i18n:inventory` |
| String inventory (committed) | `docs/i18n/string-inventory.md` |
| Decisions | `Decisions.md` — appended `D-2.01-n` |
| State | `src/_project-state/current-state.md`, `file-map.md` |
| Completion report | `src/_project-state/completions/Part-2-Phase-01-Completion.md` |
| Brief (this file) | `briefs/Part-2-Phase-01-Code.md` |

**What changes when this is done:** the MK store is Macedonian all the way down to its URLs, an
English visitor learns we ship only inside North Macedonia before they commit to a cash-on-delivery
order, search engines see one bilingual store, and Phase 2.02's reviewers can start reading the day
this merges.
