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

async function issueTokens(user: { id: string; tenantId: string }, res: Response) {
  const accessToken = jwt.sign(
    { sub: user.id, tenantId: user.tenantId }, 
    ACCESS_SECRET!, 
    { expiresIn: Number(process.env.ACCESS_TOKEN_TTL ?? 900) } // seconds, e.g. 900 = 15 min
  );
  const refreshToken = jwt.sign(
    { sub: user.id },                          
    REFRESH_SECRET!, 
    { expiresIn: '7d'  }
  );
  const hash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hash } });
  res.cookie('accessToken',  accessToken,  { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
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
  await issueTokens(user, res);
  res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({ where: { email, isDeleted: false } });

  // always run compare to prevent timing attacks — use dummy hash if user not found
  const passwordMatch = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
  if (!user || !passwordMatch) throw new Error('Invalid credentials', { cause: { status: 401 } });

  await issueTokens(user, res);
  res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
};

export const refresh: RequestHandler = async (req, res) => {
  const token = req.cookies.refreshToken as string | undefined;
  if (!token) throw new Error('Not authenticated', { cause: { status: 401 } });

  let sub: string;
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET!) as jwt.JwtPayload;
    sub = decoded.sub as string;
  } catch {
    throw new Error('Invalid or expired refresh token', { cause: { status: 401 } });
  }

  const user = await prisma.user.findFirst({ where: { id: sub, isDeleted: false } });
  if (!user || !user.refreshToken) throw new Error('Not authenticated', { cause: { status: 401 } });

  const tokenMatch = await bcrypt.compare(token, user.refreshToken);
  if (!tokenMatch) throw new Error('Invalid refresh token', { cause: { status: 401 } });

  await issueTokens(user, res);
  res.json({ ok: true });
};

export const logout: RequestHandler = async (req, res) => {
  const token = req.cookies.refreshToken as string | undefined;
  if (token) {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET!) as jwt.JwtPayload;
      await prisma.user.updateMany({
        where: { id: decoded.sub as string },
        data: { refreshToken: null },
      });
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
  res.json({user});
};
