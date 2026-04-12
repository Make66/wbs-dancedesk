import { useEffect, useMemo, useState } from "react";
import { CalendarRoot } from "../components/calendar/core/CalendarRoot";
import type {
  CalendarEventItem,
  CalendarCourseItem,
  CalendarItem,
  CalendarItemDragEndPayload,
  CalendarItemResizeEndPayload,
} from "../types/calendar-types";
import EventModal from "../components/calendar/EventModal";
import { calendarStore } from "../stores/calendarStore";
import AddButton from "../components/ui/AddButton";
import EditButton from "../components/ui/EditButton";
import { getCoursesByWeekDB } from "../data/course";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { getWeekDays } from "../lib/calendar/date-utils";

type DbEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  isDeleted: boolean;
  color?: string[];
  icon?: string;
  type?: string;
  description?: string;
  imageUrl?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  longitude?: number;
  latitude?: number;
  roomId?: string;
  locationId?: string;
  targets?: string[];
};

type DbCourse = {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  color?: string[];
  room?: {
    id: string;
    name: string;
    description?: string;
  };
};

function mapWeekCoursesToCalendarItems(
  groupedCourses: Record<string, DbCourse[]>,
  days: Date[],
): CalendarCourseItem[] {
  return Object.entries(groupedCourses).flatMap(([dayIndex, courses]) => {
    const day = days[Number(dayIndex)];
    if (!day) return [];

    return courses.map((course) => {
      const templateStart = new Date(course.startsAt);
      const templateEnd = new Date(course.endsAt);

      const start = new Date(
        Date.UTC(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          templateStart.getUTCHours(),
          templateStart.getUTCMinutes(),
          templateStart.getUTCSeconds(),
          templateStart.getUTCMilliseconds(),
        ),
      );

      const end = new Date(
        Date.UTC(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          templateEnd.getUTCHours(),
          templateEnd.getUTCMinutes(),
          templateEnd.getUTCSeconds(),
          templateEnd.getUTCMilliseconds(),
        ),
      );

      return {
        kind: "course" as const,
        id: `course-${course.id}-${dayIndex}-${start.getTime()}`,
        courseId: course.id,
        title: course.name,
        start,
        end,
        color: course.color,
        roomId: course.room?.id,
      };
    });
  });
}

const CalendarPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dbEvents, setDbEvents] = useState<DbEvent[]>([]);
  const currentDate = calendarStore((state) => state.currentDate);
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([]);
  const [calendarCourses, setCalendarCourses] = useState<CalendarCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const week = getISOWeek(currentDate);
  const year = getISOWeekYear(currentDate);
  const isEventModalOpen = calendarStore((state) => state.isEventModalOpen);
  const selectedEventId = calendarStore((state) => state.selectedEventId);
  const openEventModal = calendarStore((state) => state.openEventModal);
  const closeEventModal = calendarStore((state) => state.closeEventModal);

  const isEditMode = calendarStore((state) => state.isEditMode);
  const toggleEditMode = calendarStore((state) => state.toggleEditMode);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Fehler beim Laden der Events: ${response.status}`);
        }

        const data: DbEvent[] = await response.json();
        setDbEvents(data);

        const mappedEvents: CalendarEventItem[] = data
          .filter((event) => event.isActive && !event.isDeleted)
          .map((event) => ({
            kind: "event",
            id: `event-${event.id}`,
            eventId: event.id,
            title: event.title,
            start: new Date(event.startsAt),
            end: new Date(event.endsAt),
            color: event.color,
            icon: event.icon,
            type: event.type,
            description: event.description,
            imageUrl: event.imageUrl,
            street: event.street,
            city: event.city,
            zipCode: event.zipCode,
            longitude: event.longitude,
            latitude: event.latitude,
            roomId: event.roomId,
            locationId: event.locationId,
            targets: event.targets,
            isActive: event.isActive,
            isDeleted: event.isDeleted,
          }));

        setCalendarEvents(mappedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [refresh]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesByWeekDB(year, week);

        const mappedCourses = mapWeekCoursesToCalendarItems(
          data as Record<string, DbCourse[]>,
          days,
        );

        setCalendarCourses(mappedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [week, year, days]);

  const handleEventsRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const updateEventInDb = async (eventId: string, startsAt: Date, endsAt: Date) => {
    const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/events/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler beim Speichern des Events: ${response.status} - ${errorText}`);
    }
  };

  const updateCourseInDb = async (courseId: string, startsAt: Date, endsAt: Date) => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses/${courseId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler beim Speichern des Kurses: ${response.status} - ${errorText}`);
    }
  };

  const handleItemDragEnd = async (payload: CalendarItemDragEndPayload) => {
    if (payload.itemKind === "event") {
      const previousCalendarEvents = calendarEvents;

      setCalendarEvents((prev) =>
        prev.map((event) =>
          event.id === payload.itemId
            ? {
                ...event,
                start: payload.start,
                end: payload.end,
              }
            : event,
        ),
      );

      const movedEvent = calendarEvents.find((event) => event.id === payload.itemId);
      if (!movedEvent) return;

      try {
        await updateEventInDb(movedEvent.eventId, payload.start, payload.end);

        setDbEvents((prev) =>
          prev.map((event) =>
            event.id === movedEvent.eventId
              ? {
                  ...event,
                  startsAt: payload.start.toISOString(),
                  endsAt: payload.end.toISOString(),
                }
              : event,
          ),
        );
      } catch (err) {
        setCalendarEvents(previousCalendarEvents);
        setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
      }

      return;
    }

    const previousCalendarCourses = calendarCourses;

    setCalendarCourses((prev) =>
      prev.map((course) =>
        course.id === payload.itemId
          ? {
              ...course,
              start: payload.start,
              end: payload.end,
            }
          : course,
      ),
    );

    const movedCourse = calendarCourses.find((course) => course.id === payload.itemId);
    if (!movedCourse) return;

    try {
      await updateCourseInDb(movedCourse.courseId, payload.start, payload.end);
    } catch (err) {
      setCalendarCourses(previousCalendarCourses);
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    }
  };

  const handleItemResizeEnd = async (payload: CalendarItemResizeEndPayload) => {
    if (payload.itemKind === "event") {
      const previousCalendarEvents = calendarEvents;

      setCalendarEvents((prev) =>
        prev.map((event) =>
          event.id === payload.itemId
            ? {
                ...event,
                start: payload.start,
                end: payload.end,
              }
            : event,
        ),
      );

      const resizedEvent = calendarEvents.find((event) => event.id === payload.itemId);
      if (!resizedEvent) return;

      try {
        await updateEventInDb(resizedEvent.eventId, payload.start, payload.end);

        setDbEvents((prev) =>
          prev.map((event) =>
            event.id === resizedEvent.eventId
              ? {
                  ...event,
                  startsAt: payload.start.toISOString(),
                  endsAt: payload.end.toISOString(),
                }
              : event,
          ),
        );
      } catch (err) {
        setCalendarEvents(previousCalendarEvents);
        setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
      }

      return;
    }

    const previousCalendarCourses = calendarCourses;

    setCalendarCourses((prev) =>
      prev.map((course) =>
        course.id === payload.itemId
          ? {
              ...course,
              start: payload.start,
              end: payload.end,
            }
          : course,
      ),
    );

    const resizedCourse = calendarCourses.find((course) => course.id === payload.itemId);
    if (!resizedCourse) return;

    try {
      // await updateCourseInDb(resizedCourse.courseId, payload.start, payload.end);
    } catch (err) {
      setCalendarCourses(previousCalendarCourses);
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    }
  };

  const calendarItems: CalendarItem[] = useMemo(
    () => [...calendarEvents, ...calendarCourses],
    [calendarEvents, calendarCourses],
  );

  const selectedCalendarEvent = calendarEvents.find((event) => event.id === selectedEventId);

  const selectedEventForModal = selectedCalendarEvent
    ? {
        id: selectedCalendarEvent.eventId,
        title: selectedCalendarEvent.title,
        description: selectedCalendarEvent.description,
        imageUrl: selectedCalendarEvent.imageUrl,
        color: selectedCalendarEvent.color,
        type: selectedCalendarEvent.type,
        street: selectedCalendarEvent.street,
        city: selectedCalendarEvent.city,
        zipCode: selectedCalendarEvent.zipCode,
        longitude: selectedCalendarEvent.longitude,
        latitude: selectedCalendarEvent.latitude,
        startsAt: selectedCalendarEvent.start,
        endsAt: selectedCalendarEvent.end,
        roomId: selectedCalendarEvent.roomId,
      }
    : undefined;

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Kalender</h1>
        <div className="flex items-center gap-7">
          <EditButton onClick={() => toggleEditMode()} tooltipPlace="left" />
          {isEditMode && (
            <AddButton onClick={() => openEventModal()} tooltipContent="Event hinzufügen" />
          )}
        </div>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {loading && <p>Events werden geladen ...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <CalendarRoot
            items={calendarItems}
            onEventDragEnd={handleItemDragEnd}
            onEventResizeEnd={handleItemResizeEnd}
          />
        )}
      </div>

      {isEventModalOpen && (
        <EventModal
          onSaved={handleEventsRefresh}
          onClose={closeEventModal}
          event={selectedEventForModal}
        />
      )}
    </div>
  );
};

export default CalendarPage;
