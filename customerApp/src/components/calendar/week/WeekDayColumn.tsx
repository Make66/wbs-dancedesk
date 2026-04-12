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
import {
  getSlotsPerHour,
  getStartSlot,
  getVisibleSlotCount,
} from "../../../lib/constants/calendar-constants";
import { getPositionedCalendarItems } from "../../../lib/calendar/event-layout";
import { isSameDay } from "../../../lib/calendar/date-utils";
import { calendarStore } from "../../../stores/calendarStore";
import { useDayColumnResize } from "../../../lib/calendar/hooks/useDayColumnResize";
import { useNavigate } from "react-router";

type Props = {
  day: Date;
  items: CalendarItem[];
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function WeekDayColumn({ day, items, onEventResizeEnd }: Props) {
  const navigate = useNavigate();
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [resizingEventId, setResizingEventId] = useState<string | null>(null);

  const config = calendarStore((s) => s.config);
  const selectedEventId = calendarStore((s) => s.selectedEventId);
  const resizingEvent = calendarStore((s) => s.resizingEvent);
  const openEventModal = calendarStore((state) => state.openEventModal);

  const startResize = calendarStore((s) => s.startResize);
  const updateResize = calendarStore((s) => s.updateResize);
  const endResize = calendarStore((s) => s.endResize);

  const dropData: CalendarDropData = { type: "day-column", day };

  const { setNodeRef } = useDroppable({
    id: `day-${day.toISOString()}`,
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

  const dayItems = useMemo(() => items.filter((item) => isSameDay(item.start, day)), [items, day]);

  const positionedItems = useMemo(
    () => getPositionedCalendarItems(dayItems, config.slotHeight, config),
    [dayItems, config],
  );

  const startSlot = getStartSlot(config);
  const visibleSlotCount = getVisibleSlotCount(config);
  const slotsPerHour = getSlotsPerHour(config);

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
      className="relative border-r last:border-r-0"
    >
      {Array.from({ length: visibleSlotCount }, (_, i) => {
        const slotIndex = startSlot + i;
        const isHour = slotIndex % slotsPerHour === 0;

        return (
          <div
            key={slotIndex}
            className={isHour ? "border-t" : ""}
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
