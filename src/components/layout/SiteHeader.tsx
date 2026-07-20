import {useTranslations} from 'next-intl';
import {ShoppingBag} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {LanguageSwitch} from './LanguageSwitch';

// Minimal, type-led header: wordmark, catalog link, language pill, cart.
export function SiteHeader({cartCount = 0}: {cartCount?: number}) {
  const t = useTranslations('Nav');
  return (
    <header className="border-border sticky top-0 z-40 border-b bg-[color-mix(in_srgb,var(--color-ground)_88%,transparent)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-foreground text-lg font-extrabold tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          {t('brand')}
        </Link>

        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="/catalog"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-[var(--motion-fast)]"
          >
            {t('catalog')}
          </Link>
          <LanguageSwitch />
          <Link
            href="/cart"
            aria-label={t('cart')}
            className="text-foreground relative inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] transition-colors duration-[var(--motion-fast)] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="bg-mustard text-on-mustard tabular absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.65rem] font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
