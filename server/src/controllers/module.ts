import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllModules: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const modules = await prisma.module.findMany({
    where: { tenantId, isDeleted: false },
  });
  res.json(modules);
};

export const getOneModule: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const module = await prisma.module.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!module) throw new Error('Module not found', { cause: { status: 404 } });
  res.json(module);
};

export const createModule: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const module = await prisma.module.create({
    data: { ...req.body, tenantId }
  });
  res.status(201).json(module);
};

export const updateModule: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.module.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Module not found', { cause: { status: 404 } });
  const module = await prisma.module.update({ where: { id }, data: req.body });
  res.json(module);
};

export const removeModule: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.module.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Module not found', { cause: { status: 404 } });
  await prisma.module.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
