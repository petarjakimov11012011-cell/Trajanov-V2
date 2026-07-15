import {useTranslations} from 'next-intl';
import {INSTAGRAM_HANDLE, INSTAGRAM_URL} from '@/lib/social';

// Minimal footer. Only facts.md-VERIFIED content: phone + the single Instagram
// account. No address (there is none), no invented socials, no email yet.
export function SiteFooter() {
  const t = useTranslations('Nav');
  return (
    <footer className="border-border mt-24 border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <span className="font-display text-foreground text-lg font-extrabold tracking-[0.16em]">
            {t('brand')}
          </span>
          <span className="text-muted-foreground text-small">
            Strumica, North Macedonia
          </span>
        </div>
        <div className="text-muted-foreground flex flex-col gap-1 text-small sm:items-end">
          <a
            href="tel:+38978820520"
            className="hover:text-foreground transition-colors duration-[var(--motion-fast)]"
          >
            078 820 520
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
