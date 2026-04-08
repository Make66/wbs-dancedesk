import type { RequestHandler } from 'express';
import prisma from '#db';

export const getCourseParticipants: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;

  const course = await prisma.course.findFirst({
    where: { id, tenantId, isDeleted: false },
    // @ts-expect-error — participant model available after `prisma generate`
    include: {
      participantCourses: {
        include: { participant: true },
      },
    },
  });
  if (!course) throw new Error('Course not found', { cause: { status: 404 } });

  // @ts-expect-error — participant model available after `prisma generate`
  const participants = (course.participantCourses as { participant: unknown; createdAt: Date }[])
    .map(pc => ({ ...pc.participant as object, enrolledAt: pc.createdAt }));

  res.json(participants);
};

export const getParticipantCourses: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;

  // @ts-expect-error — participant model available after `prisma generate`
  const participant = await (prisma as any).participant.findFirst({
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

  const courses = (participant.participantCourses as { course: unknown; createdAt: Date }[])
    .map(pc => ({ ...pc.course as object, enrolledAt: pc.createdAt }));

  res.json(courses);
};
