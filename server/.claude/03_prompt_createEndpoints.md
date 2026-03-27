# Prompt: Add CRUD endpoints for a resource

Use this prompt to implement a complete CRUD endpoint for a new resource, following the established pattern from the Target implementation.

---

## Prompt template

```
Add full CRUD endpoints for the `<Resource>` model following the exact same pattern as the Target implementation.

Reference files to read first:
- src/controllers/target.ts       — controller pattern
- src/routes/targetRouter.ts      — router pattern
- src/controllers/index.ts        — barrel export pattern
- src/routes/index.ts             — barrel export pattern
- src/index.ts                    — route registration pattern
- src/schemas/<resource>.ts       — validation schema
- prisma/<resource>.prisma        — Prisma model fields and relations

Steps to perform:

1. Create `src/controllers/<resource>.ts` with these five handlers:
   - getAll    — findMany where { tenantId, isDeleted: false }, orderBy seq asc
   - getOne    — findFirst where { id, tenantId, isDeleted: false }, 404 if not found
   - create    — create with { ...req.body, tenantId }
   - update    — findFirst to verify ownership (404 if not found), then update where { id }
   - remove    — findFirst to verify ownership (404 if not found), then soft-delete: update { isDeleted: true }, respond 204

2. Create `src/routes/<resource>Router.ts`:
   - Import authenticate, validateZod from '#middlewares'
   - Import all five handlers from '#controllers'
   - Import the schema from '#schemas'
   - If the schema contains nested sub-resources (e.g. categories in targetSchema), omit them: schema.omit({ fieldName: true })
   - Routes:
       GET    /          → authenticate, getAll
       POST   /          → authenticate, validateZod(inputSchema), create
       GET    /:id       → authenticate, getOne
       PUT    /:id       → authenticate, validateZod(inputSchema), update
       DELETE /:id       → authenticate, remove

3. Add export to `src/controllers/index.ts`:
   export * from './<resource>.ts';

4. Add export to `src/routes/index.ts`:
   export { default as <resource>sRouter } from './<resource>Router.ts';

5. Register route in `src/index.ts`:
   import { <resource>sRouter } from '#routes';
   app.use('/<resources>', <resource>sRouter);

Rules to follow:
- All imports use the path aliases: #controllers, #middlewares, #routes, #schemas, #db
- Import prisma from '#db' (default export)
- All errors thrown as: throw new Error('message', { cause: { status: 404 } })
- req.user! is always available after authenticate (has id and tenantId)
- Relations stored as foreign-key fields in the schema (e.g. categoryId, not category object) — map schema uuid fields to Prisma FK field names when needed
- Do NOT include @ignore relation fields in create/update data
- Do NOT create new files other than the controller and router
- Do NOT modify the Prisma schema or Zod schemas
```

---

## Resource reference table

| Resource     | Schema file          | Prisma model | Schema export        | FK / special notes                                              |
|--------------|----------------------|--------------|----------------------|-----------------------------------------------------------------|
| Category     | schemas/category.ts  | Category     | categorySchema       | `targetId` FK (schema field: `target`); omit `courses`         |
| Course       | schemas/course.ts    | Course       | courseSchema         | FKs: `categoryId`, `roomId`, `instructorId`, `textTermsId`, `textInfoId`; `dates` is JSON |
| Customer     | schemas/customer.ts  | Customer     | customerSchema       | No relations                                                    |
| Instructor   | schemas/instructor.ts| Instructor   | instructorSchema     | No relations                                                    |
| Location     | schemas/location.ts  | Location     | locationSchema       | No relations                                                    |
| Module       | schemas/module.ts    | Module       | moduleSchema         | No relations                                                    |
| Registration | schemas/registration.ts | Registration | registrationSchema | No FK relations in schema                                       |
| Room         | schemas/room.ts      | Room         | roomSchema           | No FK in room schema; courses are @ignore                       |
| Text         | schemas/text.ts      | Text         | textSchema           | Course relations are @ignore on Text side                       |
| User         | schemas/user.ts      | User         | userSchema           | Special: also needs auth endpoints (see note below)             |

---

## Schema → Prisma field name mapping

Some Zod schemas use shorthand names that differ from the Prisma FK field names.
Map these when building `create`/`update` data objects:

| Schema field  | Prisma FK field   | Model    |
|---------------|-------------------|----------|
| `target`      | `targetId`        | Category |
| `category`    | `categoryId`      | Course   |
| `room`        | `roomId`          | Course   |
| `instructor`  | `instructorId`    | Course   |
| `textTerms`   | `textTermsId`     | Course   |
| `textInfo`    | `textInfoId`      | Course   |

Example for Course controller create:
```ts
const { category, room, instructor, textTerms, textInfo, ...rest } = req.body;
const course = await prisma.course.create({
  data: {
    ...rest,
    tenantId,
    categoryId: category,
    roomId: room,
    instructorId: instructor,
    textTermsId: textTerms,
    textInfoId: textInfo
  }
});
```

---

## Note on User / Auth endpoints

User CRUD is different — it requires auth-specific routes (sign-in, sign-out, token refresh).
Handle separately with dedicated endpoints rather than generic CRUD:
- `POST /auth/sign-in`   — validate credentials, issue JWT
- `POST /auth/sign-out`  — clear cookie
- `POST /auth/refresh`   — verify refresh token, issue new access token
- `GET  /users`          — list users (admin only)
- `PUT  /users/:id`      — update user profile

---

## Current state

- [x] Target — done (`/targets`)
- [x] Category — done (`/categories`)
- [x] Course — done (`/courses`)
- [x] Customer — done (`/customers`)
- [x] Instructor — done (`/instructors`)
- [x] Location — done (`/locations`)
- [x] Module — done (`/modules`)
- [x] Registration — done (`/registrations`)
- [x] Room — done (`/rooms`)
- [x] Text — done (`/texts`)
- [x] User / Auth — done (`/auth`)

---

## Implementation summary
_Completed: 2026-03-27_

All 10 resources implemented. Notable decisions:

**Naming collision fix** — All controller functions use resource-specific names (`getAllTargets`, `createCategory`, etc.) to allow a single barrel export from `src/controllers/index.ts` without conflicts. `target.ts` was updated to match and `targetRouter.ts` updated accordingly.

**FK mapping** — Handled in the controller, not the router:
- `category.ts`: `{ target, ...rest }` → `{ ...rest, targetId: target }`
- `course.ts`: `mapCourseBody()` helper maps all 5 FK fields; optional FKs only included when defined
- All other resources: direct `...req.body` spread

**orderBy** — Resources without `seq` (`customer`, `instructor`) order by `name: 'asc'` instead.

**Files created:** 9 controllers + 9 routers

**Files updated:** `target.ts`, `targetRouter.ts`, `controllers/index.ts`, `routes/index.ts`, `src/index.ts`
