'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {Countdown} from '@/components/drop/Countdown';
import {DropCountdownEyebrow, DropLiveBanner} from '@/components/drop/DropBanner';
import {ProductCard} from '@/components/product/ProductCard';
import {DEMO_PRODUCTS} from '@/lib/demo';

type Mode = '2d' | 'hour' | 'min' | 'live';

// Offsets from "now" for each preview threshold (ms).
const OFFSETS: Record<Mode, number> = {
  '2d': 2 * 86_400_000 + 3 * 3_600_000,
  hour: 59 * 60_000,
  min: 45_000,
  live: -1000,
};

// Units notionally remaining in the live drop (demo only).
const REMAINING = DEMO_PRODUCTS.filter((p) => p.stock !== 'sold-out').length + 4;

export function HomeExperience() {
  const t = useTranslations('Home');
  const [mode, setMode] = useState<Mode>('2d');
  const [target, setTarget] = useState(() => Date.now() + OFFSETS['2d']);

  const pick = (m: Mode) => {
    setMode(m);
    setTarget(Date.now() + OFFSETS[m]);
  };

  const isLive = mode === 'live';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
      {isLive ? (
        <section className="flex flex-col gap-8 py-10">
          <DropLiveBanner remaining={REMAINING} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {DEMO_PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
          <DropCountdownEyebrow />
          <Countdown target={target} onComplete={() => setMode('live')} />
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
        </section>
      )}

      {/* Preview control — mirrors the handover's demo buttons. Design-system
          pass only; real drop state is server-computed in 1.04. */}
      <PreviewSwitch mode={mode} onPick={pick} />
    </div>
  );
}

function PreviewSwitch({mode, onPick}: {mode: Mode; onPick: (m: Mode) => void}) {
  const t = useTranslations('Home');
  const items: {key: Mode; label: string}[] = [
    {key: '2d', label: t('preview2d')},
    {key: 'hour', label: t('previewHour')},
    {key: 'min', label: t('previewMin')},
    {key: 'live', label: t('previewLive')},
  ];
  return (
    <div className="mx-auto mb-10 mt-6 flex flex-col items-center gap-2">
      <span className="text-muted-foreground text-eyebrow uppercase tracking-[0.14em]">
        {t('previewLabel')}
      </span>
      <div className="border-border inline-flex flex-wrap justify-center gap-1 rounded-[var(--radius-full)] border p-1">
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            aria-pressed={mode === it.key}
            onClick={() => onPick(it.key)}
            className={cn(
              'rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              mode === it.key
                ? 'bg-surface-2 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}
