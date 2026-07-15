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
