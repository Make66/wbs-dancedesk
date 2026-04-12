# Authorization & Authentication — Instructor Role

## Context

The system already supports two authenticated roles: `user` (admin/staff) and `participant` (student). Instructors exist as a Prisma model with `password` and `refreshToken` fields but currently have no auth endpoints. This document describes the approach for extending the auth system so instructors can log in and access a minimal, role-scoped view of the app.

---

## Goals

- Instructors log in at the same `/login` page as admins.
- After login, instructors land on a dedicated welcome/portal area.
- Instructors can only see their assigned courses — no admin features.
- Admins and participants are unaffected.

---

## Architecture

### Role-scoped JWT

The existing JWT payload is `{ sub, tenantId, role }`. Adding `'instructor'` as a third role value is sufficient to drive all routing and access decisions downstream.

```
role: 'user' | 'participant' | 'instructor'
```

No separate token format or signing secret is needed.

### Single Login Page

The `/login` page attempts a standard user login first. If that returns 401, it silently retries with the instructor login endpoint using the same credentials. The JWT cookie set by either endpoint carries the correct role, so subsequent calls to `/auth/me` return the right profile.

### Unified `/auth/me` Endpoint

Rather than a separate `/auth/instructor-me`, the existing `me()` controller reads the `role` from the JWT and dispatches to the correct Prisma model. This keeps the frontend auth flow simple: one login call, one `me()` call.

---

## Backend Changes (`server/`)

### `src/types/types.d.ts`
Add `'instructor'` to the role union in the Express request extension:
```ts
role: 'user' | 'participant' | 'instructor'
```

### `src/controllers/auth.ts`

**Add `instructorLogin()`**
- Mirrors the existing `participantLogin()`.
- Looks up `Instructor` by `email` + `tenantId`.
- Validates password with bcrypt.
- Issues access + refresh tokens with `role: 'instructor'`.
- Stores bcrypt hash of refresh token on the Instructor record.

**Extend `me()`**
- If `req.user.role === 'instructor'`, query `prisma.instructor` and return profile including the `courses` relation.
- Otherwise, existing User query is unchanged.

### `src/routes/auth.route.ts`
Add one new route:
```
POST /auth/instructor-login  →  instructorLogin
```
No new `/instructor-me` route needed.

---

## Frontend Changes (`customerApp/`)

### `src/data/auth.ts`
Add `instructorLogin(email, password, tenantId)` that posts to `/auth/instructor-login`.

### `src/context/AuthProvider.tsx`
- Store `role` in auth state (returned from `/auth/me`).
- In `handleSignIn()`: try user login → on 401, try instructor login.
- `/auth/me` already returns the right profile after either login.

### `src/types/auth.ts`
- Add `role: 'user' | 'instructor'` to the auth user type.
- Add `InstructorUser` type (name, email, imageUrl, skills, courses).

### `src/App.tsx`
Add instructor routes nested under `InstructorLayout`:
```
/instructor          →  redirect to /instructor/courses
/instructor/courses  →  InstructorCoursesPage
```

### `src/layouts/MainLayout.tsx`
After the existing `signedIn` check, redirect instructors away from the admin area:
```ts
if (role === 'instructor') return <Navigate to="/instructor/courses" />;
```

### `src/layouts/InstructorLayout.tsx` _(new)_
- Guards: redirects non-instructors to `/`.
- Renders a minimal sidebar: "Meine Kurse" + logout.
- Outlet for instructor pages.

### `src/pages/InstructorCoursesPage.tsx` _(new)_
- Reads courses from the auth context (returned by `/auth/me` for instructors).
- Displays a read-only list of the instructor's assigned courses.

---

## Critical Files

| File | Change |
|------|--------|
| `server/src/types/types.d.ts` | Add `'instructor'` to role union |
| `server/src/controllers/auth.ts` | Add `instructorLogin()`, extend `me()` |
| `server/src/routes/auth.route.ts` | Add `POST /auth/instructor-login` |
| `customerApp/src/data/auth.ts` | Add `instructorLogin()` fetch function |
| `customerApp/src/context/AuthProvider.tsx` | Fallback login, store role |
| `customerApp/src/types/auth.ts` | Add role + InstructorUser type |
| `customerApp/src/App.tsx` | Add instructor routes |
| `customerApp/src/layouts/MainLayout.tsx` | Redirect instructors out of admin area |
| `customerApp/src/layouts/InstructorLayout.tsx` | New — minimal sidebar, role guard |
| `customerApp/src/pages/InstructorCoursesPage.tsx` | New — read-only course list |

---

## Verification

1. Seed a test instructor with a hashed password in the DB.
2. Log in at `/login` with instructor credentials → should land on `/instructor/courses`.
3. Log in with admin credentials → should land on `/` (dashboard), unchanged.
4. As instructor, manually navigate to `/` → should be redirected to `/instructor/courses`.
5. As admin, manually navigate to `/instructor/courses` → should be redirected to `/`.
6. Decode the JWT cookie in browser devtools and confirm `role: 'instructor'`.
7. Log out → cookie cleared, redirected to `/login`.
