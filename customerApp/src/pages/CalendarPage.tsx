import { useEffect, useState } from "react";
import { CalendarRoot } from "../components/calendar/core/CalendarRoot";
import type {
  CalendarEvent,
  CalendarEventDragEndPayload,
  CalendarEventResizeEndPayload,
} from "../types/calendar-types";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPenNib } from "react-icons/fa";
import EventModal from "../components/form/EventModal";
import { calendarStore } from "../stores/calendarStore";

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

const CalendarPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dbEvents, setDbEvents] = useState<DbEvent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

        const mappedEvents: CalendarEvent[] = data
          .filter((event) => event.isActive && !event.isDeleted)
          .map((event) => ({
            id: event.id,
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

  const handleEventDragEnd = async (payload: CalendarEventDragEndPayload) => {
    const previousCalendarEvents = calendarEvents;

    setCalendarEvents((prev) =>
      prev.map((event) =>
        event.id === payload.eventId
          ? {
              ...event,
              start: payload.start,
              end: payload.end,
            }
          : event,
      ),
    );

    try {
      await updateEventInDb(payload.eventId, payload.start, payload.end);

      setDbEvents((prev) =>
        prev.map((event) =>
          event.id === payload.eventId
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
  };

  const handleEventResizeEnd = async (payload: CalendarEventResizeEndPayload) => {
    const previousCalendarEvents = calendarEvents;

    setCalendarEvents((prev) =>
      prev.map((event) =>
        event.id === payload.eventId
          ? {
              ...event,
              start: payload.start,
              end: payload.end,
            }
          : event,
      ),
    );

    try {
      await updateEventInDb(payload.eventId, payload.start, payload.end);

      setDbEvents((prev) =>
        prev.map((event) =>
          event.id === payload.eventId
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
  };

  const selectedCalendarEvent = calendarEvents.find((event) => event.id === selectedEventId);

  const selectedEventForModal = selectedCalendarEvent
    ? {
        id: selectedCalendarEvent.id,
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
          <button type="button" className="cursor-pointer" onClick={toggleEditMode}>
            <FaPenNib className="text-2xl" />
          </button>
          {isEditMode && (
            <button type="button" className="cursor-pointer" onClick={() => openEventModal()}>
              <IoMdAddCircleOutline className="text-3xl" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {loading && <p>Events werden geladen ...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <CalendarRoot
            events={calendarEvents}
            onEventDragEnd={handleEventDragEnd}
            onEventResizeEnd={handleEventResizeEnd}
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
