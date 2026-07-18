// The drop SCHEDULE — the switch Lazar flips (D-0-4). Times are naive Europe/Skopje wall-clock with
// NO offset; the sync resolves them DST-aware to a `timestamptz` (D-1.04-4). Product data lives in
// `products.ts`, joined by slug in `index.ts`.
//
// ── How Lazar runs a real drop ────────────────────────────────────────────────────────────────────
//   1. Add a DropSchedule here with the real start/end (Vladimir's "Friday 20:00" → "2026-08-15T20:00").
//   2. Add the matching products (with REAL prices) in products.ts.
//   3. `npm run sync:drop`. The sync refuses to publish an open/future drop that still has a null price.
// The browser never decides whether a drop is open — create_order() and the server compute that from
// these times in the DB (D-1.03-7, D-1.04-9).

import type { DropSchedule } from "./schema";

export const DROPS: readonly DropSchedule[] = [
  // ── REHEARSAL ONLY — not a real drop (D-1.08-1). ──────────────────────────────────────────────
  // Slug is `test-drop` and both products are `test-`-prefixed, so it is trivially obvious this is not
  // merchandise even though the price is now REAL (1199 MKD) and the sizes are real (products.ts). Its
  // committed window is in the PAST, so it renders as an *ended* drop and nothing is buyable by default.
  // The 1.08 gate briefly opens the window (via a transient sync) to place one real order, then closes
  // it again (Task 7 → Task 12); that transient open state is NOT committed here. To preview the
  // countdown/live states against this data without opening it, use the dev-only `?preview=` override
  // (src/lib/drop). The real, launchable first drop is 2.04/2.05.
  {
    slug: "test-drop",
    startsAt: "2026-06-06T20:00",
    endsAt: "2026-06-08T20:00",
    // rateLimitPerWindow omitted → DB default (20).
  },
];
