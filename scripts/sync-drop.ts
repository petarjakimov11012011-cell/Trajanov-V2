// `npm run sync:drop` — reads src/config/ and writes the drops/products/variants into Supabase.
//
// Run this after editing drops.ts / products.ts (the operator step in the "how Lazar runs a drop" note
// in drops.ts). It is idempotent and safe to re-run; it will REFUSE, loudly and without writing, to
// publish a priceless open/future drop or to change a live drop's price (see sync-core.ts). Stock on an
// existing variant is never overwritten (D-1.04-5).
//
// Connection: SUPABASE_DB_URL (a direct Postgres admin URL). Locally this is the shared-default local
// value in .env.local; for hosted Supabase (1.07) the operator exports the project's Postgres URL.

import postgres from "postgres";
import { getConfiguredDrops } from "../src/config/index";
import { syncDrops, SyncRefusedError } from "./sync-core";

async function main(): Promise<void> {
  // Prefer an already-exported SUPABASE_DB_URL (e.g. a hosted operator's shell); only fall back to the
  // local .env.local so a hosted run is never silently redirected at the local database.
  if (!process.env.SUPABASE_DB_URL) {
    try {
      process.loadEnvFile(".env.local");
    } catch {
      // no .env.local — fine as long as SUPABASE_DB_URL is exported some other way (checked next).
    }
  }

  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error(
      "✗ SUPABASE_DB_URL is not set. Run `supabase start` (local) or export the hosted Postgres URL.",
    );
    process.exit(1);
  }

  const sql = postgres(dbUrl, { max: 4 });
  try {
    const drops = getConfiguredDrops();
    console.log(`Syncing ${drops.length} drop(s): ${drops.map((d) => d.slug).join(", ")}`);
    const report = await syncDrops(sql, drops);

    console.log("✓ Sync complete.");
    console.log(`  drops upserted     : ${report.dropsUpserted}`);
    console.log(`  products inserted  : ${report.productsInserted}`);
    console.log(`  products updated   : ${report.productsUpdated}`);
    console.log(`  variants inserted  : ${report.variantsInserted}`);
    console.log(`  variants untouched : ${report.variantsUntouched}  (stock never overwritten — D-1.04-5)`);
    console.log(`  rows deleted       : ${report.rowsDeleted}`);
    if (report.deletionsSkippedWithOrders.length > 0) {
      console.log(
        `  kept (has orders)  : ${report.deletionsSkippedWithOrders.join(", ")}  (never deleted — D-1.04-5)`,
      );
    }
  } catch (err) {
    if (err instanceof SyncRefusedError) {
      console.error("✗ Sync refused — nothing was written:");
      for (const reason of err.reasons) console.error(`  - ${reason}`);
    } else {
      console.error("✗ Sync failed:", err instanceof Error ? err.message : err);
    }
    await sql.end();
    process.exit(1);
  }
  await sql.end();
}

void main();
