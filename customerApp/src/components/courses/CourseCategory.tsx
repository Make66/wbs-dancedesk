import { RxHamburgerMenu } from "react-icons/rx";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import CourseItem from "./CourseItem";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { Link } from "react-router";

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

type Category = {
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
  return (
    <div className="p-4 bg-gray-300 rounded-xl" style={{ backgroundColor: category.color }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RxHamburgerMenu className="inline-block mr-2" />
          <h2 className="font-semibold">{category.name}</h2>
        </div>
        <div className="flex gap-5 items-center">
          <MdEdit className="text-xl inline-block cursor-pointer" />
          <IoMdAddCircleOutline className="text-xl inline-block cursor-pointer" />
          <Switch />
          <button onClick={() => setIsOpened(!isOpened)}>
            {isOpened ? (
              <RiArrowUpSLine className="text-xl inline-block cursor-pointer mr-2" />
            ) : (
              <RiArrowDownSLine className="text-xl inline-block cursor-pointer mr-2" />
            )}
          </button>
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
