import { useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { Instructor } from "../../types/instructor-types";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";

type InstructorPickerProps = {
  instructors?: Instructor[];
  loading?: boolean;
};

const InstructorPicker = ({ instructors = [], loading }: InstructorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { watch, setValue } = useFormContext<CourseFormValues>();

  const instructorId = watch("instructorId");
  const selectedInstructor = instructors.find((i) => i.id === instructorId);

  return (
    <div className="min-h-22 w-full rounded-2xl border border-muted-foreground bg-background/40 text-foreground">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="flex h-full w-full cursor-pointer items-center pl-2">
            {loading ? (
              <span className="text-lg">Lade Tanzlehrer...</span>
            ) : selectedInstructor ? (
              <div className="flex w-full items-center justify-between py-4">
                <div className="flex items-center gap-4 text-lg">
                  <img
                    className="ml-4 h-13 w-13 rounded-full object-cover"
                    src={selectedInstructor.imageUrl || "./assets/images/profile-pic.svg"}
                    alt={selectedInstructor.name}
                  />
                  <div className="flex flex-col items-start">
                    <span>{selectedInstructor.name}</span>
                    <span className="pr-2 text-left text-sm text-muted-foreground">
                      {selectedInstructor.description}
                    </span>
                  </div>
                </div>

                {selectedInstructor.skills?.length > 0 && (
                  <div className="mr-8 flex flex-col justify-start rounded-full bg-muted-foreground/50 px-2 py-1">
                    {selectedInstructor.skills.map((skill) => (
                      <span key={skill} className="text-[12px] text-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <FaChalkboardTeacher className="ml-6 text-3xl" />
                <span className="ml-2 text-muted-foreground">Tanzlehrer auswählen</span>
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
                  setValue("instructorId", instructor.id ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setIsOpen(false);
                }}
              >
                <div className="py-4">
                  <div className="flex w-full items-center justify-between py-4">
                    <div className="flex items-center gap-4 text-lg">
                      <img
                        className="ml-4 h-13 w-13 rounded-full object-cover"
                        src={instructor.imageUrl || "/assets/images/profile-pic.svg"}
                        alt={instructor.name}
                      />
                      <div className="flex flex-col items-start">
                        <span>{instructor.name}</span>
                        <span className="pr-3 text-left text-sm text-muted-foreground">
                          {instructor.description}
                        </span>
                      </div>
                    </div>

                    {instructor.skills?.length > 0 && (
                      <div className="mr-5 flex flex-col justify-start rounded-full bg-muted-foreground/50 px-2 py-1">
                        {instructor.skills.map((skill) => (
                          <span key={skill} className="text-center text-[12px] text-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
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
