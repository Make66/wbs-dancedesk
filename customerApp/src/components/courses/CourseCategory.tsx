import { RxHamburgerMenu } from "react-icons/rx";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPenNib } from "react-icons/fa";
import CourseItem from "./CourseItem";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { Link } from "react-router";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { useDndMonitor } from "@dnd-kit/core";
import { useCourseCategoriesStore } from "../../stores/useCourseCategoriesStore";

type Course = {
  id: string;
  name: string;
  description: string;
  startsAt: string;
  repeat: number;
  frequency: string;
  seatsCurrent: number;
  seatsMax: number;
  paymentTypes: string[];
  contractTypes: string[];
  price: number;
  imageUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  color?: string;
  courses: Course[];
};

type CourseCategoryProps = {
  category: Category;
};
const CourseCategory = ({ category }: CourseCategoryProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const isEditMode = useCourseCategoriesStore((state) => state.isEditMode);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useDndMonitor({
    onDragStart(event) {
      if (event.active.id === category.id && isOpened) {
        setIsOpened(false);
      }
    },
  });

  return (
    <div
      ref={isEditMode ? setNodeRef : null}
      style={{ ...style, backgroundColor: category.color }}
      {...attributes}
      {...listeners}
      className={cn(
        "p-4 bg-gray-300 rounded-xl cursor-grab active:cursor-grabbing touch-none",
        isDragging && "opacity-60 z-20",
      )}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpened(!isOpened)}
      >
        <div className="flex items-center gap-3">
          <RxHamburgerMenu className="inline-block mr-2" />
          <h2 className="font-semibold">{category.name}</h2>
        </div>
        <div className="flex gap-5 items-center">
          {isEditMode && (
            <>
              <FaPenNib className="text-lg inline-block cursor-pointer" />
              <IoMdAddCircleOutline className="text-xl inline-block cursor-pointer" />
              <Switch />
            </>
          )}
          {isOpened ? (
            <RiArrowUpSLine className="text-xl inline-block cursor-pointer mr-2" />
          ) : (
            <RiArrowDownSLine className="text-xl inline-block cursor-pointer mr-2" />
          )}
        </div>
      </div>
      {isOpened && (
        <div className="py-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          <Link to={`/course/${category.courses[0].id}`}>
            <CourseItem course={category.courses[0]} />
          </Link>
          <Link to={`/course/${category.courses[1].id}`}>
            <CourseItem course={category.courses[1]} />
          </Link>
          <CourseItem course={category.courses[1]} />
          <CourseItem course={category.courses[0]} />
        </div>
      )}
    </div>
  );
};

export default CourseCategory;
