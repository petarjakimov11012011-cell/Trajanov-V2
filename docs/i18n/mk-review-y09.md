# Native MK review — Phase Y.09 (Shipping page, delivery cost, prices text)

**For Lazar and Petar.** Phase Y.09 filled in the delivery cost (200 ден), removed the returns section,
renamed the page to „Испорака", and rewrote the prices sentence on Terms. That touched **nine
Macedonian strings**. Macedonian is the source language (the English is a translation of it), so this
review is the one that catches a fault before it ships.

> **Same job as the 2.02 / 2.03 / 2.11 / 2.21 / 2.23 / 2.25 / Y.03 / Y.04 / Y.05 / Y.08 packs.** You are
> looking for **faults** (something *wrong* in Macedonian — spelling, grammar, case/agreement, a
> wrong or inconsistent word, wrong punctuation, an English word stuck in the Macedonian), **not
> taste**. Correct Macedonian you would have phrased differently stays. You do not touch code or run
> anything — just read, and fill in the three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the copy.
Until both boxes in Section 4 are checked, nothing changes.

**The Macedonian site shows no dollar figure anywhere.** The approximate-USD reference is English-only
(`D-Y.09-4`). If you see a `$` or a `≈` on any MK page, that is a bug — report it here.

---

## 1. Things to check specifically

- **„кого да го викаш" in the intro.** The English is "who to call if something goes wrong", meaning
  *phone*. The problem section below it says „јави се на телефонскиот број". Confirm „кого да го викаш"
  reads as "who to phone" and not "who to call over / shout for". If Macedonian wants
  „на кого да се јавиш", that is a fault to correct.
- **„достава" vs „испорака".** The page now uses „Испорака" for the title (shipping) and „достава" for
  the delivery lines: „Рок и цена на достава", „Цена на достава", „колку чини доставата". The unchanged
  lines already say „Рок на достава" and „Плаќање при достава". Confirm the two words sit correctly
  together and nothing reads as a mismatch.
- **„долари" in the Terms prices sentence.** The English says "US dollars"; the MK says
  „приближна цена во долари". Confirm plain „долари" is clear enough, or whether it should be
  „американски долари".
- **`{cost}` is filled in by the site.** It is never shown as-is. On MK it always becomes **„200 ден"**.
  Read each string with „200 ден" in place of `{cost}`: the „Како се чита" column does that for you.
- **`Cart.shippingValue` is the same in both catalogs** (`{cost}`). The string inventory flags it as
  "byte-identical" and that is **correct**: the template is shared, and what renders differs
  (MK „200 ден", EN "200 MKD (≈ $4)"). Nothing to translate.

## 2. Where they render

- Shipping page: `/isporaka-i-vrakjanje` — the title, intro, delivery heading and cost line. The URL
  still says „враќање" on purpose; route slugs were kept so old links keep working (`D-Y.09-3`).
- The nav menu, the footer link and the browser tab title on every page: „Испорака".
- Home FAQ, the fifth question („Колку трае доставата?"): `/`
- Cart summary, the „Испорака" line: `/kosnicka` (add something to the cart first)
- Terms, the „Цени" section: `/uslovi`

## 3. The strings

| Key | MK (the copy under review) | Како се чита (with `{cost}` filled) | EN (context only) | OK? | Fault found | Correction |
|---|---|---|---|---|---|---|
| `Nav.shipping` | Испорака | — | Shipping | ☐ | | |
| `ShippingReturns.h1` | Испорака | — | Shipping | ☐ | | |
| `ShippingReturns.intro` | Каде испорачуваме, како плаќаш, колку чини доставата и кого да го викаш ако нешто тргне наопаку. | — | Where we ship, how you pay, what delivery costs, and who to call if something goes wrong. | ☐ | | |
| `ShippingReturns.deliveryHeading` | Рок и цена на достава | — | Delivery time and cost | ☐ | | |
| `ShippingReturns.deliveryBody` | Цена на достава: {cost}. | Цена на достава: 200 ден. | Delivery cost: 200 MKD (≈ $4). | ☐ | | |
| `Faq.a5` | Рок на достава: 3–5 работни дена. Цената на доставата е {cost}. Плаќаш готовина на врата. | Рок на достава: 3–5 работни дена. Цената на доставата е 200 ден. Плаќаш готовина на врата. | Delivery takes 3 to 5 business days and costs 200 MKD (≈ $4). You pay cash at the door. | ☐ | | |
| `Cart.shippingValue` | {cost} | 200 ден | 200 MKD (≈ $4) | ☐ | | |
| `Meta.shippingTitle` | Испорака — Trajanov | — | Shipping — Trajanov | ☐ | | |
| `Terms.pricesBody` | Цените се во денари (MKD) и стојат на страницата на производот. Тоа е износот што му го плаќаш на курирот. На англиската верзија прикажуваме и приближна цена во долари, само за информација. Секогаш плаќаш во денари. | — | Prices are in Macedonian denars (MKD) and shown on the product page. That is the amount you pay the courier. On the English site we also show an approximate price in US dollars, for reference only. You always pay in denars. | ☐ | | |

**Removed, for context only (nothing to review):** `ShippingReturns.limitsHeading` „Што сè уште не
можеме", `ShippingReturns.limitsBody`, `ShippingReturns.returnsHeading` „Рок за враќање и замена",
`ShippingReturns.returnsBody`, `Placeholder.courier`, `Placeholder.returnsWindow`. The returns content was
removed by owner decision (`D-Y.09-3`), not translated away.

## 4. Sign-off

- ☐ **Reviewer 1** (name, date): _______________ — read the strings in the browser, faults above
  corrected or none found.
- ☐ **Reviewer 2** (name, date): _______________ — same.

When both boxes are checked, copy any corrections into `src/messages/mk.json` (one commit), rerun
`npm run i18n:inventory` and `npm test` (the delivery-cost copy test checks that `{cost}` is still in
the three cost strings and that no MK string contains `$`), and mark owed-verification register row
**#77** cleared in `src/_project-state/current-state.md`.
