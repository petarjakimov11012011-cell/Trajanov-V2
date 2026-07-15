'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {ShieldCheck} from 'lucide-react';
import {cn} from '@/lib/utils';

// Turnstile slot for the one-screen checkout. The real Cloudflare Turnstile
// widget is wired in Phase 1.04; this is its placement + resolving state.
// While "resolving", the place-order button stays disabled and a mustard
// spinner + "verifying" shows. Reduced motion → static ring (global rule).
export function TurnstilePlaceholder({
  onResolved,
  className,
}: {
  onResolved?: (resolved: boolean) => void;
  className?: string;
}) {
  const t = useTranslations('Checkout');
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setResolved(true);
      onResolved?.(true);
    }, 2200);
    return () => clearTimeout(id);
  }, [onResolved]);

  return (
    <div
      className={cn(
        'border-border bg-surface flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3',
        className,
      )}
      aria-live="polite"
    >
      {resolved ? (
        <>
          <ShieldCheck className="text-mustard h-5 w-5" strokeWidth={1.75} aria-hidden />
          <span className="text-foreground text-sm font-medium">{t('botCheck')}</span>
        </>
      ) : (
        <>
          <span
            className="border-mustard h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
            aria-hidden
          />
          <span className="text-muted-foreground text-sm">{t('verifying')}…</span>
        </>
      )}
    </div>
  );
}
