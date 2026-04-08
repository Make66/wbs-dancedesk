import { FaCircleInfo } from "react-icons/fa6";
import { MdMeetingRoom } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import SeatChart from "../charts/SeatChart";
import type { CourseFormValues } from "../../types/form";
import { useFormContext } from "react-hook-form";

const DetailsSection = () => {
  const { watch, setValue } = useFormContext<CourseFormValues>();
  return (
    <div className="p-2 rounded-2xl bg-purple-400/40 gap-3 shadow-xl">
      <div className="pt-2 pl-3 flex items-center justify-between col-span-1 md:col-span-2">
        <div className="flex items-center">
          <FaCircleInfo className="inline mr-4 text-2xl" />
          <span className="text-2xl font-semibold">Kursdetails</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="col-span-1 px-2 flex flex-col gap-3">
          <div className="h-22 w-full bg-background rounded-2xl border border-muted-foreground flex items-center text-foreground">
            <div className="pl-2 flex items-center gap-4">
              <FaChalkboardTeacher className="text-3xl ml-4" />
              <span className="text-lg">Max Mustermann</span>
            </div>
          </div>
          <div className="h-22 w-full bg-background rounded-2xl border border-muted-foreground flex items-center text-foreground">
            <div className="pl-2 flex items-center gap-4">
              <MdMeetingRoom className="text-3xl ml-4" />
              <span className="text-lg">Großer Saal</span>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="grid grid-cols-2">
            <div className="grid-cols-1"></div>
            <div className="col-span-1">
              <SeatChart
                seatsCurrent={watch("seatsCurrent") || 0}
                maxSeats={watch("seatsMax") || 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
