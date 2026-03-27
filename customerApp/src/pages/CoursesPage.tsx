import CourseTargetItem from "../components/courses/CourseTargetItem";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCourseTargetsStore } from "../stores/useCourseTargetsStore";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const CoursesPage = () => {
  const courseTargets = useCourseTargetsStore((state) => state.courseTargets);
  const isInactiveVisible = useCourseTargetsStore((state) => state.isInactiveVisible);
  const toggleInactiveVisibility = useCourseTargetsStore((state) => state.toggleInactiveVisibility);
  const reorderCourses = useCourseTargetsStore((state) => state.reorderCourseTargets);
  const addCourseTarget = useCourseTargetsStore((state) => state.addCourseTarget);

  const hasInactiveItems = courseTargets.some((courseTarget) => !courseTarget.isActive);

  const visibleCourseTargets = isInactiveVisible
    ? courseTargets
    : courseTargets.filter((courseTarget) => courseTarget.isActive);

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
            onClick={() =>
              addCourseTarget({
                name: "Neue Zielgruppe",
                color: "#9ca3af",
              })
            }
          >
            <IoMdAddCircleOutline className="text-3xl" />
          </button>
        </div>
      </div>

      <div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={visibleCourseTargets.map((course) => course.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {visibleCourseTargets.map((courseTarget) => (
                <CourseTargetItem key={courseTarget.id} courseTarget={courseTarget} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CoursesPage;
