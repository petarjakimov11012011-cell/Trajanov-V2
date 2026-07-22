import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {setRequestLocale, getTranslations, getFormatter} from 'next-intl/server';
import {LegalPage, LegalSection} from '@/components/legal/LegalPage';
import {ShippingNotice} from '@/components/system/ShippingNotice';
import {Placeholder} from '@/components/system/Placeholder';
import {pageMetadata} from '@/lib/metadata';
import {PHONE_DISPLAY, PHONE_TEL} from '@/lib/social';

// Fixed last-updated date (see Terms page note).
const LAST_UPDATED = '2026-07-19';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return pageMetadata({
    href: '/shipping-returns',
    locale,
    title: t('shippingTitle'),
    description: t('shippingDescription'),
  });
}

// Shipping & Returns — a STATIC editorial page (D-2.03, Task 5). Where = NMK only, reusing the shared
// ShippingNotice (Common.shippingNotice, facts.md §7). Courier / delivery time / delivery cost and the
// returns/exchange window are NOT in facts.md, so each ships as a VISIBLE [PLACEHOLDER: …] (registered,
// owner Vladimir) — deliberately NOT estimated: on cash-on-delivery a wrong delivery cost is money
// asked for at a doorstep on a promise nobody made. NO statutory withdrawal period is cited (Decision 5).
export default async function ShippingReturnsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ShippingReturns');
  const tc = await getTranslations('Common');
  const tp = await getTranslations('Placeholder');
  const format = await getFormatter();
  const lastUpdated = `${tc('lastUpdated')}: ${format.dateTime(new Date(LAST_UPDATED), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })}`;

  return (
    <LegalPage
      eyebrow={t('eyebrow')}
      h1={t('h1')}
      intro={t('intro')}
      lastUpdated={lastUpdated}
    >
      <LegalSection heading={t('whereHeading')}>
        <ShippingNotice />
      </LegalSection>

      <LegalSection heading={t('paymentHeading')}>
        <p>{t('paymentBody')}</p>
      </LegalSection>

      <LegalSection heading={t('deliveryHeading')}>
        <p>{t('deliveryTime')}</p>
        <p>{t('deliveryBody')}</p>
        <Placeholder>{tp('courier')}</Placeholder>
      </LegalSection>

      <LegalSection heading={t('problemHeading')}>
        <p>{t('problemBody')}</p>
        <a
          href={PHONE_TEL}
          className="text-foreground hover:text-mustard inline-block py-1 underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
        >
          {PHONE_DISPLAY}
        </a>
      </LegalSection>

      <LegalSection heading={t('limitsHeading')}>
        <p>{t('limitsBody')}</p>
      </LegalSection>

      <LegalSection heading={t('returnsHeading')}>
        <p>{t('returnsBody')}</p>
        <Placeholder>{tp('returnsWindow')}</Placeholder>
      </LegalSection>
    </LegalPage>
  );
}
