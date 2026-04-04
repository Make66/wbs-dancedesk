import { format } from "date-fns";
import type { DraftEvent } from "../../types/calendar-types";

type DraftEventPanelProps = {
  draftEvent: DraftEvent;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function DraftEventPanel({
  draftEvent,
  onTitleChange,
  onSave,
  onCancel,
}: DraftEventPanelProps) {
  return (
    <div className="border-t bg-zinc-50 px-6 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">New event</p>
          <h2 className="text-lg font-semibold text-zinc-950">Create calendar event</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="draft-title" className="text-sm font-medium text-zinc-700">
              Title
            </label>
            <input
              id="draft-title"
              type="text"
              value={draftEvent.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700">Time</span>
            <div className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700">
              {format(draftEvent.start, "EEE, d MMM HH:mm")} – {format(draftEvent.end, "HH:mm")}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save event
          </button>
        </div>
      </div>
    </div>
  );
}
