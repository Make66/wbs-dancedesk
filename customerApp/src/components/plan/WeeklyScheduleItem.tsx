import type { Course } from "../../types/course-types";
import SeatingItem from "../ui/SeatingItem";
import { IoLocationSharp } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const WeeklyScheduleItem = ({ course }: { course: Course }) => {
  return (
    <div
      key={course.id}
      className="rounded-lg p-3 shadow-sm hover:saturate-200 hover:scale-105 transition-shadow duration-300"
      style={{
        backgroundColor: course.color?.[0],
        color: course.color?.[1],
      }}
    >
      <div className="text-center" style={{ color: course.color?.[1] }}>
        <p className="my-1 text-sm opacity-90">
          {formatTime(course.startsAt)} – {formatTime(course.endsAt)}
        </p>
        <div
          className="w-full my-2"
          style={{ borderBottom: `1px solid ${course.color?.[1]}`, opacity: 0.7 }}
        />
        <p className="text-sm font-semibold leading-snug line-clamp-1">{course.name}</p>
        <p className="text-xs opacity-90 line-clamp-1">{course.description}</p>
      </div>
      <div className="mt-3 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <IoLocationSharp className="opacity-70" />
          <p className="mt-1 text-xs opacity-90">
            {course.room?.name || <p className="text-red-500">unbekannt</p>}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <FaChalkboardTeacher className="opacity-70" />
          <span className="text-xs opacity-90">
            {course.instructor?.name || <p className="text-red-500">unbekannt</p>}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="grid grid-cols-7 gap-3 items-center">
          <div className="col-span-1"></div>
          <div className="col-span-5 flex justify-around mt-3">
            <SeatingItem seatsCurrent={course.seatsCurrent} seatsMax={course.seatsMax} />
          </div>
          {course.isBookedOut && (
            <div
              className="col-span-1 flex items-center justify-center gap-2 mt-3"
              data-tooltip-id="tooltip"
              data-tooltip-content="Kurs ist geschlossen"
              data-tooltip-place="top"
            >
              <FaLock className="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleItem;
