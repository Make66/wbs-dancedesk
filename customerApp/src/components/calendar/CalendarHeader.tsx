import { format, getISOWeek } from "date-fns";
import { de } from "date-fns/locale";
import { GrPrevious, GrNext } from "react-icons/gr";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

export type CalendarView = "day" | "week" | "month";

type CalendarHeaderProps = {
  days: Date[];
  currentView: CalendarView;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onChangeView: (view: CalendarView) => void;
};

const views: CalendarView[] = ["day", "week", "month"];

export function CalendarHeader({
  days,
  currentView,
  onPrev,
  onNext,
  onToday,
  onChangeView,
}: CalendarHeaderProps) {
  const [open, setOpen] = useState(false);

  const viewLabels: Record<CalendarView, string> = {
    day: "Tag",
    week: "Woche",
    month: "Monat",
  };

  const handleSelectView = (view: CalendarView) => {
    onChangeView(view);
    setOpen(false);
  };
  return (
    <div className="rounded-t-3xl flex gap-4 border-b dark:bg-zinc-800 border-zinc-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4 items-center">
        <div className="w-15 h-15 rounded-md border border-zinc-200 flex flex-col items-center justify-center gap-1 shadow-sm">
          <span className="text-zinc-400 font-semibold text-xs">
            {format(new Date(), "LLL", { locale: de }).toUpperCase()}
          </span>
          <span className="text-zinc-900 font-bold text-sm dark:text-zinc-400">
            {format(new Date(), "dd", { locale: de })}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-400">
              {format(days[0], "MMMM yyyy", { locale: de })}
            </h1>
            <span className="py-1 px-4 rounded-full bg-zinc-800 dark:bg-black text-white dark:text-zinc-400 text-xs">
              {getISOWeek(days[0])} KW
            </span>
          </div>
          <span className="text-sm text-zinc-500">
            {format(days[0], "dd. MMMM yyyy - ", { locale: de })}{" "}
            {format(days[1], "dd. MMMM yyyy", { locale: de })}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex items-center rounded-2xl border border-zinc-200 p-1 shadow-sm cursor-pointer">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <GrPrevious />
          </button>

          <button
            type="button"
            onClick={onToday}
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:text-zinc-400"
          >
            Heute
          </button>

          <button
            type="button"
            onClick={onNext}
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
