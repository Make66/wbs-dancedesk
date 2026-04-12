# Technical Summary: `GET /courses/week[/:weeknumber]`

**File:** `src/controllers/course.ts` · **Router:** `src/routes/courseRouter.ts`

---

## Routes

```
GET /courses/week                  → current week
GET /courses/week/:weeknumber      → specific week (see resolution logic below)
```

Both routes are handled by the single `getWeekCourses` controller (lines 149–231).  
The `/week` route is registered **before** `/:id` in the router to prevent Express from consuming the literal string "week" as a course ID.

---

## Response shape

```json
{
  "0": [ CourseInformation, ... ],   // Monday
  "1": [ ... ],                      // Tuesday
  "2": [ ... ],                      // Wednesday
  "3": [ ... ],                      // Thursday
  "4": [ ... ],                      // Friday
  "5": [ ... ],                      // Saturday
  "6": [ ... ]                       // Sunday
}
```

All seven weekday keys are always present (even if the array is empty).  
Within each bucket, entries are sorted ascending by `startsAt` time-of-day (UTC hours × 60 + minutes).

### CourseInformation fields

| Field | Type | Source |
|---|---|---|
| `id` | `string` (UUID) | `course.id` |
| `name` | `string \| null` | `course.name` |
| `description` | `string \| null` | `course.description` |
| `startsAt` | `DateTime` | `course.startsAt` — time-of-day is used for sorting |
| `endsAt` | `DateTime` | `course.endsAt` |
| `options` | `number` | `course.options` (bitmask, 0–12) |
| `seatsCurrent` | `number` | `course.seatsCurrent` |
| `seatsMax` | `number` | `course.seatsMax` |
| `isBookedOut` | `boolean` | `course.isBookedOut` |
| `isClub` | `boolean` | `course.isClub` |
| `color` | `string[2]` | **`category.color`** — courses have no own color field |
| `category` | `{id, name, color}` | `course.category` (included join) |
| `target` | `{id, name, color}` | `course.category.target` (nested join) |
| `instructor` | `{id, name, imageUrl} \| null` | `course.instructor` |
| `room` | `{id, name, description} \| null` | `course.room` |

---

## Week-number resolution (`resolveWeekBounds`, lines 135–147)

When `:weeknumber` is omitted the function returns the bounds of the **current calendar week**  
(Monday 00:00 UTC to Sunday 23:59:59 UTC, expressed as the two UTC-midnight timestamps that bookend it).

When a number `n` is supplied it is decoded as follows:

```
yearsAhead = floor(n / 53)
isoWeek    = (n % 53) || 53      ← 0-remainder is treated as week 53
targetYear = currentISOWeekYear + yearsAhead
```

Examples:

| `n` | `yearsAhead` | `isoWeek` | Meaning |
|---|---|---|---|
| 1 | 0 | 1 | Week 1 of current year |
| 52 | 0 | 52 | Week 52 of current year |
| 53 | 1 | 53 | Week 53 of **next** year |
| 54 | 1 | 1 | Week 1 of next year |
| 106 | 2 | 0 → 53 | Week 53 of year+2 |

The helper `getMondayOfISOWeek(year, isoWeek)` (lines 108–114) computes the exact UTC-midnight  
timestamp for the Monday of a given ISO year+week using the ISO 8601 anchor rule:  
_January 4th is always in ISO week 1_.

The helper `isoWeekYear(ms)` (lines 117–128) returns the ISO week-year for today's date,  
accounting for the edge cases in late December / early January where the ISO year differs from  
the calendar year.

Input validation (lines 153–156): if `:weeknumber` is present but not a valid integer ≥ 1 the  
endpoint returns `400 Bad Request`.

---

## Data fetch (lines 160–170)

Two Prisma queries are fired in parallel with `Promise.all`:

1. **All active, non-deleted courses** for the tenant, with relations included:
   - `category` → `target` (nested)
   - `instructor`
   - `room`

2. **Tenant settings** — needed by the fake-date fallback (holidays, school holidays, federal state).

---

## Date matching per course (lines 174–186)

For each course the handler determines which occurrence(s) fall within `[weekStart, weekEnd]`:

```
storedMs  = course.dates (JSON field)
             → parse each entry's .date string to UTC-midnight ms
             → keep only those within [weekStart, weekEnd]
```

If `storedMs` is non-empty those timestamps drive the result.  
Otherwise the **fake-date fallback** is triggered (see next section).

---

## ⚠️ Fake-date fallback (`generateDatesFromCourse`, lines 55–88)

> **Development-only feature.** When a course has no entries in its `dates` JSON field that  
> land in the requested week, the system generates a synthetic sequence of occurrence dates  
> on the fly and checks whether any of them fall in the week.

**Trigger condition** (line 180–184):

```typescript
const weekMs = storedMs.length
  ? storedMs
  // ↓↓↓ FAKE DATES generated here ↓↓↓
  : generateDatesFromCourse(course, settings, count)
      .map(s => utcMidnight(new Date(s)))
      .filter(ms => ms >= weekStart && ms <= weekEnd);
```

`storedMs.length === 0` is the sole trigger — any course without real dates in the target week  
falls through to this path.

### How `generateDatesFromCourse` works

1. **Holidays** are loaded from `settings.holidays` (custom) and `settings.schoolHolidays[federalState]`  
   (state-specific school holidays). Skipped entirely when `course.isIgnoreCalendar === true`.

2. **Start point**:
   - Non-club courses: `course.startsAt` (UTC midnight).
   - Club courses (`isClub === true`): the start date is fast-forwarded by the frequency step  
     until it reaches or passes today. This means club courses always start from a recent upcoming date.

3. **Generation loop**: advances by `nextOccurrence(current, frequency)` each iteration,  
   skipping any date that falls on a holiday, until `count` dates have been collected.  
   `count` = `clubRepetition` (default 50) for clubs, `courseRepetition` (default 8) for courses.  
   A `maxIterations = count × 10 + 365` guard prevents an infinite loop when holidays are dense.

4. **Supported frequencies**: `daily` (+1 day), `biweekly` (+14 days), `monthly` (+1 month),  
   `weekly` / `ongoing` / anything else (+7 days, the default).

5. **Return value**: array of `YYYY-MM-DD` strings — these are then mapped back to UTC-midnight ms  
   and filtered for the target week.

### Limitation

The fallback only generates `count` occurrences forward from the course start (or today for clubs).  
If the requested week is far enough in the future that `count` occurrences do not reach it,  
the course will be **absent from the result even though it would logically recur then**.  
This is acceptable during development but must be replaced with real `dates` data in production.

---

## Shared low-level helpers (lines 4–47)

| Function | Lines | Purpose |
|---|---|---|
| `utcMidnight(date)` | 13–15 | Strips time component, returns UTC-midnight timestamp |
| `parseHolidays(raw)` | 17–27 | Converts raw JSON holiday array to `{start, end}` ms pairs |
| `isHoliday(dateMs, holidays)` | 29–31 | Range-checks a timestamp against all holiday windows |
| `nextOccurrence(dateMs, frequency)` | 33–42 | Advances a timestamp by one frequency step |
| `formatDate(ms)` | 44–47 | Formats a UTC-midnight ms to `YYYY-MM-DD` |
| `getMondayOfISOWeek(year, isoWeek)` | 108–114 | ISO week → UTC-midnight ms of that Monday |
| `isoWeekYear(ms)` | 117–128 | Returns the ISO week-year for a given timestamp |
| `resolveWeekBounds(weeknumber?)` | 135–147 | Maps the optional param to `{weekStart, weekEnd}` |
