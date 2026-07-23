import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {formatMkd} from '@/lib/format';
import {PhotoSlot} from '@/components/system/PhotoSlot';
import {Placeholder} from '@/components/system/Placeholder';
import {StockBadge} from '@/components/drop/StockBadge';
import {SpotlightCard} from '@/components/product/SpotlightCard';
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
        {/* h2 so the grid sits one level under each page's single h1 (Catalog / Home-live), with no
            skipped level (WCAG 2.2 — heading order, Task 8). */}
        <h2
          className={cn(
            'font-display text-base font-semibold',
            soldOut ? 'text-soldout' : 'text-foreground',
          )}
        >
          {title}
        </h2>

        {product.priceMkd != null ? (
          <span className="text-foreground text-sm font-semibold tabular">
            {formatMkd(product.priceMkd, t('Common.currency'), locale)}
          </span>
        ) : (
          <Placeholder>{t('Placeholder.price')}</Placeholder>
        )}

        <div className="pt-1">
          {product.stock === 'in-stock' && <StockBadge level="in-stock" />}
          {/* The low pill (near-black on red — 4.8:1, brand.md §3 ledger) instead of raw red text on the
              surface card: red-on-surface only reaches 4.31:1 and fails WCAG 2.2 AA (Task 8). Same pill
              the product detail page already uses. */}
          {product.stock === 'low' && (
            <StockBadge level="low" remaining={product.remaining} />
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
      // Object form so next-intl emits the localised product URL (/katalog/<slug> or /en/catalog/<slug>)
      // from the shared, non-localised product slug (D-2.01-2). Never hand-write the MK slug.
      href={{pathname: '/catalog/[slug]', params: {slug: product.slug}}}
      className="rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
    >
      {/* Pointer-tracked white glow (D-2.10). Inside the Link so the focus-visible ring + rounding
          stay on the Link; a thin client wrapper feeds it the pointer position. Sold-out cards keep
          the non-interactive branch above and never get this. */}
      <SpotlightCard>{inner}</SpotlightCard>
    </Link>
  );
}
