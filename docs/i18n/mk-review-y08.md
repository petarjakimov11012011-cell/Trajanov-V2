# Native MK review — Phase Y.08 (Product 03 photo alt text)

**For Lazar and Petar.** Phase Y.08 put Product 03's first two real photographs on the catalog card,
on both product-page slots, and in the Home showcase. That added **one new Macedonian string** — the
alt text both frames share. Macedonian is the source language (the English is a translation of it),
so this review is the one that catches a fault before it ships.

> **Same job as the 2.02 / 2.03 / 2.11 / 2.21 / 2.23 / 2.25 / Y.03 / Y.04 / Y.05 packs.** You are
> looking for **faults** (something *wrong* in Macedonian — spelling, grammar, case/agreement, a
> wrong or inconsistent word, wrong punctuation, an English word stuck in the Macedonian), **not
> taste**. Correct Macedonian you would have phrased differently stays. You do not touch code or run
> anything — just read, and fill in the three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the copy.
Until both boxes in Section 4 are checked, nothing changes.

---

## 1. Two things to check specifically

- **„Светлосина" for the colourway.** `facts.md` §7 records the colourway in English as "baby blue"
  (owner-stated, Vladimir, 2026-07-22). „Светлосина" is the translation chosen here. Confirm it is
  what a Macedonian customer would call this colour on a garment — and note that **the photograph
  itself does not show a blue shirt**: under the venue's warm tungsten light it reads pale grey (see
  Section 2). The alt text describes **the garment**, which is baby blue, not the light in the frame.
  If Macedonian wants a different word for this colour on clothing, that is a fault to correct.
- **Consistency with the two reviewed alt strings.** This string is built to the exact pattern of
  `Product.photoAltOchre` („Окер маица со црвен принт, носена.") and `Product.photoAltOffWhite`
  („Крем-бела маица со црвен принт, носена."), both already reviewed. Only the colour word changes.
  Confirm the agreement („носена" with „маица") and the final full stop still read correctly.

## 2. Where it renders

It is the `alt` on **both** of Product 03's photographs, so a screen reader hears the **same sentence
twice** on the product page — a deliberate, logged trade-off (`D-Y.08-5`), not a fault to report here.

- Catalog card: `/katalog` (third card, „Производ 03")
- Product page, both slots: `/katalog/test-baby-blue`
- Home showcase: `/` (third piece)

## 3. The string

| Key | MK (the copy under review) | EN (context only) | OK? | Fault found | Correction |
|---|---|---|---|---|---|
| `Product.photoAltBabyBlue` | Светлосина маица со црвен принт, носена. | Baby-blue t-shirt with red print, worn. | ☐ | | |

## 4. Sign-off

- ☐ **Reviewer 1** (name, date): _______________ — read the string in the browser, faults above
  corrected or none found.
- ☐ **Reviewer 2** (name, date): _______________ — same.

When both boxes are checked, copy any corrections into `src/messages/mk.json` (one commit), rerun
`npm run i18n:inventory`, and mark owed-verification register row **#73** cleared in
`src/_project-state/current-state.md`.
