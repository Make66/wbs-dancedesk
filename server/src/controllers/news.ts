import type { RequestHandler } from 'express';
import https from 'node:https';
import http from 'node:http';
import prisma from '#db';
import { log } from '#utils';

const SRC = 'controllers/news.ts';

const fetchInsecure = (url: string, headers?: Record<string, string>): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const get = parsed.protocol === 'https:' ? https.get : http.get;
    get(url, { rejectUnauthorized: false, headers }, (res) => {
      let raw = '';
      res.on('data', (chunk: string) => { raw += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });

export const refreshNews: RequestHandler = async (req, res) => {
  const { tenantId } = req.user!;
  log(SRC, 'refreshNews', 'Manual news refresh triggered', { tenantId });

  const [settings, customer] = await Promise.all([
    prisma.settings.findUnique({ where: { tenantId }, select: { basic: true } }),
    prisma.customer.findFirst({ where: { tenantId, isDeleted: false }, select: { apiKey: true } }),
  ]);

  const domain = (settings?.basic as { domain?: string } | null)?.domain;
  if (!domain) throw new Error('No domain configured in settings.basic', { cause: { status: 400 } });

  const apiKey = customer?.apiKey;
  if (!apiKey) throw new Error('No API key configured for this customer', { cause: { status: 400 } });

  log(SRC, 'refreshNews', `Fetching from ${domain}/api/news`, { tenantId });
  const fetched = await fetchInsecure(`${domain}/api/news`, { 'X-Api-Key': apiKey }) as object;

  const existing = await prisma.news.findFirst({ where: { tenantId } });
  if (existing) {
    await prisma.news.update({ where: { id: existing.id }, data: { news: fetched } });
    log(SRC, 'refreshNews', 'News record updated', { tenantId });
  } else {
    await prisma.news.create({ data: { tenantId, news: fetched } });
    log(SRC, 'refreshNews', 'News record created', { tenantId });
  }

  res.json({ ok: true });
};
