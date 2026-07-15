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
| **Database** | **Supabase (Postgres)** | CLI `2.109.1` · `supabase-js 2.110.5` — **local only** (`D-1.03-5`) | **The reason `D-0-5` works.** Atomic stock decrement — two people cannot buy the last shirt. Free tier is far beyond this scale. Schema + `create_order()`/`expire_reservations()` live in `supabase/migrations/`. |
| **Orders** | Server Actions → Supabase | `create_order()` RPC + typed clients landed 1.03; server action 1.04 | The order lands in a table Vladimir can work from, not an inbox he has to excavate. |
| **Email** | Resend | *1.07* | Order notification + customer confirmation. Free to 3,000/month — unreachable here. **A side channel, never the record.** |
| **Bot protection** | Cloudflare Turnstile | *1.04* | Free, invisible. **Not optional** — see the COD risk below. |
| **Products / drop config** | Typed files in-repo | *1.04* | No CMS (`D-0-4`). 3–5 products per drop; each drop is a small deploy. |
| **Hosting** | **Vercel Hobby** | — *(no deploy in 1.01)* | `D-0-2` — **accepted ToS violation.** See below. |
| **DNS / CDN** | Cloudflare | *2.05* | Free, fast. |
| **Analytics** | Cloudflare Web Analytics | *2.05* | Free, cookieless — **no consent banner**, which matters on a drop landing page. Answers one question: did the drop work? |
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
| `trajanov.com` | ~$12–15/year |
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
| `SUPABASE_DB_URL` | **local/test only** — Vitest DB suites (`D-1.03-12`) | `.env.local` (not a hosted var) |
| `RESEND_API_KEY` | server | Vercel |
| `ORDER_NOTIFICATION_EMAIL` | server | Vercel |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | client | Vercel |
| `TURNSTILE_SECRET_KEY` | server | Vercel |

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
