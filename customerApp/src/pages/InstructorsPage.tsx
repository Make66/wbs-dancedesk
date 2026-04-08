import { useEffect, useState } from "react";
import InstructorItem from "../components/InstructorItem";
import type { Instructor } from "../types/instructor-types";
import { getInstructors } from "../data/instructors";

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      const instructorsData = await getInstructors();
      setInstructors(instructorsData);
    };
    fetchInstructors();
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center pl-6 gap-9 border-b border-muted-foreground">
        <h1 className="text-3xl font-semibold">Tanzlehrer</h1>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {instructors.length > 0 ? (
          instructors.map((instructor: Instructor) => (
            <InstructorItem key={instructor.id} instructor={instructor} />
          ))
        ) : (
          <p>Keine Tanzlehrer gefunden.</p>
        )}
      </div>
    </div>
  );
};

export default InstructorsPage;
