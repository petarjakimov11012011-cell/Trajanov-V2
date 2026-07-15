import {useTranslations} from 'next-intl';
import {CheckoutForm} from '@/components/checkout/CheckoutForm';

// Checkout — one screen. Fields + error state, Turnstile resolving above the
// place-order block, COD summary. Real order submission + stock reservation
// land in Phase 1.04.
export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-h1 text-foreground font-extrabold">
        {t('title')}
      </h1>
      <CheckoutForm />
    </div>
  );
}
