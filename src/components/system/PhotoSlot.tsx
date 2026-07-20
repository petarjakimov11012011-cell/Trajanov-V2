import {cn} from '@/lib/utils';

// Photo placeholder used until real product photography exists (D-0-6, 1.06).
// The design "works with no photo" — this is a quiet, branded empty slot, not
// a broken image. `muted` desaturates it for the sold-out card.
export function PhotoSlot({
  label,
  muted = false,
  className,
}: {
  label: string;
  muted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-surface-2 relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)]',
        muted && 'opacity-60 grayscale',
        className,
      )}
      // Faint diagonal hatch so an empty slot reads as intentional.
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-border) 60%, transparent) 0 1px, transparent 1px 14px)',
      }}
    >
      <span className="text-muted-foreground max-w-[80%] px-3 text-center font-mono text-xs leading-tight">
        {label}
      </span>
    </div>
  );
}
