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
