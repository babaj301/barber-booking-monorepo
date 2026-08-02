# Barber Booking Monorepo

A production-grade, full-stack booking and scheduling platform for barbershops. Customers can view real-time availability, select services, and book appointments online. Barbers can securely manage their schedules, split-shifts, and availability with bulletproof double-booking protection enforced at the database layer [9.3].

## 🚀 Key Technical Highlights (Interview Reference)
This project is built with a **data-integrity-first** approach. Rather than relying solely on fragile application-layer checks, the core scheduling engine leverages native relational database mechanics to completely eliminate race conditions and double-bookings.

*   **Race-Condition Prevention:** Implements PostgreSQL **Exclusion Constraints (`EXCLUDE USING gist`)** with a custom `timerange` type [9.3]. This guarantees that even if thousands of booking requests hit the server concurrently, overlapping shifts or duplicate appointments are instantly rejected at the database level [9.3].
*   **Immutable Historical Audit Trails:** Uses an `appointment_services` join table with a snapshot of `price_at_booking`. This prevents past financial records from changing when a shop updates its current service prices.
*   **Secure-by-Design Architecture:** Enforces strict server-side sanitization, ensuring sensitive fields like `password_hash` are completely stripped from memory before ever hitting an HTTP response payload.

## 🛠️ Tech Stack

### Backend & Database Architecture
*   **Runtime:** Node.js (TypeScript) + Express.js
*   **Database:** PostgreSQL (Native custom SQL migration engine)
*   **Security:** JWT Authentication, bcrypt password hashing
*   **Testing:** Vitest (Integration & transactional state isolation testing)
*   **Payments:** Stripe API Integration

### Frontend & Shared Types
*   **Framework:** Next.js (App Router) + TypeScript
*   **Styling:** Tailwind CSS
*   **Monorepo Tooling:** Shared domain types package shared seamlessly across frontend and backend

## 📁 Repository Structure

```text
.
├── apps/
│   ├── backend-api/     # Express + TypeScript API (Core business logic)
│   └── frontend/        # Next.js Application (Client-facing dashboard)
├── packages/
│   └── shared-types/    # Shared TypeScript types used across packages
├── package.json         # Monorepo configuration workspace
└── README.md
```

## 🏗️ Core Database Architecture & Constraints

### 1. Shift & Availability Engine
To store raw time-of-day slots cleanly without arbitrary calendar dates, the project utilizes a custom type paired with a strict exclusion index to mathematically block overlapping schedules [9.3]
```

---

## 📋 Architectural Decisions Log (ADR)

### 2026-07-25 — Core Booking Engine: Race Condition & Overlap Prevention
*   **Problem:** Traditional application-layer checks (`SELECT` then `INSERT`) create a dangerous window for race conditions. If two backend threads execute the check concurrently, a barber can easily be double-booked.
*   **Decision:** Built a custom PostgreSQL `timerange` data type combined with an `EXCLUDE USING gist` constraint [9.3].
*   **Why:** Database-level atomicity completely offsets application layer latency. Overlapping times share index space, forcing the database to reject a duplicate row natively before committing [9.3].
*   **Trade-off:** Requires adding the `btree_gist` extension to the database cluster and slightly complicates raw bulk inserts.

### 2026-07-25 — Appointment Services Join Table: Immutable Financial Auditing
*   **Problem:** If a shop changes the price of a "Haircut" from $30 to $40, all historical appointments in the database would retroactively show higher revenue, corrupting past bookkeeping records.
*   **Decision:** Generated an `appointment_services` join table storing an explicit `price_at_booking` column alongside the composite key (`appointment_id`, `service_id`).
*   **Why:** Decouples historical revenue tracking from live service pricing while maintaining a fully normalized database schema.
*   **Trade-off:** Requires performing multi-table SQL joins when calculating historical shop analytics.

### 2026-07-25 — Deterministic Test Suite Data Cleanup
*   **Problem:** Running integration tests that constantly create and tear down entities consistently failed due to Active Foreign Key constraints and out-of-order deletion tracking.
*   **Decision:** Configured a strict `beforeAll` workflow that wipes data leaf-first (`barbers` then parent `users`) and forces sequence resets via `setval`.
*   **Why:** Guarantees complete database isolation between automated tests without throwing strict constraint violations.
*   **Trade-off:** Slightly slower overall test runtime execution due to explicit sequence resetting.

### 2026-07-25 — Middleware Level Sensitve Data Masking
*   **Problem:** Using standard `RETURNING *` SQL statements automatically retrieves user password hashes, increasing the danger of leaking security credentials via HTTP responses.
*   **Decision:** Created a strict destructuring filter directly within the registration response middleware layer to completely purge password data.
*   **Why:** Ensures clear zero-trust boundary limits; password hashes never cross the server network boundary.
*   **Trade-off:** Adds minor processing overhead to handle data filtering right before dispatching HTTP payloads.

---

## 🛠️ Getting Started

### 1. Install Workspace Dependencies
From the repository root:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file inside `apps/backend-api/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/barber_db?schema=public"
JWT_SECRET="your_secure_development_secret"
STRIPE_SECRET_KEY="your_stripe_test_key"
```

### 3. Run Database Migrations
Execute your custom sequential TypeScript migration runner:
```bash
npm run db:migrate --workspace=apps/backend-api
```

### 4. Start Development Servers
```bash
npm run dev
```
