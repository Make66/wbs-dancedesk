import { useEffect, useMemo, useState } from "react";
import { CalendarRoot } from "../components/calendar/core/CalendarRoot";
import type { CalendarEvent } from "../types/calendar-types";

type DbEvent = {
  id: string;
  title: string;
  date: string;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
};

const EVENT_DURATION_MINUTES = 90;

const CalendarPage = () => {
  const [dbEvents, setDbEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    return dbEvents
      .filter((event) => event.isActive !== false && event.isDeleted !== true)
      .map((event) => {
        const start = new Date(event.date);
        const end = new Date(start.getTime() + EVENT_DURATION_MINUTES * 60 * 1000);

        return {
          id: event.id,
          title: event.title,
          start,
          end,
        };
      });
  }, [dbEvents]);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b bg-background border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">Kalender</h1>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {loading && <p>Events werden geladen ...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <CalendarRoot events={calendarEvents} />}
      </div>
    </div>
  );
};

export default CalendarPage;
