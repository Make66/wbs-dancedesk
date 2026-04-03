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
import TargetItemEdit from "./TargetItemEdit";
import { userStore } from "../../stores/userStore";
import { updateLocationDB } from "../../data/location";
import { getIconComponent } from "../../lib/constants/icons";

type TargetFormDataType = {
  name: string;
  description: string;
  color: string[];
  icon: string;
};

type TargetItemProps = {
  target: Target & { isNew?: boolean };
};

const TargetItem = ({ target }: TargetItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TargetFormDataType>({
    name: target.name ?? "",
    description: target.description ?? "",
    color: target.color ?? ["#d1d5db", "#000000"],
    icon: target.icon ?? "",
  });

  const toggleTargetActive = targetStore((state) => state.toggleTargetActive);
  const deleteTarget = targetStore((state) => state.deleteTarget);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: target.id,
    disabled: !target.isActive,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleActive = async (checked: boolean) => {
    const selectedLocationId = userStore.getState().selectedLocationId;
    if (!selectedLocationId) return;

    const prevOrderedIds = targetStore.getState().getOrderedTargetIds();
    const prevActive = target.isActive;

    toggleTargetActive(target.id, checked);

    if (target.isNew) return;

    try {
      const newOrderedIds = targetStore.getState().getOrderedTargetIds();

      await Promise.all([
        updateTargetDB(target.id, {
          isActive: checked,
        }),
        updateLocationDB(selectedLocationId, {
          setSeqTarget: newOrderedIds,
        }),
      ]);
    } catch (error) {
      toggleTargetActive(target.id, prevActive);
      userStore.getState().updateLocationTargetOrder(selectedLocationId, prevOrderedIds);
      targetStore.getState().replaceTargets(targetStore.getState().targets);

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
      if (event.active.id === target.id && isModalOpen) {
        setIsModalOpen(false);
      }
    },
  });

  return (
    <div className={cn(isDragging && "z-20 opacity-60", "w-full max-w-200")}>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: target.isActive ? target?.color[0] : target.color[0] + "80",
        }}
        {...attributes}
        {...listeners}
        className={cn(
          "rounded-2xl p-5",
          isDragging && "z-20 opacity-60",
          "cursor-grab touch-none active:cursor-grabbing",
          !target.isActive && "cursor-not-allowed opacity-50",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <RxHamburgerMenu style={{ color: target.color[1] }} />
            {target.isNew ? (
              <div className="flex items-center gap-3">
                {formData.icon &&
                  (() => {
                    const Icon = getIconComponent(formData.icon);
                    return <Icon className="text-lg" style={{ color: formData.color[1] }} />;
                  })()}
                <span style={{ color: formData.color[1] }}>
                  {formData.name || "Neue Zielgruppe"}
                </span>
              </div>
            ) : (
              <Link
                to={`/courses/${target.id}`}
                state={{ target: target }}
                className="flex items-center"
              >
                {formData.icon &&
                  (() => {
                    const Icon = getIconComponent(formData.icon);
                    return <Icon className="text-lg mr-2" style={{ color: formData.color[1] }} />;
                  })()}
                <span style={{ color: formData.color[1] }}>{formData.name}</span>
                {formData.description && (
                  <>
                    <span style={{ color: formData.color[1] }} className="mx-2">
                      -
                    </span>
                    <span style={{ color: formData.color[1] }} className="text-xs">
                      {formData.description}
                    </span>
                  </>
                )}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-7">
            {target.isActive ? (
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => setIsModalOpen(!isModalOpen)}
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
              checked={target.isActive}
              onCheckedChange={(checked) => {
                handleToggleActive(checked);
                setIsModalOpen(false);
              }}
              color={target.color[1]}
              color2={target.color[0]}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TargetItemEdit
          target={target}
          formData={formData}
          setFormData={setFormData}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default TargetItem;
