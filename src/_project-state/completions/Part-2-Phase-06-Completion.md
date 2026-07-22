# Completion report — Part 2 Phase 06: Drop rehearsal + contingency (Code half)

> **Read this first:** this is a **Code + operator** phase, like the 1.08 gate. **The Code half is done**
> (the two docs, the SQL tooling, the gates, the state updates, the PR). **The operator half is owed** — the
> live rehearsal on `www.trajanovv.com` by Lazar + Vladimir, which is what actually clears owed **#15** and
> **#16**. Code did **not** open a drop, place an order, or send an email; it wrote the runbook that tells
> the operators exactly how to. **Code did not self-merge** (`D-0-3`) — an operator merges.

| | |
|---|---|
| **Phase** | 2.06 |
| **Name** | Drop rehearsal + contingency — Code half |
| **Executor** | Claude Code |
| **Operator** | Lazar + Vladimir (owed — the live rehearsal) |
| **Date** | 2026-07-22 |
| **Branch** | `phase-2.06-rehearsal-contingency` |
| **PR** | [#16](https://github.com/petarjakimov11012011-cell/Trajanov-V2/pull/16) (opened this session → `main`; not self-merged) |
| **Brief** | `briefs/Part-2-Phase-06-Code.md` |

---

## 1. What shipped

- **A drop-day contingency plan** (`docs/ops/drop-day-contingency.md`) — the `D-0-2` script for the site
  going dark mid-drop. It covers how they detect the outage, a **ready-to-post bilingual (MK + EN)
  Instagram hold message** (story + feed caption), the **manual DM/phone order channel** with a written
  **anti-oversell tally**, the **X.01** (Vercel Pro) recovery trigger, who does what, and the hard don'ts.
  Every fact in it is traced to `facts.md`; the copy went through a humanizer pass.
- **A rehearsal runbook** (`docs/ops/drop-rehearsal-runbook.md`) — a plain-language, non-coder script for
  walking a full fake drop on the real domain: countdown → live → order → sold out → expiry, plus
  Vladimir's fulfilment walk, plus a contingency dry-run, plus a mandatory safe teardown. It reuses the 1.08
  open→order→verify→close method exactly.
- **Safe open/reset tooling** (`docs/ops/rehearsal-sql/`) — eight copy-paste SQL files for the Supabase SQL
  Editor that only ever touch `test-drop`: baseline check, open (constraining the drop to one sellable
  unit), verify-live, verify-order, backdate-the-hold, verify-expiry, teardown, verify-clean. Plus a
  `rehearsal-evidence/` folder for the operators' screenshots.

Nothing about the running site changed. This phase is documents and SQL, not code — the point is that drop
day is a script, and the rehearsal is ready to run.

---

## 2. Decisions I made on my own

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-2.06-1` | Rehearsal runs **one** order against a drop constrained to a **single sellable unit**, and reuses that same order for the expiry test (backdate its hold). | Two orders across two sizes/phones (one to sell out, one to expire). | After the expiry step the drop reads live-with-1-unit again rather than SOLD OUT (evidence captured before expiry); constraining stock to 1 is a deliberate hosted SQL write, undone in teardown. |
| `D-2.06-2` | The contingency plan **points at X.01** (names its plan location, trigger, owner, and why it's an afternoon) and **flags that the X.01 brief is not yet written**; this phase does not author it. | Write the X.01 brief now to make "pre-written" literally true. | `D-0-2`'s "pre-written recovery" is not literally met until someone writes `briefs/Part-X-Phase-01-*.md`; surfaced here and in §3/§10. |

Both are logged verbatim in `Decisions.md`.

---

## 3. Surprises and off-spec changes

- **The X.01 brief doesn't exist yet — the one real gap.** The brief's "technical recovery" task asks me to
  name where the X.01 brief lives and note it's "pre-written to be an afternoon, not a scramble." X.01 is a
  planned on-demand phase (`Trajanov-V2-Phase-Plan.md`), and the thing that *makes* it an afternoon — the
  portability rule (`D-0-2`: nothing Vercel-specific, data in Supabase, DNS in Cloudflare) — is genuinely in
  place. But there is **no executable X.01 brief** in `briefs/` yet, so "pre-written" is not literally true.
  I flagged this in the contingency plan itself and recommend authoring `briefs/Part-X-Phase-01-*.md` before
  the first real drop (`D-2.06-2`). I did **not** write it — that's a separate phase with its own owner.
- **"SOLD OUT" is a drop-level state, not a single-size one.** `src/lib/drop/state.ts` computes the drop as
  ended/sold-out only when **total** stock across every product and size is 0 (`totalStock`). So to show a
  single order taking the drop to SOLD OUT, the open SQL zeroes the whole drop and puts back exactly one
  unit. This is why the runbook constrains stock rather than just placing an order against the committed
  stock-3 config (`D-2.06-1`).
- **The one-live-order-per-phone index shaped the design.** `orders_one_live_per_phone_per_drop` is a
  partial unique index over live statuses only, so an *expired* order frees the phone — which is why the
  single-order-reused-for-expiry path works on one phone without tripping `TR005`. Documented in the SQL and
  the decision.
- **The open state is deliberately not committed.** The committed `src/config/drops.ts` keeps `test-drop` in
  the past (ended). Opening the drop is a live-only hosted edit that teardown reverses; nothing about the
  repo makes production buyable. This is called out in both docs and grep-proven (§6).
- **The Turnstile pre-flight is a "does it render" check; the real proof is the order.** Rendering the
  captcha on `/naracka` needs a cart item and an open drop, so the authoritative #15 verification is the
  actual browser-solved order in the lifecycle step, not a standalone pre-flight.

---

## 4. Files touched

`file-map.md` updated: **yes** (new `docs/ops/` subtree + a 2.06 change-log row; also backfilled a missing
2.05 change-log row and marked `mk-review-2.03.md` signed).

| File | Added / Modified / Deleted |
|---|---|
| `docs/ops/drop-day-contingency.md` | Added — the `D-0-2` contingency plan |
| `docs/ops/drop-rehearsal-runbook.md` | Added — the operator rehearsal script |
| `docs/ops/rehearsal-sql/README.md` | Added — index of the SQL steps |
| `docs/ops/rehearsal-sql/00-baseline.sql` … `07-verify-clean.sql` | Added — 8 SQL helper files (Supabase SQL Editor) |
| `docs/ops/rehearsal-evidence/README.md` | Added — evidence folder (with `D-0-1` PII caution) |
| `Decisions.md` | Modified — appended `D-2.06-1`, `D-2.06-2` |
| `src/_project-state/current-state.md` | Modified — line 1 `NEXT`, Status, Built, owed register #15/#16, placeholder note, Known issue #1, summary table |
| `src/_project-state/file-map.md` | Modified — `docs/ops/` tree + change-log rows |
| `src/_project-state/completions/Part-2-Phase-06-Completion.md` | Added — this report |
| `briefs/Part-2-Phase-06-Code.md` | Added — the phase brief (was untracked) |

**No `src/` application code, no `supabase/migrations/`, no `scripts/`, no `package.json`, no
`create_order`/`expire_reservations`, no cart/checkout, no `src/config/` file changed. No new npm
dependency.**

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ pass (all routes compile) |
| Types | `npx tsc --noEmit` | ✅ clean (exit 0) |
| Lint | `npm run lint` | ✅ clean (no output) |
| Unit / integration | `npm test` | ✅ **85 passed / 85**, 17 files |

**Phase gate — mandatory concurrent-order test (frozen commerce code, re-run):**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: yes** |
| Test file | `tests/concurrency/oversell.test.ts` |
| Output | `✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 58ms` |

This phase changed no commerce code, so the gate is a regression check — it stays green.

---

## 6. Definition of Done

### Verified here (by me, Code)

| Item | Result |
|---|---|
| `docs/ops/drop-day-contingency.md` covers detection, MK+EN hold post, manual channel + anti-oversell tally, X.01 trigger, roles, don'ts; facts traced; humanizer run; no invented delivery time/cost/stock | ☑ |
| `docs/ops/drop-rehearsal-runbook.md` is step-by-step, plain-language, scripts the full lifecycle + fulfilment walk + contingency dry-run + mandatory teardown; explicit `db reset --linked` ban; "hosted only, never committed to `main`" | ☑ |
| Committed config keeps the drop **ENDED**; grep-proven no live/priced drop or new placeholder ships to `main` | ☑ (`src/config/drops.ts` window June 2026 = past; no `src/config/` diff; no new `[PLACEHOLDER` string) |
| No `create_order`/`expire_reservations`/`supabase/migrations/`/cart/checkout change; no new dependency | ☑ (`git diff` touches only `docs/`, state files, `Decisions.md`, the brief; `package.json` unchanged) |
| `npm run build` / `npx tsc --noEmit` / `npm run lint` clean; `npm test` **85/85** incl. the 10-vs-3 gate | ☑ |
| No secret committed (public repo, `D-0-1`) | ☑ (see §9 — only public phone / IG handle / `info@` appear) |
| State files updated (line-1 `NEXT`, registers, Known issues) + report filed | ☑ |

### Owed to Lazar + Vladimir — the live rehearsal (real devices, real domain)

These are the DoD's "owed" checklist. The runbook (`docs/ops/drop-rehearsal-runbook.md`) is the step-by-step
for each; the register rows are #15 and #16 (updated to point at the runbook — no new rows).

| # | Item | Runbook step | What "pass" looks like |
|---|---|---|---|
| A | Countdown reached zero → LIVE on `www.trajanovv.com` | 2a | Phone shows the countdown tick to zero, flips to LIVE |
| B | **#15** — real order through a browser-solved Turnstile on the real-domain checkout, verified server-side | 2b | Captcha solves, order goes through, order row created |
| C | Stock → 0, product shows SOLD OUT | 2c | `03-verify-order.sql`: size stock 0; UI shows SOLD OUT |
| D | **#16** — notification email in Vladimir's inbox from `info@trajanovv.com`, correct number/line/customer/COD | 2d | Email arrives, subject "Нова нарачка TRJ-0001 — Trajanov", body correct |
| E | Vladimir walks fulfilment (phones the "customer", records the order) | 2e | Vladimir can state the email→confirmed-order path works |
| F | Reservation expiry observed returning stock (backdated hold) | 3 | `05-verify-expiry.sql`: job succeeded, order `expired`, stock returned |
| G | Contingency dry-run — Lazar can post the hold message; DM/phone reach Vladimir | 4 | Confirmed reachable; nothing posted publicly |
| H | Instagram hold copy (MK + EN) signed off by Lazar | 4 | Lazar approves the copy or notes exact edits |
| I | Hosted reset verified clean — order + reservation deleted, drop ENDED, tables 0, `TRJ-####` restored | 6 | `07-verify-clean.sql`: 0 orders, ended, stock 3, TRJ-0001 |

---

## 7. Placeholders shipped

**None.** This phase shipped ops documents only — no page, no `[PLACEHOLDER: …]` string. The existing
register is unchanged (#2 photos, #3 fabric, #4 names, #7 returns window still open, owner Vladimir). The
rehearsal runs against the existing placeholder-named `test-drop` and does **not** fill any of them — the
register must reach zero before the first REAL drop (`Y.01` content), which this rehearsal is explicitly
not.

---

## 8. Content truth check

The only user-facing copy this phase produced is the Instagram hold message (MK + EN) in the contingency
plan. It is a **draft pending Lazar's sign-off** (owed item H).

| Check | Result |
|---|---|
| Every rendered factual claim traced to a VERIFIED entry in `facts.md` | ☑ (phone `078 820 520` §5/§7, IG `@trajanovv2026` §6, `info@trajanovv.com` §5, COD §7, NMK-only §7; delivery 3–5 business days §7 is VERIFIED but kept out of the post to stay minimal) |
| `humanizer` pass run on user-facing copy | ☑ (the hold message; plain, present tense, no filler, em dashes removed) |
| No fashion-magazine filler | ☑ |
| No invented testimonials / reviews / counts / awards / partners / team / address | ☑ |
| No invented delivery time/cost, stock number, or false urgency in the hold post | ☑ (courier + cost are OWED `facts.md` §7 — deliberately absent; "while stock lasts", no number) |
| No AI-generated product imagery (`D-0-6`) | ☑ (no imagery) |
| No untranslated EN string in the MK build | ☑ (n/a — these are ops docs, not the next-intl catalogs; MK + EN both provided) |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, secret email, or credential in any committed file | ☑ — only the **public** phone, IG handle, and `info@trajanovv.com` appear; grep for `RESEND_API_KEY`/`TURNSTILE_SECRET`/`SERVICE_ROLE`/`ORDER_IP_HASH_PEPPER`/`postgres://`/password/site-key returned nothing in `docs/ops/` |
| `.env*` still gitignored | ☑ (`.env.hosted`/`.env.local` untouched; the runbook loads `.env.hosted` in the shell, never echoes it) |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ (no env var added) |
| No order PII (phone, address) in logs or committed files | ☑ (the evidence README warns operators to blur real phone/address before committing screenshots) |

No secret was committed at any point on this branch.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| The live rehearsal (owed #15 + #16 + items A–I above) | Lazar + Vladimir running `docs/ops/drop-rehearsal-runbook.md` on real devices | Lazar + Vladimir |
| Merge the PR (Code does not self-merge, `D-0-3`) | An operator | Petar / Lazar |
| **Write the X.01 (Vercel Pro migration) brief** (`D-2.06-2`) | Authoring `briefs/Part-X-Phase-01-*.md` so the recovery path is a checklist, not an improvisation | Lazar / Code (next phase) |
| Uptime monitor (register **L7**) | Standing one up so detection isn't customer-report-only (also guards Known issue #7) | Lazar (ops) |
| Cloudflare Web Analytics beacon (`D-2.05-5`) | Analytics token | Lazar (ops) |
| Placeholder register → zero (#2/#3/#4/#7) | Vladimir's content (`Y.01`) — before the first REAL drop | Vladimir |

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ (2.06 operator half + then Y.01 / first real drop) |
| `current-state.md` — owed-verification register | ☑ (#15/#16 updated to point at the runbook; no new rows — the rehearsal verifies the existing ones) |
| `current-state.md` — placeholder register | ☑ (no change — 2.06 note added) |
| `file-map.md` — matches what is actually on disk | ☑ (`docs/ops/` tree + change-log) |
| `00_stack-and-config.md` — new deps / pins / config | ☑ n/a (no dependency/config change) |
| `Decisions.md` — every § 2 entry appended | ☑ (`D-2.06-1`, `D-2.06-2`) |

**`NEXT:` line I set:** `NEXT: 2.06 operator half — the LIVE drop rehearsal on www.trajanovv.com (Lazar +
Vladimir), which clears owed #15 + #16; then Y.01 (drop content load) + the placeholder register to zero
before the first REAL drop.`
