import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import prisma from '#db';

export const getAllUsers: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const users = await prisma.user.findMany({
    where: { tenantId, isDeleted: false },
    omit: { password: true, refreshToken: true },
  });
  res.json(users);
};

export const getOneUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const user = await prisma.user.findFirst({
    where: { id, tenantId, isDeleted: false },
    omit: { password: true, refreshToken: true },
    include: { locations: true, modules: true },
  });
  if (!user) throw new Error('User not found', { cause: { status: 404 } });
  res.json(user);
};

export const createUser: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const { password, locations, modules, ...rest } = req.body;
  const user = await prisma.user.create({
    data: {
      ...rest,
      password: await bcrypt.hash(password, 10),
      tenantId,
      locations: { connect: (locations ?? []).map((id: string) => ({ id })) },
      modules:   { connect: (modules   ?? []).map((id: string) => ({ id })) },
    },
    omit: { password: true, refreshToken: true },
  });
  res.status(201).json(user);
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.user.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('User not found', { cause: { status: 404 } });
  const { password, locations, modules, ...rest } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      ...(password  !== undefined && { password:  await bcrypt.hash(password, 10) }),
      ...(locations !== undefined && { locations: { set: locations.map((lid: string) => ({ id: lid })) } }),
      ...(modules   !== undefined && { modules:   { set: modules  .map((mid: string) => ({ id: mid })) } }),
    },
    omit: { password: true, refreshToken: true },
  });
  res.json(user);
};

export const removeUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.user.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('User not found', { cause: { status: 404 } });
  await prisma.user.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
