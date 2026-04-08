import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCourseById } from "../data/course";
import type { Course } from "../types/course-types";
import CourseForm from "../components/form/CourseForm";

const CourseDetailPage = () => {
  const courseId = useParams<{ courseId: string }>().courseId;
  const [course, setCourse] = useState<Course | undefined>(undefined);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const response = await getCourseById(courseId);
        setCourse(response ?? undefined);
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(undefined);
      }
    };

    fetchCourse();
  }, [courseId]);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b bg-background border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">Kursdetails</h1>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <CourseForm course={course} />
      </div>
    </div>
  );
};

export default CourseDetailPage;
