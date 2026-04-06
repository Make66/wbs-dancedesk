import { FaPlay, FaClock } from "react-icons/fa6";
import { DatePicker } from "../ui/DatePicker";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { generateTimeOptions } from "../../lib/calendar/time";
import { DEFAULT_CALENDAR_CONFIG } from "../../lib/constants/calendar-constants";

type FormDatePickerProps = {
  startsAt?: Date;
  endsAt?: Date;
  onChange?: (value: { startsAt: Date | undefined; endsAt: Date | undefined }) => void;
  className?: string;
};

function getTimeString(date?: Date) {
  if (!date) return "09:00";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function combineDateAndTime(date: Date | undefined, time: string) {
  if (!date) return undefined;

  const [hours, minutes] = time.split(":").map(Number);
  const nextDate = new Date(date);
  nextDate.setHours(hours ?? 0, minutes ?? 0, 0, 0);

  return nextDate;
}

const TIME_OPTIONS = generateTimeOptions(DEFAULT_CALENDAR_CONFIG);

const FormDatePicker = ({ startsAt, endsAt, onChange, className }: FormDatePickerProps) => {
  const selectedDate = startsAt ?? endsAt;
  const selectedStartTime = getTimeString(startsAt);
  const selectedEndTime = getTimeString(endsAt);

  const handleDateChange = (date: Date | undefined) => {
    onChange?.({
      startsAt: combineDateAndTime(date, selectedStartTime),
      endsAt: combineDateAndTime(date, selectedEndTime),
    });
  };

  const handleStartTimeChange = (time: string) => {
    onChange?.({
      startsAt: combineDateAndTime(selectedDate, time),
      endsAt,
    });
  };

  const handleEndTimeChange = (time: string) => {
    onChange?.({
      startsAt,
      endsAt: combineDateAndTime(selectedDate, time),
    });
  };
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2", className)}>
      <DatePicker value={selectedDate} onChange={handleDateChange}>
        <button
          type="button"
          className="w-full h-22 p-6 flex justify-start items-center border-r border-muted-foreground cursor-pointer hover:bg-blue-200 hover:text-background"
        >
          <div>
            <FaPlay className="inline mr-4 text-2xl" />
            <span
              className={cn(
                selectedDate
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {selectedDate
                ? selectedDate.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "Startdatum wählen"}
            </span>
          </div>
        </button>
      </DatePicker>
      <div className="flex">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-full h-22 pl-7 text-foreground border-r border-muted-foreground text-left cursor-pointer hover:bg-blue-200 hover:text-background"
            >
              <div>
                <FaClock className="inline mr-4 text-lg" />
                <span>{selectedStartTime}</span>
              </div>
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-50 h-100 overflow-y-scroll scrollbar">
            <div className="grid gap-1">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleStartTimeChange(time)}
                  className={cn(
                    "rounded-md px-3 py-2 text-lg hover:bg-muted text-center cursor-pointer",
                    selectedStartTime === time && "bg-muted font-medium",
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-full h-22 pl-7 text-foreground text-left cursor-pointer hover:bg-blue-200 hover:text-background"
            >
              <div>
                <FaClock className="inline mr-4 text-lg" />
                <span>{selectedEndTime}</span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-50 h-100 overflow-y-scroll scrollbar">
            <div className="grid gap-1">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleEndTimeChange(time)}
                  className={cn(
                    "rounded-md px-3 py-2 text-lg hover:bg-muted text-center cursor-pointer",
                    selectedEndTime === time && "bg-muted font-medium",
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FormDatePicker;
