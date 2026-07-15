import {useTranslations} from 'next-intl';
import {ProductCard} from '@/components/product/ProductCard';
import {PreviewNotice} from '@/components/system/PreviewNotice';
import {DEMO_PRODUCTS} from '@/lib/demo';

// Catalog grid — the drop's 3–5 pieces, incl. a sold-out card.
export default function CatalogPage() {
  const t = useTranslations('Catalog');
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <PreviewNotice />
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-h1 text-foreground font-extrabold">
          {t('title')}
        </h1>
        <p className="text-muted-foreground max-w-xl">{t('live')}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {DEMO_PRODUCTS.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
