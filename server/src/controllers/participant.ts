import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllParticipants: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const { cursor, limit = '20', search } = req.query;
  const take = Math.min(parseInt(limit as string), 100);
  const searchTerm = typeof search === 'string' && search.trim() ? search.trim() : undefined;

  const participants = await prisma.participant.findMany({
    where: {
      tenantId,
      isDeleted: false,
      ...(searchTerm && {
        OR: [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: [{ lastName: 'asc' }, { id: 'asc' }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor as string }, skip: 1 } : {}),
  });

  const hasMore = participants.length > take;
  const data = hasMore ? participants.slice(0, take) : participants;
  const nextCursor = hasMore ? data[data.length - 1]?.id : null;

  res.json({ data, nextCursor });
};

export const getOneParticipant: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const participant = await prisma.participant.findFirst({
    where: { id, tenantId, isDeleted: false },
  });
  if (!participant) throw new Error('Participant not found', { cause: { status: 404 } });
  res.json(participant);
};

export const createParticipant: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const participant = await prisma.participant.create({
    data: { ...req.body, tenantId },
  });
  res.status(201).json(participant);
};

export const updateParticipant: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.participant.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Participant not found', { cause: { status: 404 } });
  const participant = await prisma.participant.update({ where: { id }, data: req.body });
  res.json(participant);
};

export const removeParticipant: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.participant.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Participant not found', { cause: { status: 404 } });
  await prisma.participant.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};

export const getCourseParticipants: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;

  const course = await prisma.course.findFirst({
    where: { id, tenantId, isDeleted: false },
    include: {
      participantCourses: {
        include: { participant: true },
      },
    },
  });
  if (!course) throw new Error('Course not found', { cause: { status: 404 } });

  const participants = course.participantCourses
    .map(pc => ({ ...pc.participant, enrolledAt: pc.createdAt }));

  res.json(participants);
};

export const getParticipantCourses: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;

  const participant = await prisma.participant.findFirst({
    where: { id, tenantId, isDeleted: false },
    include: {
      participantCourses: {
        include: {
          course: {
            include: {
              category: { include: { target: true } },
              instructor: true,
              room: true,
            },
          },
        },
      },
    },
  });
  if (!participant) throw new Error('Participant not found', { cause: { status: 404 } });

  const courses = participant.participantCourses
    .map(pc => ({ ...pc.course, enrolledAt: pc.createdAt }));

  res.json(courses);
};
