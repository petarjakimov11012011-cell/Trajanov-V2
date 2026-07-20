import {ImageResponse} from 'next/og';
import {readFileSync} from 'node:fs';
import {INSTAGRAM_HANDLE} from '@/lib/social';

// Per-locale, TYPE-ONLY share card (Part 2 · Phase 2.04, Task 6). Rendered on the server with
// next/og so a link pasted into an Instagram story / Viber renders a branded 1200×630 card — the one
// traffic path that matters (Plan §10). No photo (there is none — D-1.05-4/D-0-6), no baked countdown
// (it would freeze on a static card). Content: the Trajanov wordmark + the page's `Meta` title (already
// translated + 2.02-reviewed), passed in via `?t=`; `?l=` picks the locale only to keep the URL honest.
//
// The metadata layer (src/lib/metadata.ts → pageMetadata) is the ONLY caller and it never passes a
// placeholder value (a neutral product slot like "Производ 01" is replaced with a neutral brand title
// before it reaches here), so no placeholder string is ever baked into a card (brief scope).
export const runtime = 'nodejs';

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_TITLE = 90;

// Brand tokens (brand.md §3–4). satori cannot read CSS custom properties, so the token VALUES appear
// here as literals — the same mirroring discipline globals.css already follows. If a token changes in
// brand.md, change it there first, then here (D-2.04). The Rubik Cyrillic subset is loaded below so the
// MK card renders native Cyrillic rather than tofu (brand.md §4).
const GROUND = '#0F1210'; // --color-ground
const MUSTARD = '#E2A93C'; // --color-mustard
const FOREGROUND = '#ECE8E0'; // --color-foreground
const MUTED = '#ABA79E'; // --color-muted-foreground

// Rubik 700 (--font-display), latin + cyrillic subsets. woff (satori supports woff/ttf/otf, not woff2).
// Vendored (SIL OFL) so the card needs no runtime request to Google — matches the portability rule and
// the "no runtime Google request" note in brand.md §4. `new URL(..., import.meta.url)` lets Next trace
// and emit the font files into the server bundle.
let cachedFonts: {name: string; data: Buffer; weight: 700; style: 'normal'}[] | null = null;
function rubikFonts() {
  if (!cachedFonts) {
    cachedFonts = [
      {
        name: 'Rubik',
        data: readFileSync(new URL('./rubik-latin-700.woff', import.meta.url)),
        weight: 700,
        style: 'normal',
      },
      {
        name: 'Rubik',
        data: readFileSync(new URL('./rubik-cyrillic-700.woff', import.meta.url)),
        weight: 700,
        style: 'normal',
      },
    ];
  }
  return cachedFonts;
}

export function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const locale = searchParams.get('l') === 'en' ? 'en' : 'mk';
  const rawTitle = (searchParams.get('t') ?? '').trim().slice(0, MAX_TITLE);
  // A longer title gets a smaller face so it stays on the card without overflow.
  const titleSize = rawTitle.length > 42 ? 58 : rawTitle.length > 24 ? 68 : 78;

  return new ImageResponse(
    (
      <div
        lang={locale}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: GROUND,
          padding: '80px',
          fontFamily: 'Rubik',
        }}
      >
        <div style={{display: 'flex'}}>
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: MUSTARD,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Trajanov
          </span>
        </div>

        <div style={{display: 'flex', maxWidth: '900px'}}>
          <span
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: FOREGROUND,
              lineHeight: 1.08,
            }}
          >
            {rawTitle}
          </span>
        </div>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div
            style={{
              width: 120,
              height: 5,
              backgroundColor: MUSTARD,
              marginBottom: 28,
            }}
          />
          <span style={{fontSize: 28, fontWeight: 700, color: MUTED}}>
            {INSTAGRAM_HANDLE}
          </span>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: rubikFonts(),
      headers: {
        // Public share card; safe to cache hard (keyed by the ?l/?t query).
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, immutable',
      },
    },
  );
}
