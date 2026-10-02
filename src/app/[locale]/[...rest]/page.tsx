import {notFound} from 'next/navigation';

// Catch-all for any path under a locale that matches no route (Phase Y.11, Task 9). The middleware
// already put the visitor in a locale (`/nema-takva` → mk, `/en/nope` → en), so calling notFound()
// here renders that locale's branded `not-found.tsx` inside the locale layout, with HTTP 404 — instead
// of Next's bare English default. Explicit routes always win over a catch-all, so nothing real is
// shadowed.
export default function CatchAll(): never {
  notFound();
}
