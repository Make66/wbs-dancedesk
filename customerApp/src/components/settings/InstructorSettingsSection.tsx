import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { MdPerson } from "react-icons/md";
import AddButton from "../ui/AddButton";
import { getInstructors } from "../../data/instructor";
import type { Instructor } from "../../types/instructor-types";

const InstructorSettingsSection = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getInstructors().then(setInstructors).catch(console.error);
  }, []);

  return (
    <div className="p-4 bg-purple-400/60 rounded-2xl">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-4 ml-2">
          <MdPerson className="text-2xl" />
          <h3 className="text-2xl font-semibold">Instruktoren</h3>
        </div>
        <div className="flex items-center gap-6">
          {isOpen && (
            <div onClick={(e) => e.stopPropagation()}>
              <Link to="/instructor" onClick={(e) => e.stopPropagation()}>
                <AddButton tooltipContent="Tanzlehrer hinzufügen" size="medium" />
              </Link>
            </div>
          )}
          {isOpen ? (
            <RiArrowUpSLine className="text-2xl mr-2" />
          ) : (
            <RiArrowDownSLine className="text-2xl mr-2" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-2">
          {instructors.length === 0 ? (
            <p className="text-sm text-muted-foreground pl-2">
              Keine Tanzlehrer vorhanden. Klicke auf „+" um einen Tanzlehrer hinzuzufügen.
            </p>
          ) : (
            instructors.map((instructor) => (
              <Link key={instructor.id} to={`/instructor/${instructor.id}`} state={{ instructor }}>
                <div className="rounded-2xl border border-muted-foreground bg-background/40 flex items-center px-5 py-3 gap-4 hover:bg-purple-500 transition-colors">
                  <img
                    src={instructor.imageUrl || "/assets/images/no-profile-picture.svg"}
                    alt={instructor.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium truncate">{instructor.name}</p>
                    {instructor.skills.length > 0 && (
                      <p className="text-sm text-muted-foreground truncate">
                        {instructor.skills.join(", ")}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorSettingsSection;
