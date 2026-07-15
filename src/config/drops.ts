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
  // ── REHEARSAL ONLY — not a real drop (Task 1). ────────────────────────────────────────────────
  // Slug is `test-drop` and every product is `test-`-prefixed and priced null, so it is trivially
  // obvious this is not merchandise. Its window is in the PAST, so it renders as an *ended* drop and
  // the sync's null-price preflight allows it (an ended drop can never be ordered — D-1.04-6). To see
  // the countdown and live states against this same data, use the dev-only `?preview=` override
  // (src/lib/drop) — a null-priced drop cannot legitimately be published open or future.
  {
    slug: "test-drop",
    startsAt: "2026-06-06T20:00",
    endsAt: "2026-06-08T20:00",
    // rateLimitPerWindow omitted → DB default (20).
  },
];
