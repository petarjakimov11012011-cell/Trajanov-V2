'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
// Locale-aware router + Link (D-2.01). useRouter here is used only for router.refresh() at T-0, but it
// comes from the i18n navigation surface so no user-facing routing bypasses the localised helpers.
import {Link, useRouter} from '@/i18n/navigation';
import {Countdown} from '@/components/drop/Countdown';
import {
  DropCountdownEyebrow,
  DropLiveBanner,
  DropEndedBanner,
} from '@/components/drop/DropBanner';
import {ProductCard} from '@/components/product/ProductCard';
import type {DropView} from '@/lib/drop/state';
import {cn} from '@/lib/utils';

// The Home hero photographs (D-Y.04-1, superseding D-1.05-4). Home is the use `facts.md` §8 always
// sanctioned — "the lifestyle set … carries the Home hero" — unblocked when all five §8.1 permissions
// were recorded GIVEN on 2026-07-26. Only the two frames already committed by Y.03 render here; this
// phase adds no asset (D-0-6). Each file is bound by an EXPLICIT NAMED CONSTANT, never by array index
// or position (the D-Y.03-1 principle), so a re-order elsewhere cannot swap which frame renders where.
// Both files were re-confirmed against their colourway by eye before wiring (mustard garment RGB
// ~(213,163,58); off-white ~(199,188,181)). `objectPosition` reuses Y.03's tuned values — the sources
// are 2:3 cropped into the same 4/5 box, and these keep the GARMENT in frame rather than centring on
// the whole figure. `altKey` resolves to the existing `Product.photoAlt*` strings: the garment,
// never the person.
const HERO_FRAME_MUSTARD = {
  src: '/images/lifestyle/mustard-ochre-01.webp',
  altKey: 'photoAltOchre',
  objectPosition: 'center 60%',
} as const;

const HERO_FRAME_OFF_WHITE = {
  src: '/images/lifestyle/off-white-01.webp',
  altKey: 'photoAltOffWhite',
  objectPosition: 'center 65%',
} as const;

// The hero photograph block. One frame on a phone: the frames are portrait 1333×2000, and two of them
// at ~190px each stop showing the garment legibly — audience 1 arrives on a phone from an Instagram
// story. Two frames side by side from `sm:`. Follows the PhotoSlot pattern: `next/image` `fill` +
// `object-cover` inside a fixed-aspect box. `priority` is ON for the mustard frame only — it is the
// LCP element on the site's front door; the off-white frame is `sm:`-only and stays lazy.
function HeroPhotos() {
  const t = useTranslations('Product');
  return (
    <div className="grid w-full grid-cols-1 gap-3 self-stretch sm:grid-cols-2 sm:gap-4">
      {/* Full-bleed on mobile: -mx-4 cancels the page column's px-4, so the frame runs edge to edge
          (and square-cornered, since it touches the viewport edges); from `sm:` it sits inside the
          column with the PhotoSlot radius. */}
      <div className="bg-surface-2 relative -mx-4 aspect-[4/5] overflow-hidden sm:mx-0 sm:rounded-[var(--radius-lg)]">
        <Image
          src={HERO_FRAME_MUSTARD.src}
          alt={t(HERO_FRAME_MUSTARD.altKey)}
          fill
          priority
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
          style={{objectPosition: HERO_FRAME_MUSTARD.objectPosition}}
        />
      </div>
      <div className="bg-surface-2 relative hidden aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] sm:block">
        <Image
          src={HERO_FRAME_OFF_WHITE.src}
          alt={t(HERO_FRAME_OFF_WHITE.altKey)}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
          style={{objectPosition: HERO_FRAME_OFF_WHITE.objectPosition}}
        />
      </div>
    </div>
  );
}

// The two calls to action beneath the photographs. Existing button styling only, no new variant: the
// primary is the Cart checkout-Link recipe (CartView), the secondary the same shell with the
// border-border-strong / hover:border-foreground treatment the cart's bordered controls already use.
// px-5 py-3 on text-base computes to ≥48px tall — clears the 44px tap-target floor.
const ctaBase =
  'font-display inline-flex items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

function HeroCtas() {
  const t = useTranslations('Home');
  return (
    <div className="flex w-full items-center justify-center gap-3 sm:gap-4">
      <Link
        href="/catalog"
        className={cn(ctaBase, 'bg-mustard hover:bg-mustard-hover text-on-mustard')}
      >
        {t('ctaCatalog')}
      </Link>
      <Link
        href="/contact"
        className={cn(
          ctaBase,
          'border-border-strong text-foreground hover:border-foreground border bg-transparent',
        )}
      >
        {t('ctaContact')}
      </Link>
    </div>
  );
}

// The home experience, driven by SERVER-computed drop state (D-1.04-9). The browser no longer decides
// whether a drop is open — it renders whatever the server said and, at T-0, asks the server again
// rather than unlocking anything itself (Task 4).
export function HomeExperience({view}: {view: DropView | null}) {
  const t = useTranslations('Home');
  const router = useRouter();
  // Set the moment the client countdown reaches zero: we ask the server to re-validate and show a brief
  // "opening" state until it confirms the drop is live — never a broken buy button (Task 4).
  const [opening, setOpening] = useState(false);

  const state = view?.state;

  // While opening and the server still says "countdown" (clock skew, or it opens exactly at T-0), keep
  // asking. Stops as soon as the server flips the drop to live or ended.
  useEffect(() => {
    if (!opening || state !== 'countdown') return;
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [opening, state, router]);

  if (!view) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
        <section className="reveal-group flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <DropCountdownEyebrow />
          <h1 className="font-display text-h2 text-foreground mx-auto max-w-2xl font-bold text-balance">
            {t('headline')}
          </h1>
          <p className="text-muted-foreground max-w-md text-balance">{t('sub')}</p>
          <HeroPhotos />
          <HeroCtas />
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
      {view.state === 'live' ? (
        <section className="flex flex-col gap-8 py-10">
          {/* The live drop grid renders product-card <h2>s; a single visually-hidden <h1> anchors the
              page so heading order never skips a level (WCAG 2.2 — Task 8). */}
          <h1 className="sr-only">{t('title')}</h1>
          <DropLiveBanner remaining={view.remaining} />
          <div className="reveal-group grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {view.products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : view.state === 'ended' ? (
        <section className="reveal-group flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <DropEndedBanner className="max-w-md justify-center" />
          <h1 className="font-display text-h2 text-foreground mx-auto max-w-2xl font-bold text-balance">
            {t('headline')}
          </h1>
          <p className="text-muted-foreground max-w-md text-balance">{t('sub')}</p>
          <HeroPhotos />
          <HeroCtas />
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground text-small underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
          >
            {t('aboutLink')} →
          </Link>
        </section>
      ) : (
        <section className="reveal-group flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <DropCountdownEyebrow />
          <Countdown
            target={view.startsAtMs}
            serverNowMs={view.serverNowMs}
            onComplete={() => {
              setOpening(true);
              router.refresh();
            }}
          />
          {opening ? (
            <p className="text-mustard font-display font-semibold" role="status">
              {t('opening')}
            </p>
          ) : (
            <>
              <h1 className="font-display text-h2 text-foreground mx-auto max-w-2xl font-bold text-balance">
                {t('headline')}
              </h1>
              <p className="text-muted-foreground max-w-md text-balance">{t('sub')}</p>
              {/* The browseWhileWait text link is retired here (D-Y.04-2): the primary Каталог button
                  below targets the same route, and the brief's top-to-bottom order for this branch
                  does not include it. The `Home.browseWhileWait` key stays in both catalogs. */}
              <HeroPhotos />
              <HeroCtas />
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground text-small underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
              >
                {t('aboutLink')} →
              </Link>
            </>
          )}
        </section>
      )}

      {view.isPreview && <PreviewBadge />}
    </div>
  );
}

// Dev-only marker: shown when the drop state was forced by the ?preview override so a reviewer never
// mistakes an overridden state for the real one. The override itself is refused in production
// (src/lib/drop) and the page only wires the control outside production.
function PreviewBadge() {
  return (
    <p className="text-muted-foreground mx-auto mb-8 mt-4 text-eyebrow uppercase tracking-[0.14em]">
      preview override (dev only)
    </p>
  );
}
