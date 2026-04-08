import { Check } from "lucide-react";
import { FaRepeat } from "react-icons/fa6";
import { SiDinersclub } from "react-icons/si";
import { TbCalendar, TbCalendarOff } from "react-icons/tb";
import { useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";

type CourseFormValues = {
  isClub: boolean;
  isIgnoreCalendar: boolean;
  clubRepetition?: number;
  courseRepetition?: number;
};

const RepetitionPicker = () => {
  const { watch, setValue } = useFormContext<CourseFormValues>();

  const isClub = watch("isClub");
  const clubRepetition = watch("clubRepetition");
  const courseRepetition = watch("courseRepetition");
  const isIgnoreCalendar = watch("isIgnoreCalendar");

  const activeValue = isClub ? clubRepetition : courseRepetition;

  const handleToggleClub = () => {
    setValue("isClub", !isClub, { shouldDirty: true });
  };

  const handleChange = (value: string) => {
    const parsedValue = value === "" ? undefined : Number(value);

    if (isClub) {
      setValue("clubRepetition", parsedValue, { shouldDirty: true });
    } else {
      setValue("courseRepetition", parsedValue, { shouldDirty: true });
    }
  };

  return (
    <div className="flex">
      <div className="w-full relative">
        <input
          type="text"
          value={activeValue ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          className="h-22 w-full pl-18 bg-background rounded-l-2xl border border-muted-foreground focus:outline-none focus:ring-0 focus:shadow-none"
          data-tooltip-id="tooltip"
          data-tooltip-content="Anzahl der Wiederholungen (z.B. 8 = Kurs findet 8x statt)"
          data-tooltip-place="bottom"
        />
        <FaRepeat className="absolute left-7 top-8 text-2xl" />
      </div>
      <button
        type="button"
        onClick={handleToggleClub}
        className={cn(
          "w-full h-22 flex items-center justify-center bg-background border-t border-b border-muted-foreground cursor-pointer overflow-hidden relative hover:bg-blue-400",
          isClub && "bg-muted-foreground text-background",
        )}
        data-tooltip-id="tooltip"
        data-tooltip-content="Club- oder regulärer Kurs"
        data-tooltip-place="bottom"
      >
        <div className="flex flex-col items-center mt-2">
          <SiDinersclub className="text-3xl" />
          <span className="text-[13px] mt-1 line-clamp-1">{isClub ? "Club" : "Regulär"}</span>
        </div>
        {isClub && <Check className="h-4 w-4 absolute top-2 right-6" />}
      </button>

      <button
        type="button"
        className={cn(
          "w-full h-22 flex items-center justify-center bg-background border border-muted-foreground rounded-r-2xl cursor-pointer overflow-hidden relative hover:bg-blue-400",
          isIgnoreCalendar && "bg-muted-foreground text-background",
        )}
        onClick={() => setValue("isIgnoreCalendar", !isIgnoreCalendar, { shouldDirty: true })}
        data-tooltip-id="tooltip"
        data-tooltip-content="Ferienkalender ignorieren"
        data-tooltip-place="bottom"
      >
        <div className="flex flex-col items-center mt-3">
          {isIgnoreCalendar ? (
            <TbCalendarOff className="text-3xl" />
          ) : (
            <TbCalendar className="text-3xl" />
          )}
          <span className="text-[13px] mt-1 line-clamp-1">
            {isIgnoreCalendar ? "ignorieren" : "Ferienkalender"}
          </span>
        </div>
        {isIgnoreCalendar && <Check className="h-4 w-4 absolute top-2 right-6" />}
      </button>
    </div>
  );
};

export default RepetitionPicker;
