# Barber Booking Monorepo

A full-stack booking platform for barbershops — customers book appointments online, barbers manage their schedule and availability, and shop owners get a simple admin view of bookings.

## Overview

This repository contains the backend services and frontend files for a barber booking platform, including:

- user authentication and registration
- barber and service management
- appointment-related API routes
- shared TypeScript types across packages

## Repository structure

.
├── apps/
│ └── backend-api/ # Express + TypeScript API
└── frontend
├── packages/
│ └── shared-types/ # Shared TypeScript types
├── package.json
└── README.MD

````

## Tech stack

**Frontend**
- Next.js
- TypeScript
- Tailwind CSS

**Backend**
- Express.js
- PostgreSQL
- Prisma-style SQL migrations
- JWT authentication
- bcrypt
- Vitest
- Stripe

### Shared package
- TypeScript
- reusable domain types

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm

## Getting started

### 1. Install dependencies

From the repository root:

```bash
npm install
````

### 2. Configure environment variables

Create an environment file at `apps/backend-api/.env`:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
PORT=5001
JWT_SECRET=your-secret-key
```

### 3. Run database migrations

```bash
cd apps/backend-api
npm run db:migrate
```

### 4. Start the backend API

```bash
npm run dev --workspace=apps/backend-api
```

The API will start on:

- http://localhost:5001

### 5. Health check

You can verify the server and database connection with:

```bash
curl http://localhost:5001/health
```

## API highlights

The backend currently exposes routes for:

- authentication: `/api/auth`
- barbers: `/api/barber`
- services and appointment-related endpoints (via the backend service layer)

## Scripts

From the repository root:

```bash
npm run dev:backend
npm run build:all
```

## Roadmap

- [ ] Add a frontend client
- [ ] Expand appointment booking flow
- [ ] Improve admin and dashboard features
- [ ] Add automated integration tests for the API
