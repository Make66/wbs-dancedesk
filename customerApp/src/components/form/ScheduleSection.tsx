import { FaCalendarAlt } from "react-icons/fa";
import ScheduleDatePicker from "./ScheduleDatePicker";
import type { CourseFormValues } from "../../types/form";
import { useFormContext } from "react-hook-form";
import FrequencyPicker from "./FrequencyPicker";
import RepetitionPicker from "./RepetitionPicker";
import DatesPicker from "./DatesPicker";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { LuRefreshCcwDot } from "react-icons/lu";
import { useState } from "react";

const ScheduleSection = () => {
  const { watch, setValue } = useFormContext<CourseFormValues>();
  const [toggleDates, setToggleDates] = useState(false);

  return (
    <div className="p-2 rounded-2xl bg-blue-400/40 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="pt-2 pl-3 flex items-center justify-between col-span-1 md:col-span-2">
        <div className="flex items-center">
          <FaCalendarAlt className="inline mr-4 text-2xl" />
          <span className="text-2xl font-semibold">Termine</span>
        </div>
        <div className="flex gap-4">
          {toggleDates && (
            <button type="button" className="cursor-pointer">
              <LuRefreshCcwDot className="text-2xl mr-4" />
            </button>
          )}
          <button
            type="button"
            className="cursor-pointer"
            data-tooltip-id="tooltip"
            data-tooltip-content="Termine anzeigen/ausblenden"
            data-tooltip-place="top-end"
          >
            {toggleDates ? (
              <IoMdEyeOff
                className="text-3xl mr-4"
                onClick={() => setToggleDates((prev) => !prev)}
              />
            ) : (
              <IoMdEye className="text-3xl mr-4" onClick={() => setToggleDates((prev) => !prev)} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 col-span-1 md:col-span-2 gap-3">
        <ScheduleDatePicker
          startsAt={watch("startsAt")}
          endsAt={watch("endsAt")}
          onChange={({ startsAt, endsAt }) => {
            setValue("startsAt", startsAt);
            setValue("endsAt", endsAt);
          }}
          className="w-full bg-background border border-muted-foreground rounded-2xl cursor-pointer overflow-hidden"
        />
      </div>
      <div className="col-span-1">
        <FrequencyPicker />
      </div>
      <div className="col-span-1">
        <RepetitionPicker />
      </div>
      {toggleDates && (
        <div className="col-span-1 md:col-span-2">
          <DatesPicker />
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;
