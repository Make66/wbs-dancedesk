import { Link, NavLink } from "react-router";
import { targetStore } from "../../stores/targetStore";
import { cn } from "../../lib/utils";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import SidebarMin from "./SidebarMin";
import LocationPicker from "./LocationPicker";
import CourseTargetsLoader from "./DataLoader";
import { userStore } from "../../stores/userStore";

const Sidebar = () => {
  const isSidebarOpen = userStore((state) => state.isSidebarOpen);
  const courseTargets = targetStore((state) => state.courseTargets);
  const activeTargets = courseTargets.filter((course) => course.active);

  return (
    <aside
      className={cn(
        isSidebarOpen ? "min-w-64 px-5" : "w-12 px-2",
        "h-screen flex flex-col bg-gray-800 transition-all duration-200 overflow-y-scroll scrollbar",
      )}
    >
      <div className="flex py-4 items-center justify-between mb-6">
        {isSidebarOpen && <div className="text-gray-300 font-bold text-2xl pt-1">DanceDesk</div>}
        <button
          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-xl cursor-pointer"
          onClick={() => userStore.setState({ isSidebarOpen: !isSidebarOpen })}
        >
          {isSidebarOpen ? (
            <LuArrowLeftToLine className="stroke-gray-300" />
          ) : (
            <LuArrowRightToLine className="stroke-gray-300" />
          )}
        </button>
      </div>
      {isSidebarOpen && <LocationPicker />}
      <CourseTargetsLoader />
      {!isSidebarOpen ? (
        <SidebarMin />
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          <NavLink
            to="/"
            className="flex gap-3 hover:bg-black hover:text-white rounded-xl py-3 px-2"
          >
            <MdDashboard className="text-2xl cursor-pointer fill-gray-300" />
            <span className="text-gray-300">Dashboard</span>
          </NavLink>
          <div className="border-b border-gray-500" />
          <div>
            <NavLink
              to="/courses"
              className="flex gap-3 hover:bg-black hover:text-white rounded-xl py-3 px-2 mb-3"
            >
              <IoSchool className="text-2xl cursor-pointer fill-gray-300" />
              <span className="text-gray-300">Kurse</span>
            </NavLink>
            <div>
              {activeTargets.map((target) => (
                <Link to={`/courses/${target.id}`} key={target.id}>
                  <div
                    style={
                      {
                        "--hover-color-back": target.color[0],
                        "--hover-color-text": target.color[1],
                      } as React.CSSProperties
                    }
                    className={`pl-10 py-2 rounded-xl text-gray-300 hover:bg-[var(--hover-color-back)] hover:text-[var(--hover-color-text)] cursor-pointer`}
                  >
                    {target.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="border-b border-gray-500" />
          <NavLink
            to="/users"
            className="flex gap-3 hover:bg-black hover:text-white rounded-xl py-3 px-2"
          >
            <ImUsers className="text-2xl cursor-pointer fill-gray-300" />
            <span className="text-gray-300">Teilnehmer</span>
          </NavLink>
          <div className="border-b border-gray-500" />
          <NavLink
            to="/instructors"
            className="flex gap-3 hover:bg-black hover:text-white rounded-xl py-3 px-2"
          >
            <FaChalkboardTeacher className="text-2xl cursor-pointer fill-gray-300" />
            <span className="text-gray-300">Instruktoren</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
