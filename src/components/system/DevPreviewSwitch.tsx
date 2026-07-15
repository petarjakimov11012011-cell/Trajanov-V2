import {cn} from '@/lib/utils';
import type {DropState} from '@/types/drop';

// DEV-ONLY drop-state preview switch. Renders NOTHING in production.
//
// It replaces the 1.02 home "preview states" switcher, which faked drop state client-side — exactly the
// thing this phase removes (the browser is no longer the source of truth, D-1.04-9). Here the links just
// carry a `?preview=` query the SERVER reads (and refuses in production, src/lib/drop), so all three
// states remain reviewable against the one committed ended/null-priced rehearsal drop without a re-sync.
export function DevPreviewSwitch({current}: {current?: DropState}) {
  if (process.env.NODE_ENV === 'production') return null;

  const states: DropState[] = ['countdown', 'live', 'ended'];
  const pill =
    'rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring';

  return (
    <div className="mx-auto mb-10 mt-2 flex flex-col items-center gap-2">
      <span className="text-muted-foreground text-eyebrow uppercase tracking-[0.14em]">
        preview · dev only
      </span>
      <div className="border-border inline-flex flex-wrap justify-center gap-1 rounded-[var(--radius-full)] border p-1">
        {states.map((s) => (
          <a
            key={s}
            href={`?preview=${s}`}
            aria-current={current === s}
            className={cn(
              pill,
              current === s
                ? 'bg-surface-2 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {s}
          </a>
        ))}
        <a
          href="?preview="
          aria-current={current === undefined}
          className={cn(
            pill,
            current === undefined
              ? 'bg-surface-2 text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          real
        </a>
      </div>
    </div>
  );
}
