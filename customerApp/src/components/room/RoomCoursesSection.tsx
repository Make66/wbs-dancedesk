import { IoSchool } from "react-icons/io5";
import type { Course } from "../../types/course-types";
import CourseItem from "../instructor/CourseItem";

type RoomCoursesSectionProps = {
  courses: Course[];
};

const RoomCoursesSection = ({ courses }: RoomCoursesSectionProps) => {
  return (
    <div className="p-2 w-full rounded-2xl bg-pink-600/40 shadow-xl">
      <div className="pt-2 pl-3 flex items-center justify-between col-span-1 md:col-span-2">
        <div className="flex items-center">
          <IoSchool className="inline mr-4 text-2xl" />
          <span className="text-2xl font-semibold">Kurse</span>
        </div>
      </div>
      <div className="mt-6">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-col gap-2">
            <CourseItem course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomCoursesSection;
