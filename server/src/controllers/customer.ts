import type { RequestHandler } from 'express';
import { randomBytes } from 'crypto';
import prisma from '#db';
import { log } from '#utils';

const SRC = 'controllers/customer.ts';

export const getAllCustomers: RequestHandler = async (req, res) => {
  const { tenantId, role } = req.user!;
  const tenantFilter = role === 'admin' ? {} : { tenantId };
  log(SRC, 'getAllCustomers', 'Fetching all customers', { tenantId, role });
  const customers = await prisma.customer.findMany({
    where: { ...tenantFilter, isDeleted: false },
    orderBy: { name: 'asc' }
  });
  res.json(customers);
};

export const getOneCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId, role } = req.user!;
  const tenantFilter = role === 'admin' ? {} : { tenantId };
  log(SRC, 'getOneCustomer', 'Fetching customer', { id, tenantId, role });
  const customer = await prisma.customer.findFirst({
    where: { id, ...tenantFilter, isDeleted: false }
  });
  if (!customer) throw new Error('Customer not found', { cause: { status: 404 } });
  res.json(customer);
};

export const getCustomerBySignInKey: RequestHandler = async (req, res) => {
  const { signInKey } = req.params;
  log(SRC, 'getCustomerBySignInKey', 'Fetching customer by signInKey', { signInKey });
  const customer = await prisma.customer.findFirst({
    where: { signInKey, isDeleted: false },
    select: { 
      id: true, 
      tenantId: true, 
      name: true, 
      email: true,
      website: true,
      logoUrl: true, 
      primary: true, 
      secondary: true, 
      tertiary: true, 
      quaternary: true, 
      signInKey: true,
      apiKey: true,
      street: true,
      city: true,
      zipCode: true,
      longitude: true,
      latitude: true
    }
  });
  if (!customer) throw new Error('Customer not found', { cause: { status: 404 } });
  res.json(customer);
};

export const createCustomer: RequestHandler = async (req, res) => {
  const { tenantId, role } = req.user!;
  const assignedTenantId = role === 'admin' ? req.body.tenantId : tenantId;
  log(SRC, 'createCustomer', 'Creating customer', { assignedTenantId, role });
  const customer = await prisma.customer.create({
    data: { ...req.body, tenantId: assignedTenantId }
  });
  log(SRC, 'createCustomer', 'Customer created', { id: customer.id, assignedTenantId });
  res.status(201).json(customer);
};

export const updateCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId, role } = req.user!;
  const tenantFilter = role === 'admin' ? {} : { tenantId };
  log(SRC, 'updateCustomer', 'Updating customer', { id, tenantId, role });
  const exists = await prisma.customer.findFirst({ where: { id, ...tenantFilter, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  const sequences = req.body.setSeqLocation;
  const customer = await prisma.customer.update({ where: { id }, data: { ...req.body, setSeqLocation: sequences } });
  res.json(customer);
};

export const removeCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId, role } = req.user!;
  const tenantFilter = role === 'admin' ? {} : { tenantId };
  log(SRC, 'removeCustomer', 'Removing customer', { id, tenantId, role });
  const exists = await prisma.customer.findFirst({ where: { id, ...tenantFilter, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  await prisma.customer.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};

export const rotateApiKey: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId, role } = req.user!;
  const tenantFilter = role === 'admin' ? {} : { tenantId };
  log(SRC, 'rotateApiKey', 'Rotating API key', { id, tenantId, role });
  const exists = await prisma.customer.findFirst({ where: { id, ...tenantFilter, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  const apiKey = randomBytes(32).toString('hex');
  await prisma.customer.update({ where: { id }, data: { apiKey } });
  log(SRC, 'rotateApiKey', 'API key rotated', { id });
  res.json({ apiKey });
};

export const rotateSignInKey: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId, role } = req.user!;
  const tenantFilter = role === 'admin' ? {} : { tenantId };
  log(SRC, 'rotateSignInKey', 'Rotating sign-in key', { id, tenantId, role });
  const exists = await prisma.customer.findFirst({ where: { id, ...tenantFilter, isDeleted: false } });
  if (!exists) throw new Error('Customer not found', { cause: { status: 404 } });
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const signInKey = Array.from(randomBytes(5), (b) => chars[b % chars.length]).join('');
  await prisma.customer.update({ where: { id }, data: { signInKey } });
  log(SRC, 'rotateSignInKey', 'Sign-in key rotated', { id });
  res.json({ signInKey });
};
