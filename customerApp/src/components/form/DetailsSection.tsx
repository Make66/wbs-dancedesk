import { FaCircleInfo } from "react-icons/fa6";
import SeatingChart from "../charts/SeatingChart";
import type { CourseFormValues } from "./schemas/course-schema";
import { useFormContext } from "react-hook-form";
import InstructorPicker from "./InstructorPicker";
import RoomsPicker from "./RoomsPicker";
import GenderChart from "../charts/GenderChart";

const DetailsSection = () => {
  const { watch } = useFormContext<CourseFormValues>();
  return (
    <div className="p-2 rounded-2xl bg-purple-400/40 gap-3 shadow-xl">
      <div className="pt-2 pl-3 flex items-center justify-between col-span-1 md:col-span-2">
        <div className="flex items-center">
          <FaCircleInfo className="inline mr-4 text-2xl" />
          <span className="text-2xl font-semibold">Kursdetails</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="col-span-1 flex flex-col gap-3">
          <InstructorPicker />
          <RoomsPicker />
        </div>
        <div className="col-span-1">nächster Termin: Montag</div>
        <div className="col-span-2 grid grid-cols-4">
          <div className="col-span-1 flex items-start justify-start">
            <SeatingChart
              seatsCurrent={watch("seatsCurrent") || 0}
              maxSeats={watch("seatsMax") || 0}
            />
          </div>
          <div className="col-span-1 flex items-start justify-start">
            <SeatingChart
              seatsCurrent={watch("seatsCurrent") || 0}
              maxSeats={watch("seatsMax") || 0}
            />
          </div>
          <div className="col-span-1 flex items-start justify-start">
            <SeatingChart
              seatsCurrent={watch("seatsCurrent") || 0}
              maxSeats={watch("seatsMax") || 0}
            />
          </div>
          <div className="col-span-1 flex items-start justify-start">
            <GenderChart male={9} female={19} other={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
