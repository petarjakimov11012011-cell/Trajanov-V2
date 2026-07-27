# Native MK review — Phase 2.21 (Home showcase strings)

**For Lazar and Petar.** Phase 2.21 put the pieces themselves on the home page — one large
photograph at a time between the hero and the FAQ — and added **seven new Macedonian strings**, all
short control labels. Macedonian is the source language (the English is a translation of it), so
this review is the one that catches a fault before it ships.

> **Same job as the 2.02 / 2.03 / 2.11 / Y.03 / Y.04 / Y.05 packs.** You are looking for **faults**
> (something *wrong* in Macedonian — spelling, grammar, case/agreement, a wrong or inconsistent
> word, wrong punctuation, an English word stuck in the Macedonian), **not taste**. Correct
> Macedonian you would have phrased differently stays. You do not touch code or run anything —
> just read, and fill in the three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the
copy. Until both boxes in Section 4 are checked, nothing changes.

---

## 1. Two things to check specifically

- **The word „парче / парчиња" for the garment.** Four of the seven strings use it («Парчиња»,
  «Претходно парче», «Следно парче», «Види го парчето»). It is the same word the reviewed FAQ
  already uses for the pieces („Парчињата", `Faq.groupPieces`), but here it names a single shirt a
  visitor is looking at — confirm it reads naturally for clothing in that position, and that the
  definite form in «Види го парчето» is right.
- **The imperative forms „Паузирај" / „Пушти".** They are button labels a screen reader announces
  and a visitor presses. Confirm both imperatives are correct and natural for a play/pause control
  (not e.g. „Пауза" as a noun being the better form — if it is, that is a *fault* to correct, not
  taste, because a wrong verb form on a control is wrong Macedonian).

---

## 2. How to do this review

The full instructions are in `docs/i18n/mk-review-2.02.md` §1 and have not changed. In short:

- **Verdict** — one of `OK` (correct, leave it), `Fault` (wrong), or `Style` (correct, but you'd
  note a preference — recorded, not applied).
- **Corrected MK** — only if `Fault`: type the corrected Macedonian exactly as it should appear.
- **Reviewer** — your initial (`L` / `P`); add the second initial when you agree with the first.

To see them in place: open `/` (the drop must not be live — today it is not) and scroll to the
section under the hero photograph. The arrows, the pause button and the two progress labels are
the controls; «1 од 2» is what a screen reader announces per slide; «Види го парчето» is the
link on each slide. Some labels are `aria-label`s — visible in devtools, or read them aloud with
VoiceOver.

---

## 3. The full string table — seven new strings

| Key | МК (review this) | EN (meaning) | Where it renders | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|---|
| `Showcase.regionLabel` | Парчиња | Pieces | `aria-label` on the carousel region — what a screen reader calls the section |  |  |  |
| `Showcase.prev` | Претходно парче | Previous piece | `aria-label` on the ← button |  |  |  |
| `Showcase.next` | Следно парче | Next piece | `aria-label` on the → button |  |  |  |
| `Showcase.pause` | Паузирај | Pause | `aria-label` on the pause button while the slides auto-advance |  |  |  |
| `Showcase.play` | Пушти | Play | `aria-label` on the same button after it is pressed |  |  |  |
| `Showcase.slideLabel` | {index} од {total} | {index} of {total} | `aria-label` on each slide („1 од 2") — `{index}`/`{total}` are numbers filled in by code; review only „од" |  |  |  |
| `Showcase.view` | Види го парчето | View the piece | The visible link on each slide → the product page |  |  |  |

**Count check:** 7 rows above. `string-inventory.md` moved 248 → **255** with these seven keys and
no other string change. The slide titles („Производ 01"), the price („1.199 ден"), and the stock
words („На залиха" / „Уште 3" / „Распродадено") are **existing, already-reviewed keys** — nothing
else to review. The visually-hidden section heading reuses `Home.browseWhileWait` („Разгледај
додека чекаш"), reviewed in the 2.02 pack.

**Register check:** the `humanizer` pass was run over the English — nothing fired (two-to-three-
word control labels carry none of the patterns it checks for).

---

## 4. Reviewer sign-off

Both boxes must be filled before Claude applies any fixes. A review with one signature is not a
review. Replace the blanks with your name and date, and change `[ ]` to `[x]`.

**Reviewer 1 — Lazar**

- Name:
- Date:
- [ ] I read all seven rows in context and confirm the Macedonian is correct — specifically
      „парче/парчиња" for the garment and the imperatives „Паузирај"/„Пушти".

**Reviewer 2 — Petar**

- Name:
- Date:
- [ ] I read all seven rows (and Reviewer 1's verdicts) and agree.

**Result:** _(fill in when both boxes are checked — passed with no changes, or the list of faults)._

---

*When both sign-off boxes are checked, tell Claude "the 2.21 MK review is signed off" and it will
apply any fixes and re-run the checks. Until then, nothing in the code changes.*
