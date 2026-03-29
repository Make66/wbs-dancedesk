import { useSortable } from "@dnd-kit/sortable";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaPenNib } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdInsertEmoticon } from "react-icons/md";
import { ImFont } from "react-icons/im";
import { CSS } from "@dnd-kit/utilities";
import type { Target } from "../../types/course-types";
import { Switch } from "../ui/switch";
import { cn } from "../../lib/utils";
import { targetStore } from "../../stores/targetStore";
import { useState } from "react";
import { Link } from "react-router";
import { Input } from "../ui/input";
import { ColorPicker } from "../ui/colorPicker";
import { Button } from "../ui/button";
import { useDndMonitor } from "@dnd-kit/core";
import { createTargetDB, updateTargetDB } from "../../data/target";
import { toast } from "react-toastify";
import { locationStore } from "../../stores/locationStore";
import { IconPicker } from "../ui/iconPicker";

type TargetItemProps = {
  target: Target & { isNew?: boolean };
};

const TargetItem = ({ target }: TargetItemProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    id: target.id,
    name: target.name ?? "",
    color: target.color?.[0],
    fontColor: target.color?.[1],
    icon: target.icon ?? "",
  });

  const toggleTargetActive = targetStore((state) => state.toggleTargetActive);
  const deleteTarget = targetStore((state) => state.deleteTarget);
  const updateTarget = targetStore((state) => state.updateTarget);
  const updateColor = targetStore((state) => state.updateColor);
  const replaceTemporaryTarget = targetStore((state) => state.replaceTemporaryTarget);
  const selectedLocationId = locationStore((state) => state.selectedLocationId);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: target.id,
    disabled: !target.active,
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

    const locationId = selectedLocationId ?? target.locationId;

    if (target.isNew && !locationId) {
      toast.error("Bitte wähle zuerst einen Standort aus.");
      return;
    }

    try {
      if (target.isNew) {
        const createdTarget = await createTargetDB({
          name: formData.name,
          color: [formData.color, formData.fontColor],
          icon: formData.icon,
          active: true,
          seq: target.seq,
          locationId: selectedLocationId!,
        });
        replaceTemporaryTarget(target.id, createdTarget);
        toast.success("Kursziel erfolgreich erstellt!");
      } else {
        const updatedTarget = await updateTargetDB(target.id, {
          name: formData.name,
          color: [formData.color, formData.fontColor],
        });

        updateTarget(target.id, updatedTarget);
        toast.success("Kursziel erfolgreich aktualisiert!");
      }

      setIsEditable(false);
    } catch (error) {
      console.error(error);
      toast.error("Speichern fehlgeschlagen.");
    }
  };

  const handleToggleActive = async (checked: boolean) => {
    toggleTargetActive(target.id, checked);

    if (target.isNew) return;

    try {
      await updateTargetDB(target.id, {
        active: checked,
        color: [target.color[0], target.color[1]],
      });
    } catch (error) {
      toggleTargetActive(target.id, !checked);
      toast.error("Status konnte nicht gespeichert werden.");
      console.error("Error updating course target active status:", error);
    }
  };

  const handleDelete = async () => {
    if (target.isNew) {
      deleteTarget(target.id);
      return;
    }

    try {
      await updateTargetDB(target.id, { isDeleted: true });
      deleteTarget(target.id);
      toast.success("Kursziel gelöscht.");
    } catch (error) {
      toast.error("Löschen fehlgeschlagen.");
      console.error("Error deleting course target:", error);
    }
  };

  useDndMonitor({
    onDragStart(event) {
      if (event.active.id === target.id && isEditable) {
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
          backgroundColor: target.active ? target.color[0] : target.color[0] + "80",
        }}
        {...attributes}
        {...listeners}
        className={cn(
          "rounded-2xl p-5",
          isDragging && "z-20 opacity-60",
          "cursor-grab touch-none active:cursor-grabbing",
          !target.active && "cursor-not-allowed opacity-50",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <RxHamburgerMenu style={{ color: target.color[1] }} />
            {target.isNew ? (
              <span style={{ color: formData.fontColor }}>
                {formData.name || "Neue Zielgruppe"}
              </span>
            ) : (
              <Link to={`/courses/${target.id}`} style={{ color: formData.fontColor }}>
                {formData.name}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-7">
            {target.active ? (
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setIsEditable(!isEditable)}
              >
                <div className="rounded-full bg-transparent p-2">
                  <FaPenNib style={{ color: target.color[1] }} />
                </div>
              </button>
            ) : (
              <button type="button" className="cursor-pointer text-2xl" onClick={handleDelete}>
                <MdDelete />
              </button>
            )}
            <Switch
              className="cursor-pointer"
              checked={target.active}
              onCheckedChange={(checked) => {
                handleToggleActive(checked);
                setIsEditable(false);
              }}
              color={target.color[1]}
              color2={target.color[0]}
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
                  updateColor(target.id, [newColor, formData.fontColor]);
                }}
              >
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border shadow cursor-pointer"
                  style={{ backgroundColor: formData.color }}
                />
              </ColorPicker>
              <ColorPicker
                color={formData.fontColor}
                onChange={(newColor) => {
                  setFormData((prev) => ({ ...prev, fontColor: newColor }));
                  updateColor(target.id, [formData.color, newColor]);
                }}
              >
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer flex items-center justify-center"
                >
                  <ImFont className="text-2xl" style={{ color: formData.fontColor }} />
                </button>
              </ColorPicker>
              <IconPicker
                icon={formData.icon}
                onChange={(newIcon) => {
                  setFormData((prev) => ({ ...prev, icon: newIcon }));
                }}
              >
                <MdInsertEmoticon className="cursor-pointer text-5xl text-gray-600" />
              </IconPicker>
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

export default TargetItem;
