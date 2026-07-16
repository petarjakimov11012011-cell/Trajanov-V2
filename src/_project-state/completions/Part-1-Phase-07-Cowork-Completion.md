# Part 1 · Phase 07 · Cowork — Completion Report
**Date:** 2026-07-16 · **Outcome (one line):** the store's production accounts now exist — a Vercel project, a hosted Supabase database in Frankfurt, and a live Cloudflare Turnstile widget — with all six environment variables set in Vercel, so the Code half can deploy.

> **No secret, key, or password appears in this report.** Each one is named by *where it lives*, never by value. The only key shown is the Turnstile **site** key, which is public by design.

## 1. What shipped (plain language)

The store can now move off one laptop. Three free accounts were created under the operator identity (the same account that owns the GitHub repo): a **Vercel** project that will serve the site, a **hosted Supabase** database in the EU (Frankfurt) that will hold every order, and a real **Cloudflare Turnstile** bot-check. The six settings the code needs (database address + keys, Turnstile keys, and a security "pepper") are entered into Vercel for Production and Preview. Nothing secret was written into the public code repository. Order-notification email (Resend) was intentionally left out — that's Phase 1.08.

## 2. Definition of Done

- ✅ **Vercel Hobby project exists, linked to `petarjakimov11012011-cell/Trajanov-V2`, production branch `main`; URL recorded** — evidence: project **trajanov-v2**, live at **https://trajanov-v2.vercel.app** (the `/en` path loads), Hobby tier, owner `petar-jakimov-projects`.
- ✅ **Hosted Supabase project in EU (Frankfurt / `eu-central-1`); URL, anon key, service-role key, DB connection string captured** — evidence: project **trajanov-v2**, ref **`kmuocwmevyyuhcvwoebf`**, region **Central EU (Frankfurt)**, status Healthy, Project URL **https://kmuocwmevyyuhcvwoebf.supabase.co**. Legacy `anon` + `service_role` keys captured into Vercel; DB password saved by the operator to their password manager; connection string retrievable from Supabase → **Connect**. **Postgres 17.6.1.141 (major 17) — matches local (17).**
- ✅ **Real Cloudflare Turnstile widget; site + secret keys captured; hostnames include the Vercel URL and `localhost`** — evidence: widget **"Trajanov store"**, mode **Managed**, hostnames **`trajanov-v2.vercel.app`** and **`localhost`**, account `d0f258213ae61683d8ddf5998024bdaa`. Site key `0x4AAAAAAD23OFW7Ka1hTR1F` (public); secret key placed in Vercel and re-viewable in the widget settings.
- ✅ **All six env vars set in Vercel (Production + Preview); no Resend/email var** — evidence: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `ORDER_IP_HASH_PEPPER` — all six listed on the project's Environment Variables page, each scoped **Production and Preview**, each marked **Sensitive**. `RESEND_API_KEY` and `ORDER_NOTIFICATION_EMAIL` were **not** set.
- ✅ **No secret written to any repo file** — evidence: nothing was committed. Secrets live only in the Vercel dashboard (Sensitive vars), the Cloudflare/Supabase dashboards, and the operator's password manager.
- ✅ **Credentials handed to Code via a secure channel for an untracked `.env.local`** — evidence: see the separate ops handoff note. Vercel holds the six production vars; for local work Code pulls the same values from Supabase (URL + legacy keys), Cloudflare (Turnstile keys), and the operator's password manager (DB password + pepper). Nothing transited the repo.
- ✅ **Accounts under operator identities; transfer note recorded** — all three accounts are the operator's (`petarjakimov11012011@gmail.com` / `petar-jakimov-projects`), matching the GitHub repo owner. **Transfer note:** before real trading, ownership of Vercel, Supabase, and Cloudflare (plus the password-manager entries) must be transferred to Vladimir/parents.

## 3. Decisions I made during this phase

1. **Used the LEGACY Supabase `anon` / `service_role` JWT keys, not the new `sb_publishable…` / `sb_secret…` keys** · the code was built and tested against the legacy keys, the local Supabase CLI only supports legacy keys, and the env-var names (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) map to them · alternative: adopt the new keys (would diverge from what was tested and risks the hosted-parity check) · **needs a decision-log entry: YES.**
2. **Turnstile widget mode = Managed** · the brief said "match the mode used locally with the dummy test keys," but the local `.env.local` isn't visible to Cowork; Managed is Cloudflare's recommended default and mode is dashboard-changeable without changing the keys · alternative: guess Invisible/Non-interactive (same risk, no upside) · **Code should confirm this matches local behaviour and switch if needed** · needs a decision-log entry: YES.
3. **Left Supabase creation-time Security toggles at their defaults** (Enable Data API = on; Automatically expose new tables = on; automatic RLS = off) · the migrations set RLS and grants explicitly (catalog read-only, `orders`/`order_items` deny-all), so the real security comes from the migrations, and defaults keep the project standard for the migrations that were tested locally · alternative: disable "auto-expose" (Supabase's own suggestion) — deferred to avoid diverging from the tested setup · **Code should confirm after migrations that `orders`/`order_items` are not reachable by the anon key** · needs a decision-log entry: YES.
4. **All six Vercel env vars marked "Sensitive"** (the Vercel UI default) · sensitive vars can't be re-viewed in the dashboard, but the `NEXT_PUBLIC_` ones are still inlined at build, so no functional impact · alternative: un-mark the public ones (cosmetic only) · needs a decision-log entry: no.
5. **Turnstile hostnames cover the production host + `localhost` only** · Vercel **preview** deployments use different random `*.vercel.app` subdomains that this widget will **not** accept · if Turnstile needs to pass on preview URLs, add those hostnames or add `vercel.app` (covers all subdomains, small security trade-off) · needs a decision-log entry: no (flag only).

## 4. Deviations from the brief / spec

- **Region correction.** The Supabase project was first created in **`eu-north-1` (Stockholm)** instead of the specified **`eu-central-1` (Frankfurt)**. Surfaced to the operator, who chose to recreate in Frankfurt. The **new Frankfurt project is the live one**; the **old Stockholm project still exists and must be deleted by the operator** (Cowork does not perform permanent data deletion). The Stockholm project is empty (no migrations, no orders), so nothing is lost.
- **A second Vercel project, `trajanov` (trajanov.vercel.app), exists in the account** alongside `trajanov-v2`. It was not created or touched this phase. Flagged for the operator to review — it may be a stray/duplicate that should be removed to avoid two projects on one repo.
- **DB password not captured by Cowork.** Reading the generated master DB password was correctly blocked; the operator copied it into their password manager instead. This is the intended handling, not a gap.

## 5. Changed files / deliverables

Ops/manual phase — **no repo files changed, nothing committed.** What was created and where it lives:

| Artifact | Where it lives | Value in repo? |
|---|---|---|
| Vercel project `trajanov-v2` (+ 6 env vars) | Vercel dashboard, `petar-jakimov-projects` | No |
| Hosted Supabase project `trajanov-v2` | Supabase dashboard, ref `kmuocwmevyyuhcvwoebf`, `eu-central-1` | No |
| Turnstile widget "Trajanov store" | Cloudflare dashboard, account `d0f258213ae61683d8ddf5998024bdaa` | No |
| Supabase legacy anon key, service_role key | Vercel (Sensitive) + Supabase dashboard | No |
| Turnstile site + secret keys | Vercel (Sensitive) + Cloudflare widget settings | No |
| `ORDER_IP_HASH_PEPPER` (fresh `openssl rand -hex 32`) | Vercel (Sensitive) + operator's password manager | No |
| Supabase DB password | Operator's password manager | No |

Deliverables of this report: this completion report + a short **ops handoff note** (`Ops-Handoff-Phase-1.07.md`). Suggested repo home for this report: `src/_project-state/completions/Part-1-Phase-07-Cowork-Completion.md` (operator to commit — Cowork does not push).

## 6. State updates done (code phases)

N/A — ops phase. The live state files (`current-state.md` etc.) are updated by the **Code** half when it links the repo, pushes the database, deploys, and verifies. This phase records the facts Code needs (below) so it can update those files accurately.

## 7. Risks, follow-ups, what the next phase needs to know

- **Operator to do (3 items):** (a) **delete the old Stockholm Supabase project**; (b) **review/remove the stray `trajanov` Vercel project**; (c) **confirm the pepper and DB password are saved** in the password manager (both are non-recoverable if lost — the pepper must stay identical across all future redeploys or order rate-limiting breaks).
- **This phase lets Code close owed-verification items #4 (hosted-Supabase parity) and #5 (real Turnstile keys).** Encouraging sign for #4: hosted Postgres major is **17**, same as local.
- **Turnstile secret is real now** — the Cloudflare **dummy test keys must never reach production**; Code should confirm the deployed build uses the real keys from Vercel.
- **Vercel Hobby ToS risk (`D-0-2`) is now live-relevant** — commercial use on Hobby may be pulled during a spike (drop day). Unchanged by this phase; noted for awareness.
- **A redeploy is required** for the env vars to take effect — that's the Code half's job (Cowork did not redeploy).

## 8. What's now possible that wasn't before

Code can link the repo to these accounts, push the schema to the Frankfurt database, and deploy the store to a public URL.
