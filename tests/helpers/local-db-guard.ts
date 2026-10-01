// Test-DB safety guard (Phase Y.11, Task 3). The DB suites TRUNCATE tables, reset stock and backdate
// holds — they must only ever touch the LOCAL Supabase stack. `process.loadEnvFile(".env.local")` in
// tests/setup.ts never overrides a variable that is already exported, so a hosted URL left in the
// shell from an operator step would otherwise win silently. This refuses anything whose host is not
// exactly 127.0.0.1 or localhost.
//
// The error names the variable only — never the URL, which carries the database password (D-0-1).

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);

const GUARDED = ["SUPABASE_DB_URL", "NEXT_PUBLIC_SUPABASE_URL"] as const;

type GuardedEnv = Partial<Record<(typeof GUARDED)[number], string | undefined>>;

export function assertLocalDbEnv(env: GuardedEnv): void {
  for (const name of GUARDED) {
    const value = env[name];
    let host: string | null = null;
    try {
      host = value ? new URL(value).hostname : null;
    } catch {
      host = null;
    }
    if (host === null || !LOCAL_HOSTS.has(host)) {
      throw new Error(
        `Refusing to run tests: ${name} does not point at 127.0.0.1 or localhost. ` +
          `The DB suites only run against local Supabase. Unset any hosted value exported in this ` +
          `shell (e.g. \`unset ${name}\`) and make sure .env.local holds the local stack's URLs.`,
      );
    }
  }
}
