# Auth Fix: Cookie-Based Authentication

## Problem

After submitting the login form, the client threw:

> No access token in server response

The original `authApi.ts` tried to manually extract the `accessToken` from `set-cookie` response headers and store it in Zustand. This doesn't work reliably in React Native because:

- The server uses `httpOnly` cookies — JS cannot read them by design
- Manual `Cookie` header injection (`config.headers['Cookie'] = ...`) is not how native HTTP stacks expect cookies to be handled

## Fix

Use `withCredentials: true` on both axios instances. This delegates cookie management to the native cookie jar — cookies are automatically sent and received without manual extraction or forwarding.

### Changes

**`src/features/auth/authApi.ts`**
- Added `withCredentials: true` to `authAxios`
- Removed manual JWT parsing and `set-cookie` header extraction
- User identity is now read from the JSON response body (`response.data.id`)
- `logout` and `validateSession` no longer manually forward the cookie

**`src/lib/api.ts`**
- Added `withCredentials: true`
- Removed the request interceptor logic that injected `Cookie` header from the store

**`src/store/auth.ts`**
- Dropped `accessToken` field — the native cookie jar owns the tokens now
- `setAuth` takes only `AuthUser`, no token argument
- `partialize` no longer persists a token

## Server contract

The server (`/auth/participant-login`) sets two `httpOnly` cookies on success:

| Cookie | TTL |
|---|---|
| `accessToken` | 15 min |
| `refreshToken` | 7 days |

With `withCredentials: true`, these are stored and replayed automatically on subsequent requests.
