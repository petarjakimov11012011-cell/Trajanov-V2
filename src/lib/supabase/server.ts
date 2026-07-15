import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-only Supabase client (service_role key).
 *
 * `import "server-only"` above makes importing this module from a client component a BUILD ERROR —
 * the guard is enforced by the bundler, not by convention. The service_role key bypasses RLS and
 * must never reach the browser; it is never placed behind a NEXT_PUBLIC_ prefix.
 *
 * This is the only client allowed to call create_order() / expire_reservations() — EXECUTE on those
 * functions is granted to service_role alone. Used from server actions (behind Turnstile, 1.04).
 */
export function createServiceRoleClient(): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
