# Completion report — Part 2 Phase 24: Instagram glyph replaces the `@` icon

| | |
|---|---|
| **Phase** | 2.24 |
| **Name** | Instagram glyph replaces the `@` icon |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-28 |
| **Branch** | `phase-2.24-instagram-icon` |
| **PR** | #39 |
| **Brief** | Part 2 · Phase 24 · Code (delivered in-session; **no `briefs/Part-2-Phase-24-Code.md` file exists on disk** — see § 3) |

---

## 1. What shipped

- **The two places the site links to Instagram now show an Instagram mark instead of a generic `@`.**
  Those two places are the footer `СЛЕДИ`/FOLLOW column (**every page, both locales**) and the
  Contact page's right-hand rail (third row).
- **One new file — `src/components/system/InstagramIcon.tsx`** — a local, server-safe presentational
  component (no `'use client'`, no hooks) drawn on the same 24px grid as the rest of the icon set:
  a rounded-square camera body, a lens circle, a flash dot. It takes the same props as a Lucide icon
  (`SVGProps<SVGSVGElement>`, `strokeWidth` defaulting to `2`, `aria-hidden` spread through), so both
  call sites changed **by name only**.
- **The icon inherits its colour instead of declaring one.** `stroke="currentColor"` + `fill="none"`
  means it takes `text-muted-foreground` from the parent exactly as `Mail` and `Phone` do —
  **measured identical on all four renders**, not assumed. There is no hex, `rgb(`, `hsl(`, or named
  colour anywhere in the file.
- **No dependency moved.** `lucide-react` stays at `^1.24.0`; `package.json` and the lockfile are
  byte-unchanged. That is the entire point of a local component — this Lucide ships no brand icons,
  and the fix must not be "downgrade the dependency."
- **Zero user-facing text added.** `src/messages/` is untouched, so this phase creates **no new MK
  review debt** and no new string-inventory entry.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.24-1` | Ship a **local outline** Instagram glyph on both social rows; supersede `D-2.07-2`. *(The reversal itself is **Lazar's** owner-level call, 2026-07-28. The choice of an outline recreation over Meta's official mark is mine.)* | (a) Meta's official solid/gradient mark — it would be the only filled icon on the page, **cannot inherit a colour token**, and puts more brand trade dress in a public repo (`D-0-1`); (b) keep `AtSign` — it is what the owner asked to change; (c) downgrade `lucide-react` — a dependency change for a deprecated glyph. | What ships is a **recreated Instagram-style outline mark, not Meta's official brand asset**. Used only to link to the brand's own account (`facts.md` §6). The trade-dress concern is reduced, not eliminated. |
| `D-2.24-2` | Prove "row height unchanged" by **measuring `main` too** — temporary `git checkout main -- <the two call sites>`, re-probe, restore. | Asserting parity from source inspection alone ("both are 24-viewBox SVGs at the same `h-4 w-4`") — true, and still an unmeasured claim. | The maneuver **clobbered this phase's own uncommitted edits** (see § 3) and cost a re-apply; evidence is same-machine, not production. |
| `D-2.24-3` | Add a **Status-block entry** to `current-state.md`, which the brief's Task 5 did not list. | Execute Task 5 literally — which would stamp the file `Last updated: … (Phase 2.24)` while containing **no record that Phase 2.24 exists**. | A one-commit out-of-band fix now occupies a paragraph in an already-unwieldy Status section; it is a deviation from the brief's literal task list, logged rather than done silently. |

---

## 3. Surprises and off-spec changes

**1 — The DoD's `grep -rn "AtSign" src/` → zero is not satisfiable without falsifying the
append-only record.** `src/` contains `src/_project-state/`, and four files there record what 2.07
and 2.23 shipped: `completions/Part-2-Phase-07-Completion.md` (2 lines),
`completions/Part-2-Phase-23-Completion.md` (1 line), `file-map.md`'s 2.07 history row, and
`current-state.md`'s archived 2.07/2.23 status prose. **Those are immutable historical records** —
rewriting them to win a grep is exactly what `CLAUDE.md`'s append-only rule forbids. What is true and
what I verified:

- `grep -rn "AtSign" src/ --include='*.ts' --include='*.tsx'` → **zero**. No application code
  references it.
- I did remove the one `AtSign` mention I had written into the new component's own header comment,
  since that is live code I control.
- Row #17, which I was told to rewrite, no longer names it either.

**2 — The DoD's file list omits the completion report.** It says the diff must list "only"
`InstagramIcon.tsx`, `SiteFooter.tsx`, `contact/page.tsx`, `Decisions.md`, and the two state files —
six files. But `CLAUDE.md` requires a completion report in `src/_project-state/completions/`, and the
brief's own "Outputs" section asks for this file. **The diff is therefore seven files, not six**, the
seventh being this report. Every other constraint holds exactly, including the load-bearing one:
`git diff main --name-only -- package.json package-lock.json src/messages/ src/config/ supabase/ facts.md brand.md`
is **empty**.

**3 — The rail link's accessible name is not the handle alone.** The brief states "the visible
`@trajanovv2026` handle is the accessible name of the link." That is exactly true in the **footer**
(`accName: "@trajanovv2026"`). In the **Contact rail** the anchor also wraps the label and the note,
so its accessible name is `"Инстаграм @trajanovv2026 Тука се објавуваат спуштањата. Ова е главниот
канал."` (EN: `"Instagram @trajanovv2026 Drops are announced here. This is the main channel."`).
**This is the pre-existing 2.23 row shape and this phase did not change it by one byte.** The
load-bearing half of the instruction was verified and holds: the icon contributes **nothing** to the
name — `aria-hidden="true"`, no `<title>`, no `aria-label`, on both surfaces, all four renders.

**4 — My baseline maneuver silently reverted my own work.** After measuring `main`, I ran
`git checkout HEAD -- <the two call sites>` to restore the branch. Nothing had been committed yet, so
`HEAD` was still `main` — the restore **re-applied `main`** and my two call-site edits were gone. I
caught it immediately (the grep in the same command still showed 3 `AtSign` hits), re-applied all
five edits by hand, and re-read the final `git diff main` line by line. The correct order is **commit
first, then measure the baseline**. Logged as `D-2.24-2`. Every gate in § 5 was re-run *after* the
re-apply, not before.

**5 — `/kontakt` 307s to `/en/contact` once you have visited an EN page in the same pane.**
next-intl's `NEXT_LOCALE` cookie sticks, so a naive "navigate to `/kontakt`, measure" produced an
**EN** measurement labelled MK. Caught by asserting `document.documentElement.lang` inside every
probe; fixed by setting the cookie back to `mk`. **Pre-existing middleware behaviour, not a defect
and not caused by this phase** — but any future phase measuring both locales in one browser pane will
hit it, and it is worth a line in the next brief that asks for a two-locale render.

**6 — Two small additions to the brief's component spec**, both deliberate: the file uses
`import type {SVGProps} from 'react'` rather than the UMD-global `React.SVGProps` (identical type, and
it matches how every other component in this repo imports React types), and the `<svg>` carries
`xmlns="http://www.w3.org/2000/svg"`, which is what Lucide itself emits.

**7 — `main` has no brief file for this phase.** The brief was delivered in-session; there is no
`briefs/Part-2-Phase-24-Code.md` on disk, unlike prior phases. I did not create one — it is not on
the DoD's allowed-file list. Flagging it so the record is not assumed to be there.

---

## 4. Files touched

`file-map.md` updated: **yes** (new file added to the `system/` tree line + a 2.24 history row).

| File | Added / Modified / Deleted |
|---|---|
| `src/components/system/InstagramIcon.tsx` | **Added** |
| `src/components/layout/SiteFooter.tsx` | Modified (import + element name + comment) |
| `src/app/[locale]/contact/page.tsx` | Modified (import + element name + file-head comment) |
| `Decisions.md` | Modified (`D-2.24-1/2/3` appended; **`D-2.07-2` Status line only** → `Superseded by D-2.24-1`) |
| `src/_project-state/current-state.md` | Modified (Status entry, owed #17 narrowed, owed #58 added, `Last updated`/`By`; **line 1 byte-identical**) |
| `src/_project-state/file-map.md` | Modified (tree line, 2.24 history row, header stamp) |
| `src/_project-state/completions/Part-2-Phase-24.md` | **Added** (this file — the seventh, see § 3) |

**Untouched and diff-proven empty:** `package.json` + lockfile (`lucide-react` still `^1.24.0`),
`src/messages/`, `src/config/`, `supabase/`, `facts.md`, `brand.md`, `src/lib/social.ts`,
`next.config.ts`, cart, checkout, `src/lib/orders/`, `src/lib/drop/`.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **clean** — `✓ Compiled successfully in 3.1s`, `✓ Generating static pages (29/29)`; `/[locale]/contact` still **`●` SSG** (the icon did not force it dynamic) |
| Types | `npx tsc --noEmit` | **clean**, exit 0 |
| Lint | `npm run lint` | **clean**, exit 0 |
| Unit / integration | `npm test` | **154 passed (154)**, 22 files — **identical to `main`'s count**. No test added, changed, or removed. |

**Concurrent-order test** — not a commerce phase, but re-run because the DoD asks:

| | |
|---|---|
| **10 simultaneous orders / 3 units** | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 61ms` |

### Measured row heights — branch vs. `main`

Probed in-browser on the dev server. `main`'s icon renders children `circle,path` (`AtSign`); the
branch renders `rect,path,line` (`InstagramIcon`) — so the two sides are provably different builds.

| Surface | Width | `main` | Branch | Δ |
|---|---|---|---|---|
| Footer social row (`<li>`) | 375 | **33.59px** | **33.59px** | 0 |
| Footer social row (`<li>`) | 1280 | **33.59px** | **33.59px** | 0 |
| Contact rail Instagram row (`<li>`) | 375 | **110.5px** | **110.5px** | 0 |
| Contact rail Instagram row (`<li>`) | 1280 | **91px** | **91px** | 0 |

**Scope of the baseline, stated exactly:** the branch was measured at **375 + 1280 × MK + EN** (four
renders) and the MK numbers equal the EN numbers at every width — the icon carries no text, so
locale cannot move it. The `main` baseline was measured at **375 + 1280 on EN only**, and equals the
branch on every cell above.

### Measured icon parity (all four renders)

| | Instagram | Mail | Phone |
|---|---|---|---|
| Computed `stroke` | `rgb(171, 167, 158)` | `rgb(171, 167, 158)` | `rgb(171, 167, 158)` |
| Computed `fill` | `none` | `none` | `none` |
| `stroke-width` | `1.75` | `1.75` | `1.75` |
| Box — footer / rail | **16×16 / 20×20** | 16×16 / 20×20 | 16×16 / 20×20 |
| `aria-hidden` | `true` | `true` | `true` |
| `<title>` present | **no** | no | no |

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `grep -rn "AtSign" src/` returns zero | **☒ — qualified.** Zero across all `.ts`/`.tsx`. Four files under `src/_project-state/` still hold it in **immutable historical prose** (§ 3, item 1). |
| `grep -rn "InstagramIcon" src/` returns exactly three files | ☑ — `InstagramIcon.tsx`, `SiteFooter.tsx`, `contact/page.tsx` (excluding this report + state files, which name it in prose) |
| No hex / `rgb(` / `hsl(` in `InstagramIcon.tsx` | ☑ zero (also checked for named colours) |
| Diff lists only the expected files | **☒ — seven, not six**: the expected six **plus this completion report** (§ 3, item 2). Forbidden-area diff **empty**. |
| `npm run build` · `npx tsc --noEmit` · `npm run lint` clean | ☑ all three |
| `npm test` green at the current count | ☑ **154/154**, unchanged from `main`, incl. the 10-vs-3 oversell gate |
| Rendered at 375 + 1280, both locales, `/` + `/kontakt` + `/en/contact` | ☑ glyph renders; same colour as `Mail`/`Phone`; same box size; **row heights pixel-identical to `main`** (table above) |
| Zero console errors on all four renders | ☑ zero |
| Both links resolve to `https://instagram.com/trajanovv2026`, `target="_blank"`, `rel="noopener noreferrer"` | ☑ both surfaces, both locales |
| Accessible name unchanged; icon announces nothing | ☑ icon `aria-hidden`, no `<title>`, no `aria-label` added. **Footer name is the handle alone; the rail's is label+handle+note — pre-existing, unchanged (§ 3, item 3).** |
| `D-2.24-1` appended; `D-2.07-2` **Status line only** changed | ☑ one-line diff on `D-2.07-2` (`Accepted` → `Superseded by D-2.24-1`) |
| `current-state.md` line 1 byte-identical | ☑ `diff` against `main`'s line 1 → **no output** |

### Owed to Lazar

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| 58 | **The Instagram glyph on a real screen.** | `https://www.trajanovv.com` after deploy — footer (any page) **and** `/kontakt` + `/en/contact` rail, **MK + EN, 375px + desktop**. | It reads as *Instagram* at 16px (footer) and 20px (rail); it sits beside `Mail`/`Phone` as one set — same colour, same line weight, same optical size; row height has not moved. |

**Row #17 narrowed, not cleared:** its icon half is resolved by this phase; the **2.07 footer-redesign
design sign-off** half stays open and is untouched.

---

## 7. Placeholders shipped

**None.** The placeholder register is **unchanged** — no placeholder added, none cleared.

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ — no new claim; the icon marks the one Instagram account (`facts.md` §6) and both links use `INSTAGRAM_URL` from `src/lib/social.ts`, unchanged |
| `humanizer` pass run on user-facing copy | **n/a — this phase adds zero user-facing copy** |
| No fashion-magazine filler | ☑ n/a (no copy) |
| No invented testimonials / counts / partners / address | ☑ — no second social account implied; one icon, one real account |
| Template-propagated strings verified once against `facts.md` | ☑ n/a |
| No AI-generated product imagery (`D-0-6`) | ☑ — this is a UI icon, hand-specified vector geometry, not product imagery |
| No untranslated EN string in the MK build | ☑ — `src/messages/` byte-unchanged; **zero strings added** |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored | ☑ unchanged |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ unchanged |
| No order PII in logs | ☑ — no logging touched |

No secret was committed at any point in this branch's history.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Owed **#58** — the glyph read on a real screen | the 2.24 deploy | Lazar |
| Owed **#17** (remaining half) — 2.07 footer-redesign design sign-off | Lazar's eyeball | Lazar / Design |

Nothing is blocked. This phase does not touch the critical path: `NEXT:` is byte-unchanged, and Y.01
+ the 2.06 operator half remain what stands between here and the first real drop.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ **rewritten identical — `diff` vs `main` empty** |
| `current-state.md` — owed-verification register | ☑ #17 narrowed, #58 added |
| `current-state.md` — placeholder register | ☑ no change (correct — none added or cleared) |
| `file-map.md` — matches what is actually on disk | ☑ new file in the `system/` tree line + 2.24 history row |
| `00_stack-and-config.md` — new deps / pins / config | ☑ **no change — correct**, no dependency or config moved |
| `Decisions.md` — every § 2 entry appended | ☑ `D-2.24-1/2/3`; `D-2.07-2` Status line only |

**`NEXT:` line I set:** unchanged — `NEXT: **Y.01** (drop content load) + the placeholder register to
**zero** before the first REAL drop …` (byte-identical to its pre-phase value; this phase is
out-of-band and moves nothing).
