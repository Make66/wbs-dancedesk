import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllInstructors: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const instructors = await prisma.instructor.findMany({
    where: { tenantId, isDeleted: false },
    orderBy: { name: 'asc' }
  });
  res.json(instructors);
};

export const getCoursesByInstructor: RequestHandler = async (req, res) => {
  const { id: instructorId } = req.params;
  const { tenantId } = req.user!;
  const courses = await prisma.course.findMany({
    where: { instructorId, tenantId, isDeleted: false },
  });
  res.json(courses);
};

export const getOneInstructor: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const instructor = await prisma.instructor.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!instructor) throw new Error('Instructor not found', { cause: { status: 404 } });
  res.json(instructor);
};

export const createInstructor: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  console.log('req.user', req.user);
  const instructor = await prisma.instructor.create({
    data: { ...req.body, tenantId }
  });
  console.log('req.body', req.body);
  res.status(201).json(instructor);
};

export const updateInstructor: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.instructor.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Instructor not found', { cause: { status: 404 } });
  const instructor = await prisma.instructor.update({ where: { id }, data: req.body });
  res.json(instructor);
};

export const removeInstructor: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.instructor.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Instructor not found', { cause: { status: 404 } });
  await prisma.instructor.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
