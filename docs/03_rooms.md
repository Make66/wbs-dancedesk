# Rooms Feature — Implementation Summary

**App:** `customerApp/src` · **Server endpoints:** `/rooms`

---

## Overview

The Rooms feature mirrors the existing Instructors feature end-to-end: list page, detail/edit page, form with image upload, sidebar navigation, and a full CRUD data layer.

---

## File Structure

### New Files

| File | Purpose |
|------|---------|
| `src/components/room/RoomItem.tsx` | Card component for the list grid |
| `src/components/room/RoomCoursesSection.tsx` | Related courses panel (reuses `instructor/CourseItem`) |
| `src/components/room/RoomForm.tsx` | Edit form (image, address, capacity, coordinates) |
| `src/pages/RoomDetailPage.tsx` | Detail page — fetches room by ID, renders `RoomForm` |

### Modified Files

| File | Change |
|------|--------|
| `src/types/room-types.ts` | Added `isActive`, `isDeleted`, `longitude`, `latitude`; made fields non-optional to match Prisma defaults |
| `src/data/rooms.ts` | Added `getAllRooms`, `getRoomById`, `updateRoom`, `createRoom`, `deleteRoom` |
| `src/pages/RoomsPage.tsx` | Replaced static placeholder with real data fetch + `RoomItem` grid |
| `src/pages/index.tsx` | Exported `RoomDetailPage` |
| `src/App.tsx` | Added `/room/:roomId` route |
| `src/components/nav/Sidebar.tsx` | Added Räume `NavLink` with `MdMeetingRoom` icon (between Instruktoren and Einstellungen) |
| `src/components/nav/SidebarMin.tsx` | Added Räume icon link |

---

## Data Layer — `src/data/rooms.ts`

All functions use `credentials: "include"` and hit `VITE_APP_AUTH_SERVER_URL`.

| Function | Method | Endpoint |
|----------|--------|----------|
| `getRooms(locationId)` | GET | `/locations/:id/rooms` (existing — used by location-scoped views) |
| `getAllRooms()` | GET | `/rooms` |
| `getRoomById(roomId)` | GET | `/rooms/:id` |
| `updateRoom(roomId, data)` | PATCH | `/rooms/:id` — multipart `FormData` |
| `createRoom(data)` | POST | `/rooms` — multipart `FormData` |
| `deleteRoom(roomId)` | DELETE | `/rooms/:id` |

`updateRoom` and `createRoom` use a shared `buildRoomFormData()` helper that appends all fields including an optional `image` (File) or `imageUrl` (string), matching the `updateInstructor` pattern exactly.

---

## Room Type — `src/types/room-types.ts`

```typescript
export type Room = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  capacity: number;
  street: string;
  city: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  locationId?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
```

---

## RoomForm — `src/components/room/RoomForm.tsx`

Uses `react-hook-form` with `FormProvider`. Two-column layout matching `InstructorForm`:

**Left column:**
- `ProfileImageUploader` — `cropShape="rect"`, `aspect={4/3}` (landscape, not circular)
- Name, Beschreibung inputs
- Address panel (`bg-blue-400/40`): Straße, PLZ + Stadt (2-col sub-grid), Kapazität, Längengrad + Breitengrad
- Save button

**Right column:**
- `RoomCoursesSection` (shown only when `courses.length > 0`)

Capacity and coordinate fields use `{ valueAsNumber: true }` in `register()` so react-hook-form delivers them as `number` to the submit handler.

---

## Routing

```
/rooms              → RoomsPage      (list grid)
/room/:roomId       → RoomDetailPage (edit form)
```

---

## Known Limitations / TODOs

- **Courses section is stubbed.** The server exposes `GET /rooms/:id/events` but not `GET /rooms/:id/courses`. `RoomForm` sets `courses` to `[]` until that endpoint exists. The `RoomCoursesSection` component is ready and will activate once the fetch is wired up.
- **AddButton is a no-op.** The creation flow (`createRoom` is implemented in the data layer) needs a modal or navigation target to be wired up.
- **Longitude/latitude** are plain number inputs. A future iteration could use a map picker (e.g. Leaflet) since the fields already exist in the Prisma model.
