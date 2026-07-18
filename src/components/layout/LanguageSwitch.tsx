'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useParams} from 'next/navigation';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {cn} from '@/lib/utils';

// MK / EN pill. Active segment mustard-filled with near-black label; inactive muted.
//
// Switches locale IN PLACE and keeps the customer on the same page across the slug change (D-2.01,
// Task 9): `/katalog/majica-01` ↔ `/en/catalog/majica-01`, `/naracka` ↔ `/en/checkout`. `usePathname`
// returns the INTERNAL pathname; combined with `useParams` (the dynamic segments, e.g. `slug`) and the
// current query string it re-localises to the same page in the other locale — never bouncing a
// mid-checkout customer to the home page. The dev `?preview` param (and any query) survives.
//
// The query is read from `window.location.search` at click time, NOT via `useSearchParams()`: this
// switch sits in the header on every page, including the statically-prerendered About/Contact pages,
// and `useSearchParams()` would force those into a CSR bail-out (a Suspense boundary). Reading the query
// only on click keeps the switch a plain client component with no prerender cost.
export function LanguageSwitch({className}: {className?: string}) {
  const locale = useLocale();
  const t = useTranslations('Common');
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const labels: Record<string, string> = {
    mk: t('languageMk'),
    en: t('languageEn'),
  };

  function switchTo(loc: string) {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const query = Object.fromEntries(new URLSearchParams(search).entries());
    router.replace(
      // @ts-expect-error -- next-intl validates params against the pathname; for the CURRENT route the
      // two always match, so we pass them through without narrowing (the documented locale-switch pattern).
      {pathname, params, query},
      {locale: loc},
    );
  }

  return (
    <div
      className={cn(
        'border-border-strong inline-flex items-center rounded-[var(--radius-full)] border p-0.5',
        className,
      )}
      role="group"
      aria-label={t('switchLanguage')}
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            aria-pressed={active}
            onClick={() => switchTo(loc)}
            className={cn(
              'font-display rounded-[var(--radius-full)] px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              active
                ? 'bg-mustard text-on-mustard'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {labels[loc]}
          </button>
        );
      })}
    </div>
  );
}
