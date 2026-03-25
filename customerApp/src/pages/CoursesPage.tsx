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
import { useEffect } from "react";

const CoursesPage = () => {
  const courseTargets = useCourseTargetsStore((state) => state.courseTargets);
  const reorderCourses = useCourseTargetsStore((state) => state.reorderCourseTargets);

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

  useEffect(() => {
    console.log("Course Targets:", courseTargets);
  }, [courseTargets]);

  return (
    <div className="p-6 overflow-hidden">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={courseTargets.map((course) => course.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {courseTargets.map((courseTarget) => (
              <CourseTargetItem key={courseTarget.id} courseTarget={courseTarget} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CoursesPage;
