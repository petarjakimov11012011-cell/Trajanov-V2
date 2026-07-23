# Part 2 · Phase 08 · Code — Header redesign (nav + build credit)

**Why this matters —** the header is on every page of the live store. This phase cuts it down to the
four things a buyer actually needs (Catalog, About, Contact, then the language switch and the cart),
adds the "Built by Vertex
Consulting" credit next to the wordmark, and keeps the MK/EN switch — so the top of the site says
who made it and gets out of the way of the drop.

---

## Context

**This is an out-of-band UI phase**, the same shape as **2.07 (footer redesign, `D-2.07-1`)** and
**Y.02**. It does **not** sit on the critical path. **Line 1 of `current-state.md` — the `NEXT:`
line — is not changed by this phase**; 2.06's operator rehearsal remains next.

**Read first, by path:**

- `src/_project-state/current-state.md` — live state, registers, the 2.07 entry (the precedent for
  how an out-of-band UI phase is recorded)
- `CLAUDE.md` — repo rules: no secret, no hardcoded token value, no invented fact, no untranslated
  EN string in the MK build
- `brand.md` — **the only source of every colour, size, spacing, radius and type value**
- `facts.md` — the only legal source for rendered factual claims (you will add § 11 this phase, per
  the exact text below)
- `src/components/layout/SiteHeader.tsx` — what exists now
- `src/components/layout/LanguageSwitch.tsx` — the existing locale switcher
- `src/components/layout/SiteFooter.tsx` — the 2.07 rebuild; match its token discipline, heading
  semantics and mobile approach
- `src/messages/mk.json`, `src/messages/en.json` — existing `Nav.*` keys (already native-reviewed)
- `src/i18n/` — typed navigation (`Link`, `usePathname` from `@/i18n/navigation`) and `pathnames`

**Template-propagated warning (`CLAUDE.md`):** every string and every state in this component
renders on **every page in both locales**. One mistake here multiplies across the whole site.

---

## The target header

A reference screenshot from a different client's site was used to agree this layout. **Copy its
structure only. Do not copy its palette, its cream ground, or its serif typeface** — those belong to
another brand. Trajanov's ground, type and colour all come from `brand.md`, unchanged.

### Desktop (≥ 640px) — one row, left to right

1. **Wordmark** — whatever the header uses today (`Трајанов` / `Trajanov`), linking to the locale
   home. Unchanged in content; it is the only route to Home, since there is no "Home" nav link.
2. **Build credit**, immediately to the right of the wordmark, baseline-aligned, visually
   subordinate — small text token, muted foreground token:
   `Изработено од Vertex Consulting` (MK) / `Built by Vertex Consulting` (EN).
   **Only the words "Vertex Consulting" are the link** — the "Built by" / "Изработено од" part is
   plain text outside the anchor. The link goes to `https://www.vertexconsulting.mk/en`, opens in a
   new tab (`target="_blank" rel="noopener noreferrer"`), and carries visually-hidden text saying it
   opens in a new tab, in the current locale. Colour it with the brand accent token used for links
   elsewhere.
3. **Nav links**, right-aligned, in this exact order and no others:
   **Catalog · About · Contact** — using the existing reviewed keys `Nav.catalog`, `Nav.about`,
   `Nav.contact` and the typed `Link` from `@/i18n/navigation`.
4. **Language switch** — `MK · EN`, dot-separated, current locale at full contrast, the other muted.
   Reuse `LanguageSwitch`; restyle only. It must still preserve the current page and query string.
5. **Cart, last** — the **existing** cart control (icon + count badge, 44px target, already built),
   sitting at the far right end of the row, after the language switch. Move it into this row;
   **do not build a second cart control** and do not touch cart logic.

**The order of the right-hand cluster is exactly: Catalog · About · Contact · `MK · EN` · cart.**
The cart is always the last item in the row.
6. **Active-page indicator** — a short underline rule beneath the current page's nav link, in a
   `brand.md` token colour, plus `aria-current="page"` on that link. Reserve the underline's space so
   the row does not shift when the active page changes.
7. A **1px hairline rule** along the bottom edge of the header, using the border token.

**Removed for good:** any `Home`, `Reviews`, `Blog` or `Book` link. Trajanov has no such pages, and
Home is the wordmark.

### Mobile (< 640px)

Two rows, no hamburger, no drawer:

- **Row 1:** wordmark (left) · `MK · EN` then cart (right, in that order — cart last)
- **Row 2:** build credit (left) · Catalog · About · Contact (right)

If row 2 cannot fit at **320px** without horizontal overflow, move the build credit to its own third
row above the hairline rather than shrinking it below the small text token or hiding it. **The credit
must be visible at every breakpoint** — it is the point of the phase.

---

## `facts.md` — add this, verbatim

The credit is a rendered factual claim, so it needs a VERIFIED entry before it can ship. Append a new
section to `facts.md` (after § 10, before the change log), exactly:

```markdown
## 11. Site build credit

| Fact | Value | Status | Source |
|---|---|---|---|
| Site built by | **Vertex Consulting** | VERIFIED | Operator (Lazar), 2026-07-23 — Vertex Consulting is the operators' own consultancy and authorised the credit |
| Vertex Consulting URL | `https://www.vertexconsulting.mk/en` | VERIFIED — **must be click-tested before it ships** | Operator (Lazar), 2026-07-23 |

**This is a build credit and nothing more.** Vertex Consulting is **not** a partner, sponsor,
stockist, collaborator or supplier of Trajanov and must never be presented as one. It appears in the
site header only. It does **not** go in the Organization or WebSite JSON-LD, `sameAs`, OG metadata,
`llms.txt`, the sitemap, the footer, or any legal page.
```

Add a line to the `facts.md` change log noting the § 11 addition, dated 2026-07-23, by Claude Code
(Phase 2.08).

---

## Strings

New namespace `Credit`, MK and EN, using next-intl rich text so the company name stays untranslated
and the anchor sits inline:

- `mk.json` → `"Credit": { "builtBy": "Изработено од <link>Vertex Consulting</link>", "opensInNewTab": "се отвора во нов прозорец" }`
- `en.json` → `"Credit": { "builtBy": "Built by <link>Vertex Consulting</link>", "opensInNewTab": "opens in a new tab" }`

Render with `t.rich('builtBy', { link: (chunks) => <a …>{chunks}</a> })`.

**Reuse `Nav.catalog` / `Nav.about` / `Nav.contact` as they are** — they are already native-reviewed.
Do not add new keys for them and do not reword them. Regenerate `string-inventory.md` and record the
before → after count.

---

## Scope

**In scope:** `src/components/layout/SiteHeader.tsx`, `LanguageSwitch.tsx` (styling only),
`src/messages/{mk,en}.json`, `facts.md` § 11, `string-inventory.md`, `Decisions.md`, the state files,
the completion report.

**Out of scope — do not touch, must be byte-unchanged:**
`src/lib/orders/` (`create_order`), `expire_reservations`, `supabase/migrations/`, the hosted
database, cart logic, checkout, `src/config/`, `src/lib/site.ts` (`SITE_URL`), the footer, the SEO
modules (`src/lib/seo/`), `sitemap.ts`, `llms.txt`, `manifest.ts`, the logo and icon assets.

**Also out of scope:** any new npm dependency; any new `[PLACEHOLDER: …]`; any change to the
existing MK route slugs; a hamburger menu; a sticky/scroll-shrink header.

---

## Tasks

1. Cut branch `phase-2.08-header-redesign` from `main`. Confirm no other phase branch is open first
   (one phase branch at a time).
2. Read the files listed in Context. Note the current header's structure before changing it.
3. Add § 11 to `facts.md` exactly as given above.
4. Add the `Credit` namespace to both message files; drive the i18n parity test **RED then GREEN**.
5. Rebuild `SiteHeader.tsx` to the layout above, taking **every** colour, size, spacing, radius and
   type value from `brand.md` tokens. Zero hardcoded values.
6. Restyle `LanguageSwitch` to the `MK · EN` dot pattern without changing its behaviour.
7. Check contrast on every new pair against the header ground and record the measured ratios.
8. Run the gates. Render both locales in a browser at 375px and desktop; verify against this brief.
9. Log decisions in `Decisions.md` (see below), sync state, file the completion report, open the PR.
   **Do not merge** — an operator merges on explicit instruction (`D-0-3`).

---

## Decisions to log in `Decisions.md`

Pre-decided by the orchestrator; log them with the alternative and the downside, then add any
on-the-fly decision you make yourself as `D-2.08-3` onward.

- **`D-2.08-1` — Header redesign runs as an out-of-band UI phase.** Alternative rejected: fold it
  into a scheduled phase. Downside accepted: another entry between now and the rehearsal, and a UI
  change lands on the live site outside the planned sequence.
- **`D-2.08-2` — The build credit ships as a `facts.md` § 11 VERIFIED entry, in the header.**
  Alternatives rejected: a placeholder (there is a real, operator-supplied fact, so a placeholder
  would be false); footer-only placement, which is the conventional spot and less prominent on a
  client's storefront. Downside accepted: a third-party company name now sits in the top nav of a
  minor's store on every page, and the link is an off-site exit from the buy path.

---

## Definition of Done

Every line provably true or false. Paste the evidence in the report.

**Layout & content**

- [ ] Header renders, in both locales, at 375px and desktop: wordmark → build credit → Catalog →
      About → Contact → `MK · EN` → cart, **in that exact left-to-right order, cart last**.
      Evidence: screenshot or accessibility tree per locale per breakpoint.
- [ ] `grep` proves `SiteHeader.tsx` contains **no** Home / Reviews / Blog / Book link.
- [ ] Exactly three text page links in the header.
- [ ] "Vertex Consulting" is an `<a href="https://www.vertexconsulting.mk/en">` with
      `target="_blank"` and `rel="noopener noreferrer"`, and "Built by" / „Изработено од" is
      **outside** the anchor.
- [ ] The new-tab announcement text renders in the correct locale and is visually hidden.
- [ ] The active page's link carries `aria-current="page"` and shows the underline; the row does not
      shift when the active page changes.
- [ ] The cart is the pre-existing control — cart logic and its badge wiring unchanged.
- [ ] `LanguageSwitch` still preserves page + query/`?preview` across a switch.

**Brand & accessibility**

- [ ] Zero hardcoded colour, size, spacing, radius or font values in `SiteHeader.tsx` and the
      restyled `LanguageSwitch` — `grep` for hex codes and raw `px` literals returns nothing.
- [ ] WCAG 2.2 AA contrast **measured** and pasted for: credit muted text on the header ground; the
      "Vertex Consulting" link colour on the header ground; nav link default and active; language
      switch active and inactive. Every ratio ≥ 4.5:1.
- [ ] All interactive targets ≥ 24px; the cart ≥ 44px.
- [ ] No horizontal overflow at 320px and 375px, both locales.
- [ ] No console errors on Home, Catalog, About, Contact in both locales.

**Truth & containment**

- [ ] `facts.md` § 11 present exactly as specified, plus the change-log line.
- [ ] `grep -ri "vertex"` across emitted JSON-LD, OG metadata, `llms.txt`, `sitemap.xml`, the footer
      and the legal pages returns **zero** hits.
- [ ] No new `[PLACEHOLDER: …]` anywhere.

**Gates**

- [ ] MK+EN parity test driven RED then GREEN; `string-inventory.md` regenerated, count recorded.
- [ ] `npm run build`, `npx tsc --noEmit`, `npm run lint` all clean.
- [ ] `npm test` green, **including** `10 simultaneous orders against 3 units → exactly 3 succeed,
      7 rejected`.
- [ ] `git diff --stat main` proves the frozen paths listed under Out of scope are untouched.
- [ ] `package.json` and the lockfile unchanged — no new dependency.

**State**

- [ ] `Decisions.md` appended (`D-2.08-1`, `D-2.08-2`, plus any of your own).
- [ ] `current-state.md` updated in the 2.07 style: a 2.08 block in Status, the three new owed rows
      below, **`NEXT:` line on line 1 left as it is** except for appending the 2.08 summary the same
      way 2.07 was appended.
- [ ] `file-map.md` synced if any file was added.
- [ ] Completion report filed at `src/_project-state/completions/Part-2-Phase-08.md` from the
      template.

---

## Owed to Lazar — add these three rows to the owed-verification register

| Item | What "pass" looks like | Owner |
|---|---|---|
| **Native MK review of the new `Credit` strings** | Two native speakers read „Изработено од Vertex Consulting" and the new-tab text in context, in the browser, and sign the review pack | Lazar + Petar |
| **Click-test `https://www.vertexconsulting.mk/en`** | The link opens a working page in a new tab from the live header, on a phone and on desktop, both locales. Same rule as the Instagram URL in `facts.md` § 6 — a link to a page that does not resolve is a broken fact on every page of the site | Lazar |
| **Client sign-off on the header credit** | Vladimir (and his parents) confirm they are content for a third-party company name and outbound link to sit in the top nav of the store on every page. Client-facing and prominent; the credit is easy to move to the footer later if they would rather | Lazar → Vladimir |

---

## Outputs & where they go

- Code → branch `phase-2.08-header-redesign`, PR to `main`. **Do not merge.**
- Completion report → `src/_project-state/completions/Part-2-Phase-08.md`
- This brief → `briefs/Part-2-Phase-08-Code.md`
