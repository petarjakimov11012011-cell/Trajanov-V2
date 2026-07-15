'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';
import {CheckoutField} from './CheckoutField';
import {TurnstilePlaceholder} from './TurnstilePlaceholder';
import {Placeholder} from '@/components/system/Placeholder';

type Errors = Partial<Record<'name' | 'phone' | 'city' | 'address', string>>;

export function CheckoutForm() {
  const t = useTranslations('Checkout');
  const tp = useTranslations('Placeholder');
  const [errors, setErrors] = useState<Errors>({});
  const [resolved, setResolved] = useState(false);
  const [placed, setPlaced] = useState(false);

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

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const next = validate(e.currentTarget);
        setErrors(next);
        if (Object.keys(next).length === 0 && resolved) setPlaced(true);
      }}
      className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start"
    >
      {/* fields */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-foreground font-bold">{t('contact')}</h2>
        <CheckoutField
          id="name"
          name="name"
          label={t('name')}
          required
          autoComplete="name"
          error={errors.name}
        />
        <CheckoutField
          id="phone"
          name="phone"
          label={t('phone')}
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          error={errors.phone}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <CheckoutField
            id="city"
            name="city"
            label={t('city')}
            required
            autoComplete="address-level2"
            error={errors.city}
          />
          <CheckoutField
            id="address"
            name="address"
            label={t('address')}
            required
            autoComplete="street-address"
            error={errors.address}
          />
        </div>
        <CheckoutField
          id="note"
          name="note"
          label={t('note')}
          placeholder={t('notePlaceholder')}
          textarea
        />
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

        <TurnstilePlaceholder onResolved={setResolved} />

        <button
          type="submit"
          disabled={!resolved}
          className={cn(
            'font-display inline-flex w-full items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground',
            resolved
              ? 'bg-mustard hover:bg-mustard-hover text-on-mustard'
              : 'bg-surface-2 text-muted-foreground cursor-not-allowed',
          )}
        >
          {t('placeOrder')}
        </button>

        {placed && (
          <p className="text-mustard text-small" role="status">
            ✓ {t('reserveNote')}
          </p>
        )}
      </div>
    </form>
  );
}
