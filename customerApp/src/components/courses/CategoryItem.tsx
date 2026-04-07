import { useMemo, useState } from "react";
import { Link } from "react-router";
import { rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useDndMonitor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPenNib } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Switch } from "../ui/switch";
import { cn } from "../../lib/utils";
import { categoryStore } from "../../stores/categoryStore";
import { updateCategoryDB } from "../../data/category";
import { updateTargetDB } from "../../data/target";
import { toast } from "react-toastify";
import CourseItem from "./CourseItem";
import CategoryItemEdit from "./CategoryItemEdit";
import type { Category as CourseCategoryType } from "../../types/course-types";
import { sortEntitiesByOrderedIds } from "../../lib/courses/sorting-utils";
import ConfirmationModal from "../ui/confirmationModal";

type CategoryItemProps = {
  category: CourseCategoryType & { isNew?: boolean };
  targetId?: string;
};

const CategoryItem = ({ category, targetId }: CategoryItemProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name ?? "",
    description: category.description ?? "",
    color: [category.color?.[0] ?? "#d1d5db", category.color?.[1] ?? "#000000"],
    icon: category.icon ?? "",
  });

  const isEditMode = categoryStore((state) => state.isEditMode);
  const isInactiveVisible = categoryStore((state) => state.isInactiveVisible);
  const isOpened = categoryStore((state) => state.expandedCategoryIds.includes(category.id));
  const toggleCategoryExpanded = categoryStore((state) => state.toggleCategoryExpanded);
  const toggleCategoryActive = categoryStore((state) => state.toggleCategoryActive);
  const deleteCategory = categoryStore((state) => state.deleteCategory);

  const storeCategory = categoryStore((state) =>
    state.categories.find((item) => item.id === category.id),
  );

  const visibleCourses = useMemo(() => {
    if (!storeCategory) return [];

    const notDeletedCourses = (storeCategory.courses ?? []).filter((course) => !course.isDeleted);

    const filteredCourses = isInactiveVisible
      ? notDeletedCourses
      : notDeletedCourses.filter((course) => course.isActive);

    return sortEntitiesByOrderedIds(filteredCourses, storeCategory.setSeqCourse ?? []);
  }, [storeCategory, isInactiveVisible]);

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

    const prevCategories = structuredClone(categoryStore.getState().categories);
    const prevOrderedIds = [...categoryStore.getState().storedOrderedIds];

    try {
      categoryStore.getState().reorderCourses(category.id, String(active.id), String(over.id));

      const newOrderedIds = categoryStore.getState().getOrderedCourseIds(category.id);

      await updateTargetDB(targetId!, {
        setSeqCategory: newOrderedIds,
      });
    } catch (error) {
      console.error("Error reordering courses:", error);
      toast.error("Fehler beim Aktualisieren der Reihenfolge.");
      categoryStore.getState().replaceCategories(prevCategories, prevOrderedIds);
    }
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
    disabled: !isEditMode || !category.isActive,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: category.isActive ? category.color?.[0] : `${category.color?.[0]}80`,
  };

  const handleToggleActive = async (checked: boolean) => {
    const selectedTargetId = categoryStore.getState().selectedTargetId;
    if (!selectedTargetId) return;

    const prevCategories = structuredClone(categoryStore.getState().categories);
    const prevOrderedIds = [...categoryStore.getState().storedOrderedIds];
    const prevActive = category.isActive;

    toggleCategoryActive(category.id, checked);

    if (category.isNew) return;

    try {
      const newOrderedIds = categoryStore.getState().getOrderedCategoryIds();

      await Promise.all([
        updateCategoryDB({
          id: category.id,
          data: {
            isActive: checked,
          },
        }),
        updateTargetDB(selectedTargetId, {
          setSeqCategory: newOrderedIds,
        }),
      ]);
    } catch (error) {
      toggleCategoryActive(category.id, prevActive);
      categoryStore.getState().replaceCategories(prevCategories, prevOrderedIds);

      toast.error("Status konnte nicht gespeichert werden.");
      console.error("Error updating category active status:", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (category.isNew) {
        deleteCategory(category.id);
        toast.success("Kategorie verworfen.");
      } else {
        await updateCategoryDB({
          id: category.id,
          data: {},
        });
        deleteCategory(category.id);
        toast.success("Kategorie gelöscht.");
      }
    } catch (error) {
      toast.error("Löschen fehlgeschlagen.");
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  useDndMonitor({
    onDragStart(event) {
      if (event.active.id === category.id && isEditable) {
        setIsEditable(false);
      }
    },
  });

  return (
    <>
      <div>
        <div
          ref={setNodeRef}
          style={style}
          className={cn("rounded-xl p-4 bg-gray-300", isDragging && "z-20 opacity-60")}
        >
          <div
            {...(isEditMode && category.isActive ? attributes : {})}
            {...(isEditMode && category.isActive ? listeners : {})}
            className={cn(
              "flex items-center justify-between",
              isEditMode && category.isActive
                ? "cursor-pointer touch-none active:cursor-grabbing"
                : "cursor-pointer",
              !category.isActive && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => {
              if (!isEditable) toggleCategoryExpanded(category.id);
            }}
          >
            <div className="flex items-center">
              {isEditMode && category.isActive && (
                <RxHamburgerMenu
                  className="mr-2 inline-block"
                  style={{ color: category.color[1] }}
                />
              )}
              <h2 className="ml-3 font-semibold" style={{ color: category.color[1] }}>
                {formData.name}
              </h2>
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
            </div>

            <div className="flex items-center gap-6">
              {isEditMode && (
                <>
                  {category.isActive ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsModalOpen((prev) => !prev);
                      }}
                      className="cursor-pointer"
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Kategorie bearbeiten"
                      data-tooltip-place="top"
                    >
                      <FaPenNib className="text-lg" style={{ color: category.color[1] }} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="cursor-pointer text-2xl"
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Kategorie löschen"
                      data-tooltip-place="top"
                    >
                      <MdDelete />
                    </button>
                  )}

                  <Link
                    to="/course"
                    className="cursor-pointer"
                    state={{ category }}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Kurs hinzufügen"
                    data-tooltip-place="top"
                  >
                    <IoMdAddCircleOutline
                      className="text-xl"
                      style={{ color: category.color[1] }}
                    />
                  </Link>

                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <Switch
                      color={category.color[1]}
                      color2={category.color[0]}
                      checked={category.isActive}
                      onCheckedChange={(checked) => {
                        handleToggleActive(checked);
                        setIsEditable(false);
                      }}
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Kategorie aktivieren/deaktivieren"
                      data-tooltip-place="top"
                    />
                  </div>
                </>
              )}

              {isOpened ? (
                <RiArrowUpSLine
                  className="mr-2 text-xl cursor-pointer"
                  style={{ color: category.color[1] }}
                />
              ) : (
                <RiArrowDownSLine
                  className="mr-2 text-xl cursor-pointer"
                  style={{ color: category.color[1] }}
                />
              )}
            </div>
          </div>

          {isOpened && !isEditable && (
            <div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={visibleCourses.map((course) => course.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="py-4 grid md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6 gap-3">
                    {visibleCourses.map((course) =>
                      isEditMode ? (
                        <CourseItem key={course.id} course={course} />
                      ) : (
                        <Link
                          key={course.id}
                          to={`/course/${course.id}`}
                          state={{ category: category }}
                        >
                          <CourseItem course={course} />
                        </Link>
                      ),
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <CategoryItemEdit
          category={category}
          targetId={targetId}
          formData={formData}
          setFormData={setFormData}
          setIsModalOpen={setIsModalOpen}
          setIsEditable={setIsEditable}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title={category.isNew ? "Kategorie verwerfen?" : "Kategorie wirklich löschen?"}
        description={
          category.isNew
            ? "Diese neue Kategorie wird gelöscht."
            : `Die Kategorie "${category.name}" wird gelöscht und kann nicht wiederhergestellt werden.`
        }
        confirmText={category.isNew ? "Verwerfen" : "Löschen"}
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </>
  );
};

export default CategoryItem;
