import { Link } from "react-router";
import { addDays, format, setISOWeek, setISOWeekYear, startOfISOWeek } from "date-fns";
import WeeklyScheduleItem from "./WeeklyScheduleItem";
import type { Course } from "../../types/course-types";
import { cn } from "../../lib/utils";

type WeekData = {
  [key: number]: Course[];
};

type WeeklyScheduleProps = {
  data?: WeekData;
  week: number;
  year: number;
};

const dayLabels = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

export default function WeeklySchedule({ data, week }: WeeklyScheduleProps) {
  const year = new Date().getFullYear();

  const weekStart = startOfISOWeek(setISOWeek(setISOWeekYear(new Date(), year), week));

  return (
    <div className="w-full">
      <div className="w-full grid md:grid-cols-3 lg:grid-cols-4 xl:grid-flow-col xl:auto-cols-fr">
        {dayLabels.map((label, index) => {
          const courses = data?.[index] ?? [];
          if (courses.length === 0) return null;

          const currentDate = addDays(weekStart, index);

          return (
            <div
              key={index}
              className={cn(
                format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") &&
                  "bg-accent",
                "rounded-xl border border-muted-foreground p-1 shadow-sm",
              )}
            >
              <p className="text-xs text-muted-foreground text-center w-full">
                {format(currentDate, "dd.MM.yy")}
              </p>
              <h2 className="mb-4 mt-1 text-center text-sm font-semibold">{label}</h2>

              <div className="space-y-1">
                {courses
                  .slice()
                  .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
                  .map((course) => {
                    const bgColor = course.color?.[0] ?? "#f3f4f6";
                    const textColor = course.color?.[1] ?? "#111827";

                    return (
                      <div className="mb-2" key={course.id}>
                        <Link to={`/course/${course.id}`}>
                          <WeeklyScheduleItem course={course} bg={bgColor} text={textColor} />
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
