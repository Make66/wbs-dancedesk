import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getInstructorById } from "../data/instructor";
import type { Instructor } from "../types/instructor-types";
import InstructorForm from "../components/instructor/InstructorForm";

const InstructorDetailPage = () => {
  const instructorId = useParams<{ instructorId: string }>().instructorId;
  const [instructor, setInstructor] = useState<Instructor | undefined>(undefined);

  useEffect(() => {
    if (!instructorId) return;

    const fetchInstructor = async () => {
      try {
        const response = await getInstructorById(instructorId);
        setInstructor(response ?? undefined);
      } catch (error) {
        console.error("Error fetching instructor:", error);
        setInstructor(undefined);
      }
    };

    fetchInstructor();
  }, [instructorId]);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b bg-background border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">Instruktordetails</h1>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <InstructorForm instructor={instructor} />
      </div>
    </div>
  );
};

export default InstructorDetailPage;
