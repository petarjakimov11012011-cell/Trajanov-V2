import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {getTranslations, getLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PhotoSlot} from '@/components/system/PhotoSlot';
import {getProductImage, getProductSecondImage} from '@/lib/product-images';
import {getProductCare} from '@/lib/product-care';
import {DisplayPrice} from '@/components/system/DisplayPrice';
import {AmountDue} from '@/components/product/AmountDue';
import {ShippingNotice} from '@/components/system/ShippingNotice';
import {StockBadge} from '@/components/drop/StockBadge';
import {AddToCartPanel} from '@/components/product/AddToCartPanel';
import {getProductView, parsePreviewState} from '@/lib/drop/state';
import {buyStateFor, visibleStock} from '@/lib/drop/display';
import {pageMetadata} from '@/lib/metadata';
import {getPathname} from '@/i18n/navigation';
import {SITE_URL} from '@/lib/site';
import {productJsonLd} from '@/lib/seo/product-jsonld';
import {JsonLd} from '@/components/seo/JsonLd';

// Product data is read from the DB per request (D-1.04-9); no static params.
export const dynamic = 'force-dynamic';

const pad2 = (n: number) => String(n).padStart(2, '0');

// This page's slot geometry, which stopped matching PhotoSlot's catalog default when the pair
// collapsed to one column below `sm:` (D-2.25-10 / D-2.25-15). Measured against the real layout:
// below 640px the slot is the whole `max-w-6xl px-4` column (~100vw); from 640px the pair is two
// columns of that same full-width column (~50vw); from 1024px the outer `lg:grid-cols-2` halves the
// 1152px container first, so each slot is ~280px. If either grid changes, this changes with it.
const PRODUCT_SLOT_SIZES = '(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw';

// ONE photograph (Y.11, brief decision 8 — the empty second slot is omitted, not shown as a marker). It
// takes the whole gallery column: ~536px at lg (half of the 1104px content box, less the gap), capped
// at `max-w-md` (448px) from 640px so a tablet does not stack a 1,000px-tall photo above the buy path,
// and the full column on a phone.
const PRODUCT_SINGLE_SIZES = '(min-width: 1024px) 536px, (min-width: 640px) 448px, 100vw';

// Per-locale title from the product's real name (or the neutral placeholder + index while names are
// OWED); generic per-locale description; reciprocal hreflang for the SHARED product slug (D-2.01-2/5/6).
export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale});
  const result = await getProductView(slug);
  const realName = result
    ? locale === 'mk'
      ? result.product.nameMk
      : result.product.nameEn
    : null;
  const title = result
    ? (realName ?? `${t('Placeholder.productName')} ${pad2(result.product.index)}`)
    : t('Meta.catalogTitle');
  return pageMetadata({
    href: {pathname: '/catalog/[slug]', params: {slug}},
    locale,
    title,
    description: t('Meta.productDescription'),
    // The share card + og:title use the REAL name, or a neutral brand title while names are
    // placeholders — never the neutral slot ("Производ 01") baked into a card (Task 5/6 scope).
    ogTitle: realName ?? t('Meta.catalogTitle'),
  });
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string; slug: string}>;
  searchParams: Promise<{preview?: string}>;
}) {
  const {slug} = await params;
  const {preview} = await searchParams;
  const result = await getProductView(slug, {preview: parsePreviewState(preview)});
  if (!result) notFound();

  const {product, dropSlug, dropState} = result;
  const t = await getTranslations();
  const locale = await getLocale();

  // What the page SAYS about stock and buying is the server's drop state through one rule
  // (src/lib/drop/display.ts, brief decision 7): live → real stock; countdown → coming soon; ended or
  // no drop → ordering is closed, no stock line, never "Sold out". create_order() still gates orders.
  const stock = visibleStock(dropState, product.stock);
  const soldOut = stock === 'sold-out';
  const buyState = buyStateFor(dropState, product.stock);
  const realName = locale === 'mk' ? product.nameMk : product.nameEn;
  const title = realName ?? `${t('Placeholder.productName')} ${pad2(product.index)}`;

  // Looked up by SLUG, never by position (D-Y.03-1). The gallery shows REAL photographs only (brief
  // decision 8): the second slot renders only where a second frame exists (Product 03 today). The first
  // slot always renders; with no photograph at all it is a neutral "No photo yet" frame, never a marker.
  const photo = getProductImage(product.slug);
  const photo2 = getProductSecondImage(product.slug);
  const photoAlt = (p: NonNullable<typeof photo>) => ({
    src: p.src,
    alt: t(p.altKey),
    objectPosition: p.objectPosition,
  });

  // Composition & care, also looked up by SLUG and never by position (D-Y.06-1) — a fabric claim landing
  // on the wrong colourway is a false material claim, not a cosmetic slip. `product` above is a
  // ProductView built from the DATABASE, which has no care column (that is Y.01, D-1.06-3), so the copy
  // comes from `src/config/products.ts` beside it — the same shape as the photo lookup. All three shirts
  // carry the owner's statement (facts.md §7, D-Y.07-1). A product with none gets NO section: omission
  // states nothing false, where a `[PLACEHOLDER: …]` marker showed an internal note to customers (brief
  // decision 3, superseding the null → placeholder branch of D-Y.06-2).
  const care = getProductCare(product.slug);
  const careCopy = (locale === 'mk' ? care?.mk : care?.en) ?? null;

  // Product structured data (Task 5): a node is emitted ONLY once the product has a real name; while
  // names are placeholders (register #4) `productJsonLd` returns null and nothing ships. Price + MKD +
  // availability come from the real server state; image/description are omitted while placeholdered.
  const productUrl =
    SITE_URL +
    getPathname({href: {pathname: '/catalog/[slug]', params: {slug: product.slug}}, locale});
  const jsonLd = productJsonLd({
    name: realName,
    priceMkd: product.priceMkd,
    stock: product.stock,
    dropState,
    url: productUrl,
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      {jsonLd && <JsonLd data={jsonLd} />}
      <Link
        href="/catalog"
        className="tap-44 text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-small transition-colors duration-[var(--motion-fast)]"
      >
        <ArrowLeft className="h-4 w-4" /> {t('Product.back')}
      </Link>

      {/* Buy path above the fold */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* BOTH slots are slug-keyed lookups, never positional (D-Y.03-1). The first takes the interim
            lifestyle frame when one exists (D-Y.03-7, extended to baby blue by D-Y.08-2); the second
            renders only where a second frame exists, which today is Product 03 alone (D-Y.08-3).
            Products 01 and 02 used to show a `[PLACEHOLDER: …]` slot 2 to signal that their back /
            print-detail shot is owed; that was an internal note on a customer page, so the slot is now
            omitted (Y.11, brief decision 8). The debt is unchanged and lives in placeholder register
            #2 — the neutral set stays OWED for all three colourways. */}
        {/* One column below `sm:` (D-2.25-10, figures corrected by D-2.25-21). Two 4:5 slots side by
            side on a 320px phone measured 138×173 each — too small to judge a garment by, which is
            the only thing this page is for; one column makes each 288×360. The cost is real and
            accepted: the slot pair grows 172.5px → 732px, pushing the price down **559.5px** at
            320px — measured in BOTH locales on the production build, MK 567.4 → 1126.9 and EN
            547.9 → 1107.4 (the ~19.5px locale offset is one extra wrapped line of `PreviewNotice`).
            So the buy path sits below two screens of scroll while the second slot is still a hatched
            placeholder (register #2). One `sm:` word reverses it. */}
        {photo2 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PhotoSlot
              label={t('Product.noPhoto')}
              muted={soldOut}
              sizes={PRODUCT_SLOT_SIZES}
              image={photo && photoAlt(photo)}
            />
            <PhotoSlot
              label={t('Product.noPhoto')}
              muted={soldOut}
              sizes={PRODUCT_SLOT_SIZES}
              image={photoAlt(photo2)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <PhotoSlot
              label={t('Product.noPhoto')}
              muted={soldOut}
              sizes={PRODUCT_SINGLE_SIZES}
              className="sm:max-w-md lg:max-w-none"
              image={photo && photoAlt(photo)}
            />
          </div>
        )}

        <div className="flex flex-col gap-5 lg:sticky lg:top-20">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-h1 text-foreground font-extrabold">
              {title}
            </h1>
            {/* A missing price is omitted, never marked (brief decision 3). */}
            {product.priceMkd != null && (
              <div className="text-price tabular">
                {/* EN shows "≈ $22" as the price in these same classes, then the denar amount due on a
                    muted line under it (EN only — D-Y.10-2/4). MK renders the span exactly as before. */}
                <DisplayPrice
                  amountMkd={product.priceMkd}
                  currency={t('Common.currency')}
                  locale={locale}
                  className="text-foreground"
                />
                <AmountDue amountMkd={product.priceMkd} locale={locale} />
              </div>
            )}
            {stock && (
              <div>
                {stock === 'in-stock' && <StockBadge level="in-stock" />}
                {stock === 'low' && <StockBadge level="low" remaining={product.remaining} />}
                {soldOut && <StockBadge level="sold-out" />}
              </div>
            )}
          </div>

          {/* MK-only shipping statement, in the buy panel ABOVE the Add-to-cart control so it is visible
              without scrolling past it at 390px (D-2.01, Task 7). Shared key with checkout. */}
          <ShippingNotice />

          <AddToCartPanel
            sizes={product.sizes}
            dropSlug={dropSlug}
            productSlug={product.slug}
            productIndex={product.index}
            buyState={buyState}
          />
        </div>
      </div>

      {/* Detail below the fold */}
      <div className="border-border mt-8 grid gap-8 border-t pt-8 sm:grid-cols-2">
        {careCopy && (
          <section className="flex flex-col gap-2">
            <h2 className="font-display text-foreground font-bold">
              {t('Product.composition')}
            </h2>
            {/* Styled like the adjacent Shipping body — a fact reads as one. */}
            <p className="text-muted-foreground text-small">{careCopy}</p>
          </section>
        )}
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-foreground font-bold">
            {t('Product.shipping')}
          </h2>
          <p className="text-muted-foreground text-small">{t('Product.shippingBody')}</p>
        </section>
      </div>
    </div>
  );
}
