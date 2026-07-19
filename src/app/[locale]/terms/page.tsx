import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {setRequestLocale, getTranslations, getFormatter} from 'next-intl/server';
import {LegalPage, LegalSection} from '@/components/legal/LegalPage';
import {localeAlternates} from '@/lib/metadata';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '@/lib/social';

// Last-updated date shown on the page (DoD). A fixed date, formatted per locale — not read from the
// clock, so the static build stays deterministic. Bump it when the copy changes.
const LAST_UPDATED = '2026-07-19';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return {
    title: t('termsTitle'),
    description: t('termsDescription'),
    alternates: localeAlternates('/terms', locale),
  };
}

// Terms of Sale — a STATIC editorial page (setRequestLocale, no force-dynamic), same shape as /about +
// /contact (D-2.03, Task 3). Every line traces to facts.md §1/§7 or to shipped code; NO statute,
// article, or withdrawal period is cited (Decision 5). The responsible party is Vladimir Trajanov,
// Strumica — ALONE, no parent named (D-2.03-1). Phone + Instagram come from src/lib/social.ts, never
// retyped; the email is deliberately NOT published (placeholder register #5, D-Z.01-3).
export default async function TermsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Terms');
  const tc = await getTranslations('Common');
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
      <LegalSection heading={t('sellerHeading')}>
        <p>{t('sellerBody')}</p>
      </LegalSection>

      <LegalSection heading={t('contactHeading')}>
        <p>{t('contactBody')}</p>
        <div className="flex flex-col gap-1">
          <a
            href={PHONE_TEL}
            className="text-foreground hover:text-mustard inline-block py-1 underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:text-mustard inline-block py-1 underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </LegalSection>

      <LegalSection heading={t('paymentHeading')}>
        <p>{t('paymentBody')}</p>
      </LegalSection>

      <LegalSection heading={t('shippingHeading')}>
        <p>{t('shippingBody')}</p>
      </LegalSection>

      <LegalSection heading={t('orderingHeading')}>
        <p>{t('orderingBody1')}</p>
        <p>{t('orderingBody2')}</p>
      </LegalSection>

      <LegalSection heading={t('pricesHeading')}>
        <p>{t('pricesBody')}</p>
      </LegalSection>

      <LegalSection heading={t('noHeading')}>
        <p>{t('noBody')}</p>
      </LegalSection>
    </LegalPage>
  );
}
