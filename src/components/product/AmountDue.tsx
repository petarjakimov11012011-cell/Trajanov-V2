import {useTranslations, type Locale} from 'next-intl';
import {formatMkd} from '@/lib/format';

// The denar amount due, under the price on the EN product page only (Phase Y.10, D-Y.10-4). On EN the
// displayed price is "≈ $22", but the customer hands the courier denars — and the cart and checkout
// show no product price — so this line is the one place an English reader sees the amount they owe.
// Muted, at `text-small`. MK renders nothing: the MK price already IS the denar amount.
export function AmountDue({amountMkd, locale}: {amountMkd: number; locale: Locale}) {
  const t = useTranslations();
  if (locale !== 'en') return null;
  return (
    <p className="text-muted-foreground text-small font-normal">
      {t('Product.amountDue', {amount: formatMkd(amountMkd, t('Common.currency'), locale)})}
    </p>
  );
}
