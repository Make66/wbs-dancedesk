import { useEffect } from "react";
import CourseCategory from "../components/courses/CourseCategory";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCourseCategoriesStore } from "../stores/useCourseCategoriesStore";
import { FaPenNib } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { courseTargetDetailMock } from "../data/courseTargetDetail.mock";

const CourseCategoriesPage = () => {
  const courseTargetDetail = useCourseCategoriesStore((state) => state.courseTargetDetail);
  const loadCourseTargetDetail = useCourseCategoriesStore((state) => state.loadCourseTargetDetail);
  const reorderCategories = useCourseCategoriesStore((state) => state.reorderCategories);
  const toggleEditMode = useCourseCategoriesStore((state) => state.toggleEditMode);
  const isEditMode = useCourseCategoriesStore((state) => state.isEditMode);

  useEffect(() => {
    loadCourseTargetDetail(courseTargetDetailMock);
  }, [loadCourseTargetDetail]);

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

    reorderCategories(String(active.id), String(over.id));
  };

  const categories = courseTargetDetail?.categories ?? [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="mb-10 text-3xl font-semibold">{courseTargetDetail?.name ?? "Kategorien"}</h1>
        <div className="flex gap-3 items-center">
          {isEditMode && (
            <button>
              <IoMdAddCircleOutline className="text-xl mr-4 mb-7 cursor-pointer" />
            </button>
          )}
          <button onClick={toggleEditMode}>
            <FaPenNib className="text-xl mr-4 mb-7 cursor-pointer" />
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={categories.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {categories.map((item) => (
              <CourseCategory key={item.id} category={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CourseCategoriesPage;
