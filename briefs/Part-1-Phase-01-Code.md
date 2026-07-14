# Part 1 · Phase 01 · Code — Scaffold

**Why this matters** — this creates the empty but correctly-wired project: the repo, the folder
structure, the toolchain, and the house-rule files. Every later phase builds on this exact
foundation instead of inventing its own, so getting it right once saves rework in all of them.

## Context

This is the first phase. Nothing is built yet. There is no prior completion report to read; the repo
is bare. Kickoff (Claude Chat) has already authored the planning documents — your job is to stand up
the project and commit those documents into it, not to re-author them.

**Read first** (all provided alongside this brief — Lazar places them in the project folder before
you start):

- **CLAUDE.md** — your standing rules for this repo. Read it in full before doing anything. It
  governs secrets, branches, state duties, and content truth.
- **00_stack-and-config.md** — the exact stack, the environment-variable names, and the portability
  rule. Read before installing any dependency.
- **file-map.md** — the reserved directory tree you are creating. Build to this exactly.
- **current-state.md** — the live status file and its `NEXT:` line.
- **Decisions.md** — why the project is shaped the way it is. D-0-1, D-0-2, and D-0-3 bind this phase
  directly.
- **facts.md, brand.md** — the two content/design source files. You are committing them; you are not
  reading facts out of them this phase.

**Environment:** macOS. Project path `/Users/petarjakimov/Projects/Trajanov-V2`. All commands in zsh
— never PowerShell. Repo is public at github.com/petarjakimov11012011-cell/Trajanov-V2 (D-0-1).

## Scope

**In scope:**

- A fresh Next.js (App Router) + TypeScript + Tailwind CSS project at the path above.
- shadcn/ui initialised (config only — generate no components this phase).
- These installed and their versions pinned: Motion, Lucide, next-intl.
- The full reserved directory tree from file-map.md, including empty folders (use `.gitkeep`).
- The `src/app/[locale]/` routing skeleton (mk default, en) with stub `src/messages/mk.json` and
  `en.json`, enough that the app builds and serves a placeholder home. Full string extraction,
  hreflang, and localised slugs are Phase 2.01 — not now.
- The eight provided canonical documents committed verbatim to their reserved paths (table below).
- `README.md` (short — points at the docs, contains no spec), `.env.example` (key names only), and a
  `.gitignore` that covers `.env*`.
- Git initialised, first commit on branch `phase-1.01-scaffold`, pushed, one PR opened to `main`.
- Post-install state updates: pin versions in 00_stack-and-config.md, replace the intended tree in
  file-map.md with the real one, update current-state.md.

**Out of scope — do NOT touch these this phase:**

- No Supabase, schema, or data layer (Phase 1.03).
- No drop engine, countdown, reservations, Turnstile, or rate limiting (Phase 1.04).
- No real pages or real content beyond a placeholder home. No copy from facts.md.
- No wiring of brand.md tokens into Tailwind — brand.md is an empty seed until Phase 1.02 fills it.
  Leave Tailwind on shadcn defaults.
- No GitHub Action, CodeRabbit, or any CI review workflow (D-0-3). Do not add one.
- No Vercel-specific service (no Vercel Postgres/Blob/KV) — portability rule in 00_stack-and-config.md.
- No payment SDK, no CMS.
- No deployment. No Vercel project this phase.

## The eight documents to commit verbatim

Lazar provides these files with the brief. Place each at the path shown and commit unchanged. Do not
rewrite, reformat, or "improve" them. If any file is missing, stop and tell Lazar — do not invent it.

| Provided file | Destination path in repo |
|---|---|
| CLAUDE.md | `CLAUDE.md` (root) |
| facts.md | `facts.md` (root) |
| brand.md | `brand.md` (root) |
| Decisions.md | `Decisions.md` (root) |
| current-state.md | `src/_project-state/current-state.md` |
| file-map.md | `src/_project-state/file-map.md` |
| 00_stack-and-config.md | `src/_project-state/00_stack-and-config.md` |
| _TEMPLATE.md (completion-report template) | `src/_project-state/completions/_TEMPLATE.md` |

## .env.example — names only, no values

The repo is public. No value ever goes in a file. Write exactly these seven names, blank:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ORDER_NOTIFICATION_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## Tasks (ordered)

1. Confirm Node and npm are present; note their versions for the change log.
2. Scaffold Next.js (App Router) + TypeScript + Tailwind at the project path.
3. Initialise shadcn/ui (config + `src/components/ui/` only; generate no components).
4. Install Motion, Lucide, and next-intl. Configure the minimal `src/app/[locale]/` skeleton (mk
   default, en at `/en/`) with stub `mk.json` / `en.json` so the build passes and a placeholder home
   renders.
5. Create the entire reserved tree from file-map.md, `.gitkeep` in every empty folder.
6. Commit the eight canonical documents verbatim to the paths in the table above.
7. Write README.md, .env.example (names only, as above), and confirm .gitignore covers `.env*`.
8. Prove the gitignore works: create a dummy `.env.local` containing a fake value, run `git status`,
   confirm the file is ignored/untracked and does not appear as staged, then delete the dummy.
   Capture the command output for the report.
9. Run `npm run build && npm run lint && npx tsc --noEmit` — all must pass with zero errors.
10. `git init`, first commit, branch `phase-1.01-scaffold`, push, open one PR to `main`. Nothing goes
    straight to main. Add no review Action.
11. Pin the exact installed versions into 00_stack-and-config.md (the Pinned column for the 1.01
    rows) and append Node/npm to its change log.
12. Replace the "Status / intended tree" section of file-map.md with the real on-disk tree.
13. Update current-state.md: set line 1 to `NEXT: 1.02 — Design system`, refresh Last updated / By,
    and move the scaffold into Built.
14. File the completion report from _TEMPLATE.md, surfacing any on-the-fly decision as `D-1.01-<n>`.

## Definition of Done

- `npm run build && npm run lint && npx tsc --noEmit` all pass, zero errors — output pasted in the
  report.
- `npm run dev` serves a placeholder home locally.
- The on-disk tree matches file-map.md exactly; any deviation is listed in the report.
- All eight canonical documents are committed at their reserved paths, content byte-identical to what
  Lazar provided.
- .env.example contains exactly the seven documented key names and no values.
- .gitignore covers `.env*`, proven by the dummy-.env.local test — git status output pasted in the
  report, dummy deleted.
- No secret, key, token, or real email address appears anywhere in the repo (grep is clean).
- No Vercel-specific service, no CMS, no payment SDK was added.
- No GitHub Action or CI review workflow was added (D-0-3).
- Installed versions pinned in 00_stack-and-config.md: Next.js, TypeScript, Tailwind, shadcn/ui,
  Motion, Lucide, next-intl, plus Node and npm in the change log.
- file-map.md shows the real on-disk tree, not the template.
- current-state.md line 1 is `NEXT: 1.02 — Design system`; Built and Last-updated sections are
  current.
- Branch `phase-1.01-scaffold` is pushed and one PR is open to main; nothing was pushed directly to
  main.
- Completion report filed, surfacing every on-the-fly decision (D-1.01-n) for the orchestrator to
  ratify.

## Repo conventions (restated — they bind every phase)

- One PR per phase, to main. Never push straight to main. One phase branch at a time.
- Public repo — never commit a secret, not even temporarily or in a comment or fixture (D-0-1,
  CLAUDE.md).
- Pin every dependency in 00_stack-and-config.md; a dependency not recorded there does not exist.
- zsh, macOS. Run `npm run build && npm run lint && npx tsc --noEmit` before opening the PR — a red
  build is not a PR.

## Outputs & where they go

- The scaffolded repository on branch `phase-1.01-scaffold`, PR open to main.
- Updated state files under `src/_project-state/`.
- Completion report → `src/_project-state/completions/Part-1-Phase-01-Completion.md`
