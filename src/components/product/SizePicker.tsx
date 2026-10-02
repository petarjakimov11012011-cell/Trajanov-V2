'use client';

import {useState} from 'react';
import {cn} from '@/lib/utils';
import type {SizeOption} from '@/types/drop';

// Size picker — available / selected / unavailable (1.02 handover §6).
//  • available:   1px border-strong, foreground label
//  • selected:    2px mustard, mustard label, 8%-mustard tint fill
//  • unavailable: 1px border, muted struck-through, non-interactive
//
// Controllable: pass `selected` + `onSelect` to drive it from a parent (the AddToCartPanel needs to
// know which variant is chosen). Left uncontrolled (no `onSelect`), it tracks its own selection — used
// by the styleguide. Unavailable (sold-out) sizes are never selectable (brief Task 4).
//
// `locked` (Y.11, brief decision 7): ordering is closed, so no size is selectable AND none is struck
// through — a struck size would say "sold out in this size" about a drop that is simply over. The list
// still shows which sizes the shirt comes in. Quiet border + muted label, no new token.
export function SizePicker({
  sizes,
  selected: selectedProp,
  onSelect,
  initial,
  locked = false,
  className,
}: {
  sizes: SizeOption[];
  selected?: string;
  onSelect?: (size: SizeOption) => void;
  initial?: string;
  locked?: boolean;
  className?: string;
}) {
  const [internal, setInternal] = useState<string | undefined>(initial);
  const controlled = onSelect !== undefined;
  const selected = controlled ? selectedProp : internal;

  function choose(size: SizeOption) {
    if (locked || !size.available) return;
    if (controlled) onSelect!(size);
    else setInternal(size.label);
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group">
      {sizes.map((size) => {
        const isSelected = !locked && size.available && selected === size.label;
        return (
          <button
            key={size.variantId ?? size.label}
            type="button"
            disabled={locked || !size.available}
            aria-pressed={isSelected}
            onClick={() => choose(size)}
            className={cn(
              'font-display inline-flex h-11 min-w-[3rem] items-center justify-center rounded-[var(--radius-md)] px-3 text-small font-semibold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground',
              locked && 'border-border text-muted-foreground cursor-not-allowed border',
              !locked &&
                !size.available &&
                'border-border text-muted-foreground cursor-not-allowed border line-through',
              !locked &&
                size.available &&
                !isSelected &&
                'border-border-strong text-foreground hover:border-foreground border',
              isSelected &&
                'border-mustard text-mustard bg-mustard-tint-8 border-2',
            )}
          >
            {size.label}
          </button>
        );
      })}
    </div>
  );
}
