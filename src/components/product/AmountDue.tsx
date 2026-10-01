import {useTranslations, type Locale} from 'next-intl';
import {formatMkd} from '@/lib/format';
import {DELIVERY_COST_MKD} from '@/config/shipping';

// What the customer hands the courier, under the product-page price — in BOTH locales (Phase Y.11,
// brief Task 7; Y.10 rendered it on EN only, D-Y.10-4). It reads as the price of ONE shirt plus a
// separate delivery cost, never as an all-in amount: on cash on delivery, the first time a customer
// learns that delivery is extra must not be at the door.
//
// Both figures are plain denars on purpose, EN included: this is the "what you pay" line, and the
// customer pays in denars. The EN price above it is the approximate dollar figure (D-Y.10-2); the
// delivery cost elsewhere in EN prose keeps its "(≈ $4)". The cost comes from the one constant
// (src/config/shipping.ts, D-Y.09-2). Muted, at `text-small`.
export function AmountDue({amountMkd, locale}: {amountMkd: number; locale: Locale}) {
  const t = useTranslations();
  const currency = t('Common.currency');
  return (
    <p className="text-muted-foreground text-small font-normal">
      {t('Product.amountDue', {
        amount: formatMkd(amountMkd, currency, locale),
        cost: formatMkd(DELIVERY_COST_MKD, currency, locale),
      })}
    </p>
  );
}
