import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {PhotoSlot} from '@/components/system/PhotoSlot';
import {getProductImage} from '@/lib/product-images';
import {DisplayPrice} from '@/components/system/DisplayPrice';
import {StockBadge} from '@/components/drop/StockBadge';
import {SpotlightCard} from '@/components/product/SpotlightCard';
import {visibleStock} from '@/lib/drop/display';
import type {DropState, ProductView} from '@/types/drop';

const pad2 = (n: number) => String(n).padStart(2, '0');

// Product card — available / low stock / sold out.
// Sold-out is a permanent, non-interactive end state, not an edge case — inside a LIVE drop. Between
// drops (ended, or no drop) the card shows no stock line at all and stays a link: the store is
// browsable, not sold out (Y.11, brief decision 7; the rule is src/lib/drop/display.ts).
// Name and price come from the DB. A missing name renders the neutral "Product 01" slot (brief decision
// 4); a missing price is OMITTED — never a `[PLACEHOLDER: …]` marker on a customer page (decision 3).
export function ProductCard({
  product,
  dropState,
}: {
  product: ProductView;
  dropState: DropState | null;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const stock = visibleStock(dropState, product.stock);
  const soldOut = stock === 'sold-out';
  const realName = locale === 'mk' ? product.nameMk : product.nameEn;
  const title = realName ?? `${t('Placeholder.productName')} ${pad2(product.index)}`;

  // Interim lifestyle frame for the two photographed colourways (D-Y.03-1/7); null for every other
  // product, which keeps the hatched placeholder. Looked up by SLUG — never by index or card position.
  const photo = getProductImage(product.slug);

  const inner = (
    <div
      className={cn(
        'bg-surface group relative flex flex-col gap-3 rounded-[var(--radius-lg)] p-3 transition-colors duration-[var(--motion-fast)]',
        !soldOut && 'hover:bg-surface-2',
      )}
    >
      <div className="relative">
        <PhotoSlot
          label={t('Product.noPhoto')}
          muted={soldOut}
          image={
            photo && {
              src: photo.src,
              alt: t(photo.altKey),
              objectPosition: photo.objectPosition,
            }
          }
        />

        {stock === 'low' && (
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

        {product.priceMkd != null && (
          // EN shows "≈ $22" as the price in these same classes; MK renders the span exactly as before
          // (D-Y.10-2). Dollars only here — the denar amount due lives on the product page (D-Y.10-4).
          <DisplayPrice
            amountMkd={product.priceMkd}
            currency={t('Common.currency')}
            locale={locale}
            className="text-foreground text-small font-semibold tabular"
          />
        )}

        {/* No stock line between drops (visibleStock → null), so no empty padded row either. */}
        {stock && (
          <div className="pt-1">
            {stock === 'in-stock' && <StockBadge level="in-stock" />}
            {/* The low pill (near-black on red — 4.8:1, brand.md §3 ledger) instead of raw red text on
                the surface card: red-on-surface only reaches 4.31:1 and fails WCAG 2.2 AA (Task 8).
                Same pill the product detail page already uses. */}
            {stock === 'low' && (
              <StockBadge level="low" remaining={product.remaining} />
            )}
            {soldOut && (
              <span className="text-soldout text-small font-semibold">
                {t('Stock.soldOut')}
              </span>
            )}
          </div>
        )}
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
