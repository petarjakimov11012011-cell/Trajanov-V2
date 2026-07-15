import "server-only";

// Server-side Cloudflare Turnstile verification (D-1.04-8). The widget in the browser proves nothing on
// its own — THIS call, made server-side before create_order(), is what actually gates a bot. The secret
// key is server-only and never behind NEXT_PUBLIC_.
//
// Runs against Cloudflare's DOCUMENTED DUMMY KEYS until real keys arrive (1.07/2.05): the always-pass
// secret accepts the dummy token, the always-fail secret rejects it. We deliberately do NOT send the
// client IP (remoteip) — Turnstile does not need it and the project stores/transmits no raw IPs.

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  success: boolean;
  /** Cloudflare's machine-readable error codes (e.g. "timeout-or-duplicate", "invalid-input-response"). */
  errorCodes: string[];
}

/** True for codes where the right response is to re-challenge and let the customer retry (D-1.04-8). */
export function isRetryableTurnstile(codes: string[]): boolean {
  return codes.some(
    (c) => c === "timeout-or-duplicate" || c === "timeout-or-expired" || c === "internal-error",
  );
}

export async function verifyTurnstile(token: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not set");
  // A missing token never reaches Cloudflare — it is an immediate, unambiguous failure.
  if (!token) return { success: false, errorCodes: ["missing-input-response"] };

  let res: Response;
  try {
    res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
  } catch {
    // Network failure reaching Cloudflare: retryable, never a silent pass.
    return { success: false, errorCodes: ["internal-error"] };
  }
  if (!res.ok) return { success: false, errorCodes: [`http-${res.status}`] };

  const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
  return { success: data.success === true, errorCodes: data["error-codes"] ?? [] };
}
