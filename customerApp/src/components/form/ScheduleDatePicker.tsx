import { FaPlay, FaClock } from "react-icons/fa6";
import { DatePicker } from "../ui/DatePicker";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { generateTimeOptions } from "../../lib/calendar/time";
import { DEFAULT_CALENDAR_CONFIG } from "../../lib/constants/calendar-constants";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";

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

const ScheduleDatePicker = ({ startsAt, endsAt, onChange, className }: FormDatePickerProps) => {
  const {
    formState: { errors },
  } = useFormContext<CourseFormValues>();
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
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
    <>
      <div className={cn("grid grid-cols-1 md:grid-cols-2", className)}>
        <DatePicker
          value={selectedDate}
          onChange={(date) => {
            handleDateChange(date);
          }}
        >
          <button
            type="button"
            className="w-full h-22 p-6 flex justify-start items-center border-r-none md:border-r border-muted-foreground cursor-pointer hover:bg-blue-500"
          >
            <div>
              <FaPlay className="inline mr-4 text-2xl" />
              <span
                className={cn(
                  "text-lg",
                  selectedDate ? "text-foreground" : "text-muted-foreground",
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
        <div className="flex border-t border-muted-foreground md:border-t-0">
          <Popover open={isStartTimeOpen} onOpenChange={() => setIsStartTimeOpen(true)}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full h-22 pl-7 text-foreground border-r border-muted-foreground text-left cursor-pointer hover:bg-blue-500"
              >
                <div>
                  <FaClock className="inline mr-4 text-lg" />
                  <span className="text-lg">{selectedStartTime}</span>
                </div>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] h-100 overflow-y-scroll scrollbar">
              <div className="grid gap-1">
                {TIME_OPTIONS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      handleStartTimeChange(time);
                      setIsStartTimeOpen(false);
                    }}
                    className={cn(
                      "rounded-md px-3 py-2 text-lg text-center cursor-pointer hover:bg-blue-400",
                      selectedStartTime === time && "bg-foreground text-background font-medium",
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={isEndTimeOpen} onOpenChange={(open) => setIsEndTimeOpen(open)}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full h-22 pl-7 text-foreground text-left cursor-pointer hover:bg-blue-500"
              >
                <div>
                  <FaClock className="inline mr-4 text-lg" />
                  <span className="text-lg">{selectedEndTime}</span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] h-100 overflow-y-scroll scrollbar">
              <div className="grid gap-1">
                {TIME_OPTIONS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      handleEndTimeChange(time);
                      setIsEndTimeOpen(false);
                    }}
                    className={cn(
                      "rounded-md px-3 py-2 text-lg text-center cursor-pointer hover:bg-blue-400",
                      selectedEndTime === time && "bg-foreground text-background font-medium",
                    )}
                  >
                    <span className="text-lg">{time}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="ml-4">
        {errors.startsAt && (
          <p className="text-sm text-destructive mt-1 md:ml-0 md:col-span-2">
            {errors.startsAt.message}
          </p>
        )}
        {errors.endsAt && (
          <p className="text-sm text-destructive mt-1 md:ml-0 md:col-span-2">
            {errors.endsAt.message}
          </p>
        )}
      </div>
    </>
  );
};

export default ScheduleDatePicker;
