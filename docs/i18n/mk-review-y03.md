# Native MK review — Phase Y.03 (catalog photo alt text)

**For Lazar and Petar.** Phase Y.03 put a real photograph on Products 01 and 02 in the catalog, and
added **two new Macedonian strings** — the `alt` text for those two photographs. Macedonian is the
source language here (the English is a translation of it), so this review is the one that catches a
fault before it ships.

> **Same job as the 2.02 / 2.03 / 2.11 packs.** You are looking for **faults** (something *wrong* in
> Macedonian — spelling, grammar, case/agreement, a wrong or inconsistent word, wrong punctuation, an
> English word stuck in the Macedonian), **not taste**. Correct Macedonian you would have phrased
> differently stays. You do not touch code or run anything — just read, and fill in the three columns
> on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the copy.
Until both boxes in Section 5 are checked, nothing changes.

**It is only two strings — about two minutes.** It is short because the phase was small, not because
it matters less: `alt` text is what a blind customer is told the shirt looks like, on a store where
you pay cash at the door for what you were shown.

---

## 1. What these strings are for

These are **not** visible captions. They are the `alt` attribute on each photograph — read aloud by a
screen reader, and shown if the image fails to load. So they have one job: **say what the garment
looks like**, in as few words as possible.

Two rules shaped the wording, and both must survive your review:

1. **Describe the garment, not the people.** The frames are on-body shots with two identifiable people
   in them. The alt text names **neither of them** and describes nobody's appearance. If you are
   tempted to add „девојка", „момче", or anyone's name — don't. That is deliberate, not an omission.
2. **The colour word is load-bearing.** On cash on delivery, the colour a customer is told is the
   colour they expect at the door. „Окер" and „крем-бела" must match the actual shirts (`facts.md` §7
   colourways: mustard/ochre, off-white). This is the one place where a "style" preference about the
   colour word is actually a **fault** — flag it if either colour name is wrong or misleading.

---

## 2. How to do this review

The full instructions are in `docs/i18n/mk-review-2.02.md` §1 and have not changed. In short:

- **Verdict** — one of `OK` (correct, leave it), `Fault` (wrong), or `Style` (correct, but you'd note
  a preference — recorded, not applied).
- **Corrected MK** — only if `Fault`: type the corrected Macedonian exactly as it should appear.
- **Reviewer** — your initial (`L` / `P`); add the second initial when you agree with the first.

You can review from the table alone. If you'd rather see them in place: once Y.03 is deployed, open
`/katalog` and `/en/catalog` and inspect either of the first two cards — or just turn images off.

---

## 3. The full string table — both new phrases

Read down the **МК** column; the **EN** column shows what the phrase should mean.

| Key | МК (review this) | EN (meaning) | Which photo | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|---|
| `Product.photoAltOchre` | Окер маица со црвен принт, носена. | Ochre t-shirt with red print, worn. | Product 01 — the mustard/ochre shirt |  |  |  |
| `Product.photoAltOffWhite` | Крем-бела маица со црвен принт, носена. | Off-white t-shirt with red print, worn. | Product 02 — the off-white shirt |  |  |  |

**Count check:** 2 rows above. Product 03 (baby blue) has **no** photograph and therefore no alt
text — that is correct, not a missing row.

---

## 4. Intentionally kept as-is

These are correct by design — flag one only if you think the *reason* is wrong.

| String | Why it's kept |
|---|---|
| **„носена"** | Says the shirt is being worn (an on-body shot rather than a flat-lay) without describing who is wearing it — the point of rule 1 above. |
| **„принт"** | The garment term already used for the shirts' artwork. Kept consistent rather than re-invented as „печат" or „мотив". |
| **„Окер"** | Matches the colourway in `facts.md` §7 (mustard / ochre). Chosen over „жолта" because the shirt is not plain yellow. |
| **„Крем-бела"** | Matches `facts.md` §7's *off-white*. Chosen over plain „бела" because the shirt is not pure white, and over a literal „скршено бела", which is not idiomatic Macedonian. **This is the string most worth a second opinion.** |
| **No full stop debate** | Both strings end in a full stop, matching how the other sentence-shaped strings in the catalogs are written. |

---

## 5. Reviewer sign-off

Both boxes must be filled before Claude applies any fixes. A review with one signature is not a
review. Replace the blanks with your name and date, and change `[ ]` to `[x]`.

**Reviewer 1 — Lazar**

- Name:
- Date:
- [ ] I read both rows, and I confirm the two colour words match the actual shirts.

**Reviewer 2 — Petar**

- Name:
- Date:
- [ ] I read both rows (and Reviewer 1's verdicts) and agree the alt text names and describes nobody
  in the frame.

**Result:** _(fill in when both boxes are checked — passed with no changes, or the list of faults)._

---

*When both sign-off boxes are checked, tell Claude "the Y.03 MK review is signed off" and it will
apply any fixes and re-run the checks. Until then, nothing in the code changes.*
