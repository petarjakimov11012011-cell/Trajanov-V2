import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Server-only surface of the order rate limit (D-1.04-7). The pure hashing helpers live in ./hash so
// they stay unit-testable; this module re-exports them for server callers and adds the Supabase call.
export { hashIp, clientIpFromHeaders } from "./hash";

/**
 * Record an order attempt and report whether it is allowed. Delegates to the SECURITY DEFINER function
 * check_order_rate_limit() (the app's service_role has no direct write on the ledger table — D-1.03-9).
 * Returns true when under the limit (attempt recorded), false when at/over it.
 */
export async function recordAndCheckRateLimit(
  client: SupabaseClient<Database>,
  ipHash: string,
  max: number,
  windowSeconds = 600,
): Promise<boolean> {
  const { data, error } = await client.rpc("check_order_rate_limit", {
    p_ip_hash: ipHash,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) throw new Error(`rate-limit check failed: ${error.message}`);
  return data === true;
}
