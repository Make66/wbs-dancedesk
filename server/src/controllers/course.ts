import type { RequestHandler } from "express";
import prisma from "#db";

// --- date generation helpers ---

interface HolidayEntry {
  start: { dateTime: string };
  end?: { dateTime: string };
}

interface ParsedHoliday {
  start: number;
  end: number;
}

function utcMidnight(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseHolidays(raw: unknown): ParsedHoliday[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[]).flatMap((h) => {
    if (!h || typeof h !== "object" || !("start" in h)) return [];
    const entry = h as HolidayEntry;
    const startMs = Date.parse(entry.start.dateTime);
    if (isNaN(startMs)) return [];
    const endMs = entry.end ? Date.parse(entry.end.dateTime) : startMs;
    return [{ start: startMs, end: isNaN(endMs) ? startMs : endMs }];
  });
}

function isHoliday(dateMs: number, holidays: ParsedHoliday[]): boolean {
  return holidays.some((h) => dateMs >= h.start && dateMs <= h.end);
}

function nextOccurrence(dateMs: number, frequency: string): number {
  const d = new Date(dateMs);
  switch (frequency) {
    case "daily":
      d.setUTCDate(d.getUTCDate() + 1);
      break;
    case "biweekly":
      d.setUTCDate(d.getUTCDate() + 14);
      break;
    case "monthly":
      d.setUTCMonth(d.getUTCMonth() + 1);
      break;
    default:
      d.setUTCDate(d.getUTCDate() + 7);
      break; // weekly / ongoing
  }
  return d.getTime();
}

function formatDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

type CourseForDates = {
  startsAt: Date;
  frequency: string;
  isClub: boolean;
  isIgnoreCalendar: boolean;
  clubRepetition: number;
  courseRepetition: number;
};
type SettingsForDates = {
  holidays?: unknown;
  schoolHolidays?: unknown;
  federalState?: string;
} | null;

function generateDatesFromCourse(
  course: CourseForDates,
  settings: SettingsForDates,
  count: number,
): string[] {
  const stateHolsRaw = (() => {
    const s = settings as Record<string, unknown> | null;
    const sh = s?.schoolHolidays;
    const fs = s?.federalState as string | undefined;
    if (!fs || !sh || typeof sh !== "object" || Array.isArray(sh)) return undefined;
    return (sh as Record<string, unknown>)[fs];
  })();

  const allHolidays = course.isIgnoreCalendar
    ? []
    : [...parseHolidays(settings?.holidays), ...parseHolidays(stateHolsRaw)];

  const today = utcMidnight(new Date());
  let startMs = utcMidnight(course.startsAt);
  if (course.isClub && startMs < today) {
    while (startMs < today) {
      startMs = nextOccurrence(startMs, course.frequency);
    }
  }

  const dates: string[] = [];
  let current = startMs;
  const maxIterations = count * 10 + 365;
  let iterations = 0;

  while (dates.length < count && iterations < maxIterations) {
    if (!isHoliday(current, allHolidays)) dates.push(formatDate(current));
    current = nextOccurrence(current, course.frequency);
    iterations++;
  }

  return dates;
}

export const getCourseDates: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;

  const [course, settings] = await Promise.all([
    prisma.course.findFirst({ where: { id, tenantId, isDeleted: false } }),
    prisma.settings.findUnique({ where: { tenantId } }),
  ]);
  if (!course) throw new Error("Course not found", { cause: { status: 404 } });

  const count = course.isClub ? (course.clubRepetition ?? 0) : (course.courseRepetition ?? 0);

  res.json(generateDatesFromCourse(course, settings as SettingsForDates, count));
};

/** Returns UTC-midnight ms for the Monday of the given ISO year + week (1-based). */
function getMondayOfISOWeek(year: number, isoWeek: number): number {
  // Jan 4 of any year is always in ISO week 1
  const jan4Ms = Date.UTC(year, 0, 4);
  const jan4Day = new Date(jan4Ms).getUTCDay(); // 0=Sun … 6=Sat
  const mondayOfWeek1 = jan4Ms - ((jan4Day + 6) % 7) * 86_400_000;
  return mondayOfWeek1 + (isoWeek - 1) * 7 * 86_400_000;
}

/** Returns the ISO week-year of a UTC-midnight timestamp. */
function isoWeekYear(ms: number): number {
  // The ISO year can differ from the calendar year in early Jan / late Dec.
  // Week 1 contains Jan 4, so check whether ms belongs to next/prev year's week.
  const d = new Date(ms);
  const year = d.getUTCFullYear();
  // If the ms is in a week that's week 1 of year+1, return year+1, etc.
  const nearJan1Next = getMondayOfISOWeek(year + 1, 1);
  if (ms >= nearJan1Next) return year + 1;
  const nearJan1Curr = getMondayOfISOWeek(year, 1);
  if (ms < nearJan1Curr) return year - 1;
  return year;
}

/**
 * Compute { weekStart, weekEnd } in UTC-midnight ms.
 * If numberOfWeek is undefined → current week.
 * Otherwise: yearsAhead = floor(n / 53), isoWeek = (n % 53) || 53
 */
function resolveWeekBounds(numberOfWeek?: number): { weekStart: number; weekEnd: number } {
  if (numberOfWeek === undefined) {
    const todayMs = utcMidnight(new Date());
    const jsDay = new Date(todayMs).getUTCDay();
    const weekStart = todayMs - ((jsDay + 6) % 7) * 86_400_000;
    return { weekStart, weekEnd: weekStart + 6 * 86_400_000 };
  }
  const yearsAhead = Math.floor(numberOfWeek / 53);
  const isoWeek = numberOfWeek % 53 || 53;
  const baseYear = isoWeekYear(utcMidnight(new Date()));
  const weekStart = getMondayOfISOWeek(baseYear + yearsAhead, isoWeek);
  return { weekStart, weekEnd: weekStart + 6 * 86_400_000 };
}

export const getWeekCourses: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;

  const rawWeek = req.params.numberOfWeek;
  const numberOfWeek = rawWeek !== undefined ? parseInt(rawWeek, 10) : undefined;
  if (numberOfWeek !== undefined && (isNaN(numberOfWeek) || numberOfWeek < 1)) {
    throw new Error("Invalid week number", { cause: { status: 400 } });
  }

  const { weekStart, weekEnd } = resolveWeekBounds(numberOfWeek);

  const [courses, settings] = await Promise.all([
    prisma.course.findMany({
      where: { tenantId, isDeleted: false, isActive: true },
      include: {
        category: { include: { target: true } },
        instructor: true,
        room: true,
      },
    }),
    prisma.settings.findUnique({ where: { tenantId } }),
  ]);

  const result: Record<number, object[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

  for (const course of courses) {
    const storedMs = ((course.dates as { date: string }[]) ?? [])
      .map((d) => utcMidnight(new Date(d.date)))
      .filter((ms) => ms >= weekStart && ms <= weekEnd);

    const count = course.isClub ? (course.clubRepetition ?? 50) : (course.courseRepetition ?? 8);
    const weekMs = storedMs.length
      ? storedMs
      : generateDatesFromCourse(course, settings as SettingsForDates, count)
          .map((s) => utcMidnight(new Date(s)))
          .filter((ms) => ms >= weekStart && ms <= weekEnd);

    if (weekMs.length === 0) continue;

    const info = {
      id: course.id,
      name: course.name,
      description: course.description,
      startsAt: course.startsAt,
      endsAt: course.endsAt,
      options: course.options,
      seatsCurrent: course.seatsCurrent,
      seatsMax: course.seatsMax,
      isBookedOut: course.isBookedOut,
      isClub: course.isClub,
      color: course.color,
      category: {
        id: course.category.id,
        name: course.category.name,
        color: (course.category as unknown as { color: string[] }).color,
      },
      target: {
        id: course.category.target.id,
        name: course.category.target.name,
        color: (course.category.target as unknown as { color: string[] }).color,
      },
      instructor: course.instructor
        ? {
            id: course.instructor.id,
            name: course.instructor.name,
            imageUrl: course.instructor.imageUrl,
          }
        : null,
      room: course.room
        ? { id: course.room.id, name: course.room.name, description: course.room.description }
        : null,
    };

    for (const ms of weekMs) {
      const weekday = (new Date(ms).getUTCDay() + 6) % 7; // 0=Mon … 6=Sun
      result[weekday]!.push(info);
    }
  }

  // sort each bucket by startsAt time-of-day
  const timeMinutes = (d: Date) => d.getUTCHours() * 60 + d.getUTCMinutes();
  for (const bucket of Object.values(result)) {
    (bucket as { startsAt: Date }[]).sort(
      (a, b) => timeMinutes(a.startsAt) - timeMinutes(b.startsAt),
    );
  }

  res.json(result);
};

function mapCourseBody(body: Record<string, unknown>) {
  const { category, room, instructor, textTerms, textInfo, ...rest } = body;
  const mappedCategoryId = (category ?? rest.categoryId) as string | undefined;
  return {
    ...rest,
    ...(mappedCategoryId !== undefined && { categoryId: mappedCategoryId }),
    ...(room !== undefined && { roomId: room as string }),
    ...(instructor !== undefined && { instructorId: instructor as string }),
    ...(textTerms !== undefined && { textTermsId: textTerms as string }),
    ...(textInfo !== undefined && { textInfoId: textInfo as string }),
  };
}

export const getCoursesByCategory: RequestHandler = async (req, res) => {
  const { id: categoryId } = req.params;
  const { tenantId } = req.user!;
  const courses = await prisma.course.findMany({
    where: { categoryId, tenantId, isDeleted: false },
  });
  res.json(courses);
};

export const getAllCourses: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const courses = await prisma.course.findMany({
    where: { tenantId, isDeleted: false },
  });
  res.json(courses);
};

export const getOneCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const course = await prisma.course.findFirst({
    where: { id, tenantId, isDeleted: false },
  });
  if (!course) throw new Error("Course not found", { cause: { status: 404 } });
  res.json(course);
};

export const createCourse: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const mappedBody = mapCourseBody(req.body);
  if (!mappedBody.categoryId) {
    throw new Error("Category is required", { cause: { status: 400 } });
  }
  const { categoryId, ...restBody } = mappedBody;
  const course = await prisma.course.create({
    data: { ...restBody, categoryId, tenantId },
  });
  res.status(201).json(course);
};

export const updateCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.course.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error("Course not found", { cause: { status: 404 } });
  const course = await prisma.course.update({
    where: { id },
    data: mapCourseBody(req.body),
  });
  res.json(course);
};

export const removeCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.course.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error("Course not found", { cause: { status: 404 } });
  await prisma.course.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
