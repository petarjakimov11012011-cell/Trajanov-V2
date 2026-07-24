'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Menu, ShoppingBag, X} from 'lucide-react';
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
// Phase 2.14 adds the mobile menu: below lg the <nav> is hidden until the burger button (added as the
// first child of the right-hand controls group, before MK·EN) toggles React state and reveals it as an
// in-flow disclosure panel — a vertical stack that pushes the page down, with no modal, portal, overlay,
// or scroll lock (D-2.14-2). Every stacked style below lg is reverted by an lg: variant, so the desktop
// render is identical whether the state is open or closed; nothing moves in the markup (D-2.14-6) and no
// grid-order utility is used. The panel sits before its trigger in the DOM, so focus moves to the first
// link on open and returns to the button on close/Escape; a link tap and any route change close it. MK·EN
// and the cart stay outside the menu, always visible (D-2.14-5).
export function SiteHeader({cartCount = 0}: {cartCount?: number}) {
  const t = useTranslations('Nav');
  const tc = useTranslations('Credit');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the menu on any route change — a browser back/forward, or a tap on a link to a *different* page —
  // so a customer never lands on the next page with it still hanging open. This is the render-time "reset
  // state when a value changes" pattern (React docs), not a pathname useEffect: eslint's
  // react-hooks/set-state-in-effect (a gate here) forbids the synchronous setState an effect would need,
  // and this avoids the extra render an effect would cost. A tap on the *current* page's link doesn't change
  // pathname, so each link also closes the menu in its onClick (D-2.14-9).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Only while the menu is open: move focus into the panel, and let Escape close it and hand focus back to
  // the button. The listener is bound on open and torn down on close/unmount (D-2.14-5). Because the panel
  // sits before its trigger in the DOM (D-2.14-6), this programmatic focus move is what keeps the open →
  // first-link, close → button order sane.
  useEffect(() => {
    if (!open) return;
    navRef.current?.querySelector('a')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

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

        {/* 2 — centre: the three page links (gap-4 apart). Below lg this <nav> is the mobile menu panel —
            a vertical stack, hidden until the burger opens it; at lg it is the middle auto column of the
            three-column grid, always visible (D-2.13-1/2, D-2.14-4/6/7). */}
        <nav
          id="site-nav"
          ref={navRef}
          className={cn(
            'col-span-2 col-start-1 row-start-2 flex-col items-stretch justify-center gap-4 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:flex lg:flex-row lg:items-center',
            open ? 'flex' : 'hidden',
          )}
        >
          {navLinks.map(({href, key}) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'font-display text-small inline-flex w-full min-h-11 items-center justify-center rounded-[var(--radius-md)] border-b-2 px-3 font-semibold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:w-auto lg:min-h-6 lg:rounded-none lg:px-0',
                  active
                    ? 'text-foreground bg-surface border-transparent lg:bg-transparent lg:border-mustard'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-surface lg:hover:bg-transparent',
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        {/* 3 — right: burger (below lg only), MK·EN, then cart (gap-6 apart). The cart is always last. */}
        <div className="col-start-2 row-start-1 flex items-center justify-end gap-6 lg:col-start-3">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={t('menu')}
            aria-expanded={open}
            aria-controls="site-nav"
            className="text-foreground inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] transition-colors duration-[var(--motion-fast)] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
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
