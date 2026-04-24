import type { RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma } from '../../generated/prisma/client.ts';
import prisma from '#db';
import { log } from '#utils';

const SRC = 'controllers/auth.ts';

const ACCESS_SECRET  = process.env.ACCESS_JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_JWT_SECRET;
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL;
const SALT_ROUNDS    = Number(process.env.SALT_ROUNDS ?? 10);

if (!ACCESS_SECRET || !REFRESH_SECRET || !REFRESH_TOKEN_TTL || !SALT_ROUNDS) {
  console.error('Missing ACCESS_JWT_SECRET, REFRESH_JWT_SECRET, REFRESH_TOKEN_TTL, or SALT_ROUNDS in environment variables');
  process.exit(1);
}

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
} as const;

// Dummy hash prevents timing attacks when user is not found
const DUMMY_HASH = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';

type Role = 'user' | 'participant' | 'admin';

function updateRefreshToken(id: string, hash: string | null, role: Role) {
  if (role === 'user')
    return prisma.user.updateMany({ where: { id }, data: { refreshToken: hash } });
  return prisma.participant.updateMany({ where: { id }, data: { refreshToken: hash } });
}

function findEntityById(id: string, role: Role) {
  if (role === 'user')
    return prisma.user.findFirst({ where: { id, isDeleted: false } });
  return prisma.participant.findFirst({ where: { id, isDeleted: false } });
}

async function issueTokens(entity: { id: string; tenantId: string }, role: Role, res: Response) {
  const accessToken = jwt.sign(
    { sub: entity.id, tenantId: entity.tenantId, role },
    ACCESS_SECRET!,
    { expiresIn: Number(process.env.ACCESS_TOKEN_TTL ?? 900) }
  );
  const refreshToken = jwt.sign(
    { sub: entity.id, role },
    REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
  const hash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await updateRefreshToken(entity.id, hash, role);
  res.cookie('accessToken',  accessToken,  { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

async function performLogin<T extends { id: string; tenantId: string; password: string; email: string | null; firstName: string | null; lastName: string | null }>(
  inputPassword: string,
  find: () => Promise<T | null>,
  role: Role,
  res: Response
): Promise<T> {
  const entity = await find();
  const match = await bcrypt.compare(inputPassword, entity?.password ?? DUMMY_HASH);
  if (!entity) {
    log(SRC, 'performLogin', 'Login failed: entity not found', { role });
    throw new Error('Invalid credentials', { cause: { status: 401 } });
  }
  if (!match) {
    log(SRC, 'performLogin', 'Login failed: password mismatch', { role, id: entity.id });
    throw new Error('Invalid credentials', { cause: { status: 401 } });
  }
  await issueTokens(entity, role, res);
  return entity;
}

export const register: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, tenantId, password } = req.body;
  log(SRC, 'register', 'Registering new user', { email, tenantId });

  const existing = await prisma.user.findFirst({ where: { email, tenantId, isDeleted: false } });
  if (existing) throw new Error('Email already in use', { cause: { status: 409 } });

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  let user;
  try {
    user = await prisma.user.create({
      data: { firstName, lastName, email, password: hash, tenantId },
    });
    log(SRC, 'register', 'Registering successful', { email, tenantId });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      log(SRC, 'register', 'Registering not possible, email already in use', { email, tenantId });
      throw new Error('Email already in use', { cause: { status: 409 } });
    }
    log(SRC, 'register', 'Registering error', { email, tenantId });
    throw e;
  }
  log(SRC, 'register', 'User created', { id: user.id, email: user.email });
  await issueTokens(user, 'user', res);
  res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
};

export const login: RequestHandler = async (req, res) => {
  const { email } = req.body;
  log(SRC, 'login', 'Login attempt', { email });
  const user = await performLogin(
    req.body.password,
    () => prisma.user.findFirst({ where: { email, isDeleted: false } }),
    'user',
    res
  );
  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
  log(SRC, 'login', 'Login successful', { id: user.id, email: user.email });
  res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
};

export const participantLogin: RequestHandler = async (req, res) => {
  const { email, tenantId } = req.body;
  log(SRC, 'participantLogin', 'Participant login attempt', { email, tenantId });
  // tenantId is required because participant email is not globally unique
  const participant = await performLogin(
    req.body.password,
    () => prisma.participant.findFirst({ where: { email, tenantId, isDeleted: false } }),
    'participant',
    res
  );
  log(SRC, 'participantLogin', 'Participant login successful', { id: participant.id, email: participant.email });
  res.json({ id: participant.id, email: participant.email, firstName: participant.firstName, lastName: participant.lastName });
};

export const refresh: RequestHandler = async (req, res) => {
  log(SRC, 'refresh', 'Token refresh attempt');
  const token = req.cookies.refreshToken as string | undefined;
  if (!token) throw new Error('Not authenticated', { cause: { status: 401 } });

  let sub: string;
  let role: Role;
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET!) as jwt.JwtPayload;
    sub = decoded.sub as string;
    role = (decoded.role ?? 'user') as Role;
  } catch {
    throw new Error('Invalid or expired refresh token', { cause: { status: 401 } });
  }

  const entity = await findEntityById(sub, role);
  if (!entity || !entity.refreshToken) throw new Error('Not authenticated', { cause: { status: 401 } });

  const tokenMatch = await bcrypt.compare(token, entity.refreshToken);
  if (!tokenMatch) throw new Error('Invalid refresh token', { cause: { status: 401 } });

  await issueTokens(entity, role, res);
  log(SRC, 'refresh', 'Token refreshed', { id: sub, role });
  res.json({ ok: true });
};

export const logout: RequestHandler = async (req, res) => {
  log(SRC, 'logout', 'Logout request');
  const token = req.cookies.refreshToken as string | undefined;
  if (token) {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET!) as jwt.JwtPayload;
      const role = (decoded.role ?? 'user') as Role;
      await updateRefreshToken(decoded.sub as string, null, role);
      log(SRC, 'logout', 'Refresh token invalidated', { id: decoded.sub, role });
    } catch {
      // token invalid — clear cookies anyway
    }
  }
  res.clearCookie('accessToken').clearCookie('refreshToken').status(204).send();
};

export const me: RequestHandler = async (req, res) => {
  const { id } = req.user!;
  log(SRC, 'me', 'Fetching current user', { id });
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    omit: { password: true, refreshToken: true },
    include: { modules: true },
  });
  if (!user) throw new Error('User not found', { cause: { status: 404 } });
  res.json({ user });
};

export const participantMe: RequestHandler = async (req, res) => {
  const { id } = req.user!;
  log(SRC, 'participantMe', 'Fetching current participant', { id });
  const participant = await prisma.participant.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true, email: true, firstName: true, lastName: true, imageUrl: true, phone: true, birthDate: true,
      gender: true, street: true, city: true, zipCode: true, longitude: true, latitude: true
    },
  });
  if (!participant) throw new Error('Participant not found', { cause: { status: 404 } });
  res.json({ participant });
};
