import type { RequestHandler } from 'express';
import { randomBytes } from 'crypto';
import prisma from '#db';
import { log } from '#utils';

const SRC = 'controllers/customer.ts';

export const getAllCustomers: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  log(SRC, 'getAllCustomers', 'Fetching all customers', { tenantId });
  const customers = await prisma.customer.findMany({
    where: { tenantId, isDeleted: false },
    orderBy: { name: 'asc' }
  });
  res.json(customers);
};

export const getOneCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  log(SRC, 'getOneCustomer', 'Fetching customer', { id, tenantId });
  const customer = await prisma.customer.findFirst({
    where: { id, tenantId, isDeleted: false }
  });
  if (!customer) throw new Error('Customer not found', { cause: { status: 404 } });
  res.json(customer);
};

export const getCustomerBySignInKey: RequestHandler = async (req, res) => {
  const { signInKey } = req.params;
  log(SRC, 'getCustomerBySignInKey', 'Fetching customer by signInKey', { signInKey });
  const customer = await prisma.customer.findFirst({
    where: { signInKey, isDeleted: false },
    select: { id: true, name: true, logoUrl: true, primary: true, secondary: true, tertiary: true, quaternary: true, website: true }
  });
  if (!customer) throw new Error('Customer not found', { cause: { status: 404 } });
  res.json(customer);
};

export const createCustomer: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  log(SRC, 'createCustomer', 'Creating customer', { tenantId });
  const customer = await prisma.customer.create({
    data: { ...req.body, tenantId }
  });
  log(SRC, 'createCustomer', 'Customer created', { id: customer.id, tenantId });
  res.status(201).json(customer);
};

export const updateCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  log(SRC, 'updateCustomer', 'Updating customer', { id, tenantId });
  const exists = await prisma.customer.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  const sequences = req.body.setSeqLocation;
  const customer = await prisma.customer.update({ where: { id }, data: { ...req.body, setSeqLocation: sequences } });
  res.json(customer);
};

export const removeCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  log(SRC, 'removeCustomer', 'Removing customer', { id, tenantId });
  const exists = await prisma.customer.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  await prisma.customer.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};

export const rotateApiKey: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  log(SRC, 'rotateApiKey', 'Rotating API key', { id, tenantId });
  const exists = await prisma.customer.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  const apiKey = randomBytes(32).toString('hex');
  await prisma.customer.update({ where: { id }, data: { apiKey } });
  log(SRC, 'rotateApiKey', 'API key rotated', { id, tenantId });
  res.json({ apiKey });
};
