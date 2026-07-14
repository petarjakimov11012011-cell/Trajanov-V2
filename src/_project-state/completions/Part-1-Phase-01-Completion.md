# Completion report — Part 1 Phase 01: Scaffold

| | |
|---|---|
| **Phase** | 1.01 |
| **Name** | Scaffold |
| **Executor** | Claude Code |
| **Operator** | Lazar |
| **Date** | 2026-07-14 |
| **Branch** | `phase-1.01-scaffold` |
| **PR** | #1 |
| **Brief** | `briefs/Part-1-Phase-01-Code.md` |

---

## 1. What shipped

- A fresh **Next.js 16 (App Router) + TypeScript + Tailwind v4** project at the project path, building
  clean and serving a bilingual placeholder home.
- **next-intl** wired: MK is the default and serves at `/`; EN serves at `/en/`. `/mk` redirects to
  `/`; an English-preferring browser at `/` is redirected to `/en` (standard locale detection).
- **shadcn/ui** initialised — `components.json` + the `cn()` helper only. **No components generated.**
- **Motion, Lucide (`lucide-react`), next-intl** installed and version-pinned in
  `00_stack-and-config.md`.
- The **full reserved directory tree** from `file-map.md`, with `.gitkeep` in every otherwise-empty
  folder.
- The **eight canonical documents** committed verbatim to their reserved paths.
- `README.md` (signpost, no spec), `.env.example` (seven key **names**, no values), and a `.gitignore`
  that ignores `.env*` **and** un-ignores `.env.example` — proven with a dummy `.env.local`.
- Git initialised, first commit on `phase-1.01-scaffold`, pushed, **one PR open to `main`**. No direct
  push to `main`; no CI/review Action added (`D-0-3`).

---

## 2. Decisions I made on my own

All logged in `Decisions.md`, append-only, each naming the alternative rejected and the downside.

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-1.01-1` | Keep shadcn's current default style (`base-nova`, built on **Base UI** `@base-ui/react`), not Radix as the stack doc's parenthetical says | Pin an older Radix-based shadcn style | Stack doc's "(Radix)" note is now historical; primitives come from Base UI |
| `D-1.01-2` | i18n request handler in **`src/proxy.ts`**, not `middleware.ts` | Keep `middleware.ts` (matches next-intl docs) | Diverges from next-intl's documented filename; Next 16 deprecates `middleware` |
| `D-1.01-3` | `localePrefix: 'as-needed'` → MK at `/`, EN at `/en/` | Default `'always'` (MK at `/mk/`) | `/` is the canonical MK URL; hreflang/canonical must reflect this (2.01) |
| `D-1.01-4` | Package name `trajanov-v2` via a temp lowercase subfolder scaffold | Rename the project directory (fixed by brief) | `package.json` name differs in case from `Trajanov-V2` (cosmetic) |
| `D-1.01-5` | Saved the phase brief to `briefs/Part-1-Phase-01-Code.md` | Leave `briefs/` empty with a `.gitkeep` | My copy may differ subtly from Lazar's canonical brief — overwrite if so |
| `D-1.01-6` | Stripped scaffolder default extras not in the reserved tree (`AGENTS.md`, shadcn `button.tsx`, Next demo SVGs) | Keep them | None material; one-command regeneration if ever wanted |

*Table is intentionally non-empty — a scaffold that fights the tool's evolving defaults produces
exactly these judgement calls.*

---

## 3. Surprises and off-spec changes

- **The project directory name `Trajanov-V2` has capitals, and npm forbids capitals in a package
  name.** `create-next-app .` aborted. Worked around by scaffolding into a lowercase subfolder and
  moving files up (`D-1.01-4`). The orchestrator should know the on-disk folder (`Trajanov-V2`) and
  the npm package name (`trajanov-v2`) differ in case by necessity.
- **shadcn no longer defaults to Radix.** `shadcn@4.13.0 init` writes the `base-nova` style on
  `@base-ui/react`. The stack doc records "shadcn/ui (Radix)". I kept the default (brief: "leave on
  shadcn defaults") and surfaced it in `D-1.01-1` + the stack change log. **If the project genuinely
  needs Radix specifically, that is a new decision — flag it now, before components are generated.**
- **Next 16 deprecates the `middleware` file convention in favour of `proxy`.** next-intl's docs still
  say `middleware.ts`. I used `proxy.ts` to avoid shipping a deprecation warning on day one
  (`D-1.01-2`). Verified routing works at runtime after the rename.
- **next-intl needs files the kickoff `file-map.md` didn't list:** `src/i18n/{routing,request,
  navigation}.ts` and `src/proxy.ts`. Added and documented in the real tree. Not a deviation from the
  brief (which asked for the `[locale]` skeleton) — a deviation from the *intended-tree sketch*, which
  the brief told me to replace with reality anyway.
- **`file-map.md`'s intended tree listed the localised route folders** (`katalog|catalog/`,
  `proizvod|product/[slug]/`, etc.) as if built in 1.01. The brief explicitly defers localised slugs
  to Phase 2.01. The real on-disk tree therefore has only `[locale]/` + the home placeholder; the
  route folders are **not** created yet. Flagged so 2.01 owns them.
- **`00_stack-and-config.md` had `*1.01*` in the Hosting row's Pinned cell**, but this phase does no
  deploy (out of scope). Set it to "— (no deploy in 1.01)" rather than invent a version.
- **`npm test` has no script yet.** `CLAUDE.md` lists it as a command, but no tests exist until the
  concurrency work in 1.03/1.04. Left unimplemented intentionally — not fabricating a passing test.

---

## 4. Files touched

`file-map.md` updated: **yes** (intended tree replaced with the real on-disk tree).

| File | Added / Modified / Deleted |
|---|---|
| `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts` | Added (scaffold; `next.config.ts` then modified for next-intl plugin) |
| `components.json`, `src/lib/utils.ts` | Added (shadcn init) |
| `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` | Added |
| `src/app/globals.css`, `src/app/favicon.ico` | Added (globals updated by shadcn) |
| `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/proxy.ts` | Added |
| `src/messages/mk.json`, `src/messages/en.json` | Added |
| `.gitignore` | Modified (added `!.env.example` exception) |
| `README.md` | Modified (replaced scaffold README with the signpost) |
| `.env.example` | Added (seven key names, no values) |
| `CLAUDE.md`, `facts.md`, `brand.md` | Added — **verbatim, unchanged** |
| `src/_project-state/completions/_TEMPLATE.md` | Added — **verbatim, unchanged** |
| `Decisions.md` | Added verbatim, then **appended** `D-1.01-1..6` |
| `src/_project-state/00_stack-and-config.md` | Added verbatim, then **updated** (pins + change log) |
| `src/_project-state/file-map.md` | Added verbatim, then **updated** (real tree) |
| `src/_project-state/current-state.md` | Added verbatim, then **updated** (`NEXT:`, Built, stack) |
| `briefs/Part-1-Phase-01-Code.md` | Added (this brief) |
| `.gitkeep` × 15 | Added (reserved empty folders) |
| `src/app/layout.tsx`, `src/app/page.tsx` (top-level scaffold) | Deleted (moved into `[locale]/`) |
| `src/components/ui/button.tsx`, `AGENTS.md`, `public/{next,vercel,file,globe,window}.svg` | Deleted (`D-1.01-6`) |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **PASS** — exit 0, compiled + TS check clean |
| Types | `npx tsc --noEmit` | **PASS** — exit 0, zero errors |
| Lint | `npm run lint` | **PASS** — exit 0, no warnings/errors |
| Unit / integration | `npm test` | **N/A** — no test script yet (tests begin 1.03/1.04) |

Build output (trimmed):

```
▲ Next.js 16.2.10 (Turbopack)
✓ Compiled successfully in 1582ms
  Finished TypeScript in 944ms
✓ Generating static pages using 5 workers (5/5)
Route (app)
┌ ○ /_not-found
└ ƒ /[locale]
ƒ Proxy (Middleware)
BUILD_EXIT=0 · LINT_EXIT=0 · TSC_EXIT=0
```

Runtime routing (dev server, curl):

```
GET /            (no Accept-Language) → 200, lang="mk", "Наскоро."
GET /en                               → 200, lang="en", "Coming soon."
GET /mk                               → 307 → /
GET / (Accept-Language: en)           → 307 → /en   (locale detection)
GET / (Accept-Language: mk)           → 200 (mk)
```

**Concurrent-order test:** N/A this phase — no stock/order logic exists (Phases 1.03/1.04).

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `npm run build && npm run lint && npx tsc --noEmit` all pass, zero errors | ☑ |
| `npm run dev` serves a placeholder home locally (rendered + screenshotted `/en`; `/` mk via curl) | ☑ |
| On-disk tree matches `file-map.md` (route folders deferred to 2.01, noted) | ☑ |
| Eight canonical docs committed at reserved paths, byte-identical when placed (`cmp` clean) | ☑ |
| `.env.example` = exactly seven key names, no values | ☑ |
| `.gitignore` covers `.env*`; proven with dummy `.env.local` (below), dummy deleted | ☑ |
| No secret/key/token/real email anywhere in the repo (grep clean) | ☑ |
| No Vercel-specific service, no CMS, no payment SDK added | ☑ |
| No GitHub Action / CI review workflow added (`D-0-3`) | ☑ |
| Versions pinned in `00_stack-and-config.md` (Next, TS, Tailwind, shadcn, Motion, Lucide, next-intl) + Node/npm in change log | ☑ |
| `file-map.md` shows the real on-disk tree | ☑ |
| `current-state.md` line 1 = `NEXT: 1.02 — Design system`; Built + Last-updated current | ☑ |
| `phase-1.01-scaffold` pushed; one PR open to `main`; nothing pushed to `main` | ☑ |

Gitignore proof (dummy created, then deleted):

```
$ git check-ignore -v .env.local     → .gitignore:34:.env*      .env.local     (ignored)
$ git check-ignore -v .env.example   → .gitignore:36:!.env.example .env.example (un-ignored)
$ git status --short | grep .env.local → (nothing)  → PASS: .env.local absent from git
$ rm .env.local                       → dummy deleted
```

### Owed to Lazar

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| — | *(none)* | — | — |

Scaffold outputs were verified directly (build/lint/types, routing served, PR open). Nothing goes on
the owed-verification register. **Optional eyeball** (placeholder only — real UI is 1.02+): run
`npm run dev`, open `http://localhost:3000/` → "Trajanov / Наскоро." (MK), and `/en` → "Trajanov /
Coming soon." (EN); both centred, dark text on light shadcn-default ground.

---

## 7. Placeholders shipped

**None.** The placeholder home renders only the brand name plus a neutral "coming soon" line — no
`facts.md` content, so no `[PLACEHOLDER: …]` markers were shipped. Placeholder register stays empty.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| *(none)* | | | |

---

## 8. Content truth check

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ — none rendered; only brand name + neutral "coming soon" |
| `humanizer` pass run on user-facing copy | N/A — no marketing copy this phase (two placeholder strings) |
| No fashion-magazine filler ("elevate", "curated", "essentials", "vibrant") | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| Template-propagated strings verified once against `facts.md` before generation | N/A — no templated content |
| No AI-generated product imagery (`D-0-6`) | ☑ — no imagery at all |
| No untranslated EN string in the MK build | ☑ — MK renders "Наскоро."; EN string isolated to `en.json` |

---

## 9. Secrets check

*(Repo is public — `D-0-1`.)*

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored (with `!.env.example` exception) | ☑ |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ — `.env.example` names only, no values |
| No order PII (phone, address) in logs | ☑ — no order code exists |

Grep found only (a) public press-article URLs inside the canonical `facts.md` (VERIFIED, verbatim)
and (b) npm integrity hashes in `package-lock.json`. **No secret was committed at any point in this
branch's history.** Nothing to rotate.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| PR review + merge to `main` | Cross-review (`D-0-3`) | Lazar / Petar |
| Localised route folders + hreflang + full string extraction | Phase 2.01 | — |
| `brand.md` tokens → Tailwind (left on shadcn defaults) | Phase 1.02 | — |

No parallel-track blockers touched this phase (photos, prices, sizes, fabric, email, permissions all
remain owned by Vladimir).

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ |
| `current-state.md` — owed-verification register | ☑ (kept empty, explained) |
| `current-state.md` — placeholder register | ☑ (kept empty, explained) |
| `file-map.md` — matches what is actually on disk | ☑ |
| `00_stack-and-config.md` — new deps / pins / config | ☑ |
| `Decisions.md` — every § 2 entry appended | ☑ (`D-1.01-1..6`) |

**`NEXT:` line I set:** `NEXT: 1.02 — Design system`
