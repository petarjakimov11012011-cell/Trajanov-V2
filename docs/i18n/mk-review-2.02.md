# Native MK review — Phase 2.02

**For Lazar and Petar.** You are the two native Macedonian speakers reading every word the site
shows a customer. A machine wrote the Macedonian; nobody who speaks the language has checked it yet.
This file is your working file — you read it, you write in it, you both sign it at the bottom. You
do **not** need to touch any code or run any command. Everything you need is a link to click or a
box to type in.

> **You are both working in this one file, one after the other.** Lazar goes first and fills in a
> verdict for every row. Petar goes second and, for each row, marks **agree** or writes a different
> answer — you do not start from a blank sheet. When both of you have been through it, fill in the
> **sign-off** at the very bottom (Section 6) and tell Claude it's ready.

---

## 1. How to do this review

**What you are looking for: faults, not taste.** A *fault* is something that is *wrong* in
Macedonian — a spelling mistake, a grammar or case error, wrong agreement (род/број/падеж),
wrong or inconsistent word choice, punctuation that is wrong for Macedonian (for example straight
quotes `"..."` where it should be `„..."`), an **English word left inside the Macedonian**, or a
**Macedonian word left inside the English**. If a sentence is *correct* Macedonian but you would
have phrased it differently, that is **not** a fault — that is taste, and correct Macedonian stays.
We are fixing mistakes, not rewriting the voice. If you really want to note a style preference, you
can (see below), but it will be recorded and **not changed**.

**What to write.** The big table in Section 4 has one row per phrase (150 in total) with three empty
columns on the right:

- **Verdict** — write one of: `OK` (correct, leave it), `Fault` (it's wrong), or `Style` (correct,
  but you'd note a preference).
- **Corrected MK** — only if you wrote `Fault`: type the *corrected* Macedonian here, exactly as it
  should appear. If you wrote `Style`, you may write your suggestion here too, but know it will only
  be recorded, not applied. Leave blank for `OK`.
- **Reviewer** — your initial: `L` for Lazar, `P` for Petar. When the second reviewer agrees with the
  first, add your initial too (e.g. `L, P`). When you disagree, write your own verdict/correction and
  put your initial next to it.

The **URL walk** (Section 2) and the **slug question** (Section 3) come first — do those, then the
table. If you spot a bad word on a page during the walk, find that phrase in the Section 4 table and
mark it there.

**Roughly how long.** The URL walk is about 15 minutes (8 pages, twice — Macedonian and English).
The slug question is about 5 minutes. The 150-row table is the real work — about 30–45 minutes if
you read carefully. Call it **an hour each**. It only happens once, and it's the difference between a
site that reads like a real Macedonian brand and one that reads like a translation.

**Two small things you'll see in the table and should not touch:**

- Text inside **{curly braces}** — `{count}`, `{orderNumber}`, `{handle}` — is a slot the code fills
  in with a real value (a number, an order code like `TRJ-0001`, the Instagram handle). **Leave the
  braces and the word inside them exactly as they are.** You may fix the Macedonian *around* them.
- Text that starts with **`[PLACEHOLDER: …]`** is a deliberate, visible "this is missing" marker for a
  fact we don't have yet (a photo, the fabric, the email). **Do not remove the marker or make it read
  like finished text** — it is *meant* to look unfinished. You may correct the Macedonian *words*
  inside it (e.g. fix a spelling in `состав и нега`), but the `[PLACEHOLDER: …]` shape stays.

---

## 2. The URL walk

Open each link and read the page. The site is bilingual — read the **МК** column and the **EN**
column. Read them as a customer would: is every word right, does anything read like a machine wrote
it, is there an English word stuck in the Macedonian (or the reverse)?

> **The current drop is _ended_, so nothing is for sale and the buy buttons are inactive.** That is
> expected — you are reading *words*, not buying. The product link below uses a real product from the
> live site (`test-mustard-ochre`). `test-off-white` also works if you want a second one.

| # | Page | МК (Macedonian) | EN (English) | What to look at |
|---|---|---|---|---|
| 1 | Home | https://trajanov-v2.vercel.app/ | https://trajanov-v2.vercel.app/en | The countdown, the headline under it, the "browse while you wait" line, the footer. |
| 2 | Catalog | https://trajanov-v2.vercel.app/katalog | https://trajanov-v2.vercel.app/en/catalog | The catalog title and the line under it, the stock labels on the cards, "sold out". |
| 3 | Product | https://trajanov-v2.vercel.app/katalog/test-mustard-ochre | https://trajanov-v2.vercel.app/en/catalog/test-mustard-ochre | The buy area, "choose a size", the shipping notice, the "composition & care" and "shipping" detail lower down, the 2-per-order note. |
| 4 | Cart | https://trajanov-v2.vercel.app/kosnicka | https://trajanov-v2.vercel.app/en/cart | The empty-cart line, "subtotal / shipping / total", the 2-item cap notice, the cash-on-delivery note. |
| 5 | Checkout | https://trajanov-v2.vercel.app/naracka | https://trajanov-v2.vercel.app/en/checkout | The field labels (name, phone, city, address, note), the reserve-48h note, the COD summary, "place order". |
| 6 | About | https://trajanov-v2.vercel.app/za-nas | https://trajanov-v2.vercel.app/en/about | The three story paragraphs, the pull-quote and its credit, the "in the press" heading, "browse the catalog". |
| 7 | Contact | https://trajanov-v2.vercel.app/kontakt | https://trajanov-v2.vercel.app/en/contact | The heading, phone/Instagram/email labels, the Instagram note, the context line at the bottom. |
| 8 | Styleguide | https://trajanov-v2.vercel.app/styleguide | https://trajanov-v2.vercel.app/en/styleguide | Internal design page — a customer never sees it. Skim only; its labels are intentionally English (see Section 5). |

If a page shows a phrase that is wrong, find it in the Section 4 table (by reading down the МК
column) and mark it there — that's the one place every verdict lives.

---

## 3. The slug question

A **slug** is the word in the address bar after the domain — in `trajanov-v2.vercel.app/**kosnicka**`,
the slug is `kosnicka`. The Macedonian pages currently use **Latin-letter transliterations** of
Macedonian words. They were written this way on purpose: when someone shares a link in Viber or an
Instagram story, a Cyrillic address (`/кошничка`) turns into unreadable gibberish like
`/%D0%BA%D0%BE%D1%88...`, while a Latin one (`/kosnicka`) stays readable.

**Your question for each row:** reading only the address bar, would a Macedonian speaker *recognise*
the word — and is the Latin spelling the right choice? Three kinds of answer are all valid:

- **Keep** — the word and its Latin spelling are right.
- **Change to `____`** — a different Latin spelling, or a different Macedonian word entirely, reads
  better (e.g. if `kosnicka` should be `korpa`).
- **Cyrillic** — you'd rather have the real Cyrillic word (`/кошничка`) despite the sharing downside.
  This is a legitimate answer; just write "Cyrillic: `/____`".

> **Changing a slug is cheap right now and expensive later.** Nothing important links to these yet.
> Once the real domain (`trajanov.com`) is live and people have shared links, changing a slug means
> chasing dead links. So if a word bothers you, now is the moment to say so.

| # | Route (the page) | MK slug now | Reads as | Keep / Change to ___ / Cyrillic | Reviewer |
|---|---|---|---|---|---|
| 1 | Catalog | `/katalog` | каталог (catalog) | Keep | L, P |
| 2 | Product | `/katalog/<product>` | каталог + the product's own code, which is the **same in both languages** on purpose | Keep | L, P |
| 3 | Cart | `/kosnicka` | кошничка (cart / little basket) | Keep | L, P |
| 4 | Checkout | `/naracka` | нарачка (order) | Keep | L, P |
| 5 | About | `/za-nas` | за нас (about us) | Keep | L, P |
| 6 | Contact | `/kontakt` | контакт (contact) | Keep | L, P |

Note on row 2 (Product): the product address is `katalog` + a product code. If you change `katalog`
in row 1, the product address changes with it. The product code itself is deliberately the same in
Macedonian and English and is not part of this question.

---

## 4. The full string table — all 150 phrases

Read down the **МК** column. The **EN** column is there so you can see what the phrase is *supposed*
to mean — if the Macedonian is a wrong translation of the English, that's a `Fault`. Fill in
**Verdict**, **Corrected MK** (only for a Fault), and **Reviewer** on the right. Nothing is
pre-filled on purpose.

Reminders: leave `{count}` / `{orderNumber}` / `{handle}` exactly as they are; don't un-mark a
`[PLACEHOLDER: …]`.

| Key | МК (review this) | EN (meaning) | Verdict | Corrected MK | Reviewer |
|---|---|---|---|---|---|
| `About.body1` | Trajanov е бренд за облека од Струмица, основан во 2026 година. Го води еден човек: Владимир Трајанов, основач и дизајнер. Тој е ученик во СОУ „Никола Карев“ во Струмица, на насока техничар за дизајн на облека. Нема тим. Брендот прави оверсајз унисекс маици. | Trajanov is a clothing brand from Strumica, founded in 2026. One person runs it: Vladimir Trajanov, founder and designer. He’s a student at SOU “Nikola Karev” in Strumica, training as a clothing design technician. No team. The brand makes oversized unisex t-shirts. | OK |  | L, P |
| `About.body2` | Во јуни 2026, Владимир освои прво место на конкурс за дизајн на маица за средношколци од текстилните и модните училишта во Северна Македонија. Конкурсот го организираа Креативен ден, Божиловиќ продукција, СОУ „Таки Даскало“ и текстилната компанија ЕАМ од Штип, а трудовите ги оценуваше стручно жири од претставници на Креативен ден и ЕАМ. Целта беше учениците да ги покажат своите идеи и талент преку визуелен израз, и да добијат референца за професионалното портфолио. | In June 2026, Vladimir won first place in a t-shirt design competition for secondary-school students from the fashion and textile schools of North Macedonia. It was organised by Kreativen den, Božilović produkcija, SOU “Taki Daskalo” and the textile company EAM of Štip, and judged by a professional jury of representatives from Kreativen den and EAM. The aim was to let students show their ideas and talent through visual expression, and to give them a reference for a professional portfolio. | OK |  | L, P |
| `About.body3` | Наградата беше 30 маици изработени со неговиот дизајн и посета на фабриката на ЕАМ. Trajanov продава во спуштања од 3 до 5 парчиња, со вистински и ограничени залихи. Испорака само низ Северна Македонија, плаќање со готовина при преземање. | The prize was 30 t-shirts made with his design, plus a visit to the EAM factory. Trajanov sells in drops of 3 to 5 pieces, with real, limited stock. Shipping within North Macedonia only, cash on delivery. | OK |  | L, P |
| `About.eyebrow` | Струмица · 2026 | Strumica · 2026 | OK |  | L, P |
| `About.h1` | Еден бренд, еден дизајнер. | One brand, one designer. | OK |  | L, P |
| `About.pressHeading` | Во печатот | In the press | OK |  | L, P |
| `About.quote` | „Мојот план е да започнам со свој бренд со наградата од ЕАМ“ | “My plan is to start my own brand with the prize from EAM.” | OK |  | L, P |
| `About.quoteAttribution` | Владимир Трајанов, Трн.мк, 12.06.2026 | Vladimir Trajanov, Trn.mk, 12 June 2026 | OK |  | L, P |
| `About.quoteNote` | _(empty in MK on purpose)_ | Translated from Macedonian | OK |  | L, P |
| `About.toCatalog` | Разгледај го каталогот | Browse the catalog | OK |  | L, P |
| `Buy.add` | Додај во кошничка | Add to cart | OK |  | L, P |
| `Buy.added` | Додадено. | Added. | OK |  | L, P |
| `Buy.adding` | Се додава… | Adding… | OK |  | L, P |
| `Buy.comingSoon` | Наскоро | Coming soon | OK |  | L, P |
| `Buy.soldOut` | Распродадено | Sold out | OK |  | L, P |
| `Buy.viewCart` | Кон кошничката | View cart | OK |  | L, P |
| `Buy.viewProduct` | Погледни | View | OK |  | L, P |
| `Cart.backToDrop` | Назад кон спуштањето | Back to the drop | OK |  | L, P |
| `Cart.capNotice` | Најмногу 2 парчиња по нарачка — залихите се ограничени и се резервираат при нарачка. | Max 2 items per order — stock is limited and reserved when you order. | OK |  | L, P |
| `Cart.checkout` | Кон нарачка | Checkout | OK |  | L, P |
| `Cart.codNote` | Плаќање со готовина при преземање. | Cash on delivery. | OK |  | L, P |
| `Cart.decrease` | Намали количина | Decrease quantity | OK |  | L, P |
| `Cart.empty` | Кошничката е празна. | Your cart is empty. | OK |  | L, P |
| `Cart.increase` | Зголеми количина | Increase quantity | OK |  | L, P |
| `Cart.qty` | Количина | Qty | OK |  | L, P |
| `Cart.remove` | Отстрани | Remove | OK |  | L, P |
| `Cart.shipping` | Испорака | Shipping | OK |  | L, P |
| `Cart.shippingValue` | се пресметува при подигање | calculated on delivery | OK |  | L, P |
| `Cart.size` | Величина | Size | OK |  | L, P |
| `Cart.subtotal` | Меѓузбир | Subtotal | OK |  | L, P |
| `Cart.title` | Кошничка | Cart | OK |  | L, P |
| `Cart.total` | Вкупно | Total | OK |  | L, P |
| `Catalog.countdownIntro` | Спуштањето уште не е отворено. Разгледувај; купувањето се отклучува кога тајмерот ќе стигне нула. | The drop isn't open yet. Browse now; buying unlocks when the timer hits zero. | OK |  | L, P |
| `Catalog.empty` | Нема активно спуштање во моментов. | No active drop right now. | OK |  | L, P |
| `Catalog.ended` | Ова спуштање заврши. | This drop has ended. | OK |  | L, P |
| `Catalog.live` | Спуштањето е во живо — залихите се вистински и ограничени. | The drop is live — stock is real and limited. | OK |  | L, P |
| `Catalog.title` | Каталог | Catalog | OK |  | L, P |
| `Checkout.address` | Адреса | Address | OK |  | L, P |
| `Checkout.botCheck` | Проверка дека не си робот | Confirm you're not a robot | OK |  | L, P |
| `Checkout.city` | Град | City | OK |  | L, P |
| `Checkout.codSummary` | Плаќаш со готовина при преземање. Нема онлајн плаќање. | You pay cash on delivery. No online payment. | OK |  | L, P |
| `Checkout.contact` | Твои податоци | Your details | OK |  | L, P |
| `Checkout.errorPhone` | Внеси валиден телефонски број. | Enter a valid phone number. | OK |  | L, P |
| `Checkout.errorRequired` | Ова поле е задолжително. | This field is required. | OK |  | L, P |
| `Checkout.name` | Име и презиме | Full name | OK |  | L, P |
| `Checkout.note` | Белешка (по избор) | Note (optional) | OK |  | L, P |
| `Checkout.notePlaceholder` | Скала, спрат, ориентир… | Entrance, floor, landmark… | OK |  | L, P |
| `Checkout.phone` | Телефон | Phone | OK |  | L, P |
| `Checkout.placeOrder` | Нарачај | Place order | OK |  | L, P |
| `Checkout.reserveNote` | Нарачката резервира залиха 48 часа. | Your order reserves stock for 48 hours. | OK |  | L, P |
| `Checkout.summary` | Преглед на нарачката | Order summary | OK |  | L, P |
| `Checkout.title` | Нарачка | Checkout | OK |  | L, P |
| `Checkout.verifying` | се проверува | verifying | OK |  | L, P |
| `Common.currency` | ден | MKD | OK |  | L, P |
| `Common.languageEn` | EN | EN | OK |  | L, P |
| `Common.languageMk` | МК | МК | OK |  | L, P |
| `Common.shippingNotice` | Испорака само во Северна Македонија. Не доставуваме надвор од земјата. Плаќање со готовина при преземање. | We ship inside North Macedonia only. We can't deliver outside the country. Cash on delivery. | OK |  | L, P |
| `Common.switchLanguage` | Промени јазик | Change language | OK |  | L, P |
| `Contact.context` | Струмица, Северна Македонија · Испорака само низ Северна Македонија · Готовина при преземање. | Strumica, North Macedonia · Ships within North Macedonia only · Cash on delivery. | OK |  | L, P |
| `Contact.emailLabel` | Е-пошта | Email | OK |  | L, P |
| `Contact.eyebrow` | Контакт | Contact | OK |  | L, P |
| `Contact.h1` | Стапи во контакт. | Get in touch. | OK |  | L, P |
| `Contact.instagramLabel` | Инстаграм | Instagram | OK |  | L, P |
| `Contact.instagramNote` | Тука се објавуваат спуштањата. Ова е главниот канал. | Drops are announced here. This is the main channel. | OK |  | L, P |
| `Contact.phoneLabel` | Телефон | Phone | OK |  | L, P |
| `Drop.days` | ДЕНА | DAYS | OK |  | L, P |
| `Drop.ended` | Спуштањето заврши | Drop ended | OK |  | L, P |
| `Drop.endedFollow` | Следи {handle} за следното. | Follow {handle} for the next one. | OK |  | L, P |
| `Drop.hours` | ЧАСА | HRS | OK |  | L, P |
| `Drop.live` | СПУШТАЊЕТО Е ВО ЖИВО | DROP IS LIVE | OK |  | L, P |
| `Drop.liveNow` | Во живо сега | Live now | OK |  | L, P |
| `Drop.minutes` | МИН | MIN | OK |  | L, P |
| `Drop.nextDrop` | Следно спуштање | Next drop | OK |  | L, P |
| `Drop.remaining` | Преостануваат {count} | {count} left | OK |  | L, P |
| `Drop.seconds` | СЕК | SEC | OK |  | L, P |
| `Home.aboutLink` | Прво место на конкурс за дизајн | First place in a design competition | OK |  | L, P |
| `Home.browseWhileWait` | Разгледај додека чекаш | Browse while you wait | OK |  | L, P |
| `Home.eyebrow` | Следно спуштање | Next drop | OK |  | L, P |
| `Home.headline` | Кога тајмерот ќе стигне нула, спуштањето е во живо. | When the timer hits zero, the drop is live. | OK |  | L, P |
| `Home.opening` | Се отвора… | Opening… | OK |  | L, P |
| `Home.sub` | 3 до 5 парчиња. Вистински, ограничени залихи. Готовина при преземање. | 3 to 5 pieces. Real, limited stock. Cash on delivery. | OK |  | L, P |
| `Home.tagline` | Наскоро. | Coming soon. | OK |  | L, P |
| `Home.title` | Trajanov | Trajanov | OK |  | L, P |
| `Meta.aboutDescription` | Еден бренд, еден дизајнер од Струмица. Приказната зад Trajanov. | One brand, one designer from Strumica. The story behind Trajanov. | OK |  | L, P |
| `Meta.aboutTitle` | За брендот — Trajanov | About — Trajanov | OK |  | L, P |
| `Meta.cartDescription` | Парчињата што ги избра, пред нарачка. | The pieces you picked, before you order. | OK |  | L, P |
| `Meta.cartTitle` | Кошничка — Trajanov | Cart — Trajanov | OK |  | L, P |
| `Meta.catalogDescription` | Парчињата во активното спуштање. Вистински, ограничени залихи. | The pieces in the active drop. Real, limited stock. | OK |  | L, P |
| `Meta.catalogTitle` | Каталог — Trajanov | Catalog — Trajanov | OK |  | L, P |
| `Meta.checkoutDescription` | Внеси ги податоците за достава. Плаќање со готовина при преземање, испорака само во Северна Македонија. | Enter your delivery details. Cash on delivery, shipping within North Macedonia only. | OK |  | L, P |
| `Meta.checkoutTitle` | Нарачка — Trajanov | Checkout — Trajanov | OK |  | L, P |
| `Meta.contactDescription` | Стапи во контакт: телефон и Инстаграм. Струмица, Северна Македонија. | Get in touch: phone and Instagram. Strumica, North Macedonia. | OK |  | L, P |
| `Meta.contactTitle` | Контакт — Trajanov | Contact — Trajanov | OK |  | L, P |
| `Meta.homeDescription` | Оверсајз унисекс маици од Струмица. Спуштања од 3 до 5 парчиња, вистински ограничени залихи, готовина при преземање. | Oversized unisex t-shirts from Strumica. Drops of 3 to 5 pieces, real limited stock, cash on delivery. | OK |  | L, P |
| `Meta.homeTitle` | Trajanov — следно спуштање | Trajanov — next drop | OK |  | L, P |
| `Meta.productDescription` | Оверсајз унисекс маица. Испорака само во Северна Македонија, готовина при преземање. | Oversized unisex t-shirt. Shipping within North Macedonia only, cash on delivery. | OK |  | L, P |
| `Meta.siteDescription` | Оверсајз унисекс маици од Струмица, во ограничени спуштања. | Oversized unisex t-shirts from Strumica, in limited drops. | OK |  | L, P |
| `Meta.siteTitle` | Trajanov — спуштања на облека | Trajanov — clothing drops | OK |  | L, P |
| `Meta.styleguideDescription` | Внатрешен преглед на дизајн-системот. | Internal design-system reference. | OK |  | L, P |
| `Meta.styleguideTitle` | Дизајн-систем — Trajanov | Design system — Trajanov | OK |  | L, P |
| `Nav.about` | За брендот | About | OK |  | L, P |
| `Nav.brand` | TRAJANOV | TRAJANOV | OK |  | L, P |
| `Nav.cart` | Кошничка | Cart | OK |  | L, P |
| `Nav.catalog` | Каталог | Catalog | OK |  | L, P |
| `Nav.contact` | Контакт | Contact | OK |  | L, P |
| `Nav.home` | Почетна | Home | OK |  | L, P |
| `Nav.location` | Струмица, Северна Македонија | Strumica, North Macedonia | OK |  | L, P |
| `Order.capViolated` | Најмногу 2 парчиња по нарачка. | Max 2 items per order. | OK |  | L, P |
| `Order.duplicatePhone` | Веќе имаш активна нарачка со овој број за ова спуштање. | You already have a live order with this number for this drop. | OK |  | L, P |
| `Order.emptyCart` | Кошничката е празна. | Your cart is empty. | OK |  | L, P |
| `Order.genericError` | Нешто тргна наопаку. Пробај повторно. | Something went wrong. Try again. | OK |  | L, P |
| `Order.noDrop` | Нема активно спуштање во моментов. | No active drop right now. | OK |  | L, P |
| `Order.notOpen` | Спуштањето не е отворено во моментов. | The drop isn't open right now. | OK |  | L, P |
| `Order.priceMissing` | Грешка кај нас: нема поставена цена. Не наплативме ништо. Пробај подоцна. | Our mistake: no price is set. You weren't charged. Try later. | OK |  | L, P |
| `Order.protected` | Заштита од роботи. | Bot protection. | OK |  | L, P |
| `Order.rateLimited` | Премногу обиди од оваа мрежа. Почекај малку и пробај пак. | Too many attempts from this network. Wait a moment and try again. | OK |  | L, P |
| `Order.soldOut` | Некој беше побрз. Последното парче штотуку замина. | Someone got there first. The last one just went. | OK |  | L, P |
| `Order.success` | Нарачка {orderNumber} е примена и резервирана 48 часа. Плаќаш со готовина при преземање — ќе те побараме телефонски за да ја потврдиме. | Order {orderNumber} received and reserved for 48 hours. You pay cash on delivery — we'll call you to confirm. | OK |  | L, P |
| `Order.turnstileFailed` | Проверката не помина. Пробај повторно. | That check didn't pass. Try again. | OK |  | L, P |
| `Placeholder.composition` | [PLACEHOLDER: состав и нега — од етикетата] | [PLACEHOLDER: composition & care — from the label] | OK |  | L, P |
| `Placeholder.email` | [PLACEHOLDER: е-пошта — Владимир] | [PLACEHOLDER: email — Vladimir] | OK |  | L, P |
| `Placeholder.notice` | Преглед на дизајн-системот. Податоците за производите (назив, цена, величини, состав, фотографии) се примероци — вистинските ги внесува Владимир во подоцнежна фаза. | Design-system preview. Product data (name, price, sizes, composition, photos) is placeholder — the real values are entered by Vladimir in a later phase. | OK |  | L, P |
| `Placeholder.price` | [PLACEHOLDER: цена MKD] | [PLACEHOLDER: price MKD] | OK |  | L, P |
| `Placeholder.productName` | Производ | Product | OK |  | L, P |
| `Placeholder.productPhoto` | [PLACEHOLDER: фотографија — Владимир] | [PLACEHOLDER: product photo — Vladimir] | OK |  | L, P |
| `Placeholder.sizesSample` | величини — примерок, се чекаат од Владимир | sizes — sample, pending Vladimir | OK |  | L, P |
| `Product.back` | Назад кон каталогот | Back to catalog | OK |  | L, P |
| `Product.chooseSize` | Избери величина | Choose a size | OK |  | L, P |
| `Product.composition` | Состав и нега | Composition & care | OK |  | L, P |
| `Product.details` | Детали | Details | OK |  | L, P |
| `Product.oneUnitLimit` | Најмногу 2 парчиња по нарачка. | Max 2 items per order. | OK |  | L, P |
| `Product.shipping` | Испорака | Shipping | OK |  | L, P |
| `Product.shippingBody` | Само во Северна Македонија. Плаќање со готовина при преземање. | North Macedonia only. Cash on delivery. | OK |  | L, P |
| `Product.size` | Величина | Size | OK |  | L, P |
| `Product.sizeGuide` | Водич за величини | Size guide | OK |  | L, P |
| `Stock.inStock` | На залиха | In stock | OK |  | L, P |
| `Stock.low` | Уште {count} | {count} left | OK |  | L, P |
| `Stock.soldOut` | Распродадено | Sold out | OK |  | L, P |
| `Styleguide.buyButton` | Копче за купување | Buy button | OK |  | L, P |
| `Styleguide.colors` | Боја | Colour | OK |  | L, P |
| `Styleguide.countdown` | Одбројување | Countdown | OK |  | L, P |
| `Styleguide.dropBanner` | Банер за спуштање | Drop banner | OK |  | L, P |
| `Styleguide.field` | Поле за нарачка | Checkout field | OK |  | L, P |
| `Styleguide.intro` | Секоја состојба од хендоверот, во живо и со токени од brand.md. | Every state from the handover, live, driven by brand.md tokens. | OK |  | L, P |
| `Styleguide.productCard` | Картичка за производ | Product card | OK |  | L, P |
| `Styleguide.sampleNote` | Пример за приказ на токенот — не е вистинска цена. | Sample to show the token — not a real price. | OK |  | L, P |
| `Styleguide.sizePicker` | Избор на величина | Size picker | OK |  | L, P |
| `Styleguide.stockBadge` | Ознака за залиха | Stock badge | OK |  | L, P |
| `Styleguide.title` | Дизајн-систем | Design system | OK |  | L, P |
| `Styleguide.type` | Типографија | Type | OK |  | L, P |

**Count check:** 150 rows above. If your editor shows fewer, something was lost — tell Claude before
you sign off.

---

## 5. Intentionally not translated

These are **correct by design** — they are the same in both languages on purpose. You only need to
flag one if you think the *reason* is wrong (i.e. it actually *should* be translated). Otherwise,
leave them.

| String | Where | Why it's the same in both |
|---|---|---|
| Trajanov — the brand name | header/footer wordmark, home | A proper name. The brand is "Trajanov" in both languages. |
| МК / EN — the language buttons | language switch | Each button names a language in its own script; identical in both builds. |
| @trajanovv2026 — Instagram handle | footer, contact | A handle, not a phrase. From `facts.md`. |
| 078 820 520 — phone number | footer, contact | A number, not a phrase. From `facts.md`. |
| The About pull-quote — Vladimir's exact words from Трн.мк | About page (MK) | A word-for-word citation from the press. The English page shows a *marked translation*; the Macedonian original must stay exactly as printed. |
| Press outlet names + links (Трн.мк, Струмица Денес, Бизнис Вести, Cultural Chat, Република) | About page | Proper names and web links, copied exactly from `facts.md`. Not translatable phrases. |
| Styleguide field labels ("Default", "Error", …) | styleguide | Internal design page a customer never sees; kept in English on purpose. |
| Dev-only preview labels | never shown to customers | Only appear in development, never on the live site. |

---

## 6. Reviewer sign-off

Both boxes must be filled before Claude applies any fixes. A review with one signature is not a
review. Replace the blanks with your name and today's date, and change `[ ]` to `[x]`.

> **How this sign-off was recorded.** Lazar and Petar reviewed the pack **together** (jointly, not
> one-then-the-other) on 2026-07-19 and confirmed the result in session to Claude Code, which
> transcribed the verdicts into this file: **all 150 strings `OK`** (no faults, no style notes) and
> **all six slugs `Keep`**. Reviewer initials read `L, P` on every row because both agreed on each.

**Reviewer 1 — Lazar**

- Name: **Lazar**
- Date: **2026-07-19**
- [x] I read every one of the 150 rows, walked all 8 pages in both languages, and answered the slug
  question.

**Reviewer 2 — Petar**

- Name: **Petar**
- Date: **2026-07-19**
- [x] I read every one of the 150 rows (and Lazar's verdicts), walked all 8 pages in both languages,
  and answered the slug question.

---

*When both sign-off boxes are checked, tell Claude "the MK review is signed off" and it will apply
the fixes, resolve the slugs, re-run the checks, and open the PR. Until then, nothing in the code
changes.*
