import postgres from "postgres";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../src/types/database";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name} (run \`supabase start\` + populate .env.local)`);
  return v;
}

/**
 * Direct Postgres admin connection — TEST-ONLY. Used to ARRANGE state (reset stock, backdate a hold,
 * clear orders) and to ASSERT, WITHOUT granting service_role direct table writes. It is deliberately
 * NOT how the application ever mutates stock; production writes go through the SECURITY DEFINER RPCs.
 */
export const sql = postgres(env("SUPABASE_DB_URL"), { max: 15 });

/** Anon client — mimics the browser. Only the public catalog is reachable (RLS). */
export function anonClient(): SupabaseClient<Database> {
  return createClient<Database>(env("NEXT_PUBLIC_SUPABASE_URL"), env("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Service-role client — mimics the server. The only role permitted to call create_order(). */
export function serviceClient(): SupabaseClient<Database> {
  return createClient<Database>(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getVariantId(productSlug: string, size: string): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    select v.id from variants v join products p on p.id = v.product_id
    where p.slug = ${productSlug} and v.size = ${size}`;
  if (!rows[0]) throw new Error(`variant not found: ${productSlug}/${size}`);
  return rows[0].id;
}

export async function setStock(productSlug: string, size: string, stock: number): Promise<void> {
  await sql`update variants set stock = ${stock}
    from products p where variants.product_id = p.id and p.slug = ${productSlug} and variants.size = ${size}`;
}

export async function getStock(productSlug: string, size: string): Promise<number> {
  const rows = await sql<{ stock: number }[]>`
    select v.stock from variants v join products p on p.id = v.product_id
    where p.slug = ${productSlug} and v.size = ${size}`;
  return rows[0].stock;
}

export async function clearOrders(): Promise<void> {
  await sql`truncate table order_items, orders`;
}

export async function countOrders(): Promise<number> {
  const rows = await sql<{ c: number }[]>`select count(*)::int as c from orders`;
  return rows[0].c;
}

export async function sumOrderItemQty(): Promise<number> {
  const rows = await sql<{ q: number }[]>`select coalesce(sum(quantity), 0)::int as q from order_items`;
  return rows[0].q;
}
