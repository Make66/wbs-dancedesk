import type { RequestHandler } from 'express';
import prisma from '#db';

export const getTargetsByLocation: RequestHandler = async (req, res) => {
  const { id: locationId } = req.params;
  const { tenantId } = req.user!;
  const targets = await prisma.target.findMany({
    where: { locationId, tenantId, isDeleted: false },
  });
  res.json(targets);
};

export const getAllTargets: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const targets = await prisma.target.findMany({
    where: { tenantId, isDeleted: false },
  });
  res.json(targets);
};

export const getOneTarget: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const target = await prisma.target.findFirst({
    where: { id, tenantId, isDeleted: false },
  });
  if (!target) throw new Error('Target not found', { cause: { status: 404 } });
  res.json(target);
};

export const createTarget: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const target = await prisma.target.create({
    data: { ...req.body, tenantId }
  });
  res.status(201).json(target);
};

export const updateTarget: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.target.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Target not found', { cause: { status: 404 } });
  const sequences = req.body.setSeqCategory;
  const target = await prisma.target.update({ where: { id }, data: { ...req.body, setSeqCategory: sequences } });
  res.json(target);
};

export const getTargetWithCourses: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const target = await prisma.target.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!target) throw new Error('Target not found', { cause: { status: 404 } });
  const categories = await prisma.category.findMany({
    where: { targetId: id, tenantId, isDeleted: false },
  });
  const categoriesWithCourses = await Promise.all(
    categories.map(async (category) => {
      const courses = await prisma.course.findMany({
        where: { categoryId: category.id, tenantId, isDeleted: false },
      });
      return { ...category, courses };
    })
  );
  res.json({ ...target, categories: categoriesWithCourses });
};

export const removeTarget: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.target.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Target not found', { cause: { status: 404 } });
  await prisma.target.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
