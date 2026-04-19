import type { RequestHandler } from 'express';
import https from 'node:https';
import http from 'node:http';
import prisma from '#db';
import { log } from '#utils';

// Allow self-signed certificates (e.g. ddev local environments)
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

const SRC = 'controllers/public.ts';

const PUBLIC_FILTER = { isActive: true, isDeleted: false };

export const bootstrapHandler: RequestHandler = async (req, res) => {
  const { tenantId, customerId } = req.publicTenant!;
  log(SRC, 'bootstrapHandler', 'Public bootstrap fetch', { tenantId });

  const [customer, locations, targets, categories] = await Promise.all([
    prisma.customer.findFirst({
      where: { id: customerId, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        website: true,
        logoUrl: true,
        primary: true,
        secondary: true,
        tertiary: true,
        quaternary: true,
        street: true,
        city: true,
        zipCode: true,
        longitude: true,
        latitude: true,
      }
    }),
    prisma.location.findMany({
      where: { tenantId, ...PUBLIC_FILTER },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        street: true,
        city: true,
        zipCode: true,
        state: true,
        longitude: true,
        latitude: true,
      },
      orderBy: { name: 'asc' }
    }),
    prisma.target.findMany({
      where: { tenantId, ...PUBLIC_FILTER },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        locationId: true,
        setSeqCategory: true,
      },
      orderBy: { name: 'asc' }
    }),
    prisma.category.findMany({
      where: {
        tenantId,
        ...PUBLIC_FILTER,
        target: PUBLIC_FILTER,   // only categories belonging to active targets
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        targetId: true,
        setSeqCourse: true,
      },
      orderBy: { name: 'asc' }
    }),
  ]);

  const categoriesByTarget = categories.reduce<Record<string, typeof categories>>((acc, c) => {
    (acc[c.targetId] ??= []).push(c);
    return acc;
  }, {});
  const enrichedTargets = targets.map((t) => ({ ...t, categories: categoriesByTarget[t.id] ?? [] }));
  const targetsByLocation = enrichedTargets.reduce<Record<string, typeof enrichedTargets>>((acc, t) => {
    if (t.locationId) (acc[t.locationId] ??= []).push(t);
    return acc;
  }, {});
  const locationsTree = locations.map((l) => ({
    ...l,
    targets: targetsByLocation[l.id] ?? [],
  }));

  res.json({ customer, locations: locationsTree });
};

const NEWS_TTL_SECONDS = 86400;

export const newsHandler: RequestHandler = async (req, res) => {
  const { tenantId } = req.publicTenant!;
  const apiKey = req.headers['x-api-key'] as string;
  log(SRC, 'newsHandler', 'Public news fetch', { tenantId });

  let record = await prisma.news.findFirst({ where: { tenantId, ...PUBLIC_FILTER } });

  // const ageSeconds = record
  //   ? (Date.now() - record.updatedAt.getTime()) / 1000
  //   : Infinity;

  const ageSeconds = 86401;

  if (ageSeconds > NEWS_TTL_SECONDS) {
    log(SRC, 'newsHandler', record ? 'News stale, refreshing' : 'No news record, fetching', { tenantId, ageSeconds });

    const settings = await prisma.settings.findUnique({ where: { tenantId }, select: { basic: true } });
    const domain = (settings?.basic as { domain?: string } | null)?.domain;

    if (domain) {
      try {
        const fetched = await fetchInsecure(`${domain}/api/news`, { 'X-Api-Key': apiKey }) as object;

        if (record) {
          record = await prisma.news.update({ where: { id: record.id }, data: { news: fetched } });
          log(SRC, 'newsHandler', 'News record updated', { tenantId });
        } else {
          record = await prisma.news.create({ data: { tenantId, news: fetched } });
          log(SRC, 'newsHandler', 'News record created', { tenantId });
        }
      } catch (err) {
        log(SRC, 'newsHandler', `Failed to fetch news from ${domain}/api/news: ${err}`, { tenantId });
      }
    } else {
      log(SRC, 'newsHandler', 'No domain configured in settings.basic, skipping news fetch', { tenantId });
    }
  } else {
    log(SRC, 'newsHandler', 'News is fresh, serving from cache', { tenantId, ageSeconds });
  }

  res.json({ news: record?.news ?? [] });
};

export const coursesHandler: RequestHandler = async (req, res) => {
  const { tenantId } = req.publicTenant!;
  const { categoryId, locationId } = req.query as Record<string, string | undefined>;
  log(SRC, 'coursesHandler', 'Public courses fetch', { tenantId, categoryId, locationId });

  const settings = await prisma.settings.findUnique({
    where: { tenantId },
    select: { registration: true },
  });
  const registration = settings?.registration as { displayPastNumber?: number } | null;
  const displayPastNumber = registration?.displayPastNumber ?? 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - displayPastNumber);

  const courses = await prisma.course.findMany({
    where: {
      tenantId,
      ...PUBLIC_FILTER,
      category: PUBLIC_FILTER,          // only courses in active categories
      ...(categoryId ? { categoryId } : {}),
      ...(locationId ? { locationId } : {}),
    },
    select: {
      id: true,
      name: true,
      description: true,
      startsAt: true,
      endsAt: true,
      frequency: true,
      dates: true,
      seatsCurrent: true,
      seatsMax: true,
      isBookedOut: true,
      isClub: true,
      options: true,
      categoryId: true,
      locationId: true,
      instructor: {
        select: { id: true, name: true, imageUrl: true }
      }
    },
    orderBy: { startsAt: 'asc' }
  });

  const filtered = courses.filter(c => {
    if (!c.isClub) return c.startsAt >= cutoff;
    // clubs: keep if at least one date entry is >= today
    const dates = c.dates as { date: string }[];
    return Array.isArray(dates) && dates.some(d => new Date(d.date) >= today);
  });

  log(SRC, 'coursesHandler', `Fetched ${filtered.length} courses (${courses.length} before club-date filter)`, { tenantId, categoryId, locationId });

  res.json({ courses: filtered });
};
