import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
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
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { updateTargetDB } from "../data/target";
import { appIcons, type AppIconName } from "../components/icons";

const CategoriesPage = () => {
  const { targetId } = useParams();
  const location = useLocation();

  const error = categoryStore((state) => state.error);
  const isLoading = categoryStore((state) => state.isLoading);
  const isEditMode = categoryStore((state) => state.isEditMode);
  const courseCategories = categoryStore((state) => state.categories);
  const isInactiveVisible = categoryStore((state) => state.isInactiveVisible);
  const toggleInactiveVisibility = categoryStore((state) => state.toggleInactiveVisibility);
  const hasInactiveItems = categoryStore((state) => state.hasInactiveItems());

  const setError = categoryStore((state) => state.setError);
  const setLoading = categoryStore((state) => state.setLoading);
  const setEditMode = categoryStore((state) => state.setEditMode);
  const setParentContext = categoryStore((state) => state.setParentContext);
  const replaceCategories = categoryStore((state) => state.replaceCategories);
  const clearCategories = categoryStore((state) => state.clearCategories);
  const reorderCategories = categoryStore((state) => state.reorderCategories);
  const collapseAllCategories = categoryStore((state) => state.collapseAllCategories);
  const addCategory = categoryStore((state) => state.addCategory);
  const getOrderedCategoryIds = categoryStore((state) => state.getOrderedCategoryIds);

  const visibleCategories = useMemo(() => {
    return isInactiveVisible
      ? courseCategories
      : courseCategories.filter((category) => category.active);
  }, [courseCategories, isInactiveVisible]);

  const target = location.state?.target;
  const iconName = target.icon;
  const IconComponent = iconName ? appIcons[iconName as AppIconName] : null;

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const prevOrderedIds = getOrderedCategoryIds();
    try {
      reorderCategories(String(active.id), String(over.id));
      const newOrderedIds = categoryStore.getState().getOrderedCategoryIds();
      await updateTargetDB(targetId!, {
        setSeqCategory: newOrderedIds,
      });
    } catch (error) {
      console.log("Error reordering categories:", error);
      toast.error("Fehler beim Aktualisieren der Reihenfolge.");
      setError("Fehler beim Aktualisieren der Reihenfolge.");
      categoryStore.getState().replaceCategories(courseCategories, prevOrderedIds);
    }
  };

  useEffect(() => {
    if (!targetId) {
      setParentContext(null);
      clearCategories();
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

        const fetchedCategories = data.categories ?? [];
        const orderedIds = data.setSeqCategory ?? [];

        setParentContext(targetId, orderedIds);
        replaceCategories(fetchedCategories, orderedIds);
      } catch (err) {
        console.error("Error loading course target detail:", err);
        setError("Fehler beim Laden der Zielgruppe.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [targetId, setParentContext, clearCategories, setLoading, setError, replaceCategories]);

  if (isLoading) {
    return <div className="p-6">Kategorien werden geladen...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 bg-white pl-6 z-20">
        <div className="flex">
          {iconName && IconComponent && <IconComponent width={30} className="ml-1 mr-2" />}
          <h1 className="text-3xl font-semibold">{location.state?.target.name || ""}</h1>
        </div>

        <button
          type="button"
          onClick={() => setEditMode(!isEditMode)}
          aria-label="Bearbeitungsmodus umschalten"
        >
          <FaPenNib className="cursor-pointer text-xl" />
        </button>

        {isEditMode && (
          <button
            type="button"
            aria-label="Kategorie hinzufügen"
            onClick={() => {
              addCategory();
            }}
          >
            <IoMdAddCircleOutline className="cursor-pointer text-xl" />
          </button>
        )}
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

      <div className="mt-3 p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleCategories.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {visibleCategories.map((item) => (
                <CategoryItem key={item.id} category={item} targetId={targetId} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default CategoriesPage;
