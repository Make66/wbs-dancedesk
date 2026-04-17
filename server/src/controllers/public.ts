import type { RequestHandler } from 'express';
import prisma from '#db';
import { log } from '#utils';

const SRC = 'controllers/public.ts';

const PUBLIC_FILTER = { isActive: true, isDeleted: false };

export const bootstrapHandler: RequestHandler = async (req, res) => {
  const { tenantId, customerId } = req.publicTenant!;
  log(SRC, 'bootstrapHandler', 'Public bootstrap fetch', { tenantId });

  const [customer, locations, targets, categories] = await Promise.all([
    prisma.customer.findFirst({
      where: { id: customerId, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        website: true,
        logoUrl: true,
        primary: true,
        secondary: true,
        tertiary: true,
        quaternary: true,
        street: true,
        city: true,
        zipCode: true,
        longitude: true,
        latitude: true,
      }
    }),
    prisma.location.findMany({
      where: { tenantId, ...PUBLIC_FILTER },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        street: true,
        city: true,
        zipCode: true,
        state: true,
        longitude: true,
        latitude: true,
      },
      orderBy: { name: 'asc' }
    }),
    prisma.target.findMany({
      where: { tenantId, ...PUBLIC_FILTER },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        locationId: true,
        setSeqCategory: true,
      },
      orderBy: { name: 'asc' }
    }),
    prisma.category.findMany({
      where: {
        tenantId,
        ...PUBLIC_FILTER,
        target: PUBLIC_FILTER,   // only categories belonging to active targets
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        targetId: true,
        setSeqCourse: true,
      },
      orderBy: { name: 'asc' }
    }),
  ]);

  res.json({ customer, locations, targets, categories });
};

export const coursesHandler: RequestHandler = async (req, res) => {
  const { tenantId } = req.publicTenant!;
  const { categoryId, locationId } = req.query as Record<string, string | undefined>;
  log(SRC, 'coursesHandler', 'Public courses fetch', { tenantId, categoryId, locationId });

  const courses = await prisma.course.findMany({
    where: {
      tenantId,
      ...PUBLIC_FILTER,
      category: PUBLIC_FILTER,          // only courses in active categories
      ...(categoryId ? { categoryId } : {}),
      ...(locationId ? { locationId } : {}),
    },
    select: {
      id: true,
      name: true,
      description: true,
      startsAt: true,
      endsAt: true,
      frequency: true,
      dates: true,
      seatsCurrent: true,
      seatsMax: true,
      isBookedOut: true,
      options: true,
      categoryId: true,
      locationId: true,
      instructor: {
        select: { id: true, name: true, imageUrl: true }
      }
    },
    orderBy: { startsAt: 'asc' }
  });

  res.json({ courses });
};
