// The site's canonical origin — the SINGLE place the production URL appears in the codebase (D-2.01,
// Task 6). hreflang + canonical alternates resolve against this.
//
// It is a plain constant, deliberately NOT read from a Vercel-provided variable and NOT a new env var:
// the portability rule (00_stack-and-config.md) forbids anything Vercel-specific, and hardcoding the
// known origin keeps a host migration a redeploy, not a rewrite. This one line is what the 2.05 cutover
// flipped.
//
// Host is the CANONICAL, non-redirecting origin: production serves 200 on `www.trajanovv.com`, while the
// apex `trajanovv.com` and the old `trajanov-v2.vercel.app` both 308-redirect to it — so `SITE_URL` uses
// `www` to keep every canonical / OG / JSON-LD / sitemap / hreflang / llms.txt / IndexNow URL pointing at
// a host that answers directly, not one that redirects (`D-2.05-1`, `D-2.05-6`; the brief said the apex,
// live production canonicalises on www).
export const SITE_URL = 'https://www.trajanovv.com';
