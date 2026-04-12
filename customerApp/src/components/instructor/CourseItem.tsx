import { Link } from "react-router";
import type { Course } from "../../types/course-types";

type CourseItemProps = {
  course: Course;
};

const CourseItem = ({ course }: CourseItemProps) => {
  return (
    <Link
      to={`/course/${course.id}`}
      className="mb-2 h-22 w-full p-3 rounded-2xl bg-background/40 border border-muted-foreground flex items-center cursor-pointer hover:bg-blue-400"
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-md">
            <p>{course.name}</p>
            <p>{course.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseItem;
