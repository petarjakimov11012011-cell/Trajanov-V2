# Native MK review — Phase 2.03 (legal pages)

**For Lazar and Petar.** Phase 2.03 added three legal pages — Terms, Privacy, Shipping & Returns — and
**63 new Macedonian strings** that no native speaker has read. A machine wrote the Macedonian. Legal
copy is the worst place for a translation error, so this is the review that catches it.

> **Same job as the 2.02 pack.** You are looking for **faults** (something *wrong* in Macedonian —
> spelling, grammar, case/agreement, wrong or inconsistent word, wrong punctuation, an English word
> stuck in the Macedonian), not **taste**. Correct Macedonian you would have phrased differently stays.
> You do not touch code or run anything — just read, and write in the three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the copy —
it happens before the 2.05 cutover. Until both boxes in Section 6 are checked, nothing changes.

---

## 1. How to do this review

The full instructions are in `docs/i18n/mk-review-2.02.md` §1 and have not changed. In short:

- **Verdict** — one of `OK` (correct, leave it), `Fault` (wrong), or `Style` (correct, but you'd note a
  preference — recorded, not applied).
- **Corrected MK** — only if `Fault`: type the corrected Macedonian exactly as it should appear.
- **Reviewer** — your initial (`L` / `P`); add the second initial when you agree with the first.

**Two things you'll see and should not touch:**

- **`[PLACEHOLDER: …]`** markers (two of them, on Shipping & Returns) are deliberate "this is missing"
  labels for facts we don't have yet (the courier/cost, the returns window). Don't make them read like
  finished text — they're *meant* to look unfinished. You may fix the Macedonian *words* inside; the
  `[PLACEHOLDER: …]` shape stays.
- A few **technical terms are kept as-is on purpose** — see Section 5. Don't flag them unless you think
  the reason is wrong.

Roughly **20–30 minutes** — it's 63 strings, most of them short.

---

## 2. The URL walk

Read each page in both languages. **These pages go live when Phase 2.03 merges and deploys** — until
then the links below will 404 on production, but every string is reproduced in the Section 4 table, so
you can review from the table alone. Once 2.03 is deployed, walk the six links and confirm the pages
read right in context.

| # | Page | МК (Macedonian) | EN (English) | What to look at |
|---|---|---|---|---|
| 1 | Terms | https://trajanov-v2.vercel.app/uslovi | https://trajanov-v2.vercel.app/en/terms | Who you buy from, payment, shipping, how ordering works (48h / 2 per order), prices, "what we don't do". |
| 2 | Privacy | https://trajanov-v2.vercel.app/privatnost | https://trajanov-v2.vercel.app/en/privacy | What's collected, why, who sees it, where it's stored, the IP line, the browser/cookies line, how to delete, who's responsible. |
| 3 | Shipping & Returns | https://trajanov-v2.vercel.app/isporaka-i-vrakjanje | https://trajanov-v2.vercel.app/en/shipping-returns | Where we ship, payment on delivery, the two placeholders, "if something is wrong", "what we can't do yet". |

The footer on every page now links **Услови · Приватност · Испорака и враќање** — check those three
labels read right too (they're in the table: `Nav.terms`, `Nav.privacy`, `Nav.shipping`).

---

## 3. The slug question — three NEW slugs

Same as 2.02: reading only the address bar, would a Macedonian speaker *recognise* the word, and is the
Latin spelling right? Answers: **Keep** · **Change to `____`** · **Cyrillic: `/____`**. Changing a slug
is cheap now (nothing links to these yet) and expensive after the real domain is live.

| # | Route | MK slug now | Reads as | Keep / Change to ___ / Cyrillic | Reviewer |
|---|---|---|---|---|---|
| 1 | Terms | `/uslovi` | услови (terms/conditions) |  |  |
| 2 | Privacy | `/privatnost` | приватност (privacy) |  |  |
| 3 | Shipping & Returns | `/isporaka-i-vrakjanje` | испорака и враќање (shipping and returns) |  |  |

---

## 4. The full string table — all 63 new phrases

Read down the **МК** column; the **EN** column shows what the phrase should mean. Fill in **Verdict**,
**Corrected MK** (only for a Fault), and **Reviewer**. Nothing is pre-filled.

| Key | МК (review this) | EN (meaning) | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|
| `Nav.terms` | Услови | Terms |  |  |  |
| `Nav.privacy` | Приватност | Privacy |  |  |  |
| `Nav.shipping` | Испорака и враќање | Shipping & returns |  |  |  |
| `Terms.eyebrow` | Правно | Legal |  |  |  |
| `Terms.h1` | Услови на продажба | Terms of sale |  |  |  |
| `Terms.intro` | Ова е мал бренд без фирма зад него. Еве точно како тече нарачката — без ситни букви. | This is a small brand with no company behind it. Here's exactly how ordering works — no fine print. |  |  |  |
| `Terms.sellerHeading` | Од кого купуваш | Who you buy from |  |  |  |
| `Terms.sellerBody` | Trajanov го води Владимир Трајанов, од Струмица, Северна Македонија. Нема регистрирана фирма и нема продавница со адреса. Еден човек стои зад брендот. | Trajanov is run by Vladimir Trajanov, in Strumica, North Macedonia. There is no registered company and no shop with an address. One person stands behind the brand. |  |  |  |
| `Terms.contactHeading` | Како да нè побараш | How to reach us |  |  |  |
| `Terms.contactBody` | Најбрзо нè фаќаш по телефон или на Инстаграм. | The fastest way to reach us is by phone or on Instagram. |  |  |  |
| `Terms.paymentHeading` | Плаќање | Payment |  |  |  |
| `Terms.paymentBody` | Плаќаш готовина при преземање, кога пратката ќе пристигне. Нема картички, нема банкарски трансфер, нема плаќање однапред. | You pay cash on delivery, when the parcel arrives. No cards, no bank transfer, no paying in advance. |  |  |  |
| `Terms.shippingHeading` | Каде испорачуваме | Where we ship |  |  |  |
| `Terms.shippingBody` | Испорачуваме само во Северна Македонија. Нема испорака во странство. | We ship inside North Macedonia only. No delivery abroad. |  |  |  |
| `Terms.orderingHeading` | Како тече нарачката | How ordering works |  |  |  |
| `Terms.orderingBody1` | Кога нарачуваш, залихата се резервира 48 часа — не се продава веднаш. Те бараме телефонски за да ја потврдиме. Ако не те фатиме, резервацијата истекува и парчето се враќа во продажба. | When you order, the stock is reserved for 48 hours — not sold on the spot. We call you to confirm. If we can't reach you, the reservation lapses and the piece goes back on sale. |  |  |  |
| `Terms.orderingBody2` | Најмногу 2 парчиња по нарачка. Спуштањата се ограничени и залихата е вистинска — кога ќе се распродаде, готово е. | Maximum 2 items per order. Drops are limited and the stock is real — when it's gone, it's gone. |  |  |  |
| `Terms.pricesHeading` | Цени | Prices |  |  |  |
| `Terms.pricesBody` | Цените се во денари (MKD) и стојат на страницата на производот. Тоа е износот што му го плаќаш на курирот. Нема конверзија во друга валута. | Prices are in Macedonian denars (MKD) and shown on the product page. That is the amount you pay the courier. There is no conversion to any other currency. |  |  |  |
| `Terms.noHeading` | Што не правиме | What we don't do |  |  |  |
| `Terms.noBody` | Нема профили, нема зачувани картички, нема претплати, нема кодови за попуст. | No accounts, no saved cards, no subscriptions, no discount codes. |  |  |  |
| `Privacy.eyebrow` | Правно | Legal |  |  |  |
| `Privacy.h1` | Приватност | Privacy |  |  |  |
| `Privacy.intro` | Собираме само она што ни треба за да ти ја доставиме маицата. Ништо повеќе. | We collect only what we need to get the shirt to you. Nothing more. |  |  |  |
| `Privacy.collectHeading` | Што собираме кога нарачуваш | What we collect when you order |  |  |  |
| `Privacy.collectBody` | Име, телефонски број, град, адреса и белешката ако ја пополниш. Тоа е сè. Не собираме е-пошта — нема поле за е-пошта. | Name, phone number, city, address, and your note if you leave one. That's everything. We don't collect your email — there is no email field. |  |  |  |
| `Privacy.whyHeading` | Зошто | Why |  |  |  |
| `Privacy.whyBody` | За да ти ја доставиме маицата и да те побараме телефонски за да ја потврдиме нарачката. Тоа е единствената употреба. | To deliver the shirt and to call you to confirm the order. That is the only use. |  |  |  |
| `Privacy.whoHeading` | Кој ги гледа | Who sees it |  |  |  |
| `Privacy.whoBody` | Владимир и курирот што ти доставува. Деталите за нарачката му се праќаат на Владимир по е-пошта за да може да те побара. | Vladimir, and the courier who delivers to you. The order details are emailed to Vladimir so he can call you. |  |  |  |
| `Privacy.storageHeading` | Каде се чуваат | Where it's stored |  |  |  |
| `Privacy.storageBody` | Во база на податоци хостирана во Франкфурт, Германија. | In a database hosted in Frankfurt, Germany. |  |  |  |
| `Privacy.abuseHeading` | Заштита од злоупотреба | Anti-abuse |  |  |  |
| `Privacy.abuseBody` | Бидејќи нарачувањето е бесплатно, чуваме еднонасочно хеширана верзија на твојата IP-адреса за да ограничиме колку нарачки доаѓаат од една врска. Суровата IP-адреса никогаш не се чува. | Because ordering is free, we store a one-way hashed form of your IP address to limit how many orders come from one connection. The raw IP is never stored. |  |  |  |
| `Privacy.browserHeading` | Во твојот прелистувач | In your browser |  |  |  |
| `Privacy.browserBody` | Кошничката живее во sessionStorage и исчезнува кога ќе го затвориш јазичето. Нема рекламни колачиња, нема пиксели за следење, нема аналитички колачиња, нема пиксели од социјални мрежи. | The cart lives in sessionStorage and disappears when you close the tab. No advertising cookies, no tracking pixels, no analytics cookies, no social pixels. |  |  |  |
| `Privacy.deleteHeading` | Како да ги избришеш податоците | How to delete your data |  |  |  |
| `Privacy.deleteBody` | Јави се телефонски и ќе ги избришеме. Нема формулар и нема портал — само телефонскиот број. | Call us and we'll delete them. No form, no portal — just the phone number. |  |  |  |
| `Privacy.responsibleHeading` | Кој е одговорен | Who is responsible |  |  |  |
| `Privacy.responsibleBody` | Владимир Трајанов, Струмица, Северна Македонија. | Vladimir Trajanov, Strumica, North Macedonia. |  |  |  |
| `ShippingReturns.eyebrow` | Правно | Legal |  |  |  |
| `ShippingReturns.h1` | Испорака и враќање | Shipping & returns |  |  |  |
| `ShippingReturns.intro` | Каде испорачуваме, како плаќаш и што да правиш ако нешто не е во ред. | Where we ship, how you pay, and what to do if something's wrong. |  |  |  |
| `ShippingReturns.whereHeading` | Каде испорачуваме | Where we ship |  |  |  |
| `ShippingReturns.paymentHeading` | Плаќање при достава | Payment on delivery |  |  |  |
| `ShippingReturns.paymentBody` | Плаќаш готовина на курирот кога пратката ќе пристигне. | You pay the courier in cash when the parcel arrives. |  |  |  |
| `ShippingReturns.deliveryHeading` | Курир, време и цена на испорака | Courier, delivery time and cost |  |  |  |
| `ShippingReturns.deliveryBody` | Овие детали сè уште ги немаме потврдено. Не сакаме да погодуваме бидејќи плаќаш готовина на врата. | We don't have these confirmed yet. We won't guess, because you pay cash at the door. |  |  |  |
| `ShippingReturns.problemHeading` | Ако нешто не е во ред со нарачката | If something is wrong with your order |  |  |  |
| `ShippingReturns.problemBody` | Погрешна величина, оштетено пакување или пратката не пристигнала — јави се на телефонскиот број и Владимир ќе го среди директно. | Wrong size sent, damaged packaging, or the parcel never arrived — call the phone number and Vladimir will sort it out directly. |  |  |  |
| `ShippingReturns.limitsHeading` | Што сè уште не можеме | What we can't do yet |  |  |  |
| `ShippingReturns.limitsBody` | Нема онлајн систем за враќање и нема претплатена етикета за враќање. Ако треба да вратиш нешто, оди преку телефон. | There is no online returns portal and no prepaid return label. If you need to return something, it goes through the phone. |  |  |  |
| `ShippingReturns.returnsHeading` | Рок за враќање и замена | Returns and exchange window |  |  |  |
| `ShippingReturns.returnsBody` | Точниот рок сè уште го немаме потврдено. | We don't have the exact window confirmed yet. |  |  |  |
| `Common.lastUpdated` | Последно ажурирано | Last updated |  |  |  |
| `Placeholder.courier` | [PLACEHOLDER: курир, време и цена на испорака — Владимир] | [PLACEHOLDER: courier, delivery time and delivery cost — Vladimir] |  |  |  |
| `Placeholder.returnsWindow` | [PLACEHOLDER: рок за враќање и замена — Владимир] | [PLACEHOLDER: returns and exchange window — Vladimir] |  |  |  |
| `Meta.termsTitle` | Услови на продажба — Trajanov | Terms of sale — Trajanov |  |  |  |
| `Meta.termsDescription` | Како тече нарачката: готовина при преземање, испорака само во Северна Македонија, резервација 48 часа. | How ordering works: cash on delivery, shipping within North Macedonia only, 48-hour reservation. |  |  |  |
| `Meta.privacyTitle` | Приватност — Trajanov | Privacy — Trajanov |  |  |  |
| `Meta.privacyDescription` | Што собираме кога нарачуваш и зошто. Само име, телефон, град и адреса — без е-пошта, без рекламни колачиња. | What we collect when you order, and why. Just name, phone, city and address — no email, no advertising cookies. |  |  |  |
| `Meta.shippingTitle` | Испорака и враќање — Trajanov | Shipping & returns — Trajanov |  |  |  |
| `Meta.shippingDescription` | Испорака само во Северна Македонија, плаќање готовина при преземање. Ако нешто не е во ред, јави се. | Shipping within North Macedonia only, cash on delivery. If something is wrong, call us. |  |  |  |

**Count check:** 63 rows above (3 Nav + 18 Terms + 19 Privacy + 14 Shipping & Returns + 1 Common + 2
Placeholder + 6 Meta). If your editor shows fewer, tell Claude before you sign off.

---

## 5. Intentionally kept as-is

These are correct by design — flag one only if you think the *reason* is wrong.

| String | Where | Why it's kept |
|---|---|---|
| **MKD** | `Terms.pricesBody` | The currency code, next to the Macedonian "денари". Kept so the site is unambiguous. |
| **sessionStorage** | `Privacy.browserBody` | A technical browser term with no Macedonian equivalent that a developer would recognise; kept in English on purpose. |
| **IP-адреса** | `Privacy.abuseBody` | "IP" is kept Latin (as everywhere); the rest of the word is Macedonian. |
| **Франкфурт, Германија** | `Privacy.storageBody` | A place name — Frankfurt, Germany — where the database is hosted. |
| **Trajanov** | `Meta.*Title` | The brand name, a proper noun, identical in both languages. |
| **`[PLACEHOLDER: …]`** | Shipping & Returns | Deliberate "this is missing" markers (courier/cost, returns window). Fix the Macedonian words inside if wrong, but the marker shape stays. |

---

## 6. Reviewer sign-off

Both boxes must be filled before Claude applies any fixes. A review with one signature is not a review.
Replace the blanks with your name and date, and change `[ ]` to `[x]`.

**Reviewer 1 — Lazar**

- Name: __________
- Date: __________
- [ ] I read every one of the 63 rows, walked the three pages in both languages, and answered the slug
  question.

**Reviewer 2 — Petar**

- Name: __________
- Date: __________
- [ ] I read every one of the 63 rows (and Lazar's verdicts), walked the three pages in both languages,
  and answered the slug question.

---

*When both sign-off boxes are checked, tell Claude "the 2.03 MK review is signed off" and it will apply
the fixes, resolve the slugs, re-run the checks, and open a follow-up PR. Until then, nothing in the
code changes.*
