import type { RequestHandler } from 'express';
import prisma from '#db';

// --- date generation helpers ---

interface HolidayEntry {
  start: { dateTime: string };
  end?: { dateTime: string };
}

interface ParsedHoliday { start: number; end: number }

function utcMidnight(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseHolidays(raw: unknown): ParsedHoliday[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[]).flatMap(h => {
    if (!h || typeof h !== 'object' || !('start' in h)) return [];
    const entry = h as HolidayEntry;
    const startMs = Date.parse(entry.start.dateTime);
    if (isNaN(startMs)) return [];
    const endMs = entry.end ? Date.parse(entry.end.dateTime) : startMs;
    return [{ start: startMs, end: isNaN(endMs) ? startMs : endMs }];
  });
}

function isHoliday(dateMs: number, holidays: ParsedHoliday[]): boolean {
  return holidays.some(h => dateMs >= h.start && dateMs <= h.end);
}

function nextOccurrence(dateMs: number, frequency: string): number {
  const d = new Date(dateMs);
  switch (frequency) {
    case 'daily':     d.setUTCDate(d.getUTCDate() + 1);    break;
    case 'bi-weekly': d.setUTCDate(d.getUTCDate() + 14);   break;
    case 'monthly':   d.setUTCMonth(d.getUTCMonth() + 1);  break;
    default:          d.setUTCDate(d.getUTCDate() + 7);    break; // weekly / ongoing
  }
  return d.getTime();
}

function formatDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export const getCourseDates: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;

  const [course, settings] = await Promise.all([
    prisma.course.findFirst({ where: { id, tenantId, isDeleted: false } }),
    prisma.settings.findUnique({ where: { tenantId } }),
  ]);
  if (!course) throw new Error('Course not found', { cause: { status: 404 } });

  const count = course.isClub
    ? (settings?.calendarOccurrences ?? 0)
    : course.numberOfDates;

  const stateHolsRaw = (() => {
    const s = settings as Record<string, unknown> | null;
    const sh = s?.schoolHolidays;
    const fs = s?.federalState as string | undefined;
    if (!fs || !sh || typeof sh !== 'object' || Array.isArray(sh)) return undefined;
    return (sh as Record<string, unknown>)[fs];
  })();

  const allHolidays = course.isIgnoreCalendar
    ? []
    : [...parseHolidays(settings?.holidays), ...parseHolidays(stateHolsRaw)];

  const dates: string[] = [];
  let current = utcMidnight(course.startsAt);
  const maxIterations = count * 10 + 365; // guard against infinite loop when many holidays
  let iterations = 0;

  while (dates.length < count && iterations < maxIterations) {
    if (!isHoliday(current, allHolidays)) dates.push(formatDate(current));
    current = nextOccurrence(current, course.frequency);
    iterations++;
  }

  res.json(dates);
};

function mapCourseBody(body: Record<string, unknown>) {
  const { category, room, instructor, textTerms, textInfo, ...rest } = body;
  return {
    ...rest,
    categoryId: category as string,
    ...(room !== undefined      && { roomId: room as string }),
    ...(instructor !== undefined && { instructorId: instructor as string }),
    ...(textTerms !== undefined  && { textTermsId: textTerms as string }),
    ...(textInfo !== undefined   && { textInfoId: textInfo as string }),
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
    where: { id, tenantId, isDeleted: false }
  });
  if (!course) throw new Error('Course not found', { cause: { status: 404 } });
  res.json(course);
};

export const createCourse: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const course = await prisma.course.create({
    data: { ...mapCourseBody(req.body), tenantId }
  });
  res.status(201).json(course);
};

export const updateCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.course.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Course not found', { cause: { status: 404 } });
  const course = await prisma.course.update({
    where: { id },
    data: mapCourseBody(req.body)
  });
  res.json(course);
};

export const removeCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.course.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Course not found', { cause: { status: 404 } });
  await prisma.course.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
