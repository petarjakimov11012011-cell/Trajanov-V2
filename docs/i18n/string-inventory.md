# String inventory — Trajanov-V2

> **Generated — do not edit by hand.** Regenerate with `npm run i18n:inventory`.
> Source: `src/messages/mk.json` + `src/messages/en.json`. MK is the source language;
> EN is a translation of it, not a paraphrase. For Phase 2.02 (native MK review).

**Keys:** 241 (MK and EN key sets are identical — enforced by `tests/i18n/catalog-parity.test.ts`).

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
| `Common.lastUpdated` | Последно ажурирано | Last updated | `src/app/[locale]/privacy/page.tsx`<br>`src/app/[locale]/shipping-returns/page.tsx`<br>`src/app/[locale]/terms/page.tsx` |
| `Common.shippingNotice` | Испорака само во Северна Македонија. Не доставуваме надвор од земјата. Плаќање со готовина при преземање. | We ship inside North Macedonia only. We can't deliver outside the country. Cash on delivery. | `src/components/system/ShippingNotice.tsx` |
| `Common.skipToContent` | Прескокни до содржината | Skip to content | `src/app/[locale]/layout.tsx` |
| `Common.switchLanguage` | Промени јазик | Change language | `src/components/layout/LanguageSwitch.tsx` |
| `Contact.context` | Струмица, Северна Македонија · Испорака само низ Северна Македонија · Готовина при преземање. | Strumica, North Macedonia · Ships within North Macedonia only · Cash on delivery. | `src/app/[locale]/contact/page.tsx` |
| `Contact.emailLabel` | Е-пошта | Email | `src/app/[locale]/contact/page.tsx` |
| `Contact.eyebrow` | Контакт | Contact | `src/app/[locale]/contact/page.tsx` |
| `Contact.h1` | Стапи во контакт. | Get in touch. | `src/app/[locale]/contact/page.tsx` |
| `Contact.instagramLabel` | Инстаграм | Instagram | `src/app/[locale]/contact/page.tsx` |
| `Contact.instagramNote` | Тука се објавуваат спуштањата. Ова е главниот канал. | Drops are announced here. This is the main channel. | `src/app/[locale]/contact/page.tsx` |
| `Contact.phoneLabel` | Телефон | Phone | `src/app/[locale]/contact/page.tsx` |
| `Credit.builtBy` | Изработено од <link>Vertex Consulting</link> | Built by <link>Vertex Consulting</link> | `src/components/layout/SiteHeader.tsx` |
| `Credit.opensInNewTab` | се отвора во нов прозорец | opens in a new tab | `src/components/layout/SiteHeader.tsx` |
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
| `Faq.a1` | Само додека трае спуштање. Меѓу спуштањата сè може да се разгледа, но ништо не може да се купи. Тајмерот на почетната страница покажува кога се отвора следното. | Only while a drop is on. Between drops you can look at everything, but nothing is buyable. The timer on the home page shows when the next one opens. | _(not found in source)_ |
| `Faq.a2` | Готовина при преземање, кога пратката ќе пристигне. Нема картички, нема банкарски трансфер, нема плаќање однапред. | Cash on delivery, when the package arrives. No cards, no bank transfer, no paying up front. | _(not found in source)_ |
| `Faq.a3` | Најмногу 2 парчиња по нарачка. Залихата е вистинска и ограничена — кога ќе се распродаде, готово е. | Two pieces per order, maximum. The stock is real and limited — once it's sold out, it's gone. | _(not found in source)_ |
| `Faq.a4` | Само во Северна Македонија. Нема испорака во странство. | Within North Macedonia only. No international shipping. | _(not found in source)_ |
| `Faq.a5` | Рок на достава: 3–5 работни дена. Курирот и цената на испораката сè уште не се потврдени и нема да ги погодуваме — плаќаш готовина на врата. | Delivery takes 3 to 5 business days. The courier and the delivery cost aren't confirmed yet and we're not going to guess them — you pay cash at the door. | _(not found in source)_ |
| `Faq.a6` | Нарачката ја резервира залихата 48 часа — не се продава веднаш. Те бараме телефонски за да ја потврдиме. Ако не те фатиме, резервацијата истекува и парчето се враќа во продажба. | Your order holds the stock for 48 hours — it isn't sold on the spot. We call you to confirm it. If we can't reach you, the hold expires and the piece goes back on sale. | _(not found in source)_ |
| `Faq.a7` | Величините стојат на страницата на секое парче, заедно со тоа што е сè уште достапно. Маиците се оверсајз унисекс крој. Точни мерки во сантиметри сè уште не се објавени. | Sizes are listed on each piece's own page, along with what's still available. The t-shirts are an oversized unisex cut. Exact measurements in centimetres aren't published yet. | _(not found in source)_ |
| `Faq.a8` | Секое спуштање е од 3 до 5 парчиња, во ограничен број. Кога ќе пишува „Распродадено“, навистина е распродадено — залихата се води на серверот, не на екранот. | Each drop is 3 to 5 pieces, in limited numbers. When it says "Sold out", it really is sold out — the stock is counted on the server, not on the screen. | _(not found in source)_ |
| `Faq.groupDelivery` | Достава | Delivery | _(not found in source)_ |
| `Faq.groupOrdering` | Нарачка | Ordering | _(not found in source)_ |
| `Faq.groupPieces` | Парчињата | The pieces | _(not found in source)_ |
| `Faq.h2` | Често поставувани прашања | Frequently Asked Questions | `src/components/home/HomeFaq.tsx` |
| `Faq.moreLink` | Пиши или јави се | Email or call | `src/components/home/HomeFaq.tsx` |
| `Faq.moreQuestion` | Друго прашање? | Another question? | `src/components/home/HomeFaq.tsx` |
| `Faq.q1` | Кога можам да купам? | When can I buy? | _(not found in source)_ |
| `Faq.q2` | Како плаќам? | How do I pay? | _(not found in source)_ |
| `Faq.q3` | Колку парчиња можам да нарачам? | How many pieces can I order? | _(not found in source)_ |
| `Faq.q4` | Каде испорачувате? | Where do you ship? | _(not found in source)_ |
| `Faq.q5` | Колку трае доставата? | How long does delivery take? | _(not found in source)_ |
| `Faq.q6` | Што се случува откако ќе нарачам? | What happens after I order? | _(not found in source)_ |
| `Faq.q7` | Кои величини ги има? | What sizes are there? | _(not found in source)_ |
| `Faq.q8` | Зошто парчињата се толку малку? | Why are there so few pieces? | _(not found in source)_ |
| `Footer.contact` | КОНТАКТ | CONTACT | `src/components/layout/SiteFooter.tsx` |
| `Footer.rights` | © 2026 Трајанов. Сите права задржани. | © 2026 Trajanov. All rights reserved. | `src/components/layout/SiteFooter.tsx` |
| `Footer.social` | СЛЕДИ | FOLLOW | `src/components/layout/SiteFooter.tsx` |
| `Home.aboutLink` | Прво место на конкурс за дизајн | First place in a design competition | `src/components/home/HomeExperience.tsx` |
| `Home.browseWhileWait` | Разгледај додека чекаш | Browse while you wait | `src/components/home/HomeExperience.tsx` |
| `Home.eyebrow` | Следно спуштање | Next drop | _(not found in source)_ |
| `Home.headline` | Кога тајмерот ќе стигне нула, спуштањето е во живо. | When the timer hits zero, the drop is live. | `src/components/home/HomeExperience.tsx` |
| `Home.opening` | Се отвора… | Opening… | `src/components/home/HomeExperience.tsx` |
| `Home.sub` | 3 до 5 парчиња. Вистински, ограничени залихи. Готовина при преземање. | 3 to 5 pieces. Real, limited stock. Cash on delivery. | `src/components/home/HomeExperience.tsx` |
| `Home.tagline` | Наскоро. | Coming soon. | _(not found in source)_ |
| `Home.title` | Trajanov | Trajanov | `src/components/home/HomeExperience.tsx` |
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
| `Meta.privacyDescription` | Што собираме кога нарачуваш и зошто. Само име, телефон, град и адреса — без е-пошта, без рекламни колачиња. | What we collect when you order, and why. Just name, phone, city and address — no email, no advertising cookies. | `src/app/[locale]/privacy/page.tsx` |
| `Meta.privacyTitle` | Приватност — Trajanov | Privacy — Trajanov | `src/app/[locale]/privacy/page.tsx` |
| `Meta.productDescription` | Оверсајз унисекс маица. Испорака само во Северна Македонија, готовина при преземање. | Oversized unisex t-shirt. Shipping within North Macedonia only, cash on delivery. | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Meta.shippingDescription` | Испорака само во Северна Македонија, плаќање готовина при преземање. Ако нешто не е во ред, јави се. | Shipping within North Macedonia only, cash on delivery. If something is wrong, call us. | `src/app/[locale]/shipping-returns/page.tsx` |
| `Meta.shippingTitle` | Испорака и враќање — Trajanov | Shipping & returns — Trajanov | `src/app/[locale]/shipping-returns/page.tsx` |
| `Meta.siteDescription` | Оверсајз унисекс маици од Струмица, во ограничени спуштања. | Oversized unisex t-shirts from Strumica, in limited drops. | `src/app/[locale]/layout.tsx` |
| `Meta.siteTitle` | Trajanov — спуштања на облека | Trajanov — clothing drops | `src/app/[locale]/layout.tsx` |
| `Meta.styleguideDescription` | Внатрешен преглед на дизајн-системот. | Internal design-system reference. | `src/app/[locale]/styleguide/page.tsx` |
| `Meta.styleguideTitle` | Дизајн-систем — Trajanov | Design system — Trajanov | `src/app/[locale]/styleguide/page.tsx` |
| `Meta.termsDescription` | Како тече нарачката: готовина при преземање, испорака само во Северна Македонија, резервација 48 часа. | How ordering works: cash on delivery, shipping within North Macedonia only, 48-hour reservation. | `src/app/[locale]/terms/page.tsx` |
| `Meta.termsTitle` | Услови на продажба — Trajanov | Terms of sale — Trajanov | `src/app/[locale]/terms/page.tsx` |
| `Nav.about` | За брендот | About | `src/components/layout/SiteFooter.tsx`<br>`src/components/layout/SiteHeader.tsx` |
| `Nav.brand` | TRAJANOV | TRAJANOV | `src/components/layout/SiteHeader.tsx` |
| `Nav.cart` | Кошничка | Cart | `src/components/layout/SiteHeader.tsx` |
| `Nav.catalog` | Каталог | Catalog | `src/components/layout/SiteHeader.tsx` |
| `Nav.contact` | Контакт | Contact | `src/components/layout/SiteFooter.tsx`<br>`src/components/layout/SiteHeader.tsx` |
| `Nav.home` | Почетна | Home | _(not found in source)_ |
| `Nav.location` | Струмица, Северна Македонија | Strumica, North Macedonia | _(not found in source)_ |
| `Nav.privacy` | Приватност | Privacy | `src/components/layout/SiteFooter.tsx` |
| `Nav.shipping` | Испорака и враќање | Shipping & returns | `src/components/layout/SiteFooter.tsx` |
| `Nav.terms` | Услови | Terms | `src/components/layout/SiteFooter.tsx` |
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
| `Placeholder.courier` | [PLACEHOLDER: курир и цена на испорака — Владимир] | [PLACEHOLDER: courier and delivery cost — Vladimir] | `src/app/[locale]/shipping-returns/page.tsx` |
| `Placeholder.notice` | Преглед на дизајн-системот. Податоците за производите (назив, цена, величини, состав, фотографии) се примероци — вистинските ги внесува Владимир во подоцнежна фаза. | Design-system preview. Product data (name, price, sizes, composition, photos) is placeholder — the real values are entered by Vladimir in a later phase. | `src/components/system/PreviewNotice.tsx` |
| `Placeholder.price` | [PLACEHOLDER: цена MKD] | [PLACEHOLDER: price MKD] | `src/app/[locale]/catalog/[slug]/page.tsx`<br>`src/components/cart/CartView.tsx`<br>`src/components/checkout/CheckoutForm.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Placeholder.productName` | Производ | Product | `src/app/[locale]/catalog/[slug]/page.tsx`<br>`src/components/cart/CartView.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Placeholder.productPhoto` | [PLACEHOLDER: фотографија — Владимир] | [PLACEHOLDER: product photo — Vladimir] | `src/app/[locale]/catalog/[slug]/page.tsx`<br>`src/components/product/ProductCard.tsx` |
| `Placeholder.returnsWindow` | [PLACEHOLDER: рок за враќање и замена — Владимир] | [PLACEHOLDER: returns and exchange window — Vladimir] | `src/app/[locale]/shipping-returns/page.tsx` |
| `Placeholder.sizesSample` | величини — примерок, се чекаат од Владимир | sizes — sample, pending Vladimir | `src/components/product/AddToCartPanel.tsx` |
| `Privacy.abuseBody` | Бидејќи нарачувањето е бесплатно, чуваме еднонасочно хеширана верзија на твојата IP-адреса за да ограничиме колку нарачки доаѓаат од една врска. Суровата IP-адреса никогаш не се чува. | Because ordering is free, we store a one-way hashed form of your IP address to limit how many orders come from one connection. The raw IP is never stored. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.abuseHeading` | Заштита од злоупотреба | Anti-abuse | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.browserBody` | Кошничката живее во sessionStorage и исчезнува кога ќе го затвориш јазичето. Нема рекламни колачиња, нема пиксели за следење, нема аналитички колачиња, нема пиксели од социјални мрежи. | The cart lives in sessionStorage and disappears when you close the tab. No advertising cookies, no tracking pixels, no analytics cookies, no social pixels. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.browserHeading` | Во твојот прелистувач | In your browser | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.collectBody` | Име, телефонски број, град, адреса и белешката ако ја пополниш. Тоа е сè. Не собираме е-пошта — нема поле за е-пошта. | Name, phone number, city, address, and your note if you leave one. That's everything. We don't collect your email — there is no email field. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.collectHeading` | Што собираме кога нарачуваш | What we collect when you order | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.deleteBody` | Јави се телефонски и ќе ги избришеме. Нема формулар и нема портал — само телефонскиот број. | Call us and we'll delete them. No form, no portal — just the phone number. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.deleteHeading` | Како да ги избришеш податоците | How to delete your data | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.eyebrow` | Правно | Legal | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.h1` | Приватност | Privacy | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.intro` | Собираме само она што ни треба за да ти ја доставиме маицата. Ништо повеќе. | We collect only what we need to get the shirt to you. Nothing more. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.responsibleBody` | Владимир Трајанов, Струмица, Северна Македонија. | Vladimir Trajanov, Strumica, North Macedonia. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.responsibleHeading` | Кој е одговорен | Who is responsible | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.storageBody` | Во база на податоци хостирана во Франкфурт, Германија. | In a database hosted in Frankfurt, Germany. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.storageHeading` | Каде се чуваат | Where it's stored | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.whoBody` | Владимир и курирот што ти доставува. Деталите за нарачката му се праќаат на Владимир по е-пошта за да може да те побара. | Vladimir, and the courier who delivers to you. The order details are emailed to Vladimir so he can call you. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.whoHeading` | Кој ги гледа | Who sees it | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.whyBody` | За да ти ја доставиме маицата и да те побараме телефонски за да ја потврдиме нарачката. Тоа е единствената употреба. | To deliver the shirt and to call you to confirm the order. That is the only use. | `src/app/[locale]/privacy/page.tsx` |
| `Privacy.whyHeading` | Зошто | Why | `src/app/[locale]/privacy/page.tsx` |
| `Product.back` | Назад кон каталогот | Back to catalog | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Product.chooseSize` | Избери величина | Choose a size | `src/components/product/AddToCartPanel.tsx` |
| `Product.composition` | Состав и нега | Composition & care | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Product.details` | Детали | Details | _(not found in source)_ |
| `Product.oneUnitLimit` | Најмногу 2 парчиња по нарачка. | Max 2 items per order. | `src/components/product/AddToCartPanel.tsx` |
| `Product.shipping` | Испорака | Shipping | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Product.shippingBody` | Само во Северна Македонија. Плаќање со готовина при преземање. | North Macedonia only. Cash on delivery. | `src/app/[locale]/catalog/[slug]/page.tsx` |
| `Product.size` | Величина | Size | `src/components/product/AddToCartPanel.tsx` |
| `Product.sizeGuide` | Водич за величини | Size guide | _(not found in source)_ |
| `ShippingReturns.deliveryBody` | Курирот и цената на испорака сè уште ги немаме потврдено. Не сакаме да погодуваме бидејќи плаќаш готовина на врата. | The courier and delivery cost aren't confirmed yet. We won't guess, because you pay cash at the door. | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.deliveryHeading` | Курир, време и цена на испорака | Courier, delivery time and cost | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.deliveryTime` | Рок на достава: 3–5 работни дена. | Delivery time: 3–5 business days. | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.eyebrow` | Правно | Legal | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.h1` | Испорака и враќање | Shipping & returns | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.intro` | Каде испорачуваме, како плаќаш и што да правиш ако нешто не е во ред. | Where we ship, how you pay, and what to do if something's wrong. | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.limitsBody` | Нема онлајн систем за враќање и нема претплатена етикета за враќање. Ако треба да вратиш нешто, оди преку телефон. | There is no online returns portal and no prepaid return label. If you need to return something, it goes through the phone. | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.limitsHeading` | Што сè уште не можеме | What we can't do yet | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.paymentBody` | Плаќаш готовина на курирот кога пратката ќе пристигне. | You pay the courier in cash when the parcel arrives. | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.paymentHeading` | Плаќање при достава | Payment on delivery | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.problemBody` | Погрешна величина, оштетено пакување или пратката не пристигнала — јави се на телефонскиот број и Владимир ќе го среди директно. | Wrong size sent, damaged packaging, or the parcel never arrived — call the phone number and Vladimir will sort it out directly. | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.problemHeading` | Ако нешто не е во ред со нарачката | If something is wrong with your order | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.returnsBody` | Точниот рок сè уште го немаме потврдено. | We don't have the exact window confirmed yet. | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.returnsHeading` | Рок за враќање и замена | Returns and exchange window | `src/app/[locale]/shipping-returns/page.tsx` |
| `ShippingReturns.whereHeading` | Каде испорачуваме | Where we ship | `src/app/[locale]/shipping-returns/page.tsx` |
| `Stock.inStock` | На залиха | In stock | `src/components/drop/StockBadge.tsx` |
| `Stock.low` | Уште {count} | {count} left | `src/components/drop/StockBadge.tsx` |
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
| `Terms.contactBody` | Најбрзо нè фаќаш по телефон или на Инстаграм. | The fastest way to reach us is by phone or on Instagram. | `src/app/[locale]/terms/page.tsx` |
| `Terms.contactHeading` | Како да нè побараш | How to reach us | `src/app/[locale]/terms/page.tsx` |
| `Terms.eyebrow` | Правно | Legal | `src/app/[locale]/terms/page.tsx` |
| `Terms.h1` | Услови на продажба | Terms of sale | `src/app/[locale]/terms/page.tsx` |
| `Terms.intro` | Ова е мал бренд без фирма зад него. Еве точно како тече нарачката — без ситни букви. | This is a small brand with no company behind it. Here's exactly how ordering works — no fine print. | `src/app/[locale]/terms/page.tsx` |
| `Terms.noBody` | Нема профили, нема зачувани картички, нема претплати, нема кодови за попуст. | No accounts, no saved cards, no subscriptions, no discount codes. | `src/app/[locale]/terms/page.tsx` |
| `Terms.noHeading` | Што не правиме | What we don't do | `src/app/[locale]/terms/page.tsx` |
| `Terms.orderingBody1` | Кога нарачуваш, залихата се резервира 48 часа — не се продава веднаш. Те бараме телефонски за да ја потврдиме. Ако не те фатиме, резервацијата истекува и парчето се враќа во продажба. | When you order, the stock is reserved for 48 hours — not sold on the spot. We call you to confirm. If we can't reach you, the reservation lapses and the piece goes back on sale. | `src/app/[locale]/terms/page.tsx` |
| `Terms.orderingBody2` | Најмногу 2 парчиња по нарачка. Спуштањата се ограничени и залихата е вистинска — кога ќе се распродаде, готово е. | Maximum 2 items per order. Drops are limited and the stock is real — when it's gone, it's gone. | `src/app/[locale]/terms/page.tsx` |
| `Terms.orderingHeading` | Како тече нарачката | How ordering works | `src/app/[locale]/terms/page.tsx` |
| `Terms.paymentBody` | Плаќаш готовина при преземање, кога пратката ќе пристигне. Нема картички, нема банкарски трансфер, нема плаќање однапред. | You pay cash on delivery, when the parcel arrives. No cards, no bank transfer, no paying in advance. | `src/app/[locale]/terms/page.tsx` |
| `Terms.paymentHeading` | Плаќање | Payment | `src/app/[locale]/terms/page.tsx` |
| `Terms.pricesBody` | Цените се во денари (MKD) и стојат на страницата на производот. Тоа е износот што му го плаќаш на курирот. Нема конверзија во друга валута. | Prices are in Macedonian denars (MKD) and shown on the product page. That is the amount you pay the courier. There is no conversion to any other currency. | `src/app/[locale]/terms/page.tsx` |
| `Terms.pricesHeading` | Цени | Prices | `src/app/[locale]/terms/page.tsx` |
| `Terms.sellerBody` | Trajanov го води Владимир Трајанов, од Струмица, Северна Македонија. Нема регистрирана фирма и нема продавница со адреса. Еден човек стои зад брендот. | Trajanov is run by Vladimir Trajanov, in Strumica, North Macedonia. There is no registered company and no shop with an address. One person stands behind the brand. | `src/app/[locale]/terms/page.tsx` |
| `Terms.sellerHeading` | Од кого купуваш | Who you buy from | `src/app/[locale]/terms/page.tsx` |
| `Terms.shippingBody` | Испорачуваме само во Северна Македонија. Нема испорака во странство. | We ship inside North Macedonia only. No delivery abroad. | `src/app/[locale]/terms/page.tsx` |
| `Terms.shippingHeading` | Каде испорачуваме | Where we ship | `src/app/[locale]/terms/page.tsx` |

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
