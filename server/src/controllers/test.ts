import type { RequestHandler } from "express";
import prisma from "#db";

function utcMidnight(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function getMondayOfISOWeek(year: number, week: number): number {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const day = jan4.getUTCDay() || 7;

  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setUTCDate(jan4.getUTCDate() - (day - 1));

  const result = new Date(mondayWeek1);
  result.setUTCDate(mondayWeek1.getUTCDate() + (week - 1) * 7);

  return utcMidnight(result);
}

export const getWeeekCourses: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;

  const year = parseInt(req.params.year, 10);
  const week = parseInt(req.params.week, 10);

  if (isNaN(year) || isNaN(week) || week < 1 || week > 53) {
    throw new Error("Invalid year or week", { cause: { status: 400 } });
  }

  const weekStart = getMondayOfISOWeek(year, week);
  const weekEnd = weekStart + 6 * 86_400_000;

  const courses = await prisma.course.findMany({
    where: {
      tenantId,
      isDeleted: false,
      isActive: true,
    },
    include: {
      category: { include: { target: true } },
      instructor: true,
      room: true,
    },
  });

  const result: Record<number, object[]> = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  for (const course of courses) {
    const dates = ((course.dates as { date: string }[]) ?? [])
      .map((d) => utcMidnight(new Date(d.date)))
      .filter((ms) => ms >= weekStart && ms <= weekEnd);

    if (!dates.length) continue;

    const info = {
      id: course.id,
      name: course.name,
      startsAt: course.startsAt,
      endsAt: course.endsAt,
      color: course.color,
      room: course.room,
    };

    for (const ms of dates) {
      const weekday = (new Date(ms).getUTCDay() + 6) % 7;
      result[weekday]!.push(info);
    }
  }

  res.json(result);
};