// Assembles the drop schedule (drops.ts) + catalogue (products.ts) into full DropConfig objects, and
// re-exports the config surface the sync and tests consume. This module is plain data + pure helpers —
// it is imported by the Node sync script and by Vitest, NOT by the Next.js app (the app reads drop
// state from the DB, never from config — D-1.04-9).

import { DROPS } from "./drops";
import { PRODUCTS } from "./products";
import type { DropConfig } from "./schema";

export * from "./schema";
export { resolveWallClockToUtc, DROP_TIMEZONE, isWallClock } from "./time";

/**
 * The configured drops, each schedule joined to its products by slug. Throws if a scheduled drop has no
 * product list — a wiring mistake that should never reach the sync silently.
 */
export function getConfiguredDrops(): DropConfig[] {
  return DROPS.map((schedule) => {
    const products = PRODUCTS[schedule.slug];
    if (!products) {
      throw new Error(
        `Drop "${schedule.slug}" is scheduled in drops.ts but has no entry in products.ts.`,
      );
    }
    return { ...schedule, products };
  });
}
