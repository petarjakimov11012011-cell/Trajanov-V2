import { createHash } from "node:crypto";

// Pure IP-hashing helpers (D-1.04-7). Deliberately NOT server-only so they can be unit-tested directly;
// the code carries no secret (the pepper is read from a server-only env var, never NEXT_PUBLIC_), so no
// secret ships even if this module were ever bundled. The server-side rate-limit call lives in ip.ts.
//
// We NEVER store a raw IP: the repo is public, the seller is a minor, and much of the audience is 12–17.
// The IP is hashed with a server-side pepper; only the 64-char hex hash reaches the database, and without
// the pepper it is not reversible.

/** SHA-256 hex of (pepper : ip). 64 lowercase hex chars; never the raw address. */
export function hashIp(ip: string): string {
  const pepper = process.env.ORDER_IP_HASH_PEPPER;
  if (!pepper) throw new Error("ORDER_IP_HASH_PEPPER is not set");
  return createHash("sha256").update(pepper).update(":").update(ip).digest("hex");
}

/** Best-effort client IP from proxy headers (Vercel/Cloudflare set x-forwarded-for). */
export function clientIpFromHeaders(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || "0.0.0.0";
}
