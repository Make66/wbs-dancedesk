import type { RequestHandler } from 'express';
import prisma from '#db';

function mapCourseBody(body: Record<string, unknown>) {
  const { category, room, instructor, textTerms, textInfo, ...rest } = body;
  return {
    ...rest,
    categoryId: category,
    ...(room !== undefined      && { roomId: room }),
    ...(instructor !== undefined && { instructorId: instructor }),
    ...(textTerms !== undefined  && { textTermsId: textTerms }),
    ...(textInfo !== undefined   && { textInfoId: textInfo }),
  };
}

export const getCoursesByCategory: RequestHandler = async (req, res) => {
  const { id: categoryId } = req.params;
  const { tenantId } = req.user!;
  const courses = await prisma.course.findMany({
    where: { categoryId, tenantId, isDeleted: false },
  });
  res.json(courses);
};

export const getAllCourses: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const courses = await prisma.course.findMany({
    where: { tenantId, isDeleted: false },
  });
  res.json(courses);
};

export const getOneCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const course = await prisma.course.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!course) throw new Error('Course not found', { cause: { status: 404 } });
  res.json(course);
};

export const createCourse: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const course = await prisma.course.create({
    data: { ...mapCourseBody(req.body), tenantId }
  });
  res.status(201).json(course);
};

export const updateCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.course.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Course not found', { cause: { status: 404 } });
  const course = await prisma.course.update({
    where: { id },
    data: mapCourseBody(req.body)
  });
  res.json(course);
};

export const removeCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.course.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Course not found', { cause: { status: 404 } });
  await prisma.course.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
