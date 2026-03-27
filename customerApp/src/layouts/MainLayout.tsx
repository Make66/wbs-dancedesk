import { useState } from "react";
import { Link, Navigate, NavLink, Outlet } from "react-router";
import { cn } from "../lib/utils";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { FaRegCircleUser, FaEnvelope } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { useCourseTargetsStore } from "../stores/useCourseTargetsStore";
import { useAuth } from "../context";

const MainLayout = () => {
  const { signedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const courseTargets = useCourseTargetsStore((state) => state.courseTargets);
  const activeCoursesTargets = courseTargets.filter((course) => course.isActive);

  if (signedIn) {
    return (
      <div className="h-screen flex mx-auto overflow-hidden">
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
          {!isMenuOpen ? (
            <div className="flex flex-col items-center gap-6 mt-6">
              <NavLink to="/">
                <MdDashboard className="text-2xl cursor-pointer fill-gray-300" />
              </NavLink>
              <NavLink to="/courses">
                <IoSchool className="text-2xl cursor-pointer fill-gray-300" />
              </NavLink>
              <NavLink to="/users">
                <ImUsers className="text-2xl cursor-pointer fill-gray-300" />
              </NavLink>
            </div>
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
        <div className="flex-1 h-screen w-full flex flex-col">
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
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar">
            <Outlet />
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default MainLayout;
