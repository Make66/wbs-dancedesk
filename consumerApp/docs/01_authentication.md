# Authentication

## Overview

Email/password authentication against a local server (`http://localhost:8000`) using cookie-based JWT tokens. The server sets an `accessToken` cookie on login; the app extracts and persists the token, then forwards it on every API request.

The auth schema mirrors the server middleware at `wbs-dancedesk/server/src/middlewares/authenticate.ts` — a JWT with `sub` (user ID) and `tenantId` claims.

---

## Configuration

Set the API base URL in `app/.env`:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Read via `src/config/env.ts`:

```ts
export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
};
```

---

## Files

| File | Role |
|------|------|
| `src/store/auth.ts` | Zustand store — persists `user`, `accessToken` to AsyncStorage |
| `src/features/auth/authApi.ts` | `login()`, `logout()`, `validateSession()` |
| `src/features/auth/useAuthState.ts` | React hook bridging the store to the navigation guards |
| `src/lib/api.ts` | Axios instance — attaches `Cookie: accessToken=<token>` to every request |
| `app/(auth)/login.tsx` | Email/password form (react-hook-form + zod) |

---

## Auth Store (`src/store/auth.ts`)

```ts
type AuthUser = { id: string; tenantId: string };

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  hydrated: boolean;
  setAuth(user, accessToken): void;
  clearAuth(): void;
};
```

Persisted to AsyncStorage under key `auth-store`. `hydrated` is set to `true` once AsyncStorage has been read, which unblocks the navigation guards.

---

## Login Flow

1. User submits email + password in `app/(auth)/login.tsx`
2. `login(email, password)` POSTs to `POST /auth/login`
3. Server responds with `Set-Cookie: accessToken=<jwt>; ...`
4. App extracts the token from the `set-cookie` response header
5. JWT payload is decoded client-side to read `sub` → `id` and `tenantId`
6. `useAuthStore.setAuth(user, token)` persists both to AsyncStorage
7. Zustand update triggers `useAuthState` → navigation guards redirect to `/(app)/(tabs)`

---

## Logout Flow

1. User taps "Sign out" in `app/(app)/(tabs)/profile.tsx`
2. `logout()` calls `POST /auth/logout` with `Cookie: accessToken=<token>`
3. Regardless of server response, `useAuthStore.clearAuth()` wipes user + token
4. `useAuthState` returns `user: null` → navigation guards redirect to `/(auth)/login`

---

## API Requests

Every `api` (Axios) call automatically includes the stored token:

```ts
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers['Cookie'] = `accessToken=${accessToken}`;
  }
  return config;
});
```

---

## Navigation Guards

| Route | Guard |
|-------|-------|
| `app/index.tsx` | Redirects to `/(auth)/login` if no user, else `/(app)/(tabs)` |
| `app/(auth)/_layout.tsx` | Redirects authenticated users to `/(app)/(tabs)` |
| `app/(app)/_layout.tsx` | Redirects unauthenticated users to `/(auth)/login` |

All guards return `null` while `initializing` (i.e. while AsyncStorage is being hydrated) to avoid a flash of wrong content.

---

## Tab Structure

Three tabs, all protected by the auth guard on `(app)/_layout.tsx`:

| Tab | File |
|-----|------|
| Home | `app/(app)/(tabs)/index.tsx` |
| Chat | `app/(app)/(tabs)/chat.tsx` |
| Profile | `app/(app)/(tabs)/profile.tsx` |
