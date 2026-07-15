import {cn} from '@/lib/utils';

// Renders an owed fact as a visible, deliberate `[PLACEHOLDER: …]` marker.
// Never invent a fact — ship this and log it in the placeholder register.
// Styled so it reads as intentional, not broken (brand.md / CLAUDE.md).
export function Placeholder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-muted-foreground bg-surface-2 border-border inline-flex items-center rounded-[var(--radius-sm)] border border-dashed px-2 py-0.5 font-mono text-[0.7rem] leading-tight tracking-tight',
        className,
      )}
      data-placeholder
    >
      {children}
    </span>
  );
}
