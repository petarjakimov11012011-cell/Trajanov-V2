import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { assertLocalDbEnv } from "./helpers/local-db-guard";

// The test-DB safety guard (Phase Y.11, Task 3). Every DB suite TRUNCATEs, resets stock and backdates
// holds. `process.loadEnvFile` never overrides a variable that is already exported, so a hosted
// SUPABASE_DB_URL left in the shell (e.g. after a hosted operator step) would silently aim all of that
// at production. tests/setup.ts calls this guard before any suite runs; it must refuse anything that is
// not exactly 127.0.0.1 or localhost — and must never echo the URL (it carries the DB password).

const LOCAL = {
  SUPABASE_DB_URL: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
};

describe("assertLocalDbEnv", () => {
  it("accepts 127.0.0.1 for both values", () => {
    expect(() => assertLocalDbEnv(LOCAL)).not.toThrow();
  });

  it("accepts localhost for both values", () => {
    expect(() =>
      assertLocalDbEnv({
        SUPABASE_DB_URL: "postgresql://postgres:postgres@localhost:54322/postgres",
        NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321",
      }),
    ).not.toThrow();
  });

  it("refuses a hosted Postgres URL", () => {
    expect(() =>
      assertLocalDbEnv({
        ...LOCAL,
        SUPABASE_DB_URL: "postgresql://postgres.abc:secret@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
      }),
    ).toThrow(/SUPABASE_DB_URL/);
  });

  it("refuses a hosted Supabase API URL", () => {
    expect(() =>
      assertLocalDbEnv({ ...LOCAL, NEXT_PUBLIC_SUPABASE_URL: "https://abcdefgh.supabase.co" }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("refuses look-alike hosts that merely start with a local name", () => {
    for (const host of ["localhost.example.com", "127.0.0.1.nip.io", "notlocalhost"]) {
      expect(() =>
        assertLocalDbEnv({ ...LOCAL, SUPABASE_DB_URL: `postgresql://u:p@${host}:5432/postgres` }),
      ).toThrow(/SUPABASE_DB_URL/);
    }
  });

  it("refuses a missing or unparseable value", () => {
    expect(() => assertLocalDbEnv({ ...LOCAL, SUPABASE_DB_URL: undefined })).toThrow(/SUPABASE_DB_URL/);
    expect(() => assertLocalDbEnv({ ...LOCAL, NEXT_PUBLIC_SUPABASE_URL: "not a url" })).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("never echoes the URL or its password in the error", () => {
    const url = "postgresql://postgres.abc:hunter2-secret@db.example.supabase.co:5432/postgres";
    let message = "";
    try {
      assertLocalDbEnv({ ...LOCAL, SUPABASE_DB_URL: url });
    } catch (err) {
      message = (err as Error).message;
    }
    expect(message).not.toBe("");
    expect(message).not.toContain("hunter2-secret");
    expect(message).not.toContain("supabase.co");
  });

  it("is what tests/setup.ts runs on process.env before any suite", () => {
    const setup = readFileSync(resolve(__dirname, "setup.ts"), "utf8");
    expect(setup).toMatch(/assertLocalDbEnv\(process\.env\)/);
  });
});
