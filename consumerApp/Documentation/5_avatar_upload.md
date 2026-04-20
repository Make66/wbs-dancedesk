# Avatar Upload — Design & Implementation

## Overview

Participants can upload and crop a profile photo from the Profile screen.
The selected image is sent to the server as `multipart/form-data`, uploaded to Cloudinary
server-side, and the resulting URL is persisted in the `Participant.imageUrl` DB field.

---

## Library choice: `expo-image-picker`

`expo-image-picker` was chosen over `react-native-image-crop-picker` because:

- The OS-native square-crop sheet (`allowsEditing: true, aspect: [1,1]`) is sufficient for a profile photo — no custom crop UI is needed.
- It adds zero extra native dependencies and stays fully within the Expo ecosystem.
- `react-native-image-crop-picker` would only be worth it for non-square aspect ratios or a fully custom crop UI (e.g. a circle overlay with free zoom).

---

## Upload flow

```
User taps avatar
       │
       ▼
expo-image-picker (OS crop sheet)
       │  local file:// URI
       ▼
ParticipantUpdateForm.onSubmit
       │  multipart/form-data  (field: "image")
       ▼
PATCH /api/participants/:id
       │
       ├─ formidableMiddleware   parses file part, validates MIME / 10 MB limit
       ├─ cloudUploader          uploads to Cloudinary, writes secure_url → req.body.imageUrl
       └─ updateParticipant      saves imageUrl in DB, returns updated participant
       │
       ▼
Client receives { imageUrl: "https://res.cloudinary.com/…" }
useUserStore.setParticipant(...)   persists new URL in Zustand store
```

**No Cloudinary credentials are needed on the client.** The upload goes entirely
through the server middleware chain. Keys live in `server/.env` only.

---

## Key files

| File | Role |
|------|------|
| `src/components/AvatarPicker.tsx` | UI component — picker trigger, initials fallback, camera badge |
| `src/features/participant/ParticipantUpdateForm.tsx` | Owns `avatarUri` state, builds FormData on submit |
| `server/src/middlewares/fileHandler.ts` | Formidable — parses multipart, validates image MIME |
| `server/src/middlewares/cloudUploader.ts` | Cloudinary upload, injects `imageUrl` into request body |
| `server/src/controllers/participant.ts` | Saves `imageUrl` returned by Cloudinary to DB |

---

## `AvatarPicker` component API

```tsx
<AvatarPicker
  imageUrl={avatarUri ?? participant.imageUrl}  // http URL or local file:// URI
  initials="MK"                                 // shown when imageUrl is not a valid http/file URI
  onChange={(localUri) => setAvatarUri(localUri)}
/>
```

**Initials fallback** — the server's default `imageUrl` is an SVG path
(`/assets/images/no-profile-picture.svg`) that React Native's `<Image>` cannot
render. Any value that doesn't start with `http` or `file` triggers the initials
placeholder instead of a broken image.

---

## Submit behaviour in `ParticipantUpdateForm`

Two code paths exist to avoid unnecessary Cloudinary traffic:

```
avatarUri set?
  YES → multipart/form-data  (triggers full formidable + Cloudinary pipeline)
  NO  → application/json     (plain field update, Cloudinary not touched)
```

React Native's `FormData` requires file parts as `{ uri, name, type }` objects
(not `Blob`/`File` as on the web) — hence the `as any` cast on `form.append('image', …)`.
