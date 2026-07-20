import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {CheckoutForm} from '@/components/checkout/CheckoutForm';
import {pageMetadata} from '@/lib/metadata';

// The order path runs server-side (Turnstile → rate limit → create_order). What it submits comes from
// the customer's cart (client state), read inside the form; create_order remains the sole authority on
// the window, cap, price, and stock (D-1.04-9). The page itself only needs the public Turnstile key.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  // Checkout collects PII and must never be indexed (Task 3).
  return pageMetadata({
    href: '/checkout',
    locale,
    title: t('checkoutTitle'),
    description: t('checkoutDescription'),
    index: false,
  });
}

export default function CheckoutPage() {
  // Cloudflare Turnstile sitekey is public by design (NEXT_PUBLIC_). Dummy test key until 1.07 (D-1.04-8).
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
  return <CheckoutPageBody siteKey={siteKey} />;
}

function CheckoutPageBody({siteKey}: {siteKey: string}) {
  const t = useTranslations('Checkout');
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-h1 text-foreground font-extrabold">
        {t('title')}
      </h1>
      <CheckoutForm siteKey={siteKey} />
    </div>
  );
}
