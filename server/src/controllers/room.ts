import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllRooms: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const rooms = await prisma.room.findMany({
    where: { tenantId, isDeleted: false },
    orderBy: { seq: 'asc' }
  });
  res.json(rooms);
};

export const getOneRoom: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const room = await prisma.room.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!room) throw new Error('Room not found', { cause: { status: 404 } });
  res.json(room);
};

export const createRoom: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const room = await prisma.room.create({
    data: { ...req.body, tenantId }
  });
  res.status(201).json(room);
};

export const updateRoom: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.room.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Room not found', { cause: { status: 404 } });
  const room = await prisma.room.update({ where: { id }, data: req.body });
  res.json(room);
};

export const removeRoom: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.room.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Room not found', { cause: { status: 404 } });
  await prisma.room.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
