import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllRegistrations: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const registrations = await prisma.registration.findMany({
    where: { tenantId, isDeleted: false },
  });
  res.json(registrations);
};

export const getOneRegistration: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const registration = await prisma.registration.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!registration) throw new Error('Registration not found', { cause: { status: 404 } });
  res.json(registration);
};

export const createRegistration: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const registration = await prisma.registration.create({
    data: { ...req.body, tenantId }
  });
  res.status(201).json(registration);
};

export const updateRegistration: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.registration.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Registration not found', { cause: { status: 404 } });
  const registration = await prisma.registration.update({ where: { id }, data: req.body });
  res.json(registration);
};

export const removeRegistration: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.registration.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Registration not found', { cause: { status: 404 } });
  await prisma.registration.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
