# Replacing the Post Body Textarea with a Rich Text Editor

## Background

The `text` field in `PostForm.tsx` was a plain `<textarea>`. The goal was to replace it with a rich text editor (RTE) that outputs HTML and fits the existing form design.

---

## Decision: Tiptap

**Evaluated options:**
- **Tiptap** — headless, Tailwind-compatible, react-hook-form integration via `Controller`, good extension ecosystem, React 19 compatible
- **BlockNote** — Notion-style block editor built on Tiptap, less styling control
- **Lexical** (Meta) — modern and performant, but more complex setup
- **react-quill** — not maintained for React 18+

**Choice: Tiptap** — headless means it styles cleanly with Tailwind v4 without fighting bundled CSS. Works well with `Controller`. Requires building a toolbar manually, which fits the project's existing icon-button pattern.

**Toolbar decided:** Bold, Italic, Bullet list, Ordered list, Link  
**Output format:** HTML (easiest to render in the read view)

---

## Packages installed

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link
```

---

## Implementation

### New component: `src/components/ui/RichTextEditor.tsx`

Headless Tiptap editor wrapped in a styled container that matches the existing form field look (`rounded-xl border border-muted-foreground bg-background/40`). Focus tracking uses `focus-within` on the container rather than `focus` on the inner element.

**Toolbar buttons** use `lucide-react` icons and the existing icon-button pattern (`h-9 w-9 rounded-xl`), with active state highlighted blue. All buttons carry `type="button"` to prevent accidental form submission.

**Link toggle:** uses `window.prompt` for simplicity. Clicking the link button when the cursor is on a link shows `Link2Off` and removes the link; otherwise shows `Link2` and prompts for a URL.

**react-hook-form sync:** a `useEffect` syncs the external `value` → editor content when `reset()` fires (e.g. after loading an existing post for editing).

### CSS: `src/index.css`

Added `@layer components` block with `.prose-editor` class — restores list bullets, paragraph spacing, link styles, and bold/italic that Tailwind v4 Preflight strips. Applied to both the editor content area and the read view.

### PostForm: `src/components/post/PostForm.tsx`

Replaced the raw `<textarea>` with a `<Controller>` wrapping `<RichTextEditor>`. The `text` field type stays `string` (HTML is a valid string). `control` was already destructured.

### Read view: `src/pages/PostViewPage.tsx`

Replaced `<p whitespace-pre-wrap>{post.text}</p>` with `<div dangerouslySetInnerHTML={{ __html: post.text }} className="prose-editor" />` so the stored HTML renders correctly.

### Docs: `src/docs/01_posts.md`

Updated the PostForm fields table and client files table to reflect the RTE component.

---

## Files changed

| File | Change |
|---|---|
| `src/components/ui/RichTextEditor.tsx` | New — Tiptap editor with toolbar |
| `src/components/post/PostForm.tsx` | `textarea` → `Controller` + `RichTextEditor` |
| `src/pages/PostViewPage.tsx` | `post.text` rendered as HTML via `dangerouslySetInnerHTML` |
| `src/index.css` | Added `.prose-editor` `@layer components` block |
| `docs/01_posts.md` | Updated field and file tables |
