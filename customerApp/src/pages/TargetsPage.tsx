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
import { useState } from "react";

const TargetsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const courseTargets = targetStore((state) => state.courseTargets);
  const isInactiveVisible = targetStore((state) => state.isInactiveVisible);
  const toggleInactiveVisibility = targetStore((state) => state.toggleInactiveVisibility);
  const reorderCourses = targetStore((state) => state.reorderTargets);
  const addTarget = targetStore((state) => state.addTarget);
  const selectedLocationId = userStore((state) => state.selectedLocationId);
  const getOrderedTargetIds = targetStore((state) => state.getOrderedTargetIds);
  const hasInactiveItems = courseTargets.some((courseTarget) => !courseTarget.active);

  const visibleTargets = isInactiveVisible
    ? courseTargets
    : courseTargets.filter((courseTarget) => courseTarget.active);

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
    try {
      setIsLoading(true);
      const locationId = selectedLocationId;
      const orderedIds = getOrderedTargetIds();
      const payload = {
        setSeqTarget: orderedIds,
      };

      await updateLocationDB(locationId!, payload);
      reorderCourses(String(active.id), String(over.id));
    } catch (error) {
      console.log("Error reordering targets:", error);
      toast.error("Fehler beim Aktualisieren der Zielgruppenreihenfolge.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="pl-6 h-20 border-b border-gray-400 flex items-center gap-9">
        <h1 className="text-3xl font-semibold">Zielgruppen</h1>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              if (selectedLocationId) {
                addTarget({
                  name: "Neue Zielgruppe",
                  color: ["#DDDDDD", "#000000"],
                  locationId: selectedLocationId,
                });
              }
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
