# Database Connection & Migration Guide

How this project handles PostgreSQL connections, migrations, and environment safety — ready to replicate in new projects (minus MinIO).

---

## Table of Contents

1. [Stack Overview](#stack-overview)
2. [Local Development Setup](#local-development-setup)
3. [Prisma Client (Singleton Pattern)](#prisma-client-singleton-pattern)
4. [Migration System](#migration-system)
5. [Build & Deploy Pipeline](#build--deploy-pipeline)
6. [Baseline Script](#baseline-script)
7. [Destructive Command Guard](#destructive-command-guard)
8. [npm Scripts Reference](#npm-scripts-reference)
9. [Environment Variables](#environment-variables)
10. [Replication Checklist (New Project)](#replication-checklist-new-project)

---

## Stack Overview

| Component        | Technology              |
| ---------------- | ----------------------- |
| Database         | PostgreSQL 16 (Alpine)  |
| ORM              | Prisma 6.x             |
| Framework        | Next.js 16              |
| Runtime          | Node.js                 |
| Local infra      | Docker Compose          |
| Production host  | Vercel (or any Node host) |

---

## Local Development Setup

### Docker Compose (PostgreSQL only)

`docker-compose.yml` runs PostgreSQL locally:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: my-project-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: my_database
    ports:
      - "5434:5432"   # host:container — uses 5434 to avoid conflicts with local postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Start it:

```bash
docker-compose up -d
```

### Dev Startup Script

`scripts/start-dev.js` automates everything:

1. Starts Docker containers via `docker-compose up -d`
2. Checks if port 3000 is occupied and kills any blocking process
3. Starts the Next.js dev server

```bash
npm run dev:all    # runs: node scripts/start-dev.js
```

Cross-platform compatible (Windows, macOS, Linux).

---

## Prisma Client (Singleton Pattern)

File: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

**Key points:**

- **Singleton via `globalThis`** — prevents connection pool exhaustion during Next.js hot reloads in development.
- **Conditional logging** — verbose in dev (`query`, `error`, `warn`), minimal in prod (`error` only).
- **Generated client output** — configured to `src/generated/prisma` (not default `node_modules`), set in `schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- **`postinstall` hook** — `prisma generate` runs automatically after `npm install` so the client is always up to date.

---

## Migration System

### How It Works

We use **Prisma Migrate** with SQL-based migration files stored in `prisma/migrations/`.

**Development workflow:**

```bash
# 1. Edit prisma/schema.prisma
# 2. Create a new migration:
npm run db:migrate:dev
# This prompts for a name, generates SQL, and applies it locally.
```

**Production workflow:**

```bash
# Runs pending migrations (non-interactive, no data loss):
prisma migrate deploy
```

### Migration Files Structure

```
prisma/
  schema.prisma
  seed.ts
  migrations/
    00000000000000_baseline/
      migration.sql
    20260222000000_add_project_fields/
      migration.sql
    20260223195000_add_homepage_project_slot/
      migration.sql
    ...
    migration_lock.toml
```

Each folder contains a `migration.sql` with raw SQL. Prisma tracks which migrations have been applied in the `_prisma_migrations` table.

### The Baseline Migration

The first migration (`00000000000000_baseline`) contains the full initial schema. If the database was previously managed with `prisma db push` (no migration history), the baseline script marks it as already applied — see [Baseline Script](#baseline-script).

---

## Build & Deploy Pipeline

The `build` script in `package.json` chains everything:

```json
"build": "prisma generate && node scripts/prisma-baseline.mjs && prisma migrate deploy && next build"
```

Step by step:

1. **`prisma generate`** — Regenerate the Prisma client from `schema.prisma`
2. **`node scripts/prisma-baseline.mjs`** — Mark baseline migration as applied (idempotent, safe to run every time)
3. **`prisma migrate deploy`** — Run any pending migrations against the production database
4. **`next build`** — Build the Next.js application

This means **every deploy automatically applies new migrations** before the app starts.

---

## Baseline Script

File: `scripts/prisma-baseline.mjs`

### The Problem It Solves

When transitioning from `prisma db push` (schema-only, no migration history) to `prisma migrate deploy` (migration-based), production databases already have the schema but no record of migrations. Running `migrate deploy` would try to re-apply the baseline and fail with a **P3005 error**.

### What It Does

1. Reads all migration folders from `prisma/migrations/`
2. Finds the `00000000000000_baseline` migration specifically
3. Runs `prisma migrate resolve --applied "00000000000000_baseline"` to mark it as already applied
4. If it's already tracked, silently skips (idempotent)

**Only the baseline migration is marked.** All subsequent migrations run normally via `prisma migrate deploy`.

### To Replicate

Copy `scripts/prisma-baseline.mjs` to your new project. Update the baseline migration name if yours differs. Add it to your build script before `prisma migrate deploy`.

---

## Destructive Command Guard

File: `scripts/destructive-db-guard.mjs`

Prevents accidental data loss by blocking `db:reset` and `db:setup` in production.

### Protection Layers

**1. Environment check** — Blocks if any of these equal `"production"` or `"prod"`:

- `NODE_ENV`
- `APP_ENV`
- `ENVIRONMENT`
- `VERCEL_ENV`

**2. Database host check** — Blocks if `DATABASE_URL` host is not local. Allowed hosts:

```
localhost, 127.0.0.1, ::1, postgres, db, <container-name>
```

Override with: `ALLOW_REMOTE_DESTRUCTIVE_DB_COMMANDS=I_UNDERSTAND_REMOTE_DB_RISK`

**3. Explicit confirmation** — Always requires:

```
ALLOW_DESTRUCTIVE_DB_COMMANDS=I_UNDERSTAND_AND_ACCEPT_DATA_LOSS
```

### Usage in npm Scripts

```json
"db:setup": "node scripts/destructive-db-guard.mjs db:setup && prisma db push --accept-data-loss && ...",
"db:reset": "node scripts/destructive-db-guard.mjs db:reset && prisma migrate reset --force"
```

The guard runs first. If it fails (exits non-zero), the destructive command never executes.

### To Replicate

Copy `scripts/destructive-db-guard.mjs` to your new project. Update the `LOCAL_DATABASE_HOSTS` set to include your container name.

---

## npm Scripts Reference

| Script            | Command                                          | When to Use                          |
| ----------------- | ------------------------------------------------ | ------------------------------------ |
| `dev`             | `next dev`                                       | Start dev server (DB must be running) |
| `dev:all`         | `node scripts/start-dev.js`                      | Start Docker + dev server together   |
| `build`           | `prisma generate && baseline && migrate && next build` | Production builds                    |
| `postinstall`     | `prisma generate`                                | Auto-runs after `npm install`        |
| `db:generate`     | `prisma generate`                                | Regenerate Prisma client             |
| `db:push`         | `prisma db push`                                 | Quick schema sync (dev only)         |
| `db:migrate`      | `prisma migrate deploy`                          | Apply pending migrations (prod-safe) |
| `db:migrate:dev`  | `prisma migrate dev`                             | Create new migration (dev only)      |
| `db:seed`         | `tsx prisma/seed.ts`                             | Populate sample data                 |
| `db:studio`       | `prisma studio`                                  | Web UI to browse database            |
| `db:setup`        | guard + `db push` + create admin                 | First-time local setup (destructive) |
| `db:reset`        | guard + `prisma migrate reset --force`           | Wipe & recreate (destructive)        |

---

## Environment Variables

### Required for Database

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/my_database?schema=public"
NODE_ENV=development
```

### Required for Auth

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
```

### Production

On Vercel (or your host), set `DATABASE_URL` to your production PostgreSQL connection string. Prisma reads it at build time for migrations and at runtime for queries.

---

## Replication Checklist (New Project)

### Files to Copy

```
prisma/schema.prisma          → adapt models to your domain
prisma/seed.ts                → adapt seed data
src/lib/prisma.ts             → copy as-is (update import path if needed)
scripts/prisma-baseline.mjs   → copy as-is
scripts/destructive-db-guard.mjs → update LOCAL_DATABASE_HOSTS with your container name
scripts/start-dev.js          → remove MinIO references, keep Docker + port check logic
```

### Dependencies

```bash
npm install @prisma/client prisma
npm install -D tsx
# bcryptjs only if you need password hashing for auth:
npm install bcryptjs
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:all": "node scripts/start-dev.js",
    "build": "prisma generate && node scripts/prisma-baseline.mjs && prisma migrate deploy && next build",
    "postinstall": "prisma generate",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate deploy",
    "db:migrate:dev": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:setup": "node scripts/destructive-db-guard.mjs db:setup && prisma db push --accept-data-loss",
    "db:reset": "node scripts/destructive-db-guard.mjs db:reset && prisma migrate reset --force"
  }
}
```

### docker-compose.yml (No MinIO)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: my-project-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: my_database
    ports:
      - "5434:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### .env

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/my_database?schema=public"
NODE_ENV=development
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
```

### Prisma Schema Starter

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add your models here
```

### First-Time Setup Steps

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Install dependencies (triggers postinstall → prisma generate)
npm install

# 3. Push initial schema to local database
npm run db:push

# 4. (Optional) Seed data
npm run db:seed

# 5. Start developing
npm run dev
```

### When Ready for Migrations

```bash
# Switch from db:push to migrations:
# 1. Create baseline from current schema
npx prisma migrate dev --name baseline

# 2. From now on, create migrations for every schema change:
npm run db:migrate:dev

# 3. Production deploys auto-apply via the build script
```
