import { fileURLToPath } from "node:url";
import { assertLocalDbEnv } from "./helpers/local-db-guard";

// Load local Supabase credentials into process.env for the DB/RLS suites. `.env.local` is written by
// `supabase start` (gitignored) and holds the shared-default local keys — never real secrets.
// Node 24 ships process.loadEnvFile; no dotenv dependency needed.
const envPath = fileURLToPath(new URL("../.env.local", import.meta.url));
try {
  process.loadEnvFile(envPath);
} catch {
  throw new Error(
    `Could not load ${envPath}. Run \`supabase start\` (Docker/Colima must be up) and ensure .env.local exists.`,
  );
}

for (const name of [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_DB_URL",
]) {
  if (!process.env[name]) {
    throw new Error(`Missing ${name}. These tests require a running local Supabase stack.`);
  }
}

// Local only (Y.11, Task 3). loadEnvFile above does not override an exported variable, so a hosted URL
// left in the shell would otherwise reach every DB suite. Refuse to run instead.
assertLocalDbEnv(process.env);
