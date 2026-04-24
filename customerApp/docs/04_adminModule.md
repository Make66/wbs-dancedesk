# Admin Module

## Summary

**Status: Implemented**

A platform-level admin area accessible only to users with `role = "admin"`, reachable at `/admin`. Non-admins are redirected to `/` by `AdminRoute`. Regular users with `role = "admin"` see an "Admin" link at the bottom of the main sidebar.

**Layout**: `AdminLayout` — dedicated left sidebar ("DanceDesk Admin" + back link) with three collapsible sections (Customers, Locations, Users), counts shown per section. No main-app Navbar. Clicking any item or "+" opens a right-side slide-in panel (backdrop closes it on click-outside).

**Edit/Create pattern**: `AdminPanel` slide-in drawer (420 px, CSS transition). Contains one of three `react-hook-form`-based forms depending on selection. Save closes the panel after 1 s and refreshes the sidebar list via a `refreshKey` counter. Delete soft-deletes and closes immediately.

**Cross-tenant**: `role === 'admin'` bypasses the `tenantId` filter in all three controllers (customer, location, user). Create endpoints use `req.body.tenantId` when called by an admin so they can assign resources to any tenant.

**Files created/changed:**

| File | Change |
|------|--------|
| `server/src/middlewares/authenticate.ts` | Added `'admin'` to role union on `req.user` |
| `server/src/types/types.d.ts` | Added `'admin'` to Express `Request.user.role` |
| `server/src/controllers/auth.ts` | `role` in `me()` select; `'admin'` in `Role` type |
| `server/src/controllers/customer.ts` | Cross-tenant bypass |
| `server/src/controllers/location.ts` | Cross-tenant bypass |
| `server/src/controllers/user.ts` | Cross-tenant bypass |
| `customerApp/src/types/auth.ts` | `role?` on global `User` type |
| `customerApp/src/types/customer-types.ts` | New — `CustomerItem` |
| `customerApp/src/types/location-types.ts` | New — `LocationItem` |
| `customerApp/src/types/user-types.ts` | New — `UserItem` |
| `customerApp/src/data/customer.ts` | New — full CRUD |
| `customerApp/src/data/user.ts` | New — full CRUD |
| `customerApp/src/data/location.ts` | Rewritten — full CRUD |
| `customerApp/src/components/AdminRoute.tsx` | New — role guard |
| `customerApp/src/layouts/AdminLayout.tsx` | New — panel state manager |
| `customerApp/src/components/admin/AdminSidebar.tsx` | New — collapsible sections |
| `customerApp/src/components/admin/AdminPanel.tsx` | New — slide-in drawer |
| `customerApp/src/components/admin/CustomerForm.tsx` | New — customer CRUD form |
| `customerApp/src/components/admin/LocationForm.tsx` | New — location CRUD form |
| `customerApp/src/components/admin/UserForm.tsx` | New — user CRUD form with role switch |
| `customerApp/src/pages/AdminPage.tsx` | New — summary card dashboard |
| `customerApp/src/App.tsx` | Admin routes wired |
| `customerApp/src/pages/index.tsx` | `AdminPage` exported |
| `customerApp/src/components/nav/Sidebar.tsx` | "Admin" link (admin-only) |

---

## Context

The DanceDesk platform needs a platform-level admin area where users with `role = "admin"` can manage Customers (dance schools/tenants), Locations, and Users. The backend models, routes, and controllers for all three already exist. The `role` field lives in the DB and JWT but is not yet surfaced to the frontend or used in route guards.

**Chosen layout**: Separate `/admin/*` routes with a dedicated `AdminLayout` (own sidebar, no main-app Navbar/Sidebar).  
**Chosen edit pattern**: Click an item in the sidebar list → right-side slide-in panel (form), sidebar stays visible.

---

## Backend changes

### `server/src/middlewares/authenticate.ts`
Add `'admin'` to the role union type on `req.user`:
```ts
role: (decoded.role ?? 'user') as 'user' | 'participant' | 'admin',
```

### `server/src/controllers/auth.ts`
1. Add `'admin'` to the local `Role` type: `type Role = 'user' | 'participant' | 'admin'`.
2. In `me()`, add `role: true` to the Prisma select so the frontend receives the role.

### Cross-tenant bypass — customer, location, and user controllers

All three controllers currently filter every query with `where: { tenantId, isDeleted: false }`.
For `role === 'admin'`, the `tenantId` filter must be omitted so the admin sees all tenants.

**Pattern** (apply to `getAllCustomers`, `getOneCustomer`, `updateCustomer`, `removeCustomer`, `getAllLocations`, `getOneLocation`, `updateLocation`, `removeLocation`, `getAllUsers`, `getOneUser`, `updateUser`, `removeUser`):

```ts
const { tenantId, role } = req.user!;
const tenantFilter = role === 'admin' ? {} : { tenantId };
// replace:  where: { tenantId, isDeleted: false }
// with:     where: { ...tenantFilter, isDeleted: false }
```

**Create endpoints** (`createCustomer`, `createLocation`, `createUser`):
When called by an admin the `tenantId` must come from `req.body` (the admin chooses which tenant to create under). For regular users it stays as `req.user.tenantId`.

```ts
const assignedTenantId = role === 'admin' ? req.body.tenantId : tenantId;
// data: { ...req.body, tenantId: assignedTenantId }
```

The `CustomerForm`, `LocationForm`, and `UserForm` on the frontend must include a `tenantId` field (free-text input or select) when creating new records.

---

## Frontend changes

### 1. Auth types — `customerApp/src/types/auth.ts`
Add `role?: string` to the global `User` type. The `AuthProvider` already stores the full `me()` response, so no other context changes are needed.

### 2. New type files
- `customerApp/src/types/customer-types.ts`
  ```ts
  export type CustomerItem = {
    id: string; name: string; email: string; website: string; logoUrl: string;
    primary: string; secondary: string; tertiary: string; quaternary: string;
    street: string; city: string; zipCode: string;
    tenantId: string; isActive: boolean;
  };
  ```
- `customerApp/src/types/location-types.ts`
  ```ts
  export type LocationItem = {
    id: string; name: string; description: string; imageUrl: string;
    street: string; city: string; zipCode: string; state: string;
    customerId?: string; tenantId: string; isActive: boolean;
  };
  ```
- `customerApp/src/types/user-types.ts`
  ```ts
  export type UserItem = {
    id: string; firstName: string; lastName: string;
    email: string; role: string; imageUrl: string;
    tenantId: string; isActive: boolean;
  };
  ```

### 3. Data layer

#### `customerApp/src/data/customer.ts` (new)
Full CRUD: `getCustomers`, `getCustomerById`, `createCustomerDB`, `updateCustomerDB`, `deleteCustomerDB` — all JSON body (no FormData), same pattern as `customerApp/src/data/text.ts`.

#### `customerApp/src/data/user.ts` (new)
Full CRUD: `getUsers`, `getUserById`, `createUserDB`, `updateUserDB`, `deleteUserDB` — JSON body. Note: the server router uses `formidableMiddleware` + `cloudUploader` for image uploads; if image upload is needed later, switch to FormData. For initial admin module, JSON is fine (no image upload).

#### `customerApp/src/data/location.ts` (update)
Add: `getLocations`, `getLocationById`, `createLocationDB`, `deleteLocationDB`. Keep the existing `updateLocationDB`.

### 4. Route guard — `customerApp/src/components/AdminRoute.tsx`
```tsx
const AdminRoute = () => {
  const { user, signedIn } = useAuth();
  if (!signedIn) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return <Outlet />;
};
```

### 5. Layouts

#### `customerApp/src/layouts/AdminLayout.tsx`
```
<div className="h-screen flex overflow-hidden">
  <AdminSidebar />
  <main className="flex-1 overflow-y-auto">
    <Outlet />
  </main>
</div>
```
State managed here: `panelState: { mode: 'customer'|'location'|'user', id: string|null } | null` — passed down via context or props to `AdminSidebar`.

#### `customerApp/src/components/admin/AdminSidebar.tsx`
- Header: "DanceDesk Admin" title + small "← App" link back to `/`
- Three collapsible sections (same expand/collapse pattern as `InstructorSettingsSection`):
  - **Customers** (`bg-sky-400/60`) — fetches `getCustomers()` on mount
  - **Locations** (`bg-violet-400/60`) — fetches `getLocations()`
  - **Users** (`bg-rose-400/60`) — fetches `getUsers()`
- Each section has an `AddButton` (opens panel in create mode)
- Each list item: name + `ChevronRight`, click → sets `panelState` to open the slide-in panel

### 6. Slide-in panel — `customerApp/src/components/admin/AdminPanel.tsx`
- Fixed right-side drawer (`fixed inset-y-0 right-0 w-[420px]`), slides in via CSS transition
- Header: entity name or "Neu erstellen" + close button (×)
- Renders one of three form components based on `panelState.mode`
- On save/delete: refreshes the sidebar list + closes panel

### 7. Form components (inside `customerApp/src/components/admin/`)
All use `react-hook-form`, same save/error/saved pattern as `RegistrationSettingsSection`.

#### `CustomerForm.tsx`
Fields: name, email, website, logoUrl, primary/secondary/tertiary/quaternary (color inputs), street, city, zipCode, isActive toggle.

#### `LocationForm.tsx`
Fields: name, description, street, city, zipCode, state, customerId (select from customers list), isActive toggle.

#### `UserForm.tsx`
Fields: firstName, lastName, email, role (switch: "User" / "Admin"), isActive toggle. Password only shown on create.

### 8. Admin landing page — `customerApp/src/pages/AdminPage.tsx`
Minimal: headline "DanceDesk Admin" + summary cards (customer count, location count, user count). Rendered at `/admin`.

---

## Router & navigation changes

### `customerApp/src/App.tsx`
```tsx
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminPage />} />
  </Route>
</Route>
```

### `customerApp/src/pages/index.tsx`
Export `AdminPage`.

### `customerApp/src/components/nav/Sidebar.tsx`
Add an "Admin" nav link at the bottom, rendered only when `user?.role === 'admin'`. Links to `/admin`.

---

## Suggested improvements (beyond the requested scope)

- **Role management UX**: The `UserForm` role switch lets admins promote/demote other users. Consider confirming before self-demotion.
- **API key display**: The Customer model has `apiKey`, `signInKey`, `code` — consider a read-only display section in the CustomerForm (the server already has rotate-key endpoints).
- **API key display**: The Customer model has `apiKey`, `signInKey`, `code` — consider a read-only display section in the CustomerForm (the server already has rotate-key endpoints).

---

## Verification
1. Log in as a `role = 'user'` user → `/admin` redirects to `/`.
2. Log in as `role = 'admin'` → `/admin` shows the admin layout + summary cards.
3. Expand "Customers" → list loads. Click item → slide-in panel opens with prefilled form.
4. Edit a field, click Save → panel shows "Gespeichert", list refreshes.
5. Click "+" in a section → panel opens empty, fill form, save → item appears in list.
6. Delete button → item removed, panel closes.
7. "← App" link returns to the main layout at `/`.
8. "Admin" link in main Sidebar only visible to admins.
