import { useEffect, useState } from "react";
import { getInstructors } from "../../data/instructors";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { Instructor } from "../../types/instructor-types";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";

const InstructorPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const { watch, setValue } = useFormContext<CourseFormValues>();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const instructorsData = await getInstructors();
        setInstructors(instructorsData);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const selectedInstructor = instructors.find((i) => i.id === watch("instructorId"));

  return (
    <div className="min-h-22 w-full rounded-2xl border border-muted-foreground bg-background/40 text-foreground hover:bg-blue-400">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="flex h-full w-full cursor-pointer items-center pl-2">
            {loading ? (
              <span className="text-lg">Lade Tanzlehrer...</span>
            ) : selectedInstructor ? (
              <div className="w-full flex items-center justify-between py-4">
                <div className="flex items-center gap-4 text-lg">
                  <img
                    className="h-13 w-13 rounded-full ml-4"
                    src="https://img.freepik.com/vektoren-premium/das-profilbild-des-mannes-avatars-ist-auf-dem-hintergrund-isoliert_1293239-4841.jpg?semt=ais_hybrid&w=740&q=80"
                    alt={selectedInstructor.name}
                  />
                  <div className="flex flex-col items-start">
                    <span>{selectedInstructor.name}</span>
                    <span className="text-sm text-left text-muted-foreground pr-2">
                      {selectedInstructor.description}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-start mr-8 px-2 py-1 rounded-full bg-muted-foreground/50">
                  {selectedInstructor.skills.map((skill) => (
                    <span key={skill} className="text-[12px] text-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <FaChalkboardTeacher className="ml-6 text-3xl" />
                <span className="text-muted-foreground ml-2">Tanzlehrer auswählen</span>
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
          <div className="grid">
            {instructors.map((instructor) => (
              <button
                key={instructor.id}
                type="button"
                className="cursor-pointer rounded-md text-left text-lg hover:bg-blue-400"
                onClick={() => {
                  setValue("instructorId", instructor.id || "", {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setIsOpen(false);
                }}
              >
                <div className="py-4">
                  <div className="w-full flex items-center justify-between py-4">
                    <div className="flex items-center gap-4 text-lg">
                      <img
                        className="h-13 w-13 rounded-full ml-4"
                        src="https://img.freepik.com/vektoren-premium/das-profilbild-des-mannes-avatars-ist-auf-dem-hintergrund-isoliert_1293239-4841.jpg?semt=ais_hybrid&w=740&q=80"
                        alt={instructor.name}
                      />
                      <div className="flex flex-col items-start">
                        <span>{instructor.name}</span>
                        <span className="text-sm text-left text-muted-foreground pr-3">
                          {instructor.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start mr-5 px-2 py-1 rounded-full bg-muted-foreground/50">
                      {instructor.skills.map((skill) => (
                        <span key={skill} className="text-[12px] text-foreground text-center">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InstructorPicker;
