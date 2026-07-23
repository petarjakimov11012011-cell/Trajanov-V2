'use client';

import {useTranslations} from 'next-intl';
import {ShoppingBag} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {LanguageSwitch} from './LanguageSwitch';

// Site-wide header (Phase 2.08 redesign). Cut to the four things a buyer needs — Catalog, About,
// Contact, the MK/EN switch and the cart — plus the "Built by Vertex Consulting" build credit next to
// the wordmark (facts.md §11). Client component so the nav can read usePathname() for the active-page
// indicator (D-2.08-4). Non-sticky, solid ground (D-2.08-3: the brief lists a sticky/scroll-shrink
// header as out of scope). Every colour / size / spacing / radius / type value is a brand.md token —
// no hex, no raw px literal. The cart control (icon + count badge, 44px target) is the pre-existing
// one, moved verbatim to the end of the row; its logic and badge wiring are untouched.
//
// The three page links reuse the native-reviewed Nav.catalog / Nav.about / Nav.contact keys. There is
// deliberately NO Home / Reviews / Blog / Book link — the wordmark is the only route to Home.
//
// Order is canonical in the DOM — wordmark → credit → Catalog → About → Contact → MK·EN → cart — so the
// reading / focus / accessibility-tree order matches the visual left-to-right desktop order. Desktop
// (≥sm) is one baseline-aligned flex row (nav pushed right with ml-auto). Mobile (<sm) is a
// deterministic grid: row 1 wordmark | MK·EN·cart, row 2 the nav, row 3 the credit on its own full
// width directly above the hairline — so the long MK credit is never shrunk, cramped or hidden
// (D-2.08-5). Cart is the last item on every breakpoint.
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
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-x-4 gap-y-2 px-4 py-3 sm:flex sm:flex-nowrap sm:items-baseline sm:gap-4 sm:px-6">
        {/* Wordmark → locale home (the only route to Home). */}
        <Link
          href="/"
          className="font-display text-foreground text-price col-start-1 row-start-1 justify-self-start rounded-[var(--radius-sm)] font-extrabold uppercase tracking-[0.14em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          {t('brand')}
        </Link>

        {/* Build credit — subordinate, muted; only "Vertex Consulting" is the link (facts.md §11).
            "Built by" / „Изработено од" stays plain text outside the anchor. Mobile: its own row 3,
            full width, directly above the hairline. Desktop: right after the wordmark. */}
        <p className="text-muted-foreground text-small col-span-2 col-start-1 row-start-3 justify-self-start sm:order-none sm:col-auto sm:row-auto">
          {tc.rich('builtBy', {
            link: (chunks) => (
              <a
                href="https://www.vertexconsulting.mk/en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mustard align-baseline inline-flex min-h-6 items-center rounded-[var(--radius-sm)] underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-mustard-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                {chunks}
                <span className="sr-only"> {tc('opensInNewTab')}</span>
              </a>
            ),
          })}
        </p>

        {/* Nav — Catalog · About · Contact (exactly three, no others). Mobile: row 2, full width,
            right-aligned. Desktop: pushed to the right of the row. */}
        <nav className="col-span-2 col-start-1 row-start-2 flex items-center justify-end gap-4 justify-self-stretch sm:ml-auto sm:justify-self-auto">
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

        {/* MK·EN + cart — cart is ALWAYS the last item in the row. Mobile: row 1, right. */}
        <div className="col-start-2 row-start-1 flex items-center gap-3 justify-self-end sm:self-center">
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
    </header>
  );
}
