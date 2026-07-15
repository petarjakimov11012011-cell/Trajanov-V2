import {useTranslations} from 'next-intl';
import {CartView} from '@/components/cart/CartView';

// Cart shown at the 2-unit cap (two units in the basket) so the cap notice and
// the disabled "+" stepper are visible. Remove items to reach the empty state.
export default function CartPage() {
  const t = useTranslations('Cart');
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-h1 text-foreground font-extrabold">
        {t('title')}
      </h1>
      <CartView
        initial={[
          {id: 'l1', index: 1, size: 'M', qty: 1},
          {id: 'l2', index: 3, size: 'L', qty: 1},
        ]}
      />
    </div>
  );
}
