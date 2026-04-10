import type { RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.ts';
import prisma from '#db';

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

type Role = 'user' | 'participant';

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

async function performLogin<T extends { id: string; tenantId: string; password: string }>(
  inputPassword: string,
  find: () => Promise<T | null>,
  role: Role,
  res: Response
): Promise<T> {
  const entity = await find();
  const match = await bcrypt.compare(inputPassword, entity?.password ?? DUMMY_HASH);
  if (!entity || !match) throw new Error('Invalid credentials', { cause: { status: 401 } });
  await issueTokens(entity, role, res);
  return entity;
}

export const register: RequestHandler = async (req, res) => {
  console.log('[register] body:', { ...req.body, password: '***' });
  const { firstName, lastName, email, password, tenantId } = req.body;

  const existing = await prisma.user.findFirst({ where: { email, tenantId, isDeleted: false } });
  if (existing) throw new Error('Email already in use', { cause: { status: 409 } });

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  let user;
  try {
    user = await prisma.user.create({
      data: { firstName, lastName, email, password: hash, tenantId },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new Error('Email already in use', { cause: { status: 409 } });
    }
    throw e;
  }

  console.log('[register] user created:', user.id);
  await issueTokens(user, 'user', res);
  res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await performLogin(
    password,
    () => prisma.user.findFirst({ where: { email, isDeleted: false } }),
    'user',
    res
  );
  res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
};

export const participantLogin: RequestHandler = async (req, res) => {
  const { email, password, tenantId } = req.body;
  // tenantId is required because participant email is not globally unique
  const participant = await performLogin(
    password,
    () => prisma.participant.findFirst({ where: { email, tenantId, isDeleted: false } }),
    'participant',
    res
  );
  res.json({ id: participant.id, email: participant.email, firstName: participant.firstName, lastName: participant.lastName });
};

export const refresh: RequestHandler = async (req, res) => {
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
  res.json({ ok: true });
};

export const logout: RequestHandler = async (req, res) => {
  const token = req.cookies.refreshToken as string | undefined;
  if (token) {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET!) as jwt.JwtPayload;
      const role = (decoded.role ?? 'user') as Role;
      await updateRefreshToken(decoded.sub as string, null, role);
    } catch {
      // token invalid — clear cookies anyway
    }
  }
  res.clearCookie('accessToken').clearCookie('refreshToken').status(204).send();
};

export const me: RequestHandler = async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.user!.id, isDeleted: false },
    select: { id: true, email: true, firstName: true, lastName: true, modules: true, imageUrl: true },
  });
  if (!user) throw new Error('User not found', { cause: { status: 404 } });
  res.json({ user });
};

export const participantMe: RequestHandler = async (req, res) => {
  const participant = await prisma.participant.findFirst({
    where: { id: req.user!.id, isDeleted: false },
    select: { id: true, email: true, firstName: true, lastName: true, imageUrl: true, phone: true, birthDate: true, gender: true },
  });
  if (!participant) throw new Error('Participant not found', { cause: { status: 404 } });
  res.json({ participant });
};
