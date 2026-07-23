# Completion report — Part 2 Phase 2.10: Product-card pointer spotlight (subtle white glow)

| | |
|---|---|
| **Phase** | 2.10 |
| **Name** | Product-card spotlight — subtle white glow |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-23 |
| **Branch** | `phase-2.10-card-glow` |
| **PR** | [#22](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/22) — **MERGED** to `main` (merge `8524198`, 2026-07-23, on Petar's explicit instruction, `D-0-3`); branch deleted. **Production deploy VERIFIED** on `www.trajanovv.com` (deployed CSS grep-matches the build; `.spotlight-card` rule applies under the fine-pointer media query on `/en/styleguide`; sold-out card has no glow). |
| **Brief** | `briefs/Part-2-Phase-10-Code.md` |

---

## 1. What shipped

- **The interactive product card now has a subtle white spotlight that follows the pointer.** Hover a
  card (fine pointer only) and a soft wash of the off-white foreground token lights the surface under
  the cursor, plus a 1px edge-light on the card's border nearest the pointer. It fades in/out; it does
  not move the card a pixel.
- **Keyboard users get the same affordance** — the glow also reveals on `:focus-visible`, resting at a
  well-defined top-centre default, while the existing focus ring is untouched.
- **Sold-out cards do not glow** — only the interactive `<Link>` branch is wrapped; the non-interactive
  sold-out card is byte-unchanged.
- **Touch devices get nothing** — the whole effect (paint *and* the pointer listener's work) is gated to
  `@media (hover: hover) and (pointer: fine)` and a mouse-only guard, so a phone renders and listens for
  nothing.
- **No new colour, dependency, string, or commerce logic.** Four design tokens were added (one colour +
  three numbers), all mirrored in `brand.md` and `globals.css`; every value in the effect is a token.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.10-1` | Ship the pointer glow as a **logged, narrow exception** to `brand.md` §5 (decoration) + §6 (motion); off-white `--color-glow` token, hover/focus, fine-pointer only; add a carve-out sentence to §5 and §6. *(Pre-decided in the brief, decision C — logged here as required.)* | Add the glow without touching `brand.md` (reads as an un-owned rule violation); pure `#FFFFFF` (a second, cooler white); a coloured glow. | Two brand rules now each carry a documented exception; one decorative motion-bearing effect must stay scoped. |
| `D-2.10-2` | **Rewrite** the supplied 21st.dev `GlowCard` from scratch rather than paste it; each of its six problems resolved. *(Pre-decided in the brief — logged here.)* | Paste + patch it (drags in the document listeners, injected global CSS, hardcoded colours). | We own the effect code rather than a third-party component. |
| `D-2.10-3` | The border-mask sentinel is `linear-gradient(var(--color-foreground),…)` — an **opaque token** — not the brief's literal `linear-gradient(#000,#000)`, to satisfy the DoD's "zero literal hex" gate while keeping every value a token. A mask reads only alpha, so it is functionally identical. | Keep `#000` (fails the hex grep); use the `black` keyword (dodges the grep but is still a hardcoded colour); `currentColor` (ties the mask to inherited text colour for no benefit). | A reader must know the mask sentinel is an alpha-only stencil, not a visible colour (noted in a code comment). |

*None of these is silent — the orchestrator should ratify all three, especially `D-2.10-1` (the brand-rule
exception) and `D-2.10-3` (the deviation from the brief's literal Task 3 text).*

---

## 3. Surprises and off-spec changes

- **Task 3 vs the DoD contradicted each other on the mask colour.** Task 3 writes the border mask as
  `linear-gradient(#000,#000)`, but the DoD requires **zero literal hex/`rgb()`/`hsl()` in `git diff main`**
  and the CSS rule "every colour comes from a token." `#000` is a hex literal. I resolved it with the
  opaque `--color-foreground` token as the mask sentinel (alpha is all a mask uses — identical result),
  logged `D-2.10-3`. The orchestrator may want to fix the brief's Task 3 snippet so the next reader isn't
  caught by the same conflict.
- **The DoD says `npm test` "85/85"; the repo is at 93.** Phase 2.09 added 8 size-order cases after this
  brief was written, so the real, correct count is **93/93** (still including the 10-vs-3 oversell gate).
  Not a defect — the brief's number is just stale.
- **`brand.md`'s "motion belongs to the countdown and the drop reveal, nothing else" sentence lives in §2
  (Direction), not §6.** Decision C attributes it to §6. §6 (Motion) is the correct home for a motion
  carve-out, so I added the carve-out sentence there (and it references the §2 direction line it excepts);
  I did not edit §2, which is outside the brief's stated §5/§6 edit scope.
- **A pseudo-element z-index was needed beyond the brief's literal CSS list.** The card body (`inner`) has
  an opaque `bg-surface`, so the glow pseudo-elements must paint **above** it to be visible. I set
  `.spotlight-card { position: relative; z-index: 0 }` (its own stacking context, so a card's glow can
  never bleed over a neighbour) and `z-index: 1` on the pseudo-elements. This is structural plumbing the
  brief's property list didn't enumerate but the effect requires; it does not clip the badge (`overflow`
  stays `visible`; the wash is 5% and the edge is a 1px ring, neither obscures the `left-2 top-2` badge).
- **`getComputedStyle` under-reports `:focus-visible` for the descendant pseudo in the automation browser.**
  It correctly reported the Link's own focus-ring box-shadow but returned `opacity: 0` for the
  `:focus-visible > .spotlight-card::after`. A temporary red-`::after` probe proved the reveal *does* render
  on keyboard focus (the focused card filled red, the other did not). Worth noting so a future verifier
  doesn't mistrust a working effect because of the computed-style read.

---

## 4. Files touched

`file-map.md` updated: **yes.**

| File | Added / Modified / Deleted |
|---|---|
| `src/components/product/SpotlightCard.tsx` | Added |
| `src/app/globals.css` | Modified (4 tokens in `:root`; `--color-glow` in `@theme inline`; `.spotlight-card` block) |
| `brand.md` | Modified (§3 `--color-glow`; §5 Spotlight table; §5 + §6 carve-out sentences) |
| `src/components/product/ProductCard.tsx` | Modified (interactive branch wraps `inner` in `<SpotlightCard>`) |
| `Decisions.md` | Modified (`D-2.10-1`, `D-2.10-2`, `D-2.10-3`) |
| `src/_project-state/current-state.md` | Modified (2.10 status block; owed register #23; `NEXT:` line unchanged) |
| `src/_project-state/file-map.md` | Modified (tree + change-log row) |
| `src/_project-state/00_stack-and-config.md` | Modified (change-log row: new tokens, no new dep) |
| `briefs/Part-2-Phase-10-Code.md` | Added (faithful brief copy) |
| `src/_project-state/completions/Part-2-Phase-10-Completion.md` | Added (this file) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ exit 0 — "Compiled successfully" |
| Types | `npx tsc --noEmit` | ✅ clean |
| Lint | `npm run lint` | ✅ clean (no errors/warnings) |
| Unit / integration | `npm test` | ✅ **93/93** (18 files) |

**Concurrent-order test (mandatory even though no commerce code changed):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 59ms` |

This phase touched no stock/reservation/order code, but the gate was re-run and is green.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `SpotlightCard.tsx` exists, `'use client'`, listener on its own element only, rAF-throttled writes | ✅ |
| `grep -rn "document.addEventListener\|window.addEventListener" src/components/product/` → nothing | ✅ (NONE) |
| `ProductCard.tsx` still has no `'use client'` — still a server component | ✅ |
| Sold-out branch of `ProductCard.tsx` unchanged; sold-out card shows no glow | ✅ (no `.spotlight-card` on the sold-out wrapper — confirmed on `/styleguide`) |
| `--color-glow`, `--glow-size`, `--glow-opacity-surface`, `--glow-opacity-edge` in **both** `brand.md` + `globals.css`, identical values | ✅ |
| `git diff main` contains zero literal hex / `rgb()` / `hsl()` colour values | ✅ **for the effect (CSS + component + token diff)** — mask sentinel is the `--color-foreground` token (`D-2.10-3`). *(The gate is a code gate: the only hex/`rgb()`/`hsl()` in the full `git diff main` is doc prose explaining the choice — incl. `D-2.10-3` and even the quoted gate text itself, which cannot be written without `rgb()`/`hsl()`.)* |
| Effect CSS in `globals.css`; `grep -rn "dangerouslySetInnerHTML" src/components/product/` → nothing | ✅ |
| Whole effect inside `@media (hover: hover) and (pointer: fine)` | ✅ (confirmed in compiled CSS) |
| `git diff --name-only main` touches none of `supabase/`, `src/lib/orders/`, `src/config/`, `src/messages/`, `facts.md`, `package.json`, `package-lock.json` | ✅ |
| Line 1 of `current-state.md` byte-identical to `main` | ✅ (verified with `git show main:… | diff`) |
| `npm run build` · `npx tsc --noEmit` · `npm run lint` clean | ✅ |
| `npm test` green incl. the oversell gate | ✅ 93/93 |
| Rendered + eyeballed (Task 6): glow tracks pointer, subtle, sold-out no glow, badges unclipped, focus ring unchanged, no pixel shift | ✅ (see below) |

**Task 6 — rendered + verified in-browser** (dev server; both locales; **375px + desktop**):
- **`/styleguide`** (available / low / sold-out row): 2 interactive cards carry `.spotlight-card`; the
  **sold-out card ("Product 03") has no `.spotlight-card` and no glow.**
- **Home live grid (EN)** + **`/katalog` (MK)** + **`/en/catalog`**: 2 spotlight cards each; the rule
  applies only under the fine-pointer media query (`position: relative`, `z-index: 0`, `--glow-x/y`
  default `50%/0%`, pseudo `border-radius: 14px` = `--radius-lg`, resting `opacity: 0`, `0.22s` transition,
  `::before` masked to a 1px border with `mask-composite: exclude`).
- **Hover reveal:** computed `::after`/`::before` opacity goes `0 → 1` on the hovered card **only** (no
  cross-card bleed).
- **Pointer tracking:** the `onPointerMove` handler writes `--glow-x`/`--glow-y` in px on move (observed
  changing from the `50%/0%` default).
- **Keyboard focus:** the **focus ring is unchanged and visible** (the Link still paints the `#F2C55A`
  ring via `focus-visible:ring-2 ring-focus-ring ring-offset-2 ring-offset-ground`), **and** the glow
  reveals via `:focus-visible > .spotlight-card` (proven with a temporary red-`::after` probe — the
  focused card filled red, the non-focused one did not; probe removed).
- **Badges unclipped:** wrapper `overflow: visible`; the low-stock „УШТЕ 4"/"4 LEFT" pill is fully visible
  at desktop and 375px.
- **No pixel shift:** the `.spotlight-card` wrapper is exactly the size of the card body
  (`wrapsInnerExactly` true); card dimensions identical hover vs. rest.
- **No horizontal overflow at 375px** (`scrollWidth == clientWidth == 375`); **no console or dev-server
  errors** on any of the four surfaces.

### Owed to Lazar

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 23 | **Glow sign-off (2.10).** | Desktop mouse on `https://www.trajanovv.com/katalog` and `/en/catalog`; then a **phone**. | The white spotlight follows the cursor and reads as a quiet wash (not a halo); sold-out cards don't glow; on a phone nothing sticks or flickers (touch gets nothing). Intensity is three token values (`--glow-size`, `--glow-opacity-surface`, `--glow-opacity-edge`) — dial up/down in one commit. **Hard stop: `--glow-opacity-surface` stays ≤ `0.10`** (ships at `0.05`; above that is an owner call). |

---

## 7. Placeholders shipped

**None.** This phase added zero user-facing strings and zero placeholders. The placeholder register is
unchanged (#2/#3/#4/#7 remain open from prior phases; still must reach zero before the first REAL drop).

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| *(none this phase)* | — | — | — |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ (no factual claim added — a decorative visual effect only) |
| `humanizer` pass run on user-facing copy | ☑ (n/a — zero user-facing copy) |
| No fashion-magazine filler | ☑ (n/a) |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` before generation | ☑ (n/a — no strings) |
| No AI-generated product imagery (`D-0-6`) | ☑ (a CSS glow, no imagery) |
| No untranslated EN string in the MK build | ☑ (no string added; MK `/katalog` rendered clean) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ (no env var added) |
| No order PII (phone, address) in logs | ☑ (no logging added) |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Glow intensity/feel sign-off + touch-device no-op confirmation (owed #23) | A human on a real desktop mouse + a real phone | Lazar |

Nothing is blocked. The one owed item is a subjective sign-off Code cannot perform.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (byte-identical to `main` — unchanged) |
| `current-state.md` — owed-verification register | ☑ (row #23) |
| `current-state.md` — placeholder register | ☑ (no change — nothing added) |
| `file-map.md` — matches what is actually on disk | ☑ |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (new tokens; no new dependency) |
| `Decisions.md` — every § 2 entry appended | ☑ (`D-2.10-1`, `D-2.10-2`, `D-2.10-3`) |

**`NEXT:` line I set:** *unchanged* — `NEXT: 2.06 operator half — the LIVE drop rehearsal on
`www.trajanovv.com` …` (this out-of-band UI phase does not touch line 1).
