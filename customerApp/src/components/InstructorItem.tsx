import ProfileImageUploader from "./ui/image/ProfileImageUploader";

type Instructor = {
  id: string;
  name: string;
  description: string;
  profileImageUrl: string;
  skills: string[];
};

type InstructorItemProps = {
  instructor: Instructor;
};

const InstructorItem = ({ instructor }: InstructorItemProps) => {
  return (
    <div className="p-4 bg-muted-foreground rounded-2xl">
      <div className="flex">
        <div>
          <ProfileImageUploader schema="instructor" uuid="instructor-1" />
        </div>
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
    </div>
  );
};

export default InstructorItem;
