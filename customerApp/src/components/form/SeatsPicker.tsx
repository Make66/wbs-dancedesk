import { useEffect } from "react";
import { PiSeatFill } from "react-icons/pi";
import type { CourseFormValues } from "./schemas/course-schema";
import { useFormContext } from "react-hook-form";
import { FaLock } from "react-icons/fa6";
import { Check } from "lucide-react";
import type { Room } from "../../types/room-types";

type SeatsPickerProps = {
  rooms: Room[];
};

const SeatsPicker = ({ rooms }: SeatsPickerProps) => {
  const { watch, setValue } = useFormContext<CourseFormValues>();

  const roomId = watch("roomId");
  const seatsMax = watch("seatsMax");
  const isBookedOut = watch("isBookedOut");

  useEffect(() => {
    if (!roomId) return;

    const selectedRoom = rooms.find((r) => r.id === roomId);
    if (!selectedRoom) return;

    if (!seatsMax || seatsMax === 0) {
      setValue("seatsMax", selectedRoom.capacity ?? 0, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [roomId, rooms, seatsMax, setValue]);

  return (
    <div className="flex items-center">
      <div className="relative w-full">
        <input
          type="text"
          value={seatsMax ?? ""}
          onChange={(e) =>
            setValue("seatsMax", Number(e.target.value) || 0, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
          className="h-22 w-full rounded-l-2xl border border-muted-foreground border-r-0 bg-background/40 pl-20 focus:outline-none focus:ring-0 focus:shadow-none"
          data-tooltip-id="tooltip"
          data-tooltip-content="Anzahl der Kursteilnehmer*innen"
          data-tooltip-place="bottom"
        />
        <PiSeatFill className="absolute top-8 left-7 text-2xl" />
      </div>

      {isBookedOut ? (
        <button
          type="button"
          className="relative flex h-22 w-full cursor-pointer items-center justify-center rounded-r-2xl border border-muted-foreground bg-muted-foreground/40 hover:bg-blue-400"
          onClick={() =>
            setValue("isBookedOut", false, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
        >
          <div className="mt-2 flex flex-col items-center justify-center">
            <FaLock className="text-2xl" />
            <span className="mt-1 text-sm">closed</span>
          </div>
          <Check className="absolute top-2 right-2 h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          className="flex h-22 w-full cursor-pointer items-center justify-center rounded-r-2xl border border-muted-foreground bg-background/40 hover:bg-blue-400"
          onClick={() =>
            setValue("isBookedOut", true, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
        >
          <div className="mt-2 flex flex-col items-center justify-center">
            <FaLock className="text-2xl" />
            <span className="mt-1 text-sm">open</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default SeatsPicker;
