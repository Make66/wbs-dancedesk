import { FaUsers } from "react-icons/fa6";

type Category = {
  id: string;
  name: string;
  color: string[];
};

type Target = {
  id: string;
  name: string;
  color: string[];
};

type Course = {
  id: string;
  name: string;
  description: string;
  startsAt: string;
  endsAt: string;
  options: number;
  seatsCurrent: number;
  seatsMax: number;
  isBookedOut: boolean;
  isClub: boolean;
  color: string[];
  category: Category | null;
  target: Target | null;
  instructor: unknown | null;
  room: unknown | null;
};

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const WeeklyScheduleItem = ({ course, bg, text }: { course: Course; bg: string; text: string }) => {
  const pro = course.seatsCurrent / course.seatsMax;
  let color = "green";
  if (pro === 1) {
    color = "red";
  } else if (pro >= 0.8) {
    color = "orange";
  } else if (pro >= 0.5) {
    color = "yellow";
  } else {
    color = "green";
  }
  return (
    <div
      key={course.id}
      className="rounded-lg p-3 shadow-sm hover:saturate-150 hover:scale-105 transition-shadow duration-300"
      style={{
        backgroundColor: bg,
        color: text,
      }}
    >
      <div className="text-center">
        <p className="my-1 text-sm opacity-90">
          {formatTime(course.startsAt)} – {formatTime(course.endsAt)}
        </p>
        <div className="w-full my-2" style={{ borderBottom: `1px solid ${text}`, opacity: 0.7 }} />
        <p className="text-sm font-semibold leading-snug line-clamp-1">{course.name}</p>
        <p className="text-xs opacity-90">Hier kommt die Beschreibung</p>
      </div>
      <div className="mt-3 text-center space-y-1">
        <p className="mt-1 text-xs opacity-90">Großer Saal</p>
        <span className="text-xs opacity-90">Instruktor</span>
      </div>
      <div className="w-full my-3" style={{ borderBottom: `1px solid ${text}`, opacity: 0.7 }} />
      <div className="flex items-center justify-around">
        <div className="flex items-center px-2 py-1 bg-gray-800 w-fit rounded-3xl">
          <FaUsers className={`text-[10px] mr-2`} style={{ color: color }} />
          <span className={`text-[10px]`} style={{ color: color }}>
            {course.seatsCurrent} / {course.seatsMax}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleItem;
