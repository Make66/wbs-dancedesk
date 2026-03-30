import type { RequestHandler } from 'express';
import prisma from '#db';
import { setSeqCourseSchema } from '#schemas/course';

export const getAllCategories: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const categories = await prisma.category.findMany({
    where: { tenantId, isDeleted: false },
    orderBy: { seq: 'asc' }
  });
  res.json(categories);
};

export const getCategoriesByTarget: RequestHandler = async (req, res) => {
  const { id: targetId } = req.params;
  const { tenantId } = req.user!;
  const categories = await prisma.category.findMany({
    where: { targetId, tenantId, isDeleted: false },
    orderBy: { seq: 'asc' }
  });
  res.json(categories);
};

export const getOneCategory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const category = await prisma.category.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!category) throw new Error('Category not found', { cause: { status: 404 } });
  res.json(category);
};

export const createCategory: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const { target, ...rest } = req.body;
  const category = await prisma.category.create({
    data: { ...rest, targetId: target, tenantId }
  });
  res.status(201).json(category);
};

export const updateCategory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.category.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Category not found', { cause: { status: 404 } });
  const { target, ...rest } = req.body;
  const parsed = setSeqCourseSchema.parse(req.body.setSeqCourse);
  const category = await prisma.category.update({
    where: { id },
    data: { ...rest, ...(target !== undefined && { targetId: target }), setSeqCourse: parsed }
  });
  res.json(category);
};

export const removeCategory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.category.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Category not found', { cause: { status: 404 } });
  await prisma.category.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
