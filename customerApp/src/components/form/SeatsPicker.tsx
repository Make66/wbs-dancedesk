import { PiSeatFill } from "react-icons/pi";
import type { CourseFormValues } from "./schemas/course-schema";
import { useFormContext } from "react-hook-form";
import { FaLock } from "react-icons/fa6";
import { Check } from "lucide-react";

const SeatsPicker = () => {
  const { watch, setValue } = useFormContext<CourseFormValues>();
  return (
    <div className="flex items-center">
      <div className="w-full relative">
        <input
          type="text"
          value={watch("seatsMax") || ""}
          onChange={(e) => setValue("seatsMax", Number(e.target.value) || 0)}
          className="h-22 w-full pl-20 bg-background/40 rounded-l-2xl border border-muted-foreground focus:outline-none focus:ring-0 focus:shadow-none"
          data-tooltip-id="tooltip"
          data-tooltip-content="Anzahl der Kursteilnehmer*innen"
          data-tooltip-place="bottom"
        />
        <PiSeatFill className="absolute left-7 top-8 text-2xl" />
      </div>
      {watch("isBookedOut") ? (
        <button
          type="button"
          className="relative h-22 w-full bg-muted-foreground/40 hover:bg-blue-400 border border-muted-foreground rounded-r-2xl cursor-pointer flex justify-center items-center"
          onClick={() => setValue("isBookedOut", false, { shouldDirty: true })}
          data-tooltip-id="tooltip"
          data-tooltip-content="Kurs öffnen (Anmeldungen möglich)"
          data-tooltip-place="bottom"
        >
          <div className="flex flex-col items-center justify-center mt-2">
            <FaLock className="text-2xl" />
            <span className="text-sm mt-1">closed</span>
          </div>
          <Check className="h-4 w-4 absolute top-2 right-2" />
        </button>
      ) : (
        <button
          type="button"
          className="h-22 w-full bg-background/40 hover:bg-blue-400 border border-muted-foreground rounded-r-2xl cursor-pointer flex justify-center items-center"
          onClick={() => setValue("isBookedOut", true, { shouldDirty: true })}
          data-tooltip-id="tooltip"
          data-tooltip-content="Kurs schließen (keine Anmeldungen mehr möglich)"
          data-tooltip-place="bottom"
        >
          <div className="flex flex-col items-center justify-center mt-2">
            <FaLock className="text-2xl" />
            <span className="text-sm mt-1">open</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default SeatsPicker;
