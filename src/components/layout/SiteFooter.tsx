import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '@/lib/social';

// Minimal footer. Only facts.md-VERIFIED content: phone + the single Instagram account. No address
// (there is none), no invented socials, no email yet. About + Contact link from here (the header is
// left untouched — D-1.05-7); Link is locale-aware so prefixing stays automatic. Phone + IG come from
// src/lib/social.ts — never retyped.
export function SiteFooter() {
  const t = useTranslations('Nav');
  return (
    <footer className="border-border mt-24 border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <span className="font-display text-foreground text-lg font-extrabold tracking-[0.16em]">
            {t('brand')}
          </span>
          <span className="text-muted-foreground text-small">{t('location')}</span>
          <nav className="text-muted-foreground mt-2 flex flex-col gap-1 text-small">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors duration-[var(--motion-fast)]"
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors duration-[var(--motion-fast)]"
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
        <div className="text-muted-foreground flex flex-col gap-1 text-small sm:items-end">
          <a
            href={PHONE_TEL}
            className="hover:text-foreground transition-colors duration-[var(--motion-fast)]"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors duration-[var(--motion-fast)]"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </footer>
  );
}
