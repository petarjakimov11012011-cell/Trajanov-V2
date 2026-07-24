'use client';

import {useTranslations} from 'next-intl';
import {ShoppingBag} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {LanguageSwitch} from './LanguageSwitch';

// Site-wide header (Phase 2.08; alignment corrected in D-2.08-6; nav centred in D-2.13-1). The
// container is a CSS grid with three direct children in reading order: a LEFT group (wordmark + build
// credit), the centre <nav> (Catalog · About · Contact), and a RIGHT controls group (MK·EN, then the
// cart). The grid's outer columns are minmax(0,1fr) and the middle column is auto, so the nav sits on
// the container's true centreline regardless of how wide the left and right groups are (D-2.13-1) — not
// merely right-aligned like the old justify-between flex row. Below lg (1024px) the grid is two columns
// and the nav drops to its own centred second row spanning both (D-2.13-2/3: MK does not co-fit one row
// with the nav centred until lg). At lg it becomes the three-column left | nav | controls row. Every
// container is items-center and NOTHING carries a baseline nudge, an alignment override, or a top margin —
// all items share one centreline (D-2.08-6, carried forward). Layout is grid placement only, never
// order-* utilities, so the DOM/reading order stays wordmark → credit → nav → MK·EN → cart with the
// cart always last. Gaps use exactly two tokens: gap-4 between the three nav links; gap-6 between MK·EN
// and the cart. Non-sticky, solid ground (D-2.08-3). Every colour / size / spacing / radius / type
// value is a brand.md token — no hex, no raw px literal. The cart control (icon + count badge) is the
// pre-existing one, moved verbatim; its logic and badge wiring are untouched. Client component so the
// nav can read usePathname() for the active-page indicator (D-2.08-4). The three page links reuse the
// reviewed Nav.catalog/about/contact keys; there is no Home/Reviews/Blog/Book link.
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
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        {/* 1 — left: wordmark + build credit, on the shared centreline. */}
        <div className="col-start-1 row-start-1 flex min-w-0 flex-wrap items-center gap-3">
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

        {/* 2 — centre: the three page links (gap-4 apart). Its own centred row below lg; the middle
            auto column of the three-column grid at lg (D-2.13-1/2). */}
        <nav className="col-span-2 col-start-1 row-start-2 flex items-center justify-center gap-4 lg:col-span-1 lg:col-start-2 lg:row-start-1">
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

        {/* 3 — right: MK·EN, then cart (gap-6 apart). The cart is always last. */}
        <div className="col-start-2 row-start-1 flex items-center justify-end gap-6 lg:col-start-3">
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
