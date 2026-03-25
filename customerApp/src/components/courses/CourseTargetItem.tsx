import { useSortable } from "@dnd-kit/sortable";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { CSS } from "@dnd-kit/utilities";
import type { CourseTarget } from "../../types";
import { Switch } from "../ui/switch";
import { cn } from "../../lib/utils";
import { useCourseTargetsStore } from "../../stores/useCourseTargetsStore";
import { useState } from "react";

type CourseTargetItemProps = {
  courseTarget: CourseTarget;
};

const CourseTargetItem = ({ courseTarget }: CourseTargetItemProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const toggleCourseTargetActive = useCourseTargetsStore((state) => state.toggleCourseTargetActive);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: courseTarget.id,
    disabled: !courseTarget.isActive,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        courseTarget.isActive ? courseTarget.color : "bg-gray-400",
        "p-5 w-80 rounded-2xl",
        isDragging && "opacity-60 z-20",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={!courseTarget.isActive}
            className={cn(
              "cursor-grab active:cursor-grabbing touch-none",
              !courseTarget.isActive && "cursor-not-allowed opacity-50",
            )}
          >
            <RxHamburgerMenu />
          </button>
          <span>{courseTarget.name}</span>
        </div>

        <div className="flex items-center gap-5">
          {courseTarget.isActive ? (
            <button className="cursor-pointer" onClick={() => setIsEditable(!isEditable)}>
              <FiEdit />
            </button>
          ) : (
            <button className="cursor-pointer text-2xl">
              <MdDelete />
            </button>
          )}
          <Switch
            className="cursor-pointer"
            checked={courseTarget.isActive}
            onCheckedChange={(checked) => toggleCourseTargetActive(courseTarget.id, checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseTargetItem;
