# Completion report — Part 1 Phase 03: Data layer (Supabase schema + atomic stock)

| | |
|---|---|
| **Phase** | 1.03 |
| **Name** | Data layer — Supabase schema + atomic stock |
| **Executor** | Claude Code |
| **Operator** | Petar |
| **Date** | 2026-07-15 |
| **Branch** | `phase-1.03-data-layer` |
| **PR** | #3 |
| **Brief** | `briefs/Part-1-Phase-03-Code.md` |

---

## 1. What shipped

- **Stock is now real and server-side.** Five tables (`drops` → `products` → `variants`; `orders` →
  `order_items`) in local Postgres, with stock held **per size** on `variants`.
- **`create_order()`** — the single, only path that creates an order. Decrements stock with one
  **conditional UPDATE** (`stock = stock - qty WHERE stock >= qty`), never read-then-write, in
  deterministic `variant_id` order so concurrent orders can't deadlock. Enforces the drop window,
  the 1–2 unit cap, and one-live-order-per-phone-per-drop. Snapshots the price into `order_items`.
- **`expire_reservations()`** — releases lapsed holds and returns stock **exactly once**, safe to run
  concurrently with itself.
- **RLS wall**: `orders`/`order_items` are deny-all to the anon key; the catalog is read-only public;
  both functions are `service_role`-only.
- **Typed clients + generated types**, an npm `test` + `gen:types` script, and **13 Vitest tests**
  that prove the above — headlined by the concurrency gate (10 orders vs 3 units → exactly 3 win).
- **Zero UI change.** No file under `src/app`, `src/components`, or `src/messages` was touched.

---

## 2. Decisions I made on my own

Logged in `Decisions.md`, `D-1.03-8` … `D-1.03-12` (the orchestrator's `D-1.03-1` … `D-1.03-7` were
appended verbatim first, before any code).

| ID | Decision | Alternative rejected | Downside accepted |
|---|---|---|---|
| `D-1.03-8` | **Colima** (userspace Lima VM) as the local Docker runtime, not Docker Desktop. | Docker Desktop (the brief's tool). | Deviates from the named tool; two operators may run different runtimes. Immaterial to the deliverable. |
| `D-1.03-9` | Functions are **SECURITY DEFINER**; EXECUTE revoked from **PUBLIC** (not just anon/auth) and granted to `service_role`; `service_role` is **SELECT-only** on tables. | The brief's literal "revoke from anon, authenticated" (leaves the PUBLIC hole → the anon RLS test would fail); INVOKER + broad service_role writes (reintroduces direct stock writes). | Definer bodies run as owner (superuser); must be trusted + `search_path`-pinned (they are). |
| `D-1.03-10` | Trimmed the local stack in `config.toml` (disabled studio/realtime/storage/smtp/edge/analytics). | Run the full default stack. | A later phase needing those locally must re-enable them. No hosted effect. |
| `D-1.03-11` | Error vocabulary via custom SQLSTATE **`TR001`–`TR005`** on `error.code`. | PostgREST `PT<nnn>` (hijacks HTTP status; `PT<100>` breaks the response entirely); matching messages (forbidden). | All five business errors are HTTP 400 (immaterial — 1.04 switches on `error.code`). |
| `D-1.03-12` | Tests use a **direct Postgres admin connection** for arrange/assert; behaviour is driven only through the anon/service clients. | Grant `service_role` table writes for setup (widens the privileged surface); ship test-only RPCs. | Tests are DB-integration, need a live local stack + a superuser URL. Adds `postgres` devDep. |

---

## 3. Surprises and off-spec changes

- **`Trajanov-V2-Plan.md` does not exist.** The brief's "Read first" list says to read Plan §7/§8.
  There is no plan file in the repo (only `CLAUDE.md`, `Decisions.md`, `README.md`, `brand.md`,
  `facts.md`). Not a blocker — the brief itself carried every concrete requirement — but the
  orchestrator should either commit the plan or drop the reference from future briefs.
- **Docker was not installed at all** (the brief assumes "installed and running — Lazar's step").
  Installing Docker Desktop needs the operator's admin password + a GUI licence click, impossible in
  a non-interactive session; the Homebrew cask install failed on `sudo mkdir /usr/local/bin`. Resolved
  with the operator's chosen alternative, **Colima** (`D-1.03-8`) — no sudo, no GUI.
- **The brief's grant/RLS wording would fail the brief's own RLS test.** "Revoke execute from anon,
  authenticated" is insufficient because Postgres grants EXECUTE to `PUBLIC` by default; anon would
  still execute via PUBLIC and the anon-access test (`create_order` denied) would fail. Also, local
  Supabase does not auto-expose new public tables to *any* Data API role, so a plain function called
  by `service_role` couldn't write. Both handled by `D-1.03-9` (SECURITY DEFINER + revoke from
  PUBLIC + `service_role` grants). **The brief was right about the intent; the mechanism needed to be
  stronger than its literal text.**
- **PostgREST's `PT<nnn>` SQLSTATE trap.** My first error codes (`PT001`…`PT005`) made supabase-js
  throw `TypeError: fetch failed` — PostgREST reads `nnn` as the HTTP status, and a status < 100 is an
  invalid HTTP response. Diagnosed by probing the running stack; switched to `TR001`–`TR005`
  (`D-1.03-11`). This is exactly the kind of thing that only surfaces against a real database.
- **The brief's DoD says "PR #2" for the fresh-session review; it's actually PR #3** (1.01 = #1,
  1.02 = #2, both merged). Cosmetic, flagged so nobody reviews the wrong PR.
- **Minor additions beyond the brief:** `orders.total_mkd > 0` and `order_items.unit_price_mkd > 0`
  CHECK constraints (backstops mirroring `price_mkd > 0`), and a per-item `quantity >= 1` guard inside
  `create_order` (the total-cap check alone would let a `{qty:0}` item through). Also a new file,
  `src/lib/orders/order-errors.ts`, documenting the error vocabulary for TypeScript callers.

---

## 4. Files touched

`file-map.md` updated: **yes**.

| File | A/M/D |
|---|---|
| `supabase/config.toml`, `supabase/.gitignore` | Added (`supabase init`) |
| `supabase/seed.sql` | Added |
| `supabase/migrations/20260715021215_schema.sql` | Added |
| `supabase/migrations/20260715021216_create_order.sql` | Added |
| `supabase/migrations/20260715021217_expire_reservations.sql` | Added |
| `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts` | Added |
| `src/lib/orders/order-errors.ts` | Added |
| `src/types/database.ts` | Added (generated) |
| `vitest.config.ts`, `tests/setup.ts`, `tests/helpers/db.ts` | Added |
| `tests/concurrency/{oversell,expiry}.test.ts` | Added |
| `tests/rls/anon-access.test.ts`, `tests/orders/create-order.test.ts` | Added |
| `package.json`, `package-lock.json` | Modified (deps + scripts) |
| `.env.example` | Modified (added `SUPABASE_DB_URL` name) |
| `Decisions.md`, `current-state.md`, `file-map.md`, `00_stack-and-config.md` | Modified (state) |
| `.gitkeep` in `supabase/migrations`, `tests/concurrency`, `src/lib/{supabase,orders}`, `src/types` | Deleted (dirs now populated) |
| `.env.local` | Added — **gitignored**, not committed |

---

## 5. Tests run + results

| Test | Command | Result |
|---|---|---|
| Build | `npm run build` | **exit 0** (6 routes, unchanged from 1.02) |
| Types | `npx tsc --noEmit` | **exit 0** (0 errors) |
| Lint | `npm run lint` | **exit 0** (0 errors, 0 warnings) |
| Unit / integration | `npm test` | **exit 0 — 4 files, 13 tests passed** |

`supabase db reset` from scratch (raw):

```
Seeding globals from roles.sql...
Applying migration 20260715021215_schema.sql...
Applying migration 20260715021216_create_order.sql...
Applying migration 20260715021217_expire_reservations.sql...
Seeding data from supabase/seed.sql...
Finished supabase db reset on branch phase-1.03-data-layer.
```

`npm test` (verbose, raw):

```
 ✓ tests/orders/create-order.test.ts > ... > creates an order: returns TRJ-#### + snapshotted total, decrements stock 46ms
 ✓ tests/orders/create-order.test.ts > ... > rejects an order before starts_at with drop_not_open (D-1.03-7) 12ms
 ✓ tests/orders/create-order.test.ts > ... > rejects an unknown drop with drop_not_found 10ms
 ✓ tests/orders/create-order.test.ts > ... > rejects more than 2 total units with quantity_cap_violated 10ms
 ✓ tests/orders/create-order.test.ts > ... > rejects a second live order from the same phone with duplicate_phone, and keeps stock intact 31ms
 ✓ tests/concurrency/oversell.test.ts > ... > 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0 46ms
 ✓ tests/concurrency/expiry.test.ts > ... > expires an elapsed order, returns its stock exactly once, and a second sweep is a no-op 32ms
 ✓ tests/concurrency/expiry.test.ts > ... > two concurrent sweeps do not double-return stock 16ms
 ✓ tests/rls/anon-access.test.ts > ... > cannot read orders (PII) 10ms
 ✓ tests/rls/anon-access.test.ts > ... > cannot read order_items (PII) 4ms
 ✓ tests/rls/anon-access.test.ts > ... > CAN read variants (the catalog must stay browsable) 4ms
 ✓ tests/rls/anon-access.test.ts > ... > cannot UPDATE variants stock (no anon write path exists) 7ms
 ✓ tests/rls/anon-access.test.ts > ... > cannot call create_order (execute revoked from anon) 5ms

 Test Files  4 passed (4)
      Tests  13 passed (13)
```

### Concurrent-order test — 10 simultaneous orders / 3 units — **MANDATORY**

| | |
|---|---|
| **exactly 3 succeeded, 7 rejected: YES** | with **all 7** carrying the insufficient-stock identifier |
| Test file | `tests/concurrency/oversell.test.ts` |
| Distinct phone per attempt? | **YES** — `+3897` + zero-padded index 0…9, asserted distinct in-test |

**First, watched FAILING against a deliberately naive read-then-write `create_order` (raw):**

```
 ❯ tests/concurrency/oversell.test.ts (1 test | 1 failed)
     × 10 simultaneous orders against 3 units → exactly 3 succeed, 7 rejected with insufficient_stock, stock 0
AssertionError: expected 10 to be 3 // Object.is equality
- Expected  + Received
- 3
+ 10
```
(The naive version let **all 10** orders through against 3 units — the exact oversell the review gate
exists to catch.)

**Then the atomic version — raw numeric dump of the 10-vs-3 race (one-off script, not committed):**

```
distinct phones used: 10 of 10
succeeded          : 3
failed             : 7
failure breakdown  : {"TR004 insufficient_stock":7}
final variant stock: 0
orders rows        : 3
sum(order_items.qty): 3
```

**The decrement statement (quoted per DoD — no read-then-write):**

```sql
update public.variants
  set stock = stock - v_qty
  where id = v_variant_id and stock >= v_qty;
-- get diagnostics via `if not found then raise 'insufficient_stock'`
```

---

## 6. Definition of Done

### Verified here (by me)

| Item | Result |
|---|---|
| `docker info` succeeds; local stack up | ☑ via Colima (`D-1.03-8`) |
| `supabase db reset` applies all migrations + seed from scratch, no manual step | ☑ |
| `npm run build` | ☑ exit 0 |
| `npx tsc --noEmit` — 0 errors | ☑ |
| `npm run lint` — 0 errors, 0 warnings | ☑ |
| `npm test` | ☑ 13 passed |
| **10 orders / 3 units → exactly 3 succeed, 7 insufficient_stock, stock 0** (raw output above) | ☑ |
| The 10 used **distinct** phone numbers | ☑ asserted in-test |
| Expiry returns stock exactly once, incl. concurrent-with-itself | ☑ |
| Order before `starts_at` rejected by the DB | ☑ (`drop_not_open`) |
| anon: orders/order_items unreadable; variants readable; `update variants` fails; `create_order` denied | ☑ all 5 asserted |
| `create_order()` has **no read-then-write** on stock (statement quoted) | ☑ |
| Variant updates in deterministic `variant_id` order | ☑ `order by (e->>'variant_id')::uuid` |
| `server.ts` starts with `import "server-only"`; importing from a client component **fails the build** | ☑ — verified: a temp client component importing it failed `npm run build` with *"'server-only' cannot be imported from a Client Component module"*; temp file removed |
| Nothing secret behind `NEXT_PUBLIC_` | ☑ only URL + anon key (both public) |
| `git status` clean of `.env*`; `.env.example` has names only | ☑ `.env.local` gitignored |
| **Zero UI change** — no diff under `src/app`/`src/components`/`src/messages` | ☑ (git status confirms no tracked change and no new files there) |
| `D-1.03-1…7` appended verbatim, attributed to orchestrator; my own from `D-1.03-8` | ☑ |
| Full `create_order` error vocabulary documented (migration + here) | ☑ (see §7 table) |

### Owed to Lazar

| # | Item | Steps | "Pass" looks like |
|---|---|---|---|
| 1 | **Fresh-session review of PR #3** (`D-0-3`) — **a downgrade on a real review gate**, not an equal substitute. | A Claude Code session that did NOT write this reviews PR #3 vs the brief. | Reviewer confirms the atomic decrement, RLS, and the concurrency test are sound; no oversell path. |
| 2 | **Hosted-Supabase parity** (`D-1.03-5`) — everything is proven local-only. | In 1.07: create the hosted project, apply migrations, re-run the RLS assertions against it. | Migrations apply; anon can't read orders; `create_order` works via the server client. |
| 3 | *(optional, not a gate)* Lazar re-runs `npm test` on **Docker Desktop** to confirm runtime parity. | `supabase start` + `npm test` on Lazar's machine. | 13 pass. (The SQL is runtime-agnostic, so this is confirmation, not risk.) |

---

## 7. Placeholders shipped

**None.** This phase rendered nothing, so no `[PLACEHOLDER: …]` was added to any page. The placeholder
register in `current-state.md` is unchanged. Seed data uses invented fixtures (`test-` slugs) that are
never rendered — they are not placeholders and are not in the register.

**Full `create_order` error vocabulary** (documented in the migration header + `src/lib/orders/order-errors.ts`):

| `error.code` | identifier (`error.message`) | meaning |
|---|---|---|
| `TR001` | `drop_not_found` | no drop with that slug |
| `TR002` | `drop_not_open` | `now()` outside `[starts_at, ends_at]` (`D-1.03-7`) |
| `TR003` | `quantity_cap_violated` | total units across the order not in 1..2 |
| `TR004` | `insufficient_stock` | a variant had fewer units than requested (also: unknown variant) |
| `TR005` | `duplicate_phone` | a live order already exists for this phone in this drop (`D-1.03-4`) |

---

## 8. Content truth check

*(No user-facing copy or facts produced this phase — zero UI. Seed fixtures are `test-`-prefixed and
never rendered.)* No rendered claims, no invented facts, no AI imagery, no strings shipped.

---

## 9. Secrets check

| Check | Result |
|---|---|
| No key, token, email, or credential in any committed file | ☑ |
| `.env*` still gitignored (`.env.local` present, ignored) | ☑ |
| Nothing secret behind `NEXT_PUBLIC_` | ☑ (only URL + anon key, public by design) |
| No order PII (phone, address) in logs | ☑ (no logging of order data anywhere) |

**No secret was committed at any point in this branch.** The values in `.env.local` are Supabase's
**shared-default local dev keys** (identical on every local install — the CLI prints "API keys and JWT
secrets are shared defaults"), and the file is gitignored regardless. No real/hosted key exists yet
(`D-1.03-5`); none was created.

**Build-time advisory (not a secret, flagged for honesty):** `npm audit` reports 2 moderate
advisories in `postcss@8.4.31`, pulled transitively by `next@16.2.10` (build-time CSS processing).
**Pre-existing** — not introduced by this phase's deps (vitest's postcss is 8.5.19, unaffected). The
suggested "fix" downgrades Next to 9.3.3 (catastrophic), so it was **not** applied.

---

## 10. Blocked / carryover

| Item | Waiting on | Owner |
|---|---|---|
| Scheduling `expire_reservations()` (pg_cron / Vercel cron) | 1.04 (by scope) | — |
| Turnstile, IP rate-limit, config→DB sync, server drop-state | 1.04 (by scope) | — |
| Hosted Supabase project + real keys | 1.07 (by `D-1.03-5`) | Lazar/Vladimir |

Nothing was left undone within 1.03's scope.

---

## 11. State updated

| File | Done |
|---|---|
| `current-state.md` — `NEXT:` on line 1 | ☑ `NEXT: 1.04 — Drop engine …` |
| `current-state.md` — owed-verification register | ☑ (added #3 review, #4 hosted parity) |
| `current-state.md` — placeholder register | ☑ (no change — none shipped) |
| `file-map.md` — matches disk | ☑ |
| `00_stack-and-config.md` — new deps / pins / config | ☑ |
| `Decisions.md` — `D-1.03-1…12` | ☑ |

**`NEXT:` line I set:** `NEXT: 1.04 — Drop engine (config→DB sync, server drop-state, schedule expire_reservations, Turnstile, IP rate-limit)`
