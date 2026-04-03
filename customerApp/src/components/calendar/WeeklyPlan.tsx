import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import deLocale from "@fullcalendar/core/locales/de";

export default function WeeklyPlan() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const goNext = () => {
    const api = calendarRef.current?.getApi();
    api?.next();
  };

  const goPrev = () => {
    const api = calendarRef.current?.getApi();
    api?.prev();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <button onClick={goPrev} className="rounded border px-3 py-2">
          Zurück
        </button>
        <button onClick={goNext} className="rounded border px-3 py-2">
          Weiter
        </button>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        locale={deLocale}
        allDaySlot={false}
        events={[
          {
            title: "Training",
            start: "2026-04-06T18:00:00",
            end: "2026-04-06T19:00:00",
          },
        ]}
      />
    </div>
  );
}
