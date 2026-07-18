'use client';

import {useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {ShieldCheck} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Link} from '@/i18n/navigation';
import {CheckoutField} from './CheckoutField';
import {Turnstile, type TurnstileHandle} from './Turnstile';
import {Placeholder} from '@/components/system/Placeholder';
import {ShippingNotice} from '@/components/system/ShippingNotice';
import {useCart} from '@/components/cart/cart-store';
import {toOrderItems, cartDropSlug} from '@/lib/cart/cart';
import {placeOrder, type PlaceOrderResult} from '@/lib/orders/actions';

type Errors = Partial<Record<'name' | 'phone' | 'city' | 'address', string>>;

// One-screen checkout wired to the real order path (Task 6). It reads the customer's cart (client
// state) for what to submit — variant_id + qty only, never a price or a name (brief Task 6). On submit
// it mints a FRESH Turnstile token (D-1.04-8) and calls placeOrder, which runs Siteverify → IP rate
// limit → create_order on the server. create_order is the only authority; the browser decides nothing.
export function CheckoutForm({siteKey}: {siteKey: string}) {
  const t = useTranslations('Checkout');
  const to = useTranslations('Order');
  const tp = useTranslations('Placeholder');
  const tc = useTranslations('Cart');
  const {cart, hydrated} = useCart();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PlaceOrderResult | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const items = toOrderItems(cart);
  const dropSlug = cartDropSlug(cart);
  const orderable = items.length > 0 && dropSlug !== null;

  function validate(form: HTMLFormElement): Errors {
    const data = new FormData(form);
    const next: Errors = {};
    for (const key of ['name', 'city', 'address'] as const) {
      if (!String(data.get(key) ?? '').trim()) next[key] = t('errorRequired');
    }
    const phone = String(data.get('phone') ?? '').replace(/\s/g, '');
    if (!phone) next.phone = t('errorRequired');
    else if (!/^\+?\d{6,}$/.test(phone)) next.phone = t('errorPhone');
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const form = e.currentTarget;
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0 || !dropSlug || items.length === 0) return;

    const data = new FormData(form);
    setSubmitting(true);

    // Mint a fresh token now, at submit — not at page load (D-1.04-8).
    let token: string;
    try {
      token = await turnstileRef.current!.execute();
    } catch {
      setSubmitting(false);
      setResult({status: 'turnstile', retry: true});
      return;
    }

    const res = await placeOrder({
      token,
      dropSlug,
      items,
      customerName: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      city: String(data.get('city') ?? ''),
      address: String(data.get('address') ?? ''),
      notes: String(data.get('note') ?? ''),
    });
    setSubmitting(false);
    setResult(res);
    if (res.status === 'invalid' && res.field === 'phone') {
      setErrors((p) => ({...p, phone: t('errorPhone')}));
    }
  }

  // Before the sessionStorage read has run, hold the space rather than flash the empty state.
  if (!hydrated) {
    return <div className="min-h-[40vh]" aria-busy aria-hidden />;
  }

  // Empty cart: no form, no submit — checkout cannot reach create_order() with nothing to order
  // (brief Task 7). The server backstops this too (processOrder → "empty").
  if (!orderable) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-muted-foreground text-lg">{tc('empty')}</p>
        <Link
          href="/catalog"
          className="text-mustard hover:text-mustard-hover font-display font-semibold underline-offset-4 hover:underline"
        >
          {tc('backToDrop')}
        </Link>
      </div>
    );
  }

  const message = result ? orderMessage(result, to) : null;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start"
    >
      {/* fields */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-foreground font-bold">{t('contact')}</h2>
        <CheckoutField id="name" name="name" label={t('name')} required autoComplete="name" error={errors.name} />
        <CheckoutField id="phone" name="phone" label={t('phone')} type="tel" inputMode="tel" required autoComplete="tel" error={errors.phone} />
        <div className="grid gap-4 sm:grid-cols-2">
          <CheckoutField id="city" name="city" label={t('city')} required autoComplete="address-level2" error={errors.city} />
          <CheckoutField id="address" name="address" label={t('address')} required autoComplete="street-address" error={errors.address} />
        </div>
        <CheckoutField id="note" name="note" label={t('note')} placeholder={t('notePlaceholder')} textarea />
      </div>

      {/* summary + turnstile + place order */}
      <div className="bg-surface flex flex-col gap-4 rounded-[var(--radius-lg)] p-5 lg:sticky lg:top-20">
        <h2 className="font-display text-foreground font-bold">{t('summary')}</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('summary')}</span>
          <Placeholder>{tp('price')}</Placeholder>
        </div>
        <p className="text-muted-foreground text-small">{t('codSummary')}</p>
        <p className="text-muted-foreground text-small">{t('reserveNote')}</p>

        {/* MK-only shipping statement by the COD block, before the submit button (D-2.01, Task 7).
            Same shared key as the product page. */}
        <ShippingNotice />

        {/* Turnstile placement (handover §9). The widget is invisible until it needs interaction; the
            check runs on submit. */}
        <div className="border-border bg-surface flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3" aria-live="polite">
          {submitting ? (
            <>
              <span className="border-mustard h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" aria-hidden />
              <span className="text-muted-foreground text-sm">{t('verifying')}…</span>
            </>
          ) : (
            <>
              <ShieldCheck className="text-mustard h-5 w-5" strokeWidth={1.75} aria-hidden />
              <span className="text-muted-foreground text-sm">{to('protected')}</span>
            </>
          )}
        </div>
        <Turnstile ref={turnstileRef} siteKey={siteKey} />

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'font-display inline-flex w-full items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground',
            submitting
              ? 'bg-surface-2 text-muted-foreground cursor-not-allowed'
              : 'bg-mustard hover:bg-mustard-hover text-on-mustard',
          )}
        >
          {t('placeOrder')}
        </button>

        {message && (
          <p
            className={cn(
              'text-small',
              message.tone === 'ok' && 'text-mustard',
              message.tone === 'error' && 'text-error',
              message.tone === 'neutral' && 'text-foreground',
            )}
            role="status"
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}

function orderMessage(
  res: PlaceOrderResult,
  to: (key: string, values?: Record<string, string>) => string,
): {text: string; tone: 'ok' | 'error' | 'neutral'} | null {
  switch (res.status) {
    case 'ok':
      return {text: to('success', {orderNumber: res.orderNumber}), tone: 'ok'};
    case 'empty':
      return {text: to('emptyCart'), tone: 'neutral'};
    case 'turnstile':
      return {text: to('turnstileFailed'), tone: 'error'};
    case 'rate_limited':
      return {text: to('rateLimited'), tone: 'error'};
    case 'invalid':
      return res.field === 'phone' ? null : {text: to('genericError'), tone: 'error'};
    case 'error':
      return {text: to('genericError'), tone: 'error'};
    case 'order_error':
      switch (res.code) {
        case 'TR004':
          return {text: to('soldOut'), tone: 'neutral'}; // "someone got there first" — not an error
        case 'TR002':
          return {text: to('notOpen'), tone: 'neutral'};
        case 'TR003':
          return {text: to('capViolated'), tone: 'error'};
        case 'TR005':
          return {text: to('duplicatePhone'), tone: 'error'};
        case 'TR006':
          return {text: to('priceMissing'), tone: 'error'};
        default:
          return {text: to('genericError'), tone: 'error'};
      }
  }
}
