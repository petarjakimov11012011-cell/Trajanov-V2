import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Placeholder} from '@/components/system/Placeholder';
import {pageMetadata} from '@/lib/metadata';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '@/lib/social';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return pageMetadata({
    href: '/contact',
    locale,
    title: t('contactTitle'),
    description: t('contactDescription'),
  });
}

// Contact is a static page — same as About, no drop state, no DB read (D-1.05, Task 4). No form (the
// phone is the channel), no address (there is none — facts.md §1). Phone + Instagram are imported from
// src/lib/social.ts, never retyped. Tap targets meet WCAG 2.2 AA 2.5.8: phone and Instagram are the
// two things a person came here to press, so they are ≥44px tall on mobile (min-h-11 = 2.75rem).

export default async function ContactPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  const tp = await getTranslations('Placeholder');

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-4">
        <p className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
          {t('eyebrow')}
        </p>
        <h1 className="font-display text-h1 text-foreground font-extrabold text-balance">
          {t('h1')}
        </h1>
        <p className="text-muted-foreground text-body">{t('context')}</p>
      </header>

      <section className="flex flex-col gap-6">
        <a
          href={PHONE_TEL}
          className="group flex min-h-11 flex-col gap-1 py-2"
        >
          <span className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
            {t('phoneLabel')}
          </span>
          <span className="font-display text-h2 text-foreground group-hover:text-mustard underline-offset-4 transition-colors duration-[var(--motion-fast)] group-hover:underline">
            {PHONE_DISPLAY}
          </span>
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="group flex min-h-11 flex-col gap-1 py-2"
        >
          <span className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
            {t('instagramLabel')}
          </span>
          <span className="font-display text-h2 text-foreground group-hover:text-mustard underline-offset-4 transition-colors duration-[var(--motion-fast)] group-hover:underline">
            {INSTAGRAM_HANDLE}
          </span>
          <span className="text-small text-muted-foreground">
            {t('instagramNote')}
          </span>
        </a>

        <div className="flex flex-col gap-2 py-2">
          <span className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
            {t('emailLabel')}
          </span>
          <Placeholder>{tp('email')}</Placeholder>
        </div>
      </section>
    </div>
  );
}
