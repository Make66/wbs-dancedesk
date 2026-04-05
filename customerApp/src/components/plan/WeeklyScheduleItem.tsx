import type { Course } from "../../types/course-types";
import SeatingItem from "../ui/SeatingItem";
import { MdMeetingRoom } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const WeeklyScheduleItem = ({ course, bg, text }: { course: Course; bg: string; text: string }) => {
  return (
    <div
      key={course.id}
      className="rounded-lg p-3 shadow-sm hover:saturate-150 hover:scale-105 transition-shadow duration-300"
      style={{
        backgroundColor: bg,
        color: text,
      }}
    >
      <div className="text-center" style={{ color: text }}>
        <p className="my-1 text-sm opacity-90">
          {formatTime(course.startsAt)} – {formatTime(course.endsAt)}
        </p>
        <div className="w-full my-2" style={{ borderBottom: `1px solid ${text}`, opacity: 0.7 }} />
        <p className="text-sm font-semibold leading-snug line-clamp-1">{course.name}</p>
        <p className="text-xs opacity-90 line-clamp-1">Hier kommt die Beschreibung</p>
      </div>
      <div className="mt-3 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <MdMeetingRoom className="opacity-70" />
          <p className="mt-1 text-xs opacity-90">Großer Saal</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <FaChalkboardTeacher className="opacity-70" />
          <span className="text-xs opacity-90">Instruktor</span>
        </div>
      </div>
      <div className="flex justify-around mt-3">
        <SeatingItem seatsCurrent={course.seatsCurrent} seatsMax={course.seatsMax} />
      </div>
    </div>
  );
};

export default WeeklyScheduleItem;
