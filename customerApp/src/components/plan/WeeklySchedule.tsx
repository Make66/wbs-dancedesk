import { Link } from "react-router";
import WeeklyScheduleItem from "./WeeklyScheduleItem";

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

type WeekData = {
  [key: number]: Course[];
};

type WeeklyScheduleProps = {
  data?: WeekData;
};

const dayLabels = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

export default function WeeklySchedule({ data }: WeeklyScheduleProps) {
  return (
    <div className="w-full">
      <div className="w-full grid md:grid-cols-3 lg:grid-cols-4 xl:grid-flow-col xl:auto-cols-fr gap-0.5">
        {dayLabels.map((label, index) => {
          const courses = data?.[index] ?? [];

          // Wenn keine Kurse vorhanden sind, gar nichts rendern
          if (courses.length === 0) return null;
          // <div key={index} className="rounded-xl border p-1 shadow-sm">
          //   <div className="mb-4 text-center text-sm font-semibold">{label}</div>
          // </div>

          return (
            <div key={index} className="rounded-xl border p-1 shadow-sm">
              <h2 className="mb-4 mt-2 text-center text-sm font-semibold">{label}</h2>

              <div className="space-y-1">
                {courses
                  .slice()
                  .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
                  .map((course) => {
                    const bgColor = course.color?.[0] ?? "#f3f4f6";
                    const textColor = course.color?.[1] ?? "#111827";

                    return (
                      <div className="mb-2" key={course.id}>
                        <Link to={`/courses/${course.id}`}>
                          <WeeklyScheduleItem
                            key={course.id}
                            course={course}
                            bg={bgColor}
                            text={textColor}
                          />
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
