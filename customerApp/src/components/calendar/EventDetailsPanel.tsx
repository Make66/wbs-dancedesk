import { format } from "date-fns";
import type { CalendarEvent } from "../../types/calendar-types";

type EventDetailsPanelProps = {
  event: CalendarEvent;
  onDelete: () => void;
  onClose: () => void;
};

export function EventDetailsPanel({ event, onDelete, onClose }: EventDetailsPanelProps) {
  return (
    <div className="border-t bg-white px-6 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">Event details</p>
          <h2 className="text-lg font-semibold text-zinc-950">{event.title}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700">Start</span>
            <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
              {format(event.start, "EEE, d MMM yyyy HH:mm")}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700">End</span>
            <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
              {format(event.end, "EEE, d MMM yyyy HH:mm")}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Delete event
          </button>
        </div>
      </div>
    </div>
  );
}
