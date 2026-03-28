import { useSortable } from "@dnd-kit/sortable";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaPenNib } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdInsertEmoticon } from "react-icons/md";
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
import { useDndMonitor } from "@dnd-kit/core";

type CourseTargetItemProps = {
  courseTarget: CourseTarget;
};

const CourseTargetItem = ({ courseTarget }: CourseTargetItemProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [color, setColor] = useState(courseTarget.color);
  const [name, setName] = useState(courseTarget.name);
  const toggleCourseTargetActive = useCourseTargetsStore((state) => state.toggleCourseTargetActive);
  const deleteCourseTarget = useCourseTargetsStore((state) => state.deleteCourseTarget);
  const updateCourseTarget = useCourseTargetsStore((state) => state.updateCourseTarget);
  const updateColor = useCourseTargetsStore((state) => state.updateColor);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: courseTarget.id,
    disabled: !courseTarget.isActive,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCourseTarget(courseTarget.id, { name: name, color: color });
    setIsEditable(false);
  };

  useDndMonitor({
    onDragStart(event) {
      if (event.active.id === courseTarget.id && isEditable) {
        setIsEditable(false);
      }
    },
  });

  return (
    <div className={cn(isDragging && "opacity-60 z-50", "w-full max-w-200 z-0")}>
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

          <div className="flex items-center gap-7">
            {courseTarget.isActive ? (
              <button className="cursor-pointer" onClick={() => setIsEditable(!isEditable)}>
                <div className="bg-transparent p-2 rounded-full">
                  <FaPenNib />
                </div>
              </button>
            ) : (
              <button
                className="cursor-pointer text-2xl"
                onClick={() => deleteCourseTarget(courseTarget.id)}
              >
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
          <form onSubmit={handleSubmit} className="px-5 py-7 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Input
                type="text"
                className="w-100"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <ColorPicker
                color={color}
                onChange={(newColor) => {
                  setColor(newColor);
                  updateColor(courseTarget.id, newColor);
                }}
              />
              <MdInsertEmoticon className="text-5xl cursor-pointer text-gray-600" />
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
