# CLAUDE.md — Trajanov-V2

## What this is

A bilingual (MK/EN) drop store for Trajanov, a Macedonian clothing brand. It sits browsable but
not buyable between drops; when a countdown hits zero, 3–5 products go live against real, limited
stock. Cash on delivery only — no card payments.

## Machine & shell

- Machine: **macOS**. Project path: `/Users/petarjakimov/Projects/Trajanov-V2`
- **All commands in zsh syntax.** Never PowerShell.
- Two operators (Lazar, Petar), one repo. See branch rules.

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm test`
- Lint + types: `npm run lint && npx tsc --noEmit`

Run `npm run build && npm run lint && npx tsc --noEmit` before every PR. A red build is not a PR.

## Secrets — the hard rule

**This repo is public (`D-0-1`). Never commit a secret. Not once, not "temporarily", not in a
comment, not in a test fixture, not in a `.env` file.**

- Supabase keys, Resend key, Vladimir's email → environment variables only, set in the Vercel and
  Supabase dashboards.
- `.env*` is gitignored. Keep it that way. `.env.example` holds key *names* only, never values.
- Never `console.log` a key, an order's phone number, or a customer address.
- A committed secret is compromised the moment it lands. **Rotate it — deleting the commit does
  not help.** Say so in the completion report immediately; do not quietly fix it.

## Branch & PR rules

- **One phase branch at a time.** Never cut a new branch while another phase branch is unmerged.
  Parallel branches have previously collided on decision IDs and state files and cost a full
  reconciliation phase.
- Branch name: `phase-X.YY-<slug>` (e.g. `phase-1.04-drop-engine`).
- PR to `main`. One PR per phase.
- **There is no GitHub review Action on this project (`D-0-3`, exception to house standard).**
  The other operator reviews the PR before merge. **For Phases 1.03 and 1.04 only:** a *fresh*
  Claude Code session — one that did not write the code — reviews the PR against the brief before
  merge. Do not review your own work and call it reviewed.

## Decisions

- Log every on-the-fly decision in `Decisions.md`, append-only, ID `D-<phase>-<n>` (e.g. `D-1.04-2`).
- Every entry names the **alternative rejected** and the **downside accepted**. No alternative and
  no downside means it is an assertion, not a decision.
- Reversals get a new entry; set the old entry's Status to `Superseded by <id>`. **Never edit or
  delete a past entry.**
- Surface every on-the-fly decision in the completion report. The orchestrator ratifies nothing
  silently.

## State duties (on closing every phase)

- Update `src/_project-state/current-state.md`, **including the `NEXT:` line on line 1.**
- Update the **owed-verification register** and the **placeholder register** in that file.
- Sync `src/_project-state/file-map.md` if files were added, moved, or deleted.
- Append to `src/_project-state/00_stack-and-config.md` if a dependency or config changed.
- File the completion report in `src/_project-state/completions/` using the template there.

## Content truth

- Every rendered factual claim must exist in `facts.md` marked **VERIFIED**. `facts.md` is the only
  legal source.
- **Nothing invented:** no testimonials, reviews, ratings, counts, awards, partners, team members,
  addresses, fabric claims, or social links that are not in `facts.md`.
- Missing fact → ship a visible `[PLACEHOLDER: what's needed]` **and** log it in the placeholder
  register. Never guess, never write plausible filler, never leave a placeholder unlogged.
- **AI-generated product imagery is prohibited (`D-0-6`).** Retouching real photos is fine.
- If a page needs a fact we do not have to look finished, **the page is wrong, not the facts** —
  say so in the completion report.

## Stock & orders — where the real risk is

- **Stock decrements atomically, server-side, in Postgres.** Never trust a client-side stock count;
  never read-then-write stock in application code. Two people must not be able to buy the last unit.
- Drop state (countdown / live / ended) is computed **on the server** from config. The browser is
  not the source of truth for whether a drop is open.
- **Cash on delivery means ordering is free, so abuse is free.** Turnstile, rate limit by IP and by
  phone, max 2 units per order, orders **reserve** stock rather than sell it (48h hold, then
  released). None of these are optional.
- Any change to stock or reservation logic requires the concurrent-order test to pass: 10
  simultaneous orders against 3 units → exactly 3 succeed, 7 cleanly rejected.

## UI & copy

- **No UI phase closes sight-unseen.** Render the affected pages and check them against the current
  design handover and `brand.md` before writing the completion report. If you cannot render them,
  list exact URLs in the report with a 5-item checklist for Lazar.
- Design tokens come from `brand.md` and nowhere else. Never hardcode a colour or a font size.
- Copy: punchy, present tense, direct address. **No fashion-magazine filler** — no "elevate your
  wardrobe", no "curated essentials", no "vibrant". Run a `humanizer` pass on user-facing copy.
- MK is the default language. Every user-facing string is translated; never ship an English string
  into the MK build.

## Read before working

- **Current phase brief:** `briefs/` — the matching `Part-X-Phase-YY-*.md`. Read it first.
- **Live state:** `src/_project-state/current-state.md` — read before touching anything.
- **Business facts:** `facts.md` (only source)
- **Design tokens:** `brand.md` (only source)
- **UI spec:** `docs/design-handovers/` (the current handover)
- **Stack & pinned versions:** `src/_project-state/00_stack-and-config.md` — read before adding any
  dependency.
- **Why the project is like this:** `Decisions.md`
