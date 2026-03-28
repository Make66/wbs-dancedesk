import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useCourseTargetsStore } from "../../stores/useCourseTargetsStore";
import { cn } from "../../lib/utils";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import SidebarMin from "./SidebarMin";
import LocationPicker from "./LocationPicker";
import CourseTargetsLoader from "./CourseTargetsLoader";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const courseTargets = useCourseTargetsStore((state) => state.courseTargets);
  const activeCoursesTargets = courseTargets.filter((course) => course.active);

  return (
    <aside
      className={cn(
        isMenuOpen ? "min-w-64 px-5" : "w-12 px-2",
        "h-screen flex flex-col bg-gray-800 transition-all duration-200 overflow-y-scroll scrollbar",
      )}
    >
      <div className="flex py-4 items-center justify-between">
        {isMenuOpen && <div className="text-gray-300 font-bold">TakeTool</div>}
        <button
          className="p-2 bg-[#284A41] hover:bg-[#1a5d4f] rounded-xl cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <LuArrowLeftToLine className="stroke-gray-300" />
          ) : (
            <LuArrowRightToLine className="stroke-gray-300" />
          )}
        </button>
      </div>
      <LocationPicker />
      <CourseTargetsLoader />
      {!isMenuOpen ? (
        <SidebarMin />
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          <NavLink to="/" className="flex gap-3">
            <MdDashboard className="text-2xl cursor-pointer fill-gray-300" />
            <span className="text-gray-300">Dashboard</span>
          </NavLink>
          <NavLink to="/courses" className="flex gap-3">
            <IoSchool className="text-2xl cursor-pointer fill-gray-300" />
            <span className="text-gray-300">Kurse</span>
          </NavLink>
          <div>
            {activeCoursesTargets.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id}>
                <div className="pl-10 py-2 rounded-xl hover:bg-emerald-950 text-gray-300 cursor-pointer">
                  {course.name}
                </div>
              </Link>
            ))}
          </div>
          <NavLink to="/users" className="flex gap-3">
            <ImUsers className="text-2xl cursor-pointer fill-gray-300" />
            <span className="text-gray-300">Tanzschüler</span>
          </NavLink>
          <NavLink to="/instructors" className="flex gap-3">
            <FaChalkboardTeacher className="text-2xl cursor-pointer fill-gray-300" />
            <span className="text-gray-300">Tanzlehrer</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
