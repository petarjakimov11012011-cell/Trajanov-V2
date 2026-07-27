'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {ArrowLeft, ArrowRight, Pause, Play} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {StockBadge} from '@/components/drop/StockBadge';
import {Placeholder} from '@/components/system/Placeholder';
import {formatMkd} from '@/lib/format';
import {showcaseSlides, wrapIndex} from '@/lib/showcase';
import {cn} from '@/lib/utils';
import type {DropView} from '@/lib/drop/state';

const pad2 = (n: number) => String(n).padStart(2, '0');

// One source for BOTH the JS slide timer and the CSS progress-fill animation: the value is written
// onto the section as the `--showcase-autoplay` custom property, and the `.showcase-progress-fill`
// rule reads it back — the fill physically cannot drift from the timer. 6s per the 2.21 brief
// (decision 6): >5s of auto-updating content requires a pause mechanism (WCAG 2.2 SC 2.2.2), which
// the pause button below provides.
const AUTOPLAY_MS = 6000;

// The hero's secondary-CTA look, RE-DECLARED locally on the brief's instruction — do not refactor
// HomeExperience.tsx to share it (that file is byte-frozen this phase). Keep visually in step with
// `ctaBase` + the bordered branch in HomeExperience.tsx if either ever changes.
const ctaSecondary =
  'font-display inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-transparent px-5 py-3 font-bold text-foreground transition-colors duration-[var(--motion-fast)] hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

// The same shell at icon-button proportions: 48px square (p-3 + a 24px icon) clears the 44px
// tap-target floor (WCAG 2.2 — 2.5.8, the 2.04 gate).
const iconButton =
  'font-display inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-transparent p-3 text-foreground transition-colors duration-[var(--motion-fast)] hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

// Home showcase (Phase 2.21) — the pieces, one large photograph at a time, between the hero and the
// FAQ. Layout and interaction follow the reference; every fact on a slide is one we hold: the
// photograph (product-images.ts), the name (real or the neutral slot), the price, the stock state,
// and one link to the product page. No description, no buy button, no sizes (decisions 3–4).
// Which products appear, and that `live`/no-drop render NOTHING, is decided in src/lib/showcase.ts.
export function HomeShowcase({view}: {view: DropView | null}) {
  const t = useTranslations();
  const locale = useLocale();
  const slides = showcaseSlides(view);
  const total = slides.length;

  const [active, setActive] = useState(0);
  // The user's own pause toggle — sticky until pressed again. Hover/focus/tab-hidden pauses are
  // transient and tracked separately so leaving the section resumes play.
  const [manualPause, setManualPause] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<{x: number; y: number} | null>(null);

  // WCAG 2.2 SC 2.2.2 (decision 6): autoplay stops on hover, focus-within, hidden tab, the toggle,
  // and entirely under prefers-reduced-motion. With one slide there is nothing to play.
  const playing =
    total > 1 && !manualPause && !hovered && !focusWithin && !docHidden && !reducedMotion;

  // NOT a duplicate of the global `prefers-reduced-motion` rule in globals.css: that rule flattens
  // CSS animations/transitions but physically cannot stop a JS setTimeout. Deleting this check
  // re-enables autoplay for reduced-motion users. It must stay in JS.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const update = () => setDocHidden(document.visibilityState === 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  // One timeout per visible slide; re-armed when the slide or the play state changes, cleared on
  // every re-arm and on unmount. `active` is a dependency ON PURPOSE: a manual prev/next/jump
  // restarts the full 6s rather than cutting the new slide short.
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setActive((i) => wrapIndex(i + 1, total));
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, total]);

  if (total === 0) return null;

  const goTo = (i: number) => setActive(wrapIndex(i, total));

  const slideTitle = (slide: (typeof slides)[number]) => {
    const realName = locale === 'mk' ? slide.nameMk : slide.nameEn;
    // The neutral slot, exactly as ProductCard builds it — never an invented name (facts.md §10).
    return realName ?? `${t('Placeholder.productName')} ${pad2(slide.index)}`;
  };

  return (
    <section
      aria-labelledby="home-showcase-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      // The CSS progress fill reads this var — same constant as the JS timer, single source.
      style={{'--showcase-autoplay': `${AUTOPLAY_MS}ms`} as React.CSSProperties}
    >
      {/* Visually hidden on the brief's instruction (decision 8): keeps the reference's clean,
          title-less look while the section stays labelled and the outline stays h1 → h2 → h3.
          Reuses the already-native-reviewed Home.browseWhileWait — no new MK review debt. */}
      <h2 id="home-showcase-heading" className="sr-only">
        {t('Home.browseWhileWait')}
      </h2>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={t('Showcase.regionLabel')}
        onPointerEnter={(e) => {
          // Hover-pause is a fine-pointer affordance; a phone tap must not silently pause.
          if (e.pointerType !== 'touch') setHovered(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'touch') setHovered(false);
        }}
        onFocus={() => setFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false);
        }}
        // Swipe advances; NO preventDefault anywhere so vertical page scroll is untouched.
        onTouchStart={(e) => {
          const touch = e.touches[0];
          touchStart.current = {x: touch.clientX, y: touch.clientY};
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const touch = e.changedTouches[0];
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          // Horizontal-dominant and past a threshold — a scroll flick with a little drift is not
          // a slide change.
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
            goTo(dx < 0 ? active + 1 : active - 1);
          }
        }}
      >
        {/* Every slide stays in the DOM, stacked (grid-area 1/1 in the CSS block), so the section's
            height is the tallest slide's height and never shifts on a slide change. `off` while
            autoplaying (an announcement every 6s is noise), `polite` when the user paused or under
            reduced motion (then a change is something they did). */}
        <div className="showcase-stack" aria-live={playing ? 'off' : 'polite'}>
          {slides.map((slide, i) => {
            const isActive = i === active;
            return (
              <div
                key={slide.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={t('Showcase.slideLabel', {index: i + 1, total})}
                aria-hidden={!isActive}
                // `inert` (React 19 boolean) so keyboard focus can NEVER land inside a hidden
                // slide — aria-hidden alone leaves the link tabbable.
                inert={!isActive}
                data-active={isActive}
                className="showcase-slide"
              >
                <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
                  {/* Photograph first in DOM = first on mobile. NO priority / loading / fetchPriority:
                      the hero's single mustard preload is a hard invariant (D-Y.05-4, D-Y.05-11). */}
                  <div className="bg-surface-2 relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)]">
                    <Image
                      src={slide.image.src}
                      alt={t(slide.image.altKey)}
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                      style={{objectPosition: slide.image.objectPosition}}
                    />
                  </div>

                  <div className="flex flex-col items-start gap-4">
                    {/* Class strings on the text column are PLAIN strings, not cn(): tailwind-merge
                        strips a custom text-size utility that precedes a text-colour one (D-Y.05-9). */}
                    <span className="text-muted-foreground text-eyebrow tabular uppercase tracking-[0.14em]">
                      {pad2(i + 1)} / {pad2(total)}
                    </span>
                    <h3 className="font-display text-h2 font-bold text-foreground text-balance">
                      {slideTitle(slide)}
                    </h3>
                    {slide.priceMkd != null ? (
                      <span className="text-price tabular font-semibold text-foreground">
                        {formatMkd(slide.priceMkd, t('Common.currency'), locale)}
                      </span>
                    ) : (
                      // Same fallback as ProductCard — a visible, logged placeholder, never a guess.
                      <Placeholder>{t('Placeholder.price')}</Placeholder>
                    )}
                    <StockBadge level={slide.stock} remaining={slide.remaining} />
                    <Link
                      // Object form so next-intl emits the localised URL (/katalog/<slug> or
                      // /en/catalog/<slug>) — never hand-write the MK slug (D-2.01-2).
                      href={{pathname: '/catalog/[slug]', params: {slug: slide.slug}}}
                      className={cn(ctaSecondary, 'mt-2')}
                    >
                      {t('Showcase.view')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* With exactly one slide there is nothing to control: no arrows, no progress bar, no
            autoplay, no pause button — a control that cannot do anything is worse than no control. */}
        {total > 1 && (
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label={t('Showcase.prev')}
              className={iconButton}
              onClick={() => goTo(active - 1)}
            >
              <ArrowLeft aria-hidden className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label={t('Showcase.next')}
              className={iconButton}
              onClick={() => goTo(active + 1)}
            >
              <ArrowRight aria-hidden className="h-6 w-6" />
            </button>
            {/* No pause control under reduced motion: autoplay does not exist there, so the button
                could do nothing (the same principle as the one-slide case). Arrows and the progress
                buttons still change slides. */}
            {!reducedMotion && (
              <button
                type="button"
                aria-label={manualPause ? t('Showcase.play') : t('Showcase.pause')}
                className={iconButton}
                onClick={() => setManualPause((p) => !p)}
              >
                {manualPause ? (
                  <Play aria-hidden className="h-6 w-6" />
                ) : (
                  <Pause aria-hidden className="h-6 w-6" />
                )}
              </button>
            )}

            {/* Labelled progress bar doubling as pagination: one button per slide, the product
                title as its visible label, a fill that tracks the autoplay timer. The fill is
                keyed on (slide, playing) so it restarts whenever the timer re-arms. `basis-full`
                below sm: wraps it onto its own row — beside the three buttons a phone leaves the
                labels ~45px and they truncate to two letters. */}
            <div className="flex min-w-0 basis-full items-stretch gap-3 sm:basis-auto sm:flex-1 sm:gap-4">
              {slides.map((slide, i) => (
                <button
                  key={slide.slug}
                  type="button"
                  aria-current={i === active || undefined}
                  className="group flex min-w-0 flex-1 flex-col justify-end gap-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
                  onClick={() => goTo(i)}
                >
                  <span
                    className={cn(
                      'truncate text-small transition-colors duration-[var(--motion-fast)]',
                      i === active
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground',
                    )}
                  >
                    {slideTitle(slide)}
                  </span>
                  {/* border-strong, not border: the empty track must clear 3:1 on ground (measured
                      3.56 vs border's 1.37) — "hairlines that must be seen", brand.md §3. */}
                  <span className="bg-border-strong h-0.5 w-full overflow-hidden rounded-[var(--radius-full)]">
                    <span
                      key={`${active}-${String(playing)}`}
                      className={cn(
                        'showcase-progress-fill',
                        i === active && playing && 'is-running',
                        // On the slide the user is looking at while paused, the bar reads as the
                        // current position, not an empty track.
                        i === active && !playing && 'is-held',
                      )}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
