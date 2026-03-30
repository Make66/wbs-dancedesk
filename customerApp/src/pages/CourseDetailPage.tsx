import { useParams } from "react-router";
import { categoryStore } from "../stores/categoryStore";

const CourseDetailPage = () => {
  const courseId = useParams<{ courseId: string }>().courseId;

  const course = categoryStore((state) =>
    state.courseTargetDetail?.categories
      .flatMap((category) => category.courses)
      .find((course) => course.id === courseId),
  );

  return (
    <div className="w-full bg-white">
      <div className="pl-6 h-20 border-b border-gray-400 flex items-center justify-start">
        <h1 className="text-3xl font-semibold">{course?.name || "Kurs nicht gefunden"}</h1>
      </div>
      <div className="p-6">
        <p className="text-lg">{course?.description}</p>
        <p className="text-md text-gray-600">Start: {course?.startsAt}</p>
        <p className="text-md text-gray-600">Dauer: {course?.frequency}</p>
      </div>
    </div>
  );
};

export default CourseDetailPage;
