import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllCustomers: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const customers = await prisma.customer.findMany({
    where: { tenantId, isDeleted: false },
    orderBy: { name: 'asc' }
  });
  res.json(customers);
};

export const getOneCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const customer = await prisma.customer.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!customer) throw new Error('Customer not found', { cause: { status: 404 } });
  res.json(customer);
};

export const createCustomer: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const customer = await prisma.customer.create({
    data: { ...req.body, tenantId }
  });
  res.status(201).json(customer);
};

export const updateCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.customer.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  const sequences = req.body.setSeqLocation;
  const customer = await prisma.customer.update({ where: { id }, data: { ...req.body, setSeqLocation: sequences } });
  res.json(customer);
};

export const removeCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.customer.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  await prisma.customer.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
