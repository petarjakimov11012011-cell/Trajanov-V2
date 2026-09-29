import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {setRequestLocale, getTranslations, getFormatter} from 'next-intl/server';
import {LegalPage, LegalSection} from '@/components/legal/LegalPage';
import {ShippingNotice} from '@/components/system/ShippingNotice';
import {DELIVERY_COST_MKD} from '@/config/shipping';
import {formatMkdWithApproxUsd} from '@/lib/format';
import {pageMetadata} from '@/lib/metadata';
import {PHONE_DISPLAY, PHONE_TEL} from '@/lib/social';

// Fixed last-updated date (see Terms page note).
const LAST_UPDATED = '2026-09-29';

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

// Shipping — a STATIC editorial page (D-2.03, Task 5; retitled in Y.09). Four sections: where (NMK
// only, the shared ShippingNotice — Common.shippingNotice, facts.md §7), payment, delivery time and
// cost, and who to call if something is wrong.
//
// Y.09: the delivery cost is FILLED — 200 MKD, facts.md §7 VERIFIED 2026-09-29 — rendered from the one
// constant in src/config/shipping.ts through formatMkdWithApproxUsd (D-Y.09-2); the courier's NAME was
// not supplied and is not rendered. The returns/exchange window and "What we can't do yet" sections
// were REMOVED by owner decision (D-Y.09-3), not filled — the site makes no statement about a returns
// window, and still cites NO statutory withdrawal period (Decision 5). The route slugs
// (/shipping-returns, /isporaka-i-vrakjanje) and this folder name were deliberately KEPT so existing
// links, the sitemap and search results do not break — the URL still says "returns" while the page
// does not.
export default async function ShippingReturnsPage({
  params,
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ShippingReturns');
  const tc = await getTranslations('Common');
  const format = await getFormatter();
  const cost = formatMkdWithApproxUsd(DELIVERY_COST_MKD, tc('currency'), locale);
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
        <p>{t('deliveryBody', {cost})}</p>
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
    </LegalPage>
  );
}
