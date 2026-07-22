# Stack & config — Trajanov-V2

**Canonical source for the stack, pinned versions, and config.** Append-only log. Nothing else
restates this table — everything links here.

**Read before adding any dependency.** A dependency not recorded here does not exist.

Seeded 2026-07-14 at kickoff. **Versions pin in Phase 1.01** — the `Pinned` column is empty until
Code fills it with what actually installed.

---

## The stack

| Layer | Choice | Pinned | Why this fits |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `16.2.10` | Drop state and stock must be computed server-side — the browser cannot be trusted with either. SEO for a brand nobody has searched for. Bilingual routing built in. |
| **Language** | TypeScript | `5.9.3` | Catches "string passed where a stock count goes" before a customer does. |
| **Styling** | Tailwind CSS | `4.3.2` | Fast; trivial to keep tied to `brand.md` tokens. |
| **UI primitives** | shadcn/ui (Radix) | `shadcn 4.13.0` · `@base-ui/react 1.6.0` | Accessible dialogs/selects toward WCAG 2.2 AA for free. You own the code — no dependency to fight. **Default style is now Base UI (`base-nova`), not Radix — see change log & `D-1.01-1`.** |
| **Animation** | Motion | `12.42.2` | The countdown and the drop reveal are the product. |
| **Icons** | Lucide | `lucide-react 1.24.0` | MIT. Pairs with shadcn. |
| **i18n** | next-intl | `4.13.2` | MK/EN with real indexed URLs. |
| **Database** | **Supabase (Postgres)** | **`1.07`** — CLI `2.109.1` · `supabase-js 2.110.5` · **hosted: Frankfurt `eu-central-1`, ref `kmuocwmevyyuhcvwoebf`, Postgres 17** (= local major). Supersedes "local only" (`D-1.03-5` closed). | **The reason `D-0-5` works.** Atomic stock decrement — two people cannot buy the last shirt. Free tier is far beyond this scale. Schema + `create_order()`/`expire_reservations()` live in `supabase/migrations/`. |
| **Orders** | Server Actions → Supabase | `create_order()` RPC + typed clients landed 1.03; server action 1.04 | The order lands in a table Vladimir can work from, not an inbox he has to excavate. |
| **Email** | Resend | **`Z.01`** — **BUILT.** SDK **`resend 6.17.2`** (added this phase). Server-side order-notification sender in `src/lib/email/order-notification.ts`, fired best-effort after `create_order()` (`D-Z.01-5`). Supersedes the "not built, no code" note. Real delivery to Vladimir's inbox is **owed to 1.08** (needs the live keys + a live priced drop). | Order notification only (**no customer email** — `D-Z.01-1`). **From `info@trajanovv.com` as of the 2.05 cutover (`D-2.05-3`)** — a domain address, verified in Resend in the same account that holds `RESEND_API_KEY`; Cloudflare Email Routing forwards it to Vladimir's inbox. Was `onboarding@resend.dev` through 1.08 (`D-Z.01-2`, superseded). Free to 3,000/month — unreachable here. **A side channel, never the record** (Plan §8, `D-0-5`). |
| **Bot protection** | Cloudflare Turnstile | **`1.07`** — widget "Trajanov store", **Managed** mode (`D-1.07-2`); **real** site/secret keys live in production, superseding the 1.04 dummy keys (`D-1.04-8`). **`2.05`: new Managed widget in the Vertexcons Cloudflare account, hostnames `trajanovv.com` + `www.trajanovv.com`; both Turnstile env vars rotated + redeployed; site key now `0x4AAAAAAD6pSIvEa1p8GkZX` (`D-2.05-4`; old `0x4AAAAAAD23OFW7Ka1hTR1F` retired).** Server-side `verifyTurnstile` checks `success` only — **does not assert hostname**, so no code allowlist. | Free, invisible. **Not optional** — see the COD risk below. |
| **Products / drop config** | Typed files in-repo | *1.04* | No CMS (`D-0-4`). 3–5 products per drop; each drop is a small deploy. |
| **Hosting** | **Vercel Hobby** | **`1.07`** — project `trajanov-v2`, `main` = production, `https://trajanov-v2.vercel.app`. **`2.05`: custom domain `www.trajanovv.com` attached (via Cloudflare DNS) — now the served + canonical host; `SITE_URL` points at it; the apex + the vercel.app URL 308-redirect to it.** | `D-0-2` — **accepted ToS violation.** See below. |
| **DNS / CDN** | Cloudflare | **`2.05` — LIVE** | Cloudflare DNS points `trajanovv.com` (+ `www`) at the Vercel project (HTTPS valid); Email Routing forwards `info@` → Vladimir. Free, fast. |
| **Analytics** | Cloudflare Web Analytics | **`2.05` — DEFERRED (`D-2.05-5`)** | No beacon shipped at cutover; add when the token is available (before the 2.06 rehearsal) — no drop traffic to measure yet. Free, cookieless — **no consent banner**. |
| **Legal pages** | Hand-written | *2.03* | A generator produces American SaaS boilerplate about a Macedonian teenager's t-shirts. Worse than nothing — it looks like diligence. |

## Deliberately absent

| Not using | Why |
|---|---|
| **Payment processor** (Stripe et al.) | Cash on delivery. Also impossible: no registered entity, and a minor cannot hold a merchant account. |
| **CMS** | `D-0-4`. Drops are built by the operators, not self-served. |
| **CRM, AI features, review platform** | Not asked for. Nothing to feed them. |
| **Vercel Postgres / Blob / KV** | **Portability rule — see below.** |

---

## The portability rule (mitigates `D-0-2`)

**Nothing Vercel-specific. Ever.** Data lives in Supabase, DNS in Cloudflare, assets in the repo.

Vercel Hobby prohibits commercial use and reserves the right to pull the deployment **without
notice, for any reason** — explicitly including traffic spikes, which is precisely what a countdown
drop manufactures. That risk was accepted by Lazar with full knowledge (`D-0-2`). This rule is what
keeps the accepted risk cheap: **any host migration is a redeploy, not a rebuild.**

Adding a Vercel-native service would silently convert a one-afternoon migration into a rewrite, at
the exact moment there is no time for one. **Enforced in `CLAUDE.md`.** If a phase brief ever seems
to require one, that is an error — escalate to the orchestrator.

Pre-written escape hatch: **Phase X.01, migrate to Vercel Pro** — ready to run same-day.

---

## Cost

| Item | Cost |
|---|---|
| `trajanovv.com` (double-v) — **PURCHASED 2026-07-21** | ~$12–15/year |
| Supabase | Free |
| Resend | Free |
| Cloudflare (DNS, Turnstile, Analytics) | Free |
| Vercel Hobby | Free (`D-0-2`) |
| **Total** | **~$13/year** |

If a free tier is ever outgrown, that is a decision entry and a phase — never a silent upgrade.

---

## Environment variables

**The repo is public (`D-0-1`). No value below ever appears in a file.** Names only, here and in
`.env.example`. Values live in the Vercel and Supabase dashboards.

| Name | Used by | Set in |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only — never expose** | Vercel |
| `SUPABASE_DB_URL` | **local/admin only** — Vitest DB suites (`D-1.03-12`), `npm run sync:drop`, `supabase db push`. Carries the **DB password** — it is the master key to every order. | `.env.local` / `.env.hosted` (both gitignored). **NEVER set in Vercel** — the app never opens a direct Postgres connection; a `SUPABASE_DB_URL` in Vercel would be a standing credential the runtime has no use for. |
| `RESEND_API_KEY` | server — read by the Z.01 sender; **never** `NEXT_PUBLIC_`. Unset → order still succeeds, warning logged, no PII (`D-Z.01-5`) | Vercel (operator prereq; live-value verify owed to 1.08) |
| `ORDER_NOTIFICATION_EMAIL` | server — the notification recipient (Vladimir), read by the Z.01 sender. The literal address **never** appears in the repo (`D-Z.01-3`) | Vercel (operator prereq; live-value verify owed to 1.08) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | client | Vercel |
| `TURNSTILE_SECRET_KEY` | **server only — never expose** | Vercel |
| `ORDER_IP_HASH_PEPPER` | **server only — never expose** — peppers the order rate-limit IP hash (`D-1.04-7`) | Vercel |

**A committed secret is compromised on landing. Rotate it — deleting the commit does not help.**
Anything prefixed `NEXT_PUBLIC_` is visible to every visitor by design; never put a secret behind
that prefix.

---

## Change log

Append. Never rewrite.

| Date | Phase | Change | By |
|---|---|---|---|
| 2026-07-14 | — | Seeded at kickoff from the locked stack. No versions pinned yet. | Claude Chat |
| 2026-07-14 | 1.01 | Scaffolded. Pinned: `next 16.2.10`, `react/react-dom 19.2.4`, `typescript 5.9.3`, `tailwindcss 4.3.2` + `@tailwindcss/postcss 4.3.2`, `shadcn 4.13.0`, `motion 12.42.2`, `lucide-react 1.24.0`, `next-intl 4.13.2`. shadcn support deps: `@base-ui/react 1.6.0`, `class-variance-authority 0.7.1`, `clsx 2.1.1`, `tailwind-merge 3.6.0`, `tw-animate-css 1.4.0`. **Toolchain: Node `v24.17.0`, npm `11.13.0`.** | Claude Code |
| 2026-07-14 | 1.01 | **shadcn default style is now `base-nova`, built on `@base-ui/react`, not Radix** — the "(Radix)" note in the stack table is historical. Kept the default per brief. See `D-1.01-1`. | Claude Code |
| 2026-07-15 | 1.02 | **No new npm deps.** Fonts **Rubik** (display) + **Inter** (body) added via `next/font/google` (self-hosted at build, `cyrillic` subset) — SIL OFL, commercial web use OK; no runtime Google request (portability + privacy). `brand.md` filled and wired into `globals.css` as a **dark-only** theme (shadcn semantic vars remapped onto brand tokens; no light mode). See `D-1.02-1/2/3`. | Claude Code |
| 2026-07-15 | 1.03 | **Data layer (local only, no deploy — `D-1.03-5`).** Toolchain added: **Supabase CLI `2.109.1`** (Homebrew), local Docker via **Colima `0.10.3`** + **Lima `2.1.4`** + **docker CLI `29.6.1`** instead of Docker Desktop (`D-1.03-8`; server: Docker `29.5.2`, Ubuntu 24.04). npm deps: **`@supabase/supabase-js 2.110.5`** (runtime), **`server-only 0.0.1`** (runtime — makes `server.ts` a build error in client code), **`vitest 4.1.10`** + **`postgres 3.4.9`** (dev — DB integration tests, `D-1.03-12`). New scripts: `test` = `vitest run`; `gen:types` = `supabase gen types typescript --local > src/types/database.ts`. `supabase init` created `supabase/config.toml`; **trimmed for an 8 GB host** — `studio/realtime/storage/local_smtp/edge_runtime/analytics` disabled, `db/api/auth` kept (`D-1.03-10`). New env names (values in gitignored `.env.local`): `SUPABASE_DB_URL` (local/test-only). `major_version = 17` (local Postgres). Known: 2 moderate `npm audit` advisories in `postcss@8.4.31` (transitive via `next@16.2.10`, build-time; pre-existing, not introduced here; "fix" downgrades Next to 9.3.3 — not applied). | Claude Code |
| 2026-07-15 | 1.04 | **Drop engine (local only, no deploy).** npm dep added: **`tsx` (dev)** — runs the TS config→DB sync (`D-1.04-15`; native Node TS type-stripping needs `.ts` import extensions the repo doesn't use). New script: `sync:drop` = `tsx scripts/sync-drop.ts`. New env names (values in gitignored `.env.local`, real values in the dashboard at 1.07): `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (Cloudflare **dummy test keys** locally — `D-1.04-8`), `ORDER_IP_HASH_PEPPER` (server-only, `D-1.04-7`). DB: **`pg_cron` extension enabled in a migration** (`D-1.04-2`) — two jobs (`expire-reservations` `*/5 * * * *`, `prune-cron-run-details` `17 3 * * *`); `products.price_mkd`/`name_mk`/`name_en` made **nullable** (`D-1.04-6`/`10`); `drops.rate_limit_per_window` column; `order_attempts` table + `check_order_rate_limit()` function. **No Vercel-specific dependency, config, or service added** (portability rule intact). Turnstile loads Cloudflare's `api.js` (Cloudflare, not Vercel). Known: `npm audit` advisories unchanged from 1.03 (build-time postcss, pre-existing). | Claude Code |
| 2026-07-16 | 1.07 (Cowork) | **Production accounts provisioned — ops half, no code, nothing committed.** Corrects the **Hosting** `Pinned` note "*(no deploy in 1.01)*" (`D-1.06-4`): a **Vercel Hobby** project (`trajanov-v2`, `main` = production, `https://trajanov-v2.vercel.app`) now exists — **not yet deployed/verified**; redeploy + schema push owed to the 1.07 Code half. **Hosted Supabase** created in **Frankfurt** (`eu-central-1`, ref `kmuocwmevyyuhcvwoebf`, Postgres major **17** = local); using the **legacy** `anon`/`service_role` keys, not the new `sb_*` keys (`D-1.07-1`). Real **Cloudflare Turnstile** widget live ("Trajanov store", **Managed** mode, `D-1.07-2`) — supersedes the dummy test keys for production (real-key behaviour unverified until the Code half redeploys). **Six env vars set in Vercel** (Production + Preview, Sensitive; values in dashboard, none in repo): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `ORDER_IP_HASH_PEPPER`. **Resend deferred to 1.08** — `RESEND_API_KEY` + `ORDER_NOTIFICATION_EMAIL` deliberately **not** set (the Email row's "*1.07*" Pinned note is thus superseded → **1.08**). No new npm dep, no config file changed, portability rule intact. See `completions/Part-1-Phase-07-Cowork-Completion.md`, `D-1.07-1/2/3`. | Claude Code (records 1.07 Cowork) |
| 2026-07-18 | Z.01 | **Order email built.** New npm dep: **`resend 6.17.2`** (runtime) — the only new dependency; adds 5 transitive packages, **no new `npm audit` advisory** (the 2 moderate postcss advisories are unchanged, pre-existing via `next`). New file `src/lib/email/order-notification.ts` (composer + best-effort sender). The **Email** row above moves to BUILT and both env-var rows (`RESEND_API_KEY`, `ORDER_NOTIFICATION_EMAIL`) are updated. No config file changed; portability rule intact (Resend is a third-party API, not Vercel-native). `create_order`/`expire_reservations`/`supabase/migrations/` untouched. See `D-Z.01-1…7`, `completions/Part-1-Phase-Z01-Code-Completion.md`. | Claude Code |
| 2026-07-19 | 2.01 (Code) | **Bilingual — NO new dependency.** One new npm script: `i18n:inventory` = `tsx scripts/i18n-inventory.ts` (regenerates `docs/i18n/string-inventory.md`; pure file IO, no DB, no env). `src/i18n/routing.ts` now carries a `pathnames` map and `next.config.ts` a `redirects()` table — both are next-intl/Next config already installed, not new deps. `SITE_URL` origin is a **plain constant** in `src/lib/site.ts` (`TODO(2.05): trajanov.com`), **not** a Vercel var and **not** a new env var (portability rule intact). `package.json` runtime dependencies unchanged; `npm audit` advisories unchanged (pre-existing build-time postcss). No `config.toml`/Tailwind/ESLint/tsconfig change. | Claude Code |
| 2026-07-16 | 1.07 (Code) | **Pinned-column corrections + Resend struck.** Three `Pinned` cells were **wrong or stale**; corrected in place (the table is a live field — this change-log row is the history, per `D-1.06-4`). (1) **Hosting** read "*(no deploy in 1.01)*" — an absence recorded as if it were a pin; **it never deployed in 1.01**, and 1.07 is the first real deploy → pinned **`1.07`**. (2) **Database** read "**local only** (`D-1.03-5`)" → pinned **`1.07`**, hosted Frankfurt `eu-central-1` ref `kmuocwmevyyuhcvwoebf`, Postgres 17; `D-1.03-5` closed. (3) **Bot protection** read "*1.04*" → pinned **`1.07`**, real Turnstile keys superseding the 1.04 dummies (`D-1.04-8`). (4) **Email** read "*1.07*" → **`Z.01`** (`D-1.07-8`) — Resend is struck from 1.07 entirely, so the Cowork row's "→ 1.08" is itself superseded; no account, no key, no code. (5) **`SUPABASE_DB_URL`** row strengthened: it was already present (contrary to the 1.07 brief, which asserted it was missing) but only said "not a hosted var" — now states explicitly that it carries the DB password and must **never** be set in Vercel. **Why this matters:** a `Pinned` cell is what a future phase trusts to know whether a thing is real; "1.01" against a deploy that never happened is how `D-1.06-4` got missed for six phases. **No dependency, config, or version changed this phase** — `package.json` untouched; the only new file is a gitignored `.env.hosted` (`D-1.07-9`). | Claude Code |
| 2026-07-22 | 2.04b (Code) | **SEO/GEO polish — NO new dependency.** One new npm script: `assets:brand` = `tsx scripts/generate-brand-assets.ts` (regenerates the brand marks; run by hand, **not** in the build). The brand PNGs + the embedded-font `logo.svg` are rendered by **`next/og`** (satori + resvg — already shipped with `next 16.2.10`, the same engine the 2.04 OG cards use) from the Rubik woff already vendored at `src/app/og/`, so **no image toolchain (`sharp`/`canvas`) was added** (`D-2.04b-5`). New non-code assets under `public/` + `src/app/` (logo, icons, manifest, IndexNow key file). `src/lib/seo/indexnow.ts` references the external `api.indexnow.org` endpoint but is **wired to nothing** (`D-2.04b-6`) — no runtime call, no Vercel-native anything (portability rule intact). The IndexNow key is **public by design, not a secret (`D-0-1`)**. `SITE_URL` unchanged; `package.json` runtime deps unchanged; `npm audit` advisories unchanged (pre-existing build-time postcss). No `config.toml`/Tailwind/ESLint/tsconfig change. | Claude Code |
| 2026-07-22 | 2.05 (Code) | **Cutover — NO new dependency.** `SITE_URL` (`src/lib/site.ts`) flipped `https://trajanov-v2.vercel.app` → **`https://www.trajanovv.com`** (the canonical 200-serving host — apex + vercel.app 308→www, `D-2.05-6`); it stays a **plain constant**, not a Vercel var (portability rule intact). **Domain `trajanovv.com` (double-v) purchased + live** (Cloudflare DNS → the `trajanov-v2` Vercel project, valid HTTPS; `D-2.05-1`). **`info@trajanovv.com`** wired as the order-email from-address (`ORDER_FROM_ADDRESS`) — a domain address via **Cloudflare Email Routing → Vladimir** + **domain verified in Resend** (same account as `RESEND_API_KEY`), so it delivers (`D-2.05-3`); also published on Contact. **Turnstile keys rotated** to a **new Managed widget** (Vertexcons Cloudflare account, hostnames `trajanovv.com` + `www`), both env vars updated in Vercel + redeployed; site key `0x4AAAAAAD6pSIvEa1p8GkZX` (`D-2.05-4`, old `0x4AAAAAAD23OFW7Ka1hTR1F` retired) — **secret in Vercel only, never in the repo**. **Cloudflare Web Analytics deferred** (`D-2.05-5`) — no beacon shipped. `package.json` runtime deps unchanged; **no new npm dependency**; no `config.toml`/Tailwind/ESLint/tsconfig change; `create_order`/`expire_reservations`/`supabase/migrations/` untouched. See `D-2.05-1…7`, `completions/Part-2-Phase-05-Completion.md`. | Claude Code |
