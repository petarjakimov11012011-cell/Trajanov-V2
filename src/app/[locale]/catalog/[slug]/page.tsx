import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {getTranslations, getLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PhotoSlot} from '@/components/system/PhotoSlot';
import {getProductImage} from '@/lib/product-images';
import {Placeholder} from '@/components/system/Placeholder';
import {PreviewNotice} from '@/components/system/PreviewNotice';
import {ShippingNotice} from '@/components/system/ShippingNotice';
import {StockBadge} from '@/components/drop/StockBadge';
import {AddToCartPanel} from '@/components/product/AddToCartPanel';
import {type BuyState} from '@/components/product/BuyButton';
import {formatMkd} from '@/lib/format';
import {getProductView, parsePreviewState} from '@/lib/drop/state';
import {pageMetadata} from '@/lib/metadata';
import {getPathname} from '@/i18n/navigation';
import {SITE_URL} from '@/lib/site';
import {productJsonLd} from '@/lib/seo/product-jsonld';
import {JsonLd} from '@/components/seo/JsonLd';

// Product data is read from the DB per request (D-1.04-9); no static params.
export const dynamic = 'force-dynamic';

const pad2 = (n: number) => String(n).padStart(2, '0');

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

  const soldOut = product.stock === 'sold-out';
  const realName = locale === 'mk' ? product.nameMk : product.nameEn;
  const title = realName ?? `${t('Placeholder.productName')} ${pad2(product.index)}`;

  // Looked up by SLUG, never by position (D-Y.03-1). Null for Product 03 and for anything unphotographed.
  const photo = getProductImage(product.slug);

  // Buy state from the SERVER's drop state + stock (the 6 handover states — no new ones):
  //  sold out → sold-out · pre-drop → disabled/"coming soon" · live → default · ended (with stock) →
  //  sold-out (non-interactive; the drop is over — the closest of the available states).
  const buyState: BuyState = soldOut
    ? 'sold-out'
    : dropState === 'countdown'
      ? 'disabled'
      : dropState === 'ended'
        ? 'sold-out'
        : 'default';

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

      <PreviewNotice />

      {/* Buy path above the fold */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* FIRST slot takes the interim lifestyle frame when one exists (D-Y.03-1/7). The SECOND stays
            a visible placeholder on purpose: the back / print-detail shot is genuinely still owed
            (register #2), and the page should say so rather than imply the set is complete. Product 03
            has no frame at all, so it keeps two placeholders. */}
        {/* One column below `sm:` (D-2.25-10). Two 4:5 slots side by side on a 320px phone measured
            138×173 each — too small to judge a garment by, which is the only thing this page is for;
            one column makes each 288×360. The cost is real and accepted, measured at 320px: the price
            moves from y=567 to y=1107, so the buy path sits below two screens of scroll while the
            second slot is still a hatched placeholder (register #2). One `sm:` word reverses it. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PhotoSlot
            label={t('Placeholder.productPhoto')}
            muted={soldOut}
            image={
              photo && {
                src: photo.src,
                alt: t(photo.altKey),
                objectPosition: photo.objectPosition,
              }
            }
          />
          <PhotoSlot label={t('Placeholder.productPhoto')} muted={soldOut} />
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-20">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-h1 text-foreground font-extrabold">
              {title}
            </h1>
            <div className="text-price tabular">
              {product.priceMkd != null ? (
                <span className="text-foreground">
                  {formatMkd(product.priceMkd, t('Common.currency'), locale)}
                </span>
              ) : (
                <Placeholder>{t('Placeholder.price')}</Placeholder>
              )}
            </div>
            <div>
              {product.stock === 'in-stock' && <StockBadge level="in-stock" />}
              {product.stock === 'low' && (
                <StockBadge level="low" remaining={product.remaining} />
              )}
              {soldOut && <StockBadge level="sold-out" />}
            </div>
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
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-foreground font-bold">
            {t('Product.composition')}
          </h2>
          <Placeholder>{t('Placeholder.composition')}</Placeholder>
        </section>
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
