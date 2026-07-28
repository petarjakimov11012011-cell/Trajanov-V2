'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Menu, ShoppingBag, X} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {LanguageSwitch} from './LanguageSwitch';

// Site-wide header. It now carries TWO distinct layouts in one component (D-2.15-6):
//
//  • DESKTOP (≥ lg, 1024px) — the finished 2.13 three-column CSS grid, UNCHANGED in its rendered
//    result: LEFT group (wordmark + build credit) · centred <nav> (Catalog · About · Contact) · RIGHT
//    cluster (MK·EN + cart). The two outer grid columns are minmax(0,1fr) and the middle is auto, so the
//    nav sits on the container's true centreline (D-2.13-1). The non-wordmark pieces are simply gated
//    `hidden lg:*` so they vanish below lg; at lg they render exactly as they did in 2.13 (byte-for-byte
//    rendered result — hard stop #1). Grid placement only, never order-* utilities, so DOM/reading order
//    stays wordmark → credit → nav → MK·EN → cart, cart last.
//
//  • MOBILE (< lg) — the header row is JUST the wordmark (left) + a burger button (right). Everything
//    else (the page links, MK·EN, the cart, and the build credit) moves inside a full-screen OVERLAY
//    (D-2.15-1/2): tapping the burger opens a `position: fixed inset-0`, opaque `bg-ground`,
//    role="dialog" aria-modal panel that covers the viewport. It is hand-rolled — no @base-ui, no portal,
//    no focus-trap package (D-2.15-1, D-2.11-3 precedent). The overlay renders its own top bar (wordmark
//    home-link + X close) and simply covers the header bar behind it (D-2.15-3). Active links get a LEFT
//    vertical accent bar, left-aligned (D-2.15-4), not the desktop bottom-border. This replaces the 2.14
//    in-flow expand (supersedes D-2.14-2/5/6/7).
//
// Every colour / size / spacing / radius / type / motion value is a brand.md token — no hex, no raw px
// literal. Client component so the nav can read usePathname() for the active-page state (D-2.08-4).

// Scroll offset at which the header contracts. Not a design token — a scroll position, not a
// rendered value (brand.md §8 covers colour/size/spacing/type/motion, not this).
const SCROLL_THRESHOLD_PX = 32;

export function SiteHeader({cartCount = 0}: {cartCount?: number}) {
  const t = useTranslations('Nav');
  const tc = useTranslations('Credit');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close the overlay on any route change — a browser back/forward, or a tap on a link to a *different*
  // page — so a customer never lands on the next page with it still hanging open. This is the render-time
  // "reset state when a value changes" pattern (React docs), NOT a pathname useEffect: eslint's
  // react-hooks/set-state-in-effect (a gate here) forbids the synchronous setState an effect would need,
  // and this avoids the extra render an effect would cost (D-2.14-9, carried forward). A tap on the
  // *current* page's link doesn't change pathname, so each row also closes the overlay in its onClick.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // The modal contract, active ONLY while the overlay is open (D-2.15-1). Bound on open, torn down on
  // close/unmount. Setting body.style / focusing / adding a listener in the effect body is fine — the only
  // setState calls are inside the keydown *callback* (event-driven), which the lint rule allows.
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Scroll lock: remember the prior value and restore it on close/unmount.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the panel — the close (X) button.
    closeRef.current?.focus();

    const focusable = () =>
      Array.from(
        overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      // Focus trap: keep Tab / Shift+Tab cycling within the overlay's focusable elements so focus can
      // never land on an element behind it.
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Resize safety: if the viewport crosses to desktop while the overlay is open, close it — this hides
  // the overlay (it is lg:hidden anyway) AND releases the scroll lock, so a resize can't strand a locked
  // body on desktop (D-2.15-1). We bind the matchMedia `change` listener the brief specifies AND re-check
  // the same query on a plain `resize` — belt-and-suspenders so the lock always releases even where the
  // matchMedia change event is unreliable (D-2.15-7). setState here is inside the *callbacks*, not the
  // effect body, so it is fine under react-hooks/set-state-in-effect.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const closeIfDesktop = () => {
      if (mql.matches) setOpen(false);
    };
    mql.addEventListener('change', closeIfDesktop);
    window.addEventListener('resize', closeIfDesktop);
    return () => {
      mql.removeEventListener('change', closeIfDesktop);
      window.removeEventListener('resize', closeIfDesktop);
    };
  }, []);

  // Scroll-reactive header (D-2.17-1…3). Past this offset the bar contracts into the pill; the
  // styling itself lives in the .header-shell / .header-bar block in globals.css (D-2.17-2).
  // setState here is inside the listener / rAF *callbacks*, never in the effect body, so it is fine
  // under react-hooks/set-state-in-effect (the same constraint the 2.15 effects work within).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    window.addEventListener('scroll', onScroll, {passive: true});
    // Sync once on mount via rAF, not in the effect body: a back/forward navigation can restore a
    // scrolled position before this ever fires, and without this the bar would render at its
    // scroll-top state until the customer moved.
    const raf = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // A page link is active on its own route and on nested routes (a product page keeps Catalog lit).
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navLinks = [
    {href: '/catalog', key: 'catalog'},
    {href: '/about', key: 'about'},
    {href: '/contact', key: 'contact'},
  ] as const;

  // The wordmark markup appears twice — in the header bar and in the overlay's top bar (D-2.15-3). Same
  // classes both times.
  const wordmarkClass =
    'wordmark-shine font-display text-foreground text-price rounded-[var(--radius-sm)] font-extrabold uppercase tracking-[0.14em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring';

  // The burger and the overlay's X share size / interaction classes (44px WCAG target, matching the cart).
  const iconButtonClass =
    'text-foreground inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] transition-colors duration-[var(--motion-fast)] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring';

  // The overlay's stacked rows: large, left-aligned, a LEFT vertical accent on the active one (D-2.15-4).
  // This used to be hand-concatenated rather than cn(), because tailwind-merge filed the custom `text-h2`
  // utility as a text-colour and dropped it whenever `text-foreground` / `text-muted-foreground` followed —
  // shrinking the row to the 16px default. src/lib/utils.ts now registers the brand sizes under `font-size`
  // (D-2.25-1), so a size and a colour no longer collide and cn() is safe here again.
  const overlayRow = (active: boolean) =>
    cn(
      'font-display text-h2 flex min-h-11 items-center gap-3 border-l-2 pl-4 font-semibold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
      active
        ? 'text-foreground border-mustard'
        : 'text-muted-foreground border-transparent hover:text-foreground',
    );

  // The build credit — subordinate, muted; only "Vertex Consulting" is the link (facts.md §11). Rendered
  // in the header bar (desktop) and again, centred, near the bottom of the overlay. A fresh node each call.
  const renderCredit = () =>
    tc.rich('builtBy', {
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
    });

  return (
    // `sticky top-0` keeps the header in flow (D-2.17-1) so no route needs a top offset. z-30 sits
    // below the overlay's z-40 (a child of this header) and the skip link's focus:z-50 (a sibling).
    // `data-scrolled` is the ONLY styling switch: past the scroll threshold the .header-shell /
    // .header-bar block in globals.css contracts the inner bar into a translucent blurred pill and
    // fades this shell's own background + border to transparent (D-2.17-2/3). Nothing here may put
    // transform/filter/backdrop-filter on <header> — that would trap the fixed overlay (hard stop #2).
    <header
      className="header-shell bg-ground border-border sticky top-0 z-30 border-b"
      data-scrolled={scrolled ? 'true' : undefined}
    >
      <div className="header-bar mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        {/* 1 — left: wordmark (all widths) + build credit (desktop only). */}
        <div className="col-start-1 row-start-1 flex min-w-0 flex-wrap items-center gap-3">
          <Link href="/" className={wordmarkClass}>
            {t('brand')}
          </Link>
          {/* Credit moves into the overlay for mobile (D-2.15-2); shown in the bar only at lg. */}
          <p className="header-credit text-muted-foreground text-small hidden min-w-0 lg:block">
            {renderCredit()}
          </p>
        </div>

        {/* 2 — centre: the three page links, desktop only. The 2.13 result verbatim — gap-4, the
            font-display text-small links, isActive/aria-current, and the 2px border-mustard bottom-border
            active indicator. Not rendered below lg (the links live in the overlay). */}
        <nav className="hidden gap-4 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:flex lg:flex-row lg:items-center">
          {navLinks.map(({href, key}) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'font-display text-small inline-flex min-h-6 items-center justify-center border-b-2 font-semibold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
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

        {/* 3 — right: burger (below lg only), then the MK·EN + cart cluster (desktop only). Cart last. */}
        <div className="col-start-2 row-start-1 flex items-center justify-end lg:col-start-3">
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t('menu')}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={cn(iconButtonClass, 'lg:hidden')}
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <div className="hidden items-center gap-6 lg:flex">
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

      {/* The full-screen overlay — mobile only, mounted when open. lg:hidden guarantees it never shows at
          desktop even if `open` is stale after a resize (D-2.15-1). It covers the header bar behind it. */}
      {open && (
        <div
          ref={overlayRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t('menu')}
          className="bg-ground fixed inset-0 z-40 overflow-y-auto lg:hidden"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-3 sm:px-6">
            {/* Top bar: wordmark home-link (also closes) + X close. */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={wordmarkClass}
              >
                {t('brand')}
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={() => {
                  setOpen(false);
                  burgerRef.current?.focus();
                }}
                aria-label={t('close')}
                className={iconButtonClass}
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Stacked links: Catalog, About, Contact, Cart. Every row closes the overlay on tap. */}
            <nav aria-label={t('menu')} className="mt-8 flex flex-col gap-2">
              {navLinks.map(({href, key}) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={overlayRow(active)}
                  >
                    {t(key)}
                  </Link>
                );
              })}
              {/* Cart — a fourth row, with the ShoppingBag icon + the count badge exactly as the header. */}
              <Link
                href="/cart"
                aria-current={isActive('/cart') ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={overlayRow(isActive('/cart'))}
              >
                <span className="relative inline-flex">
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                  {cartCount > 0 && (
                    <span className="bg-mustard text-on-mustard tabular absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.65rem] font-bold">
                      {cartCount}
                    </span>
                  )}
                </span>
                {t('cart')}
              </Link>
            </nav>

            {/* Divider. */}
            <div className="border-border mt-8 border-t" />

            {/* Language switch, centred. */}
            <div className="mt-6 flex justify-center">
              <LanguageSwitch />
            </div>

            {/* Build credit, centred, near the bottom. */}
            <p className="text-muted-foreground text-small mt-6 text-center">
              {renderCredit()}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
