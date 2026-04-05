import { useParams } from "react-router";
import { categoryStore } from "../stores/categoryStore";
import CourseForm from "../components/CourseForm";

const CourseDetailPage = () => {
  const courseId = useParams<{ courseId: string }>().courseId;

  const course = categoryStore((state) =>
    state.categories
      .flatMap((category) => category.courses)
      .find((course) => course.id === courseId),
  );

  return (
    <div className="w-full h-screen bg-white dark:bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">
          {course?.name || "Kurs nicht gefunden"}
        </h1>
      </div>
      <div className="p-6">
        <CourseForm course={course} />
      </div>
    </div>
  );
};

export default CourseDetailPage;
