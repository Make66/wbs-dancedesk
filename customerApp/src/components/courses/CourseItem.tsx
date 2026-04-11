import { PiDotsSixVerticalBold } from "react-icons/pi";
import { Switch } from "../ui/switch";
import { categoryStore } from "../../stores/categoryStore";
import type { Course } from "../../types/course-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { toast } from "react-toastify";
import SeatingItem from "../ui/SeatingItem";
import { updateCourseDB } from "../../data/course";

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
      style={{ backgroundColor: course.color?.[0] ?? "#ffffff", ...style }}
      className={cn(
        !course.isActive && "opacity-30 cursor-not-allowed",
        "p-4 rounded-xl shadow-xl h-full flex",
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
            <PiDotsSixVerticalBold
              className="inline-block dark:text-black"
              style={{ color: course.color?.[1] ?? "#000000" }}
            />
          </button>
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between pl-2">
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between">
              <h3
                className="font-semibold line-clamp-1 pr-2 text-background"
                style={{ color: course.color?.[1] ?? "#000000" }}
              >
                {course.name}
              </h3>
              {isEditMode && (
                <Switch
                  checked={course.isActive}
                  onCheckedChange={(checked) => {
                    handleToggleActive(checked);
                  }}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Kurs aktivieren/deaktivieren"
                  data-tooltip-place="top"
                  color={course.color?.[1]}
                  color2={course.color?.[0]}
                />
              )}
            </div>
            <p
              className="text-sm line-clamp-1 opacity-90"
              style={{ color: course.color?.[1] ?? "#000000" }}
            >
              {course.description}
            </p>
          </div>
        </div>
        <div className="pl-2">
          <p className="text-xs opacity-80 mt-1" style={{ color: course.color?.[1] ?? "#000000" }}>
            ab {new Date(course.startsAt).toLocaleDateString("de-DE", { weekday: "long" })}, dem{" "}
            {new Date(course.startsAt).toLocaleDateString()} um{" "}
            {new Date(course.startsAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
          </p>
          <div className="my-2">
            <SeatingItem seatsCurrent={course.seatsCurrent} seatsMax={course.seatsMax} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
