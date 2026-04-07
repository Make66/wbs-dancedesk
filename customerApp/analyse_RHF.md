# React Hook Form — `watch()` Analysis

## Question

> Please explain highlighted code is announced to be "use of incompatible library. This API returns functions which can not be memoized without leading to stale the UI. ...".
>
> Highlighted code (`CourseForm.tsx:52`):
> ```ts
> const watchedValues = watch();
> ```

## Answer

`watch()` called with **no arguments** subscribes to the **entire form state** on every render. The warning is about this specific usage pattern:

### The core problem

`react-hook-form`'s `watch()` function is not a stable reference — it re-runs on every render and returns a **new object every time** (even if form values haven't changed). This means:

1. **No memoization is possible** — any component, `useMemo`, or `useCallback` that depends on `watchedValues` will always see it as "changed" because it's a new object reference each render.
2. **Stale UI risk** — if you pass `watchedValues` to a memoized child component (`React.memo`), the memo never actually prevents re-renders (ref always differs), or worse, if used inside a closure that captures it, the closure may see an outdated snapshot.
3. **Performance** — it triggers a re-render of `CourseForm` on **every keystroke** across the entire form.

### The RHF-recommended alternatives

| Use case | Better approach |
|---|---|
| Watch a specific field | `watch("fieldName")` — subscribes only to that field |
| Watch in a child component | `useWatch({ name: "fieldName" })` — scoped subscription, memoization-friendly |
| Read values on submit only | Use `handleSubmit(values => ...)` — no subscription needed |

### In this specific file

`watchedValues` (line 52–54 in `CourseForm.tsx`) is only used for a `console.log` debug statement, so the entire `watch()` call can simply be **removed** once debugging is done.

---

## Question

> Suggest an algorithm to fix the issue while having the form data sent to the remote API when `name` or `description` is being updated.

## Answer

### Algorithm: Scoped `useWatch` + debounced auto-save

**Goal:** react only to `name` and `description` changes, send a PATCH to the API after the user stops typing, without polluting the rest of the form's render cycle.

#### Step-by-step

1. **Replace `watch()` with `useWatch`** scoped to the two fields.  
   `useWatch` is subscription-based and returns a stable value — it only triggers a re-render when those specific fields change.

2. **Debounce the side-effect** with `useEffect` + `setTimeout`.  
   Fire the API call only after the user has stopped typing for N ms (e.g. 600 ms). Clear the timer on every new keystroke so rapid input produces a single request.

3. **Skip the initial mount** by tracking whether the form has been dirtied (use RHF's `formState.isDirty` or a `useRef` mounted-flag), so the auto-save does not fire when the form first loads with existing data.

4. **Cancel in-flight requests** with an `AbortController` returned from the `useEffect` cleanup, so a fast typist never races stale requests against newer ones.

#### Pseudocode

```ts
// 1. Scoped subscription — no full-form re-render
const [name, description] = useWatch({
  control,
  name: ["name", "description"],
});

const isMounted = useRef(false);

// 2. Debounced auto-save
useEffect(() => {
  // 3. Skip initial mount
  if (!isMounted.current) {
    isMounted.current = true;
    return;
  }

  const controller = new AbortController();

  const timer = setTimeout(async () => {
    await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      signal: controller.signal,           // 4. Cancellable
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
  }, 600);

  // Cleanup: cancel both the timer and any in-flight request
  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [name, description, courseId]);
```

#### Why this is correct

| Concern | How it is addressed |
|---|---|
| Memoization safety | `useWatch` returns primitives (strings) — stable by value, not by reference |
| Unnecessary re-renders | Only `name`/`description` changes trigger the effect; the rest of the form is unaffected |
| Stale requests | `AbortController` cancels the previous fetch before the new timer fires |
| Double-fire on load | `isMounted` ref skips the first effect execution |
| Too many API calls | 600 ms debounce collapses a burst of keystrokes into one request |
