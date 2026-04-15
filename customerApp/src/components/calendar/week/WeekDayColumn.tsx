import { useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { CurrentTimeLine } from "../core/CurrentTimeLine";
import { WeekEventCard } from "./WeekEventCard";
import type {
  CalendarDropData,
  CalendarItem,
  CalendarItemResizeEndPayload,
} from "../../../types/calendar-types";
import { getPositionedCalendarItems } from "../../../lib/calendar/event-layout";
import { isSameDay } from "../../../lib/calendar/date-utils";
import { calendarStore } from "../../../stores/calendarStore";
import { settingsStore } from "../../../stores/settingsStore";
import { useDayColumnResize } from "../../../lib/calendar/hooks/useDayColumnResize";
import { useNavigate } from "react-router";
import { cn } from "../../../lib/utils";

type Props = {
  day: Date;
  items: CalendarItem[];
  /** undefined = alle Items, null = Items ohne Raum (inkl. unbekannter Raum-IDs), string = Items dieses Raums */
  roomId?: string | null;
  /** Set aller bekannten Raum-IDs – Items mit fremden IDs landen in der "Kein Raum"-Spalte */
  knownRoomIds?: Set<string>;
  /** Letzte Raumspalte des Tages → dicke Tages-Trennlinie */
  isLastRoomOfDay?: boolean;
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function WeekDayColumn({
  day,
  items,
  roomId,
  knownRoomIds,
  isLastRoomOfDay = true,
  onEventResizeEnd,
}: Props) {
  const navigate = useNavigate();
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [resizingEventId, setResizingEventId] = useState<string | null>(null);

  const config = settingsStore((s) => s.settings.calendar);
  const getSlotsPerHour = settingsStore((s) => s.getSlotsPerHour);
  const getStartSlot = settingsStore((s) => s.getStartSlot);
  const getVisibleSlotCount = settingsStore((s) => s.getVisibleSlotCount);
  const selectedEventId = calendarStore((s) => s.selectedEventId);
  const resizingEvent = calendarStore((s) => s.resizingEvent);
  const openEventModal = calendarStore((state) => state.openEventModal);

  const startResize = calendarStore((s) => s.startResize);
  const updateResize = calendarStore((s) => s.updateResize);
  const endResize = calendarStore((s) => s.endResize);

  const dropData: CalendarDropData = { type: "day-column", day };

  const droppableId =
    roomId !== undefined
      ? `day-${day.toISOString()}-room-${roomId ?? "none"}`
      : `day-${day.toISOString()}`;

  const { setNodeRef } = useDroppable({
    id: droppableId,
    data: dropData,
  });

  useDayColumnResize({
    day,
    columnRef,
    config,
    resizingEvent,
    resizingEventId,
    setResizingEventId,
    updateResize,
    endResize,
    onEventResizeEnd,
  });

  const dayItems = useMemo(() => {
    const sameDay = items.filter((item) => isSameDay(item.start, day));
    if (roomId === undefined) return sameDay;
    if (roomId === null)
      return sameDay.filter(
        (item) => !item.roomId || (knownRoomIds ? !knownRoomIds.has(item.roomId) : false),
      );
    return sameDay.filter((item) => item.roomId === roomId);
  }, [items, day, roomId, knownRoomIds]);

  const positionedItems = useMemo(
    () => getPositionedCalendarItems(dayItems, config.slotHeight, config),
    [dayItems, config],
  );

  const startSlot = getStartSlot();
  const visibleSlotCount = getVisibleSlotCount();
  const slotsPerHour = getSlotsPerHour();

  function handleResizeMouseDown(item: CalendarItem, e: ReactMouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    setResizingEventId(item.id);
    startResize(item);
  }

  return (
    <div
      ref={(node) => {
        columnRef.current = node;
        setNodeRef(node);
      }}
      className={cn("relative last:border-r-0", isLastRoomOfDay ? "border-r-5" : "border-r")}
    >
      {Array.from({ length: visibleSlotCount }, (_, i) => {
        const slotIndex = startSlot + i;
        const isHour = slotIndex % slotsPerHour === 0;

        return (
          <div
            key={slotIndex}
            className={cn(isHour && "border-t")}
            style={{ height: `${config.slotHeight}px` }}
          />
        );
      })}

      <CurrentTimeLine day={day} slotHeight={config.slotHeight} config={config} />

      <div className="absolute inset-0 z-10">
        {positionedItems.map((positionedItem) => (
          <WeekEventCard
            key={positionedItem.item.id}
            positionedItem={positionedItem}
            isSelected={selectedEventId === positionedItem.item.id}
            onClick={() => {
              if (positionedItem.item.kind === "event") {
                openEventModal(positionedItem.item.id);
              } else {
                navigate(`/course/${positionedItem.item.courseId}`);
              }
            }}
            onResizeMouseDown={(e) => {
              handleResizeMouseDown(positionedItem.item, e);
            }}
          />
        ))}
      </div>
    </div>
  );
}
