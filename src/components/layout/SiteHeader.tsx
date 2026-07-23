'use client';

import {useTranslations} from 'next-intl';
import {ShoppingBag} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {LanguageSwitch} from './LanguageSwitch';

// Site-wide header (Phase 2.08; alignment corrected in D-2.08-6). One flex row, items-center +
// justify-between: a LEFT group (wordmark + build credit) and a RIGHT group (Catalog · About · Contact,
// then MK·EN, then the cart). All seven items share one centerline — the row and both groups are
// items-center and NOTHING carries a baseline nudge, a self-* override, or a margin-top. The cart keeps
// its 44px tap target but is centered in the row (it no longer sets anyone's offset). Gaps use exactly
// two tokens: gap-4 between the three nav links; gap-6 used identically for nav → MK·EN → cart. On
// narrow screens the row wraps (the right group drops below the left group, then splits) — no
// horizontal overflow at 320px. Non-sticky, solid ground (D-2.08-3). Every colour / size / spacing /
// radius / type value is a brand.md token — no hex, no raw px literal. The cart control (icon + count
// badge) is the pre-existing one, moved verbatim; its logic and badge wiring are untouched. Client
// component so the nav can read usePathname() for the active-page indicator (D-2.08-4). The three page
// links reuse the reviewed Nav.catalog/about/contact keys; there is no Home/Reviews/Blog/Book link.
export function SiteHeader({cartCount = 0}: {cartCount?: number}) {
  const t = useTranslations('Nav');
  const tc = useTranslations('Credit');
  const pathname = usePathname();

  // A page link is active on its own route and on nested routes (a product page keeps Catalog lit).
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navLinks = [
    {href: '/catalog', key: 'catalog'},
    {href: '/about', key: 'about'},
    {href: '/contact', key: 'contact'},
  ] as const;

  return (
    <header className="bg-ground border-border border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:flex-nowrap sm:px-6">
        {/* Left group — wordmark + build credit, on the shared centerline. */}
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="font-display text-foreground text-price rounded-[var(--radius-sm)] font-extrabold uppercase tracking-[0.14em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {t('brand')}
          </Link>

          {/* Build credit — subordinate, muted; only "Vertex Consulting" is the link (facts.md §11).
              "Built by" / „Изработено од" stays plain text outside the anchor. */}
          <p className="text-muted-foreground text-small min-w-0">
            {tc.rich('builtBy', {
              link: (chunks) => (
                <a
                  href="https://www.vertexconsulting.mk/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mustard inline-flex min-h-6 items-center rounded-[var(--radius-sm)] underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-mustard-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  {chunks}
                  <span className="sr-only"> {tc('opensInNewTab')}</span>
                </a>
              ),
            })}
          </p>
        </div>

        {/* Right group — nav (gap-4 between the three links), then MK·EN, then cart, each gap-6 apart.
            The cart is always last. */}
        <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
          <nav className="flex items-center gap-4">
            {navLinks.map(({href, key}) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'font-display text-small inline-flex min-h-6 items-center border-b-2 font-semibold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
                    active
                      ? 'text-foreground border-mustard'
                      : 'text-muted-foreground border-transparent hover:text-foreground',
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-6">
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
          </div>
        </div>
      </div>
    </header>
  );
}
