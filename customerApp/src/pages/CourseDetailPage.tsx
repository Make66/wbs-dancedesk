import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCourseById } from "../data/course";
import type { Course } from "../types/course-types";
import CourseForm1 from "../components/CourseForm1";
import CourseForm from "../components/CourseForm";

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

  console.log("Fetched course:", course);

  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b bg-background border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">Kursdetails</h1>
      </div>
      <div className="p-6">
        <CourseForm course={course} />
        <div className="mt-200">
          <CourseForm1 course={course} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
