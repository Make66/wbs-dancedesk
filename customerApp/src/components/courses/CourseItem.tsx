import { RxHamburgerMenu } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { Switch } from "../ui/switch";
import { categoryStore } from "../../stores/categoryStore";
import type { Course } from "../../types/course-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";

type CourseItemProps = {
  course: Course;
};

const CourseItem = ({ course }: CourseItemProps) => {
  const isEditMode = categoryStore((state) => state.isEditMode);
  const toggleCourseActive = categoryStore((state) => state.toggleCourseActive);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: course.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("p-4 bg-white rounded-xl shadow h-full flex", isDragging && "opacity-60 z-20")}
    >
      {isEditMode && (
        <div className="flex w-6 h-full pt-1 mr-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="inline-flex mr-2 cursor-grab active:cursor-grabbing touch-none"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <RxHamburgerMenu className="inline-block" />
          </button>
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between pl-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold line-clamp-1 pr-2">{course.name}</h3>
          </div>
          {isEditMode && (
            <Switch
              checked={course.isActive}
              onCheckedChange={(checked) => {
                toggleCourseActive(course.categoryId, course.id, checked);
              }}
            />
          )}
        </div>
        <div className="pl-2">
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
    </div>
  );
};

export default CourseItem;
