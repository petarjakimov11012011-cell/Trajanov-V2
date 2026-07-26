# Native MK review — Phase Y.04 (Home hero buttons)

**For Lazar and Petar.** Phase Y.04 put the photographic hero on the Home page and added **two new
Macedonian strings** — the labels on the two buttons beneath the photograph. Macedonian is the source
language here (the English is a translation of it), so this review is the one that catches a fault
before it ships.

> **Same job as the 2.02 / 2.03 / 2.11 / Y.03 packs.** You are looking for **faults** (something
> *wrong* in Macedonian — spelling, grammar, case/agreement, a wrong or inconsistent word, wrong
> punctuation, an English word stuck in the Macedonian), **not taste**. Correct Macedonian you would
> have phrased differently stays. You do not touch code or run anything — just read, and fill in the
> three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the copy.
Until both boxes in Section 4 are checked, nothing changes.

**It is only two strings — one word each.** They are short because they are buttons on the site's
front door: the two words a phone visitor reads right under the first photograph the site has ever
shown.

---

## 1. What these strings are for

They label the two calls to action beneath the hero photograph, in the countdown, ended, and no-view
states (never during a live drop):

- **Каталог** — the primary (mustard) button → `/katalog`
- **Контакт** — the secondary (bordered) button → `/kontakt`

Both words already exist on the site as navigation labels (`Nav.catalog` „Каталог", `Nav.contact`
„Контакт", reviewed in 2.02/2.03) — these are **new keys with the same words**, so consistency with
the header nav is deliberate, not an accident.

---

## 2. How to do this review

The full instructions are in `docs/i18n/mk-review-2.02.md` §1 and have not changed. In short:

- **Verdict** — one of `OK` (correct, leave it), `Fault` (wrong), or `Style` (correct, but you'd note
  a preference — recorded, not applied).
- **Corrected MK** — only if `Fault`: type the corrected Macedonian exactly as it should appear.
- **Reviewer** — your initial (`L` / `P`); add the second initial when you agree with the first.

To see them in place: open `/` (or `/?preview=countdown` locally) at any width — the two buttons sit
directly beneath the photograph.

---

## 3. The full string table — both new phrases

| Key | МК (review this) | EN (meaning) | Where it renders | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|---|
| `Home.ctaCatalog` | Каталог | Catalog | Primary button under the Home hero photo |  |  |  |
| `Home.ctaContact` | Контакт | Contact | Secondary button under the Home hero photo |  |  |  |

**Count check:** 2 rows above. `string-inventory.md` moved 245 → 247 with these two keys and no other
string change. One existing key (`Home.browseWhileWait`) stopped rendering this phase (`D-Y.04-2`)
but its **text did not change** — nothing else to review.

---

## 4. Reviewer sign-off

Both boxes must be filled before Claude applies any fixes. A review with one signature is not a
review. Replace the blanks with your name and date, and change `[ ]` to `[x]`.

**Reviewer 1 — Lazar**

- Name:
- Date:
- [ ] I read both rows and confirm both words are correct Macedonian and match the header nav labels.

**Reviewer 2 — Petar**

- Name:
- Date:
- [ ] I read both rows (and Reviewer 1's verdicts) and agree.

**Result:** _(fill in when both boxes are checked — passed with no changes, or the list of faults)._

---

*When both sign-off boxes are checked, tell Claude "the Y.04 MK review is signed off" and it will
apply any fixes and re-run the checks. Until then, nothing in the code changes.*
