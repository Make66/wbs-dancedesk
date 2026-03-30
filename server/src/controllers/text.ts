import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllTexts: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const texts = await prisma.text.findMany({
    where: { tenantId, isDeleted: false },
  });
  res.json(texts);
};

export const getOneText: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const text = await prisma.text.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!text) throw new Error('Text not found', { cause: { status: 404 } });
  res.json(text);
};

export const createText: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const text = await prisma.text.create({
    data: { ...req.body, tenantId }
  });
  res.status(201).json(text);
};

export const updateText: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.text.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Text not found', { cause: { status: 404 } });
  const text = await prisma.text.update({ where: { id }, data: req.body });
  res.json(text);
};

export const removeText: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.text.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Text not found', { cause: { status: 404 } });
  await prisma.text.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
