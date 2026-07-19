# Part 2 · Phase 03 · Code — Legal pages + full facts audit

**Why this matters —** a customer about to hand cash to a courier is entitled to know, before they
order, who they are buying from, what happens to their phone number and address, and what happens if
the shirt never arrives. This phase writes those three pages honestly, and then walks every other
claim already on the site back to a VERIFIED line in `facts.md` — so nothing on `trajanov.com` is
there because it sounded right.

---

## Context

### What already exists

- **The store is live and bilingual.** `https://trajanov-v2.vercel.app`, MK at `/`, EN at `/en/`,
  running against hosted Supabase (Frankfurt, `kmuocwmevyyuhcvwoebf`). Cash on delivery, North
  Macedonia only, 48h stock reservations, 2 units per order.
- **2.01 (bilingual)** localised the route slugs via next-intl `pathnames` in `src/i18n/routing.ts`,
  with matching 308 redirects in `next.config.ts`. Every user-facing string lives in
  `src/messages/{mk,en}.json` — **150 keys, identical key sets in both files**.
- **2.02 (native MK review)** put all 150 MK strings and all 8 URLs in front of two native speakers.
  Clean pass, no string changed, all six MK slugs confirmed Keep (`D-2.02-3`).
- **Owed-verification register is EMPTY. Placeholder register carries rows #2, #3, #4, #5.**

### Read first, by path

1. `briefs/Part-2-Phase-03-Code.md` — this file.
2. `src/_project-state/current-state.md` — live state, both registers. **Read before touching
   anything.** Line 1 is the `NEXT:` line.
3. `facts.md` — the only legal source for every factual claim. Read it in full; this phase audits it.
4. `CLAUDE.md` — repo standing rules (secrets, branches, content truth, stock).
5. `brand.md` — design tokens. Never hardcode a colour or a size.
6. `docs/design-handovers/Part-1-Phase-02-Handover.md` — the approved visual direction. These are
   editorial pages; build them from the **same** patterns as `/about` and `/contact` (1.05).
7. `src/app/[locale]/about/page.tsx` and `contact/page.tsx` — the existing static-editorial pattern
   (`setRequestLocale`, no `force-dynamic`, SSG per locale). Copy that shape.
8. `src/i18n/routing.ts`, `next.config.ts` — routing and redirects, kept in lockstep.
9. `docs/i18n/string-inventory.md` — the 150-key inventory (`npm run i18n:inventory` regenerates it).
10. `Decisions.md` — append-only, IDs `D-2.03-n`.

---

## Decisions already made — do not re-open these

### 1. The responsible party is **Vladimir Trajanov alone**. No parent is named. (`D-2.03-1`)

The site names **Vladimir Trajanov, Струмица, Северна Македонија** as the responsible party on both
Terms and Privacy. **No parent or guardian name appears anywhere.** No `[PLACEHOLDER]` is created for
this. Log as `D-2.03-1`, naming Lazar as the decider, with alternatives rejected and downside accepted
stated plainly. `facts.md` §1 must be **amended, not contradicted**; keep the §1 open flag. Add one
owed-verification row: legal pages have had no human legal review (owner Lazar + Vladimir, verifies at
2.05 cutover).

### 2. Routes and slugs

| Internal route | MK path | EN path |
|---|---|---|
| `/terms` | `/uslovi` | `/en/terms` |
| `/privacy` | `/privatnost` | `/en/privacy` |
| `/shipping-returns` | `/isporaka-i-vrakjanje` | `/en/shipping-returns` |

MK slugs use the same Latin transliteration as the six existing slugs. **No 308 redirects** — new paths.

### 3. Three message namespaces, plus nav keys

`Terms`, `Privacy`, `ShippingReturns` in both catalogs, plus `Nav.terms/privacy/shipping`, plus `Meta`
entries for all three. Key sets stay identical.

### 4. No cookie banner

Do not add a consent banner, a cookie policy, or a "we use cookies" line. The Privacy page states plainly
what is and is not stored in the browser.

### 5. Cite no statute, invent no right

Do not cite a law, article number, directive, or statutory withdrawal period. Write what the store
**actually does** — operational commitments traceable to `facts.md` or to shipped code.

---

## Scope

**In:** the three pages; footer links; `routing.ts` `pathnames` + metadata + hreflang/canonical; the full
`facts.md` audit doc; the `facts.md` §1 amendment; an MK review appendix; tests, state, decisions,
completion report.

**Out (do not touch):** `supabase/migrations/`, `create_order`, `expire_reservations`, hosted DB,
`sync:drop`; the cart, drop engine, order path, `src/config/`; any existing page's layout/design;
performance/Lighthouse/schema/sitemap/robots (2.04); domain/OG/from-address (2.05); product
photos/prices/names/fabric (Y.01); any new npm dependency; clearing/rewording/removing any existing
`[PLACEHOLDER: …]`.

---

## Tasks (summary)

1. Branch `phase-2.03-legal-facts` from up-to-date `main` (PR #11 merged first).
2. `docs/legal/facts-audit-2.03.md` — walk every rendered string; status per row (VERIFIED / PLACEHOLDER
   / NOT A CLAIM / UNSOURCED); resolve every UNSOURCED; report counts. Do this **before** writing pages.
3. `/terms` — Terms of Sale.
4. `/privacy` — Privacy (fields match the shipped `orders` schema; no email; one-way IP hash; Frankfurt).
5. `/shipping-returns` — reuse `Common.shippingNotice`; visible placeholders for courier/delivery and
   returns window; no statutory withdrawal period.
6. Wire in: `routing.ts` pathnames, footer links, per-locale metadata + `localeAlternates`; all static.
7. `humanizer` pass over every new MK + EN string.
8. `docs/i18n/mk-review-2.03.md` — same shape as 2.02, unsigned; owed-verification row added.
9. Tests — extend pathname coverage; parity RED→GREEN; re-run oversell gate; regenerate + commit
   `string-inventory.md`.
10. Close: `current-state.md` (NEXT → 2.04, both registers), `file-map.md`, `Decisions.md`, completion
    report. Open PR to `main`; do not self-merge.

*(This is the executor's saved copy of the orchestrator brief; the authoritative Definition of Done is the
original brief. See `src/_project-state/completions/Part-2-Phase-03-Completion.md` for the as-built
record.)*
