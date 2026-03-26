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
import { Link } from "react-router";
import { Input } from "../ui/input";
import { ColorPicker } from "../ui/colorPicker";
import { Button } from "../ui/button";

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
    <div className="w-200">
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: courseTarget.isActive ? courseTarget.color : "rgba(0,0,0,0.2)",
        }}
        {...attributes}
        {...listeners}
        className={cn(
          "p-5 rounded-2xl",
          isDragging && "opacity-60 z-20",
          "cursor-grab active:cursor-grabbing touch-none",
          !courseTarget.isActive && "cursor-not-allowed opacity-50",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 text-white">
            <RxHamburgerMenu />
            <Link to={`/courses/${courseTarget.id}`}>{courseTarget.name}</Link>
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
              onCheckedChange={(checked) => {
                toggleCourseTargetActive(courseTarget.id, checked);
                setIsEditable(false);
              }}
            />
          </div>
        </div>
      </div>
      {isEditable && (
        <div className="h-28">
          <form action="" className="px-5 py-7 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Input type="text" className="w-100" label="Name" defaultValue={courseTarget.name} />
              <ColorPicker initialColor={courseTarget.color} />
            </div>
            <Button type="submit" size="lg">
              Speichern
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CourseTargetItem;
