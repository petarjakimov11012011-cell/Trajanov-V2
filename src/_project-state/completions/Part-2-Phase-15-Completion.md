# Completion report — Part 2 Phase 15: Full-screen mobile menu (overlay drawer)

| | |
|---|---|
| **Phase** | 2.15 |
| **Name** | Full-screen mobile menu (overlay drawer) |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-25 |
| **Branch** | `phase-2.15-mobile-overlay-menu` |
| **PR** | [#27](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/27) → `main` — **opened, NOT merged** (an operator merges, `D-0-3`) |
| **Brief** | Part 2 · Phase 15 · Code — Full-screen mobile menu (overlay drawer) |

---

## 1. What shipped

- Below `lg` (1024px), tapping the burger no longer expands the links in-flow and pushes the page down.
  It now opens a **full-screen overlay** — a `position: fixed inset-0`, opaque `bg-ground`,
  `role="dialog" aria-modal="true"` panel that takes over the whole screen, matching the owner-approved
  reference: a wordmark + X top bar, large **left-aligned** links with a **left** accent bar on the active
  one, a divider, the language switch centred, and the build credit centred.
- **Everything except the TRAJANOV wordmark moved inside the overlay** below `lg` — the page links, MK·EN,
  the cart, and the build credit. The **closed** mobile header is now **wordmark + burger only**.
- **Desktop (≥ `lg`) is byte-for-byte the finished 2.13 layout** — the non-wordmark pieces are simply
  gated `hidden lg:*`, so at desktop nothing changed (nav centred at offset 0px, one centreline, credit +
  MK·EN + cart present, no overflow).
- **A full modal contract:** focus moves into the overlay on open and back to the burger on close (X or
  Escape); a **focus trap** keeps Tab/Shift+Tab inside; **body scroll is locked** while open and released
  on close; **Escape** closes it; and a **resize to desktop** while open closes it and releases the lock.
- One new string per catalog — `Nav.close` (МК „Затвори" / EN "Close") for the X's `aria-label`. Catalogs
  **242 → 243**.

No new dependency, no `@base-ui/react` import, no shadcn primitive, no new token, no new CSS block, no new
placeholder, no new fact.

---

## 2. Decisions I made on my own

`D-2.15-1 … D-2.15-6` were **pre-made by the orchestrator** in the brief and appended to `Decisions.md`
verbatim; `D-2.14-2/5/6/7` were marked `Superseded by D-2.15-1/2/1/4` (bodies untouched). I made **one**
on-the-fly decision, `D-2.15-7`, forced by verification — surfaced here per `CLAUDE.md`:

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.15-7` | **Also re-check the same media query on a plain `window` `resize`, alongside the brief's `matchMedia('(min-width:1024px)')` `change` listener.** Both are bound once (empty-dep effect); each calls `setOpen(false)` when `matches` is true. | Ship the matchMedia-only listener exactly as worded and mark the resize-safety DoD item "unverifiable in the harness". | The `resize` listener fires on every viewport resize (cheap: one `matches` read; `setOpen(false)` is a no-op when already closed / below `lg`); the implementation is a superset of the brief's literal wording. |

**Why this was necessary, not a preference:** Task 6 specifies a matchMedia `change` listener so a
resize-to-desktop-while-open cannot strand a locked body. That listener is present and is correct for real
browsers (they fire matchMedia `change` when the viewport crosses 1024px). But the **browser-pane's
`resize_window` is a CDP device-metrics override that updates `matchMedia(...).matches` WITHOUT dispatching
the `change` event** — I confirmed this in-pane: after resizing 390→1280 with the overlay open, `mql.matches`
correctly read `true` but the listener never fired, and the body stayed `overflow: hidden` (the exact
"stranded lock" the brief is preventing). Adding the plain-`resize` re-check makes the release **both more
robust** (it fires on any resize, not only the boundary crossing) **and verifiable**: a dispatched `resize`
at 1024 closed the overlay and restored `document.body.style.overflow` (`(restored)`). Both `setOpen` calls
sit inside event callbacks, so the `react-hooks/set-state-in-effect` gate stays green.

Also carried forward (not a new decision): the **render-time route-change close** pattern from `D-2.14-9`
(compare `pathname` to `lastPathname` during render, `setOpen(false)` there) — the brief's Task 6 / Hard-stop
#9 mandate it, and it keeps `npm run lint` green where a pathname `useEffect` + synchronous `setState` would
be a hard lint error.

---

## 3. Surprises and off-spec changes

- **`cn()` (= `twMerge(clsx(...))`) silently dropped the custom `text-h2` utility on the overlay rows.**
  My first cut built each row via `cn(rowBaseWithTextH2, active ? 'text-foreground …' : 'text-muted-foreground …')`.
  Measured result: the rows rendered at **16px** (the default), not `text-h2` (24px at ≤390). Cause:
  `tailwind-merge` doesn't know `text-h2` is a **font-size** (it's a custom `@theme` token), so it classifies
  it as a text-**colour** and drops it when a later `text-foreground`/`text-muted-foreground` comes through
  the merge. (The `border-l-2` + `border-mustard` pair survived because tailwind-merge *does* know border-width
  vs border-color.) **Fix:** build the overlay row as a **plain template string** (no `cn`), exactly how the
  rest of the codebase writes `font-display text-h2 text-foreground` (e.g. `HomeExperience`, `HomeFaq`,
  `contact`) — font-size + colour are different CSS properties and never truly conflict. Re-measured: rows are
  `text-h2` (24px at 320/390), no wrap, no overflow. **Note for the desktop nav:** it keeps the identical
  `cn(...)` pattern as 2.13/2.14 (`text-small` + `text-{colour}`), which means its rendered result is
  **identical to 2.13** (whatever twMerge did there, it still does) — so Hard-stop #1 ("measure identically")
  is satisfied; I deliberately did **not** "fix" the desktop nav, because changing its rendered size would be
  the regression the hard stop forbids.
- **The X close needed an explicit focus-return.** Task 6 says close-by-X returns focus to the burger, but a
  bare `setOpen(false)` lets the browser drop focus to `<body>` when the overlay unmounts. I added
  `burgerRef.current?.focus()` to the X's `onClick` (Escape already had it). Verified: after X, `activeElement`
  is the burger.
- **The `resize_window` harness limitation** (see `D-2.15-7` above) — the pane's resize fires neither
  `matchMedia change` nor a `resize` event; it swaps CDP metrics only. Not a code fault; the belt-and-suspenders
  resize listener is what let me both harden and verify the behaviour.
- **The pane's `computer` click DID fire React's `onClick` this time** (unlike the 2.14 harness quirk) — the
  first burger open was driven by a real `left_click`; subsequent opens used a DOM `.click()` for timing
  reliability. Note the burger is **open-only** (`setOpen(true)`), so clicking it while open is a no-op by
  design — closing is the X / Escape / a row tap / a route change.
- **`file-map.md` intentionally not updated** — no source file was added, moved, or deleted (the completion
  report is a new state artifact scoped out of the file-map tree for these out-of-band UI phases).

---

## 4. Files touched

`file-map.md` updated: **no** — no source file was added, moved, or deleted.

| File | Added / Modified / Deleted |
|---|---|
| `src/components/layout/SiteHeader.tsx` | Modified (desktop bar `hidden lg:*` + mobile bar wordmark+burger + full-screen overlay + modal contract) |
| `src/messages/en.json` | Modified (one key: `Nav.close` = "Close") |
| `src/messages/mk.json` | Modified (one key: `Nav.close` = „Затвори") |
| `docs/i18n/string-inventory.md` | Modified (regenerated → 243; one added row `Nav.close`) |
| `Decisions.md` | Modified (`D-2.15-1…6` appended verbatim; `D-2.15-7` appended; `D-2.14-2/5/6/7` marked superseded) |
| `src/_project-state/current-state.md` | Modified (2.15 Status block, Last-updated line, owed row #30; **line 1 unchanged**) |
| `src/_project-state/completions/Part-2-Phase-15-Completion.md` | Added (this report) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **PASS** — exit 0, "✓ Compiled successfully", full route tree emitted |
| Types | `npx tsc --noEmit` | **PASS** — exit 0 |
| Lint | `npm run lint` | **PASS** — clean, exit 0 |
| Unit / integration | `npm test` | **PASS — 116/116** (19 files, unchanged count) |

**Concurrent-order test (untouched — no commerce code changed):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > … > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0` |
| **i18n catalog parity (now 243 keys)** | `✓ has identical key sets` · `✓ has no empty value in either catalog (except the deliberate About.quoteNote)` |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `git diff --name-only main` lists only SiteHeader.tsx, mk.json, en.json, string-inventory.md + the state/decision/report docs | ☑ |
| `npm run build`, `npx tsc --noEmit`, `npm run lint` all exit 0 | ☑ |
| `npm test` **116/116**, incl. the 10-vs-3 oversell test and 243-key catalog parity | ☑ |
| Catalogs **243** keys each; `string-inventory.md` header reads 243; the only added key is `Nav.close` = „Затвори" / "Close" | ☑ |
| **Desktop unchanged (1024 + 1280, both locales, closed):** burger + overlay compute `display:none`; credit + centred nav + MK·EN + cart all render; nav centre within ±4px of container content-box centre (**offset 0px**); one centreline at 1280 (delta 0); `scrollWidth == clientWidth` | ☑ |
| **Closed mobile header (320 + 390, both locales):** one row — only wordmark + burger (credit/nav/cluster `display:none`); `scrollWidth == clientWidth` | ☑ |
| **Burger ≥ 44×44 (and the X ≥ 44×44) at 320 + 390** | ☑ (both 44×44) |
| **Open (390, both locales):** burger sets `aria-expanded="true"`, mounts `role="dialog" aria-modal="true"`, computes `position: fixed`, covers the viewport, opaque `bg-ground`; `document.activeElement` inside the overlay (the X); body `overflow: hidden` | ☑ |
| **Overlay contents present + ordered:** wordmark + X top bar → Catalog, About, Contact, Cart (left-aligned) → divider → MK·EN centred → "Built by Vertex Consulting" credit centred (only "Vertex Consulting" linked); `scrollWidth == clientWidth`; no label wraps/overflows at 320 either locale | ☑ |
| **Focus trap:** Tab at the last focusable wraps to the first; Shift+Tab at the first wraps to the last; focus never lands behind the overlay | ☑ (9 focusables; wraps both ways) |
| **Escape:** closes, `aria-expanded="false"`, restores body scroll, `activeElement` is the burger | ☑ |
| **Navigate:** tapping "Catalog" at 390 loads the catalog page with the overlay **closed and body scroll restored** — both locales (`/katalog`, `/en/catalog`) | ☑ |
| **Cart from the menu:** tapping the Cart row at 390 navigates to `/cart` (`/en/cart`) with the overlay closed | ☑ (`/kosnicka`, `/en/cart`) |
| **Active state:** on `/katalog` + `/en/catalog` the open-overlay Catalog row has `aria-current="page"` + a **left** 2px `rgb(226,169,60)` accent; at 1280 the desktop Catalog link shows the **bottom** 2px mustard border | ☑ |
| **Resize safety:** overlay open at 390 → viewport ≥ 1024 closes it and restores body scroll (no stranded lock) | ☑ (via `D-2.15-7`; see §2/§3) |
| `grep` proves **no `order-*` utility** in SiteHeader.tsx (precise `\border-(first\|last\|none\|[0-9]+)` empty); **no hex, no raw px literal** in the diff | ☑ |
| `package.json` + lockfile **byte-unchanged**; `@base-ui/react` imported nowhere in `src/` code; `components/ui/` still only `.gitkeep` | ☑ |
| `brand.md`, `globals.css`, `facts.md`, `SiteFooter.tsx`, `LanguageSwitch.tsx` (internals), `layout.tsx`, `ProductCard.tsx` + every § Out-of-scope path **byte-unchanged** | ☑ |
| No new `[PLACEHOLDER: …]`; placeholder register unchanged | ☑ |
| Header console errors: **zero new** (the pre-existing `ProductCard.tsx:59` MK price hydration warning reproduces via `main`-identical code and is left) | ☑ |
| Screenshots captured: MK 390 closed, MK 390 open, EN 390 open, MK 1280, EN 1280 | ☑ (in the session) |
| Line 1 of `current-state.md` unchanged | ☑ (`diff` vs `main` confirmed identical) |
| `Decisions.md`: `D-2.15-1…6` appended; `D-2.14-2/5/6/7` marked superseded (bodies intact) | ☑ (+ `D-2.15-7`) |
| PR opened to `main`, **not merged** | ☑ |

**Measurement matrix (actual numbers, via `getBoundingClientRect()` + computed styles):**

| Width | Locale | closed: bar contents / no-overflow | open: dialog / rows / no-overflow | ≥ lg: burger+overlay display / nav offset |
|---|---|---|---|---|
| 320 | MK | wordmark + „Мени" only / 320==320 | fixed opaque, rows 24px no-wrap / 320==320 | — (below lg) |
| 320 | EN | wordmark + "Menu" only / 320==320 | rows 24px no-wrap / 320==320 | — (below lg) |
| 390 | MK | wordmark + burger; burger 44×44 / 390==390 | fixed `bg-ground` `#0F1210` z-40 covers 390×844; order top-bar→links→divider→MK·EN→credit; focus=X; body `hidden` / 390==390 | — (below lg) |
| 390 | EN | wordmark + burger / 390==390 | close label "Close"; rows `/en/*` 24px; credit "Built by Vertex Consulting" / 390==390 | — (below lg) |
| 768 | MK | burger visible; nav+cluster `display:none` / 768==768 | — | — (below lg) |
| 768 | EN | burger visible; nav+cluster `display:none` / 768==768 | — | — (below lg) |
| 1024 | MK | — | — | **none** / offset **0px**, credit+nav+MK·EN+cart render, 1024==1024 |
| 1024 | EN | — | — | **none** / offset **0px**, 1024==1024 |
| 1280 | MK | — | — | **none** / offset **0px**, one centreline (8 items @ cy 34, delta 0), 1280==1280 |
| 1280 | EN | — | — | **none** / offset **0px**, one centreline (8 items @ cy 34, delta 0); active Catalog **bottom** 2px `rgb(226,169,60)`, 1280==1280 |

**Interaction (MK/EN 390):** open → `aria-expanded="true"`, dialog `position: fixed`, `activeElement` = X
(„Затвори"/"Close"), body `overflow: hidden`. Escape → `aria-expanded="false"`, overlay unmounted, body scroll
`(restored)`, `activeElement` = burger. X → same (focus → burger, scroll restored). Focus trap: 9 focusables,
Tab@last→first, Shift+Tab@first→last. Navigate "Catalog" → `/katalog` (`/en/catalog`), menu closed on arrival,
`aria-current="page"`. Cart row → `/kosnicka` (`/en/cart`), menu closed. Active open row = **left** 2px
`rgb(226,169,60)` accent + `text-foreground`.

### Owed to Lazar (only he / a real device can confirm)

| # | Item | Steps | What "pass" looks like |
|---|---|---|---|
| 30 | Full-screen menu sign-off on the live deploy, **on a real phone**, both locales | Open `https://www.trajanovv.com` on a phone. Tap the burger; confirm the menu takes the whole screen; tap each row (Catalog, About, Contact, Cart); use the X and the back button; switch to EN and repeat | Closed header is wordmark + burger only; the menu is a full-screen opaque panel matching the reference (wordmark + X, left-aligned links with a left accent on the active one, divider, centred MK·EN, centred credit); every row navigates correctly and closes the menu; nothing overflows sideways; the MK „Затвори" label reads correctly to a native speaker (a new MK string, not covered by the 2.03 review stamp) |

---

## 7. Placeholders shipped

None. This phase adds no `[PLACEHOLDER: …]` marker and clears none. A menu label is not a factual claim, so
`facts.md` gets no entry and the placeholder register does not change. Moving the credit's location (into the
menu below `lg`) adds/removes no fact — it still renders on every page.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| — | — | — | — |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ N/A — the only new copy is a UI label (`Nav.close`), not a factual claim; the credit is unchanged (`facts.md` §11) |
| `humanizer` pass run on user-facing copy | ☑ N/A — a one-word UI label |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| No AI-generated product imagery (`D-0-6`) | ☑ N/A — no imagery |
| No untranslated EN string in the MK build | ☑ — MK overlay shows „Затвори" X label; EN shows "Close" (measured `aria-label`) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ |
| No order PII (phone, address) in logs | ☑ |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Full-screen menu sign-off (owed #30) | Lazar viewing the live deploy on a real phone, both locales | Lazar (+ Petar for the MK „Затвори" label) |
| Pre-existing MK price hydration mismatch in `ProductCard.tsx:59` (out of scope here; still open, flagged as a separate task) | A follow-up fix before drop day | Orchestrator / Code |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (byte-unchanged — out-of-band phase) |
| `current-state.md` — § Status 2.15 entry | ☑ |
| `current-state.md` — owed-verification register | ☑ (row #30 added) |
| `current-state.md` — placeholder register | ☑ (unchanged — none added/cleared) |
| `file-map.md` — matches disk | ☑ (not touched — no source file added/moved/deleted) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ (unchanged — no dependency/config change) |
| `Decisions.md` — every entry appended | ☑ (`D-2.15-1…6` verbatim; `D-2.15-7` for the resize belt-and-suspenders; `D-2.14-2/5/6/7` superseded) |

**`NEXT:` line I set:** unchanged — `NEXT: 2.06 operator half — the LIVE drop rehearsal …` (out-of-band phase;
line 1 must not move).
