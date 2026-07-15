import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';
import {INSTAGRAM_HANDLE, INSTAGRAM_URL} from '@/lib/demo';

// LIVE bar — full-width mustard, near-black text, a pulsing near-black dot,
// remaining count right-aligned and tabular. Pulse is disabled under
// prefers-reduced-motion by the global rule in globals.css.
export function DropLiveBanner({
  remaining,
  className,
}: {
  remaining: number;
  className?: string;
}) {
  const t = useTranslations('Drop');
  return (
    <div
      className={cn(
        'bg-live text-on-mustard flex w-full items-center gap-3 rounded-[var(--radius-md)] px-4 py-3',
        className,
      )}
      role="status"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="bg-on-mustard absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
        <span className="bg-on-mustard relative inline-flex h-2.5 w-2.5 rounded-full" />
      </span>
      <span className="font-display text-sm font-bold uppercase tracking-[0.08em] sm:text-base">
        {t('live')}
      </span>
      <span className="tabular ml-auto text-sm font-semibold">
        {t('remaining', {count: remaining})}
      </span>
    </div>
  );
}

// ENDED bar — quiet surface, muted text, a link back to Instagram for the next.
export function DropEndedBanner({className}: {className?: string}) {
  const t = useTranslations('Drop');
  return (
    <div
      className={cn(
        'bg-surface text-muted-foreground border-border flex w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-[var(--radius-md)] border px-4 py-3 text-sm',
        className,
      )}
      role="status"
    >
      <span className="font-display text-foreground font-semibold">{t('ended')}</span>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        className="text-mustard hover:text-mustard-hover underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:underline"
      >
        {t('endedFollow', {handle: INSTAGRAM_HANDLE})}
      </a>
    </div>
  );
}

// COUNTDOWN eyebrow used above the hero countdown.
export function DropCountdownEyebrow({className}: {className?: string}) {
  const t = useTranslations('Drop');
  return (
    <span
      className={cn(
        'text-eyebrow text-muted-foreground font-body font-medium uppercase tracking-[0.14em]',
        className,
      )}
    >
      {t('nextDrop')}
    </span>
  );
}
