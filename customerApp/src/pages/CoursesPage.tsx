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

const CoursesPage = () => {
  const courseTargets = targetStore((state) => state.courseTargets);
  const isInactiveVisible = targetStore((state) => state.isInactiveVisible);
  const toggleInactiveVisibility = targetStore((state) => state.toggleInactiveVisibility);
  const reorderCourses = targetStore((state) => state.reorderTargets);
  const addTarget = targetStore((state) => state.addTarget);
  const selectedLocationId = userStore((state) => state.selectedLocationId);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    reorderCourses(String(active.id), String(over.id));
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-start justify-between">
        <h1 className="mb-10 text-3xl font-semibold">Zielgruppen</h1>

        <div className="flex items-center gap-4">
          {hasInactiveItems && (
            <button type="button" className="cursor-pointer" onClick={toggleInactiveVisibility}>
              {isInactiveVisible ? (
                <IoMdEyeOff className="text-3xl mt-2" />
              ) : (
                <IoMdEye className="text-3xl mt-2" />
              )}
            </button>
          )}
          <button
            type="button"
            className="cursor-pointer mt-2 mr-6"
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
        </div>
      </div>

      <div>
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

export default CoursesPage;
