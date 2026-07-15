'use client';

import {useState} from 'react';
import {cn} from '@/lib/utils';
import type {DemoSize} from '@/types/drop';

// Size picker — available / selected / unavailable.
//  • available:   1px border-strong, foreground label
//  • selected:    2px mustard, mustard label, 8%-mustard tint fill
//  • unavailable: 1px border, muted struck-through, non-interactive
export function SizePicker({
  sizes,
  initial,
  className,
}: {
  sizes: DemoSize[];
  initial?: string;
  className?: string;
}) {
  const [selected, setSelected] = useState<string | undefined>(initial);

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group">
      {sizes.map((size) => {
        const isSelected = size.available && selected === size.label;
        return (
          <button
            key={size.label}
            type="button"
            disabled={!size.available}
            aria-pressed={isSelected}
            onClick={() => size.available && setSelected(size.label)}
            className={cn(
              'font-display inline-flex h-11 min-w-[3rem] items-center justify-center rounded-[var(--radius-md)] px-3 text-sm font-semibold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ground',
              !size.available &&
                'border-border text-muted-foreground cursor-not-allowed border line-through',
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
