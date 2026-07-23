'use client';

import {useEffect, useRef, type PointerEvent, type ReactNode} from 'react';
import {cn} from '@/lib/utils';

// Client wrapper that tracks the pointer over ONE product card and writes its position to the CSS
// custom properties --glow-x / --glow-y. The glow itself is pure CSS (globals.css → .spotlight-card);
// this component only feeds it coordinates. See D-2.10-1 (the brand.md §5/§6 exception) and D-2.10-2
// (why the supplied 21st.dev component was rewritten rather than pasted).
//
//  • The listener is attached to THIS element only (onPointerMove) — never document or window, so a
//    grid of cards is N cheap local listeners, not N document-wide ones.
//  • Writes are throttled to one per animation frame; the pending frame is cancelled on unmount.
//  • It bails before writing anything on coarse / no-hover pointers and on any non-mouse pointer, so
//    a touch device gets no work (and the CSS @media gate means it also paints nothing there).
//  • It is decoration only: no role, no aria-*, and it is never a focus target — the focusable
//    element stays the parent <Link>.
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  // Cancel any frame still pending when the card unmounts.
  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    // Mouse + fine-pointer only — matches the CSS @media (hover: hover) and (pointer: fine) gate, so
    // touch and pen do nothing.
    if (event.pointerType !== 'mouse') return;
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return;
    }

    const {clientX, clientY} = event;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--glow-x', `${clientX - rect.left}px`);
      node.style.setProperty('--glow-y', `${clientY - rect.top}px`);
    });
  }

  return (
    <div
      ref={ref}
      className={cn('spotlight-card', className)}
      onPointerMove={handlePointerMove}
    >
      {children}
    </div>
  );
}
