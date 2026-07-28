import type {Metadata} from 'next';
import type {Locale} from 'next-intl';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Phone, Mail} from 'lucide-react';
import {pageMetadata} from '@/lib/metadata';
import {InstagramIcon} from '@/components/system/InstagramIcon';
import {ContactForm} from '@/components/contact/ContactForm';
import {
  EMAIL,
  EMAIL_MAILTO,
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

// Contact — Phase 2.23. STILL a static page (setRequestLocale, no force-dynamic, no DB read): the
// message form is a client island inside it. Two columns at lg:+ — form left, rail right, ~60/40 —
// stacked below, form first. The form ships on the owner's reversal of Plan §4 "No contact form"
// (D-2.23-1); delivery is by email only, no database table (brief Decision 2). The rail carries
// exactly three rows — Phone, Email, Instagram — all from src/lib/social.ts, never retyped; no
// address exists (facts.md §1) and Instagram is the only social account (facts.md §6). Rows are
// ≥44px tall (WCAG 2.2 SC 2.5.8). The Instagram row carries a local outline glyph
// (src/components/system/InstagramIcon.tsx) — this Lucide ships no brand icons, so the mark is drawn
// on the same 24px grid as Mail/Phone and inherits the same colour token (D-2.24-1).

const railValueClass =
  'font-display text-foreground group-hover:text-mustard font-semibold underline-offset-4 transition-colors duration-[var(--motion-fast)] group-hover:underline';
const railIconClass = 'text-muted-foreground mt-1 h-5 w-5 shrink-0';

export default async function ContactPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  // Cloudflare Turnstile sitekey is public by design (NEXT_PUBLIC_) — same source as checkout.
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-4">
        <p className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
          {t('eyebrow')}
        </p>
        <h1 className="font-display text-h1 text-foreground font-extrabold text-balance">
          {t('h1')}
        </h1>
        <p className="text-muted-foreground text-body">{t('intro')}</p>
      </header>

      <div className="grid items-start gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <ContactForm siteKey={siteKey} />

        <aside className="flex flex-col gap-2">
          <h2 className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
            {t('railHeading')}
          </h2>

          <ul className="flex flex-col">
            <li>
              <a href={PHONE_TEL} className="group flex min-h-11 items-start gap-3 py-3">
                <Phone aria-hidden strokeWidth={1.75} className={railIconClass} />
                <span className="flex flex-col gap-0.5">
                  <span className="text-small text-muted-foreground">{t('phoneLabel')}</span>
                  <span className={railValueClass}>{PHONE_DISPLAY}</span>
                  <span className="text-small text-muted-foreground">{t('phoneNote')}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={EMAIL_MAILTO} className="group flex min-h-11 items-start gap-3 py-3">
                <Mail aria-hidden strokeWidth={1.75} className={railIconClass} />
                <span className="flex flex-col gap-0.5">
                  <span className="text-small text-muted-foreground">{t('emailLabel')}</span>
                  <span className={railValueClass}>{EMAIL}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-11 items-start gap-3 py-3"
              >
                <InstagramIcon aria-hidden strokeWidth={1.75} className={railIconClass} />
                <span className="flex flex-col gap-0.5">
                  <span className="text-small text-muted-foreground">{t('instagramLabel')}</span>
                  <span className={railValueClass}>{INSTAGRAM_HANDLE}</span>
                  <span className="text-small text-muted-foreground">{t('instagramNote')}</span>
                </span>
              </a>
            </li>
          </ul>

          {/* Strumica · NMK-only shipping · COD — the existing context line, at the foot of the rail
              (brief Task 1), not in the header. */}
          <p className="text-small text-muted-foreground border-border mt-4 border-t pt-4">
            {t('context')}
          </p>
        </aside>
      </div>
    </div>
  );
}
