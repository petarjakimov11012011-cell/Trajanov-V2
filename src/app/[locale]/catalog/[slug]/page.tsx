import {getTranslations, getLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PhotoSlot} from '@/components/system/PhotoSlot';
import {Placeholder} from '@/components/system/Placeholder';
import {PreviewNotice} from '@/components/system/PreviewNotice';
import {StockBadge} from '@/components/drop/StockBadge';
import {AddToCartPanel} from '@/components/product/AddToCartPanel';
import {type BuyState} from '@/components/product/BuyButton';
import {formatMkd} from '@/lib/format';
import {getProductView, parsePreviewState} from '@/lib/drop/state';

// Product data is read from the DB per request (D-1.04-9); no static params.
export const dynamic = 'force-dynamic';

const pad2 = (n: number) => String(n).padStart(2, '0');

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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href="/catalog"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors duration-[var(--motion-fast)]"
      >
        <ArrowLeft className="h-4 w-4" /> {t('Product.back')}
      </Link>

      <PreviewNotice />

      {/* Buy path above the fold */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="grid grid-cols-2 gap-3">
          <PhotoSlot label={t('Placeholder.productPhoto')} muted={soldOut} />
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
                  {formatMkd(product.priceMkd, t('Common.currency'))}
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
          <p className="text-muted-foreground text-sm">{t('Product.shippingBody')}</p>
        </section>
      </div>
    </div>
  );
}
