# Completion report — Part 2 Phase Y.05: Home hero — full-bleed photograph with overlaid calls to action

| | |
|---|---|
| **Phase** | Y.05 |
| **Name** | Home hero: full-bleed photograph with overlaid CTAs |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-27 |
| **Branch** | `phase-y.05-home-hero-overlay` |
| **PR** | (opened with this report; operator merges — `D-0-3`) |
| **Brief** | Part 2 · Phase Y.05 · Code (supplied in-session; not committed to `briefs/`) |

---

## 1. What shipped

- The Home front door now reads as **one photograph with the words on it**: in the countdown, ended
  and no-view states, the drop-state element, the countdown, the tagline and the two CTAs sit **on**
  the image over a darkening scrim, bottom-anchored — left-aligned from `sm:`, centred below.
- **One new asset**: `public/images/lifestyle/trio-composite-01.webp` (1672×941, 16:9, 184,756 B
  WebP) — the three-panel bar composite built from the same three §8.1-permitted frames, serif
  TRAJANOV burned in. It carries the hero from `640px` up; phones keep the Y.04 mustard frame
  (and its LCP preload — still the only image preload on the page).
- The rendered `Home.headline` is gone from all three non-live branches (key kept, `D-Y.05-1`);
  each branch now carries a `sr-only` H1 (`D-Y.05-2`) so the page keeps exactly one H1.
- The `live` drop state is **byte-unchanged** — proven by diff hunks and by sha256-identical
  rendered `<main>` against `main`, both locales.
- The countdown digits are readable over the photograph by **measurement, not assertion** — and,
  as a direct consequence of this brief's measurement gates, a defect that has been on production
  since 1.04 was surfaced: see §3.1.

---

## 2. Decisions I made on my own

All logged in `Decisions.md`. `D-Y.05-1…7` are the orchestrator's baked-in decisions, logged as
briefed (D-Y.05-6 carries the final measured scrim recipe). Mine are:

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-Y.05-8 | The overlay tagline renders `text-foreground`, not Y.04's `text-muted-foreground` — an initial design choice for the new surface, made before measuring (muted over the worst-case composite holds ~1.7–4.6:1; the only sanctioned correction would darken the photo much further) | Keeping muted and deepening the scrim until it passes | The tagline is one step louder than Y.04 shipped it |
| D-Y.05-9 | The countdown's token size is restored **at the call site** (`className` → spans inherit): tailwind-merge has silently stripped `text-countdown` since 1.04, so digits rendered 16px — on production too | Fixing the root cause in `Countdown.tsx` or `src/lib/utils.ts` (`extendTailwindMerge`) — both out of this phase's file scope, the latter with site-wide blast radius | The root cause remains; `DropCountdownEyebrow` (same hero, renders 16px) and `/styleguide` still hit it |
| D-Y.05-10 | Below `768px` the countdown wrapper uses `--text-h1` (`text-h1 md:text-countdown`): with the size restored, the countdown token measures **402px wide at a 390px viewport** — it physically cannot fit a phone, and 640–735px clips too | Shipping the token at all widths and letting `overflow-hidden` clip the digits; or editing Countdown's internal gaps (out of scope) | D-Y.05-7's "renders at `--text-countdown`" holds only from `md:` up; a second token now sizes the countdown below that |
| D-Y.05-11 | The composite ships **default-lazy**: on Next 16.2.10, `loading="eager"` **and** `fetchPriority="high"` (the brief's recipe) each emit a second `rel="preload"` link — the exact thing D-Y.05-4 and the DoD forbid | The brief's literal props (two preloads, DoD fail); or `getImageProps`+`<picture>` art direction | Desktop fetch starts at layout, not parse (~0.1s on the measured desktop run — LCP 0.9s, score 99). Bonus: phones never download the 185 KB desktop asset at all |
| D-Y.05-12 | Verification maneuvers: local scratch drops ended for Lighthouse (recorded → mutated → **restored byte-exact, re-queried**; hosted untouched), and a one-line uncommitted `view = null` in `page.tsx` for the no-view render (reverted via git, diff-proven) | Measuring `/` in the live state; deleting drops rows to force no-view through the real query (no cascade — six-table dump/reload for an untouched code path) | Same as D-Y.04-5: the scratch DB keeps diverging; and the no-view evidence proves the component branch, not the DB-to-null path |

---

## 3. Surprises and off-spec changes

**3.1 The countdown has been rendering 16px digits since Phase 1.04 — on production, right now.**
This phase's gate "computed `font-size` pasted for the digits" surfaced it: `Countdown.tsx` passes
`text-countdown` *before* a text-colour class into `cn()`, and tailwind-merge (3.6.0, locked since
the 1.01 scaffold) cannot tell a custom font-size utility from a colour utility — both match
`text-*` — so it drops the size as a "conflicting colour". The digit and colon spans, and
`DropCountdownEyebrow`'s `text-eyebrow`, all lose their size tokens. **Every prior "the countdown is
the loudest object" verification (including Y.04's) was made against the stripped 16px rendering;**
no earlier gate ever demanded the computed value. Fixed for this hero at the call site (D-Y.05-9).
**The orchestrator should schedule a small follow-up phase**: `extendTailwindMerge` in
`src/lib/utils.ts` with the brand's custom font-size group (text-countdown/h1/h2/body/small/price/
eyebrow), then re-verify every surface that uses them — this is a one-file root fix with site-wide
reach, which is exactly why it is not smuggled into this phase.

**3.2 The countdown token never fit a phone.** With the size restored, `--text-countdown`
(`clamp(2.75rem, 13vw, 5.5rem)`) puts the four-cell row at 402px on a 390px viewport. The 16px bug
is why no phase ever saw it clip. Below `768px` this hero renders the countdown at `--text-h1`
(D-Y.05-10) — still by far the largest type on the page. `brand.md` §4's countdown row may deserve
a note when the root fix lands.

**3.3 The brief's preload recipe emits the second preload it was designed to prevent.** On
Next 16.2.10 both `loading="eager"` and `fetchPriority="high"` cause next/image to emit a
`rel="preload" as="image"` link. The composite ships default-lazy instead (D-Y.05-11); the DoD's
"exactly one preload, mustard" holds, measured in dev and on `next start`, both locales.

**3.4 The brief's starting scrim failed its own gate, as the brief anticipated.** At the 55%
gradient reach the countdown digits measured **2.14:1** worst-case (320/768/1024) over the
off-white shirts. Deepened to **80%** reach (the sanctioned direction only); all targets pass with
margin (§6). The photograph reads darker than the 55% sketch would have — D-Y.05-6's accepted
downside, now with a bigger number attached.

**3.5 The Lighthouse mobile ≥94 gate is not reproducible in this environment — for `main` either.**
Branch: **92 / 92 / 91**. `main`, same machine, same harness (LH 13.4.1, headless Chrome,
`next start`, same ended-state DB): **91 / 91**. Both builds report the **header wordmark** — not
the hero image — as the LCP element (the reveal-animated hero is excluded by current LCP
heuristics **on `main` too**; simulated text-LCP 3.4–3.6s). So the phase itself costs 0–1 pt
locally, Y.04's recorded 98 does not reproduce for the code that produced it, and the absolute
number this environment yields cannot honestly gate the phase. **Not absorbed silently:** owed
row **#45** makes PSI on production the binding number, with an explicit "if below 94, fix — do
not absorb". Desktop: branch **99** vs main 100 (gate ≥95 met; the composite IS the desktop LCP
element, 0.9s, so the lazy choice costs almost nothing).

**3.6 The Y.05 brief was not committed to `briefs/`** — it was supplied in-session. The report's
Brief row says so; the orchestrator may want to commit it for the record, as Y.04's was.

---

## 4. Files touched

`file-map.md` updated: **yes**.

| File | Added / Modified / Deleted |
|---|---|
| `public/images/lifestyle/trio-composite-01.webp` | Added (1672×941 WebP, 184,756 B) |
| `src/components/home/HomeExperience.tsx` | Modified (the only component) |
| `src/messages/mk.json` / `src/messages/en.json` | Modified (+1 key: `Product.photoAltComposite`) |
| `docs/i18n/string-inventory.md` | Regenerated (247→248) |
| `docs/i18n/mk-review-y05.md` | Added (unsigned) |
| `Decisions.md` | Modified (append-only: `D-Y.05-1…12`) |
| `src/_project-state/current-state.md` | Modified (line 1, Status, owed #44–47, placeholder note) |
| `src/_project-state/file-map.md` | Modified (tree + changelog) |
| `src/_project-state/completions/Part-2-Phase-Y05-Completion.md` | Added (this file) |

`00_stack-and-config.md`: **not touched — nothing to record** (no dependency, no config, no pin
changed).

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | exit 0 — "✓ Compiled successfully", 29/29 pages |
| Types | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0, clean |
| Unit / integration | `npm test` | **116 passed (116)** — 19 files |

Concurrent-order gate (nothing in this phase touches stock — it must not move, and did not):

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 46ms` |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `git diff main --name-only` = only the allowed files (§4 list) | ☑ verified before and after the state-file commit |
| `git diff main -- package.json package-lock.json src/config/ supabase/ src/lib/drop/ src/lib/product-images.ts facts.md brand.md` | ☑ empty (0 lines) |
| Colour literals (`#hex`/`rgb(`/`hsl(`) in added diff lines | ☑ zero |
| `Home.headline` zero rendered-text occurrences, all four states, both locales; key kept + flagged | ☑ (DOM-text check with scripts stripped; key present in both catalogs; inventory flags `_(not found in source)_`) |
| Exactly one `<h1>` in every state, `sr-only` in the three non-live states | ☑ all 30 render combos |
| `<head>` on `/`: exactly one `rel="preload" as="image"`, mustard `imageSrcSet`, `imageSizes="100vw"` | ☑ both locales, dev and `next start` |
| `/?preview=live` + `/en?preview=live` `<main>` byte-identical to `main`'s | ☑ **sha256-identical**: MK 14,814 B (`6a8664fa…`), EN 12,563 B (`a2669dce…`), same hashes both sides |
| Measured contrast at 390 + 1280, both locales (worst pixel beneath each element; canvas replication of image × scrim; WCAG 2.2) | ☑ see table below |
| Countdown largest type in the hero — computed sizes | ☑ digits **36px** (<768) / **88px** (≥768); tagline 16px; CTA labels 16px; countdown unit labels 12px; ended-banner 14px; eyebrow 16px (pre-existing strip, §3.1) |
| Both CTAs ≥44px and click-navigate | ☑ 48px / 50px; real clicks: MK → `/katalog`, `/kontakt`; EN → `/en/catalog`, `/en/contact` |
| `trio-composite-01.webp` serves 200 `image/webp` at exact committed size; optimizer smaller | ☑ raw 184,756 B; `/_next/image?…&w=1200&q=75` → 200, 79,732 B |
| Per-locale alt text, no EN string in the MK build | ☑ MK „Окер и крем-бели маици со црвен принт, носени." / EN "Ochre and off-white t-shirts with red print, worn." |
| Nobody in frame named / described / aged / counted in any new string | ☑ one string, garments only |
| No horizontal overflow + zero console errors at 320/390/768/1024/1280, both locales | ☑ all states (countdown row also fits its hero at every width — no clipping) |
| Lighthouse | Desktop **99** (≥95 ☑). Mobile **92/92/91** — ≥94 **not met locally**, but `main` itself measures **91/91** on the same harness: the gate is unreproducible in this environment for the unchanged baseline too (§3.5). **Escalated, not absorbed** — owed #45 binds it to PSI on production |
| Placeholder register unchanged | ☑ adds and clears nothing |
| Every own decision in `Decisions.md` with alternative + downside | ☑ `D-Y.05-8…12` (plus the orchestrator's 1–7) |

**Measured contrast ratios (worst pixel beneath the text; requirement: tagline + button labels
≥4.5:1, countdown digits ≥3:1):**

| Combo | Digits (per cell) | Tagline | Каталог/Catalog | Контакт/Contact |
|---|---|---|---|---|
| countdown · MK · 390 | 7.22 / 7.34 / 6.98 / 7.34 | 8.53 | 9.26 | 11.6 |
| countdown · EN · 390 | 6.41 / 6.04 / 5.13 / 5.21 | 7.86 | 9.26 | 11.6 |
| countdown · MK · 1280 | 7.18 / 5.13 / 5.13 / 5.17 | 10.1 | 9.26 | 11.4 |
| countdown · EN · 1280 | 7.18 / 5.13 / 5.13 / 5.17 | 9.2 | 9.26 | 11.4 |
| ended · MK · 390 / 1280 | — | 8.53 / 10.1 | 9.26 | 11.6 / 11.4 |
| ended · EN · 390 / 1280 | — | 7.86 / 9.2 | 9.26 | 11.6 / 11.4 |
| no-view · both · 390 / 1280 | — | 7.86–10.1 | 9.26 | 11.4–11.6 |

Full-matrix minima across **all 20 countdown/ended combos** (320/390/768/1024/1280 × both locales):
digits **≥3.34**, tagline **≥7.82**, CTA labels **≥9.26**. The ended-banner (its own `bg-surface`)
measures 7.31. Scrim as shipped: 40% wash + bottom gradient 92%→0% at **80%** height (deepened from
the brief's 55% after digits measured 2.14:1 — D-Y.05-6's only permitted direction).

### Owed to Lazar (all added to the owed-verification register)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 44 | Hero on a real phone, both locales, portrait + landscape | `https://www.trajanovv.com` and `/en` | Photo fills the width; tagline + both buttons readable over it; nothing overlaps; buttons thumb-hittable |
| 45 | PSI mobile on production `/` ≥ 94 | PageSpeed Insights on `https://www.trajanovv.com` | Performance ≥ 94 (see §3.5 — local numbers cannot decide this; if below 94, fix, do not absorb) |
| 46 | MK composite alt string signed | `docs/i18n/mk-review-y05.md` | Both sign-off boxes checked; colours match the shirts; nobody described |
| 47 | Brand-direction sign-off on the burned-in serif wordmark | First screen of `/` at ≥640px | Lazar confirms two wordmarks in two typefaces on one screen — or supplies a composite without the burned-in text |

---

## 7. Placeholders shipped

None. The register is unchanged — #2–#10 byte-identical; nothing cleared, reworded, hidden or
filled. No placeholder value appears on the hero.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to VERIFIED `facts.md` | ☑ the phase adds no factual claim; the composite is the §8.1-permitted frames (§8 names the Home hero as the lifestyle set's use) |
| `humanizer` pass run on user-facing copy | ☑ one 7-word garment alt string — nothing fired (recorded in the review pack) |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` | ☑ n/a — one string, follows the reviewed Y.03 register |
| No AI-generated product imagery (`D-0-6`) | ☑ the composite is assembled from the three real photographs already on record; the burned-in wordmark is typography |
| No untranslated EN string in the MK build | ☑ verified in the render matrix (`lang=mk` pages carry only MK strings) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind `NEXT_PUBLIC_` | ☑ none touched |
| No order PII in logs | ☑ no logging touched |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| tailwind-merge root fix (`extendTailwindMerge` for the brand's custom text-size utilities) + re-verify every `text-<size>`-via-`cn()` surface (`DropCountdownEyebrow`, `/styleguide`, …) | A follow-up phase brief (§3.1 — one file, site-wide reach) | Orchestrator |
| PSI mobile numbers on production (both the pre-Y.05 #42 and post-Y.05 #45) | Y.05 deploy + a human running PSI | Lazar / Petar |
| The Y.05 brief committed to `briefs/` | Orchestrator (§3.6) | Orchestrator |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (unchanged target: Y.01 + the 2.06 operator half — this phase does not advance the critical path; Y.05 record inserted) |
| `current-state.md` — owed-verification register | ☑ +4 rows (#44–47) |
| `current-state.md` — placeholder register | ☑ "no change" note added |
| `file-map.md` | ☑ tree (+1 asset, +1 doc) + changelog row |
| `00_stack-and-config.md` | ☑ n/a — no dependency or config change |
| `Decisions.md` | ☑ `D-Y.05-1…12` appended |

**`NEXT:` line I set:** unchanged — `NEXT: Y.01 (drop content load) + the placeholder register to
zero before the first REAL drop …` (the 2.06 operator rehearsal still ahead of it).
