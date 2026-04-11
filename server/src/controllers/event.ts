import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllEvents: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const events = await prisma.event.findMany({
    where: { tenantId, isDeleted: false },
  });
  res.json(events);
};

export const getEventsByRoom: RequestHandler = async (req, res) => {
  const { id: roomId } = req.params;
  const { tenantId } = req.user!;
  const events = await prisma.event.findMany({
    where: { roomId, tenantId, isDeleted: false },
  });
  res.json(events);
};

export const getEventsByLocation: RequestHandler = async (req, res) => {
  const { id: locationId } = req.params;
  const { tenantId } = req.user!;
  const events = await prisma.event.findMany({
    where: { locationId, tenantId, isDeleted: false },
  });
  res.json(events);
};

function resolveMonthBounds(numberOfMonth?: number): { monthStart: Date; monthEnd: Date } {
  const now = new Date();
  const offset = numberOfMonth ?? 0;
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const targetYear = year + Math.floor((month + offset) / 12);
  const targetMonth = (month + offset) % 12;
  const monthStart = new Date(Date.UTC(targetYear, targetMonth, 1));
  const monthEnd = new Date(Date.UTC(targetYear, targetMonth + 1, 1));
  return { monthStart, monthEnd };
}

export const getMonthEvents: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;

  const rawMonth = req.params.number;
  const numberOfMonth = rawMonth !== undefined ? parseInt(rawMonth, 10) : undefined;
  if (numberOfMonth !== undefined && (isNaN(numberOfMonth) || numberOfMonth < 0)) {
    throw new Error('Invalid month number', { cause: { status: 400 } });
  }

  const { monthStart, monthEnd } = resolveMonthBounds(numberOfMonth);

  const events = await prisma.event.findMany({
    where: { tenantId, isDeleted: false, startsAt: { gte: monthStart, lt: monthEnd } },
    orderBy: { startsAt: 'asc' },
  });

  const result: Record<number, object[]> = {};
  for (const event of events) {
    const day = new Date(event.startsAt).getUTCDate();
    if (!result[day]) result[day] = [];
    result[day]!.push(event);
  }

  res.json(result);
};

export const getUpcomingEvents: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const upperBound = new Date(yesterday);
  upperBound.setDate(upperBound.getDate() + 8);
  const events = await prisma.event.findMany({
    where: { tenantId, isDeleted: false, startsAt: { gt: yesterday, lte: upperBound } },
    orderBy: { startsAt: 'asc' },
  });
  res.json(events);
};

export const getOneEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const event = await prisma.event.findFirst({
    where: { id, tenantId, isDeleted: false },
  });
  if (!event) throw new Error('Event not found', { cause: { status: 404 } });
  res.json(event);
};

export const createEvent: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const event = await prisma.event.create({
    data: { ...req.body, tenantId },
  });
  res.status(201).json(event);
};

export const updateEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.event.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Event not found', { cause: { status: 404 } });
  const event = await prisma.event.update({ where: { id }, data: req.body });
  res.json(event);
};

export const removeEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.event.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Event not found', { cause: { status: 404 } });
  await prisma.event.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
