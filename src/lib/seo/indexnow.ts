import 'server-only';
import {SITE_URL} from '@/lib/site';

// IndexNow (Phase 2.04b Task 4). IndexNow lets a site tell Bing / Yandex "these URLs changed — recrawl
// now" instead of waiting for the next scheduled crawl. Ownership is proven by serving the key as a
// plain text file at the site root (public/<key>.txt), which is how the protocol works.
//
// THE KEY IS PUBLIC BY DESIGN. It is NOT a secret under `D-0-1`: it proves ownership precisely BY being
// fetchable by anyone at /<key>.txt. Committing it and printing it in the completion report is correct;
// it is not a credential, grants no access, and never needs rotating like a real secret.
export const INDEXNOW_KEY = '78dec4b97e3fbb0f22d1c8df38050f74';

// Host + key file are both derived from SITE_URL, so the cutover (2.05, flipping SITE_URL to the real
// domain) carries them across with no edit here.
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

export interface PingIndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
}

/**
 * POST a batch of changed URLs to IndexNow so Bing/Yandex recrawl them immediately.
 *
 * NOT WIRED YET, AND DELIBERATELY SO. Pinging IndexNow before the real domain is live is meaningless —
 * you can only submit URLs on the host you have proven you own, and today that host is a temporary
 * `*.vercel.app` preview (SITE_URL). This helper is exported and documented for a POST-2.05 hook (e.g.
 * fire it from `scripts/sync-drop.ts` after a drop's products change, or from a revalidation webhook)
 * once SITE_URL points at trajanov.com and the key is registered in Bing Webmaster Tools.
 *
 * Best-effort: it never throws — a dead endpoint or a network error resolves to `{ok:false}` — because
 * a search-ping failing must never break whatever real operation triggered it (mirrors the order-email
 * side-channel rule, `D-0-5`). All `urls` must be absolute URLs on SITE_URL's host.
 */
export async function pingIndexNow(urls: string[]): Promise<PingIndexNowResult> {
  if (urls.length === 0) return {ok: false, status: 0, submitted: 0};
  const host = new URL(SITE_URL).host;
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({host, key: INDEXNOW_KEY, keyLocation, urlList: urls}),
    });
    return {ok: res.ok, status: res.status, submitted: urls.length};
  } catch {
    return {ok: false, status: 0, submitted: urls.length};
  }
}
