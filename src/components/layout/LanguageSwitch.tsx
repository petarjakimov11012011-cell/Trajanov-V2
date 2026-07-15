'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {cn} from '@/lib/utils';

// MK / EN pill. Active segment mustard-filled with near-black label; inactive
// muted. Keeps the current pathname when switching locale.
export function LanguageSwitch({className}: {className?: string}) {
  const locale = useLocale();
  const t = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();

  const labels: Record<string, string> = {
    mk: t('languageMk'),
    en: t('languageEn'),
  };

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
            onClick={() => router.replace(pathname, {locale: loc})}
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
