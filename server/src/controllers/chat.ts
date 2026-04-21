import type { RequestHandler } from 'express';
import { OpenAI } from 'openai';
import prisma from '#db';

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_URL,
  apiKey:  process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes

const SYSTEM_PROMPT =
  'Antworte immer auf Deutsch und duze den Nutzer. ' +
  'Du bist ein freundlicher, stets positiv denkender und unterstützender Assistent der Tanzschule. ' +
  'Du bist seit Jahrzehnten im Tanzgeschäft und kennst alle Tanzstile im Allgemeinen, ' +
  'aber die in der Tanzschule angebotenen Stile ganz besonders. ' +
  'In Gesprächen tendierst du dazu, immer wieder auf die Suche nach dem passenden Kurs für den Teilnehmer zurückzukommen. ' +
  'Du besprichst NUR: Tanzen im Allgemeinen, das Wetter und die Kurse oder Veranstaltungen dieser Tanzschule. ' +
  'Wenn der Nutzer das Thema wechselt, lenke ihn sanft zum Tanzen oder zu Kursen zurück. ' +
  'Halte deine Antworten kurz und prägnant. Dieses Gespräch endet nach 5 Minuten Inaktivität. ' +
  'Wenn ein Teilnehmer sich für einen Kurs anmelden möchte und du die Kurs-ID kennst, ' +
  'füge am Ende deiner Antwort exakt dieses Token ein (keine weitere Erklärung): [REGISTER:<courseId>]. ' +
  'Nach der Anmeldung (bestätigt durch eine Folgemeldung) nenne alle Kurstermine (isClub=false) ' +
  'bzw. die nächsten 5 Kurstermine (isClub=true).';

// ─── helpers ────────────────────────────────────────────────────────────────

async function buildContextMessage(participantId: string, tenantId: string, domain?: string | null): Promise<string> {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [pastCourses, upcomingEvents] = await Promise.all([
    prisma.participantCourse.findMany({
      where: { participantId },
      include: {
        course: {
          select: {
            name: true,
            dates: true,
            category: { select: { name: true } },
            seatsCurrent: true,
            seatsMax: true,
          },
        },
      },
    }),
    prisma.event.findMany({
      where: {
        tenantId,
        isDeleted: false,
        isActive: true,
        startsAt: { gte: now, lte: in30Days },
      },
      select: { title: true, startsAt: true, city: true },
      orderBy: { startsAt: 'asc' },
      take: 10,
    }),
  ]);

  const enrolledCourseIds = pastCourses.map((pc) => pc.courseId);
  const enrolledCategoryNames = [
    ...new Set(pastCourses.map((pc) => pc.course.category?.name).filter(Boolean)),
  ];

  const availableCourses = await prisma.course.findMany({
    where: {
      tenantId,
      isDeleted: false,
      isActive: true,
      endsAt: { gt: now },
      id: { notIn: enrolledCourseIds },
    },
    select: {
      id: true,
      name: true,
      seatsCurrent: true,
      seatsMax: true,
      category: { select: { name: true } },
    },
    take: 20,
  });

  const lines: string[] = ['[CONTEXT — not visible to participant]'];

  if (pastCourses.length > 0) {
    lines.push(
      'Courses the participant has enrolled in: ' +
        pastCourses.map((pc) => `${pc.course.name} (${pc.course.category?.name ?? '?'})`).join(', '),
    );
  } else {
    lines.push('The participant has not enrolled in any courses yet.');
  }

  if (enrolledCategoryNames.length > 0) {
    lines.push(`Their dance categories: ${enrolledCategoryNames.join(', ')}.`);
  }

  // Upcoming dates from enrolled courses
  type CourseDate = { date: string; isStart?: boolean };
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const upcomingCourseDates: { courseName: string; date: Date }[] = [];

  for (const pc of pastCourses) {
    const rawDates = pc.course.dates as CourseDate[] | null;
    if (!rawDates) continue;
    for (const d of rawDates) {
      const dt = new Date(d.date);
      if (dt > yesterday) {
        upcomingCourseDates.push({ courseName: pc.course.name ?? 'Unknown', date: dt });
      }
    }
  }

  upcomingCourseDates.sort((a, b) => a.date.getTime() - b.date.getTime());

  if (upcomingCourseDates.length > 0) {
    const formatted = upcomingCourseDates.slice(0, 10).map(
      (d) => `${d.date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} — "${d.courseName}"`,
    );
    lines.push('Upcoming dates for enrolled courses: ' + formatted.join('; '));
  }

  if (availableCourses.length > 0) {
    const formatted = availableCourses.map((c) => {
      const seats = c.seatsMax - c.seatsCurrent;
      return `"${c.name}" (${c.category?.name ?? '?'}, ${seats} seat${seats !== 1 ? 's' : ''} left, id:${c.id})`;
    });
    lines.push('Available courses: ' + formatted.join('; '));
  }

  if (upcomingEvents.length > 0) {
    const formatted = upcomingEvents.map(
      (e) => `"${e.title}" on ${e.startsAt.toLocaleDateString('de-DE')} in ${e.city}`,
    );
    lines.push('Upcoming events (next 30 days): ' + formatted.join('; '));
  }

  if (domain) {
    lines.push(`Wenn nach Kursanmeldungen gefragt wird, weise auf ${domain}/anmeldung hin oder biete an, die Anmeldung direkt durchzuführen.`);
  }

  return lines.join('\n');
}

// ─── handlers ───────────────────────────────────────────────────────────────

export const openSession: RequestHandler = async (req, res) => {
  const { participantId, tenantId, domain } = req.body as {
    participantId: string;
    tenantId: string;
    domain?: string;
  };

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const session = await prisma.chatSession.create({
    data: {
      participantId,
      tenantId,
      domain: domain ?? null,
      expiresAt,
      messages: {
        create: { role: 'system', content: SYSTEM_PROMPT, order: 0 },
      },
    },
  });

  res.status(201).json({ sessionId: session.id });
};

export const sendMessage: RequestHandler = async (req, res) => {
  const { sessionId, prompt } = req.body as { sessionId: string; prompt: string };

  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { messages: { orderBy: { order: 'asc' } } },
  });

  if (!session) throw new Error('Session not found', { cause: { status: 404 } });
  if (session.expiresAt < new Date()) throw new Error('Session expired', { cause: { status: 410 } });

  const nextOrder = session.messages.length;

  // Persist user message
  await prisma.chatMessage.create({
    data: { sessionId, role: 'user', content: prompt, order: nextOrder },
  });

  // Build context injection (ephemeral — not stored)
  const contextContent = await buildContextMessage(session.participantId, session.tenantId, session.domain);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    ...session.messages.map((m) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'system', content: contextContent },
    { role: 'user', content: prompt },
  ];

  // SSE headers
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'x-session-id': sessionId,
  });

  const stream = openai.chat.completions.stream({
    model: MODEL,
    messages,
    stream: true,
  });

  let assembled = '';

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) {
      assembled += token;
      res.write(`data: ${JSON.stringify(token)}\n\n`);
    }
  }

  // Persist assistant reply and bump expiry
  await Promise.all([
    prisma.chatMessage.create({
      data: { sessionId, role: 'assistant', content: assembled, order: nextOrder + 1 },
    }),
    prisma.chatSession.update({
      where: { id: sessionId },
      data: { expiresAt: new Date(Date.now() + SESSION_TTL_MS) },
    }),
  ]);

  res.write('data: [DONE]\n\n');
  res.end();
};

export const getSession: RequestHandler = async (req, res) => {
  const { sessionId } = req.params;
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { messages: { orderBy: { order: 'asc' } } },
  });
  if (!session) throw new Error('Session not found', { cause: { status: 404 } });
  res.json(session);
};
