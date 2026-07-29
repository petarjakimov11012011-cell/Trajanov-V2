# Native MK review — Phase 2.25 owner items (showcase section names)

**For Lazar and Petar.** The owner items added to Phase 2.25 on 2026-07-29 gave the Home showcase a
**visible name that changes with the drop state**, and that added **two new Macedonian strings**.
Macedonian is the source language (the English is a translation of it), so this review is the one
that catches a fault before it ships.

> **Same job as the 2.02 / 2.03 / 2.11 / 2.21 / Y.03 / Y.04 / Y.05 packs.** You are looking for
> **faults** (something *wrong* in Macedonian — spelling, grammar, case/agreement, a wrong or
> inconsistent word, wrong punctuation, an English word stuck in the Macedonian), **not taste**.
> Correct Macedonian you would have phrased differently stays. You do not touch code or run
> anything — just read, and fill in the three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the
copy. Until both boxes in Section 4 are checked, nothing changes.

---

## 1. Two things to check specifically

- **The indefinite form „Последно спуштање".** It follows the voice of the already-reviewed
  „Следно спуштање" (`Drop.nextDrop`, the hero eyebrow) rather than the definite „Последното
  спуштање". Confirm the indefinite reads naturally as a **section heading** over the pieces — if
  the definite form is what correct Macedonian wants in that position, that is a fault to correct.
- **„Ова спуштање" as a heading, not a sentence.** The reviewed catalog line „Ова спуштање заврши."
  uses the same phrase inside a sentence. Here it stands alone over the pieces while the drop is
  live. Confirm it carries that weight on its own.

## 2. Where they render

Both are the `<h2>` of the Home showcase section (the pieces, between the hero and the FAQ), one at
a time: „Ова спуштање" **while a drop is live**, „Последно спуштање" **during a countdown and after
a drop ends**. Dev preview: `/?preview=live` · `/?preview=countdown` · `/?preview=ended`.

## 3. The strings

| Key | MK (the copy under review) | EN (context only) | OK? | Fault found | Correction |
|---|---|---|---|---|---|
| `Showcase.headingLast` | Последно спуштање | Last drop | ☐ | | |
| `Showcase.headingLive` | Ова спуштање | This drop | ☐ | | |

## 4. Sign-off

- ☐ **Reviewer 1** (name, date): _______________ — read both strings in the browser, faults above
  corrected or none found.
- ☐ **Reviewer 2** (name, date): _______________ — same.

When both boxes are checked, copy any corrections into `src/messages/mk.json` (one commit), rerun
`npm run i18n:inventory`, and mark owed-verification register row **#64** cleared in
`src/_project-state/current-state.md`.
