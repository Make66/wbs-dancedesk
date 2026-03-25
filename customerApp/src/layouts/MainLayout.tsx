import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { cn } from "../lib/utils";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { FaRegCircleUser, FaEnvelope } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { useCourseTargetsStore } from "../stores/useCourseTargetsStore";

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const courseTargets = useCourseTargetsStore((state) => state.courseTargets);
  const activeCourses = courseTargets.filter((course) => course.isActive);

  return (
    <div className="h-screen flex mx-auto">
      <aside
        className={cn(
          isMenuOpen ? "w-64 px-5" : "w-12 px-2",
          "h-screen flex flex-col bg-linear-to-r from-[#133830] to-[#185548] transition-all duration-200",
        )}
      >
        <div className="flex py-4 items-center justify-between">
          {isMenuOpen && <div className="text-[#5FFDDE] font-bold">TakeTool</div>}
          <button
            className="p-2 bg-[#284A41] hover:bg-[#1a5d4f] rounded-xl cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <LuArrowLeftToLine className="stroke-[#5FFDDE]" />
            ) : (
              <LuArrowRightToLine className="stroke-[#5FFDDE]" />
            )}
          </button>
        </div>
        {!isMenuOpen ? (
          <div className="flex flex-col items-center gap-6 mt-6">
            <NavLink to="/">
              <MdDashboard className="text-2xl cursor-pointer fill-[#5FFDDE]" />
            </NavLink>
            <NavLink to="/courses">
              <IoSchool className="text-2xl cursor-pointer fill-[#5FFDDE]" />
            </NavLink>
            <NavLink to="/users">
              <ImUsers className="text-2xl cursor-pointer fill-[#5FFDDE]" />
            </NavLink>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-6">
            <NavLink to="/" className="flex gap-3">
              <MdDashboard className="text-2xl cursor-pointer fill-[#5FFDDE]" />
              <span className="text-[#5FFDDE]">Dashboard</span>
            </NavLink>
            <NavLink to="/courses" className="flex gap-3">
              <IoSchool className="text-2xl cursor-pointer fill-[#5FFDDE]" />
              <span className="text-[#5FFDDE]">Courses</span>
            </NavLink>
            <div>
              {activeCourses.map((course) => (
                <div key={course.id}>{course.name}</div>
              ))}
            </div>
            <NavLink to="/users" className="flex gap-3">
              <ImUsers className="text-2xl cursor-pointer fill-[#5FFDDE]" />
              <span className="text-[#5FFDDE]">Users</span>
            </NavLink>
          </div>
        )}
      </aside>
      <div className="flex-1 h-screen w-full">
        <nav className="w-full h-16 border-b border-gray-200 flex items-center justify-end px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-[8px] text-white font-bold bg-red-500 rounded-full">
                1
              </span>
              <FaEnvelope className="text-2xl cursor-pointer fill-gray-700" />
            </div>
            <FaRegCircleUser className="text-2xl cursor-pointer fill-gray-700" />
          </div>
        </nav>
        <div className="flex-1 overflow-y-auto scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
