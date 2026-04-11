import { Link } from "react-router";
import type { Instructor } from "../types/instructor-types";

type InstructorItemProps = {
  instructor: Instructor;
};

const InstructorItem = ({ instructor }: InstructorItemProps) => {
  return (
    <div className="p-4 bg-muted-foreground rounded-2xl cursor-pointer">
      <Link to={`/instructor/${instructor.id}`} state={{ instructor: instructor }}>
        <div className="flex">
          <img
            src={
              instructor?.imageUrl
                ? "https://img.freepik.com/vektoren-premium/das-profilbild-des-mannes-avatars-ist-auf-dem-hintergrund-isoliert_1293239-4841.jpg?semt=ais_hybrid&w=740&q=80"
                : instructor.imageUrl
            }
            alt={instructor?.name}
            className="rounded-full w-20 h-20 object-cover"
          />
          <div className="ml-6">
            <h2 className="text-xl font-semibold">{instructor?.name}</h2>
            <p className="text-gray-600">{instructor?.description}</p>
          </div>
          <div className="ml-8 gap-2">
            {instructor.skills.map((skill) => (
              <span className="px-3 py-2 bg-background text-xs font-bold text-foreground rounded-3xl">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default InstructorItem;
