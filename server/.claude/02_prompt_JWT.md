# JWT Implementation Plan — Access + Refresh Tokens

## Overview

Implement stateful JWT auth with two tokens:
- **Access token** — short-lived (15 min), httpOnly cookie, used by `authenticate` middleware
- **Refresh token** — long-lived (7 days), httpOnly cookie, hashed value stored in DB for revocation

Both tokens are delivered and read as **httpOnly cookies** (already established in `authenticate.ts`).

---

## Token payloads

```ts
// access token  (signed with ACCESS_JWT_SECRET, expires 15m)
{ sub: user.id, tenantId: user.tenantId }

// refresh token  (signed with REFRESH_JWT_SECRET, expires 7d)
{ sub: user.id }
```

---

## Files to create or modify

### 1. `prisma/user.prisma` — add refreshToken field

Add one field to the User model:
```prisma
refreshToken String? // bcrypt hash of the current refresh token; null = logged out
```
Run `prisma migrate dev --name add-refresh-token` after the change.

---

### 2. `src/schemas/user.ts` — add missing schema exports

The router (`auth.route.ts`) imports `loginSchema` and `registerSchema` — these don't exist yet.

Add:
```ts
// registerSchema = full user input (firstName, lastName, email, password)
export const registerSchema = userSchema.pick({
  firstName: true, lastName: true, email: true, password: true
});

// loginSchema = email + password only
export const loginSchema = userSchema.pick({ email: true, password: true });
```

Remove the existing `signInSchema` export (it's superseded by `loginSchema`).
Update `src/schemas/index.ts` to export the new names.

---

### 3. `src/middlewares/index.ts` — export validateBodyZod alias

`auth.route.ts` imports `validateBodyZod` but the middleware is named `validateZod`.
Add an alias export so the route works without modification:
```ts
export { default as validateBodyZod } from './validateZod.ts';
```

---

### 4. `src/controllers/auth.ts` — implement all five handlers

Read these reference files first:
- `src/middlewares/authenticate.ts`  — cookie name (`accessToken`), error pattern
- `src/db/index.ts`                  — how to import prisma
- `src/schemas/user.ts`              — schema shapes

Import pattern:
```ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '#db';
```

Environment variables (fail fast at module load if missing):
```ts
const ACCESS_SECRET  = process.env.ACCESS_JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_JWT_SECRET!;
if (!ACCESS_SECRET || !REFRESH_SECRET) { console.error('Missing JWT secrets'); process.exit(1); }
```

Cookie helper — use for both tokens:
```ts
const COOKIE_OPTS = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } as const;
```

#### `register` handler
1. Check no existing user with same email+tenantId → 409 if exists
2. Hash password: `bcrypt.hash(password, 10)`
3. `prisma.user.create({ data: { firstName, lastName, email, password: hash, tenantId } })`
4. Issue tokens (see issueTokens below)
5. `res.status(201).json({ id, email, firstName, lastName })`

> Note: Where does `tenantId` come from on register? Two options:
> - Pass it in the request body (add to registerSchema) — simpler for now
> - Look it up from the Customer table by domain — future enhancement
> **Use request body for now.** Add `tenantId: z.string()` to `registerSchema`.

#### `login` handler
1. Find user: `prisma.user.findFirst({ where: { email, tenantId, isDeleted: false } })`
2. If not found → 401 generic "Invalid credentials" (never reveal which field is wrong)
3. `bcrypt.compare(password, user.password)` → 401 if false
4. Issue tokens
5. `res.json({ id, email, firstName, lastName })`

#### `refresh` handler
1. Read `req.cookies.refreshToken`
2. If missing → 401
3. `jwt.verify(token, REFRESH_SECRET)` → get `decoded.sub` (userId)
4. Load user from DB: `prisma.user.findFirst({ where: { id, isDeleted: false } })`
5. If not found OR `user.refreshToken` is null → 401
6. `bcrypt.compare(token, user.refreshToken)` — verify the raw token against stored hash
7. If mismatch → 401 (token reuse after logout or rotation)
8. Issue new access token only (rotate refresh token too for extra security)
9. `res.json({ ok: true })`

#### `logout` handler
1. Read `req.cookies.refreshToken`
2. If present, find user and set `refreshToken: null` in DB
3. Clear both cookies: `res.clearCookie('accessToken').clearCookie('refreshToken')`
4. `res.status(204).send()`

#### `me` handler
1. Protected: require `authenticate` middleware on the route (add it in the router)
2. Load user: `prisma.user.findFirst({ where: { id: req.user!.id, isDeleted: false } })`
3. Return `{ id, email, firstName, lastName, modules, imageUrl }` — never return password

#### `issueTokens` helper (internal, not exported)
```ts
async function issueTokens(user: { id: string; tenantId: string }, res: Response) {
  const accessToken  = jwt.sign({ sub: user.id, tenantId: user.tenantId }, ACCESS_SECRET,  { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id },                          REFRESH_SECRET, { expiresIn: '7d'  });
  const hash = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hash } });
  res.cookie('accessToken',  accessToken,  { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
}
```

---

### 5. `src/controllers/index.ts` — add auth exports

```ts
export * from './auth.ts';
```

---

### 6. `src/routes/auth.route.ts` — add authenticate to `/me`

The `/me` route needs the `authenticate` middleware (currently missing):
```ts
authRouter.get('/me', authenticate, me);
```

---

### 7. `src/routes/index.ts` — export authRouter

```ts
export { default as authRouter } from './auth.route.ts';
```

---

### 8. `src/index.ts` — register route

```ts
import { authRouter, targetsRouter } from '#routes';
app.use('/auth', authRouter);
```

---

### 9. `.env` / `.env.example` — add missing variables

```
ACCESS_JWT_SECRET=your-access-secret-here
REFRESH_JWT_SECRET=your-refresh-secret-here
NODE_ENV=development
```

---

## Implementation order

1. Add `refreshToken` to `prisma/user.prisma` → run migration
2. Fix `src/schemas/user.ts` (add `loginSchema`, `registerSchema`)
3. Fix `src/middlewares/index.ts` (add `validateBodyZod` alias)
4. Create `src/controllers/auth.ts`
5. Add export to `src/controllers/index.ts`
6. Update `src/routes/auth.route.ts` (add `authenticate` to `/me`)
7. Export authRouter from `src/routes/index.ts`
8. Register `/auth` in `src/index.ts`
9. Add env vars

---

## Implementation summary ✓
_Completed: 2026-03-27_

All 9 steps executed. Notable deviations from the original plan:

| # | File | Status | Notes |
|---|------|--------|-------|
| 1 | `prisma/user.prisma` | ✓ | `refreshToken String?` added |
| 1 | `prisma/migrations/20260327142257_add_refresh_token` | ✓ | Migration run and applied |
| 1 | `prisma/schema.prisma` | ✓ | Disabled broken `prisma-zod-generator` (not installed) |
| 2 | `src/schemas/user.ts` | ✓ | Added `registerSchema` (with `tenantId`), `loginSchema`; kept `signInSchema` as alias |
| 3 | `src/schemas/index.ts` | ✓ | Also removed junk `import e from 'cors'` and duplicate `target.ts` export |
| 4 | `src/middlewares/index.ts` | ✓ | `validateBodyZod` alias added |
| 5 | `src/controllers/auth.ts` | ✓ | Full rewrite of MongoDB implementation; timing-safe dummy hash on login |
| 5 | `src/controllers/index.ts` | — | Already had `export * from './auth.ts'` |
| 6 | `src/routes/auth.route.ts` | ✓ | Added `authenticate` to `/me` |
| 7 | `src/routes/index.ts` | ✓ | Added `authRouter` export |
| 8 | `src/index.ts` | ✓ | `authRouter` import added (`app.use('/auth', …)` was already there) |
| 9 | `.env.example` | — | `ACCESS_JWT_SECRET`, `REFRESH_JWT_SECRET`, `SALT_ROUNDS` already present |

**Decisions made during implementation:**
- `SALT_ROUNDS` read from `process.env.SALT_ROUNDS` (already in `.env.example` as `2` for dev speed)
- `login` does NOT filter by `tenantId` — users log in by email only across tenants (tenantId is embedded in the JWT after lookup)
- `logout` nulls `refreshToken` via `updateMany` (no unique constraint on id needed for this call)
- `prisma-zod-generator` disabled — Zod schemas are handwritten in `src/schemas/`

**Endpoints live:**
```
POST   /auth/register   body: { firstName, lastName, email, password, tenantId }
POST   /auth/login      body: { email, password }
POST   /auth/refresh    (reads refreshToken cookie)
DELETE /auth/logout     (reads refreshToken cookie)
GET    /auth/me         (requires accessToken cookie)
```

---

## Security notes

- Never return `password` or `refreshToken` in any response
- Use generic error messages for auth failures (don't hint which field is wrong)
- `bcrypt.compare` is timing-safe — do not short-circuit on missing user without still calling compare (or use a dummy hash)
- httpOnly + sameSite cookies prevent XSS and CSRF token theft
- Stored refresh token hash enables single-session invalidation on logout
