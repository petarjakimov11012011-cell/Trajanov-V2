import Image from 'next/image';
import {cn} from '@/lib/utils';

// Photo placeholder used until real product photography exists (D-0-6, 1.06).
// The design "works with no photo" — this is a quiet, branded empty slot, not
// a broken image. `muted` desaturates it for the sold-out card.
//
// Y.03 (D-Y.03-5): the slot now ALSO carries a real photograph when one exists. With no `image` it
// renders exactly as before — same hatch, same label, same `aspect-[4/5]`, same `muted`. With an
// `image` it fills the SAME box with `next/image`, so a card that gains a photo shifts nothing. Most
// products still have no photograph (register #2/#8) and the placeholder branch stays the default.
//
// The whole site's first images (`next/image` was unused before this phase): local files only, no
// `images` block in `next.config.ts`, no remote host, no new dependency.

// One value serves both surfaces — they happen to compute to the same width. Catalog grid is
// `grid-cols-2 lg:grid-cols-4` in a `max-w-6xl` (1152px) container → ~280px per card at lg, ~50vw
// below. The product page's slot pair is `grid-cols-2` inside `lg:grid-cols-2`, i.e. half of 1152
// split in two → ~280px at lg, ~50vw below. Keep in step if either grid changes.
const CATALOG_SIZES = '(min-width: 1024px) 280px, 50vw';

export function PhotoSlot({
  label,
  muted = false,
  className,
  image,
}: {
  /** Placeholder text. Shown only when there is no `image`; still required, as most slots are empty. */
  label: string;
  muted?: boolean;
  className?: string;
  /** A real photograph for this slot, or null/undefined for the placeholder (the default). */
  image?: {src: string; alt: string; objectPosition?: string} | null;
}) {
  return (
    <div
      className={cn(
        'bg-surface-2 relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)]',
        // Applies to the photograph too: every product is sold-out/ended between drops, so the
        // desaturated state is the one actually on screen today.
        muted && 'opacity-60 grayscale',
        className,
      )}
      // Faint diagonal hatch so an empty slot reads as intentional. Left unconditional: a filling
      // `object-cover` image covers it, so the empty branch stays exactly as it shipped.
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-border) 60%, transparent) 0 1px, transparent 1px 14px)',
      }}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={CATALOG_SIZES}
          // No `priority`: the catalog grid is below the header and these are not LCP-critical.
          // Lighthouse mobile Performance on Catalog was 94 pre-phase and is a re-check owed to Lazar.
          className="object-cover"
          style={{objectPosition: image.objectPosition}}
        />
      ) : (
        <span className="text-muted-foreground max-w-[80%] px-3 text-center font-mono text-xs leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}
