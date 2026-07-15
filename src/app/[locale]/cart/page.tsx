import {useTranslations} from 'next-intl';
import {CartView} from '@/components/cart/CartView';

// The cart reads real client cart state (sessionStorage-backed store). Empty, items, and the 2-unit
// cap are all driven by what the customer actually added (brief Task 5).
export default function CartPage() {
  const t = useTranslations('Cart');
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-h1 text-foreground font-extrabold">
        {t('title')}
      </h1>
      <CartView />
    </div>
  );
}
