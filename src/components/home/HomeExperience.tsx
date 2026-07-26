'use client';

import {useEffect, useState, type ReactNode} from 'react';
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

// The Home hero photographs (D-Y.04-1, D-Y.05-3). Home is the use `facts.md` §8 always sanctioned —
// "the lifestyle set … carries the Home hero" — unblocked when all five §8.1 permissions were recorded
// GIVEN on 2026-07-26. Each file is bound by an EXPLICIT NAMED CONSTANT, never by array index or
// position (the D-Y.03-1 principle), so a re-order elsewhere cannot swap which frame renders where.
//
// Two sources, art-directed by breakpoint (D-Y.05-3): below `sm:` the portrait mustard frame from Y.03
// (2:3 cropped into 4/5, `objectPosition` keeping the GARMENT in frame — Y.04's tuned value); from
// `sm:` the three-panel bar composite committed by this phase (1672×941, 16:9, built from the same
// three §8.1-permitted frames, serif TRAJANOV wordmark burned into the image — no new photograph, no
// new subject, D-0-6 untouched). The composite is NOT rendered below `sm:` because `object-cover` on a
// 16:9 source in a phone-shaped box would slice the burned-in wordmark into unreadable fragments.
// `altKey` resolves to `Product.photoAlt*` strings: the garments, never the people.
const HERO_FRAME_MUSTARD = {
  src: '/images/lifestyle/mustard-ochre-01.webp',
  altKey: 'photoAltOchre',
  objectPosition: 'center 60%',
} as const;

const HERO_FRAME_COMPOSITE = {
  src: '/images/lifestyle/trio-composite-01.webp',
  altKey: 'photoAltComposite',
  objectPosition: 'center 50%',
} as const;

// The scrim over the hero photograph (D-Y.05-6): built from --color-ground ONLY — it darkens, never
// lightens, so every overlay pair degrades toward the measured brand pairs in brand.md §3. Two stacked
// layers: a flat wash over the whole image, and a bottom-anchored gradient under the text block. The
// percentages are the measured end state of Task 7's contrast pass (tagline + button labels ≥4.5:1,
// countdown digits ≥3:1, sampled at the brightest pixel beneath each) — if a future measurement fails,
// the ONLY permitted correction is deeper; never lighten the photograph, never brighten the text.
const SCRIM_WASH = 'color-mix(in srgb, var(--color-ground) 40%, transparent)';
const SCRIM_DEEP = 'color-mix(in srgb, var(--color-ground) 92%, transparent)';
const SCRIM_CLEAR = 'color-mix(in srgb, var(--color-ground) 0%, transparent)';
// The gradient reaches 80% of the hero's height, not the brief's starting 55%: measured, the
// countdown digits' top rows sit ~60% up the box at 320/768/1024, where a 55% gradient leaves only
// the wash beneath them, and the brightest shirt pixel under a digit composited to 2.14:1 (< the
// 3:1 floor). At 80% every digit's worst pixel measures ≥3.4:1. Correction direction per
// D-Y.05-6: deeper only.
const SCRIM_BACKGROUND = `linear-gradient(to top, ${SCRIM_DEEP} 0%, ${SCRIM_CLEAR} 80%), linear-gradient(${SCRIM_WASH}, ${SCRIM_WASH})`;

// The full-bleed hero (Phase Y.05): ONE photograph with the words on it. A positioned box holding the
// image layer, the scrim layer, and the bottom-anchored content layer (the drop-state element, the
// countdown when there is one, the tagline, the two CTAs). "Full-bleed" means the width of the page
// column, not the viewport (D-Y.05-5): -mx-4/-mx-6 cancels the column padding exactly and the hero
// stops at the existing max-w-6xl, so it keeps alignment with the header and never upscales the
// 1672px source. Square-cornered below `sm:` where it touches the viewport edge (the D-Y.04-3 bleed
// shape); the PhotoSlot radius inside the column from `sm:`. If the column padding ever changes,
// the bleed must follow.
function Hero({children}: {children: ReactNode}) {
  const t = useTranslations('Product');
  return (
    <div className="relative -mx-4 self-stretch overflow-hidden sm:-mx-6 sm:rounded-[var(--radius-lg)]">
      {/* Image layer. Exactly ONE preload, and it is the mobile one (D-Y.05-4): the mustard frame
          keeps `priority` (it is the LCP element for the phone visitors audience 1 is made of).
          The composite deliberately has NO priority, NO loading, NO fetchPriority (D-Y.05-11): on
          Next 16.2.10, `loading="eager"` and `fetchPriority="high"` — the brief's recipe — each
          emit a SECOND `rel="preload"` link, the exact thing D-Y.05-4 exists to prevent. Default
          (lazy) is the only recipe that keeps the preload count at one; the composite is in the
          initial HTML and in-viewport from `sm:`, so desktop fetches it right after layout — and a
          phone, where its box is display:none, never downloads the desktop-only asset at all.
          bg-surface-2 behind both, so a still-loading photograph reads as a quiet surface, never a
          hole. */}
      <div className="bg-surface-2 relative aspect-[4/5] sm:hidden">
        <Image
          src={HERO_FRAME_MUSTARD.src}
          alt={t(HERO_FRAME_MUSTARD.altKey)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{objectPosition: HERO_FRAME_MUSTARD.objectPosition}}
        />
      </div>
      <div className="bg-surface-2 relative hidden aspect-[16/9] sm:block">
        <Image
          src={HERO_FRAME_COMPOSITE.src}
          alt={t(HERO_FRAME_COMPOSITE.altKey)}
          fill
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover"
          style={{objectPosition: HERO_FRAME_COMPOSITE.objectPosition}}
        />
      </div>
      {/* Scrim layer (D-Y.05-6). Decorative only — hidden from the a11y tree, transparent to the
          pointer. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{backgroundImage: SCRIM_BACKGROUND}}
      />
      {/* Content layer: bottom-anchored over the deepest part of the scrim. Centred below `sm:`
          (thumb-first, one column), left-aligned from `sm:` so the words sit against the composite's
          left panel rather than across the burned-in wordmark. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-4 pb-8 text-center sm:items-start sm:px-8 sm:pb-10 sm:text-left">
        {children}
      </div>
    </div>
  );
}

// The two calls to action on the hero. Existing button styling only, no new variant (D-Y.04-4): the
// primary is the Cart checkout-Link recipe (CartView), the secondary the same shell with the
// border-border-strong / hover:border-foreground treatment the cart's bordered controls already use.
// px-5 py-3 on text-base computes to ≥48px tall — clears the 44px tap-target floor. The primary's
// on-mustard-on-mustard contrast is self-contained (9.3:1, brand.md §3) — independent of the scrim.
const ctaBase =
  'font-display inline-flex items-center justify-center rounded-[var(--radius-md)] px-5 py-3 font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground';

function HeroCtas() {
  const t = useTranslations('Home');
  return (
    <div className="flex w-full items-center justify-center gap-3 sm:justify-start sm:gap-4">
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

  // The three non-`live` branches carry a visually-hidden <h1> (D-Y.05-2) — the photograph is the
  // page's visible top, but the page keeps exactly one H1 for the 2.04 "one H1, no heading skips"
  // gate. Identical to what the live branch has done since 2.04. Home.headline is retired from
  // render, not deleted (D-Y.05-1) — the key stays in both catalogs, flagged in string-inventory.md.
  if (!view) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
        <section className="reveal-group flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <h1 className="sr-only">{t('title')}</h1>
          <Hero>
            <DropCountdownEyebrow />
            <p className="text-foreground max-w-md text-balance">{t('sub')}</p>
            <HeroCtas />
          </Hero>
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
          <h1 className="sr-only">{t('title')}</h1>
          <Hero>
            <DropEndedBanner className="max-w-md justify-center" />
            <p className="text-foreground max-w-md text-balance">{t('sub')}</p>
            <HeroCtas />
          </Hero>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground text-small underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
          >
            {t('aboutLink')} →
          </Link>
        </section>
      ) : (
        <section className="reveal-group flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <h1 className="sr-only">{t('title')}</h1>
          <Hero>
            <DropCountdownEyebrow />
            {/* The countdown renders INSIDE the overlay (D-Y.05-7) — the largest type on the page;
                nothing else in the overlay may be set larger. Behaviour props (target / serverNowMs
                / onComplete) unchanged from Y.04. The size classes on the wrapper are a MEASURED
                fix, not styling drift (D-Y.05-9/10): Countdown's own digit/colon spans write
                `text-countdown` before a text-colour class inside cn(), and tailwind-merge cannot
                tell a custom font-size utility from a colour, so it strips the size — the digits
                have computed to 16px since 1.04, on `main` and production too (pre-existing;
                surfaced by this phase's "largest type in the hero" gate). The spans inherit the
                size from this wrapper instead. It is `text-h1` below `md:` because the countdown
                token PHYSICALLY cannot fit a phone: at 390px, four 2ch cells at 13vw + colons +
                gaps measure 402px — wider than the viewport (the token was born unfittable; the
                16px bug is why nobody ever saw it clip). From `md:` the row fits and the token
                applies. Root fix (extendTailwindMerge in src/lib/utils.ts) is out of this phase's
                file scope. */}
            <Countdown
              className="text-h1 md:text-countdown"
              target={view.startsAtMs}
              serverNowMs={view.serverNowMs}
              onComplete={() => {
                setOpening(true);
                router.refresh();
              }}
            />
            {opening ? (
              // The T-0 "opening" status sits where the tagline would be — current behaviour kept:
              // while re-validating, the tagline and the CTAs stay out of the way.
              <p className="text-mustard font-display font-semibold" role="status">
                {t('opening')}
              </p>
            ) : (
              <>
                <p className="text-foreground max-w-md text-balance">{t('sub')}</p>
                <HeroCtas />
              </>
            )}
          </Hero>
          {!opening && (
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-small underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
            >
              {t('aboutLink')} →
            </Link>
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
