import { WeekDayColumn } from "./WeekDayColumn";
import { TimeGutter } from "../core/TimeGutter";
import type { CalendarItem, CalendarItemResizeEndPayload } from "../../../types/calendar-types";
import type { Room } from "../../../types/room-types";
import { calendarStore } from "../../../stores/calendarStore";

type RoomColumn = { id: string | null; name: string };

type Props = {
  days: Date[];
  items: CalendarItem[];
  rooms?: Room[];
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function WeekGrid({ days, items, rooms = [], onEventResizeEnd }: Props) {
  const config = calendarStore((s) => s.config);

  const roomColumns: RoomColumn[] | null =
    rooms.length > 0
      ? [...rooms.map((r) => ({ id: r.id, name: r.name })), { id: null, name: "Kein Raum" }]
      : null;

  const knownRoomIds: Set<string> | undefined = roomColumns
    ? new Set(rooms.map((r) => r.id))
    : undefined;

  const numRooms = roomColumns ? roomColumns.length : 1;
  const gridTemplateColumns = `80px repeat(${numRooms * 7}, minmax(0, 1fr))`;

  return (
    <div style={{ display: "grid", gridTemplateColumns }}>
      <TimeGutter config={config} />

      {roomColumns
        ? days.flatMap((day) =>
            roomColumns.map((roomCol, rIdx) => (
              <WeekDayColumn
                key={`${day.toISOString()}-${roomCol.id ?? "none"}`}
                day={day}
                items={items}
                roomId={roomCol.id}
                knownRoomIds={knownRoomIds}
                isLastRoomOfDay={rIdx === roomColumns.length - 1}
                onEventResizeEnd={onEventResizeEnd}
              />
            )),
          )
        : days.map((day) => (
            <WeekDayColumn
              key={day.toISOString()}
              day={day}
              items={items}
              onEventResizeEnd={onEventResizeEnd}
            />
          ))}
    </div>
  );
}
