# Module Access Control

## Summary

**Status: Implemented**

A central `useModuleAccess` hook gates nav items and settings sections based on the modules assigned to the current user. Admins bypass all checks and always see everything.

---

## Architecture

### Hook — `customerApp/src/lib/useModuleAccess.ts`

```ts
useModuleAccess(): (name: ModuleName) => boolean
```

- Reads `user.modules` from `userStore` (already filtered active + non-deleted by the store).
- If `user.role === 'admin'` → always returns `true`.
- Otherwise returns a `has(name)` function that checks whether the module name is in the user's active module set.
- `MODULE` constants object provides typed keys for all 8 module names.

### Module → feature mapping

| `MODULE` key   | Name          | Sidebar              | Settings sections                              |
|----------------|---------------|----------------------|------------------------------------------------|
| `KURSE`        | Kurse         | Kurse nav + targets  | TargetSettingsSection                          |
| `KALENDER`     | Kalender      | Kalender nav         | CalendarSettingsSection, FederalHoliday, Holiday |
| `TEILNEHMER`   | Teilnehmer    | Teilnehmer nav       | —                                              |
| `NEWS`         | News          | News nav             | —                                              |
| `RAEUME`       | Räume         | —                    | RoomSettingsSection                            |
| `LEHRER`       | Lehrer        | —                    | InstructorSettingsSection                      |
| `ANMELDUNGEN`  | Anmeldungen   | —                    | RegistrationSettingsSection, RebateSettingsSection |
| `EINSTELLUNGEN`| Einstellungen | —                    | TextSettingsSection                            |

Dashboard, LocationPicker, and OtherSettingsSection are always visible (no module required).

---

## Usage pattern

```tsx
const has = useModuleAccess();

{has(MODULE.KURSE) && <KurseNavLink />}
{has(MODULE.RAEUME) && <RoomSettingsSection />}
```

---

## Files changed

| File | Change |
|------|--------|
| `customerApp/src/lib/useModuleAccess.ts` | New — hook + `MODULE` constants |
| `customerApp/src/components/nav/Sidebar.tsx` | Nav items gated by module |
| `customerApp/src/pages/SettingsPage.tsx` | Settings sections gated by module |

---

## Module assignment

Modules are assigned to users in the admin panel (`/admin`) via the UserForm module chip selector. The server's `updateUser` controller uses a `set:` operation so saving replaces the full module assignment. The seeded admin user (`admin@test.de`) has all 8 modules assigned.
