import { format, isToday } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "../../../lib/utils";
import type { Room } from "../../../types/room-types";

type RoomColumn = { id: string | null; name: string };

type DayHeaderProps = {
  day: Date;
  rooms?: Room[];
};

export function DayHeader({ day, rooms = [] }: DayHeaderProps) {
  const roomColumns: RoomColumn[] | null =
    rooms.length > 0
      ? [...rooms.map((r) => ({ id: r.id, name: r.name })), { id: null, name: "Kein Raum" }]
      : null;

  const numRooms = roomColumns ? roomColumns.length : 1;
  const gridTemplateColumns = `80px repeat(${numRooms}, minmax(0, 1fr))`;
  const today = isToday(day);

  return (
    <div className="bg-background">
      {/* Tagesname + Datum */}
      <div style={{ display: "grid", gridTemplateColumns }}>
        <div className="border-r px-3 py-3" />

        <div
          style={{ gridColumn: `span ${numRooms}` }}
          className={cn(
            "flex items-center justify-center gap-1 border-r px-2 py-3 last:border-r-0",
            today && "bg-foreground/50 text-background rounded-b-2xl",
          )}
        >
          <span
            className={cn(
              "text-xs tracking-wide text-muted-foreground",
              today && "text-background",
            )}
          >
            {format(day, "EEEE", { locale: de })}
          </span>
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full text-xs text-muted-foreground",
              today && "text-background",
            )}
          >
            {format(day, "d", { locale: de })}
          </span>
        </div>
      </div>

      {/* Raumnamen (nur wenn Räume vorhanden) */}
      {roomColumns && (
        <div
          className="border-t border-muted-foreground/20"
          style={{ display: "grid", gridTemplateColumns }}
        >
          <div className="border-r" />

          {roomColumns.map((roomCol, rIdx) => (
            <div
              key={roomCol.id ?? "none"}
              className={cn(
                "px-2 py-1 text-center border-r last:border-r-0",
                rIdx === roomColumns.length - 1 && "text-muted-foreground/50",
              )}
            >
              <span className="text-xs font-medium text-muted-foreground truncate block">
                {roomCol.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
