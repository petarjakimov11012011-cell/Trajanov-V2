'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';

function breakdown(ms: number) {
  const totalSec = Math.floor(Math.max(0, ms) / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    totalSec,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

function Cell({
  value,
  label,
  accent,
  known,
}: {
  value: string;
  label: string;
  accent: boolean;
  known: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Fixed 2ch width + tabular figures = zero layout shift on any digit change. */}
      <span
        suppressHydrationWarning
        className={cn(
          'text-countdown tabular block min-w-[2ch] text-center font-extrabold transition-colors duration-[var(--motion-fast)]',
          accent ? 'text-accent' : 'text-foreground',
          !known && 'opacity-30',
        )}
      >
        {value}
      </span>
      <span className="text-eyebrow text-muted-foreground font-body font-medium uppercase tracking-[0.14em]">
        {label}
      </span>
    </div>
  );
}

function Colon({accent}: {accent: boolean}) {
  return (
    <span
      aria-hidden
      className={cn(
        'text-countdown font-extrabold leading-none',
        // nudge the colon onto the digits' optical centre
        'translate-y-[0.12em] self-start',
        accent ? 'text-accent' : 'text-border-strong',
      )}
    >
      :
    </span>
  );
}

/**
 * The loudest object on the site. Ticks to `target` (epoch ms).
 *  - >1h:   foreground digits
 *  - <1h:   seconds cell turns accent (urgency begins)
 *  - <1min: the whole time turns accent + a 1px accent underline
 *  - 0:     calls `onComplete` so the parent swaps in the LIVE banner
 * No flip/spinner — digits update as values, so reduced motion needs nothing
 * special. Fixed-width cells guarantee no reflow across the thresholds.
 */
export function Countdown({
  target,
  offsetMs,
  serverNowMs,
  onComplete,
  className,
}: {
  /** Absolute deadline (epoch ms). Provide this OR `offsetMs`. */
  target?: number;
  /** Deadline as ms-from-mount; resolved to an absolute target on the client. */
  offsetMs?: number;
  /** The server's "now" (epoch ms) captured when the page rendered. When given, the countdown is
   *  anchored to the server clock — a device with a wrong clock still counts down correctly (Task 4). */
  serverNowMs?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const t = useTranslations('Drop');
  const [remaining, setRemaining] = useState<number | null>(null);

  // Resolve the deadline on the client only — never call Date.now() in render.
  // Absolute `target` wins; otherwise `offsetMs` is measured from mount. If a server "now" is supplied,
  // measure the skew between it and the device clock at mount and subtract it on every tick, so the
  // remaining time tracks the SERVER's clock rather than the (possibly wrong) device clock.
  useEffect(() => {
    const clientMountNow = Date.now();
    const skew = serverNowMs !== undefined ? clientMountNow - serverNowMs : 0;
    const deadline = target ?? clientMountNow + (offsetMs ?? 0);
    const update = () => setRemaining(Math.max(0, deadline - (Date.now() - skew)));
    update();
    const id = setInterval(update, 250);
    return () => clearInterval(id);
  }, [target, offsetMs, serverNowMs]);

  useEffect(() => {
    if (remaining !== null && remaining <= 0) onComplete?.();
  }, [remaining, onComplete]);

  const known = remaining !== null;
  const {days, hours, minutes, seconds, totalSec} = breakdown(remaining ?? 0);
  const underHour = known && totalSec > 0 && totalSec < 3600;
  const underMin = known && totalSec > 0 && totalSec < 60;

  return (
    <div
      role="timer"
      aria-label={
        known
          ? `${days} ${t('days')} ${hours} ${t('hours')} ${minutes} ${t('minutes')} ${seconds} ${t('seconds')}`
          : undefined
      }
      className={cn('font-display inline-flex flex-col items-center', className)}
    >
      <div
        className={cn(
          'flex items-start justify-center gap-3 pb-2 sm:gap-4',
          underMin &&
            'border-accent border-b-[1px] transition-colors duration-[var(--motion-fast)]',
        )}
      >
        <Cell value={pad(days)} label={t('days')} accent={underMin} known={known} />
        <Colon accent={underMin} />
        <Cell value={pad(hours)} label={t('hours')} accent={underMin} known={known} />
        <Colon accent={underMin} />
        <Cell value={pad(minutes)} label={t('minutes')} accent={underMin} known={known} />
        <Colon accent={underMin} />
        <Cell
          value={pad(seconds)}
          label={t('seconds')}
          accent={underHour}
          known={known}
        />
      </div>
    </div>
  );
}
