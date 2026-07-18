# String inventory — Trajanov-V2

> **Generated — do not edit by hand.** Regenerate with `npm run i18n:inventory`.
> Source: `src/messages/mk.json` + `src/messages/en.json`. MK is the source language;
> EN is a translation of it, not a paraphrase. For Phase 2.02 (native MK review).

**Keys:** 150 (MK and EN key sets are identical — enforced by `tests/i18n/catalog-parity.test.ts`).

The **Where** column is a static heuristic (see `scripts/i18n-inventory.ts`): it points at
the file(s) that reference each key, to start a review — not an exhaustive render trace.

| Key | MK | EN | Where |
|---|---|---|---|
| `About.body1` | Trajanov е бренд за облека од Струмица, основан во 2026 година. Го води еден човек: Владимир Трајанов, основач и дизајнер. Тој е ученик во СОУ „Никола Карев“ во Струмица, на насока техничар за дизајн на облека. Нема тим. Брендот прави оверсајз унисекс маици. | Trajanov is a clothing brand from Strumica, founded in 2026. One person runs it: Vladimir Trajanov, founder and designer. He’s a student at SOU “Nikola Karev” in Strumica, training as a clothing design technician. No team. The brand makes oversized unisex t-shirts. | `src/app/[locale]/about/page.tsx` |
| `About.body2` | Во јуни 2026, Владимир освои прво место на конкурс за дизајн на маица за средношколци од текстилните и модните училишта во Северна Македонија. Конкурсот го организираа Креативен ден, Божиловиќ продукција, СОУ „Таки Даскало“ и текстилната компанија ЕАМ од Штип, а трудовите ги оценуваше стручно жири од претставници на Креативен ден и ЕАМ. Целта беше учениците да ги покажат своите идеи и талент преку визуелен израз, и да добијат референца за професионалното портфолио. | In June 2026, Vladimir won first place in a t-shirt design competition for secondary-school students from the fashion and textile schools of North Macedonia. It was organised by Kreativen den, Božilović produkcija, SOU “Taki Daskalo” and the textile company EAM of Štip, and judged by a professional jury of representatives from Kreativen den and EAM. The aim was to let students show their ideas and talent through visual expression, and to give them a reference for a professional portfolio. | `src/app/[locale]/about/page.tsx` |
| `About.body3` | Наградата беше 30 маици изработени со неговиот дизајн и посета на фабриката на ЕАМ. Trajanov продава во спуштања од 3 до 5 парчиња, со вистински и ограничени залихи. Испорака само низ Северна Македонија, плаќање со готовина при преземање. | The prize was 30 t-shirts made with his design, plus a visit to the EAM factory. Trajanov sells in drops of 3 to 5 pieces, with real, limited stock. Shipping within North Macedonia only, cash on delivery. | `src/app/[locale]/about/page.tsx` |
| `About.eyebrow` | Струмица · 2026 | Strumica · 2026 | `src/app/[locale]/about/page.tsx` |
| `About.h1` | Еден бренд, еден дизајнер. | One brand, one designer. | `src/app/[locale]/about/page.tsx` |
| `About.pressHeading` | Во печатот | In the press | `src/app/[locale]/about/page.tsx` |
| `About.quote` | „Мојот план е да започнам со свој бренд со наградата од ЕАМ“ | “My plan is to start my own brand with the prize from EAM.” | `src/app/[locale]/about/page.tsx` |
| `About.quoteAttribution` | Владимир Трајанов, Трн.мк, 12.06.2026 | Vladimir Trajanov, Trn.mk, 12 June 2026 | `src/app/[locale]/about/page.tsx` |
| `About.quoteNote` |  | Translated from Macedonian | `src/app/[locale]/about/page.tsx` |
| `About.toCatalog` | Разгледај го каталогот | Browse the catalog | `src/app/[locale]/about/page.tsx` |
| `Buy.add` | Додај во кошничка | Add to cart | `src/components/product/BuyButton.tsx` |
| `Buy.added` | Додадено. | Added. | `src/components/product/AddToCartPanel.tsx` |
| `Buy.adding` | Се додава… | Adding… | `src/components/product/BuyButton.tsx` |
| `Buy.comingSoon` | Наскоро | Coming soon | `src/components/product/BuyButton.tsx` |
| `Buy.soldOut` | Распродадено | Sold out | `src/components/product/BuyButton.tsx` |
| `Buy.viewCart` | Кон кошничката | View cart | `src/components/product/AddToCartPanel.tsx` |
| `Buy.viewProduct` | Погледни | View | _(not found in source)_ |
| `Cart.backToDrop` | Назад кон спуштањето | Back to the drop | `src/components/cart/CartView.tsx`<br>`src/components/checkout/CheckoutForm.tsx` |
| `Cart.capNotice` | Најмногу 2 парчиња по нарачка — залихите се ограничени и се резервираат при нарачка. | Max 2 items per order — stock is limited and reserved when you order. | `src/components/cart/CartView.tsx` |
| `Cart.checkout` | Кон нарачка | Checkout | `src/components/cart/CartView.tsx` |
| `Cart.codNote` | Плаќање со готовина при преземање. | Cash on delivery. | `src/components/cart/CartView.tsx` |
| `Cart.decrease` | Намали количина | Decrease quantity | `src/components/cart/CartView.tsx` |
| `Cart.empty` | Кошничката е празна. | Your cart is empty. | `src/components/cart/CartView.tsx`<br>`src/components/checkout/CheckoutForm.tsx` |
| `Cart.increase` | Зголеми количина | Increase quantity | `src/components/cart/CartView.tsx` |
| `Cart.qty` | Количина | Qty | _(not found in source)_ |
| `Cart.remove` | Отстрани | Remove | `src/components/cart/CartView.tsx` |
| `Cart.shipping` | Испорака | Shipping | `src/components/cart/CartView.tsx` |
| `Cart.shippingValue` | се пресметува при подигање | calculated on delivery | `src/components/cart/CartView.tsx` |
| `Cart.size` | Величина | Size | `src/components/cart/CartView.tsx` |
| `Cart.subtotal` | Меѓузбир | Subtotal | `src/components/cart/CartView.tsx` |
| `Cart.title` | Кошничка | Cart | `src/app/[locale]/cart/page.tsx` |
| `Cart.total` | Вкупно | Total | `src/components/cart/CartView.tsx` |
| `Catalog.countdownIntro` | Спуштањето уште не е отворено. Разгледувај; купувањето се отклучува кога тајмерот ќе стигне нула. | The drop isn't open yet. Browse now; buying unlocks when the timer hits zero. | `src/app/[locale]/catalog/page.tsx` |
| `Catalog.empty` | Нема активно спуштање во моментов. | No active drop right now. | `src/app/[locale]/catalog/page.tsx` |
| `Catalog.ended` | Ова спуштање заврши. | This drop has ended. | `src/app/[locale]/catalog/page.tsx` |
| `Catalog.live` | Спуштањето е во живо — залихите се вистински и ограничени. | The drop is live — stock is real and limited. | `src/app/[locale]/catalog/page.tsx` |
| `Catalog.title` | Каталог | Catalog | `src/app/[locale]/catalog/page.tsx` |
| `Checkout.address` | Адреса | Address | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.botCheck` | Проверка дека не си робот | Confirm you're not a robot | _(not found in source)_ |
| `Checkout.city` | Град | City | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.codSummary` | Плаќаш со готовина при преземање. Нема онлајн плаќање. | You pay cash on delivery. No online payment. | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.contact` | Твои податоци | Your details | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.errorPhone` | Внеси валиден телефонски број. | Enter a valid phone number. | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.errorRequired` | Ова поле е задолжително. | This field is required. | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.name` | Име и презиме | Full name | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.note` | Белешка (по избор) | Note (optional) | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.notePlaceholder` | Скала, спрат, ориентир… | Entrance, floor, landmark… | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.phone` | Телефон | Phone | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.placeOrder` | Нарачај | Place order | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.reserveNote` | Нарачката резервира залиха 48 часа. | Your order reserves stock for 48 hours. | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.summary` | Преглед на нарачката | Order summary | `src/components/checkout/CheckoutForm.tsx` |
| `Checkout.title` | Нарачка | Checkout | `src/app/[locale]/checkout/page.tsx` |
| `Checkout.verifying` | се проверува | verifying | `src/components/checkout/CheckoutForm.tsx` |
| `Common.currency` | ден | MKD | `src/app/[locale]/catalog/[slug]/page.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Common.languageEn` | EN | EN | `src/components/layout/LanguageSwitch.tsx` |
| `Common.languageMk` | МК | МК | `src/components/layout/LanguageSwitch.tsx` |
| `Common.shippingNotice` | Испорака само во Северна Македонија. Не доставуваме надвор од земјата. Плаќање со готовина при преземање. | We ship inside North Macedonia only. We can't deliver outside the country. Cash on delivery. | `src/components/system/ShippingNotice.tsx` |
| `Common.switchLanguage` | Промени јазик | Change language | `src/components/layout/LanguageSwitch.tsx` |
| `Contact.context` | Струмица, Северна Македонија · Испорака само низ Северна Македонија · Готовина при преземање. | Strumica, North Macedonia · Ships within North Macedonia only · Cash on delivery. | `src/app/[locale]/contact/page.tsx` |
| `Contact.emailLabel` | Е-пошта | Email | `src/app/[locale]/contact/page.tsx` |
| `Contact.eyebrow` | Контакт | Contact | `src/app/[locale]/contact/page.tsx` |
| `Contact.h1` | Стапи во контакт. | Get in touch. | `src/app/[locale]/contact/page.tsx` |
| `Contact.instagramLabel` | Инстаграм | Instagram | `src/app/[locale]/contact/page.tsx` |
| `Contact.instagramNote` | Тука се објавуваат спуштањата. Ова е главниот канал. | Drops are announced here. This is the main channel. | `src/app/[locale]/contact/page.tsx` |
| `Contact.phoneLabel` | Телефон | Phone | `src/app/[locale]/contact/page.tsx` |
| `Drop.days` | ДЕНА | DAYS | `src/components/drop/Countdown.tsx` |
| `Drop.ended` | Спуштањето заврши | Drop ended | `src/components/drop/DropBanner.tsx` |
| `Drop.endedFollow` | Следи {handle} за следното. | Follow {handle} for the next one. | `src/components/drop/DropBanner.tsx` |
| `Drop.hours` | ЧАСА | HRS | `src/components/drop/Countdown.tsx` |
| `Drop.live` | СПУШТАЊЕТО Е ВО ЖИВО | DROP IS LIVE | `src/components/drop/DropBanner.tsx` |
| `Drop.liveNow` | Во живо сега | Live now | _(not found in source)_ |
| `Drop.minutes` | МИН | MIN | `src/components/drop/Countdown.tsx` |
| `Drop.nextDrop` | Следно спуштање | Next drop | `src/components/drop/DropBanner.tsx` |
| `Drop.remaining` | Преостануваат {count} | {count} left | `src/components/drop/DropBanner.tsx` |
| `Drop.seconds` | СЕК | SEC | `src/components/drop/Countdown.tsx` |
| `Home.aboutLink` | Прво место на конкурс за дизајн | First place in a design competition | `src/components/home/HomeExperience.tsx` |
| `Home.browseWhileWait` | Разгледај додека чекаш | Browse while you wait | `src/components/home/HomeExperience.tsx` |
| `Home.eyebrow` | Следно спуштање | Next drop | _(not found in source)_ |
| `Home.headline` | Кога тајмерот ќе стигне нула, спуштањето е во живо. | When the timer hits zero, the drop is live. | `src/components/home/HomeExperience.tsx` |
| `Home.opening` | Се отвора… | Opening… | `src/components/home/HomeExperience.tsx` |
| `Home.sub` | 3 до 5 парчиња. Вистински, ограничени залихи. Готовина при преземање. | 3 to 5 pieces. Real, limited stock. Cash on delivery. | `src/components/home/HomeExperience.tsx` |
| `Home.tagline` | Наскоро. | Coming soon. | _(not found in source)_ |
| `Home.title` | Trajanov | Trajanov | _(not found in source)_ |
| `Meta.aboutDescription` | Еден бренд, еден дизајнер од Струмица. Приказната зад Trajanov. | One brand, one designer from Strumica. The story behind Trajanov. | `src/app/[locale]/about/page.tsx` |
| `Meta.aboutTitle` | За брендот — Trajanov | About — Trajanov | `src/app/[locale]/about/page.tsx` |
| `Meta.cartDescription` | Парчињата што ги избра, пред нарачка. | The pieces you picked, before you order. | `src/app/[locale]/cart/page.tsx` |
| `Meta.cartTitle` | Кошничка — Trajanov | Cart — Trajanov | `src/app/[locale]/cart/page.tsx` |
| `Meta.catalogDescription` | Парчињата во активното спуштање. Вистински, ограничени залихи. | The pieces in the active drop. Real, limited stock. | `src/app/[locale]/catalog/page.tsx` |
| `Meta.catalogTitle` | Каталог — Trajanov | Catalog — Trajanov | `src/app/[locale]/catalog/[slug]/page.tsx`<br>`src/app/[locale]/catalog/page.tsx` |
| `Meta.checkoutDescription` | Внеси ги податоците за достава. Плаќање со готовина при преземање, испорака само во Северна Македонија. | Enter your delivery details. Cash on delivery, shipping within North Macedonia only. | `src/app/[locale]/checkout/page.tsx` |
| `Meta.checkoutTitle` | Нарачка — Trajanov | Checkout — Trajanov | `src/app/[locale]/checkout/page.tsx` |
| `Meta.contactDescription` | Стапи во контакт: телефон и Инстаграм. Струмица, Северна Македонија. | Get in touch: phone and Instagram. Strumica, North Macedonia. | `src/app/[locale]/contact/page.tsx` |
| `Meta.contactTitle` | Контакт — Trajanov | Contact — Trajanov | `src/app/[locale]/contact/page.tsx` |
| `Meta.homeDescription` | Оверсајз унисекс маици од Струмица. Спуштања од 3 до 5 парчиња, вистински ограничени залихи, готовина при преземање. | Oversized unisex t-shirts from Strumica. Drops of 3 to 5 pieces, real limited stock, cash on delivery. | `src/app/[locale]/page.tsx` |
| `Meta.homeTitle` | Trajanov — следно спуштање | Trajanov — next drop | `src/app/[locale]/page.tsx` |
| `Meta.productDescription` | Оверсајз унисекс маица. Испорака само во Северна Македонија, готовина при преземање. | Oversized unisex t-shirt. Shipping within North Macedonia only, cash on delivery. | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Meta.siteDescription` | Оверсајз унисекс маици од Струмица, во ограничени спуштања. | Oversized unisex t-shirts from Strumica, in limited drops. | `src/app/[locale]/layout.tsx` |
| `Meta.siteTitle` | Trajanov — спуштања на облека | Trajanov — clothing drops | `src/app/[locale]/layout.tsx` |
| `Meta.styleguideDescription` | Внатрешен преглед на дизајн-системот. | Internal design-system reference. | `src/app/[locale]/styleguide/page.tsx` |
| `Meta.styleguideTitle` | Дизајн-систем — Trajanov | Design system — Trajanov | `src/app/[locale]/styleguide/page.tsx` |
| `Nav.about` | За брендот | About | `src/components/layout/SiteFooter.tsx` |
| `Nav.brand` | TRAJANOV | TRAJANOV | `src/components/layout/SiteFooter.tsx`<br>`src/components/layout/SiteHeader.tsx` |
| `Nav.cart` | Кошничка | Cart | `src/components/layout/SiteHeader.tsx` |
| `Nav.catalog` | Каталог | Catalog | `src/components/layout/SiteHeader.tsx` |
| `Nav.contact` | Контакт | Contact | `src/components/layout/SiteFooter.tsx` |
| `Nav.home` | Почетна | Home | _(not found in source)_ |
| `Nav.location` | Струмица, Северна Македонија | Strumica, North Macedonia | `src/components/layout/SiteFooter.tsx` |
| `Order.capViolated` | Најмногу 2 парчиња по нарачка. | Max 2 items per order. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.duplicatePhone` | Веќе имаш активна нарачка со овој број за ова спуштање. | You already have a live order with this number for this drop. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.emptyCart` | Кошничката е празна. | Your cart is empty. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.genericError` | Нешто тргна наопаку. Пробај повторно. | Something went wrong. Try again. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.noDrop` | Нема активно спуштање во моментов. | No active drop right now. | _(not found in source)_ |
| `Order.notOpen` | Спуштањето не е отворено во моментов. | The drop isn't open right now. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.priceMissing` | Грешка кај нас: нема поставена цена. Не наплативме ништо. Пробај подоцна. | Our mistake: no price is set. You weren't charged. Try later. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.protected` | Заштита од роботи. | Bot protection. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.rateLimited` | Премногу обиди од оваа мрежа. Почекај малку и пробај пак. | Too many attempts from this network. Wait a moment and try again. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.soldOut` | Некој беше побрз. Последното парче штотуку замина. | Someone got there first. The last one just went. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.success` | Нарачка {orderNumber} е примена и резервирана 48 часа. Плаќаш со готовина при преземање — ќе те побараме телефонски за да ја потврдиме. | Order {orderNumber} received and reserved for 48 hours. You pay cash on delivery — we'll call you to confirm. | `src/components/checkout/CheckoutForm.tsx` |
| `Order.turnstileFailed` | Проверката не помина. Пробај повторно. | That check didn't pass. Try again. | `src/components/checkout/CheckoutForm.tsx` |
| `Placeholder.composition` | [PLACEHOLDER: состав и нега — од етикетата] | [PLACEHOLDER: composition & care — from the label] | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Placeholder.email` | [PLACEHOLDER: е-пошта — Владимир] | [PLACEHOLDER: email — Vladimir] | `src/app/[locale]/contact/page.tsx` |
| `Placeholder.notice` | Преглед на дизајн-системот. Податоците за производите (назив, цена, величини, состав, фотографии) се примероци — вистинските ги внесува Владимир во подоцнежна фаза. | Design-system preview. Product data (name, price, sizes, composition, photos) is placeholder — the real values are entered by Vladimir in a later phase. | `src/components/system/PreviewNotice.tsx` |
| `Placeholder.price` | [PLACEHOLDER: цена MKD] | [PLACEHOLDER: price MKD] | `src/app/[locale]/catalog/[slug]/page.tsx`<br>`src/components/cart/CartView.tsx`<br>`src/components/checkout/CheckoutForm.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Placeholder.productName` | Производ | Product | `src/app/[locale]/catalog/[slug]/page.tsx`<br>`src/components/cart/CartView.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Placeholder.productPhoto` | [PLACEHOLDER: фотографија — Владимир] | [PLACEHOLDER: product photo — Vladimir] | `src/app/[locale]/catalog/[slug]/page.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Placeholder.sizesSample` | величини — примерок, се чекаат од Владимир | sizes — sample, pending Vladimir | `src/components/product/AddToCartPanel.tsx` |
| `Product.back` | Назад кон каталогот | Back to catalog | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Product.chooseSize` | Избери величина | Choose a size | `src/components/product/AddToCartPanel.tsx` |
| `Product.composition` | Состав и нега | Composition & care | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Product.details` | Детали | Details | _(not found in source)_ |
| `Product.oneUnitLimit` | Најмногу 2 парчиња по нарачка. | Max 2 items per order. | `src/components/product/AddToCartPanel.tsx` |
| `Product.shipping` | Испорака | Shipping | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Product.shippingBody` | Само во Северна Македонија. Плаќање со готовина при преземање. | North Macedonia only. Cash on delivery. | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Product.size` | Величина | Size | `src/components/product/AddToCartPanel.tsx` |
| `Product.sizeGuide` | Водич за величини | Size guide | _(not found in source)_ |
| `Stock.inStock` | На залиха | In stock | `src/components/drop/StockBadge.tsx` |
| `Stock.low` | Уште {count} | {count} left | `src/components/drop/StockBadge.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Stock.soldOut` | Распродадено | Sold out | `src/components/drop/StockBadge.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Styleguide.buyButton` | Копче за купување | Buy button | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.colors` | Боја | Colour | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.countdown` | Одбројување | Countdown | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.dropBanner` | Банер за спуштање | Drop banner | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.field` | Поле за нарачка | Checkout field | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.intro` | Секоја состојба од хендоверот, во живо и со токени од brand.md. | Every state from the handover, live, driven by brand.md tokens. | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.productCard` | Картичка за производ | Product card | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.sampleNote` | Пример за приказ на токенот — не е вистинска цена. | Sample to show the token — not a real price. | _(not found in source)_ |
| `Styleguide.sizePicker` | Избор на величина | Size picker | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.stockBadge` | Ознака за залиха | Stock badge | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.title` | Дизајн-систем | Design system | `src/app/[locale]/styleguide/page.tsx` |
| `Styleguide.type` | Типографија | Type | `src/app/[locale]/styleguide/page.tsx` |

## Intentionally not translated

These are correct as-is — **not** review bugs.

| String | Where | Why |
|---|---|---|
| Trajanov — the brand wordmark | Nav.brand, Home.title | A proper noun. Identical in both locales by design. |
| МК / EN — language pill labels | Common.languageMk, Common.languageEn | Each labels a language in its own script; the same in both builds. |
| @trajanovv2026 — Instagram handle | src/lib/social.ts | A handle, not copy. facts.md §6. Not in the catalog. |
| 078 820 520 — phone number | src/lib/social.ts | A number, not copy. facts.md §5. Not in the catalog. |
| About pull-quote — Vladimir's exact Трн.мк words | About.quote, About.quoteAttribution (MK) | A verbatim citation (D-1.05-6). The EN build renders a marked translation; the MK original is fixed. |
| Press outlet names + URLs | src/app/[locale]/about/page.tsx (PRESS[]) | Data copied verbatim from facts.md §4 — proper nouns and links, not translatable copy. |
| Styleguide field labels ("Default", "Error", …) | src/app/[locale]/styleguide/page.tsx | Internal review aid, not a customer surface, not localised (D-2.01-4). |
| Dev-only preview labels | DevPreviewSwitch, HomeExperience PreviewBadge | Never rendered in production (returns null / preview refused when NODE_ENV=production). |

## MK and EN values are byte-identical

A flag list for human eyes — some are correct (proper nouns, symbols), some may want a
different MK wording. **Not** an error on its own.

| Key | Value |
|---|---|
| `Common.languageEn` | EN |
| `Common.languageMk` | МК |
| `Home.title` | Trajanov |
| `Nav.brand` | TRAJANOV |
