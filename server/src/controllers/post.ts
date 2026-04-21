import type { RequestHandler } from 'express';
import prisma from '#db';

export const getAllPosts: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const posts = await prisma.post.findMany({
    where: { tenantId, isDeleted: false },
    orderBy: { date: 'desc' },
  });
  res.json(posts);
};

export const getOnePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const post = await prisma.post.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!post) throw new Error('Post not found', { cause: { status: 404 } });
  res.json(post);
};

export const createPost: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  const post = await prisma.post.create({ data: { ...req.body, tenantId } });
  res.status(201).json(post);
};

export const updatePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.post.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Post not found', { cause: { status: 404 } });
  const post = await prisma.post.update({ where: { id }, data: req.body });
  res.json(post);
};

export const removePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { tenantId } = req.user!;
  const exists = await prisma.post.findFirst({ where: { id, tenantId, isDeleted: false } });
  if (!exists) throw new Error('Post not found', { cause: { status: 404 } });
  await prisma.post.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
};
