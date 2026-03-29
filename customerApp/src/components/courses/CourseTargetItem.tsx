import { useSortable } from "@dnd-kit/sortable";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaPenNib } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdInsertEmoticon } from "react-icons/md";
import { CSS } from "@dnd-kit/utilities";
import type { CourseTarget } from "../../types/course";
import { Switch } from "../ui/switch";
import { cn } from "../../lib/utils";
import { useCourseTargetsStore } from "../../stores/useCourseTargetsStore";
import { useState } from "react";
import { Link } from "react-router";
import { Input } from "../ui/input";
import { ColorPicker } from "../ui/colorPicker";
import { Button } from "../ui/button";
import { useDndMonitor } from "@dnd-kit/core";
import { createCourseTargetDB, updateCourseTargetDB } from "../../data/courseTarget";
import { toast } from "react-toastify";

type CourseTargetItemProps = {
  courseTarget: CourseTarget & { isNew?: boolean };
};

const CourseTargetItem = ({ courseTarget }: CourseTargetItemProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    id: courseTarget.id,
    name: courseTarget.name ?? "",
    color: courseTarget.color?.[0] ?? "#000000",
    fontColor: courseTarget.color?.[1] ?? "#FFFFFF",
  });

  const toggleCourseTargetActive = useCourseTargetsStore((state) => state.toggleCourseTargetActive);
  const deleteCourseTarget = useCourseTargetsStore((state) => state.deleteCourseTarget);
  const updateCourseTarget = useCourseTargetsStore((state) => state.updateCourseTarget);
  const updateColor = useCourseTargetsStore((state) => state.updateColor);
  const replaceTemporaryCourseTarget = useCourseTargetsStore(
    (state) => state.replaceTemporaryCourseTarget,
  );

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: courseTarget.id,
    disabled: !courseTarget.active,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Bitte gib der Zielgruppe einen Namen.");
      return;
    }

    try {
      if (courseTarget.isNew) {
        const createdTarget = await createCourseTargetDB({
          name: formData.name,
          color: [formData.color, formData.fontColor],
          active: true,
          seq: courseTarget.seq,
        });

        replaceTemporaryCourseTarget(courseTarget.id, createdTarget);
        toast.success("Kursziel erfolgreich erstellt!");
      } else {
        const updatedTarget = await updateCourseTargetDB(courseTarget.id, {
          name: formData.name,
          color: [formData.color, formData.fontColor],
        });

        updateCourseTarget(courseTarget.id, updatedTarget);
        toast.success("Kursziel erfolgreich aktualisiert!");
      }

      setIsEditable(false);
    } catch (error) {
      console.error(error);
      toast.error("Speichern fehlgeschlagen.");
    }
  };

  const handleToggleActive = async (checked: boolean) => {
    toggleCourseTargetActive(courseTarget.id, checked);

    try {
      await updateCourseTargetDB(courseTarget.id, {
        active: checked,
      });
    } catch (error) {
      toggleCourseTargetActive(courseTarget.id, !checked);
      toast.error("Status konnte nicht gespeichert werden.");
      console.error("Error updating course target active status:", error);
    }
  };

  const handleDelete = async () => {
    if (courseTarget.isNew) {
      deleteCourseTarget(courseTarget.id);
      return;
    }

    try {
      await updateCourseTargetDB(courseTarget.id, { isDeleted: true });
      deleteCourseTarget(courseTarget.id);
      toast.success("Kursziel gelöscht.");
    } catch (error) {
      toast.error("Löschen fehlgeschlagen.");
      console.error("Error deleting course target:", error);
    }
  };

  useDndMonitor({
    onDragStart(event) {
      if (event.active.id === courseTarget.id && isEditable) {
        setIsEditable(false);
      }
    },
  });

  return (
    <div className={cn(isDragging && "z-50 opacity-60", "z-0 w-full max-w-200")}>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: courseTarget.active ? formData.color : "rgba(0,0,0,0.2)",
        }}
        {...attributes}
        {...listeners}
        className={cn(
          "rounded-2xl p-5",
          isDragging && "z-20 opacity-60",
          "cursor-grab touch-none active:cursor-grabbing",
          !courseTarget.active && "cursor-not-allowed opacity-50",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 text-white">
            <RxHamburgerMenu />
            {courseTarget.isNew ? (
              <span style={{ color: formData.fontColor }}>
                {formData.name || "Neue Zielgruppe"}
              </span>
            ) : (
              <Link to={`/courses/${courseTarget.id}`} style={{ color: formData.fontColor }}>
                {formData.name}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-7">
            {courseTarget.active ? (
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setIsEditable(!isEditable)}
              >
                <div className="rounded-full bg-transparent p-2">
                  <FaPenNib />
                </div>
              </button>
            ) : (
              <button type="button" className="cursor-pointer text-2xl" onClick={handleDelete}>
                <MdDelete />
              </button>
            )}
            <Switch
              className="cursor-pointer"
              checked={courseTarget.active}
              onCheckedChange={(checked) => {
                handleToggleActive(checked);
                setIsEditable(false);
              }}
            />
          </div>
        </div>
      </div>

      {isEditable && (
        <div className="h-28">
          <form onSubmit={handleSubmit} className="flex items-center justify-between px-5 py-7">
            <div className="flex items-center gap-6">
              <input type="hidden" value={formData.id} name="id" />
              <Input
                type="text"
                className="w-100"
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
              <ColorPicker
                color={formData.color}
                onChange={(newColor) => {
                  setFormData((prev) => ({ ...prev, color: newColor }));
                  updateColor(courseTarget.id, [newColor, formData.fontColor]);
                }}
              />
              <ColorPicker
                color={formData.fontColor}
                onChange={(newColor) => {
                  setFormData((prev) => ({ ...prev, fontColor: newColor }));
                  updateColor(courseTarget.id, [formData.color, newColor]);
                }}
              />
              <MdInsertEmoticon className="cursor-pointer text-5xl text-gray-600" />
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
