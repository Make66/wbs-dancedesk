import { useState } from "react";
import TargetItem from "../courses/TargetItem";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { targetStore } from "../../stores/targetStore";
import { userStore } from "../../stores/userStore";
import { updateLocationDB } from "../../data/location";
import { toast } from "react-toastify";
import AddButton from "../ui/AddButton";
import VisibleButton from "../ui/VisibleButton";
import { MdGroups } from "react-icons/md";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

const TargetsPage = () => {
  const targets = targetStore((state) => state.targets);
  const isInactiveVisible = targetStore((state) => state.isInactiveVisible);
  const toggleInactiveVisibility = targetStore((state) => state.toggleInactiveVisibility);
  const reorderTargets = targetStore((state) => state.reorderTargets);
  const addTarget = targetStore((state) => state.addTarget);
  const selectedLocationId = userStore((state) => state.selectedLocationId);
  const getOrderedTargetIds = targetStore((state) => state.getOrderedTargetIds);

  const [isOpen, setIsOpen] = useState(false);
  const hasInactiveItems = targets.some((target) => !target.isActive);
  const visibleTargets = isInactiveVisible ? targets : targets.filter((target) => target.isActive);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (!selectedLocationId) return;

    const prevOrderedIds = getOrderedTargetIds();
    try {
      reorderTargets(String(active.id), String(over.id));
      const newOrderedIds = targetStore.getState().getOrderedTargetIds();
      await updateLocationDB(selectedLocationId, {
        setSeqTarget: newOrderedIds,
      });
    } catch (error) {
      console.log("Error reordering targets:", error);
      toast.error("Fehler beim Aktualisieren der Reihenfolge.");
      userStore.getState().updateLocationTargetOrder(selectedLocationId, prevOrderedIds);
      targetStore.getState().replaceTargets(targetStore.getState().targets);
    }
  };

  return (
    <div className="p-4 bg-red-400/60 rounded-2xl">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-4 ml-2">
          <MdGroups className="text-2xl" />
          <h3 className="text-2xl font-semibold">Zielgruppen</h3>
        </div>
        <div className="flex items-center gap-6">
          {isOpen && (
            <div onClick={(e) => e.stopPropagation()} className="mt-1">
              <AddButton
                onClick={() => addTarget()}
                tooltipContent="Zielgruppe hinzufügen"
                size="medium"
              />
            </div>
          )}
          {hasInactiveItems && (
            <div onClick={(e) => e.stopPropagation()}>
              <VisibleButton
                onClick={toggleInactiveVisibility}
                isVisible={isInactiveVisible}
                tooltipContent="Inaktive Zielgruppen anzeigen/verbergen"
              />
            </div>
          )}
          {isOpen ? (
            <RiArrowUpSLine className="text-2xl mr-2" />
          ) : (
            <RiArrowDownSLine className="text-2xl mr-2" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="mt-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleTargets.map((target) => target.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {visibleTargets.map((target) => (
                  <TargetItem key={target.id} target={target} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default TargetsPage;
