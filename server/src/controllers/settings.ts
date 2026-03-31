import type { RequestHandler } from 'express';
import prisma from '#db';

export const getSettings: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const settings = await prisma.settings.findUnique({ where: { tenantId } });
  res.json(settings);
};

export const upsertSettings: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const settings = await prisma.settings.upsert({
    where: { tenantId },
    create: { ...req.body, tenantId },
    update: { ...req.body },
  });
  res.json(settings);
};
