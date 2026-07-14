NEXT: 1.02 — Design system

# Current state — Trajanov-V2

**This file is the single source of truth for project status.** The orchestrator reads it before
every brief. Nobody's memory outranks it. Line 1 is always the `NEXT:` line — Code updates it when
closing every phase.

Last updated: **2026-07-14** · By: **Claude Code (Phase 1.01 — scaffold)**

---

## Status

**Scaffold built.** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + next-intl + Motion +
Lucide are installed, pinned, and wired. The app builds clean and serves a bilingual placeholder
home (MK at `/`, EN at `/en/`). No real pages, no data layer, no drop engine yet. Branch
`phase-1.01-scaffold` pushed; PR open to `main`, awaiting review + merge.

| | |
|---|---|
| Part | 1 of 2 — Build |
| Phase | 1.01 complete — PR open, not yet merged |
| Branch | `phase-1.01-scaffold` |
| Open PR | `#1` → `main` |
| Deployed | nowhere |
| Domain | `trajanov.com` — **not purchased** |

---

## Stack

**Canonical: `00_stack-and-config.md`.** Not restated here.

Installed and pinned in 1.01 (versions recorded there). Toolchain: Node `v24.17.0`, npm `11.13.0`.
Note: shadcn's default style is Base UI-based (`base-nova`), not Radix — see `D-1.01-1`.

---

## Built

### Pages
- Placeholder home at `/[locale]` (MK `/`, EN `/en/`) — brand name + neutral "coming soon". No
  facts.md content. Real home is a later phase.

### Components
None. (`src/components/{ui,drop,product}/` are reserved, empty.)

### Integrations wired
- **next-intl** — MK default (`/`), EN (`/en/`), `localePrefix: as-needed`; `src/i18n/*` +
  `src/proxy.ts`. Stub messages only; full string extraction + hreflang is 2.01.
- **shadcn/ui** — initialised (config + `cn()` helper); no components generated.

| Integration | Status |
|---|---|
| Supabase | Not created |
| Resend | Not created |
| Turnstile | Not created |
| Cloudflare DNS | Not configured |
| Cloudflare Analytics | Not configured |
| Vercel project | Not created |

---

## Owed-verification register

Things claimed done that only Lazar (or a real device / real account) can confirm. **At 3+ items,
or before any phase that builds on unverified work, the next phase is a verification phase.**
**Must be empty before Part 2 — hard gate at 1.08.**

| # | Item | Owed since | Phase that verifies |
|---|---|---|---|
| — | *(empty)* | | |

*Scaffold outputs (build/lint/types green, routing served, PR open) were verified by Code directly
— see the completion report. Nothing owed.*

---

## Placeholder register

Every visible `[PLACEHOLDER: …]` on the site. **Must be empty before cutover (2.05). Launch
blocker.**

| # | Placeholder | Page | Waiting on | Owner |
|---|---|---|---|---|
| — | *(none yet — placeholder home carries no facts.md content)* | | | |

**Already known to be coming** (from `facts.md`, will become entries the moment the relevant page
is built):

- Vladimir's email → Contact page, order emails
- Real prices in MKD → Product pages
- Sizes / measurements → Product pages
- Fabric composition + care → Product pages
- Product photos → Catalog, Product
- 3 unverified press links → About

---

## Carryovers

None.

---

## Known issues / accepted risks

| # | Item | Ref | State |
|---|---|---|---|
| 1 | **Vercel Hobby ToS violation.** Commercial use prohibited; Vercel may pull the deployment without notice, explicitly including during traffic spikes — i.e. drop day. Accepted by Lazar. | `D-0-2` | Live. Mitigations: portability rule, pre-written Pro migration (X.01), 2.06 contingency. |
| 2 | **No automated PR review.** House review gate waived for this project. Risk concentrated on 1.03/1.04 concurrency code. | `D-0-3` | Live. Mitigations: cross-review, fresh-session review on 1.03/1.04, concurrent-order test. |
| 3 | **Public repo.** One committed secret is scraped before you notice. | `D-0-1` | Live. Mitigation: hard rule in `CLAUDE.md`. Rotate, never just delete. |
| 4 | **Legal responsibility unconfirmed.** Minor, no registered entity, collecting consumer PII. | `facts.md` § 1 | **Cutover blocker.** Owner: Vladimir + parents. |
| 5 | **Product photos do not exist.** | `D-0-6` | **Blocks 1.06.** Owner: Vladimir. Critical path. |
| 6 | **Bar photos: model + venue permission unconfirmed**, and age-appropriateness of an alcohol backdrop for a 12+ audience is an open owner call. | `facts.md` § 8 | Blocks 1.05 hero. Owner: Vladimir. |

---

## Parallel track

Canonical table with gates: `Trajanov-V2-Plan.md` § 13. Status only:

| Task | Owner | Status |
|---|---|---|
| Buy `trajanov.com` | Lazar | Not started |
| **Product photos** | **Vladimir** | **Not started — critical path** |
| Vladimir's email | Lazar → Vladimir | Not started |
| Real prices (MKD) | Vladimir | Not started |
| Sizes + fabric (read the labels) | Vladimir | Not started |
| Legal responsibility w/ parents | Vladimir | Not started |
| Model + venue permission | Vladimir | Not started |
| Verify 3 press links | Lazar | Not started |
| First drop date + products | Vladimir | Not started |
| MK copy review | Lazar + Petar | Scheduled — Phase 2.02 |

---

## Update rules

On closing every phase, Code must:

1. Rewrite **line 1** — `NEXT: <phase id> — <name>`
2. Update Last updated + By
3. Move completed work into **Built**
4. Add every owed item to the **owed-verification register**
5. Add every `[PLACEHOLDER: …]` shipped to the **placeholder register**
6. Record carryovers and new issues
7. Update the parallel-track status if anything landed

**Never delete a register row because it feels resolved. Remove it only when it is verified, and
say so in the completion report.**
