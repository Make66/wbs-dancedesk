import { IoSchool } from "react-icons/io5";
import { Link } from "react-router";
import type { Course } from "../../types/course-types";

type ParticipantCoursesSectionProps = {
  courses: Course[];
  isLoading: boolean;
};

const ParticipantCoursesSection = ({ courses, isLoading }: ParticipantCoursesSectionProps) => {
  return (
    <div className="p-2 w-full rounded-2xl bg-pink-600/40 shadow-xl">
      <div className="pt-2 pl-3 flex items-center col-span-1 md:col-span-2">
        <IoSchool className="inline mr-4 text-2xl" />
        <span className="text-2xl font-semibold">Kurse</span>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p>Lade Kurse...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>Keine Kurse gefunden.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="px-3 py-3 rounded-2xl bg-background/40 border border-muted-foreground flex items-center justify-between cursor-pointer hover:bg-blue-400/40 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{course.name}</span>
                  {course.description && (
                    <span className="text-sm text-muted-foreground">{course.description}</span>
                  )}
                </div>
                {course.isActive !== undefined && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      course.isActive
                        ? "bg-green-500/20 text-green-600"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {course.isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantCoursesSection;
