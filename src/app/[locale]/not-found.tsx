import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';

// The localized 404 (Phase Y.11, Task 9). Rendered inside the locale layout — header, footer, the
// visitor's language — whenever a page calls notFound(): an unknown product slug, or any path the
// catch-all (`[...rest]/page.tsx`) receives. Next answers it with HTTP 404 and injects
// `<meta name="robots" content="noindex">` itself, so nothing here sets robots.
//
// Two ways back, nothing else: the catalog (primary — it is where an Instagram visitor was going) and
// Home. Button recipe re-declared from the Home hero CTAs (HomeExperience.tsx `ctaBase`), the same
// treatment HomeShowcase re-declares — keep visually in step if either changes.
const ctaBase =
  'font-display inline-flex items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

export default function LocaleNotFound() {
  const t = useTranslations('NotFound');
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
      <section className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
        <span className="text-eyebrow text-muted-foreground font-medium uppercase tracking-[0.14em]">
          {t('eyebrow')}
        </span>
        <h1 className="font-display text-h1 text-foreground max-w-xl font-extrabold text-balance">
          {t('h1')}
        </h1>
        <p className="text-muted-foreground max-w-md text-balance">{t('body')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/catalog"
            className={cn(ctaBase, 'bg-mustard hover:bg-mustard-hover text-on-mustard')}
          >
            {t('catalog')}
          </Link>
          <Link
            href="/"
            className={cn(
              ctaBase,
              'border-border-strong text-foreground hover:border-foreground border bg-transparent',
            )}
          >
            {t('home')}
          </Link>
        </div>
      </section>
    </div>
  );
}
