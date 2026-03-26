import { RxHamburgerMenu } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { Switch } from "../ui/switch";

type Course = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  startsAt: string;
  frequency: string;
  seatsCurrent: number;
  seatsMax: number;
};

type CourseItemProps = {
  course: Course;
};

const CourseItem = ({ course }: CourseItemProps) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RxHamburgerMenu className="inline-block mr-2" />
          <h3 className="font-semibold">{course.name}</h3>
        </div>
        <Switch />
      </div>
      <div className="pl-9">
        <p className="text-xs text-gray-500 mt-1">
          ab {new Date(course.startsAt).toLocaleDateString("de-DE", { weekday: "long" })}, dem{" "}
          {new Date(course.startsAt).toLocaleDateString()} um{" "}
          {new Date(course.startsAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
        </p>
        <div>
          <div className="flex my-2 px-4 py-2 bg-gray-800 w-fit rounded-3xl">
            <FaUsers className="inline-block mr-3 text-white" />
            <span className="text-xs text-white">
              {course.seatsCurrent} / {course.seatsMax}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{course.description}</p>
        <p className="text-sm text-gray-800 mt-2 font-medium">€ {course.price}</p>
      </div>
    </div>
  );
};

export default CourseItem;
