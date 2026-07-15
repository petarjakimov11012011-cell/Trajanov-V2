import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {formatMkd} from '@/lib/format';
import {PhotoSlot} from '@/components/system/PhotoSlot';
import {Placeholder} from '@/components/system/Placeholder';
import {StockBadge} from '@/components/drop/StockBadge';
import type {ProductView} from '@/types/drop';

const pad2 = (n: number) => String(n).padStart(2, '0');

// Product card — available / low stock / sold out.
// Sold-out is a permanent, non-interactive end state, not an edge case.
// Name and price come from the DB; both fall back to a placeholder when OWED (facts.md §7), so a drop
// with no real data yet renders exactly as the 1.02 design-system pass did.
export function ProductCard({product}: {product: ProductView}) {
  const t = useTranslations();
  const locale = useLocale();
  const soldOut = product.stock === 'sold-out';
  const realName = locale === 'mk' ? product.nameMk : product.nameEn;
  const title = realName ?? `${t('Placeholder.productName')} ${pad2(product.index)}`;

  const inner = (
    <div
      className={cn(
        'bg-surface group relative flex flex-col gap-3 rounded-[var(--radius-lg)] p-3 transition-colors duration-[var(--motion-fast)]',
        !soldOut && 'hover:bg-surface-2',
      )}
    >
      <div className="relative">
        <PhotoSlot label={t('Placeholder.productPhoto')} muted={soldOut} />

        {product.stock === 'low' && (
          <div className="absolute left-2 top-2">
            <StockBadge level="low" remaining={product.remaining} />
          </div>
        )}
        {soldOut && (
          <div className="absolute left-2 top-2">
            <StockBadge level="sold-out" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <h3
          className={cn(
            'font-display text-base font-semibold',
            soldOut ? 'text-soldout' : 'text-foreground',
          )}
        >
          {title}
        </h3>

        {product.priceMkd != null ? (
          <span className="text-foreground text-sm font-semibold tabular">
            {formatMkd(product.priceMkd, t('Common.currency'))}
          </span>
        ) : (
          <Placeholder>{t('Placeholder.price')}</Placeholder>
        )}

        <div className="pt-1">
          {product.stock === 'in-stock' && <StockBadge level="in-stock" />}
          {product.stock === 'low' && (
            <span className="text-accent text-sm font-semibold">
              {t('Stock.low', {count: product.remaining})}
            </span>
          )}
          {soldOut && (
            <span className="text-soldout text-sm font-semibold">
              {t('Stock.soldOut')}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Sold-out cards are non-interactive.
  if (soldOut) {
    return (
      <div aria-disabled className="cursor-default">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
    >
      {inner}
    </Link>
  );
}
