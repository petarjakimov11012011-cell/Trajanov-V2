// The site's canonical origin — the SINGLE place the production URL appears in the codebase (D-2.01,
// Task 6). hreflang + canonical alternates resolve against this.
//
// It is a plain constant, deliberately NOT read from a Vercel-provided variable and NOT a new env var:
// the portability rule (00_stack-and-config.md) forbids anything Vercel-specific, and hardcoding the
// known origin keeps a host migration a redeploy, not a rewrite. When the real domain is bought, this
// is a one-line change.
export const SITE_URL = 'https://trajanov-v2.vercel.app'; // TODO(2.05): trajanov.com
