import { format, isToday } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "../../../lib/utils";
import type { Room } from "../../../types/room-types";

type RoomColumn = { id: string | null; name: string };

type WeekHeaderProps = {
  days: Date[];
  rooms?: Room[];
};

function getRoomInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function WeekHeader({ days, rooms = [] }: WeekHeaderProps) {
  const roomColumns: RoomColumn[] | null =
    rooms.length > 0
      ? [...rooms.map((r) => ({ id: r.id, name: r.name })), { id: null, name: "Kein Raum" }]
      : null;

  const numRooms = roomColumns ? roomColumns.length : 1;
  const gridTemplateColumns = `80px repeat(${numRooms * 7}, minmax(0, 1fr))`;

  return (
    <div className="bg-background">
      {/* Zeile 1: Wochentage */}
      <div style={{ display: "grid", gridTemplateColumns }}>
        <div className="border-r px-3 py-3" />

        {days.map((day) => {
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              style={{ gridColumn: `span ${numRooms}` }}
              className={cn(
                "flex items-center justify-center gap-1 border-r-4 px-2 py-3 first:border-l-0 last:border-r-0",
                today && "bg-foreground/50 text-background",
              )}
            >
              <span
                className={cn(
                  "text-xs tracking-wide text-muted-foreground",
                  today && "text-background",
                )}
              >
                {format(day, "EEE", { locale: de })}
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
          );
        })}
      </div>

      {/* Zeile 2: Raumnamen (nur wenn Räume vorhanden) */}
      {roomColumns && (
        <div
          className="border-t border-muted-foreground/20"
          style={{ display: "grid", gridTemplateColumns }}
        >
          <div className="border-r" />

          {days.flatMap((day) =>
            roomColumns.map((roomCol, rIdx) => {
              const isLastRoom = rIdx === roomColumns.length - 1;
              return (
                <div
                  key={`${day.toISOString()}-${roomCol.id ?? "none"}`}
                  className={cn(
                    "px-2 py-1 text-center last:border-r-0",
                    isLastRoom ? "border-r-4" : "border-r",
                    isLastRoom && "text-muted-foreground/50",
                  )}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-bold text-muted-foreground">
                      {getRoomInitials(roomCol.name)}
                    </span>
                  </div>
                </div>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
}
