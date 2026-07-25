---
project: Barber-Booking App
started: 2026-07-25
tags: [portfolio, interview-prep]
---

# Project Decisions Log

> Update this within 5 minutes of any significant build session. Don't rely on memory later — write it while it's fresh.

## How to use this

Each entry = one decision or milestone. Keep entries short. The goal is that reading this file cold, months later, is enough to reconstruct your interview walkthrough — you don't need to remember the details, just review this.

---

## Entry Template (copy this block for each new entry)

### [Date] — [Short title of the decision/milestone]

**Problem:** What were you trying to solve or build at this point?

**Decision:** What did you choose to do?

**Why:** What made you choose this over the alternatives?

**Trade-off:** What did you give up or what's the downside of this choice?

**Status:** (in progress / done / revisited later)

---

## Entries

### 2026-07-25 — Delete `barbers` rows first to avoid FK constraints (test setup)

**Problem:** Running integration tests that create and remove users and barbers caused foreign-key constraint errors when resetting database state between tests.

**Decision:** When cleaning test data in `beforeAll`, delete `barbers` rows first and then delete `users`. After deletions, reset the related sequences using `setval` so IDs return to the expected values for deterministic tests.

**Why:** The `barbers` table references `users` via `user_id`. Deleting `users` before `barbers` triggered foreign-key violations. Deleting `barbers` first preserves referential integrity during teardown.

**Trade-off:** Tests must be careful about ordering and sequence resets; the teardown is slightly more verbose and brittle if schema relationships change. This is a pragmatic test-time fix — long-term, consider using transactional tests or a dedicated test database snapshot to avoid manual cleanup ordering.

**Status:** done

---

## Master List of Key Decisions (running summary)

### 2026-07-25 — Appointment services join table: model many-to-many cleanly

**Problem:** Need to associate multiple services with a single appointment while keeping historical service prices immutable for past bookings. Using text arrays or front-end denormalization would lose historical price data and be fragile.

**Decision:** Create an `appointment_services` join table with a composite primary key (`appointment_id`, `service_id`) and store the `price_at_booking` on that join row. This preserves the exact charged price for each service-per-appointment and keeps normalized relations for efficient querying.

**Why:** A dedicated join table enforces referential integrity, makes queries performant via indexed foreign keys, and stores per-booking pricing to avoid historical price drift.

**Trade-off:** Slightly more complex schema and queries (joins required). Requires careful migration and backfill when introducing the table to existing production data. Acceptable for correctness and auditability.

**Status:** done

---

### 2026-07-25 — Sequential migration execution in custom TypeScript runner

**Problem:** The custom migration runner used `forEach` and kicked off all SQL files concurrently. Dependent tables sometimes attempted to create before their FK parents existed, causing migration failures.

**Decision:** Sort migration files alphabetically and execute them with a `for...of` loop using `await` (strict sequential execution). Keep a lightweight "applied_migrations" table as a future enhancement to make runs idempotent.

**Why:** Sequential execution guarantees parent tables are created before child tables that reference them. Alphabetical ordering plus `await` keeps the runner deterministic and simple.

**Trade-off:** Migrations run slower because they execute serially. Long-term: move to a standard migration tool (Prisma, Flyway, etc.) or implement an applied-migrations table for reliability and parallelism where safe.

**Status:** done

---

### 2026-07-25 — Remove `password_hash` from returned user rows on registration

**Problem:** Using `RETURNING *` on `users` after registration returns the `password_hash`. Returning this full row in the HTTP response would leak sensitive data.

**Decision:** Destructure the returned DB row server-side and delete `password_hash` from the object (or explicitly pick allowed fields) before sending the HTTP 201 response. Keep the hash only in server memory/storage for authentication.

**Why:** Minimizes the risk surface by ensuring hashed passwords never leave the server. Explicit whitelisting of response fields is more robust than trying to remember to delete specific fields.

**Trade-off:** Extra code to sanitize responses and ensure tests account for the missing field. This is best practice for security.

**Status:** done

---

## Master List of Key Decisions (running summary)

- [x] 2026-07-25 — Delete `barbers` rows first to avoid FK constraints (test setup)
- [x] 2026-07-25 — Appointment services join table for appointment-service modeling
- [x] 2026-07-25 — Sequential migration execution in TypeScript runner
- [x] 2026-07-25 — Remove `password_hash` before HTTP response

---

## Interview Prep Section

### The 90-second walkthrough (draft)

> Problem this project solves → your approach → one hard technical decision → what you'd do differently

_(Use the entries above to draft a concise 90-second walkthrough.)_

### Anticipated questions and your answers

- Why choose explicit teardown ordering in tests over transactional test isolation?
- How would you improve test reliability without manual sequence resets?
- What are the long-term maintenance implications of using sequence resets in tests?
