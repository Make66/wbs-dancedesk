import { useState } from "react";
import { Link } from "react-router";
import { rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useDndMonitor,
  useSensor,
  useSensors,
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

type CategoryItemProps = {
  category: CourseCategoryType & { isNew?: boolean };
  targetId?: string;
};

const CategoryItem = ({ category, targetId }: CategoryItemProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    id: category.id,
    name: category.name ?? "",
    color: category.color?.[0] ?? "#d1d5db",
    fontColor: category.color?.[1] ?? "#000000",
    icon: category.icon ?? "",
  });

  const isEditMode = categoryStore((state) => state.isEditMode);
  const isOpened = categoryStore((state) => state.isCategoryExpanded(category.id));
  const toggleCategoryExpanded = categoryStore((state) => state.toggleCategoryExpanded);

  const toggleCategoryActive = categoryStore((state) => state.toggleCategoryActive);
  const deleteCategory = categoryStore((state) => state.deleteCategory);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
    disabled: !isEditMode || !category.active,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: category.active ? category.color?.[0] : `${category.color?.[0]}80`,
  };

  const handleToggleActive = async (checked: boolean) => {
    const selectedTargetId = categoryStore.getState().selectedTargetId;
    if (!selectedTargetId) return;

    const prevCategories = structuredClone(categoryStore.getState().courseCategories);
    const prevOrderedIds = [...categoryStore.getState().storedOrderedIds];
    const prevActive = category.active;

    toggleCategoryActive(category.id, checked);

    if (category.isNew) return;

    try {
      const newOrderedIds = categoryStore.getState().getOrderedCategoryIds();

      await Promise.all([
        updateCategoryDB(category.id, {
          active: checked,
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
    if (category.isNew) {
      deleteCategory(category.id);
      return;
    }

    try {
      await updateCategoryDB(category.id, { isDeleted: true });
      deleteCategory(category.id);
      toast.success("Kategorie gelöscht.");
    } catch (error) {
      toast.error("Löschen fehlgeschlagen.");
      console.error("Error deleting category:", error);
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
    <div>
      <div
        ref={setNodeRef}
        style={style}
        className={cn("rounded-xl p-4 bg-gray-300", isDragging && "z-20 opacity-60")}
      >
        <div
          {...(isEditMode && category.active ? attributes : {})}
          {...(isEditMode && category.active ? listeners : {})}
          className={cn(
            "flex items-center justify-between",
            isEditMode && category.active
              ? "cursor-pointer touch-none active:cursor-grabbing"
              : "cursor-pointer",
            !category.active && "opacity-50 cursor-not-allowed",
          )}
          onClick={() => {
            if (!isEditable) toggleCategoryExpanded(category.id);
          }}
        >
          <div className="flex items-center">
            {isEditMode && category.active && (
              <RxHamburgerMenu className="mr-2 inline-block" style={{ color: category.color[1] }} />
            )}
            <h2 className="ml-3 font-semibold" style={{ color: category.color[1] }}>
              {formData.name}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {isEditMode && (
              <>
                {category.active ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsEditable((prev) => !prev);
                    }}
                    className="cursor-pointer"
                  >
                    <FaPenNib className="text-lg" style={{ color: category.color[1] }} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete();
                    }}
                    className="cursor-pointer text-2xl"
                  >
                    <MdDelete />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsEditable(false);
                  }}
                  className="cursor-pointer"
                >
                  <IoMdAddCircleOutline className="text-xl" style={{ color: category.color[1] }} />
                </button>

                <div
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <Switch
                    color={category.color[1]}
                    color2={category.color[0]}
                    checked={category.active}
                    onCheckedChange={(checked) => {
                      handleToggleActive(checked);
                      setIsEditable(false);
                    }}
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
            <DndContext sensors={sensors} collisionDetection={closestCenter}>
              <SortableContext
                items={category.courses.map((course) => course.id)}
                strategy={rectSortingStrategy}
              >
                <div className="py-4 grid md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6 gap-3">
                  {category.courses.map((course) =>
                    isEditMode ? (
                      <CourseItem key={course.id} course={course} />
                    ) : (
                      <Link key={course.id} to={`/course/${course.id}`}>
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
      {isEditable && (
        <div className="grid grid-cols-1 pt-4 px-8">
          <CategoryItemEdit
            category={category}
            targetId={targetId}
            formData={formData}
            setFormData={setFormData}
            setIsEditable={setIsEditable}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
