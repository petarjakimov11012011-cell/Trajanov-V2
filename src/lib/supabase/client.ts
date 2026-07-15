import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser Supabase client (anon key).
 *
 * The anon key is public by design and ships to every browser. It can do only what RLS + grants
 * allow: read the public catalog (drops / products / variants). It CANNOT read orders or order_items
 * and CANNOT call create_order() — see the RLS migration. Never put a secret behind NEXT_PUBLIC_.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
