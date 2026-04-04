import { useState } from "react";
import type { CalendarEvent } from "../types/calendar-types";
import { CalendarRoot } from "../components/calendar/core/CalendarRoot";

const CoursesPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "HipHop",
      start: new Date(2026, 3, 4, 7, 30),
      end: new Date(2026, 3, 4, 8, 30),
    },
    {
      id: "2",
      title: "Salsa",
      start: new Date(2026, 3, 5, 11, 0),
      end: new Date(2026, 3, 5, 14, 0),
    },
  ]);

  return (
    <div className="w-full h-screen bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-900 sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Kursplan</h1>
      </div>
      <div className="p-6 mt-3">
        <CalendarRoot
          events={events}
          onEventDragEnd={({ eventId, start, end }) => {
            setEvents((prev) =>
              prev.map((event) => (event.id === eventId ? { ...event, start, end } : event)),
            );
          }}
          onEventResizeEnd={({ eventId, start, end }) => {
            setEvents((prev) =>
              prev.map((event) => (event.id === eventId ? { ...event, start, end } : event)),
            );
          }}
        />
      </div>
    </div>
  );
};

export default CoursesPage;
