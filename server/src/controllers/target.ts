import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAll: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const targets = await prisma.target.findMany({
    where: { tenantId, isDeleted: false },
    orderBy: { seq: 'asc' }
  });
  res.json(targets);
};

export const getOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const target = await prisma.target.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!target) throw new Error('Target not found', { cause: { status: 404 } });
  res.json(target);
};

export const create: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const target = await prisma.target.create({
    data: { ...req.body, tenantId }
  });
  res.status(201).json(target);
};

export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.target.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!exists) throw new Error('Target not found', { cause: { status: 404 } });
  const target = await prisma.target.update({
    where: { id },
    data: req.body
  });
  res.json(target);
};

export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.target.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!exists) throw new Error('Target not found', { cause: { status: 404 } });
  await prisma.target.update({
    where: { id },
    data: { isDeleted: true }
  });
  res.status(204).send();
};
