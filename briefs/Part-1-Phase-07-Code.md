# Part 1 · Phase 07 · Code — Deploy + hosted Supabase + real keys

**Why this matters —** everything built so far runs on one laptop against a Docker database. This
phase puts the store on a public URL, moves the schema to the real Frankfurt database, and proves
that the atomic stock decrement, the reservation sweep, the rate limit and the real bot-check all
behave there exactly as they do locally. Part 1's hard gate (1.08) cannot clear its register
without this.

---

## Context

### What already exists

Phases 1.01–1.06 are merged (PRs `#1`–`#6`): full site (MK default `/`, EN `/en/`), DB-driven drop
engine, atomic `create_order()` with `TR001`–`TR006`, `expire_reservations()` on a pg_cron schedule,
peppered IP rate limit, real Turnstile widget wired against Cloudflare's **dummy** keys
(`D-1.04-8`), and the cart flow. **46 Vitest tests pass.** All of it is **local only** — nothing has
ever been deployed (`D-1.03-5`, `D-1.06-4`).

**Phase 1.07's Cowork (ops) half is done.** It created, and this phase consumes:

| Thing | Detail |
|---|---|
| **Vercel** | Hobby project `trajanov-v2`, owner `petar-jakimov-projects`, production branch `main`, `https://trajanov-v2.vercel.app`. Linked to `petarjakimov11012011-cell/Trajanov-V2`. |
| **Supabase** | Hosted project `trajanov-v2`, ref **`kmuocwmevyyuhcvwoebf`**, region **`eu-central-1` (Frankfurt)**, **Postgres 17** — same major as local and as `supabase/config.toml`. **Migrations are NOT pushed. The database is empty.** |
| **Turnstile** | Cloudflare widget **"Trajanov store"**, mode **Managed** (`D-1.07-2`), hostnames `trajanov-v2.vercel.app` + `localhost`. Site key `0x4AAAAAAD23OFW7Ka1hTR1F` (public by design). |
| **Vercel env vars** | Six, all scoped **Production + Preview**, all marked Sensitive: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `ORDER_IP_HASH_PEPPER`. **No Resend vars — deliberate.** |
| **Supabase keys** | The **legacy** `anon` / `service_role` JWTs, not the new `sb_publishable…`/`sb_secret…` pair (`D-1.07-1`) — they are what the code was built and tested against. |
| **Supabase security toggles** | Left at creation defaults (`D-1.07-3`): Data API on, auto-expose new tables on, automatic RLS off. **The migrations are the real security. Task 6 is what proves that.** |

### Read first, by path

- `src/_project-state/current-state.md` — live state. Line 1 is the `NEXT:` line.
- `src/_project-state/completions/Part-1-Phase-07-Cowork-Completion.md` — what ops created and flagged.
- `CLAUDE.md` — repo rules. **The secrets rule is the one that matters this phase.**
- `src/_project-state/00_stack-and-config.md` — env var names, pinned versions, the portability rule.
- `Decisions.md` — read `D-0-1`, `D-0-2`, `D-1.03-5`, `D-1.04-8`, `D-1.06-4`, `D-1.07-1/2/3`.
- `Trajanov-V2-Phase-Plan.md` — the 1.07 line and the 1.08 gate.

### Where the credentials come from (never from a file in this repo)

The repo is **public** (`D-0-1`). Nothing below is ever committed, logged, echoed into a report, or
pasted into a comment.

| Value | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → project `kmuocwmevyyuhcvwoebf` → API settings (**legacy** keys, `D-1.07-1`) |
| `SUPABASE_DB_URL` | Supabase → **Connect** → direct Postgres URL. The DB password is in the operator's password manager. **Local/admin only — it is NOT a Vercel variable and must never become one.** |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare → Turnstile → widget "Trajanov store" → settings |
| `ORDER_IP_HASH_PEPPER` | Operator's password manager. Local may use its own value; **the Vercel value must never change** — rotating it in production resets every rate-limit window (`D-1.04-7`). |

These go in `.env.local`, which is gitignored and stays that way.

---

## Scope

**In scope**

1. Link the repo to the hosted Supabase project and push the migrations to Frankfurt.
2. Prove hosted parity — schema, RLS, `create_order()`, `expire_reservations()`, the pg_cron
   schedule, the rate-limit table — closing owed-verification item **#4**.
3. Publish the committed rehearsal drop to hosted with `npm run sync:drop`.
4. Deploy to Vercel so the six environment variables take effect, and prove the deployed build
   serves the **real** Turnstile keys, not the dummies — **narrowing** owed item **#5**.
5. Correct the Hosting row in `00_stack-and-config.md` (`D-1.06-4`) and pin what 1.07 pins.
6. Move Resend out of 1.07 in the Phase Plan (Task 10).
7. State files, decision entries, completion report, PR to `main`.

**Out of scope — do not touch**

- **Resend, or email of any kind.** No `RESEND_API_KEY`, no `ORDER_NOTIFICATION_EMAIL`, no send
  code, no stub. It is blocked on Vladimir's email address, which does not exist
  (`facts.md` §5; placeholder register #5). See Task 10.
- **Placing a real customer order on production.** That is 1.08's job and it needs a live rehearsal
  drop this phase does not create. The only committed drop is `test-drop`, which is **ended and
  null-priced** (`D-1.04-12`) — leave it that way.
- `trajanov.com`, Cloudflare DNS, Cloudflare Web Analytics — all 2.05.
- Any UI, copy, string, component, or message-catalog change.
- **Any change to `create_order()` or `expire_reservations()`.** If hosted disagrees with local,
  **report it — do not edit the function to make hosted pass.** A migration that changes behaviour
  to suit a host is a new bug wearing a fix's clothes.
- Deleting the stray Stockholm (`eu-north-1`) Supabase project or the stray `trajanov` Vercel
  project. Those are the operator's dashboard jobs.
- Product photos, prices, names, sizes, fabric — those are `Y.01`.
- **Anything Vercel-specific.** No Vercel Postgres, Blob, or KV. The portability rule in
  `00_stack-and-config.md` is what keeps `D-0-2` cheap.

---

## Decisions handed down by the orchestrator

Log each of these in `Decisions.md` with **Decided by: Claude Chat (orchestrator) — handed down
verbatim in the Phase 1.07 Code brief**, in the format the file already uses. Next free IDs start at
`D-1.07-4`.

- **Parity is proven by running the real test suite against the hosted database, once, while it is
  empty — then resetting it.** Alternative rejected: prove parity by inspection only (`cron.job`
  count, a few RLS probes). Downside accepted: test rows and an advanced `TRJ-####` sequence briefly
  exist on the production database. Mitigated by doing it before any real data exists and resetting
  afterwards — **this window does not come back.**
- **Production is verified from a CLI deploy of the phase branch (`npx vercel --prod`), before the
  PR merges — not from a preview URL and not after the merge.** Alternative rejected: merge first,
  verify after. Downside accepted: unreviewed branch code serves the production URL for the length
  of this phase. Acceptable while the site has no domain, no customers, and one ended test drop; the
  merge redeploys the same commit.
- **Turnstile hostnames stay `trajanov-v2.vercel.app` + `localhost`. Bare `vercel.app` is not
  added.** Alternative rejected: add `vercel.app` so preview deployments pass. Downside accepted:
  Turnstile cannot be exercised on preview URLs at all — every Turnstile check happens on production
  or localhost. Rejected because bare `vercel.app` lets any `*.vercel.app` host use this widget.
- **Owed item #5 narrows rather than closes here.** This phase proves the production build serves
  the real site key and that the real secret authenticates against Siteverify. "Does Cloudflare
  actually challenge a bot on a real order" needs a live drop and stays owed to **1.08**. Rewrite
  the register row to say exactly that; **do not delete it.**
- **1.07 ships without Resend; order email becomes on-demand phase `Z.01 — Order email (Resend)`,
  mandatory before 1.08, triggered by Vladimir's email address arriving.** Alternative rejected:
  fold Resend into 1.08 (what the Cowork report assumed). Rejected because 1.08 is explicitly a
  **no-new-features** gate whose own DoD is a real order end to end — a gate that builds the feature
  it then verifies is not a gate. Downside accepted: one more phase and one more PR, and 1.08 now
  has a hard dependency on a phone call nobody has made yet.

---

## Tasks

1. **Branch.** From an up-to-date `main`: `git checkout -b phase-1.07-deploy`. One phase branch at a
   time — confirm nothing else is unmerged.
2. **`.env.local`.** Fill the six values plus `SUPABASE_DB_URL` from the table above. Then prove it
   is untracked: `git status` shows nothing new, and `git check-ignore -v .env.local` names the
   `.gitignore` rule. **Never print a value to a terminal you will paste from, a log, or the report.**
3. **Link + push the schema.**
   ```zsh
   npx supabase link --project-ref kmuocwmevyyuhcvwoebf
   npx supabase db push
   npx supabase migration list
   ```
   Local and remote must list the same migrations. `config.toml` pins `major_version = 17` and
   hosted is Postgres 17 — **if `link` reports a mismatch, stop and report it; do not edit the pin
   to silence the warning.**
4. **pg_cron — the known parity risk.** Locally the schedule came up under `supabase start`. Hosted
   Supabase needs the extension enabled and only runs cron in the `postgres` database. After the
   push, confirm:
   ```sql
   select jobid, schedule, jobname, active from cron.job;
   ```
   returns **2 active rows** — the 5-minute reservation sweep and the nightly run-log prune
   (`D-1.04-2/3`). If the migration cannot create the extension on hosted, enable it and record
   **exactly what you did and where** in §3 of the report — a step that lives only in a dashboard is
   a step that gets lost. Also record in the report that a **paused free-tier project silently
   pauses pg_cron**, which stops reservations expiring (register #4's named risk).
5. **Prove parity by running the suite against Frankfurt.** Export the hosted `SUPABASE_DB_URL` and
   run `npm test`. **All 46 must pass against hosted**, including the 10-vs-3 oversell gate and the
   expiry tests. Paste the real output into the report — not a summary of it. Then reset the hosted
   database so it is clean and the `TRJ-####` sequence starts at 1 again, and show that it is clean.
   The database is empty; nothing can be lost. **Then re-run `npm test` against local and confirm 46
   still pass**, so the phase does not end with the local environment in an unknown state.
6. **RLS on hosted, with the real anon key** (`D-1.07-3`). Cowork left "auto-expose new tables" on;
   this is the check that proves it does not matter. Using the **hosted anon key**, confirm:
   - `orders` and `order_items` are unreachable — select, insert, update all denied;
   - the catalog tables (`drops`, `products`, `variants`) are readable and **not** writable;
   - `create_order` and `expire_reservations` are **not** executable by anon.
7. **Types match hosted.** `npm run gen:types` is hardcoded to `--local`. Run
   `npx supabase gen types typescript --linked` and diff the output against the committed
   `src/types/database.ts`. **They must be identical.** Do not commit the `--linked` output; if they
   differ, that is a parity failure and belongs in §3 of the report.
8. **Publish the rehearsal drop.** With the hosted `SUPABASE_DB_URL` exported, `npm run sync:drop`.
   It publishes the committed `test-drop` (ended, null-priced). Confirm from the script's own report
   lines that stock was INSERT-only and no row with `order_items` was deleted (`D-1.04-5`).
9. **Deploy and verify production.**
   ```zsh
   npx vercel login      # opens a browser — the operator authenticates as petar-jakimov-projects
   npx vercel link       # link to the existing project trajanov-v2, do NOT create a new one
   npx vercel --prod
   ```
   Then, against `https://trajanov-v2.vercel.app`:
   - the site serves both locales (`/` MK, `/en`) and the ended `test-drop` renders from the
     **hosted** database — not from a build-time fixture;
   - **view source on `/checkout`: the Turnstile site key must be `0x4AAAAAAD23OFW7Ka1hTR1F`, and
     must NOT be a Cloudflare dummy key** (the dummies begin `1x000000…` / `2x000000…` /
     `3x000000…`). This is the single most important line in this phase — a dummy key in production
     means the bot protection is theatre;
   - the widget renders and solves on that hostname;
   - **prove the real secret is the real secret:** call Cloudflare's Siteverify with the real secret
     and a deliberately junk token. It must answer `invalid-input-response` (the token is junk) and
     **not** `invalid-input-secret` (which would mean the secret is wrong). Do this from a throwaway
     shell command — **do not add a route, a script, or a test that carries the secret into the repo.**
   - confirm `D-1.07-2`: Managed mode's behaviour matches what the local dummy-key setup did. If it
     does not, say so — the mode is changeable in the Cloudflare dashboard without changing keys.
10. **Plan and stack corrections.**
    - `Trajanov-V2-Phase-Plan.md`: strike Resend and "Order-confirmation email via Resend" from the
      1.07 row and rename it `Deploy + hosted Supabase + real keys`; add to the **On demand** table:
      **`Z.01 · Order email (Resend) · Code · Trigger: Vladimir's email address exists
      (`facts.md` §5). Wires Resend: order notification to Vladimir, confirmation to the customer.
      Email is a side channel; the DB is the record. Mandatory before 1.08 — 1.08's DoD is a real
      order with a real email, end to end.`** Add `Z.01` to the critical-path block.
    - `00_stack-and-config.md` is **append-only — never rewrite its history.** Correct the Hosting
      row's `Pinned: 1.01` to `1.07` (it never deployed in 1.01) and pin Database and Bot protection
      to `1.07`, then **append a change-log row recording the correction and why** (`D-1.06-4`). Add
      `SUPABASE_DB_URL` to the environment-variable table marked **local/admin only, never set in
      Vercel**, since it is in `.env.example` but not in that table.
11. **State duties + report.** Per `CLAUDE.md`: rewrite line 1 of `current-state.md`
    (`NEXT: 1.08 — Verification gate` unless Task 10's `Z.01` is unblocked by then), move this work
    into **Built**, update the **Integrations wired** table (Supabase → hosted + migrations pushed;
    Turnstile → real keys live; Vercel → deployed), rewrite register rows **#4** (closed, with the
    evidence) and **#5** (narrowed, not deleted — see the decision above), sync `file-map.md` if any
    file moved, and file
    `src/_project-state/completions/Part-1-Phase-07-Code-Completion.md` from `_TEMPLATE.md`.
12. **PR.** `npm run build && npm run lint && npx tsc --noEmit` green, then push and open PR `#7` to
    `main`. **No fresh-session review is required on this phase** — that gate is 1.03/1.04 only
    (`D-0-3`); Petar or Lazar cross-reviews. Note in the PR that production already serves this
    commit (the decision above), so the merge is a redeploy of the same code.

---

## Definition of Done

### Verified by you, in this phase

- [ ] `npx supabase migration list` shows local and remote (`kmuocwmevyyuhcvwoebf`) carrying the
      same migrations, and no migration file changed to make that true.
- [ ] `select … from cron.job` on hosted returns **2 active rows**. The report records how the
      extension got enabled if a dashboard step was needed.
- [ ] `npm test` against the hosted `SUPABASE_DB_URL` → **46 pass**, including the 10-vs-3 oversell
      gate (**exactly 3 succeed, 7 cleanly rejected**). **Real output pasted into the report.**
- [ ] The hosted database is left clean, `TRJ-####` back to 1, and `npm test` against local still
      returns 46.
- [ ] With the hosted **anon** key: `orders` and `order_items` deny select/insert/update; catalog
      tables read-only; `create_order` / `expire_reservations` not executable.
- [ ] `npx supabase gen types typescript --linked` output is byte-identical to the committed
      `src/types/database.ts`.
- [ ] `npm run sync:drop` published `test-drop` to hosted; stock INSERT-only.
- [ ] `https://trajanov-v2.vercel.app` serves `/` (MK) and `/en`, rendering the ended `test-drop`
      from the hosted database.
- [ ] The deployed `/checkout` HTML carries site key **`0x4AAAAAAD23OFW7Ka1hTR1F`** and **no dummy
      key appears anywhere in the deployed build.**
- [ ] Siteverify with the real secret + a junk token returns **`invalid-input-response`**, not
      `invalid-input-secret`.
- [ ] `git log -p` on this branch contains **no key, token, connection string, email, or password**;
      `.env.local` untracked; nothing secret behind a `NEXT_PUBLIC_` prefix; no order PII in any log.
- [ ] `npm run build`, `npm run lint`, `npx tsc --noEmit` all green.
- [ ] `Decisions.md` carries an entry for every orchestrator decision above **and** every call you
      made on your own, each naming the alternative rejected and the downside accepted.
- [ ] `current-state.md` line 1 rewritten; registers updated (**#4 closed with evidence, #5 narrowed
      and still present**); `00_stack-and-config.md` corrected **by appending**;
      `Trajanov-V2-Phase-Plan.md` carries `Z.01`; completion report filed.

### Owed to Lazar (only he or a real account can do these — put each on the register)

| # | Item | What "pass" looks like |
|---|---|---|
| 1 | Delete the stray **Stockholm** (`eu-north-1`) Supabase project | Only `kmuocwmevyyuhcvwoebf` (Frankfurt) remains in the Supabase account |
| 2 | Review and remove the stray **`trajanov`** Vercel project | Exactly one Vercel project points at this repo, so one push cannot trigger two deployments |
| 3 | Confirm `ORDER_IP_HASH_PEPPER` **and** the Supabase DB password are saved in the password manager | Both retrievable. Neither is recoverable if lost, and changing the pepper in Vercel breaks IP rate limiting |
| 4 | Register **#1** — design sign-off, and **#2** — Instagram URL click-test | Both owed since 1.02. **1.08 cannot pass while they sit.** Confirm or clear them |

---

## Outputs & where they go

- Branch `phase-1.07-deploy` → PR `#7` → `main`.
- Completion report → `src/_project-state/completions/Part-1-Phase-07-Code-Completion.md`, from
  `_TEMPLATE.md` in that folder.
- Decision entries → `Decisions.md`, append-only, IDs from `D-1.07-4`.
- State → `src/_project-state/current-state.md`, `file-map.md`, `00_stack-and-config.md`.
- This brief → `briefs/Part-1-Phase-07-Code.md`.

**One honesty note, since this phase is nearly all verification:** if something does not match
between local and hosted, the finding *is* the deliverable. §2 and §3 of the report are the two
sections anyone will actually read. A phase that reports "everything matched" with no surprises and
no decisions is a phase nobody believes — and the thing you smoothed over surfaces on drop day
instead.
