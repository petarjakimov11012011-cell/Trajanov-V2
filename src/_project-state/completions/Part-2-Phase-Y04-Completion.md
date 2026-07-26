# Completion report — Part 2 Phase Y.04: Home hero photography

| | |
|---|---|
| **Phase** | Y.04 |
| **Name** | Home hero photography |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-26 |
| **Branch** | `phase-y.04-home-hero` |
| **PR** | *(filled at PR open — see the PR link in `current-state.md` line 1)* |
| **Brief** | `briefs/Part-2-Phase-Y04-Code.md` |

---

## 1. What shipped

- **The Home page shows a real photograph for the first time.** In the countdown, ended, and no-view
  states, the hero now renders `mustard-ochre-01.webp` — full-bleed, one frame only, below 640px —
  and both frames side by side (mustard left, off-white right, equal columns) from 640px up. The
  countdown stays above the photograph and stays the largest type on the page.
- **Two calls to action beneath the photograph:** **Каталог** (mustard fill) → `/katalog` /
  `/en/catalog` and **Контакт** (bordered) → `/kontakt` / `/en/contact`, built from the existing
  button classes only, 48px/50px tall, localised `Link`, click-verified in both locales.
- **The live drop state is untouched, provably.** No diff hunk overlaps the `live` branch, and the
  rendered `<main>` at `?preview=live` is **byte-identical** to `main`'s in both locales
  (14,814 B MK / 12,563 B EN, both sides).
- **No new asset.** `git diff main --name-only public/` returns nothing. Only the two Y.03 frames
  render, each bound by an explicit named constant and re-confirmed against its colourway by eye
  (both files opened and looked at before wiring).
- `D-1.05-4` (no photo hero) is superseded by `D-Y.04-1`; two new message keys
  (`Home.ctaCatalog`/`ctaContact`, MK+EN); `string-inventory.md` 245→**247**; unsigned MK review
  pack at `docs/i18n/mk-review-y04.md`.
- **Lighthouse mobile Performance on `/` (production build, ended-state hero): 98** — LCP 2.5s,
  FCP 1.0s, TBT 50ms, CLS 0. The mustard frame is the LCP element and ships with `priority`
  (preload verified in `<head>`).

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-Y.04-2` | The countdown branch's `browseWhileWait` text link no longer renders — the brief's exhaustive top-to-bottom order for that branch omits it, and the new primary **Каталог** button targets the same route. The key stays in both catalogs (the brief pins the inventory at 247). | Keeping both — a text link and a primary button to the same route four elements apart, competing with each other. Or deleting the key, breaking the briefed count. | `Home.browseWhileWait` is now a dead key, honestly flagged `_(not found in source)_` in the regenerated inventory. A reviewed MK string renders nowhere. |
| `D-Y.04-3` | "Full-bleed" on mobile is implemented as `-mx-4` (cancelling the page column's `px-4` exactly), square-cornered at the bleed, `PhotoSlot` radius from `sm:`; both boxes carry the `PhotoSlot` `bg-surface-2` so a loading photo is never a black hole. | A `w-full` frame inside the column padding (not actually full-bleed; reads as a card), or `50vw` negative-margin tricks (scrollbar-width overflow risk). | The `-mx-4` is coupled to the column's `px-4`; if that padding ever changes below `sm:`, the bleed drifts. Documented in a comment at the site. Verified `scrollWidth === 390` at 390px. |
| `D-Y.04-4` | The secondary button is composed of existing pieces only: the `CartView` checkout-Link base recipe + the cart stepper's `border-border-strong` / `hover:border-foreground` on `bg-transparent`. The codebase has no pre-existing secondary button-link variant. | `BuyButton`'s only bordered look — the sold-out state — which is a disabled affordance in the grey `soldout` token; or inventing a new variant (forbidden by the brief). | The secondary recipe exists only inline in `HomeExperience`; a future shared Button component should absorb it. |
| `D-Y.04-5` | Lighthouse was measured against the **ended-state hero** by temporarily moving the two `D-Y.03-11` local scratch drops into the past (local Docker DB only, prior values recorded, **restored byte-exact and re-queried after**) — because the scratch DB's leftover live drop makes `/` serve the live grid, a page this phase doesn't touch, and `?preview=` is refused under `next start`. | Measuring `/` in the live state (a number that proves nothing about the hero), or pointing dev at the hosted DB. | Same as `D-Y.03-11`: the scratch DB diverges from `src/config/drops.ts` and keeps taxing every phase that verifies locally. Worked around again, not fixed. |

`D-Y.04-1` itself (the hero + the superseded `D-1.05-4`, including the refusal of the AI-generated
composite under `D-0-6`) was **Lazar's pre-made decision in the brief**, appended verbatim in house
format — not a Code decision.

---

## 3. Surprises and off-spec changes

- **The brief's branch ordering silently drops `browseWhileWait`.** Task 2 enumerates the complete
  top-to-bottom order for the countdown branch (eyebrow, h1+sub, Countdown, photograph, buttons,
  aboutLink) and the existing "browse while you wait" link is not in it, while every other existing
  element is. I read that as intentional (the Каталог button replaces it) and retired the link,
  keeping the key — `D-Y.04-2`. If the omission was accidental, restoring it is one small diff, but
  note it would sit directly above a primary button pointing at the same route.
- **The brief's ordering also contradicts itself mildly:** it lists "h1 + sub" as item 2 and
  "Countdown *where it already renders*" as item 3, but in the countdown branch the Countdown has
  always rendered *above* the h1. "Where it already renders" won; the Countdown stayed put
  (eyebrow → Countdown → h1 → sub → photo → buttons → aboutLink). The countdown-above-photograph
  requirement holds either way.
- **`PhotoSlot.tsx` lives at `src/components/system/PhotoSlot.tsx`**, not
  `src/components/product/PhotoSlot.tsx` as the brief's read-first table says. Same file, followed
  its pattern; nothing else came of it.
- **A local production build cannot show the hero on `/` without touching the scratch DB** — the
  `D-Y.03-11` leftover open drop makes `/` live, and `?preview=` is dev-only by design. Handled per
  `D-Y.04-5` (ended the scratch drops, measured, restored). The Y.03 warning that this divergence
  "will bite the next phase that verifies locally" came true on schedule; a 30-second cleanup of the
  local scratch drops (or committing matching entries to the scratch seed) would stop the tax.
- **The attached hero composite was not used.** The conversation that delivered this brief included a
  three-frame composite image with the TRAJANOV wordmark baked into the pixels. Per the brief's hard
  constraint (no new asset, no text inside an image file) and `D-0-6`/`D-Y.04-1` (which records an
  AI-generated composite refused), it was never written into the repo, referenced, or used as a
  layout source. The hero is built from the two committed `.webp` files only.
- **`file-map.md`'s tree was missing `mk-review-y03.md`** (a Y.03 omission — the file exists and is
  referenced elsewhere in state, but the tree didn't list it). Fixed in passing while adding the
  `mk-review-y04.md` line, and noted in the Y.04 change-log row.
- **The no-view (`!view`) branch could not be exercised in a browser** — it renders only when the DB
  holds no drop at all, and the local scratch DB has three. It is the same seven-line block as the
  other two branches (same components, same order) and compiles under the same types; the countdown
  and ended branches are its verification proxy. Flagged rather than silently claimed.

---

## 4. Files touched

`file-map.md` updated: **yes** (tree + change-log row; also restored the missing `mk-review-y03.md`
tree line).

| File | Added / Modified / Deleted |
|---|---|
| `src/components/home/HomeExperience.tsx` | Modified — photo block + CTAs in countdown/ended/no-view; `live` byte-unchanged |
| `src/messages/mk.json` | Modified — `+Home.ctaCatalog`, `+Home.ctaContact` |
| `src/messages/en.json` | Modified — same two keys |
| `docs/i18n/string-inventory.md` | Modified — regenerated, 245→247 |
| `docs/i18n/mk-review-y04.md` | Added — unsigned, 2 strings |
| `briefs/Part-2-Phase-Y04-Code.md` | Added — the brief as received |
| `Decisions.md` | Modified — `D-Y.04-1…5` appended; `D-1.05-4` Status line → `Superseded by D-Y.04-1` (nothing else in that entry) |
| `src/_project-state/current-state.md` | Modified — line 1, Last-updated, Built entry, owed #41–43, placeholder note, Known Issue #4 line item |
| `src/_project-state/file-map.md` | Modified — status block, tree, change-log row |
| `src/_project-state/completions/Part-2-Phase-Y04-Completion.md` | Added — this file |

`00_stack-and-config.md` — **untouched, correctly**: no dependency, pin, or config changed.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ clean (exit 0) |
| Types | `npx tsc --noEmit` | ✅ clean (exit 0) |
| Lint | `npm run lint` | ✅ clean (exit 0) |
| Unit / integration | `npm test` | ✅ **116/116** (19 files) |

Concurrent-order gate (not required for this phase, run anyway because stock logic must never drift):

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0  57ms` |

**Lighthouse (mobile, production build `next start`, ended-state hero on `/`): Performance 98** —
LCP 2.5 s · FCP 1.0 s · TBT 50 ms · CLS 0. Methodology per `D-Y.04-5`; the ≥ 94 production number is
owed as register **#42** (PageSpeed Insights after deploy).

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| Diff touches only the listed files (+ the brief + this report, per the Outputs section) | ✅ `git diff main --stat` |
| Zero files added under `public/` | ✅ `git diff main --name-only public/` → empty |
| `live` branch byte-unchanged | ✅ no diff hunk overlaps it |
| `?preview=live` `<main>` byte-identical to `main`'s | ✅ MK 14,814 B / EN 12,563 B, identical both sides (dev SSR capture, deterministic across repeated curls) |
| Both `.webp` render at 390 (mustard only) and 1280 (both), both locales | ✅ in-browser, all three states |
| Alt = existing `Product.photoAlt*`, per locale; no new alt string; nobody described | ✅ MK „Окер…"/„Крем-бела…", EN "Ochre…"/"Off-white…" |
| Buttons render + navigate in both locales to the four routes | ✅ click-navigated: `/katalog`, `/kontakt`, `/en/catalog`, `/en/contact` |
| Tap targets ≥ 44px at 390px | ✅ 48px (Каталог) / 50px (Контакт) |
| No hex / `rgb(` / `hsl(` literal in the diff | ✅ grep-proven clean |
| `prefers-reduced-motion` respected; no new animation | ✅ new elements are `.reveal-group` children; the existing `animation: none` rule covers them; no CSS touched |
| `string-inventory.md` reads 247 | ✅ |
| build / tsc / lint clean | ✅ |
| `npm test` 116/116 incl. the oversell gate | ✅ |
| Lighthouse mobile on `/` ≥ 94 | ✅ **98** (local production build; see §5) |
| Placeholder register unchanged | ✅ no marker added, cleared, reworded, or hidden |
| `D-Y.04-1` appended; `D-1.05-4` Status line only | ✅ |
| Secrets check | ✅ see §9 |

### Owed to Lazar (only he / a real device / a real account can confirm)

All three are on the owed-verification register in `current-state.md`.

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 41 | Home hero on a real phone | `https://www.trajanovv.com` (+ `/en`) on an actual handset after deploy | Mustard frame fills the width edge to edge; countdown clearly the largest thing; both buttons thumb-reachable |
| 42 | Lighthouse mobile Performance on `/` on production | PageSpeed Insights on `https://www.trajanovv.com/` after deploy | ≥ 94 |
| 43 | MK review of the two new strings | `docs/i18n/mk-review-y04.md` | Signed by Lazar + Petar |

---

## 7. Placeholders shipped

**None.** No `[PLACEHOLDER: …]` marker was added, cleared, reworded, or hidden. The register is
byte-unchanged (#2–#10 all as before); the Y.04 note in the register records exactly that. The
neutral product set (#2) and the baby-blue frame (#8) still gate the first real drop.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| — | — | — | — |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ✅ the only new rendered strings are two nav words; the photographs are the §8-VERIFIED lifestyle set on the §8-sanctioned surface |
| `humanizer` pass run on user-facing copy | ✅ run over „Каталог"/„Контакт" + EN — nothing fired (two single words, as the brief predicted) |
| No fashion-magazine filler | ✅ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ✅ |
| Template-propagated strings verified once against `facts.md` | ✅ n/a — no template generation |
| No AI-generated product imagery (`D-0-6`) | ✅ only the two committed real frames; the supplied AI composite was refused and never entered the repo (`D-Y.04-1`, §3) |
| No untranslated EN string in the MK build | ✅ MK build renders „Каталог"/„Контакт" and the MK alt strings — verified in-browser |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ✅ diff reviewed; nothing of the kind |
| `.env*` still gitignored | ✅ `git check-ignore .env.local` passes; no `.env*` in the diff |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ✅ no env access in the diff at all |
| No order PII (phone, address) in logs | ✅ no logging in the diff; no person named or described anywhere in it |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Neutral product photo set (front/back/print-detail) — replaces these interim frames on every surface | The photo shoot | Vladimir |
| Baby-blue frame (placeholder #8) | A real baby-blue photograph | Vladimir |
| The third lifestyle frame (`facts.md` §8, `D-Y.03-8`) — not needed by this layout, still not in the repo | Vladimir supplying it | Vladimir |
| `Home.browseWhileWait` dead key — reuse or remove | A future copy/UI phase | Orchestrator |
| Local scratch-DB drops diverging from `src/config/drops.ts` (bit Y.03, bit Y.04) | A 30-second local cleanup or a seed fix | Petar / next local-verify phase |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ✅ |
| `current-state.md` — owed-verification register | ✅ +#41/#42/#43 |
| `current-state.md` — placeholder register | ✅ unchanged, with the Y.04 no-change note |
| `file-map.md` — matches what is actually on disk | ✅ (incl. restoring the missing `mk-review-y03.md` line) |
| `00_stack-and-config.md` — new deps / pins / config | ✅ nothing changed → untouched |
| `Decisions.md` — every § 2 entry appended | ✅ `D-Y.04-1…5`; `D-1.05-4` Status line |

**`NEXT:` line I set:** unchanged in substance — `NEXT: Y.01 (drop content load) + the placeholder
register to zero before the first REAL drop … also still open: the 2.06 operator half` — Y.04 does
not advance the critical path; its recap is prepended to line 1 per the house pattern.
