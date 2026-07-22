# Part 2 · Phase 06 · Code — Drop rehearsal + contingency

**Why this matters —** Before Trajanov opens a real drop against real stock on a host that can pull the
site mid-spike, we run one full dress rehearsal on the live domain — countdown → live → order →
sold out → expiry, with Vladimir walking his own fulfilment — and we write down exactly what he posts
and where if the site goes down mid-drop, so drop day is a script and not a scramble.

## Who runs this

This is a **Code + operator** phase, like the 1.08 gate.

- **Code** writes the two repo documents (the contingency plan and the rehearsal runbook), builds the
  safe open/reset tooling, runs the Code-verifiable gates, updates the state files, opens a PR
  (`D-0-3`), and files the report. **Code never self-merges** — an operator merges.
- **Lazar + Vladimir** then execute the live rehearsal on their own phones, from the runbook, and bring
  back the evidence. Their half is what clears owed **#15** and **#16**.

## Context — read first, by path

- `src/_project-state/current-state.md` — live status. In particular the **owed-verification register**
  (**#15** live Turnstile renders + solves on the real-domain checkout; **#16** a real order email
  delivers from `info@trajanovv.com` end to end — both explicitly owed to this rehearsal), the
  **placeholder register** (#2 photos / #3 fabric / #4 names / #7 returns window still open, owner
  Vladimir), and **Known issues #1** (Hobby may pull the site on drop day — `D-0-2`), **#7** (a paused
  free-tier project silently pauses `pg_cron`), **#8** (`supabase db reset --linked` wipes hosted with
  no backup).
- `src/_project-state/completions/Part-1-Phase-08-*` (and the `D-1.08-4` operator note) — the **proven
  method** for a live-order-then-reset: open the priced test drop, place one real phone order
  (`TRJ-0001`), confirm the email lands, then **delete the order + reservation** and verify hosted clean
  back at `TRJ-0001`. Reuse this exactly.
- `src/_project-state/completions/Part-2-Phase-05-Completion.md` — the cutover: the real domain
  `https://www.trajanovv.com`, the `info@trajanovv.com` sender, and the rotated Turnstile **site** key
  `0x4AAAAAAD6pSIvEa1p8GkZX` (Managed widget, hostnames `trajanovv.com` + `www`).
- `facts.md` — **§5** (email `info@trajanovv.com`), **§6** (Instagram `@trajanovv2026` — the *only*
  social channel), **§7** (phone `078 820 520`; ships **North Macedonia only**; **COD**; delivery
  **3–5 business days**), **§9** (domain). **Nothing in the contingency post may state a fact that is
  not in `facts.md`.**
- `Trajanov-V2-Plan.md` — **§1** ("launched" means), **§13** (parallel track), **§15** (risks); and
  `Trajanov-V2-Phase-Plan.md` — the **2.06** scope line and the **X.01** on-demand phase ("Migrate to
  Vercel Pro"), which is the technical recovery path the contingency plan points to.
- `Decisions.md` — `D-0-2` (Hobby ToS accepted + contingency), `D-1.08-3/4` (the gate/reset method),
  `D-2.05-3/4/6` (branded from-address, Turnstile rotation, `SITE_URL` = www).
- `CLAUDE.md` — the repo's standing rules; `src/_project-state/00_stack-and-config.md` — hosted DB
  access (session pooler + gitignored `.env.hosted`) and the `npm run sync:drop` tool.

## Scope

**In scope**

- A written **drop-day contingency plan** (repo doc): how they detect the site is down, the pre-written
  **bilingual** hold message for Instagram, the manual (DM/phone) fallback order channel, the **X.01**
  recovery trigger, who does what, and the hard don'ts.
- A plain-language **rehearsal runbook** (repo doc) the two non-coders follow to walk a full fake drop on
  `www.trajanovv.com`: **countdown → live → order → sold out → expiry**, plus Vladimir's fulfilment
  walk, plus the mandatory safe teardown.
- Safe **tooling / procedure** to open the rehearsal drop **on hosted only** and to reset it to clean
  afterward (reuse `npm run sync:drop` and/or a documented targeted admin step — never
  `db reset --linked`).
- The **live rehearsal** executed by Lazar + Vladimir, clearing owed **#15** and **#16**.
- State-file updates + the completion report.

**Out of scope — do NOT**

- **Commit any live or priced drop to `main`.** The committed drop config stays **ENDED**; production
  must never become unintentionally buyable as a result of this PR.
- Touch `create_order`, `expire_reservations`, any `supabase/migrations/` file, the cart, or the
  checkout/order logic. This is a rehearsal, not a change to the commerce path.
- Run `supabase db reset --linked` against hosted (**Known issue #8** — it wipes the DB and there is no
  backup on the free tier).
- Open the **real launch** drop, or fill any product placeholder (#2 photos / #3 fabric / #4 names / #7
  returns window). The first real drop is a separate, later step, **gated on Vladimir's content (Y.01)
  and the placeholder register reaching zero** — not on this rehearsal.
- **Announce** the rehearsal window publicly, so a real customer can't stumble onto the test drop and
  place a real order.
- Add a new npm dependency.

## Tasks

1. **Write the contingency plan** → `docs/ops/drop-day-contingency.md`. Cover, in order:
   - **Detection** — how they learn the site is down. The uptime monitor is still owed (register **L7**);
     until it exists, detection is a customer report or a manual check of `https://www.trajanovv.com`.
   - **Hold the drop publicly** — a pre-written **Instagram** message (story + feed caption), in **MK and
     EN**, that: (a) says the drop is paused for a technical reason, (b) reassures that it is **not
     cancelled** and nobody has lost their place, (c) points customers to order by **Instagram DM** or
     **phone `078 820 520`**, **cash on delivery**, same prices, while stock lasts. Every claim traced to
     `facts.md`; run the **humanizer** pass; invent no delivery time/cost, stock number, or false urgency.
   - **Manual order channel** — exactly what Vladimir records by hand for a DM/phone order (name, phone,
     city, address, size, qty) and how he honours the **real stock cap** without the site (a written
     tally), so the manual path **cannot oversell**.
   - **Technical recovery** — trigger **X.01** (Migrate to Vercel Pro): name where the X.01 brief lives,
     who runs it, and that it is pre-written to be an afternoon, not a scramble.
   - **Roles** — who posts (Lazar), who fulfils (Vladimir), who triggers X.01.
   - **Hard don'ts** — don't promise a delivery time/cost not in `facts.md`; don't announce stock you
     can't back; don't take card/online payment; don't delete-and-repost in a way that loses customer DMs.

2. **Write the rehearsal runbook** → `docs/ops/drop-rehearsal-runbook.md`, in plain language for a
   non-coder, with any commands in `zsh` code blocks using full paths. It must script:
   - **Pre-flight** — confirm `www.trajanovv.com` is up, the Turnstile widget renders on the real-domain
     `/checkout` (`/naracka`), and `info@trajanovv.com` routes to Vladimir's inbox.
   - **Open the rehearsal drop — hosted only** — a **short countdown** (a few minutes, so they watch it
     tick to zero → live) on the existing test colourways (`test-mustard-ochre` / `test-off-white`, 1199
     MKD) at **low stock** (e.g. 1 unit on one size) so a single order drives it to **SOLD OUT**. Spell
     out the exact command/steps and state plainly that **this open/priced state is never committed to
     `main`**.
   - **Walk the lifecycle on a phone** — countdown → **LIVE** at T-0; place **one real order** through a
     **browser-solved Turnstile** on the real domain (the **#15** leg) and confirm it verifies
     server-side; watch stock go to **0 → SOLD OUT**; confirm the **notification email arrives from
     `info@trajanovv.com`** with the correct order number, line, customer block, and COD copy (the
     **#16** leg); Vladimir then **phones the "customer"** (a second operator / known number) and records
     the order exactly as he would in real life (the **fulfilment walk**).
   - **Rehearse expiry** — reserve a unit, leave it unconfirmed, and observe the reservation **returned to
     stock by the scheduled expiry job** — reuse the **1.08 backdated-hold method** so they don't wait
     48h; say where to see it (`cron.job_run_details` succeeded / stock returning).
   - **Contingency dry-run** — with the runbook's pre-written hold post open, Lazar confirms he **could**
     post it to Instagram and that the **DM/phone channel reaches Vladimir**. A walk-through/draft, **not**
     a real public post.
   - **Mandatory teardown** — **DELETE** the rehearsal order + reservation, return the drop to **ENDED**,
     and verify every order table reads **0** and `TRJ-####` is back to its pre-rehearsal value —
     exactly as 1.08 did — with the **explicit ban on `db reset --linked`**. **Nothing buyable may remain
     on `www.trajanovv.com` after the rehearsal.**
   - **Evidence to capture** — name each screenshot/file and where it goes
     (`docs/ops/rehearsal-evidence/` or pasted into the completion report).

3. **Provide the open/reset mechanics safely.** If anything beyond `npm run sync:drop` is needed, add a
   small documented admin/SQL step run against **hosted** (session pooler, `.env.hosted`) — **no new
   dependency**, no change to `create_order`/`expire_reservations`, and **nothing that edits committed
   config on `main`**.

4. **Run the standing gates unchanged** (this phase must not alter commerce code):
   `npm run build`, `npx tsc --noEmit`, `npm run lint`, `npm test` (expect **85/85** incl. the 10-vs-3
   oversell gate).

5. **Open a PR** from a phase branch (e.g. `phase-2.06-rehearsal-contingency`) to `main`; **do not
   self-merge** (`D-0-3`). Update the state files and file the completion report.

## Definition of Done

### Verifiable by Code

- [ ] `docs/ops/drop-day-contingency.md` exists and covers detection, the bilingual (MK+EN) hold post,
      the manual order channel with an anti-oversell tally, the X.01 trigger, roles, and the don'ts.
      Every factual claim traced to `facts.md`; **humanizer** pass run; no invented delivery
      time/cost/stock.
- [ ] `docs/ops/drop-rehearsal-runbook.md` exists, is step-by-step and plain-language, and scripts the
      full lifecycle (countdown→live→order→sold out→expiry), the fulfilment walk, the contingency
      dry-run, and the mandatory safe teardown — including the **explicit ban on `db reset --linked`**
      and the **"hosted only, never committed to `main`"** rule for the open state.
- [ ] The committed config on the branch keeps the drop **ENDED**; **grep-proven** that no live/priced
      drop and no new placeholder ship to `main`.
- [ ] No `create_order` / `expire_reservations` / `supabase/migrations/` / cart / checkout change; **no
      new dependency** (`git diff` + `package.json` unchanged bar the two docs, any admin helper, the
      report, and state files).
- [ ] `npm run build`, `npx tsc --noEmit`, `npm run lint` clean; `npm test` **85/85** incl.
      `✓ 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected …, stock 0`.
- [ ] **No secret committed** (public repo, `D-0-1`): only the **public** Turnstile *site* key / public
      `info@trajanovv.com` / public IG handle / public phone may appear; no `RESEND_API_KEY`,
      `TURNSTILE_SECRET`, DB password, or `ORDER_IP_HASH_PEPPER`.
- [ ] State files updated (line-1 `NEXT`, registers, Known issues) and the report filed at
      `src/_project-state/completions/Part-2-Phase-06-Completion.md`.

### Owed to Lazar + Vladimir — the live rehearsal (real devices, real domain)

- [ ] On `www.trajanovv.com`, the countdown reached zero and flipped to **LIVE**.
- [ ] **#15** — a real order was placed through a **browser-solved Turnstile** on the real-domain
      checkout, and it verified server-side.
- [ ] Stock decremented to **0** and the product showed **SOLD OUT**.
- [ ] **#16** — the notification email **arrived in Vladimir's inbox from `info@trajanovv.com`** with the
      correct order number, line, customer block, and COD copy.
- [ ] Vladimir walked his **fulfilment** (phoned the test customer, recorded the order) and can state it
      works.
- [ ] **Reservation expiry** was observed returning stock (backdated-hold method).
- [ ] **Contingency dry-run** — Lazar confirmed he can post the hold message to Instagram and that
      DM/phone reaches Vladimir.
- [ ] The **Instagram contingency copy (MK + EN) is signed off by Lazar** (client-facing brand copy).
- [ ] **Hosted reset verified clean** — order + reservation deleted, drop **ENDED**, order tables **0**,
      `TRJ-####` restored, and **nothing buyable left on `www.trajanovv.com`**.

## Outputs & where they go

- `docs/ops/drop-day-contingency.md` — the `D-0-2` contingency plan.
- `docs/ops/drop-rehearsal-runbook.md` — the operator rehearsal script.
- `docs/ops/rehearsal-evidence/` — screenshots + the received email (or paste them into the report).
- Completion report → `src/_project-state/completions/Part-2-Phase-06-Completion.md` — split
  **Code-verified** vs **operator-verified**, list any on-the-fly decisions, and confirm owed **#15** +
  **#16** cleared (or why not) and that the **hosted reset** was verified.
