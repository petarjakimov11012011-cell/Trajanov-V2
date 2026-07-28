import type {SVGProps} from 'react';

// Instagram glyph, local — NOT a `lucide-react` import. This lucide-react ships no brand icons
// (there is no `Instagram` export; the import fails the build), and the pin stays pinned rather than
// move a dependency for one mark (D-2.24-1, superseding D-2.07-2's `@` substitution).
//
// It is a recreated outline mark on the same 24px grid as the rest of the icon set, not Meta's
// official brand asset, and it marks exactly one thing on this site: a link to the brand's own
// Instagram account (facts.md §6 — the ONE social account we have).
//
// Same call shape as a Lucide icon on purpose, so both call sites change by name only.
// `stroke="currentColor"` + `fill="none"` are load-bearing: the icon inherits its colour from the
// parent's token class exactly as `Mail`/`Phone` do. No colour value is written in this file.
export function InstagramIcon({className, strokeWidth = 2, ...props}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
