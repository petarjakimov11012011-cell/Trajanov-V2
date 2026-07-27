# Completion report — Part 2 Phase 22: Showcase controls: chromeless

| | |
|---|---|
| **Phase** | 2.22 |
| **Name** | Showcase controls: chromeless |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-27 |
| **Branch** | `phase-2.22-showcase-controls` |
| **PR** | [#37](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/37) — open to `main`; **operator merges, `D-0-3`** |
| **Brief** | Part 2 · Phase 2.22 · Code (delivered in-session) |

---

## 1. What shipped

- The three carousel controls under the Home showcase (prev, next, pause/play) no longer draw
  bordered rounded boxes — the icons are the whole control. `border border-border-strong`,
  `hover:border-foreground`, and the never-used `font-display` are gone from the `iconButton`
  constant in `src/components/home/HomeShowcase.tsx` (`D-2.22-1`).
- The icons rest at `text-muted-foreground` and light to `text-foreground` on hover **and** on
  `:focus-visible` — matching the progress labels sitting in the same row (`D-2.22-2`).
- Nothing was lost in the trade: `p-3` stays, so the hit area is 48×48 (above the 44px floor);
  `rounded-[var(--radius-md)]` stays, so the focus ring — now the only chrome — keeps its shape
  (`D-2.22-3`); all `focus-visible:` classes are byte-identical to before.
- The three buttons sit in one new `-ml-3 flex items-center` wrapper so the first **glyph** lands
  on the column edge under the photograph instead of 12px inside it (`D-2.22-4`). The outer
  control row and the progress container keep their exact class strings — the wrapper is one flex
  item where three used to be, so the mobile wrap behaviour is unchanged.
- Nothing else: no new string (inventory still **255**), no new token, no new CSS rule, no new
  dependency, no new motion exception, no commerce, no data.

## 2. Decisions I made on my own

`D-2.22-1…4` are the brief's own decisions (owner-requested, pre-made), logged verbatim as it
instructs. On my own I made **one**:

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| D-2.22-5 | Verification maneuvers: the scratch-drop window shift repeated (**twice** — the second time for one final 320px focus-ring render after the first byte-exact restore), `npm test` re-run 129/129 after **each** restore; autoplay/pause behaviours re-proven via the `D-2.21-7` simulations (visibility-getter override, real-pointer hover, matchMedia patch + client-side remount); wide-viewport renders captured via tall viewports at scroll 0 because the pane stopped compositing screenshots mid-scroll at wide sizes this session | Verifying against the photo-less live scratch drop (proves an empty section, not the controls); skipping the behaviours the pane cannot reach natively | Same as `D-2.21-7`: the scratch DB keeps diverging from `src/config/drops.ts` and biting every phase, and the behaviour evidence is simulation, not real hardware — the real-device read is owed row **#51** |

That is the complete list — a phase this small legitimately produced one on-the-fly decision, and
it is a verification-method decision, not a product one.

## 3. Surprises and off-spec changes

- **The brief's numbers all held.** Contrast measured 7.85:1 rest / 15.42:1 lit (brief expected
  ~7.9 / ~15.4); buttons measured exactly 48×48 at all five widths; the 320px hit area starts at
  x=4 with the ring outer edge landing at exactly x=0, unclipped, zero overflow. No deviation.
- **The "control row 2px shorter" is width-dependent, not universal — and that is fine.** Below
  `sm:` the button group is its own flex line, so the section is exactly 2px shorter than 2.21's
  record (863.20 vs 865.20 at 320; 950.70 vs 952.70 at 390). At ≥768 the ~50px progress items
  govern the shared row's height, so the section heights are **identical** to 2.21's record
  (1422.59 / 854 / 934). Per width the delta is constant, and the 2.21 invariant (pixel-identical
  across slide changes) holds everywhere.
- **The live-state `<main>` byte sizes differ from 2.21's record (18,281 B MK / 15,976 B EN vs
  2.21's 14,814 / 12,563) — but the check itself passed cleanly.** The number that matters is
  equality between the branch and `main` under the same dev server + DB state, and the hashes are
  identical both locales, deterministic across repeated fetches. The size drift vs 2.21's record
  is a different-baseline artifact (2.21's own merge added code to `main`, and the live-preview
  grid depends on which scratch drop the maneuver leaves active), not a rendering change.
- **The in-app pane grew a new limitation this session:** screenshots composited black at wide
  viewports whenever the page was scrolled (JS measurement was unaffected). Worked around with
  tall viewports (e.g. 1280×2100) captured at scroll 0, and fresh tabs. Logged inside `D-2.22-5`;
  worth knowing for the next UI phase.
- **The known MK-price hydration mismatch fired as usual** (the pane's Chromium has no `mk-MK`
  ICU data, so client-side `toLocaleString` groups „1,199" against the server's „1.199"). SSR
  HTML curl-proven correct in both locales this session. Pre-existing since the 2.10 era, recorded
  in Known issues, **not** touched by this phase; the root fix stays owed to the already-recorded
  follow-up.

## 4. Files touched

| File | Added / Modified / Deleted |
|---|---|
| `src/components/home/HomeShowcase.tsx` | Modified (the `iconButton` constant + its comment; the `-ml-3` wrapper) |
| `Decisions.md` | Modified (`D-2.22-1…5` appended) |
| `src/_project-state/current-state.md` | Modified (2.22 Status record; Last updated/By; owed rows #51–52; `NEXT:` line **unchanged** by design) |
| `src/_project-state/completions/Part-2-Phase-22-Completion.md` | Added (this file) |

`file-map.md` updated: **no** — the brief pre-ruled it unchanged (no source file added, moved, or
deleted; the completion report lands in the standing `completions/` folder). `00_stack-and-config.md`
unchanged (no dependency, no config).

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ clean |
| Types | `npx tsc --noEmit` | ✅ clean |
| Lint | `npm run lint` | ✅ clean |
| Unit / integration | `npm test` | ✅ **129/129** (re-run after each byte-exact scratch-drop restore) |

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 55ms` |

## 6. Definition of Done

### Verified here (by me) — numbers, not assertions

| Item | Result |
|---|---|
| Computed `border-*-width` on all three buttons, rest **and** real-pointer hover | ☑ `0px 0px 0px 0px` |
| Computed `background-color`, rest **and** hover | ☑ `rgba(0, 0, 0, 0)` (fully transparent) |
| Rest `color` | ☑ `rgb(171, 167, 158)` (`--color-muted-foreground`) |
| Hover `color` (real pointer, after the 120ms transition) | ☑ `rgb(236, 232, 224)` (`--color-foreground`) |
| `:focus-visible` `color` (real Tab) | ☑ `rgb(236, 232, 224)` |
| Contrast vs `--color-ground` `#0F1210`, **measured** (WCAG relative luminance) | ☑ rest **7.85:1**, lit **15.42:1** (floor 3:1) |
| `getBoundingClientRect()` ≥ 44×44 at 320/390/768/1024/1280 | ☑ **48×48** ×3 at every width (at 1280: x=76/124/172, y=680, 48×48 each) |
| Focus ring on each of the three (real Tab walk) | ☑ `box-shadow: rgb(15,18,16) 0 0 0 2px, rgb(242,197,90) 0 0 0 4px` — `#F2C55A` 2px at 2px offset, `matches(':focus-visible')` true on prev, next, pause |
| Ring not clipped at 320px | ☑ zero non-`visible`-overflow ancestors; button left = 4, ring outer edge = **0** (inside the viewport); 320px screenshot taken with the ring visible on the prev arrow |
| Focus can never land in an inactive slide | ☑ 6-Tab walk: link → prev → next → pause → progress ×2; the inactive slide's link sits under `[inert]`; `focusInInactiveSlide: false` |
| Prev / next / pause work | ☑ activeIdx 0→1→0 via arrows; progress buttons jump |
| Pause accessible name flips | ☑ „Паузирај" → „Пушти" → „Паузирај" |
| Autoplay pauses: hover / focus-within / hidden tab; runs otherwise | ☑ via `D-2.21-7` visibility simulation: advances in 6.8s when visible+unhovered+unfocused; **no** advance in 7s under each of hover (real pointer, `:hover` true), focus-within, hidden |
| Reduced motion: no pause button, no autoplay, arrows + progress still work | ☑ matchMedia patch + client-side remount: icon buttons = [prev, next] only; no advance in 8s; arrow → idx 1; progress[0] → idx 0 |
| Zero horizontal overflow at 320px, both locales | ☑ `scrollWidth === 320 === innerWidth` (MK and EN loads) |
| Section height pixel-identical across slide changes, all five widths | ☑ 320: **863.20** / 390: **950.70** / 768: **1422.59** / 1024: **854** / 1280: **934** — identical before/after slide change at every width. Vs 2.21's record: −2px at 320/390 (button row is its own flex line below `sm:`; the removed border), **identical** at ≥768 (the 50px progress items govern the row) |
| `/?preview=live` + `/en?preview=live` `<main>` sha256-identical to `main`'s | ☑ MK **18,281 B `493e28ed5aa0a1f457d5d756b77372148d729378331222c96979dcf663385b14`**, EN **15,976 B `6087cb79061becc7849261ac1a4e06d0503989797ce4b64dcde802b4a1343fd8`** — byte-equal branch vs `main`, same dev server + DB, deterministic across repeated fetches |
| Rendered 390 + 1280, both locales, countdown + ended | ☑ eight renders captured (tall-viewport method, `D-2.22-5`); **zero console errors** (the pre-existing MK hydration badge noted in §3, SSR curl-proven correct) |
| Zero hex / `rgb(` / `hsl(` / raw-ms / raw-easing in the diff | ☑ grep over `git diff main`: none |
| `git diff main --name-only` = the four allowed files | ☑ `src/components/home/HomeShowcase.tsx`, `Decisions.md`, `src/_project-state/current-state.md`, `src/_project-state/completions/Part-2-Phase-22-Completion.md` |
| Out-of-scope byte-unchanged (`ctaSecondary` / progress buttons / `HomeExperience.tsx` / `globals.css` / `showcase.ts` / catalogs / config / supabase / next.config / package files) | ☑ `git diff main --stat` over the full out-of-scope list: **0 lines** |
| `mk.json` / `en.json` unchanged; `string-inventory.md` still **255**; no new `docs/i18n/` file | ☑ catalogs not in the diff; inventory header reads "Keys: 255" |

### Owed to Lazar (register rows **#51–52** in `current-state.md`)

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 51 | The three controls on a **real phone** | `https://www.trajanovv.com` + `/en` after the merge deploys; tap prev / next / pause several times each | Each is easy to hit first time with a thumb despite having no visible box; nothing looks mis-aligned under the photograph |
| 52 | Look sign-off on the chromeless row | Same URLs, phone + desktop, countdown + ended | He confirms this is the "cleaner" he asked for, or names what to change |

## 7. Placeholders shipped

None. The placeholder register is **unchanged** — no row added, cleared, reworded, or touched.

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ n/a — zero rendered strings added or changed |
| `humanizer` pass run on user-facing copy | ☑ n/a — no copy |
| No fashion-magazine filler | ☑ n/a |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| No AI-generated product imagery (`D-0-6`) | ☑ — no imagery touched |
| No untranslated EN string in the MK build | ☑ — catalogs byte-unchanged; MK renders verified in-browser |

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ — no env change at all |
| No order PII (phone, address) in logs | ☑ — no logging touched |

No secret was committed at any point in this branch's history.

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Rows #51–52 (real-phone feel + look sign-off) | The 2.22 deploy | Lazar |
| Everything on the `NEXT:` line (Y.01 content, 2.06 operator half) | Unchanged by this phase — out-of-band UI only | Vladimir / Lazar |

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ deliberately **unchanged** (the brief: this phase does not advance the critical path) |
| `current-state.md` — owed-verification register | ☑ rows #51–52 appended |
| `current-state.md` — placeholder register | ☑ unchanged (nothing shipped, nothing cleared) |
| `file-map.md` — matches what is actually on disk | ☑ unchanged per the brief (no source file added/moved/deleted) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ unchanged (none) |
| `Decisions.md` — every § 2 entry appended | ☑ `D-2.22-1…5` |

**`NEXT:` line I set:** unchanged — still `NEXT: Y.01 (drop content load) + the placeholder register to zero … + the 2.06 operator half`, exactly as 2.21 left it.
