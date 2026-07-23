import {useTranslations} from 'next-intl';
import {Mail, Phone, AtSign} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {
  EMAIL,
  EMAIL_MAILTO,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '@/lib/social';

// Site-wide footer (Phase 2.07 redesign of the 1.05 footer). Two zones per the 1.05 design brief,
// enriched for the pages that shipped since (Terms/Privacy/Shipping — 2.03) and the email that went
// public (info@trajanovv.com — 2.05):
//   Zone 1 — a two-column contact/social band with h2 eyebrow headings + 16px Lucide line icons.
//   Zone 2 — a hairline rule, then a copyright row carrying every page link (Privacy included).
// Every string traces to facts.md: phone + email (§5), the ONE Instagram account (§6), no address
// (§1 records its absence — there is nothing to put there, and no other social exists). Contact/social
// values come from src/lib/social.ts, never retyped. Colours/spacing/type are brand.md tokens only;
// the global :focus-visible backstop (globals.css) rings every link. Locale-aware Link keeps prefixing
// automatic. The header is untouched (D-1.05-7).
export function SiteFooter() {
  const t = useTranslations('Footer');
  const tn = useTranslations('Nav');

  // Full-contrast contact/social item: icon + label, ≥24px tap target (WCAG 2.2 — 2.5.8).
  const itemClass =
    'inline-flex min-h-[24px] items-center gap-3 py-1 hover:underline underline-offset-4 transition-colors duration-[var(--motion-fast)]';
  // Muted bottom-row page link: ≥24px tap target, muted → foreground on hover.
  const pageLinkClass =
    'inline-flex min-h-[24px] items-center py-1 hover:text-foreground transition-colors duration-[var(--motion-fast)]';

  return (
    <footer className="border-border mt-24 border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        {/* Zone 1 — contact + social */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <section>
            <h2 className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
              {t('contact')}
            </h2>
            <ul className="text-foreground mt-4 flex flex-col gap-3 text-body">
              <li>
                <a href={EMAIL_MAILTO} className={itemClass}>
                  <Mail
                    aria-hidden
                    strokeWidth={1.75}
                    className="text-muted-foreground h-4 w-4 shrink-0"
                  />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={PHONE_TEL} className={itemClass}>
                  <Phone
                    aria-hidden
                    strokeWidth={1.75}
                    className="text-muted-foreground h-4 w-4 shrink-0"
                  />
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-eyebrow text-muted-foreground uppercase tracking-[0.14em]">
              {t('social')}
            </h2>
            <ul className="text-foreground mt-4 flex flex-col gap-3 text-body">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={itemClass}
                >
                  {/* Lucide dropped its brand icons (no Instagram glyph in this version). AtSign
                      marks the social handle honestly rather than shipping a fabricated brand mark
                      (D-2.07-2). */}
                  <AtSign
                    aria-hidden
                    strokeWidth={1.75}
                    className="text-muted-foreground h-4 w-4 shrink-0"
                  />
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </section>
        </div>

        {/* Zone 2 — hairline + copyright / page links */}
        <div className="border-border text-muted-foreground text-small mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('rights')}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li>
              <Link href="/about" className={pageLinkClass}>
                {tn('about')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={pageLinkClass}>
                {tn('contact')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={pageLinkClass}>
                {tn('terms')}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={pageLinkClass}>
                {tn('privacy')}
              </Link>
            </li>
            <li>
              <Link href="/shipping-returns" className={pageLinkClass}>
                {tn('shipping')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
