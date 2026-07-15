import { describe, it, expect } from "vitest";
import { sql } from "../helpers/db";

// A clean `supabase db reset` must produce a WORKING pg_cron schedule from scratch (DoD, D-1.04-2/3):
// the sweep every 5 minutes and the nightly run-log prune, both active.
describe("pg_cron schedule (from db reset)", () => {
  it("has both jobs scheduled and active", async () => {
    const rows = await sql<{ jobname: string; schedule: string; active: boolean }[]>`
      select jobname, schedule, active from cron.job order by jobname`;
    const byName = new Map(rows.map((r) => [r.jobname, r]));

    const sweep = byName.get("expire-reservations");
    expect(sweep, "expire-reservations job must exist").toBeDefined();
    expect(sweep?.schedule).toBe("*/5 * * * *");
    expect(sweep?.active).toBe(true);

    const prune = byName.get("prune-cron-run-details");
    expect(prune, "prune-cron-run-details job must exist").toBeDefined();
    expect(prune?.schedule).toBe("17 3 * * *");
    expect(prune?.active).toBe(true);
  });
});
