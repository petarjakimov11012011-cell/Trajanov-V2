import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PhotoSlot} from '@/components/system/PhotoSlot';
import {Placeholder} from '@/components/system/Placeholder';
import {PreviewNotice} from '@/components/system/PreviewNotice';
import {StockBadge} from '@/components/drop/StockBadge';
import {SizePicker} from '@/components/product/SizePicker';
import {BuyButton} from '@/components/product/BuyButton';
import {DEMO_PRODUCTS, getDemoProduct} from '@/lib/demo';

const pad2 = (n: number) => String(n).padStart(2, '0');

export function generateStaticParams() {
  return DEMO_PRODUCTS.map((p) => ({slug: p.slug}));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {slug} = await params;
  const product = getDemoProduct(slug);
  if (!product) notFound();

  const t = await getTranslations();
  const soldOut = product.stock === 'sold-out';
  const title = `${t('Placeholder.productName')} ${pad2(product.index)}`;

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
              <Placeholder>{t('Placeholder.price')}</Placeholder>
            </div>
            <div>
              {product.stock === 'in-stock' && <StockBadge level="in-stock" />}
              {product.stock === 'low' && (
                <StockBadge level="low" remaining={product.remaining} />
              )}
              {soldOut && <StockBadge level="sold-out" />}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-small text-muted-foreground font-medium">
              {t('Product.size')}
            </span>
            <SizePicker sizes={product.sizes} />
            <span className="text-muted-foreground text-xs">
              {t('Placeholder.sizesSample')}
            </span>
          </div>

          <BuyButton state={soldOut ? 'sold-out' : 'default'} />
          <p className="text-muted-foreground text-small">
            {t('Product.oneUnitLimit')}
          </p>
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
