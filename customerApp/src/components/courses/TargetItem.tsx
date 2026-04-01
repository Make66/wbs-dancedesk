import { useSortable } from "@dnd-kit/sortable";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaPenNib } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CSS } from "@dnd-kit/utilities";
import type { Target } from "../../types/course-types";
import { Switch } from "../ui/switch";
import { cn } from "../../lib/utils";
import { targetStore } from "../../stores/targetStore";
import { useState } from "react";
import { Link } from "react-router";
import { useDndMonitor } from "@dnd-kit/core";
import { updateTargetDB } from "../../data/target";
import { toast } from "react-toastify";
import { appIcons, type AppIconName } from "../icons";
import TargetItemEdit from "./TargetItemEdit";
import { userStore } from "../../stores/userStore";
import { updateLocationDB } from "../../data/location";

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

  const iconName = formData.icon || target.icon;
  const IconComponent = iconName ? appIcons[iconName as AppIconName] : null;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: target.id,
    disabled: !target.active,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleActive = async (checked: boolean) => {
    const selectedLocationId = userStore.getState().selectedLocationId;
    if (!selectedLocationId) return;

    const prevOrderedIds = targetStore.getState().getOrderedTargetIds();
    const prevActive = target.active;

    toggleTargetActive(target.id, checked);

    if (target.isNew) return;

    try {
      const newOrderedIds = targetStore.getState().getOrderedTargetIds();

      await Promise.all([
        updateTargetDB(target.id, {
          active: checked,
        }),
        updateLocationDB(selectedLocationId, {
          setSeqTarget: newOrderedIds,
        }),
      ]);
    } catch (error) {
      toggleTargetActive(target.id, prevActive);
      userStore.getState().updateLocationTargetOrder(selectedLocationId, prevOrderedIds);
      targetStore.getState().replaceTargets(targetStore.getState().courseTargets);

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
          backgroundColor: target.active ? target?.color[0] : target.color[0] + "80",
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
              <Link to={`/courses/${target.id}`} className="flex items-center">
                {iconName && IconComponent && (
                  <IconComponent fill={formData.fontColor} width={20} className="-ml-2 mr-3" />
                )}
                <span style={{ color: formData.fontColor }}>{formData.name}</span>
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
        <TargetItemEdit
          target={target}
          formData={formData}
          setFormData={setFormData}
          setIsEditable={setIsEditable}
        />
      )}
    </div>
  );
};

export default TargetItem;
