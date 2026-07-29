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
- **Status:** Superseded by D-Y.04-1
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

---

### D-2.04b-1 · 2026-07-22 · Introduce a real typographic brand wordmark (Task 2 proceeded)
- **Status:** Accepted
- **Decided by:** Claude Code (executor) — **owner-level call flagged for Lazar/Design ratification.**
- **Decision:** Shipped a minimal typographic wordmark — the word "Trajanov" set in the brand display
  font (Rubik 700) and brand colours (mustard on ground), as `public/logo.svg` (embedded font) +
  `public/logo-512.png` — and added it as the Organization `logo` in the JSON-LD. This is a legitimate
  brand mark, **not** the AI-generated product imagery barred by `D-0-6` (the mark is the brand's own
  name set in type; the generation pipeline is `scripts/generate-brand-assets.ts`, pure typography).
- **Alternative rejected:** Skip Task 2 and ship only Tasks 1/3/4, leaving the Organization node without
  a `logo` until a Design phase produces a mark.
- **Downside accepted:** A visual-brand decision is being made outside a Design phase. If Lazar wants a
  properly designed mark first, this wordmark is replaceable in one regeneration + one commit — the mark
  now sits in the owed register for Lazar/Design sign-off (register #13).
- **Reason:** The Google search result and AI/answer-engine cards look unfinished without a logo, and a
  wordmark of the brand's own name invents nothing. Recommended by the brief.
- **Links:** `public/logo.svg` · `public/logo-512.png` · `scripts/generate-brand-assets.ts` ·
  `src/lib/seo/site-jsonld.ts` · `brand.md` §3–4 · Phase 2.04b brief Task 2.

---

### D-2.04b-2 · 2026-07-22 · Ship `llms.txt` despite no proven ranking/answer-engine benefit
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** Added an `llms.txt` route (`src/app/llms.txt/route.ts`) serving a facts.md-clean,
  English-prose, bilingual-URL summary of the brand for AI crawlers/agents.
- **Alternative rejected:** Do not ship `llms.txt` — it is a young convention with no measured effect on
  how ChatGPT/Perplexity/Google-AI cite a site.
- **Downside accepted:** We maintain another factual-claim surface (every line must stay traced to
  `facts.md`) for an unproven benefit; it can go stale if facts change and nobody updates it.
- **Reason:** The cost is one small route reusing existing infrastructure, the file is `noindex` and not
  in the sitemap (no SEO risk), and if answer engines do read it, Trajanov is described in its own honest
  words rather than guessed at. Asked for by the brief.
- **Links:** `src/app/llms.txt/route.ts` · `src/lib/seo/routes.ts` · Phase 2.04b brief Task 1.

---

### D-2.04b-3 · 2026-07-22 · One shared indexable-route module for the sitemap and llms.txt
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** Extracted the static indexable-route list + the `SITE_URL`-absolute URL helper into
  `src/lib/seo/routes.ts` (`INDEXABLE_STATIC_HREFS`, `absoluteUrl`), and refactored `src/app/sitemap.ts`
  to import them; `llms.txt` imports the same. Neither surface hand-types a slug or the domain.
- **Alternative rejected:** Copy the route list into `llms.txt` (leaving `sitemap.ts` as-is), or read
  the sitemap output back.
- **Downside accepted:** A 2.04 file (`sitemap.ts`) was refactored — a slightly larger diff than the
  narrow "add llms.txt" change; the sitemap's inline `STATIC_HREFS`/`abs`/`Href` moved out.
- **Reason:** The brief requires llms.txt to reuse *the same* list the sitemap derives so they cannot
  drift; a shared module is the only way to make "cannot drift" true rather than aspirational (adding a
  route now updates both; the shared list is `as const` so llms.txt gets compile-time exhaustiveness).
  No sitemap test exists to regress and the build + a curl of both surfaces confirm parity.
- **Links:** `src/lib/seo/routes.ts` · `src/app/sitemap.ts` · `src/app/llms.txt/route.ts` · Phase 2.04b
  brief Task 1.

---

### D-2.04b-4 · 2026-07-22 · The favicon/app icon is a "T" monogram, not the full wordmark
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** `src/app/icon.svg` + the manifest/apple icons are a geometric "T" monogram (the brand
  initial, rounded corners echoing Rubik), on the brand ground; the full "Trajanov" wordmark is reserved
  for `logo.svg`/`logo-512.png`.
- **Alternative rejected:** Use the full wordmark as the favicon too.
- **Downside accepted:** The favicon shows an initial, not the whole name — a browser-tab glance reads
  "T", not "Trajanov". The "T" is arguably a new glyph relative to the wordmark, though it is drawn as the
  wordmark's own initial, not an invented emblem.
- **Reason:** A wordmark is illegible at 16–32px; every real brand derives a monogram/mark for the
  favicon. Drawn as geometry (not `<text>`), the "T" is crisp at any size without depending on Rubik being
  installed. The existing `favicon.ico` is kept as the legacy fallback.
- **Links:** `src/app/icon.svg` · `src/app/apple-icon.png` · `public/icon-{192,512}.png` · Phase 2.04b
  brief Task 3.

---

### D-2.04b-5 · 2026-07-22 · Brand-mark rasters generated via `next/og` (no new dependency); brand token values mirrored as literals in the asset files
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** The PNG marks are rendered by a committed, manually-run script
  (`scripts/generate-brand-assets.ts`, `npm run assets:brand`) using `next/og` (satori + resvg, already
  shipped with Next) and the Rubik woff already vendored for the OG cards. The SVG/PNG/manifest asset
  files carry the `brand.md` §3 colour **values** as literals (`#0F1210`, `#E2A93C`), because an SVG /
  raster / JSON asset cannot read a CSS custom property.
- **Alternative rejected:** Add an image toolchain dependency (`sharp`/`canvas`) to rasterize; or draw
  the marks by hand / with an image model.
- **Downside accepted:** The token values are duplicated as literals in these files (they must be changed
  in `brand.md` first, then here) — the same mirroring `globals.css` and `src/app/og` already accept
  (`D-2.04-2`). The generator is run by hand, not in the build.
- **Reason:** Zero new dependency (DoD requires recording any new dep; none added). Programmatic
  typography is also the proof these marks are legitimate type, not `D-0-6` AI imagery. `next/og` is the
  same engine the OG cards already use, so the render path is trusted.
- **Links:** `scripts/generate-brand-assets.ts` · `package.json` (`assets:brand`) · `src/app/icon.svg` ·
  `src/app/manifest.ts` · `D-2.04-2` · Phase 2.04b brief Tasks 2/3.

---

### D-2.04b-6 · 2026-07-22 · IndexNow key committed as a public file; `pingIndexNow` exported but NOT auto-fired
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Decision:** Generated a 32-char hex IndexNow key, committed it as `public/<key>.txt` (served bare at
  the root) and as `INDEXNOW_KEY` in `src/lib/seo/indexnow.ts`, with a best-effort `pingIndexNow(urls)`
  helper that builds host/keyLocation from `SITE_URL` — **wired to nothing**.
- **Alternative rejected:** Wire the ping to fire now (e.g. from `sync:drop`), or defer the whole key
  file to 2.05.
- **Downside accepted:** No instant Bing/Yandex recrawl happens until a post-2.05 hook calls the helper
  and the operator registers the key in Bing Webmaster Tools; the helper ships as dead-but-typed code.
- **Reason:** Pinging IndexNow before the real domain is live is meaningless — you can only submit URLs
  on a host you have proven you own, and today that host is a temporary `*.vercel.app` preview. The key
  is **public by design** (it proves ownership by being fetchable) and is therefore **not a secret under
  `D-0-1`** — committing and printing it is correct, and it never needs rotating.
- **Links:** `public/78dec4b97e3fbb0f22d1c8df38050f74.txt` · `src/lib/seo/indexnow.ts` · `D-0-1` ·
  Phase 2.04b brief Task 4.

---

### D-2.05-1 · 2026-07-21 · Production domain is trajanovv.com (double-v)
- Status: Accepted
- Context: Cutover needs the real domain. trajanov.com (single-v — the target in every planning
  doc and facts.md §9) was unavailable to purchase.
- Decision: Register and launch on trajanovv.com. Every SITE_URL-derived surface (sitemap, OG
  cards, JSON-LD, canonicals, email from-address) repoints to it.
- Alternatives considered: another single-v variant or a different TLD — rejected by Lazar, who
  bought trajanovv.com. Wait for trajanov.com to drop — rejected, no timeline, blocks launch.
- Consequences: The public domain differs by one letter from every doc; facts.md §9 corrected.
  "vv" could read as a typo — mitigated by matching the @trajanovv2026 handle, the source of
  nearly all traffic. A one-letter error in any hardcoded URL is now silent breakage —
  mitigated by the single SITE_URL source (2.04) and the grep gate in this DoD.
- Links: facts.md §9 · Phase 2.05 · 00_stack-and-config.md

---

### D-2.05-2 · 2026-07-21 · Cut over with the placeholder register non-empty (Lazar's override)
- Status: Accepted
- Context: The plan makes an empty placeholder register a hard launch-blocker for cutover
  (Plan §1, Phase Plan 2.05). Five rows remain open, all Vladimir's: photos (#2), fabric/care
  (#3), names + measurement chart (#4), courier + cost (#6), returns window (#7).
- Decision: Go live on trajanovv.com now with those placeholders open; fill later (photos/
  names/fabric via Y.01; courier/cost/returns when Vladimir supplies them). Lazar's explicit call.
- Alternatives considered: hold cutover until the register is empty (the written rule) —
  rejected by Lazar. The orchestrator recommended cleaning the front door first; Lazar chose to
  launch as-is.
- Consequences: Accepted risk, Lazar's call. What this does NOT waive: no real drop is
  scheduled, so nothing is buyable on day one — the consumer-protection exposure the rule
  prevents is not triggered by cutover alone. It IS triggered when a real drop opens, so the
  register must be empty BEFORE THE FIRST REAL DROP opens (carried onto 2.06's gate), not merely
  before cutover. Residual exposure at cutover is reputational: visible (honest, not fabricated)
  placeholder markers on the product/shipping pages.
- Links: Plan §1 · Phase Plan 2.05, 2.06 · current-state.md placeholder register

---

### D-2.05-3 · 2026-07-21 · info@trajanovv.com via Cloudflare Email Routing + Resend, no paid mailbox
- Status: Accepted
- Context: The public contact address and the order-email from-address should both be
  info@trajanovv.com (a domain address, not Vladimir's personal email). A paid SMTP mailbox
  costs money and adds an account to run.
- Decision: Cloudflare Email Routing (free) forwards info@ to Vladimir's inbox; Resend (already
  in the stack) sends order email FROM info@ once the domain is verified. No paid mailbox.
- Alternatives considered: a paid mailbox (Workspace/Zoho) — rejected, unnecessary cost + another
  account. Keep onboarding@resend.dev — rejected: untrustworthy on a COD order, leaves #8 open.
- Consequences: info@ can receive (forwarded) and the app can send as it, but nobody can
  manually compose from info@ without more setup — acceptable, Vladimir replies from his own
  inbox. Requires ONE merged SPF TXT record; a second SPF record breaks mail.
- Links: facts.md §5 · 00_stack-and-config.md · owed-verification #8

---

### D-2.05-4 · 2026-07-21 · New Turnstile widget + keys (Vertexcons Cloudflare account); old widget retired
- Status: Accepted
- Context: The original Turnstile widget (site key 0x4AAAAAAD23OFW7Ka1hTR1F) lived in a
  Cloudflare account separate from the one now holding the domain + DNS. Adding the new
  hostname there was possible, but keeping captcha, DNS, and (future) analytics in one account
  is simpler to operate for two people.
- Decision: Created a fresh Managed widget in the Vertexcons Cloudflare account (hostnames
  trajanovv.com + www), rotated BOTH Turnstile env vars in Vercel to the new widget, redeployed.
  New site key 0x4AAAAAAD6pSIvEa1p8GkZX.
- Alternatives considered: reuse the existing widget by adding the hostname in the original
  account — rejected to consolidate on one Cloudflare account; the cost is a key rotation +
  redeploy.
- Consequences: The old widget/keys are retired — any doc/code referencing 0x4AAAAAAD23OFW7Ka1hTR1F
  is now stale. The new secret was generated by the operator and entered only into Vercel (never
  exposed, not a compromise). The old widget can be deleted as housekeeping. The live captcha on
  the real domain is unverified until a drop opens (2.06 rehearsal).
- Links: current-state Turnstile · D-1.04-8 · D-1.07-7 · Phase 2.06

---

### D-2.05-5 · 2026-07-21 · Ship cutover without Cloudflare Web Analytics (deferred)
- Status: Accepted
- Context: The analytics token was not set up at cutover, and the first real drop is not yet
  scheduled, so there is no drop traffic to measure.
- Decision: Ship 2.05 with no analytics beacon; add Cloudflare Web Analytics as a small
  follow-up when the token is available (before the 2.06 rehearsal).
- Alternatives considered: block cutover until analytics is configured — rejected, nothing is
  lost by adding it later since there is no traffic yet.
- Consequences: No visitor data collected until it is added — acceptable, no drop has run.
- Links: 00_stack-and-config.md (Analytics row) · Plan §11 · Phase 2.06

---

### D-2.05-6 · 2026-07-22 · SITE_URL is the canonical host www.trajanovv.com, not the apex
- **Status:** Accepted
- **Decided by:** Petar (operator) — chosen in this session over the brief's apex wording.
- **Context:** Task 2 of the 2.05 brief says set SITE_URL to the apex `https://trajanovv.com` ("apex, no
  trailing slash"), and D-2.05-1 speaks of "trajanovv.com". But live production canonicalises on **www**:
  `https://www.trajanovv.com/en` returns 200, while the apex `trajanovv.com` AND the old
  `trajanov-v2.vercel.app` both **308-redirect to www** (curl-verified this session; matches the operator's
  2.04b-merge state note "flip SITE_URL to https://www.trajanovv.com").
- **Decision:** Set `SITE_URL = 'https://www.trajanovv.com'`. Every derived surface (canonical, hreflang,
  OG image, JSON-LD `@id`/`logo`, sitemap, robots, llms.txt links, IndexNow host) therefore points at the
  200-serving host, not a redirect.
- **Alternative rejected:** Follow the brief literally and set the apex — rejected because it would make
  every canonical/OG/schema URL point at a host that 308-redirects (the exact Known-issue-#10 problem the
  cutover exists to fix). Keeping the apex would have required an operator to first make the apex Vercel's
  primary domain (www→apex); the domain is already configured www-primary, so www is the correct,
  no-ops-change choice against live reality.
- **Downside accepted:** SITE_URL differs from the brief's / D-2.05-1's literal "trajanovv.com" by the
  `www.` prefix; facts.md §9 keeps the registered **domain** as `trajanovv.com` while the serving **host**
  is `www.trajanovv.com` — the two-name distinction is documented in §9 and `src/lib/site.ts` so it can't
  be misread as an inconsistency.
- **Links:** `src/lib/site.ts` · `D-2.05-1` · facts.md §9 · current-state Known issue #10 · Phase 2.05 brief Task 2

---

### D-2.05-7 · 2026-07-22 · Shipping "delivery" copy scoped to courier + cost (delivery time now VERIFIED); one order-email from-address (no customer confirmation exists)
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Context:** (a) Task 5 adds the VERIFIED delivery-time line ("3–5 business days") to the Shipping page,
  but the existing `ShippingReturns.deliveryBody` said "we don't have **these** [courier/time/cost]
  confirmed yet" — now false for time. (b) Task 3 says change the `from` for "both the Vladimir
  notification and the customer confirmation", but the app sends **no customer confirmation** (no customer
  email is collected, `D-Z.01-1`); there is exactly one email, `order-notification.ts`.
- **Decision:** (a) Render the exact delivery-time strings, and reword `deliveryBody` (both locales) to
  scope the "not confirmed yet, we won't guess" statement to **courier + cost** only, matching the narrowed
  `Placeholder.courier` (#6). (b) Change the one `ORDER_FROM_ADDRESS` to `info@trajanovv.com`; there is no
  second from-address to change.
- **Alternatives considered:** (a) leave `deliveryBody` unchanged — rejected, it would contradict the
  now-shown confirmed delivery time (a content-truth violation). (b) invent/wire a customer-confirmation
  email to satisfy the brief's wording — rejected, no customer email is collected and none is in scope.
- **Downside accepted:** `deliveryBody` copy changed slightly beyond the brief's literal task list (a
  humanizer + facts.md check was run; voice unchanged, no new claim introduced); Task 3's "both … and …"
  phrasing is satisfied by the single existing sender, surfaced here for the orchestrator.
- **Links:** `src/app/[locale]/shipping-returns/page.tsx` · `src/messages/{mk,en}.json` ·
  `src/lib/email/order-notification.ts` · `D-Z.01-1` · Phase 2.05 brief Tasks 3, 5

---

### D-2.06-1 · 2026-07-22 · Rehearsal runs ONE order against a drop constrained to a single sellable unit, and reuses that order for the expiry test
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Context:** The rehearsal must show (a) a product/drop reaching **SOLD OUT** from a single order and (b)
  reservation **expiry** returning stock (the 1.08 backdated-hold method). The committed hosted stock is 3
  on every size (`src/config/products.ts`), and the whole drop only reads "sold out / ended" when **total**
  stock across every product+size is 0 (`src/lib/drop/state.ts` `totalStock`). Two separate orders (one to
  sell out, one to expire) would trip the DB's one-live-order-per-phone index
  (`orders_one_live_per_phone_per_drop`, live statuses only) unless run from two different phone numbers,
  and would leave more teardown to do.
- **Decision:** The open step (`docs/ops/rehearsal-sql/01-open-rehearsal-drop.sql`) zeroes every variant in
  `test-drop` and puts back **one** unit on one size, so a single order takes the whole drop to SOLD OUT.
  The expiry step backdates **that same order's** `reserved_until` so the scheduled sweep expires it and
  returns the unit. One order, one phone, one buyable unit on the public URL at any moment.
- **Alternatives considered:** (a) two orders across two sizes/phones (sold-out order + separate expiry
  order) — rejected: needs two phone numbers to dodge the phone-limit index, and adds teardown surface. (b)
  Leave stock at 3 and only sell one size to 0 — rejected: the *drop* never reads SOLD OUT (other sizes
  still stocked), and it leaves 14 real-priced units buyable on a public URL during the window.
- **Downside accepted:** After the expiry step the drop shows *live with 1 unit again* rather than staying
  SOLD OUT (the SOLD OUT evidence is captured before expiry, so this is fine); and constraining the drop to
  one unit is a **deliberate human stock write** on hosted — the same "deliberate SQL by someone who has
  thought about it" the no-auto-restock rule (`D-1.04-5`) intends, done outside `sync:drop`, undone in
  teardown. No commerce code, migration, or committed config changes.
- **Links:** `docs/ops/drop-rehearsal-runbook.md` · `docs/ops/rehearsal-sql/` · `D-1.08-3/4` ·
  `src/lib/drop/state.ts` · `Part-1-Phase-08-Operator-Runbook.md`

---

### D-2.06-2 · 2026-07-22 · Contingency plan POINTS AT X.01 as the recovery path; the X.01 brief itself is flagged-not-written (out of scope for 2.06)
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Context:** Task 1 (technical recovery) says name where the X.01 brief lives and that it is "pre-written
  to be an afternoon, not a scramble." `D-0-2` mitigation #2 promises X.01 is pre-written. In fact X.01 is
  listed as an on-demand phase in `Trajanov-V2-Phase-Plan.md`, and the portability rule that *makes* it an
  afternoon (`D-0-2`, `00_stack-and-config.md`) is in force — but **no executable X.01 brief exists** in
  `briefs/` yet.
- **Decision:** `docs/ops/drop-day-contingency.md` names X.01 (its plan location, trigger, owner Code, and
  the portability rule that makes it fast) and **explicitly flags that the X.01 brief is not yet written**,
  recommending it be authored before the first real drop. This phase does **not** write the X.01 brief.
- **Alternatives considered:** Write the X.01 brief now to satisfy "pre-written" literally — rejected:
  authoring a new on-demand phase brief is out of 2.06's scope (2.06 is the rehearsal + contingency docs),
  and X.01 has its own trigger and owner. Silently claim X.01 is pre-written — rejected: it isn't, and the
  contingency plan must be honest about the one gap in the recovery path.
- **Downside accepted:** The `D-0-2` "pre-written recovery" promise is not literally met until someone
  writes `briefs/Part-X-Phase-01-*.md`; surfaced here and in the completion report so it isn't lost.
- **Links:** `docs/ops/drop-day-contingency.md` · `Trajanov-V2-Phase-Plan.md` (X.01) · `D-0-2` ·
  `00_stack-and-config.md` (portability rule)

---

## Phase Y.02 — Product 03 (baby blue) catalog stub

### D-Y.02-1 · 2026-07-22 · Owner-authorised out-of-order insert — Product 03 added as a catalog stub ahead of Y.01
- **Status:** Accepted
- **Decided by:** Lazar (owner), 2026-07-22 — handed to Code in the Phase Y.02 brief.
- **Context:** Vladimir has confirmed a third colourway (baby blue) with a real price (1999 MKD) and real
  sizes (S/M/L/XL). The critical path is the 2.06 operator rehearsal, then `Y.01` (the full drop-content
  load). Baby blue's photos + fabric are still OWED, so it cannot enter a live drop yet — but its confirmed
  price + sizes can be recorded and rendered now.
- **Decision:** Insert Product 03 into the catalog **now**, out of order, as a visible, honest stub — real
  price + sizes, placeholder photo/fabric/name — so it is live-ready the moment Vladimir's photos and fabric
  arrive. This is an owner-authorised insert; it does **not** replace the 2.06 rehearsal on the critical path
  (the `NEXT:` line stays pointed at the rehearsal).
- **Alternatives considered:** **Option A — fold baby blue into the full `Y.01` drop-content load.**
  Rejected by Lazar: it delays recording confirmed facts (price + sizes) and building the stub until Y.01,
  when the catalog can carry the colourway honestly today.
- **Downside accepted:** Two new placeholders join the register (photo, fabric — plus the name, already
  covered generically), and a product page that **cannot enter a live drop** until real photos + fabric
  arrive. The register's zero-condition (before the first REAL drop) now has three more Product-03 rows to
  clear.
- **Links:** `facts.md` §7 (Product 03 sub-block) · `src/config/products.ts` · placeholder register
  (`current-state.md`) · Phase `Y.01`

### D-Y.02-2 · 2026-07-22 · Product 03 joins the existing ENDED `test-drop`, not a new or live drop
- **Status:** Accepted
- **Decided by:** Claude Code (executor), while building Y.02.
- **Context:** The brief says Product 03 is "added to the catalog only; NOT assigned to any drop." But the
  data model makes a drop-less product impossible: `products.drop_id` is **NOT NULL** (schema), the config
  `PRODUCTS` map is **keyed by drop slug**, and the catalog is **drop-scoped** — `getActiveDropView()` →
  `pickActiveDrop()` renders exactly ONE drop's products (a live drop wins, else the soonest upcoming, else
  the most recent). The only committed drop is `test-drop` (ENDED, past window), where the existing two
  products live. So "catalog lists three products" + "browsable-but-not-buyable" + "committed drop stays
  ENDED" can only all hold if Product 03 is added to `test-drop` itself.
- **Decision:** Add Product 03 as the **third** product in the existing **ENDED** `test-drop` (in
  `src/config/products.ts`, where the other two live). Its `sort_order` becomes 3 → the UI renders the
  neutral slot "Производ 03" / "Product 03". `drops.ts` (the schedule) is **untouched** — no new drop, no
  window change; `test-drop` stays ENDED, so all three render browsable-but-not-buyable, the site's default
  state between drops. "NOT assigned to any drop" is read as **not assigned to any live/future/real drop**
  (the DoD's own words: "browsable but not buyable *(no live drop)*").
- **Alternatives considered:** **(a) A separate new drop for Product 03** — rejected: `pickActiveDrop`
  would then feature either the new drop (hiding the existing two from the catalog) or keep `test-drop`
  active (Product 03 never appears), and either breaks "catalog lists three products." **(b) A product with
  no drop row** — rejected: impossible under `drop_id NOT NULL` and the drop-scoped catalog; it would need a
  schema + query change to `create_order`/reservation-adjacent territory, out of scope and against the brief.
- **Downside accepted:** Product 03 shares `test-drop`'s `drop_id` and its ENDED window, and carries the
  `test-` slug prefix (`test-baby-blue`) like its two neighbours. Its true drop assignment — its own real
  first drop with a real slug — is **deferred to `Y.01`**, once real photos exist.
- **Links:** `src/config/products.ts` · `src/lib/drop/state.ts` (`pickActiveDrop`) ·
  `supabase/migrations/20260715021215_schema.sql` (`products.drop_id NOT NULL`) · `D-Y.02-3`

### D-Y.02-3 · 2026-07-22 · No migration — Product 03 lands via the typed config + the existing INSERT-only sync
- **Status:** Accepted
- **Decided by:** Claude Code (executor), while building Y.02.
- **Context:** The brief anticipates that adding a product "may require a new Supabase migration" and asks
  for one only "if adding it requires" it. But the `products`/`variants` tables already exist, and the
  established path for adding a product is the typed config (`D-0-4`) written to the DB by
  `npm run sync:drop` — which **INSERTs** a new product + its per-size variant rows, setting stock on INSERT
  only (`D-1.04-5`) via a direct admin connection (`D-1.04-11`). Adding a product is a **data** operation,
  not a **schema** change.
- **Decision:** Add Product 03 to `src/config/products.ts` and rely on the existing sync to insert the
  product + variant rows. Write **no migration**. No table, no `create_order`, no `expire_reservations`, no
  RLS, no decrement/reservation logic is touched — all byte-unchanged.
- **Alternatives considered:** **A hand-written migration** inserting the product + variant rows — rejected:
  it would duplicate the sync's job, bypass its preflights + idempotency + INSERT-only-stock guarantee, and
  put catalog DATA inside a schema-migration file (the wrong home for it, and the exact mixing the sync
  design avoids).
- **Downside accepted:** The Product 03 rows reach a given database only when someone runs
  `npm run sync:drop` against it — so **production shows Product 03 only after the operator syncs** (the same
  operator step every drop/catalog change already needs; the production DB is not written by this PR). Code
  verified the insert against the **local** DB this phase.
- **Links:** `scripts/sync-core.ts` (INSERT-only) · `scripts/sync-drop.ts` · `D-1.04-5` · `D-1.04-11` ·
  `D-0-4` · `D-Y.02-2`

### D-2.07-1 · 2026-07-23 · Footer redesign shipped as a new out-of-band phase; the stale 1.05 stub/placeholder steps are NOT executed
- **Status:** Accepted
- **Decided by:** Claude Code (executor) + **Petar** (operator chose the redesign path when the session
  surfaced that the handed 1.05 brief was already satisfied and ~15 phases stale).
- **Context:** The brief handed to this session was the original **Phase 1.05** footer brief — "build the
  footer from scratch." But the footer shipped in 1.05 and has been refined since (2.04 a11y), the site is
  live on `www.trajanovv.com`, the **Privacy page carries real 2.03 legal copy** (not a stub), and the
  **email is published** (`info@trajanovv.com`, placeholder #5 cleared in 2.05). Executing the brief
  literally would (a) create a duplicate `Footer.tsx`, (b) **overwrite the real Privacy page** with a
  `[PLACEHOLDER: … Phase 2.03]` stub, and (c) **re-introduce the email placeholder** 2.05 already cleared —
  destructive, not additive. Petar chose to apply the brief's *richer two-zone visual design* as a new phase
  while preserving the real Privacy page and the published email.
- **Decision:** Ship the redesign as new phase **2.07** on `phase-2.07-footer-redesign`. Rebuild
  `SiteFooter.tsx` to the brief's two zones — Zone 1: `КОНТАКТ` + `СЛЕДИ` columns with real `<h2>` eyebrow
  headings + 16px Lucide line icons; Zone 2: a hairline rule + a `© 2026 Трајанов…` row. **Do not** run the
  brief's stub/placeholder steps. **Enrich** the © row with all five existing page links
  (About/Contact/Terms/Privacy/Shipping) so no live footer link is dropped. **`NEXT:` line unchanged** — this
  is out-of-band (the Y.02 precedent) and does not touch the 2.06 → Y.01 critical path.
- **Alternatives considered:** **(a) Execute the 1.05 brief verbatim** — rejected: destroys the real Privacy
  page, re-introduces a cleared placeholder, duplicates the component. **(b) Do nothing** (the footer already
  exists and is correct) — a legitimate reading, offered to Petar, who chose the redesign instead. **(c) The
  brief-literal two-column footer with only a `Privacy` link in the © row** — rejected: drops the
  About/Contact/Terms/Shipping links the site has shipped since 1.05 — a link regression on live legal pages.
- **Downside accepted:** The rendered footer diverges from the 1.05 sketch (five links in the © row, not
  one), and a Part-2 phase number is spent on a component redesign rather than a planned milestone. The new
  MK strings + the overall visual are owed a native-review / Lazar design sign-off (register #17/#18).
- **Links:** `src/components/layout/SiteFooter.tsx` · `src/messages/{mk,en}.json` · `D-1.05-7` ·
  `D-2.03-1` (real Privacy) · `D-2.05-3` (published email) · `D-Y.02-1` (out-of-band precedent) · `D-2.07-2/3`

### D-2.07-2 · 2026-07-23 · Instagram row uses the Lucide `AtSign` icon — this Lucide has no brand Instagram glyph
- **Status:** Superseded by D-2.24-1
- **Decided by:** Claude Code (executor), while building 2.07.
- **Context:** The brief asks for an "instagram icon (Lucide)". `lucide-react 1.24.0` has **dropped its brand
  icons** — there is no `Instagram` export (the build failed on the import). `facts.md` §6 forbids
  fabricating a social presence, and hand-vendoring a Meta/Instagram brand glyph puts trademarked trade dress
  into a public repo (`D-0-1`) for more than the brief asked.
- **Decision:** Use `AtSign` (the `@` mark) for the single social row, paired with the visible
  `@trajanovv2026` handle. It reads honestly as "social handle" and needs no brand asset. The row still links
  to the one real Instagram URL, `target="_blank"`, `rel="noopener noreferrer"`.
- **Alternatives considered:** **(a) Vendor a custom Instagram SVG** — rejected: ships brand trade dress into
  a public repo, not a Lucide icon, more than asked. **(b) Downgrade `lucide-react` to a version with brand
  icons** — rejected: a dependency change (against these phases' no-new-deps discipline) to obtain a
  deprecated, trademark-risky glyph. **(c) No icon on the social row** — rejected: breaks the brief's
  icon-per-item design and the symmetry with the contact rows.
- **Downside accepted:** The social icon is a generic `@`, not the recognizable Instagram camera glyph, so
  the row leans on the handle text + link to convey "Instagram." Whether that reads well is a visual call
  owed to Lazar (register #17).
- **Links:** `src/components/layout/SiteFooter.tsx` · `facts.md` §6 · `src/lib/social.ts` · `D-2.07-1`

### D-2.07-3 · 2026-07-23 · Footer strings in a new `Footer` namespace; page-link labels reuse reviewed `Nav` keys
- **Status:** Accepted
- **Decided by:** Claude Code (executor), while building 2.07.
- **Context:** The brief proposed a lowercase `footer` key holding contact/social/privacy/rights. The
  codebase namespaces are PascalCase (`Nav`, `Home`, `Privacy`, `Meta`), and the privacy/about/terms/shipping
  labels already exist as **reviewed** `Nav` keys (2.02 native review) — re-adding them under a footer key
  would duplicate strings and invite drift.
- **Decision:** Add a `Footer` namespace with exactly three **new** keys — `contact` (КОНТАКТ/CONTACT),
  `social` (СЛЕДИ/FOLLOW), `rights` (© 2026 …). The five page-link labels **reuse** the existing `Nav` keys.
  MK+EN kept at key-parity (catalog-parity test green); `string-inventory.md` regenerated **214 → 217**.
- **Alternatives considered:** **(a) The brief's literal `footer.privacy` key** — rejected: duplicates the
  reviewed `Nav.privacy` string. **(b) Lowercase `footer` namespace** — rejected: breaks the PascalCase house
  convention.
- **Downside accepted:** The three new MK strings post-date the 2.02 native review and are owed a
  native-speaker pass (register #18) — implemented exactly as the brief proposed, flagged for review.
- **Links:** `src/messages/{mk,en}.json` · `docs/i18n/string-inventory.md` ·
  `tests/i18n/catalog-parity.test.ts` · `D-2.07-1`

## Phase 2.08 — Header redesign (nav + build credit)

### D-2.08-1 · 2026-07-23 · Header redesign runs as an out-of-band UI phase (pre-decided by the orchestrator)
- **Status:** Accepted
- **Decided by:** Orchestrator (pre-decided in the brief); executed by Claude Code.
- **Context:** The header change (trim the nav to Catalog/About/Contact, add the "Built by Vertex
  Consulting" credit, keep the MK/EN switch) is a UI polish item, not on the critical path. The next
  planned work is the 2.06 operator rehearsal → Y.01, and this does not touch it. Same shape as 2.07
  (footer redesign, `D-2.07-1`) and Y.02.
- **Decision:** Ship it as out-of-band phase **2.08** on `phase-2.08-header-redesign`. **Line 1 of
  `current-state.md` (the `NEXT:` line) is unchanged** — 2.06's operator rehearsal remains next.
- **Alternatives considered:** Fold it into a scheduled phase — rejected (pre-decided).
- **Downside accepted:** Another entry between now and the rehearsal, and a UI change lands on the live
  site outside the planned sequence.
- **Links:** `briefs/Part-2-Phase-08-Code.md` · `D-2.07-1` · `D-Y.02-1`

### D-2.08-2 · 2026-07-23 · The build credit ships as a `facts.md` § 11 VERIFIED entry, in the header (pre-decided by the orchestrator)
- **Status:** Accepted
- **Decided by:** Orchestrator (pre-decided in the brief); executed by Claude Code.
- **Context:** The "Built by Vertex Consulting" credit is a rendered factual claim, so it needs a
  VERIFIED `facts.md` source before it can ship (Content-truth rule). The operator (Lazar) supplied it
  as a real fact: Vertex Consulting is the operators' own consultancy and authorised the credit
  (2026-07-23). It appears in the site header only, and is **barred** from JSON-LD / `sameAs` / OG /
  `llms.txt` / sitemap / footer / legal pages — it is a build credit, not a partner/sponsor/stockist.
- **Decision:** Add `facts.md` § 11 (Site build credit) VERIFIED, render the credit in the header, and
  contain it there. URL `https://www.vertexconsulting.mk/en` marked VERIFIED but **click-test owed**
  before ship (same rule as the Instagram URL, `facts.md` § 6).
- **Alternatives considered:** **(a) A `[PLACEHOLDER: …]`** — rejected: there is a real, operator-supplied
  fact, so a placeholder would be false. **(b) Footer-only placement** (the conventional spot) — rejected:
  less prominent than the top nav, which the orchestrator wanted.
- **Downside accepted:** A third-party company name now sits in the top nav of a minor's store on every
  page, and the link is an off-site exit from the buy path.
- **Links:** `facts.md` § 11 · `src/components/layout/SiteHeader.tsx` · `src/messages/{mk,en}.json`
  (`Credit` namespace) · owed-verification register #19/#20/#21

### D-2.08-3 · 2026-07-23 · The redesigned header is NOT sticky (the pre-existing `sticky top-0` is dropped)
- **Status:** Accepted
- **Decided by:** Claude Code (executor), while rebuilding `SiteHeader.tsx`.
- **Context:** The old header was `sticky top-0 z-40 … backdrop-blur` — it followed the viewport on
  scroll over a semi-transparent ground. The brief's **Out of scope** list names "a sticky/scroll-shrink
  header," and its target-header spec describes a plain one-row (desktop) / two-row (mobile) block with a
  bottom hairline and says nothing about sticky. Repo-vs-brief difference: the repo had a sticky header;
  the brief lists a sticky header as out of scope.
- **Decision:** Rebuild the header as a **static** (non-sticky) block on a **solid** `--color-ground`
  (`#0F1210`), dropping `sticky`/`z-40`/`backdrop-blur`. This matches the brief's out-of-scope line and
  gives a clean, single-colour "header ground" for the DoD's measured-contrast requirement.
- **Alternatives considered:** **(a) Preserve the existing `sticky top-0 … backdrop-blur`** — rejected:
  the brief lists a sticky header as out of scope, and a translucent scrolling ground makes "contrast on
  the header ground" ambiguous. **(b) Sticky but opaque** — same objection.
- **Downside accepted:** A behaviour change to the live site beyond pure layout — on long pages (product,
  legal) the nav and cart now scroll away with the page instead of staying pinned; a returning buyer must
  scroll up to reach them. Surfaced to the operator (this is the notable brief-vs-repo difference).
- **Links:** `src/components/layout/SiteHeader.tsx` · brief "Out of scope" · brand.md § 3 (`--color-ground`)

### D-2.08-4 · 2026-07-23 · `SiteHeader` is a Client Component so the nav can read `usePathname()` for the active-page indicator
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Context:** The brief requires an active-page underline + `aria-current="page"` on the current nav
  link. Detecting the current route needs `usePathname()` (a client hook). The old header was a Server
  Component.
- **Decision:** Mark `SiteHeader.tsx` `'use client'` and compute `isActive(href)` from `usePathname()`.
  Keeps all header code in the one in-scope file; `useTranslations` / `t.rich` / the typed `Link` all work
  in a client component under the existing `NextIntlClientProvider`.
- **Alternatives considered:** Extract a separate `'use client'` nav sub-component and keep `SiteHeader` a
  Server Component — rejected: adds an unlisted file for a header that is already tiny and already pulls in
  the client `LanguageSwitch`.
- **Downside accepted:** The whole (small) header now hydrates as client JS on every page rather than the
  nav alone. It still server-renders its initial HTML, so there is no content/SEO cost.
- **Links:** `src/components/layout/SiteHeader.tsx` · `src/i18n/navigation.ts` (`usePathname`)

### D-2.08-5 · 2026-07-23 · Canonical DOM order + a deterministic 3-row mobile grid (credit on its own full-width row)
- **Status:** Superseded by D-2.08-6 (the grid/baseline layout misaligned the seven header items on the desktop row; replaced by a single items-center flex row)
- **Decided by:** Claude Code (executor).
- **Context:** The brief specifies **different** per-breakpoint arrangements — desktop is one row
  (wordmark · credit … nav · MK·EN · cart); mobile is two rows (row 1 wordmark / MK·EN·cart, row 2 credit
  / nav), with a fallback: "if row 2 cannot fit at 320px … move the build credit to its own third row above
  the hairline … the credit must be visible at every breakpoint." In practice the long MK credit
  („Изработено од Vertex Consulting") and the three MK nav links do **not** co-fit on one row at 320–375px,
  so the 2-row mobile is not achievable for the default (MK) locale at the tested widths. Separately,
  because the two breakpoints want different orders, DOM order can match the visual order of only one of
  them.
- **Decision:** (a) Put the DOM/reading order in the **canonical** sequence the brief states —
  wordmark → credit → Catalog → About → Contact → MK·EN → cart — so the accessibility tree itself is valid
  order-evidence and desktop focus order matches the visual row. (b) Lay mobile out as a **deterministic
  CSS grid of three rows**: row 1 wordmark | MK·EN·cart, row 2 the nav (right), row 3 the credit on its own
  full width directly above the hairline. Desktop switches the same element to a baseline-aligned flex row
  (nav pushed right with `ml-auto`). Cart is the last item on every breakpoint.
- **Alternatives considered:** **(a) A `flex-wrap` that flips 2-row↔3-row by available width** — rejected:
  its wrap point is content/width-dependent and can misbehave between 375–640px (credit landing beside the
  cart), and it couples DOM grouping to the mobile rows, which forces the desktop focus order to jump
  (wordmark → lang → cart → credit → nav). **(b) Group the mobile rows in the DOM** (wordmark+controls, then
  credit+nav) — rejected: makes the accessibility-tree order differ from the brief's stated order and gives
  a jumpy desktop focus order.
- **Downside accepted:** On mobile the credit is on its own row (row 3) at **all** mobile widths, not only
  ≤320px — i.e., the brief's "fallback" layout is the mobile default — so on a wide phone where a 2-row could
  have fit, the header is one row taller than the brief's ideal. And because the two breakpoints want
  different orders, the mobile visual order (controls on row 1, credit read 2nd but shown on row 3) is not a
  perfect match to the top-to-bottom DOM order — an accepted minor reading nuance for header chrome. Verified
  in-browser: no horizontal overflow at 320px or 375px in either locale; the credit is fully visible at every
  breakpoint.
- **Links:** `src/components/layout/SiteHeader.tsx` · brief "The target header" / "Mobile (< 640px)"

### D-2.08-6 · 2026-07-23 · Header is one items-center / justify-between flex row of two groups — fixes the seven-item alignment (supersedes D-2.08-5's layout)
- **Status:** Superseded by D-2.13-1 (layout only — the one-centreline fix stands)
- **Decided by:** Claude Code (executor), on Petar's report that the shipped header was misaligned.
- **Context:** The D-2.08-5 layout (a grid on mobile that flexed to `sm:items-baseline` on desktop, with the
  MK·EN + cart cluster forced back to `sm:self-center`) put the wordmark, the credit and the three nav links
  on the **text baseline** while MK·EN and the cart sat on the **vertical center** — so on the desktop row
  the first five items visibly floated above the line the switch and cart sat on. The gaps were also uneven
  (the grid's `gap-x-4` applied between some items while `ml-auto` set others), so nav → MK·EN → cart did not
  match the spacing between the nav links.
- **Decision:** Rebuild the header as **one flex row, `items-center` + `justify-between`**, with two groups:
  a LEFT group (wordmark + credit) and a RIGHT group (the three nav links, then MK·EN, then the cart). Every
  container is `items-center`; **no item carries a baseline nudge, a `self-*` override, or a margin-top**. The
  cart keeps its 44px tap target but, being in an `items-center` row, is centered rather than setting anyone's
  offset (it still sets the row height, but all seven items center within it). Gaps use exactly **two tokens**:
  `gap-4` (16px) between the three nav links, and `gap-6` (24px) used identically for nav → MK·EN and
  MK·EN → cart (the right group's `gap-x-6` gives nav → MK·EN; the MK·EN+cart sub-group's `gap-6` gives
  MK·EN → cart). On narrow screens the single row **wraps** (`flex-wrap`, `sm:flex-nowrap`): the right group
  drops below the left group and then splits (nav, then MK·EN+cart) — no horizontal overflow at 320px, and the
  credit stays visible (it wraps its own text at the narrowest widths). **Verified by computed geometry, not by
  eye:** at 1280px all seven items report an identical vertical center (34.0px, max delta **0**); measured gaps
  are 16/16/24/24px. Contrast re-measured (credit 7.85 · Vertex link 8.95 · nav default 7.85 · nav active
  15.42 · lang active 15.42 · lang inactive 7.85, all ≥ 4.5); credit link tap target restored to 24px;
  no overflow at 320/375 in either locale; build/tsc/lint clean, `npm test` 85/85 incl. the oversell gate.
- **Alternatives considered:** **(a) Keep D-2.08-5 and only swap `sm:items-baseline` → `sm:items-center`** —
  rejected: it would center the items but leave the uneven grid gaps and the `self-center` special-case, and
  the grid's per-item placement is exactly the kind of per-item offset the report asked to remove. **(b) A
  single non-wrapping row at all widths** — rejected: it overflows at 320–375px (nav + MK·EN + cart alone
  exceed a phone width), violating the no-overflow rule. **(c) Force the credit onto its own row on mobile
  again (the old grid)** — rejected: the wrap now handles it and keeps one shared structure across
  breakpoints.
- **Downside accepted:** On mobile the header is up to three wrapped rows (left group, nav, MK·EN+cart), and
  at 320px the long credit wraps to two lines — taller than a single desktop row, but overflow-free and fully
  visible. Nothing else regresses (D-2.08-1/2/3/4 stand; DOM/reading order stays wordmark → credit → nav →
  MK·EN → cart).
- **Links:** `src/components/layout/SiteHeader.tsx` · supersedes `D-2.08-5` · `D-2.08-3` (non-sticky) ·
  `D-2.08-4` (client component)

### D-2.09-1 · 2026-07-23 · Size-order fix runs as an out-of-band UI phase; `NEXT:` unchanged
- **Status:** Accepted
- **Decided by:** Orchestrator (pre-decided in the Phase 2.09 brief); executed by Claude Code.
- **Context:** The product-page size buttons render L · M · S · XL (alphabetical), which reads as
  broken on the one screen where a customer decides. It is a one-line behavioural bug, not part of
  the real content load.
- **Decision:** Ship the fix now as its own out-of-band UI phase (the 2.07/2.08/Y.02 shape), leaving
  line 1 `NEXT:` (the 2.06 operator rehearsal) exactly as it is.
- **Alternatives considered:** Fold it into Y.01 with the real content load — rejected: it would sit
  behind the whole content load and leave the buy cluster visibly wrong on the live site until then.
- **Downside accepted:** Another decision entry and another deploy between now and the rehearsal, for
  a one-line behavioural change.
- **Links:** `src/lib/drop/size-order.ts` · `src/lib/drop/state.ts` · `briefs/Part-2-Phase-09-Code.md`

### D-2.09-2 · 2026-07-23 · One shared canonical size order for every product; no per-product override
- **Status:** Accepted
- **Decided by:** Orchestrator (pre-decided in the Phase 2.09 brief); executed by Claude Code.
- **Context:** `toProductView()` in `src/lib/drop/state.ts` is the single place size order is decided
  for every product (`grep -rn "localeCompare" src/` returned only that one line). Postgres does not
  guarantee variant row order, so the sort there — not `products.ts` — decides what renders.
- **Decision:** Fix the order once, centrally, with one canonical garment-size rule applied to all
  products. Product 02 (`test-off-white`, XL only) passes through the same changed line; a
  single-item sort is a provable no-op, so its rendered output is byte-identical.
- **Alternatives considered:** (a) Hardcode the order per product — rejected: silently breaks the
  moment Vladimir's real drop adds a product. (b) Reorder rows in `products.ts` and hope Postgres
  returns them in that order — rejected: row order is not guaranteed on read, so it fixes nothing
  reliably, and `products.ts` is frozen this phase.
- **Downside accepted:** The operator scoped the visible change to Products 01 and 03, yet Product 02
  necessarily runs through the same edited line — accepted because its single XL variant makes the
  sort provably a no-op.
- **Links:** `src/lib/drop/state.ts` · `src/config/products.ts` (unchanged)

### D-2.09-3 · 2026-07-23 · The comparator lives in its own pure module with a unit test, not inline in `state.ts`
- **Status:** Accepted
- **Decided by:** Orchestrator (pre-decided in the Phase 2.09 brief); executed by Claude Code.
- **Context:** `state.ts` starts with `import "server-only"`, so it cannot be imported by a plain
  vitest run — an inline sort there could not be unit-tested.
- **Decision:** Put the rule in a new pure module `src/lib/drop/size-order.ts` (canonical list +
  `compareSizeLabels(a, b)`), with **no** `server-only` import, and a dedicated unit test
  (`tests/drop/size-order.test.ts`). `state.ts` imports and calls it.
- **Alternatives considered:** An inline `.sort()` in `state.ts` (one file, no new test) — rejected:
  it is unreachable by a unit test, so the ordering rule would ship unproven.
- **Downside accepted:** One more file and one more test to maintain; the ordering rule now sits one
  import away from the code that uses it.
- **Links:** `src/lib/drop/size-order.ts` · `tests/drop/size-order.test.ts` · `src/lib/drop/state.ts`

### D-2.09-4 · 2026-07-23 · Local render evidence via a hand-written local seed, because `sync:drop` is frozen
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Context:** The DoD requires rendering the three real catalogue product pages
  (`test-mustard-ochre`, `test-off-white`, `test-baby-blue`) locally. Those slugs live in
  `src/config/products.ts` and normally reach a database only via `npm run sync:drop` — which this
  phase explicitly freezes (and Task 6 forbids sync/reset/hosted). The local DB held only the
  test-suite seed products (`test-tee-*`), so the catalogue was empty of these three.
- **Decision:** Seed the three products (+ their variants and the past-dated `test-drop`) directly
  into the **local** database with a one-off, idempotent SQL insert that mirrors `products.ts`
  exactly. The variants were inserted in a **deliberately non-canonical order** (`XL S L M` /
  `L XL S M`) so that a page rendering S · M · L · XL proves the comparator is ordering them, not
  Postgres. This is a local-only, non-committed data operation — not `sync:drop`, not `--linked`,
  not a reset, no hosted write, and it changes no git-tracked file.
- **Alternatives considered:** (a) Run `npm run sync:drop` against local — rejected: explicitly
  frozen this phase (it is Y.01's content-load tool). (b) `supabase db reset` to reapply a seed —
  rejected: Task 6 forbids reset and it would wipe the other operator's local state. (c) Point the
  dev server at the hosted DB (which already has the three products) — rejected: Task 6 says local
  database only, never the hosted project.
- **Downside accepted:** The rendered evidence depends on a hand-written local seed rather than the
  real config→DB path; the seed is disposable (a future `supabase db reset` reapplies `seed.sql` and
  drops it). Mitigated by mirroring `products.ts` byte-for-byte and by shuffling the insert order so
  the render is a genuine test of the fix.
- **Links:** `src/config/products.ts` · `supabase/seed.sql` · Task 6 of `briefs/Part-2-Phase-09-Code.md`

### D-2.10-1 · 2026-07-23 · Product-card pointer spotlight — a logged, narrow exception to brand.md §5 (decoration) and §6 (motion)
- **Status:** Accepted
- **Decided by:** Orchestrator (pre-decided in the Phase 2.10 brief, decision C); executed by Claude Code.
- **Context:** The catalogue is a grid of flat dark cards on a flat dark ground with nothing marking
  which card the cursor is on. `brand.md` §5 says "shadow is for overlays only, never decoration"
  and the §2 direction says "motion belongs to the countdown and the drop reveal, nothing else." A
  pointer-tracked glow is both decoration and motion — so shipping it silently would look like the
  rules had been forgotten.
- **Decision:** Ship a subtle white glow (the `--color-glow` token = the off-white `--color-foreground`,
  **never** pure white) on the **interactive** product card, keyed to the pointer, on hover/focus only.
  Log it as this exception and add a carve-out sentence to `brand.md` §5 and §6 so the next reader sees
  the rule was consciously bent, not missed. The exception is **narrow**: product cards only, hover +
  keyboard-focus only, fine-pointer only, no animation loop, no transform.
- **Alternatives considered:** (a) Add the glow without touching `brand.md` — rejected: it would read
  as an un-owned violation of two stated rules. (b) Use pure `#FFFFFF` — rejected (decision A): every
  white on this site is the warm off-white foreground token; a cooler second white reads as a
  different palette. (c) A coloured/hue-rotating glow like the source component — rejected: the colour
  is explicitly not wanted.
- **Downside accepted:** Two brand rules now each carry a documented exception, and the card has one
  decorative, motion-bearing effect that must stay scoped (a future reader could cite it to justify
  more). Contained by keeping the effect on a single class used only by `ProductCard`'s interactive
  branch, and by the fine-pointer + reduced-motion gates.
- **Links:** `brand.md` §3/§5/§6 · `src/app/globals.css` (`.spotlight-card`) ·
  `src/components/product/SpotlightCard.tsx` · `briefs/Part-2-Phase-10-Code.md`

### D-2.10-2 · 2026-07-23 · Rewrote the supplied 21st.dev `GlowCard`, did not paste it
- **Status:** Accepted
- **Decided by:** Orchestrator (pre-decided in the Phase 2.10 brief); executed by Claude Code.
- **Context:** The operator supplied a 21st.dev "spotlight card" (`GlowCard`) as the reference for the
  *effect*. As written it is unusable here for six concrete reasons.
- **Decision:** Rebuild the effect from scratch against this repo's rules. Each of the source's six
  problems is resolved: (1) a `document`-level `pointermove` listener per card → **one `onPointerMove`
  on the card's own element**, rAF-throttled; (2) `background-attachment: fixed` (viewport-anchored,
  janky on mobile Safari) → **a plain positioned pseudo-element**; (3) a per-card
  `<style dangerouslySetInnerHTML>` with unscoped `[data-glow]` → **one scoped `.spotlight-card` block
  in `globals.css`**, no JSX-injected CSS; (4) hardcoded `hsl()` / a 3px border → **tokens only, a 1px
  hairline**; (5) fixed `w-64 h-80` + `aspect-[3/4]` fighting the grid → **no sizing; wraps the
  existing card body untouched**; (6) no `prefers-reduced-motion`, no pointer guard, colourful
  hue-rotation → **fine-pointer + mouse-only guards, the global reduced-motion rule, off-white only**.
- **Alternatives considered:** Paste the component and patch it — rejected: it would drag in the
  document listeners, the injected global CSS, and the hardcoded colours, i.e. every reason it was
  rejected.
- **Downside accepted:** We own and maintain the effect code rather than a third-party component.
  Correct here — the component could not have shipped under this repo's rules regardless.
- **Links:** `src/components/product/SpotlightCard.tsx` · `src/app/globals.css` · `briefs/Part-2-Phase-10-Code.md`

### D-2.10-3 · 2026-07-23 · Border-mask sentinel is the opaque `--color-foreground` token, not the brief's literal `#000`
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Context:** Task 3 specifies the standard border-only mask as
  `linear-gradient(#000,#000) padding-box, linear-gradient(#000,#000) border-box`. But the phase's own
  Definition of Done requires **zero literal hex / `rgb()` / `hsl()` in `git diff main`**, and the CSS
  rule "every colour comes from a token." `#000` in a mask is a hex literal — the two instructions
  conflict.
- **Decision:** Use `linear-gradient(var(--color-foreground), var(--color-foreground))` for both mask
  layers. A mask reads only the **alpha** channel; `--color-foreground` is fully opaque (alpha 1),
  identical to `#000` for masking purposes, so the border-only result is unchanged — while the diff
  stays hex-free and every value is a token. The visible border/glow region is decided by
  `mask-composite: exclude` / `-webkit-mask-composite: xor`, never by the sentinel's colour.
- **Alternatives considered:** (a) Keep `#000` as written — rejected: fails the DoD's "zero literal
  hex" grep gate. (b) Use the `black` keyword — rejected: it dodges the hex grep but is still a
  hardcoded colour, violating "every colour comes from a token." (c) `currentColor` — rejected:
  ties the mask to inherited text colour for no benefit and is less obviously opaque to a reader.
- **Downside accepted:** A reader must know the mask sentinel is an alpha-only stencil, not a visible
  colour — noted in a comment beside the rule. Deviates from the brief's literal text (flagged in the
  completion report §3).
- **Links:** `src/app/globals.css` (`.spotlight-card::before` mask) · Task 3 + DoD of `briefs/Part-2-Phase-10-Code.md`

### D-2.11-1 · 2026-07-23 · The FAQ lives on the Home page, not on its own route
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.11 brief); executed by Claude Code.
- **Context:** Buyers arriving from an Instagram story ask the same five questions every time (how do I
  pay, where do you ship, how long, how many, why so few) and today must open Terms or Shipping to
  answer any of them. The FAQ needs to sit on the front door.
- **Decision:** Render the eight-question FAQ as a section on Home, under the hero, in both locales.
- **Alternatives considered:** A dedicated `/chesti-prashanja` · `/en/faq` page linked from the footer
  (the orchestrator's own recommendation).
- **Downside accepted:** Home is no longer a single-purpose page — the countdown shares it — and the
  page gets longer on mobile.
- **Links:** `src/components/home/HomeFaq.tsx` · `src/app/[locale]/page.tsx`

### D-2.11-2 · 2026-07-23 · The reference design's category tab row is replaced by three static group labels
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the brief); executed by Claude Code.
- **Context:** The reference mockup filters questions through pill-shaped category tabs. With only
  eight questions, tabs would hide two-thirds of the answers behind a tap on the one page whose job is
  to convert, and would add client state to a section that otherwise needs none.
- **Decision:** Three quiet uppercase group labels — **Нарачка / Достава / Парчињата** — sit inside the
  list, with every question visible at once. No interactive filtering.
- **Alternatives considered:** Interactive filter tabs as drawn in the mockup.
- **Downside accepted:** The horizontal pill row that visually balanced the big heading is gone, so the
  heading sits closer to the first question — handled with spacing, not a decorative row.
- **Links:** `src/lib/faq.ts` · `src/components/home/HomeFaq.tsx`

### D-2.11-3 · 2026-07-23 · Native `<details>`/`<summary>` + CSS, not a Radix/shadcn accordion
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the brief); executed by Claude Code.
- **Context:** The rows need to expand/collapse. A component-library accordion would pull in a new
  dependency and a client component on a page that does not otherwise need one for this.
- **Decision:** Use native `<details name="home-faq">`/`<summary>` styled in `globals.css`. It gives
  correct keyboard and screen-reader behaviour for free, ships zero JS, stays server-rendered, keeps
  every answer in the DOM for crawlers, and the shared `name` gives native one-open-at-a-time.
- **Alternatives considered:** `npx shadcn@latest add accordion` (`@radix-ui/react-accordion`) — a new
  dependency + a client component.
- **Downside accepted:** The open/close height animation depends on `::details-content` +
  `interpolate-size`, which some browsers do not yet support — there the panel snaps open while the
  icon still animates. Acceptable graceful degradation; must NOT be "fixed" with a dependency or JS.
- **Links:** `src/app/globals.css` (`.faq-item` block) · `src/components/home/HomeFaq.tsx`

### D-2.11-4 · 2026-07-23 · Eight questions only — five deliberately not asked
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the brief); executed by Claude Code.
- **Context:** The reference has a ~20-question grid. Returns window, fabric/care, courier name,
  delivery cost and exact size measurements do not exist in `facts.md` (placeholder register #3, #6,
  #7, #9 and the measurements half of #4).
- **Decision:** Ask exactly eight questions, all of whose answers trace to a `facts.md` VERIFIED entry
  or a restatement of an already-reviewed Terms/Shipping string. Do not ask the five that would need a
  fact we do not have.
- **Alternatives considered:** Mirror the reference's ~20-question grid and fill the gaps with
  `[PLACEHOLDER: …]` markers.
- **Downside accepted:** The section looks thinner than the mockup until Vladimir supplies that content
  in Y.01. (Adding placeholders would have grown a register that must reach zero before the first real
  drop — the worse outcome.)
- **Links:** `src/lib/faq.ts` · source-trace table in `briefs/Part-2-Phase-11-Code.md`

### D-2.11-5 · 2026-07-23 · A `FAQPage` JSON-LD node is emitted on Home, from the same keys as the visible copy
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the brief); executed by Claude Code.
- **Context:** Structured FAQ data helps search / answer engines, but is a factual-claim surface that
  must stay honest and cannot be allowed to drift from the visible answers.
- **Decision:** Emit a `FAQPage` node on Home, built by iterating the same single source
  (`src/lib/faq.ts`) and resolving the same message keys as the visible section — so the visible and
  structured answers cannot differ. A test asserts 8 questions, non-empty name/text, faq.ts order, and
  key existence in both catalogs.
- **Alternatives considered:** No structured data at all.
- **Downside accepted:** One more schema surface to keep honest — mitigated by the single-source build.
- **Links:** `src/lib/seo/faq-jsonld.ts` · `tests/seo/faq-jsonld.test.ts`

### D-2.11-6 · 2026-07-23 · The MK nested "Sold out" quote uses the repo's „…“ convention
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Context:** `Faq.a8` quotes the on-screen sold-out word inside the sentence. The brief rendered it
  as „Распродадено" (Macedonian low-opening quote). The repo's one existing quoted Macedonian phrase,
  `About.quote`, uses the pair „…“ (low-9 opening `U+201E`, high-6 closing `U+201C`).
- **Decision:** Ship `Faq.a8` with the matching pair — „Распродадено“ — for typographic consistency
  with the rest of the MK build, rather than an ASCII or `U+201D` closing glyph.
- **Alternatives considered:** (a) A straight/typewriter closing quote — rejected: inconsistent with
  `About.quote` and not the Macedonian convention. (b) `U+201D` closing — rejected: same reason.
- **Downside accepted:** The exact closing glyph is a judgement a native reviewer should confirm — so
  it is called out explicitly in `docs/i18n/mk-review-2.11.md` §4.
- **Links:** `src/messages/mk.json` (`Faq.a8`) · `docs/i18n/mk-review-2.11.md`

### D-2.11-7 · 2026-07-23 · The `FAQPage` JSON-LD is rendered inside `HomeFaq`, co-located with the visible copy
- **Status:** Accepted
- **Decided by:** Claude Code (executor).
- **Context:** The brief says to render the node "on Home only, via the existing `<JsonLd>` component"
  but does not say from which component. `HomeFaq` already resolves the locale + `Faq` translator it
  needs.
- **Decision:** Render `<JsonLd data={faqJsonLd(...)} />` inside `HomeFaq`'s returned fragment, so the
  visible section and its structured data are produced by one component from one translator — they
  mount and unmount together and cannot be wired to Home separately by mistake.
- **Alternatives considered:** Render the `<JsonLd>` in `src/app/[locale]/page.tsx` next to
  `<HomeFaq />` — rejected: it would need its own `getTranslations('Faq')` call, duplicating the
  locale wiring and creating a second place the FAQ data is assembled.
- **Downside accepted:** A reader looking only at `page.tsx` does not see the JSON-LD emission; it lives
  one level down in `HomeFaq`. Noted in the completion report.
- **Links:** `src/components/home/HomeFaq.tsx` · `src/lib/seo/faq-jsonld.ts`

### D-2.12-1 · 2026-07-24 · The Home hero sub-line becomes a brand line, not a facts line
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the brief); executed by Claude Code.
- **Context:** The paragraph under the Home headline (`Home.sub`) recited three `facts.md` VERIFIED
  claims — drops of 3–5 pieces, real limited stock, cash on delivery. Since Phase 2.11 those facts
  are answered eight ways in the FAQ directly below the hero.
- **Decision:** Replace the factual line with a brand line in both locales. The three facts leave the
  highest-attention slot on the site.
- **Alternatives considered:** Keep the factual line and place the brand line elsewhere on Home.
- **Downside accepted:** A first-time visitor no longer learns *how payment works* in the first
  screenful; they learn it one scroll down, in the FAQ.
- **Links:** `src/messages/mk.json` · `src/messages/en.json` (`Home.sub`) ·
  `src/components/home/HomeExperience.tsx`

### D-2.12-2 · 2026-07-24 · Both strings ship byte-exact as the operator supplied them; Code edits neither language
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the brief); executed by Claude Code.
- **Context:** MK is the source language on this project and EN is a translation of it — **except
  here.** The operator supplied both lines. The Macedonian is deliberately **not** a literal
  translation of the English and is deliberately shorter; the English is deliberately a comma splice.
- **Decision:** Ship both strings byte-exact as supplied. Code does not smooth the Macedonian, does
  not re-punctuate, and does not align the two languages word-for-word.
- **Alternatives considered:** Code smooths the Macedonian, or aligns the two languages word-for-word.
- **Downside accepted:** If the MK line reads wrong to a native eye, it ships wrong and is corrected in
  a follow-up phase rather than caught inside this one — which is exactly why the MK review pack
  (`docs/i18n/mk-review-2.12.md`) exists.
- **Links:** `src/messages/mk.json` · `src/messages/en.json` (`Home.sub`) · `docs/i18n/mk-review-2.12.md`

### D-2.12-3 · 2026-07-24 · `Meta.homeDescription` (the search snippet) is not touched
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the brief); executed by Claude Code.
- **Context:** `Meta.homeDescription` still reads "Oversized unisex t-shirts from Strumica. Drops of 3
  to 5 pieces, real limited stock, cash on delivery." — the search-result snippet for Home. The brief
  refers to this key as `Metadata.homeDescription`; the actual namespace in the catalogs is `Meta`.
- **Decision:** Leave the snippet unchanged. The search-result snippet and the on-page hero now say
  different things — deliberately.
- **Alternatives considered:** Change the search snippet to match the new hero line.
- **Downside accepted:** Snippet and hero diverge — accepted, because the snippet's job is to state
  what is for sale and the hero's job is not. Do not "harmonise" them.
- **Links:** `src/messages/mk.json` · `src/messages/en.json` (`Meta.homeDescription`)

### D-2.13-1 · 2026-07-24 · Header becomes a three-column grid; the nav sits on the true page centreline
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.13 brief); executed by Claude Code.
- **Decision:** Header becomes a three-column grid; the nav sits on the true page centreline. Supersedes
  the layout half of D-2.08-6 (one `justify-between` flex row of two groups). The container becomes a CSS
  grid whose outer columns are `minmax(0,1fr)` and whose middle column is `auto`, so the nav is centred on
  the container's centreline regardless of how wide the left and right groups are.
- **Alternative rejected:** Keep the flex row and simply make the `<nav>` a third `justify-between` child
  — rejected because the left group (wordmark + a long MK credit) is roughly three times the width of the
  right group, so `justify-between` would leave the nav visibly right of centre, which is the complaint.
- **Downside accepted:** The visual gap between the nav and the MK·EN / cart cluster is now large and
  asymmetric-looking on wide screens — that is inherent to true centring and is not a bug. D-2.08-6's
  alignment fix (one centreline, no baseline nudges, two gap tokens) is carried forward unchanged.
- **Links:** `src/components/layout/SiteHeader.tsx` · supersedes the layout half of `D-2.08-6` ·
  `D-2.08-3` (non-sticky) · `D-2.08-4` (client component)

### D-2.13-2 · 2026-07-24 · Below the switch breakpoint the nav gets its own centred row
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.13 brief); executed by Claude Code.
- **Decision:** Below the switch breakpoint the nav gets its own centred row. It does not stay in the
  right-hand cluster.
- **Alternative rejected:** Keep the nav right-aligned alongside MK·EN + cart on narrow screens — rejected
  because the request is "centre the nav" and a header that centres it only on desktop reads as a bug on a
  phone, which is where most traffic lands.
- **Downside accepted:** On some narrow widths the header is one row taller than it is today.
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.13-1`

### D-2.13-3 · 2026-07-24 · The switch breakpoint is lg (1024px), and copy is never sacrificed to make a row fit
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.13 brief); executed by Claude Code.
- **Decision:** The switch breakpoint is `lg` (1024px), and copy is never sacrificed to make a row fit. At
  768px the Macedonian header content (the long „Изработено од Vertex Consulting" credit plus the longer MK
  nav labels) does not comfortably co-fit on one row with the nav centred.
- **Alternative rejected:** Switch at `md` — rejected as too tight to hold in MK.
- **Downside accepted:** Tablets 768–1023px get the two-row layout rather than the desktop row. If
  measurement shows the three-column row still does not fit at 1024px in MK, raise the switch to `xl` (1280)
  — never shrink a type token, never truncate, hide, or reword the credit or a nav label.
- **Execution note (Claude Code, 2026-07-24):** Measurement (Task 4) evaluated the `xl` conditional and the
  switch was **kept at `lg`**. At 1024px the MK three-column row fits with **no horizontal overflow** and the
  nav centred at **offset 0px**; the left group wraps to a clean two-line wordmark-over-credit block (the
  overflow-ladder rung 1 that the reference markup's `flex-wrap` already provides). EN fits on one line at
  1024px. Raising to `xl` would push EN's clean 1024px single-row into the two-row layout to fix a non-broken
  MK wrap, so `lg` was retained. No type token was shrunk and no label truncated or reworded.
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.13-1` · `D-2.13-2`

### D-2.14-1 · 2026-07-24 · The burger appears below lg (1024px); at lg and above nothing changes
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.14 brief); executed by Claude Code.
- **Decision:** The burger appears below `lg` (1024px). At `lg` and above nothing changes.
- **Alternative rejected:** Switching at `md` (768px), which would keep the visible second-row nav on
  tablets.
- **Downside accepted:** Viewports 768–1023px lose the always-visible nav and gain one tap.
- **Reason:** `lg` is exactly where the nav currently drops to its own row (`D-2.13-2/3`), so the burger
  **replaces** that row — one rule, one breakpoint, no third layout to maintain.
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.13-2` · `D-2.13-3`

### D-2.14-2 · 2026-07-24 · An in-flow disclosure panel, not a modal drawer or overlay
- **Status:** Superseded by D-2.15-1
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.14 brief); executed by Claude Code.
- **Decision:** The panel expands inside the header block and pushes the page down; it does not slide over
  the page, does not portal, does not lock scroll, does not dim the background.
- **Alternative rejected:** A Sheet/Dialog drawer built on `@base-ui/react` or a generated
  `components/ui/sheet`.
- **Downside accepted:** No slide-in-from-the-edge feel; it is a plain expand.
- **Reason:** Three links do not need a portal, a focus trap and a scroll lock, `D-2.11-3` set the house
  precedent (zero-dependency disclosure, graceful degradation), and a first-ever UI primitive is a new
  surface that can break on drop day.
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.11-3`

### D-2.14-3 · 2026-07-24 · React state, not native `<details>/<summary>`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.14 brief); executed by Claude Code.
- **Decision:** The open/close state is React `useState`, not a native `<details>/<summary>` disclosure.
- **Alternative rejected:** `<details>`, the 2.11 FAQ pattern.
- **Downside accepted:** A small amount of JS in the header, and with JS disabled the menu will not open.
- **Reason:** `<details>` does **not** close itself when a link inside it is activated, so the customer
  would land on the next page with the menu hanging open. Mitigation for the JS-off case, stated honestly:
  About, Contact, Terms, Privacy and Shipping are in the footer on every page, and `/catalog` is linked
  from Home, About, Cart, Checkout and the product page — no route becomes unreachable.
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.11-3`

### D-2.14-4 · 2026-07-24 · One new message key, `Nav.menu`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.14 brief); executed by Claude Code.
- **Decision:** One new message key, `Nav.menu` — MK „Мени" / EN "Menu", used as the button's
  `aria-label`. State is carried by `aria-expanded`, so there is **no** second "close menu" string.
- **Alternative rejected:** A label that swaps to "Close menu" when open.
- **Downside accepted:** The accessible name does not describe the close action. 241 → **242** keys.
- **Links:** `src/messages/mk.json` · `src/messages/en.json` (`Nav.menu`)

### D-2.14-5 · 2026-07-24 · MK·EN and the cart stay outside the menu, always visible
- **Status:** Superseded by D-2.15-2
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.14 brief); executed by Claude Code.
- **Decision:** Only the three page links go behind the burger. MK·EN and the cart stay outside the menu,
  always visible.
- **Alternative rejected:** Sweeping the language switch into the panel for a cleaner row.
- **Downside accepted:** The phone header row carries four controls (burger, МК, EN, cart) and must be
  proven not to overflow at 320px.
- **Reason:** The cart is the buy path and nothing on the buy path goes behind a tap; the language switch
  is how an English reader escapes a Macedonian page.
- **Links:** `src/components/layout/SiteHeader.tsx`

### D-2.14-6 · 2026-07-24 · The existing `<nav>` element *is* the panel; DOM order is unchanged from 2.13
- **Status:** Superseded by D-2.15-1
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.14 brief); executed by Claude Code.
- **Decision:** No element is reordered, no `order-*` utility is used, nothing moves in the markup: the
  same `<nav>` is hidden below `lg` until opened, and is unchanged at `lg`. Because the panel therefore
  sits *before* its trigger in the DOM, **focus moves to the first link when the menu opens and returns to
  the button when it closes.**
- **Alternative rejected:** Moving the `<nav>` to be the last child so it follows the button.
- **Downside accepted:** Programmatic focus movement on a non-modal disclosure is slightly unusual.
- **Reason:** Reordering the DOM would break the reading order 2.13 deliberately established (wordmark →
  credit → Catalog → About → Contact → MK·EN → cart) and would make a screen reader announce the centre
  column last at desktop widths.
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.13-1`

### D-2.14-7 · 2026-07-24 · In the open panel the active page is a filled row, not the underline
- **Status:** Superseded by D-2.15-4
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.14 brief); executed by Claude Code.
- **Decision:** Below `lg` the active link gets `bg-surface` + `text-foreground` and no visible bottom
  border; at `lg` and above the 2px `--color-mustard` underline is unchanged.
- **Alternative rejected:** Keeping the bottom border in the stacked panel.
- **Downside accepted:** One state has two presentations.
- **Reason:** A full-width bottom border under a stacked menu row reads as a divider between items, not as
  "you are here".
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.13-1`

### D-2.14-8 · 2026-07-24 · No open/close animation
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.14 brief); executed by Claude Code.
- **Decision:** The panel appears and disappears; only the button's existing colour transition remains.
- **Alternative rejected:** A height transition like `.faq-item`.
- **Downside accepted:** It snaps.
- **Reason:** `brand.md` § 6 — motion belongs to the countdown and the drop reveal and nothing else — and
  no animation means no new CSS block and nothing extra to do for `prefers-reduced-motion`.
- **Links:** `src/components/layout/SiteHeader.tsx` · `brand.md` § 6

### D-2.14-9 · 2026-07-24 · Close the menu on route change with the render-time reset pattern, not a pathname `useEffect`
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly during execution, forced by a lint gate).
- **Context:** Task 5 of the brief specifies "a `useEffect` on `usePathname()` closes it on any route
  change, so a back/forward navigation cannot leave it open." The naive form of that — an effect body that
  synchronously calls `setOpen(false)` — is a **lint error** here: eslint's
  `react-hooks/set-state-in-effect` (bundled in `eslint-config-next`, a required Task 7 gate) rejects it,
  and `npm run lint` must exit 0 (a red lint is not a PR, `CLAUDE.md`). The repo has no precedent for a
  synchronous setState in an effect — every existing effect (`Countdown`, `HomeExperience`) calls setState
  only inside a callback.
- **Decision:** Close the menu on route change with React's documented "reset state when a value changes"
  render-time pattern instead of an effect: keep the last pathname in state (`lastPathname`) and, during
  render, if `pathname !== lastPathname`, call `setLastPathname(pathname)` + `setOpen(false)`. This closes
  the menu on **any** route change — a link tap to a different page **and** a browser back/forward —
  exactly as the brief's effect would, and the DoD's observable check ("Navigate: tapping Catalog loads
  the page with the panel closed") is met (verified both locales). Each link *also* closes the menu in its
  `onClick` (the brief requires this too), which additionally covers a tap on the *current* page's own link
  (no pathname change).
- **Alternative rejected:** Keep the pathname `useEffect` and silence the rule with an inline
  `// eslint-disable-next-line react-hooks/set-state-in-effect`. Rejected because it suppresses a
  legitimate signal, whereas the render-time pattern is the endorsed fix the lint message itself links to
  (react.dev/learn/you-might-not-need-an-effect) and costs one fewer render.
- **Downside accepted:** Deviates from the brief's literal "useEffect" wording and adds one state variable
  (`lastPathname`); a reader expecting an effect must read the comment to see why there isn't one.
- **Links:** `src/components/layout/SiteHeader.tsx` · Brief Task 5 · Brief Task 7 (lint gate) · `D-2.14-3`

### D-2.15-1 · 2026-07-25 · A full-screen modal overlay, not the 2.14 in-flow expand
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.15 brief); executed by Claude Code.
- **Supersedes:** `D-2.14-2` and `D-2.14-6`.
- **Decision:** Below `lg`, tapping the burger opens a `position: fixed inset-0`, opaque `bg-ground` panel
  that covers the viewport, with `role="dialog"` + `aria-modal="true"`. It is **hand-rolled** (no new
  primitive, no `@base-ui`, no portal library).
- **Alternative rejected:** Keep the in-flow disclosure, or build it on `@base-ui`/a generated shadcn Dialog.
- **Downside accepted:** A modal needs a focus trap and a scroll lock (more code than an expand), and with
  JavaScript disabled the menu will not open — a real cost, mitigated honestly by the fact that
  About/Contact/Terms/Privacy/Shipping are in the footer on every page and `/catalog` is linked from
  Home/About/Cart/Checkout/Product, so no route becomes unreachable.
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.11-3` · supersedes `D-2.14-2`/`D-2.14-6`

### D-2.15-2 · 2026-07-25 · Below lg, everything except the wordmark moves inside the overlay
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.15 brief); executed by Claude Code.
- **Supersedes:** `D-2.14-5`.
- **Decision:** Below `lg`, the page links, MK·EN, the cart, and the build credit all move inside the
  overlay. The closed mobile header is wordmark + burger only.
- **Alternative rejected:** Keep MK·EN and the cart in the header bar.
- **Downside accepted:** On a phone, on drop day, the cart (the buy path) sits behind one tap rather than
  being always visible, and the build credit is no longer always visible (it is not in the footer either).
  Both are the owner's explicit instruction ("everything inside except the wordmark") and match the
  reference; both are one line to reverse if the owner changes his mind.
- **Links:** `src/components/layout/SiteHeader.tsx` · supersedes `D-2.14-5`

### D-2.15-3 · 2026-07-25 · The overlay is self-contained and renders its own top bar
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.15 brief); executed by Claude Code.
- **Decision:** The overlay renders its own top bar (wordmark home-link on the left, X close on the right)
  and simply covers the header bar behind it.
- **Alternative rejected:** Keep a single header above the overlay via z-index and pad the overlay down by
  the header's height.
- **Downside accepted:** The wordmark `<Link href="/">` markup appears twice (once in the header, once in
  the overlay). Reason: it avoids a brittle magic-number header-height offset and reproduces the reference
  exactly (wordmark + X as the panel's own top row).
- **Links:** `src/components/layout/SiteHeader.tsx`

### D-2.15-4 · 2026-07-25 · The active link in the overlay is a left vertical accent bar
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.15 brief); executed by Claude Code.
- **Supersedes:** `D-2.14-7`.
- **Decision:** Active → `border-l-2 border-mustard` + `text-foreground`; inactive → `border-l-2
  border-transparent` + `text-muted-foreground`. Rows are left-aligned.
- **Alternative rejected:** Keep the 2.14 filled `bg-surface` centred row.
- **Downside accepted:** None material — this is the reference's own treatment.
- **Links:** `src/components/layout/SiteHeader.tsx` · supersedes `D-2.14-7`

### D-2.15-5 · 2026-07-25 · One new string, Nav.close
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.15 brief); executed by Claude Code.
- **Decision:** One new string, `Nav.close` (МК „Затвори" / EN "Close"), for the X button's `aria-label`;
  `Nav.menu` stays for the burger. 242 → **243** keys.
- **Alternative rejected:** Reuse `Nav.menu` for the X and rely on `aria-expanded`.
- **Downside accepted:** None — a modal's close control should carry its own accessible name.
- **Links:** `src/messages/mk.json` · `src/messages/en.json` (`Nav.close`)

### D-2.15-6 · 2026-07-25 · Desktop (≥ lg) is unchanged; the burger and overlay are lg:hidden
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.15 brief); executed by Claude Code.
- **Decision:** Desktop (≥ `lg`) is unchanged; the burger and overlay are `lg:hidden` and the 2.13 grid
  header is preserved. This keeps `D-2.14-1` (the `lg` breakpoint) and `D-2.14-8` (no open/close animation)
  in force. Not a reversal — stated so the boundary is explicit.
- **Alternative rejected:** Restyling the desktop nav too.
- **Downside accepted:** One component now carries two distinct layouts (a desktop bar and a mobile bar +
  overlay), which is more markup. Reason: the owner's change is a phone-only change; the finished desktop
  layout must not regress.
- **Links:** `src/components/layout/SiteHeader.tsx` · `D-2.14-1` · `D-2.14-8`

### D-2.15-7 · 2026-07-25 · Also re-check the media query on a plain `resize`, alongside the matchMedia listener
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly during execution, forced by verification).
- **Context:** Task 6 specifies a `matchMedia('(min-width: 1024px)')` `change` listener that calls
  `setOpen(false)` when the viewport crosses to desktop, so a resize-while-open cannot strand a locked
  body. That listener is present and is correct for real browsers (Chrome/Safari/Firefox all fire the
  matchMedia `change` event on a viewport crossing 1024px). But the browser-pane's `resize_window`
  (a CDP device-metrics override) updates `matchMedia(...).matches` **without dispatching** the `change`
  event — so the brief's DoD item ("opening at 390 then widening to ≥ 1024 closes it and restores body
  scroll") could not be driven, and, more importantly, the scroll-lock release could silently fail in any
  environment where the matchMedia change event is unreliable.
- **Decision:** Keep the brief's matchMedia `change` listener **and** attach the same guard
  (`if (mql.matches) setOpen(false)`) to a plain `window` `resize` listener. Belt-and-suspenders: the
  matchMedia change handles real browsers precisely; the resize re-check guarantees the lock always
  releases and makes the behaviour verifiable in-pane (a dispatched `resize` at 1024 closed the overlay
  and restored `document.body.style.overflow`). Both `setOpen` calls are inside event *callbacks*, so the
  `react-hooks/set-state-in-effect` gate stays green.
- **Alternative rejected:** Ship the matchMedia-only listener as literally specified and mark the
  resize-safety DoD item "unverifiable in the harness". Rejected: the resize re-check is strictly more
  robust against the exact failure (a stranded scroll lock on desktop) the brief is trying to prevent,
  and it costs three lines.
- **Downside accepted:** A `resize` listener fires on every viewport resize (cheap: one `matches` read,
  and `setOpen(false)` is a no-op when already closed / below `lg`); the implementation is a superset of
  the brief's literal wording, so a reader must read the comment to see why both listeners exist.
- **Links:** `src/components/layout/SiteHeader.tsx` · Brief Task 6 (resize safety) · `D-2.15-1`

### D-2.16-1 · 2026-07-25 · The reveal is plain CSS `@keyframes`, not the `motion` library and not `framer-motion`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.16 brief); executed by Claude Code.
- **Decision:** The Home hero reveal is a plain CSS `@keyframes trajanov-reveal` in `globals.css`,
  applied via a `.reveal-group` class — no `motion`/`framer-motion` import.
- **Alternative rejected:** Porting `AnimatedGroup` and importing `motion/react` (the library is already
  a dependency, so this was the obvious route). Rejected on three grounds: (a) it would make
  `HomeExperience` the first component in the project to ship the animation runtime, on the one route
  whose Lighthouse mobile Performance score is a launch gate; (b) the global CSS reduced-motion rule
  does not reach JS-driven animation, so a `useReducedMotion()` gate would have to be maintained by
  hand forever; (c) `AnimatedGroup` wraps every child in a `motion.div`, which would insert wrapper
  elements into a `flex flex-col items-center` section and change the hero's layout.
- **Downside accepted:** **No spring bounce.** The reference's `type: 'spring', bounce: 0.3` overshoot
  cannot be expressed in a CSS keyframe; `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) is used instead,
  which decelerates hard but never overshoots. The result is calmer than the reference — on-brand
  ("restraint over effects", `brand.md` §2) and not a defect to be fixed later with a dependency.
- **Links:** `src/app/globals.css` (`.reveal-group`, `@keyframes trajanov-reveal`) · `brand.md` §6 · `D-2.10-1`

### D-2.16-2 · 2026-07-25 · The animation is applied with one class on the existing container, targeting `> *`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.16 brief); executed by Claude Code.
- **Decision:** The reveal is applied by one `.reveal-group` class on the existing container, targeting
  `> *` — not per-child classes, not wrapper elements, not inline styles.
- **Alternative rejected:** A `<Reveal index={n}>` component wrapping each hero element.
- **Downside accepted:** The stagger order is positional (`nth-child`), so re-ordering the hero's
  children silently re-orders the animation. Mitigated by a comment in the CSS block naming the four
  call sites. The gain is that the DOM does not change at all — no new element, no new attribute on any
  child — so `Countdown.tsx`, `DropBanner.tsx` and `ProductCard.tsx` stay byte-unchanged and the hero's
  flex layout is provably identical before and after.
- **Links:** `src/app/globals.css` · `src/components/home/HomeExperience.tsx` · `D-2.16-1`

### D-2.16-3 · 2026-07-25 · A second narrowly-scoped exception to `brand.md` §6, after `D-2.10-1`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.16 brief); executed by Claude Code.
- **Decision:** A second narrowly-scoped exception to `brand.md` §6 ("motion belongs to the countdown
  and the drop reveal, nothing else"), after `D-2.10-1`. The exception is capped at **the Home hero
  sections and the live-drop product grid, on first paint only**, and is stated as a hard boundary in
  `brand.md` §6: this class is used on Home and nowhere else.
- **Alternative rejected:** Applying the reveal sitewide (About, Catalog, Product, legal pages) for
  consistency.
- **Downside accepted:** The §6 rule now carries two exceptions and is weaker than when it was written.
  Any future page that wants it comes back as an owner-level decision, not as a quiet reuse of an
  existing class.
- **Links:** `brand.md` §6 · `src/app/globals.css` · `D-2.10-1`

### D-2.16-4 · 2026-07-25 · Three new motion tokens; the duration is *not* new
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.16 brief); executed by Claude Code.
- **Decision:** `--motion-stagger` (70ms), `--motion-reveal-shift` (0.75rem) and `--motion-reveal-blur`
  (0.5rem) are added to `brand.md` §6 and mirrored into `globals.css`. The duration reuses the existing
  `--motion-drop` (480ms), because `brand.md` already defines that token as the drop reveal.
- **Alternative rejected:** A fourth `--motion-reveal` duration token.
- **Downside accepted:** Claude Code edits `brand.md`, which is normally Design's artifact — precedented
  by `D-1.02-1` and `D-2.10-1`, and required by the rule that tokens live in `brand.md` and nowhere else.
- **Links:** `brand.md` §6 · `src/app/globals.css` (`:root` motion block) · `D-1.02-1` · `D-2.10-1`

### D-2.16-5 · 2026-07-25 · On the live drop, the class goes on the product grid, not on the section
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.16 brief); executed by Claude Code.
- **Decision:** On the live drop, `.reveal-group` goes on the product grid, not on the section — so the
  LIVE banner and the drop heading paint solid and instantly, and only the product cards cascade.
- **Alternative rejected:** Staggering the whole live section (banner → grid as one block).
- **Downside accepted:** The live state animates differently from the countdown state — deliberately.
  The banner is the status line and must not appear to load; the cards arriving one after another *is*
  the drop reveal `brand.md` §6 sanctions.
- **Links:** `src/components/home/HomeExperience.tsx` (live branch) · `brand.md` §6

### D-2.17-1 · 2026-07-25 · `position: sticky; top: 0`, not `position: fixed`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.17 brief); executed by Claude Code.
- **Decision:** The scroll-reactive header sticks with `position: sticky; top: 0`, not the reference's
  `position: fixed`.
- **Alternative rejected:** The reference block's `fixed`. `fixed` removes the header from flow, which
  would require padding the top of `<main>` on every route by the header's height — a number that
  would then have to be kept in sync by hand and would be wrong the moment the header's height changed.
  `sticky` keeps the header in flow, so nothing below it moves and no page needs an offset.
- **Downside accepted:** `sticky` stops working inside any ancestor with `overflow` other than
  `visible`. `<body>` is `flex min-h-full flex-col` with no overflow today, so it works — but the 2.15
  overlay sets `document.body.style.overflow = 'hidden'` while open, which un-sticks the header. That
  is harmless (the overlay covers the whole viewport regardless) and was **confirmed in-browser**, not
  assumed: with the page scrolled and the header in its pill state, opening the burger still produced a
  `position: fixed`, inset-0, full-viewport (390×844) opaque overlay with the body scroll locked.
- **Links:** `src/components/layout/SiteHeader.tsx` · `src/app/globals.css` · `D-2.15-1`

### D-2.17-2 · 2026-07-25 · The scrolled state is one `data-scrolled` attribute + a CSS block, not conditional Tailwind classes
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.17 brief); executed by Claude Code.
- **Decision:** The scrolled state is a single `data-scrolled` attribute on `<header>` plus an unlayered
  CSS block in `globals.css` — not a pile of conditional Tailwind classes.
- **Alternative rejected:** The reference's approach, `cn('…', isScrolled && 'bg-background/50 max-w-4xl
  rounded-2xl border backdrop-blur-lg lg:px-5')`. Rejected because it puts a raw radius (`rounded-2xl`),
  a raw opacity (`/50`) and a raw blur scale (`backdrop-blur-lg`) into a component, which `brand.md` §8
  forbids, and because it makes the transition list implicit. React sets **one attribute**; every value
  lives in `globals.css` as a token.
- **Downside accepted:** The styling is no longer visible in the component file — a reader of
  `SiteHeader.tsx` sees `data-scrolled` and has to open `globals.css` to learn what it does. Mitigated
  by a comment at the attribute naming the `.header-shell` / `.header-bar` block.
- **Links:** `src/components/layout/SiteHeader.tsx` · `src/app/globals.css`

### D-2.17-3 · 2026-07-25 · At scroll-top the header renders identically to `main`
- **Status:** Accepted (see the resting-height carve-out in `D-2.17-7`)
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.17 brief); executed by Claude Code.
- **Decision:** The pill is a **scrolled-only** state: at `scrollY = 0` the header is `bg-ground`,
  `border-b border-border`, `max-w-6xl`, square, opaque — i.e. exactly what 2.13 and 2.15 measured.
- **Alternative rejected:** Making the pill the permanent resting style (visually closer to the
  reference, which floats even at the top).
- **Downside accepted:** The effect is invisible until the customer scrolls, so on a short page it never
  appears at all. That is the correct trade — it protects the finished 2.13 desktop centreline result
  and the 2.15 overlay geometry, both verified rect-by-rect. **Measured:** at `scrollY = 0` the header
  computes `bg` `rgb(15,18,16)`, `border-bottom` `rgb(42,46,43)`, bar `max-width 1152px`,
  `border-radius 0px`, no blur, nav centre offset 0px, on all four routes × both widths × both locales.
  The one deviation from "byte-identical" is the resting **height** (69px → 71px), carved out in
  `D-2.17-7`.
- **Links:** `src/app/globals.css` · `D-2.17-7`

### D-2.17-4 · 2026-07-25 · The behaviour applies at every width, phones included
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.17 brief); executed by Claude Code.
- **Decision:** The contract-and-blur applies at every viewport width, phones included — not `lg:` only.
- **Alternative rejected:** `lg:` only, leaving mobile with today's scroll-away header.
- **Downside accepted:** A permanently sticky bar costs roughly 60px of a 390px-tall phone viewport for
  the whole session, on a site whose loudest object is a countdown. Taken because the audience is
  Instagram-native and mobile-first, the cart badge is the one thing they need persistently reachable,
  and losing the header entirely below the fold is worse than losing 60px. **If Lazar dislikes it on a
  real phone, the fix is one media query** (owed #32).
- **Links:** `src/components/layout/SiteHeader.tsx` · `src/app/globals.css`

### D-2.17-5 · 2026-07-25 · A third narrowly-scoped exception to `brand.md` §6 — scroll-driven and site-wide
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.17 brief); executed by Claude Code.
- **Decision:** A third exception to `brand.md` §6, recorded honestly in §6. `D-2.10-1` (spotlight) and
  `D-2.16-3` (hero reveal) are first-paint or hover effects; this one is **scroll-driven and site-wide**,
  which is a genuine widening of the rule, not another carve-out. §6 now reads as a *presumption against
  decoration*, not an absolute.
- **Alternative rejected:** Leaving §6 as written and treating the header as outside its scope.
- **Downside accepted:** "Motion belongs to the countdown and the drop reveal, nothing else" is now
  three exceptions deep and is no longer literally true. Any fourth request is an owner-level decision.
- **Links:** `brand.md` §6 · `D-2.10-1` · `D-2.16-3`

### D-2.17-6 · 2026-07-25 · Nothing is added to or removed from the header's contents
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.17 brief); executed by Claude Code.
- **Decision:** Same wordmark, same three nav links, same MK·EN switch, same cart, same credit, same
  burger, same overlay, same order, same strings. **Zero message-catalog change — the catalogs stay at
  243 keys.**
- **Alternative rejected:** Taking the reference's `Login` / `Sign Up` / `Get Started` while in the file.
  There are no accounts on this site and never will be at this scope.
- **Downside accepted:** None.
- **Links:** `src/components/layout/SiteHeader.tsx` · `src/messages/{mk,en}.json` (unchanged)

### D-2.17-7 · 2026-07-25 · The resting header is 2px taller than `main`; operator chose to ship the brief's CSS verbatim
- **Status:** Accepted
- **Decided by:** Claude Code (surfaced the conflict); **ratified by Petar in-session** (chose "Ship the
  brief's CSS verbatim" when asked).
- **Decision:** Task 3's CSS block puts `border: 1px solid transparent` on `.header-bar` in **both**
  scroll states (so the scrolled border is a colour transition, not a box-model jump). With
  `box-sizing: border-box` and an auto height, that 1px top+bottom border makes the resting header
  **2px taller** than `main` (measured: `<header>` 69px → 71px; `.header-bar` 68px → 70px), and pushes
  every page's first content element down 2px (`<main>`'s first child `y` 69 → 71) — **site-wide,
  including the Checkout header**. This is an unavoidable consequence of the both-states-border
  technique: you cannot have both the border in both states (no inter-state jump) and a resting box
  pixel-identical to `main`. It directly contradicts the letter of `D-2.17-3` and trips hard stop #4.
  Petar was shown the measured numbers and chose to ship the brief's CSS **verbatim**, accepting the
  +2px.
- **Alternative rejected:** A layout-neutral pill edge — drawing the scrolled 1px edge with a technique
  that does not change the box model (inset `box-shadow` or `outline`), so the resting header stays
  pixel-identical to `main` **and** there is no inter-state jump. This best satisfies `D-2.17-3` and the
  brief's own stated intent ("a colour transition, not a box-model change"), but deviates from the exact
  `border` CSS the brief specifies and (for `box-shadow`) brushes against `brand.md` §5's
  "shadow is for overlays only". Rejected by the operator in favour of shipping the specified CSS.
- **Downside accepted:** The resting header is 2px taller than the 2.13/2.15 signed-off geometry on
  every route, and all content sits 2px lower. It is invisible to the eye and consistent across routes,
  but it is a real, measured deviation from `D-2.17-3` — flagged for Lazar's real-device sign-off
  (owed #32). Not compensated with negative margin/padding (hard stop #4 forbids that).
- **Links:** `src/app/globals.css` (`.header-bar`) · `D-2.17-3` · Phase 2.17 hard stop #4

### D-2.18-1 · 2026-07-25 · A dedicated `--motion-slow` token for the header, not a change to `--motion-base`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.18 brief); executed by Claude Code.
- **Decision:** The scroll-reactive header contract is retimed from `--motion-base` (220ms) to a new
  dedicated `--motion-slow` (420ms). The header gets its own duration token.
- **Alternative rejected:** Raising `--motion-base` itself from 220ms to 420ms — a one-line change.
  Rejected because `--motion-base` also times the FAQ disclosure (`globals.css` ~249) and the block at
  ~358; slowing those to fix the header is a side effect nobody asked for.
- **Downside accepted:** A fourth duration token, so the motion scale is now
  `fast / base / slow / drop / reveal` and a future reader has to choose between five rather than three.
- **Links:** `brand.md` §6 · `src/app/globals.css` (`:root`, `.header-shell`/`.header-bar`)

### D-2.18-2 · 2026-07-25 · A new `--ease-smooth` curve for the header, replacing `--ease-out` there only
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.18 brief); executed by Claude Code.
- **Decision:** The header transition moves onto a new symmetric ease-in-out `--ease-smooth`
  (`cubic-bezier(0.65, 0, 0.35, 1)`), replacing `--ease-out` on the header only. `--ease-out` stays the
  site's default and is unchanged everywhere else.
- **Alternative rejected:** Keeping `--ease-out` and only raising the duration — rejected because at
  420ms that front-loaded curve reads as *fast, then drift*, which is less smooth than 220ms, not more.
  A symmetric ease-in-out accelerates and decelerates evenly, which is what "smooth" means here.
- **Downside accepted:** The header now moves on a different curve from the rest of the site, so it is
  deliberately a little apart from the hover transitions around it.
- **Links:** `brand.md` §6 · `src/app/globals.css` (`:root`, `.header-shell`/`.header-bar`) · `D-2.18-1`

### D-2.18-3 · 2026-07-25 · The credit is taken out of flow with `position: absolute` while it fades
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.18 brief); executed by Claude Code.
- **Decision:** As the bar contracts, the desktop build credit fades out and is taken out of the flex
  flow with `position: absolute` and **no insets set** — not `display: none`, not a conditional render,
  not a `max-width` collapse. With no insets the element stays at its static position and leaves the
  flex flow instantly, so the left grid column stops reserving space for it while the opacity is still
  animating. Nothing else reflows because the header grid is `minmax(0,1fr) auto minmax(0,1fr)`: the
  centre nav is centred by the fr units, not by the width of the left column's contents (`D-2.13-1`).
- **Alternative rejected:** `display: none` (cannot be transitioned), a conditional render
  (`{!scrolled && …}` pops it out with no fade), and a `max-width` collapse (needs `white-space: nowrap`,
  which changes how the credit wraps *at scroll-top* and breaks 2.17's byte-identical resting invariant).
- **Downside accepted:** The credit is gone from layout the instant the threshold trips, while its
  opacity is still animating — if the header grid is ever changed away from fr-based centring, this
  starts causing a visible jump. The CSS block says so in a load-bearing comment.
- **Links:** `src/app/globals.css` (`.header-credit`) · `src/components/layout/SiteHeader.tsx` · `D-2.13-1`

### D-2.18-4 · 2026-07-25 · `visibility: hidden` is transitioned in behind the fade, so the Vertex link leaves the tab order
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.18 brief); executed by Claude Code.
- **Decision:** `visibility: hidden` is transitioned onto the credit with `0s linear var(--motion-slow)`
  so it flips only after the opacity fade completes (and back instantly on the way in), removing the
  Vertex link from the tab order once it is actually gone.
- **Alternative rejected:** `pointer-events: none` alone, which fixes the mouse but not the keyboard —
  an `opacity: 0` link is still focusable and still in the accessibility tree, so a keyboard user tabbing
  a scrolled page would land on an invisible link (a WCAG 2.2 failure). (`pointer-events: none` is kept
  in addition, for the mouse.)
- **Downside accepted:** None.
- **Links:** `src/app/globals.css` (`.header-credit`) · `D-2.18-3`

### D-2.18-5 · 2026-07-25 · The scrolled bar contracts further, 56rem → 48rem, and the Home hero reveal is retimed at the same time
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.18 brief); executed by Claude Code.
- **Decision:** Two things fold together because both complaints are the same complaint — the motion is
  too quick to read. (a) The scrolled bar's `--header-bar-max-scrolled` goes 56rem → 48rem: 56rem was
  sized around content (the credit) that is no longer in the bar. (b) The Home hero reveal is retimed —
  duration off the borrowed `--motion-drop` (480ms) onto a dedicated `--motion-reveal` (760ms), stagger
  70ms → 110ms. `--motion-drop` itself is left at 480ms and untouched, so `brand.md`'s definition of the
  drop reveal still means what it says. Measured: ended hero (4 children) ends at ~1.09s, countdown hero
  (6 children) at ~1.31s — both under the 1.5s ceiling.
- **Alternative rejected:** Shipping the header fix alone and holding the hero for its own phase —
  rejected as two PRs for one adjustment.
- **Downside accepted:** Lazar has not explicitly signed off on the hero retime; it is the "A" option put
  to him after 2.16 and never separately answered. It is one token pair, isolated in Task 5, and
  trivially revertible — called out at the top of the completion report so he can strike it in review.
- **Links:** `brand.md` §5/§6 · `src/app/globals.css` (`:root`, `.reveal-group`) · `D-2.16-3`

### D-2.19-1 · 2026-07-25 · Add the wordmark hover shine at all (the fourth motion exception)
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.19 brief); executed by Claude Code.
- **Decision:** Add a hover/focus-gated light sweep across the TRAJANOV header wordmark.
- **Alternative rejected:** hold to `brand.md` §6's presumption against decoration and ship nothing.
- **Downside accepted:** §6's carve-out list grows to four, and the "presumption against decoration" gets
  weaker every time it is granted. Owner's call — Lazar requested it directly, 2026-07-25.
- **Links:** `brand.md` §6 · `src/app/globals.css` (`:root`, `.wordmark-shine`)

### D-2.19-2 · 2026-07-25 · Pure CSS. No `framer-motion`, no new dependency, no JS animation
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.19 brief); executed by Claude Code.
- **Decision:** The effect is pure CSS — no `framer-motion`, no new dependency, no JS animation.
- **Alternative rejected:** the supplied 21st.dev `ShinyButton` component as written — a `motion.button`
  plus `npm install framer-motion`.
- **Downside accepted:** no spring physics; the sweep is an eased linear travel, marginally less springy
  than the reference. Reason: `motion` v12 is already installed and `framer-motion` is that same
  library's former name, so the install would duplicate the runtime in a Hobby-hosted bundle; and
  `D-2.11-3` already settled that pointer effects on this site are CSS.
- **Links:** `src/app/globals.css` (`.wordmark-shine`) · `D-2.11-3` · `D-2.10-1`

### D-2.19-3 · 2026-07-25 · The wordmark stays a `next-intl` `<Link href="/">`. It does not become a `<button>`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.19 brief); executed by Claude Code.
- **Decision:** The wordmark stays a `next-intl` `<Link href="/">`; it does not become a `<button>`.
- **Alternative rejected:** swapping in the reference's `<motion.button>`.
- **Downside accepted:** the supplied file is not copy-pasted at all — only its *technique* (a gradient
  sweep driven by an animated `--x` custom property) is reused. Reason: a `<button>` is not a navigation
  control. Converting it would break the href, the link role in the a11y tree, middle-click and
  open-in-new-tab, and the crawlable path back to `/` — to gain an effect we can have without any of that.
- **Links:** `src/components/layout/SiteHeader.tsx` (`wordmarkClass`, ~157)

### D-2.19-4 · 2026-07-25 · Hover- and focus-gated. One sweep per hover. No loop, no mount animation, no tap scale
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.19 brief); executed by Claude Code.
- **Decision:** The sweep is gated on `:hover` and `:focus-visible` and runs exactly once per trigger
  (`animation-iteration-count: 1`). No loop, no mount animation, no tap scale.
- **Alternative rejected:** the reference's `repeat: Infinity, repeatDelay: 1` plus the `scale 0.8 → 1`
  entrance and `whileTap: 0.95`.
- **Downside accepted:** touch users never see the effect (correct — there is no hover on touch). Reason:
  this is a sticky header on every route; a permanently shimmering wordmark is a permanently moving
  object in the corner of every page, which is the exact thing §6 exists to prevent. Lazar asked for hover.
- **Links:** `src/app/globals.css` (`.wordmark-shine`) · `D-2.17-5`

### D-2.19-5 · 2026-07-25 · The sweep colour is `--color-mustard`, over a wordmark that rests on `--color-foreground`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.19 brief); executed by Claude Code.
- **Decision:** The travelling highlight is `--color-mustard` (mixed into the resting glyph colour with
  `color-mix`), over a wordmark that rests on `--color-foreground`.
- **Alternative rejected:** `hsl(var(--primary))` as the reference uses.
- **Downside accepted:** mustard is the brand accent and §3 warns it stops meaning anything if overused —
  this adds one more mustard moment to the header, alongside the focus ring and the Vertex credit link.
  Reason: `--primary` is a **shadcn token that does not exist in this codebase** and would resolve to
  nothing; and an off-white shine over an off-white wordmark is invisible. Mustard is 9.0:1 on ground and
  foreground is 15.4:1, so **every intermediate colour in the sweep is above AA by construction** — the
  wordmark cannot go illegible mid-animation.
- **Links:** `brand.md` §3 · `src/app/globals.css` (`.wordmark-shine`)

### D-2.19-6 · 2026-07-25 · The sweep travels at constant speed (`linear`), not on `var(--ease-out)`
- **Status:** Accepted
- **Decided by:** Claude Code (on-the-fly, from in-browser measurement — a deviation from the brief's
  Task 1, which said to use `--ease-out`). **Flagged for the orchestrator to ratify or strike.**
- **Decision:** The `.wordmark-shine` animation runs `linear` rather than `var(--ease-out)`. Duration
  stays the brief-specified `--motion-shine` (900ms) and the token itself is unchanged.
- **Alternative rejected:** `var(--ease-out)` as the brief's Task 1 instructs. Rejected on measurement,
  not taste: `--ease-out` is `cubic-bezier(0.16, 1, 0.3, 1)`, which is heavily front-loaded. Seeking the
  real animation frame by frame in the browser, it drove `--wordmark-x` to **63.9% at t=112ms** and
  **108.6% at t=225ms** — i.e. the highlight band had already left the right-hand edge of the glyphs a
  quarter of the way into the 900ms. The visible sweep lasted **~150ms** and the remaining ~710ms was the
  band drifting off-screen where nobody can see it. That reads as a flick, or a flash, not a shine — and
  a flash is the exact failure mode `D-2.19-4` and the reduced-motion rule exist to avoid. On `linear` the
  same measurement gives 0% at 200ms, 50% at 450ms, 100% at 700ms: 200ms lead-in, ~500ms actually crossing
  the letters, 200ms lead-out. This is the same objection `D-2.18-2` raised against `--ease-out` on the
  header contract, applied to a travel rather than a settle.
- **Downside accepted:** the sweep is the one motion on the site that uses neither `--ease-out` nor
  `--ease-smooth`, so §6's "default easing for all of the above" no longer covers every animation
  literally. `linear` is a CSS keyword, not an inlined design value (the same category as 2.18's
  brief-authorised `visibility 0s linear`), so no token was invented and none was repointed.
  **The brief said `--ease-out`; this is a deliberate departure and a one-word revert** — replace
  `linear` with `var(--ease-out)` in the `.wordmark-shine` block and nothing else changes.
- **Links:** `src/app/globals.css` (`.wordmark-shine`) · `D-2.18-2` · `brand.md` §6

### D-2.20-1 · 2026-07-25 · The band becomes pure white, via a new `--color-shine: #FFFFFF` token
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.20 brief); executed by Claude Code.
- **Decision:** The wordmark shine band becomes pure white, via a new `--color-shine: #FFFFFF` token.
- **Alternative rejected:** a near-white such as `#F8F6F2`, which would keep `brand.md` §3's "never pure
  white" rule intact.
- **Downside accepted:** **this is a deliberate, narrowly-scoped exception to §3's `--color-glow` rule —
  "the off-white foreground, never pure white" (`D-2.10-1`)** — and pure white on a near-black ground can
  bloom on OLED phones, which is most of audience 1. Rejected the near-white because at that small a step
  from `#ECE8E0` the band would not read as white light at all, so it would not deliver what was asked
  for. Owner's call — Lazar, 2026-07-25. **The exception is scoped to this one sweep. `--color-shine` is
  not to be used anywhere else without a new decision, and `--color-glow` stays off-white for the
  product-card spotlight.**
- **Links:** `brand.md` §3 · `src/app/globals.css` (`:root`, `.wordmark-shine`) · `D-2.10-1` · `D-2.19-5`

### D-2.20-2 · 2026-07-25 · The trough stays `--color-foreground`. The sweep brightens only; it never dims
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.20 brief); executed by Claude Code.
- **Decision:** The gradient's two outer stops stay `var(--color-foreground)`. The sweep brightens only;
  it never dims.
- **Alternative rejected:** dipping the outer stops below `--color-foreground` so the band pops harder
  against a darker surround — the technique the 21st.dev reference uses.
- **Downside accepted:** the visible step is only 15.4:1 → 18.4:1, so the glint is **subtler than the
  mustard version was**. Rejected the dip because it would visibly dim the wordmark on hover, and on the
  scrolled translucent pill over the mustard live banner the mark is already at its worst contrast (2.19
  measured **7.84:1** there mid-sweep). Making a navigation link *harder* to read on hover is the wrong
  trade.
- **Links:** `brand.md` §3 · `src/app/globals.css` (`.wordmark-shine`) · `D-2.20-1`

### D-2.20-3 · 2026-07-25 · `D-2.19-6` is ratified. The easing stays `linear`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase 2.20 brief); executed by Claude Code.
- **Decision:** `D-2.19-6` is ratified. The `.wordmark-shine` easing stays `linear`.
- **Alternative rejected:** reverting to the brief's `var(--ease-out)`.
- **Downside accepted:** `linear` is a third motion timing in play alongside `--ease-out` and
  `--ease-smooth`. Ratified because Code's reasoning was measured, not asserted: `--ease-out` is
  front-loaded enough that the band clears the glyphs by t≈225ms of 900ms, making the sweep a ~150ms
  flick followed by ~710ms of invisible drift. Constant speed is how light crosses a surface. **This
  closes the "ratify or strike" item that was sitting in owed row #36.**
- **Links:** `D-2.19-6` · `brand.md` §6 · `src/app/globals.css` (`.wordmark-shine`) · owed register #36

### D-Y.03-1 · 2026-07-26 · Photographs map to products by colourway, verified against the file, never by supplied order or index
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.03 brief); executed by Claude Code.
- **Decision:** A photograph goes on a product only if it **shows that product's colourway**, confirmed by
  opening the file and looking at it before wiring. The lookup in `src/lib/product-images.ts` is keyed by
  product **slug** — never by array index, sort order, or the order the files were supplied.
- **Alternative rejected:** the positional mapping originally requested, which would have shifted every
  shirt by one product.
- **Downside accepted:** overrides the order the operator gave, so the operator's instruction and the
  shipped mapping differ. If Code's colour read were wrong the mapping would be wrong, so each file was
  confirmed by eye first: `mustard-ochre-01.webp` is the saturated ochre tee (~`(213,163,58)`),
  `off-white-01.webp` is the near-white tee (~`(199,188,181)`). Both confirmed 2026-07-26.
- **Links:** `src/lib/product-images.ts` · `facts.md` §7 · `src/config/products.ts`

### D-Y.03-2 · 2026-07-26 · Product 03 (baby blue) ships with no photograph
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.03 brief); executed by Claude Code.
- **Decision:** Product 03 gets **no photograph**. Its card and product page are byte-unchanged by this
  phase — proven by an HTML diff of the rendered `<main>` for `/katalog/test-baby-blue` before and after
  (identical, 6843 bytes both sides).
- **Alternative rejected:** using the third frame — a screenshot that measures warm grey — as a stand-in.
- **Downside accepted:** the catalog looks uneven — two cards with photographs, one hatched box — until
  Vladimir shoots baby blue. Taken because a stand-in is exactly what placeholder register #8 forbids in
  its own words ("no stand-in, no generated image, no other shirt's photo") and what `D-0-6` prohibits.
- **Links:** placeholder register #8 · `D-0-6` · `D-Y.02-1` · `src/lib/product-images.ts`

### D-Y.03-3 · 2026-07-26 · Placeholder rows #2 and #8 stay open; #2 is narrowed only
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.03 brief); executed by Claude Code.
- **Decision:** Row **#2** is **narrowed** to one sense and no further — the neutral-background front /
  back / print-detail set is still owed for every colourway, and an interim lifestyle frame now renders
  for Products 01 and 02. Row **#8** is **byte-unchanged**. Nothing is struck or cleared.
- **Alternative rejected:** clearing #2 now that a real photograph renders.
- **Downside accepted:** the register looks unchanged after a phase that shipped visible work, which can
  read as no progress. That is the point — the pre-drop gate still blocks on photography and Vladimir
  still owes the neutral set.
- **Links:** placeholder register #2, #8 · `facts.md` §8

### D-Y.03-4 · 2026-07-26 · The files live in `public/images/lifestyle/`, not `public/images/products/`
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.03 brief); executed by Claude Code.
- **Decision:** Both WebP files are committed to `public/images/lifestyle/`.
- **Alternative rejected:** `public/images/products/`, which `file-map.md` reserves for the real neutral set.
- **Downside accepted:** an extra directory now, and a later move when the real set lands. Taken because
  putting lifestyle frames in `products/` would make the file map lie about what we hold.
- **Links:** `file-map.md` · `public/images/lifestyle/` · `D-0-6`

### D-Y.03-5 · 2026-07-26 · `next/image`, local files, no `images` config, no new dependency
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.03 brief); executed by Claude Code.
- **Decision:** The first images on the site render through `next/image` with `fill` + `object-cover` in
  the existing `aspect-[4/5]` box, `priority` off, `sizes="(min-width: 1024px) 280px, 50vw"`. Local files
  only. `next.config.ts` gets **no** `images` block. No new npm dependency — `next/image` is built in.
- **Alternative rejected:** a plain `<img>` (no optimisation, CLS risk), or a remote image host (a new
  surface to secure, and it breaks the portability rule).
- **Downside accepted:** the site now has an image-optimisation code path it did not have before, and
  Lighthouse mobile Performance on Catalog — already only **94** — must be re-measured on the live domain
  (owed #39). Verified in-pane that the browser picks the 640px candidate at 390px, not the 3840px one.
- **Links:** `src/components/system/PhotoSlot.tsx` · `next.config.ts` · owed register #39 · `00_stack-and-config.md`

### D-Y.03-6 · 2026-07-26 · The bar backdrop is acceptable as brand imagery despite visible alcohol and a 12+ audience
- **Status:** Accepted (widened by `D-Y.03-10`)
- **Decided by:** Vladimir, his own call on his own brand, relayed by Lazar 2026-07-26.
- **Decision:** The „Вторник" bar interior — a wall of spirits, the venue's signage and trade dress in
  frame — is acceptable as brand imagery on the Catalog and Product pages.
- **Alternative rejected:** reshooting the lifestyle set somewhere neutral.
- **Downside accepted:** a venue with alcohol is now the front door of a brand whose youngest customers
  are 12. Owner's call, recorded rather than absorbed.
- **Links:** `facts.md` §8.1 · Known Issue #6 · `D-Y.03-10`

### D-Y.03-7 · 2026-07-26 · Override `facts.md` §8's "cannot carry Catalog or Product" for these two frames, as an interim
- **Status:** Accepted
- **Decided by:** **Lazar**, 2026-07-26. (See the downside — `facts.md` §8 assigns this call to Vladimir.)
- **Decision:** The two frames may carry the Catalog card and the **first** Product slot for Products 01
  and 02, as a logged interim. `facts.md` §8's "It cannot carry Catalog or Product" sentence is **not
  retracted** — it still states the real defect and now carries the override beside it.
- **Alternative rejected:** waiting for the neutral set, which is owed anyway and would clear #2/#8
  properly — the orchestrator's own recommendation, made twice, and the basis of the earlier refusal.
- **Downside accepted:** warm tungsten light shifts the garment colour, so on a cash-on-delivery order
  what the customer sees is **not exactly** what arrives at the door — the precise risk `facts.md` §8 was
  written to guard. Mitigated by the second product-page slot staying a visible placeholder and by #2
  remaining open. These frames are **replaced** when the neutral set lands, not kept alongside it.
  **Second downside, recorded not smoothed over:** `facts.md` §8 assigns the photography calls to
  **Vladimir**, and this override was made by **Lazar**. The Y.03 brief's own preamble faulted its
  superseded version for routing these calls through Lazar; on this decision it does the same thing. The
  mismatch is written into `facts.md` §8 and raised in the completion report rather than papered over.
- **Links:** `facts.md` §8 · `facts.md` §8.1 · placeholder register #2 · `Part-2-Phase-Y03-BLOCKED.md` §3(c)

### D-Y.03-8 · 2026-07-26 · `facts.md` §8's frame count corrected from four to three
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.03 brief); executed by Claude Code.
- **Decision:** The §8 lifestyle row now reads **3 frames**, not 4. Vladimir holds three; a fourth does
  not exist yet.
- **Alternative rejected:** leaving the record as-is.
- **Downside accepted:** a fact marked VERIFIED since the scaffold commit was wrong, which weakens the
  claim that a VERIFIED mark means checked. Recorded as a dated correction with its own decision ID
  rather than silently edited, so the error stays visible.
- **Links:** `facts.md` §8 · `facts.md` changelog · `Part-2-Phase-Y03-BLOCKED.md` §4

### D-Y.03-9 · 2026-07-26 · Guardian consent for Vladimir's own image is recorded as a FIFTH permission, not folded into his own
- **Status:** Accepted
- **Decided by:** Petar (orchestrator), in session 2026-07-26, after Code raised it; parents' consent
  obtained by the operators.
- **Decision:** `facts.md` §8.1 records **five** permissions, not the four the brief listed. The fifth is
  **guardian consent from Vladimir's parents** for commercial use of his own image. His face is fully
  identifiable in `mustard-ochre-01.webp`, and that permission is what makes the frame publishable.
- **Alternative rejected:** the brief's instruction to treat Vladimir's own instruction to publish as
  covering his image, and to explicitly **not** treat guardian consent as a blocker.
- **Downside accepted:** this contradicts a direct instruction in the brief and cost a round-trip before
  any code was written. Taken because the brief applies the correct test to the other model — "she **is
  21** — an adult, so her own consent is sufficient" — and then abandons that same test for someone it
  identifies as a minor in the next paragraph. A minor's self-consent is not valid consent for commercial
  use of their likeness; recording it as satisfied would have put a false clearance into `facts.md`, the
  only legal source. The permission covers **this publication only** and does not close Known Issue #4.
- **Links:** `facts.md` §8.1 · Known Issue #4 · `facts.md` §1 · `D-Z.01-3`

### D-Y.03-10 · 2026-07-26 · The backdrop call is written to cover a person in frame holding a drink, not only a backdrop
- **Status:** Accepted (widens `D-Y.03-6`)
- **Decided by:** Petar (orchestrator), in session 2026-07-26, after Code raised it.
- **Decision:** `D-Y.03-6` and `facts.md` §8.1 permission #4 are worded to state explicitly that the
  authorisation covers **a person in frame holding a spirits tumbler**, which `off-white-01.webp` shows,
  and not merely alcohol in the background.
- **Alternative rejected:** leaving `D-Y.03-6` at the brief's wording ("a wall of spirits **behind** two
  young models") and letting the glass be read into the word "backdrop".
- **Downside accepted:** it widens, on the record, what the owner is documented as having approved for a
  brand whose audience starts at 12 — and the person holding the glass is a minor. The contents of the
  glass are **not determinable** from the photograph and no claim is made about them. Taken because the
  brief never mentions the glass, so `D-Y.03-6` as drafted would have recorded approval for something
  narrower than what actually ships; a decision that understates what it authorises is not a decision.
- **Links:** `D-Y.03-6` · `facts.md` §8.1 · `public/images/lifestyle/off-white-01.webp`

### D-Y.03-11 · 2026-07-26 · Verification reseeded the LOCAL scratch database; the hosted database was never touched
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot, to satisfy the brief's non-negotiable browser-verification gate.
- **Decision:** The local dev database served a **stale scratch dataset** (`test-tee-black`,
  `test-tee-two`) from a currently-live leftover drop `test-open-drop`, so the catalog never rendered the
  committed products at all. To verify, Code ran `npm run sync:drop` against **local only** (guarded: the
  resolved host was asserted to be `127.0.0.1` and `SUPABASE_DB_URL` was confirmed unexported), then
  temporarily moved the two scratch drops' windows into the past so `pickActiveDrop` selected the
  committed `test-drop` — matching production. Stock for `test-off-white` was briefly set to 0 to prove
  sold-out styling reaches a photograph. **All three mutations were restored** from a saved backup and
  re-queried after.
- **Alternative rejected:** verifying against the stale data (which would have proved nothing — none of
  those slugs have a photograph), or repointing dev at the **hosted** database (zero mutations, but it
  reads production and needs production credentials for a render check).
- **Downside accepted:** a literal reading of the brief's "**No sync**" was deviated from. That line sits
  under "do not touch … **the hosted database**", and nothing hosted was read or written — but the
  deviation is logged rather than left implicit. Second downside: the local scratch drops
  `test-open-drop` / `test-upcoming-drop` are not in `src/config/drops.ts`, so this divergence will bite
  the next phase that verifies the catalog locally too.
- **Links:** `scripts/sync-drop.ts` · `src/lib/drop/state.ts` (`pickActiveDrop`) · `src/config/drops.ts`

### D-Y.04-1 · 2026-07-26 · Home gets a photographic hero; `D-1.05-4` superseded
- **Status:** Accepted
- **Decided by:** Lazar, 2026-07-26 (orchestrator decision, pre-made in the Phase Y.04 brief); executed
  by Claude Code.
- **Context:** `D-1.05-4` kept Home type-led with no photo and no photo slot, because model and venue
  permission were unconfirmed and the alcohol-backdrop call was unmade. All five permissions were
  recorded GIVEN on 2026-07-26 (`facts.md` §8.1) and Known Issue #6 is resolved. `D-1.05-4` named this
  exact condition as the trigger for the change.
- **Decision:** Home renders `mustard-ochre-01.webp` (and `off-white-01.webp` at `≥640px`) in the
  countdown, ended, and no-view states. Live state unchanged.
- **Alternative rejected:** an AI-generated hero composite supplied on 2026-07-26, whose embedded C2PA
  credential recorded `c2pa.created` by `gpt-image 2.0` with
  `digitalSourceType: trainedAlgorithmicMedia` and no ingredient assertion — refused under `D-0-6` and
  `facts.md` §8 ("the pixels must start as the actual shirt"), and because §8.1's permissions were
  given for photographs of real people, one of them a minor, not for a synthetic likeness.
- **Downside accepted:** the mustard frame now appears on both the Home hero and the Product 01 Catalog
  card, so one photograph carries two surfaces. Warm tungsten light still shifts the garment colour
  (`D-Y.03-7`). Both are properly fixed by the neutral set, still owed, still placeholder #2.
- **Links:** `facts.md` §8 · §8.1 · `D-1.05-4` · `D-0-6` · `D-Y.03-7` ·
  `src/components/home/HomeExperience.tsx`

### D-Y.04-2 · 2026-07-26 · The countdown branch's "browse while you wait" text link is retired; the key stays
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Context:** The brief's top-to-bottom order for the countdown branch enumerates every element that
  ships — eyebrow, h1 + sub, Countdown, photograph, the two buttons, aboutLink — and the existing
  `browseWhileWait` text link (`/catalog`) is not in it. The new primary **Каталог** button targets the
  same route, directly beneath the photograph.
- **Decision:** The `browseWhileWait` `<Link>` no longer renders. The `Home.browseWhileWait` key stays
  in both catalogs (the brief pins `string-inventory.md` at 245 → **247**, i.e. two keys added, none
  removed).
- **Alternative rejected:** keeping both — a text link and a primary button to the same route four
  elements apart is a duplicate call to action competing with itself, and contradicts the brief's
  exhaustive ordering. Also rejected: deleting the key, which would break the briefed 247 count.
- **Downside accepted:** `Home.browseWhileWait` is now a dead key, honestly flagged
  "_(not found in source)_" in the regenerated `string-inventory.md`. A reviewed MK string no longer
  renders anywhere; a future phase either re-uses or removes it.
- **Links:** brief Task 2 ordering · `docs/i18n/string-inventory.md` · `src/messages/{mk,en}.json`

### D-Y.04-3 · 2026-07-26 · Mobile full-bleed is implemented as `-mx-4` against the page column, square-cornered at the bleed
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Context:** The brief specifies "full-bleed width" for the single mobile frame. The Home column is
  `max-w-6xl px-4 sm:px-6`, so a `w-full` child stops 16px short of each viewport edge.
- **Decision:** Below `sm:` the frame carries `-mx-4`, cancelling the column's `px-4` exactly, so the
  photograph runs edge to edge with **no rounding** (corners that touch the viewport edge are square);
  from `sm:` it returns inside the column with the PhotoSlot `radius-lg`. Both boxes carry the
  PhotoSlot `bg-surface-2` so a still-loading photograph reads as a quiet surface, never a hole.
- **Alternative rejected:** keeping the frame inside the column padding (not full-bleed — reads as a
  card, not a hero), and viewport-width tricks (`50vw` negative margins), which desync from the real
  column padding and can leak a scrollbar-width horizontal overflow.
- **Downside accepted:** the `-mx-4` is coupled to the page column's `px-4` — if the column padding
  ever changes below `sm:`, the bleed drifts and must follow (recorded in a comment at the site).
  Verified: `document.documentElement.scrollWidth === 390` at 390px — no horizontal overflow.
- **Links:** `src/components/home/HomeExperience.tsx` (`HeroPhotos`) ·
  `src/components/system/PhotoSlot.tsx`

### D-Y.04-4 · 2026-07-26 · The secondary button is composed from existing pieces; no new variant system
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Context:** The brief mandates "the existing button styling" for both buttons, but the codebase has
  no secondary *button-link* variant: the only filled button-links are the mustard Cart-checkout recipe
  (`CartView`) and the checkout submit; the only bordered interactive treatment is the cart stepper's
  `border-border-strong` / `hover:border-foreground`.
- **Decision:** Both buttons share the exact base recipe from `CartView`'s checkout Link (font,
  radius-md, px-5 py-3, motion-fast transition, focus ring); the primary takes its
  `bg-mustard hover:bg-mustard-hover text-on-mustard` fill verbatim, the secondary takes the cart
  stepper's `border border-border-strong text-foreground hover:border-foreground` on `bg-transparent`.
  Every class already exists in the codebase; heights compute to 48px / 50px (≥44px tap targets).
- **Alternative rejected:** reusing `BuyButton`'s only bordered look — the sold-out state — which is a
  *disabled* affordance in the grey `soldout` token, semantically wrong for a live action; or inventing
  a new variant, which the brief forbids.
- **Downside accepted:** the secondary recipe now exists only inline in `HomeExperience`; if a shared
  Button component ever lands, it should absorb both.
- **Links:** `src/components/cart/CartView.tsx` · `src/components/product/BuyButton.tsx` ·
  `src/components/home/HomeExperience.tsx` (`HeroCtas`)

### D-Y.04-5 · 2026-07-26 · Lighthouse was measured on the ended-state hero by ending the LOCAL scratch drops; hosted never touched; restored after
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot, to make the brief's "Lighthouse mobile on `/` ≥ 94" gate
  measure the page this phase actually changed.
- **Context:** The local scratch database still carries the `D-Y.03-11` leftover drops
  (`test-open-drop`, currently live), so a local production build serves the **live grid** on `/` —
  a page this phase does not touch — while real production serves the **ended** hero. The `?preview=`
  override is dev-only and refused under `next start`.
- **Decision:** The two scratch drops' windows were moved into the past (local Docker DB only, exact
  prior values recorded first), `/` then served the ended-state photographic hero, Lighthouse ran
  against `next start` — **mobile Performance 98** — and **both rows were restored byte-exact and
  re-queried after**. The same maneuver, guardrails and restore-proof as `D-Y.03-11`.
- **Alternative rejected:** measuring `/` in the live state (measures a page the phase didn't change —
  a number that proves nothing about the hero), or pointing dev at the hosted database (production
  credentials for a local render check, zero-mutation but needless exposure).
- **Downside accepted:** the same one `D-Y.03-11` logged — the scratch DB diverges from
  `src/config/drops.ts` and keeps biting every phase that verifies locally; this phase worked around
  it rather than fixing it.
- **Links:** `D-Y.03-11` · `src/lib/drop/state.ts` (`pickActiveDrop`)

### D-Y.05-1 · 2026-07-27 · `Home.headline` is retired from render, not deleted
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.05 brief); executed by Claude Code.
- **Decision:** The rendered `<h1>{t('headline')}</h1>` is removed from all three non-`live` Home
  branches. The key stays in `mk.json` and `en.json` and is flagged `_(not found in source)_` in the
  regenerated `string-inventory.md` — the `D-Y.04-2` treatment, applied to a second key.
- **Alternative rejected:** deleting the key, which would drop the inventory to 246 and make the
  change hard to reverse.
- **Downside accepted:** the catalogs now carry two dead keys (`browseWhileWait`, `headline`), not one.
- **Links:** `D-Y.04-2` · `docs/i18n/string-inventory.md` · `src/messages/{mk,en}.json`

### D-Y.05-2 · 2026-07-27 · The Home H1 becomes visually hidden in the three non-live branches
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.05 brief); executed by Claude Code.
- **Decision:** Each of the `no-view`, `ended` and `countdown` branches renders
  `<h1 className="sr-only">{t('title')}</h1>` — identical to what the `live` branch has done since 2.04.
- **Alternative rejected:** no H1 at all, which breaks 2.04's "one H1 per page, no heading skips" gate
  and costs the Accessibility 100.
- **Downside accepted:** the page's visible top-level heading is now a photograph; the H1 exists for
  machines and screen readers only.
- **Links:** Phase 2.04 a11y gates · `src/components/home/HomeExperience.tsx`

### D-Y.05-3 · 2026-07-27 · Two hero sources, art-directed by breakpoint
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.05 brief); executed by Claude Code.
- **Decision:** Below `640px` the hero renders `mustard-ochre-01.webp` in `aspect-[4/5]`
  (`objectPosition` keeping Y.04's tuned `center 60%`); from `640px` it renders the new
  `trio-composite-01.webp` (1672×941, three-panel composite of the same three §8.1-permitted frames,
  serif TRAJANOV burned in) in `aspect-[16/9]`. Both bound by explicit named constants (`D-Y.03-1`).
- **Alternative rejected:** the composite at all breakpoints — `object-cover` on a 16:9 source in a
  phone-shaped box crops to roughly the middle third and slices the burned-in wordmark into
  unreadable fragments.
- **Downside accepted:** two hero images to maintain, and phone visitors never see the composite.
- **Links:** `D-Y.03-1` · `facts.md` §8.1 · `public/images/lifestyle/trio-composite-01.webp`

### D-Y.05-4 · 2026-07-27 · Exactly one image preload, and it stays the mobile one
- **Status:** Accepted (execution deviates from the brief's prop recipe — see D-Y.05-11)
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.05 brief); executed by Claude Code.
- **Decision:** The mustard frame keeps `priority` (the LCP element for phone visitors). The composite
  must emit **no** `rel="preload" as="image"` link, so a phone never preloads a desktop-only asset.
- **Alternative rejected:** `priority` on both, which emits two preload links and makes phone visitors
  preload a desktop-only asset — the thing Y.04's 98 depended on not happening.
- **Downside accepted:** desktop LCP loses its preload hint (measured cost on this branch: desktop
  Lighthouse 99, LCP 0.9s — the composite is still the desktop LCP element).
- **Links:** `D-Y.04` preload record · `D-Y.05-11` · `src/components/home/HomeExperience.tsx`

### D-Y.05-5 · 2026-07-27 · Full-bleed means the width of the page column, not the viewport
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.05 brief); executed by Claude Code.
- **Decision:** The hero cancels the column padding (`-mx-4 sm:-mx-6`) and stops at the existing
  `max-w-6xl` (1152px). Measured hero box at 1280: exactly 1152×648.
- **Alternative rejected:** true `100vw` bleed via `left-1/2 -translate-x-1/2 w-screen`, which would
  upscale a 1672px source on a wide display and break alignment with the header and footer.
- **Downside accepted:** on a large monitor the hero is a wide band, not edge-to-edge glass.
- **Links:** `D-Y.04-3` (the bleed shape) · `src/components/home/HomeExperience.tsx`

### D-Y.05-6 · 2026-07-27 · The scrim only darkens; measured, then deepened 55% → 80% reach
- **Status:** Accepted
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.05 brief); recipe finalised
  by measurement, Claude Code.
- **Decision:** The overlay scrim is built from `--color-ground` only, via `color-mix` — a flat 40%
  wash plus a bottom gradient at 92%. No new colour token, no white, no lightening blend (`D-2.10-1`
  stands). The brief's starting recipe ran the gradient to 55% of the hero's height; measured, the
  countdown digits' top rows sit ~60% up the box at 320/768/1024 and their brightest underlying
  pixel composited to **2.14:1** (< the 3:1 floor), so the gradient reach was deepened to **80%** —
  the sanctioned correction direction ("deepen the scrim; never lighten the photograph, never
  brighten the text"). After deepening, every digit's worst pixel measures ≥3.34:1, tagline ≥7.82:1,
  CTA labels ≥9.26:1 across 320/390/768/1024/1280, both locales, all overlay states.
- **Alternative rejected:** a lighter text colour over an undimmed photo.
- **Downside accepted:** the photograph reads darker than the file does on its own — and the 80%
  reach dims more of it than the brief's 55% sketch anticipated.
- **Links:** `D-2.10-1` · brand.md §3 · `src/components/home/HomeExperience.tsx` (`SCRIM_*`)

### D-Y.05-7 · 2026-07-27 · The countdown stays the largest type on the page, inside the overlay
- **Status:** Accepted (execution partially deviates — see D-Y.05-9/10)
- **Decided by:** Lazar (orchestrator decision, pre-made in the Phase Y.05 brief); executed by Claude Code.
- **Decision:** The countdown renders inside the overlay, above the tagline; nothing in the overlay
  may be set larger. Verified rendered: digits 88px from `768px` up, 36px below — against 16px
  tagline/buttons and 12px labels, the largest type at every width.
- **Alternative rejected:** moving the countdown above the image to keep Y.04's measured contrast —
  that leaves the hero looking nothing like what was asked for.
- **Downside accepted:** countdown legibility now depends on the scrim, so it was measured rather
  than assumed (see D-Y.05-6 for the measured ratios).
- **Links:** brand.md §2/§4 · `D-Y.05-6` · `src/components/drop/Countdown.tsx`

### D-Y.05-8 · 2026-07-27 · The overlay tagline renders in `--color-foreground`, not the muted token
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Context:** Y.04's tagline was `text-muted-foreground` on the plain page ground (7.9:1, brand.md
  §3). In the overlay it sits on a photograph behind a scrim; muted (#ABA79E) over the measured
  worst-case composite would hold only ~1.7–4.6:1 depending on scrim depth, and the only sanctioned
  correction (deepen, D-Y.05-6) would have to darken the photograph much further to buy the same
  margin a brighter token gives for free.
- **Decision:** Inside the overlay the tagline is `text-foreground`. This is the initial design
  choice for a new surface, decided before measurement — not a post-measurement brightening, which
  D-Y.05-6 forbids.
- **Alternative rejected:** keeping `text-muted-foreground` and deepening the scrim until it passes —
  costs the photograph far more darkening for a token whose whole purpose (quiet secondary text) the
  hero tagline no longer serves.
- **Downside accepted:** the tagline is one step louder in the hierarchy than Y.04 shipped it; the
  quiet-secondary look is lost on the hero.
- **Links:** brand.md §3 · `D-Y.05-6` · `src/components/home/HomeExperience.tsx`

### D-Y.05-9 · 2026-07-27 · The countdown's token size is restored at the call site — tailwind-merge has been silently stripping it since 1.04
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot, after measurement.
- **Context:** The brief's gate "computed font-size pasted for the digits" surfaced this: the digit
  and colon spans inside `Countdown.tsx` pass `text-countdown` **before** a text-colour class into
  `cn()`, and `tailwind-merge` (3.6.0, locked since the 1.01 scaffold) cannot tell a custom
  font-size utility from a colour utility — both pattern-match `text-*` — so it drops
  `text-countdown` as a "conflicting colour". The digits have computed to **16px** since the
  countdown was built in 1.04 — on `main` and on production today. `DropCountdownEyebrow` loses its
  `text-eyebrow` the same way (renders 16px). Every prior "the countdown is the loudest object"
  verification was made against the stripped size; no earlier gate ever demanded the computed value.
- **Decision:** In `HomeExperience.tsx` (the one file in this phase's scope) the `Countdown` wrapper
  gets the size utility via its existing `className` prop, so the stripped spans inherit the token
  size. `Countdown.tsx` itself and `src/lib/utils.ts` are untouched.
- **Alternative rejected:** fixing the root cause — reordering classes in `Countdown.tsx` or
  configuring `extendTailwindMerge` with the brand's custom font-size group in `src/lib/utils.ts` —
  both outside this phase's file scope, and the utils change has site-wide blast radius that needs
  its own phase and its own verification.
- **Downside accepted:** the root cause remains. Any `cn('text-<custom-size> … text-<colour>')`
  elsewhere still strips the size (`DropCountdownEyebrow` on this same hero still renders 16px, and
  `/styleguide`'s countdown demos stay small). A follow-up phase should fix `cn()` properly.
- **Links:** `src/lib/utils.ts` · `src/components/drop/Countdown.tsx` · tailwind-merge 3.6.0 ·
  `D-Y.05-10`

### D-Y.05-10 · 2026-07-27 · Below `768px` the countdown renders at `--text-h1` — the countdown token physically cannot fit a phone
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot, after measurement; deviates from D-Y.05-7's "renders at
  `--text-countdown`" below `md:`.
- **Context:** With the token size restored (D-Y.05-9), the countdown row measured **402px wide at a
  390px viewport** — `--text-countdown` is `clamp(2.75rem, 13vw, 5.5rem)`, and four `min-w-[2ch]`
  cells at 13vw plus three colons and six gaps add to more than 100vw. The token was born unfittable
  on phones; the 16px strip is why it never visibly clipped. Between 640–735px the capped 5.5rem row
  (669px) still exceeds the overlay's width.
- **Decision:** The wrapper carries `text-h1 md:text-countdown`. From `768px` up the row (669px) fits
  every hero and the brief's token applies; below, `--text-h1` (36–50px digits) — still by far the
  largest type in the hero — fits with margin (row 306px at 390, 274px at 320; no clipping, no
  horizontal overflow, verified at all five widths).
- **Alternative rejected:** shipping the token at all widths and letting `overflow-hidden` clip the
  digits (~6px per side at 390, worse at 320 — unreadable edges on the one element the site exists
  to show); or shrinking the Countdown's internal gaps (out-of-scope file).
- **Downside accepted:** on phones the countdown renders at the H1 token, not the countdown token —
  a second token now sizes the same component depending on width, and D-Y.05-7's letter holds only
  from `md:` up.
- **Links:** `D-Y.05-9` · brand.md §4 · `src/components/home/HomeExperience.tsx`

### D-Y.05-11 · 2026-07-27 · The composite ships default-lazy — on Next 16 both `loading="eager"` and `fetchPriority="high"` emit a second preload link
- **Status:** Accepted; deviates from the brief's Task 4 prop recipe to satisfy the same brief's DoD
- **Decided by:** Claude Code, on the spot, after measurement.
- **Context:** The brief's recipe for the composite (`loading="eager"` + `fetchPriority="high"`, no
  `priority`) assumes only `priority` emits a preload. Measured on Next 16.2.10: `fetchPriority="high"`
  emits a `rel="preload" as="image"` link, and so does `loading="eager"` alone — either way `<head>`
  carries **two** preloads, which is exactly what D-Y.05-4 exists to prevent and what the DoD's
  "exactly one preload, mustard" forbids.
- **Decision:** The composite `<Image>` carries no `priority`, no `loading`, no `fetchPriority` —
  next/image's default (lazy). Measured consequences: exactly one preload (mustard) in `<head>` both
  locales; a phone (where the composite's box is `display:none`) never downloads the 185KB
  desktop-only asset at all; desktop discovers it in the initial HTML, in-viewport, and fetches it
  right after layout — desktop Lighthouse 99 with the composite as the LCP element at 0.9s.
- **Alternative rejected:** keeping the brief's literal props (two preloads, DoD fail, and phones
  preload a desktop asset); or hand-rolling `getImageProps` + `<picture>` art direction, which
  departs from the repo's established next/image pattern for marginal desktop gain.
- **Downside accepted:** desktop's composite fetch starts at layout time instead of parse time — a
  ~0.1s LCP cost on the measured desktop run.
- **Links:** `D-Y.05-4` · Next 16.2.10 `next/image` preload behaviour ·
  `src/components/home/HomeExperience.tsx`

### D-Y.05-12 · 2026-07-27 · Verification maneuvers: local scratch drops ended for Lighthouse, and a temporary uncommitted `view = null` for the no-view render
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot — the D-Y.04-5 / D-Y.03-11 pattern, repeated and extended.
- **Decision:** (a) For Lighthouse on `next start`, the two local scratch drops' windows were moved
  into the past (local Docker DB only; exact prior values recorded first: `test-open-drop`
  2026-07-21T17:24:31.984Z → 2026-07-29T17:24:31.984Z, `test-upcoming-drop` 2026-07-29T17:24:31.984Z
  → 2026-08-05T17:24:31.984Z), `/` then served the ended-state hero as production does, and **both
  rows were restored byte-exact and re-queried after**. Hosted untouched. (b) For the no-view state —
  unreachable via `?preview=` (it needs zero drop rows) — `page.tsx` got a one-line local
  `const view = null` override, the state was rendered and measured at all five widths in both
  locales, and the file was reverted via `git checkout` (diff-proven clean) before commit.
- **Alternative rejected:** (a) measuring `/` in the live state (a page this phase doesn't touch);
  (b) deleting the drops rows to force no-view through the real query path — `products`/`variants`/
  `order_items` hang off `drops` without cascade, so an honest restore would mean dump-and-reload of
  six tables for a branch this phase doesn't change (`getActiveDropView`'s null path is untouched
  code).
- **Downside accepted:** the same one D-Y.04-5 logged — the scratch DB keeps diverging from
  `src/config/drops.ts` and biting every phase; and the no-view evidence proves the component branch,
  not the DB-to-null path (that path is untouched by this phase).
- **Links:** `D-Y.04-5` · `D-Y.03-11` · `src/app/[locale]/page.tsx` · `src/lib/drop/state.ts`

### D-2.21-1 · 2026-07-27 · The Home showcase autoplay — the FIFTH motion exception, and the first that loops
- **Status:** Accepted
- **Decided by:** Orchestrator (owner-requested), pre-made in the Phase 2.21 brief (decisions 6–7);
  logged here by Code as the brief instructs.
- **Context:** `brand.md` §6 holds a presumption against decoration, with four logged exceptions
  (`D-2.10-1`, `D-2.16-3`, `D-2.17-5`, `D-2.19-1`) — all first-paint, hover, or scroll-driven; none
  loops. The Home showcase (one large photograph at a time, between the hero and the FAQ)
  auto-advances every 6s.
- **Decision:** Autoplay ships — 6s per slide, with a real pause mechanism per WCAG 2.2 SC 2.2.2:
  it stops on hover, on focus-within, when the tab is hidden, on a visible pause button, and
  entirely under `prefers-reduced-motion` (a JS `matchMedia` check — the global CSS rule cannot
  stop a `setTimeout`). The cross-fade rides `--motion-slow` over `--ease-smooth` per the brief —
  noting that `brand.md` §6 letters both as header-scoped; the brief's pairing is treated as the
  orchestrator widening that scope for this one section. `brand.md` is out of this phase's scope,
  so §6's text is NOT updated — flagged in the completion report §3 for the orchestrator.
- **Alternative rejected:** a static showcase with manual controls only (no autoplay) — rejected by
  the owner-requested brief; or a new dedicated motion token pair, which needs a `brand.md` edit
  this phase is forbidden to make.
- **Downside accepted:** a permanently animating element on the front door, and a §6 whose
  "header only" scoping for `--motion-slow`/`--ease-smooth` is now inaccurate until a future phase
  updates it.
- **Links:** Phase 2.21 brief (decisions 6–7) · brand.md §6 · `src/app/globals.css` `.showcase-*` ·
  `src/components/home/HomeShowcase.tsx`

### D-2.21-2 · 2026-07-27 · A null price falls back to the ProductCard placeholder, not to slide exclusion
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Context:** The brief's `ShowcaseSlide` carries `priceMkd` and the slide template calls
  `formatMkd(priceMkd, …)`, but `ProductView.priceMkd` is `number | null` (null = OWED,
  `facts.md` §7). All three committed products have real VERIFIED prices today, so the branch is
  currently unreachable — but the type demands an answer.
- **Decision:** `ShowcaseSlide.priceMkd` stays `number | null`, and the slide renders the existing
  `<Placeholder>{t('Placeholder.price')}</Placeholder>` fallback when null — exactly what
  `ProductCard` does. No non-null assertion, no invented number.
- **Alternative rejected:** excluding unpriced products from the showcase (hides a photographed
  product over a fact the placeholder register already tracks as a visible marker); or typing the
  field non-null and asserting (a crash path the DB can reach).
- **Downside accepted:** if a price is ever nulled in the DB, a bracketed `[PLACEHOLDER: цена MKD]`
  renders on the front door until caught — mitigated by it being exactly the visible, logged
  placeholder mechanism the project mandates.
- **Links:** `src/lib/showcase.ts` · `src/components/home/HomeShowcase.tsx` ·
  `src/components/product/ProductCard.tsx` · placeholder register #1 (cleared) rationale

### D-2.21-3 · 2026-07-27 · No pause button under prefers-reduced-motion
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Context:** Under `prefers-reduced-motion: reduce` the JS gate disables autoplay entirely
  (brief decision 6). The pause/play toggle then controls nothing.
- **Decision:** The pause button does not render under reduced motion — the same principle the
  brief applies to the one-slide case ("a control that cannot do anything is worse than no
  control"). Arrows and the progress buttons still render and still change slides (verified).
- **Alternative rejected:** rendering the toggle disabled or as a no-op — an interactive element
  that announces itself and does nothing is an a11y defect, not a courtesy.
- **Downside accepted:** reduced-motion users see one fewer control than others, and if a future
  change ever re-enabled autoplay under reduced motion by mistake there would be no visible pause
  control (mitigated: the JS gate and this button share the same `reducedMotion` state, so they
  cannot diverge).
- **Links:** `src/components/home/HomeShowcase.tsx` · WCAG 2.2 SC 2.2.2 · Phase 2.21 brief decision 6

### D-2.21-4 · 2026-07-27 · The progress bar wraps onto its own row below `sm:`
- **Status:** Accepted
- **Decided by:** Claude Code, after measurement.
- **Context:** The brief's controls row is the reference's desktop shape: arrows + pause + the
  labelled progress bar inline. Measured at 320px, the three 50px buttons + gaps leave each
  progress button ~45px — the visible label truncates to two letters („Пр…"), which is not a
  label.
- **Decision:** The progress container carries `basis-full` below `sm:` (wrapping onto its own
  full-width row — labels measure 138px at 320px and render legibly) and `sm:basis-auto sm:flex-1`
  from `sm:` up (the reference's inline row).
- **Alternative rejected:** truncated inline labels at all widths (unreadable at 320/390); or
  hiding the labels below `sm:` (an unlabelled progress bar is what the brief's "labelled" rules
  out).
- **Downside accepted:** the controls block is one row (~62px) taller on phones.
- **Links:** `src/components/home/HomeShowcase.tsx` · measured at 320/390 in the pane

### D-2.21-5 · 2026-07-27 · The empty progress track is `--color-border-strong`, not `--color-border`
- **Status:** Accepted
- **Decided by:** Claude Code, after measurement.
- **Context:** The track under each progress label first shipped on `--color-border` and measured
  **1.37:1** on ground — below the 3:1 non-text floor (WCAG 2.2 1.4.11) held since 2.04.
- **Decision:** The track uses `--color-border-strong` — measured **3.56:1**, the same value the
  section's bordered buttons already carry, and exactly what brand.md §3 names it for ("hairlines
  that must be seen").
- **Alternative rejected:** keeping `--color-border` and arguing the track is decorative (the
  empty track is the only visual bar on inactive items — it identifies the control).
- **Downside accepted:** the resting track is more prominent than the reference design's
  hairline.
- **Links:** brand.md §3 · `src/components/home/HomeShowcase.tsx` · measured ratios in the
  completion report

### D-2.21-6 · 2026-07-27 · `--showcase-autoplay` is set inline from the component's constant, not added to `:root` or brand.md
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Context:** The progress fill must track the 6s autoplay timer, and the scoped CSS block may
  not contain a raw millisecond value. A `:root` token would need a `brand.md` §6 row — and
  `brand.md` is out of this phase's scope ("no new token is needed — if you think one is, stop and
  say so").
- **Decision:** One constant, `AUTOPLAY_MS = 6000`, lives in `HomeShowcase.tsx`; it arms the JS
  timer AND is written onto the section as the `--showcase-autoplay` custom property, which the
  `.showcase-progress-fill` rule reads. One source — the fill and the timer cannot drift. The fill
  runs `linear` (it tracks a constant-speed timer — the `D-2.20-3` rationale) and restarts from
  zero when the timer re-arms (a resumed-mid-bar fill would misreport the time remaining).
- **Alternative rejected:** a `--motion-showcase` token in `:root` + brand.md §6 (out of scope
  this phase — flagged in the report if the orchestrator wants it promoted); or hardcoding a
  duration in the CSS block (two sources that drift, and a banned raw value).
- **Downside accepted:** a motion duration lives in a component file rather than the token sheet —
  a future re-time must know to edit `AUTOPLAY_MS`, not `globals.css`.
- **Links:** `src/components/home/HomeShowcase.tsx` · `src/app/globals.css` `.showcase-*` ·
  `D-2.20-3`

### D-2.21-7 · 2026-07-27 · Verification maneuvers: scratch-drop windows shifted and restored, a temporary `view = null`, and headless-pane simulations
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot — the `D-Y.05-12` / `D-Y.04-5` pattern, repeated and
  extended.
- **Decision:** (a) The active local drop (`test-open-drop`, no photographed products) would have
  rendered an empty showcase in every preview, so both scratch drops' windows were shifted into
  the past (exact prior values recorded first: `test-open-drop` 2026-07-21T17:24:31.984Z →
  2026-07-29T17:24:31.984Z; `test-upcoming-drop` 2026-07-29T17:24:31.984Z →
  2026-08-05T17:24:31.984Z), making `test-drop` (the three real catalog products) the active ended
  drop; **both rows were restored byte-exact after, and `npm test` re-ran 129/129** — the mid-
  maneuver run correctly failed 10 order-flow tests, proving the restore mattered. Hosted
  untouched. (b) The no-view state used a one-line local `view = null` override, rendered both
  locales, then reverted (diff-proven clean). (c) The headless pane reports
  `document.visibilityState === "hidden"` permanently and cannot emulate reduced motion or touch,
  so: visibility pause/resume was proven by overriding the getter and dispatching
  `visibilitychange` (both directions); reduced motion by patching `matchMedia` and remounting via
  client-side navigation (no autoplay in 8s, no pause button, arrows/progress still work); swipe
  by synthetic `TouchEvent`s (left/right advance, vertical flick and sub-threshold drag ignored);
  hover-pause was observed live (the pane's parked cursor paused autoplay exactly as designed).
- **Alternative rejected:** verifying against the photo-less scratch drop (proves an empty
  section, not the feature); skipping the behaviours the pane cannot reach natively (they are the
  phase's WCAG gates).
- **Downside accepted:** the same ones `D-Y.05-12` logged — the scratch DB keeps diverging from
  `src/config/drops.ts` and biting every phase (it cost one mid-phase red test run this time); and
  the no-view/touch/reduced-motion evidence proves the component branches via simulation, not real
  hardware — the real-device read is owed row #49.
- **Links:** `D-Y.05-12` · `D-Y.04-5` · `src/app/[locale]/page.tsx` · completion report §5

### D-2.22-1 · 2026-07-27 · Chromeless means the visible box goes, the hit area stays
- **Status:** Accepted
- **Decided by:** Orchestrator (owner-requested), pre-made in the Phase 2.22 brief (decision 1);
  logged here by Code as the brief instructs.
- **Context:** The three carousel controls under the Home showcase (prev, next, pause) sat in
  bordered rounded boxes (`border border-border-strong`, 50×50 rendered). Next to a full-bleed
  photograph they read as form furniture. Lazar asked for the boxes gone.
- **Decision:** The `iconButton` constant drops the border and the hover-border move; `p-3` and
  the 24px icon stay, so the padded box becomes **48×48** (the missing 2px is exactly the removed
  1px border per side). 48 clears the 44px tap-target floor this project has held since the 2.04
  gate (WCAG 2.2 SC 2.5.8). The padding is the tap target, not decoration.
- **Alternative rejected:** shrink the button to the glyph.
- **Downside accepted:** none material — the button occupies the same footprint it did; it just
  stops drawing an outline.
- **Links:** Phase 2.22 brief (decision 1) · `src/components/home/HomeShowcase.tsx` (`iconButton`) ·
  `D-2.22-2` · `D-2.22-3`

### D-2.22-2 · 2026-07-27 · The icons rest at muted-foreground and go to foreground on hover and on focus
- **Status:** Accepted
- **Decided by:** Orchestrator (owner-requested), pre-made in the Phase 2.22 brief (decision 2);
  logged here by Code as the brief instructs.
- **Context:** With the box gone the glyph is the whole control, and it needs a visible hover/focus
  response without inventing motion. The progress labels in the same row already run
  muted-foreground → foreground on hover.
- **Decision:** `text-muted-foreground` at rest, `hover:text-foreground` +
  `focus-visible:text-foreground` lit. Measured this phase against `--color-ground` `#0F1210`:
  **7.85:1** at rest, **15.42:1** lit — both far above the 3:1 floor WCAG 2.2 SC 1.4.11 sets for
  meaningful non-text graphics, and matching the brand.md §3 ledger (7.9 / 15.4). The lucide icons
  draw with `stroke="currentColor"`, so no colour class touches the icon elements themselves.
- **Alternative rejected:** keep the icons at full `foreground` at rest.
- **Downside accepted:** with no box and no colour headroom left, hover would have needed a
  transform or an opacity trick — a new brand.md §6 motion exception for a hover state, not worth
  it.
- **Links:** Phase 2.22 brief (decision 2) · brand.md §3 ledger · `D-2.22-1`

### D-2.22-3 · 2026-07-27 · The radius stays because the focus ring is the only chrome left
- **Status:** Accepted
- **Decided by:** Orchestrator (owner-requested), pre-made in the Phase 2.22 brief (decision 3);
  logged here by Code as the brief instructs.
- **Decision:** `rounded-[var(--radius-md)]` is kept on the chromeless buttons. With the border
  gone, the `focus-visible:` ring is the only chrome these buttons ever draw, and the radius is
  what shapes it.
- **Alternative rejected:** strip the radius along with the border, since nothing visible rounds
  at rest.
- **Downside accepted:** a token'd radius rides along on an element that visibly uses it only
  while focused.
- **Links:** Phase 2.22 brief (decision 3) · `D-2.22-1` · brand.md §5 (`--radius-md`)

### D-2.22-4 · 2026-07-27 · The three-button group is pulled left by its own padding (`-ml-3`)
- **Status:** Accepted
- **Decided by:** Orchestrator (owner-requested), pre-made in the Phase 2.22 brief (decision 4);
  logged here by Code as the brief instructs.
- **Context:** Once the box is invisible, the first glyph would sit 12px inside the column edge
  and the whole row would read as indented against the photograph above it.
- **Decision:** The three buttons are wrapped in one `-ml-3 flex items-center` element — a flex
  item where three used to be, so the outer control row's class string and the mobile wrap
  behaviour are untouched. No `gap` between the three: each button's own `p-3` already puts 24px
  between glyphs. The negative margin puts the glyph back on the column edge.
- **Alternative rejected:** leave the group indented.
- **Downside accepted:** the button's invisible hit area now starts 4px from the viewport edge at
  320px — measured this phase: rect left = 4, ring outer edge exactly 0, zero horizontal overflow.
- **Links:** Phase 2.22 brief (decision 4) · `src/components/home/HomeShowcase.tsx` · `D-2.22-1`

### D-2.22-5 · 2026-07-27 · Verification maneuvers: the scratch-drop window shift repeated (twice), and the D-2.21-7 simulations re-run
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot — the `D-Y.05-12` / `D-2.21-7` pattern, repeated.
- **Decision:** (a) The active local drop (`test-open-drop`, no photographed products) again
  renders an empty showcase in every preview, so both scratch drops' windows were shifted into the
  past (exact prior values recorded first — the same values `D-2.21-7` recorded:
  `test-open-drop` 2026-07-21T17:24:31.984Z → 2026-07-29T17:24:31.984Z; `test-upcoming-drop`
  2026-07-29T17:24:31.984Z → 2026-08-05T17:24:31.984Z), making `test-drop` the active ended drop.
  This happened **twice** (the second time for one final 320px focus-ring render after the first
  restore); after each shift **both rows were restored byte-exact and `npm test` re-ran 129/129**.
  Hosted untouched. (b) The headless pane still reports `document.visibilityState === "hidden"`
  permanently, so autoplay/pause behaviours were proven the `D-2.21-7` way: visibility-getter
  override + dispatched `visibilitychange` (autoplay advances when "visible", stops when
  "hidden"), real-pointer hover pause, JS-focus focus-within pause, and reduced motion by patching
  `matchMedia` + client-side remount (pause button not rendered, no advance in 8s, arrows and
  progress buttons still change slides). (c) The pane additionally stopped compositing screenshots
  at wide viewports mid-scroll this session, so wide-viewport renders were captured with tall
  viewports (e.g. 1280×2100) at scroll 0 — measurement JS was unaffected.
- **Alternative rejected:** verifying against the photo-less live scratch drop (proves an empty
  section, not the controls); skipping the behaviours the pane cannot reach natively.
- **Downside accepted:** the same ones `D-2.21-7` logged — the scratch DB keeps diverging from
  `src/config/drops.ts` and biting every phase, and the behaviour evidence is simulation, not real
  hardware; the real-device read is owed row #51.
- **Links:** `D-2.21-7` · `D-Y.05-12` · Phase 2.22 completion report §5
---
### D-2.23-1 · 2026-07-28 · The contact form ships — reversing Plan §4 "No contact form"
- **Status:** Accepted
- **Decided by:** The owner, via Lazar (2026-07-28), baked into the Phase 2.23 brief (decision 1);
  logged by Claude Code as instructed.
- **Decision:** The Contact page carries a real message form (Name / Email / Subject-optional /
  Message → Turnstile → validate → one email to `ORDER_NOTIFICATION_EMAIL` with `replyTo` = the
  visitor). This reverses `Trajanov-V2-Plan.md` §4's Contact row ("No contact form — the phone is
  the channel"); the row is amended in place with this ID, the old sentence quoted, not deleted.
- **Alternative rejected:** keep the phone + email links only (the kickoff call).
- **Downside accepted:** a second inbox that must actually be read, a new PII surface on a site run
  by a minor, free-to-send spam exposure (bounded by Turnstile + hard length caps, deliberately NOT
  the order rate limiter — brief decision 4), and a mandatory rewrite of two native-reviewed
  Privacy strings (see the 2.23 review pack).
- **Links:** Phase 2.23 brief (decisions 1–4) · `Trajanov-V2-Plan.md` §4 · owed row (Lazar's
  sign-off that the form is what he wants living on the site)
---
### D-2.23-2 · 2026-07-28 · The form reuses five already-reviewed strings instead of minting Contact twins
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Decision:** The required-field error (`Checkout.errorRequired`), the submitting line
  (`Checkout.verifying`), the bot-protection label (`Order.protected`), the failed-check message
  (`Order.turnstileFailed`) and the generic error (`Order.genericError`) are REUSED in the contact
  form. Only genuinely new copy got new keys (15 `Contact.*`).
- **Alternative rejected:** duplicate them as `Contact.*` keys with identical text.
- **Downside accepted:** cross-namespace coupling — rewording a Checkout/Order string for
  checkout-specific reasons silently rewords the contact form too. Accepted because the duplicated
  alternative drifts the two copies apart the first time one is reviewed alone, which is worse.
- **Links:** `src/components/contact/ContactForm.tsx` · `docs/i18n/mk-review-2.23.md` §3 count check
---
### D-2.23-3 · 2026-07-28 · Both Meta descriptions rewritten — the brief's Decision 7 named only the two Privacy bodies
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Decision:** `Meta.privacyDescription` (MK+EN) said „без е-пошта" / "no email" — a THIRD live
  statement that becomes false the moment the form ships, exactly the class of contradiction the
  brief's report-§3 instruction exists to catch. It is rewritten („…кога нарачуваш или ни
  пишуваш…"). `Meta.contactDescription` is also rewritten to mention the message form it now
  describes. Both are in the 2.23 MK review pack.
- **Alternative rejected:** leave the meta descriptions untouched and only report the finding
  (ships a false public statement for at least one more phase).
- **Downside accepted:** two strings changed beyond the brief's literal list, and two more rows for
  the reviewers.
- **Links:** Phase 2.23 brief (hard stop 1, report §3) · `docs/i18n/mk-review-2.23.md` §3
---
### D-2.23-4 · 2026-07-28 · The action is a thin wrapper over a pure pipeline module — and exports nothing but the action
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot — the `process-order.ts` convention, plus a defect found
  in verification.
- **Decision:** Validation + orchestration live in `src/lib/contact/process-contact.ts` (pure,
  injected deps, 25 unit assertions); `src/lib/contact/actions.ts` ("use server") only wires
  `verifyTurnstile` + `sendContactMessage`. The first cut also re-exported the two types from
  actions.ts — Next's server-actions loader compiles EVERY export of a "use server" module into an
  action reference, so the type-only export (erased by TypeScript) crashed the module at runtime
  with `ReferenceError: ContactInput is not defined` (a 500 on every submit; tsc/build both green).
  The re-export is removed; types are imported from `process-contact.ts`.
- **Alternative rejected:** validation inline in the "use server" file (unit tests would then drag
  in `server-only` imports); keeping the type re-export (crashes at runtime).
- **Downside accepted:** one more file, and client/type imports must point at the sibling module,
  not the action file.
- **Links:** `src/lib/orders/process-order.ts` (the convention) · `tests/contact/process-contact.test.ts`
---
### D-2.23-5 · 2026-07-28 · The form catches a rejected action call — a deliberate divergence from CheckoutForm
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot, after verification caught the stuck state live.
- **Decision:** `ContactForm` wraps the `sendContact` await in try/catch; a rejection (network
  drop, server crash — including the D-2.23-4 500 before its fix) renders the send-failed state
  pointing at the phone and the email. Without it the button is stranded on „Се испраќа…" forever.
  CheckoutForm, which this form is modelled on, does NOT catch action rejections.
- **Alternative rejected:** mirror CheckoutForm exactly (the brief's "same submit shape" read
  literally).
- **Downside accepted:** the same latent stuck-submit defect remains in CheckoutForm itself —
  out of scope here (`CheckoutForm.tsx` is on the byte-unchanged list), surfaced in the completion
  report §3 instead of quietly fixed.
- **Links:** `src/components/contact/ContactForm.tsx` · Phase 2.23 completion report §3
---
### D-2.23-6 · 2026-07-28 · Length caps are validated at submit, not typed-input-limited — CheckoutField ships unchanged
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Decision:** `CheckoutField` has no `maxLength` passthrough and the brief forbids modifying it.
  The client mirrors the server's caps (imported from `CONTACT_CAPS` — one source, no drift) in its
  submit-time validation and renders `Contact.errorTooLong` per field; the server remains the
  authority and rejects over-cap input outright.
- **Alternative rejected:** a local wrapper re-implementing the field to add `maxLength` (the
  brief's fallback) — a second field implementation to keep in sync forever, bought only to move
  the same feedback a few seconds earlier.
- **Downside accepted:** a visitor pasting a 5,000-character message learns it is too long at
  submit, not while typing.
- **Links:** Phase 2.23 brief (Task 3, scope note) · `src/lib/contact/process-contact.ts`
---
### D-2.23-7 · 2026-07-28 · Verification maneuvers: temporary axe route, transition-freeze reads, programmatic focus-visible
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot — the `D-2.21-7`/`D-2.22-5` lineage.
- **Decision:** (a) axe-core ran IN-BROWSER on `/kontakt` + `/en/contact` (zero violations of any
  impact) by serving `node_modules/axe-core/axe.min.js` as `public/__axe-temp.js` for the duration
  of the check — file deleted before anything was staged, `git status` clean. (b) The permanently
  hidden preview pane freezes CSS transitions at their start value, so computed-style colour reads
  (error border, status text) were taken with the element's transition disabled for the read and
  restored after — the frozen read had shown the pre-error border colour and was discarded as a
  measurement artifact, not a defect. (c) The pane does not traverse focus on synthesized Tab, so
  the keyboard walk was proven as: every control tabbable + visible + zero clipping ancestors, the
  global `:focus-visible { outline: 2px solid var(--color-focus-ring) }` rule present, programmatic
  focus confirmed matching `:focus-visible` per element class (field → 2px mustard border, button →
  the ground-offset `#F2C55A` box-shadow ring, rail link → the 2px `#F2C55A` outline at 2px offset).
- **Alternative rejected:** skipping axe (the brief requires zero serious/critical), or claiming a
  real Tab walk the pane cannot perform.
- **Downside accepted:** keyboard evidence is per-element simulation, not a hand on a keyboard; the
  real-device read goes on the owed register (row #55).
- **Links:** `D-2.21-7` · `D-2.22-5` · Phase 2.23 completion report §5

---

### D-2.24-1 · 2026-07-28 · A local outline Instagram glyph replaces the `@` mark on both social rows
- **Status:** Accepted
- **Decided by:** **Lazar (owner)** — he asked for a real Instagram logo on 2026-07-28. The glyph's
  *form* (outline recreation vs. Meta's official asset) is Claude Code's call, on the spot.
- **Context:** `D-2.07-2` put the Lucide `AtSign` (`@`) mark on the site's two Instagram links —
  the footer `СЛЕДИ`/FOLLOW column and the Contact rail — because `lucide-react@^1.24.0` **dropped
  its brand icons** (no `Instagram` export; the import fails the build). At a glance both rows read
  as "an email address," not "our Instagram." `D-2.07-2` listed exactly this fix as its rejected
  alternative **(a) vendor a custom Instagram SVG**. That alternative is now the owner's
  instruction — a visual-brand call, his to make, and the one register #17 was holding open.
- **Decision:** Ship `src/components/system/InstagramIcon.tsx` — a local, server-safe presentational
  component with the same call shape as a Lucide icon (`className`, `strokeWidth`, `aria-hidden`
  spread through `SVGProps<SVGSVGElement>`), so both call sites change **by name only**. Three
  children on the same 24px grid as the rest of the icon set: the rounded-square camera body, the
  lens circle, the flash dot. `stroke="currentColor"` + `fill="none"`, so it inherits the parent's
  colour token exactly as `Mail`/`Phone` do; **no colour value is written in the file**. The icon
  stays `aria-hidden` on both surfaces — the visible `@trajanovv2026` handle remains the link's
  accessible name. **`lucide-react` is not moved, and no dependency is added** — the whole point of
  a local component is that the pin stays pinned.
- **Alternatives considered:** **(a) Meta's official solid / gradient Instagram mark** — rejected on
  three counts: the site's icon set is a 1.75-weight line set on a 24px grid and a filled brand asset
  would be the only solid icon on the page; a gradient or solid asset **cannot inherit a colour
  token**, so it would break the one rule that keeps `Mail`/`Phone`/Instagram the same colour; and an
  outline recreation puts materially less brand trade dress into a **public repo** (`D-0-1`) than
  shipping the official asset would. **(b) Keep `AtSign`** — rejected: it is what the owner asked to
  change. **(c) Downgrade `lucide-react` to a version that still ships brand icons** — rejected for
  the same reason `D-2.07-2` rejected it: a dependency change to obtain a deprecated glyph.
- **Downside accepted:** What ships is a **recreated Instagram-style outline mark, not Meta's
  official brand asset** — it is a lookalike drawn to the house grid, and Meta's brand guidelines
  ask for the official asset unaltered. It is used for one purpose only: linking to **the brand's own
  Instagram account** (`facts.md` §6 — the only social account we have). The `D-2.07-2` concern about
  trade dress in a public repo is reduced, not eliminated. Whether the mark reads as Instagram on a
  real screen is Lazar's eyeball call — new register row **#58**.
- **Links:** `src/components/system/InstagramIcon.tsx` · `src/components/layout/SiteFooter.tsx` ·
  `src/app/[locale]/contact/page.tsx` · `D-2.07-2` (superseded) · `D-0-1` · `facts.md` §6 ·
  `src/lib/social.ts` (unchanged) · register #17 (narrowed) / #58 (new)

---

### D-2.24-2 · 2026-07-28 · Row-height parity was proven against `main` by a temporary checkout — which clobbered uncommitted work
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot — the `D-2.21-7` / `D-2.23-7` verification-maneuver lineage.
- **Decision:** "The row height is unchanged" is a claim about **two** builds, so both were measured.
  With the branch measured, `git checkout main -- src/components/layout/SiteFooter.tsx
  'src/app/[locale]/contact/page.tsx'` put `main`'s two call sites in the working tree, the dev
  server reloaded, and the same probe ran again. Baseline (`AtSign`, children `circle,path`) and
  branch (`InstagramIcon`, children `rect,path,line`) agree **exactly**: footer social row 33.59px at
  both 375 and 1280; rail Instagram row 110.5px at 375 and 91px at 1280; icon boxes 16×16 / 20×20;
  computed `stroke: rgb(171, 167, 158)` on all three icons in both builds.
- **Two things went wrong and are on the record rather than quietly fixed.** (a) **The restore step
  `git checkout HEAD -- …` silently reverted the phase's own edits** — nothing had been committed
  yet, so `HEAD` was still `main`. The two call sites were re-applied by hand and the final
  `git diff main` re-read line by line to confirm `aria-hidden`, `strokeWidth={1.75}` and both
  classNames survive as **unchanged context lines** (the strongest available proof they are
  byte-identical). The correct order is commit first, then measure the baseline. (b) The pane's
  next-intl `NEXT_LOCALE` cookie made `/kontakt` 307 to `/en/contact` after an EN visit, which
  briefly produced an EN measurement labelled MK; caught by asserting `document.documentElement.lang`
  in every probe, and fixed by setting the cookie back to `mk`. **Pre-existing middleware behaviour,
  not a defect of this phase** — but any future phase measuring both locales in one pane will hit it.
- **Alternative rejected:** asserting parity from the source alone ("both are 24-viewBox SVGs at the
  same `h-4 w-4`, so nothing can move") — true by inspection and still an unmeasured claim, which is
  exactly the class of claim this project's DoD asks to be measured.
- **Downside accepted:** the maneuver cost a re-apply of two files and one discarded measurement; the
  evidence is a same-machine, same-dev-server comparison, not a production one — the live read is
  register row **#58**.
- **Links:** `D-2.21-7` · `D-2.23-7` · Phase 2.24 completion report §3/§5

---

### D-2.24-3 · 2026-07-28 · A Status-block entry was added to `current-state.md`, which the brief did not enumerate
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Context:** The brief's Task 5 lists exactly four `current-state.md` edits — narrow owed #17, add
  the new owed row, update `Last updated`/`By`, rewrite line 1 unchanged — and does **not** mention
  the Status block. Taken literally, the file would carry a `Last updated: … (Phase 2.24)` stamp with
  **no record anywhere in it that a Phase 2.24 exists**, and the next orchestrator reading the file
  before writing the next brief would not know the `@` had been replaced.
- **Decision:** Add one compact Status entry above the 2.23 block, in the file's established shape
  (what shipped, what was measured, gates, owed rows, decisions), explicitly stamped **out-of-band /
  `NEXT:` byte-unchanged** so it cannot be mistaken for critical-path movement.
- **Alternative rejected:** execute Task 5 to the letter and leave the Status block untouched —
  rejected because `CLAUDE.md`'s state duty is "update `current-state.md`", the file bills itself as
  "the single source of truth for project status," and every prior phase records itself there. A
  brief's edit list being non-exhaustive is not a licence to leave the truth file wrong.
- **Downside accepted:** an out-of-band one-commit fix now occupies a paragraph in a Status section
  already long enough to be unwieldy, and this is a deviation from the brief's literal Task 5 — which
  is why it is logged here rather than done silently.
- **Links:** `CLAUDE.md` (state duties) · `src/_project-state/current-state.md` · Phase 2.24 brief Task 5

---

### D-2.25-1 · 2026-07-29 · The brand type scale is registered with tailwind-merge, so `cn()` stops deleting font sizes
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot — the root fix that `D-Y.05-9/10` deferred out of that
  phase's file scope, and that three shipped source comments name by file and function.
- **Context — this was a live rendering bug, not a tidiness item.** `tailwind-merge` cannot read our
  CSS. Its default `text-color` class group matches any `text-<word>` it does not already know as a
  font size, so **every one of the seven brand size tokens was filed as a COLOUR**: `text-countdown`
  and `text-foreground` shared one conflict group, and inside `cn()` the later class silently deleted
  the earlier one. Proven empirically against the installed `tailwind-merge@3.6.0` before any file was
  edited — `twMerge('text-countdown text-foreground')` returns `'text-foreground'`, and
  `twMerge('font-display text-small … text-muted-foreground hover:text-foreground')` returns the string
  with `text-small` **gone**. Measured in a live browser on `main`: the `/styleguide` countdown digits
  computed to **16px**, the header nav to **16px**, the language switch to **16px**. The countdown has
  rendered at the body default since Phase 1.04, on `main` and in production.
- **Decision:** `src/lib/utils.ts` builds `cn()` from `extendTailwindMerge`, registering
  `countdown, h1, h2, body, small, price, eyebrow` under the **`font-size`** class group. A size and a
  colour are different CSS properties and now stop colliding; two sizes (`text-h1 text-h2`) still
  resolve last-wins, which is correct. Verified after the change on the same pages: `/styleguide`
  countdown **16px → 88px**, nav **16px → 13px**, language switch **16px → 13px**.
- **Alternative rejected:** keep spreading the per-call-site workaround — write every class string that
  contains a brand size as a plain concatenation instead of `cn()`. That is what 2.15, 2.21 and Y.05
  each did in turn, and it is why three files carry hand-written notes explaining the same bug. It
  scales as a permanent tax on every future component, it silently fails the moment somebody uses
  `cn()` without reading the note, and it had already let the loudest object on the site render at
  16px for twenty-one phases without anyone noticing.
- **Also rejected:** passing the whole Tailwind theme to `extendTailwindMerge` via its `theme` option.
  It would cover future tokens automatically, but it means restating the colour, spacing, radius and
  motion scales in TypeScript as a second source of truth for values `brand.md` already owns — the
  exact duplication `CLAUDE.md`'s "tokens come from `brand.md` and nowhere else" exists to prevent.
- **Downside accepted:** the seven-name list in `src/lib/utils.ts` is a **manual mirror** of the
  `--text-*` tokens in `globals.css` `@theme inline`. Adding an eighth type token to the brand scale
  without adding it here reintroduces the identical silent-strip bug for that token alone, with no
  build error and no test failure to catch it. The list carries a KEEP IN SYNC comment saying so; that
  is a comment, not an enforcement mechanism.
- **Second downside accepted:** the fix **changes rendered output on pages nobody asked to change**.
  Every `cn()` string where a brand size preceded a colour had been rendering at the inherited 16px and
  now snaps to its token — the drop eyebrow (16px → 12px), the showcase caption (16px → 13px), and the
  checkout and contact form error lines (16px → 13px). All four are what the author wrote and what
  `brand.md` §4 prescribes, so they are treated as restorations, not regressions. **The form error
  lines dropping to 13px is flagged for `/impeccable harden`** rather than pre-empted here.
- **Links:** `src/lib/utils.ts` · `src/app/globals.css` (`@theme inline`) · `brand.md` §4 ·
  `D-Y.05-9` · `D-Y.05-10` · `D-2.25-2` · `D-2.25-3` · `CLAUDE.md` (tokens)

---

### D-2.25-2 · 2026-07-29 · The countdown's size moves onto the component root and the digit spans inherit it
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot — a regression that `D-2.25-1` would otherwise have caused.
- **Context.** `D-Y.05-9/10` worked around the strip by putting `text-h1 md:text-countdown` on a
  wrapper at the Home call site and letting the digit spans inherit it, because their own
  `text-countdown` was being deleted. `D-2.25-1` stops deleting it — which means the spans' own
  `text-countdown` would come back and **override the wrapper**, reinstating the exact clip Y.05
  measured: at 390px, four 2ch cells at 13vw plus colons and gaps measure ~402px, wider than the
  viewport. The token was born unfittable on a phone; the 16px bug is the only reason nobody ever saw
  it clip. Fixing the merge without moving the size would have shipped a horizontal overflow on the
  Home hero for every phone visitor.
- **Decision:** the size is declared **once, on the `Countdown` root** —
  `font-display text-h1 md:text-countdown …` — and the digit and colon spans declare no size at all
  and inherit. The root is the only place that knows the row is responsive. The Home call site's
  wrapper `className` is therefore deleted as redundant. Measured after the change: **390px → 36px
  digits, row 306px wide, `documentElement.scrollWidth` 390 (no overflow); 768px → 88px digits, row
  669px (fits); 1280px → 88px.**
- **Alternative rejected:** leave `text-countdown` on the spans and keep the responsive step at the
  call site. Rejected because a caller would then have to know that the component's own spans will
  overrule whatever size it passes — the failure mode is invisible in the JSX and only shows up as a
  clipped row on a phone.
- **Also rejected:** widen the token, or make `--text-countdown` itself fit 390px. That edits
  `brand.md` §4 to route around a layout problem in one component, and `brand.md` is owner territory.
- **Downside accepted:** the countdown is now **smaller than its own brand token below `md:`**, so the
  "largest type on the site" claim in `brand.md` §4 holds only from 768px up. `/styleguide` also
  changes: its `<Countdown offsetMs={40_000} />` passes no `className`, so it inherited the bug and
  rendered at 16px — it now renders at the real token, which is a **visible change to the design-system
  reference page** that Lazar has not seen. Register row added.
- **Links:** `src/components/drop/Countdown.tsx` · `src/components/home/HomeExperience.tsx` ·
  `src/app/[locale]/styleguide/page.tsx` · `D-Y.05-9` · `D-Y.05-10` · `D-2.25-1` · `brand.md` §4

---

### D-2.25-3 · 2026-07-29 · The three "do not use `cn()`" workarounds are retired in the same commit that removes their reason
- **Status:** Accepted
- **Decided by:** Claude Code, on the spot.
- **Decision:** `HomeExperience.tsx`, `HomeShowcase.tsx` and `SiteHeader.tsx` each carried a comment
  instructing future authors to avoid `cn()` for class strings containing a brand size. All three are
  rewritten to describe what is now true and to name `D-2.25-1`; `SiteHeader`'s `overlayRow` returns
  from hand-concatenated strings to `cn()`. The overlay rows were re-measured open, at 390px: **24px
  `text-h2`, 44px row height, 2px left border, `rgb(171,167,158)`** — identical to before, and the
  emitted class string is unchanged.
- **Alternative rejected:** fix `cn()` and leave the comments. A comment that tells the next author to
  work around a bug that no longer exists is worse than no comment: it would have propagated the
  workaround into new components indefinitely, which is exactly how this bug survived twenty-one
  phases.
- **Downside accepted:** this widens the diff into three files that the P0 item did not name, and
  `SiteHeader.overlayRow` is a behavioural no-op whose only justification is consistency — a reviewer
  must read it as such rather than looking for a rendered change.
- **Links:** `src/components/home/HomeExperience.tsx` · `src/components/home/HomeShowcase.tsx` ·
  `src/components/layout/SiteHeader.tsx` · `D-2.25-1`

---

### D-2.25-4 · 2026-07-29 · `text-sm` → `text-small` only; the other off-scale sizes are reported, not codemodded
- **Status:** Accepted
- **Decided by:** **Petar**, asked and answered before any file was edited (the P0 brief said
  `text-sm→text-small`; the codebase also carries `text-xs`, `text-base`, `text-lg` and `text-3xl`,
  none of which `brand.md` §4 sanctions).
- **Decision:** codemod **`text-sm` → `text-small` only** — 18 call sites across 9 files, `0.875rem`
  → `0.8125rem`. Zero stock `text-sm` remains in any rendered route (verified against the served HTML
  of `/`, `/?preview=live`, `/?preview=ended`, `/catalog`, `/cart`, `/checkout`, `/contact`, `/about`,
  `/styleguide`). The remaining off-scale sizes — `text-xs` ×6, `text-base` ×4, `text-lg` ×2,
  `text-3xl` ×1 — are carried to `/impeccable polish` and the closing `/impeccable audit` as an
  inventory item, with the owner deciding there.
- **Alternative rejected:** migrate the whole file tree onto `brand.md` §4 in this pass
  (`text-xs`→`text-eyebrow`, `text-base`→`text-body`, `text-lg`/`text-3xl` onto the nearest token).
  It is where the codebase should end up and `CLAUDE.md` forbids hardcoded sizes, but `text-lg` and
  `text-3xl` have **no clean brand equivalent**, so the migration cannot be finished mechanically —
  and doing the easy two-thirds of it inside a P0 bug fix would change more pixels than the item
  promised, on pages the fix has no reason to touch.
- **Downside accepted:** the codebase **stays inconsistent on purpose** until `/polish` closes it, and
  `DropBanner.tsx:28` now reads `text-small … sm:text-base` — one brand token and one stock token in a
  single responsive pair, which is the least defensible line in the diff. It is left that way rather
  than quietly widened past the agreed scope.
- **Links:** `brand.md` §4 · `CLAUDE.md` (tokens) · `src/components/drop/DropBanner.tsx` ·
  `D-2.25-1` · Phase 2.25 completion report

---

### D-2.25-5 · 2026-07-29 · Persistent `role="alert"` per field + focus to the first invalid field, in DOM order
- **Status:** Accepted
- **Decided by:** Code (Phase 2.25 P1 `/impeccable harden`), from the P1 brief §1a.
- **Decision:** three changes to the shared form path. (1) `CheckoutField` passes `required` through
  the **textarea** branch — the input branch already had it, so `ContactForm`'s message field has been
  rendering a `*` in its label with **no required semantics at all** (measured on the P0 baseline:
  `textarea.required === false`). (2) The error `<p>` becomes a **persistent** `role="alert"` region:
  always in the DOM, `sr-only` and empty until there is something to say, with `aria-describedby`
  wired unconditionally. A live region inserted in the same tick as its first message is not reliably
  announced, which is why the old conditionally-mounted `<p>` announced **nothing** on a failed
  submit (baseline: `document.querySelectorAll('[role="alert"]').length === 0` before *and* after a
  failed submit). `sr-only` is `position: absolute`, so while empty it contributes no box — field
  wrapper measured **71.5px on both sides** with no error and **97px on both sides** with one.
  (3) Both forms move focus to the first invalid field on a failed submit, in **DOM order** rather
  than error-map insertion order, via the pure, unit-tested `firstInvalidField()`
  (`src/lib/forms/first-invalid.ts`, 7 tests). Baseline: focus stayed on the submit button
  (`document.activeElement === submitButton`). After: focus lands on `#name` / `#contact-name` with
  `aria-invalid="true"`. Checkout also focuses `phone` when the **server** rejects a phone the client
  accepted.
- **Alternative rejected:** one form-level summary region ("3 fields need attention") instead of a
  region per field — the GOV.UK error-summary pattern. It announces once instead of four times and is
  quieter, but it needs a **new user-facing string in MK and EN**, which means new MK review debt on a
  phase that otherwise adds none, and it does not help the case that actually motivated this — the
  server-side phone rejection, which is a single field changing after the page has settled.
- **Downside accepted:** on a submit that fails four fields at once, a screen reader now gets four
  assertive announcements **and** a focus move that re-reads the first field. That is redundant, and
  it is louder than the error-summary pattern would be. The alternative is recorded above so the next
  pass can take it if a real screen-reader session says the burst is worse than the silence was.
- **Links:** `src/components/checkout/CheckoutField.tsx` · `src/components/checkout/CheckoutForm.tsx` ·
  `src/components/contact/ContactForm.tsx` · `src/lib/forms/first-invalid.ts` ·
  `tests/forms/first-invalid.test.ts` · P1 brief §1a

---

### D-2.25-6 · 2026-07-29 · Form error text stays at 13px (`text-small`)
- **Status:** Accepted
- **Decided by:** Code, on the P1 brief's explicit instruction to "decide deliberately".
- **Decision:** the checkout and contact error lines **stay `text-small`** (0.8125rem = 13px,
  `brand.md` §4). P0 restored them from an accidental 16px to their `brand.md`-correct size, and this
  phase leaves that alone. What the error needed was not to be bigger — it was to be **announced**
  and to **receive focus**, which is what `D-2.25-5` does. Measured in place: 13px, line-height
  19.5px, `--color-error` `rgb(240, 133, 122)` on `--color-ground`.
- **Alternative rejected:** bump the error line to `text-body` (16px). 13px is small for an error on a
  phone and 16px would read louder. Rejected because the size a token renders at is a `brand.md`
  question, not a local override — `brand.md` is owner territory, and changing `--text-small` would
  move every one of the ~40 call sites the P0 codemod just landed on, not only the errors.
- **Downside accepted:** the error line is the same size as the field's own label and smaller than the
  16px input text above it, so it is the quietest thing in a field that has just failed. If Lazar
  wants it louder, the honest fix is a new `brand.md` §4 token for it, not a one-off class here — that
  is a conversation this phase is deliberately not having on its own.
- **Links:** `brand.md` §4 · `src/components/checkout/CheckoutField.tsx` · `D-2.25-5` · P1 brief §1a

---

### D-2.25-7 · 2026-07-29 · The i18n client provider ships an allow-list of namespaces, guarded by a test
- **Status:** Accepted
- **Decided by:** Code (Phase 2.25 P1 `/impeccable optimize`), from the P1 brief §1b.
- **Decision:** `NextIntlClientProvider` in `src/app/[locale]/layout.tsx` is handed
  `pickClientMessages(await getMessages({locale}))` instead of the whole catalog. The allow-list —
  14 of 23 namespaces — lives in `src/i18n/client-namespaces.ts` and is exactly the set reachable
  from a `'use client'` boundary, **including modules that carry no directive of their own** and
  become client code when a client component imports them (`DropBanner`, `StockBadge`, `ProductCard`,
  `ShippingNotice`, `product-images.ts`). Measured on the MK build, both sides, same dev server:
  **16,308 → 6,241 bytes** of serialized messages in the HTML of `/`, `/kontakt`, `/uslovi` and
  `/katalog` alike (**−61.7%**), with `Footer Faq About Terms Privacy ShippingReturns Catalog
  Styleguide Meta` withheld. The Terms page title was provably sitting in the Contact page's HTML
  before. All 28 routes (15 MK + 13 EN) return 200 with **zero** `MISSING_MESSAGE` / `IntlError`.
- **Alternative rejected:** a **deny-list** of the big server-only catalogs instead of an allow-list.
  It is more forgiving — a new namespace defaults to shipping and nothing breaks — but that is exactly
  its problem: the default is to keep sending junk, and nobody notices. Also rejected: moving the
  provider per-route, which would scope tighter but multiplies the number of places that can be wrong.
- **Downside accepted:** a namespace a client component needs but that is missing from the list does
  **not** fail the build — it fails at RUNTIME, in the customer's browser, as a `MISSING_MESSAGE`.
  That is a worse failure mode than before, and the only thing standing between the project and it is
  `tests/i18n/client-messages.test.ts`, which re-derives the required set by walking the import graph
  out from every client boundary. If that test is ever deleted or weakened, this optimisation becomes
  a liability.
- **Links:** `src/i18n/client-namespaces.ts` · `src/app/[locale]/layout.tsx` ·
  `tests/i18n/client-messages.test.ts` · P1 brief §1b

---

### D-2.25-8 · 2026-07-29 · `HomeExperience` returns to a Server Component; the T-0 flag moves to a client island
- **Status:** Accepted
- **Decided by:** Code (Phase 2.25 P1 `/impeccable optimize`), from the P1 brief §1b.
- **Decision:** `HomeExperience.tsx` loses `'use client'`. The three things that needed the browser —
  `useState(opening)`, the `setInterval(router.refresh)` effect, and the `onComplete` handler — move
  into `src/components/home/CountdownOpening.tsx`: a React context provider plus `CountdownTicker`
  and `OpeningSwitch`. Everything visual (the hero photograph, the scrim, the tagline, both CTAs, all
  three drop banners, the whole live-drop product grid and the about link) is server-rendered and
  handed to those components as `children` / slots. Context providers and fragments emit no DOM, so
  the `<section>`'s direct children — and therefore the `.reveal-group > *:nth-child()` stagger — are
  unchanged. Measured, both sides, client component modules referenced in the served HTML:
  **ended** `HomeExperience + HomeShowcase + SiteHeader` → `HomeShowcase + SiteHeader`;
  **live** `HomeExperience + HomeShowcase + SiteHeader` → `HomeShowcase + SiteHeader + SpotlightCard`;
  **countdown** `HomeExperience + HomeShowcase + SiteHeader` → `HomeShowcase + SiteHeader +
  CountdownOpening`. Drop state stays server-computed and `force-dynamic` is untouched (`D-1.04-9`);
  the T-0 handover was exercised end to end with a temporary `target={Date.now() + 6000}` maneuver
  (reverted, diff-proven empty): the "Opening…" status replaced the tagline and both CTAs, the about
  link disappeared, the hero photograph survived, and `router.refresh()` kept firing on its interval.
- **Alternative rejected:** leave the countdown branch as one client island containing `<Hero>`.
  It is a much smaller diff — one component instead of four exports and a context — but it keeps the
  photograph, the scrim and the CTAs in the client bundle for the state the site sits in for most of
  its life, which is the state the brief was pointing at.
- **Downside accepted:** the T-0 swap is now coordinated through a **React context** rather than one
  local `useState`, so three components have to stay in agreement about it, and a slot rendered
  outside the provider silently shows its idle content instead of throwing. That failure mode is
  chosen on purpose (the front door must not crash), but it means a mis-wired slot fails **quietly**.
- **Links:** `src/components/home/HomeExperience.tsx` · `src/components/home/CountdownOpening.tsx` ·
  `src/app/[locale]/page.tsx` · `D-1.04-9` · `D-2.16-2` · P1 brief §1b

---

### D-2.25-9 · 2026-07-29 · `.tap-44` raises the hit area where the visual box must not move; the footer grows its real boxes
- **Status:** Accepted
- **Decided by:** Code (Phase 2.25 P1 `/impeccable adapt`), from the P1 brief §1c.
- **Decision:** a new top-level `.tap-44` utility in `globals.css` puts a transparent, centred
  `::after` at `max(100%, 44px)` in each axis on the element, so a target grows its **hit area**
  without moving a rendered pixel. Applied to the header nav links (whose `border-b-2` active
  indicator would otherwise drop 10px down the bar), the MK·EN switch (a wider real box would push the
  `·` away from the letters), the wordmark, the build credit, the product page's back link and the
  Home about link. The **footer grows its real boxes instead** (`min-h-11`, plus `min-w-11` for the
  short EN labels "About" 36.7px and "Terms" 38.3px), because its bottom row wraps and a 44px
  pseudo-element over a 27.5px row would overlap the wrapped rows above and below it. The cart's
  steppers (32→44px) and remove button (a bare 16px glyph → a real 44×44 box) also grow for real:
  they carry a visible border, so a hit area that did not match the box would be a lie about where to
  press. Measured at 1280px MK, both sides: header bar **70px → 70px**, nav boxes **24px → 24px** at
  identical x, active underline bottom **47 → 47**, MK/EN **24×24 → 24×24** at identical x — the
  header is pixel-identical, with hit areas now 44px. `elementFromPoint` 9px above a nav link's box
  resolves to the link; 15px above does not. MK·EN hit areas are **0.6px apart** and do not overlap.
- **Alternative rejected:** make every target a real 44px box. Simpler, one mechanism, no pseudo-element
  to reason about — and it would have moved the nav's active underline, widened the MK·EN group and
  changed a header Lazar signed off in 2.13/2.18.
- **Downside accepted:** the site now has **two** mechanisms for the same requirement, and the
  pseudo-element one is invisible — it captures pointer events over whatever it covers, so anyone
  adding `.tap-44` to a dense or wrapping list will create targets that steal each other's taps with
  nothing on screen to show it. The rule carries a "WATCH THE NEIGHBOURS" comment and the measured
  clearances, which is a comment, not a guard.
- **Links:** `src/app/globals.css` · `src/components/layout/SiteHeader.tsx` ·
  `src/components/layout/LanguageSwitch.tsx` · `src/components/layout/SiteFooter.tsx` ·
  `src/components/cart/CartView.tsx` · P1 brief §1c

---

### D-2.25-10 · 2026-07-29 · The product photo grid collapses to one column below `sm:`, and the buy path pays for it
- **Status:** Accepted
- **Decided by:** **Petar**, asked with the measured cost in hand before the edit was made.
- **Decision:** `src/app/[locale]/catalog/[slug]/page.tsx` renders `grid-cols-1 sm:grid-cols-2`. At
  320px the two 4:5 slots measured **138×173 each** — too small to judge a garment by, which is the
  only thing the page is for; one column makes each **288×360**.
- **Alternative rejected:** a horizontal scroll-snap strip below `sm:` — photo ~250px wide with the
  next peeking, strip only ~312px tall, price landing at ~y=660 instead of y=1107. It is better on
  both axes, and it was rejected because it needs a new MK+EN `aria-label` (new MK review debt) and
  `tabindex="0"` for keyboard scrollability, which is more surface than an `/adapt` pass should add.
- **Downside accepted:** measured at 320px, the price moves from **y=567 to y=1107** — the buy path
  now sits below two screens of scroll, and the second thing the customer scrolls past is a **hatched
  placeholder** (register #2), not a photograph. This is the single most questionable trade in the
  phase. It reverses by deleting one `sm:`.
- **Links:** `src/app/[locale]/catalog/[slug]/page.tsx` · placeholder register #2 · P1 brief §1c

---

### D-2.25-11 · 2026-07-29 · The `/styleguide` countdown demo card scrolls; the countdown is not shrunk
- **Status:** Accepted
- **Decided by:** Code (Phase 2.25 P1 `/impeccable adapt`), from the P1 brief §1c.
- **Decision:** the countdown row has a hard floor — `--text-h1` bottoms out at its `2.25rem` minimum
  below a 514px viewport, so the row measures **306.4px at every viewport ≤514px**. On Home that fits
  (the hero is full-bleed, 0→320 at the narrowest phone). On `/styleguide` the demo card's inner box
  is 240px and the row was escaping the card by **9.2px on each side** (measured on the P0 baseline:
  card 16→304, row 6.8→313.2, card `overflow-x: visible`). The **card** now scrolls
  (`overflow-x-auto` with an inner `mx-auto w-max`), so the row sits inside the card's padding at
  40→346.4 and the card scrolls to reveal the rest; page `scrollWidth` stays 320.
- **Alternative rejected:** step the countdown down to `text-h2` below `sm:` so it fits the card. That
  would shrink the **real Home countdown** — the loudest object on the site, and the thing P0 just
  spent a phase restoring — on every phone, to fix a dev-only page.
- **Downside accepted:** on a ≤514px viewport the `/styleguide` countdown demo has to be scrolled
  horizontally to be seen whole, so the design-system reference page no longer shows that component
  entire at phone widths. `mx-auto w-max` is used rather than `justify-center` because
  `justify-content: center` in a scroll container puts the left overflow permanently out of reach.
- **Links:** `src/app/[locale]/styleguide/page.tsx` · `src/components/drop/Countdown.tsx` ·
  `D-Y.05-10` · `D-2.25-2` · P1 brief §1c

---

### D-2.25-12 · 2026-07-29 · The cart row wraps, and `min-w-0` on the grid item is what actually fixes it
- **Status:** Accepted
- **Decided by:** Code (Phase 2.25 P1 `/impeccable adapt`), after the 44px controls surfaced it.
- **Decision:** widening the cart controls to 44px pushed the row's min-content to 322px inside a
  288px track and the viewport was being forced to 338px. Measuring the P0 baseline showed the defect
  was **already there**: the row was **298px in a 288px track**, escaping by 10px, before this phase
  touched it. Root cause is `min-width: auto` on the `<ul>`, which is a **grid item** — it refused to
  size below its own content and held the track open. Fixed with `min-w-0` on the `<ul>`, `min-w-0` +
  `break-words` on the details column, and `flex-wrap` + `grow basis-40` on the row so the controls
  drop to their own right-aligned line when they cannot sit beside the details. Measured at 320px
  after: row 288 in a 288 track, details column **68 → 208px**, **zero** elements with
  `scrollWidth > clientWidth` in `<main>`, `document.scrollWidth` 320. At 768px the row does not wrap
  and the shipped vertical control stack is unchanged.
- **Alternative rejected:** rebuild the row as a two-row CSS grid with explicit line placement. It is
  more declarative about what goes where, and it hardcodes the two-row shape at a viewport breakpoint
  rather than letting the content decide — `flex-wrap` flips at the width where the content actually
  stops fitting, which is what `/adapt` asks for.
- **Downside accepted:** the row is **48px taller at 320px** (125 → 172px) because the controls take
  their own line, and the flip point is content-driven, so it is not visible in the class list — a
  future change to the product name, the price pill or the thumbnail moves it. The price
  `[PLACEHOLDER: …]` pill's 102px min-content is what set the floor; when real prices land, the
  headroom changes again.
- **Links:** `src/components/cart/CartView.tsx` · placeholder register #4/#7 · `D-2.25-9`

---

### D-2.25-13 · 2026-07-29 · `filter: blur()` leaves the reveal keyframe; `--motion-reveal-blur` stays in both files
- **Status:** Accepted
- **Decided by:** Code for the keyframe (P1 brief §1d); **Petar** for the token's fate, asked before
  the edit.
- **Decision:** `@keyframes trajanov-reveal` animates **opacity and transform only**.
  `filter: blur()` was the one property of the three that forces an offscreen buffer per element per
  frame for the whole 760ms entrance, and it ran on the elements least able to afford it — the hero's
  own child is the full-bleed photograph, measured **1152×648 = 0.75 megapixels** at 1280px, and the
  live-drop call site puts it on every product card in the grid at once. The entrance keeps its
  duration, easing and stagger. **`--motion-reveal-blur` is deliberately left in place, unused, in
  both `globals.css` `:root` and `brand.md` §6.**
- **Alternative rejected:** delete the token from `globals.css` and propose the matching `brand.md` §6
  row deletion in the completion report. That leaves the code clean — and it leaves `globals.css` and
  `brand.md` **disagreeing by one row** until the owner acts, in a file whose header says it MIRRORS
  brand.md. The owner chose the dead token over the drift.
- **Downside accepted:** a token that nothing reads now ships in both files, and the next reader
  cannot tell it is dead without grepping. Retiring it from both is written up as a proposal in the
  Phase 2.25 completion report. Separately: **no frame-rate number is claimed for this change and
  none was measured** — the verification pane this project uses is permanently hidden
  (`document.hidden === true`), so `requestAnimationFrame` never fires in it and a before/after FPS
  delta cannot be produced here (the `D-2.21-7` constraint). The case rests on the mechanism and the
  measured paint area, not on a local frame count.
- **Links:** `src/app/globals.css` · `brand.md` §6 · `D-2.16-3` · `D-2.21-7` · P1 brief §1d

---

### D-2.25-14 · 2026-07-29 · The blanket `prefers-reduced-motion` rule becomes a backstop; every animation states its own behaviour
- **Status:** Accepted
- **Decided by:** Code (Phase 2.25 P1 `/impeccable animate`), from the P1 brief §1d.
- **Decision:** the site-wide `animation-duration: 0.001ms !important` rule **stays**, but it is no
  longer the answer for any animation the project actually ships. It is relabelled in place as a
  backstop, and each keyframe animation now states its own reduced-motion behaviour:
  `trajanov-reveal` → `animation: none` (already there); `trajanov-wordmark-shine` → animation and
  gradient both removed (already there, `D-2.19-1`); `.animate-spin` and `.animate-ping` → **`animation:
  none`, new** — the Turnstile/BuyButton spinner becomes a static busy ring and the LIVE dot's halo
  goes static, which is what `brand.md` §6 asks for ("The live dot is static under reduced motion");
  `trajanov-showcase-progress` → never runs, because `HomeShowcase` kills autoplay through a JS
  `matchMedia` check (`D-2.21-3`). `scroll-behavior: auto !important` is added for the day someone
  sets `scroll-behavior: smooth`. The new rules are authored in a **second** `@media
  (prefers-reduced-motion: reduce)` block: a rule written inside the first block after the `*`
  selector is dropped before it reaches the compiled stylesheet, the same Tailwind v4 pipeline
  behaviour that keeps `.tap-44` out of `@layer base`. Both facts were verified by serving the built
  CSS and reading it; the compiler merges the two blocks back into one on the way out.
- **Alternative rejected:** replace the blanket's `animation-duration: 0.001ms` with `animation: none`
  outright. It is the honest reading of "reduced motion" and it would break any animation that relies
  on a `forwards`/`both` fill to reach its final state — the element would be stranded in its `from`
  keyframe, which is a worse bug than a flash and one nobody would see in review.
- **Downside accepted:** the enumerated list lives in a **comment**. Nothing enforces it, so the next
  animation added to this codebase will silently fall through to the backstop and get the
  "motion, but instant" treatment the block itself now argues against.
- **Links:** `src/app/globals.css` · `brand.md` §6 · `D-2.19-1` · `D-2.21-3` · `D-2.25-13` ·
  P1 brief §1d
