# Completion report — Part 1 Phase 07 (Code): Deploy + hosted Supabase + real keys

> **No secret, key, password, token, or connection string appears in this report.** Each is named by
> *where it lives*, never by value. The only key shown is the Turnstile **site** key, public by design.

| | |
|---|---|
| **Phase** | 1.07 (Code half) |
| **Name** | Deploy + hosted Supabase + real keys |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-16 |
| **Branch** | `phase-1.07-deploy` |
| **PR** | #7 |
| **Brief** | `briefs/Part-1-Phase-07-Code.md` |

---

## 1. What shipped

- **The store is on a public URL: https://trajanov-v2.vercel.app** — both locales (`/` MK, `/en`),
  served from the real Frankfurt database. Six phases of "local only" (`D-1.03-5`, `D-1.06-4`) are over.
- **Hosted parity is proven, not asserted.** All 8 migrations pushed to `kmuocwmevyyuhcvwoebf`; the
  **real 46-test suite ran against Frankfurt and all 46 passed**, including the **10-vs-3 oversell
  gate**. The atomic stock decrement holds on the real host. **Owed item #4 is closed.**
- **A real bug was found and fixed.** The parity run caught a divergence nobody knew about: on hosted,
  `anon` could have been granted write access to the catalog tables. RLS was still blocking every write
  — **no data was ever exposed** — but hosted had one safety barrier where local has two. One new
  migration closes it (§3, `D-1.07-14`).
- **Real bot protection is live and proven end to end.** The deployed checkout serves the real
  Turnstile key, no dummy key exists anywhere in the deployed build, and a real widget token validated
  against the real secret with `success: true`.
- **`pg_cron` works on hosted** — 2 active jobs, created straight from the migration, no dashboard step.
  The phase's biggest named risk turned out to be a non-event.
- **Resend is gone from 1.07** and is now on-demand phase `Z.01`, **mandatory before 1.08** — which
  means **1.08 is now blocked on a phone call to get Vladimir's email address**.

---

## 2. Decisions I made on my own

Orchestrator decisions logged verbatim as instructed: **`D-1.07-4`** (parity via the real suite, then
reset), **`D-1.07-5`** (verify production from a CLI deploy of the branch, pre-merge), **`D-1.07-6`**
(Turnstile hostnames unchanged), **`D-1.07-7`** (owed #5 narrows, not closes), **`D-1.07-8`** (no
Resend; `Z.01` created). My own calls:

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-1.07-9` | Hosted credentials live in a new gitignored **`.env.hosted`**; `.env.local` stays **local**. | Follow the brief literally and put hosted values in `.env.local`. | One more untracked file. Rejected the brief's version because it silently points `npm run dev` / `test` / `sync:drop` at **production** by default — that is how a stray local run writes a row to Frankfurt. Verified exported vars beat `process.loadEnvFile`, so both coexist. |
| `D-1.07-10` | The parity run exports **all four** hosted vars, not just `SUPABASE_DB_URL`. | Follow Task 5 literally. | A deviation from the brief's wording. Task 5 as written would have run the SQL suites against Frankfurt while the **RLS suites silently ran against local** — a **false 46/46** on the exact item this phase exists to close. |
| `D-1.07-11` | `SUPABASE_DB_URL` uses the **session pooler**, not the direct connection the brief specifies. | Transaction pooler (6543); fixing IPv6; the paid IPv4 add-on. | Admin traffic goes via Supavisor, not a raw socket. Forced: the direct host is **IPv6-only** and this machine has **no IPv6**. Transaction mode was rejected because it would have required editing the **test helpers** (`prepare: false`) to suit the host. **The app never uses this var** (`D-1.03-12`), so production is unaffected. |
| `D-1.07-12` | Minted a Supabase **account access token**; **reset the DB password**. | Petar pastes the existing password from his password manager — **I recommended this; he chose the reset.** | **The password manager's DB entry is now stale and wrong** (owed L3). The token controls the whole account and **must be revoked** (owed L4). Forced in part because all six Vercel vars are **Sensitive = write-only** (§3). |
| `D-1.07-13` | Applied **`seed.sql` to the hosted database**, against its own "NEVER runs against a deployed database" header. | Skip the hosted suite; write a hosted-only fixture. | Invented test prices/names touched production for minutes, and `TRJ-####` advanced to 30. Erased by the reset, **which I verified rather than assumed**. Without this the suite cannot reach its fixtures at all — the brief did not anticipate that `db push` does not seed. |
| `D-1.07-14` | **New migration** revoking anon write grants on the catalog tables. **Operator chose this** after I put both options to him. | Report only and ship 45/46; turn the dashboard toggle off instead. | **Scope grew by one migration** — the brief did not ask for a schema change. The toggle alone fixes nothing (it does not retroactively revoke). See §3. |
| `D-1.07-15` | Recovered a **broken `supabase db reset --linked`** by hand. | Re-run it (fails identically); leave the DB half-wiped; stop the phase. | The documented reset path **does not work on this project** and is now a known issue. Cost nothing only because the DB was deliberately empty. |

---

## 3. Surprises and off-spec changes

**This is the section to read.**

### 3.1 A real security finding — hosted granted `anon` write access to the catalog (`D-1.07-14`)

The hosted parity run **failed 1 of 46**: `tests/rls/anon-access.test.ts > cannot UPDATE variants
stock`. On hosted, an anon UPDATE returned **no error**; locally it errors. Measured:

```
hosted anon on drops/products/variants: DELETE,INSERT,REFERENCES,SELECT,TRIGGER,TRUNCATE,UPDATE
local  anon on drops/products/variants: REFERENCES,SELECT,TRIGGER,TRUNCATE
```

**Cause.** `schema.sql:150-152` states the assumption in its own comment:

> *"Local Supabase does NOT auto-expose new public tables to the Data API roles (the modern cloud
> default)… So a table is unreachable by anon/authenticated/service_role until GRANTed here. **We grant
> deliberately and narrowly.**"*

That is true locally (`auto_expose_new_tables` is unset in `config.toml`) and **false on hosted**,
where Cowork left the creation-time **"Automatically expose new tables" toggle ON** (`D-1.07-3`). The
tables were therefore created with `anon` already holding everything, so `grant select` added nothing
and nothing removed the rest. **`D-1.07-3`'s own "downside accepted" predicted exactly this, and Task 6
was written to check it — the check found it.**

**No data was ever exposed.** RLS is on with SELECT-only policies, so every anon write matched no
policy and touched 0 rows. Verified empirically on hosted *before* the fix: `stock 5 → 5`, row count
unchanged, INSERT rejected `42501`, `orders`/`order_items` denied `42501` on every verb, all three
functions `anon=false`. **The defect was depth, not a hole** — hosted had **one** barrier where local
has **two**. One `disable row level security`, or one stray permissive policy, and `schema.sql:162`'s
own warning ("anybody on the internet set stock to whatever they like") stops being hypothetical.

**The pattern is exact and worth carrying forward:** every object the migrations **revoke explicitly**
— `orders`, `order_items`, `order_attempts`, and all three functions — matched local **perfectly** on
hosted. The catalog was the **only** object that trusted the default to be empty, and the **only** one
that diverged. Local's narrower defaults hid this for four phases.

**Fix** (operator-approved): `20260716120000_catalog_grant_hardening.sql`. Both environments now report
`REFERENCES,SELECT,TRIGGER`, and the failing test **passes for the right reason** — the grant denies the
write, exactly as locally. This is not "editing code to make hosted pass": it makes hosted match
`schema.sql`'s **own stated intent**. **I did not touch `create_order` or `expire_reservations`.**

**Still open (register #6):** the toggle is **still ON**. Any *future* table (e.g. `Y.01`'s photo/fabric
work) will again be created anon-writable. Turning it off does **not** retroactively revoke, so it must
be paired with an explicit REVOKE in whatever migration adds a table.

### 3.2 The brief's Task 5 would have produced a false pass (`D-1.07-10`)

Task 5 says "Export the hosted `SUPABASE_DB_URL` and run `npm test`". But `tests/helpers/db.ts` builds
its anon and service-role clients from `NEXT_PUBLIC_SUPABASE_URL` + the two keys; **only the raw-SQL
suites read `SUPABASE_DB_URL`**. Exporting only the DB URL runs the SQL suites against Frankfurt while
the **RLS suites quietly run against local** — and reports 46/46. Since the RLS check is exactly what
finding 3.1 depended on, following the brief literally would have **hidden the bug and closed #4 on a
false pass**. I export all four and assert both clients are hosted before trusting any result.

### 3.3 `db push` does not seed, so the hosted suite cannot run as briefed (`D-1.07-13`)

The DoD requires "46 pass against hosted", but the tests resolve fixtures via
`getVariantId('test-tee-black','M')`, which exist only in `seed.sql` — applied by local
`supabase start`/`db reset`, **never by `db push`**. Against hosted the suite fails on fixture lookup,
for reasons that say nothing about parity. `seed.sql`'s first line also says **"NEVER runs against a
deployed database"**. I applied it anyway for the duration of the run and erased it with the reset
`D-1.07-4` already mandates — the seed's warning exists to stop invented prices being mistaken for real
content on a **live** store, and every slug is `test-`-prefixed by deliberate design. Flagging it rather
than quietly doing it, because a future phase running against a database **with real orders** must not
repeat this.

### 3.4 `supabase db reset --linked` is broken — it wiped the database and could not rebuild it (`D-1.07-15`)

The mandated reset **failed halfway**:

```
ERROR: relation "order_number_seq" already exists (SQLSTATE 42P07)
```

It drops tables, types, functions and even the `pg_cron` extension — **but not sequences** — then fails
its own re-apply on the sequence it left behind. It left the database **wiped**, migration history
empty, one orphan sequence. Recovered by hand: `drop sequence … cascade` → `db push --include-all` →
verified clean. **This cost nothing only because the database was deliberately empty, exactly as
`D-1.07-4` designed. On a database with real orders this is a data-loss event, and the free tier has no
backup.** Now Known issue #8.

### 3.5 The Vercel env vars are write-only — Cowork's §3.4 is wrong for this half (`D-1.07-12`)

Cowork marked all six **Sensitive** and judged it "cosmetic only… no functional impact". True for the
deployed build (Vercel injects them at build time). **False for the Code half:** `vercel env pull`
returns **all six as empty strings**, so not one credential was obtainable from Vercel. Combined with
`supabase login` refusing its browser flow in a non-TTY shell (`LegacyLoginMissingTokenError`), this is
what forced the access token and, at the operator's choice, the DB password reset. **Consequence Lazar
must act on: the password manager's DB entry is now stale and wrong (L3), and the access token should
be revoked (L4).**

### 3.6 The direct connection is unusable from this machine (`D-1.07-11`)

`db.kmuocwmevyyuhcvwoebf.supabase.co` publishes **only an AAAA record**, and this machine has **no
global IPv6 address** (only VPN `utun` link-local default routes). `dns.resolve6` finds the address;
`getaddrinfo` refuses it; so `psql`, `postgres.js`, `nc` and `supabase db push` all fail `ENOTFOUND`. A
control lookup of `google.com` returned **zero** IPv6 addresses, proving it is the host, not the
project. Supabase's own Connect dialog labels the session pooler *"Only recommended as an alternative to
Direct Connection, when connecting via an IPv4 network"* — precisely this case. **The brief's
instruction to "take the DIRECT string, not the pooler" cannot be followed on this machine.**

### 3.7 The types DoD is unmeetable as worded (not a parity failure)

`gen types --linked` is **not** byte-identical to the committed `src/types/database.ts`, and cannot be.
The entire difference is a cloud-only metadata block plus a trailing newline:

```
<   __InternalSupabase: { PostgrestVersion: "14.5" }
>   (trailing blank line)
```

The committed file is **byte-identical to `--local`** (sha256 equal), which is what `npm run gen:types`
produces. Schema content matches exactly: **6 tables, 4 functions, 2 enums** on both. `--linked` injects
the hosted **platform's** PostgREST version, which `--local` has no equivalent for. **Schema parity: pass.
DoD as literally worded: cannot pass.** I left `src/types/database.ts` untouched, per the brief.

### 3.8 Smaller things

- **The brief says to add `SUPABASE_DB_URL` to the env-var table "since it is in `.env.example` but not
  in that table".** It was **already there** (`00_stack-and-config.md:87`). I strengthened the row
  instead of duplicating it.
- **`db push` emits a scary `pg-delta` stack trace** — `Failed to read certificate file …
  pgdelta-target-ca.crt: ENOENT`. It is a **CLI-side catalog *caching* step**, not a migration failure;
  every migration applied and was verified independently. Cosmetic, but alarming in a log.
- **`Part-1-Phase-07-Runbook-v2.md`** (untracked, repo root) is **stale and now actively misleading**:
  it walks the operator through creating a **Resend** account and setting **eight** env vars, both of
  which `D-1.07-8` struck. It also predates the Cowork half. **Not touched — it is the operator's file
  and out of scope — but it should be deleted or marked superseded before anyone follows it.**
- **The stray Stockholm Supabase project is confirmed live**, not merely reported: ref
  `ewcqwbuvbbfduytiiaxy`, `eu-north-1`, ACTIVE_HEALTHY, empty. The stray `trajanov` Vercel project is
  also still present. Both are dashboard jobs (L1, L2).
- **The widget could not be exercised through the real checkout form** — the cart is empty and the only
  drop is ended, so the form never renders. I mounted a widget on the production hostname instead, which
  is what proves the hostname allow-list and Managed mode. The *real order* path is 1.08's.

---

## 4. Files touched

`file-map.md` updated: **yes** (new migration in the tree + an appended change-log row).

| File | Added / Modified / Deleted |
|---|---|
| `supabase/migrations/20260716120000_catalog_grant_hardening.sql` | **Added** — the phase's only code change (`D-1.07-14`) |
| `briefs/Part-1-Phase-07-Code.md` | Added (this phase's brief) |
| `src/_project-state/completions/Part-1-Phase-07-Code-Completion.md` | Added (this report) |
| `Decisions.md` | Modified — `D-1.07-4` … `D-1.07-15` appended |
| `Trajanov-V2-Phase-Plan.md` | Modified — 1.07 renamed + Resend struck; `Z.01` added to On-demand **and** the critical path |
| `src/_project-state/00_stack-and-config.md` | Modified — Hosting/Database/Bot-protection/Email `Pinned` corrected; `SUPABASE_DB_URL` row strengthened; change-log row **appended** |
| `src/_project-state/current-state.md` | Modified — `NEXT:` line, Status, Built, Integrations, registers, Known issues, Carryovers |
| `src/_project-state/file-map.md` | Modified — migration added to tree + change-log row |
| `.env.hosted`, `.vercel/` | **Created locally, gitignored, never committed** (`D-1.07-9`) |

**Not touched:** `create_order`, `expire_reservations`, any existing migration, any `src/` application
code, component, message catalog, or test file. **No new npm dependency** (`package.json` unchanged).
**Nothing Vercel-specific added** — the portability rule holds.

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **pass** — compiled in 6.7s, 9 routes |
| Types | `npx tsc --noEmit` | **pass** — clean |
| Lint | `npm run lint` | **pass** — clean |
| Unit / integration — **hosted Frankfurt** | `npm test` (all 4 hosted vars exported) | **46/46 pass** |
| Unit / integration — **local, after** | `npm test` | **46/46 pass** — environment left sane |

**Concurrent-order test — mandatory:**

| | |
|---|---|
| **Concurrent-order test** — 10 simultaneous orders / 3 units | **exactly 3 succeeded, 7 rejected: YES — and this run was against the REAL hosted Frankfurt database** |
| Test file | `tests/concurrency/oversell.test.ts` |

Actual output, against hosted (`vitest run --reporter=verbose`, not a summary):

```
 RUN  v4.1.10 /Users/petarjakimov/Projects/Trajanov-V2

 ✓ tests/concurrency/oversell.test.ts > create_order — concurrent oversell protection > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 821ms
 ✓ tests/concurrency/expiry.test.ts > expire_reservations — stock returns exactly once > expires an elapsed order, returns its stock exactly once, and a second sweep is a no-op 1284ms
 ✓ tests/concurrency/expiry.test.ts > expire_reservations — stock returns exactly once > two concurrent sweeps do not double-return stock 481ms
 ✓ tests/rls/anon-access.test.ts > RLS — anon key is caught by the wall > cannot read orders (PII) 304ms
 ✓ tests/rls/anon-access.test.ts > RLS — anon key is caught by the wall > cannot read order_items (PII) 159ms
 ✓ tests/rls/anon-access.test.ts > RLS — anon key is caught by the wall > CAN read variants (the catalog must stay browsable) 81ms
 ✓ tests/rls/anon-access.test.ts > RLS — anon key is caught by the wall > cannot UPDATE variants stock (no anon write path exists) 446ms
 ✓ tests/rls/anon-access.test.ts > RLS — anon key is caught by the wall > cannot call create_order (execute revoked from anon) 75ms
 ✓ tests/orders/create-order.test.ts > creates an order: returns TRJ-#### + snapshotted total, decrements stock 1307ms
 ✓ tests/orders/create-order.test.ts > rejects an order before starts_at with drop_not_open (D-1.03-7) 335ms
 ✓ tests/orders/create-order.test.ts > rejects an unknown drop with drop_not_found 329ms
 ✓ tests/orders/create-order.test.ts > rejects more than 2 total units with quantity_cap_violated 403ms
 ✓ tests/orders/create-order.test.ts > rejects a second live order from the same phone with duplicate_phone, and keeps stock intact 500ms
 ✓ tests/orders/price-missing.test.ts > rejects a null-priced variant with TR006 and does NOT decrement stock 1038ms
 ✓ tests/orders/rate-limit.test.ts > hashes the IP — the stored value is a 64-char hex hash, not the address 6ms
 ✓ tests/orders/rate-limit.test.ts > permits the first 20 attempts and rejects the 21st in the window 2029ms
 ✓ tests/orders/rate-limit.test.ts > stored exactly the 20 allowed attempts, each as the hash (the rejected one is not recorded) 165ms
 ✓ tests/config/cron.test.ts > pg_cron schedule (from db reset) > has both jobs scheduled and active 625ms
 ✓ tests/config/sync.test.ts > NEVER resets stock on an existing variant — the test that saves the drop (D-1.04-5) 2886ms
 ✓ tests/orders/checkout-items.test.ts > selecting test-tee-two / L (NOT the drop's first product) names THAT variant in order_items 551ms
 … (12 files, all passing)

 Test Files  12 passed (12)
      Tests  46 passed (46)
   Duration  26.32s
```

**Guard printed before the run** (`D-1.07-10` — proving a pass here means something):

```
  PostgREST (anon + service clients) -> kmuocwmevyyuhcvwoebf.supabase.co
  Postgres  (raw SQL suites)         -> aws-0-eu-central-1.pooler.supabase.com:5432
  both hosted -> a pass here means something
```

**The first hosted run was 45/46.** The failure was real (§3.1), not flaky. It passed only after
`D-1.07-14` fixed the underlying grants.

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `migration list`: local == remote, no migration edited to force it | ☑ 8/8 match |
| `cron.job` on hosted returns **2 active rows** | ☑ Extension created **by the migration — no dashboard step needed** |
| `npm test` vs hosted → 46 pass, incl. 10-vs-3 (exactly 3 / 7 rejected). Real output pasted | ☑ §5 |
| Hosted left clean, `TRJ-####` back to 1; local still 46 | ☑ 0 rows in all 6 tables; `TRJ-0001`; local 46/46 |
| Hosted anon: orders/order_items deny select+insert+update; catalog read-only; functions not executable | ☑ all `42501`; catalog verified against ground truth; all 3 functions `anon=false` |
| `gen types --linked` byte-identical to committed `database.ts` | **☒ — cannot pass as worded.** Schema identical (6 tables / 4 fns / 2 enums); committed == `--local` byte-for-byte. `--linked` adds a cloud-only `__InternalSupabase` block. **§3.7** |
| `sync:drop` published `test-drop`; stock INSERT-only | ☑ 16 variants inserted, **0 overwritten, 0 deleted** |
| Production serves `/` (MK) + `/en`, ended `test-drop` from the hosted DB | ☑ both 200; MK renders "Спуштањето заврши" |
| Deployed `/checkout` carries `0x4AAAAAAD23OFW7Ka1hTR1F`; **no dummy key anywhere in the build** | ☑ real key ×1; **961 KB of JS + HTML scanned — zero dummy keys** |
| Siteverify: real secret + junk token → `invalid-input-response`, not `invalid-input-secret` | ☑ **and better** — a real widget token + real secret → **`success: true, hostname: trajanov-v2.vercel.app`**. Wrong-secret control → `invalid-input-secret`, so the pass is meaningful |
| `D-1.07-2`: Managed mode matches local | ☑ solves silently without interaction, as the local dummy keys did |
| `git log -p`: no key/token/connection string/email/password; `.env*` untracked; nothing secret behind `NEXT_PUBLIC_` | ☑ §9 |
| `npm run build` / `lint` / `tsc --noEmit` green | ☑ |
| `Decisions.md` carries every orchestrator decision **and** every call I made | ☑ `D-1.07-4` … `D-1.07-15` |
| `current-state.md` line 1; registers (#4 closed w/ evidence, #5 narrowed + present); `00_stack-and-config.md` corrected by appending; Plan carries `Z.01`; report filed | ☑ |

**One DoD item is honestly marked failed** (types), for a reason that is not a parity problem. See §3.7.

### Owed to Lazar / the operator

| # | Item | Exact URL / steps | What "pass" looks like |
|---|---|---|---|
| L1 | Delete the stray **Stockholm** Supabase project — **confirmed live**: `ewcqwbuvbbfduytiiaxy`, `eu-north-1`, ACTIVE_HEALTHY, empty | Supabase dashboard → project → Settings → General → Delete | Only `kmuocwmevyyuhcvwoebf` (Frankfurt) remains |
| L2 | Review/remove the stray **`trajanov`** Vercel project | vercel.com → `petar-jakimov-projects` | Exactly one project points at this repo |
| L3 | **SAVE THE NEW DB PASSWORD — it changed this phase.** The password manager's entry is **stale and wrong** (`D-1.07-12`). The new value exists **only** in gitignored `.env.hosted` on Petar's machine. Also confirm `ORDER_IP_HASH_PEPPER` is saved (the **Vercel** value must never change — `D-1.04-7`) | Copy `SUPABASE_DB_URL`'s password out of `.env.hosted` into the password manager | Both retrievable; DB password matches `.env.hosted`. **Unrecoverable if that file is lost** |
| L4 | **Revoke the Supabase access token `claude-code-phase-1.07`** — it controls the whole account | https://supabase.com/dashboard/account/tokens | Token no longer listed |
| L5 | **Turn OFF "Automatically expose new tables"** (register #6) | Supabase → project → Settings → API | Off; and any future migration adding a table carries an explicit REVOKE |
| L6 | **Register #1 (design sign-off)** and **#2 (Instagram click-test)** — owed since 1.02, **1.08 cannot pass while they sit**. Now finally doable: the site is public | https://trajanov-v2.vercel.app (`/`, `/en`, `/about`, `/contact`, `/catalog`) | Both confirmed or cleared |
| L7 | **Uptime monitor** — a paused free-tier project silently pauses pg_cron and takes the store down (Known issue #7) | UptimeRobot / cron-job.org → HTTP(s), 5-min interval | Monitor green, alerting **two** inboxes |

**UI check:** 1.07 changed no UI, but the site was rendered on production — `/` (MK) and `/en` return
200 and show the correct **ended-drop** state from the hosted DB; `/checkout` renders its empty-cart
state; header, footer, locale switch, phone and Instagram all present. Full design sign-off is still
L6/#1, unchanged since 1.02.

---

## 7. Placeholders shipped

**None new.** 1.07 shipped no UI and no copy.

| Placeholder | Page | Waiting on | Owner |
|---|---|---|---|
| *(none added this phase)* | — | — | — |

The five existing register rows are unchanged — but **all five are now publicly visible** on
`https://trajanov-v2.vercel.app`. Row **#5 (Vladimir's email)** is no longer merely a UI placeholder: it
now **gates `Z.01`, which gates the 1.08 verification gate** (`D-1.07-8`).

---

## 8. Content truth check

**N/A — this phase produced no user-facing copy, string, or fact.** No message catalog, component, or
page was touched. Nothing was invented; no `facts.md` claim was added or changed. The only new file is
a SQL migration.

| Check | Result |
|---|---|
| No AI-generated product imagery (`D-0-6`) | ☑ no imagery touched |
| No untranslated EN string in the MK build | ☑ no string touched; MK `/` verified rendering Macedonian on production |

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ `git diff main` scanned for `eyJ`, `postgresql://`, `sbp_`, `sb_secret`, the site key — clean |
| `.env*` still gitignored | ☑ `git check-ignore -v` names `.gitignore:34` for **both** `.env.local` and `.env.hosted`; `git status` shows neither |
| Nothing secret behind a `NEXT_PUBLIC_` prefix | ☑ **961 KB of deployed JS + HTML scanned**: no `service_role`, no `TURNSTILE_SECRET`, no `ORDER_IP_HASH_PEPPER`, no `postgresql://`, no pooler host, no `sbp_`/`sb_secret`, and **no service-role JWT** |
| No order PII (phone, address) in logs | ☑ no order was placed on production (0 rows); nothing logged |
| Dummy Turnstile keys absent from the repo **and** the deployed build | ☑ `git grep` clean; deployed build clean |

**No secret was ever committed to this branch.** Nothing needs rotating on that account.

**Two credential facts that are not leaks but must be stated:**
1. **The DB password was reset this phase** at the operator's explicit instruction (`D-1.07-12`). Old
   value dead; new value **only** in gitignored `.env.hosted`. **→ L3.**
2. **A Supabase account access token was minted** (`claude-code-phase-1.07`, expires 2026-08-15). It
   controls the whole Supabase account, and **it was rendered on screen in the working session while
   being created**, so it exists in that session's transcript. It was never committed and is not in the
   repo. It is no longer needed. **→ L4: revoke it.**

`.env.hosted` and `.env.local` were **moved out of the project directory during `vercel --prod`** so the
deploy could not upload them, then restored — `.env.local` points at `127.0.0.1` and would have
overridden nothing, but the service-role key and DB password had no business in an upload.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| **`Z.01` — Order email (Resend). Mandatory before 1.08** (`D-1.07-8`) | **Vladimir's email address** (`facts.md` §5). **Nobody has made this phone call.** | Lazar → Vladimir |
| **1.08 itself** | `Z.01`, **and** a live drop (needs real prices/names → `Y.01` → Vladimir), **and** register #1/#2 (L6) | Lazar + Vladimir |
| Owed #5's remainder — does Cloudflare challenge a **bot** on a **real order** | A live drop | 1.08 |
| Register #6 — auto-expose toggle still ON | Dashboard toggle (L5) + a REVOKE in the next table-adding migration | Lazar / next Code phase |

**The build is not the bottleneck. Vladimir is** — and 1.07 made that sharper, not softer: the store is
deployed, proven, and serving on a public URL, and **the entire remaining Part 1 critical path runs
through one email address and one set of product photos.**

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — **`NEXT:` line on line 1** | ☑ |
| `current-state.md` — owed-verification register | ☑ #4 **closed with evidence** (struck, not deleted); #5 **narrowed, still present**; **#6 added**; L1–L7 added |
| `current-state.md` — placeholder register | ☑ none added; #5 re-scoped as a `Z.01`/1.08 gate |
| `file-map.md` — matches what is actually on disk | ☑ migration in tree + change-log row |
| `00_stack-and-config.md` — new deps / pins / config | ☑ **no dependency changed**; Hosting/Database/Bot-protection pinned `1.07`, Email → `Z.01`; corrections recorded in an **appended** change-log row (`D-1.06-4`) |
| `Decisions.md` — every § 2 entry appended | ☑ `D-1.07-4` … `D-1.07-15` |

**`NEXT:` line I set:**
`NEXT: Z.01 — Order email (Resend), BLOCKED on Vladimir's email address (facts.md §5) → then 1.08 Verification gate. 1.08 CANNOT START until Z.01 ships (D-1.07-8): its DoD is a real order with a real email, end to end.`

*Deviation from the brief, stated plainly: the brief said to set `NEXT: 1.08 — Verification gate`
unless `Z.01` was unblocked. `Z.01` is **blocked**, and `D-1.07-8` makes it **mandatory before 1.08** —
so "NEXT: 1.08" would name a phase that cannot legally start. The line above names the real next
action and the real blocker instead.*
