import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import type { CalendarHeaderDisplayData, CalendarView } from "../../../types/calendar-types";
import { calendarStore } from "../../../stores/calendarStore";

type CalendarHeaderProps = {
  displayData: CalendarHeaderDisplayData;
};

const views: CalendarView[] = ["day", "week", "month"];

const viewLabels: Record<CalendarView, string> = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
};

export function CalendarHeader({ displayData }: CalendarHeaderProps) {
  const [open, setOpen] = useState(false);

  const currentView = calendarStore((state) => state.currentView);
  const setCurrentView = calendarStore((state) => state.setCurrentView);
  const goToPrevious = calendarStore((state) => state.goToPrevious);
  const goToNext = calendarStore((state) => state.goToNext);
  const goToToday = calendarStore((state) => state.goToToday);

  const handleSelectView = (view: CalendarView) => {
    setCurrentView(view);
    setOpen(false);
  };

  return (
    <div className="rounded-t-3xl flex gap-4 border-b dark:bg-zinc-800 border-zinc-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4 items-center">
        <div className="w-15 h-15 rounded-md border border-zinc-200 flex flex-col items-center justify-center gap-1 shadow-sm">
          <span className="text-zinc-400 font-semibold text-xs">{displayData.todayMonthLabel}</span>
          <span className="text-zinc-900 font-bold text-sm dark:text-zinc-400">
            {displayData.todayDayLabel}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-400">
              {displayData.monthLabel}
            </h1>

            {displayData.weekLabel && (
              <span className="py-1 px-4 rounded-full bg-zinc-800 dark:bg-black text-white dark:text-zinc-400 text-xs">
                {displayData.weekLabel}
              </span>
            )}
          </div>

          {displayData.rangeLabel && (
            <span className="text-sm text-zinc-500">{displayData.rangeLabel}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex items-center rounded-2xl border border-zinc-200 p-1 shadow-sm cursor-pointer">
          <button
            type="button"
            onClick={goToPrevious}
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <GrPrevious />
          </button>

          <button
            type="button"
            onClick={goToToday}
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:text-zinc-400"
          >
            Heute
          </button>

          <button
            type="button"
            onClick={goToNext}
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <GrNext />
          </button>
        </div>

        <div className="relative inline-flex items-center rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <span className="capitalize">{viewLabels[currentView]}</span>
            <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute top-full right-0 mt-2 w-40 rounded-xl border border-zinc-200 bg-white shadow-lg z-50">
              {views.map((view) => {
                const isSelected = view === currentView;

                return (
                  <button
                    key={view}
                    type="button"
                    onClick={() => handleSelectView(view)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                      isSelected ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="capitalize">{viewLabels[view]}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
