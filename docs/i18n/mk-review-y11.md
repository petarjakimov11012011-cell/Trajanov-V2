# Native MK review — Phase Y.11 (honest display, „дроп", plurals, 404)

**For Lazar and Petar.** Phase Y.11 changed **37 Macedonian strings**, added **8** and
removed **4**. Macedonian is the source language, so this review is the one that catches a fault
before it ships. The table below is generated from `git diff` of `src/messages/mk.json` between `main`
(`cf77299`) and this branch — every changed MK string is in it, none is retyped by hand.

> **Same job as the 2.02 / 2.03 / 2.11 / 2.21 / 2.23 / 2.25 / Y.03–Y.05 / Y.08 / Y.09 packs.** You are looking
> for **faults** (spelling, grammar, case/agreement, a wrong or inconsistent word, wrong punctuation, an
> English word stuck in the Macedonian), **not taste**. Correct Macedonian you would have phrased
> differently stays. You do not touch code — read, and fill in the three columns on the right.

**This file is UNSIGNED on purpose.** Doing the review is not part of the phase that wrote the copy.

**The Macedonian site still shows no dollar figure anywhere** (`D-Y.09-4`). A `$` or `≈` on an MK page is a bug.

---

## 1. Things to check specifically

- **„дроп" as the word for "drop" (brief decision 5).** It replaces „спуштање" everywhere: page text,
  headings, browser-tab titles, share text, the web-app manifest and the FAQ structured data. Forms used:
  **дроп, дропот, дропови, дроповите, следниот дроп, овој дроп, активен дроп**. Confirm the word and the
  forms, and that „Следниот дроп" works as a short label above the countdown. If the answer is "use another
  word", that is one find-and-replace and a new decision — say so here.
- **„Дропот е отворен" / „ДРОПОТ Е ОТВОРЕН" replaces „во живо".** The brief asked for wording that
  means *ordering is open*. Confirm it reads that way and not as "the drop is unlocked/uncovered".
- **Plurals.** Under the countdown digits: 1 ДЕН / 2 ДЕНА, 1 ЧАС / 2 ЧАСА; the live banner: „Преостанува 1" /
  „Преостануваат 2". The site follows the Macedonian plural rule from the Unicode CLDR: numbers ending in 1
  (except 11) take the singular, so **21 ДЕН**, **31 ДЕН**, but **11 ДЕНА**. Confirm 21 ДЕН is right on a
  countdown.
- **„Нарачките се затворени"** on the disabled button between drops. It used to say „Распродадено", which
  was false — the shirts were not sold out, ordering was just closed. Confirm it reads as a button label.
- **`Product.amountDue`** uses informal „Плаќаш", like the rest of the site (the Y.10 version used formal
  „Плаќате" and never rendered on MK). It now renders on every MK product page under the price.
- **`Faq.a8`**: „секоја нарачка се брои веднаш штом ќе се направи" — confirm it reads naturally.
- **`Privacy.browserBody`**: „Кошничката останува во ова јазиче на прелистувачот и се брише кога ќе го
  затвориш." — the "it" is the tab. Confirm that is unambiguous.

## 2. Where they render

- Every product page, e.g. `/katalog/test-baby-blue`: the button „Нарачките се затворени", the amount-due line.
- Home `/`: the „Последниот дроп" heading over the photo slides, the FAQ (answers 1, 7, 8).
- Catalog `/katalog`: the intro line under the title (changes with the drop state).
- Terms `/uslovi`: „Цени" and „Како тече нарачката". Privacy `/privatnost`: „Во твојот прелистувач".
- Shipping `/isporaka-i-vrakjanje`: the intro. Contact `/kontakt`: the Instagram note.
- 404: any unknown address, e.g. `/nema-takva`.
- Countdown, live banner, „ДРОПОТ Е ОТВОРЕН": only during a countdown or a live drop. In dev you can see them
  with `?preview=countdown` and `?preview=live` (refused in production).

## 3. Changed strings

| # | Key | Before | After | Type | How it reads / why | Reviewer 1 OK | Reviewer 2 OK | Correction |
|---|---|---|---|---|---|---|---|---|
| 1 | `Credit.opensInNewTab` | се отвора во нов прозорец | се отвора во ново јазиче | terminology |  „јазиче" is the browser tab; „прозорец" is a window. | ☐ | ☐ | |
| 2 | `Home.eyebrow` | Следно спуштање | Следниот дроп | terminology |  „дроп". | ☐ | ☐ | |
| 3 | `Home.headline` | Кога тајмерот ќе стигне нула, спуштањето е во живо. | Кога тајмерот ќе стигне до нула, дропот е отворен за нарачки. | grammar + terminology |  „стигне до нула"; „во живо" replaced by "open for orders". Not rendered on Home since Y.05 (key kept). | ☐ | ☐ | |
| 4 | `Showcase.headingLast` | Последно спуштање | Последниот дроп | terminology |  „дроп" — the visible h2 on Home between drops. | ☐ | ☐ | |
| 5 | `Showcase.headingLive` | Ова спуштање | Овој дроп | terminology |  „дроп" — the visible h2 on Home during a live drop. | ☐ | ☐ | |
| 6 | `Faq.a1` | Само додека трае спуштање. Меѓу спуштањата сè може да се разгледа, но ништо не може да се купи. Тајмерот на почетната страница покажува кога се отвора следното. | Само додека трае дроп. Меѓу дроповите нарачките се затворени, но сè може да се разгледа. За следниот дроп, следи го {handle} на Инстаграм. | style + terminology | … следи го @trajanovv2026 на Инстаграм. Content change (brief Task 10): ordering opens only during a drop; points to Instagram, no timer promise. | ☐ | ☐ | |
| 7 | `Faq.a7` | Величините стојат на страницата на секое парче, заедно со тоа што е сè уште достапно. Маиците се оверсајз унисекс крој. Точни мерки во сантиметри сè уште не се објавени. | Величините стојат на страницата на секое парче, а додека трае дроп, таму се гледа и што е сè уште достапно. Маиците се со оверсајз унисекс крој. Точни мерки во сантиметри сè уште не се објавени. | grammar |  „се со оверсајз унисекс крој"; availability now said to show during a drop only (decision 7). | ☐ | ☐ | |
| 8 | `Faq.a8` | Секое спуштање е од 3 до 5 парчиња, во ограничен број. Кога ќе пишува „Распродадено“, навистина е распродадено — залихата се води на серверот, не на екранот. | Секој дроп е од 3 до 5 производи, во ограничен број. Кога ќе пишува „Распродадено“, навистина е распродадено: секоја нарачка се брои веднаш штом ќе се направи. | style + terminology |  „3 до 5 производи"; the server/screen sentence rewritten in plain words. | ☐ | ☐ | |
| 9 | `About.body3` | Наградата беше 30 маици изработени со неговиот дизајн и посета на фабриката на ЕАМ. Trajanov продава во спуштања од 3 до 5 парчиња, со вистински и ограничени залихи. Испорака само низ Северна Македонија, плаќање со готовина при преземање. | Наградата беше 30 маици изработени со неговиот дизајн и посета на фабриката на ЕАМ. Trajanov продава во дропови од 3 до 5 производи, со вистински и ограничени залихи. Испорака само низ Северна Македонија, плаќање со готовина при преземање. | terminology |  „дропови", „3 до 5 производи". | ☐ | ☐ | |
| 10 | `Contact.instagramNote` | Тука се објавуваат спуштањата. Ова е главниот канал. | Тука се објавуваат дроповите. Ова е главниот канал. | terminology |  „дроповите". | ☐ | ☐ | |
| 11 | `Terms.orderingBody2` | Спуштањата се ограничени и залихата е вистинска — кога ќе се распродаде, готово е. | Дроповите се ограничени и залихата е вистинска — кога ќе се распродаде, готово е. | terminology |  „Дроповите". | ☐ | ☐ | |
| 12 | `Terms.pricesBody` | Цените се во денари (MKD) и стојат на страницата на производот. Тоа е износот што му го плаќаш на курирот. На англиската верзија прикажуваме и приближна цена во долари, само за информација. Секогаш плаќаш во денари. | Цените се во денари (MKD) и стојат на страницата на производот. Доставата чини {cost} и се додава на цената на маицата. И двете му ги плаќаш на курирот, во готовина. На англиската верзија прикажуваме и приближна цена во долари, само за информација. Секогаш плаќаш во денари. | style | … Доставата чини 200 ден и се додава на цената на маицата. … Content change (brief Task 7): delivery is a separate amount added to the shirt price. | ☐ | ☐ | |
| 13 | `Privacy.browserBody` | Кошничката живее во sessionStorage и исчезнува кога ќе го затвориш јазичето. Нема рекламни колачиња, нема пиксели за следење, нема аналитички колачиња, нема пиксели од социјални мрежи. | Кошничката останува во ова јазиче на прелистувачот и се брише кога ќе го затвориш. Нема рекламни колачиња, нема пиксели за следење, нема аналитички колачиња, нема пиксели од социјални мрежи. | style |  No "sessionStorage" jargon (brief Task 13). The claim is unchanged: cart lives in this tab, cleared on close. | ☐ | ☐ | |
| 14 | `ShippingReturns.intro` | Каде испорачуваме, како плаќаш, колку чини доставата и кого да го викаш ако нешто тргне наопаку. | Каде испорачуваме, како плаќаш, колку чини доставата и кому да се јавиш ако нешто тргне наопаку. | grammar |  „кому да се јавиш" (phone), not „кого да го викаш" — raised in the Y.09 pack. | ☐ | ☐ | |
| 15 | `Drop.days` | ДЕНА | {count, plural, one {ДЕН} other {ДЕНА}} | grammar | 1 → ДЕН · 2 → ДЕНА · 5 → ДЕНА · 21 → ДЕН Plural: 1 ДЕН / 2 ДЕНА (also 21 ДЕН, 11 ДЕНА by the Macedonian rule). | ☐ | ☐ | |
| 16 | `Drop.hours` | ЧАСА | {count, plural, one {ЧАС} other {ЧАСА}} | grammar | 1 → ЧАС · 2 → ЧАСА Plural: 1 ЧАС / 2 ЧАСА. | ☐ | ☐ | |
| 17 | `Drop.nextDrop` | Следно спуштање | Следниот дроп | terminology |  „Следниот дроп". | ☐ | ☐ | |
| 18 | `Drop.live` | СПУШТАЊЕТО Е ВО ЖИВО | ДРОПОТ Е ОТВОРЕН | terminology |  „во живо" → open. The mustard banner during a live drop. | ☐ | ☐ | |
| 19 | `Drop.remaining` | Преостануваат {count} | {count, plural, one {Преостанува #} other {Преостануваат #}} | grammar | 1 → Преостанува 1 · 2 → Преостануваат 2 Plural: „Преостанува 1" / „Преостануваат 2". | ☐ | ☐ | |
| 20 | `Drop.ended` | Спуштањето заврши | Дропот заврши | terminology |  „Дропот заврши". | ☐ | ☐ | |
| 21 | `Drop.liveNow` | Во живо сега | Отворено сега | terminology |  „во живо" → open. Not rendered anywhere today (key kept). | ☐ | ☐ | |
| 22 | `Catalog.live` | Спуштањето е во живо — залихите се вистински и ограничени. | Дропот е отворен — залихите се вистински и ограничени. | terminology |  „во живо" → open. | ☐ | ☐ | |
| 23 | `Catalog.countdownIntro` | Спуштањето уште не е отворено. Разгледувај; купувањето се отклучува кога тајмерот ќе стигне нула. | Дропот уште не е отворен. Разгледувај; купувањето се отклучува кога тајмерот ќе стигне до нула. | grammar + terminology |  „стигне до нула"; „дроп". | ☐ | ☐ | |
| 24 | `Catalog.ended` | Ова спуштање заврши. | Овој дроп заврши. | terminology |  „Овој дроп". | ☐ | ☐ | |
| 25 | `Catalog.empty` | Нема активно спуштање во моментов. | Нема активен дроп во моментов. | terminology |  „активен дроп". | ☐ | ☐ | |
| 26 | `Product.amountDue` | Плаќате {amount} во готово при достава. | Плаќаш {amount} по маица во готовина при преземање, плус {cost} за достава. | style | Плаќаш 1.199 ден по маица во готовина при преземање, плус 200 ден за достава. Content change (brief Task 7): now renders on MK too, informal „Плаќаш", per shirt, plus delivery. | ☐ | ☐ | |
| 27 | `Cart.backToDrop` | Назад кон спуштањето | Назад кон дропот | terminology |  „дропот". | ☐ | ☐ | |
| 28 | `Checkout.notePlaceholder` | Скала, спрат, ориентир… | Влез, кат, ориентир… | terminology |  „Влез" — the brief's wording for the entrance hint. | ☐ | ☐ | |
| 29 | `Order.noDrop` | Нема активно спуштање во моментов. | Нема активен дроп во моментов. | terminology |  „активен дроп". | ☐ | ☐ | |
| 30 | `Order.notOpen` | Спуштањето не е отворено во моментов. | Дропот не е отворен во моментов. | terminology |  „Дропот". | ☐ | ☐ | |
| 31 | `Order.duplicatePhone` | Веќе имаш активна нарачка со овој број за ова спуштање. | Веќе имаш активна нарачка со овој број за овој дроп. | terminology |  „овој дроп". | ☐ | ☐ | |
| 32 | `Styleguide.dropBanner` | Банер за спуштање | Банер за дроп | terminology |  „дроп" (dev-only page). | ☐ | ☐ | |
| 33 | `Meta.siteTitle` | Trajanov — спуштања на облека | Trajanov — дропови на облека | terminology |  Browser tab / share title on every page without its own. | ☐ | ☐ | |
| 34 | `Meta.siteDescription` | Оверсајз унисекс маици од Струмица, во ограничени спуштања. | Оверсајз унисекс маици од Струмица, во ограничени дропови. | terminology |  Search / share description. | ☐ | ☐ | |
| 35 | `Meta.homeTitle` | Trajanov — следно спуштање | Trajanov — следниот дроп | terminology |  Home browser tab title. | ☐ | ☐ | |
| 36 | `Meta.homeDescription` | Оверсајз унисекс маици од Струмица. Спуштања од 3 до 5 парчиња, вистински ограничени залихи, готовина при преземање. | Оверсајз унисекс маици од Струмица. Дропови од 3 до 5 производи, вистински ограничени залихи, готовина при преземање. | terminology |  „дропови", „3 до 5 производи". Also the web-app manifest description now. | ☐ | ☐ | |
| 37 | `Meta.catalogDescription` | Парчињата во активното спуштање. Вистински, ограничени залихи. | Оверсајз унисекс маици од Струмица, во дропови. Вистински, ограничени залихи. | style + terminology |  No "active drop" (brief Task 10). | ☐ | ☐ | |

## 4. New strings

| Key | MK | Where / note | Reviewer 1 OK | Reviewer 2 OK | Correction |
|---|---|---|---|---|---|
| `Buy.closed` | Нарачките се затворени | The disabled button on every product page between drops. Replaces „Распродадено" there. | ☐ | ☐ | |
| `Product.noPhoto` | Сè уште нема фотографија | Text in an empty photo frame. Not visible today (every product has a photo); ready for a product without one. | ☐ | ☐ | |
| `Drop.timerAria` | {days, plural, one {# ден} other {# дена}}, {hours, plural, one {# час} other {# часа}}, {minutes, plural, one {# минута} other {# минути}}, {seconds, plural, one {# секунда} other {# секунди}} | Screen-reader text for the countdown. Reads e.g. „2 дена, 1 час, 5 минути, 1 секунда". Never shown. | ☐ | ☐ | |
| `NotFound.eyebrow` | Грешка 404 | Small label above the 404 heading. | ☐ | ☐ | |
| `NotFound.h1` | Оваа страница не постои. | 404 page heading. | ☐ | ☐ | |
| `NotFound.body` | Линкот можеби е стар или погрешно напишан. Оди во каталогот или на почетната страница. | 404 page text. | ☐ | ☐ | |
| `NotFound.catalog` | Каталог | 404 button. | ☐ | ☐ | |
| `NotFound.home` | Почетна | 404 button. | ☐ | ☐ | |

## 5. Removed (no longer on any page — nothing to review)

| Key | Old MK |
|---|---|
| `Placeholder.productPhoto` | [PLACEHOLDER: фотографија — Владимир] |
| `Placeholder.sizesSample` | величини — примерок, се чекаат од Владимир |
| `Placeholder.composition` | [PLACEHOLDER: состав и нега — од етикетата] |
| `Placeholder.notice` | Преглед на дизајн-системот. Податоците за производите (назив, цена, величини, состав, фотографии) се примероци — вистинските ги внесува Владимир во подоцнежна фаза. |

## 6. Slogan candidate — NOT applied (brief decision 6)

`Home.sub` is **unchanged**: „Пронајди сродна, во свет продадени души."

Candidate for Vladimir, **awaiting Vladimir** — do not apply without his word:

> „Пронајди сродна душа во свет полн со продадени души."

The current line drops „душа" after „сродна" and „полн со" before „продадени". The candidate is the
grammatically complete version. The EN line is "Find a kindred soul, in a world full of sold souls."

## 7. Deliberately unchanged

- `Styleguide.intro` keeps „во живо" — there it means "live, interactive demo" on a dev-only page, not an open drop.
- „парче / парчиња" (piece/pieces) stays in the showcase controls, FAQ questions and order messages. Only the
  drop-size phrase became „3 до 5 производи" (`facts.md` §7 says products).
- Proper names and quotations are untouched: Trajanov, Cultural Chat, Трн.мк, Струмица Денес, the About quote.

## 8. Sign-off

- [ ] Reviewer 1 (Lazar) — date:
- [ ] Reviewer 2 (Petar) — date:

Corrections go into `src/messages/mk.json`, then `npm run i18n:inventory`.
