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

### D-1.02-1 · 2026-07-15 · brand.md tokens derived from the handover ledger (no filled brand.md delivered)
- **Status:** Accepted
- **Context:** The Phase 1.02 handover names a filled companion `brand.md` and
  `Trajanov Mockups.dc.html` as the source of the real token values. **Neither was delivered** — the
  repo held only the seed `brand.md` (all `TBD-1.02`) and the handover prose + its contrast ledger.
  Petar (operator) instructed: fill `brand.md` myself rather than wait.
- **Decision:** Derive the whole palette from the handover's contrast ledger + the garment colours
  (near-black ground, mustard/ochre, off-white, print red), verify **every pair** against WCAG 2.2
  AA with a computed check (all pass; forbidden pairs confirmed < AA), and write the values into
  `brand.md` as the source of truth.
- **Alternatives considered:** Block and wait for the design companion files — rejected by the
  operator (they don't exist). Eyeball hexes from memory — rejected: `brand.md` §3 forbids it and
  contrast would be unverified.
- **Consequences:** The exact colours and fonts are my reconstruction, not a pasted Lazar/Claude
  Design-approved artifact. **Lazar should eyeball the rendered site and adjust** — a token tweak in
  `brand.md` propagates everywhere. Ratios match the handover ledger, so the relationships are safe.
- **Links:** `brand.md` · `docs/design-handovers/Part-1-Phase-02-Handover.md`

### D-1.02-2 · 2026-07-15 · Type: Rubik (display) + Inter (body), self-hosted via next/font
- **Status:** Accepted
- **Context:** `brand.md` §4 requires two families with well-drawn Cyrillic (MK is default),
  commercial-use licence, tabular numerals for the countdown, and a "boxy, confident" display voice.
- **Decision:** Display = **Rubik** (600/700/800), Body = **Inter** (400/500/600). Both SIL OFL,
  both self-hosted at build by `next/font/google` with the `cyrillic` subset requested (so the build
  fails loudly if MK coverage is ever dropped). Cyrillic checked at display size in-browser
  (ѓ ќ љ њ џ ѕ ж ч ш render native, not fallback).
- **Alternatives considered:** A single family for tightness — rejected: display/body contrast helps
  hierarchy. A more distinctive display face (Unbounded/Oswald) — rejected: Rubik's boxy skeleton
  matches "boxy, unfussy" and its Cyrillic is unambiguous; Oswald is condensed (fights "boxy").
- **Consequences:** Both are widely used, so the wordmark reads less bespoke than a custom face. Easy
  to swap — it's two `brand.md` tokens + the `next/font` call in the layout.
- **Links:** `brand.md` · `src/app/[locale]/layout.tsx`

### D-1.02-3 · 2026-07-15 · Dark-only theme; :root is the ground, shadcn vars remapped onto brand tokens
- **Status:** Accepted
- **Context:** The direction is an intentionally dark brand (near-black ground). The scaffold shipped
  shadcn's light/dark neutral theme in `globals.css`.
- **Decision:** No light mode. `:root` carries the brand tokens directly and IS the dark ground;
  shadcn's semantic vars (`--background`, `--primary`, `--muted-foreground`, …) are remapped onto the
  brand tokens so any future shadcn primitive inherits the brand. `@theme inline` exposes brand
  utilities (`bg-mustard`, `text-accent`, `border-border-strong`, …). shadcn's `--accent` stays a
  grey hover, distinct from the brand print-red `--color-accent`.
- **Alternatives considered:** Keep shadcn's dual light/dark theme — rejected: there is no light
  surface in the design and maintaining an unused mode invites drift.
- **Consequences:** If a light surface is ever needed it is net-new work. All colour lives in one
  `:root` block mirroring `brand.md`.
- **Links:** `src/app/globals.css` · `brand.md`

### D-1.02-4 · 2026-07-15 · Built the full clickable site now (ahead of phases 1.03–1.06)
- **Status:** Accepted
- **Context:** Phase 1.02's formal remit is the design system (tokens + components + a styleguide).
  The operator asked to "make this the real website" — the full set of mockup screens, browsable.
- **Decision:** Build every handover screen as a real route (home countdown + LIVE, catalog,
  product, cart-at-cap, checkout) plus a `/styleguide`, wired to the design system, with a live
  ticking countdown and clearly-placeholder data. Real stock/drop/order **truth** stays server-side
  and deferred to 1.03/1.04.
- **Alternatives considered:** Scope to tokens + components + styleguide only (the phase's formal
  remit) — rejected by the operator's explicit instruction.
- **Consequences:** Route layouts (home/catalog/product/cart/checkout) are built ahead of their own
  phases (1.05/1.06+). Their client-side placeholder state (countdown, stock, order submit) **will be
  replaced by server-computed truth in 1.03/1.04** — if those phases restructure the layouts, part of
  this is rework. The visual layer, tokens, and components carry forward regardless.
- **Links:** `src/app/[locale]/` · `src/lib/demo.ts`

### D-1.02-5 · 2026-07-15 · Placeholder demo content; no owed fact invented
- **Status:** Accepted
- **Context:** The data-driven screens need stand-in products, but `facts.md` marks prices, sizes,
  fabric, product names, photos and the email as UNVERIFIED/OWED, and forbids inventing them.
- **Decision:** `src/lib/demo.ts` holds a clearly-marked placeholder 4-piece drop (shows
  available/low/sold-out). Product names render as neutral slot labels ("Производ 01"); **every owed
  fact renders as a visible `[PLACEHOLDER: …]`** (price, photo, fabric, sizes-are-a-sample) and is
  logged in the placeholder register; one honest preview notice sits on each data page. The verified
  phone (078 820 520) and IG handle (@trajanovv2026) are the only real facts shown.
- **Alternatives considered:** Invent plausible prices/names to look finished — rejected outright
  (`facts.md`, CLAUDE.md content-truth). Show only a styleguide with no page data — rejected: the
  operator wanted the real pages.
- **Consequences:** The pages read as "designed, awaiting data" (which is true). `demo.ts` and the
  demo state are throwaway — replaced by the real typed drop config in 1.04 and photos in 1.06.
- **Links:** `src/lib/demo.ts` · `facts.md` · placeholder register in `current-state.md`

### D-1.02-6 · 2026-07-15 · Hand-authored brand components + new feature dirs; ui/ left untouched
- **Status:** Accepted
- **Context:** The handover specifies bespoke states (6-state buy button, sold-out card, cap notice,
  Turnstile-resolving) that are not shadcn defaults. The reserved tree has only `components/{ui,drop,
  product}`. `file-map.md` says `ui/` is shadcn-generated and not hand-edited.
- **Decision:** Author the brand components by hand in feature dirs and **add** `components/{system,
  cart,checkout,layout,home}`, leaving `components/ui/` empty/untouched. A home-page **preview
  switcher** (and `Countdown`'s `offsetMs`) mirrors the handover's demo buttons so the countdown
  thresholds + LIVE are demonstrable without a server clock.
- **Alternatives considered:** Generate shadcn primitives into `ui/` — rejected: the required states
  are bespoke and shadcn generation needs the registry/network; hand-authoring keeps full control.
- **Consequences:** We own more component code. The preview switcher is a design-pass affordance, not
  product — it is removed/replaced when real server drop state lands in 1.04. `file-map.md` updated
  with the new dirs.
- **Links:** `src/components/` · `file-map.md`

### D-1.03-1 · 2026-07-15 · Stock is per size, on a `variants` table
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.03 Code brief.
- **Decision:** **Stock is per size, on a `variants` table** — not per product.
- **Alternative rejected:** Stock column on `products`.
- **Downside accepted:** One more table before sizes are even VERIFIED in `facts.md`. If Vladimir
  says one-size-fits-all, `variants` is a table with one row per product.
- **Links:** `briefs/Part-1-Phase-03-Code.md` · Phase 1.03

### D-1.03-2 · 2026-07-15 · The order *is* the reservation
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.03 Code brief.
- **Decision:** **The order *is* the reservation.** `status` + `reserved_until` on `orders`. No
  separate `reservations` table, despite the Phase Plan naming one.
- **Alternative rejected:** A separate `reservations` table.
- **Downside accepted:** A reservation cannot exist without a full order, so a future "hold in cart"
  feature needs a migration.
- **Links:** `briefs/Part-1-Phase-03-Code.md` · Phase 1.03

### D-1.03-3 · 2026-07-15 · Order creation is one plpgsql function called by RPC
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.03 Code brief.
- **Decision:** **Order creation is one `plpgsql` function called by RPC.** Never multi-statement
  application code.
- **Alternative rejected:** Doing it in the server action with `supabase-js`.
- **Downside accepted:** Business logic lives in SQL, which neither operator can read, and is harder
  to unit-test than TypeScript. Accepted because `supabase-js` has no transaction support —
  multi-step order creation in app code *is* the oversell bug.
- **Links:** `briefs/Part-1-Phase-03-Code.md` · Phase 1.03

### D-1.03-4 · 2026-07-15 · "One live order per phone per drop" is a partial unique index in the DB
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.03 Code brief.
- **Decision:** **"One live order per phone per drop" is a partial unique index in the database**,
  not app-level rate limiting.
- **Alternative rejected:** App-level only, in 1.04.
- **Downside accepted:** A legitimate second order from the same phone is impossible until the first
  is cancelled or expires — and no cancel action exists yet. 1.04 still owes IP limiting and
  Turnstile; this does not replace them.
- **Links:** `briefs/Part-1-Phase-03-Code.md` · Phase 1.03

### D-1.03-5 · 2026-07-15 · This phase is 100% local (Supabase via Docker); no hosted project until 1.07
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.03 Code brief.
- **Decision:** **This phase is 100% local (Supabase via Docker). No hosted project until 1.07.**
- **Alternative rejected:** Create the hosted project now.
- **Downside accepted:** Migrations are unproven against hosted Supabase until 1.07; hosted settings
  and extensions may differ. Accepted because it defers all real secrets out of a public repo and
  costs Lazar nothing today.
- **Links:** `briefs/Part-1-Phase-03-Code.md` · Phase 1.03 · 1.07

### D-1.03-6 · 2026-07-15 · `expire_reservations()` ships here; only its schedule is 1.04
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.03 Code brief.
- **Decision:** **`expire_reservations()` ships here; only its schedule is 1.04.**
- **Alternative rejected:** Both in 1.04.
- **Downside accepted:** 1.03 grows slightly past its Phase Plan line. Accepted because a function
  without a test is a guess, and the test harness is being built here anyway.
- **Links:** `briefs/Part-1-Phase-03-Code.md` · Phase 1.03 · 1.04

### D-1.03-7 · 2026-07-15 · `create_order()` itself enforces the drop window as the last line of defence
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.03 Code brief.
- **Decision:** **`create_order()` itself enforces the drop window** (`now()` inside
  `[starts_at, ends_at]`) as the last line of defence.
- **Alternative rejected:** Rely on 1.04's drop-state computation.
- **Downside accepted:** The window rule will exist in two places once 1.04 lands, and they must
  agree. Accepted because the browser must never be what decides whether a drop is open, and a
  client clock is a suggestion.
- **Links:** `briefs/Part-1-Phase-03-Code.md` · Phase 1.03 · 1.04

### D-1.03-8 · 2026-07-15 · Colima (not Docker Desktop) as the local Docker runtime
- **Status:** Accepted
- **Context:** The brief assumes "Docker Desktop is installed and running (Lazar's step, done before
  you start)." On this machine (Petar's) Docker was **not installed at all**, and both the Homebrew
  cask install and Docker Desktop's first launch require the operator's macOS admin password and a
  GUI licence click — neither of which a non-interactive session can supply (the cask install failed
  on `sudo mkdir /usr/local/bin`). The operator was asked and chose Colima from the offered options.
- **Decision:** Use **Colima** (userspace Lima VM, Apple Virtualization backend) as the local Docker
  runtime, installed via Homebrew with no `sudo`. `supabase` reaches it via `DOCKER_HOST` pointed at
  `~/.colima/default/docker.sock`.
- **Alternative rejected:** Docker Desktop (the runtime the brief names) — blocked on the operator's
  password/licence, which this session cannot provide.
- **Downside accepted:** Deviates from the brief's named tool; the two operators may run different
  container runtimes. Immaterial to the deliverable — the migrations, functions, and tests are
  identical regardless of which daemon provides Docker. Lazar can use Docker Desktop unchanged.
- **Links:** `00_stack-and-config.md` · Phase 1.03

### D-1.03-9 · 2026-07-15 · Functions are SECURITY DEFINER; EXECUTE revoked from PUBLIC; service_role is SELECT-only
- **Status:** Accepted
- **Context:** Two gaps between the brief's literal wording and how Postgres/Supabase actually behave:
  (a) Postgres grants function `EXECUTE` to `PUBLIC` by default, so the brief's "revoke execute from
  anon, authenticated" alone would leave anon **still able** to execute via `PUBLIC` — the
  anon-access test (`create_order` denied) would fail. (b) Local Supabase does **not** auto-expose new
  `public` tables to any Data API role (the modern cloud default), so a plain (INVOKER) function
  called by `service_role` would lack the table privileges to insert orders / decrement stock.
- **Decision:** `create_order()` and `expire_reservations()` are **SECURITY DEFINER** (owned by
  `postgres`, `set search_path = ''`, every object schema-qualified). `EXECUTE` is revoked from
  `PUBLIC` (and explicitly `anon`, `authenticated`) and granted to `service_role` only. `service_role`
  gets **SELECT-only** on the tables — no direct INSERT/UPDATE — so every write goes through the
  definer functions, keeping "no read-then-write on stock in app code" true even for the server role.
- **Alternative rejected:** The brief's literal "revoke from anon, authenticated" (leaves the PUBLIC
  hole); INVOKER functions with broad `service_role` table writes (reintroduces direct stock writes
  in the privileged role — the exact risk the design removes).
- **Downside accepted:** SECURITY DEFINER bodies run with the owner's (superuser) rights, so they must
  be trusted and `search_path`-pinned (they are). Business logic living in SQL neither operator reads
  easily was already accepted in `D-1.03-3`.
- **Links:** `supabase/migrations/*_schema.sql` · `*_create_order.sql` · `tests/rls/anon-access.test.ts`

### D-1.03-10 · 2026-07-15 · Trimmed the local Supabase stack in config.toml
- **Status:** Accepted
- **Context:** 8 GB host, 4 GB Colima VM. The full default local stack (Studio, Realtime, Storage,
  Analytics = Logflare + Vector, email, edge runtime) is heavy and **none** of it is exercised by the
  data-layer tests, which need only Postgres + PostgREST + the API gateway.
- **Decision:** Disable `studio`, `realtime`, `storage`, `local_smtp`, `edge_runtime`, and `analytics`
  in `supabase/config.toml`. Keep `db`, `api`, and `auth`.
- **Alternative rejected:** Run the full default stack (risks memory pressure / swap on 8 GB while the
  host also runs the Next build + Vitest).
- **Downside accepted:** A later phase that needs Storage/Realtime/Studio locally must re-enable them
  in the committed `config.toml`. No effect on hosted Supabase (1.07).
- **Links:** `supabase/config.toml`

### D-1.03-11 · 2026-07-15 · Error vocabulary via custom SQLSTATE `TR001`–`TR005` (not PostgREST `PT###`)
- **Status:** Accepted
- **Context:** Callers must switch on a machine identifier, not a human message (brief §3). PostgREST
  surfaces the PL/pgSQL SQLSTATE as `error.code`, but its `PT<nnn>` convention hijacks `nnn` as the
  **HTTP status** — a code below 100 (`PT001`, `PT004`, …) produces an invalid HTTP response that
  Node's `fetch` rejects with "fetch failed". Verified empirically against the running stack.
- **Decision:** Raise a distinct custom SQLSTATE per failure — `TR001` drop_not_found, `TR002`
  drop_not_open, `TR003` quantity_cap_violated, `TR004` insufficient_stock, `TR005` duplicate_phone —
  surfaced as `error.code` (all HTTP 400). The message mirrors the identifier for logs. Documented in
  the migration header and `src/lib/orders/order-errors.ts`.
- **Alternative rejected:** PostgREST's `PT<http-status>` codes (semantic HTTP but the distinct
  identifier collapses onto shared statuses like 409, and any `PT<100>` breaks the response entirely);
  matching `error.message` strings (the brief forbids matching human-readable messages).
- **Downside accepted:** All five business errors are HTTP 400 rather than semantically-varied 4xx.
  1.04's server action switches on `error.code`, not the HTTP status, so this is immaterial there.
- **Links:** `supabase/migrations/*_create_order.sql` · `src/lib/orders/order-errors.ts`

### D-1.03-12 · 2026-07-15 · Tests use a direct Postgres admin connection for arrange/assert
- **Status:** Accepted
- **Context:** The suites must reset stock, clear orders, backdate a hold, and read internal state.
  Doing that through `service_role` would require granting it direct table writes — widening the
  privileged surface and contradicting "every write goes through the functions" (`D-1.03-9`).
- **Decision:** The suites use a direct Postgres connection (`postgres` npm lib, `SUPABASE_DB_URL` =
  the local superuser URL) for setup/teardown/asserts, while the **behaviour under test** is driven
  only through the anon/`service_role` supabase-js clients (RPC + REST). `SUPABASE_DB_URL` is
  local/test-only, lives in gitignored `.env.local`, and its **name** is documented in `.env.example`.
- **Alternative rejected:** Grant `service_role` INSERT/UPDATE for test setup (reintroduces direct
  stock writes in the privileged role); ship test-only helper RPCs (extra SQL surface in production).
- **Downside accepted:** These are DB-integration tests, not pure units — they require a live local
  stack and a superuser DB URL that exists only locally. Adds a devDependency (`postgres`).
- **Links:** `tests/helpers/db.ts` · `.env.example`

---

## Phase 1.04 — Drop engine

*`D-1.04-1` … `D-1.04-9` are the orchestrator's, appended verbatim before any code was written.
Executor (Code) decisions start at `D-1.04-10`.*

### D-1.04-1 · 2026-07-15 · Proceed to 1.04 with the owed-verification register at 4 items
- **Status:** Accepted
- **Context:** The house rule fires a verification phase at 3+ register items or before any phase
  building on unverified work. The register stands at 4 after 1.03.
- **Decision:** 1.04 proceeds as a normal build phase. No verification phase is inserted.
- **Alternatives considered:** Insert a verification phase now — rejected: item #3 (fresh-session
  review of PR #3) **clears at merge, which happens before 1.04 starts**, taking the register to 3;
  item #4 (hosted-Supabase parity) is deferred to 1.07 **by design** (`D-1.03-5`) and 1.04 adds to
  that same deferral rather than creating a new kind of debt; items #1 and #2 are 1.02 UI/link
  checks that 1.04 does not build on. None of the four is shaky work this phase stands on.
- **Consequences accepted:** 1.04's migrations, pg_cron schedule, and Turnstile wiring join 1.03's
  on the **1.07 hosted-parity debt**, which grows from "schema + 2 functions" to "schema + 3
  functions + a cron schedule + rate-limit table". **1.07 is now a bigger, riskier phase than it
  was**, and it is the first time any of this meets real infrastructure. That is the price of
  staying local, and it is named here so 1.07 is scoped for it rather than surprised by it.
- **Links:** `D-1.03-5` · Phases 1.07, 1.08

### D-1.04-2 · 2026-07-15 · Schedule `expire_reservations()` with pg_cron inside Supabase
- **Status:** Accepted
- **Context:** `expire_reservations()` exists but nothing calls it. An unscheduled sweep means a
  lapsed 48h hold never returns its unit to stock — the shirt is sold to nobody, forever.
- **Decision:** pg_cron, scheduled in a migration, inside the database.
- **Alternatives considered:** **Vercel Cron** hitting an authenticated API route — rejected on two
  counts. (1) It is Vercel-specific, and the portability rule in `00_stack-and-config.md` exists
  precisely so that a host migration is a redeploy and not a rebuild; a migration off Vercel would
  silently take reservation expiry with it. (2) It requires a new public, authenticated route whose
  only job is to mutate stock — a new attack surface on the one endpoint we most want unreachable.
  **External HTTP cron (cron-job.org, Crontap)** — rejected: a new third-party vendor and a new
  free-tier dependency for a job Postgres can run natively.
- **Consequences accepted:** The schedule lives in a migration, not in application code — a reader
  of the Next.js repo will not see it unless they look in `supabase/migrations/`. `pg_cron` runs in
  **UTC**. `cron.job_run_details` grows unboundedly and needs its own cleanup (`D-1.04-3`). And a
  **paused Supabase free-tier project silently pauses every schedule** — a real forward risk to be
  carried into 1.07, not solved here.
- **Links:** `D-1.03-6` · `00_stack-and-config.md` (portability rule) · Phase 1.07

### D-1.04-3 · 2026-07-15 · Sweep every 5 minutes; prune `cron.job_run_details` nightly
- **Status:** Accepted
- **Context:** Holds are 48h. Sweep frequency trades staleness against run-log growth.
- **Decision:** `expire_reservations()` every 5 minutes. A second nightly job deletes
  `cron.job_run_details` rows older than 7 days.
- **Alternatives considered:** Every minute — rejected: 1,440 log rows/day for a 48h hold buys
  nothing, and pg_cron's run-log is documented to grow huge and slow the DB. Hourly — rejected:
  cheap enough at 5 min that there is no reason to be coarser. No pruning — rejected: it is three
  lines now and a mystery slowdown later.
- **Consequences accepted:** A unit can sit dead for up to 5 minutes after its hold lapses. At 40
  shirts on a drop that lasts hours, this is invisible.
- **Links:** `D-1.04-2`

### D-1.04-4 · 2026-07-15 · Drop times are Europe/Skopje wall-clock, DST-resolved
- **Status:** Accepted
- **Context:** Vladimir will say "Friday, 20:00". North Macedonia is UTC+1 in winter and UTC+2 in
  summer. A hand-written `+02:00` offset in config is silently wrong for half the year.
- **Decision:** The drop config carries a naive local wall-clock string (`"2026-08-15T20:00"`) plus
  the fixed zone `Europe/Skopje`. The sync resolves it to an absolute instant and writes
  `timestamptz`. Nothing in config ever carries a raw UTC offset.
- **Alternatives considered:** Explicit ISO offsets in config — rejected: correct only if whoever
  types it remembers DST, on the one value that must not be wrong. Store the local string in the DB
  and resolve at read time — rejected: `create_order()` already compares against `now()` in the DB
  and must keep doing so; the DB must hold an instant.
- **Consequences accepted:** The sync owns a timezone resolution step that must be tested, including
  across a DST boundary. Getting it wrong opens the drop an hour early or late.
- **Links:** `D-1.03-7`

### D-1.04-5 · 2026-07-15 · The sync never writes `stock` on an existing variant
- **Status:** Accepted
- **Context:** Config seeds stock; the DB decrements it. If a re-run of the sync wrote config's
  stock back, a sync during a live drop would reset sold stock to its starting number and the site
  would sell shirts that do not exist — **a silent oversell, worse than the one 1.03's gate catches.**
- **Decision:** `stock` is written **only on INSERT** of a new variant. On an existing variant the
  sync never touches `stock`, under any flag. Every other non-price field may be updated freely. The
  sync is idempotent. A config deletion never deletes a row that has `order_items` against it.
- **Alternatives considered:** A `--force-stock` flag — rejected: the flag exists to be used at 19:55
  on drop night by someone in a hurry. There is no restock requirement (out of scope), so the safe
  thing is for the capability to not exist.
- **Consequences accepted:** Fixing a genuinely wrong stock number means a deliberate SQL statement
  in the Supabase dashboard, by a human who has thought about it. That is the intent.

### D-1.04-6 · 2026-07-15 · `price_mkd` becomes nullable; `TR006 price_missing`; the sync refuses to publish a priceless drop
- **Status:** Accepted
- **Context:** No real price exists for any product (`facts.md` §7 — owed by Vladimir). The site must
  still render browsable-with-placeholders between drops, so a product with no price must be
  representable. But a `price_mkd NOT NULL` column forces whoever populates config to type a number,
  and the only numbers available are invented ones. **The schema is currently applying pressure
  toward fabricating a price.**
- **Decision:** Three layers. (1) `variants.price_mkd` becomes nullable; the CHECK becomes
  `price_mkd IS NULL OR price_mkd > 0`. (2) `create_order()` rejects any variant with a null price
  with a new `TR006 price_missing`, before any decrement. (3) The sync's preflight **refuses to
  write a drop whose window is open or in the future if any of its variants has a null price**, and
  says which ones.
- **Alternatives considered:** Keep `NOT NULL` and omit priceless products from the sync — rejected:
  the catalog would render empty, which reads as a broken site and creates pressure to "just put
  something in". A sentinel price (0, -1) — rejected: a sentinel is an invented number that one
  missing guard renders to a customer.
- **Consequences accepted:** Touches `create_order()`, which is 1.03's proven code — so the
  concurrency gate must be re-run and the fresh-session review must cover it. Worth it: after this,
  **it is not possible to sell a shirt at a price we made up**, because there is nowhere to make one
  up.
- **Links:** `facts.md` §7 · `D-1.03-11` (error vocabulary)

### D-1.04-7 · 2026-07-15 · IP rate limit — hashed IP, 20 attempts / 10 min, threshold on the drop row
- **Status:** Accepted
- **Context:** Cash on delivery means ordering costs the orderer nothing, so abuse costs nothing.
- **Decision:** Order-creation attempts are counted per **SHA-256 hash of the IP** (peppered with a
  server-side secret), never the raw IP. Default **20 attempts per IP per 10 minutes**. The threshold
  is a column on the `drops` row, so Lazar can change it from the Supabase dashboard mid-drop without
  a deploy.
- **Alternatives considered:** Store raw IPs — rejected: the repo is public, the seller is a minor
  with no registered entity, and a material share of the audience is 12–17. Storing children's IP
  addresses to do arithmetic a hash does identically is unjustifiable. A tight limit (2–3/hour) —
  rejected: **Macedonian mobile carriers NAT large numbers of subscribers behind few egress IPs**,
  so a tight per-IP limit on drop day blocks real buyers in bulk; the control would become the
  outage. A constant in code — rejected: changing it would need a deploy at the worst moment.
- **Consequences accepted, stated plainly: this control is a backstop against casual abuse, not a
  defence against a determined attacker.** Phone numbers are never verified (no OTP), so the
  one-order-per-phone rule stops accidents, not attacks; anyone with a proxy pool and a Turnstile
  solver walks through the IP limit too. **The real containment is the 48h hold and Vladimir's
  confirmation call** — a fake order costs an attacker 48 hours, not the drop. Nobody should read
  this limit as more than it is. It is also still possible for NAT to bite at a scale larger than
  expected, which is exactly why the number is a DB value and not a constant.
- **Links:** `D-0-5` · `D-1.03-4`

### D-1.04-8 · 2026-07-15 · Turnstile against Cloudflare's documented test keys; token minted fresh at submit
- **Status:** Accepted
- **Context:** No Cloudflare account or real keys exist yet (they land with the hosted environment).
  Separately: **Turnstile tokens expire after 300 seconds and are single-use.**
- **Decision:** Wire the real widget and real server-side Siteverify now, against Cloudflare's
  published dummy keys, read from env vars. Real keys are a 1.07/2.05 concern, no code change.
  **The token must be minted or refreshed at submit time, not at page load**, and a
  `timeout-or-duplicate` response must re-challenge and let the customer retry — never fail silently.
- **Alternatives considered:** Defer Turnstile to 1.07 — rejected: it would land untested on the one
  form that matters. Keep the 1.02 `TurnstilePlaceholder` — rejected: it validates nothing.
  Mint at page load — rejected, and this is the load-bearing part: **a customer who opens checkout at
  19:50 for a 20:00 drop and submits at 20:01 is holding an 11-minute-old token, which Cloudflare
  rejects.** That is not an edge case here; it is the *designed* behaviour of a countdown, and it
  would fail exactly the buyers who showed up early and cared most.
- **Consequences accepted:** Siteverify is proven only against dummy keys until real keys exist; the
  success path is real, the "is Cloudflare actually challenging bots" question is unanswerable until
  1.07. Test keys must never reach production — guarded in the DoD.
- **Links:** Cloudflare Turnstile testing docs · Phase 1.07

### D-1.04-9 · 2026-07-15 · Drop-state pages are uncached; stock display may be briefly stale; the DB is the gate
- **Status:** Accepted
- **Context:** Next.js caches server-rendered routes aggressively by default. A statically cached
  home page freezes the drop state — **the countdown page would still say "countdown" at 20:05 on
  drop night, served from a CDN, while the drop is open.** This is the single most likely way for
  this phase to fail in public.
- **Decision:** Any route rendering drop state is explicitly dynamic. Stock *display* may be up to
  60s stale; `create_order()` remains the only authority.
- **Alternatives considered:** Force-dynamic everything — rejected: the Lighthouse 95+ target
  (`D-0-8`) is real and the About/legal pages have no reason to be dynamic. Trust the client clock at
  T-0 — rejected: a client clock is a suggestion, and the client must re-validate with the server
  rather than unlock its own buy button.
- **Consequences accepted:** A customer can see "2 left", submit, and get a clean `TR004
  insufficient_stock` back. **That is correct behaviour and must read as such in MK** — "someone
  beat you to it", not "error". Drop-state routes give up static caching and cost a DB read per view.
- **Links:** `D-0-8` · `D-1.03-7`

---

*`D-1.04-10` onward are the executor's (Code), made while building 1.04.*

### D-1.04-10 · 2026-07-15 · Price/name nullability applied to `products`, not `variants`; names also nullable
- **Status:** Accepted
- **Context:** `D-1.04-6`/Task 2 say "`variants.price_mkd`". That column does not exist. Price lives on
  `public.products.price_mkd`; `variants` carry only `(product, size, stock)`, and `create_order()`
  reads the price by joining variant → product. The brief is wrong about where price lives.
- **Decision:** Apply the nullable change + the `price_mkd IS NULL OR > 0` CHECK + the `TR006` guard to
  `products.price_mkd` — the column that actually exists. Also make `products.name_mk`/`name_en`
  nullable, for the same anti-fabrication reason: a null name renders a neutral slot ("Производ 01"),
  never a made-up name stored as if real.
- **Alternatives considered:** Move price onto `variants` to match the brief literally — rejected: a
  large, risky change to proven concurrency code for no benefit (all sizes of a shirt cost the same).
  Keep names `NOT NULL` and have the sync write a slot string — rejected: it stores fabricated content
  that then can't be told apart from a real name.
- **Consequences accepted:** The code deviates from the brief's literal column name; flagged loudly in
  the completion report §3 so the orchestrator can correct the brief. Names being nullable is scope the
  brief did not enumerate (only price), but it is the same decision and the same reasoning.
- **Links:** `D-1.04-6` · `create_order` migration

### D-1.04-11 · 2026-07-15 · The config→DB sync uses a direct Postgres admin connection, not the service-role client
- **Status:** Accepted
- **Context:** Task 3 says the sync "writes via the service-role client". But `D-1.03-9` made
  `service_role` **SELECT-only** on every table, with all writes going through SECURITY DEFINER
  functions — precisely so the runtime privileged role can never write stock directly.
- **Decision:** The sync connects with a **direct Postgres admin URL** (`SUPABASE_DB_URL`), exactly as
  the test suites do (`D-1.03-12`). It is an operator-run, migration-time tool, not runtime code.
- **Alternatives considered:** Grant `service_role` INSERT/UPDATE on the catalogue tables — rejected:
  it re-opens a direct `service_role` write path to `variants.stock`, the one thing `D-1.03-9` closed.
  Write SECURITY DEFINER upsert functions for the sync — rejected: a lot of SQL to move an operator
  tool into the database for no safety gain.
- **Consequences accepted:** The sync needs a superuser DB URL (local: the shared-default; hosted:
  Supabase's direct connection string, set by the operator in 1.07). It is not exercised by the
  `service_role` RLS posture, so hosted parity (1.07) must confirm the operator has that URL.
- **Links:** `D-1.03-9` · `D-1.03-12`

### D-1.04-12 · 2026-07-15 · The committed rehearsal `test-drop` is an ENDED drop
- **Status:** Accepted
- **Context:** Task 1 wants one committed rehearsal drop, priced `null`, "so the site has something to
  render". `D-1.04-6`'s preflight refuses to write any **open or future** drop that has a null price.
  A null-priced countdown/live drop therefore cannot be synced — the two requirements collide.
- **Decision:** Commit `test-drop` with a **past** window (ended). The sync accepts it (an ended drop
  can never be ordered, so a null price is moot), and it renders the ended state by default. All three
  states are reviewable via the dev-only `?preview` override (`D-1.04-13`).
- **Alternatives considered:** A future countdown rehearsal — rejected: the preflight refuses it (null
  price + future). A priced rehearsal — rejected: Task 1 requires `null`, and any price would be
  invented (`facts.md` §7). Two committed drops — rejected: Task 1 says one.
- **Consequences accepted:** The default render of the committed config is the "ended" state, which can
  read as a dead store to a casual viewer. `test-` slugs + the placeholder banner + dev preview make it
  obviously a rehearsal; the state files say so.
- **Links:** `D-1.04-6` · `D-1.04-13`

### D-1.04-13 · 2026-07-15 · Server-computed drop state + a dev-only `?preview` override replace the 1.02 client preview switcher
- **Status:** Accepted
- **Context:** The 1.02 home carried a client-side "preview states" switcher that faked the drop state
  in the browser — the exact thing this phase removes (`D-1.04-9`: the browser is not the source of
  truth). But the DoD still needs all three states reviewable against one committed config.
- **Decision:** Home/catalog/product read the real state from the server. A `?preview=countdown|live|
  ended` query param overrides the **displayed** state, honoured only when `NODE_ENV !== 'production'`
  (double-gated: the page also refuses to wire it in prod, and `src/lib/drop` refuses to parse it).
  The visible switcher renders only in dev.
- **Alternatives considered:** Keep the client switcher — rejected: it is a client-side lie about drop
  state, the thing this phase exists to kill. Require re-syncing config to see each state — rejected:
  slow and error-prone for review. A production preview mode — rejected: it is an unlocking side door
  on the one thing that must stay server-authoritative.
- **Consequences accepted:** The home page loses its visible preview buttons in production (a small
  visual change to a design-system scaffold the handover itself labels a demo aid). The override forces
  only *display*; `create_order()` still enforces the real window server-side, so a `?preview=live` on
  a closed drop correctly still returns `TR002`.
- **Links:** `D-1.04-9`

### D-1.04-14 · 2026-07-15 · IP hashed in the app (pepper never in the DB); 10-min window is an app constant
- **Status:** Accepted
- **Context:** `D-1.04-7` wants a peppered SHA-256 IP hash and the count threshold on the drop row.
- **Decision:** The IP is hashed in **Node** (`node:crypto`) with a server-side pepper; only the 64-char
  hex hash reaches Postgres. The pepper never touches the database. The **count threshold** is the DB
  column (editable per drop); the **window length (10 min)** is a documented app constant. Recording is
  count-then-insert — best-effort, may overshoot by one under a concurrent race.
- **Alternatives considered:** Hash in Postgres with pgcrypto — rejected: it would put the pepper in the
  DB (or in a DB setting), widening where the secret lives. Make the window a DB column too — rejected:
  `D-1.04-7` only calls for the threshold, and one knob is enough. A strict atomic counter — rejected:
  overkill for a control `D-1.04-7` itself calls a backstop, not an anti-attack defence.
- **Consequences accepted:** Two simultaneous attempts on the boundary can both pass (off-by-one). The
  ledger grows (rows age out of the window but are not swept); acceptable at this scale, noted for 1.07.
- **Links:** `D-1.04-7`

### D-1.04-15 · 2026-07-15 · `tsx` added (dev) to run the TypeScript sync script
- **Status:** Accepted
- **Context:** `npm run sync:drop` runs a TS script that imports `src/config` (extensionless imports)
  and the `postgres` lib. Node 24's native TS type-stripping requires **explicit `.ts` extensions** on
  relative imports, which the whole codebase does not use.
- **Decision:** Add **`tsx`** as a devDependency; `sync:drop` = `tsx scripts/sync-drop.ts`.
- **Alternatives considered:** Native `node --experimental-strip-types` — rejected: it fails on the
  codebase's extensionless imports (`Cannot find module './drops'`). Add `"type":"module"` + rewrite
  imports — rejected: a project-wide change to a Next app for one script. Compile the script — rejected:
  a build step for an operator tool.
- **Consequences accepted:** One more devDependency (recorded in `00_stack-and-config.md`). `tsx`
  transpiles to CJS, so the CLI wraps its top-level `await` in an async `main()`.
- **Links:** `00_stack-and-config.md`

### D-1.04-16 · 2026-07-15 · The order path is wired end-to-end; a product→cart→checkout item flow is NOT built
- **Status:** Accepted
- **Context:** Task 6 wires Turnstile + rate limit + `create_order()` onto the order path. But 1.02
  never built cart state or a selected-variant flow from product → cart → checkout, and building one is
  out of scope ("no new components, no improvements to layout").
- **Decision:** Build the real, tested order Server Action (`placeOrder`) and wire the checkout form to
  it with a **fresh Turnstile token at submit**. For the *items*, the checkout submits a **stand-in**:
  the active drop's first in-stock variant, quantity 1 (`getActiveOrderContext`). `create_order()`
  remains the only authority (window, cap, price, stock).
- **Alternatives considered:** Build a full cart-state system — rejected: out of scope, and large.
  Disable the checkout entirely until a cart exists — rejected: the whole point of Task 6 is to prove
  the guarded order path works, and it now does, end to end (a real order was placed in-browser).
- **Consequences accepted:** The in-browser checkout orders a stand-in item, not a user-chosen one; a
  real cart flow (selected product/size/qty flowing to checkout) is future work and must precede a real
  drop. Flagged in the completion report §3 and the carryovers.
- **Links:** `D-1.04-8` · `D-1.04-9`

### D-1.04-17 · 2026-07-15 · Turnstile runs in execute/interaction-only mode; Siteverify omits the client IP
- **Status:** Accepted
- **Context:** `D-1.04-8` requires the token minted/refreshed at submit, not at page load. Separately,
  the project stores/transmits no raw IPs (`D-1.04-7`).
- **Decision:** Render the widget with `execution: 'execute'` + `appearance: 'interaction-only'`; the
  form calls `turnstile.execute()` on submit to mint a fresh token, and re-challenges on error/expiry.
  Server-side Siteverify **omits `remoteip`** — Turnstile does not require it, so no raw IP is sent to
  Cloudflare.
- **Alternatives considered:** A visible checkbox rendered at load — rejected: `D-1.04-8`'s stale-token
  trap (an 11-minute-old token on a countdown). Send `remoteip` to Cloudflare — rejected: needless
  transmission of a raw IP the project otherwise never handles.
- **Consequences accepted:** The checkout's "verifying" indicator now appears **after** submit (during
  the mint + Siteverify), not before — a change from the 1.02 placeholder's auto-resolve. This is the
  designed, correct behaviour for a countdown. Real bot-challenge behaviour is unproven until real keys
  (1.07); only the success/fail plumbing is proven against dummy keys.
- **Links:** `D-1.04-8` · `D-1.04-7`

### D-1.04-18 · 2026-07-15 · `LOW_STOCK_THRESHOLD = 5` is a display heuristic constant, not a token or a fact
- **Status:** Accepted
- **Context:** The card/product "low stock" badge needs a threshold. It is business/display logic, not
  a design token (`brand.md`) and not a `facts.md` claim.
- **Decision:** A documented constant `LOW_STOCK_THRESHOLD = 5` in `src/config/schema.ts`. It affects
  only the badge; `create_order()` remains the sole stock authority, so the number is safe to tune.
- **Alternatives considered:** A per-drop DB column — rejected: no requirement, and one more knob to set
  every drop. Derive it from stock — rejected: invents a rule with no basis. Hardcode inline — rejected:
  it belongs with the config constants, named.
- **Consequences accepted:** `5` is a guess about when "low" should shout; if it feels wrong on drop
  day, it is a one-line change (and not a stock-safety issue).

---

## Phase 1.05 — About + Contact

*`D-1.05-1` … `D-1.05-7` are the orchestrator's, made in chat and appended verbatim. Executor (Code)
decisions start at `D-1.05-8`.*

### D-1.05-1 · 2026-07-15 · Commit `Trajanov-V2-Plan.md` **and** `Trajanov-V2-Phase-Plan.md` to the repo root
- **Status:** Accepted
- **Context:** Phase 1.04's Task 0 flagged that `Trajanov-V2-Plan.md` is referenced by five tracked
  files but does not exist in the repo: `Decisions.md`, `briefs/Part-1-Phase-03-Code.md`,
  `src/_project-state/current-state.md`, and the 1.03 and 1.04 completion reports. Checking further,
  **`Trajanov-V2-Phase-Plan.md` has the same defect** — `Decisions.md` (`D-0-8`) links to it and it is
  not in the repo either. Both live only in the orchestrator's Claude Project knowledge, which no
  executor can read. Every reference is a 404 for anyone who follows it.
- **Decision:** Both files are committed to the repo root by the operator. The references resolve.
- **Alternatives considered:** Edit the references out of the tracked files — **rejected, and it is not
  actually available:** `Decisions.md` is append-only and "never edit or delete a past entry" is a
  standing rule, so its references cannot be removed without breaking a rule that exists to keep the
  decision history trustworthy. Completion reports are historical records and are not rewritten either.
  Both files have to exist. Leave them in Claude Project knowledge only — rejected: Claude Code cannot
  read that; the repo is the only place both audiences share.
- **Downside accepted:** Two more long documents in the repo that can go stale. Mitigated by their own
  opening lines — the Plan says "This document is aspirational. Live code wins on conflict", the Phase
  Plan says live status lives in `current-state.md` — and by the fact that neither restates facts,
  tokens, decisions, or status; they link. **They must now be deleted from Claude Project knowledge**,
  or the project has two copies of each and the duplicate is what goes stale.
- **Links:** `Trajanov-V2-Plan.md` · `Trajanov-V2-Phase-Plan.md` · `D-0-8` · 1.04 completion report §0

### D-1.05-2 · 2026-07-15 · Proceed with the owed-verification register at 4; clear #1 and #2 as merge blockers on this phase
- **Status:** Accepted
- **Context:** The house rule fires a verification phase at 3+ register items. After PR #4 merged
  (clearing item #3), the register stands at **4**. `D-1.04-1` already declined to fire this rule once.
  **Declining twice in a row is how a gate quietly dies**, so this entry is deliberately stricter than
  its predecessor rather than a repeat of it.
- **Decision:** No separate verification phase. Instead, register items **#1 (design direction
  sign-off) and #2 (Instagram URL click-test)** become **merge blockers on Phase 1.05** — the PR does
  not merge until Lazar has done both. Items **#4 (hosted-Supabase parity)** and **#5 (real Turnstile
  keys)** remain deferred to **1.07 by design** (`D-1.03-5`, `D-1.04-1`) and are re-confirmed as
  scheduled work, not debt.
- **Alternatives considered:** Insert a verification phase now — rejected: its entire content would be
  two browser checks that take ten minutes, and #4/#5 **cannot** clear before 1.07 exists because there
  is no hosted Supabase project to check. A phase that cannot clear its own items is process theatre,
  and theatre is how a real gate loses its meaning. Proceed and say nothing — rejected: that is exactly
  the silent accumulation the rule exists to prevent.
- **Downside accepted:** The 3-item rule has now not fired twice consecutively. If Lazar does not do
  the two checks, 1.05 merges on a promise — which is why they are written into the Definition of Done
  as merge blockers rather than left as register rows. **1.08 remains the hard gate; nothing here
  weakens it.**
- **Links:** `D-1.04-1` · `D-1.03-5` · `current-state.md` register · Phases 1.07, 1.08

### D-1.05-3 · 2026-07-15 · The Contact page joins Phase 1.05
- **Status:** Accepted
- **Context:** Contact is in the information architecture (`Trajanov-V2-Plan.md` §4) but **no phase
  owns it**. The phase plan gives 1.05 "Home + About"; 1.06 is Catalog + Product; 1.07 is Cart +
  Checkout + email. Contact has been homeless since kickoff.
- **Decision:** Contact is built in 1.05. It is the same shape of work as About — a static page whose
  content comes entirely from `facts.md`, needing the same humanizer pass, the same facts audit, and
  the same footer link.
- **Alternatives considered:** Give it to 1.07 — rejected: 1.07 already carries the hosted Supabase
  project, real keys, Resend, and hosted-parity re-verification, making it the riskiest phase in Part 1;
  adding an editorial page to it is how a big phase becomes an unreviewable one. Give it its own phase
  — rejected: a whole phase for one page of text is overhead with no benefit.
- **Downside accepted:** 1.05 grows from one page to two, and Contact ships with a visible email
  placeholder from day one — a new row on the placeholder register, and therefore a new cutover
  blocker, on a page that would otherwise not exist yet. That is the honest state of the world:
  Vladimir's email is owed and the register is where owed things live.
- **Links:** `Trajanov-V2-Plan.md` §4 · `facts.md` §5 · Phase 1.07

### D-1.05-4 · 2026-07-15 · No photo hero on Home, and no photo slot either
- **Status:** Accepted
- **Context:** The phase plan lists "Hero" under 1.05. The only photography that exists is the
  lifestyle set from the bar shoot, and it is blocked twice over (`facts.md` §8): model and venue
  permission are unconfirmed, and whether an alcohol backdrop is right for a brand whose audience
  starts at age 12 is an unmade owner call. The photos are not in the repo. `brand.md` §8: "Do not
  design a hero that only works with an image we may not be allowed to use." The 1.02 handover
  describes the Home countdown as **"type-led, works with no photo."**
- **Decision:** Home keeps the existing type-led countdown hero, unchanged. **No photo, and no empty
  photo slot.**
- **Alternatives considered:** Ship a `PhotoSlot` on the hero so an image can drop in later —
  **rejected:** it would put a visible `[PLACEHOLDER: …]` on the site's front door, the exact surface
  every Instagram link lands on, and add a cutover blocker for an image we may never be permitted to
  use. Wait for the permissions before building 1.05 — rejected: a blocked phase quietly becomes a
  placeholder, and the About page does not need the photo.
- **Downside accepted:** The site launches with no photography above the fold; it is type and a
  countdown. If the permissions land later, adding an image is a small, separate change — deliberately
  cheaper than removing one we should not have shipped.
- **Links:** `facts.md` §8 · `brand.md` §8 · `D-0-6` · handover "Screen mocks delivered"

### D-1.05-5 · 2026-07-15 · Cite all five verified outlets; list the coverage, never characterise it
- **Status:** Accepted
- **Context:** At intake, `facts.md` § 4 held one verified press link (Трн.мк) and three unverified
  ones, and the phase plan said "placeholders + register entries if unresolved." **On 2026-07-15 the
  orchestrator fetched and read all three. All three are live and about this competition. A fifth
  outlet — Република — was found that was never in the intake list and is also verified.** § 4 has been
  rewritten; the old "only Трн.мк may be cited" rule is retired as satisfied.
- **Decision:** About lists **all five** outlets as links: Трн.мк, Струмица Денес, Бизнис Вести,
  Cultural Chat, Република. Under a plain heading. **With no adjective in front of them.**
- **Alternatives considered:** Cite only Трн.мк — rejected: that rule existed solely because the others
  were unverified, and they are not any more; a brand whose only asset is real press should show the
  real press. Add an "as seen in" strip with logos — **rejected: the logos are the outlets' trademarks
  and we have no licence**, and a logo wall implies a relationship that does not exist. State a count
  ("featured in 5 outlets") — rejected, see the downside.
- **Downside accepted:** **Four of the five are syndications of the same supplied text**, with the same
  photographs — one story that travelled, not five independent reports. Listing five links is true;
  *characterising* them ("widely covered", "national acclaim", "featured in five outlets") reads as
  five newsrooms independently deciding this mattered, which is not what happened. So the page lists
  and stays silent. That is a weaker-sounding page than the marketing version, and it is the only
  version that is true. A link can also die later, which is why no count is printed and why 2.03
  re-checks.
- **Links:** `facts.md` § 4 (rewritten 2026-07-15) · Phase 2.03

### D-1.05-6 · 2026-07-15 · The press quote renders in Macedonian on MK, and as a marked translation on EN
- **Status:** Accepted
- **Context:** `facts.md` §3 approves exactly one quote, in Macedonian, with attribution. Vladimir
  never said it in English.
- **Decision:** MK renders the original. EN renders an English translation, explicitly marked as
  translated from Macedonian, with the same attribution (name, outlet, date).
- **Alternatives considered:** Print the MK original untranslated on the EN page — rejected: audience 3
  is press-curious and does not read Macedonian; an unreadable quote is not a quote. Print an English
  version with no translation note — rejected: it presents words as his that he never said in that
  language, which is exactly the kind of small untruth this project does not do.
- **Downside accepted:** The EN pull-quote carries a note, which is slightly less clean typographically
  than a bare quote. **Preferred long-term fix, on the parallel track:** ask Vladimir for a fresh quote
  written by him, for this site, in both languages — his own words beat a press quote and carry no
  attribution constraint (`facts.md` §3).
- **Links:** `facts.md` §3

### D-1.05-7 · 2026-07-15 · About and Contact live in the footer; the header does not change
- **Status:** Accepted
- **Context:** The header at 390px already carries wordmark + Catalog + language pill + cart. Adding
  two links breaks the row or forces a hamburger menu, which is a new component nobody designed.
- **Decision:** The header is untouched. About and Contact are linked from the footer, which exists and
  has room. Home carries **one** quiet link to About in its countdown and ended states — satisfying the
  plan's "the press win, once" — and **nothing** in its live state.
- **Alternatives considered:** Add both to the header — rejected: audience 1 arrives from an Instagram
  story to buy in seconds; the header is the buy path and everything else is a tax on it. Build a
  mobile menu — rejected: a new component, unspecified in the handover, for two links.
- **Downside accepted:** About and Contact are one scroll away, so press and diaspora visitors (audience
  3) reach the story less directly than a header link would give them. The Home link and the fact that
  press traffic lands via a link *to* the story mitigate it. Revisit in 2.04 if the analytics say so.
- **Links:** `Trajanov-V2-Plan.md` §3, §4 · handover §10

---

*`D-1.05-8` onward are the executor's (Code), made while building 1.05.*

### D-1.05-8 · 2026-07-15 · About/Contact are statically prerendered via `setRequestLocale`; they show as `●` (SSG), not `○`
- **Status:** Accepted
- **Context:** The DoD asks the four new routes to build as **static `○`**, not dynamic `ƒ`. Two facts
  collide: (1) under next-intl, a page that never calls `setRequestLocale(locale)` is opted **into
  dynamic rendering** — the existing `styleguide` route proves it (`ƒ`, though it sets no
  `force-dynamic`). (2) Because the routes sit under the `[locale]` **dynamic segment** and rely on the
  layout's `generateStaticParams`, Next marks a statically-prerendered route `●` (SSG), not plain `○`.
- **Decision:** Both pages call `setRequestLocale(locale)` (and set no `force-dynamic`), so the build
  **prerenders `/mk/about`, `/en/about`, `/mk/contact`, `/en/contact` at build time**. They report as
  `●` (SSG) — "prerendered as static HTML" — which is the localised-route equivalent of `○` and the
  actual outcome the DoD wants: no per-request DB read, no per-request compute, cached static HTML.
- **Alternatives considered:** Force a plain `○` — **rejected/unavailable:** a route under a dynamic
  segment with `generateStaticParams` is `●` by construction; there is no `○` to reach without removing
  the `[locale]` segment. Omit `setRequestLocale` — rejected: that ships them as `ƒ` (dynamic), the one
  thing the DoD forbids.
- **Downside accepted:** The build marker is `●`, not the literal `○` the brief names. This is a
  wording gap in the DoD, not a miss: `●` **is** static prerender. Flagged in the completion report §3.
- **Links:** `src/app/[locale]/about/page.tsx` · `src/app/[locale]/contact/page.tsx` · `D-1.01-3`

### D-1.05-9 · 2026-07-15 · The phone joins `src/lib/social.ts` as a shared constant; footer + Contact import it
- **Status:** Accepted
- **Context:** Task 6 states the phone and the IG handle "both come from `facts.md` §5/§6 and
  `src/lib/social.ts`" and must be imported, never retyped. But `social.ts` held only the IG constants;
  the 1.02/1.04 footer **hard-coded** the phone (`078 820 520` / `tel:+38978820520`). The brief's
  premise — phone already in `social.ts` — was not true on disk.
- **Decision:** Add `PHONE_DISPLAY` + `PHONE_TEL` to `src/lib/social.ts` (verified once against
  `facts.md` §5), broaden its header comment to "public contact constants", and import them in **both**
  the footer and the new Contact page. The footer's retyped phone is removed.
- **Alternatives considered:** A separate `src/lib/contact.ts` — rejected: the brief names `social.ts`,
  and a second facts-constants file to hold one phone number is overhead. Leave the phone hard-coded in
  each place — rejected outright: "one typo in a phone number multiplies across every page and sends a
  real customer to a stranger" is the exact risk the brief calls out.
- **Downside accepted:** `social.ts` now carries a non-"social" fact (a phone), stretching its name.
  Mitigated by the broadened header comment. Renaming the file was rejected as needless churn to an
  import used across the app.
- **Links:** `src/lib/social.ts` · `facts.md` §5 · Task 6

### D-1.05-10 · 2026-07-15 · Fixed the footer's hard-coded English "Strumica, North Macedonia" to a translated string
- **Status:** Accepted
- **Context:** The 1.02/1.04 footer rendered a literal English `"Strumica, North Macedonia"` on **every
  page, in both locales** — an English string in the MK build, which `CLAUDE.md` forbids ("never ship
  an English string into the MK build"). This phase edits the footer (adding the About/Contact links)
  and adds a *translated* Strumica line to the new Contact page, making the untranslated footer version
  stand out directly beside it.
- **Decision:** Add a `Nav.location` key (MK "Струмица, Северна Македонија" / EN "Strumica, North
  Macedonia") and render it in the footer, replacing the hard-coded English string.
- **Alternatives considered:** Leave it — rejected: it is a standing-rule violation (`CLAUDE.md`
  content/i18n), pre-existing but now directly adjacent to translated copy I am adding. Defer it to the
  MK copy-review phase (2.02) — rejected: it is a one-line fix in a file I am already touching, and
  2.02 reviews *copy*, not un-internationalised strings.
- **Downside accepted:** A footer change slightly beyond the brief's stated footer scope ("add two
  links; keep the phone/IG block as is"). The change is in the *left* block, not the phone/IG block,
  and is the safest possible i18n fix. Flagged in the completion report §3.
- **Links:** `src/components/layout/SiteFooter.tsx` · `CLAUDE.md` (content truth / MK default)

### D-1.05-11 · 2026-07-15 · Coverage dates render via the next-intl formatter (long month); the quote keeps its verbatim per-locale date
- **Status:** Accepted
- **Context:** Task 3 asks each coverage entry to show "outlet name + date". Dates must read natively in
  both locales. The quote attribution, separately, is specified **verbatim**: MK `12.06.2026`
  (`facts.md` §3), EN `12 June 2026` (Task 2).
- **Decision:** The five coverage dates are rendered with `next-intl`'s formatter using
  `{day:'numeric', month:'long', year:'numeric', timeZone:'UTC'}` — MK "12 јуни 2026 г.", EN "12 June
  2026". The **pull-quote attribution keeps its exact per-locale string** (MK numeric `12.06.2026`, EN
  `12 June 2026`), unchanged from the source.
- **Alternatives considered:** Numeric dates everywhere — rejected: `Intl('en')` numeric is `6/12/2026`
  (ambiguous MM/DD) for the press/diaspora EN reader. Hard-code date strings per locale — rejected: not
  locale-aware and re-types data. Harmonise the quote's date to the list format — rejected: the quote
  attribution is verbatim from `facts.md` §3 and must not be "corrected".
- **Downside accepted:** The MK coverage dates carry Intl's native "г." suffix and differ in format from
  the MK quote's numeric `12.06.2026`. Both are valid Macedonian; a citation using a numeric date beside
  a list using a spelled month is normal and not an inconsistency worth eliminating.
- **Links:** `src/app/[locale]/about/page.tsx` · `facts.md` §3, §4

### D-1.05-12 · 2026-07-15 · `About.quoteNote` is empty on MK, non-empty on EN; rendered only when present
- **Status:** Accepted
- **Context:** `D-1.05-6` requires the EN quote to be explicitly marked "translated from Macedonian",
  while the MK quote (the original) needs no such note. The two message catalogs must keep **identical
  key sets** (DoD).
- **Decision:** `About.quoteNote` exists in both catalogs: EN = "Translated from Macedonian", MK = ""
  (empty). The component renders the note only when the value is truthy, so EN shows it and MK shows
  nothing. Key parity holds; the MK reader sees no redundant note.
- **Alternatives considered:** Give MK a real note too ("original in Macedonian") — rejected: redundant
  and mildly clumsy for a MK reader who is already reading Macedonian. Branch on locale in the component
  and omit the key from MK — rejected: it breaks the identical-key-sets rule.
- **Downside accepted:** An intentionally-empty value in `mk.json` can read as an oversight to someone
  scanning the file. Mitigated by a code comment at the render site and this entry.
- **Links:** `src/messages/{mk,en}.json` · `src/app/[locale]/about/page.tsx` · `D-1.05-6`

### D-1.06-1 · 2026-07-15 · Phase 1.06 re-scoped from Catalog + Product content to the cart flow
- **Status:** Accepted
- **Context:** The Phase Plan scoped 1.06 as "product listing, product detail, real photos, real
  prices, sizes, fabric, live stock, sold-out states." Reading `current-state.md` at the 1.05 close,
  most of that had already shipped: `/catalog` and `/catalog/[slug]` were built in 1.02 with every
  handover state including sold-out, and wired to the database in 1.04. What remained of 1.06 was the
  four facts Vladimir owes — photos, prices, sizes, fabric — every one "Not started," and Lazar
  confirmed on 2026-07-15 that the sizes do not exist and the drop's colourways are not settled.
  Sizes are not cosmetic: a `variant` is a product-and-size pair and stock lives on the variant, so
  no sizes means no stock rows and nothing buyable. Meanwhile carryover `D-1.04-16` — no real
  product→cart→checkout item flow, checkout submitting the active drop's first in-stock variant as a
  stand-in — was unscheduled, unblocked, and on the critical path to 1.08, whose "one real order end
  to end" proves nothing if the item was substituted.
- **Decision:** 1.06 delivers the cart flow. The content load becomes **`Y.01 — Drop content load`**,
  on demand, triggered when Vladimir delivers, mandatory before 2.05.
- **Alternatives considered:** *Hold — no new phase until Vladimir delivers* (offered to Lazar as B;
  rejected: the cart flow must be built regardless, so holding is delay that buys nothing and makes
  the photos arrive no sooner). *Build 1.06 as the Phase Plan describes it* (rejected: it would tell
  Code to rebuild pages that already exist — and `Trajanov-V2-Plan.md` states that where the plan and
  the repo disagree, the repo is right and the file is stale).
- **Consequences:** The plan is reordered and `Trajanov-V2-Phase-Plan.md` needs editing, including its
  critical-path diagram. 1.07 shrinks to hosted Supabase, Resend, and real Turnstile keys. Phase 1.05
  merges before this branch is cut, so no two branches run in parallel and no state file is contended.
  **This does not make Vladimir's assets arrive one day sooner** — the parallel track is untouched and
  the photos remain the critical path to launch. Lazar's call, 2026-07-15.
- **Links:** `D-1.04-16` · `Trajanov-V2-Phase-Plan.md` · Phases 1.06, 1.07, 1.08, Y.01

### D-1.06-2 · 2026-07-15 · Extend the fresh-session PR review to Phase 1.06
- **Status:** Superseded by `D-1.06-11` (merge gate waived by the operator, 2026-07-15)
- **Context:** `D-0-3` waived the house review gate and scoped its replacement — a fresh Claude Code
  session reviewing the PR before merge — to Phases 1.03 and 1.04, on the grounds that concurrency
  bugs are the class manual testing cannot catch. 1.06 changes no concurrency logic. It changes what
  is passed to it.
- **Decision:** A fresh Claude Code session — one that did not write the code — reviews this phase's
  PR against this brief before merge.
- **Alternatives considered:** Follow `D-0-3` literally and skip it — rejected: the failure this phase
  exists to prevent is "the order names a different shirt than the customer picked." It is silent, it
  survives a single manual test whenever the stand-in happens to match what the tester chose, and it
  lands on a doorstep as a cash demand for the wrong item. That is a `D-0-6`-class misrepresentation
  arriving through the code instead of the photographs.
- **Consequences:** One extra session and one extra step before merge. Does **not** extend `D-0-3` to
  any other phase; 1.05's precedent stands.
- **Links:** `D-0-3` · `D-0-6` · `D-1.04-16` · Phase 1.06

### D-1.06-3 · 2026-07-15 · Photo and fabric/care DB columns deferred to Y.01
- **Status:** Accepted
- **Context:** The option Lazar approved on 2026-07-15 included adding the photo and fabric/care
  database columns in 1.06, on the grounds that they are unblocked — a column can be built without a
  photo. `current-state.md`'s placeholder register notes neither has a DB column yet.
- **Decision:** They land with `Y.01 — Drop content load`, not here.
- **Alternatives considered:** Build them now as approved — rejected: a nullable column that nothing
  reads and nothing tests is speculative work, and it puts a migration into a PR whose single job is
  the cart flow, muddying the fresh-session review that `D-1.06-2` just bought.
- **Consequences:** Y.01 carries a migration as well as a config edit, so it is an afternoon rather
  than an hour. This narrows what Lazar approved — surfaced to him in chat on 2026-07-15 rather than
  changed quietly.
- **Links:** `D-1.06-1` · Phase Y.01

### D-1.06-4 · 2026-07-15 · The Vercel project is created in Phase 1.07
- **Status:** Accepted
- **Context:** No phase creates it. `00_stack-and-config.md` records Vercel Hobby as pinned in 1.01,
  but 1.01 never deployed — `current-state.md` reads `Deployed: nowhere` and
  `Vercel project: Not created`, and `D-1.03-5` made local-only explicit. Phase 2.05 lists "env vars
  in prod," which presupposes a project nobody makes. Meanwhile **Part 1's own stated goal is "a
  working drop store on a preview URL, with one real order proven end-to-end"** — and 1.08 cannot
  meet that from localhost. Real Turnstile keys (owed-verification register #5) bind to a hostname,
  so they cannot be configured at all until something is deployed.
- **Decision:** The Vercel Hobby project is created in **1.07**, alongside the hosted Supabase
  project, Resend, and the real Turnstile keys. 1.07 becomes a **Cowork + Code** phase — Cowork
  creates the accounts and sets the environment variables in the dashboards, Code wires and verifies.
  1.07 is renamed `Deploy + hosted Supabase + Resend + real keys`.
- **Alternatives considered:** *Leave it to 2.05* — rejected: 1.08 is a hard gate that must clear the
  owed-verification register to zero, and two of its four rows (hosted-Supabase parity, real Turnstile
  keys) cannot clear without a deployment; deferring means 1.08 either passes dishonestly or does not
  pass. *A separate deploy phase between 1.07 and 1.08* — rejected: it is the same four accounts and
  the same set of environment variables, so splitting it doubles the ceremony for no review benefit.
- **Consequences:** **This is the moment `D-0-2` stops being theoretical** — the Hobby ToS violation
  goes live the day the project exists. No new call is needed: `D-0-2` was Lazar's, made 2026-07-14
  with the terms verified against Vercel's live documentation, and the portability rule plus the
  pre-written X.01 migration are its mitigations. 1.07 grows and needs a Cowork brief as well as a
  Code one. `00_stack-and-config.md`'s `Pinned: 1.01` against Hosting is wrong today — correct it in
  1.07 with an appended change-log row recording the correction; that file is append-only and its
  history is never rewritten. Nothing about the domain changes: `trajanov.com` is still bought and
  pointed in 2.05.
- **Links:** `D-0-2` · `D-1.03-5` · `00_stack-and-config.md` · `Trajanov-V2-Phase-Plan.md` ·
  Phases 1.07, 1.08, 2.05, X.01

### D-1.06-5 · 2026-07-15 · The cart is a sessionStorage-backed external store, no new dependency
- **Status:** Accepted
- **Context:** The phase needed client-side cart state that survives a refresh and product → cart →
  checkout navigation within a session, but must **not** survive a closed tab (a cart that outlives
  the drop is a cart full of sold-out shirts — brief Task 3), and must never touch the database.
- **Decision:** The cart is a module-singleton external store read through React's `useSyncExternalStore`
  (`src/components/cart/cart-store.ts`), persisted to **sessionStorage**, with all the pure cart/cap
  logic in a React-free module (`src/lib/cart/cart.ts`). No new dependency; nothing writes to
  `variants`/`orders`/`order_items`.
- **Alternatives considered:** *localStorage* — rejected: it outlives the tab and the drop, so a
  returning customer opens a cart of sold-out shirts. *A state library (Zustand/Jotai)* — rejected: a
  dependency for trivial state, and `00_stack-and-config.md` must gate every new dependency. *React
  Context + a `useEffect` hydration* — rejected: it trips the `react-hooks/set-state-in-effect` lint
  rule and risks a hydration flash; `useSyncExternalStore` with a null server snapshot is the idiomatic
  fix and gives a clean `hydrated` flag. *URL/query params* — rejected: leaks the selection into the
  URL and is ugly.
- **Downside accepted:** sessionStorage is per-tab, so a cart does not sync across tabs and a new tab
  starts empty. Acceptable — the brief explicitly says the cart need not survive a closed tab.
- **Links:** `src/lib/cart/cart.ts` · `src/components/cart/cart-store.ts` · brief Task 3

### D-1.06-6 · 2026-07-15 · The cart cap is 2 TOTAL units per order, mirroring create_order (not the per-row CHECK)
- **Status:** Accepted
- **Context:** Brief Task 2: read what `create_order()` actually enforces before building the client
  cap. `create_order()` step 3 asserts the **sum** of quantities across the order is in `1..2`; the
  `order_items.qty` `1..2` CHECK is a looser per-row backstop that never binds once the total is capped
  at 2. The Plan says "max 2 units per order" — which **agrees** with the database.
- **Decision:** `MAX_UNITS_PER_ORDER = 2` caps **total units across the whole cart**, matching
  `create_order()` exactly. A cart at 2 units disables "+" and refuses further adds; the server still
  rejects any bypass with `TR003`. Client and server share the number by intent.
- **Alternatives considered:** A per-line cap of 2 — rejected: it would allow two lines × 2 = 4 units,
  which `create_order()` rejects with `TR003`, so the cart would happily build an order the server
  refuses.
- **Downside accepted:** None of substance — this records the Plan/DB agreement so a future reader does
  not "fix" the cap to a per-line rule. (Reported in the completion report §3: Plan and DB agree.)
- **Links:** `create_order.sql` · `src/lib/cart/cart.ts` · brief Task 2

### D-1.06-7 · 2026-07-15 · variant_id (and dropSlug) are exposed to the client; the client submits variant_id + qty only
- **Status:** Accepted
- **Context:** For the cart to name a real variant, the client must know each size's `variant_id`.
  `SizeOption` previously carried only `{label, available}`. The submission boundary must carry
  `variant_id` + `qty` and **nothing else** — no price, no name (brief Task 6).
- **Decision:** `SizeOption` gains `variantId` and the product view gains `dropSlug`; the cart records
  them, and `toOrderItems()` emits exactly `{variantId, quantity}`. The server snapshots
  `unit_price_mkd` inside `create_order()`.
- **Alternatives considered:** Keep variant ids server-only and resolve size → variant on the server at
  submit — rejected: it needs the client to send a product slug + size label plus a server lookup (more
  client-authored data, and a re-introduced server "pick a variant" step), for no gain — the size →
  variant map is already public.
- **Downside accepted:** Variant UUIDs appear in the page HTML. They are not secret: RLS makes the
  catalog (drops/products/variants) public-read, and every guard that matters runs in `create_order()`.
- **Links:** `src/types/drop.ts` · `src/lib/drop/state.ts` · `src/lib/orders/actions.ts` · brief Task 6

### D-1.06-8 · 2026-07-15 · The empty-cart guard lives in processOrder, returning a distinct "empty" outcome
- **Status:** Accepted
- **Context:** With the stand-in deleted, an empty-cart checkout can now reach the order path (brief
  Task 7). The rejection must be provable *before* `create_order()` and unit-testable.
- **Decision:** `processOrder` (the pure, injected-dependency core) rejects an empty `items` array
  first, returning `{status: "empty"}`, before Turnstile / rate-limit / `create_order`. The client also
  renders an empty state (no form, no submit), so this is the load-bearing backstop.
- **Alternatives considered:** Guard only in the server action — rejected: not unit-testable at the
  pure core, where the other "never reaches create_order" guarantees are proven. Guard only client-side
  — rejected: bypassable.
- **Downside accepted:** A new `OrderOutcome` variant ripples into the checkout message switch (mapped
  to a neutral "cart empty" message the client's own empty state normally pre-empts).
- **Links:** `src/lib/orders/process-order.ts` · `tests/orders/process-order.test.ts` · brief Task 7

### D-1.06-9 · 2026-07-15 · A second test product (test-tee-two) is seeded so the phase test can discriminate against the stand-in
- **Status:** Accepted
- **Context:** The phase test must prove the customer's chosen product survives to `order_items`, and
  must **fail against the stand-in** (brief Task 8 #1). The deleted stand-in picked the drop's *first*
  product's first in-stock variant, so a discriminating test needs a product that is NOT first.
  `test-open-drop` had a single product.
- **Decision:** `supabase/seed.sql` gains **`test-tee-two`** (`sort_order` 2, sizes M/L) in
  `test-open-drop`. The phase test chooses `test-tee-two/L`; the stand-in would have named
  `test-tee-black`. RED captured (order named `test-tee-black`), GREEN with the cart — both in the
  completion report.
- **Alternatives considered:** Rely on within-product variant array order — rejected: fragile.
  Insert fixtures inside the test — rejected: the shared local DB has no per-test product teardown, so
  rows would leak across suites.
- **Downside accepted:** `seed.sql` grows and a `supabase db reset` is needed to load it (done). It is
  test seed, **not** a migration — `create_order`, `expire_reservations`, and `supabase/migrations/`
  are untouched.
- **Links:** `supabase/seed.sql` · `tests/orders/checkout-items.test.ts` · brief Task 8

### D-1.06-10 · 2026-07-15 · Product-page add feedback is an inline message; the header cart badge stays unwired
- **Status:** Accepted
- **Context:** After an add there must be some feedback, and a size must be chosen before Add does
  anything (brief Task 4). The 1.02 handover draws neither a post-add confirmation nor a live header
  cart count, and the header is **out of scope** this phase.
- **Decision:** The `AddToCartPanel` shows an inline `aria-live` message: "Choose a size" when Add is
  pressed with no size (reusing `Product.chooseSize`), the cap notice at 2 units (reusing
  `Product.oneUnitLimit`), and "Added. — View cart" after a successful add (two new `Buy` strings).
  The header's `cartCount` badge is left at its default (0/hidden) — the header is untouched.
- **Alternatives considered:** A silent add — rejected: on COD the customer needs to know it worked.
  Wiring the header cart-count — rejected: the header is out of scope (brief), and it would make
  `SiteHeader` a client component consuming the cart.
- **Downside accepted:** A small affordance not drawn in the handover, and no live cart count in the
  header. Tokenised, minimal, and mostly built from existing copy; the header badge is a natural
  follow-up when the header is next in scope.
- **Links:** `src/components/product/AddToCartPanel.tsx` · `src/components/layout/SiteHeader.tsx` ·
  brief Task 4

### D-1.06-11 · 2026-07-15 · The fresh-session PR review for Phase 1.06 is waived; PR #6 merged without it
- **Status:** Accepted
- **Context:** `D-1.06-2` made a fresh Claude Code session's review of PR `#6` a merge blocker, on the
  grounds that the failure this phase prevents — an order naming a shirt the customer never picked — is
  silent and survives a single manual test. The author session (the one that wrote the code) flagged
  that it cannot be the reviewer ("do not review your own work") and offered either to run an
  independent fresh-context review before merging, or to merge with an explicit waiver. The operator
  (Petar) chose to merge now and waive the review.
- **Decision:** PR `#6` is merged to `main` **without** the `D-1.06-2` fresh-session review. `D-1.06-2`
  is superseded by this entry; owed-verification register item **#6 is waived** (not cleared by review).
- **Alternatives considered:** *Run the independent review first, merge if clean* — offered; the
  operator declined as unnecessary for now. *Hold for a separate operator-run session* — same.
- **Downside accepted:** The author's work merges to `main` with **no independent check** by a second
  party — precisely the check this phase's gate was created to guarantee, for the exact failure mode
  (the customer's chosen product/variant not being what reaches `create_order()`) that is silent on a
  single manual test. Mitigations still in force: the automated phase test (confirmed RED against the
  stand-in, GREEN against the cart), the full 46-test suite incl. the 10-vs-3 oversell gate, and the
  in-browser render check across both locales. This waiver is specific to PR `#6`; `D-0-3` is unchanged.
- **Links:** `D-1.06-2` · `D-0-3` · `current-state.md` owed-verification register #6 · Phase 1.06

---

## Phase 1.07 — Production accounts (Cowork)

*`D-1.07-1` … `D-1.07-3` are the **Cowork (ops) half's** decisions, made while standing up the
hosted Vercel / Supabase / Cloudflare Turnstile accounts. No code shipped. The **Code half's** 1.07
decisions, if any, continue from `D-1.07-4`.*

### D-1.07-1 · 2026-07-16 · Hosted Supabase uses the LEGACY anon/service_role JWT keys, not the new sb_publishable/sb_secret keys
- **Status:** Accepted
- **Context:** Supabase now issues two key families — the legacy `anon` / `service_role` JWTs and the
  newer `sb_publishable…` / `sb_secret…` keys. Every prior phase (1.03–1.06) was built and tested
  against the legacy keys, the local Supabase CLI only supports legacy keys, and the env-var names in
  use (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) map to the legacy pair.
- **Decision:** Capture the hosted project's **legacy** `anon` + `service_role` keys and set them in
  Vercel (Production + Preview, Sensitive).
- **Alternatives considered:** Adopt the new `sb_publishable…` / `sb_secret…` keys — rejected: it
  diverges from what every prior phase was built and tested against and risks failing the hosted-parity
  check (owed item #4) on a key format never exercised locally.
- **Downside accepted:** The legacy JWT keys are the older mechanism Supabase is steering new projects
  away from; a future move to the new keys is net-new work (a key swap + a re-verify). No functional
  cost today — hosted matches local.
- **Links:** `Ops-Handoff-Phase-1.07.md` · owed-verification #4 · `completions/Part-1-Phase-07-Cowork-Completion.md` §3

### D-1.07-2 · 2026-07-16 · Turnstile widget mode = Managed
- **Status:** Accepted
- **Context:** The Cowork brief said "match the mode used locally with the dummy test keys," but the
  local `.env.local` is not visible to Cowork, so the locally-used mode could not be read directly. A
  live Cloudflare Turnstile widget ("Trajanov store") had to be created with some mode.
- **Decision:** Create the widget in **Managed** mode (Cloudflare's recommended default). Mode is
  changeable from the dashboard without changing the site or secret keys.
- **Alternatives considered:** Guess Invisible / Non-interactive — rejected: same risk of mismatching
  local behaviour, with no upside over the recommended default.
- **Downside accepted:** The mode may not match whatever the local dummy-key setup used. **The Code
  half of 1.07 must confirm the deployed behaviour matches local and switch the mode if needed** — a
  dashboard toggle, no key change.
- **Links:** `D-1.04-8` (Turnstile against dummy keys) · owed-verification #5 · `completions/Part-1-Phase-07-Cowork-Completion.md` §3

### D-1.07-3 · 2026-07-16 · Hosted Supabase creation-time Security toggles left at their defaults
- **Status:** Accepted
- **Context:** Creating the hosted Supabase project exposed creation-time security toggles — Enable
  Data API = on, Automatically expose new tables = on, automatic RLS = off. The migrations set RLS and
  grants explicitly (catalog read-only; `orders`/`order_items` deny-all; functions `service_role`-only
  per `D-1.03-9`), so the real security comes from the migrations, not these toggles.
- **Decision:** Leave all three toggles at their defaults, keeping the hosted project standard for the
  migrations that were tested locally.
- **Alternatives considered:** Disable "Automatically expose new tables" (Supabase's own suggestion) —
  deferred to avoid diverging from the locally-tested setup before the migrations have even run against
  hosted.
- **Downside accepted:** "Auto-expose new tables" means a future table added without an explicit
  RLS/grant posture could be reachable by the anon key. **The Code half of 1.07 must confirm, after the
  migrations run, that `orders`/`order_items` are not reachable by the anon key** on the hosted project
  — exactly owed item #4's parity check.
- **Links:** `D-1.03-9` (RLS/grants posture) · owed-verification #4 · `completions/Part-1-Phase-07-Cowork-Completion.md` §3

### D-1.07-4 · 2026-07-16 · Hosted parity is proven by running the real test suite against the hosted database, once, while it is empty — then resetting it
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.07 Code brief
- **Context:** Owed-verification #4 (hosted-Supabase parity) has been open since 1.03. The schema,
  `create_order()`, `expire_reservations()`, the pg_cron schedule and the rate-limit table are proven
  only against local Supabase (Colima). Inspection alone cannot prove that the atomic decrement holds
  on the real host under real concurrency.
- **Decision:** Export the hosted credentials and run the **real** 46-test suite against Frankfurt,
  once, while the database is still empty — including the 10-vs-3 oversell gate — then reset the hosted
  database so the `TRJ-####` sequence starts at 1 again.
- **Alternatives considered:** Prove parity by inspection only (`cron.job` count, a few RLS probes) —
  rejected: it would confirm the objects exist without ever exercising the one behaviour that matters,
  the atomic decrement under concurrency.
- **Downside accepted:** Test rows and an advanced `TRJ-####` sequence briefly exist on the production
  database. Mitigated by doing it before any real data exists and resetting afterwards — **this window
  does not come back.**
- **Links:** owed-verification #4 · `D-1.03-5` · `D-1.04-1` · Phase 1.07 Code brief

### D-1.07-5 · 2026-07-16 · Production is verified from a CLI deploy of the phase branch, before the PR merges
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.07 Code brief
- **Context:** The six Vercel env vars do not take effect until a deploy happens. Verifying them
  requires production to be serving this phase's code, but this phase's code is not yet reviewed.
- **Decision:** Verify production from `npx vercel --prod` run on the phase branch, **before** the PR
  merges — not from a preview URL (Turnstile will not accept preview hostnames, `D-1.07-6`) and not
  after the merge.
- **Alternatives considered:** Merge first, verify after — rejected: it would put unverified real-key
  behaviour on `main` and make the verification a post-hoc formality.
- **Downside accepted:** Unreviewed branch code serves the production URL for the length of this phase.
  Acceptable while the site has no domain, no customers, and one ended test drop; the merge redeploys
  the same commit.
- **Links:** `D-1.07-6` · owed-verification #5 · Phase 1.07 Code brief

### D-1.07-6 · 2026-07-16 · Turnstile hostnames stay `trajanov-v2.vercel.app` + `localhost`; bare `vercel.app` is not added
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.07 Code brief
- **Context:** Vercel preview deployments get random `*.vercel.app` subdomains. The Turnstile widget
  "Trajanov store" accepts only `trajanov-v2.vercel.app` and `localhost`, so a preview URL cannot pass
  the bot check (flagged by Cowork, `completions/Part-1-Phase-07-Cowork-Completion.md` §3.5).
- **Decision:** Leave the hostname list exactly as it is.
- **Alternatives considered:** Add bare `vercel.app` so preview deployments pass — rejected: it would
  let **any** `*.vercel.app` host on the internet use this widget.
- **Downside accepted:** Turnstile cannot be exercised on preview URLs at all — every Turnstile check
  happens on production or localhost. This is what forces `D-1.07-5` (verify from a production CLI
  deploy rather than a preview).
- **Links:** `D-1.07-2` · `D-1.07-5` · owed-verification #5 · Phase 1.07 Code brief

### D-1.07-7 · 2026-07-16 · Owed item #5 (real Turnstile keys) narrows rather than closes in 1.07
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.07 Code brief
- **Context:** 1.07 can prove the production build serves the real site key and that the real secret
  authenticates against Cloudflare's Siteverify. It cannot prove that Cloudflare actually challenges a
  bot on a real order — that needs a **live** drop, and 1.07 deliberately does not create one (the only
  committed drop is `test-drop`, ended and null-priced, `D-1.04-12`).
- **Decision:** Rewrite register row #5 to say exactly what is proven and what is not, and carry the
  remainder to **1.08**. **Do not delete the row.**
- **Alternatives considered:** Close #5 on the strength of the site-key + Siteverify evidence —
  rejected: it would mark "bot protection works" verified on evidence that never involved a bot, which
  is exactly the kind of debt 1.08 exists to catch.
- **Downside accepted:** The register does not shrink by this item in 1.07, and 1.08's clearing job is
  correspondingly larger.
- **Links:** `D-1.04-8` · `D-1.04-12` · owed-verification #5 · Phase 1.07 Code brief

### D-1.07-8 · 2026-07-16 · 1.07 ships without Resend; order email becomes on-demand phase `Z.01`, mandatory before 1.08
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.07 Code brief
- **Context:** Resend was scoped into 1.07 by the Phase Plan, and the Cowork half assumed it would fold
  into 1.08. It is blocked on Vladimir's email address, which does not exist (`facts.md` §5;
  placeholder register #5). No `RESEND_API_KEY` / `ORDER_NOTIFICATION_EMAIL` was set in Vercel.
- **Decision:** Strike Resend and order email from 1.07 entirely — no key, no send code, no stub. Create
  on-demand phase **`Z.01 — Order email (Resend)`**, triggered by Vladimir's email address arriving,
  **mandatory before 1.08**, and put it on the critical path.
- **Alternatives considered:** Fold Resend into 1.08 (what the Cowork report assumed) — rejected: 1.08
  is explicitly a **no-new-features** gate whose own DoD is a real order end to end, and **a gate that
  builds the feature it then verifies is not a gate.**
- **Downside accepted:** One more phase and one more PR, and **1.08 now has a hard dependency on a phone
  call nobody has made yet** — the project's critical path now runs through Vladimir's email address.
- **Links:** `facts.md` §5 · placeholder register #5 · `Trajanov-V2-Phase-Plan.md` (`Z.01`, critical path) · Phase 1.07 Code brief

### D-1.07-9 · 2026-07-16 · Hosted credentials live in a separate gitignored `.env.hosted`, not in `.env.local`
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly, this phase)
- **Context:** The brief's Task 2 says to fill `.env.local` with the **hosted** values. But Task 5 also
  requires running the suite against hosted **and then re-running it against local** to confirm 46 still
  pass. `tests/setup.ts` loads `.env.local` via `process.loadEnvFile`, so a `.env.local` holding hosted
  values makes the local re-run impossible without editing the file back — mid-phase, by hand, under no
  test. Verified empirically that **exported env vars take precedence over `process.loadEnvFile`**, so
  both targets can coexist.
- **Decision:** Keep `.env.local` as the **local** (Colima) config it already is, and put the hosted
  values in a **separate gitignored `.env.hosted`** (covered by `.gitignore:34` `.env*`; proven with
  `git check-ignore -v`). The hosted parity run sources `.env.hosted` and exports; the local re-run is
  the default with nothing exported.
- **Alternatives considered:** (a) Follow the brief literally and overwrite `.env.local` with hosted
  values — rejected: it silently points `npm run dev`, `npm test` and `npm run sync:drop` at the
  **production** database by default, which is how a stray local test run writes a row to Frankfurt.
  (b) Swap the file back and forth between the two runs — rejected: a hand-edit of a secret file, twice,
  in the middle of the one phase that must not leak a secret.
- **Downside accepted:** One more untracked file on the operator's machine, and one more thing to keep
  out of git (mitigated: `.env*` already covers it, and it is proven ignored). `.env.example` is not
  updated to mention it, since `.env.example` documents the app's own variables and `.env.hosted` is an
  admin convenience, not a runtime input.
- **Links:** `D-0-1` (public repo / secrets rule) · `D-1.03-12` (`SUPABASE_DB_URL` is local/test only) · `tests/setup.ts`

### D-1.07-10 · 2026-07-16 · The hosted parity run exports all four Supabase vars, not just `SUPABASE_DB_URL`
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly, this phase)
- **Context:** The brief's Task 5 says "Export the hosted `SUPABASE_DB_URL` and run `npm test`." But
  `tests/helpers/db.ts` builds its anon client from `NEXT_PUBLIC_SUPABASE_URL` +
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` and its admin client from `NEXT_PUBLIC_SUPABASE_URL` +
  `SUPABASE_SERVICE_ROLE_KEY` — only the raw-SQL suites use `SUPABASE_DB_URL`. Exporting the DB URL
  alone would run the SQL suites against **Frankfurt** while the RLS/PostgREST suites quietly ran
  against **local**, and report 46/46.
- **Decision:** Export all four hosted values together for the parity run, and assert inside the run
  that the anon/service clients are pointed at the hosted host before trusting the result.
- **Alternatives considered:** Follow Task 5 literally — rejected: it produces a **false pass** on the
  exact item (#4) this phase exists to close, and the RLS check (Task 6) is the half that would have
  been skipped.
- **Downside accepted:** A deviation from the brief's literal wording, recorded here and in §3/§4 of the
  completion report. None technically — this is strictly more of the suite hitting hosted, which is what
  the brief's own DoD ("All 46 must pass against hosted") requires.
- **Links:** `D-1.07-4` · `tests/helpers/db.ts` · `tests/setup.ts` · owed-verification #4

### D-1.07-11 · 2026-07-16 · The hosted `SUPABASE_DB_URL` uses the SESSION pooler, not the direct connection the brief specifies
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly, this phase)
- **Context:** The brief's credentials table says to take the **direct** Postgres URL from Supabase →
  Connect. `db.kmuocwmevyyuhcvwoebf.supabase.co` publishes **only an AAAA record — it is IPv6-only**, and
  the operator's machine has **no global IPv6 address** (only VPN link-local `utun` default routes).
  macOS `getaddrinfo` therefore suppresses the AAAA, so `dns.resolve6` finds the address while
  `dns.lookup`, `nc`, `psql`, `postgres.js` and `supabase db push` all fail identically with `ENOTFOUND`.
  A control lookup of `google.com` returned **zero** IPv6 addresses, confirming the cause is the host's
  lack of IPv6 rather than anything about this project. Supabase's own Connect dialog labels the Session
  pooler: *"Only recommended as an alternative to Direct Connection, when connecting via an IPv4 network."*
- **Decision:** Use the **session** pooler —
  `postgresql://postgres.kmuocwmevyyuhcvwoebf@aws-0-eu-central-1.pooler.supabase.com:5432/postgres` —
  for `SUPABASE_DB_URL` in `.env.hosted`. Verified: it resolves to real IPv4 addresses, connects, reports
  PostgreSQL 17.6, and **supports prepared statements** (which `postgres.js` uses by default).
- **Alternatives considered:** (a) The **transaction** pooler on **6543** — rejected: transaction mode does
  not support prepared statements, so `postgres.js` would need `prepare: false`, which means **editing the
  test helpers to suit the host** — the brief explicitly forbids changing code to make hosted pass. (b) Get
  IPv6 working on the operator's machine (or a tunnel) — rejected: it makes the phase depend on the
  operator's ISP/VPN, and every future operator would hit the same wall. (c) The IPv4 add-on — rejected:
  paid, and `D-0-2`/cost discipline says a paid tier is a decision and a phase, never a silent upgrade.
- **Downside accepted:** The parity run reaches Postgres through **Supavisor** rather than a raw socket, so
  it proves the schema/functions/RLS but not the direct-connection path itself. This is acceptable because
  **the app never uses `SUPABASE_DB_URL` at all** — the runtime talks PostgREST over HTTPS
  (`D-1.03-12`: this var is local/test only). The pooler is an admin/test transport, not a production one,
  so nothing about the deployed store depends on this choice. Also: the pooler's connection limit (pool
  size 15, Nano compute) sits under the 10-vs-3 oversell test's concurrency — watched, and it passed.
- **Links:** `D-1.03-12` · `D-1.07-4` · `D-1.07-9` · `D-0-2`

### D-1.07-12 · 2026-07-16 · The Supabase DB password was reset, and an account access token minted, to unblock the Code half
- **Status:** Accepted
- **Decided by:** Petar (operator) — chosen explicitly in-session after the alternatives were put to him
- **Context:** The Cowork half left the DB password only in the operator's password manager, and marked all
  six Vercel env vars **Sensitive** — which makes them **write-only**: `vercel env pull` returns every one
  as an empty string. So the Code half could not obtain a single credential from Vercel, and Cowork's §3.4
  claim that Sensitive was "cosmetic only, no functional impact" is **true for the deployed build but false
  for the Code half**. `supabase login` additionally refuses its browser flow in a non-TTY shell
  (`LegacyLoginMissingTokenError`), requiring an access token instead.
- **Decision:** Mint a Supabase **personal access token** (`claude-code-phase-1.07`, 30-day expiry, expires
  2026-08-15) to drive `link`/`db push`/`gen types --linked`, and **reset the project DB password** to a
  locally-generated 48-char hex value written only to gitignored `.env.hosted`.
- **Alternatives considered:** Have the operator paste the existing password from his password manager —
  **recommended by Code and rejected by the operator.** It would have kept the password-manager entry valid
  and left Lazar's owed item #3 as "confirm it is saved" rather than "save the new one."
- **Downside accepted:** (1) **Lazar's owed item #3 changes meaning** — the password in the password manager
  is now **stale and wrong**; the new one exists only in `.env.hosted` on Petar's machine and must be saved,
  or it is unrecoverable. (2) The access token controls the whole Supabase account and **appeared in a
  screenshot in the working session transcript** — it must be revoked at phase close. (3) Nothing else used
  the old password (no Vercel var, no CI), so the reset broke no live connection.
- **Links:** `D-0-1` · `D-1.07-9` · owed-to-Lazar #3 · `completions/Part-1-Phase-07-Cowork-Completion.md` §3.4

### D-1.07-13 · 2026-07-16 · `seed.sql` is applied to the hosted database for the parity run, against its own header warning, then removed by the reset
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly, this phase)
- **Context:** The brief's DoD requires "`npm test` against the hosted `SUPABASE_DB_URL` → **46 pass**".
  Those tests resolve fixtures through `getVariantId('test-tee-black','M')` etc., which only exist in
  `supabase/seed.sql`. **`supabase db push` does not apply `seed.sql`** — only a local `supabase start` /
  `db reset` does. So against hosted the suite cannot even reach its assertions; it fails on fixture
  lookup, for reasons that say nothing about parity. The brief did not anticipate this.
  **`seed.sql`'s own first line says: "NEVER runs against a deployed database (`D-1.03-5`); local
  `db reset` only."**
- **Decision:** Apply `seed.sql` to hosted **only** for the duration of the parity run, then remove it with
  the reset that `D-1.07-4` already mandates. The seed's warning is respected in substance: it exists to
  stop invented prices/names (`999 MKD`, "ТЕСТ — Маица 01") being mistaken for real content on a **live**
  store. Here the database has **no real data**, the store has no domain and no customers, every slug is
  `test-`-prefixed by deliberate design ("instantly obvious rather than plausible"), and the rows are gone
  minutes later. `D-1.03-5` — the decision that warning cites — is the "local only, no deploy" decision that
  **this phase supersedes**.
- **Alternatives considered:** (a) Skip the hosted suite and prove parity by inspection — rejected: that is
  exactly the alternative `D-1.07-4` already rejected, and it would leave the atomic decrement unproven on
  the real host. (b) Write a separate hosted-only fixture — rejected: a second fixture that drifts from
  `seed.sql` would make the hosted run test something the local run doesn't, defeating the point of a
  **parity** check. (c) Point the tests at real drop config — rejected: the only committed drop is
  `test-drop`, ended and null-priced (`D-1.04-12`); the concurrency test needs an **open** drop with stock 3.
- **Downside accepted:** Invented test prices/names touch the production database for a few minutes, and
  the `TRJ-####` sequence advances. Both are erased by the reset, which is verified afterwards. **If the
  reset had failed, `test-` rows would sit in production** — which is why the reset is verified explicitly
  rather than assumed.
- **Links:** `D-1.07-4` · `D-1.03-5` (superseded by this phase) · `D-1.04-12` · `supabase/seed.sql`

### D-1.07-14 · 2026-07-16 · A new migration explicitly REVOKEs write privileges on the catalog tables, closing a hosted-only defence-in-depth gap
- **Status:** Accepted
- **Decided by:** Petar (operator) — chosen explicitly in-session after the finding and both options were put to him
- **Context:** The hosted parity run (`D-1.07-4`) failed **1 of 46**: `tests/rls/anon-access.test.ts >
  cannot UPDATE variants stock`. Root cause, measured on both environments:
  hosted `anon` held `DELETE,INSERT,REFERENCES,SELECT,TRIGGER,TRUNCATE,UPDATE` on
  `drops`/`products`/`variants`; local `anon` held only `REFERENCES,SELECT,TRIGGER,TRUNCATE`.
  `schema.sql:150-152` states the assumption — *"Local Supabase does NOT auto-expose new public tables
  ... a table is unreachable ... until GRANTed here. We grant deliberately and narrowly"* — which is true
  locally (`auto_expose_new_tables` unset in `config.toml`) and false on hosted, where Cowork left the
  creation-time **"Automatically expose new tables" toggle ON** (`D-1.07-3`). The tables were therefore
  created with anon already holding everything, so `grant select` added nothing and nothing removed the
  rest. **The pattern is exact: every object the migrations REVOKE explicitly (orders, order_items,
  order_attempts, and all three functions) matched local perfectly; the catalog — the only object trusting
  the default to be empty — was the only one that diverged.**
- **No data was ever exposed.** RLS was on with SELECT-only policies, so every anon write matched no policy
  and touched 0 rows. Verified empirically on hosted before the fix: `stock 5 -> 5`, row count unchanged,
  INSERT rejected `42501`, `orders`/`order_items` denied `42501` on every verb, all three functions
  `anon=false`. The defect was **depth, not a hole**: hosted had ONE barrier where local has two.
- **Decision:** Add `20260716120000_catalog_grant_hardening.sql` — `revoke insert, update, delete, truncate`
  on the three catalog tables from `anon`, `authenticated`, **and `public`** — then re-assert `grant select`.
  Applied to local via `db reset` (46 pass) and pushed to hosted (46 pass). Both now report
  `REFERENCES,SELECT,TRIGGER`.
- **Alternatives considered:** (a) **Report only and ship 45/46** — rejected by the operator: it leaves
  production one RLS toggle or one stray permissive policy away from anon writing the catalog, and
  `schema.sql:162` already names the consequence ("anybody on the internet set stock to whatever they
  like"). (b) **Turn the dashboard toggle off instead** — rejected: it does **not** retroactively revoke
  privileges already granted, so it fixes nothing on these three tables; a migration also survives the
  toggle being flipped back, and a step living only in a dashboard is a step that gets lost. (c) **Edit the
  failing test to accept "0 rows" as a pass** — rejected outright: that is editing the test to suit the
  host, which is what the brief forbids, and it would have deleted the only evidence of the gap.
- **Downside accepted:** The phase's scope grew by one migration and a re-push — the brief did not ask for a
  schema change. Justified because the fix makes hosted match `schema.sql`'s **own stated intent** rather
  than bending code to suit a host, and because the test now passes for the **right reason** (the grant
  denies the write) rather than being made to go green.
- **STILL OPEN — the toggle:** "Automatically expose new tables" remains **ON** on hosted. This migration
  fixes today's tables; **any future table** (e.g. `Y.01`'s photo/fabric work) will again be created with
  anon holding everything. On the register for Lazar.
- **Links:** `D-1.07-3` · `D-1.07-4` · `D-1.03-9` · `schema.sql:150-152,162` · `supabase/config.toml` (`auto_expose_new_tables`)

### D-1.07-15 · 2026-07-16 · `supabase db reset --linked` is broken against this schema; the reset was completed by hand
- **Status:** Accepted (finding — no code change)
- **Decided by:** Claude Code (on-the-fly, this phase)
- **Context:** `D-1.07-4` mandates resetting the hosted database after the parity run.
  `npx supabase db reset --linked --yes` **failed halfway**: it dropped every table, type, function and the
  `pg_cron` extension, then failed re-applying `schema.sql` with
  `ERROR: relation "order_number_seq" already exists (SQLSTATE 42P07)`. **The reset drops tables and types
  but not sequences**, so its own re-apply hits the sequence it left behind. It left the database wiped,
  with migration history empty and one orphan sequence — i.e. **the CLI's reset cannot reset this schema**.
- **Decision:** Recover by hand: `drop sequence public.order_number_seq cascade`, then
  `supabase db push --linked --include-all` to rebuild all 8 migrations from an empty history. Verified
  afterwards: **0 rows in all 6 tables, `order_number_seq` last_value=1 is_called=false (next order
  TRJ-0001), 2 active cron jobs, all functions present, anon grants narrowed.**
- **Alternatives considered:** (a) Leave the hosted database in the half-reset state — rejected: it was
  wiped and unusable; the store would not have rendered. (b) Re-run `db reset --linked` — rejected: it fails
  the same way every time; the orphan sequence is deterministic. (c) Report it and stop the phase —
  rejected: nothing real was lost (the database was deliberately empty, `D-1.07-4`), and the recovery is two
  well-understood commands whose result is verified.
- **Downside accepted:** The documented reset path does not work on this project, so **anyone who runs
  `supabase db reset --linked` in future gets a wiped database and a failed rebuild.** Recorded here rather
  than worked around silently. It cost nothing this time only because the reset was performed against an
  empty database, exactly as `D-1.07-4` designed — **on a database with real orders this would have been a
  data-loss event with no backup on the free tier.** Do not run it against a live database.
- **Links:** `D-1.07-4` · `D-1.07-13` · Supabase CLI `2.109.1`

---

## Phase Z.01 — Order notification email (Resend)

*`D-Z.01-1` … `D-Z.01-4` are the orchestrator's, handed down verbatim in the Phase Z.01 Code brief and
logged here before any code was written. Executor (Code) decisions start at `D-Z.01-5`.*

### D-Z.01-1 · 2026-07-18 · Customer confirmation is on-screen only; no customer email collected
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase Z.01 Code brief
- **Decision:** The customer's confirmation is the on-screen success state; no customer email address is
  collected and no customer receipt email is sent.
- **Alternative rejected:** Add an email field to checkout and send the customer a receipt.
- **Downside accepted:** Customers get no email confirmation — but the confirm channel is Vladimir's phone
  call (Plan §8), and checkout stays minimal for the impatient mobile buyer (Plan §3).
- **Links:** `Trajanov-V2-Plan.md` §8 · §4 (checkout fields) · `src/messages/{mk,en}.json` `Order.success`

### D-Z.01-2 · 2026-07-18 · Sender is `onboarding@resend.dev` until `trajanov.com` is purchased + verified
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase Z.01 Code brief
- **Decision:** The notification's from-address is Resend's shared `onboarding@resend.dev` for now.
- **Alternative rejected:** Wait for the domain before building.
- **Downside accepted:** Notifications come from a generic Resend address (slightly less trustworthy, small
  spam-folder risk) until the branded domain lands — low impact, since these go only to Vladimir. A branded
  from-address on `trajanov.com` is owed to the domain/cutover work (2.05), not here.
- **Links:** `facts.md` §9 · Phase 2.05 · `ORDER_FROM_ADDRESS` in `src/lib/email/order-notification.ts`

### D-Z.01-3 · 2026-07-18 · Vladimir's email is the internal notification recipient only; NOT published on Contact yet
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase Z.01 Code brief
- **Decision:** Vladimir's email is wired as the internal notification recipient only; it is NOT published
  on the Contact page. The Contact-page email placeholder (placeholder register #5) stays.
- **Alternative rejected:** Display it publicly now (`facts.md` §5 says the email "gates the Contact page").
- **Downside accepted:** The Contact placeholder persists a while longer.
- **Rationale:** Do not publish a minor's personal email to a 12+ audience and to repo/page scrapers without
  his explicit sign-off — that sign-off has not been given.
- **Links:** `facts.md` §5 · placeholder register #5 · `src/app/[locale]/contact/page.tsx`

### D-Z.01-4 · 2026-07-18 · The Resend account is created under Vladimir's email address, and Lazar does it personally
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase Z.01 Code brief
- **Decision:** The Resend account is created under Vladimir's email address, and Lazar does it personally
  (not Cowork).
- **Alternative rejected:** Sign up under Lazar's email and reroute to Vladimir later, or have Cowork create it.
- **Downside accepted:** Vladimir must click one Resend confirmation link.
- **Rationale:** Free-tier delivery (no verified domain) only reaches the account's own address, so this is
  what makes the 1.08 "a real order reaches the fulfiller" test actually test Vladimir's inbox — and keeping
  Lazar as the only human who touches the address minimizes exposure of a minor's email.
- **Links:** Phase 1.08 · operator prerequisites (Phase Z.01 Code brief)

---

*`D-Z.01-5` onward are the executor's (Code), made while building Z.01.*

### D-Z.01-5 · 2026-07-18 · The notification is an injected `notifyOrder` dep on `processOrder`, awaited best-effort after create_order
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly, this phase)
- **Context:** The email must fire "after `create_order()` returns success" (Task 4) and must never fail,
  delay past a reasonable timeout, or roll back the order (Plan §8, `D-0-5`). `process-order.ts` is the
  repo's deliberately dependency-free, unit-testable order core (`D-1.06-8`); `actions.ts` wires the real
  dependencies to it.
- **Decision:** Add an optional `notifyOrder(input, orderNumber)` to `ProcessDeps`. `processOrder` calls it
  ONLY after `create_order()` succeeds, `await`ed inside a `try/catch` that swallows any failure — so the
  outcome is fixed to `{status:"ok"}` before the email is attempted and can never depend on it. `actions.ts`
  supplies the real closure (enrich lines → `sendOrderNotification`). `sendOrderNotification` never throws
  and bounds its own Resend call with an 8s timeout. This makes the "sends exactly once on success / not on
  failure / a throw leaves success" guarantees unit-testable purely, the way Turnstile-gates-create_order is.
- **Alternative rejected:** (a) Fire-and-forget (don't await) after the action returns — rejected: on Vercel
  serverless the function can be frozen/killed the instant the response is sent, silently dropping the very
  email this phase exists to send; `waitUntil` would fix it but is **Vercel-specific** and the portability
  rule (`00_stack-and-config.md`) forbids it. (b) Put the trigger only in `actions.ts` — rejected: it would
  move the load-bearing "never affects the order" guarantee out of the one module that has a pure test
  harness.
- **Downside accepted:** On a *rare* Resend hang the customer's success screen waits up to the 8s send
  timeout (plus a ≤4s enrichment bound) before rendering. Normal path adds well under a second. This is the
  price of `await`ing on a platform that cannot reliably defer work past the response — and the brief
  explicitly permits "a reasonable timeout".
- **Links:** `src/lib/orders/process-order.ts` · `actions.ts` · `Trajanov-V2-Plan.md` §8 · portability rule

### D-Z.01-6 · 2026-07-18 · The email names each line by a best-effort DB lookup (product/size), degrading to quantity-only
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly, this phase)
- **Context:** The email must carry "the product/variant/size/quantity ordered" (Task 3/4), but the cart —
  and therefore `OrderInput` — carries only `variant_id` + quantity (`D-1.06-7`); a UUID is useless to
  Vladimir. `create_order()` is untouchable (out of scope) and returns only order id/number/total.
- **Decision:** After the order succeeds, `resolveOrderLines()` does one `service_role` SELECT on `variants`
  (embedding `products.name_mk/name_en/slug`) for the ordered variant ids, bounded by a 4s `AbortSignal`
  timeout and fully wrapped. On any failure it degrades to quantity-only lines; the order number + customer
  details still reach Vladimir, who can pull the rest from Supabase (the DB is the record).
- **Alternative rejected:** (a) Put only variant ids + quantity in the email — rejected: unreadable, defeats
  the purpose. (b) Modify `create_order()` to return line details — rejected: it is explicitly out of scope
  and is the proven concurrency core. (c) Read `order_items` back by `order_id` — same extra read, no gain.
- **Downside accepted:** One extra read on the order path after success (bounded, best-effort, never blocks
  the customer response beyond its timeout). Product names render only as well as the config is filled — a
  null name falls back to `name_en` then the slug, never a fabricated name (`D-1.04-10`).
- **Links:** `src/lib/orders/actions.ts` (`resolveOrderLines`) · `D-1.06-7` · `D-1.04-10`

### D-Z.01-7 · 2026-07-18 · The on-screen confirmation copy is folded into `Order.success`, stating COD + the confirmation call
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly, this phase)
- **Context:** Task 5 / Plan §8 require the post-order on-screen state to tell the customer, in both locales,
  that this is cash on delivery **and** that they will be called to confirm. The existing `Order.success`
  stated only "received / reserved 48h"; COD lived in the always-visible summary panel (`Checkout.codSummary`)
  but the **call-to-confirm was nowhere**.
- **Decision:** Extend the existing `Order.success` string in both catalogs to a self-contained confirmation:
  order number + 48h reservation + COD + "we'll call you to confirm". No new message key (keeps the MK/EN key
  sets identical — the repo invariant), no new component.
- **Alternative rejected:** Add a separate confirmation key/banner component — rejected: more surface for the
  MK/EN key-set drift the repo guards against, for one status line. Leave it as-is — rejected: the
  call-to-confirm was genuinely missing, and Task 5 is a DoD item, not just a "verify existing" check.
- **Downside accepted:** COD is now stated in two places at once (the summary panel and the success line).
  Harmless redundancy; the success line is self-contained on purpose, so it reads correctly even if the
  summary panel layout changes. Humanizer pass run on both strings.
- **Links:** `src/messages/{mk,en}.json` `Order.success` · `Trajanov-V2-Plan.md` §8

---

## Phase 1.08 — Verification gate

*`D-1.08-1` and `D-1.08-2` are the orchestrator's, handed down verbatim in the Phase 1.08 brief.
Executor (Code) decisions start at `D-1.08-3`.*

### D-1.08-1 · 2026-07-18 · 1.08 runs as a machinery-verification gate against a stand-in rehearsal drop
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.08 brief.
- **Decision:** **1.08 runs as a machinery-verification gate against a stand-in rehearsal drop that uses
  Vladimir's real price (1199 MKD) and real sizes; names/photos/fabric remain placeholders and
  real-catalog verification is deferred to 2.04/2.05.**
- **Alternative rejected:** Wait for the full real catalog (photos, fabric, names, date) before running the
  gate at all.
- **Downside accepted:** The gate proves the machine, not the finished catalog — photos/fabric/names remain
  cutover blockers (placeholder register, 2.05); and a real-priced drop is briefly buyable on the public URL
  during the test (mitigated: not announced, closed immediately, test order deleted).
- **Links:** `facts.md` §7 · `src/config/products.ts` · Phases 2.04, 2.05

### D-1.08-2 · 2026-07-18 · Register #8 (branded from-address) is reclassified from owed-verification to the 2.05 cutover track
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 1.08 brief.
- **Decision:** **Register #8 (branded from-address on `trajanov.com`) is reclassified from the
  owed-verification register to the 2.05 cutover track.**
- **Alternative rejected:** Leave it in the owed-verification register.
- **Downside accepted:** None of substance — #8 cannot be cleared without the domain (unbought, 2.05), so
  leaving it there makes 1.08's "register to zero" impossible. The gate's register-to-zero condition covers
  #1, #2, #5, #6, #7.
- **Links:** `D-Z.01-2` · Phase 2.05 · owed-verification register

### D-1.08-3 · 2026-07-18 · The gate's Code half ran against hosted this session; the operator half + email prereq are deferred to a runbook (NEXT stays 1.08)
- **Status:** Accepted
- **Decided by:** Claude Code (executor, on-the-fly) — with the operator's explicit direction this session
  ("run the hosted verification now; the email prereqs are unconfirmed; skip the live order for now").
- **Context:** 1.08 is a "Code + Operator" gate. Its Code-verifiable half (facts + config, the concurrent
  oversell re-run, live pg_cron expiry, Turnstile enforcement, IP + phone rate limits) can run against the
  live Frankfurt DB with no human in the loop. Its other half is inherently human: a real order placed on a
  phone with a browser-solved Turnstile, the notification email landing in **Vladimir's** inbox, the design
  sign-off, the Instagram click-test, and the Supabase "auto-expose" toggle. The operator directed that the
  live order be skipped this session and flagged the Z.01 email prereqs (Resend account + Vercel keys) as
  **unconfirmed**.
- **Decision:** Run and evidence the **Code half** against hosted now, then **return hosted to its exact
  pre-session clean state** (seed fixtures removed, sequence reset to TRJ-0001). **Do NOT open a public
  buyable rehearsal drop** and **do NOT synthesise a fake end-to-end order.** Prove **Turnstile enforcement
  and the IP/phone rate limits at the exact server-side calls the Server Action makes** — Cloudflare
  Siteverify with the **real production secret** (`invalid`/`missing` → rejected; wrong-secret control →
  `invalid-input-secret`), and the `check_order_rate_limit` RPC + `create_order`'s `TR005` — rather than by
  hand-driving the deployed Next Server Action (which needs a browser-solved token / an open drop, i.e. the
  operator path). Package the human half — publish rehearsal drop → real order → verify DB + inbox → close →
  design sign-off / IG / toggle / housekeeping — as a step-by-step **operator runbook**. **`NEXT:` stays
  `1.08`** until the operator completes their half; the register is **not** claimed at zero.
- **Alternative rejected:** (a) Open a real-priced buyable drop on the public URL and attempt a synthetic
  end-to-end order without a human — rejected: no human can solve the real Turnstile, it exposes buyable
  merchandise publicly for no verification gain, and it is exactly the "briefly buyable" risk `D-1.08-1`
  says to minimise. (b) Set `NEXT: 2.01` and declare the register at zero now — rejected: dishonest, #1/#2/
  #6/#7 are genuinely still owed and the gate is the hard pre-Part-2 barrier. (c) Hand-craft a `Next-Action`
  POST to the deployed Server Action — rejected: brittle, and a malformed request rejected for the wrong
  reason would be a false "enforced" claim.
- **Downside accepted:** The gate does **not** fully pass this session — `#5` is cleared with Code evidence
  (per the brief's Task 5 definition), but register-to-zero, the "one real order end to end", the
  "notification email in Vladimir's inbox", and "rehearsal drop published then closed" DoD items remain
  **open** on the operator + the (unconfirmed) email prereqs. Turnstile/rate-limit enforcement is proven at
  the server-side RPC/Siteverify layer the action calls, not by a browser-driven end-to-end submit; the
  fully end-to-end path is the operator's live order. All of this is stated plainly in the completion report
  and the operator runbook.
- **Links:** `src/_project-state/completions/Part-1-Phase-08-Code-Completion.md` · `Part-1-Phase-08-Operator-Runbook.md` · owed-verification register (#1, #2, #6, #7) · `D-1.07-7` (#5) · `D-Z.01-4` (email prereq)

### D-1.08-4 · 2026-07-18 · The operator half was completed in the same session; the gate PASSED and NEXT advances to 2.01
- **Status:** Accepted (completes the deferral in `D-1.08-3` — that entry stays valid history; this records the follow-on)
- **Decided by:** Claude Code (executor) driving the operator through the runbook live, with the operator (Petar/Lazar) performing every human step.
- **Context:** `D-1.08-3` ran the Code half and deferred the operator half to a runbook, keeping `NEXT: 1.08`. Immediately afterward, in the **same session**, the operator chose to run the operator half interactively rather than later.
- **Decision:** Walked the operator through the full human half: (1) set up the Z.01 email prereqs (Resend account under Vladimir's email + `RESEND_API_KEY`/`ORDER_NOTIFICATION_EMAIL` in Vercel, redeployed); (2) synced the priced config to hosted and **briefly opened** the rehearsal `test-drop` (real 1199 MKD price + real sizes); (3) the operator placed a **real order (`TRJ-0001`) on a phone** — real Turnstile, real phone/address; (4) Code verified the DB (order row, atomic decrement 3→2, 48h reservation, 1199 total + price snapshot); (5) the operator confirmed the **MK notification email arrived in Vladimir's inbox** (`onboarding@resend.dev`, correct order number / line / customer block / COD copy); (6) Code **closed the drop, deleted the order + reservation, restored stock, reset the sequence to TRJ-0001, re-synced the ended window** — hosted re-verified clean; (7) the operator cleared **#1 design sign-off**, **#2 IG click-test**, and **#6 auto-expose toggle OFF**. With **#5** already cleared by Code and **#8** reclassified to 2.05 (`D-1.08-2`), the **owed-verification register is now EMPTY**. **`NEXT:` advances to `2.01` (Bilingual).**
- **Alternative rejected:** Leave the operator half for a later session per `D-1.08-3` — rejected because the operator was present and ready, and doing it live let Code verify the DB side and drive the open→order→verify→close window safely (drop open only for the test, closed immediately, test order deleted — exactly the `D-1.08-1` mitigation).
- **Downside accepted:** The rehearsal drop was briefly buyable on the public URL during the test (unannounced, ~minutes, closed immediately, order deleted — the accepted `D-1.08-1` cost). The hosted `test-drop` is now left carrying the real-priced colourways (ended, not buyable) instead of the old null-priced placeholders — this **matches the committed config** and is the intended rehearsal end-state. **Recommended housekeeping (L1–L4, L7) is still open** but is explicitly outside the gate's zero-condition.
- **Links:** `D-1.08-1` · `D-1.08-2` · `D-1.08-3` · `Part-1-Phase-08-Operator-Runbook.md` · owed-verification register (now empty)

---

## Phase 2.01 — Bilingual (Code)

*`D-2.01-1` … `D-2.01-5` are the orchestrator's, handed down verbatim in the Phase 2.01 brief
("Decisions already made") and logged here before any code was written. Executor (Code) decisions
start at `D-2.01-6`.*

### D-2.01-1 · 2026-07-19 · MK route slugs are Latin transliteration, not Cyrillic
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator), via Lazar — handed down verbatim in the Phase 2.01 brief.
- **Decision:** MK route slugs are **Latin transliteration** — `/katalog`, `/kosnicka`, `/naracka`,
  `/za-nas`, `/kontakt` — not Cyrillic.
- **Alternative rejected:** Cyrillic slugs (`/каталог`, `/кошничка`).
- **Downside accepted:** A Macedonian reader sees transliterated Latin in the address bar, which is less
  native than Cyrillic.
- **Reason:** Links get shared in Viber and Instagram bios, where Cyrillic paths percent-encode into
  unreadable strings (`/каталог` → `/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3`) and some clients mangle them.
- **Links:** `src/i18n/routing.ts` (`pathnames`) · `next.config.ts` (redirect table)

### D-2.01-2 · 2026-07-19 · Product-detail slugs stay single and shared across both locales
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 2.01 brief.
- **Decision:** `/katalog/[slug]` and `/en/catalog/[slug]` resolve the **same** product slug (from
  `src/config/products.ts` / the DB); the product token is not localised.
- **Alternative rejected:** Per-locale product slugs (`slug_mk`/`slug_en` columns).
- **Downside accepted:** An MK product URL carries a non-localised product token.
- **Reason:** Real product names do not exist yet (placeholder register #4, owner Vladimir); adding
  per-locale slug columns now would be a migration built on invented content.
- **Links:** `src/components/product/ProductCard.tsx` (object-form `Link`) · `src/lib/metadata.ts`

### D-2.01-3 · 2026-07-19 · Old paths redirect permanently (308), they do not 404
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 2.01 brief.
- **Decision:** `/catalog`, `/catalog/:slug`, `/cart`, `/checkout`, `/about`, `/contact` each **308** to
  their new MK slug. `/en/*` is untouched by these rules.
- **Alternative rejected:** Letting them 404 since the store has no traffic yet.
- **Downside accepted:** A small redirect table to carry forward (kept in lockstep with `pathnames`).
- **Reason:** The site has been publicly reachable since 1.07 and links may already exist; a dead link on
  a store that sells three times a year is expensive.
- **Links:** `next.config.ts`

### D-2.01-4 · 2026-07-19 · /styleguide is not localised
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 2.01 brief.
- **Decision:** `/styleguide` stays `/styleguide` and `/en/styleguide` — an internal review aid, not a
  customer surface.
- **Alternative rejected:** Localising the styleguide slug + its internal labels.
- **Downside accepted:** Its internal field labels stay English and its font-demo section renders Cyrillic
  in both locales (see `D-2.01-12`).
- **Links:** `src/i18n/routing.ts` · `src/app/[locale]/styleguide/page.tsx`

### D-2.01-5 · 2026-07-19 · Slugs are provisional until 2.02 confirms them
- **Status:** Accepted
- **Decided by:** Claude Chat (orchestrator) — handed down verbatim in the Phase 2.01 brief.
- **Decision:** The MK slugs are provisional; 2.02's native speakers confirm them. Changing one is a
  one-line edit in `routing.ts` plus one matching redirect row.
- **Alternative rejected:** Treating the slugs as final now.
- **Downside accepted:** A slug may change in 2.02, costing one `routing.ts` line + one `next.config.ts` row.
- **Reason:** The reviewers who can judge the Macedonian have not seen it yet.
- **Links:** `src/i18n/routing.ts` · `next.config.ts` (both carry a "keep in lockstep" comment)

*`D-2.01-6` onward are the executor's (Code), made while building 2.01.*

### D-2.01-6 · 2026-07-19 · The language switch reads the query at click time, not via useSearchParams
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `LanguageSwitch` preserves the current query string by reading `window.location.search`
  inside the click handler, rather than the `useSearchParams()` hook. It still switches locale in place
  via `router.replace({pathname, params, query}, {locale})` (next-intl's documented locale-switch shape),
  so the page and the `?preview` param survive.
- **Alternative rejected:** Use `useSearchParams()` and wrap `LanguageSwitch` in a `<Suspense>` boundary.
- **Downside accepted:** The query is only read on click (a click handler always runs client-side, so this
  is not a real limitation).
- **Reason:** `LanguageSwitch` sits in the header on **every** page, including the statically-prerendered
  About/Contact pages; `useSearchParams()` forces those into a CSR bail-out and **failed the build**
  ("useSearchParams() should be wrapped in a suspense boundary at page /[locale]/about"). Reading the
  query only on click keeps the switch a plain client component with no prerender cost.
- **Links:** `src/components/layout/LanguageSwitch.tsx`

### D-2.01-7 · 2026-07-19 · One shared ShippingNotice component + key, placed ABOVE Add-to-cart
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** A small new `ShippingNotice` component renders the one shared key `Common.shippingNotice`
  in both places (product buy panel + checkout COD block). On the product page it sits **above** the
  Add-to-cart control (in the sticky buy column); on checkout, above the Place-order button. The product
  page's existing below-the-fold "Shipping" detail (`Product.shippingBody`, from 1.02) is **left in place**.
- **Alternative rejected:** Reuse `Product.shippingBody` and drop the notice below the buy button; or inline
  the markup in both places without a component.
- **Downside accepted:** A new tiny component (the brief permits one if the notice needs it), and the
  product page now states shipping twice — a prominent buy-panel notice **and** the existing Shipping detail
  section. They agree (NMK only + COD); the redundancy is mild and the prominent notice is the required one.
- **Reason:** "Visible without scrolling past the Add-to-cart control at 390px" is satisfied unambiguously by
  placing it above the button; a shared component keeps the two placements from drifting.
- **Links:** `src/components/system/ShippingNotice.tsx` · `Common.shippingNotice` (traces to `facts.md` §7,
  VERIFIED) · `src/app/[locale]/catalog/[slug]/page.tsx` · `src/components/checkout/CheckoutForm.tsx`

### D-2.01-8 · 2026-07-19 · formatMkd takes an explicit locale argument
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `formatMkd(amount, currency, locale)` gains a required `locale` param and groups the number
  for that locale (`mk` → `1.199`, `en` → `1,199`); the amount and currency are unchanged (MKD always).
- **Alternative rejected:** Read the active locale inside `format.ts` (via a next-intl server call), keeping
  the two-arg signature.
- **Downside accepted:** Both call sites must pass the locale (both already have it from `useLocale()` /
  `getLocale()`).
- **Reason:** `format.ts` is a tiny, dependency-free, unit-testable helper; threading the locale in keeps it
  pure rather than coupling it to next-intl's request context. No currency conversion exists anywhere.
- **Links:** `src/lib/format.ts` · `src/components/product/ProductCard.tsx` · `src/app/[locale]/catalog/[slug]/page.tsx`

### D-2.01-9 · 2026-07-19 · Pathname-coverage test asserts config completeness, not runtime resolution
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `tests/i18n/pathnames.test.ts` checks that every route folder under `src/app/[locale]/` has
  a `pathnames` entry, that no entry is an orphan, and that each entry carries a non-empty slug (with the
  same `[param]` token) for **both** locales — reading `routing.pathnames` directly.
- **Alternative rejected:** Import next-intl's `getPathname` (from `@/i18n/navigation`) and assert the fully
  resolved `/en`-prefixed URLs in the test.
- **Downside accepted:** The test proves the routing **config** is complete, not next-intl's runtime URL
  resolution. The live `/en` prefixing + the actual localised URLs are verified in-browser (this phase's
  render pass: redirects 308, MK slugs 200, `/en/*` 200, hreflang reciprocal).
- **Reason:** Importing `@/i18n/navigation` pulls `next/navigation` into the plain-node Vitest runner and
  fails to resolve ("Cannot find module 'next/navigation'") — the client navigation surface is not loadable
  outside the Next runtime. Testing the config is robust and still fails a page-added-without-a-slug.
- **Links:** `tests/i18n/pathnames.test.ts`

### D-2.01-10 · 2026-07-19 · catalog-parity empty-value check allowlists About.quoteNote
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** The parity test's "no empty value" assertion allowlists exactly one key, `About.quoteNote`,
  which is intentionally empty on MK.
- **Alternative rejected:** Require every value in both catalogs to be non-empty.
- **Downside accepted:** A one-entry allowlist to maintain in the test.
- **Reason:** The About pull-quote's "translated" note is empty on MK (the MK quote is the original — it
  needs no note) and set only on EN (`D-1.05-6`). next-intl requires identical key sets, so the MK side is a
  deliberate empty string, not a missing translation. Without the allowlist the test would falsely fail.
- **Links:** `tests/i18n/catalog-parity.test.ts` · `D-1.05-6`

### D-2.01-11 · 2026-07-19 · Product metadata does a best-effort second DB read to title by product name
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** The product page's `generateMetadata` calls `getProductView(slug)` to title the page by the
  product's real name (or the neutral placeholder + index while names are OWED), falling back to the catalog
  title if the product is not found.
- **Alternative rejected:** Title the product page generically per locale (e.g. "Product — Trajanov") with no
  fetch.
- **Downside accepted:** One extra DB read per product-page load (metadata + render each read the drop).
  Product pages are `force-dynamic` and low-traffic between drops, so the cost is negligible.
- **Reason:** A per-product `<title>` is the correct, complete behaviour once real names exist; the fetch is
  cheap and gracefully degrades.
- **Links:** `src/app/[locale]/catalog/[slug]/page.tsx`

### D-2.01-12 · 2026-07-19 · The styleguide is excluded from the string sweep and the EN no-Cyrillic check
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `/styleguide` is not swept for user-facing literals, and its EN page is exempt from the
  "no Cyrillic" expectation. Its internal field labels stay English and its font-demo section deliberately
  renders Cyrillic glyphs (`Трајанов — Trajanov`, `ѓ ќ љ њ џ …`) in both locales.
- **Alternative rejected:** Extract the styleguide's internal labels to the catalog and strip its Cyrillic
  demo from the EN build.
- **Downside accepted:** The styleguide's EN HTML contains Cyrillic and English literals — acceptable because
  it is an internal review aid, not a customer surface (`D-2.01-4`), and the Cyrillic is the whole point of
  the font-coverage demo.
- **Reason:** Translating away a font-glyph demonstration would defeat its purpose; the styleguide is never a
  customer-facing page.
- **Links:** `src/app/[locale]/styleguide/page.tsx` · `D-2.01-4` · `docs/i18n/string-inventory.md`
  (“Intentionally not translated”)

### D-2.02-1 · 2026-07-19 · Review pack in English prose; MK strings verbatim; dev-path column dropped
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `docs/i18n/mk-review-2.02.md` (the reviewer instrument) is written with its instructional
  prose in English, reproduces every MK/EN string verbatim from `docs/i18n/string-inventory.md`, and omits
  the inventory's file-path “Where” column from the 150-row table.
- **Alternative rejected:** (a) Write the reviewer instructions in Macedonian; (b) keep the inventory's
  file-path “Where” column in the reviewer table, per a literal reading of the brief's “copied from
  `string-inventory.md`”.
- **Downside accepted:** The guidance is in English, not the reviewers' first language; and the table drops
  the machine-readable source-file pointer, so a reviewer cannot tell from the table alone which file a
  string lives in.
- **Reason:** Both reviewers already run the whole project in English (briefs, state, reports); generating
  fresh Macedonian *instructions* would inject exactly the machine-written MK this phase exists to distrust —
  the strings under review stay verbatim, which is the point. File paths are noise for two non-coders, and
  the URL walk (Section 2) gives every customer-facing string a human-readable location instead.
- **Links:** `docs/i18n/mk-review-2.02.md` · `docs/i18n/string-inventory.md` · Phase 2.02 Task 1.

### D-2.02-2 · 2026-07-19 · Native review done jointly and transcribed by Code, not sequential in-file editing
- **Status:** Accepted
- **Decided by:** Claude Code (executor), on the operator's instruction.
- **Decision:** Lazar and Petar reviewed the pack together in one sitting and confirmed the outcome to Code
  in session; Code transcribed the verdicts into the file (all 150 `OK`, all six slugs `Keep`, reviewer
  `L, P` on every row) and filled both sign-off blocks, with a Section-6 note stating how the sign-off was
  captured.
- **Alternative rejected:** Require each reviewer to hand-edit the file in sequence (Lazar first, Petar
  second marking agree/disagree), per the brief's stated flow.
- **Downside accepted:** The brief's “second reviewer sees the first's verdicts” sequencing collapses into a
  joint review, and the sign-off is a Code transcription of a verbal confirmation rather than two independent
  hand-edits — a lighter paper trail than two separate in-file passes.
- **Reason:** The reviewers are non-coders who reviewed together in person; forcing sequential markdown-table
  editing adds friction without changing the result. The gate's intent — two native speakers both vouch for
  every string — is met (both present, both confirmed), and the provenance is recorded openly here and in the
  file rather than dressed up as hand-signed.
- **Links:** `docs/i18n/mk-review-2.02.md` (Section 6) · Phase 2.02 Task 2.

### D-2.02-3 · 2026-07-19 · All six provisional MK slugs confirmed (Keep); “provisional” language removed
- **Status:** Accepted
- **Decided by:** Lazar + Petar (native-MK reviewers), recorded by Claude Code.
- **Decision:** The six provisional MK route slugs from 2.01 (`/katalog`, `/katalog/[slug]`, `/kosnicka`,
  `/naracka`, `/za-nas`, `/kontakt`) are confirmed unchanged. The Latin-transliteration approach (`D-2.01-1`)
  and the single shared product slug (`D-2.01-2`) stand. The “provisional pending 2.02” wording is removed
  from the `routing.ts` comment and from `current-state.md`; `next.config.ts`, the redirect table, the tests,
  and the live site are unchanged (Keep ⇒ no routing edit).
- **Alternative rejected:** Change one or more slugs — a different Latin spelling (e.g. `/kosnicka` →
  `/korpa`), a different Macedonian word, or Cyrillic slugs (`/кошничка`). The reviewers were given all three
  as valid answers and an explicit “cheap now, expensive after the domain is live” prompt.
- **Downside accepted:** Latin transliteration is locked in for these routes; a future rename now costs a
  redirect chain (old English path → 2.01 slug → new slug) rather than one hop, and Cyrillic-in-the-address-bar
  (which some may find more native) is foregone for link-sharing legibility.
- **Reason:** Both native speakers read the address bar and judged every slug recognisable and correctly
  spelled; the transliteration reasoning (Cyrillic percent-encodes to gibberish when pasted in
  Viber/Instagram, `D-2.01-1`) held up under native review. Confirming now clears the one open item the slugs
  carried.
- **Links:** `src/i18n/routing.ts` · `next.config.ts` · `docs/i18n/mk-review-2.02.md` (Section 3) ·
  `D-2.01-1` · `D-2.01-2` · `D-2.01-5`.

### D-2.03-1 · 2026-07-19 · Responsible party displayed on the site is Vladimir Trajanov, alone — no parent named
- **Status:** Accepted
- **Decided by:** **Lazar** (orchestrator, with Vladimir). Recorded by Claude Code.
- **Decision:** The Terms and Privacy pages name **Vladimir Trajanov, Струмица, Северна Македонија** as
  the responsible party for the cash-on-delivery consumer contract and for customer personal data. **No
  parent or guardian name appears anywhere on the site.** The line ships as real, complete copy — not a
  `[PLACEHOLDER]`. `facts.md` §1 is amended so the file and the site agree: the row now records the
  *displayed* party (Vladimir alone) beside the unchanged VERIFIED intake fact (Vladimir and his
  parents), and the §1 open flag (confirm legal responsibility with the parents before cutover) stays.
- **Alternative rejected:** (a) name a parent as the responsible party; (b) name Vladimir "represented
  by his parent/guardian [name]"; (c) ship the line as a `[PLACEHOLDER]` until the parents confirm.
- **Downside accepted, stated plainly:** Vladimir is a secondary-school student and there is no
  registered legal entity, so the site names a **minor, alone**, as the party responsible for a
  cash-on-delivery consumer contract and for customer PII. If a customer disputes an order, no adult is
  named anywhere on the site. **Nobody on this project is a lawyer,** and no lawyer has read these pages
  (new owed-verification row). This was Lazar's call, made with the tradeoff stated.
- **Reason:** Naming a parent without their confirmed consent would itself be an unverified claim about a
  real person; the honest, shippable state is the real, complete party we can stand behind today, with
  the parental-confirmation flag kept open on the parallel track rather than papered over.
- **Links:** `src/app/[locale]/terms/page.tsx` · `src/app/[locale]/privacy/page.tsx` · `facts.md` §1 ·
  `current-state.md` (owed-verification register) · Phase 2.03 brief Decision 1.

### D-2.03-2 · 2026-07-19 · The facts audit treats operational commitments as VERIFIED-via-shipped-code, not UNSOURCED
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** In `docs/legal/facts-audit-2.03.md`, operational claims the site makes about how the
  store works — the 48-hour reservation, 2-units-per-order cap, cash-on-delivery / no-online-payment,
  atomic "someone got there first" stock, rate-limit and bot-check messages — are marked **VERIFIED**
  with the source cited as the **shipped migration / decision** (e.g. `create_order()`,
  `orders.reserved_until`), not as a `facts.md` section. Rows carry `§n` (facts.md) or `code:` so the
  two bases are never blurred.
- **Alternative rejected:** (a) mark every operational claim **UNSOURCED** because it is not literally in
  `facts.md`, then either delete it or add operational mechanics to `facts.md`; (b) fold them all into
  **NOT A CLAIM**.
- **Downside accepted:** "VERIFIED" now spans two source types, so a reader must check each row's citation
  to know whether a claim is brand-fact-backed or code-backed; `facts.md` remains a brand/business-facts
  source and deliberately does **not** hold operational mechanics like the 48h hold.
- **Reason:** The brief's Decision 5 explicitly sets the standard for these pages as *"what the store
  actually does … traceable to `facts.md` or to shipped code."* Shipped, tested code is at least as
  authoritative as an intake note for how the order path behaves; marking it UNSOURCED would be false,
  and stuffing operational mechanics into `facts.md` would blur what that file is for.
- **Links:** `docs/legal/facts-audit-2.03.md` (Status vocabulary; §A.4/§A.5) · Phase 2.03 brief Decision 5.

### D-2.03-3 · 2026-07-19 · One shared LegalPage/LegalSection shell for the three legal pages
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** Terms, Privacy, and Shipping & Returns render through a shared presentational
  `src/components/legal/LegalPage.tsx` (`LegalPage` shell + `LegalSection`), rather than each page
  repeating the About/Contact markup inline.
- **Alternative rejected:** Inline the `max-w-2xl` header/section markup in each of the three page files,
  exactly as `/about` and `/contact` do it.
- **Downside accepted:** The site now carries **two** editorial patterns — About/Contact inline, and the
  three legal pages via a shared shell — so a future restyle of the editorial look must touch both
  places. A reader comparing About to Terms sees the same output from different code.
- **Reason:** Three near-identical page shells with ~7 sections each is where copy-paste drift hides; one
  shell keeps the legal pages provably consistent with each other and confines a change to one file. The
  shell reproduces the About/Contact visual shape and brand.md tokens, so the *output* still matches the
  established look.
- **Links:** `src/components/legal/LegalPage.tsx` · `src/app/[locale]/{terms,privacy,shipping-returns}/page.tsx`.

### D-2.03-4 · 2026-07-19 · Last-updated is a fixed, hand-maintained date + a shared Common.lastUpdated label
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** Each legal page carries `const LAST_UPDATED = '2026-07-19'`, formatted per locale via the
  next-intl formatter, and a single shared `Common.lastUpdated` label key. The date is **not** read from
  the clock.
- **Alternative rejected:** (a) render `new Date()` at request time; (b) a per-namespace `lastUpdated`
  key in each of Terms/Privacy/ShippingReturns.
- **Downside accepted:** The date is hand-maintained — whoever edits the copy must remember to bump the
  constant in each page — and the constant is duplicated across three files.
- **Reason:** A clock-driven date on a **static** page is both misleading (it would read "today" on every
  visit, not when the terms last changed) and non-deterministic for the SSG build. A shared label keeps
  MK/EN key parity trivial. Duplicating a one-line date constant is cheaper than a shared module for
  three static pages.
- **Links:** `src/app/[locale]/{terms,privacy,shipping-returns}/page.tsx` · `src/messages/{mk,en}.json`
  (`Common.lastUpdated`).

### D-2.03-5 · 2026-07-19 · Courier and returns-window placeholders live in the existing Placeholder namespace
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** The two new visible placeholders on `/shipping-returns` are `Placeholder.courier` and
  `Placeholder.returnsWindow`, added to the existing `Placeholder` namespace and rendered via the
  existing `<Placeholder>` component — the same pattern as `Placeholder.email` etc.
- **Alternative rejected:** Put the placeholder strings inside the `ShippingReturns` namespace
  (`ShippingReturns.courierPlaceholder`, `ShippingReturns.returnsPlaceholder`).
- **Downside accepted:** The two placeholder strings live in a different namespace than the page that
  renders them, so a reader scanning `ShippingReturns` alone will not see them.
- **Reason:** Every other `[PLACEHOLDER: …]` marker on the site already lives in `Placeholder`, and the
  string-inventory / register tooling and the `<Placeholder>` component are built around that one
  namespace; keeping the two new markers there makes them consistent and easy to find as a set.
- **Links:** `src/messages/{mk,en}.json` (`Placeholder.courier`, `Placeholder.returnsWindow`) ·
  `src/app/[locale]/shipping-returns/page.tsx`.

### D-2.03-6 · 2026-07-19 · The cart's "Shipping — calculated on delivery" is surfaced as a finding, not reworded this phase
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** Audit finding **F-2** — the cart order-summary line `Shipping: calculated on delivery`
  (MK `се пресметува при подигање`) — is **surfaced** in the audit and completion report but **not
  reworded** in this phase. It is classified VERIFIED (operational: the app computes no shipping fee and
  everything is settled at the door under COD, §7) with a standing note.
- **Alternative rejected:** Reword or remove the cart string now, to align it with the `/shipping-returns`
  placeholder that admits we do not know the courier / delivery cost.
- **Downside accepted:** Until reconciled, two surfaces describe the delivery cost slightly differently —
  the cart states it is "calculated on delivery", while `/shipping-returns` flags the delivery cost as an
  owed placeholder. A future cart-touching phase must revisit the cart line once Vladimir supplies
  courier terms.
- **Reason:** The cart is explicitly **out of scope** for 2.03, the string passed the 2.02 native-MK
  review, and the only *correct* rewrite depends on the very courier terms Vladimir still owes — rewording
  now would swap one hedge for another or invent detail. The line states **no amount**, so it is not the
  dangerous case the brief warns about (an invented delivery cost asked for at the door).
- **Links:** `docs/legal/facts-audit-2.03.md` (Finding F-2) · `src/components/cart/CartView.tsx`
  (`Cart.shipping`, `Cart.shippingValue`) · Phase 2.03 brief Task 2.

---

### D-2.04-1 · 2026-07-20 · OG share cards are a per-page dynamic `/og` endpoint baking the Meta title, wired via a central `pageMetadata()` helper
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** Share cards are generated by one dynamic route handler `src/app/og/route.tsx` that takes
  `?l=<locale>&t=<title>` and renders the wordmark + that title. Every page's metadata is now built by a
  single helper `pageMetadata({href, locale, title, description, ogTitle?, index?})` in
  `src/lib/metadata.ts`, which sets title/description, the reciprocal hreflang/canonical (via the existing
  `localeAlternates`), an **absolute** `openGraph.images` + `twitter.card:"summary_large_image"`, and
  (when `index:false`) a noindex. The `/og` path is excluded from the next-intl proxy matcher
  (`src/proxy.ts`) so it isn't treated as a MK-default page and 404'd.
- **Alternative rejected:** Next's file-convention `opengraph-image.tsx` at `[locale]` — one per-locale
  image, auto-injected on every route, no per-page edits.
- **Downside accepted:** A public image-generation endpoint with a title query param (a small surface;
  the title is clamped to 90 chars and is only ever a public page title, never PII), and every page's
  `generateMetadata` had to be switched to the helper (11 pages + the layout default). In exchange the
  card shows the *actual page title* (Task 6's literal ask — a pasted product link shows the product name)
  and `og:image`/`twitter:image` are provably absolute on every route through one grep-able helper.
- **Reason:** The file convention cannot put the page's title *in the image* and its merge behaviour with
  a per-page `openGraph` (needed for `og:title`/`og:description`) is ambiguous; the central helper gives
  full, auditable control and honours Task 6 as written.
- **Links:** `src/app/og/route.tsx` · `src/lib/metadata.ts` (`pageMetadata`, `ogImageUrl`) · `src/proxy.ts`
  · Phase 2.04 brief Task 6.

---

### D-2.04-2 · 2026-07-20 · The OG image uses brand.md token VALUES as literals and a vendored Rubik woff (satori cannot read CSS vars or woff2)
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** The `ImageResponse` card hardcodes the brand hex values (`#0F1210` ground, `#E2A93C`
  mustard, `#ECE8E0` foreground, `#ABA79E` muted), each annotated with its `brand.md` token name, and
  loads Rubik 700 from two **vendored** woff files (`src/app/og/rubik-latin-700.woff` +
  `rubik-cyrillic-700.woff`, SIL OFL) via `readFileSync(new URL(..., import.meta.url))`.
- **Alternative rejected:** (a) parse `globals.css` at build to feed satori the token values; (b) fetch
  the Rubik subset from Google Fonts at render time.
- **Downside accepted:** A `brand.md` colour change must be mirrored in the OG route as well as
  `globals.css` (one extra place, same mirroring discipline the project already runs), and two small
  binary font files (~10KB + ~24KB) are committed to the repo.
- **Reason:** satori (behind `next/og`) cannot consume CSS custom properties or woff2, so concrete values
  and a woff/ttf are mandatory; vendoring the font keeps the card self-contained with **no runtime request
  to Google** (matches `brand.md` §4 and the portability rule) and guarantees the MK card renders native
  Cyrillic rather than tofu (verified in-browser).
- **Links:** `src/app/og/route.tsx` · `src/app/og/*.woff` · `brand.md` §3–4 · Phase 2.04 brief Task 6.

---

### D-2.04-3 · 2026-07-20 · Product JSON-LD availability is mapped from the server drop state (countdown → PreOrder)
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `availabilityFor(dropState, stock)` maps: any state + sold-out → `SoldOut`; `live` + stock
  → `InStock`; `countdown` (not yet open) → `PreOrder`; `ended` with stock left → `OutOfStock`. Never a
  hardcoded `InStock` (Plan §10). A Product node is emitted **only** when the product has a real name.
- **Alternative rejected:** Omit `availability` from the Offer, or leave it constant.
- **Downside accepted:** `PreOrder` on a not-yet-open drop slightly implies the item is orderable now,
  when between drops it is only browsable — it is the closest honest schema.org value and only ships once
  a product has a real name (so it is dormant against the current placeholder-named catalogue).
- **Reason:** The DoD requires availability derived from `src/lib/drop/state.ts`, never hardcoded; this
  covers all four real states with the least-dishonest schema.org term for each.
- **Links:** `src/lib/seo/product-jsonld.ts` · `tests/seo/product-jsonld.test.ts` · Phase 2.04 brief Task 5.

---

### D-2.04-4 · 2026-07-20 · The low-stock count on the product card is the red pill, not raw accent-red text (WCAG 2.2 AA contrast)
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `ProductCard`'s body low-stock line now renders `<StockBadge level="low">` (near-black on
  red = 4.8:1, the pairing `brand.md` §3 validates) instead of raw `text-accent` red text, which is only
  4.31:1 on the `surface` card background and fails AA.
- **Alternative rejected:** Recolour the count to `--color-error` (light pink) or bump it to large-text
  size so 3:1 applies.
- **Downside accepted:** A low-stock card now shows the red pill twice (the photo-overlay badge and the
  body line) — a mild redundancy. `brand.md`'s contrast ledger only validated accent-red on *ground*
  (4.6:1), not on *surface*; this surfaces that gap.
- **Reason:** The pill is already how the product detail page shows low stock, so the card now matches it,
  passes AA, and keeps the red urgency — without inventing a new token or altering the palette.
- **Links:** `src/components/product/ProductCard.tsx` · `src/components/drop/StockBadge.tsx` · `brand.md` §3
  · Phase 2.04 brief Task 8.

---

### D-2.04-5 · 2026-07-20 · Interactive targets raised to the WCAG 2.2 24px minimum (footer links) and the cart icon to 44px
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** The footer nav + phone/Instagram links got `py-1.5` (≈31px tall targets) and the header
  cart icon went from `h-9 w-9` (36px) to `h-11 w-11` (44px), clearing axe `target-size` (SC 2.5.8, AA).
- **Alternative rejected:** Leave them under the "inline links in a block of text" exception.
- **Downside accepted:** The footer link column is a few pixels taller; the header cart control is the
  tallest header element (checked in-browser — still balanced).
- **Reason:** The footer links are a vertical nav list (not inline prose), so the exception is shaky; axe
  flagged all five plus the cart icon. Padding is the minimal, design-safe fix.
- **Links:** `src/components/layout/SiteFooter.tsx` · `src/components/layout/SiteHeader.tsx` · Phase 2.04
  brief Task 8.

---

### D-2.04-6 · 2026-07-20 · A global `:focus-visible` outline backstop (focus-ring token)
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `globals.css` now sets `:focus-visible { outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px }` (matching `brand.md` §3), so every interactive element has a visible focus
  indicator.
- **Alternative rejected:** Add a `focus-visible:ring` to each previously-unstyled link (footer, header
  catalog link, About/back links) individually.
- **Downside accepted:** Components that already set their own ring keep it (they carry `outline-none`, a
  transparent outline, which wins by specificity), so the site has two focus treatments — a box-shadow
  ring on buttons/cards, a plain outline on links — both in the focus-ring colour.
- **Reason:** A single base rule guarantees no interactive element can ever be focusable without a visible
  indicator (SC 2.4.7), rather than relying on remembering per-component styles.
- **Links:** `src/app/globals.css` · `brand.md` §3 · Phase 2.04 brief Task 8.

---

### D-2.04-7 · 2026-07-20 · Skip-to-content link ships a new `Common.skipToContent` MK string (added to the MK-review debt)
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** A visually-hidden-until-focused skip link was added in the layout above `<main id="main-content">`,
  needing one new key `Common.skipToContent` (MK „Прескокни до содржината" / EN "Skip to content").
- **Alternative rejected:** Reuse an existing string, or ship without a skip link.
- **Downside accepted:** One new MK string ships ahead of native review — it joins the existing 2.03
  MK-review owed row (#10) rather than opening a new debt; a native speaker should confirm the phrasing.
- **Reason:** Task 8 requires a skip link, which needs its own label; „Прескокни до содржината" is the
  standard MK phrasing. Both catalogs stay key-identical (parity test green).
- **Links:** `src/app/[locale]/layout.tsx` · `src/messages/{mk,en}.json` (`Common.skipToContent`) · Phase
  2.04 brief Task 8.

---

### D-2.04-8 · 2026-07-20 · vitest `@`→`src` path alias for the pure SEO unit tests
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `vitest.config.ts` now mirrors the tsconfig `@/*`→`src/*` alias, so a pure unit test can
  import a src module that itself uses the alias (`src/lib/seo/site-jsonld.ts` imports `@/lib/site`).
- **Alternative rejected:** Use relative imports inside `src/lib/seo/*`, breaking the codebase's `@/`
  convention for two files only.
- **Downside accepted:** A test-infra config change (additive; no dependency, no runtime effect) — the
  first non-tsconfig place the alias is declared.
- **Reason:** Keeps `src/` uniformly on the `@/` alias while letting Node-side unit tests resolve it; the
  84-test suite (incl. the oversell gate) stays green.
- **Links:** `vitest.config.ts` · `tests/seo/*.test.ts` · Phase 2.04 brief Task 5.
