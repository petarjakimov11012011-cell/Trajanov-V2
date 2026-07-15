'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Countdown} from '@/components/drop/Countdown';
import {
  DropCountdownEyebrow,
  DropLiveBanner,
  DropEndedBanner,
} from '@/components/drop/DropBanner';
import {ProductCard} from '@/components/product/ProductCard';
import type {DropView} from '@/lib/drop/state';

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
        <section className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <DropCountdownEyebrow />
          <h1 className="font-display text-h2 text-foreground mx-auto max-w-2xl font-bold text-balance">
            {t('headline')}
          </h1>
          <p className="text-muted-foreground max-w-md text-balance">{t('sub')}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
      {view.state === 'live' ? (
        <section className="flex flex-col gap-8 py-10">
          <DropLiveBanner remaining={view.remaining} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {view.products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : view.state === 'ended' ? (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <DropEndedBanner className="max-w-md justify-center" />
          <h1 className="font-display text-h2 text-foreground mx-auto max-w-2xl font-bold text-balance">
            {t('headline')}
          </h1>
          <p className="text-muted-foreground max-w-md text-balance">{t('sub')}</p>
        </section>
      ) : (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
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
              <Link
                href="/catalog"
                className="text-mustard hover:text-mustard-hover font-display font-semibold underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
              >
                {t('browseWhileWait')} →
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
