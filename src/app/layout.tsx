import type {ReactNode} from 'react';

// Pass-through root layout (Phase Y.11, Task 9). The real document — <html lang>, fonts, header,
// footer, messages — is `[locale]/layout.tsx`. This file exists only because a root `not-found.tsx`
// (the fallback for a URL that never reaches a locale) needs a root layout above it; it renders
// nothing of its own. The pattern next-intl documents for a top-level `[locale]` segment.
export default function RootLayout({children}: {children: ReactNode}) {
  return children;
}
