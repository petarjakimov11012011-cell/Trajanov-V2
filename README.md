# Trajanov-V2

Bilingual (MK/EN) drop store for **Trajanov**, a Macedonian clothing brand. Browsable between drops;
when a countdown hits zero, a few products go live against real, limited stock. Cash on delivery only.

This README is a signpost, not a spec. The canonical documents live in the repo — read them there.

## Start here

- **Standing rules for this repo:** [`CLAUDE.md`](CLAUDE.md) — read in full before working.
- **Live project status (read before touching anything):**
  [`src/_project-state/current-state.md`](src/_project-state/current-state.md) — line 1 is the
  `NEXT:` phase.
- **Stack, pinned versions, env-var names:**
  [`src/_project-state/00_stack-and-config.md`](src/_project-state/00_stack-and-config.md) — read
  before adding any dependency.
- **File map (what lives where):** [`src/_project-state/file-map.md`](src/_project-state/file-map.md)
- **Why the project is shaped this way:** [`Decisions.md`](Decisions.md)
- **Business facts (only source):** [`facts.md`](facts.md)
- **Design tokens (only source):** [`brand.md`](brand.md)
- **Phase briefs:** [`briefs/`](briefs) · **Completion reports:**
  [`src/_project-state/completions/`](src/_project-state/completions)

## Commands

```sh
npm install                          # install dependencies
npm run dev                          # local dev server
npm run build                        # production build
npm run lint && npx tsc --noEmit     # lint + typecheck
```

Run `npm run build && npm run lint && npx tsc --noEmit` before every PR. A red build is not a PR.

## Secrets

The repo is **public** (`D-0-1`). **Never commit a secret** — not once, not temporarily, not in a
comment or fixture. `.env*` is gitignored; [`.env.example`](.env.example) holds key *names* only.
Values live in the hosting and Supabase dashboards. See [`CLAUDE.md`](CLAUDE.md).
