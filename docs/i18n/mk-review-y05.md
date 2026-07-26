# Native MK review — Phase Y.05 (Home hero composite alt text)

**For Lazar and Petar.** Phase Y.05 replaced the two-frame Home hero with a single full-bleed
composite photograph and added **one new Macedonian string** — the alt text for that composite.
Macedonian is the source language here (the English is a translation of it), so this review is the
one that catches a fault before it ships.

> **Same job as the 2.02 / 2.03 / 2.11 / Y.03 / Y.04 packs.** You are looking for **faults**
> (something *wrong* in Macedonian — spelling, grammar, case/agreement, a wrong or inconsistent
> word, wrong punctuation, an English word stuck in the Macedonian), **not taste**. Correct
> Macedonian you would have phrased differently stays. You do not touch code or run anything —
> just read, and fill in the three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the
copy. Until both boxes in Section 4 are checked, nothing changes.

**It is one string.** It is short because it is alt text: what a screen reader says instead of the
hero photograph, and what renders if the image fails to load.

---

## 1. What this string is for

It is the alt text for `public/images/lifestyle/trio-composite-01.webp` — the three-panel bar
composite that now carries the Home hero from `640px` up (below that, the hero is the Y.03 mustard
frame, whose alt text `Product.photoAltOchre` was reviewed in the Y.03 pack).

Two rules were applied when writing it, both worth re-checking:

- **It describes the garments, not the people.** Nobody in frame is named, described, aged, or
  counted — the same rule as `photoAltOchre` / `photoAltOffWhite` (Y.03).
- **The colour words must match the actual shirts** — the composite shows the ochre tees and the
  cream-white tees. On cash on delivery a wrong colour is a wrong promise made at the door.

---

## 2. How to do this review

The full instructions are in `docs/i18n/mk-review-2.02.md` §1 and have not changed. In short:

- **Verdict** — one of `OK` (correct, leave it), `Fault` (wrong), or `Style` (correct, but you'd
  note a preference — recorded, not applied).
- **Corrected MK** — only if `Fault`: type the corrected Macedonian exactly as it should appear.
- **Reviewer** — your initial (`L` / `P`); add the second initial when you agree with the first.

To see it in place: open `/` (or `/?preview=countdown` locally) at a width of 640px or more — the
composite is the hero photograph; the alt text is on that image (visible in devtools, or by
blocking the image).

---

## 3. The full string table — the one new phrase

| Key | МК (review this) | EN (meaning) | Where it renders | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|---|
| `Product.photoAltComposite` | Окер и крем-бели маици со црвен принт, носени. | Ochre and off-white t-shirts with red print, worn. | Alt text on the Home hero composite, `≥640px`, all three non-live states |  |  |  |

**Count check:** 1 row above. `string-inventory.md` moved 247 → 248 with this one key and no other
string change. One existing key (`Home.headline`) stopped rendering this phase (`D-Y.05-1`, the
`D-Y.04-2` treatment) but its **text did not change** — nothing else to review.

**Register check:** the wording follows `photoAltOchre` („Окер маица со црвен принт, носена.") and
`photoAltOffWhite` („Крем-бела маица со црвен принт, носена.") exactly — plural because the
composite shows both colourways. The `humanizer` pass was run: nothing fired (a seven-word factual
garment description carries none of the patterns it checks for).

---

## 4. Reviewer sign-off

Both boxes must be filled before Claude applies any fixes. A review with one signature is not a
review. Replace the blanks with your name and date, and change `[ ]` to `[x]`.

**Reviewer 1 — Lazar**

- Name:
- Date:
- [ ] I read the row and confirm the Macedonian is correct and the colour words match the shirts
      in the composite.

**Reviewer 2 — Petar**

- Name:
- Date:
- [ ] I read the row (and Reviewer 1's verdict) and agree.

**Result:** _(fill in when both boxes are checked — passed with no changes, or the list of faults)._

---

*When both sign-off boxes are checked, tell Claude "the Y.05 MK review is signed off" and it will
apply any fixes and re-run the checks. Until then, nothing in the code changes.*
