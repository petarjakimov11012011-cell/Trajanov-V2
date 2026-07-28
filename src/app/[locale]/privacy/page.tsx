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

// Privacy — a STATIC editorial page (D-2.03, Task 4). The ORDER list of collected fields matches the
// actual `orders` table columns in supabase/migrations/20260715021215_schema.sql: customer_name,
// phone, city, address, notes — the order path still has no email field (D-Z.01-1). Since 2.23 the
// CONTACT FORM additionally collects name, email, optional subject and message — delivered as one
// email to Vladimir, never stored in the site's database (brief 2.23 Decision 2) — described in its
// own section below so the order sections stay accurate about orders (brief 2.23 Decision 7). "Raw IP
// never stored, one-way hash" matches src/lib/rate-limit/hash.ts (D-1.04-7/14). No cookie banner and
// no consent UI: the site sets no analytics/advertising cookies (Decision 4). Responsible party:
// Vladimir Trajanov, Strumica, alone (D-2.03-1). Deletion: by phone, or for contact-form messages by
// replying in the email thread.
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

      {/* The contact form's data path (2.23) — its own self-contained section (what, why, where it
          goes, not stored), so the order sections below keep describing orders only. */}
      <LegalSection heading={t('contactFormHeading')}>
        <p>{t('contactFormBody')}</p>
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
