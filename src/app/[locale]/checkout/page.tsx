import {useTranslations} from 'next-intl';
import {CheckoutForm} from '@/components/checkout/CheckoutForm';
import {getActiveOrderContext} from '@/lib/drop/state';

// Real order submission runs server-side (Turnstile → rate limit → create_order). The page reads the
// active drop per request to build what checkout submits; create_order is the authority (D-1.04-9).
export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const context = await getActiveOrderContext();
  // Cloudflare Turnstile sitekey is public by design (NEXT_PUBLIC_). Dummy test key until 1.07 (D-1.04-8).
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
  return <CheckoutPageBody context={context} siteKey={siteKey} />;
}

function CheckoutPageBody({
  context,
  siteKey,
}: {
  context: Awaited<ReturnType<typeof getActiveOrderContext>>;
  siteKey: string;
}) {
  const t = useTranslations('Checkout');
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-h1 text-foreground font-extrabold">
        {t('title')}
      </h1>
      <CheckoutForm context={context} siteKey={siteKey} />
    </div>
  );
}
