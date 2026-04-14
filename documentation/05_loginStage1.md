# Login – Stage 1: Tenant-Aware Authentication

## Overview

The consumer app login flow is split into two stages based on whether a studio (tenant) has already been identified on the device. On first use the user enters a Studio ID; on subsequent visits the stored studio is shown automatically and only email + password are required.

---

## Files Changed / Created

| File | Change |
|------|--------|
| `consumerApp/src/store/tenant.ts` | New – persisted Zustand store for customer/tenant data |
| `consumerApp/src/features/auth/customerApi.ts` | New – unauthenticated API call to resolve a tenant |
| `consumerApp/app/(auth)/login.tsx` | Updated – tenant-aware login screen |
| `consumerApp/src/features/auth/authApi.ts` | Updated – `login()` accepts `tenantId` parameter |
| `server/src/controllers/auth.ts` | No change – `participantLogin` already accepted `tenantId` |

---

## Tenant Store (`src/store/tenant.ts`)

Persists customer data to AsyncStorage under the key `tenant-store` using Zustand's `persist` middleware (same pattern as `auth-store`).

```typescript
type TenantCustomer = {
  tenantId: string;
  name: string;
  email: string;
  website: string;
  logoUrl: string;
  primary: string;
  secondary: string;
  street: string;
  zipCode: string;
  city: string;
};
```

**Actions:** `setCustomer(customer)`, `clearCustomer()`, `setHydrated(value)`

The store is partialised so only `customer` is written to storage (not the `hydrated` flag).

---

## Customer API (`src/features/auth/customerApi.ts`)

```
GET /customers/by-tenant/:tenantId
```

- Uses the shared unauthenticated `api` axios instance — no JWT required.
- Merges `tenantId` into the response object before returning, since the API body does not include it.

---

## Login Screen (`app/(auth)/login.tsx`)

### First Login (no tenant stored)

1. User sees: **Studio ID** → **Email** → **Password** fields.
2. On submit:
   - Fetches `GET /customers/by-tenant/:tenantId`.
   - On failure → shows `"Studio not found. Please check your Studio ID."` and stops.
   - On success → stores customer in `tenant-store`, proceeds to `POST /auth/participant-login`.
   - On login failure (e.g. wrong password) → shows error; the validated studio data remains stored so the next attempt goes straight to the tenant card.

### Subsequent Logins (tenant stored)

1. User sees a **tenant card** with:
   - Studio logo (`logoUrl`, 48 × 48 px rounded)
   - Studio name (bold)
   - Studio email and website (muted, optional)
   - A small **"Change"** button
2. Pressing **Change** clears the tenant store and resets the form, returning to the Studio ID field.
3. On submit: `tenantId` is taken from the store — no API call to resolve the tenant.

### Hydration Guard

The screen renders a centred `ActivityIndicator` until `useTenantStore().hydrated` is `true`. This prevents a flash of the Studio ID field on app launch when a tenant is already stored.

### Form

- Managed by `react-hook-form` + Zod.
- `tenantId` is always present in the form schema (`min(1)`). When a tenant is stored, `setValue('tenantId', customer.tenantId)` is called via `useEffect` so validation passes even though the field is hidden.

---

## Auth API (`src/features/auth/authApi.ts`)

`login(email, password, tenantId)` — `tenantId` is now an explicit parameter instead of being read from `env.tmpTenantId`. Both the POST body and the `AuthUser` written to the auth store use the caller-supplied value.

---

## Server (`server/src/controllers/auth.ts`)

`participantLogin` was already correct:

```typescript
const { email, password, tenantId } = req.body;
// tenantId is required because participant email is not globally unique
prisma.participant.findFirst({ where: { email, tenantId, isDeleted: false } })
```

No server-side changes were needed.
