import {Rubik, Inter} from 'next/font/google';

// The two brand families (brand.md §4), shared by the locale layout and the root 404 fallback
// (src/app/not-found.tsx), which renders outside that layout and needs the same faces. Moved here from
// src/app/[locale]/layout.tsx in Y.11 — values unchanged.

// Display face — boxy, confident. Cyrillic subset requested so the build
// fails loudly if the family ever drops MK glyph coverage (brand.md §4).
export const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

// Body — neutral, tabular numerals for prices and the countdown.
export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  display: 'swap',
});
