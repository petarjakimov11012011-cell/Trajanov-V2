# Native MK review — Phase 2.12 (Home hero sub-line)

**For Lazar and Petar.** Phase 2.12 replaced **one** Macedonian string — the paragraph directly under
the Home headline (`Home.sub`). The old line recited logistics (3–5 pieces, real stock, cash on
delivery); those facts are now answered eight ways in the FAQ right below it (Phase 2.11), so the
loudest slot on the front door got a **brand line** instead. This review is the first native read
that new line has had.

> **Same job as the 2.02 / 2.03 / 2.11 packs.** You are looking for a **fault** — something *wrong*
> in Macedonian (spelling, grammar, case/agreement, a wrong or missing word, wrong punctuation, an
> English word stuck in the Macedonian) — **not taste**. Correct Macedonian you would have phrased
> differently stays. You do not touch code or run anything — just read, and fill in the columns on
> the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the copy.
Until both boxes in Section 5 are checked, nothing changes.

---

## 1. The one thing that makes this review different

Everywhere else on this site the **Macedonian is the source** and the English is a translation of
it. **Here it is the other way around by decision (`D-2.12-2`):** the operator supplied both lines,
and the Macedonian is **deliberately not a word-for-word translation** of the English. It is
deliberately **shorter**. Both lines shipped **byte-exact as supplied** — Code did not smooth,
re-punctuate, or align them.

So read the **Macedonian on its own terms.** Do not mark it a fault just because it says less than,
or something different from, the English. The English is printed only so you know the intended
feeling — it is **not** the yardstick.

- **МК (the line that shipped):** „Пронајди сродна, во свет продадени души."
- **EN (for feeling only, not a yardstick):** "Find a kindred soul, in a world full of sold souls."

The English is intentionally a comma splice and leans on a play on *soul / sold*. Whether the
Macedonian carries an equivalent play is **your call as a native reader** — it is not required to.

---

## 2. Where it renders — check it in place

`Home.sub` is one value that renders on the **Home hero, under the headline**, in these states:

| State | How to see it | Renders the line? |
|---|---|---|
| **Countdown** (a drop is scheduled) | Home page while the timer is counting down | **Yes** — under „Кога тајмерот ќе стигне нула…" |
| **Ended** (between drops) | Home page after a drop has closed | **Yes** — under the same headline |
| **Live** (a drop is open) | Home page while buying is unlocked | **No** — that state shows the product grid, no sub-line (unchanged) |

Please read it **on a phone and on a desktop**, in the **MK build** (`/`). One value feeds both the
countdown and the ended states, so a fault here shows in two places at once. (In the EN build (`/en`)
the same slot shows the English line — that is expected, not a leak.)

---

## 3. The one string to review

Read the **МК** column. The **EN** column is the intended feeling only (§1) — not what the
Macedonian must match. Fill in **Verdict**, **Corrected MK** (only for a Fault), and **Reviewer**.

| Key | МК (review this) | EN (feeling only — not a yardstick) | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|
| `Home.sub` | Пронајди сродна, во свет продадени души. | Find a kindred soul, in a world full of sold souls. |  |  |  |

**Verdict** — one of `OK` (correct, leave it), `Fault` (wrong — type the fix in *Corrected MK*), or
`Style` (correct, but you'd note a preference — recorded, not applied).

---

## 4. The question this pack is really asking

The Macedonian compresses the thought: „сродна" (a kindred *[one]* — feminine, the noun „душа"
left implied) rather than a full „сродна душа". That compression is **deliberate operator copy**, not
an oversight Code introduced. The single question for you:

> **Does „Пронајди сродна, во свет продадени души." read as correct, finished Macedonian — or does it
> read as a fragment / as if a word is missing?**

- If it reads as **finished** Macedonian → `OK`.
- If it reads as a **fragment** (e.g. the elided „душа" leaves it feeling incomplete, or the comma
  splits it wrong) → `Fault`, and write the corrected Macedonian exactly as it should appear:

**Proposed correction (only if you marked it a Fault):**

```
Home.sub (МК) →
```

There is **no** `[PLACEHOLDER]` here and the line makes **no factual claim** — it is brand voice, so
it needs no `facts.md` entry. You are only judging whether the Macedonian is *right*, not whether a
fact is true.

---

## 5. Reviewer sign-off

Both boxes must be filled before Claude applies any fix. A review with one signature is not a review.
Replace the blanks with your name and date, and change `[ ]` to `[x]`.

**Reviewer 1 — Lazar**

- Name:
- Date:
- [ ] I read the МК line, in place on the Home hero, on a phone and a desktop, in the MK build.

**Reviewer 2 — Petar**

- Name:
- Date:
- [ ] I read the МК line (and Reviewer 1's verdict) in place on the Home hero, both screen sizes.

**Result:** _(fill in when both boxes are checked — passed with no changes, or the fault + correction)._

---

*When both sign-off boxes are checked, tell Claude "the 2.12 MK review is signed off" and it will
apply any fix and re-run the checks. Until then, nothing in the code changes.*
