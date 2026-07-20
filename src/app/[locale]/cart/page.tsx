import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {CartView} from '@/components/cart/CartView';
import {pageMetadata} from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  // Cart is a private, transient step — noindex (Task 3). It still carries a share card + alternates.
  return pageMetadata({
    href: '/cart',
    locale,
    title: t('cartTitle'),
    description: t('cartDescription'),
    index: false,
  });
}

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
