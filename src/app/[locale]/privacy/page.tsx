import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {setRequestLocale, getTranslations, getFormatter} from 'next-intl/server';
import {LegalPage, LegalSection} from '@/components/legal/LegalPage';
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
    href: '/privacy',
    locale,
    title: t('privacyTitle'),
    description: t('privacyDescription'),
  });
}

// Privacy — a STATIC editorial page (D-2.03, Task 4). The list of collected fields matches the actual
// `orders` table columns in supabase/migrations/20260715021215_schema.sql: customer_name, phone, city,
// address, notes — and NO email (there is no email field; D-Z.01-1). "Raw IP never stored, one-way
// hash" matches src/lib/rate-limit/hash.ts (D-1.04-7/14). No cookie banner and no consent UI: the site
// sets no analytics/advertising cookies (Decision 4). Responsible party: Vladimir Trajanov, Strumica,
// alone (D-2.03-1). Deletion is by phone (src/lib/social.ts) — no invented form, email, or portal.
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Privacy');
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
      <LegalSection heading={t('collectHeading')}>
        <p>{t('collectBody')}</p>
      </LegalSection>

      <LegalSection heading={t('whyHeading')}>
        <p>{t('whyBody')}</p>
      </LegalSection>

      <LegalSection heading={t('whoHeading')}>
        <p>{t('whoBody')}</p>
      </LegalSection>

      <LegalSection heading={t('storageHeading')}>
        <p>{t('storageBody')}</p>
      </LegalSection>

      <LegalSection heading={t('abuseHeading')}>
        <p>{t('abuseBody')}</p>
      </LegalSection>

      <LegalSection heading={t('browserHeading')}>
        <p>{t('browserBody')}</p>
      </LegalSection>

      <LegalSection heading={t('deleteHeading')}>
        <p>{t('deleteBody')}</p>
        <a
          href={PHONE_TEL}
          className="text-foreground hover:text-mustard inline-block py-1 underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
        >
          {PHONE_DISPLAY}
        </a>
      </LegalSection>

      <LegalSection heading={t('responsibleHeading')}>
        <p>{t('responsibleBody')}</p>
      </LegalSection>
    </LegalPage>
  );
}
