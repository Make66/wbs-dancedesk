import { useEffect, useState } from "react";
import { getInstructors } from "../../data/instructors";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { Instructor } from "../../types/instructor-types";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";

const InstructorPicker = () => {
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const { watch, setValue } = useFormContext<CourseFormValues>();
  useEffect(() => {
    const fetchInstructors = async () => {
      const instructorsData = await getInstructors();
      setInstructors(instructorsData);
      setLoading(false);
    };
    fetchInstructors();
  }, []);
  return (
    <div className="h-22 w-full bg-background rounded-2xl border border-muted-foreground flex items-center text-foreground cursor-pointer hover:bg-blue-400">
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full h-full pl-2 flex items-center gap-4 cursor-pointer">
            <FaChalkboardTeacher className="text-3xl ml-4" />
            <span className="text-lg">
              {loading
                ? "Lade Tanzlehrer..."
                : instructors.find((i) => i.id === watch("instructorId"))?.name ||
                  "Instruktor auswählen"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
          <div className="grid gap-1 p-2">
            {instructors.map((instructor) => (
              <button
                key={instructor.id}
                type="button"
                className="rounded-md px-3 py-2 text-lg hover:bg-blue-400 text-left cursor-pointer"
                onClick={() => setValue("instructorId", instructor.id)}
              >
                {instructor.name}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InstructorPicker;
