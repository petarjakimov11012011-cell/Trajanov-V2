import type {MetadataRoute} from 'next';
import mk from '@/messages/mk.json';

// Web app manifest (Phase 2.04b Task 3) — served at /manifest.webmanifest; Next auto-injects the
// <link rel="manifest">. Makes the site installable and gives Android/Chrome a real icon set.
//
// Colours are brand.md §3 token VALUES mirrored as literals (a manifest is JSON — it cannot read a CSS
// custom property; same discipline as src/app/globals.css / src/app/og, D-2.04-2 / D-2.04b). The brand
// is dark-only ("there is no light mode", brand.md §2), so both theme and background are the ground.
//
// `lang: 'mk'` — Macedonian is the default language (D-0-8), so since Y.11 (Task 11) the description is
// the MK home description read from the catalog (`Meta.homeDescription`) rather than an English
// one-liner under a Macedonian `lang`. Facts-clean: oversized unisex t-shirts, Strumica, 3 to 5 products
// per drop, cash on delivery (facts.md §1/§7). Icons are the "T" monogram (public/icon-{192,512}.png)
// generated from the Rubik wordmark.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trajanov',
    short_name: 'Trajanov',
    description: mk.Meta.homeDescription,
    lang: 'mk',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F1210', // --color-ground
    theme_color: '#0F1210', // --color-ground
    icons: [
      {src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
      {src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
      // The monogram sits on a padded ground square (safe zone respected), so it doubles as maskable.
      {src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
    ],
  };
}
