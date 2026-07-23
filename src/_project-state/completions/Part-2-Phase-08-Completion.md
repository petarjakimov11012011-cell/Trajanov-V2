# Completion report — Part 2 Phase 08: Header redesign (nav + build credit)

| | |
|---|---|
| **Phase** | 2.08 |
| **Name** | Header redesign — nav + build credit |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-23 |
| **Branch** | `phase-2.08-header-redesign` |
| **PR** | [#19](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/19) — open to `main`, **NOT merged** (operator merges on explicit instruction, `D-0-3`) |
| **Brief** | `briefs/Part-2-Phase-08-Code.md` |

---

## 1. What shipped

- The site-wide header is rebuilt to four buyer-facing things and nothing else: the wordmark (→ home),
  the **Catalog · About · Contact** nav, the **MK · EN** switch, and the cart — in that exact
  left-to-right order, **cart last**, on every page in both locales. No Home/Reviews/Blog/Book link.
- A **"Built by Vertex Consulting"** build credit sits next to the wordmark (muted, baseline-aligned).
  Only the words *Vertex Consulting* are the link → `https://www.vertexconsulting.mk/en`, new tab, with
  a locale-correct visually-hidden "opens in a new tab". It is a `facts.md` § 11 VERIFIED fact and is
  contained to the header (absent from JSON-LD, OG, `llms.txt`, sitemap, footer, legal pages).
- The current page's nav link now shows an **active-state underline + `aria-current="page"`**, with the
  underline's space reserved so the row does not shift as you move between pages.
- The language switch is restyled to the **`MK · EN` dot pattern** (active full-contrast, other muted),
  with its locale-switch-in-place + page/query preservation behaviour unchanged.
- New `Credit` MK/EN strings (next-intl rich-text so the company name stays untranslated); MK+EN parity
  kept green (driven RED→GREEN); string inventory 217 → 219.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.08-1 | *(pre-decided)* Header redesign runs as an out-of-band UI phase; `NEXT:` unchanged | Fold into a scheduled phase | Another entry before the rehearsal; a UI change lands outside the planned sequence |
| D-2.08-2 | *(pre-decided)* Build credit ships as a `facts.md` § 11 VERIFIED entry, in the header | A placeholder (false — a real fact exists); footer-only placement (less prominent) | A third-party name sits in the top nav of a minor's store on every page; the link is an off-site exit from the buy path |
| D-2.08-3 | The redesigned header is **not sticky** — the pre-existing `sticky top-0 … backdrop-blur` is dropped for a static header on a solid ground | Preserve the existing sticky/backdrop-blur | Behaviour change: on long pages the nav/cart scroll away with the page instead of staying pinned |
| D-2.08-4 | `SiteHeader` is a **Client Component** so the nav can read `usePathname()` for the active indicator | A separate `'use client'` nav sub-component (keeps header a Server Component) | The small header hydrates as client JS on every page (still SSRs its HTML — no content/SEO cost) |
| D-2.08-5 | **Canonical DOM order** + a **deterministic 3-row mobile grid** (credit on its own full-width row) | A `flex-wrap` that flips 2↔3 rows by width; grouping the mobile rows in the DOM | Credit is on its own row at all mobile widths (the "fallback" is the mobile default), so a wide phone is one row taller than the 2-row ideal; mobile visual order isn't a perfect match to DOM order (a minor reading nuance for chrome) |

All five are in `Decisions.md` with full context.

---

## 3. Surprises and off-spec changes

- **The repo had a sticky header; the brief lists "a sticky/scroll-shrink header" as out of scope.**
  This is the one genuine brief-vs-repo difference. I read "out of scope" as "the redesigned header must
  not be sticky," dropped `sticky top-0 z-40 … backdrop-blur`, and shipped a static header on a solid
  `--color-ground` (which also gives a clean, single-colour ground for the DoD's measured-contrast
  requirement). This changes live behaviour beyond pure layout — flagged for the operator (`D-2.08-3`).
- **The brief's 2-row mobile does not fit the default (MK) locale at 320–375px.** „Изработено од Vertex
  Consulting" + „Каталог · За брендот · Контакт" cannot share one row without horizontal overflow at the
  brief's own test widths. The brief's sanctioned fallback (credit on its own row above the hairline) is
  therefore the mobile default in both locales, applied deterministically rather than flipping layouts by
  width (`D-2.08-5`). The credit is fully visible at every breakpoint; no horizontal overflow at 320/375.
- **The credit link's tap target needed a nudge.** At `text-small`, the "EN" switch button measured 23px
  wide (< the 24px minimum-target line in the DoD). Added `min-w-6`/`min-h-6` (24px, on the 4px scale) so
  every interactive target is ≥ 24×24; the cart stays 44×44.
- **`facts.md` §11 provenance is corroborated in-repo.** `00_stack-and-config.md` already references the
  "Vertexcons" Cloudflare account (a pre-existing 2.05 mention, unchanged vs `main`) — consistent with
  §11's note that Vertex Consulting is the operators' own consultancy. This is an internal state doc, not
  an emitted surface, so it is not a containment concern.
- **Completion-report filename:** the brief's Outputs section names it `Part-2-Phase-08.md`, but the
  template header and 17/19 existing reports use the `-Completion.md` suffix. Filed as
  `Part-2-Phase-08-Completion.md` to match the template + convention. Trivial to rename if the orchestrator
  fetches the brief's exact path.

---

## 4. Files touched

`file-map.md` updated: **yes** (change-log row added; the file tree is unchanged — no files were added under `src/`).

| File | Added / Modified / Deleted |
|---|---|
| `src/components/layout/SiteHeader.tsx` | Modified (rebuilt) |
| `src/components/layout/LanguageSwitch.tsx` | Modified (restyled — behaviour unchanged) |
| `src/messages/mk.json` | Modified (+`Credit` namespace) |
| `src/messages/en.json` | Modified (+`Credit` namespace) |
| `facts.md` | Modified (§ 11 + change-log row) |
| `docs/i18n/string-inventory.md` | Modified (regenerated → 219) |
| `Decisions.md` | Modified (`D-2.08-1…5`) |
| `src/_project-state/current-state.md` | Modified (2.08 status block; owed #19/#20/#21; Last-updated; `NEXT:` unchanged) |
| `src/_project-state/file-map.md` | Modified (change-log row) |
| `src/_project-state/completions/Part-2-Phase-08-Completion.md` | Added (this file) |
| `briefs/Part-2-Phase-08-Code.md` | Added (the brief, committed on the branch) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **clean** — exit 0, "✓ Compiled successfully in 2.8s" |
| Types | `npx tsc --noEmit` | **clean** |
| Lint | `npm run lint` | **clean** (no output) |
| Unit / integration | `npm test` | **85/85 pass** (17 files) |

MK+EN parity was driven **RED then GREEN**: adding `Credit` to `mk.json` only failed
`tests/i18n/catalog-parity.test.ts` (`["Credit.builtBy","Credit.opensInNewTab"] present only in mk.json`);
adding the same keys to `en.json` returned it to green.

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 (69ms)` |

No commerce code was touched, so this gate is unchanged; re-run green to prove the header change didn't disturb it.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| Header order wordmark → credit → Catalog → About → Contact → MK·EN → cart, cart last — both locales, desktop + 375px + 320px | ✅ (a11y tree + screenshots) |
| Accessibility tree reads that exact order (canonical DOM order) | ✅ |
| `grep` proves no Home/Reviews/Blog/Book link in `SiteHeader.tsx` | ✅ |
| Exactly three text page links in the header | ✅ (`/catalog`, `/about`, `/contact`) |
| "Vertex Consulting" is `<a href="https://www.vertexconsulting.mk/en" target="_blank" rel="noopener noreferrer">`; "Built by"/„Изработено од" outside the anchor | ✅ |
| New-tab announcement renders in the correct locale and is visually hidden (`sr-only`) | ✅ (MK „се отвора во нов прозорец" / EN "opens in a new tab") |
| Active page has `aria-current="page"` + underline; row does not shift (2px border reserved on all three) | ✅ (measured: active `border-mustard`, inactive `border-transparent`, both 2px) |
| Cart is the pre-existing control; logic + badge wiring unchanged | ✅ (moved verbatim to row end) |
| `LanguageSwitch` preserves page + query/`?preview` across a switch | ✅ (live: `/en/contact` → `/kontakt`, `/en/catalog` → `/katalog`) |
| Zero hardcoded colour/size/spacing/radius/font — `grep` for hex + raw px literals returns nothing | ✅ (only `[var(--…)]` token refs, the brand's documented `0.14em` tracking, and the preserved cart badge's `0.65rem` rem) |
| WCAG 2.2 AA contrast measured, every pair ≥ 4.5 | ✅ credit 7.85 · Vertex link 8.95 · nav default 7.85 · nav active 15.42 · lang active 15.42 · lang inactive 7.85 |
| Interactive targets ≥ 24px; cart ≥ 44px | ✅ (lang 24×24 via `min-w-6`/`min-h-6`; nav 26px tall; cart 44×44) |
| No horizontal overflow at 320px and 375px, both locales | ✅ (measured `docScrollWidth == viewport`) |
| No console errors on Home/Catalog/About/Contact in both locales | ✅ (8 pages swept) |
| `facts.md` § 11 present as specified + change-log line | ✅ |
| `grep -ri vertex` across JSON-LD/OG/`llms.txt`/`sitemap.xml`/footer/legal = zero | ✅ (source **and** emitted: llms/sitemap/robots 0; home JSON-LD 0; OG meta 0; footer 0) |
| No new `[PLACEHOLDER: …]` | ✅ |
| Header non-sticky, solid ground | ✅ (`header{position:static}`, bg `#0F1210`) |
| `git diff --stat main` proves frozen paths untouched | ✅ (see § 4 / § 10) |
| `package.json` + lockfile unchanged (no new dependency) | ✅ |

### Owed to Lazar (only he / a real device / a real account can confirm)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 19 | Native MK review of the 2 new `Credit` strings | Read `Credit.builtBy` („Изработено од Vertex Consulting") + `Credit.opensInNewTab` („се отвора во нов прозорец") in the browser, in context | Two native speakers sign the review pack (as `docs/i18n/mk-review-2.03.md`) |
| 20 | **Click-test `https://www.vertexconsulting.mk/en`** | From the **live** header, click "Vertex Consulting" on a **phone and desktop**, **both locales** | Opens a **working** page in a **new tab**. Same rule as the Instagram URL (`facts.md` § 6) — a link to a page that does not resolve is a broken fact on every page |
| 21 | Client sign-off on the header credit | Show Vladimir + parents the live header, both locales | They confirm they are content for a third-party company name + outbound link in the top nav on every page (easy to move to the footer later) |

**5-item Lazar checklist (both locales, 375px + desktop, on the live site after deploy):**
1. Order reads wordmark → *Built by Vertex Consulting* → Catalog · About · Contact → MK · EN → cart; cart is last.
2. Clicking "Vertex Consulting" opens `vertexconsulting.mk/en` in a **new tab** and the page loads.
3. The current page's nav link is underlined; the row does not jump as you move between Catalog/About/Contact.
4. MK shows „Изработено од Vertex Consulting"; EN shows "Built by Vertex Consulting"; the company name is never translated.
5. On a phone the credit is fully visible on its own line (not cut off), and nothing scrolls sideways.

---

## 7. Placeholders shipped

**None.** No new `[PLACEHOLDER: …]` was introduced. The pre-existing product/legal placeholders
(#2/#3/#4/#7 and the Y.02 #8/#9/#10) are untouched.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ (the credit = `facts.md` § 11 VERIFIED; wordmark = existing `Nav.brand`) |
| `humanizer` pass run on user-facing copy | ✅ — the only new user-facing copy is "Built by Vertex Consulting" / „Изработено од Vertex Consulting" (a factual credit, no filler) |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ — the credit is explicitly **not** a partner/sponsor/stockist (`facts.md` § 11) and appears in the header only |
| Template-propagated strings verified once against `facts.md` before generation | ✅ (the credit renders on every page; traced to § 11 once) |
| No AI-generated product imagery (`D-0-6`) | ✅ (n/a — no imagery) |
| No untranslated EN string in the MK build | ✅ — MK renders „Изработено од Vertex Consulting"; only the brand name "Vertex Consulting" is intentionally untranslated (per the brief's rich-text spec) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ (the only literal added is the public `vertexconsulting.mk/en` URL) |
| `.env*` still gitignored | ✅ (untouched) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ (n/a — no env work) |
| No order PII (phone, address) in logs | ✅ (n/a — no logging touched) |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Live click-test of the Vertex Consulting URL | The deploy + a real device (owed #20) | Lazar |
| Native MK review of the `Credit` strings | A native-speaker pass (owed #19) | Lazar + Petar |
| Client sign-off on the credit placement | Vladimir + parents (owed #21) | Lazar → Vladimir |

Frozen paths confirmed byte-unchanged vs `main`: `src/lib/orders/`, `supabase/migrations/`,
`src/components/{cart,checkout}/`, `src/config/`, `src/lib/site.ts` (`SITE_URL`), `SiteFooter.tsx`,
`src/lib/seo/`, `src/app/sitemap.ts`, `src/app/llms.txt/`, `src/app/manifest.ts`, and the logo/icon assets.
`package.json` + `package-lock.json` unchanged.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ (left unchanged — out-of-band; 2.08 summary added as a Status block, the 2.07 way) |
| `current-state.md` — owed-verification register | ✅ (#19/#20/#21) |
| `current-state.md` — placeholder register | ✅ (unchanged — no new placeholder) |
| `file-map.md` — matches what is actually on disk | ✅ (change-log row; tree unchanged — no files added under `src/`) |
| `00_stack-and-config.md` — new deps / pins / config | ✅ (n/a — no dependency/config change) |
| `Decisions.md` — every § 2 entry appended | ✅ (`D-2.08-1…5`) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (this phase is
out-of-band and does not touch the 2.06 → Y.01 critical path).
