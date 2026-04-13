import axios from 'axios';
import { env } from '@/config/env';
import { useAuthStore, type AuthUser } from '@/store/auth';
import { useUserStore, type Participant } from '@/store/user';
import { useMyCoursesStore, type Course } from '@/store/myCourses';
import { useEventsStore, type Event } from '@/store/events';
import { useCourseWeekStore, type CourseWeek } from '@/store/courseWeek';

const authAxios = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
});

async function fetchParticipantMe(): Promise<Participant> {
  console.log('[3] AUTH API: calling /auth/participant-me');
  try {
    const response = await authAxios.get('/auth/participant-me');
    console.log('[3] AUTH API: /auth/participant-me response:', response.data);
    return response.data.participant as Participant;
  } catch (e: unknown) {
    const err = e as { response?: { status: number; data: unknown } };
    console.error('[3] AUTH API: /auth/participant-me failed', err?.response?.status, err?.response?.data);
    throw e;
  }
}

async function hydrateAppData(participantId: string): Promise<void> {
  const [coursesRes, eventsRes, courseWeekRes] = await Promise.all([
    authAxios.get(`/participants/${participantId}/courses`),
    authAxios.get('/events/upcoming'),
    authAxios.get('/courses/week'),
  ]);

  useMyCoursesStore.getState().setCourses(coursesRes.data as Course[]);
  useEventsStore.getState().setEvents(eventsRes.data as Event[]);
  useCourseWeekStore.getState().setCourseWeek(courseWeekRes.data as CourseWeek);

  console.log('[4] AUTH API: myCourses store ←', coursesRes.data);
  console.log('[4] AUTH API: events store ←', eventsRes.data);
  console.log('[4] AUTH API: courseWeek store ←', courseWeekRes.data);
}

function clearAppData(): void {
  useUserStore.getState().clearParticipant();
  useMyCoursesStore.getState().clearCourses();
  useEventsStore.getState().clearEvents();
  useCourseWeekStore.getState().clearCourseWeek();
}

export async function login(email: string, password: string): Promise<void> {
  console.log('[2] AUTH API: POST /auth/participant-login');
  const response = await authAxios.post('/auth/participant-login', {
    email,
    password,
    tenantId: env.tmpTenantId,
  });
  const user: AuthUser = { id: response.data.id, tenantId: env.tmpTenantId };
  console.log('[2] AUTH API: credentials accepted, writing auth store:', user);
  useAuthStore.getState().setAuth(user);

  console.log('[3] AUTH API: fetching participant profile from /auth/participant-me');
  const participant = await fetchParticipantMe();
  useUserStore.getState().setParticipant(participant);
  console.log('[3] AUTH API: participant written to user store:', participant);

  console.log('[4] AUTH API: hydrating app data for participant', participant.id);
  await hydrateAppData(participant.id);
}

export async function logout(): Promise<void> {
  try {
    await authAxios.post('/auth/logout');
  } catch {
    // Ignore logout request errors — clear the session regardless
  }
  useAuthStore.getState().clearAuth();
  clearAppData();
}

export async function validateSession(): Promise<boolean> {
  if (!useAuthStore.getState().user) return false;
  try {
    const participant = await fetchParticipantMe();
    useUserStore.getState().setParticipant(participant);
    await hydrateAppData(participant.id);
    return true;
  } catch {
    useAuthStore.getState().clearAuth();
    clearAppData();
    return false;
  }
}
