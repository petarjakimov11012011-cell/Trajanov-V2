import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { sql, serviceClient } from "../helpers/db";
import { hashIp } from "../../src/lib/rate-limit/hash";

// IP rate limit (D-1.04-7): the Nth attempt is allowed while count < max; the (max+1)th is rejected. And
// what is stored is a peppered HASH, never the raw IP.
const RAW_IP = "203.0.113.7"; // TEST-NET-3, a documentation address
const MAX = 20;

let ipHash: string;

beforeAll(async () => {
  ipHash = hashIp(RAW_IP);
  await sql`delete from order_attempts where ip_hash = ${ipHash}`;
});
afterAll(async () => {
  await sql`delete from order_attempts where ip_hash = ${ipHash}`;
});

describe("order rate limit", () => {
  it("hashes the IP — the stored value is a 64-char hex hash, not the address", () => {
    expect(ipHash).toMatch(/^[0-9a-f]{64}$/);
    expect(ipHash).not.toBe(RAW_IP);
    expect(ipHash).not.toContain(RAW_IP);
  });

  it("permits the first 20 attempts and rejects the 21st in the window", async () => {
    const supabase = serviceClient();

    for (let i = 1; i <= MAX; i++) {
      const { data, error } = await supabase.rpc("check_order_rate_limit", {
        p_ip_hash: ipHash,
        p_max: MAX,
        p_window_seconds: 600,
      });
      expect(error).toBeNull();
      expect(data, `attempt ${i} should be allowed`).toBe(true);
    }

    const { data: over } = await supabase.rpc("check_order_rate_limit", {
      p_ip_hash: ipHash,
      p_max: MAX,
      p_window_seconds: 600,
    });
    expect(over, "the 21st attempt must be rejected").toBe(false);
  });

  it("stored exactly the 20 allowed attempts, each as the hash (the rejected one is not recorded)", async () => {
    const rows = await sql<{ ip_hash: string }[]>`
      select ip_hash from order_attempts where ip_hash = ${ipHash}`;
    expect(rows.length).toBe(MAX);
    for (const r of rows) {
      expect(r.ip_hash).toBe(ipHash);
      expect(r.ip_hash).not.toBe(RAW_IP);
    }
  });
});
