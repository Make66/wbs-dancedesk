import { RxHamburgerMenu } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { Switch } from "../ui/switch";
import { categoryStore } from "../../stores/categoryStore";
import type { Course } from "../../types/course-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { toast } from "react-toastify";

type CourseItemProps = {
  course: Course;
};

const updateCourseDB = async (id: string, data: { isActive?: boolean; isDeleted?: boolean }) => {
  const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update course: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return null;
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

  const handleToggleActive = async (checked: boolean) => {
    const prevActive = course.isActive;

    toggleCourseActive(course.categoryId, course.id, checked);

    if (course.isNew) return;

    try {
      await updateCourseDB(course.id, {
        isActive: checked,
      });
    } catch (error) {
      toggleCourseActive(course.categoryId, course.id, prevActive);
      toast.error("Status konnte nicht gespeichert werden.");
      console.error("Error updating course active status:", error);
    }
  };

  return (
    <div
      ref={course.isActive ? setNodeRef : undefined}
      style={style}
      className={cn(
        !course.isActive && "opacity-30 cursor-not-allowed",
        "p-4 bg-white rounded-xl shadow h-full flex",
        isDragging && "opacity-60 z-20",
      )}
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
            <RxHamburgerMenu className="inline-block dark:text-black" />
          </button>
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between pl-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold line-clamp-1 pr-2 dark:text-black">{course.name}</h3>
          </div>
          {isEditMode && (
            <Switch
              checked={course.isActive}
              onCheckedChange={(checked) => {
                handleToggleActive(checked);
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
