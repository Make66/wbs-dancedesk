import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllLocations: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const locations = await prisma.location.findMany({
    where: { tenantId, isDeleted: false },
  });
  res.json(locations);
};

export const getOneLocation: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const location = await prisma.location.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!location) throw new Error('Location not found', { cause: { status: 404 } });
  res.json(location);
};

export const createLocation: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const location = await prisma.location.create({
    data: { ...req.body, tenantId }
  });
  res.status(201).json(location);
};

export const updateLocation: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.location.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Location not found', { cause: { status: 404 } });
  const sequences = req.body.setSeqTarget;
  const location = await prisma.location.update({ where: { id }, data: { ...req.body, setSeqTarget: sequences } });
  res.json(location);
};

export const removeLocation: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.location.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Location not found', { cause: { status: 404 } });
  await prisma.location.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
