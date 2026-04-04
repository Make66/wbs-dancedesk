import { format } from "date-fns";
import type { CSSProperties } from "react";
import type { DraftEvent } from "../../types/calendar-types";

type DraftEventCardProps = {
  draftEvent: DraftEvent;
  style: CSSProperties;
};

export function DraftEventCard({ draftEvent, style }: DraftEventCardProps) {
  return (
    <div
      className="absolute overflow-hidden rounded-xl border border-dashed border-zinc-400 bg-zinc-100/80 px-3 py-2 shadow-sm"
      style={style}
    >
      <p className="text-sm font-semibold text-zinc-900">{draftEvent.title}</p>
      <p className="mt-1 text-xs text-zinc-500">
        {format(draftEvent.start, "HH:mm")} – {format(draftEvent.end, "HH:mm")}
      </p>
    </div>
  );
}
