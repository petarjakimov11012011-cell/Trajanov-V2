# Native MK review — Phase 2.11 (Home FAQ)

**For Lazar and Petar.** Phase 2.11 added the **Home FAQ** section — eight questions under the hero,
both locales — and **22 new Macedonian strings** that no native speaker has read yet. Macedonian is
the source language here (the English is a translation of it), so this review is the one that catches
a fault before the section ships to the front door.

> **Same job as the 2.02 / 2.03 packs.** You are looking for **faults** (something *wrong* in
> Macedonian — spelling, grammar, case/agreement, a wrong or inconsistent word, wrong punctuation, an
> English word stuck in the Macedonian), **not taste**. Correct Macedonian you would have phrased
> differently stays. You do not touch code or run anything — just read, and fill in the three columns
> on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the copy.
Until both boxes in Section 5 are checked, nothing changes.

---

## 1. Two sentences that are meant to sound unfinished — do not "fix" them

`a5` and `a7` each end by saying, in plain Macedonian, that something is **not confirmed / not
published yet**:

- `a5` — „…Курирот и цената на испораката **сè уште не се потврдени** и нема да ги погодуваме…"
- `a7` — „…Точни мерки во сантиметри **сè уште не се објавени**."

That is **deliberate**. Those facts (the courier + delivery cost, and the exact size measurements in
cm) genuinely do not exist yet — they are tracked as owed items, and the copy is honest about it. It
is prose lifted from the already-reviewed Shipping & Returns / product pages, **not** a
`[PLACEHOLDER: …]` marker. **Do not polish either sentence into finished-sounding text.** If the
Macedonian *words* are wrong, correct them — but the "not confirmed yet" / "not published yet"
meaning must stay.

---

## 2. How to do this review

The full instructions are in `docs/i18n/mk-review-2.02.md` §1 and have not changed. In short:

- **Verdict** — one of `OK` (correct, leave it), `Fault` (wrong), or `Style` (correct, but you'd note
  a preference — recorded, not applied).
- **Corrected MK** — only if `Fault`: type the corrected Macedonian exactly as it should appear.
- **Reviewer** — your initial (`L` / `P`); add the second initial when you agree with the first.

Roughly **10–15 minutes** — it's 22 strings, most of them short. Read each page in both languages
once 2.11 is deployed (Home, `/` and `/en`), but every string is reproduced in Section 3, so you can
review from the table alone.

---

## 3. The full string table — all 22 new phrases

Read down the **МК** column; the **EN** column shows what the phrase should mean. Fill in **Verdict**,
**Corrected MK** (only for a Fault), and **Reviewer**. Nothing is pre-filled.

### Structure / labels

| Key | МК (review this) | EN (meaning) | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|
| `Faq.h2` | Често поставувани прашања | Frequently Asked Questions |  |  |  |
| `Faq.groupOrdering` | Нарачка | Ordering |  |  |  |
| `Faq.groupDelivery` | Достава | Delivery |  |  |  |
| `Faq.groupPieces` | Парчињата | The pieces |  |  |  |
| `Faq.moreQuestion` | Друго прашање? | Another question? |  |  |  |
| `Faq.moreLink` | Пиши или јави се | Email or call |  |  |  |

### Group 1 — Нарачка (Ordering)

| Key | МК (review this) | EN (meaning) | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|
| `Faq.q1` | Кога можам да купам? | When can I buy? |  |  |  |
| `Faq.a1` | Само додека трае спуштање. Меѓу спуштањата сè може да се разгледа, но ништо не може да се купи. Тајмерот на почетната страница покажува кога се отвора следното. | Only while a drop is on. Between drops you can look at everything, but nothing is buyable. The timer on the home page shows when the next one opens. |  |  |  |
| `Faq.q2` | Како плаќам? | How do I pay? |  |  |  |
| `Faq.a2` | Готовина при преземање, кога пратката ќе пристигне. Нема картички, нема банкарски трансфер, нема плаќање однапред. | Cash on delivery, when the package arrives. No cards, no bank transfer, no paying up front. |  |  |  |
| `Faq.q3` | Колку парчиња можам да нарачам? | How many pieces can I order? |  |  |  |
| `Faq.a3` | Најмногу 2 парчиња по нарачка. Залихата е вистинска и ограничена — кога ќе се распродаде, готово е. | Two pieces per order, maximum. The stock is real and limited — once it's sold out, it's gone. |  |  |  |

### Group 2 — Достава (Delivery)

| Key | МК (review this) | EN (meaning) | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|
| `Faq.q4` | Каде испорачувате? | Where do you ship? |  |  |  |
| `Faq.a4` | Само во Северна Македонија. Нема испорака во странство. | Within North Macedonia only. No international shipping. |  |  |  |
| `Faq.q5` | Колку трае доставата? | How long does delivery take? |  |  |  |
| `Faq.a5` | Рок на достава: 3–5 работни дена. Курирот и цената на испораката сè уште не се потврдени и нема да ги погодуваме — плаќаш готовина на врата. | Delivery takes 3 to 5 business days. The courier and the delivery cost aren't confirmed yet and we're not going to guess them — you pay cash at the door. |  |  |  |
| `Faq.q6` | Што се случува откако ќе нарачам? | What happens after I order? |  |  |  |
| `Faq.a6` | Нарачката ја резервира залихата 48 часа — не се продава веднаш. Те бараме телефонски за да ја потврдиме. Ако не те фатиме, резервацијата истекува и парчето се враќа во продажба. | Your order holds the stock for 48 hours — it isn't sold on the spot. We call you to confirm it. If we can't reach you, the hold expires and the piece goes back on sale. |  |  |  |

### Group 3 — Парчињата (The pieces)

| Key | МК (review this) | EN (meaning) | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|
| `Faq.q7` | Кои величини ги има? | What sizes are there? |  |  |  |
| `Faq.a7` | Величините стојат на страницата на секое парче, заедно со тоа што е сè уште достапно. Маиците се оверсајз унисекс крој. Точни мерки во сантиметри сè уште не се објавени. | Sizes are listed on each piece's own page, along with what's still available. The t-shirts are an oversized unisex cut. Exact measurements in centimetres aren't published yet. |  |  |  |
| `Faq.q8` | Зошто парчињата се толку малку? | Why are there so few pieces? |  |  |  |
| `Faq.a8` | Секое спуштање е од 3 до 5 парчиња, во ограничен број. Кога ќе пишува „Распродадено“, навистина е распродадено — залихата се води на серверот, не на екранот. | Each drop is 3 to 5 pieces, in limited numbers. When it says "Sold out", it really is sold out — the stock is counted on the server, not on the screen. |  |  |  |

**Count check:** 22 rows above (6 structure/label + 8 questions + 8 answers). If your editor shows
fewer, tell Claude before you sign off.

---

## 4. Intentionally kept as-is

These are correct by design — flag one only if you think the *reason* is wrong.

| String | Where | Why it's kept |
|---|---|---|
| **оверсајз** | `Faq.a7` | Matches `About.body1` („оверсајз унисекс маици") and `facts.md` §7. The garment term, kept consistent with the rest of the site — not re-invented here. |
| **„Распродадено“** | `Faq.a8` | The word the product page shows when stock is 0. Set in Macedonian „…“ quotes (same convention as the About pull-quote). It's the on-screen string, quoted. |
| **„сè уште не се потврдени" / „сè уште не се објавени"** | `Faq.a5`, `Faq.a7` | The deliberate "not confirmed / not published yet" sentences of Section 1 — meaning must stay unfinished. |

---

## 5. Reviewer sign-off

Both boxes must be filled before Claude applies any fixes. A review with one signature is not a
review. Replace the blanks with your name and date, and change `[ ]` to `[x]`.

**Reviewer 1 — Lazar**

- Name:
- Date:
- [ ] I read every one of the 22 rows and (once deployed) walked the Home page in both languages.

**Reviewer 2 — Petar**

- Name:
- Date:
- [ ] I read every one of the 22 rows (and Reviewer 1's verdicts) and walked the Home page in both
  languages.

**Result:** _(fill in when both boxes are checked — passed with no changes, or the list of faults)._

---

*When both sign-off boxes are checked, tell Claude "the 2.11 MK review is signed off" and it will
apply any fixes and re-run the checks. Until then, nothing in the code changes.*
