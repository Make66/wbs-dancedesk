import { useEffect } from "react";
import CategoryItem from "../components/courses/CategoryItem";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { categoryStore } from "../stores/categoryStore";
import { FaPenNib } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useParams } from "react-router";

const CategoriesPage = () => {
  const { targetId } = useParams();

  const error = categoryStore((state) => state.error);
  const isLoading = categoryStore((state) => state.isLoading);
  const courseTargetDetail = categoryStore((state) => state.courseTargetDetail);
  const isEditMode = categoryStore((state) => state.isEditMode);

  const setError = categoryStore((state) => state.setError);
  const setLoading = categoryStore((state) => state.setLoading);
  const loadCourseTargetDetail = categoryStore((state) => state.loadCourseTargetDetail);
  const resetCourseTargetDetail = categoryStore((state) => state.resetCourseTargetDetail);
  const reorderCategories = categoryStore((state) => state.reorderCategories);
  const collapseAllCategories = categoryStore((state) => state.collapseAllCategories);
  const toggleEditMode = categoryStore((state) => state.toggleEditMode);

  const categories = courseTargetDetail?.categories ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragStart = (_event: DragStartEvent) => {
    collapseAllCategories();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    reorderCategories(String(active.id), String(over.id));
  };

  useEffect(() => {
    if (!targetId) {
      resetCourseTargetDetail();
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/targets/${targetId}/courses`,
        );

        if (!response.ok) {
          throw new Error("Zielgruppe konnte nicht geladen werden.");
        }

        const data = await response.json();

        loadCourseTargetDetail(data);
      } catch (err) {
        console.error("Error loading course target detail:", err);
        setError("Fehler beim Laden der Zielgruppe.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [targetId, loadCourseTargetDetail, resetCourseTargetDetail, setError, setLoading]);

  if (isLoading) {
    return <div className="p-6">Kategorien werden geladen...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="bg-white sticky top-0 pl-6 h-20 border-b border-gray-400 flex items-center gap-9">
        <h1 className="text-3xl font-semibold">{courseTargetDetail?.name ?? "Kategorien"}</h1>
        <button type="button" onClick={toggleEditMode} aria-label="Bearbeitungsmodus umschalten">
          <FaPenNib className="cursor-pointer text-xl" />
        </button>

        {isEditMode && (
          <button type="button" aria-label="Kategorie hinzufügen">
            <IoMdAddCircleOutline className="cursor-pointer text-xl" />
          </button>
        )}
      </div>

      <div className="p-6 mt-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {categories.map((item) => (
                <CategoryItem key={item.id} category={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CategoriesPage;
