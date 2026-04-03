import TargetItem from "../components/courses/TargetItem";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { targetStore } from "../stores/targetStore";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { userStore } from "../stores/userStore";
import { updateLocationDB } from "../data/location";
import { toast } from "react-toastify";

const TargetsPage = () => {
  const targets = targetStore((state) => state.targets);
  const isInactiveVisible = targetStore((state) => state.isInactiveVisible);
  const toggleInactiveVisibility = targetStore((state) => state.toggleInactiveVisibility);
  const reorderTargets = targetStore((state) => state.reorderTargets);
  const addTarget = targetStore((state) => state.addTarget);
  const selectedLocationId = userStore((state) => state.selectedLocationId);
  const getOrderedTargetIds = targetStore((state) => state.getOrderedTargetIds);

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
    <div className="w-full h-screen bg-white dark:bg-gray-900">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Zielgruppen</h1>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              addTarget();
            }}
          >
            <IoMdAddCircleOutline className="text-3xl" />
          </button>
          {hasInactiveItems && (
            <button type="button" className="cursor-pointer" onClick={toggleInactiveVisibility}>
              {isInactiveVisible ? (
                <IoMdEyeOff className="text-3xl" />
              ) : (
                <IoMdEye className="text-3xl" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-6 mt-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
    </div>
  );
};

export default TargetsPage;
