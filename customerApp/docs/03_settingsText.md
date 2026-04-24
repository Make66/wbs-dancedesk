# Text Settings Section

## Context

The `Text` entity already exists on the server (Prisma model, Zod schema, REST router + controller) but has no customer-facing UI. `type` distinguishes "AGB" (Allgemeine Geschäftsbedingungen, type=0) from "Info" (type=1). The goal is to wire up a full settings section + detail page that mirrors the Instructor pattern, uses the existing `RichTextEditor` component for the `text` field, and exposes the `type` field as a segmented switch.

A **type filter in the settings bar** is included: a segmented 3-option filter ("Alle" / "AGB" / "Info") rendered inline in the collapsible header row.

---

## Files to create

### 1. `customerApp/src/types/text-types.ts`
```ts
export type TextItem = {
  id: string;
  name: string;
  description: string;
  type: number;   // 0 = AGB, 1 = Info
  text: string;
};
```

### 2. `customerApp/src/data/text.ts`
REST helpers following the pattern in `customerApp/src/data/instructor.ts`:
- `getTexts(): Promise<TextItem[]>` — GET `/api/texts`
- `getTextById(id): Promise<TextItem>` — GET `/api/texts/:id`
- `createTextDB(data): Promise<TextItem>` — POST `/api/texts` (JSON body)
- `updateTextDB(id, data): Promise<TextItem>` — PATCH `/api/texts/:id`
- `deleteTextDB(id): Promise<void>` — DELETE `/api/texts/:id`

### 3. `customerApp/src/components/settings/TextSettingsSection.tsx`
Mirrors `InstructorSettingsSection.tsx`. Key differences:
- Background: `bg-emerald-400/60`, hover: `bg-emerald-500`
- Icon: `FileText` from lucide-react
- Header label: "Texte"
- **Type filter** rendered in the header row (visible once expanded, `onClick` stops propagation):
  - Three segmented buttons: "Alle" | "AGB" | "Info"
  - Active: `bg-emerald-500 text-white`, inactive: `bg-background/40 text-muted-foreground border-muted-foreground`
  - Filters the displayed list client-side (no re-fetch)
- List items: name + type badge ("AGB" / "Info") + `ChevronRight`, click → `/text/:id` with `state: { text }`
- Empty state message when no texts match the active filter
- Add button links to `/text`

### 4. `customerApp/src/pages/TextDetailPage.tsx`
Mirrors `InstructorDetailPage.tsx`. Uses react-hook-form + JSON API calls.

Fields:
1. **Name** — text input
2. **Beschreibung** — text input (description)
3. **Typ** — segmented 2-button switch: "AGB" (0) / "Info" (1)
   - Two labelled options side-by-side in a grid
   - Active option: `bg-emerald-500 text-white`, inactive: `bg-background/40 text-muted-foreground`
4. **Text** — `RichTextEditor` (via react-hook-form `Controller`)

Save button with isSaving / saved / saveError state (same pattern as `RegistrationSettingsSection`).

Create mode (no `textId` in params): POST → navigate back to `/settings`.  
Edit mode (`textId` present or via router state): PATCH on save; also shows a delete button.

---

## Files to modify

### 5. `customerApp/src/pages/SettingsPage.tsx`
Add `<TextSettingsSection />` after `<InstructorSettingsSection />`.

### 6. `customerApp/src/App.tsx`
Add two routes inside the main layout:
```tsx
<Route path="/text" element={<TextDetailPage />} />
<Route path="/text/:textId" element={<TextDetailPage />} />
```

### 7. `customerApp/src/pages/index.tsx`
Export `TextDetailPage`.

---

## Key reused patterns / components
- `RichTextEditor` at `customerApp/src/components/ui/RichTextEditor.tsx` — drop in via `Controller`
- `AddButton` at `customerApp/src/components/ui/AddButton.tsx`
- `border-muted-foreground` + `bg-background/40` for raw input elements
- `grid` layout for switch groups
- Plus/Minus segmented toggle pattern from `RegistrationSettingsSection.tsx`

---

## Verification
1. Navigate to `/settings` → TextSettingsSection appears, collapses/expands.
2. Type filter ("Alle" / "AGB" / "Info") filters the list without re-fetching.
3. Click "+" → `/text` page with empty form. Fill fields, select type, write RTE content → save → redirected back to settings.
4. Click a text item → `/text/:id` with prefilled form. Edit and save (PATCH). Delete button removes and redirects.
5. RTE renders HTML correctly on save (check server stores HTML string).
