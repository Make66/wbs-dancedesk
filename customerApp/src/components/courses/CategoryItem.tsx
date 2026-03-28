import { RxHamburgerMenu } from "react-icons/rx";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPenNib } from "react-icons/fa";
import CourseItem from "./CourseItem";
import { Switch } from "../ui/switch";
import { Link } from "react-router";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { categoryStore } from "../../stores/categoryStore";
import type { Category as CourseCategoryType } from "../../types/course-types";

type CategoryProps = {
  category: CourseCategoryType;
};

const CategoryItem = ({ category }: CategoryProps) => {
  const isEditMode = categoryStore((state) => state.isEditMode);
  const isOpened = categoryStore((state) => state.isCategoryExpanded(category.id));
  const toggleCategoryExpanded = categoryStore((state) => state.toggleCategoryExpanded);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: category.color,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("p-4 bg-gray-300 rounded-xl", isDragging && "opacity-60 z-20")}
    >
      <div
        {...(isEditMode ? attributes : {})}
        {...(isEditMode ? listeners : {})}
        className={cn(
          "flex items-center justify-between",
          isEditMode ? "cursor-pointer active:cursor-grabbing touch-none" : "cursor-pointer",
        )}
        onClick={() => toggleCategoryExpanded(category.id)}
      >
        <div className="flex items-center">
          {isEditMode && <RxHamburgerMenu className="inline-block mr-2" />}
          <h2 className="ml-3 font-semibold">{category.name}</h2>
        </div>

        <div className="flex gap-5 items-center">
          {isEditMode && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="cursor-pointer"
              >
                <FaPenNib className="text-lg inline-block" />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="cursor-pointer"
              >
                <IoMdAddCircleOutline className="text-xl inline-block" />
              </button>

              <div
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <Switch />
              </div>
            </>
          )}

          {isOpened ? (
            <RiArrowUpSLine className="text-xl inline-block mr-2" />
          ) : (
            <RiArrowDownSLine className="text-xl inline-block mr-2" />
          )}
        </div>
      </div>

      {isOpened && (
        <div className="py-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {category.courses.map((course) => (
            <Link key={course.id} to={`/course/${course.id}`}>
              <CourseItem course={course} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
