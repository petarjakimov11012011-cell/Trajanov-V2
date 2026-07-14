# Decisions — Trajanov-V2

Append-only. One decision per entry. Never edit or delete a past entry — if a decision is
reversed, change **only** the old entry's Status to `Superseded by D-<id>` and add a new entry.

**ID scheme: `D-<phase>-<n>`** — phase-namespaced, assigned by the executor within its own phase
(e.g. `D-1.04-2`). IDs cannot collide across branches by construction. Kickoff decisions made
before any phase existed use phase `0`.

> **House note (2026-07-14):** the `logging-project-decisions` skill specifies sequential `D-001`
> IDs, which contradicts Master Prompt v2 and the `writing-agents-md-files` skill, both of which
> specify phase-namespaced IDs. This project follows **Master Prompt v2**. The skill appears stale
> and should be reconciled at house level — not a Trajanov job.

---

### D-0-1 · 2026-07-14 · Public GitHub repository
- **Status:** Accepted
- **Context:** Repo visibility had to be set before scaffold. This is a client's store with a live
  order pipeline.
- **Decision:** Public. `github.com/petarjakimov11012011-cell/Trajanov-V2`.
- **Alternatives considered:** Private — recommended by the orchestrator twice, on the grounds that
  it costs nothing and removes an entire class of mistake (one committed key in a public repo is
  scraped before you notice). Rejected by Lazar, who wants it public.
- **Consequences:** Accepted risk. Mitigated by a hard rule in `CLAUDE.md`: **no secret is ever
  committed** — all keys and Vladimir's email live in environment variables set in the hosting and
  Supabase dashboards, never in a file. If a secret is ever committed, it is compromised
  permanently and must be rotated, not deleted. Reversible in one click with no rework.
- **Links:** `CLAUDE.md` · Phase 1.01

### D-0-2 · 2026-07-14 · Host on Vercel Hobby (free), accepting the ToS violation
- **Status:** Accepted
- **Context:** Hosting had to be chosen before scaffold. Vercel's Fair Use Guidelines restrict
  Hobby to non-commercial personal use and define commercial usage as any deployment used for the
  financial gain of **anyone involved in any part of the production of the project, including a
  paid employee or consultant writing the code** — and give "any method of requesting or processing
  payment from visitors of the site" as an example. This project is caught twice: Lazar and Petar
  are paid to build it, and it takes cash-on-delivery orders. Vercel further reserves the right to
  disable or remove a Hobby deployment **with or without notice, for any reason or no reason**,
  explicitly including performance problems and traffic spikes.
- **Decision:** Deploy on Vercel Hobby anyway. Move to Pro later if needed.
- **Alternatives considered:**
  - **Netlify free** — recommended by the orchestrator. Permits commercial use, no violation,
    also $0, ~100 GB bandwidth and ~125k function requests/month (far beyond a 40-shirt drop).
    Rejected by Lazar.
  - **Vercel Pro ($20/mo)** — above-board, best Next.js DX. Rejected as too costly pre-revenue.
- **Consequences:** Accepted risk, Lazar's call, made with full knowledge after the orchestrator
  made the case twice and verified the terms against Vercel's live documentation. **The risk is
  concentrated on drop day** — a countdown that funnels every visitor into the same sixty seconds
  is exactly the traffic-spike condition the termination clause describes, and the remedy is a
  silent takedown at the only moment that matters. Enforcement is known to be inconsistent, so the
  likely outcome is nothing; the tail outcome is the site dark mid-drop. Also: on Hobby, Vercel may
  use repo content for AI model training and share it with third parties (low cost here — the repo
  is public by `D-0-1`).
  **Mitigations, all in the Plan:**
  1. No Vercel-specific services (no Vercel Postgres/Blob/KV) — data lives in Supabase, DNS in
     Cloudflare. Any migration is a redeploy, not a rebuild.
  2. "Migrate to Vercel Pro" is a pre-written, ready-to-run phase in Part 2, executable same-day.
  3. Risk carried on the register in `current-state.md` so it stays visible.
  4. Drop-day contingency (what Vladimir posts, and where, if the site is pulled) written in
     Phase 2.06.
- **Links:** `src/_project-state/00_stack-and-config.md` · Phase 2.06 · Vercel Fair Use Guidelines

### D-0-3 · 2026-07-14 · Waive the GitHub Action review gate — Trajanov-V2 only
- **Status:** Accepted
- **Context:** Master Prompt v2 makes the Claude Code GitHub Action the project's review gate and
  makes it a **hard gate on the end of Part 1**, justified by "I am a solo operator and cannot
  review my own PRs." Lazar instructed: no CodeRabbit, no GitHub review, on this project.
- **Decision:** No automated PR review on Trajanov-V2. **Explicit, project-scoped exception to
  Master Prompt v2.** The Master Prompt file is unchanged and remains binding on every other
  project. Phase 1.01's Definition of Done drops the Action install; Part 1's hard gate is removed.
- **Alternatives considered:** Update the Master Prompt itself — rejected, Lazar wants this scoped
  to Trajanov only. Keep the Action — rejected by Lazar.
- **Consequences:** The unreviewed-PR risk lands hardest on **Phases 1.03 and 1.04** — atomic stock
  decrement and reservation expiry. Concurrency bugs do not appear in manual testing, because one
  person cannot click twice at once; they appear when twelve people hit the last shirt in the same
  second, on drop day, in public. This is precisely the class of bug a review gate catches.
  **The Master Prompt's own justification does not apply here — this project has two operators,
  not one.** Replacement gate, agreed 2026-07-14:
  1. **Petar reviews Lazar's PRs and vice versa.** Neither writes code, so this catches wrong page,
     missing copy, broken link — real value, but not race conditions.
  2. **Phases 1.03 and 1.04 only: a fresh Claude Code session reviews the PR against the brief
     before merge** — separate session, no memory of having written it. Honestly a downgrade on a
     real review gate; it is the piece that has a chance of catching the concurrency bug.
  3. **Phases 1.03 and 1.04 Definition of Done requires a concurrent-order test**: simulate 10
     simultaneous orders against 3 units of stock, prove exactly 3 succeed and 7 are cleanly
     rejected. Automated, committed, and re-run in Phase 1.08. **This is the actual protection and
     the cheapest item on the list.**
- **Links:** Master Prompt v2 (§ "How a phase runs", § "Project folder conventions") · Phases 1.01,
  1.03, 1.04, 1.08 · `CLAUDE.md`

### D-0-4 · 2026-07-14 · No CMS — products and drop config live in the repo
- **Status:** Accepted
- **Context:** Drops are scheduled by Vladimir but built by Lazar and Petar; Vladimir does not
  self-serve. 3–5 products per drop.
- **Decision:** No CMS. Products, prices, stock levels and drop timing live in typed config files
  in the repo. Each drop is a small deploy.
- **Alternatives considered:** A headless CMS (Sanity/Contentful) so Vladimir could run drops
  himself — rejected: weeks of build for something used monthly by someone who has not asked for
  it. Rebuilding as a CMS later is a named phase, not a launch problem.
- **Consequences:** Every drop needs a courier trip through the orchestrator and Claude Code.
  Nobody changes a price or a photo without a deploy. Correct at this cadence and catalogue size;
  wrong if Vladimir ever wants to self-serve, at which point revisit.
- **Links:** `Trajanov-V2-Plan.md` § Drop engine · Phase 1.03

### D-0-5 · 2026-07-14 · Real server-side stock (Supabase), not email-only ordering
- **Status:** Accepted
- **Context:** Lazar's initial model was an order form emailing Vladimir, who ships. But stock is
  limited and can sell out mid-drop. Email cannot decrement stock: if 5 shirts exist and 12 people
  order, all 12 are confirmed and 7 get an apology — on a hyped countdown drop, which is *designed*
  to create that rush.
- **Decision:** Option A. Orders write to Supabase Postgres. Stock decrements atomically. Sold out
  is enforced server-side and true. Vladimir still gets his email **and** gets a real order list.
- **Alternatives considered:** Option B, email-only with manual reconciliation — simpler, one less
  moving part, survivable at small volume. Rejected: it makes "SOLD OUT" a lie updated by hand, and
  if scarcity is not real and enforced, the entire drop mechanic is theatre.
- **Consequences:** Adds roughly one phase (1.03) plus the reservation work in 1.04. Free at this
  scale. Introduces the concurrency-bug risk that `D-0-3`'s replacement gate exists to catch.
- **Links:** Phases 1.03, 1.04, 1.08

### D-0-6 · 2026-07-14 · No AI-generated product photography
- **Status:** Accepted
- **Context:** Product shots on a neutral background do not exist and gate the Catalog and Product
  phases. Lazar proposed "either Vladimir will, or we will make AI photos."
- **Decision:** Vladimir shoots real product photos. **AI-generated product imagery is prohibited
  on this project.** Retouching real photos (background removal, exposure, crop) is fine.
- **Alternatives considered:** AI-generated product images — rejected by the orchestrator and
  accepted by Lazar. A generated image of a garment depicts a thing that does not exist; on
  cash-on-delivery the customer pays for what they saw, and any drift in print placement, colour,
  or fit is selling one thing and shipping another — to real people, under a minor's name, with a
  consumer-protection exposure and no upside. Commercially self-defeating too: the design *is* the
  product, and it won a national competition.
- **Consequences:** Vladimir owes roughly one hour per drop — neutral wall, daylight, front/back/
  print detail/on-body, phone is fine. **This is the critical path for Phase 1.06.** If the photos
  do not exist, the Catalog and Product pages ship with visible placeholders and cannot cut over.
- **Links:** `facts.md` § 8 · Phases 1.06, 2.05

### D-0-7 · 2026-07-14 · Add product detail page, checkout, and legal pages to the sitemap
- **Status:** Accepted
- **Context:** Lazar's page list at intake was Home, Contact, Catalog, About, Cart. The stated
  business outcome is people buying clothes.
- **Decision:** Add **Product/[slug]**, **Checkout**, and legal pages (Terms, Privacy, Shipping &
  Returns). Orchestrator-level call, not owner-level.
- **Alternatives considered:** Ship the list as given — rejected: there is no route from a catalogue
  to an order without a product page and a checkout, so the site could not perform its one job.
- **Consequences:** Scope is larger than Lazar first described. Non-negotiable given the goal.
- **Links:** `Trajanov-V2-Plan.md` § Information architecture

### D-0-8 · 2026-07-14 · Two-part project shape, MK-default bilingual, quality bar
- **Status:** Accepted
- **Context:** Defaults offered at intake and not objected to.
- **Decision:** Two parts (Part 1 build → Part 2 integrate + verify + cut over). Lighthouse 95+ on
  desktop and mobile. WCAG 2.2 AA. Macedonian is the default language, English parallel at
  `/en/`; both indexed.
- **Alternatives considered:** Three parts — rejected, this project is too small. EN dropped from
  launch — rejected: press reach and diaspora arrive in English even though shipping is MK-only,
  and native review capacity exists in-house.
- **Consequences:** EN pages must state plainly that shipping is North Macedonia only, or English
  visitors will reach checkout and be disappointed. Native MK review is scheduled as Phase 2.02,
  not left as a post-launch wish.
- **Links:** `Trajanov-V2-Phase-Plan.md`

### D-1.01-1 · 2026-07-14 · shadcn default style is Base UI (`base-nova`), not Radix
- **Status:** Accepted
- **Context:** `00_stack-and-config.md` records the UI-primitives choice as "shadcn/ui (Radix)". The
  current `shadcn` CLI (4.13.0) initialises with the `base-nova` style, which is built on
  `@base-ui/react` (1.6.0), not Radix. The brief says "leave Tailwind on shadcn defaults."
- **Decision:** Keep the shadcn default. Primitives come from Base UI, not Radix.
- **Alternatives considered:** Force an older Radix-based shadcn style — rejected: it fights the
  tool's current default, contradicts "leave on shadcn defaults," and Base UI (from a comparable
  team) satisfies the same rationale — accessible dialogs/selects toward WCAG 2.2 AA, code you own.
- **Consequences:** The stack doc's "(Radix)" parenthetical is now historically inaccurate. The
  `Choice` column was left verbatim (canonical doc); the reality is recorded in that file's change
  log and here. No component depends on Radix-specific APIs yet — none are generated this phase.
- **Links:** `src/_project-state/00_stack-and-config.md` · `components.json`

### D-1.01-2 · 2026-07-14 · i18n request handler in `proxy.ts`, not `middleware.ts`
- **Status:** Accepted
- **Context:** next-intl's docs place `createMiddleware` in `src/middleware.ts`. Next.js 16 emits a
  deprecation warning for the `middleware` file convention and directs projects to `proxy`.
- **Decision:** Use `src/proxy.ts` (same default export + `matcher`), avoiding the deprecation
  warning on a brand-new scaffold.
- **Alternatives considered:** Keep `middleware.ts` to match next-intl docs verbatim — rejected:
  ships a deprecated convention on day one. Verified at runtime that routing works: `/`→MK,
  `/en`→EN, `/mk`→307→`/`.
- **Consequences:** The file name diverges from next-intl's documentation; a future reader following
  those docs must know the handler lives in `proxy.ts` here.
- **Links:** `src/proxy.ts` · https://nextjs.org/docs/messages/middleware-to-proxy

### D-1.01-3 · 2026-07-14 · `localePrefix: 'as-needed'` — MK at `/`, EN at `/en/`
- **Status:** Accepted
- **Context:** The brief specifies "mk default, en at `/en/`", implying the default locale has no URL
  prefix. next-intl defaults to `'always'` (which would serve MK at `/mk/`).
- **Decision:** `localePrefix: 'as-needed'` in `src/i18n/routing.ts`. MK (default) serves at `/`;
  EN at `/en/`; `/mk` redirects to `/`.
- **Alternatives considered:** Default `'always'` prefixing — rejected: puts MK at `/mk/`, which
  contradicts "en at `/en/`" (i.e. MK unprefixed).
- **Consequences:** `/` is the canonical MK URL. Canonical tags and hreflang must reflect this;
  that is Phase 2.01 work, flagged there.
- **Links:** `src/i18n/routing.ts`

### D-1.01-4 · 2026-07-14 · npm package name `trajanov-v2` (dir has capitals)
- **Status:** Accepted
- **Context:** `create-next-app` derives the package name from the target directory basename. The
  project path is `…/Trajanov-V2`; npm rejects capital letters in a package name, so scaffolding
  directly into the project root failed.
- **Decision:** Scaffold into a temporary lowercase subfolder (`trajanov-v2`), move all generated
  files up to the project root (same filesystem — instant), and keep the package name `trajanov-v2`.
- **Alternatives considered:** Rename the project directory to lowercase — rejected: the path is
  fixed by the brief and CLAUDE.md. Hand-edit package.json name after scaffolding — same result,
  no benefit.
- **Consequences:** `package.json` `name` differs in case from the repo/folder name (`Trajanov-V2`).
  Cosmetic; no runtime effect.
- **Links:** `package.json`

### D-1.01-5 · 2026-07-14 · Saved this phase's brief into `briefs/`
- **Status:** Accepted
- **Context:** The brief states phase briefs are "saved by Lazar" into `briefs/`. If left unsaved,
  the reserved `briefs/` folder is empty (needs a `.gitkeep`) and the completion report's `Brief`
  reference (`briefs/Part-1-Phase-01-Code.md`) dangles.
- **Decision:** Save a faithful copy of the Phase 1.01 brief to `briefs/Part-1-Phase-01-Code.md`.
- **Alternatives considered:** Leave `briefs/` empty with a `.gitkeep` — rejected: a dangling
  report reference and an empty reserved folder are worse than a working-copy brief.
- **Consequences:** My copy may differ subtly from Lazar's canonical brief. Lazar should overwrite
  it with the authoritative file if they diverge.
- **Links:** `briefs/Part-1-Phase-01-Code.md`

### D-1.01-6 · 2026-07-14 · Stripped scaffolder defaults not in the reserved tree
- **Status:** Accepted
- **Context:** `create-next-app` adds `AGENTS.md`; `shadcn init -d` generates a default
  `src/components/ui/button.tsx`; the Next template ships demo SVGs in `public/`. None are in
  `file-map.md`, and the brief says "generate no components this phase."
- **Decision:** Remove `AGENTS.md` (CLAUDE.md is this repo's agent-rules source), the default
  `button.tsx`, and the unused demo SVGs (`next/vercel/file/globe/window.svg`).
- **Alternatives considered:** Keep them — rejected: they deviate from the reserved tree and, for
  `button.tsx`, violate "generate no components." `AGENTS.md` alongside `CLAUDE.md` invites
  confusion over which rules bind.
- **Consequences:** The on-disk tree matches `file-map.md` more closely. Any future need for an
  `AGENTS.md` or a `button` component is a one-command regeneration.
- **Links:** `file-map.md` · `CLAUDE.md`
