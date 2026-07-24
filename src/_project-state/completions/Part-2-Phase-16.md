# Completion report — Part 2 Phase 16: Home hero reveal animation

| | |
|---|---|
| **Phase** | 2.16 |
| **Name** | Home hero reveal animation |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-25 |
| **Branch** | `phase-2.16-hero-reveal` |
| **PR** | #28 |
| **Brief** | `briefs/Part-2-Phase-16-Code.md` |

> Naming note: the brief specifies this report's path as `Part-2-Phase-16.md` (not the usual
> `-Completion.md` suffix). Followed the brief verbatim.

---

## 1. What shipped

- The Home hero now **reveals with a short staggered blur-in on first paint** instead of painting all
  at once. Each hero element fades up 0.75rem and un-blurs, 70ms apart, on `--motion-drop` (480ms) with
  `--ease-out`. In the **countdown** state the order is eyebrow → **countdown (lands at 70ms, before the
  headline)** → headline → sub → catalog link → about link; the last element starts at 350ms and the
  sequence finishes at 830ms (< 1s). This enforces the `brand.md` §2 hierarchy ("the countdown is the
  loudest object; everything defers to it").
- On the **live drop** the LIVE banner and the drop heading **paint solid and instantly**; only the
  product cards cascade (`D-2.16-5`). The **ended** state staggers its four children (banner → headline
  → sub → About link).
- **Reduced motion is honoured** — `.reveal-group > * { animation: none }` under
  `prefers-reduced-motion: reduce`, so every hero child renders in its final, fully-visible state on the
  first frame (the global reduced-motion rule alone would have left them invisible for the length of the
  stagger, because it flattens duration but keeps `animation-delay` and `animation-name`).
- It is **plain CSS** — no `motion`, no `framer-motion`, no wrapper elements, no new dependency. The
  reveal changes **zero DOM**: `Countdown.tsx`, `DropBanner.tsx`, `ProductCard.tsx` and the header are
  byte-unchanged, and the hero's rendered text is identical to `main` in both locales.

---

## 2. Decisions I made on my own

All five decisions for this phase were **pre-made by the orchestrator in the brief** and are appended
verbatim to `Decisions.md` (`D-2.16-1` … `D-2.16-5`). I made **no new scope/approach decision** — no
`D-2.16-6`.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.16-1 | Plain CSS `@keyframes`, not `motion`/`framer-motion` | Port `AnimatedGroup` + import `motion/react` | No spring bounce (`--ease-out` decelerates, never overshoots) |
| D-2.16-2 | One class on the container, target `> *` | A `<Reveal index>` wrapper component | Positional (`nth-child`) stagger — re-ordering children re-orders the animation |
| D-2.16-3 | Second §6 exception, capped to Home hero + live grid | Apply the reveal sitewide | `brand.md` §6 now carries two exceptions |
| D-2.16-4 | Three new tokens; duration reuses `--motion-drop` | A fourth `--motion-reveal` duration token | Code edits `brand.md` (Design's artifact; precedented) |
| D-2.16-5 | Live: class on the product grid, not the section | Stagger the whole live section | Live animates differently from countdown (deliberate) |

Two **method/placement notes** (not decisions — they change nothing about the shipped artifact) are in
§3.

---

## 3. Surprises and off-spec changes

- **CSS block placement.** Task 3 says "add the block after the `.spotlight-card` block." Since 2.11
  the FAQ disclosure block already sits after `.spotlight-card`, so I appended the reveal block at the
  **end of the file** (after both). That is still "after `.spotlight-card`," keeps the documented-block
  style, and has no behavioural effect (CSS order is irrelevant here — the selectors don't overlap).
- **Reduced-motion verification method.** The DoD asks to verify reduced motion via *DevTools →
  Rendering → Emulate `prefers-reduced-motion: reduce`*. The in-app Browser pane does not expose that
  DevTools media toggle, and page-context JS cannot force an emulated media feature. I verified the
  outcome two other ways instead: (a) confirmed the served stylesheet contains
  `@media (prefers-reduced-motion: reduce) { .reveal-group > * { animation: … none } }` (the `none`
  shorthand resets `animation-name`, so under emulation every child computes `animation-name: none`);
  and (b) demonstrated the behavioural result of `animation: none` by cancelling the WAAPI animations
  (equivalent to no animation / no fill) and reading computed styles — all six children compute
  `opacity: 1`, `transform: none`, `filter: none` on frame 1. A **live** reduced-motion check on a real
  device folds into owed **#31**.
- **Frozen animation timeline in the pane.** The Browser-pane tab is backgrounded
  (`document.hidden: true`, `document.timeline.currentTime: 0`), so CSS animations never advance on
  their own — they sit frozen at the `from` frame. I drove them deterministically with the Web
  Animations API (`getAnimations()[i].currentTime = …`) to read the start, a mid-frame (100ms), and the
  settled end, and to make the elements visible before each screenshot. This is a harness artifact, not
  a defect — the animations are correctly created (`playState: "running"`, six of them, correct
  name/delay/duration/fill/easing). The real-device *feel* is owed **#31**.

---

## 4. Files touched

Added / modified / deleted. `file-map.md` updated: **no** — no file was added, moved, or deleted (only
existing files edited), so the tree is unchanged.

| File | Added / Modified / Deleted |
|---|---|
| `brand.md` | Modified — §6 table +3 token rows; exception paragraph extended for `D-2.16-3` |
| `src/app/globals.css` | Modified — 3 tokens in `:root`; new `@keyframes`/`.reveal-group` block + reduced-motion override |
| `src/components/home/HomeExperience.tsx` | Modified — 4 `className` additions (`reveal-group`), nothing else |
| `Decisions.md` | Modified — appended `D-2.16-1` … `D-2.16-5` |
| `src/_project-state/current-state.md` | Modified — Status block + owed row #31; `NEXT:` line unchanged |
| `src/_project-state/completions/Part-2-Phase-16.md` | Added — this report |

`00_stack-and-config.md` — **no change** (no dependency, no config). `file-map.md` — **no change**.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **exit 0** — "✓ Compiled successfully in 3.0s", full route tree |
| Types | `npx tsc --noEmit` | **exit 0** |
| Lint | `npm run lint` | **clean** (exit 0, no output) |
| Unit / integration | `npm test` | **116 passed (116)**, 19 files — unchanged count |

**Concurrency gate (unchanged — no commerce code touched):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `npm run build` exit 0 | ☑ |
| `npx tsc --noEmit` exit 0 | ☑ |
| `npm run lint` clean | ☑ |
| `npm test` — 116/116, unchanged, incl. the 10-vs-3 oversell gate | ☑ |
| `git diff --name-only main` lists only `brand.md`, `globals.css`, `HomeExperience.tsx` + state/decision/report docs | ☑ |
| `git diff main -- package.json package-lock.json` empty | ☑ |
| `git diff main -- src/messages/` empty — catalogs stay at 243 keys | ☑ |
| `grep -rn "framer-motion\|AnimatedGroup\|TextEffect\|unsplash\|imagekit\|tailus" src/` returns nothing in shipped code | ☑ (only hit is pre-existing prose in `current-state.md` noting framer-motion is *unused* — not introduced here) |
| `grep -rn "from 'motion" src/` returns nothing — library unimported (`D-2.16-1`) | ☑ |
| No literal hex/`px`/`ms` inside the new reveal CSS block (every value a `var()`) | ☑ (the sole `70ms` literal is the `:root` token definition, like `--motion-drop: 480ms`) |
| `brand.md` §6 and `globals.css` `:root` carry the same three values | ☑ (`70ms` / `0.75rem` / `0.5rem`) |
| No `[PLACEHOLDER: …]` added; placeholder register unchanged | ☑ |
| `facts.md` untouched | ☑ (byte-unchanged) |
| No link/button/image/heading added/removed; Home rendered text identical to `main`, both locales | ☑ (`HomeExperience.tsx` diff is exactly 4 `className` additions — no DOM/text change) |

### Rendered and measured in-browser (dev server, both locales, 390 + 1280)

| Item | Result |
|---|---|
| **Countdown:** 6 children animate in order (eyebrow → countdown → headline → sub → catalog → about); last starts ~350ms, sequence ends 830ms (< 1s) | ☑ delays 0/70/140/210/280/350ms; mid-frame @100ms: eyebrow opacity 0.766, countdown 0.341, rest still at `from` — proves the countdown lands second |
| **Live:** LIVE banner + drop heading paint solid on frame 1 (`animation-name: none`), only cards cascade (`D-2.16-5`) | ☑ section children h1 + banner compute `animation-name: none`; grid's own `animation-name: none`; card children `trajanov-reveal` @0s/0.07s |
| **Ended:** 4 children stagger; About link last | ☑ banner/h1/p/about at 0/70/140/210ms; last child is the About `<a>` |
| After settle, every hero element's rect at 390 and 1280 identical to `main`'s (x/y/w/h to the pixel) | ☑ measured settled == class-removed base layout (== `main`, since `.reveal-group` adds only `animation` and no rule styles the parent): 390 MK, 1280 EN countdown, 1280 MK ended all `settledEqualsBase: true` |
| No layout shift; `scrollWidth == clientWidth` at 390 and 1280 | ☑ no horizontal overflow either locale/width; only opacity/transform/filter animate — none reflow |
| Countdown does not shift as digits tick | ☑ inherited — `Countdown.tsx` (byte-unchanged) uses `tabular min-w-[2ch]`; reveal animates the container only, not the digits |
| Reduced motion: every child computes `animation-name: none`, opacity 1, transform none, filter none on frame 1 | ☑ (see §3) — rule present in served CSS; `animation: none` behavioural outcome verified (all six opacity 1 / transform none / filter none). DevTools media toggle unavailable in pane → live confirmation owed #31 |
| Keyboard: focus ring visible on both links; focus never trapped on a `filter`ed element | ☑ both links `tabIndex 0`, focusable, `pointer-events: auto`, no inert ancestor; global `:focus-visible` ring (`2px solid var(--color-focus-ring)`) present |
| Console: zero new errors; the known `ProductCard.tsx:59` MK price hydration mismatch is inherited/unchanged | ☑ zero error-level messages in countdown/ended; `ProductCard.tsx` byte-unchanged (not in diff) |
| Screenshots: MK 390 countdown, MK 390 live, EN 1280 countdown, MK 1280 ended | ☑ captured (all seeked to settled for visibility) |

---

## 7. Placeholders shipped

**None.** This phase adds no `[PLACEHOLDER: …]` marker and clears none. The placeholder register is
**unchanged**.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| — | — | — | — |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ — no factual claim added; `facts.md` byte-unchanged |
| `humanizer` pass run on user-facing copy | n/a — no copy added or changed |
| No fashion-magazine filler | ☑ — no copy touched |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` | n/a — no strings |
| No AI-generated product imagery (`D-0-6`) | ☑ — no imagery; the rejected reference's night-background/mail2/logo-wall/Unsplash instruction were all left out of the diff |
| No untranslated EN string in the MK build | ☑ — no string added; MK build renders MK, EN build renders EN (verified both) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ — CSS + one className diff |
| `.env*` still gitignored | ☑ — untouched |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ — no env change |
| No order PII (phone, address) in logs | ☑ — no logging added |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Live reveal sign-off on a real phone, both locales (owed #31) | 2.16 deploy | Lazar + Petar |

Nothing blocked. `NEXT:` line unchanged — this out-of-band UI phase does not advance the 2.06 → Y.01
critical path.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ unchanged (verified — still the 2.06 line) |
| `current-state.md` — owed-verification register | ☑ +1 (#31) |
| `current-state.md` — placeholder register | ☑ unchanged |
| `file-map.md` — matches disk | ☑ no tree change (no file added/moved/deleted) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ no change (none) |
| `Decisions.md` — every § 2 entry appended | ☑ `D-2.16-1` … `D-2.16-5` verbatim |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …`
