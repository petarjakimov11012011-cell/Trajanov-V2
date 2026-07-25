# Completion report — Part 2 Phase 20: Wordmark shine — white, not mustard

> **⚠️ ONE NUMBER IN THE BRIEF IS WRONG — read this first.**
> The brief (and `D-2.20-1`, which I logged **verbatim** as instructed) states that white is
> **18.4:1** on `--color-ground`. Recomputed with the same WCAG 2.2 relative-luminance formula that
> reproduces **every other** number 2.19 recorded — 15.42, 10.84, 11.16, 7.84 and the composited
> `#352D18` backdrop, all to the digit — pure white on `#0F1210` is **18.85:1**, not 18.4:1.
> `brand.md`'s contrast ledger records the measured **18.8**; `Decisions.md` keeps the brief's text
> untouched, because a decision log is a record of what was decided, not a place to correct
> arithmetic. Nothing about the decision changes: both values clear AA by a factor of four, and the
> phase's pass condition (**band ≥ the resting 15.42:1**) is met either way.

| | |
|---|---|
| **Phase** | 2.20 |
| **Name** | Wordmark shine — white, not mustard |
| **Executor** | Claude Code |
| **Operator** | Petar (Lazar reviews) |
| **Date** | 2026-07-25 |
| **Branch** | `phase-2.20-wordmark-shine-white` |
| **PR** | to `main`, **not self-merged** (`D-0-3`) |
| **Brief** | Part-2-Phase-20-Code (wordmark shine: white, not mustard) — supplied in-session |

---

## 1. What shipped

- **The wordmark sweep is now white light instead of brand yellow.** Hover or tab onto TRAJANOV and a
  band of pure white crosses the letters once. It reads as a reflection passing over the mark rather
  than as a mustard tint, which is what Lazar was reacting to.
- **It brightens the letters instead of darkening them.** This is the substance of the phase, not a
  taste change. 2.19's band centre measured **10.84:1** against a resting glyph at **15.42:1** — the
  sweep was a *shadow with a colour cast*. White measures **18.85:1**, so the mark gets brighter as the
  band passes and never dips below its resting colour (`D-2.20-2`).
- **One new token, one changed gradient stop.** `--color-shine: #FFFFFF` in `:root`, and the gradient's
  centre stop went from a `color-mix` of `--color-mustard` to `var(--color-shine)`. That is the entire
  functional diff.
- **Everything else about the effect is byte-unchanged.** Geometry, timing, guard, triggers, iteration
  count, `linear`, `--motion-shine`, the reduced-motion rule — all exactly as 2.19 shipped them.
  `SiteHeader.tsx` has **zero** changed lines.
- **`D-2.19-6` is closed.** The `linear` easing is ratified as `D-2.20-3`; the "ratify or strike" item
  that was sitting in owed row **#36** is marked ratified and no longer owed.

---

## 2. Decisions I made on my own

**None.** All three decisions (`D-2.20-1`, `D-2.20-2`, `D-2.20-3`) were pre-made by the orchestrator in
the brief and appended to `Decisions.md` verbatim. This is a genuinely zero-judgement phase: the brief
specified the token, its value, its placement, the single stop to change, and what not to touch. That
is unusual and worth naming rather than padding the table.

**Two implementation choices inside what the brief authorised, so not stand-alone decisions — but
flagged because both are visible in the diff:**

1. **I rewrote the colour paragraph in the `.wordmark-shine` documentation comment.** It said *"the
   travelling band is a color-mix of `--color-mustard` into it … Mustard is 9.0:1 on ground"*, which is
   (a) no longer true and (b) a `--color-mustard` reference inside the block, which the phase's own grep
   gate forbids (*"no remaining reference to `--color-mustard`"*). The brief's "nothing else in that
   block's prose changes" reads to me as scoping the **rule block's** inline comments (the `linear` /
   one-sweep note), not licensing the file to document something false. The replacement paragraph states
   the same facts about the new colour, plus why 2.19's version darkened. **If the orchestrator intended
   the older paragraph to stay, it is a single-hunk revert** — but then the grep gate cannot pass.
2. **I added the one authorised sentence** noting `D-2.20-3` ratified `linear`, in the comment above that
   line, exactly as the brief permitted ("may gain a sentence").

No other comment, declaration, or token moved.

---

## 3. Surprises and off-spec changes

- **The brief's 18.4:1 is arithmetically low — it is 18.85:1.** Covered in the banner above. Worth the
  orchestrator's attention only because the number appears in three places (brief prose, `D-2.20-1`, the
  `brand.md` ledger row) and they now deliberately disagree: the decision log preserves the brief's text,
  the ledger records the measurement. `brand.md` §3 opens with *"Every pair below was computed, not
  eyeballed"*, so the ledger is the one that had to be right.
- **Removing the `color-mix` also removed a whole emitted fallback branch.** 2.19's report flagged that
  Lightning CSS emitted the gradient twice — once with a plain `var(--color-mustard)` stop and once
  inside `@supports (color: color-mix(in lab, red, red))`. With a plain token stop there is no
  `color-mix` left in the block, so the served CSS now carries the gradient **once**. Anyone diffing the
  built bundle against 2.19's will see a block disappear; that is expected, not a regression.
- **The white glint is measurably subtler than the mustard one, exactly as `D-2.20-2` predicted.** The
  visible step is 15.42 → 18.85 (a ~1.22× luminance-contrast step) where 2.19's was 15.42 → 10.84 in the
  other direction (a much larger *visual* delta, because it also shifted hue). In the paired screenshots
  the change is unmistakable — the mustard tint is gone — but the *brightening* itself is gentle. **This
  is the accepted downside, not a defect, and I did not tune band width or duration to compensate**
  (hard stop #1). If Lazar wants more punch, that is an operator call and its own phase. Owed **#37(a)**.
- **The Browser pane's compositor clock freezes between calls, which broke real scrolling.** Scrolling
  with `window.scrollTo` left the sticky header painting at the wrong offset with ghosted layers, and a
  `computer` scroll timed out at 30s. I stopped fighting it and set `data-scrolled="true"` on `<header>`
  directly with `transition: none`, which is legitimate here because `data-scrolled` **is** the styling
  switch (`D-2.17-2`) — the pill's computed `max-width 768px` / `radius 14px` / `blur(12px)` /
  `--color-ground-translucent` and the wordmark's scrolled rect `281,31,135.039,24` all match 2.19's
  recorded values exactly. Recommend future UI briefs name this technique instead of asking for a scroll.
- **`getAnimations()` is empty by the time a JS call lands after a `computer` hover.** The sweep is
  900ms, `fill: none`, one iteration — it has already finished and dropped its animation object. Restart
  it deterministically inside the same JS call (`animationName='none'` → reflow → `animationName=''`),
  then `pause()` and set `currentTime`. Same Web Animations method 2.19 used, with one extra step.
- **The Next dev-overlay portal steals the first two Tab presses**, so `Tab`-to-wordmark measured the
  overlay, not the link. Removing `<nextjs-portal>` from the DOM first fixes it. Keyboard modality
  persists afterwards, so a subsequent programmatic `.focus()` still matches `:focus-visible` — that is
  how I measured focus state on five route/locale/width combinations cheaply.
- **The pane's locale resets to EN on any `/en` navigation.** Same trap 2.19 hit. Every MK measurement
  below was taken with `document.documentElement.lang` asserted in the same call that took it.
- **`main` had not moved.** Base was `8f063e1` (the PR #31 record). Clean base, no other phase branch open.

---

## 4. Files touched

`file-map.md` updated: **no** — no file was added, moved, or deleted that the tree tracks (the tree lists
the `completions/` directory, not each report).
`00_stack-and-config.md`: **no change** (no dependency, no config, no pin).

| File | Added / Modified / Deleted |
|---|---|
| `src/app/globals.css` | Modified (**1 new `:root` token block; 1 changed gradient stop**; 2 comment-only edits — see §2) |
| `brand.md` | Modified (§3: token row, scoped-exception note, contrast-ledger row; §6: `D-2.19-1` paragraph mustard → white) |
| `Decisions.md` | Modified (appended `D-2.20-1…3`) |
| `src/_project-state/current-state.md` | Modified (2.20 Status block; owed **#37**; row **#36**'s `D-2.19-6` item marked ratified; `NEXT:` byte-unchanged) |
| `src/_project-state/completions/Part-2-Phase-20-Completion.md` | Added (this file) |

**`src/components/layout/SiteHeader.tsx`: zero lines.** `git diff main --` on it is empty, as required.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ exit 0 — "✓ Compiled successfully in 2.2s", full route tree |
| Types | `npx tsc --noEmit` | ✅ exit 0 |
| Lint | `npm run lint` | ✅ exit 0, clean |
| Unit / integration | `npm test` | ✅ **116/116** (19 files), unchanged count — no test file touched |

**Concurrent-order gate:**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 49ms` |

---

## 6. Definition of Done

### Verified here (by me) — gates

| Item | Result |
|---|---|
| `npm run build` / `npx tsc --noEmit` / `npm run lint` all exit 0 | ☑ |
| `npm test` **116/116**, unchanged, incl. the 10-vs-3 oversell gate | ☑ |
| `git diff main -- package.json package-lock.json src/messages/ src/components/layout/SiteHeader.tsx` is **empty** (0 lines) | ☑ |
| `git diff main --stat` is **one file**: `src/app/globals.css` (+17 / −7), i.e. one added token block, one changed gradient stop, two comment edits | ☑ |
| Nothing in the `.wordmark-shine` rule, `@keyframes`, `@property` or the reduced-motion block moved — verified in the diff **and** in the served CSS bytes | ☑ |
| `grep` over the wordmark section: **no** literal hex, **no** `rgb(`, **no** `hsl(`, **no** `--primary`, **no** remaining `--color-mustard` | ☑ |
| `brand.md` and `globals.css` `:root` agree on `--color-shine` = `#FFFFFF` (checked, not assumed) | ☑ |
| `--color-glow`, `--color-mustard`, `--color-foreground` and every other colour token unchanged (`--color-glow` still `color-mix(… --color-foreground 100% …)`, read back in-browser) | ☑ |
| `facts.md` untouched; placeholder register unchanged; no new user-facing string | ☑ |
| Line 1 of `current-state.md` byte-unchanged (md5 of line 1 identical to `main`) | ☑ |

**Served-bytes check first, measurement second.** 2.19 documented Turbopack serving stale CSS across an
edit to `globals.css`, which would have let me "verify" the old colour. Before any in-browser reading I
`curl`ed the emitted chunk and confirmed it carries `--color-shine: #fff` and
`var(--color-shine) var(--wordmark-x)`, with the guard, keyframes, `@property` and reduced-motion rule
unchanged. `.next` was cleared and the dev server restarted before that check.

### Rendered and measured in-browser (both locales, 320/390/768/1024/1280; Home, Catalog, Checkout)

| Item | Result |
|---|---|
| Hovering runs **one** white band across the letters (~0.9s) and stops — no loop | ☑ `duration 0.9s`, `iteration-count 1`, `fill none`, `direction normal`, `delay 0s`, `timing linear` |
| **The band brightens, it does not darken** — the phase's proof condition | ☑ **band centre computes `rgb(255, 255, 255)` = 18.85:1 on `--color-ground`**, against the resting glyph's **15.42:1**. Pass threshold was ≥ 15.4:1. 2.19's band centre was `#E6BF75` = **10.84:1** |
| Every painted pixel is between the two stop colours, so the sweep cannot dim the mark anywhere | ☑ gradient is `linear-gradient(100deg, rgb(236,232,224) 26%, rgb(255,255,255) 50%, rgb(236,232,224) 74%)` at t=450ms — only `#ECE8E0` → `#FFFFFF`, i.e. **15.42:1 → 18.85:1** |
| Contrast over the **scrolled pill on the mustard live banner** (2.19's worst case, then 7.84:1) is **≥ 11.16:1** | ☑ **13.64:1**, against a resting **11.16:1** on the same composited `#352D18` backdrop — now *above* the resting value, where 2.19 was below it |
| Frame table (`linear`, 900ms), paused and seeked: `-40%` @0 · `-20%` @100 · `0%` @200 · `20%` @300 · `50%` @450 · `80%` @600 · `100%` @700 · `120%` @800 · `136%` @880 | ☑ identical to 2.19 — timing untouched |
| `getBoundingClientRect()` identical at rest, mid-sweep and after | ☑ **`89,23,135.039,24`** at all nine seeked frames at scroll-top (2.19 recorded the same); **`281,31,135.039,24`** scrolled (2.19 the same). Nothing reflows |
| `<header>` computes `transform / filter / backdrop-filter: none` | ☑ plus `will-change: auto`, `contain: none` — on Home, Catalog and Checkout, both locales (2.17 hard stop #2) |
| Tab to the wordmark: white sweep fires **and** the `#F2C55A` focus ring still renders | ☑ with the mouse parked elsewhere (`:hover` false, `:focus-visible` true): `box-shadow … rgb(242, 197, 90) 0px 0px 0px 2px` present at rest **and** mid-sweep, alongside the white gradient |
| Sweep still visible inside the scrolled pill | ☑ pill state `max-width 768px`, `radius 14px`, `blur(12px)`, `background color(srgb … / 0.82)`; the white sweep runs in it (screenshot below) |
| Overlay wordmark at 390 still unanimated (the `hover: hover` guard untouched) | ☑ both `.wordmark-shine` elements (bar + overlay) report `background-image: none`, `animation-name: none`, `0` animations, `color`/`-webkit-text-fill-color` = `rgb(236,232,224)`. Overlay opens `role="dialog"`, focuses **Close**, locks body scroll |
| `prefers-reduced-motion: reduce`: no sweep, no flash, no single-frame flicker | ☑ *by CSSOM + simulation* — **exactly two** `.wordmark-shine` rules exist: the `(hover: hover) and (pointer: fine)` one and the `(prefers-reduced-motion: reduce)` one, the latter **second** so it wins on source order at equal specificity, setting `-webkit-text-fill-color: currentcolor` + `background-image: none` + `animation: none`. Injecting those exact declarations gives a focused wordmark with **zero** animations and plain `rgb(236,232,224)`. The pane cannot toggle real DevTools emulation → live read owed **#37(d)** |
| The `hover: hover` guard **observed** on a coarse pointer | ☐ — **not possible**: the pane reports `(hover: hover) and (pointer: fine)` at every width and has no coarse-pointer emulation. Guard verified in served CSS + CSSOM. Owed **#37(c)** |
| No horizontal overflow at 320 / 390 / 768 / 1024 / 1280, in both header states | ☑ `documentElement.scrollWidth ≤ innerWidth` at every width, at scroll-top and with the pill applied |
| Zero **new** console errors | ☑ console buffer contains only HMR / React-DevTools notices. The dev overlay shows "1 Issue" on **MK routes only**, consistent with the documented `ProductCard.tsx:59` MK price hydration mismatch — **pre-existing, recorded unchanged, not fixed**; that file is byte-unchanged |
| Screenshots, paired against their 2.19 equivalents | ☑ — see below |

**Screenshots.** The 2.19 "before" shots were captured **from this branch's parent commit, in the same
pane, at the same viewport and the same seeked frame (t = 450ms)** before the edit — so each pair differs
in exactly one thing. Three pairs: **MK 1280 mid-sweep**, **MK 1280 scrolled (pill) mid-sweep**, **EN 1280
mid-sweep**. In every "before" the middle glyphs read visibly mustard; in every "after" they read white.
They live in the session transcript, not the repo — consistent with 2.15–2.19, which also did not commit
image files.

### Owed to Lazar (only he / a real device can confirm)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 37 | White wordmark-shine sign-off | `https://www.trajanovv.com` and `/en`, on a desktop **with a mouse** and on a **real phone** (ideally OLED), at the top of the page and scrolled | Hovering or tabbing onto TRAJANOV runs **one** band of **white** light (~0.9s) and stops, and the letters go **brighter**, never yellower and never darker. **(a)** Does the subtler white glint still read? If it needs more punch that is an operator call about band width or duration — **not** something I may tune (hard stop #1). **(b)** OLED bloom: confirm the white band does not halo or smear on a real handset (`D-2.20-1`'s accepted downside). **(c)** On a phone, tapping the wordmark shines **nothing** and leaves no stuck hover state. **(d)** With "Reduce Motion" on: no sweep, **no flash**, no flicker — plain off-white wordmark |

**Row #36 (2.19) is amended, not duplicated:** its `D-2.19-6` ratify-or-strike item is marked **RATIFIED
as `D-2.20-3` — closed**, and the row now points at #37 for the colour-dependent parts. Its remaining
scope is the real-device feel, the touch read and the live reduced-motion read, which #37 carries forward.

---

## 7. Placeholders shipped

**None.** This phase adds no `[PLACEHOLDER: …]` and clears none. Placeholder register **unchanged**.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to VERIFIED in `facts.md` | ☑ (`facts.md` byte-unchanged; a gradient makes no factual claim) |
| `humanizer` pass run on user-facing copy | n/a (no user-facing copy changed) |
| No fashion-magazine filler | ☑ (no copy) |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` | n/a (no string added) |
| No AI-generated product imagery (`D-0-6`) | ☑ |
| No untranslated EN string in the MK build | ☑ (zero string change — catalogs byte-identical, 243 keys) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ (none added) |
| No order PII in logs | ☑ (no logging added) |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| White-shine real-device feel; the subtlety call; the OLED bloom read; touch-device inertness; live reduced-motion read (**#37**) | Deploy + a phone + a desktop mouse | Lazar / Petar |
| Safari/WebKit confirmation that `background-clip: text` renders the sweep correctly | An actual WebKit engine — the pane is Chromium (same limit as owed #33) | Lazar |

Nothing blocks the merge. Both are post-deploy confirmations, consistent with every out-of-band UI phase
since 2.13.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ **byte-unchanged** (md5 of line 1 identical to `main` — verified, not assumed) |
| `current-state.md` — owed-verification register | ☑ **+1: #37** (the register stood at #36 after 2.19), **and row #36's `D-2.19-6` item marked ratified/closed** |
| `current-state.md` — placeholder register | ☑ unchanged (zero diff lines touch it) |
| `file-map.md` — matches disk | ☑ (no tree change) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (unchanged — none) |
| `Decisions.md` — every § 2 entry appended | ☑ (`D-2.20-1…3`, appended verbatim, append-only; nothing edited or deleted) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (2.20 is
out-of-band and does not advance the critical path).
