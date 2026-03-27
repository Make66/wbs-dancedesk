# WBS DanceDesk — Server Analysis
_Generated: 2026-03-27_

## Project Overview

Express + TypeScript REST API backend for a dance school management system (Tanzschule).
Currently migrating from a MongoDB/Mongoose architecture to PostgreSQL + Prisma.

**Stack:** Express 5, TypeScript, Prisma 7 (PrismaPg adapter), Zod 4, JWT auth, PostgreSQL

---

## Data Model (Prisma)

All models share common multi-tenant fields: `id` (cuid), `tenantId`, `createdAt`, `updatedAt`, `isDeleted`.

| Model        | Purpose                             | Key Fields                                              |
|--------------|-------------------------------------|---------------------------------------------------------|
| User         | App users (admin/teachers)          | email (unique), password, modules[], imageUrl           |
| Customer     | The dance school itself             | name, email, logo, colors (4), address                  |
| Location     | Physical venues                     | name, address, coordinates, imageUrl, seq               |
| Room         | Rooms within a location             | name, capacity, locationId (implicit via course)        |
| Instructor   | Teachers                            | name, imageUrl, active                                  |
| Target       | Audience group (e.g. Erwachsene)    | name, icon, seq, color[2], → categories                 |
| Category     | Course category (e.g. Paare Basic)  | name, seq, color[], targetId → Target                   |
| Course       | A class offering                    | name, categoryId, dates(JSON), seats, paymentTypes[]    |
| Text         | Legal/info texts for courses        | type (0=terms, 1=info), text, → courses                 |
| Module       | UI navigation modules               | name, seq, color, active                                |
| Registration | Student course registrations        | firstName, lastName, email, phone, address              |

**Hierarchy:** Target → Category → Course → Registration

---

## Source Structure

```
src/
├── index.ts            # Express app entry — routes currently commented out
├── db/index.ts         # Prisma client init (PrismaPg adapter)
├── controllers/
│   ├── index.ts        # Exports only target (incomplete)
│   └── target.ts       # Partially written, has legacy MongoDB code mixed in
├── routes/
│   ├── index.ts        # Exports targetRouter (broken references)
│   └── targetRouter.ts # References old Post/MongoDB models — needs full rewrite
├── middlewares/
│   ├── authenticate.ts # JWT verification — OK
│   ├── errorHandler.ts # Global error handler — OK
│   ├── hasRole.ts      # BROKEN: still has MongoDB (Post.findById) code
│   └── validateZod.ts  # Zod validation wrapper — OK
├── schemas/            # Zod v4 validation schemas (12 files)
│   ├── user.ts, customer.ts, instructor.ts, location.ts
│   ├── room.ts, module.ts, registration.ts, text.ts
│   ├── target.ts, category.ts, course.ts
│   └── courseTree.ts   # Incomplete (only location + target fields)
└── types/types.d.ts    # Outdated: references Post, postSchema (MongoDB era)
```

---

## Current State: What Works vs What's Broken

### Working / OK
- Prisma schema definitions (all 12 models) — well-structured
- Zod schemas exist for most models (some have syntax errors)
- `authenticate.ts` middleware — JWT, looks correct
- `errorHandler.ts` middleware — looks correct
- `validateZod.ts` middleware — looks correct
- `db/index.ts` — Prisma client with PrismaPg adapter — OK
- Generated Prisma client in `generated/prisma/`
- Zod generation from Prisma schema (`prisma/generated/zod/`) — new, uncommitted

### Broken / Incomplete
| Area | Issue |
|------|-------|
| `src/controllers/target.ts` | Imports `TargetModel` from `@prisma/client` (doesn't exist); has MongoDB-style logic |
| `src/routes/targetRouter.ts` | References `Post`, `postSchema`, `postsRouter` — all MongoDB remnants |
| `src/routes/index.ts` | Exports `postsRouter as targetRouter` — wrong name |
| `src/middlewares/hasRole.ts` | Contains `Post.findById()` — MongoDB, must be rewritten |
| `src/types/types.d.ts` | References `Post`, `postSchema`, `postDBSchema` — all obsolete |
| `src/index.ts` | All routes commented out — app has no active endpoints |
| Zod schemas | `customer.ts`, `instructor.ts`, `room.ts` have `.optional` (missing parentheses `()`) |
| `prisma/migrations/` | Empty — no migrations ever run |
| `prisma/seed.ts` | References `prisma.admin` which doesn't exist in schema |

---

## Missing Controllers

No CRUD controllers exist except the partially broken `target.ts`.
Still needed for:
- User (auth: sign in, sign out, refresh)
- Customer
- Location
- Room
- Instructor
- Category
- Course
- Text
- Module
- Registration

---

## Architecture Patterns to Follow

Based on the existing code intent:
- **Route → Middleware (auth + validateZod) → Controller → Prisma**
- All routes under `/api/<resource>`
- JWT in Authorization header (`Bearer <token>`)
- Zod validation via `validateZod` middleware
- Soft deletes via `isDeleted` flag
- Multi-tenant via `tenantId` on all records

---

## Priority Issues (Ordered)

1. **Fix Zod schema syntax errors** — `customer.ts`, `instructor.ts`, `room.ts` (`.optional` → `.optional()`)
2. **Clean up `types.d.ts`** — remove MongoDB Post references, define proper Request user type
3. **Rewrite `hasRole.ts`** — remove MongoDB code, implement Prisma-based role check
4. **Rewrite `targetRouter.ts`** — proper Express 5 router for Target CRUD
5. **Rewrite `target.ts` controller** — complete CRUD using Prisma
6. **Wire up routes in `src/index.ts`** — uncomment/add route registration
7. **Run first migration** — `prisma migrate dev --name init`
8. **Implement remaining controllers** — one resource at a time (instructor, category, course, etc.)
9. **Fix `courseTree.ts` schema** — complete the schema
10. **Fix `prisma/seed.ts`** — align with actual schema
